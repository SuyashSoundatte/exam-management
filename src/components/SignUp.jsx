import React, { useState } from 'react'

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleSignUp = async()=>{
    try {
      const response = await fetch('http://localhost:3000/admin/register',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          username:name,
          email,
          password:pass
        })
      });
        if(!response.ok){
          throw new Error('Failed to signup');
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div>SignUp Page</div>
      <p>User Name</p>
      <input type="text" placeholder='enter Your name' value={name} onChange={(e)=>{setName(e.target.value)}} /> 
      <p>Email</p>
      <input type="text" placeholder='enter your email' value={email} onChange={(e)=>{setEmail(e.target.value)}} />
      <p>Password</p>
      <input type="password" placeholder='enter your password' value={pass} onChange={(e)=>{setPass(e.target.value)}} />
      <button onClick={handleSignUp} >SignUp</button>
    </>
  )
}

export default SignUp
