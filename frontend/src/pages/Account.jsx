import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { mainUrl } from '../Api/apiFetch';
import Navbar from '../Components/Navbar';
import AccessDenied from '../Components/AccessDeniedCompo';

export default function Account() {
  const [ token, setToken] = useState("");
  const [ currentUser, setCurrentUser ] = useState({});
  const [ loading, setLoading ] = useState(true);
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
        setLoading(false);
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
          Hello, <span className='mx-2'>{currentUser.firstName}</span>
          <img 
            className='rounded-[50%] '
            src={currentUser.imageUrl} 
            alt="image" 
          />
        </div>
      </Navbar>
      {loading && <h1 className='text-black bg-white py-10 text-4xl text-center'>Loading...</h1>}
      {!loading && <main className='bg-white grid grid-cols-1 md:grid-cols-[40%_60%] w-[99%] h-[84vh] mx-auto my-2 p-4 rounded-md shadow-md'>
        <LeftSec>
          <img 
            className='w-[30%] rounded-[50%] mx-auto'
            src={currentUser.imageUrl} 
            alt="image" 
          />
          <h1 className='text-4xl font-bold mt-6'>{currentUser.username}</h1>
        </LeftSec>
        <RightSec currentUser={currentUser}/>
      </main>}
    </div>
  )
}

function LeftSec({children}) {
  const navigate = useNavigate();
  return (
    <div>
      <button 
        className='text-left text-xl text-blue-600 hover:text-black'
        onClick={()=>navigate('/')}
      >{`< back`}</button>
      <div className=' text-center py-10 h-[95%] rounded-xl border-r-2 shadow-xl'>
        {children}
      </div>
    </div>
  )
}

function RightSec({currentUser}) {
  const navigate = useNavigate();
  const [ currentBalance, setCurrentBalance ] = useState(0);
  const [ editSec, setEditSec ] = useState(false);

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
      {editSec && 
      <UpdateUserDetails currentUser={currentUser} setEditSec={setEditSec}/>}

      <main className=' px-10 pt-10'>
        <button 
          className='text-xl text-blue-600 underline hover:text-black'
          onClick={()=>setEditSec((prev)=>!prev)}  
        >{!editSec?`edit`:`close`}</button>

        <div className='text-4xl font-bold my-6'>
          Current Balance : ₹<span>{currentBalance}</span>
        </div>
        <div className='text-2xl  my-10'>
          First Name : <span className='text-4xl font-bold'>{currentUser.firstName}</span>
        </div>
        <div className='text-2xl my-10'>
          Last Name : <span className='text-4xl font-bold'>{currentUser.lastName}</span>
        </div>
        <button
          className='text-xl text-blue-600 underline hover:text-black'
          onClick={()=>{
            navigate('/signin', { replace: true });
          }}
        >Sign Out</button>
      </main>
    </div>
  )
}

function UpdateUserDetails({currentUser, setEditSec}) {
  const [ updateUN, setUpdateUN ] = useState("");
  const [ updateFN, setUpdateFN ] = useState("");
  const [ updateLN, setUpdateLN ] = useState("");
  const [ updateP, setUpdateP ] = useState("");

  const [ loading, setLoading ] = useState(false);

  const token = localStorage.getItem('token');

  async function onSubmit(e) {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await axios.put(`${mainUrl}/api/v1/user/update`,
        { 
          username: updateUN,
          password: updateP,
          firstName: updateFN.toLowerCase(), 
          lastName: updateLN.toLowerCase()
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      setEditSec(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  }

  return (
    <form 
      className='bg-blue-200 shadow-2xl rounded-xl border-2 px-4 py-4'
      onSubmit={onSubmit}
    >
      {loading && <h1 className='text-black text-4xl text-center'>Loading...</h1>}
      <table className="border-separate border-spacing-2">
        <tbody>
          <tr className='my-2 text-xl'>
            <td>First Name : </td>
            <td>
              <input 
                className='border-2 mx-2 px-2 font-bold'
                type="text"
                placeholder={currentUser.firstName}
                value={updateFN}
                onChange={(e)=>setUpdateFN(e.target.value)}
              />
            </td>
          </tr>
          <tr className='my-2 text-xl'>
            <td>Last Name : </td>
            <td>
              <input 
                className='border-2 mx-2 px-2 font-bold'
                type="text"
                placeholder={currentUser.lastName}
                value={updateLN}
                onChange={(e)=>setUpdateLN(e.target.value)}
              />
            </td>
          </tr>
          <tr className='my-2 text-xl'>
            <td>Username : </td>
            <td>
              <input 
                className='border-2 mx-2 px-2 font-bold'
                type="text"
                placeholder={currentUser.username}
                value={updateUN}
                onChange={(e)=>setUpdateUN(e.target.value)}
              />
            </td>
          </tr>
          <tr className='my-2 text-xl'>
            <td>Password : </td>
            <td>
              <input 
                className='border-2 mx-2 px-2 font-bold'
                type="text"
                placeholder={`********`}
                value={updateP}
                onChange={(e)=>setUpdateP(e.target.value)}
              />
            </td>
          </tr>
        </tbody>
        <tfoot>
          {updateFN || updateLN || updateUN || updateP ?
            <tr>
              <td>
                <button
                  className='bg-blue-700 px-2 p-1 rounded-md text-white font-bold'
                >Update</button>
              </td>
            </tr> :
            null
          }
        </tfoot>
      </table>
    </form>
  )
}