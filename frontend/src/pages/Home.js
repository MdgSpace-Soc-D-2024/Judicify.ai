import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { handleSuccess, handleError } from '../utils'
import { ToastContainer } from 'react-toastify'
function Home(){
    const [loggedinUser, setLoggedInUser]= useState("")
    const [content, setContent] = useState(['']);
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
     const fetchContent = async () => {
        try {
            const url = "http://localhost:1818/content";
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('jwtToken')
                }
            }
            const response = await fetch(url, headers);
            const result = await response.json();
            console.log(result);
            setContent(result);
        } catch (err) {
            handleError(err);
        }
    }
    useEffect(() => {
        fetchContent()
    }, [])

    return (
        <div>
            <h1>Welcome {loggedinUser} !</h1>
            <button onClick={handleLogout}>Logout</button>
            <div>
                {
                    content && content?.map((item, index) => (
                        <ul key={index}>
                            <span>{item.name} : {item.description}</span>
                        </ul>
                    ))
                }
            </div>
            <ToastContainer />
        </div>
    )
}

export default Home