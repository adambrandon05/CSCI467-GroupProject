const BASE_URL = 'http://localhost:5000/api/auth';

// Generate a new email each time to avoid duplicates
const email = `test${Date.now()}@example.com`;
const password = 'test123';

async function testAuth() {
    try {
        // TEST 1: Register
        console.log('\n--- Testing Registration ---');

        const registerResponse = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const registerData = await registerResponse.json();

        console.log('Status:', registerResponse.status);
        console.log('Response:', registerData);

        // TEST 2: Login
        console.log('\n--- Testing Login ---');

        const loginResponse = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const loginData = await loginResponse.json();

        console.log('Status:', loginResponse.status);
        console.log('Response:', loginData);

        // TEST 3: Incorrect Password
        console.log('\n--- Testing Invalid Login ---');

        const invalidResponse = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password: 'wrongpassword'
            })
        });

        const invalidData = await invalidResponse.json();

        console.log('Status:', invalidResponse.status);
        console.log('Response:', invalidData);

    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

testAuth();
