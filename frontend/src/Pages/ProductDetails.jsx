import Navbar from '../Navbar/Navbar';
import { useParams, Link } from 'react-router-dom';

export default function ProductDetails() {
    const { id } = useParams();

    return (
        <div>
            <Navbar />
            <div className="web-page">
                <h1>Product Details</h1>
                <p>Selected product ID: {id}</p>
                <Link to="/products">
                    Back to Products
                    </Link>
            </div>
        </div>
    );
}