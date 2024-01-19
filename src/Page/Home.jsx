import React from 'react';
import { FaArrowRight } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { HighlightText } from '../Components/core/HomePage/HighlightText';
import CTABUTTON from '../Components/core/Button';


function Home() {
  return (
    <div>   
    {/* section1 */}
       <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between'>
        <Link to ={"/signup"}>
        <div className='mx-auto group p-2 mt-10 rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit'>      
            <div className='flex flex-row items-center gap-1 rounded-full px-18 py-[5px] transition-all duration-200 group-hover:bg-richblack-900'>
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
        </div>
        </Link>

        <div data-aos="fade-right" className="mt-8 text-center text-4xl font-semibold">
          Empower Your Future with
          <HighlightText text={"Coding Skills"} />
        </div>

        {/* Sub Heading */}
        <div  data-aos="fade-left" className="mt-3 w-[90%] text-center text-lg font-bold text-richblack-300">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>

         <div className='flex flex-row gap-7 mt-8'>

          <CTABUTTON active={true} linkto={'/signup'}>Learn More</CTABUTTON>
          <CTABUTTON active={false} linkto={'/login'}>Book a Demo</CTABUTTON>
           
        </div> 

       </div> 
    </div>
  )
}

export default Home