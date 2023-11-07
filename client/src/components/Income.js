import React, { useState } from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Cell, Tooltip } from 'recharts'
import IncomeList from "./IncomeList";
import { useDispatch } from "react-redux";
import { updateCurrentUser } from "../actions/useractions";
import { useFormik } from 'formik'
import * as Yup from 'yup'
import NavBar from "./NavBar";

const AddIncome = ( { currentUser } ) => {
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()

    const incomeColor = '#97c070';
    const transactionColor = '#234E70';
    const totalTransactionsColor = '#ba6c63';

    const totalIncome = (currentUser) => {
        return currentUser.income.reduce((total, currentIncome) => {
            return (parseFloat(total) + parseFloat(currentIncome.amount)).toFixed(2);
        }, 0);
      }

    const totalTransactions = (currentUser) => {
        return currentUser.transactions.reduce((total, currentTransaction) => {
            return (parseFloat(total) + parseFloat(currentTransaction.amount)).toFixed(2);
        }, 0)
    }

    const totalsByCategory = currentUser.transactions.reduce((acc, transaction) => {
        if (acc[transaction.category]) {
            acc[transaction.category] += (parseFloat(transaction.amount));
        } else {
            acc[transaction.category] = parseFloat(transaction.amount);
        }
        return acc;
    }, {})

    for (let category in totalsByCategory) {
        totalsByCategory[category] = totalsByCategory[category].toFixed(2);
    }

    const categoryData = Object.entries(totalsByCategory).map(([category, amount]) => ({
        name: category,
        amount: parseFloat(totalsByCategory[category])
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
    
        <NavBar></NavBar>
        <div className='income_background'>
            <h1 className="income_chart_title">Income to Transaction Chart</h1>
              <div className="bar_chart_container">
        <BarChart width={1600} height={600} data={data}>
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
        </div>
        <div className="income_form_container">
        <form onSubmit={formik.handleSubmit}>
            <div className="input_income_container">
                <div className="income_amount_container">
                <input
                  className="income_input"
                  type='text'
                  name='amount'
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  placeholder='Monthly Income Here'
                />
                {formik.errors.amount && <p className="income_new_errors">{formik.errors.amount}</p>}</div>
                <div className='input_description_container'>
                <input
                  className="income_input"
                  type='text'
                  name='description'
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  placeholder="Income Source Here"
                />
                {formik.errors.description && <p className="income_new_errors">{formik.errors.description}</p>}</div>
                <div>
                <button className="income_button" type='Submit'>Add Income</button>
                {message && <p className='income_new_errors'>{message}</p>}</div>
                </div>
              </form>
              </div>
        <IncomeList currentUser={currentUser}/>
        </div>
    </>);
}

export default AddIncome
