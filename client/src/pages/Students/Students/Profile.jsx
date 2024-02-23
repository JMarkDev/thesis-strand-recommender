import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../api/api';
import UpdateUsername from './UpdateUsername' 

function Profile() {
    const [updateUsername, setUpdateUsername] = useState(false)
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [gender, setGender] = useState("");
    const [recommended, setRecommended] = useState('');
    const { id } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [nameError, setNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get(`/students/${id}`);
                setName(response.data[0].name)
                setUsername(response.data[0].username)
                setGender(response.data[0].gender)
                // setPassword(response.data[0].password)
                setRecommended(response.data[0].recommended)
            } catch (err) {
                console.log(err);
            }
        };
        fetchUserData();
    }, [id]);

    const handleGenderChange = (e) => {
        setGender(e.target.value);
    }

    const handleUpdate = async function (e) {
        e.preventDefault();
        
        setNameError('');
        setPasswordError('');
        setConfirmPasswordError('');

        const updateDetais = {
            name: name,
            username: username,
            password: password,
            confirmPassword: confirmPassword,
            gender: gender,
            role: "student"
        }

        try {
            const response = await api.put(`/students/update/${id}`, updateDetais);
            console.log(response.data)
            alert(response.data.message);
            setTimeout(() => {
                setIsEditing(false);
            }, 1000)
        } catch (err) {
            console.log(err.response);
            if(err.response.data.errors.length > 0) {
                err.response.data.errors.forEach((error) => {
                    switch (error.path) {
                        case 'name': 
                            setNameError(error.msg)
                            break;
                        case 'password':
                            setPasswordError(error.msg)
                            break;
                        case 'confirmPassword':
                            setConfirmPasswordError(error.msg)
                            break;
                        default:
                        console.log(error.msg)
                    }
                })
            }
        }
    }

    const handleUpdateUsername = () => {
        setUpdateUsername(false);
    };
    

    return (
        <>
        { updateUsername ? (
            <div className='h-[100vh]'>
                <UpdateUsername handleUpdateUsername={handleUpdateUsername} />               
            </div>
        ) : (
            <div className='bg-gradient-to-b from-cyan-600 to-transparent  dark:bg-black h-[650px]'>
        <div className='flex justify-center items-center '>
            <div className='bg-gray-200 dark:bg-[#273242] mt-10 rounded shadow-md p-10 md:w-[550px]  lg:w-[550px]'>
                <h1 className='text-3xl font-bold text-center mb-4 dark:text-white'>Profile</h1>
                <div className=''>
                        <div className='mb-4'>
                            <label className='block text-sm font-medium text-gray-700 dark:text-white'>Full Name</label>
                            <p className='dark:text-white mt-1 p-2 block w-full border border-gray-300 dark:border-gray-600 rounded-md'>
                                {name}
                            </p>
                        </div>
                        
                        <div className='mb-4'>
                            <div className='flex'>
                                <label className='block text-sm font-medium text-gray-700 dark:text-white'>Email</label>
                                <span className="text-sm text-[#9E9E9E] mx-2">|</span>
                                <button 
                                    type="button" 
                                    className="text-sm text-[#1A9CB7]"
                                    onClick={() => setUpdateUsername(true)}
                                >
                                    Change
                                </button>
                            </div>
                            <p className='dark:text-white mt-1 p-2 block w-full border border-gray-300 dark:border-gray-600 rounded-md text-black'>
                                {username}
                            </p>
                        </div>

                            <div className='mb-4'>
                                <label className='block text-sm font-medium text-gray-700 dark:text-white'>Gender</label>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={gender === "male"}
                                        onChange={() => setGender("male")} // Assuming you have a state and a setter function
                                        className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out accent-blue-600"
                                    />
                                    <label htmlFor="male" className="ml-2 dark:text-white">Male</label>

                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={gender === "female"}
                                        onChange={() => setGender("female")} // Assuming you have a state and a setter function
                                        className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out ml-3  accent-blue-600"
                                    />
                                    <label htmlFor="female" className="ml-2 dark:text-white">Female</label>
                                </div>
                            </div>


                        <div className='mb-4'>
                            <label className='block text-sm font-medium text-gray-700 dark:text-white'>Recommended Strand:</label>
                            {recommended ? (
                                <p className='text-sm text-gray-500 dark:text-white'>{recommended}</p>
                            ) : (
                                <div className='flex items-center'>
                                    <p className='text-red-700 text-sm dark:text-white'>You have not taken the recommendation yet</p>
                                    <Link className='text-blue-700 ml-2 dark:text-white' to='/input'>Click here</Link>
                                </div>
                            )}
                        </div>
                        
                </div>
                <button
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'
                        onClick={() => setIsEditing(true)}
                    >
                        Edit Profile
                    </button>

                    {/* Modal for editing profile */}
                    {isEditing && (
                        <div className='px-5 fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50'>
                            <div className='w-[550px]  bg-white dark:bg-[#273242] rounded-lg p-8'>
                            <form onSubmit={handleUpdate} method="PUT">
                            <div className='mt-0 mx-3 mb-5'>
                            <div className='mt-0 mx-3 mb-5 flex flex-col justify-center items-center'>
                            </div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-white'>Full Name*</label>
                            <input type='text'
                            name='Full N' 
                            value={name}
                            className={`mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                                ${nameError ? 'border-red-600' : ''}
                            `}
                            onChange={(e) => setName(e.target.value)}
                            />
                            <p className="text-sm dark:text-white">(Last Name, First Name, Middle Initial, Suffix)</p>
                             {nameError && <div className="text-red-600 text-sm">{nameError}</div>}
                            </div>
                           
                            <div className='mt-0 mx-3 mb-5'>
                            <label className='block text-sm font-medium text-gray-700 dark:text-white'>Email*</label>
                            <p className='mt-1 p-2 block w-full focus:outline-none dark:text-white'>
                                {username} 
                            </p> 
                            </div>
                            <div className='mt-0 mx-3 mb-5'>
                                <label className='block text-sm font-medium text-gray-700 dark:text-white'>Gender*</label>
                                <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={gender === "male"}
                                onChange={handleGenderChange}
                                className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out  accent-blue-600"
                            />
                            <label htmlFor="male" className="ml-2 dark:text-white">Male</label>
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={gender === "female"}
                                onChange={handleGenderChange}
                                className="form-radio h-4 w-4 text-indigo-600  transition duration-150 ease-in-out ml-3  accent-blue-600"
                            />
                            <label htmlFor="female" className="ml-2 dark:text-white">Female</label>
                            </div>
                            <div className='mt-0 mx-3 mb-5'>
                            <label className='block text-sm font-medium text-gray-700 dark:text-white'>Password*</label>
                            <input
                            type="password"
                            name="password"
                            placeholder='********'
                            // value={password} 
                            className={`mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                            ${passwordError ? 'border-red-600' : ''}
                            `}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                            {passwordError && <div className="text-red-600 text-sm">{passwordError}</div>}
                            </div>
                            <div className='mt-0 mx-3 mb-5'>
                            <label className='block text-sm font-medium text-gray-700 dark:text-white'>Confirm Password*</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder='********'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                                ${confirmPasswordError ? 'border-red-600' : ''}
                                `}
                            />
                            {confirmPasswordError && <div className="text-red-600 text-sm">{confirmPasswordError}</div>}
                            </div>
                            <div className='flex justify-end '>
                                    <button 
                                    onClick={() => setIsEditing(false)} 
                                    className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 mr-4'
                                    >
                                        Close
                                    </button>
                                    <button
                                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'
                                    type='Submit'
                                    >
                                    Save
                                </button>
                            </div>
                            </form>   
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        )}
        
            
        </>
    );
}

export default Profile;
