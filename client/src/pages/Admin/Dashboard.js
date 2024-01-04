import React, { useEffect, useState } from 'react'
import { FaUser } from "react-icons/fa"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import PieComponent from './PieComponent';
import YearDropdown from '../../components/YearDropdown'
import api from '../../api/api';

const Dashboard = () => {
    const COLORS = [
        '#e88245', 
        '#8daa3b', 
        '#1f82c1', 
        '#9333ea', 
        '#ff5733', 
        '#6c5b7b', 
        '#ffcc29', 
        '#00a8cc'];

    const graphColors = [ 
        '#e88245', 
        '#8daa3b', 
        '#1f82c1', 
        '#9333ea', 
        '#ff5733', 
        '#6c5b7b', 
        '#ffcc29', 
        '#00a8cc'
    ]
    const [strand, setStrand] = useState([]);
    const [selectedYear, setSelectedYear] = useState(2023);
    const [data, setData] = useState([]);

    useEffect(() => {
        const totalData = async () => {
            try{
                const response = await api.get('/strand/total');
                setStrand(response.data);
            } catch(err) {
                console.log(err);
            }
        }
        totalData();
    }, [])

    let colorIndex = 0;

    const getNextColor = () => {
        const color = COLORS[colorIndex];
        colorIndex = (colorIndex + 1) % COLORS.length;
        return color;
    };

    let graphColorIndex = 1;

    const getGraphColor = () => {
        const color = graphColors[graphColorIndex];
        graphColorIndex = (graphColorIndex + 1) % graphColors.length;
        return color;
    };

    const fetchDataStatatistics = async (year) => {
        try {
            const response = await api.get(`/strand/monthly/${year}`);
            setData(response.data);
            setSelectedYear(year);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchDataStatatistics(selectedYear);
    }, [selectedYear])

    const handleYearChange = (year) => {
        fetchDataStatatistics(year);
    }

    return (
        <div className='dash min-h-screen w-auto'>
        <div>
            <div className='grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 '>
                {
                    strand.map((strand, index) => (
                        <div key={index} className='bg-gradient-to-r from-transparent to-gray-400 dark:bg-gray-700  border-4 h-[130px] rounded-[20px] bg-white border-l-[6px] flex items-center px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out '  
                        style={{ borderColor: getNextColor() }}
                        >
                            <div className='flex'>
                                <div className='rounded-full h-12 w-12 flex items-center justify-center bg-emerald-200'>
                                    <FaUser fontSize={28} color="" />
                                </div>
                                <div className='ml-5'>
                                    <h2 className='text-[#030712] text-[16px] leading-[17px] px-[10px] font-bold'>{strand.strand}</h2>
                                    <h1 className='text-[20px] leading-[24px] text-lg font-bold text-[#5a5c69] px-[10px] mt-[5px] dark:text-white'>{strand.recommendedCount}</h1>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>

            <div className='flex flex-col md:flex-row md:gap-6 mt-[16px] w-full'>
            <div className='basis-[60%] border-4 border-black dark:border-white bg-white shadow-md cursor-pointer rounded-[4px] dark:bg-black mb-4 md:mb-0 lg:mb-0 lg:mr-4'>
                    <div className='bg-gray-500 flex items-center justify-between py-[15px] px-[20px] dark:bg-gray-800  border-b-4 border-black dark:border-white  mb-[20px]'>
                        <h2 className='text-[#020617]  dark:text-white text-[16px] leading-[19px] font-bold '>Students Chart</h2>
                        <YearDropdown 
                            selectedYear={selectedYear} 
                            onYearSelect={handleYearChange} 
                        />
                    </div>

                    <div className="lineChart">
                        <ResponsiveContainer width="93%" height={400}>
                        <LineChart
                            data={data}
                            margin={{
                                top: 5,
                                right: 5,
                                left: 10,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="6 6"/>
                            <XAxis dataKey="month" />
                            <YAxis domain={[0, 'dataMax + 1']} />
                            {/*
                            <YAxis domain={[0, 500]} /> 
                            
                            <YAxis domain={[0, 500]} ticks={[0, 100, 200, 300, 400, 500]} />
                            */}
                            <Tooltip />
                            <Legend />
                            {data && data.length > 0 && Object.keys(data[0])
                                .filter((key) => key !== 'month')
                                .map((key, index) => (
                                  <Line
                                    key={index}
                                    type="monotone"
                                    dataKey={key}
                                    stroke={getGraphColor()}
                                    activeDot={{ r: 8 }}
                                  />
                                ))}
                        </LineChart>
                        </ResponsiveContainer>
                    </div>

                </div>
                <div className='basis-[40%] border-4 border-black dark:border-white bg-white  shadow-md cursor-pointer rounded-[4px] dark:bg-black'>
                    <div className='bg-gray-500 flex items-center justify-between py-[15px] px-[20px] border-b-4 border-black dark:border-white dark:bg-gray-800 ]'>
                        <h2 className='text-[#020617]  dark:text-white  text-[16px] leading-[19px] font-bold'>Proportion</h2>
                        
                    </div>
                    <div className=' w-full h-4/5 dark:text-white'>

                    <PieComponent data={strand}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard   