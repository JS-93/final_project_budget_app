import React, { useEffect } from 'react';
import Budgets from './Budgets';
import { useSelector } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import BeginningPage from './BeginningPage';
import { useDispatch } from 'react-redux'
import { setUser } from '../actions/useractions'
import PieCharts from './PieCharts';

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
      if(data) {
        
        dispatch(setUser(data))
      }
    })
    .catch(e => {
      console.error(e)
    })
  }, [])

  
 
  return (
    <Switch>
    <Route exact path="/">
      {!currentUser ? <BeginningPage/>:
        (currentUser.income && currentUser.income.length > 0) ? 
        <Redirect to="/piecharts" /> : <Redirect to="/budgets" />}
    </Route>
    <Route path="/budgets">
      {currentUser ? <Budgets currentUser={currentUser} /> : <Redirect to="/" />}
    </Route>
    <Route path="/piecharts">
      {currentUser ? <PieCharts currentUser={currentUser} /> : <Redirect to="/" />}
    </Route>
  </Switch>
  )
}

export default App;
