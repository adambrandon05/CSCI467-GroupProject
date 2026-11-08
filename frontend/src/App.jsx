import { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthForm from './Login/AuthForm';
import Home from './Pages/Home';
import About from './Pages/About';
import Shop from './Pages/Shop';
import Cart from './Pages/Cart';
import ChckOut from './Pages/ChckOut';

function App() {
    const [message, setMessage] = useState('Connecting...');

    useEffect(() => {
        fetch('http://localhost:5000/api/test')
            .then(res => res.json())
            .then(data => setMessage(data.message))
            .catch(() => setMessage('Connection failed'));
    }, []);

    return (
        <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/mycart" element={<Cart />} />
        <Route path="/checkout" element={<ChckOut />} />
      </Routes>
    </BrowserRouter>
    );
}  

export default App;