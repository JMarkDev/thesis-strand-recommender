import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import sendEmail from '../../assets/images/send-email.jpg'
import api from '../../api/api';
import Loading from "../../components/loading/otpLoader/otpLoader";
function OTP() {
  const [countDown, setCountDown] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [otpError, setOtpError] = useState('');
  const [loader, setLoader] = useState(false);
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  // Access the data
  const username = state ? state.username : '';
  const role = state ? state.role : '';

  const [otpDigits, setOtpDigits] = useState(['', '', '', '']); // Initialize state for OTP digits
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleChange = (index, value) => {
    // Update the OTP digit at the specified index
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;

    if(value && index < inputRefs.length - 1) {
      setTimeout(() => {
        inputRefs[index + 1].current.focus(); // Move focus to the next input field
      }, 0)
    }

    setOtpDigits(newOtpDigits);
  };

 useEffect(() => {
  // Automatically move back to the previous input field when clearing the input
  if (otpDigits.every(digit => !digit)) {
    // If all digits are cleared, move focus to the first input
    inputRefs[0].current.focus();
  } else if (!otpDigits[otpDigits.length - 1]) {
    // If the last digit is cleared, move focus to the last non-empty input
    let lastIndex = otpDigits.length - 1;
    while (lastIndex >= 0 && !otpDigits[lastIndex]) {
      lastIndex--;
    }
    if (lastIndex >= 0) {
      inputRefs[lastIndex].current.focus();
    }
  }
}, [otpDigits]);

  const handleVerify = async (e) => {
    e.preventDefault();

    setOtpError('');
    setLoader(true);

    try{
      const values = {
        email: username,
        role: role,
        otp: otpDigits.join(''), // Join the OTP digits into a single string
      }; 
      
      const response = await api.post('/otp/verify', values);
      console.log(response.data)
      if(response.data.status === 'success'){
        setLoader(false);
        setSuccessMessage(response.data.message)

        // setSuccessMessage(response.data.message)
  
        localStorage.setItem('token', response.data.token); 
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('userId', response.data.userId);

        const userRole = localStorage.getItem('role');
        const dashboardURL = userRole === 'admin' ? '/dashboard' : '/Home';

        setTimeout(() => {
          navigate(dashboardURL);
        }, 2000)
      } else {
        setLoader(false)
        // alert(response.data.message);
        setOtpError(response.data.message);
      }
    }
    catch(err){
      setLoader(false);
      console.log(err);
    }
  }

  const handleResend = async () => {
    setLoader(true);
    setOtpError('');

    try{
      const values = {
        email: username,
      }; 
      
      const response = await api.post('/otp/resend', values);
      console.log(response.data);
      if(response.data.status === 'success'){
        setTimeout(() => {
          setSuccessMessage(response.data.message)
        }, 0)
        setCountDown(60);
        setLoader(false);
      } else {
        setLoader(false)
      }
    }
    catch(err){
      setLoader(false);
      console.log(err);
    }
  }

  useEffect(() => {
    if (countDown > 0) {
      setTimeout(() => setCountDown(countDown - 1), 1000);
    }
  })

  const submitDisabled = otpDigits.includes('') || otpDigits.length < 4;

  return (
    <>
   {
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
}


    <div className="flex flex-col items-center justify-center h-screen">
      {loader && 
      <div className="absolute flex items-center justify-center h-screen">
        <Loading />
      </div>
      }
      <div className="w-[350px] sm:mx-auto sm:w-full sm:max-w-md px-4 py-4 mt-6 overflow-hidden bg-white p-4 rounded-lg shadow-md">
        <div className='flex'>
        <Link to="/register" className="flex items-center gap-2 mb-4">
          <MdOutlineKeyboardBackspace className='text-2xl'/>
        </Link>
        <h1 className="ml-5 text-2xl font-semibold mb-4">Account Verification</h1>
        </div>
        <div className="p-5 m-auto flex justify-center items-center">
            <img src={sendEmail} alt="Send Email" className="w-[150px] h-100 mb-4 " />
        </div>
        <h4 className='text-xl font-semibold mb-2'>
          Verify email address
        </h4>
        <p className="text-gray-600">Please enter the 4 digit OTP sent to</p>
        <p className='text-gray-600 mb-6'>{username}</p>

        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          {/* Render 4 input fields for OTP digits */}
          <div className='flex gap-6 items-center justify-center'>
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              // type="text"
              inputMode='numeric'
              pattern='[0-9]*'
              maxLength="1"
              value={otpDigits[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              ref={inputRefs[index]}
              className={`w-12 h-12 text-center border rounded-md focus:outline-none focus:border-indigo-500 bg-gray-300 font-sans text-lg bold-700
              ${otpError ? 'border-red-600 focus:border-red-600' : ''}
              `}
            />
          ))}
          </div>
          {/* <div className="h-auto ml-5"> */}
            { otpError && 
            <div className="ml-5 text-red-600 text-sm">{otpError}</div>
            }
          {/* </div> */}
          <button  
            className={`bg-indigo-500 text-white px-4 py-2 mt-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600
            ${submitDisabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
            type='submit'
            disabled={submitDisabled}
            >
            Verify
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm mt-4">
            <span>Didn't receive the OTP?</span>
            <button
              className={`text-indigo-500 focus:outline-none ${countDown > 0 ? 'opacity-50 cursor-not-allowed ml-2' : 'hover:text-indigo-600 ml-2'}`}
              disabled={countDown > 0}
              onClick={handleResend}
            >
            {countDown > 0 ? `Resend OTP in ${countDown}s` : 'Resend OTP'}
          </button>

          </p>
      </div>
    </div>
    </>
  );
}

export default OTP;
