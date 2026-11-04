import Navbar from '../Navbar/Navbar';

export default function Home() {
    return (
        <div>
            <Navbar />

            <div className="web-page">
                <h1>Welcome to the Homepage!</h1>
                <p>You have successfully logged in.</p>
            </div>
        </div>
    );
}