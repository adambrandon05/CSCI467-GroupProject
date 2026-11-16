import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch(
                'http://localhost:5000/api/auth/logout',
                {
                    method: 'POST',
                    credentials: 'include'
                }
            );

            if (!response.ok) {
                throw new Error('Logout failed');
            }

            localStorage.removeItem('user');
            navigate('/');

        } catch (error) {
            console.error('Logout failed:', error);
            alert('Could not log out. Please try again.');
        }
    };

    return (
        <nav className="navbar">
            <h1 className="navbar-title">Website Name</h1>

            <div className="navbar-links">
                <Link to="/home">Home</Link>
                <Link to="/shop">Shop</Link>
                <Link to="/mycart">My Cart</Link>

                <button
                    className="navbar-logout"
                    onClick={handleLogout}
                >
                    Logout
                </button>
                <Link to="/checkout">Checkout</Link>
                <Link to="/Products">Products</Link>
            </div>
        </nav>
    );
}