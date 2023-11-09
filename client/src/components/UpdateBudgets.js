import React, { useState } from "react";
import NavBar from "./NavBar";
import { useDispatch } from 'react-redux';
import { updateCurrentUser } from "../actions/useractions";
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'


const UpdateBudgets = ( {currentUser} ) => {
    const dispatch = useDispatch()
    const [budgetAmounts, setBudgetAmounts] = useState({})
    const [message, setMessage] = useState({})
    const COLORS = ['#234E70', '#548762', '#988655', '#c07680', '#9276c0', '#70a6c0', ' #DF7F50', '#6bc2a8'];

 

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

  const pieData = () => {

    const data = [
      { name: 'Income', value: totalIncome(currentUser)},
    ];

    const budgetData = currentUser.budgets.map((budget) => ({
      name: budget.category,
      value: budget.amount
    }));
    data.push(...budgetData)

    return data
  }

    return (<><NavBar></NavBar>
        <div className='update_background'>
          <div className="scoreboard4">
          <h2 className="income_score">Total Income: ${totalIncome(currentUser)}</h2>
          <h2 className='income_score'>Total Budgets: ${totalBudgetAmount(currentUser)}</h2></div>
          <div className='first_half'>
        <div className="update_b_form_container">
          {currentUser.budgets.map((budget) => (
            <div className="update_b_input_container" key={budget.id}>
              
              <label>{budget.category}: </label>
                <input
                  type="number"
                  defaultValue={budget.amount}
                  onChange={(event) => handleInputChange(budget.id, event)}
                />
                <p>{message[budget.id]}</p>
              
              <button onClick={() => handleUpdateClick(budget.id)}>Update</button>
           </div>
           
          ))}
          </div>
          </div>
          <div className="second_half">
              <PieChart width={700} height={800}>
                <Pie
                isAnimationActive={true}
                data={pieData()}
                cx='50%'
                cy='50%'
                outerRadius={300}
                fill='#8884d8'
                dataKey='value'
                >
                  {
                    pieData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))
                  }
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`}/>
                <Legend/>
              </PieChart>
          </div>
        </div></>
      );
    };



export default UpdateBudgets
