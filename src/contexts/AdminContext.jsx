import React, { createContext, useState, useEffect } from "react";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    const fetchIsSuperAdmin = async () => {
        try {
            const response = await fetch(
                "http://localhost:3000/admin/isSuperAdmin",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error(
                    (await response.json()).message || "Failed to fetch role"
                );
            }

            const data = await response.json();
            setIsSuperAdmin(data.isSuperAdmin || false);
        } catch (err) {
            console.error("Error fetching super admin role:", err.message);
            setIsSuperAdmin(false);
        }
    };

    useEffect(() => {
        fetchIsSuperAdmin();
    }, []);

    return (
        <AdminContext.Provider value={{ isSuperAdmin, fetchIsSuperAdmin }}>
            {children}
        </AdminContext.Provider>
    );
};
