import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import StrandTable from './Strand/StrandTable'

function Strand() {
  const [strand, setStrand] = useState([])

  useEffect(() => {
    axios.get('http://backend.api.senior-high-school-strand-recommender.pro/strand/fetch')

    .then((res) => {
      setStrand(res.data)
    })
    .catch((err) => {
      console.log(err)
    })
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