import React, { useState, useEffect } from "react";
import CatBudgetInput from "./CatBudgetInput";
import { useHistory } from 'react-router-dom'
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const CatBudgets = ( { currentUser } ) => {
    const [categories, setCategories] = useState([])
    const history = useHistory()
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF99C8', '#FF6666'];
    

    const pieData = () => {
      
      const data = [
        { name: 'Income', value: totalIncome(currentUser) },
      ];
    
     
      if (currentUser.budgets && currentUser.budgets.length > 0) {
        const budgetData = currentUser.budgets.map((budget) => ({
          name: budget.category,
         
          value: Number.isFinite(budget.amount) ? budget.amount : 0,
        }));
        data.push(...budgetData); 
      }
    
      return data;
    };
  

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
        <><div style={{ position: 'absolute', top: 1, right: 2}}>
          <PieChart width={800} height={400}>
      <Pie
        isAnimationActive={true}
        data={pieData()}
        cx="50%"
        cy="50%"
        outerRadius={150}
        fill="#8884d8"
        dataKey="value"
        label={(entry) => {
          const value = Number.isFinite(entry.value) ? entry.value.toFixed(2) : '0.00';
          return `${entry.name}: $${value}`;
        }}
      >
        {
          pieData().map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))
        }
      </Pie>
      <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
      <Legend />
    </PieChart>
        </div>
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
