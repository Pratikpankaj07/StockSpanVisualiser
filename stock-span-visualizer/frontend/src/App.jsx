import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./App.css";

function App() {
  const [stockData, setStockData] = useState([]);
  const [span, setSpan] = useState([]);
  const [sma, setSma] = useState([]);
  const [max, setMax] = useState([]);
  const [companySymbol, setCompanySymbol] = useState("");
  const [inputSymbol, setInputSymbol] = useState("GOOG");
  const k = 5;

  const fetchData = async (symbol) => {
    try {
      const res = await axios.get(
        `http://localhost:3002/api/fetch-prices?symbol=${symbol}`
      );

      const prices = res.data.data.map((item) => item.price);
      setStockData(res.data.data);
      setCompanySymbol(res.data.symbol);

      const spanRes = await axios.post("http://localhost:3002/api/calculate-span", {
        prices,
      });
      setSpan(spanRes.data.span);

      const smaRes = await axios.post(`http://localhost:3002/api/sma?k=${k}`, {
        prices,
      });
      setSma(smaRes.data.sma);

      const maxRes = await axios.post(`http://localhost:3002/api/max?k=${k}`, {
        prices,
      });
      setMax(maxRes.data.maxValues);
    } catch (err) {
      console.error(" Error fetching or processing data", err);
      alert("Failed to fetch data. Please check the stock symbol or try again later.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const symbol = inputSymbol.trim().toUpperCase();
    if (symbol) {
      fetchData(symbol);
    } else {
      alert("Please enter a valid stock symbol.");
    }
  };

  const combinedData = stockData.map((item, index) => ({
    date: item.date,
    price: item.price,
    span: span[index],
    sma: sma[index],
    max: max[index],
  }));

  return (
    <div className="app">
      <h1>📈 Stock Span Visualizer {companySymbol && `- ${companySymbol}`}</h1>

      
      <form onSubmit={handleSubmit} style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <input
          type="text"
          value={inputSymbol}
          placeholder="Enter stock symbol (e.g., AAPL)"
          onChange={(e) => setInputSymbol(e.target.value)}
          style={{
            padding: "8px",
            fontSize: "16px",
            width: "250px",
            textAlign: "center",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            marginLeft: "10px",
            padding: "8px 16px",
            fontSize: "16px",
            borderRadius: "5px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </form>

      {stockData.length > 0 && (
        <>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={combinedData}>
              <Line type="monotone" dataKey="price" stroke="#8884d8" name="Price" />
              <Line type="monotone" dataKey="sma" stroke="#82ca9d" name={`SMA (${k})`} />
              <Line type="monotone" dataKey="max" stroke="#ff7300" name={`Max (${k})`} />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>

          <div style={{ marginTop: "20px" }}>
            <h3>Span Values</h3>
            <ul>
              {combinedData.map((item, idx) => (
                <li key={idx}>
                  {item.date}: Span = {item.span}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
