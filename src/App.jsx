import React from "react";
import "./App.css";
import Student from "./pages/Student";
import NavBar from "./components/NavBar";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ViewResult from "./pages/ViewResult";
import AdminDashboard from "./components/AdminDashboard";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <>
      <NavBar />
   <Routes>
        <Route path="/" element={<Student />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/result" element={<ViewResult />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes> 
    </>
  );
};

export default App;
