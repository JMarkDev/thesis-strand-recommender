import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import api from '../../api/api';
import Loading from "../../components/loading/otpLoader/otpLoader";

function ChangePassword() {
  const [loader, setLoader] = useState(false);
  const [username, setUsername] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoader(true);
    setUsernameError('');
    try {
      const response = await api.post('/otp/change-password', { username } );
      if(response.data.status === 'success') {
        // setSuccessMessage(response.data.message)
        navigate('/change-password-otp', { state: { username } })
      }
      console.log(response.data)
    } catch (error) {
      setLoader(false);
      setUsernameError(error.response.data.message)
      console.log(error)
    }
  }

  return (
    <>
    {/* {
      successMessage &&
      <div
        className="absolute flex w-full mx-auto rounded-lg bg-green-100 px-6 py-5 text-base text-green-500 justify-center items-center"
        role="alert"
      >
        <span className="flex-1 mr-3">{successMessage}</span>
        <svg
          className="w-5 h-5 fill-current text-green-500"
          role="button"
          viewBox="0 0 20 20"
          onClick={() => setSuccessMessage(false)}
        >
          <title>Close</title>
          <path
            fillRule="evenodd"
            d="M10.293 8l3.646-3.646a.5.5 0 11.708.708L11.707 8l3.647 3.646a.5.5 0 01-.708.708L10 8.707l-3.646 3.647a.5.5 0 01-.708-.708L9.293 8 5.646 4.354a.5.5 0 01.708-.708L10 7.293l3.646-3.647a.5.5 0 0 1 .708.708L10.707 8z"
            clipRule="evenodd"
          ></path>
        </svg>
      </div>
    } */}
    <div className='flex items-center justify-center h-screen'>
    { loader && 
      <div className="absolute flex items-center justify-center h-screen">
        <Loading />
      </div>
    }
      <div className="w-[350px] sm:mx-auto sm:w-full sm:max-w-md px-4 py-10 mt-6 overflow-hidden bg-white p-4 rounded-lg shadow-md">
        <div className='flex'>
        <Link to="/login" className="flex items-center gap-2 mb-4">
          <MdOutlineKeyboardBackspace className='text-2xl'/>
        </Link>
        <h1 className="ml-5 text-2xl font-semibold mb-4">Forgot Password?</h1>
        </div>
        <h3 className='text-gray-600 mb-6'>Please type in your email address for a password OTP</h3>

        <form onSubmit={handleSendOtp} >
          <div>
            <label className='block text-gray-700'>Email</label>
            <input
              type="text"
              className={`block w-full rounded-md border py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                usernameError  ? 'border-red-600' : '' 
              }`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          {/* error message */}
          {usernameError && <div className="text-red-600 text-sm">{usernameError}</div>}
          <button
            type="submit"
            className='w-full bg-indigo-500 text-white px-4 py-2 mt-8 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600'
          >
            Continue
          </button>
        </form>
      </div>
    </div>
    </>
  );
}

export default ChangePassword;
