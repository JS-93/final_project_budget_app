import React, { useState, useEffect } from "react";
import CatBudgetInput from "./CatBudgetInput";
import { useHistory } from 'react-router-dom'

const CatBudgets = ( { currentUser } ) => {
    const [categories, setCategories] = useState([])
    const [numInputsToShow, setNumInputsToShow] = useState(1);
    const history = useHistory()
    

    useEffect(() => {
        fetch('/categories')
        .then(resp => resp.json())
        .then(data => {
            setCategories(data)
        })
        .catch(e => console.error(e))
    }, [])

  const handleAddNext = () => {
    setNumInputsToShow((prevNum) => prevNum + 1)
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
    const handleGoToHomepage = () => {
        history.push('/piecharts')
    }

    


    return (<><h1>Total Income: ${totalIncome(currentUser)}</h1><h1>Total Budgets: ${totalBudgetAmount(currentUser)}</h1><div>{categories.slice(0, numInputsToShow).map((category) => (
        <CatBudgetInput key={category.id} category={category} currentUser={currentUser} totalIncome={totalIncome}/>
    ))}{ numInputsToShow < categories.length ? (
        <button onClick={handleAddNext}>Go To Next Budget</button>
    ) : (
        <button onClick={handleGoToHomepage}>Go To Homepage</button>
    )}
        </div></>)
}

export default CatBudgets
