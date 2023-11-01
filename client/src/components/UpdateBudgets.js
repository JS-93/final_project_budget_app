import React, { useState } from "react";
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { updateCurrentUser } from "../actions/useractions";


const UpdateBudgets = ( {currentUser} ) => {
    const dispatch = useDispatch()
    const [budgetAmounts, setBudgetAmounts] = useState({})
    const [message, setMessage] = useState({})


 

    const handleInputChange = (budgetId, event) => {
        setBudgetAmounts(prevAmounts => ({
            ...prevAmounts,
            [budgetId]: parseFloat(event.target.value)
        }))
    }

    

    const handleUpdateClick = (budgetId) => {
        if (budgetAmounts[budgetId] !== undefined) {
            fetch(`/budgets/${budgetId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: budgetAmounts[budgetId],
                    user_id: currentUser.id
                })
            })
            .then(resp => {
              if (!resp.ok) {
                return resp.json().then(data => {
                  throw new Error(data.message || 'An error occurred while updating the budget.')
                });
              }
              return resp.json()
            })
            .then(data => {
                if (data) {
                    
                    setMessage((prevMessages) => ({
                      ...prevMessages,
                      [budgetId]: `Updated budget to $${data.amount}!` 
                    }));
                     
                     
                        const budgetIndex = currentUser.budgets.findIndex(budget => budget.id === budgetId);

                        
                        const updatedBudgets = [...currentUser.budgets];
                        updatedBudgets[budgetIndex] = {...currentUser.budgets[budgetIndex], ...data}

                        
                        const updatedUser = {...currentUser, budgets: updatedBudgets};

                       
                        dispatch(updateCurrentUser(updatedUser));

                   
                }
            })
            .catch(e => {
              if (e) {
                setMessage((prevMessages) => ({
                  ...prevMessages,
                  [budgetId]: e.message
                }));

              }
            })
        }
    }


    const totalIncome = (currentUser) => {
      return currentUser.income.reduce((total, currentIncome) => {
          return total + currentIncome.amount;
      }, 0);
    }

    const totalBudgetAmount = (currentUser) => { 
      return currentUser.budgets.reduce((total, currentBudget) => {
          return total + currentBudget.amount;
      }, 0)
  }

    return (<><Link to='/piecharts'>Dashboard</Link>
        <div>
          <h1>Update Budgets</h1>
          <h2>Total Income: ${totalIncome(currentUser)}</h2>
          <h2>Total Budgets: ${totalBudgetAmount(currentUser)}</h2>
          {currentUser.budgets.map((budget) => (
            <div key={budget.id}>
              <label>
                {budget.category}: 
                <input
                  type="number"
                  defaultValue={budget.amount}
                  onChange={(event) => handleInputChange(budget.id, event)}
                />
                <p>{message[budget.id]}</p>
              </label>
              <button onClick={() => handleUpdateClick(budget.id)}>Update</button>
            </div>
          ))}
        </div></>
      );
    };



export default UpdateBudgets
