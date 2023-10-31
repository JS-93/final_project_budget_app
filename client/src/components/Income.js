import React, { useState } from "react";
import { Link } from 'react-router-dom'
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Cell, Tooltip } from 'recharts'
import IncomeList from "./IncomeList";
import { useDispatch } from "react-redux";
import { updateCurrentUser } from "../actions/useractions";
import { useFormik } from 'formik'
import * as Yup from 'yup'

const AddIncome = ( { currentUser } ) => {
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()

    const incomeColor = 'green';
    const transactionColor = 'blue';
    const totalTransactionsColor = 'red';

    const totalIncome = (currentUser) => {
        return currentUser.income.reduce((total, currentIncome) => {
            return total + currentIncome.amount;
        }, 0);
      }

    const totalTransactions = (currentUser) => {
        return currentUser.transactions.reduce((total, currentTransaction) => {
            return total + currentTransaction.amount;
        }, 0)
    }

    const totalsByCategory = currentUser.transactions.reduce((acc, transaction) => {
        if (acc[transaction.category]) {
            acc[transaction.category] += transaction.amount;
        } else {
            acc[transaction.category] = transaction.amount;
        }
        return acc;
    }, {})

    const categoryData = Object.entries(totalsByCategory).map(([category, amount]) => ({
        name: category,
        amount
    }))
     
      const data = [
        { name: 'Income', amount: totalIncome(currentUser), color: incomeColor },
        ...categoryData.map(category => ({ ...category, color: transactionColor })),
        { name: 'Total Transactions', amount: totalTransactions(currentUser), color: totalTransactionsColor }
    ];

    const IncomeSchema = Yup.object().shape({
        amount: Yup.number()
        .required('Income amount is required.')
        .min(0.01, 'Income amount must be greater than 0.'),
        description: Yup.string()
        .required('Income source is required.')
    })

    const formik = useFormik({
        initialValues: {
            amount: '',
            description: '',
        },
        validationSchema: IncomeSchema,
        onSubmit: (values, { resetForm }) => {

            const newIncome = {
                amount: values.amount,
                description: values.description,
                user_id: currentUser.id,
            };

        fetch('/income', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newIncome)
        })
        .then(resp => resp.json())
        .then(data => {
            if(data) {
                formik.resetForm()
                setMessage(`$${data.amount} has been added to your income from ${data.description}!`)

                const updatedIncome = [...currentUser.income, data];
                
                dispatch(updateCurrentUser({ ...currentUser, income: updatedIncome }));
            }
        })
        .catch(e => {
            console.error(e)
        })
        }
    })

    
    return (<>
    
        <Link to='/piecharts'>Dashboard</Link>
        <form onSubmit={formik.handleSubmit}>
                <input
                  type='text'
                  name='amount'
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  placeholder='Monthly Income Here'
                />
                {formik.errors.amount && <p style={{ color: 'red' }}>{formik.errors.amount}</p>}
                <input
                  type='text'
                  name='description'
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  placeholder="Income Source Here"
                />
                {formik.errors.description && <p style={{ color: 'red' }}>{formik.errors.description}</p>}
                <button type='Submit'>Add Income</button>
                {message && <p>{message}</p>}
              </form>
        <BarChart width={1200} height={600} data={data}>
            <Bar dataKey="amount" isAnimationActive={true}>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
            </Bar>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip cursor={{ fill: 'transparent' }}/>
        </BarChart>
        <IncomeList currentUser={currentUser}/>
    
    </>);
}

export default AddIncome
