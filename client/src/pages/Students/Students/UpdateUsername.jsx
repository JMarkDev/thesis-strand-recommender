import React, { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { TbArrowBackUp } from 'react-icons/tb'
import api from '../../../api/api'
import Loading from '../../../components/loading/otpLoader/otpLoader'

function UpdateUsername({ handleUpdateUsername }) {
  const [username, setUsername] = useState('')
  const [otp, setOTP] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [otpError, setOtpError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loader, setLoader] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setUsernameError('')
    setOtpError('')

    setLoader(true)
    try {
      const response = await api.post(`/admin/update-username/${id}`,  { username: username })
      console.log(response.data)
      if (response.data.status === 'success') {
        setSuccessMessage(response.data.message)
        setLoader(false)
      }
    } catch (error) {
      setLoader(false)
        if (error.response.data.errors) {
          setUsernameError(error.response.data.errors[0].msg)
        } else if (error.response.data.status === 'error') {
          setUsernameError(error.response.data.message)
        }
      console.log(error)
    }
  }

  const handleChangeUsername = async (e) => {
    e.preventDefault()
    const values = {
      id: id,
      username: username,
      otp: otp,
      role: 'student'
    }

    setLoader(true)
    setUsernameError('')
    setOtpError('')
    setSuccessMessage('')

    try {
      const response = await api.put(`/admin/update-username-verifyOTP/${id}`, values)
      console.log(response.data)
      if (response.data.status === 'success') {
        setSuccessMessage('Your Username has been updated successfully')
      }
      setTimeout(() => {
        handleUpdateUsername()
      }, 2000)
      
      setLoader(false)
    } catch (error) {
      setLoader(false)
      if(error.response.data.status === 'error') {
        setOtpError(error.response.data.message)
      } else if (error.response.data.errors) {
        setUsernameError(error.response.data.errors[0].msg)
      }
      console.log(error)
    }
  }

  const submitDisable = !(username && otp)


  return (
    <>
    { loader && 
    <div className='absolute right-[50%] top-[50%]'>
      <Loading />
    </div>
    }
    {
      successMessage &&
      <div
        className="absolute right-0 flex w-[100%] mx-auto rounded-lg bg-green-100 px-6 py-5 text-base text-green-500 justify-center items-center"
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
        <Link to={`/profile/${id}`} className="py-2 mt-5 ml-5 rounded-lg bg-gray-700 text-white flex items-center justify-center w-20 text-center"
        onClick={() => { handleUpdateUsername()
        }}
        >
          <TbArrowBackUp />Back
        </Link>
      
        {/* <div className='flex items-center justify-center'> */}

      <div className="w-[450px] m-auto sm:mx-auto sm:w-full sm:max-w-lg px-8 py-10 mt-6 overflow-hidden bg-white p-4 rounded-lg shadow-md">
        <div className='flex'>
        </div>
        <h1 className='test-center text-2xl font-semibold mb-4'>Enter New Email</h1>
        <h3 className='text-gray-600 mb-6'>Please enter your New Email. We will send you a one time code</h3>

        {/* <form  > */}
          <div>
            <label className='block text-gray-700'>Username</label>
            <input
              name='username'
              type="text"
              placeholder='Username'
              onChange={(e) => setUsername(e.target.value)}
              className={`block w-full rounded-md border py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                usernameError  ? 'border-red-600' : '' // Apply border-red-600 class when there's an error
              }`}
            />
          </div>
          {usernameError && <div className="text-red-600 text-sm">{usernameError}</div>}
          <div className='mt-4'>
            <label className='block text-gray-700'>OTP</label>
            <div className='flex relative items-center'>
            <input
              inputMode='numeric'
              pattern='[0-9]*'
              maxLength="4" 
              name='otp'
              placeholder='4 digits'
              className={`block w-full rounded-md border py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                otpError  ? 'border-red-600' : '' // Apply border-red-600 class when there's an error
              }`}
              onChange={(e) => setOTP(e.target.value)}
            />
            <button 
              onClick={handleSubmit} 
              className='text-[#1A9CE7] text-sm absolute right-5'>
            SEND
          </button>
            </div>
          </div>
          {/* error message */}
          {otpError && <div className="text-red-600 text-sm">{otpError}</div>}
          <button  
            className={`w-full bg-indigo-500 text-white px-4 py-2 mt-8 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600 
            ${submitDisable ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            disabled={submitDisable}
            onClick={handleChangeUsername}
            >
            Verify Code
          </button>
        {/* </form> */}
      </div>
    {/* </div> */}
    </>
  )
}

export default UpdateUsername