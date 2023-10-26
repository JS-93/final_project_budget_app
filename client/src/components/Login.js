import React, { useState } from "react";
import { useDispatch } from 'react-redux'
import { setUser } from '../actions/useractions'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const Login = () => {
    const [isError, setIsError] = useState(false);
    const dispatch = useDispatch();


    const LoginSchema = Yup.object().shape({
        username: Yup.string()
        .required('Username is required'),
        password: Yup.string()
        .required('Password is required.')
    })

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: LoginSchema,
        onSubmit: (values, { resetForm }) => {
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })
            .then(resp => {
                if (!resp.ok) {
                    console.error('Login failed.')
                    setIsError(true)
                    throw new Error('Login failed.');
                }
                return resp.json();
            })
            .then(data => {
                if(data.user) {
                    dispatch(setUser(data.user))
                    setIsError(false)
                    resetForm();
                }
            })
            .catch(e => {
                console.error(e)
            })
        }
    })
    return <div>
            <h1>Login Here</h1>
            <form onSubmit={formik.handleSubmit}>
                <input
                type='text'
                name='username'
                value={formik.values.username}
                onChange={formik.handleChange}
                placeholder='Username'
                />
                <p style= {{ color: 'red' }}>{formik.errors.username}</p>
                <input
                type='password'
                name='password'
                value={formik.values.password}
                onChange={formik.handleChange}
                placeholder='Password'
                />
                <p style= {{ color: 'red' }}>{formik.errors.password}</p>
                <button type='submit'>Login</button>
            </form>
            {isError && <p>Username or password not found.</p>}
            
        </div>
    
}

export default Login
