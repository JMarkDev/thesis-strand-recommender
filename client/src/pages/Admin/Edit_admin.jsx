import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { TbArrowBackUp } from "react-icons/tb";
import api from "../../api/api";
import AdminPassword from "../Authentication/AdminPassword";
import UpdateUsername from "../../components/UpdateUsername"

function Edit_admin() {
    const [changeUsername, setChangeUsername] = useState(false);
    const [adminPassword, setAdminPassword] = useState(true);
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [gender, setGender] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const navigate = useNavigate();

    let {id} = useParams()

    useEffect(() => {
          api.get(`/admin/${id}`)
        .then((response) => {
            const data = response.data
            setName(data[0].name);
            setUsername(data[0].username);
            // setPasswordConfirmation(data.password);
            setGender(data[0].gender);
          })
          .catch((error) => {
            console.error("Error fetching data", error)
          })

      }, [id]);
      

    const handleSubmit = async function (e) {
        e.preventDefault();

        setPasswordError("");
        setConfirmPasswordError("");

        const updateDetais = {
            name: name,
            username: username,
            password: password,
            confirmPassword: confirmPassword,
            gender: gender,
            role: "admin"
        }

        try{
            const response = await api.put(`/admin/update/${id}`, updateDetais);
            alert(response.data.message)
            navigate('/admin')
        }
        catch(error){
          console.log(error.response)
          if (error.response && error.response.data.errors) {
            error.response.data.errors.forEach((error) => {
              switch (error.path) {
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
          }
        }
    }

    const handleVerifyPassword = async (password) => {

      try {
        const values = {
          username: username,
          password: password,
        }
        
        const response = await api.post('/login', values, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });

        console.log(response.data)
        if (response.data.status === 'success') {
          setAdminPassword(false)
        }

      } catch (error) {
          console.log(error)
          throw error
      }
    }

    const handleChangeUsername = () => {
      setChangeUsername(true)
      setAdminPassword(false)
    }

  return (
    <>
    { changeUsername && <UpdateUsername /> }

    { !changeUsername && (
      <div>
        {adminPassword ? (
          <AdminPassword handleVerifyPassword={handleVerifyPassword} /> 
        ): (
          <div>
      <Link to={'/admin'} className="py-2 rounded-lg bg-gray-700 text-white flex items-center justify-center w-20 text-center"><TbArrowBackUp />Back</Link>
      <div className="w-full m-auto px-6 py-4 mt-6 overflow-hidden  bg-gray-200 dark:bg-gray-700 shadow-md sm:max-w-lg sm:rounded-lg">
        <form onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-white undefined"
            >
              Name
            </label>
            <div className="flex flex-col items-start">
            <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            </div>
          </div>
          <div className="mt-4">
            
            <div className="flex items-start">
              <label className="inline-flex items-center mt-2 mr-4 ">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={e =>
                    setGender(e.target.value)
                  }
                  className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
                <span className="ml-2 dark:text-white">Male</span>
              </label>
              <label className="inline-flex items-center mt-2">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={e =>
                    setGender(e.target.value)
                  }
                  className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
                <span className="ml-2 dark:text-white">Female</span>
              </label>
              
            </div>
          </div>
          <div className="mt-4">
            <div className="flex">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 undefined dark:text-white"
            >
              Email
            </label>
            <span className="text-sm text-[#9E9E9E] mx-2">|</span>
            <button 
              className="text-sm text-[#1A9CB7]"
              onClick={handleChangeUsername}
              >
              Change
            </button>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-gray-900 dark:text-white py-2">{username}</p>
                {/* value={username} 
                onChange={e => setUsername(e.target.value)} // Update values.username
                className="block w-full rounded-md py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              /> */}
            </div>
          </div>
         
          <div className="mt-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 undefined dark:text-white"
            >
              Password
            </label>
            <div className="flex flex-col items-start">
              <input
                type="password"
                placeholder="Password"
                name="password"
                // value={password}
                onChange={e => setPassword(e.target.value )}
                className={`block w-full rounded-md border py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                  passwordError  ? 'border-red-600' : '' // Apply border-red-600 class when there's an error
                }`}
              />
            </div>
            {passwordError && <div className="text-red-600 text-sm">{passwordError}</div>} 
          </div>
          <div className="mt-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 undefined dark:text-white"
            >
              Confirm Password
            </label>
            <div className="flex flex-col items-start">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                // value={passwordConfirmation}
                onChange={e => setConfirmPassword(e.target.value)}
                className={`block w-full rounded-md border py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                  confirmPasswordError  ? 'border-red-600' : '' // Apply border-red-600 class when there's an error
                }`}
              />
            </div>
            {confirmPasswordError && <div className="text-red-600 text-sm">{confirmPasswordError}</div>} 
          </div>
          <div className="flex items-center mt-4">
            <button
              className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
              type="submit"
            >
              Update
            </button>
          </div>
        </form>
        </div>
        </div>
        )}
      </div>
    )}  
    </>  
  )
}

export default Edit_admin