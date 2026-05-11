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

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setQuote(null);

    const requestBody = {
      age: Number(formData.age),
      coverage: Number(formData.coverage),
      smoker: formData.smoker === "true",
      diabetes: formData.diabetes === "true",
    };

    const response = await fetch("/api/quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    setQuote(data);
    setLoading(false);
  }

  return (
      <div className="page">
        <div className="overlay">
          <div className="quote-card shadow-lg">
            {!quote && (
                <>
                  <h1>Life Insurance Quote</h1>

                  <form onSubmit={handleSubmit}>
                    <input
                        className="form-control mb-3"
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
                        className="form-control mb-3"
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
                        className="form-control mb-3"
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
                        className="form-control mb-3"
                        name="diabetes"
                        value={formData.diabetes}
                        onChange={handleChange}
                        required
                    >
                      <option value="">Diabetes?</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>

                    <button className="btn btn-primary w-100" type="submit">
                      {loading ? "Generating..." : "Get Quote"}
                    </button>
                  </form>
                </>
            )}

            {quote && (
                <>
                  <h1>Estimated Monthly Premium</h1>

                  <p><strong>Age:</strong> {quote.age}</p>
                  <p><strong>Coverage:</strong> ${quote.coverage}</p>
                  <p><strong>Smoker:</strong> {String(quote.smoker)}</p>
                  <p><strong>Diabetes:</strong> {String(quote.diabetes)}</p>

                  <div className="price">${quote.price} / month</div>

                  <button
                      className="btn btn-outline-primary w-100"
                      type="button"
                      onClick={() => setQuote(null)}
                  >
                    Back
                  </button>

                  <p className="message">{quote.message}</p>
                </>
            )}
          </div>
        </div>
      </div>
  );
}

export default App;