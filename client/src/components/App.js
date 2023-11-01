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

  
 
  return (
    <Switch>
      <Route exact path="/">
        {!currentUser ? <BeginningPage/>:
          (currentUser.budgets && currentUser.budgets.length === 7) ? 
          <Redirect to="/piecharts" /> : <Redirect to="/budgets" />}
      </Route>
      <Route exact path="/logout" component={Logout} />
      <Route exact path="/budgets">
        {currentUser ? <Budgets currentUser={currentUser} /> : <Redirect to="/" />}
      </Route>
      <Route exact path="/piecharts">
        {currentUser ? <PieCharts currentUser={currentUser} /> : <Redirect to="/" />}
      </Route>
      <Route exact path="/addincome">
        {currentUser ? <AddIncome currentUser={currentUser} /> : <Redirect to="/" />}
      </Route>
      <Route exact path="/update">
        {currentUser ? <UpdateBudgets currentUser={currentUser}/> : <Redirect to="/" />}
      </Route>
      <Route exact path="/addtransactions" component={Transaction}>
        {currentUser ? <Transaction currentUser={currentUser}/> : <Redirect to="/" />}
      </Route>
      <Route path="/category/:categoryName">
        {currentUser ? <CategoryDetails currentUser={currentUser}/> : <Redirect to="/" />}
      </Route>
      <Route path='/comparesavings'>
        {currentUser ? <Compare currentUser={currentUser}/> : <Redirect to='/'/>}
      </Route>
    </Switch>
  );
}

export default App;
