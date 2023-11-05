import React from "react";
import NavBar from "./NavBar";

import { useHistory } from 'react-router-dom'
import { formatDate } from "../helpers/dateFormat";
import SoloPieChart from "./SoloPieChart";


const PieCharts = ( { currentUser }) => {
    const COLORS = ['#50bb7f', '#FF4C29', '#FBF8BE', '#FF8042'];
    
    
    
    const totalIncome = currentUser.income.reduce((acc, curr) => acc + curr.amount, 0)
    const history = useHistory();

    const totalTransactions = () => {
        return currentUser.transactions.reduce((total, currentTransaction) => {
            return total + currentTransaction.amount;
        }, 0)
    }

    const profit = (totalIncome - totalTransactions(currentUser)).toFixed(2)

    const healthScore = `${((profit/totalIncome) * 100).toFixed(2)}%`

 

    const handleMoreInfoClick = (categoryName) => {
        history.push(`/category/${categoryName}`)
    }


    const dataForCategoryWithTransactions = (budget, transactions) => {
        const relevantTransactions = transactions.filter(transaction => transaction.category === budget.category);
        let transactionAmount = 0;

        if (relevantTransactions.length > 1) {
            transactionAmount = relevantTransactions.reduce((total, transaction) => total + transaction.amount, 0)
        } else if (relevantTransactions.length === 1) {
            transactionAmount = relevantTransactions[0].amount
        } else if (relevantTransactions.length === 0) {
            transactionAmount = '';
        }
       

        return [
            
            {name: 'Income', value: totalIncome},
            {name: `Transactions in ${budget.category}`, value: transactionAmount},
            {name: 'Remaining amount for Budget', value: budget.amount - transactionAmount}
        ]
    }
    
    


    return (<>
        <NavBar currentUser={currentUser} /><div className="pie_charts_background">
            <div className="pie_charts_container">
        <h1 className='welcome'>Welcome {currentUser.username}!</h1>
        <h2 className='date_expiration'>Budget Range: {formatDate(currentUser.budgets[0].start_date)} to expiration on {formatDate(currentUser.budgets[0].end_date)}</h2>
        <div className='scoreboard2'>
        <h2 className='income_score'>Savings Rate: {healthScore}</h2>
        <h2 className="budgets_score">Savings: ${profit}</h2>
        <h2 className='income_score'>Total Income: ${totalIncome.toFixed(2)}</h2>
        {currentUser.transactions.length !== 0 ?
        <h2 className="income_score">Total Transactions: ${totalTransactions(currentUser).toFixed(2)}</h2> : <h2 className="income_score">No transactions</h2>}
        
        </div>
        <div className="pie_charts_grid">
        {currentUser.budgets.map((budget, index) => {
          const pieChartData = dataForCategoryWithTransactions(budget, currentUser.transactions);
          return (
            <div key={budget.id} className='pie_chart_item'>
              <h2 className='piechart_category_name'>{budget.category} Budget</h2>
              <SoloPieChart pieChartData={pieChartData} COLORS={COLORS} />
              <button onClick={() => handleMoreInfoClick(budget.category)}>Get More Info</button>
            </div>
          );
        })}
        </div>
        </div>
        </div>
      </>
    );
                    
                    
    
                        
}


export default PieCharts
