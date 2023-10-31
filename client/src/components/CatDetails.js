import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { formatDate } from '../helpers/dateFormat';
import { AreaChart, XAxis, YAxis, Tooltip, Area } from 'recharts';

const CategoryDetails = ({ currentUser }) => {

    let { categoryName } = useParams();
    
    let transactions = currentUser.transactions.filter((transaction) => transaction.category === categoryName)
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
      
    
    return <><Link to='/piecharts'>Dashboard</Link>
    <AreaChart width={730} height={250} data={chartData}
      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.5}/>
          <stop offset="95%" stopColor="#8884d8" stopOpacity={0.5}/>
        </linearGradient>
      </defs>
      <XAxis dataKey="date" tickFormatter={formatXAxisDate} />
      <YAxis />
      <Tooltip labelFormatter={tooltipLabelFormatter}/>
      <Area name='Budget' type="monotone" dataKey="budgetAmount" stroke="#82ca9d" fillOpacity={0.6} fill="url(#colorBudget)" isAnimationActive={true} />
      <Area name='Transactions' type="natural" dataKey="cumulativeTotal" stroke="#8884d8" fillOpacity={0.6} fill="url(#colorCumulative)" />
    </AreaChart>

    
    
    <table><thead>
        <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            

        </tr>
    </thead>
    <tbody>
        {transactions.map((transaction) => (
            <tr key={transaction.id}>
                <td>{formatDate(transaction.date)}</td>
                <td>{transaction.description}</td>
                <td>{transaction.amount}</td>
            </tr>
        ))}
    </tbody>
        
        
        </table></>
}

export default CategoryDetails
