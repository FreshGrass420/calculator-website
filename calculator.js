// BMI Calculator
function calculateBMI() {
    const height = parseFloat(document.getElementById('bmi-height').value);
    const weight = parseFloat(document.getElementById('bmi-weight').value);
    
    if (!height || !weight || height <= 0 || weight <= 0) {
        alert('Please enter valid height and weight values');
        return;
    }
    
    const bmi = weight / Math.pow(height / 100, 2);
    const resultDiv = document.getElementById('bmi-result');
    const valueDiv = document.getElementById('bmi-value');
    const categoryDiv = document.getElementById('bmi-category');
    
    valueDiv.textContent = bmi.toFixed(2);
    
    let category = '';
    let recommendation = '';
    
    if (bmi < 18.5) {
        category = 'Underweight';
        recommendation = 'Consider consulting a nutritionist for healthy weight gain strategies.';
    } else if (bmi >= 18.5 && bmi < 25) {
        category = 'Normal Weight';
        recommendation = 'Great job! Maintain your healthy lifestyle.';
    } else if (bmi >= 25 && bmi < 30) {
        category = 'Overweight';
        recommendation = 'Consider increasing physical activity and reviewing your diet.';
    } else {
        category = 'Obese';
        recommendation = 'It\'s recommended to consult with a healthcare professional.';
    }
    
    categoryDiv.innerHTML = `<strong>Category:</strong> ${category}<br><small>${recommendation}</small>`;
    resultDiv.style.display = 'block';
    
    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Scientific Calculator
let sciExpression = '';
let lastResult = '0';

function sciInput(val) {
    if (lastResult !== '0' && sciExpression === '') {
        sciExpression = '';
    }
    sciExpression += val;
    updateDisplay();
}

function sciOp(op) {
    if (sciExpression && !sciExpression.endsWith(' ')) {
        sciExpression += ' ' + op + ' ';
        updateDisplay();
    }
}

function sciFunc(func) {
    if (sciExpression) {
        if (func === 'sqrt') {
            sciExpression = 'Math.sqrt(' + sciExpression + ')';
        } else if (func === 'pow2') {
            sciExpression = 'Math.pow(' + sciExpression + ', 2)';
        } else if (func === 'sin') {
            sciExpression = 'Math.sin(' + sciExpression + ')';
        } else if (func === 'cos') {
            sciExpression = 'Math.cos(' + sciExpression + ')';
        } else if (func === 'log') {
            sciExpression = 'Math.log10(' + sciExpression + ')';
        }
        sciCalculate();
    }
}

function sciClear() {
    sciExpression = '';
    lastResult = '0';
    updateDisplay();
}

function sciCalculate() {
    try {
        if (!sciExpression) return;
        
        let evalExpr = sciExpression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
        let result = eval(evalExpr);
        
        if (isNaN(result) || !isFinite(result)) {
            document.getElementById('sci-display').textContent = 'Error';
            return;
        }
        
        result = Math.round(result * 1000000000) / 1000000000;
        lastResult = result.toString();
        document.getElementById('sci-display').textContent = result;
        sciExpression = result.toString();
        
    } catch (e) {
        document.getElementById('sci-display').textContent = 'Error';
        sciExpression = '';
    }
}

function updateDisplay() {
    document.getElementById('sci-display').textContent = sciExpression || '0';
}

// Compound Interest Calculator
function calculateCompound() {
    const principal = parseFloat(document.getElementById('ci-principal').value);
    const monthly = parseFloat(document.getElementById('ci-monthly').value) || 0;
    const rate = parseFloat(document.getElementById('ci-rate').value);
    const years = parseFloat(document.getElementById('ci-years').value);
    
    if (!principal || !rate || !years || principal <= 0 || rate < 0 || years <= 0) {
        alert('Please enter valid values for all fields');
        return;
    }
    
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    
    // Calculate future value with monthly contributions
    let futureValue = principal * Math.pow(1 + monthlyRate, months);
    
    if (monthly > 0) {
        const contributionValue = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        futureValue += contributionValue;
    }
    
    const totalContributions = principal + (monthly * months);
    const interestEarned = futureValue - totalContributions;
    
    const resultDiv = document.getElementById('ci-result');
    document.getElementById('ci-final').textContent = '$' + formatNumber(futureValue.toFixed(2));
    document.getElementById('ci-details').innerHTML = `
        <div>Total Contributions: <strong>$${formatNumber(totalContributions.toFixed(2))}</strong></div>
        <div>Interest Earned: <strong style="color: #51cf66;">$${formatNumber(interestEarned.toFixed(2))}</strong></div>
        <div>Return Rate: <strong>${(((futureValue - totalContributions) / totalContributions) * 100).toFixed(2)}%</strong></div>
    `;
    
    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Mortgage Calculator
function calculateMortgage() {
    const price = parseFloat(document.getElementById('mortgage-price').value);
    const downPayment = parseFloat(document.getElementById('mortgage-down').value) || 0;
    const rate = parseFloat(document.getElementById('mortgage-rate').value);
    const years = parseFloat(document.getElementById('mortgage-years').value);
    
    if (!price || !rate || !years || price <= 0 || rate < 0 || years <= 0) {
        alert('Please enter valid values for all fields');
        return;
    }
    
    const loanAmount = price - downPayment;
    const monthlyRate = rate / 100 / 12;
    const monthlyPayments = years * 12;
    
    let monthlyPayment;
    
    if (monthlyRate === 0) {
        monthlyPayment = loanAmount / monthlyPayments;
    } else {
        monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, monthlyPayments)) / 
                        (Math.pow(1 + monthlyRate, monthlyPayments) - 1);
    }
    
    const totalPaid = monthlyPayment * monthlyPayments;
    const totalInterest = totalPaid - loanAmount;
    
    const resultDiv = document.getElementById('mortgage-result');
    document.getElementById('mortgage-monthly').textContent = '$' + formatNumber(monthlyPayment.toFixed(2)) + '/month';
    document.getElementById('mortgage-details').innerHTML = `
        <div>Loan Amount: <strong>$${formatNumber(loanAmount.toFixed(2))}</strong></div>
        <div>Total Interest: <strong style="color: #ff6b6b;">$${formatNumber(totalInterest.toFixed(2))}</strong></div>
        <div>Total Paid: <strong>$${formatNumber(totalPaid.toFixed(2))}</strong></div>
        <div>Down Payment: <strong>$${formatNumber(downPayment.toFixed(2))}</strong> (${((downPayment/price)*100).toFixed(1)}%)</div>
    `;
    
    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Temperature Converter
function convertTemp() {
    const value = parseFloat(document.getElementById('temp-value').value);
    const from = document.getElementById('temp-from').value;
    
    if (isNaN(value)) {
        alert('Please enter a valid temperature');
        return;
    }
    
    let celsius, fahrenheit, kelvin;
    
    if (from === 'c') {
        celsius = value;
        fahrenheit = (value * 9/5) + 32;
        kelvin = value + 273.15;
    } else if (from === 'f') {
        celsius = (value - 32) * 5/9;
        fahrenheit = value;
        kelvin = celsius + 273.15;
    } else if (from === 'k') {
        celsius = value - 273.15;
        fahrenheit = (celsius * 9/5) + 32;
        kelvin = value;
    }
    
    const resultDiv = document.getElementById('temp-result');
    document.getElementById('temp-celsius').innerHTML = `<strong>Celsius:</strong> <span class="result-value">${celsius.toFixed(2)}°C</span>`;
    document.getElementById('temp-fahrenheit').innerHTML = `<strong>Fahrenheit:</strong> <span class="result-value">${fahrenheit.toFixed(2)}°F</span>`;
    document.getElementById('temp-kelvin').innerHTML = `<strong>Kelvin:</strong> <span class="result-value">${kelvin.toFixed(2)} K</span>`;
    
    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Helper function to format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Initialize scientific calculator display
document.addEventListener('DOMContentLoaded', function() {
    updateDisplay();
});
