import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { LiaEdit } from 'react-icons/lia';
import axios from 'axios';
import { Dialog, Transition } from "@headlessui/react";
// import { GrView } from 'react-icons/gr';
import { Fragment } from "react";
import api from '../api/api';

function CourseTable({ courses }) {
  const [courseList, setCourseList] = useState(courses);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    setCourseList(courses);
  }, [courses]);

  const openDeleteDialog = (id) => {
    setDeleteUserId(id);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteUserId(null);
    setIsDeleteDialogOpen(false);
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  };

  const handleDeleteCourse = async (id) => {
    try {
      const response = await api.delete(`/course/delete/${id}`);
      console.log(response);
      // Update the course list without the deleted course
      const newCourseList = courseList.filter((course) => course.id !== id);
      setCourseList(newCourseList);
    } catch (error) {
      console.log(error);
    }
    closeDeleteDialog();
  };
  
  
  return (
    <>
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
        <th
        className="px-6 py-3 bg-[#a8a29e] dark:bg-[#292524] text-center text-xs leading-4 font-medium text-black dark:text-white uppercase tracking-wider "
        
      >
        Id
      </th>
          <th
            className="px-6 py-3 bg-[#a8a29e] dark:bg-[#292524] text-center text-xs leading-4 font-medium text-black dark:text-white uppercase tracking-wider"
            
          >
            Image
          </th>
          <th
            className="px-6 py-3 bg-[#a8a29e] dark:bg-[#292524] text-center text-xs leading-4 font-medium text-black dark:text-white uppercase tracking-wider"
          >
            Title
          </th>
          <th
            className="px-6 py-3 bg-[#a8a29e] dark:bg-[#292524] text-center text-xs leading-4 font-medium text-black dark:text-white uppercase tracking-wider"
            
          >
            Description
          </th>
          <th
            className="px-6 py-3 bg-[#a8a29e] dark:bg-[#292524] text-center text-xs leading-4 font-medium text-black dark:text-white uppercase tracking-wider"
           
          >
            Strand
          </th>
          <th
            className="px-6 py-3 bg-[#a8a29e] dark:bg-[#292524] text-center text-xs leading-4 font-medium text-black dark:text-white uppercase tracking-wider"
           
          >
            Action
          </th>
        </tr>
      </thead>
      <tbody className="bg-gray-300 dark:bg-gray-700 divide-y divide-gray-800 dark:divide-white text-black dark:text-white ">
        {
          courseList.map((course) => (
                   <tr key={course.id}>
                   <td className="px-6 py-4 whitespace-no-wrap">{course.id}</td>
                       <td className="px-6 py-4 whitespace-no-wrap">
                            <div className="relative group">
                                <img
                                src={`${api.defaults.baseURL}/${course.image}`}
                                    alt=""
                                    className="h-100 w-100 rounded-lg transition-transform transform scale-100 group-hover:scale-150"
                                />
                            </div>
                        </td>
                
                        <td className="px-6 py-4 whitespace-no-wrap">{course.title}</td>
                        <td className="px-6 py-4 w-300 whitespace-no-wrap">
                        {truncateText(course.description, 100)} {/* Adjust the max length */}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap">{course.strand}</td>
                        <td className="px-3 py-4">
                            <button className="text-red-600 hover:text-red-800"
                                onClick={() => openDeleteDialog(course.id)}
                            >
                                <MdDelete className="h-6 w-6" />
                            </button>
                            <button className="ml-5 text-red-600 hover:text-red-800">
                                <Link to={`/course/edit/${course.id}`} className="text-decoration-none">
                                    <LiaEdit className="h-6 w-6" />
                                </Link>
                            </button>
                         
                        </td>
                    </tr>
                
            ) 
        )}
      </tbody>
    </table>
    <Transition show={isDeleteDialogOpen} as={Fragment}>
    <Dialog
      as="div"
      className="fixed inset-0 z-10 overflow-y-auto"
      onClose={closeDeleteDialog}
    >
      <div className="min-h-screen px-4 text-center">
        {/* Use the appropriate element depending on your needs */}
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        {/* This is your modal container */}
        <span
          className="inline-block h-screen align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-center align-middle transition-all transform bg-white shadow-xl rounded-2xl">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900"
            >
              Delete Course
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete this course?
              </p>
            </div>

            <div className="mt-4">
            <button
            type="button"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
            onClick={() => handleDeleteCourse(deleteUserId)} // Pass deleteUserId here
          >
            Delete
          </button>
          
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 ml-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                onClick={closeDeleteDialog}
              >
                Cancel
              </button>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Dialog>
  </Transition>

    </>
  );
}

export default CourseTable;
