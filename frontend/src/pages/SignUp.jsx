import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputCompo from '../Components/InputCompo';

export default function SignUp() {
  localStorage.removeItem('token');

  const navigate = useNavigate();
  const [ firstName, setFirstName ] = useState("");
  const [ lastName, setLastName ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3000/api/v1/user/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: firstName.toLowerCase(),
        lastName: lastName.toLowerCase(),
        username: email,
        password: password,
      })
    });
    const data = await response.json();

    if(data.token) {
      localStorage.setItem('token', data.token);
      navigate('/dashboard', { replace: true });

    } else {
      alert(data.message);
    }
  }

  return (
    <div className=' flex justify-center items-center w-[100vw] h-[100vh]'>
      <form 
        className='bg-white w-[30%] py-10 rounded-md text-center shadow-2xl'
        onSubmit={onSubmit}
      >
        <header className='text-center pb-6 px-10'>
          <h1 className=' text-3xl font-bold pb-2'>Sign Up</h1>
          <div className='text-xl text-gray-600'>Enter your information to create an account</div>
        </header>
        <InputCompo value={firstName} setValue={setFirstName}>
          First Name
        </InputCompo>
        <InputCompo value={lastName} setValue={setLastName}>
          Last Name
        </InputCompo>
        <InputCompo value={email} setValue={setEmail}>
          Email
        </InputCompo>
        <InputCompo value={password} setValue={setPassword}>
          Password
        </InputCompo>
        <button className="bg-blue-500 w-[80%] py-2 text-white font-bold rounded-md mt-6">Sign Up</button>
        <footer className='text-center pt-2'>
          Already have an account?
          <Link
            to="/signin"
            className='text-blue-500 mx-2'
          > Sign In</Link>
        </footer>
      </form>
    </div>
  )
}
