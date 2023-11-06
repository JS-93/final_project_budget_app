import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { formatDate } from '../helpers/dateFormat';
import { AreaChart, XAxis, YAxis, Tooltip, Area } from 'recharts';
import NavBar from './NavBar';

const CategoryDetails = ({ currentUser }) => {
  const [sortKey, setSortKey] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc')

  const handleSortChange = (key) => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    setSortKey(key)
  };

  

    let { categoryName } = useParams();
    
    let transactions = currentUser.transactions.filter((transaction) => transaction.category === categoryName)

    const sortedTransactions = transactions.sort((a, b) => {
      let comparison = 0;
  
      if (sortKey === 'amount') {
        comparison = parseFloat(a.amount) - parseFloat(b.amount);
      } else if (sortKey === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      }
  
      return sortOrder === 'asc' ? comparison : -comparison;
    })

    let budget = currentUser.budgets.filter((budget) => budget.category === categoryName)

    const processChartData = (transactions, budget) => {
        
        const sortedTransactions = [...transactions].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
      
        
        let cumulativeTotal = 0;
        const dataWithCumulativeTotal = sortedTransactions.map(transaction => {
          cumulativeTotal += transaction.amount;
          return {
            date: transaction.date, 
            cumulativeTotal: parseFloat(cumulativeTotal.toFixed(2))
          };
        });


       
       
        
      
        
        const budgetAmount = budget.length > 0 ? budget[0].amount : 0;
      
        
        const chartData = dataWithCumulativeTotal.map(dataPoint => ({
          ...dataPoint,
          budgetAmount: budgetAmount
        }));
      
        return chartData;
      };

      const formatXAxisDate = (date) => {
            
        const dateObj = new Date(date);
        
        return dateObj.toLocaleDateString('en-US', {
          month: 'numeric',
          day: 'numeric',
        });
      };

      const tooltipLabelFormatter = (label) => {
        
        const date = new Date(label);
        return date.toLocaleDateString('en-US', {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        });
      };
      
      
      const chartData = processChartData(transactions, budget);
      
      
    
    return transactions.length > 0 ? 
    ( <><NavBar></NavBar><div className='dynamic_route_background'><h2 className='dynamic_graph_title'>Budget-Transaction Comparison Graph</h2>
    <div className='chart_container'>
      
    <AreaChart width={1530} height={450} data={chartData}
      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id="colorCumulative">
          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.5}/>
          <stop offset="95%" stopColor="#8884d8" stopOpacity={0.5}/>
        </linearGradient>
      </defs>
      <XAxis dataKey="date" tickFormatter={formatXAxisDate} />
      <YAxis />
      <Tooltip labelFormatter={tooltipLabelFormatter}/>
      <Area name='Budget' type="monotone" dataKey="budgetAmount" stroke="#82ca9d" fillOpacity={0.6} fill="url(#colorBudget)" isAnimationActive={true} />
      <Area name='Transactions' type="monotone" dataKey="cumulativeTotal" stroke="#8884d8" fillOpacity={0.6} fill="url(#colorCumulative)" />
    </AreaChart></div>
      <div className='sorting_buttons'>
        <button className='sort_button' onClick={() => handleSortChange('date')}>
          Sort by Date
        </button>
        <button className='sort_button' onClick={() => handleSortChange('amount')}>
          Sort by Amount
        </button>
      </div>
    
    
    <table className='cat_t_table'><thead>
        <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            

        </tr>
    </thead>
    <tbody>
        {sortedTransactions.map((transaction) => (
            <tr key={transaction.id}>
                <td>{formatDate(transaction.date)}</td>
                <td>{transaction.description}</td>
                <td>{transaction.amount}</td>
            </tr>
        ))}
    </tbody>
        
        
        </table></div></> ): (<><NavBar></NavBar><h1>No transactions for {categoryName}</h1></>)
}

export default CategoryDetails
