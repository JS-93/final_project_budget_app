import React, { useState } from "react";
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { updateCurrentUser } from "../actions/useractions";


const CatBudgetInput = ( { category, currentUser } ) => {
    const [message, setMessage] = useState('')
    const [showAddButton, setShowAddButton] = useState(true);
    const dispatch = useDispatch()


   
    const BudgetSchema = Yup.object().shape({
        amount: Yup.number()
        .required("You can type in 0 if you won't use this budget.")
    })

    const formik = useFormik({
        initialValues: {
            amount: '',
        },
        validationSchema: BudgetSchema,
        onSubmit: (values, { resetForm }) => {

            const newBudget = {
                amount: values.amount,
                category_id: category.id,
                user_id: currentUser.id,
            };
            fetch('/budgets', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBudget)
              })
              .then(resp => {
                if (!resp.ok) {
                 
                  return resp.json().then(data => {
                    throw new Error(data.message || 'An error occurred while adding the budget.');
                  });
                }
                return resp.json();
              })
              .then(data => {
                // Only update Redux state if the POST was successful
                setShowAddButton(false);
                const updatedBudget = [...currentUser.budgets, data];
                const updatedUser = {...currentUser, budgets: updatedBudget};
                dispatch(updateCurrentUser(updatedUser));
                resetForm();
              })
              .catch(error => {
                // Set the error message for the user to see
                setMessage(error.message);
              });
            
        }
    })

   

    return ( <div>
        <label>{category.name}</label>
        <form onSubmit={formik.handleSubmit}>
            <input
                type='number'
                name='amount'
                value={formik.values.amount}
                onChange={formik.handleChange}
                placeholder='Amount for budget'
            />
            <p style={{ color: 'black' }}>{formik.errors.amount}</p>
            <p>{message}</p>
            <div style={{ display: 'flex' }}>
                { showAddButton && <button type='submit'>Add Budget</button> }
            </div>
        </form>
    </div>)
}

export default CatBudgetInput
