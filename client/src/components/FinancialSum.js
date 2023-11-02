import React, { useState } from "react";
import { formatDate } from "../helpers/dateFormat";
import { useDispatch } from 'react-redux'
import { updateCurrentUser } from "../actions/useractions";
import { useHistory } from 'react-router-dom'



const FinancialSum = ( { currentUser } ) => {

    const totalIncome = (currentUser.income.reduce((acc, curr) => acc + curr.amount, 0)).toFixed(2)
    const totalTransactions = (currentUser.transactions.reduce((acc, curr) => acc + curr.amount, 0)).toFixed(2)
    const savingsRate = (((totalIncome - totalTransactions)/totalIncome) * 100).toFixed(2)
    const savingsAmount = (totalIncome - totalTransactions).toFixed(2)
    const [confirmation, setConfirmation] = useState(false)
    const dispatch = useDispatch()
    const history = useHistory()


    const budgetSummary = (budgets, transactions) => {

        const byCategory = {};

        budgets.forEach(budget => {
            byCategory[budget.category] = {
                budgetAmount: budget.amount,
                transactionTotal: 0
            };
        });

        transactions.forEach(transaction => {
            if (byCategory[transaction.category]) {
                byCategory[transaction.category].transactionTotal += transaction.amount;
            }
        });

        return Object.keys(byCategory).map(category => {
            const categoryData = byCategory[category];
            const budgetAmount = categoryData.budgetAmount.toFixed(2);
            const transactionTotal = categoryData.transactionTotal.toFixed(2);
            const budgetAllocatedPercent = (transactionTotal / budgetAmount * 100).toFixed(2)

            return `Category: ${category} | Budget Amount: $${budgetAmount} | Transactions Total for Budget: $${transactionTotal} | Budget Used: ${budgetAllocatedPercent}%`;
        })
    }

    const handlePrint = () => {
        window.print()
    }

    const handleBeginNewBudgetPeriod = () => {
        fetch(`clear_data/${currentUser.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
           
        })
        .then(resp => {
            if (resp.ok) {

                dispatch(updateCurrentUser({ ...currentUser, budgets: [], transactions: [], income: [] }));
                history.push('/budgets')
            } else {
                console.error('Failed to clear user data.')
            }
        })
        .catch(e => {
            console.error(e)
        })
    }

    const promptConfirm = () => {
        setConfirmation(true)
    }

   

    return (
       
 <>{!confirmation && <><h1>Financial Summary for {currentUser.username} from 
    <span>{formatDate(currentUser.budgets[0].start_date)} to {formatDate(currentUser.budgets[0].end_date)}</span>:</h1>
    <h2>Total Income: ${totalIncome}</h2>
    <h2>Total Transactions: ${totalTransactions}</h2>
    <h2>Savings Rate: {savingsRate}%</h2>
    <h2>Savings Amount: ${savingsAmount}</h2>
    <h2>Budget Summary: {budgetSummary(currentUser.budgets, currentUser.transactions)}</h2>
    <table><thead>
        <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Category</th>
        </tr>
        </thead>
        <tbody>
            {currentUser.transactions.map((transaction) => (
                <tr key={transaction.id}>
                    <td>{formatDate(transaction.date)}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.category}</td></tr>
                    
            ))}</tbody></table>
<button onClick={handlePrint}>Print Summary</button><button onClick={promptConfirm}>Begin New Budget Period</button></>}
{confirmation && (<div>
    <p>Make sure to print or save the financial information before moving forward!</p>
    <button onClick={() => setConfirmation(false)}>Go Back</button>
    <button onClick={handleBeginNewBudgetPeriod}>Move Forward</button>
</div>)}
    </> 

    )
}


export default FinancialSum


