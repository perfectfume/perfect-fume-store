import React from "react";
import "./styles.css";

export default function App() {
  return (
    <div className="app">

      <section className="hero">
        <h1>Perfect Fume</h1>
        <p>Luxury Fragrance Crafted For Confidence</p>

        <div className="heroBtns">
          <a href="#">Launching Soon</a>
          <a href="#">Join Early Access</a>
        </div>
      </section>

      <section className="about">
        <h2>Why Perfect Fume?</h2>
        <div className="grid">
          <div className="card">
            <h3>Premium Quality</h3>
            <p>Luxury inspired fragrances with lasting impression.</p>
          </div>

          <div className="card">
            <h3>Affordable Price</h3>
            <p>Luxury feel without luxury pricing.</p>
          </div>

          <div className="card">
            <h3>Trusted Brand</h3>
            <p>Focused on customer satisfaction & style.</p>
          </div>

          <div className="card">
            <h3>Fast Delivery</h3>
            <p>Quick dispatch and secure packaging.</p>
          </div>
        </div>
      </section>

      <section className="launch">
        <h2>Launching Soon 🚀</h2>
        <p>Our premium fragrance collection is almost ready.</p>
        <a className="buyBtn" href="#">Get Launch Updates</a>
      </section>

      <section className="legal">
        <h2>Business Information</h2>
        <p>Privacy Policy</p>
        <p>Return Policy</p>
        <p>Terms & Conditions</p>
        <p>Support: perfectfumeofficial@gmail.com</p>
      </section>

      <footer className="footer">
        © 2026 Perfect Fume. All Rights Reserved.
      </footer>

    </div>
  );
}
