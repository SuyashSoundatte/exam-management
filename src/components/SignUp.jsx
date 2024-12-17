import React, { useState } from "react";
import { Link } from "react-router-dom";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleSignUp = async () => {
    try {
      const response = await fetch("http://localhost:3000/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          email,
          password: pass,
        }),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to sign up");
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-screen flex items-start justify-center pt-20">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <div className="text-2xl font-bold mb-6 text-center">Create New User</div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            User Name
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>
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
          />
        </div>
        <button
          onClick={handleSignUp}
          className="w-full py-2 px-4 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 focus:outline-none"
        >
          Sign Up
        </button>
        
      </div>
    </div>
  );
}

export default SignUp;