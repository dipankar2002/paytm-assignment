import React, { memo, useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import InputCompo from '../Components/InputCompo';
import axios from 'axios';
import { mainUrl } from '../Api/apiFetch';

export default function SendMoney() {
  const navigate = useNavigate();
  const [ amount, setAmount ] = useState(0);
  const [ currentUser, setCurrentUser ] = useState({});
  const [ recevier, setRecevier ] = useState({});
  const token = localStorage.getItem('token');

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");

  useEffect(() => {
    if (!token) return;
    async function fetchUser() {
      try {
        const response = await axios.post(
          'http://localhost:3000/api/v1/user/currentUser',
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if(!response.data.success) {
          localStorage.removeItem('token');
        } 
        setCurrentUser(response.data.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
        if (error.response && error.response.status === 401) {
          console.warn("Unauthorized! Redirecting to login...");
          navigate('/signin');
        }
      }
    }
    fetchUser();
  },[token, navigate]);

  async function onSubmit(e) {
    e.preventDefault();

    const response = await axios.post(`${mainUrl}/api/v1/account/transfer`,
      {
        to: id,
        amount: amount
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    console.log(response.data);
  }

  return (
    <div className=' flex justify-center items-center w-[100vw] h-[100vh]'>
      <form 
        className='bg-white w-[30%] py-10 rounded-md text-center shadow-2xl'
        onSubmit={onSubmit}
      >
        <header className='text-center pb-6 px-10'>
          <h1 className=' text-3xl font-bold pb-2'>Send Money</h1>
          <div className='text-xl text-gray-600'>Transfer money from {currentUser.firstName} account to </div>
        </header>
        <ShowReciver name={name}/>
        <InputCompo type={"number"} value={amount} setValue={setAmount}>
          Amount (in Rs)
        </InputCompo>
        <button className="bg-blue-500 w-[80%] py-2 text-white font-bold rounded-md mt-6">Send</button>
        <footer className='text-center pt-2'>
          Want to go back to Dashboard page -
          <Link
            to="/dashboard"
            className='text-blue-500 mx-2'
          > Back </Link>
        </footer>
      </form>
    </div>
  )
}

function ShowReciver({name}) {

  return (
    <div className='flex w-[80%] mx-auto items-center mb-4'>
      <div className={`bg-green-400 w-12 h-12 rounded-[50%] text-3xl text-center text-white py-1`}>
        {name[0].toUpperCase()}
      </div>
      <div className='text-2xl mx-2'>
        <span className='font-bold mx-2'>{name}</span> 
        (recevier)
      </div>
    </div>
  )
}


