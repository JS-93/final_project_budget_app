#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session
from flask_restful import Resource
from datetime import datetime
from sqlalchemy.exc import IntegrityError

from config import app, db, api
from models import *

# Signup route for user
class Signup(Resource):
    def post(self):
        data = request.get_json()

        email = data.get('email')
        username = data.get('username')
        password = data.get('password')

        existing_user = User.query.filter(User.username==username).first()
        if existing_user:
            return {'error': 'Username already taken.'}, 400
        existing_email = User.query.filter(User.email==email).first()
        if existing_email:
            return {'error': 'Email already in use.'}, 400
        
        user = User(username=username)
        user.email = email
        user.password = password
        
        db.session.add(user)
        db.session.commit()
            
        return {'message': 'User created successfully.'}, 201
        
# Login route for user
class Login(Resource):
    def post(self):
        data = request.get_json()

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return {'message': 'Username or password missing.'}, 400
        
        user = User.query.filter(User.username == username).first()

        if not user.username or not user.authenticate(password):
            return {'message': 'Invalid username or password.'}, 401
        
        session['user_id'] = user.id
        user_data = user.to_dict(only=('id', 'username'))
        user_data['transactions'] = [t.to_dict(only=('id', 'description', 'amount', 'date')) for t in user.transactions]
        user_data['budgets'] = [b.to_dict(only=('id', 'amount', 'start_date', 'end_date')) for b in user.budgets]
        user_data['income'] = [i.to_dict(only=('amount', 'description', 'date')) for i in user.incomes]
        return {'message': 'Logged in successfully.', 'user': user_data}, 200
# clears session to logout user
class Logout(Resource):
    def get(self):
        session.clear()
        return {'message': 'Logged out successfully!'}, 200
# checks session to keep user logged in
class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return {}, 401
        user = User.query.filter(User.id == user_id).first()
        if not user:
            return {'message': 'User not found'}, 404
        user_data = user.to_dict(only=('id', 'username'))
        user_data['transactions'] = [t.to_dict(only=('id', 'description', 'amount', 'date')) for t in user.transactions]
        user_data['budgets'] = [b.to_dict(only=('id', 'amount', 'start_date', 'end_date')) for b in user.budgets]
        user_data['income'] = [i.to_dict(only=('amount', 'description', 'date')) for i in user.incomes]

        return user_data, 200

# user get request to retrieve all budgets, income, and transactions for user
class UserById(Resource):
    def get(self, id):
        user = User.query.get(id)
        if not user:
            return {'message': 'User not found.'}, 401
        user_data = user.to_dict(only=('id', 'username'))
        user_data['transactions'] = [t.to_dict(only=('id', 'description', 'amount', 'date')) for t in user.transactions]
        user_data['budgets'] = [b.to_dict(only=('id', 'amount', 'start_date', 'end_date')) for b in user.budgets]
        user_data['income'] = [i.to_dict(only=('amount', 'description', 'date')) for i in user.incomes]

        return user_data, 200

class CategoryById(Resource):
    def get(self, id):
        category = Category.query.get(id)
        if not category:
            return {'message': 'Category not found.'}, 404

        category_data = category.to_dict(only=('id', 'name'))
        category_data['transactions'] = [t.to_dict(only=('id', 'description', 'amount', 'date')) for t in category.transactions]
        category_data['budgets'] = [b.to_dict(only=('id', 'amount', 'start_date', 'end_date')) for b in category.budgets]
        return category_data, 200
# route to create new income for user
class IncomeResource(Resource):
    def post(self):
        data = request.get_json()
        try:
            new_income = Income(
                amount = data['amount'],
                description = data['description'],
                user_id = data['user_id'],
            )
            db.session.add(new_income)
            db.session.commit()
            return new_income.to_dict(only=('amount', 'description', 'date'))
        except ValueError:
            return {'errors': ['validation errors']}, 400
# route to get all category names/id's
class GetCategories(Resource):
    def get(self):
        categories = [cat.to_dict(only=('id', 'name')) for cat in Category.query.all()]
        return categories, 200
# route to create a new budget
class GetBudgets(Resource):
    def post(self):
        data = request.get_json()
        try:
            new_budget = Budget(
                amount = data['amount'],
                user_id = data['user_id'],
                category_id = data['category_id'],
            )
            category = db.session.query(Category).filter_by(id=data['category_id']).first()
            if not category:
                return {'message': 'category not found.'}, 401
            category_name = category.name
            
            
            db.session.add(new_budget)
            db.session.commit()
            return new_budget.to_dict(only=('amount', 'start_date', 'end_date', 'category_id')), 201
        except ValueError:
            return {'errors': ['validation errors']}, 400
        
api.add_resource(GetBudgets, '/budgets')
api.add_resource(GetCategories, '/categories')
api.add_resource(IncomeResource, '/income')
api.add_resource(Signup, '/signup')
api.add_resource(CheckSession, '/check_session')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')    
api.add_resource(UserById, '/users/<int:id>')
api.add_resource(CategoryById, '/categories/<int:id>')
if __name__ == '__main__':
    app.run(port=5555, debug=True)

