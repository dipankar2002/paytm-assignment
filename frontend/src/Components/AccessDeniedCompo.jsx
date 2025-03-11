import React from 'react'

export default function AccessDenied({ children }) {
  return (
    <div className=' flex justify-center items-center w-[100vw] h-[100vh]'>
      <div className='bg-white w-[30%] py-10 rounded-md text-center shadow-2xl'>
        <h1 className='text-3xl font-bold pb-2'>Access Denied</h1>
        <div className='text-xl text-gray-600'>You need to be logged in to access this page</div>
        {children}
      </div>
    </div>
  )
}