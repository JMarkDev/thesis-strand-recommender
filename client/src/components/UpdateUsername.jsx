import React from 'react'
import { Link } from 'react-router-dom'
import { TbArrowBackUp } from 'react-icons/tb'

function UpdateUsername() {
  return (
    <>
        <Link to={'/admin'} className="py-2 rounded-lg bg-gray-700 text-white flex items-center justify-center w-20 text-center"><TbArrowBackUp />Back</Link>
      
        {/* <div className='flex items-center justify-center'> */}

      <div className="w-[450px] sm:mx-auto sm:w-full sm:max-w-lg px-8 py-10 mt-6 overflow-hidden bg-white p-4 rounded-lg shadow-md">
        <div className='flex'>
        </div>
        <h3 className='text-gray-600 mb-6'>Please enter your New Email. We will send you a one time code</h3>

        <form  >
          <div>
            <label className='block text-gray-700'>Username</label>
            <input
              type="text"
              className='block w-full rounded-md border py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            />
          </div>
          {/* error message */}
          <button  
            className='w-full bg-indigo-500 text-white px-4 py-2 mt-8 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600'
            type='submit'
            >
            Continue
          </button>
        </form>
      </div>
    {/* </div> */}
    </>
  )
}

export default UpdateUsername