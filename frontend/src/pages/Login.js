import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { handleError, handleSuccess } from '../utils'


function Login(){


    const navigate = useNavigate()
    const[LoginInfo, setLoginInfo] = useState({
        email:"",
        password:""
    })

    const handleChange = (e) => {
        const{name, value} = e.target;
        const copyLoginInfo = {...LoginInfo};
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo)
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const {email, password} = LoginInfo
        if(!email ||!password){
            return handleError("All fields are required, try again!")
        }
        try{
            const url = "http://localhost:1818/auth/login/"
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(LoginInfo)
            })

            const result = await response.json();
            const { success, message, jwtToken, name, error } = result;
            if (success) {
                localStorage.setItem('jwtToken', jwtToken)
                localStorage.setItem('loggedinUser', name)
                handleSuccess(message);
                setTimeout(() => {
                    navigate ('/home')
                }, 1000)
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
            console.log(result);
        } catch(err){
            handleError(err)
        }
    }

    return(
        <div className="container">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input 
                        onChange={handleChange}
                        type='text'
                        name='email'
                        autoFocus
                        placeholder='Enter your email...'
                        value={LoginInfo.email}
                    />
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input
                        onChange={handleChange} 
                        type='password'
                        name='password'
                        autoFocus
                        placeholder='Enter your password...'
                        value={LoginInfo.password}
                    />
                </div>
                <button type='submit'>Login</button>
                <span>
                    Don't have an account ? 
                    <Link to ="/signup">Signup</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    )
}
export default Login