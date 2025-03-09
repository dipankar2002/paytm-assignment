import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { mainUrl } from '../Api/apiFetch';

export default function Balance() {
    const [ curentBalance, setCurrentBalance ] = useState(0);
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
          if (error.response && error.response.status === 401) {
            console.warn("Unauthorized! Redirecting to login...");
            navigate('/signin');
          }
        }
      }
      fetchBalance();
    },[token]);

  return (
    <div className='text-2xl mx-6 border-b-2 border-gray-200 pb-2'>
      Your Curent Balance is: ₹<span className='font-bold'>{curentBalance}</span>
    </div>
  )
}
