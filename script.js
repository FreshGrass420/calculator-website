function updateFooter() {
    const year = new Date().getFullYear();
    document.getElementById('year').textContent = year;
}

function calcBMI() {
    const height = parseFloat(document.getElementById('bmi-height').value);
    const weight = parseFloat(document.getElementById('bmi-weight').value);
    if (height && weight) {
        const bmi = (weight / ((height / 100) ** 2)).toFixed(2);
        document.getElementById('bmi-result').innerText = `Your BMI is: ${bmi}`;
    }
}

function calcCompound() {
    const principal = parseFloat(document.getElementById('compound-principal').value);
    const rate = parseFloat(document.getElementById('compound-rate').value) / 100;
    const time = parseFloat(document.getElementById('compound-time').value);
    const n = parseFloat(document.getElementById('compound-n').value);
    if (principal && rate && time && n) {
        const amount = principal * Math.pow((1 + rate / n), n * time);
        document.getElementById('compound-result').innerText = `Final Amount: $${amount.toFixed(2)}`;
    }
}

function calcMortgage() {
    const principal = parseFloat(document.getElementById('mortgage-principal').value);
    const rate = parseFloat(document.getElementById('mortgage-rate').value) / 100 / 12;
    const months = parseFloat(document.getElementById('mortgage-years').value) * 12;
    if (principal && rate && months) {
        const x = Math.pow(1 + rate, months);
        const monthly = (principal * x * rate) / (x - 1);
        document.getElementById('mortgage-result').innerText = `Monthly Payment: $${monthly.toFixed(2)}`;
    }
}

function convertTemp() {
    const temp = parseFloat(document.getElementById('temp-input').value);
    const unit = document.getElementById('temp-unit').value;
    let result;
    if (unit === 'C') {
        result = (temp * 9/5) + 32;
        document.getElementById('temp-result').innerText = `${result.toFixed(2)} °F`;
    } else {
        result = (temp - 32) * 5/9;
        document.getElementById('temp-result').innerText = `${result.toFixed(2)} °C`;
    }
}

function calcAPY() {
    const principal = parseFloat(document.getElementById('apy-principal').value);
    const rate = parseFloat(document.getElementById('apy-rate').value) / 100;
    const term = parseFloat(document.getElementById('apy-term').value);
    const unit = document.getElementById('apy-term-unit').value;
    const n = parseFloat(document.getElementById('apy-frequency').value);
    
    let years = term;
    if (unit === 'd') years = term / 365;
    else if (unit === 'w') years = term / 52;
    else if (unit === 'm') years = term / 12;

    if (principal && rate && term && n) {
        const amount = principal * Math.pow((1 + rate / n), n * years);
        const interest = amount - principal;
        const effective = (Math.pow((1 + rate / n), n) - 1) * 100;
        const multiplier = amount / principal;
        const daily = interest / (years * 365);
        const double = 72 / (effective || 1);

        document.getElementById('apy-final').innerText = `$${amount.toFixed(2)}`;
        document.getElementById('apy-interest').innerText = `$${interest.toFixed(2)}`;
        document.getElementById('apy-effective').innerText = `${effective.toFixed(2)}%`;
        document.getElementById('apy-multiplier').innerText = `${multiplier.toFixed(2)}x`;
        document.getElementById('apy-daily').innerText = `$${daily.toFixed(2)}`;
        document.getElementById('apy-double').innerText = `${double.toFixed(1)} years`;
    }
}

document.addEventListener('DOMContentLoaded', updateFooter);