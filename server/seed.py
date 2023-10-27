#!/usr/bin/env python3

# Standard library imports


# Remote library imports


# Local imports
from app import app, db
from models import User, Category, Transaction, Income, Budget
import datetime
def seed_database():
   
    User.query.delete()
    Category.query.delete()
    Transaction.query.delete()
    Income.query.delete()
    Budget.query.delete()

  
    user1 = User(username="Alice", email='alice@gmail.com')
    user2 = User(username="Bob", email='bob@gmail.com')
    user3 = User(username="Charlie", email='charlie@gmail.com')
    user1.password='password123'
    user2.password='password456'
    user3.password='password789'
   
    category1 = Category(name="Rent/Mortgage")
    category2 = Category(name="Groceries")
    category3 = Category(name="Utilities")
    category4 = Category(name="Entertainment")
    category5 = Category(name="Transportation/Car")
    category6 = Category(name="Insurance")
    category7 = Category(name="Other")

    transaction1 = Transaction(amount=300.0, date=datetime.datetime.now(), user=user1, category=category1, description="Rent payment")
    transaction3 = Transaction(amount=100.0, date=datetime.datetime.now(), user=user1, category=category2, description="Grocery shopping")
    transaction4 = Transaction(amount=80.0, date=datetime.datetime.now(), user=user1, category=category4, description="Movie night")
    transaction2 = Transaction(amount=60.0, date=datetime.datetime.now(), user=user2, category=category1, description="Groceries")
    transaction5 = Transaction(amount=180.0, date=datetime.datetime.now(), user=user2, category=category1, description="Electricity bill")

   
    income1 = Income(amount=4000.0, description="Monthly Salary", date=datetime.datetime.now(), user=user1)
    income2 = Income(amount=4000.0, description="Freelance Work", date=datetime.datetime.now(), user=user2)
    income3 = Income(amount=4000.0, description='Monthly Salary"', date=datetime.datetime.now(), user=user3)

    
    budgets_for_user1 = [
        Budget(amount=400.0, start_date=datetime.datetime.now(), end_date=datetime.datetime.now() + datetime.timedelta(days=30), user=user1, category=category) 
        for category in [category1, category2, category3, category4, category5, category6, category7]
    ]

    budgets_for_user2 = [
        Budget(amount=400.0, start_date=datetime.datetime.now(), end_date=datetime.datetime.now() + datetime.timedelta(days=30), user=user2, category=category) 
        for category in [category1, category2, category3, category4, category5, category6, category7]
    ]

    budgets_for_user3 = [
        Budget(amount=400.0, start_date=datetime.datetime.now(), end_date=datetime.datetime.now() + datetime.timedelta(days=30), user=user3, category=category) 
        for category in [category1, category2, category3, category4, category5, category6, category7]
]
    db.session.add_all([user1, user2, user3])
    db.session.add_all([category1, category2, category3, category4, category5, category6, category7])
    db.session.add_all([transaction1, transaction2, transaction3, transaction4, transaction5])
    db.session.add_all([income1, income2, income3])
    db.session.add_all(budgets_for_user1)
    db.session.add_all(budgets_for_user2)
    db.session.add_all(budgets_for_user3)
    db.session.commit()


if __name__ == '__main__':
    
    with app.app_context():
        print("Starting seed...")
        seed_database()
        # Seed code goes here!
