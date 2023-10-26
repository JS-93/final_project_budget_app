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

    transaction1 = Transaction(amount=1500.0, date=datetime.datetime.now(), user=user1, category=category1, type="Recurring", description="Rent payment")
    transaction3 = Transaction(amount=100.0, date=datetime.datetime.now(), user=user1, category=category1, type="One-Time", description="Grocery shopping")
    transaction4 = Transaction(amount=80.0, date=datetime.datetime.now(), user=user1, category=category4, type="One-Time", description="Movie night")
    transaction2 = Transaction(amount=60.0, date=datetime.datetime.now(), user=user2, category=category1, type="One-Time", description="Groceries")
    transaction5 = Transaction(amount=180.0, date=datetime.datetime.now(), user=user2, category=category1, type="Recurring", description="Electricity bill")

   
    income1 = Income(amount=3000.0, description="Monthly Salary", date=datetime.datetime.now(), user=user1)
    income2 = Income(amount=2000.0, description="Freelance Work", date=datetime.datetime.now(), user=user2)
    income3 = Income(amount=1500.0, description='Monthly Salary"', date=datetime.datetime.now(), user=user3)

    
    budget1 = Budget(amount=2000.0, start_date=datetime.datetime.now(), end_date=datetime.datetime.now() + datetime.timedelta(days=30), user=user1, category=category1)
    budget2 = Budget(amount=300.0, start_date=datetime.datetime.now(), end_date=datetime.datetime.now() + datetime.timedelta(days=30), user=user2, category=category2)
    budget3 = Budget(amount=600.0, start_date=datetime.datetime.now(), end_date=datetime.datetime.now() + datetime.timedelta(days=30), user=user1, category=category4)
    budget4 = Budget(amount=200.0, start_date=datetime.datetime.now(), end_date=datetime.datetime.now() + datetime.timedelta(days=30), user=user1, category=category3)
    budget5 = Budget(amount=50.0, start_date=datetime.datetime.now(), end_date=datetime.datetime.now() + datetime.timedelta(days=30), user=user1, category=category6)
    budget6 = Budget(amount=500.0, start_date=datetime.datetime.now(), end_date=datetime.datetime.now() + datetime.timedelta(days=30), user=user3, category=category1)
    budget7 = Budget(amount=100.0, start_date=datetime.datetime.now(), end_date=datetime.datetime.now() + datetime.timedelta(days=30), user=user3, category=category2)

    
    db.session.add_all([user1, user2, user3])
    db.session.add_all([category1, category2, category3, category4, category5, category6, category7])
    db.session.add_all([transaction1, transaction2, transaction3, transaction4, transaction5])
    db.session.add_all([income1, income2, income3])
    db.session.add_all([budget1, budget2, budget3, budget4, budget5, budget6, budget7])
    db.session.commit()


if __name__ == '__main__':
    
    with app.app_context():
        print("Starting seed...")
        seed_database()
        # Seed code goes here!
