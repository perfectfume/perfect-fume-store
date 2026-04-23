import React from "react";
import "./styles.css";

const products = [
  {
    name: "Royal Oud",
    price: "₹499",
    img: "🧴"
  },
  {
    name: "Aqua Fresh",
    price: "₹399",
    img: "✨"
  },
  {
    name: "Night Smoke",
    price: "₹599",
    img: "🔥"
  },
  {
    name: "Velvet Musk",
    price: "₹549",
    img: "💎"
  }
];

export default function App() {
  return (
    <div className="app">
      <section className="hero">
        <h1>Perfect Fume 😈</h1>
        <p>Luxury Fragrance at Affordable Price</p>

        <div className="heroBtns">
          <a href="https://www.instagram.com/prfectfumeofficial" target="_blank">Instagram</a>
          <a href="https://wa.me/918777789394" target="_blank">Order Now</a>
        </div>
      </section>

      <h2 className="title">Best Sellers</h2>

      <section className="grid">
        {products.map((item, i) => (
          <div className="card" key={i}>
            <div className="emoji">{item.img}</div>
            <h3>{item.name}</h3>
            <p>{item.price}</p>
            <span className="stock">Limited Stock</span>
            <a
              className="buyBtn"
              href="https://wa.me/918777789394"
              target="_blank"
            >
              Buy Now
            </a>
          </div>
        ))}
      </section>

      <section className="reviews">
        <h2>Customers Love Us ❤️</h2>
        <p>⭐️⭐️⭐️⭐️⭐️ “Amazing lasting fragrance!”</p>
        <p>⭐️⭐️⭐️⭐️⭐️ “Worth every rupee.”</p>
      </section>

      <footer className="footer">
        © 2026 Perfect Fume
      </footer>
    </div>
  );
}
