import { Navigate, Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import { useState } from 'react';
import RefreshHandler from './RefreshHandler';
import Advisory from './pages/Advisory.js';
import Room from './pages/Room.js';
import JoinRoom from './pages/JoinRoom.js';
import CreateR from './pages/CreateRoom.js';
import ChatRoom from './pages/ChatRoom.js';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const PrivateRoute = ({element}) => {
    return isAuthenticated ? element : <Navigate to = "/login" />
  }
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        return <Navigate to="/login" />;
    }
    return children;
  };
  return (
    <div className="App">
        <RefreshHandler setIsAuthenticated = {setIsAuthenticated} />
      <Routes>
        <Route path='/' element={<Navigate to = "/login" />}/>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<PrivateRoute element={<Home />} />} />
        <Route path='/advisory' element={<ProtectedRoute><Advisory /></ProtectedRoute>} />
        <Route path='/room' element={<ProtectedRoute><Room /></ProtectedRoute>} />
        <Route path='/room/join' element={<ProtectedRoute><JoinRoom /></ProtectedRoute>} />
        <Route path='/room/create' element={<ProtectedRoute><CreateR /></ProtectedRoute>} />
        <Route path="/room/:roomId" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
