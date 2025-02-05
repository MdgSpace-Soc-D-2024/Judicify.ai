import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { handleSuccess } from '../utils'
import { ToastContainer } from 'react-toastify'
function Advisory(){
    const [loggedinUser, setLoggedInUser]= useState("")
    const navigate = useNavigate();
    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedinUser'))
    }, [])

    const handleLogout = (e) => {
        localStorage.removeItem('loggedinUser')
        localStorage.removeItem('jwtToken')
        handleSuccess('User logged out!')
        setTimeout(()=>{
            navigate('/login')
        }, 1000)
    }

    const handleHome = (e) => {
        navigate('/home')
    }


    return (
        <div>
            <h1>Welcome to Advisory Section {loggedinUser} !</h1>
            <button onClick={handleLogout}>Logout</button>
            <br /><br />
            <button>Talk to Bot</button>
            <button onClick={handleHome}>Home</button>
            <ToastContainer />
        </div>
    )
}

export default Advisory