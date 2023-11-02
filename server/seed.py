from app import app, db
from models import User, Category, Transaction, Income, Budget
from faker import Faker
import random
from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler

fake = Faker()

def create_transactions_for_user(user, categories, num_transactions=5):
    transactions = []
    for category in categories:
        for _ in range(num_transactions):
            description = fake.sentence(nb_words=4)
            transaction_date = datetime.now() + timedelta(days=random.randrange(30))
            amount = round(random.uniform(10.0, 200.0), 1)
            transactions.append(Transaction(
                user=user,
                category=category,
                description=description,
                amount=amount,
                date=transaction_date
            ))
    return transactions

def create_past_transactions(user, categories, num_transactions=5):
    transactions = []
    for category in categories:
        for _ in range(num_transactions):
            description = fake.sentence(nb_words=3)
            transaction_date = datetime(2023, 10, 2)
            amount = round(random.uniform(10.0, 200.0), 1)
            transactions.append(Transaction(
                user=user,
                category=category,
                description=description,
                amount=amount,
                date=transaction_date
            ))
    return transactions

def seed_database():
    db.drop_all()
    db.create_all()
  
    user1 = User(username="Alice", email='alice@gmail.com')
    user2 = User(username="Bob", email='bob@gmail.com')
    user3 = User(username="Charlie", email='charlie@gmail.com')
    user4 = User(username='test', email='test@gmail.com')

    user1.password='password123'
    user2.password='password456'
    user3.password='password789'
    user4.password='123'

    category1 = Category(name="Rent or Mortgage")
    category2 = Category(name="Groceries")
    category3 = Category(name="Utilities")
    category4 = Category(name="Entertainment")
    category5 = Category(name="Transportation")
    category6 = Category(name="Insurance")
    category7 = Category(name="Other")

    categories = [category1, category2, category3, category4, category5, category6, category7]
    db.session.add_all(categories)

    
    user1.categories.extend(categories)
    user2.categories.extend(categories)
    user3.categories.extend(categories)
    user4.categories.extend(categories)

   
    transactions_user1 = create_transactions_for_user(user1, categories)
    transactions_user2 = create_transactions_for_user(user2, categories)
    transactions_user3 = create_transactions_for_user(user3, categories)
    transactions_user4 = create_past_transactions(user4, categories)

    db.session.add_all(transactions_user1)
    db.session.add_all(transactions_user2)
    db.session.add_all(transactions_user3)
    db.session.add_all(transactions_user4)

   
    income1 = Income(amount=4000.0, description="Monthly Salary", user=user1)
    income2 = Income(amount=4000.0, description="Freelance Work", user=user2)
    income3 = Income(amount=4000.0, description="Monthly Salary", user=user3)
    income4 = Income(amount=4000.0, description="Work", user=user4, date=datetime(2023, 10, 1))
    db.session.add_all([income1, income2, income3, income4])

    for category in categories:
        past_budget = Budget(amount=400.0, user=user4, category=category, start_date=datetime(2023, 10, 1), end_date=datetime(2023, 10, 31))
        db.session.add(past_budget)


    for user in [user1, user2, user3]:
        for category in categories:
            budget = Budget(amount=400.0, user=user, category=category)
            db.session.add(budget)

    db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        print("Seeding the database...")
        seed_database()

