import React, { useState, useEffect } from "react";
import CatBudgetInput from "./CatBudgetInput";
import { useHistory } from 'react-router-dom'

const CatBudgets = ( { currentUser } ) => {
    const [categories, setCategories] = useState([])
    const history = useHistory()
    

    useEffect(() => {
        fetch('/categories')
        .then(resp => resp.json())
        .then(data => {
            setCategories(data)
            
        })
        .catch(e => console.error(e))
    }, [currentUser.budgets])



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
    const handleGoToHomepage = () => {
        history.push('/piecharts')
    }

 

    const getRemainingCategories = () => {
        return categories.filter(category =>
            !currentUser.budgets.some(budget => budget.category === category.name)
        );
    };

    const remainingCategories = getRemainingCategories()

    const allBudgetSet = remainingCategories.length === 0

      return (
        <>
          <h1>Total Income: ${totalIncome(currentUser)}</h1>
          <h1>Total Budgets: ${totalBudgetAmount(currentUser)}</h1>
          <div>
            {remainingCategories.map((category, index) => {
             
              
              return (
                <CatBudgetInput
                  key={category.id}
                  category={category}
                  currentUser={currentUser}
                  totalIncome={totalIncome}
                />
              );
            })}
            {allBudgetSet && (
              <button onClick={handleGoToHomepage}>Go To Dashboard</button>
            )}
          </div>
        </>
      );
}

export default CatBudgets
