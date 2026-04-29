import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import HomePage from './pages/Home';      
import AdminPanel from './pages/Admin';   
import Shop from './pages/Shop'; // 🔥 NOTUN: Shop page import korlam

const App = () => {
  return (
    <Router>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<Shop />} /> {/* 🔥 NOTUN: Shop page er link */}
        <Route path="/himazumder5566" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
};

export default App;
