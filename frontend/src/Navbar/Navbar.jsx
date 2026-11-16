import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <nav className="navbar">
            <h1 className="navbar-title">Website Name</h1>

            <div className="navbar-links">
                <Link to="/home">Home</Link>
                <Link to="/shop">Shop</Link>
                <Link to="/mycart">My Cart</Link>
                <button className="navbar-logout" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
}