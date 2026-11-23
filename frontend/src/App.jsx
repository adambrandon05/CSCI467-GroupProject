
import { useEffect, useState } from 'react';
import './App.css';

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Outlet
} from 'react-router-dom';

import AuthForm from './Login/AuthForm';
import Home from './Pages/Home';
import About from './Pages/About';
import Shop from './Pages/Shop';
import Cart from './Pages/Cart';
import ChckOut from './Pages/ChckOut';
import Products from './Pages/Products';
import ProductDetails from './Pages/ProductDetails';
import WarehouseOrders from './Pages/WarehouseOrders';

function ProtectedRoute() {
    const [authenticated, setAuthenticated] = useState(null);

    useEffect(() => {
        let active = true;

        async function checkSession() {
            try {
                const response = await fetch(
                    'http://localhost:5000/api/auth/me',
                    {
                        credentials: 'include'
                    }
                );

                if (active) {
                    setAuthenticated(response.ok);
                }
            } catch (error) {
                if (active) {
                    setAuthenticated(false);
                }
            }
        }

        checkSession();

        return () => {
            active = false;
        };
    }, []);

    if (authenticated === null) {
        return <p>Loading...</p>;
    }

    if (!authenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AuthForm />} />
                <Route path="/home" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/mycart" element={<Cart />} />
                <Route path="/checkout" element={<ChckOut />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />

                <Route element={<ProtectedRoute />}>
                    <Route
                        path="/warehouse"
                        element={<WarehouseOrders />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
