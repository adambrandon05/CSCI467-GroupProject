import { useEffect, useState } from 'react';

function App() {
    const [message, setMessage] = useState('Connecting...');

    useEffect(() => {
        fetch('http://localhost:5000/api/test')
            .then(res => res.json())
            .then(data => setMessage(data.message))
            .catch(() => setMessage('Connection failed'));
    }, []);

    return (
        <div>
            <h1>Auto Parts Store</h1>
            <p>{message}</p>
        </div>
    );
}

export default App;