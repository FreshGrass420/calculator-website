// ============================================================
// Debounce utility for rate limiting
// ============================================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================================
// Safe Expression Parser (shunting-yard algorithm) - replaces eval()
// Updated: 2026-08-11 - Trigger GitHub Pages rebuild
// ============================================================
const PRECEDENCE = { '+':1, '-':1, '*':2, '/':2, '^':3 };
const RIGHT_ASSOC = { '^': true };
const FUNCS = { 'sin':Math.sin, 'cos':Math.cos, 'tan':Math.tan, 'log':Math.log10, 'ln':Math.log, 'sqrt':Math.sqrt };
const CONSTANTS = { 'pi': Math.PI, 'e': Math.E };

function tokenize(expr) {
    const tokens = [];
    let i = 0;
    while (i < expr.length) {
        const c = expr[i];
        if (c === ' ' || c === ',') { i++; continue; }
        if (/[0-9.]/.test(c)) {
            let num = '';
            while (i < expr.length && /[0-9.]/.test(expr[i])) num += expr[i++];
            // scientific notation
            if (expr[i] === 'e' && /[+-]/.test(expr[i+1])) {
                num += expr[i++] + expr[i++];
                while (i < expr.length && /[0-9]/.test(expr[i])) num += expr[i++];
            }
            tokens.push({ type:'num', value: parseFloat(num) });
            continue;
        }
        if (/[a-zA-Z]/.test(c)) {
            let name = '';
            while (i < expr.length && /[a-zA-Z0-9]/.test(expr[i])) name += expr[i++];
            name = name.toLowerCase();
            if (FUNCS[name]) tokens.push({ type:'func', value: name });
            else if (CONSTANTS[name] !== undefined) tokens.push({ type:'num', value: CONSTANTS[name] });
            else throw new Error('Unknown token: ' + name);
            continue;
        }
        if ('+-*/^()'.includes(c)) { tokens.push({ type:'op', value: c }); i++; continue; }
        throw new Error('Invalid character: ' + c);
    }
    return tokens;
}

function toRPN(tokens) {
    const output = [];
    const stack = [];
    for (const t of tokens) {
        if (t.type === 'num') output.push(t);
        else if (t.type === 'func') stack.push(t);
        else if (t.value === '(') stack.push(t);
        else if (t.value === ')') {
            while (stack.length && stack[stack.length-1].value !== '(') output.push(stack.pop());
            if (!stack.length) throw new Error('Mismatched parentheses');
            stack.pop();
            if (stack.length && stack[stack.length-1].type === 'func') output.push(stack.pop());
        }
        else if (t.type === 'op') {
            while (stack.length) {
                const top = stack[stack.length-1];
                if (top.type === 'func' || (top.type === 'op' && (PRECEDENCE[top.value] > PRECEDENCE[t.value] || (PRECEDENCE[top.value] === PRECEDENCE[t.value] && !RIGHT_ASSOC[t.value])))) {
                    output.push(stack.pop());
                } else break;
            }
            stack.push(t);
        }
    }
    while (stack.length) {
        const top = stack.pop();
        if (top.value === '(' || top.value === ')') throw new Error('Mismatched parentheses');
        output.push(top);
    }
    return output;
}

function evalRPN(rpn) {
    const stack = [];
    for (const t of rpn) {
        if (t.type === 'num') stack.push(t.value);
        else if (t.type === 'func') {
            if (!stack.length) throw new Error('Missing argument');
            stack.push(FUNCS[t.value](stack.pop()));
        }
        else if (t.type === 'op') {
            if (stack.length < 2) throw new Error('Missing operand');
            const b = stack.pop(), a = stack.pop();
            switch(t.value) {
                case '+': stack.push(a + b); break;
                case '-': stack.push(a - b); break;
                case '*': stack.push(a * b); break;
                case '/': stack.push(a / b); break;
                case '^': stack.push(Math.pow(a, b)); break;
            }
        }
    }
    if (stack.length !== 1) throw new Error('Invalid expression');
    return stack[0];
}

function safeEval(expr) {
    return evalRPN(toRPN(tokenize(expr)));
}

function formatResult(val) {
    if (!isFinite(val)) return 'Error';
    if (Math.abs(val) >= 1e15 || (Math.abs(val) < 1e-6 && val !== 0)) return val.toExponential(6);
    return parseFloat(val.toPrecision(12)).toString();
}

