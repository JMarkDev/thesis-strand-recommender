import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import StrandTable from './StrandTable'
import api from '../../../api/api'

function Strand() {
  const [strand, setStrand] = useState([])

  useEffect(() => {
    const getStrandData = async () => {
      try {
        const response = await api.get('/strand/all');
        setStrand(response.data)
      } catch (err) {
        console.error(err);
      }
    }

    getStrandData()
  }, [])


  return (
    <div>
          <div className='my-10 h-full'>
          <Link to='/strand/add' className=' bg-black  p-3 px-5 rounded-lg text-white  hover:bg-orange-500  dark:hover:bg-orange-500'>
            Add Strand
          </Link>
        </div>
      <StrandTable strand={strand}/>
    </div>
  )
}

export default Strand