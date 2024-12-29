import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { handleError, handleSuccess } from '../utils'

function Signup(){


    const navigate = useNavigate()
    const[SigninInfo, setSigninInfo] = useState({
        name:"",
        email:"",
        password:""
    })

    const handleChange = (e) => {
        const{name, value} = e.target;
        const copySigninInfo = {...SigninInfo};
        copySigninInfo[name] = value;
        setSigninInfo(copySigninInfo)
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        const {name, email, password} = SigninInfo
        if(!name || !email ||!password){
            return handleError("All fields are required, try again!")
        }
        try{
            const url = "http://localhost:1818/auth/signup/"
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(SigninInfo)
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
            }else if (error) {
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
            <h1>Signup</h1>
            <form onSubmit={handleSignup}>
                <div>
                    <label htmlFor='name'>Name</label>
                    <input 
                        onChange={handleChange}
                        type='text'
                        name='name'
                        autoFocus
                        placeholder='Enter your name...'
                        value={SigninInfo.name}
                    />
                </div>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input 
                        onChange={handleChange}
                        type='text'
                        name='email'
                        autoFocus
                        placeholder='Enter your email...'
                        value={SigninInfo.email}
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
                        value={SigninInfo.password}
                    />
                </div>
                <button type='submit'>Signup</button>
                <span>
                    Already Signed In ?
                    <Link to ="/login">Login</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    )
}
export default Signup