// ============================================================
// Scientific Calculator
// ============================================================
let sciExpression = '';
let sciMemory = 0;
let degMode = false;

function sciUpdateDisplay() {
    document.getElementById('sci-display').innerText = sciExpression || '0';
}

function sciInput(val) {
    sciExpression += val;
    sciUpdateDisplay();
}

function sciFn(fn) {
    if (fn === 'sqrt') sciExpression += 'sqrt(';
    else if (fn === 'square') sciExpression += '^2';
    else sciExpression += fn + '(';
    sciUpdateDisplay();
}

function sciClear() {
    sciExpression = '';
    sciUpdateDisplay();
}

function sciBackspace() {
    sciExpression = sciExpression.slice(0, -1);
    sciUpdateDisplay();
}

function sciToggleDeg() {
    degMode = !degMode;
    document.getElementById('deg-rad-toggle').innerText = degMode ? 'DEG' : 'RAD';
}

function sciFactorial() {
    sciExpression += '!';
    sciUpdateDisplay();
}

function sciPercent() {
    sciExpression += '/100';
    sciUpdateDisplay();
}

function sciReciprocal() {
    if (!sciExpression) {
        sciExpression = '1/';
    } else {
        sciExpression = '1/(' + sciExpression + ')';
    }
    sciUpdateDisplay();
}

function sciMemClear() { sciMemory = 0; }
function sciMemRecall() { sciExpression += String(sciMemory); sciUpdateDisplay(); }
function sciMemAdd() {
    try { sciMemory += safeEval(sciExpression); }
    catch(e) { document.getElementById('sci-display').innerText = 'Error'; }
}
function sciMemSubtract() {
    try { sciMemory -= safeEval(sciExpression); }
    catch(e) { document.getElementById('sci-display').innerText = 'Error'; }
}

function sciCalculate() {
    try {
        let expr = sciExpression;
        // Handle factorial
        expr = expr.replace(/(\d+(?:\.\d+)?|\))!/g, (match, base) => {
            const n = parseFloat(base);
            if (n < 0 || n !== Math.floor(n)) throw new Error('Invalid factorial');
            let f = 1;
            for (let i = 2; i <= n; i++) f *= i;
            return '(' + f + ')';
        });
        // Convert trig function arguments from degrees to radians
        if (degMode) {
            expr = expr.replace(/(sin|cos|tan)\(([^()]+)\)/g, (m, fn, arg) => fn + '((' + arg + ')*pi/180)');
        }
        const result = safeEval(expr);
        sciExpression = formatResult(result);
        sciUpdateDisplay();
    } catch {
        document.getElementById('sci-display').innerText = 'Error';
        sciExpression = '';
    }
}

// Keyboard support
document.addEventListener('keydown', function(e) {
    const key = e.key;
    const display = document.getElementById('sci-display');
    if (!display) return;
    // Only intercept if the scientific calculator is visible (on index.html)
    if (!document.querySelector('.sci-grid')) return;
    // Don't intercept if user is typing in an input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

    if (/[0-9.]/.test(key)) { sciInput(key); e.preventDefault(); }
    else if (['+', '-', '*', '/', '(', ')'].includes(key)) { sciInput(key); e.preventDefault(); }
    else if (key === '^') { sciInput('^'); e.preventDefault(); }
    else if (key === 'Enter') { sciCalculateDebounced(); e.preventDefault(); }
    else if (key === 'Backspace') { sciBackspace(); e.preventDefault(); }
    else if (key === 'Escape') { sciClear(); e.preventDefault(); }
    else if (key === 'p' || key === 'P') { sciInput('pi'); e.preventDefault(); }
});

