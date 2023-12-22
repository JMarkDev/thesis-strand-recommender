import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../../assets/images/FLL.png';
import api from '../../../api/api';
function Login() {
  const [values, setValues] = useState({
    username: '',
    password: '',
    role: '', 
  });
  const [errorMessage, setErrorMessage] = useState(''); 
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate(); 
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
  
    // Clear error messages when the user submits the form
    setUsernameError('');
    setPasswordError('');
    setErrorMessage('');
  
    try {
      const response = await api.post('/login', values);
  
      if (response.data.status === 'success') {
        localStorage.setItem('token', response.data.token); 
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('userId', response.data.userId);
  
        const userRole = localStorage.getItem('role');
        const dashboardURL = userRole === 'admin' ? '/dashboard' : '/Home';
        setTimeout(() => {
          navigate(dashboardURL)
        }, 2000);
          
        setSuccessMessage(response.data.message);
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (err) {
      console.log(err.response); 
  
      if (err.response.data.errors) {
        err.response.data.errors.forEach((error) => {
          if (error.path === 'username') {
            setUsernameError(error.msg);
          } else if (error.path === 'password') {
            setPasswordError(error.msg);
          }
        });
      }
      setErrorMessage(err.response.data.message);
    }
  };
  
  
  return (
    <>
    {
      successMessage &&
      <div
        className="absolute flex w-full mx-auto  bg-green-100 px-6 py-5 text-base text-green-500 justify-center items-center"
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
    <div
      className="flex flex-col items-center h-screen sm:justify-center sm:pt-0"
      style={{
        backgroundImage: `url('http://images.unsplash.com/photo-1533073526757-2c8ca1df9f1c?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h2 className="text-center mb-5 text-3xl font-bold leading-9 tracking-tight text-gray-900">
              Discover the right Senior High School Strand suites for you!
            </h2>

        <div className="w-[350px] sm:mx-auto sm:w-full sm:max-w-md px-4 py-4 mt-6 overflow-hidden bg-gradient-to-r from-cyan-300 to-transparent p-4 rounded-lg shadow-md">
        <div className="p-5 m-auto flex justify-center items-center">
              <img src={logo} className="w-[180px] h-[30px] " alt="logo"/>
        </div>
          <form className="space-y-6" onSubmit={handleLogin}>
            <h2 className="text-center mb-5 text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  name="email"
                  type="text"
                  autoComplete="off"
                  onChange={(e) => setValues({ ...values, username: e.target.value })}
                  className={`block w-full rounded-md border py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                    usernameError || errorMessage ? 'border-red-600' : '' // Apply border-red-600 class when there's an error
                  }`}
                />
              </div>
              {/* <div className="h-4"> error message */}
                {usernameError && <div className="text-red-600 text-sm">{usernameError}</div>}
              {/* </div> */}
            </div>

            <div>
              <div className="mt-[-10px] flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <Link to="/change-password" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                onChange={(e) => setValues({ ...values, password: e.target.value })}
                className={`block w-full rounded-md border py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                  passwordError || errorMessage ? 'border-red-600' : '' // Apply border-red-600 class when there's an error
                }`}
              />


              </div>
              {/* <div className="h-4"> Fixed height for error message container */}
                {passwordError && <div className="text-red-600 text-sm">{passwordError}</div>}
                {errorMessage && <div className="text-red-600 text-sm">{errorMessage}</div>}
              {/* </div> */}
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-black-600">
            Not a member?{' '}
            <Link to="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Register
            </Link>
          </p>
        </div>
    </div>
    </>
  );
}

export default Login;