import React from 'react';
import { FaArrowRight } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { HighlightText } from '../Components/core/HomePage/HighlightText';
import CTABUTTON from '../Components/core/HomePage/Button';
import Banner from '../assets/Images/banner.mp4'
import CodeBlocks from '../Components/core/HomePage/CodeBlocks';
import TimelineSection from '../Components/core/HomePage/TimeLine';
import LearningLanguageSection from '../Components/core/HomePage/LanguageLearning';
import Footer from '../Components/Common/Footer';
import { TypeAnimation } from 'react-type-animation';
import ReviewSlider from '../Components/Common/reviewSlider';
import InstructorSection from '../Components/core/HomePage/InstructionSection'; 
import ExploreMore from '../Components/core/HomePage/ExploreMore';


function Home() {
  const text = <HighlightText text={"Coding Skills"} />
  console.log(text);

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
          {/* Empower Your Future with */}
          <TypeAnimation
            sequence={[`Empower Your Future with ${text.props.text}`, 500, ""]}
            cursor={true}
            repeat={Infinity}
            style={{
              whiteSpace: "pre-line",
              display: "block",
            }}
            omitDeletionAnimation={true}
          />
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

        <div className = "shadow-blue-200 mx-3 my-20 shadow-[-20px_-25px_12px_-12px_rgba(0,0,0,0.3)]">
          <video muted loop autoPlay>
              <source src={Banner} type="video/mp4"></source>
          </video>
        </div>


        {/* Code Section */}
        <div>
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div data-aos="fade-right" className="text-4xl font-semibold">
                Unlock your
                <HighlightText text={"coding potential"} /> with our online
                courses.
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            ctabtn1={{
              text: "Try it Yourself",
              link: "/signup",
              active: true,
            }}
            ctabtn2={{
              text: "Learn More",
              link: "/signup",
              active: false,
            }}
            codeColor={"text-yellow-25"}
            codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
            backgroundGradient={<div className="codeblock1 absolute"></div>}
          />
        </div>


        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div data-aos="fade-left" className="w-[100%] text-4xl font-semibold lg:w-[50%]">
                Start
                <HighlightText text={"coding in seconds"} />
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={{
              text: "Continue Lesson",
              link: "/signup",
              active: true,
            }}
            ctabtn2={{
              text: "Learn More",
              link: "/signup",
              active: false,
            }}
            codeColor={"text-white"}
            codeblock={`import React from "react";\n import CTABUTTON from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
            backgroundGradient={<div className="codeblock2 absolute"></div>}
          />
        </div>

            <ExploreMore />

       </div> 




      {/* section2 */}
        <div className="bg-pure-greys-5 text-richblack-700">
        <div className="homepage_bg h-[320px]">
          {/* Explore Full Catagory Section */}
          <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
            <div className="lg:h-[150px]"></div>
            <div className="flex flex-row gap-7 text-white lg:mt-8">
              <CTABUTTON active={true} linkto={"/signup"}>
                <div className="flex items-center gap-2">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CTABUTTON>
              <CTABUTTON active={false} linkto={"/login"}>
                Learn More
              </CTABUTTON>
            </div>
          </div>
          </div>

          <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 ">
          {/* Job that is in Demand - Section 1 */}
          <div className="mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">
            <div className="text-4xl font-semibold lg:w-[45%] ">
              Get the skills you need for a{" "}
              <HighlightText text={"job that is in demand."} />
            </div>
            <div className="flex flex-col items-start gap-10 lg:w-[40%]">
              <div className="text-[16px]">
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>
              <CTABUTTON active={true} linkto={"/signup"}>
                <div className="">Learn More</div>
              </CTABUTTON>
            </div>
          </div>
          <TimelineSection />
          <LearningLanguageSection />
          
          </div>
          </div>

          <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        {/* Become a instructor section */}
        <InstructorSection />

        {/* Reviws from Other Learner */}
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
        <ReviewSlider />
        
      </div>

            {/* Footer */}
            <Footer />
    </div>
  )
}

export default Home


