import React from "react";
import { Link } from 'react-router-dom'
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Cell, Tooltip } from 'recharts'

const AddIncome = ( { currentUser } ) => {

    const incomeColor = 'green';
    const transactionColor = 'blue';
    const totalTransactionsColor = 'red';

    const totalIncome = (currentUser) => {
        return currentUser.income.reduce((total, currentIncome) => {
            return total + currentIncome.amount;
        }, 0);
      }

    const totalTransactions = (currentUser) => {
        return currentUser.transactions.reduce((total, currentTransaction) => {
            return total + currentTransaction.amount;
        }, 0)
    }

    const totalsByCategory = currentUser.transactions.reduce((acc, transaction) => {
        if (acc[transaction.category]) {
            acc[transaction.category] += transaction.amount;
        } else {
            acc[transaction.category] = transaction.amount;
        }
        return acc;
    }, {})

    const categoryData = Object.entries(totalsByCategory).map(([category, amount]) => ({
        name: category,
        amount
    }))
     
      const data = [
        { name: 'Income', amount: totalIncome(currentUser), color: incomeColor },
        ...categoryData.map(category => ({ ...category, color: transactionColor })),
        { name: 'Total Transactions', amount: totalTransactions(currentUser), color: totalTransactionsColor }
    ];
    
    return (<>  <>
        <Link to='/piecharts'>Dashboard</Link>
        <BarChart width={1000} height={600} data={data}>
            <Bar dataKey="amount" isAnimationActive={true}>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
            </Bar>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip cursor={{ fill: 'transparent' }}/>
        </BarChart>
    </>
    </>);
}

export default AddIncome
