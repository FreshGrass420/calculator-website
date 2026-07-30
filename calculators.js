// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const calculators = document.querySelectorAll('.calculator');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const calculatorId = this.getAttribute('data-calculator');
            
            // Update active button
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update active calculator
            calculators.forEach(calc => calc.classList.remove('active'));
            document.getElementById(`${calculatorId}-calculator`).classList.add('active');
        });
    });
});

// BMI Calculator
function calculateBMI() {
    const weight = parseFloat(document.getElementById('bmi-weight').value);
    const height = parseFloat(document.getElementById('bmi-height').value);
    
    if (!weight || !height || weight <= 0 || height <= 0) {
        alert('Please enter valid weight and height values.');
        return;
    }
    
    // BMI = weight(kg) / height(m)^2
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    const bmiRounded = bmi.toFixed(1);
    
    let category = '';
    if (bmi < 18.5) {
        category = 'Underweight';
    } else if (bmi < 25) {
        category = 'Normal weight';
    } else if (bmi < 30) {
        category = 'Overweight';
    } else {
        category = 'Obese';
    }
    
    document.getElementById('bmi-value').textContent = bmiRounded;
    document.getElementById('bmi-category').textContent = category;
    document.getElementById('bmi-result').style.display = 'block';
}

// Scientific Calculator
let currentExpression = '';
let currentResult = '0';

function calcInput(value) {
    if (value === 'Math.PI') {
        currentExpression += Math.PI.toString();
    } else if (value === 'e') {
        currentExpression += Math.E.toString();
    } else {
        currentExpression += value;
    }
    document.getElementById('calc-expression').textContent = currentExpression;
}

function calcFunction(func) {
    switch(func) {
        case 'sin':
            document.getElementById('calc-expression').textContent = currentExpression + 'sin(';
            break;
        case 'cos':
            document.getElementById('calc-expression').textContent = currentExpression + 'cos(';
            break;
        case 'tan':
            document.getElementById('calc-expression').textContent = currentExpression + 'tan(';
            break;
        case 'sqrt':
            document.getElementById('calc-expression').textContent = currentExpression + 'sqrt(';
            break;
        case 'log':
            document.getElementById('calc-expression').textContent = currentExpression + 'log10(';
            break;
        case 'ln':
            document.getElementById('calc-expression').textContent = currentExpression + 'log(';
            break;
        case 'square':
            document.getElementById('calc-expression').textContent = currentExpression + '^2';
            break;
    }
}

function calcClear() {
    currentExpression = '';
    currentResult = '0';
    document.getElementById('calc-expression').textContent = '';
    document.getElementById('calc-result').textContent = '0';
}

function calcBackspace() {
    currentExpression = currentExpression.slice(0, -1);
    document.getElementById('calc-expression').textContent = currentExpression;
}

