import React, { useMemo, useState } from "react";
import "./styles.css";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  emoji: string;
  desc: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Royal Oud",
    price: 499,
    category: "Luxury",
    emoji: "🧴",
    desc: "Deep rich royal oud fragrance."
  },
  {
    id: 2,
    name: "Velvet Musk",
    price: 549,
    category: "Premium",
    emoji: "💎",
    desc: "Smooth seductive musk notes."
  },
  {
    id: 3,
    name: "Aqua Fresh",
    price: 399,
    category: "Fresh",
    emoji: "✨",
    desc: "Fresh aquatic daily wear scent."
  },
  {
    id: 4,
    name: "Night Smoke",
    price: 599,
    category: "Bold",
    emoji: "🔥",
    desc: "Dark smoky powerful vibe."
  },
  {
    id: 5,
    name: "Gold Rush",
    price: 699,
    category: "Luxury",
    emoji: "👑",
    desc: "Premium classy signature perfume."
  },
  {
    id: 6,
    name: "Ice Storm",
    price: 449,
    category: "Fresh",
    emoji: "❄️",
    desc: "Cold crisp energetic fragrance."
  }
];

export default function App() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [cart, setCart] = useState<Record<number, number>>({});

  const categories = ["All", ...new Set(products.map(p => p.category))];

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = filter === "All" || p.category === filter;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [search, filter]);

  const addToCart = (id: number) => {
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const qty = (prev[id] || 0) - 1;
      const copy = { ...prev };
      if (qty <= 0) delete copy[id];
      else copy[id] = qty;
      return copy;
    });
  };

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = products.find((p) => p.id === Number(id));
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const whatsappOrder = () => {
    const lines = Object.entries(cart).map(([id, qty]) => {
      const item = products.find((p) => p.id === Number(id));
      return `${item?.name} x${qty}`;
    });

    const msg =
      `Hi Perfect Fume, I want to order:%0A%0A${lines.join(
        "%0A"
      )}%0A%0ATotal: ₹${total}`;

    window.open(`https://wa.me/918777789394?text=${msg}`, "_blank");
  };

  return (
    <div className="app">
      <section className="hero">
        <h1>Perfect Fume 😈</h1>
        <p>Luxury Fragrance Crafted For Confidence</p>

        <input
          className="search"
          placeholder="Search perfume..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={filter === cat ? "pill active" : "pill"}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="grid">
        {filtered.map((item) => (
          <div className="card" key={item.id}>
            <div className="emoji">{item.emoji}</div>
            <h3>{item.name}</h3>
            <p className="desc">{item.desc}</p>
            <p className="price">₹{item.price}</p>

            {!cart[item.id] ? (
              <button className="buyBtn" onClick={() => addToCart(item.id)}>
                Add to Cart
              </button>
            ) : (
              <div className="stepper">
                <button onClick={() => removeFromCart(item.id)}>-</button>
                <span>{cart[item.id]}</span>
                <button onClick={() => addToCart(item.id)}>+</button>
              </div>
            )}
          </div>
        ))}
      </section>

      {cartCount > 0 && (
        <button className="floatingCart" onClick={whatsappOrder}>
          Cart ({cartCount}) • ₹{total}
        </button>
      )}

      <footer className="footer">
        © 2026 Perfect Fume. Luxury Starts Here.
      </footer>
    </div>
  );
              }
