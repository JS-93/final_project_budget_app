import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Compare = ( { currentUser }) => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        fetch('/users')
        .then(resp => resp.json())
        .then(data => {
            setUsers(data)
        })
    }, [])
    console.log(users)

    const data = users.map((user) => {
        const totalTran = user.transactions.reduce((acc, curr) => acc + curr.amount, 0);
        const totalIncome = user.incomes.reduce((acc, curr) => acc + curr.amount, 0);
        const savingsRate = ((totalIncome - totalTran)/totalIncome)
        
        return {
            userId: user.id,
            savingsRate: savingsRate.toFixed(2)
        }
    })



    return (<><Link to='/piecharts'>Dashboard</Link><h1>Hello from Compare</h1>
                <LineChart width={600} height={600} data={data} >
                    <CartesianGrid/>
                    <XAxis dataKey='userId' label='User ids'/>
                    <YAxis dataKey='savingsRate' domain= {[-0.5, 0.5]}/>
                    <Line
                    type='monotone'
                    dataKey='savingsRate'
                    stroke='#8884d8'
                    dot={(props) => {
                        if (props.payload.userId === currentUser.id) {
                          return <circle cx={props.cx} cy={props.cy} r={8} fill="green" />;
                        } else {
                          return <circle cx={props.cx} cy={props.cy} r={3} fill="#8884d8" />;
                        }
                      }}
                      activeDot={{ r: 8 }}
                      
                    />
                    <Tooltip/>
                    <Legend/>
                    
                    </LineChart></>)
}


export default Compare


