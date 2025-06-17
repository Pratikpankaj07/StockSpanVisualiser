const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

app.get('/api/fetch-prices', async (req, res) => {
  const symbol = req.query.symbol || "IBM";
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
    const response = await axios.get(url);

  

    // Temporarily remove the check
    // return res.json(response.data);
    console.log("Alpha Vantage response:", JSON.stringify(response.data, null, 2));

    // Normal check
    if (!response.data || !response.data["Time Series (Daily)"]) {
      console.error("API ERROR: ", response.data);
      return res.status(500).json({
        error: "Invalid API response from Alpha Vantage",
        message: response.data,
        symbol,
      });
    }

    // Continue processing
    const processed = Object.entries(response.data["Time Series (Daily)"])
      .slice(0, 20)
      .reverse()
      .map(([date, values]) => ({
        date,
        price: parseFloat(values["4. close"]),
      }));

    res.json({ symbol, data: processed });
  } catch (error) {
    console.error("Fetch failed:", error.message);
    res.status(500).json({ error: "Backend Error", message: error.message });
  }
});


app.post("/api/calculate-span", (req, res) => {
  const { prices } = req.body;
  const span = calculateSpan(prices);
  res.json({ span });
});

app.post("/api/sma", (req, res) => {
  const { prices } = req.body;
  const k = parseInt(req.query.k, 10);
  const sma = calculateSMA(prices, k);
  res.json({ sma });
});

app.post("/api/max", (req, res) => {
  const { prices } = req.body;
  const k = parseInt(req.query.k, 10);
  const maxValues = calculateMax(prices, k);
  res.json({ maxValues });
});

// Algorithms
const calculateSpan = (prices) => {
  const span = [];
  const stack = [];
  for (let i = 0; i < prices.length; i++) {
    while (stack.length > 0 && prices[stack[stack.length - 1]] <= prices[i]) {
      stack.pop();
    }
    span[i] = stack.length === 0 ? i + 1 : i - stack[stack.length - 1];
    stack.push(i);
  }
  return span;
};

const calculateSMA = (prices, k) => {
  const sma = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < k - 1) {
      sma.push(null);
    } else {
      const sum = prices.slice(i - k + 1, i + 1).reduce((acc, price) => acc + price, 0);
      sma.push(sum / k);
    }
  }
  return sma;
};

const calculateMax = (prices, k) => {
  const maxValues = [];
  const deque = [];
  for (let i = 0; i < prices.length; i++) {
    while (deque.length > 0 && deque[0] <= i - k) {
      deque.shift();
    }
    while (deque.length > 0 && prices[deque[deque.length - 1]] <= prices[i]) {
      deque.pop();
    }
    deque.push(i);
    maxValues.push(i >= k - 1 ? prices[deque[0]] : null);
  }
  return maxValues;
};

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
