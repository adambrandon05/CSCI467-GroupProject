import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const API = 'http://localhost:5000/api/cart';

export default function Cart() {
    const [items, setItems] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(null);

    const loadCart = useCallback(async () => {
        try {
            const response = await fetch(API, {
                credentials: 'include'
            });

            if (response.status === 401) {
                setLoggedIn(false);
                setItems([]);
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to load cart');
                return;
            }

            setLoggedIn(true);
            setError('');
            setItems(data.items);

        } catch {
            setError('Could not connect to server');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCart();
    }, [loadCart]);

    const updateQuantity = async (item, quantity) => {
        setError('');

        try {
            const response = await fetch(`${API}/items/${item.id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity })
            });

            if (response.status === 401) {
                setLoggedIn(false);
                setItems([]);
                return;
            }

            if (!response.ok) {
                const data = await response.json();
                setError(data.error || 'Failed to update item');
                return;
            }

            await loadCart();

        } catch {
            setError('Could not connect to server');
        }
    };

    const removeItem = async (item) => {
        setError('');

        try {
            const response = await fetch(`${API}/items/${item.id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.status === 401) {
                setLoggedIn(false);
                setItems([]);
                return;
            }

            if (!response.ok) {
                const data = await response.json();
                setError(data.error || 'Failed to remove item');
                return;
            }

            await loadCart();

        } catch {
            setError('Could not connect to server');
        }
    };

    const total = items.reduce(
        (sum, item) =>
            sum + Number(item.price) * Number(item.quantity),
        0
    );

    if (loggedIn === false) {
        return (
            <div>
                <Navbar />
                <div className="web-page">
                    <h1>Your Cart</h1>
                    <p>
                        Please <Link to="/">log in</Link> to view your cart.
                    </p>
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

                {!loading && loggedIn && items.length === 0 && (
                    <p>
                        Your cart is empty.{' '}
                        <Link to="/shop">Browse products</Link>
                    </p>
                )}

                {loggedIn && items.length > 0 && (
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

                                        <td>
                                            ${Number(item.price).toFixed(2)}
                                        </td>

                                        <td>
                                            <button
                                                disabled={item.quantity <= 1}
                                                onClick={() =>
                                                    updateQuantity(
                                                        item,
                                                        item.quantity - 1
                                                    )
                                                }
                                            >
                                                -
                                            </button>

                                            {item.quantity}

                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        item,
                                                        item.quantity + 1
                                                    )
                                                }
                                            >
                                                +
                                            </button>
                                        </td>

                                        <td>
                                            ${(Number(item.price) *
                                                Number(item.quantity)).toFixed(2)}
                                        </td>

                                        <td>
                                            <button
                                                onClick={() => removeItem(item)}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <h2>Total: ${total.toFixed(2)}</h2>

                        <Link to="/checkout">
                            Proceed to Checkout
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}