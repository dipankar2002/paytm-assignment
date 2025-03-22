import React from 'react'

export default function Navbar({children}) {
  return (
    <div className='flex justify-between items-center px-6 md:px-16 lg:px-24 py-6 bg-white shadow-md rounded-b-md'>
      <h1 className='text-2xl font-bold'>PayTM App</h1>
      {children}
    </div>
  )
}
