import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const Signup = () => {
    const [message, setMessage] = useState('')

    const SignUpSchema = Yup.object().shape({
        username: Yup.string()
        .required('Username is required.'),
        password: Yup.string()
        .required('Password is required.'),
        email: Yup.string()
        .required('Email is required.')
        .email('Invalid email format')
    })

    const formik = useFormik({
        initialValues: {
            email: '',
            username: '',
            password: '',

        },
        validationSchema: SignUpSchema,
        onSubmit: (values, { resetForm }) => {
            fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })
            .then(resp => resp.json())
            .then(data => {
                if (data.error) {
                    if (data.error === 'Username already taken.') {
                        setMessage('Username already taken.')
                    } else if (data.error === 'Email already in use.') {
                        setMessage('Email already in use.')
                    } 
                } else {
                    setMessage('Signed up successfully!')
                    resetForm();
                }
            })
            .catch(error => {
                console.error('Error:', error)
            })
            
            
        }
    })

    return ( <div>
        <h1>Sign up Here</h1>
        <form onSubmit={formik.handleSubmit}>
            <input
            type='text'
            name='email'
            value={formik.values.email}
            onChange={formik.handleChange}
            placeholder='Email here'
            />
            <p style= {{ color: 'red' }}>{formik.errors.email}</p>
            <input
            type='text'
            name='username'
            value={formik.values.username}
            onChange={formik.handleChange}
            placeholder='Username here'
            />
            <p style= {{ color: 'red' }}>{formik.errors.username}</p>
            <input
            type='password'
            name='password'
            value={formik.values.password}
            onChange={formik.handleChange}
            placeholder='Password here'
            />
            <p style= {{ color: 'red' }}>{formik.errors.password}</p>
            <button type='submit'>Sign up</button>
        </form>
        <p>{message}</p>
    </div>)

}

export default Signup
