import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Footer from './components/Footer'; 
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
import Categories from './pages/Categories';
import Wishlist from './pages/Wishlist';

const App = () => {
  return (
    <Router>
      <Navbar /> 
      
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<Shop />} /> 
          <Route path="/categories" element={<Categories />} />
          <Route path="/wishlist" element={<Wishlist />} />
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

      <Footer /> 
    </Router>
  );
};

export default App;
