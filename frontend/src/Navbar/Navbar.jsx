import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="navbar">
            <h1 className="navbar-title">Website Name</h1>

            <div className="navbar-links">
                <Link to="/home">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/shop">Shop</Link>
                <Link to="/mycart">My Cart</Link>
                <Link to="/checkout">Checkout</Link>
            </div>
        </nav>
    );
}