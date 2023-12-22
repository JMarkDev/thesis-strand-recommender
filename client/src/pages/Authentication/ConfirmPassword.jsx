import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import api from '../../api/api';
import Loading from "../../components/loading/otpLoader/otpLoader";

function ConfirmPassword() {
    const [loader, setLoader] = useState(false);
    const [usernameError, setUsernameError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const { state } = useLocation();
    const navigate = useNavigate();

    const username = state ? state.username : '';
    const otp = state ? state.otp : '';

    const [values, setValue] = useState({
      username: username,
      otp: otp,
      password: "",
      confirmPassword: ""
    })

    const [passwordError, setPasswordError] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')

    const handleConfirmPassword = async (e) => {
        e.preventDefault();
        setLoader(true);
        setPasswordError('')
        setConfirmPasswordError('')
        
        try {
            const response = await api.post('/otp/confirm-change-password', values );
            if(response.data.status === 'success') {
                setSuccessMessage(response.data.message)
                setLoader(false);

                setTimeout(() => {
                  navigate('/Log-in')
                }, 2000)
            }

        } catch (error) {
          setLoader(false);

         if(error.response && error.response.data.errors) {
            error.response.data.errors.forEach((error) => {
              switch (error.path) {
                case 'password' :
                  setPasswordError(error.msg)
                  break;
                case 'confirmPassword' :
                  setConfirmPasswordError(error.msg)
                  break;
                default:
                  break;
              }
            })

         }

        }
    }

  return (
    <>
    {
        successMessage &&
        <div
          className="absolute flex w-full mx-auto rounded-lg bg-green-100 px-10 py-5 text-base text-green-500 justify-center items-center"
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
      }
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
          <h1 className="ml-5 text-2xl font-semibold mb-4">New Password</h1>
          </div>
          <h3 className='text-gray-600 mb-6'>Please enter your new password below:</h3>
  
          <form onSubmit={handleConfirmPassword} >
            <div>
              <label className='block text-gray-700'>Password</label>
              <input
                type="password"
                value={values.password}
                name='password'
                className={`block w-full rounded-md border py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                  passwordError  ? 'border-red-600' : '' 
                }`}
                onChange={(e) => setValue({...values, password: e.target.value})}
              />
            </div>
            {/* error message */}
            {passwordError && <div className="text-red-600 text-sm">{passwordError}</div>}
            <div className='mt-4'>
              <label className='block text-gray-700'>Confirm Password</label>
              <input
                type="password"
                name='confirmPassword'
                value={values.confirmPassword}
                className={`block w-full rounded-md border py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                  confirmPasswordError  ? 'border-red-600' : '' 
                }`}
                onChange={(e) => setValue({...values, confirmPassword: e.target.value})}
              />
            </div>
            {/* error message */}
            {confirmPasswordError && <div className="text-red-600 text-sm">{confirmPasswordError}</div>}
            <button
              type="submit"
              className='w-full bg-indigo-500 text-white px-4 py-2 mt-8 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600'
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      </>
  )
}

export default ConfirmPassword