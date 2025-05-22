function calculateSpan() {
    const pricesInput = document.getElementById("prices").value;
    const prices = pricesInput.split(',').map(Number);

    if (!prices.length || prices.some(isNaN)) {
        alert("Please enter valid stock prices.");
        return;
    }

    let spans = [];
    let stack = [];
    for (let i = 0; i < prices.length; i++) {
        while (stack.length > 0 && prices[stack[stack.length - 1]] <= prices[i]) {
            stack.pop();
        }
        spans[i] = (stack.length === 0) ? (i + 1) : (i - stack[stack.length - 1]);
        stack.push(i);
    }

    displaySpanChart(prices, spans);
    displayTrendAnalysis(spans);
    displayVolatilityAnalysis(prices);
}

function displaySpanChart(prices, spans) {
    const ctx = document.getElementById('spanChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: prices.map((_, i) => `Day ${i + 1}`),
            datasets: [{
                label: 'Stock Span',
                data: spans,
                backgroundColor: spans.map(span => span > 3 ? 'rgba(231, 76, 60, 0.6)' : 'rgba(46, 204, 113, 0.6)')
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true },
                x: { beginAtZero: true }
            }
        }
    });
}

function displayTrendAnalysis(spans) {
    const resultSection = document.getElementById('result');
    resultSection.innerHTML = '';
    for (let i = 0; i < spans.length; i++) {
        const trend = (i > 0 && spans[i] > spans[i - 1]) ? "⬆" : "";
        resultSection.innerHTML += `<p>Day ${i + 1}: Span = ${spans[i]} ${trend}</p>`;
    }
}

function displayVolatilityAnalysis(prices) {
    const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
    const variance = prices.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / prices.length;
    const volatility = Math.sqrt(variance).toFixed(2);

    document.getElementById('volatility').innerHTML = `Volatility: <span class="highlight">${volatility}</span>`;
}

function modifyPrice(day, newPrice) {
    const prices = document.getElementById("prices").value.split(',').map(Number);
    prices[day - 1] = newPrice;
    document.getElementById("prices").value = prices.join(',');
    calculateSpan();
}

function showTutorial() {
    const tutorialAside = document.getElementById('tutorial');
    tutorialAside.innerHTML = `
        <p><strong>Interactive Tutorial:</strong></p>
        <p>The stock span for each day is the number of consecutive days the price was less than or equal to today's price.</p>
        <ul>
            <li>For <span class="highlight">Day 1</span>, there's no previous day, so the span is always 1.</li>
            <li>For <span class="highlight">Day 2</span>, compare with Day 1's price. If Day 2's price is higher, the span is 2.</li>
            <li>Continue comparing each day's price with previous days to calculate the span.</li>
        </ul>
        <button onclick="modifyPrice(1, 120)">What if Day 1 was 120?</button>
        <button onclick="modifyPrice(3, 95)">What if Day 3 was 95?</button>
    `;
}
