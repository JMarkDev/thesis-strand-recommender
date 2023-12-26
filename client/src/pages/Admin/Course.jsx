import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CourseTable from '../../components/CourseTable'
import axios from 'axios'
import Dropdown from '../../components/Dropdown'
import api from '../../api/api'

function Course() {
  const [courses, setCourses] = useState([])
  
  useEffect(() => {
    api.get('/course')
      .then((res) => {
        setCourses(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

// Course.js
const handleFilter = (strand) => {
  if (strand === 'Default') {
    // Load all courses
    api.get('/course')
      .then((res) => {
        setCourses(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    // Load courses based on the selected strand
    api.get(`/course/fetch/${strand}`)
      .then((res) => {
        setCourses(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

  return (
    <div className='w-auto'>
      <div className='flex justify-between items center w-auto'>
        <div className='mt-5 mb-10'>
          <Link to='/courses/add' className=' bg-black p-3 px-5 rounded-lg text-white  hover:bg-orange-500  dark:hover:bg-orange-500'>
            Add Course
          </Link>
        </div>
        <div >
          <Dropdown handleFilter={handleFilter} />
        </div>
      </div>
      
      <CourseTable courses={courses} />
   
    </div>
  )
}

export default Course
