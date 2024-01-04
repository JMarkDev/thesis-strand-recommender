import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../api/api";
import logo from '../../../assets/images/FLL.png'
import Loading from "../../../components/loading/otpLoader/otpLoader";

export default function Register() {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "", 
    role: "student", // Set a default role
  });

  const [nameError, setNameError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
  
    setLoader(true);
  
    // Clear error messages when the user submits the form
    setNameError("");
    setGenderError("");
    setUsernameError("");
    setPasswordError("");
    setConfirmPasswordError("");
  
    try {
      const response = await api.post("/register", values, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      console.log(response.data);
  
      if (response.data.status === "success") {
        navigate("/verify", { state: { username: values.username, role: values.role } });
      } else {
        alert(response.data.message);
      }
      
    } catch (error) {
      setLoader(false);

      if (error.response && error.response.data.status === 'error') {
        setUsernameError(error.response.data.message);
      }
  
      if (error.response && error.response.data.errors) {
        error.response.data.errors.forEach((error) => {
          switch (error.path) {
            case 'name':
              setNameError(error.msg);
              break;
            case 'gender':
              setGenderError(error.msg);
              break;
            case 'username':
              setUsernameError(error.msg);
              break;
            case 'password':
              setPasswordError(error.msg);
              break;
            case 'confirmPassword':
              setConfirmPasswordError(error.msg);
              break;
            default:
              // Handle other errors as needed
              break;
          }
        });
      } else {
        // Handle unexpected errors
        console.error("Unexpected error:", error);
      }
    }
  };
  

  return (
    <>
    <div className="relative">
      <div
        className="flex flex-col items-center sm:justify-center sm:pt-0"/>
        <div
        className="flex-grow h-screen flex items-center justify-center bg-cover bg-center  "
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1488998427799-e3362cec87c3?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        }}
        
      >
    
    {loader && 
      <div className="absolute flex items-center justify-center h-screen">
        <Loading />
      </div>
    }
          
            <div className="w-[350px] sm:mx-auto sm:w-full sm:max-w-md px-4 py-4 mt-6 overflow-hidden bg-gradient-to-b from-transparent to-cyan-300 shadow-md sm:rounded-lg">
            <div className="p-5 m-auto flex justify-center items-center">
              <img src={logo} className="w-[180px] h-[30px] " alt="logo"/>
            </div>
              <form onSubmit={handleRegister}>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 undefined"
                  >
                    Name
                  </label>
                  <div className="flex flex-col items-start">
                    <input
                      type="text"
                      name="name"
                      value={values.name}
                      onChange={(e) =>
                        setValues({ ...values, name: e.target.value })
                      }
                      className={`block w-full rounded-md border py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        nameError  ? 'border-red-600' : '' // Apply border-red-600 class when there's an error
                      }`}
                    />
                  </div>
                  {/* <div className="h-4">  */}
                    {nameError && <div className="text-red-600 text-sm">{nameError}</div>}
                  {/* </div> */}
                </div>
                <div className="mt-2">
                  <label
                    className="block text-sm font-medium text-gray-700 undefined"
                  >
                    Gender
                  </label>
                  <div className="flex items-start">
                    <label className="inline-flex items-center mt-2 mr-4">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={values.gender === "male"}
                        onChange={(e) =>
                          setValues({ ...values, gender: e.target.value })
                        }
                        className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                      />
                      <span className="ml-2">Male</span>
                    </label>
                    <label className="inline-flex items-center mt-2">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={values.gender === "female"}
                        onChange={(e) =>
                          setValues({ ...values, gender: e.target.value })
                        }
                        className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                      />
                      <span className="ml-2">Female</span>
                    </label>
                  </div>
                  {/* <div className="h-4">  */}
                    {genderError && <div className="text-red-600 text-sm">{genderError}</div>}
                  {/* </div> */}
                </div>
                <div className="mt-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 undefined"
                  >
                    Email
                  </label>
                  <div className="flex flex-col items-start">
                    <input
                      type="text"
                      name="email"
                      value={values.username} // Use values.username
                      onChange={e => setValues({ ...values, username: e.target.value })} // Update values.username
                      className={`block w-full rounded-md border py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        usernameError  ? 'border-red-600' : '' // Apply border-red-600 class when there's an error
                      }`}
                    />
                  </div>
                  {/* <div className="h-4">  */}
                    {usernameError && <div className="text-red-600 text-sm">{usernameError}</div>}
                  {/* </div> */}
                </div>
               
                <div className="mt-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 undefined"
                  >
                    Password
                  </label>
                  <div className="flex flex-col items-start">
                    <input
                      type="password"
                      name="password"
                      value={values.password}
                      onChange={e => setValues({ ...values, password: e.target.value })}
                      className={`block w-full rounded-md border py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        passwordError  ? 'border-red-600' : '' // Apply border-red-600 class when there's an error
                      }`}
                    />
                  </div>
                  {/* <div className="h-4">  */}
                    {passwordError && <div className="text-red-600 text-sm">{passwordError}</div>}
                  {/* </div> */}
                </div>
                <div className="mt-2">
                  <label
                    htmlFor="password_confirmation"
                    className="block text-sm font-medium text-gray-700 undefined"
                  >
                    Confirm Password
                  </label>
                  <div className="flex flex-col items-start">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={values.confirmPassword}
                      onChange={(e) => setValues({ ...values, confirmPassword: e.target.value })}
                      className={`block w-full rounded-md border py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        confirmPasswordError  ? 'border-red-600' : '' // Apply border-red-600 class when there's an error
                      }`}
                    />
                  </div>
                  {/* <div className="h-4">  */}
                    {confirmPasswordError && <div className="text-red-600 text-sm">{confirmPasswordError}</div>}
                  {/* </div> */}
                </div>
                <div className="flex items-center mt-4">
                  <button
                    className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                    type="submit"
                  >
                    Register
                  </button>
                </div>
              </form>
            
              <div className="mt-4 text-gray-600">
                Already have an account?{" "}
                <span>
                  <Link to="/Log-in" className="text-purple-600 hover:underline">
                    Log in
                  </Link>
                </span>
              </div>
            </div>
{/* 
          )
        } */}
     
       
      </div>
    </div>
    </>
  );
}