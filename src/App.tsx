import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // File path thik na thakle ektu adjust kore niben
import HomePage from './pages/Home';      // Ekhane apnar Home page
import AdminPanel from './pages/Admin';   // Ekhane apnar Admin page

const App = () => {
  return (
    <Router>
      {/* Navbar sob page-ei thakbe */}
      <Navbar />
      
      {/* Routes: Kon link-e kon page dekhabe */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
};

export default App;
