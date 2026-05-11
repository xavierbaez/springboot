import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    age: "",
    coverage: "",
    smoker: "",
    diabetes: "",
  });

  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setQuote(null);

    const requestBody = {
      age: Number(formData.age),
      coverage: Number(formData.coverage),
      smoker: formData.smoker === "true",
      diabetes: formData.diabetes === "true",
    };

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Spring Boot API returned an error.");
      }

      const data = await response.json();
      setQuote(data);
    } catch (err) {
      setError(err.message || "Unable to generate quote.");
    } finally {
      setLoading(false);
    }
  }

  return (
      <div className="page-background">
        <div className="overlay">
          <div className="quote-card">
            <div className="brand-text">Pacific Life Demo</div>

            <h1>Life Insurance Quote</h1>

            <p className="subtitle">
              React frontend consuming Spring Boot JSON API
            </p>

            <form onSubmit={handleSubmit}>
              <input
                  className="form-control"
                  type="number"
                  name="age"
                  placeholder="Age"
                  min="18"
                  max="90"
                  value={formData.age}
                  onChange={handleChange}
                  required
              />

              <select
                  className="form-control"
                  name="coverage"
                  value={formData.coverage}
                  onChange={handleChange}
                  required
              >
                <option value="">Coverage Amount</option>
                <option value="100000">100,000</option>
                <option value="250000">250,000</option>
                <option value="500000">500,000</option>
                <option value="1000000">1,000,000</option>
              </select>

              <select
                  className="form-control"
                  name="smoker"
                  value={formData.smoker}
                  onChange={handleChange}
                  required
              >
                <option value="">Smoker?</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>

              <select
                  className="form-control"
                  name="diabetes"
                  value={formData.diabetes}
                  onChange={handleChange}
                  required
              >
                <option value="">Diabetes?</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>

              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? "Generating Quote..." : "Get Quote"}
              </button>
            </form>

            {error && <div className="error-box">{error}</div>}

            {quote && (
                <div className="result-box">
                  <div className="result-label">Estimated Monthly Premium</div>
                  <div className="price">${quote.price}</div>
                  <div className="message">{quote.message}</div>
                  <div className="source">{quote.source}</div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}

export default App;