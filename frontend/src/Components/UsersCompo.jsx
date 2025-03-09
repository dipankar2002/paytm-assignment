import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { mainUrl } from '../Api/apiFetch';

export default function UsersCompo({currentUserId}) {
  const [ users, setUsers ] = useState([]);
  const [ filter, setFilter ] = useState("");
  const [ loading, setLoading ] = useState(true);


  useEffect(() => {
    let isMounted = true;
    async function fetchUsers() {
      try {
        const queryParam = filter ? `?filter=${filter.toLowerCase()}` : "";
        const response = await axios.get(`${mainUrl}/api/v1/user/bulk${queryParam}`);
  
        if (isMounted) {
          setLoading(false);
          setUsers(response.data.data.filter(ele => ele._id !== currentUserId));
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
    return () => {
      isMounted = false; // Prevents state update if component unmounts
    };
  }, [filter]); // Still dependent on filter, but always fetches users
  

  return (
    <div className='mx-6 mt-2'>
      <span className='text-2xl font-bold'>Users</span>
      <search className='flex justify-between items-center my-2 border-2 rounded-md'>
        <input 
          className=' px-2 py-2 w-[100%] focus:outline-none'
          type="text" 
          placeholder="Search Users"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        {filter && 
          <button 
            className=' font-bold text-xl mr-3'
            onClick={()=>setFilter("")}
          >X</button>}
      </search>
      <main>
          {loading && <h1 className='text-black text-4xl text-center'>Loading...</h1>}
          {users.filter((ele) => ele._id !== currentUserId).map((ele,i) => 
            <ShowUsers 
              key={i}
              image={ele.imageUrl}
              id={ele._id}
              firstName={ele.firstName}
              lastName={ele.lastName}
            />)}
      </main>
    </div>
  )
}

function ShowUsers({image, id, firstName, lastName}) {
  const navigate = useNavigate();
  const name = (
    firstName[0].toUpperCase() + firstName.slice(1,firstName.length) 
    + " " + 
    lastName[0].toUpperCase() + lastName.slice(1,lastName.length) 
  );

  return (
    <div className=' flex justify-between items-center my-2 py-4 px-3 rounded-lg shadow-xl'> 
      <div className='flex items-center'>
        <img 
          className='rounded-[50%]'
          src={image} 
          alt="user name" 
        />
        <span className='text-xl mx-2'>{name}</span>
      </div>
      <button 
        className='bg-black text-white px-4 py-2 font-bold rounded-md'
        onClick={() => {
          navigate("/send?id=" + id + "&name=" + name);
        }}
      >Send Money</button>
    </div>
  )
}