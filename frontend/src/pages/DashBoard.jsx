import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import Balance from '../Components/Balance';
import UsersCompo from '../Components/UsersCompo';
import { mainUrl } from '../Api/apiFetch';
import AccessDenied from '../Components/AccessDeniedCompo';


export default function DashBoard() {
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

  if(!token) {
    return (
      <AccessDenied>
        <button
          className='bg-blue-500 w-[80%] py-2 text-white font-bold rounded-md mt-6'
          onClick={() => navigate('/signin')}
        >Sign In</button>
      </AccessDenied>
    )
  }

  return (
    <div>
      <Navbar>
        <div className='flex items-center text-lg'>
          <span className='mx-2 text-2xl capitalize font-medium'>{currentUser.firstName}</span>
          {/* <div className='bg-gray-400 w-10 h-10 rounded-[50%] text-center text-white pt-1'>
            {currentUser.firstName}
          </div> */}
          <img 
            className='rounded-[50%] '
            src={currentUser.imageUrl} 
            alt="image"
            onClick={()=>{
              navigate('/account');
            }}
          />
        </div>
      </Navbar>
      <main className='bg-white w-[99%] mx-auto my-2 p-2 rounded-md shadow-md'>
        <Balance/>
        <UsersCompo currentUserId={currentUser._id}/>
      </main>
    </div>
  )
}



