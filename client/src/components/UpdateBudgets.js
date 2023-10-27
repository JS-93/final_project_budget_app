import React, { useState } from "react";
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { updateCurrentUser } from "../actions/useractions";


const UpdateBudgets = ( {currentUser} ) => {
    const dispatch = useDispatch()
    const [budgetAmounts, setBudgetAmounts] = useState({})


 

    const handleInputChange = (budgetId, event) => {
        setBudgetAmounts(prevAmounts => ({
            ...prevAmounts,
            [budgetId]: parseFloat(event.target.value)
        }))
    }

    

    const handleUpdateClick = (budgetId) => {
        if (budgetAmounts[budgetId]) {
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
            .then(resp => resp.json())
            .then(data => {
                if (data) {
                    console.log(budgetId)

                     
                        const budgetIndex = currentUser.budgets.findIndex(budget => budget.id === budgetId);

                        
                        const updatedBudgets = [...currentUser.budgets];
                        updatedBudgets[budgetIndex] = {...currentUser.budgets[budgetIndex], ...data}

                        
                        const updatedUser = {...currentUser, budgets: updatedBudgets};

                       
                        dispatch(updateCurrentUser(updatedUser));
                        console.log(budgetId)
                   
                }
            })
        }
    }

    return (<><Link to='/piecharts'>Homepage</Link>
        <div>
          <h1>Update Budgets</h1>
          {currentUser.budgets.map((budget) => (
            <div key={budget.id}>
              <label>
                {budget.category}: 
                <input
                  type="number"
                  defaultValue={budget.amount}
                  onChange={(event) => handleInputChange(budget.id, event)}
                />
              </label>
              <button onClick={() => handleUpdateClick(budget.id)}>Update</button>
            </div>
          ))}
        </div></>
      );
    };



export default UpdateBudgets
