import React, { useState } from 'react'
import "./Login.css"

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
      <div id="main">
        <div class="container">
            <div class="container-left">
              <div class="wrapper-left">
                <div class="part-one">
                  <h3>Get started</h3>
                  <p>Log in your account</p>
                </div>
                <div class="inp">
                  <form method="post" id="loginForm">
                    <label for="" class="email">E-mail </label>
                    <input class="inp-left" type="email" name="email" placeholder="email" value={email} 
                    onChange={(e) => setEmail(e.target.value)} />

                    <label for="" class="pass">Password </label>
                    <i class="fas fa-lock pass"></i>
                    <input class="inp-left" type="password" placeholder="password" name="password" id="" value={pass} 
                    onChange={(e) => setPass(e.target.value)} />


                    <div class="buttons">
                      <button class="btn-one" onClick={handleLogin}>Log in</button>
                      <a><button class="btn-one">Sign Up</button></a>
                    </div>
                  </form>
                  
                </div>
                
              </div>
            </div>
          </div>
    </div>
    </>
  )
}

export default Login