// ============================================================
// BMI Calculator with input validation
// ============================================================
function calcBMI() {
    const h = parseFloat(document.getElementById('bmi-height').value);
    const w = parseFloat(document.getElementById('bmi-weight').value);

    if (!h || h <= 0 || isNaN(h)) {
        alert('Please enter a valid height greater than 0.');
        return;
    }
    if (!w || w <= 0 || isNaN(w)) {
        alert('Please enter a valid weight greater than 0.');
        return;
    }

    const heightM = h / 100;
    const bmi = (w / (heightM * heightM)).toFixed(1);
    let cat = '', color = '';
    if (bmi < 18.5) { cat = 'Underweight'; color = '#3498db'; }
    else if (bmi < 25) { cat = 'Normal weight'; color = '#2ecc71'; }
    else if (bmi < 30) { cat = 'Overweight'; color = '#f39c12'; }
    else if (bmi < 35) { cat = 'Obese (Class I)'; color = '#e74c3c'; }
    else if (bmi < 40) { cat = 'Obese (Class II)'; color = '#c0392b'; }
    else { cat = 'Obese (Class III)'; color = '#8e44ad'; }

    document.getElementById('bmi-value').innerText = bmi;
    document.getElementById('bmi-category').innerText = cat;
    document.getElementById('bmi-category').style.color = color;
    document.getElementById('bmi-result').style.display = 'block';
    copyShareData.bmi = 'BMI: ' + bmi + ' (' + cat + ')';
}

// ============================================================
// Compound Interest - formula-based (no loop)
// ============================================================
function calcCI() {
    const p = parseFloat(document.getElementById('ci-principal').value);
    const contribAmt = parseFloat(document.getElementById('ci-contribution').value);
    const freqType = document.getElementById('ci-freq-type').value;
    const freqN = parseFloat(document.getElementById('ci-freq-n').value);
    const r = parseFloat(document.getElementById('ci-rate').value);
    const t = parseFloat(document.getElementById('ci-years').value);

    if (isNaN(p) || p < 0) { alert('Please enter a valid initial investment (0 or greater).'); return; }
    if (isNaN(r) || r < 0) { alert('Please enter a valid interest rate (0 or greater).'); return; }
    if (isNaN(t) || t <= 0) { alert('Please enter a valid number of years (greater than 0).'); return; }
    if (isNaN(freqN) || freqN <= 0) { alert('Please enter a valid contribution interval (greater than 0).'); return; }

    const contrib = (isNaN(contribAmt) || contribAmt < 0) ? 0 : contribAmt;

    // Convert contribution frequency to periods per year
    let contribsPerYear;
    if (freqType === 'days') contribsPerYear = 365 / freqN;
    else if (freqType === 'weeks') contribsPerYear = 52 / freqN;
    else contribsPerYear = 12 / freqN;

    const annualRate = r / 100;
    const n = 365; // daily compounding
    const dailyRate = annualRate / n;

    // Future value of principal: P(1+r/n)^(nt)
    const fvPrincipal = p * Math.pow(1 + dailyRate, n * t);

    // Future value of contributions (annuity with daily compounding):
    // FV = PMT * [((1+r/n)^(nt) - 1) / (r/n)] adjusted for contribution frequency
    let fvContrib = 0;
    if (contrib > 0 && annualRate > 0) {
        // Contributions made contribsPerYear times per year
        // Use the effective rate per contribution period
        const periodsPerYear = contribsPerYear;
        const totalContributions = Math.floor(periodsPerYear * t);
        const ratePerPeriod = Math.pow(1 + dailyRate, n / periodsPerYear) - 1;
        fvContrib = contrib * ((Math.pow(1 + ratePerPeriod, totalContributions) - 1) / ratePerPeriod);
    } else if (contrib > 0) {
        fvContrib = contrib * contribsPerYear * t;
    }

    const total = fvPrincipal + fvContrib;
    const totalContributed = p + contrib * contribsPerYear * t;
    const interest = total - totalContributed;

    const fmt = v => '$' + v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('ci-total').innerText = fmt(total);
    document.getElementById('ci-contrib').innerText = fmt(totalContributed);
    document.getElementById('ci-interest').innerText = fmt(interest);
    document.getElementById('ci-result').style.display = 'block';
    copyShareData.ci = 'Compound Interest: ' + fmt(total) + ' (Interest: ' + fmt(interest) + ')';
}

// ============================================================
// Mortgage Calculator with tax, insurance, PMI, HOA,
// payment breakdown, donut chart, and amortization schedule
// ============================================================
const MORTGAGE_INPUT_IDS = ['mg-price', 'mg-down', 'mg-rate', 'mg-years', 'mg-prop-tax', 'mg-insurance', 'mg-pmi', 'mg-hoa'];
const MORTGAGE_DONUT_COLORS = { pni: '#667eea', tax: '#f39c12', insurance: '#2ecc71', pmi: '#e74c3c', hoa: '#9b59b6' };
let amortSchedule = [];

