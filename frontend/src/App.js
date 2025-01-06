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
  return (
    <div className="App">
        <RefreshHandler setIsAuthenticated = {setIsAuthenticated} />
      <Routes>
        <Route path='/' element={<Navigate to = "/login" />}/>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<PrivateRoute element={<Home />} />} />
        <Route path='/advisory' element={<Advisory />} />
        <Route path='/room' element={<Room />} />
        <Route path='/room/join' element={<JoinRoom />} />
        <Route path='/room/create' element={<CreateR />} />
        <Route path="/room/:roomId" element={<ChatRoom />} />
      </Routes>
    </div>
  );
}

export default App;