function calculateExpression() {
    try {
        let expr = currentExpression;
        
        // Replace mathematical functions
        expr = expr.replace(/sin\(/g, 'Math.sin(');
        expr = expr.replace(/cos\(/g, 'Math.cos(');
        expr = expr.replace(/tan\(/g, 'Math.tan(');
        expr = expr.replace(/sqrt\(/g, 'Math.sqrt(');
        expr = expr.replace(/log10\(/g, 'Math.log10(');
        expr = expr.replace(/log\(/g, 'Math.log(');
        
        // Handle factorial
        if (expr.includes('!')) {
            // Simple factorial implementation
            const match = expr.match(/(\d+)!/);
            if (match) {
                const num = parseInt(match[1]);
                let factorial = 1;
                for (let i = 2; i <= num; i++) {
                    factorial *= i;
                }
                expr = expr.replace(match[0], factorial.toString());
            }
        }
        
        // Handle exponentiation
        expr = expr.replace(/\^/g, '**');
        
        const result = eval(expr);
        currentResult = typeof result === 'number' && !isNaN(result) ? result.toString() : 'Error';
        document.getElementById('calc-result').textContent = currentResult;
    } catch (e) {
        document.getElementById('calc-result').textContent = 'Error';
    }
}

// Compound Interest Calculator
function calculateCompoundInterest() {
    const principal = parseFloat(document.getElementById('ci-principal').value);
    const rate = parseFloat(document.getElementById('ci-rate').value);
    const time = parseFloat(document.getElementById('ci-time').value);
    const compound = parseInt(document.getElementById('ci-compound').value);
    
    if (!principal || !rate || !time || principal <= 0 || rate <= 0 || time <= 0) {
        alert('Please enter valid values for all fields.');
        return;
    }
    
    // Compound Interest Formula: A = P(1 + r/n)^(nt)
    const r = rate / 100;
    const n = compound;
    const t = time;
    
    const futureValue = principal * Math.pow((1 + r / n), (n * t));
    const interestEarned = futureValue - principal;
    
    document.getElementById('ci-future-value').textContent = '$' + futureValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('ci-interest').textContent = '$' + interestEarned.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    // Show breakdown by year
    let breakdownHTML = '<h4>Year-by-Year Breakdown:</h4><table style="width:100%; border-collapse: collapse; margin-top:1rem;">';
    breakdownHTML += '<tr style="background:#667eea; color:white;"><th style="padding:0.5rem;">Year</th><th style="padding:0.5rem;">Balance</th><th style="padding:0.5rem;">Interest</th></tr>';
    
    let balance = principal;
    let totalInterest = 0;
    
    for (let year = 1; year <= time; year++) {
        const newBalance = principal * Math.pow((1 + r / n), (n * year));
        const yearlyInterest = newBalance - (year > 1 ? principal * Math.pow((1 + r / n), (n * (year - 1))) : principal);
        
        breakdownHTML += `<tr style="background:#f8f9ff;">
            <td style="padding:0.5rem; border:1px solid #e0e0e0;">${year}</td>
            <td style="padding:0.5rem; border:1px solid #e0e0e0;">$${newBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
            <td style="padding:0.5rem; border:1px solid #e0e0e0;">$${yearlyInterest.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
        </tr>`;
    }
    
    breakdownHTML += '</table>';
    document.getElementById('ci-breakdown').innerHTML = breakdownHTML;
    document.getElementById('ci-result').style.display = 'block';
}

// Mortgage Calculator
function calculateMortgage() {
    const homePrice = parseFloat(document.getElementById('mortgage-amount').value);
    const downPayment = parseFloat(document.getElementById('mortgage-downpayment').value);
    const annualRate = parseFloat(document.getElementById('mortgage-rate').value);
    const years = parseInt(document.getElementById('mortgage-years').value);
    
    if (!homePrice || !annualRate || !years || homePrice <= 0 || annualRate <= 0 || years <= 0) {
        alert('Please enter valid values for all fields.');
        return;
    }
    
    const loanAmount = homePrice - (downPayment || 0);
    if (loanAmount <= 0) {
        alert('Loan amount must be greater than 0.');
        return;
    }
    
    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = years * 12;
    
    // Monthly Payment Formula: M = P[r(1+r)^n]/[(1+r)^n - 1]
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                           (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;
    
    document.getElementById('mortgage-monthly').textContent = '$' + monthlyPayment.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('mortgage-total').textContent = '$' + totalPayment.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('mortgage-interest').textContent = '$' + totalInterest.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('mortgage-result').style.display = 'block';
}

// Temperature Converter
function convertTemperature() {
    const value = parseFloat(document.getElementById('temp-value').value);
    const fromUnit = document.getElementById('temp-from').value;
    const toUnit = document.getElementById('temp-to').value;
    
    if (isNaN(value)) {
        alert('Please enter a valid temperature value.');
        return;
    }
    
    let celsius, fahrenheit, kelvin;
    
    // Convert to Celsius first
    switch(fromUnit) {
        case 'C':
            celsius = value;
            break;
        case 'F':
            celsius = (value - 32) * 5/9;
            break;
        case 'K':
            celsius = value - 273.15;
            break;
    }
    
    // Convert from Celsius to other scales
    fahrenheit = (celsius * 9/5) + 32;
    kelvin = celsius + 273.15;
    
    // Display result based on selected conversion
    let resultValue, unitSymbol;
    switch(toUnit) {
        case 'C':
            resultValue = celsius.toFixed(2);
            unitSymbol = '°C';
            break;
        case 'F':
            resultValue = fahrenheit.toFixed(2);
            unitSymbol = '°F';
            break;
        case 'K':
            resultValue = kelvin.toFixed(2);
            unitSymbol = 'K';
            break;
    }
    
    document.getElementById('temp-result-value').textContent = `${resultValue} ${unitSymbol}`;
    document.getElementById('temp-celsius').textContent = celsius.toFixed(2) + ' °C';
    document.getElementById('temp-fahrenheit').textContent = fahrenheit.toFixed(2) + ' °F';
    document.getElementById('temp-kelvin').textContent = kelvin.toFixed(2) + ' K';
    document.getElementById('temp-result').style.display = 'block';
}
