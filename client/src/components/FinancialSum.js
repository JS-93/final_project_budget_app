import React, { useState } from "react";
import { formatDate } from "../helpers/dateFormat";
import { useDispatch } from 'react-redux'
import { updateCurrentUser } from "../actions/useractions";
import { useHistory } from 'react-router-dom'
import { faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



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
      
      
        const summaryRows = Object.keys(byCategory).map(category => {
          const categoryData = byCategory[category];
          const budgetAmount = categoryData.budgetAmount.toFixed(2);
          const transactionTotal = categoryData.transactionTotal.toFixed(2);
          const budgetAllocatedPercent = (transactionTotal / budgetAmount * 100).toFixed(2);
      
          return (
            <tr key={category}>
              <td>{category}</td>
              <td>${budgetAmount}</td>
              <td>${transactionTotal}</td>
              <td>{budgetAllocatedPercent}%</td>
            </tr>
          );
        });
      
       
        return (
          <table className="budget_cat_table">
            <thead className="t_header">
              <tr className="t_header">
                <th>Category</th>
                <th>Budget Amount</th>
                <th>Transactions Total</th>
                <th>Budget Used</th>
              </tr>
            </thead>
            <tbody>
              {summaryRows}
            </tbody>
          </table>
        );
      };
      

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


    const sortedTransactions = currentUser.transactions.sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
    })

    return (
       
 <><div className='financial_background'>{!confirmation && <><h1 className="finance_title">Budge-It<FontAwesomeIcon className='fa_icon' icon={faHandHoldingDollar}></FontAwesomeIcon></h1><h1 className="financial_title">Financial Summary for {currentUser.username} from {formatDate(currentUser.budgets[0].start_date)} to {formatDate(currentUser.budgets[0].end_date)}:</h1>
 <div className="scoreboard5">
    <h2>Total Income: <span className="total_in_f">${totalIncome}</span></h2>
    <h2>Total Transactions: <span className="total_t_f">${totalTransactions}</span></h2>
    <h2>Savings Rate: {savingsRate}%</h2>
    <h2>Savings Amount: ${savingsAmount}</h2></div>
    <h2 className='budget_sum_title'>Budget Summary:</h2>
      {budgetSummary(currentUser.budgets, currentUser.transactions)}
    <table className='f_t_table'><thead>
        <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Category</th>
        </tr>
        </thead>
        <tbody>
            {sortedTransactions.map((transaction) => (
                <tr key={transaction.id}>
                    <td>{formatDate(transaction.date)}</td>
                    <td>{transaction.description}</td>
                    <td>${(transaction.amount).toFixed(2)}</td>
                    <td>{transaction.category}</td></tr>
                    
            ))}</tbody></table>
<button className="f_sum_button" onClick={handlePrint}>Print Summary</button><button className='f_sum_button' onClick={promptConfirm}>Begin New Budget Period</button></>}
{confirmation && (<div className='confirm_background'><div className='confirm_container'>
    <p>Make sure to print or save the financial information before moving forward to document the history!</p>
    <button className='confirm_button' onClick={() => setConfirmation(false)}>Go Back</button>
    <button className='confirm_button' onClick={handleBeginNewBudgetPeriod}>Move Forward</button></div>
</div>)}
</div>
    </> 

    )
}


export default FinancialSum


