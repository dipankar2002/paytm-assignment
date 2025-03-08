import React from 'react'

export default function InputCompo({children, value, setValue, type="text", min=0, max=50000}) {
  
  return (
    <div className=' grid grid-cols-1 w-[80%] mx-auto text-left font-bold my-2'>
      {children}
      <input 
        className='border-2 border-blue-200 px-3 py-2 mt-1 rounded-md text-xl font-normal'
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        max={max}
        min={min}
        placeholder={"Enter "+String(children).toLowerCase()}
        required
      />
    </div>
  )
}
