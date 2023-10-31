import React from "react";
import NavBar from "./NavBar";

import { useHistory } from 'react-router-dom'
import { dateFormatDate } from "../helpers/dateFormat";
import SoloPieChart from "./SoloPieChart";

const PieCharts = ( { currentUser }) => {
    const COLORS = ['#0088FE', '#00c49F', '#FFBB28', '#FF8042'];
    
    const totalIncome = currentUser.income.reduce((acc, curr) => acc + curr.amount, 0)
    const history = useHistory();

 

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
            {name: `Remaining amount for ${budget.category}`, value: budget.amount - transactionAmount}
        ]
    }
    


    return (<>
        <NavBar currentUser={currentUser} />
        <h1>Welcome {currentUser.username}!</h1>
        {currentUser.budgets.map((budget, index) => {
          const pieChartData = dataForCategoryWithTransactions(budget, currentUser.transactions);
          return (
            <div key={budget.id}>
              <h2>{budget.category} from {dateFormatDate(budget.start_date)} to {dateFormatDate(budget.end_date)}</h2>
              <SoloPieChart pieChartData={pieChartData} COLORS={COLORS} />
              <button onClick={() => handleMoreInfoClick(budget.category)}>Get More Info</button>
            </div>
          );
        })}
      </>
    );
                    
                    
    
                        
}


export default PieCharts
