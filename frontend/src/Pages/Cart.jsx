import Navbar from '../Navbar/Navbar';

export default function Cart() {
    return (
        <div>
            <Navbar />

            <div className="web-page">
                <h1>View your Cart Here!</h1>
                <p>User can view, modify, and remove items in cart.</p>
            </div>
        </div>
    );
}