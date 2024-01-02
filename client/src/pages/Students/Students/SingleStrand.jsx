import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CarouselComponent from './CarouselComponent'
import { TbArrowBackUp } from 'react-icons/tb';
import Footer from '../../../components/Footer';
import api from '../../../api/api';

function SingleStrand() {
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('')
  const [strandImages, setStrandImages] = useState([]); // Store the image file
  const { id } = useParams();
  // id value is STRAND NAME from strand parameter

  useEffect(() => {
    const getFilteredCourse = async () => {
      try {
        const response = await api.get(`/course/fetch/${id}`)
        setCourses(response.data);
      } catch (err) {
        console.log(err);
      }
    } 
    getFilteredCourse();
  }, [id])

  useEffect(() => {
    const getStrand = async () => {
      try {
        const response = await api.get(`/strand/${id}`)

        const description = response.data[0].description.replace(/\n/g, '<br>');
        setDescription(description);

        setName(response.data[0].name)

        const imagesArray = response.data[0].image.split(',');
        setStrandImages(imagesArray);
      } catch (error) {
        console.log(error)
      }
    } 
    getStrand();
  }, [id])
  
  return (
    <>
    <div className="p-5 lg:p-10 xl:p-20 bg-gradient-to-r from-gray-600 via-transparent to-sky-500 dark:bg-black ">
      <div className="max-w-screen-xl mx-auto">
     

        <div>
          <Link to='/Strands' className="flex justify-center items-center bg-gray-500 hover:bg-gray-700 text-white px-6 py-2 rounded-md absolute top-20 mt-8">
            <TbArrowBackUp className='mr-2'/>Back
          </Link>
          <CarouselComponent images={strandImages}/>
          
          <div
            className="mt-10 text-lg lg:text-2xl font-semi text-justify py-5 px-5 rounded-2xl text-black dark:text-white dark:bg-slate-700 bg-sky-100" 
            dangerouslySetInnerHTML={{ __html: description }}
          ></div>

          <h1 className="text-2xl font-bold mt-5 text-white">
            {name} Strand Related Courses:
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mt-5">
            {courses.map((course) => (
              <div key={course.id} className='bg-gradient-to-b from-green-300 to-transparent dark:bg-black rounded-lg shadow-md dark:shadow-lg'>
                <div className='m-5 card-body text-gray-700 dark:text-gray-100'>
                  <img src={`${api.defaults.baseURL}/${course.image}`} alt={course.title} className='w-full h-[230px]' />
                  <h2 className='text-xl font-semibold py-3 dark:text-white'>{course.title}</h2>
                  <p className='text-base text-justify leading-6 mb-4 dark:text-white'>{course.description}</p>
                </div>
              </div>
            ))
          }
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default SingleStrand;