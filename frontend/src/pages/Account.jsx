import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { mainUrl } from '../Api/apiFetch';
import Navbar from '../Components/Navbar';

export default function Account() {
  const [ token, setToken] = useState("");
  const [ currentUser, setCurrentUser ] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (!token) return;
    async function fetchUser() {
      try {
        const response = await axios.post(
          `${mainUrl}/api/v1/user/currentUser`,
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
      }
    }
    fetchUser();
  },[token, navigate]);

  return (
    <div>
      <Navbar>
        <div className='flex items-center text-lg'>
          Hello, <span className='mx-2'>{currentUser.firstName}</span>
          <img 
            className='rounded-[50%] '
            src={currentUser.imageUrl} 
            alt="image" 
          />
        </div>
      </Navbar>
      <main className='bg-white grid grid-cols-1 md:grid-cols-[40%_60%] w-[99%] h-[84vh] mx-auto my-2 p-4 rounded-md shadow-md'>
        <LeftSec>
          <img 
            className='w-[30%] rounded-[50%] mx-auto'
            src={currentUser.imageUrl} 
            alt="image" 
          />
          <h1 className='text-4xl font-bold my-6'>{currentUser.username}</h1>
        </LeftSec>
        <RightSec currentUser={currentUser}/>
      </main>
    </div>
  )
}

function LeftSec({children}) {
  return (
    <div>
      <button className='text-left'>{`<`}</button>
      <div className=' text-center py-10 h-[100%] rounded-xl border-r-2 shadow-xl'>
        {children}
      </div>
    </div>
  )
}

function RightSec({currentUser}) {
  const [ currentBalance, setCurrentBalance ] = useState(0);
  const [ editSec, setEditSec ] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

      async function fetchBalance() {
        try {
          const response = await axios.get(
            `${mainUrl}/api/v1/account/balance`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setCurrentBalance(response.data.data.balance);
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
      fetchBalance();
    },[token]);

  return (
    <div className='rounded-xl shadow-xl'>
      {editSec && <UpdateUserDetails />}
      <main className=' px-10 pt-10'>
        <button className='text-xl text-blue-600 underline'>Edit</button>
        <div className='text-4xl font-bold my-6'>
          Current Balance : ₹<span>{currentBalance}</span>
        </div>
        <div className='text-2xl  my-10'>
          First Name : <span className='text-4xl font-bold'>{currentUser.firstName}</span>
        </div>
        <div className='text-2xl my-10'>
          Last Name : <span className='text-4xl font-bold'>{currentUser.lastName}</span>
        </div>
      </main>
    </div>
  )
}

function UpdateUserDetails() {
  return (
    <div className='bg-amber-200'>
      <div>
        First Name : 
      </div>
    </div>
  )
}