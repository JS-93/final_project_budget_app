import React, { useState, useEffect } from "react";
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { updateCurrentUser } from "../actions/useractions"
import { Link } from 'react-router-dom'
import { formatDate } from "../helpers/dateFormat";


const Transaction = ( { currentUser }) => {
    const [categories, setCategories] = useState([])
    const [showUpdate, setShowUpdate] = useState(false)
    const [tranAmounts, setTranAmounts] = useState({})
    const [sortOrder, setSortOrder] = useState('Highest')
    const [filterCategory, setFilterCategory] = useState('All')
    const dispatch = useDispatch()

    const handleSort = (event) => {
        setSortOrder(event.target.value);
    };

    const handleCategoryFilterChange = (event) => {
        setFilterCategory(event.target.value)
    }

    let sortedAndFilteredTransactions = currentUser.transactions;

    if (filterCategory !== 'All') {
        sortedAndFilteredTransactions = sortedAndFilteredTransactions.filter(
            (transaction) => transaction.category === filterCategory
        );
    }

    sortedAndFilteredTransactions = sortedAndFilteredTransactions.sort((a, b) => {
        if (sortOrder === 'Highest') {
            return b.amount - a.amount;
        } else {
            return a.amount - b.amount
        }
    })

    
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


    const toggleUpdate = () => {
            setShowUpdate(!showUpdate)
    }

    const handleInputChange = (tranId, event) => {
        setTranAmounts(prevAmounts => ({
            ...prevAmounts,
            [tranId]: parseFloat(event.target.value)
        }))
    }

    const handleUpdateClick = (tranId) => {
        if (tranAmounts[tranId]) {
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
                    console.log(tranId)

                    const tranIndex = currentUser.transactions.findIndex(transaction => transaction.id === tranId);

                    const updatedTransactions = [...currentUser.transactions];
                    updatedTransactions[tranIndex] = {...currentUser.transactions[tranIndex], ...data}

                    const updatedUser = {...currentUser, transactions: updatedTransactions};

                    dispatch(updateCurrentUser(updatedUser))
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
    
    return (<div><Link to='/logout'>Logout</Link><Link to='/piecharts'>Homepage</Link><div><h2>Total Transactions: ${totalTransactions(currentUser)}</h2></div>
    <h1>Please enter new transactions here</h1>
    <form onSubmit={formik.handleSubmit}>
        <input
        type='text'
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
    </form><select value={sortOrder} onChange={handleSort}>
        <option value="Highest">Highest Amount</option>
        <option value="Lowest">Lowest Amount</option>
    </select>
    <select value={filterCategory} onChange={handleCategoryFilterChange}>
        <option value='All'>All Categories</option>
        {categories.map((category) => (
            <option key={category.id} value={category.name}>
                {category.name}
            </option>
        ))}
    </select>
    
    
    
    <table><thead>
        <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
            {sortedAndFilteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                    <td>{formatDate(transaction.date)}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.category}</td>
                    <td>
                        <button onClick={toggleUpdate}>Update</button>
                        {showUpdate && (
                            <div className='updateTab'>
                                <input
                                type='text'
                                defaultValue={transaction.amount}
                                onChange={(event) => handleInputChange(transaction.id, event)}
                                />
                                <button onClick={() => handleUpdateClick(transaction.id)}>Update Transaction</button>
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
