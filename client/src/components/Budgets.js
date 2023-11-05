import React, { useState } from "react";
import { useFormik } from 'formik'
import * as Yup from 'yup'
import CatBudgets from "./CatBudgets";
import { useDispatch } from 'react-redux'
import { updateCurrentUser } from "../actions/useractions";
import { Link } from 'react-router-dom'
import { Button, Input, Text } from '@chakra-ui/react';
  


const Budgets = ( { currentUser } ) => {
    const [message, setMessage] = useState('')
    const [ok, setOk] = useState(false)
    const dispatch = useDispatch()


    const IncomeSchema = Yup.object().shape({
        amount: Yup.number()
        .typeError('Amount must be a valid number.')
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
                resetForm();
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

    
    const hasIncome =  currentUser.income.length > 0


    return (
        <div className='budgets_background'>
            
          <Link className='logout_link_budget' to='/logout'>Logout</Link>
          { !hasIncome ? (
            <><div className='form_budget_background'>
              { !ok ? <div className='budget_info'><Text fontWeight='extrabold'>This is the budget page: start by adding your monthly income! You'll be able to add more income on the main page.</Text>
              <Button onClick={() => setOk(true)}>Sounds good!</Button>
              </div> : ''}
              <form className="form_income_budget" onSubmit={formik.handleSubmit}>
              <Text fontWeight='extrabold' className='form_income_budget_title'>Please enter your income here</Text>
                <Input
                  variant='filled'
                  type='text'
                  name='amount'
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  placeholder='Monthly Income Here'
                />
                {formik.errors.amount && <p className='income_budget_error'>{formik.errors.amount}</p>}
                
                <Input
                  variant='filled'
                  type='text'
                  name='description'
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  placeholder="Income Source Here"
                />
                {formik.errors.description && <p className='income_description_error'>{formik.errors.description}</p>}
                <Button className='budget_income_button' type='Submit'>Add Income</Button>
                {message && <p>{message}</p>}
              </form></div>
            </>) : 
           
            <CatBudgets currentUser={currentUser} />}

        </div>
      );
    
}


export default Budgets
