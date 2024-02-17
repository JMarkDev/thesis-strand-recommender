import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TbArrowBackUp } from 'react-icons/tb';
import api from '../../.././api/api'
function Grades() {
  const [data, setData] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const getGradesData = async () => {
      try {
        const response = await api.get(`/grades/${id}`);
        // remove the strand property from the response
        const filterData = response.data.map(({ strand, ...data}) => data);

        setData(filterData);
      } catch (err) {
        console.log(err);
      }
    };
    getGradesData(); 
  }, [id]);

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function downloadCSV() {
    const headers = ["Subject", "Grade"];
    const dataRows = filteredGradeEntries.map(([key, value]) => [capitalizeFirstLetter(key), value]);
  
    // Separate arrays for additional information
    const courseRow = ["Course", course];
  
    const csvContent = [headers, ...dataRows, [], courseRow].map(row => row.join(',')).join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'grades.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  

  if (!data.length) {
    return <p>Loading...</p>;
  }

  const filteredGradeEntries = Object.entries(data[0]).filter(([key]) => key !== 'studentId' && key !== 'course');
  const course = data[0]?.course;

  return (
    <div className="container mx-auto p-4">
      <Link
        to="/users"
        className="py-2 rounded-lg bg-gray-700 text-white flex items-center justify-center w-20 text-center"
      >
        <TbArrowBackUp />
        Back
      </Link>

      <div className="max-w-md mx-auto p-4 bg-white dark:bg-gray-700 border rounded-lg shadow-lg">
        <div className='flex justify-between items-center'>
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Grades Information</h2>
          <button
            className='px-4 py-2 bg-blue-500 text-white rounded shadow-lg hover:bg-blue-700 focus:outline-none'
            onClick={downloadCSV}
          >
            Download
          </button>
        </div>
        <div className="mb-4">
          <p className="font-bold text-lg dark:text-white">Course:</p>
          <p className='font-bold dark:text-white'>{course}</p>
        </div>

        <table className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 rounded-md overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left dark:text-white dark:bg-gray-700">Subject</th>
              <th className="py-2 px-4 dark:text-white dark:bg-gray-700">Grade</th>
            </tr>
          </thead>
          <tbody>
            {filteredGradeEntries.map(([key, value]) => (
              <tr key={key} className="border-t border-gray-300 dark:text-white dark:bg-gray-700">
                <td className="py-2 px-4 ">{capitalizeFirstLetter(key)}</td>
                <td className="py-2 px-4 text-center">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Grades;
