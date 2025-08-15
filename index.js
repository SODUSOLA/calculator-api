// Import Express
const express = require('express');

// Import readline to read user input from terminal
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

// Import mongoose for MongoDB connection
const mongoose = require('mongoose');


// Import model for database management
const Calculation = require('./models/calculation.js');


// Create Express app
const app = express();

// Store last calculation
let lastCalculation = { num1: null, num2: null, operation: null, result: null };

// Homepage route with welcome message showing last calculation
app.get('/', (_, res) => {
    const { num1, num2, operation, result } = lastCalculation;
    
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Calculator API</title>
        <style>
            body { 
                margin: 0; 
                padding: 0; 
                font-family: Arial; 
                display: flex; 
                flex-direction: column;
                justify-content: center; 
                align-items: center; 
                min-height: 100vh; 
                background: rgb(46, 165, 159); 
            }
            .calculator-container { 
                text-align: center; 
                padding: 40px; 
                background: white; 
                border-radius: 12px; 
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                margin-bottom: 20px;
            }
            h1 { 
                font-size: 2.5rem; 
                color: #2c3e50; 
            }
            .result { 
                background: #f8f9fa; 
                padding: 20px; 
                border-radius: 8px; 
                margin: 20px 0; 
            }
            code { 
                background: #ecf0f1; 
                padding: 2px 6px; 
                border-radius: 4px; 
                color: #e74c3c; 
            }
            .reload-container {
                text-align: center;
            }
            #reload-btn {
                padding: 12px 24px;
                font-size: 1rem;
                background: #2c3e50;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background 0.3s;
            }
            #reload-btn:hover {
                background: rgb(42, 102, 10);
            }
        </style>
    </head>
    <body>
        <div class="calculator-container">
            <h1>🧮 Calculator API</h1>
            <div class="result">
                <h2>Last Calculation</h2>
                ${lastCalculation.result ? `
                    <p>${num1} ${operation} ${num2} = <strong>${result}</strong></p>
                ` : '<p>No calculations yet. Use the terminal first!</p>'}
            </div>
            <p>Supported operations: 
                <code>add</code>, <code>subtract</code>, 
                <code>multiply</code>, <code>divide</code>
            </p>
        </div>
        
        <div class="reload-container">
            <button id="reload-btn">🔄 Reload Results</button>
        </div>

        <script>
            document.getElementById('reload-btn').addEventListener('click', () => {
                fetch(window.location.href, {
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                })
                .then(() => {
                    location.reload(true);
                });
            });
        </script>
    </body>
    </html>
    `);
});

// Function to do calculation
function calculate(num1, num2, operation) {
    if (operation === 'add') return num1 + num2;
    if (operation === 'subtract') return num1 - num2;
    if (operation === 'multiply') return num1 * num2;
    if (operation === 'divide') {
        return num2 !== 0 ? num1 / num2 : 'Error: Division by zero';
    }
    return 'Invalid operation';
}

// Function to ask user input in terminal
function UserPrompt() {
    readline.question('Enter the first number: ', (num1) => {
        readline.question('Enter the second number: ', (num2) => {
            readline.question('Choose operation (add, subtract, multiply, divide):\n', (operation) => {
                const n1 = parseFloat(num1);
                const n2 = parseFloat(num2);
                if (isNaN(n1) || isNaN(n2)) {
                    console.log('❌ Invalid number input.\n');
                    return UserPrompt();
                }
                const ValidOperation = ['add', 'subtract', 'multiply', 'divide'];
                if (!ValidOperation.includes(operation)) {
                    console.log('❌ Invalid operation. Please choose add, subtract, multiply, or divide.\n');
                    return UserPrompt();
                }
                const result = calculate(n1, n2, operation);
                lastCalculation = { num1: n1, num2: n2, operation, result };
                console.log(`✅ Result: ${result}\n`);

                // Printing message to the console to indicate that the calculation is done
                console.log("🖥️ Calculation completed! Open the browser to see the updated result.");
                const newCalculation = new Calculation({
                    num1: n1,
                    num2: n2,
                    operation,
                    result
                });

                newCalculation.save()
                    .then(() => {
                        console.log('🗃️ Calculation saved to Database');
                        UserPrompt(); // Loop again AFTER save is done
                    })
                    .catch(err => {
                        console.error('❌ Error saving calculation:', err);
                        UserPrompt(); // Still continue prompting if error occurs
                    });
            }); 
        });
    });
}
// Connect to mongodb then start Express server
mongoose.connect('mongodb://localhost:27017/calculatorDB')
.then(() => {
    console.log('✅ Connected to MongoDB');

    // Start Express server only after DB is connected
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`🌐 Server is running on http://localhost:${PORT}`);
        console.log(`🖥️ You can also try the calculator in this terminal:\n`);
        UserPrompt(); // Start CLI calculator
    });
})
.catch((err) => {
    console.error('❌ MongoDB connection error:', err);
});