import React from "react";

export default function App() {
  const products = [
    { name: "Royal Oud", price: "₹499" },
    { name: "Aqua Fresh", price: "₹399" },
    { name: "Night Smoke", price: "₹599" },
    { name: "Velvet Musk", price: "₹549" }
  ];

  return (
    <div className="app">
      <header className="header">
        <h1>Perfect Fume</h1>
        <p>Luxury Fragrance at Affordable Price</p>
      </header>

      <section className="grid">
        {products.map((item, i) => (
          <div className="card" key={i}>
            <div className="emoji">🧴</div>
            <h3>{item.name}</h3>
            <p>{item.price}</p>
            <button>Buy Now</button>
          </div>
        ))}
      </section>

      <footer className="footer">
        © 2026 Perfect Fume
      </footer>
    </div>
  );
}
