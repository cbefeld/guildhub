const https = require('https');

const CONFIG = {
    API_KEY: 'user:1936-uR4ZMgWzKmv3kTrU4f7wN'
};

// Test 1: Check account info
function testAccount() {
    console.log('🔍 Testing API authentication...');
    
    const options = {
        hostname: 'api.useapi.net',
        path: '/v2/account',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${CONFIG.API_KEY}`,
            'Content-Type': 'application/json'
        }
    };

    const req = https.request(options, (res) => {
        let data = '';
        
        console.log(`Status Code: ${res.statusCode}`);
        console.log(`Headers:`, res.headers);
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log('Response:', data);
            try {
                const response = JSON.parse(data);
                console.log('Parsed Response:', JSON.stringify(response, null, 2));
            } catch (error) {
                console.log('Failed to parse JSON:', error.message);
            }
        });
    });

    req.on('error', (error) => {
        console.error('Request error:', error);
    });

    req.end();
}

// Test 2: Simple imagine request
function testImagine() {
    console.log('\n🎨 Testing simple imagine request...');
    
    const requestData = {
        prompt: 'a simple red dragon, fantasy art --ar 1:1'
    };

    const postData = JSON.stringify(requestData);
    
    const options = {
        hostname: 'api.useapi.net',
        path: '/v2/jobs/imagine',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${CONFIG.API_KEY}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = https.request(options, (res) => {
        let data = '';
        
        console.log(`Status Code: ${res.statusCode}`);
        console.log(`Headers:`, res.headers);
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log('Response:', data);
            try {
                const response = JSON.parse(data);
                console.log('Parsed Response:', JSON.stringify(response, null, 2));
            } catch (error) {
                console.log('Failed to parse JSON:', error.message);
            }
        });
    });

    req.on('error', (error) => {
        console.error('Request error:', error);
    });

    req.write(postData);
    req.end();
}

console.log('🧪 Running useapi.net API tests...\n');

// Run tests
testAccount();

setTimeout(() => {
    testImagine();
}, 2000);