function fmtMoney(v) { return '$' + v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

function calcMortgage(silent) {
    const price = parseFloat(document.getElementById('mg-price').value);
    const downInput = parseFloat(document.getElementById('mg-down').value);
    const rate = parseFloat(document.getElementById('mg-rate').value);
    const years = parseFloat(document.getElementById('mg-years').value);
    const propTax = parseFloat(document.getElementById('mg-prop-tax').value) || 0;
    const insurance = parseFloat(document.getElementById('mg-insurance').value) || 0;
    const pmi = parseFloat(document.getElementById('mg-pmi').value) || 0;
    const hoa = parseFloat(document.getElementById('mg-hoa').value) || 0;

    const fail = (msg) => { if (!silent) alert(msg); return false; };

    if (isNaN(price) || price <= 0) return fail('Please enter a valid home price greater than 0.');
    if (isNaN(years) || years <= 0) return fail('Please enter a valid loan term greater than 0.');
    if (isNaN(rate) || rate < 0) return fail('Please enter a valid interest rate (0 or greater).');
    if (isNaN(downInput) || downInput < 0) return fail('Please enter a valid down payment (0 or greater).');
    if (propTax < 0 || insurance < 0 || pmi < 0 || hoa < 0) return fail('Optional costs cannot be negative.');

    const downMode = document.getElementById('mg-down-mode').value;
    let down = downInput;
    if (downMode === '%') {
        if (downInput > 100) return fail('Down payment percentage cannot exceed 100%.');
        down = price * downInput / 100;
    }
    if (down >= price) return fail('Down payment must be less than the home price.');

    const loan = price - down;
    const n = Math.round(years * 12);
    const monthlyRate = rate / 100 / 12;

    let monthlyPnI;
    if (rate === 0) {
        monthlyPnI = loan / n;
    } else {
        monthlyPnI = (loan * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    }

    const monthlyTax = propTax / 12;
    const monthlyInsurance = insurance / 12;
    const totalMonthly = monthlyPnI + monthlyTax + monthlyInsurance + pmi + hoa;
    const totalPaid = totalMonthly * n;
    const totalInterest = (monthlyPnI * n) - loan;
    const downPct = (down / price) * 100;

    document.getElementById('mg-monthly').innerText = fmtMoney(totalMonthly) + ' /mo';
    document.getElementById('mg-loan').innerText = fmtMoney(loan);
    document.getElementById('mg-down-display').innerText = fmtMoney(down) + ' (' + downPct.toFixed(1) + '%)';
    document.getElementById('mg-interest').innerText = fmtMoney(totalInterest);
    document.getElementById('mg-total').innerText = fmtMoney(totalPaid);
    document.getElementById('mg-payoff').innerText = 'Payoff Date: ' + formatPayoffDate(n);
    document.getElementById('mg-result').style.display = 'block';

    renderBreakdownTable(monthlyPnI, monthlyTax, monthlyInsurance, pmi, hoa, totalMonthly, n);
    renderDonutChart(monthlyPnI, monthlyTax, monthlyInsurance, pmi, hoa);
    buildAmortization(loan, monthlyRate, n, monthlyPnI);
    setAmortMode('annual');

    copyShareData.mortgage = 'Monthly Payment: ' + fmtMoney(totalMonthly) + ' | Loan: ' + fmtMoney(loan) + ' | Interest: ' + fmtMoney(totalInterest) + ' | Payoff: ' + formatPayoffDate(n);
    return true;
}

function formatPayoffDate(totalMonths) {
    const startEl = document.getElementById('mg-start-date');
    let start = new Date();
    if (startEl && startEl.value) {
        const parts = startEl.value.split('-');
        start = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, 1);
    }
    const payoff = new Date(start.getFullYear(), start.getMonth() + totalMonths, 1);
    return payoff.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function renderBreakdownTable(monthlyPnI, monthlyTax, monthlyInsurance, pmi, hoa, totalMonthly, n) {
    const rows = [
        { label: 'Principal & Interest', monthly: monthlyPnI },
        { label: 'Property Tax', monthly: monthlyTax },
        { label: 'Home Insurance', monthly: monthlyInsurance },
        { label: 'PMI', monthly: pmi },
        { label: 'HOA', monthly: hoa }
    ];
    const body = document.getElementById('mg-breakdown-body');
    body.innerHTML = '';
    rows.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td>' + r.label + '</td><td>' + fmtMoney(r.monthly) + '</td><td>' + fmtMoney(r.monthly * n) + '</td>';
        body.appendChild(tr);
    });
    const totalRow = document.createElement('tr');
    totalRow.className = 'total-row';
    totalRow.innerHTML = '<td>Total Monthly Payment</td><td>' + fmtMoney(totalMonthly) + '</td><td>' + fmtMoney(totalMonthly * n) + '</td>';
    body.appendChild(totalRow);
    document.getElementById('mg-breakdown-section').style.display = 'grid';
}

