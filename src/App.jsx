import React, { useState, useEffect } from 'react';
import './App.css';
import Student from './pages/Student';
import NavBar from './components/NavBar';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ViewResult from './pages/ViewResult';
import AdminDashboard from './components/AdminDashboard';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './Utils/theme'; // Import your MUI custom theme here
import SuperAdminDashboard from './components/SuperAdminDashboard';
import { AdminProvider, AdminContext } from './contexts/AdminContext';

const App = () => {
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    const fetchIsSuperAdmin = async () => {
        try {
            const response = await fetch(
                'http://localhost:3000/admin/isSuperAdmin',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                },
            );

            if (!response.ok) {
                throw new Error(
                    (await response.json()).message || 'Failed to fetch role',
                );
            }

            const data = await response.json();
            setIsSuperAdmin(data.isSuperAdmin || false);
        } catch (err) {
            console.error('Error fetching super admin role:', err.message);
            setIsSuperAdmin(false);
        }
    };

    useEffect(() => {
        fetchIsSuperAdmin();
    }, []);

    return (
        <AdminProvider value={{ isSuperAdmin }}>
            <ThemeProvider theme={theme}>
                <CssBaseline /> {/* Ensures consistent global styles */}
                <NavBar />
                <Routes>
                    <Route path="/" element={<Student />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/result" element={<ViewResult />} />
                    <Route
                        path="/admin/dashboard"
                        element={<AdminDashboard />}
                    />
                </Routes>
            </ThemeProvider>
        </AdminProvider>
    );
};

export default App;
