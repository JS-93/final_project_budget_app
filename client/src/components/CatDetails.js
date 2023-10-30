import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { formatDate } from '../helpers/dateFormat';

const CategoryDetails = ({ currentUser }) => {

    let { categoryName } = useParams();
    
    let transactions = currentUser.transactions.filter((transaction) => transaction.category === categoryName)
    console.log(transactions)
    return <><Link to='/piecharts'>Dashboard</Link>
    
    
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
