# Stock Span Visualizer

## Overview
The Stock Span Visualizer is a web application that allows users to visualize stock price data through various charts. It features a React frontend and a Node.js backend, providing a seamless experience for fetching and displaying stock data.

## Functionality
- Fetches dummy stock prices from the backend.
- Calculates the stock span using a stack-based algorithm.
- Computes the Simple Moving Average (SMA) using a sliding window approach.
- Determines the sliding window maximum using a deque.
- Visualizes the results using Recharts with three different charts:
  - Stock Span Chart
  - Simple Moving Average Chart
  - Sliding Window Maximum Chart

## Project Structure
```
stock-span-visualizer/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── components/
│   │       ├── SpanChart.jsx
│   │       ├── SMAChart.jsx
│   │       └── MaxChart.jsx
│   └── index.html
├── backend/
│   └── server.js
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node package manager)

### Setup Instructions

#### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Initialize the frontend project and install dependencies:
   ```bash
   npm init -y
   npm install react react-dom vite axios recharts
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

#### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Initialize the backend project and install dependencies:
   ```bash
   npm init -y
   npm install express cors
   ```
3. Start the backend server:
   ```bash
   node server.js
   ```

### API Endpoints
- **GET** `/api/fetch-prices`: Returns dummy stock prices.
- **POST** `/api/calculate-span`: Calculates the stock span for given prices.
- **POST** `/api/sma?k=3`: Computes the Simple Moving Average for given prices.
- **POST** `/api/max?k=3`: Determines the sliding window maximum for given prices.

## License
This project is open-source and available under the MIT License.