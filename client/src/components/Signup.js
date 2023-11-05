import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Login from './Login'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import confetti from 'canvas-confetti'
import { Button } from "@chakra-ui/react";

const Signup = () => {
    const [message, setMessage] = useState('')
    const [showLogin, setShowLogin] = useState(false)

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
                    confetti({
                        angle: 90,
                        spread: 45,
                        origin: { x: 0.5, y: 0.5 }
                      });
                }
            })
            .catch(error => {
                console.error('Error:', error)
                
            })
            
            
        }
    })
    if (showLogin) {
        return <Login />;
    }

    return <div className='beginning_form'>
        
        <form onSubmit={formik.handleSubmit}>
        <h1 className='beginning_form_title'>Sign up Here</h1>
        <div className='beginning_form_input_group'>
        <FontAwesomeIcon icon={faEnvelope} className='fa_user'/>
            <input
            className='username_input_signup'
            type='text'
            name='email'
            value={formik.values.email}
            onChange={formik.handleChange}
            placeholder='Email here'
            />
            <p className='begin_formik_errors_email'>{formik.errors.email}</p>
            </div>
            <div className='beginning_form_input_group'>
            <FontAwesomeIcon icon={faUser} className='fa_user'/>
            <input
            className='username_input_signup'
            type='text'
            name='username'
            value={formik.values.username}
            onChange={formik.handleChange}
            placeholder='Username here'
            /></div>
            <p className='begin_formik_errors_username'>{formik.errors.username}</p>
            <div className='beginning_form_input_group'>
            <FontAwesomeIcon icon={faLock} className='fa_password'/>
            <input
            className='username_input_signup'
            type='password'
            name='password'
            value={formik.values.password}
            onChange={formik.handleChange}
            placeholder='Password here'
            />
            <p className='begin_formik_errors_password'>{formik.errors.password}</p>
            </div>
            <Button className='beginning_form_button' type='submit'>Sign up</Button><Button className='beginning_form_button' onClick={() => setShowLogin(true)}>Back to login</Button>
        </form>
        <p className='begin_form_message'>{message}</p>
    </div>

    

}

export default Signup