function renderDonutChart(monthlyPnI, monthlyTax, monthlyInsurance, pmi, hoa) {
    const data = [
        { label: 'Principal & Interest', value: monthlyPnI, color: MORTGAGE_DONUT_COLORS.pni },
        { label: 'Property Tax', value: monthlyTax, color: MORTGAGE_DONUT_COLORS.tax },
        { label: 'Home Insurance', value: monthlyInsurance, color: MORTGAGE_DONUT_COLORS.insurance },
        { label: 'PMI', value: pmi, color: MORTGAGE_DONUT_COLORS.pmi },
        { label: 'HOA', value: hoa, color: MORTGAGE_DONUT_COLORS.hoa }
    ].filter(d => d.value > 0);

    const canvas = document.getElementById('mg-donut');
    const ctx = canvas.getContext('2d');
    const total = data.reduce((s, d) => s + d.value, 0) || 1;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const outerR = Math.min(cx, cy) - 4;
    const innerR = outerR * 0.62;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let angle = -Math.PI / 2;
    data.forEach(d => {
        const end = angle + (d.value / total) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, outerR, angle, end);
        ctx.arc(cx, cy, innerR, end, angle, true);
        ctx.closePath();
        ctx.fillStyle = d.color;
        ctx.fill();
        angle = end;
    });

    const textColor = getComputedStyle(document.body).getPropertyValue('--text').trim() || '#333';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 17px sans-serif';
    ctx.fillText(fmtMoney(total), cx, cy - 8);
    ctx.font = '12px sans-serif';
    ctx.fillText('/mo', cx, cy + 12);

    const legend = document.getElementById('mg-donut-legend');
    legend.innerHTML = data.map(d => {
        const pct = ((d.value / total) * 100).toFixed(1);
        return '<span style="display:inline-block;margin:0 8px 4px 0;"><span style="display:inline-block;width:10px;height:10px;background:' + d.color + ';border-radius:2px;margin-right:4px;"></span>' + d.label + ' ' + pct + '%</span>';
    }).join('');
}

function buildAmortization(loan, monthlyRate, n, monthlyPnI) {
    amortSchedule = [];
    let balance = loan;
    for (let i = 1; i <= n; i++) {
        const interest = balance * monthlyRate;
        let principal = monthlyPnI - interest;
        if (principal > balance) principal = balance;
        balance -= principal;
        if (balance < 0.005) balance = 0;
        amortSchedule.push({ month: i, payment: monthlyPnI, principal: principal, interest: interest, balance: balance });
    }
}

function renderAmortizationTable(mode) {
    const body = document.getElementById('mg-amort-body');
    body.innerHTML = '';
    if (mode === 'monthly') {
        amortSchedule.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td>Month ' + row.month + '</td><td>' + fmtMoney(row.payment) + '</td><td>' + fmtMoney(row.principal) + '</td><td>' + fmtMoney(row.interest) + '</td><td>' + fmtMoney(row.balance) + '</td>';
            body.appendChild(tr);
        });
        return;
    }
    const totalYears = Math.ceil(amortSchedule.length / 12);
    for (let y = 1; y <= totalYears; y++) {
        const rows = amortSchedule.filter(r => Math.ceil(r.month / 12) === y);
        const principal = rows.reduce((s, r) => s + r.principal, 0);
        const interest = rows.reduce((s, r) => s + r.interest, 0);
        const last = rows[rows.length - 1];
        const tr = document.createElement('tr');
        tr.innerHTML = '<td>Year ' + y + '</td><td>' + fmtMoney(principal + interest) + '</td><td>' + fmtMoney(principal) + '</td><td>' + fmtMoney(interest) + '</td><td>' + fmtMoney(last.balance) + '</td>';
        body.appendChild(tr);
    }
}

