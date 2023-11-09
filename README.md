# Budge-It App

## Summary

Budge-it is a budget application clone used to track spending within different budget time frames. The application uses flask-sqlalchemy in the backend and react in the frontend. Redux and recharts were used on the frontend for state management and data visualization. After signing up, a user is able to add beginning income and add budgets for 7 predetermined categories. After adding the budgets, a user is able to add transactions to each budget depending on where they believe a transaction would best fit. The 7 categories are all encompassing categories used to reflect what an average adult would spend their money on in their day to day. Each income post request will post on the current day and each budget post request will post on the current day and extend to 30 days from that day. Transactions are similar to income post requests as they will post on the current day. Since each of the 7 budgets have a time frame, it's assumed that all budgets were made on the same day, (a user can update the budgets at any time as long as they are below the total income). If budgets were made on different days, depending if the user created a few budgets and then logged out and logged back in to create the rest a couple days later, the timeframe will only reflect the first budget's beginning and end date. Oncee the first budget's end date has arrived, conditional routing logic will bring a user to a financial summary page on login to offer a printed out version of all transactions posted for each budget. A user then will be brought back to the route that creates and saves income and beginning budgets for the predetermined categories to begin a new financial period.

## Frontend Files/Routes 
### Login and Signup
A user begins on the login page that can either make a post request to the signup route to the backend which will create a new user instance or login route to create a new session. A setUser action will set the state of the logged-in user globally so they can move through the application. If a user forgets to log out, which deletes the session and sets the redux state of the user to null, then a useEffect hook within App.js will automatically fetch to a check_session route and reset the user in the setUser action in redux. Considering the routing logic in App.js, a user will either be brought to the Dashboard page, (PieCharts.js, SoloPieChart.js) if they have made all 7 budgets and posted income or the create budgets route (Budgets.js, CatBudgets.js, CatBudgetInput.js) if they have not finished creating the budgets.

### On First Login
As indicated previously, a user must post 7 budgets that are labeled by the 7 categories. A user will continually be redirected to the budgets route until this is finished. A pie chart in the budgets route shows how much each budget's amount takes up their income. Once the income is first posted, the 'income div' will disappear. Each of the budget input 'divs' disappear upon creation. If a user were to create income and an 'Entertainment' budget and then logout, on login they will be left with the 6 budgets to be finished until being able to arrive at the dashboard. Various looping functions and conditional rendering were used to display which 'divs' were left for a user to fill out. If a user decided or accidentally made a single budget equal to the income, then they would have to set the remaining budgets to 0 and update them when they arrive at the dashboard.

### Dashboard
The Dashboard was made in the (PieCharts.js, SoloPieChart.js) files and has the navigation component at the top. It shows when all the budgets will expire and a scoreboard with a savings rate, savings amount, total transactions, and total income. The savings rate is simply [(total income - total transactions) / (total income)] * 100%. Each of the categories of budgets are displayed with pie charts showing how much of the budget takes up the income and how much the transactions for the budget takes up. Depending on if you're over, within 5% of equaling the budget, or not close from reaching a budget, a message will display on top of the pie charts. Clicking more info will bring you to a dynamic route of each budget showing all the transactions that you can organize by date or amount.

## Navigation Bar
### Add Income
The add income route, (Income.js, IncomeList.js) next to the dashboard link in the navigation bar will bring the user to a page where they can add income and a description of it. Above the input to do so is a bar graph showing the amount of transactions for each budget, the total transactions, and the total income. Once a user adds income, they are able to see it displayed with the date they posted it in a table near the bottom.

### Compare Savings
The compare savings, (Compare.js) route next to add income will show all the savings rates of the users while keeping the names anonymous. A user is able to use this route to visualize where other users might be within their financial budget journey. A message at the bottom of the page will either explain to the user that they have the best savings rate, that their savings rate is better than X% of other users, or that they should head back to the dashboard page to see where they may improve.

### Update Budgets
Update budgets, (UpdateBudgets.js) was a route created so the user could have more control over how much they wanted to spend on certain things depending on if their income has changed or their ideas of how much should be spent on a certain category of their life should change. The pie chart that shows how much each budget takes up their income is shown on the right of the update budgets' inputs.

### See Transactions
The see transactions route, (Transaction.js) is the last route and is used to create, see, update, or delete any particular transaction. The use of crud on this model was decided since a mistake on a transaction could be the most likely with returns. 

## On Budget Expiration
Routing logic on App.js will check if a user's first budget end_date has expired. Upon expiration, the user will be redirected to Export.js and FinancialSum.js on login. The user will get a chance to review the budget information and can print out the page for their records. After saving the information, the user is invited to head back to the budgets page to begin a new budget period. Clicking "Move Forward" will delete all their previous information on redux and redirect them to the beginning budget page.

## Error Handling Frontend
Yup, formik, and messages in state were used to handle any potential errors that arose from an unsuccessful request to the backend. Users are updated on any particular request below each input bar. If a request is successful, a message is rendered for a successful request 

## Redux
Since redux was utilized to manage the global state of the user, it was important to not directly modify any attributes of the user directly. Reducers are used to work around this. While the setUser and logoutUser reducers were used to get the current user in and out of the application, updateCurrentUser was used to change anything about the user instance that included the budgets, transactions, and income. Proper handling in the post, delete, and patch requests upon successful responses required that the updating of any user attributes were not changed directly so the application will run predictably.

## Backend

### Models.py
The models for the data included:
* user
* cateogry
* budget
* income
* transaction

The many-many association table is there to show the relationship between categories and users. Each category belongs to many users and vice vrsa through the transactions and budgets created by the user instance. Password hashing and validators were also used to secure user information and make sure amounts were greater than or equal to 0 for any post request that required a number.

### Seed.py
The seed file was important for checking any edge cases concerning date and walking different users through the application depending on how far along they were within their budget period. The random, faker, and datetime library were also used in this file as to specify certain time deltas added, create fake descriptions, and include random amounts for transactions.

### App.py

The App file was where all the backend routes were created using RESTful conventions. Upon returning user, transaction, budget, income, and categories in various try/except blocks, to.dict(only='') was used often as to avoid recursion errors. Unique messages were also returned in various errors to properly communicate with the frontend on fetch requests.

### Config.py

A basic configuration file that incorporates Bcrypt for password hashing, Flask-Migrate for database migrations, Flask-RESTful for API use, SQLite to create the database, and CORS for backend security and frontend integration with React.

## Design

The overall design was created using Chakra and CSS. Static CSS was primarily used to have more control over div placement for a more appealing user experience.

### On Personal Use

After forking and cloning this repository, run pipenv install && pipenv shell for the backend in the parent directory. To run the frontend, run npm install --prefix client for the frontend. All the .py files are in the server folder and all the .js files are in the client folder. 

* cd into the server folder in one terminal and make sure the database is opened.
* run python seed.py to seed the database and python app.py to run the backend server.
* from another terminal cd into the client folder and run npm start to begin the app.

Let me know if you have any questions! -Joe

