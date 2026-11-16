import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const API = 'http://localhost:5000/api/cart';

export default function Cart() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const [items, setItems] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const loadCart = useCallback(async () => {
        try {
            const response = await fetch(`${API}/${user.id}`);
            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to load cart');
                return;
            }

            setItems(data.items);
        } catch {
            setError('Could not connect to server');
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        if (user) {
            loadCart();
        } else {
            setLoading(false);
        }
    }, [loadCart]);

    const updateQuantity = async (item, quantity) => {
        setError('');

        const response = await fetch(`${API}/items/${item.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity })
        });

        if (!response.ok) {
            const data = await response.json();
            setError(data.error || 'Failed to update item');
            return;
        }

        loadCart();
    };

    const removeItem = async (item) => {
        setError('');

        const response = await fetch(`${API}/items/${item.id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const data = await response.json();
            setError(data.error || 'Failed to remove item');
            return;
        }

        loadCart();
    };

    const total = items.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
    );

    if (!user) {
        return (
            <div>
                <Navbar />
                <div className="web-page">
                    <h1>Your Cart</h1>
                    <p>Please <Link to="/">log in</Link> to view your cart.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />

            <div className="web-page">
                <h1>Your Cart</h1>

                {error && <p className="error">{error}</p>}
                {loading && <p>Loading...</p>}

                {!loading && items.length === 0 && (
                    <p>Your cart is empty. <Link to="/shop">Browse products</Link></p>
                )}

                {items.length > 0 && (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Subtotal</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>${Number(item.price).toFixed(2)}</td>
                                        <td>
                                            <button
                                                disabled={item.quantity <= 1}
                                                onClick={() => updateQuantity(item, item.quantity - 1)}
                                            >
                                                -
                                            </button>
                                            {item.quantity}
                                            <button onClick={() => updateQuantity(item, item.quantity + 1)}>
                                                +
                                            </button>
                                        </td>
                                        <td>${(Number(item.price) * item.quantity).toFixed(2)}</td>
                                        <td>
                                            <button onClick={() => removeItem(item)}>Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <h2>Total: ${total.toFixed(2)}</h2>
                        <Link to="/checkout">Proceed to Checkout</Link>
                    </>
                )}
            </div>
        </div>
    );
}