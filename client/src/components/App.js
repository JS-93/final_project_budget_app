import React, { useEffect } from 'react';
import Budgets from './Budgets';
import { useSelector } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import BeginningPage from './BeginningPage';
import { useDispatch } from 'react-redux'
import { setUser } from '../actions/useractions';
import PieCharts from './PieCharts';
import Logout from './Logout';
import AddIncome from './Income';
import UpdateBudgets from './UpdateBudgets';
import Transaction from './Transaction';
import CategoryDetails from './CatDetails';
import Compare from './Compare';
import Export from './Export';
import FinancialSum from './FinancialSum';


const App = () => {
  const currentUser = useSelector(state => state.user.currentUser);
  const dispatch = useDispatch()

  useEffect(() => {
    fetch('/check_session')
    .then(resp => {
      if (!resp.ok) {
        throw new Error(`HTTP error! Status ${resp.status}`)
      }
      return resp.json()
    })
    .then(data => {
      console.log(data)
      if(data) {
        
        dispatch(setUser(data))
      }
    })
    .catch(e => {
      console.error(e)
    })
  }, [dispatch])

  const isBudgetExpired = (budgets) => {
   if (!budgets || budgets.length === 0) {
    return false;
   }
    const latestBudgetEndDate = new Date(budgets[budgets.length - 1].end_date)

    const today = new Date();
    today.setHours(0,0,0,0) 
    return latestBudgetEndDate < today
  }

  const budgetExpired = currentUser && currentUser.budgets && isBudgetExpired(currentUser.budgets);
 
  return (
    <Switch>
      
      <Route exact path="/">
        {!currentUser ? <BeginningPage /> :
          budgetExpired ? <Redirect to="/export" /> :
          (currentUser.budgets && currentUser.budgets.length === 7) ? <Redirect to="/piecharts" /> :
          <Redirect to="/budgets" />
        }
      </Route>
      <Route exact path="/logout" component={Logout} />
      <Route exact path="/budgets">
        {currentUser && !budgetExpired ? <Budgets currentUser={currentUser} /> : <Redirect to="/export" />}
      </Route>
      <Route exact path="/piecharts">
        {currentUser && !budgetExpired ? <PieCharts currentUser={currentUser} /> : <Redirect to="/export" />}
      </Route>
      <Route exact path="/addincome">
        {currentUser && !budgetExpired ? <AddIncome currentUser={currentUser} /> : <Redirect to="/export" />}
      </Route>
      <Route exact path="/update">
        {currentUser && !budgetExpired ? <UpdateBudgets currentUser={currentUser} /> : <Redirect to="/export" />}
      </Route>
      <Route exact path="/addtransactions" component={Transaction}>
        {currentUser && !budgetExpired ? <Transaction currentUser={currentUser} /> : <Redirect to="/export" />}
      </Route>
      <Route path="/category/:categoryName">
        {currentUser && !budgetExpired ? <CategoryDetails currentUser={currentUser} /> : <Redirect to="/export" />}
      </Route>
      <Route path='/comparesavings'>
        {currentUser && !budgetExpired ? <Compare currentUser={currentUser} /> : <Redirect to="/export" />}
      </Route>
      <Route path='/export'>
        {currentUser && budgetExpired ? <Export currentUser={currentUser} /> : <Redirect to='/' />}
      </Route>
      <Route path='/finance'>
        {currentUser && budgetExpired ? <FinancialSum currentUser={currentUser} /> : <Redirect to='/' />}
      </Route>
    </Switch>
  );
}

export default App;
