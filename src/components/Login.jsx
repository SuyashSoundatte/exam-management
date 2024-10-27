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
      <div>Login Page</div>
      <p>Email</p>
      <input 
        type="text" 
        placeholder="enter your email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <p>Password</p>
      <input 
        type="password" 
        placeholder="enter your password" 
        value={pass} 
        onChange={(e) => setPass(e.target.value)} 
      />
      <button id="login" onClick={handleLogin}>Login</button>
      <p>Create an account</p>
      <Link to={'/signup'}>
        <button>SignUp</button>
      </Link>
    </>
  )
}

export default Login
