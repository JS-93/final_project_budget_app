import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import NavBar from "./NavBar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandsClapping } from "@fortawesome/free-solid-svg-icons";

const Compare = ( { currentUser }) => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        fetch('/users')
        .then(resp => resp.json())
        .then(data => {
            setUsers(data)
        })
    }, [])

    

    
   

    const data = users.map((user) => {
        const totalTran = user.transactions.reduce((acc, curr) => acc + curr.amount, 0);
        const totalIncome = user.incomes.reduce((acc, curr) => acc + curr.amount, 0);
        const savingsRate = ((totalIncome - totalTran)/totalIncome)
        
        return {
      
            userId: user.id,
            savingsRate: savingsRate.toFixed(2)
        }
    })

    const totalUserTran = currentUser.transactions.reduce((acc, curr) => acc + curr.amount, 0);
    const totalUserIncome = currentUser.income.reduce((acc, curr) => acc + curr.amount, 0);
    const userSavingsRate = ((totalUserIncome - totalUserTran) / totalUserIncome)
  
   
    const savingsRates = users.map((user) => {
      const totalTran = user.transactions.reduce((acc, curr) => acc + curr.amount, 0);
      const totalIncome = user.incomes.reduce((acc, curr) => acc + curr.amount, 0);
      return (totalIncome - totalTran) / totalIncome 
    });

    savingsRates.sort((a, b) => b - a);
    const userRank = savingsRates.indexOf(userSavingsRate);

   

    const compareSavingsRates = (currentUser, users) => {
      
      
      if (userRank === savingsRates.length - 1) {
        return 'you should take a moment to review your budgets! There could be opportunities to improve your savings rate!';
      } else if (userRank === 0) {
        return 'your savings rate is better than all of our users! Give yourself a round of applause.';
      } else {
       
        const nextBetterRate = savingsRates[userRank - 1];
        const percentageBetter = ((nextBetterRate - userSavingsRate) / nextBetterRate) * 100;
        return `your savings rate is better than ${percentageBetter.toFixed(2)}% of the other users.`;
      }
    }



    


    return (<><NavBar></NavBar><div className='compare_background'>
      <div className="compare_title_container">
    <h1 className="compare_chart_title">User Comparison Chart</h1></div>
    <div className="compare_chart_container">
    
                <LineChart width={1200} height={600} data={data} >
                    <CartesianGrid/>
                    <XAxis dataKey='userId'/>
                    <YAxis dataKey='savingsRate' domain= {[-1.5, 0.99]}/>
                    <Line
                    type='monotone'
                    dataKey='savingsRate'
                    stroke='#8884d8'
                    dot={(props) => {
                        if (props.payload.userId === currentUser.id) {
                          return <circle cx={props.cx} cy={props.cy} r={8} fill="white" />;
                        } else {
                          return <circle cx={props.cx} cy={props.cy} r={3} fill="#8884d8" />;
                        }
                      }}
                      activeDot={{ r: 8 }}
                      
                    />
                    <Tooltip/>
                   
                    
                    </LineChart></div>
                    <div className='compare_info_container'>
                      <h1>By the looks of the chart {currentUser.username}, {compareSavingsRates(currentUser, users)}</h1>
                      {userRank === 0 && <h1><FontAwesomeIcon icon={faHandsClapping}/></h1>}
                      </div></div></>)
}


export default Compare


