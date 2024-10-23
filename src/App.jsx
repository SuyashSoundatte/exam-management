import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import RegistrationForm from './components/RegistrationForm';
import AdminSignup from './components/AdminSignup';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Home page with registration form */}
        <Route path="/" element={
          <div id="p1-overlay">
            <div id="page1">
              <div className="left">
                <div className="left-lcontent">
                  <h3>Fueling Futures, Empowering Dreams</h3>
                  <h1>DKTE's</h1>
                  <h2>IIT and Medical Academy</h2>
                  <h4>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, obcaecati. Ipsam nihil sequi dignissimos. Architecto necessitatibus doloribus dolor odio.</h4>
                </div>
                <div className="left-rcontent">
                  <img src="./img/scholars-image.webp" alt="Scholars" />
                </div>
              </div>
              <div className="right">
                <RegistrationForm />
              </div>
            </div>
          </div>
        } />
        
        {/* Admin routes */}
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
