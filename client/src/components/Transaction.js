import React, { useState, useEffect } from "react";
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { updateCurrentUser } from "../actions/useractions"
import { Link } from 'react-router-dom'
import { formatDate } from "../helpers/dateFormat";



const Transaction = ( { currentUser }) => {
    const [categories, setCategories] = useState([])
    const [editingTransactionId, setEditingTrnasactionId] = useState(null)
    const [tranAmounts, setTranAmounts] = useState({})
    const [message, setMessage] = useState({})
    const dispatch = useDispatch()
   


    
    const handleDelete = (tranId) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
        fetch(`/transactions/${tranId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(resp => {
            if (resp.ok) {

                const updatedTransactions = currentUser.transactions.filter(transaction => transaction.id !== tranId)
                const updatedUser = {...currentUser, transactions: updatedTransactions};
                dispatch(updateCurrentUser(updatedUser))
            }
        })
        .catch(e => {
            console.error(e)
        })}
    }


  

    const handleInputChange = (tranId, event) => {
        setTranAmounts(prevAmounts => ({
            ...prevAmounts,
            [tranId]: parseFloat(event.target.value)
        }))
    }

    const handleUpdateClick = (tranId) => {
        if (tranAmounts[tranId] !== undefined) {
            fetch(`/transactions/${tranId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: tranAmounts[tranId],
                    user_id: currentUser.id
                })
            })
            .then(resp => resp.json())
            .then(data => {
                if (data) {
                    setMessage((prevMessages) => ({
                        ...prevMessages,
                        [tranId]: `Updated transaction to $${data.amount}!` 
                      }));
                    

                    const updatedTransactions = currentUser.transactions.map((transaction) =>
                    transaction.id === data.id ? { ...transaction, ...data } : transaction
                );

                dispatch(updateCurrentUser({ ...currentUser, transactions: updatedTransactions }));
                }
            })
            .catch(e => {
                if (e) {
                    setMessage((prevMessages) => ({
                        ...prevMessages,
                        [tranId]: 'Transaction must be greater than  0.'
                      }));
                }
            })
        }
    }
   

    useEffect(() => {
        fetch('/categories')
        .then(resp => resp.json())
        .then(data => {
            setCategories(data)
        })
        .catch(e => console.error(e))
    }, [])

    const TransactionSchema = Yup.object().shape({
        amount: Yup.number('Amount must be a number.')
        .required('Transaction amount is required.')
        .min(0.01, 'Income amount must be greater than 0.'),
        description: Yup.string()
        .required('Description of transaction is required.'),
        category_id: Yup.string()
        .required('Please select a category.')    
    })

    const formik = useFormik({
        initialValues: {
            amount: '',
            description: '',
            category_id: '',
        },
        validationSchema: TransactionSchema,
        onSubmit: (values, { resetForm }) => {

            const newTransaction = {
                amount: values.amount,
                description: values.description,
                user_id: currentUser.id,
                category_id: values.category_id,
            
            };
            
            fetch('/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTransaction)
                
            })
            
            .then(resp => resp.json())
            .then(data => {
                if(data) {
                    resetForm();

                    const updatedTransaction = [...currentUser.transactions, data]
                    const updatedUser = {...currentUser, transactions: updatedTransaction}
                    dispatch(updateCurrentUser(updatedUser))
                }
            })
            .catch(e => {
                console.error(e)
            })

        }
    })

    const totalTransactions = () => {
        return currentUser.transactions.reduce((total, currentTransaction) => {
            return total + currentTransaction.amount;
        }, 0)
    }

    const toggleUpdate = (transactionId) => {
        setEditingTrnasactionId((prev) => (prev === transactionId ? null : transactionId));
    }

    
    
    return (<div className="transactions_background"><Link to='/piecharts'>Dashboard</Link><div><h2>Total Transactions: ${totalTransactions(currentUser).toFixed(2)}</h2></div>
    <h1>Please enter new transactions here</h1>
    <form onSubmit={formik.handleSubmit}>
        <input
        type='number'
        name='amount'
        value={formik.values.amount}
        onChange={formik.handleChange}
        placeholder='Transaction Amount'
        />
        <p>{formik.errors.amount}</p>
        <input
        type='text'
        name='description'
        value={formik.values.description}
        onChange={formik.handleChange}
        placeholder='Description'
        />
        <p>{formik.errors.description}</p>

        <select
        name='category_id'
        value={formik.values.category_id}
        onChange={formik.handleChange}
        ><option value=''>Select a cateogry</option>
            {categories.map((category) => (
                <option
                 key={category.id}
                 value={category.id}
                 >{category.name}</option>
            ))}
            
        </select><p>{formik.errors.category_id}</p>
        <button type='Submit'>Add transaction</button>
    </form>
    
    
    
    <table className='transaction_table'><thead>
        <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
            {currentUser.transactions.map((transaction) => (
                <tr key={transaction.id}>
                    <td>{formatDate(transaction.date)}</td>
                    <td>{transaction.description}</td>
                    <td>${(transaction.amount).toFixed(2)}</td>
                    <td>{transaction.category}</td>
                    <td>
                        <button onClick={() => toggleUpdate(transaction.id)}>Update</button>
                        {editingTransactionId === transaction.id && (
                            <div className='updateTab'>
                                <button className='x_button' onClick={() => setEditingTrnasactionId(null)}>X</button>
                                <input
                                className='update_tab_input'
                                type='number'
                                defaultValue={transaction.amount}
                                onChange={(event) => handleInputChange(transaction.id, event)}
                                />
                                <button onClick={() => handleUpdateClick(transaction.id)}>Update Transaction</button>
                                <p className='t_update_message'>{message[transaction.id]}</p>
                            </div>
                        )}
                        <button onClick={() => handleDelete(transaction.id)}>Delete</button>
                        
                    </td>
                </tr>
            ))}
        </tbody>
        
        
        </table></div>)
}


export default Transaction
