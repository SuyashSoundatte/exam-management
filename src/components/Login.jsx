import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminContext } from "../contexts/AdminContext";
function Login() {
    const { fetchIsSuperAdmin } = useContext(AdminContext);
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password: pass,
                }),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to login");
            }

            const data = await response.json();
            localStorage.setItem("token", data.token);
            fetchIsSuperAdmin();
            navigate("/admin/dashboard");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <div className="text-2xl font-bold mb-6 text-center">Login</div>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 focus:outline-none"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="text-red-500 hover:text-red-600 font-medium"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
