#!/usr/bin/env node
/**
 * Date Conversion Debug Test
 * Tests the date conversion functionality
 */

const http = require('http');

async function testDateConversion() {
    console.log('🧪 Testing Date Conversion...');
    console.log('-'.repeat(50));
    
    const testDates = [
        '2024-01-15',
        '2023-12-20',
        '2024-03-01',
        '2024-06-15',
        '2024-09-22',
        '2024-12-31'
    ];
    
    for (const date of testDates) {
        try {
            const result = await convertDate(date);
            console.log(`📅 ${date} → ${result}`);
        } catch (error) {
            console.log(`❌ ${date}: ${error.message}`);
        }
    }
    
    console.log('\n✅ Date conversion test completed!');
}

function convertDate(gregorianDate) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 8001,
            path: `/api/convert_date?date=${encodeURIComponent(gregorianDate)}`,
            method: 'GET'
        };
        
        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.success) {
                        resolve(response.solar_date);
                    } else {
                        reject(new Error(response.message));
                    }
                } catch (error) {
                    reject(new Error('Invalid JSON response'));
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.end();
    });
}

// Test API health
async function testApiHealth() {
    console.log('🔍 Testing API Health...');
    
    try {
        const response = await new Promise((resolve, reject) => {
            const options = {
                hostname: 'localhost',
                port: 8001,
                path: '/api/health',
                method: 'GET'
            };
            
            const req = http.request(options, (res) => {
                let data = '';
                
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);
                        resolve(response);
                    } catch (error) {
                        reject(new Error('Invalid JSON response'));
                    }
                });
            });
            
            req.on('error', (error) => {
                reject(error);
            });
            
            req.end();
        });
        
        if (response.success) {
            console.log('✅ API Health Check: OK');
            console.log(`📋 Message: ${response.message}`);
        } else {
            console.log('❌ API Health Check: Failed');
        }
    } catch (error) {
        console.log(`❌ API Health Check Error: ${error.message}`);
    }
}

// Run tests
async function runTests() {
    await testApiHealth();
    console.log('');
    await testDateConversion();
}

runTests().catch(console.error); 