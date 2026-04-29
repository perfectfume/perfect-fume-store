import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Footer from './components/Footer'; // 🔥 Notun Footer Import Korlam
import HomePage from './pages/Home';      
import AdminPanel from './pages/Admin';   
import Shop from './pages/Shop'; 
import ProductDetails from './pages/ProductDetails';
import About from './pages/About'; 
import Contact from './pages/Contact';
import TrackOrder from './pages/TrackOrder'; 
import FAQ from './pages/FAQ'; 
import PrivacyPolicy from './pages/Privacy';
import ShippingPolicy from './pages/Shipping';
import RefundPolicy from './pages/Refund';

const App = () => {
  return (
    <Router>
      <Navbar /> {/* Top menu */}
      
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<Shop />} /> 
          <Route path="/product/:id" element={<ProductDetails />} /> 
          <Route path="/about" element={<About />} /> 
          <Route path="/contact" element={<Contact />} /> 
          <Route path="/track-order" element={<TrackOrder />} /> 
          <Route path="/faq" element={<FAQ />} /> 
          <Route path="/privacy-policy" element={<PrivacyPolicy />} /> 
          <Route path="/shipping-policy" element={<ShippingPolicy />} /> 
          <Route path="/refund-policy" element={<RefundPolicy />} /> 
          <Route path="/himazumder5566" element={<AdminPanel />} />
        </Routes>
      </div>

      <Footer /> {/* 🔥 Ekdom niche Footer add kora holo jeta sob page-e dekhabe */}
    </Router>
  );
};

export default App;
