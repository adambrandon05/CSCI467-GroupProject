
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

export default function ProductDetails() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadProduct() {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/products/${id}`
                );

                if (!response.ok) {
                    throw new Error('Product not found');
                }

                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadProduct();
    }, [id]);

    const handleAddToCart = async () => {
        setAdding(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch(
                'http://localhost:5000/api/cart/items',
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productId: Number(id),
                        quantity: 1
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Could not add item');
            }

            setMessage('Product added to cart!');
        } catch (err) {
            setError(err.message);
        } finally {
            setAdding(false);
        }
    };

    return (
        <div>
            <Navbar />

            <div className="web-page">
                {loading && <p>Loading product...</p>}

                {error && <p className="error">{error}</p>}
                {message && <p>{message}</p>}

                {product && (
                    <>
                        <h1>{product.Name}</h1>

                        <p>{product.Description}</p>

                        <h2>
                            ${Number(product.Price).toFixed(2)}
                        </h2>

                        <button
                            onClick={handleAddToCart}
                            disabled={adding}
                        >
                            {adding ? 'Adding...' : 'Add to Cart'}
                        </button>

                        <p>
                            <Link to="/mycart">View Cart</Link>
                        </p>
                    </>
                )}

                <Link to="/products">
                    Back to Products
                </Link>
            </div>
        </div>
    );
}