function setAmortMode(mode) {
    if (!amortSchedule.length) return;
    document.getElementById('mg-amort-annual').classList.toggle('active', mode === 'annual');
    document.getElementById('mg-amort-monthly').classList.toggle('active', mode === 'monthly');
    renderAmortizationTable(mode);
    document.getElementById('mg-amort-section').style.display = 'block';
}

function handleDownModeChange() {
    const mode = document.getElementById('mg-down-mode').value;
    const downEl = document.getElementById('mg-down');
    if (mode === '%') {
        downEl.placeholder = '20';
        downEl.setAttribute('max', '100');
    } else {
        downEl.placeholder = '60000';
        downEl.removeAttribute('max');
    }
    if (document.getElementById('mg-result').style.display !== 'none') calcMortgage(true);
}

// ============================================================
// Temperature Converter
// ============================================================
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
            if (val < 0) {
                k.value = '';
                c.value = '';
                f.value = '';
                alert('Kelvin cannot be below absolute zero (0 K).');
                return;
            }
            c.value = (val - 273.15).toFixed(2);
            f.value = ((val - 273.15) * 9/5 + 32).toFixed(2);
        }
    }
    copyShareData.temp = 'C=' + c.value + ' F=' + f.value + ' K=' + k.value;
}

// ============================================================
// APY Calculator with validation
// ============================================================
function calcAPY() {
    const principal = parseFloat(document.getElementById('apy-principal').value);
    const rate = parseFloat(document.getElementById('apy-rate').value);
    const term = parseFloat(document.getElementById('apy-term').value);
    const unit = document.getElementById('apy-term-unit').value;
    const freq = parseInt(document.getElementById('apy-freq').value);

    if (isNaN(principal) || principal <= 0) { alert('Please enter a valid initial deposit greater than 0.'); return; }
    if (isNaN(rate) || rate < 0) { alert('Please enter a valid interest rate (0 or greater).'); return; }
    if (isNaN(term) || term <= 0) { alert('Please enter a valid term greater than 0.'); return; }

    let years = term;
    if (unit === 'days') years = term / 365;
    else if (unit === 'weeks') years = term / 52;
    else if (unit === 'months') years = term / 12;

    const n = freq;
    const r = rate / 100;
    const finalAmount = principal * Math.pow(1 + r/n, n * years);
    const interest = finalAmount - principal;
    const effectiveYield = (Math.pow(1 + r/n, n) - 1) * 100;
    const multiplier = finalAmount / principal;
    const dailyInterest = interest / (years * 365);
    const doubleTime = effectiveYield > 0 ? (72 / effectiveYield).toFixed(1) : 'N/A';

    const fmt = v => '$' + v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('apy-final').innerText = fmt(finalAmount);
    document.getElementById('apy-interest').innerText = fmt(interest);
    document.getElementById('apy-effective').innerText = effectiveYield.toFixed(2) + '%';
    document.getElementById('apy-multiplier').innerText = multiplier.toFixed(2) + 'x';
    document.getElementById('apy-daily').innerText = fmt(dailyInterest);
    document.getElementById('apy-double').innerText = doubleTime + ' years';
    document.getElementById('apy-result').style.display = 'block';
    copyShareData.apy = 'APY: ' + fmt(finalAmount) + ' (Yield: ' + effectiveYield.toFixed(2) + '%)';
}

// ============================================================
// Copy & Share functionality
// ============================================================
const copyShareData = {};

// Debounced calculate function (300ms delay)
const sciCalculateDebounced = debounce(sciCalculate, 300);

function shareResult(page) {
    const data = copyShareData[page] || 'No result available';
    const shareData = { title: 'CalcBro Result', text: data, url: window.location.href };
    if (navigator.share) {
        navigator.share(shareData).catch(() => {});
    } else {
        navigator.clipboard.writeText(data + ' - ' + window.location.href).then(() => {
            alert('Link and result copied to clipboard!');
        }).catch(() => alert('Sharing not supported. Please copy manually.'));
    }
}

// ============================================================
// Night Mode
// ============================================================
function initNightMode() {
    const toggle = document.getElementById('nm-toggle');
    if (!toggle) return;

    // Restore saved preference
    if (localStorage.getItem('calcbro-nightmode') === '1') {
        document.body.classList.add('nightmode');
        toggle.innerHTML = '&#127774;'; // sun icon
    }

    toggle.addEventListener('click', function () {
        const on = document.body.classList.toggle('nightmode');
        toggle.innerHTML = on ? '&#127774;' : '&#127769;'; // sun / moon
        localStorage.setItem('calcbro-nightmode', on ? '1' : '0');
    });
}

