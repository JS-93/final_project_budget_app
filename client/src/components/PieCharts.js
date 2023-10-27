import React from "react";
import NavBar from "./NavBar";
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const PieCharts = ( { currentUser }) => {
    const COLORS = ['#0088FE', '#00c49F', '#FFBB28', '#FF8042'];
    const totalIncome = currentUser.income.reduce((acc, curr) => acc + curr.amount, 0)
    


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
    
 



    return (<><NavBar currentUser={currentUser}/><h1>Hello from homepage</h1>
                {currentUser.budgets.map(budget =>  {
                    const pieChartData = dataForCategoryWithTransactions(budget, currentUser.transactions);
                    return (
                    <div key={budget.id}>
                        <h2>{budget.category}</h2>
                        <PieChart width={400} height={400}>
                            <Pie
                                dataKey='value'
                                isAnimationActive={true}
                                data={pieChartData}
                                cx={200}
                                cy={200}
                                outerRadius={90}
                                fill='#8884d8'
                                label={true}>
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                    ))}
                                </Pie>
                                <Tooltip/>
                                <Legend/>
                        </PieChart>
                    </div>)
})}
    
    
                        </>)
}


export default PieCharts
