import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'

function AdminPassword({ handleVerifyPassword }) {
  const [passwordError, setPasswordError] = useState('');
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPasswordError('')

    try {
       // Pass the password to the parent component for API call
      const response = await handleVerifyPassword(password)
      console.log(response)
    } catch (error) {
      setPasswordError(error.response.data.message)
    }
  }

  const submitDisabled = !password

  return (
    <div className='flex items-center justify-center'>
    {/* { loader && 
      <div className="absolute flex items-center justify-center h-screen">
        <Loading />
      </div>
    } */}
      <div className="w-[450px] sm:mx-auto sm:w-full sm:max-w-lg px-8 py-10 mt-6 overflow-hidden bg-white p-4 rounded-lg shadow-md">
        <div className='flex'>
        <Link to="/admin" className="flex items-center gap-2 mb-4">
          <MdOutlineKeyboardBackspace className='text-2xl'/>
        </Link>
        <h1 className="ml-5 text-2xl font-semibold mb-4">Verify Your Identity</h1>
        </div>
        <h3 className='text-gray-600 mb-6'>Enter your password to edit admin information.</h3>

        <form onSubmit={handleSubmit} >
          <div>
            <label className='block text-gray-700'>Password</label>
            <input
              type="password"
              className={`block w-full rounded-md border py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                passwordError  ? 'border-red-600' : '' 
              }`}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* error message */}
          {passwordError && <div className="text-red-600 text-sm">{passwordError}</div>}
          <button  
            className={`w-full bg-indigo-500 text-white px-4 py-2 mt-8 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600
            ${submitDisabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
            type='submit'
            disabled={submitDisabled}
            >
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminPassword