import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import HomePage from './pages/Home';      
import AdminPanel from './pages/Admin';   
import Shop from './pages/Shop'; 
import ProductDetails from './pages/ProductDetails';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<Shop />} /> 
        <Route path="/product/:id" element={<ProductDetails />} /> 
        <Route path="/himazumder5566" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
};

export default App;
