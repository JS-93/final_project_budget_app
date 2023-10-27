import React, { useState } from "react";
import { useFormik } from 'formik'
import * as Yup from 'yup'
import CatBudgets from "./CatBudgets";
import { useDispatch } from 'react-redux'
import { updateCurrentUser } from "../actions/useractions";
import { Link } from 'react-router-dom'


const Budgets = ( { currentUser } ) => {
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()


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
                const updatedUser = {...currentUser, income: updatedIncome}
                dispatch(updateCurrentUser(updatedUser))
            }
        })
        .catch(e => {
            console.error(e)
        })
        }
    })






    return (<div><Link to='/logout'>Logout</Link>
        <h1>Please enter your income here</h1>
        <form onSubmit={formik.handleSubmit}>
            <input
            type='text'
            name='amount'
            value={formik.values.amount}
            onChange={formik.handleChange}
            placeholder='Monthly Income Here'
            />
            <p style= {{ color: 'red' }}>{formik.errors.amount}</p>
            <input
            type='text'
            name='description'
            value={formik.values.description}
            onChange={formik.handleChange}
            placeholder="Income Source Here"
            />
            <p style= {{ color: 'red' }}>{formik.errors.description}</p>
            <button type='Submit'>Add Income</button>
            <p>{message}</p>
        </form>{currentUser.income && currentUser.income.length > 0 &&
        <CatBudgets currentUser={currentUser}/>}

    </div>)
    
}


export default Budgets
