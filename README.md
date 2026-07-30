# CalculatorHub - Free Online Calculators

A modern, responsive calculator website with 5 different calculators and ad integration points for monetization.

## Features

### 1. BMI Calculator
- Calculate Body Mass Index
- Instant BMI category classification (Underweight, Normal, Overweight, Obese)
- Reference BMI ranges displayed

### 2. Scientific Calculator
- Basic arithmetic operations
- Trigonometric functions (sin, cos, tan)
- Logarithmic functions (log, ln)
- Square root, exponentiation, factorial
- Pi and e constants
- Expression editing with backspace

### 3. Compound Interest Calculator
- Principal amount input
- Customizable interest rate
- Multiple time periods
- Compound frequency options (Daily, Monthly, Quarterly, Semi-annually, Annually)
- Year-by-year breakdown table
- Future value and total interest display

### 4. Mortgage Calculator
- Home price and down payment
- Annual interest rate
- Loan term in years
- Monthly payment calculation
- Total payment and total interest costs

### 5. Temperature Converter
- Convert between Celsius, Fahrenheit, and Kelvin
- Instant conversion results
- Display all three scales simultaneously

## Revenue Integration

The website includes **4 strategic ad placement slots**:

1. **Top Banner Ad** - 728x90 or responsive (high visibility)
2. **Middle Rectangle Ad** - 336x280 or responsive (engaged users)
3. **Bottom Banner Ad** - 728x90 or responsive (before footer)
4. **Resources Section** - Additional content area for native ads

### Monetization Setup Instructions

To integrate Google AdSense:

1. Sign up at https://www.google.com/adsense/
2. Get your Publisher ID
3. Replace the placeholder divs with your AdSense code:

```html
<!-- Example AdSense banner ad -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
     data-ad-slot="YOUR_AD_SLOT_ID"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients, animations, responsive design
- **JavaScript (vanilla)** - No frameworks, fast load times, SEO-friendly
- **Mobile-first responsive design** - Works on all devices

## SEO Benefits

- Fast page load (no heavy frameworks)
- Semantic HTML for search engines
- Keyword-rich calculator descriptions
- Multiple page sections for better indexing
- Mobile-friendly (Google ranking factor)

## Deployment

Simply upload the three files to any web host:
- `index.html`
- `styles.css`
- `calculators.js`

Works on:
- Static hosting (Netlify, GitHub Pages, Cloudflare Pages)
- Traditional web hosting (Apache, Nginx)
- CDN hosting

## License

Free to use for commercial purposes. Built for monetization with ad networks.

## Tips for Revenue Growth

1. Add more calculators (currency converter, calorie calculator, etc.)
2. Write blog posts about each calculator topic (SEO + content)
3. Add a blog section to increase page views
4. Enable cookie consent for GDPR compliance
5. Add social sharing buttons
6. Track analytics with Google Analytics
7. Optimize for specific keywords ("free BMI calculator", "mortgage calculator online")
