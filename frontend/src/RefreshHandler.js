import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { jwtDecode } from "jwt-decode";

const RefreshHandler = ({ setIsAuthenticated }) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    setIsAuthenticated(true);
                    if (
                        location.pathname === '/' ||
                        location.pathname === '/login' ||
                        location.pathname === '/signup'
                    ) {
                        navigate('/home');
                    }
                } else {
                    setIsAuthenticated(false);
                    localStorage.removeItem('jwtToken');
                }
            } catch (error) {
                console.error('Invalid token', error);
                setIsAuthenticated(false);
                localStorage.removeItem('jwtToken');
            }
        }
    }, [location.pathname, navigate, setIsAuthenticated]);

    return null;
};

export default RefreshHandler;