// ============================================================
// Event listener wiring (no inline onclick/oninput handlers)
// ============================================================
function initEventListeners() {
    // ---- BMI ----
    const bmiCalc = document.getElementById('bmi-calc-btn');
    if (bmiCalc) bmiCalc.addEventListener('click', calcBMI);
    const bmiShare = document.getElementById('bmi-share-btn');
    if (bmiShare) bmiShare.addEventListener('click', () => shareResult('bmi'));

    // ---- Compound Interest ----
    const ciCalc = document.getElementById('ci-calc-btn');
    if (ciCalc) ciCalc.addEventListener('click', calcCI);
    const ciShare = document.getElementById('ci-share-btn');
    if (ciShare) ciShare.addEventListener('click', () => shareResult('ci'));

    // ---- Mortgage ----
    const mgCalc = document.getElementById('mg-calc-btn');
    if (mgCalc) mgCalc.addEventListener('click', () => calcMortgage(false));
    const mgShare = document.getElementById('mg-share-btn');
    if (mgShare) mgShare.addEventListener('click', () => shareResult('mortgage'));
    const mgDownMode = document.getElementById('mg-down-mode');
    if (mgDownMode) mgDownMode.addEventListener('change', handleDownModeChange);
    const mgAmortAnnual = document.getElementById('mg-amort-annual');
    if (mgAmortAnnual) mgAmortAnnual.addEventListener('click', () => setAmortMode('annual'));
    const mgAmortMonthly = document.getElementById('mg-amort-monthly');
    if (mgAmortMonthly) mgAmortMonthly.addEventListener('click', () => setAmortMode('monthly'));
    MORTGAGE_INPUT_IDS.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); calcMortgage(false); }
        });
        el.addEventListener('input', function () {
            if (document.getElementById('mg-result').style.display !== 'none') calcMortgage(true);
        });
    });
    const mgStartDate = document.getElementById('mg-start-date');
    if (mgStartDate) {
        const now = new Date();
        mgStartDate.value = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    }

    // ---- Temperature ----
    const tempC = document.getElementById('temp-c');
    const tempF = document.getElementById('temp-f');
    const tempK = document.getElementById('temp-k');
    if (tempC) tempC.addEventListener('input', () => convertTemp('c'));
    if (tempF) tempF.addEventListener('input', () => convertTemp('f'));
    if (tempK) tempK.addEventListener('input', () => convertTemp('k'));
    const tempShare = document.getElementById('temp-share-btn');
    if (tempShare) tempShare.addEventListener('click', () => shareResult('temp'));

    // ---- APY ----
    const apyCalc = document.getElementById('apy-calc-btn');
    if (apyCalc) apyCalc.addEventListener('click', calcAPY);
    const apyShare = document.getElementById('apy-share-btn');
    if (apyShare) apyShare.addEventListener('click', () => shareResult('apy'));

    // ---- Scientific calculator ----
    const sciGrid = document.querySelector('.sci-grid');
    if (sciGrid) {
        sciGrid.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', function () {
                const action = this.dataset.action;
                if (action) {
                    switch (action) {
                        case 'sciMemClear': sciMemClear(); break;
                        case 'sciMemRecall': sciMemRecall(); break;
                        case 'sciMemAdd': sciMemAdd(); break;
                        case 'sciMemSubtract': sciMemSubtract(); break;
                        case 'sciToggleDeg': sciToggleDeg(); break;
                        case 'sciFactorial': sciFactorial(); break;
                        case 'sciReciprocal': sciReciprocal(); break;
                        case 'sciPercent': sciPercent(); break;
                        case 'sciCalculate': sciCalculate(); break;
                        case 'sciClear': sciClear(); break;
                        case 'sciBackspace': sciBackspace(); break;
                    }
                    return;
                }
                const fn = this.dataset.fn;
                if (fn) {
                    sciFn(fn);
                    return;
                }
                const val = this.dataset.val;
                if (val) {
                    sciInput(val);
                }
            });
        });
    }
    const sciShare = document.getElementById('sci-share-btn');
    if (sciShare) sciShare.addEventListener('click', () => shareResult('sci'));
}

// DOM is parsed before this script runs (script tag at end of <body>)
initEventListeners();
initNightMode();
