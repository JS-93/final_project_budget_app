import React from "react";
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const AddIncome = ( { currentUser } ) => {

    function processData(incomeData, transactionData) {
        const combinedData = [...incomeData, ...transactionData].map(item => ({
          date: new Date(item.date).toISOString().split('T')[0],
          amount: item.amount,
          type: item.type, // This should be set to 'income' or 'expense' accordingly
        }));
      
        combinedData.sort((a, b) => new Date(a.date) - new Date(b.date));
      
        const dataByDate = combinedData.reduce((acc, item) => {
          const date = item.date;
          if (!acc[date]) {
            acc[date] = { income: 0, expenses: 0 };
          }
          if (item.type === 'income') {
            acc[date].income += item.amount;
          } else if (item.type === 'expense') { // Make sure this matches the type set for expenses
            acc[date].expenses += item.amount;
          }
          return acc;
        }, {});
      
        return Object.keys(dataByDate).map(date => ({
          date,
          income: dataByDate[date].income,
          expenses: dataByDate[date].expenses
        }));
      }

      const incomeData = currentUser.income.map(entry => ({
        ...entry,
        type: 'income',
      }));
      
      // Assuming all entries in currentUser.transactions are expenses
      const transactionData = currentUser.transactions.map(entry => ({
        ...entry,
        type: 'expense',
      }));
      
      const combinedProcessedData = processData(incomeData, transactionData);
    
    // Inside your component's return statement:
    return (
        <>
            <Link to='/piecharts'>Homepage</Link>
            <LineChart width={600} height={300} data={combinedProcessedData}>
                <CartesianGrid strokeDasharray='3 3'/>
                <XAxis dataKey='date'/>
                <YAxis />
                <Tooltip/>
                <Legend/>
                <Line type='monotone' dataKey='income' stroke='#8884d8' activeDot={{ r: 8}}/>
                <Line type='monotone' dataKey='expenses' stroke='#82ca9d'/>
            </LineChart>
        </>
    );
}

export default AddIncome
