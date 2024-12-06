import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password: pass,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const data = await response.json();

      // Store the token in localStorage
      localStorage.setItem('token', data.token);

      console.log('Login successful, token stored in localStorage');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
   <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <div className="text-2xl font-bold mb-6 text-center">Login</div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            type="text" 
            placeholder="Enter your email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input 
            type="password" 
            placeholder="Enter your password" 
            value={pass} 
            onChange={(e) => setPass(e.target.value)} 
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>
        
        <Link to={'/admin/dashboard'}>
          <button 
            id="login" 
            onClick={handleLogin} 
            className="w-full py-2 px-4 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </Link>
        
        <div className="mt-4 text-center">
          <p className="text-sm flex font-medium mb-4" >Don't have an account?<Link to={'/signup'}>
            <p className='text-red-500'>&nbsp;Sign up</p>
          </Link></p>
          
        </div>
      </div>
    </div>
  </>
  )
}

export default Login
