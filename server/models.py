from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
import re

from config import db, bcrypt
from datetime import datetime, timedelta





class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String, unique = True, nullable = False)
    email = db.Column(db.String, unique = True, nullable = False)
    _password_hash = db.Column(db.String)
    transactions = db.relationship('Transaction', backref='user', lazy=True)
    incomes = db.relationship('Income', backref='user', lazy=True)
    budgets = db.relationship('Budget', backref='user', lazy=True)
    

    @hybrid_property
    def password(self):
        raise AttributeError('Cannot view password hashes.')

    @password.setter
    def password(self, password):
        self._password_hash = bcrypt.generate_password_hash(password.encode('utf-8')).decode('utf-8')

    def authenticate(self, password):
        if not password:
            return False
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))
    
    @validates('email')
    def validate_email(self, key, email):
        if not re.match('[^@]+@[^@]+\.[^@]+', email):
            raise AssertionError('Provided email is not an email address.')
        return email

class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, unique = True)
    # transactions = db.relationship('Transaction', backref='category', lazy=True)
    # budgets = db.relationship('Budget', backref='category', lazy=True)
    

class Transaction(db.Model, SerializerMixin):
    __tablename__ = 'transactions'

    id = db.Column(db.Integer, primary_key = True)
    description = db.Column(db.String())
    amount = db.Column(db.Float)
    date = db.Column(db.DateTime, default=datetime.utcnow())
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    category = db.relationship('Category', backref='transactions_backref')


class Income(db.Model, SerializerMixin):
    __tablename__ = 'incomes'

    id = db.Column(db.Integer, primary_key = True)
    amount = db.Column(db.Float)
    description = db.Column(db.String)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))


    def __repr__(self):
        return f'<Income {self.amount}, {self.description}, {self.date}>'
    
class Budget(db.Model, SerializerMixin):
    __tablename__ =  'budgets'

    id = db.Column(db.Integer, primary_key = True)
    amount = db.Column(db.Float)
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime, default=lambda: datetime.utcnow() + timedelta(days=30))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    category = db.relationship('Category', backref='budgets_backref')


    def __repr__(self):
        return f'<Budget {self.amount}, {self.start_date}, {self.end_date}>'


