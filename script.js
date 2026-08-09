// Scientific Calculator Logic
let sciExpression = '';
function sciInput(val) {
    sciExpression += val;
    document.getElementById('sci-display').innerText = sciExpression || '0';
}
function sciFn(fn) {
    if (fn === 'sqrt') sciExpression += 'Math.sqrt(';
    else if (fn === 'square') sciExpression += '**2';
    else sciExpression += `Math.${fn}(`;
    document.getElementById('sci-display').innerText = sciExpression;
}
function sciClear() {
    sciExpression = '';
    document.getElementById('sci-display').innerText = '0';
}
function sciBackspace() {
    sciExpression = sciExpression.slice(0, -1);
    document.getElementById('sci-display').innerText = sciExpression || '0';
}
function sciCalculate() {
    try {
        const result = eval(sciExpression);
        document.getElementById('sci-display').innerText = result;
        sciExpression = String(result);
    } catch {
        document.getElementById('sci-display').innerText = 'Error';
        sciExpression = '';
    }
}

// BMI Calculator
function calcBMI() {
    const h = parseFloat(document.getElementById('bmi-height').value) / 100;
    const w = parseFloat(document.getElementById('bmi-weight').value);
    if (!h || !w) return;
    const bmi = (w / (h * h)).toFixed(1);
    let cat = '', color = '';
    if (bmi < 18.5) { cat = 'Underweight'; color = '#3498db'; }
    else if (bmi < 25) { cat = 'Normal weight'; color = '#2ecc71'; }
    else if (bmi < 30) { cat = 'Overweight'; color = '#f39c12'; }
    else { cat = 'Obese'; color = '#e74c3c'; }
    
    document.getElementById('bmi-value').innerText = bmi;
    document.getElementById('bmi-category').innerText = cat;
    document.getElementById('bmi-category').style.color = color;
    document.getElementById('bmi-result').style.display = 'block';
}

// Compound Interest
function calcCI() {
    const p = parseFloat(document.getElementById('ci-principal').value) || 0;
    const contribAmt = parseFloat(document.getElementById('ci-contribution').value) || 0;
    const freqType = document.getElementById('ci-freq-type').value;
    const freqN = parseFloat(document.getElementById('ci-freq-n').value) || 1;
    const r = parseFloat(document.getElementById('ci-rate').value) / 100;
    const t = parseFloat(document.getElementById('ci-years').value);
    if (!t) return;

    // Convert contribution frequency to a per-day interval
    let daysPerInterval;
    if (freqType === 'days') daysPerInterval = freqN;
    else if (freqType === 'weeks') daysPerInterval = freqN * 7;
    else daysPerInterval = freqN * 30.4375; // average days per month

    const totalDays = t * 365;
    const dailyRate = r / 365;

    // Calculate using daily compounding with periodic contributions
    let total = p;
    let numContributions = 0;
    let totalContributed = p;

    for (let day = 1; day <= totalDays; day++) {
        // Apply daily interest
        total = total * (1 + dailyRate);
        // Add contribution if this day falls on a contribution interval
        if (day % Math.round(daysPerInterval) === 0) {
            total += contribAmt;
            totalContributed += contribAmt;
            numContributions++;
        }
    }

    const interest = total - totalContributed;

    document.getElementById('ci-total').innerText = '$' + total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('ci-contrib').innerText = '$' + totalContributed.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('ci-interest').innerText = '$' + interest.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('ci-result').style.display = 'block';
}

// Mortgage Calculator
function calcMortgage() {
    const price = parseFloat(document.getElementById('mg-price').value);
    const down = parseFloat(document.getElementById('mg-down').value) || 0;
    const rate = parseFloat(document.getElementById('mg-rate').value) / 100 / 12;
    const years = parseFloat(document.getElementById('mg-years').value);
    if (!price || !years) return;
    
    const loan = price - down;
    const n = years * 12;
    const monthly = (loan * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
    const totalPaid = monthly * n;
    const totalInterest = totalPaid - loan;
    
    document.getElementById('mg-monthly').innerText = '$' + monthly.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('mg-loan').innerText = '$' + loan.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('mg-interest').innerText = '$' + totalInterest.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('mg-total').innerText = '$' + totalPaid.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('mg-result').style.display = 'block';
}

// Temperature Converter
function convertTemp(source) {
    const c = document.getElementById('temp-c');
    const f = document.getElementById('temp-f');
    const k = document.getElementById('temp-k');
    
    if (source === 'c') {
        const val = parseFloat(c.value);
        if (!isNaN(val)) {
            f.value = (val * 9/5 + 32).toFixed(2);
            k.value = (val + 273.15).toFixed(2);
        }
    } else if (source === 'f') {
        const val = parseFloat(f.value);
        if (!isNaN(val)) {
            c.value = ((val - 32) * 5/9).toFixed(2);
            k.value = (((val - 32) * 5/9) + 273.15).toFixed(2);
        }
    } else if (source === 'k') {
        const val = parseFloat(k.value);
        if (!isNaN(val)) {
            c.value = (val - 273.15).toFixed(2);
            f.value = ((val - 273.15) * 9/5 + 32).toFixed(2);
        }
    }
}

// APY Calculator
function calcAPY() {
    const principal = parseFloat(document.getElementById('apy-principal').value) || 0;
    const rate = parseFloat(document.getElementById('apy-rate').value) / 100;
    const term = parseFloat(document.getElementById('apy-term').value);
    const unit = document.getElementById('apy-term-unit').value;
    const freq = parseInt(document.getElementById('apy-freq').value);
    
    if (!term || isNaN(rate)) return;
    
    let years = term;
    if (unit === 'days') years = term / 365;
    else if (unit === 'weeks') years = term / 52;
    else if (unit === 'months') years = term / 12;
    
    const n = freq;
    const finalAmount = principal * Math.pow(1 + rate/n, n * years);
    const interest = finalAmount - principal;
    const effectiveYield = (Math.pow(1 + rate/n, n) - 1) * 100;
    const multiplier = finalAmount / principal;
    const dailyInterest = interest / (years * 365);
    const doubleTime = rate > 0 ? (72 / (effectiveYield)).toFixed(1) : 'N/A';
    
    document.getElementById('apy-final').innerText = '$' + finalAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('apy-interest').innerText = '$' + interest.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('apy-effective').innerText = effectiveYield.toFixed(2) + '%';
    document.getElementById('apy-multiplier').innerText = multiplier.toFixed(2) + 'x';
    document.getElementById('apy-daily').innerText = '$' + dailyInterest.toFixed(2);
    document.getElementById('apy-double').innerText = doubleTime + ' years';
    document.getElementById('apy-result').style.display = 'block';
}
