import React, { useState } from "react";
import { useDispatch } from 'react-redux'
import { setUser } from '../actions/useractions'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Signup from "./Signup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { Button } from "@chakra-ui/react";

const Login = () => {
    const [isError, setIsError] = useState(false);
    const [newUser, setNewUser] = useState(false)
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
    return <>{!newUser ? (
           
            <div className="beginning_form">
            
            <form onSubmit={formik.handleSubmit}>
            <h1 className='beginning_form_title'>Login Here</h1>
            <div className='beginning_form_input_group'>
            <FontAwesomeIcon icon={faUser} className='fa_user'/>
                <input
                className='username_input'
                type='text'
                name='username'
                value={formik.values.username}
                onChange={formik.handleChange}
                placeholder='Username'
                />
                <p className='begin_formik_errors_login_username'>{formik.errors.username}</p>
                </div>
                <div className='beginning_form_input_group'>
            <FontAwesomeIcon icon={faLock} className='fa_password'/>
                <input
                className='username_input'
                type='password'
                name='password'
                value={formik.values.password}
                onChange={formik.handleChange}
                placeholder='Password'
                />
                <p className="begin_formik_errors_login_password">{formik.errors.password}</p>
                </div>
                <Button variant='solid' className='beginning_form_button' type='submit'>Login</Button><Button variant='solid' className='beginning_form_button' onClick={() => setNewUser(true)}>New User?</Button>
            </form>
            {isError && <p className='begin_form_error'>Username or password not found.</p>}
            
        </div>) : (<Signup/>)}</>
    
}

export default Login
