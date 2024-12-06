import React from "react";
import "./App.css";
import Student from "./pages/Student";
import NavBar from "./components/NavBar";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ViewResult from "./pages/ViewResult";
import AdminDashboard from "./components/AdminDashboard";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./Utils/theme"; // Import your MUI custom theme here

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Ensures consistent global styles */}
      <NavBar />
      <Routes>
        <Route path="/" element={<Student />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/result" element={<ViewResult />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
