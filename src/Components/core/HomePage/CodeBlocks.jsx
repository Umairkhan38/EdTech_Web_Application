import React from 'react'
import CTABUTTON from './Button'
import { HighlightText } from './HighlightText'
import { FaArrowRightArrowLeft } from 'react-icons/fa6'
import { TypeAnimation } from 'react-type-animation'


function CodeBlocks({ position,content, heading, subheading, ctabtn1, ctabtn2, codeblock, backgroundGradient, codeColor }) {
  return (
    <div className={`flex ${position} my-20 justify-between gap-8`}>   

        {/* section1 */}
        <div className="w-[50%] flex flex-col gap-8">
            {heading}

            <div className="text-richblack-300  font-bold">
                    {subheading}
            </div>

            <div className="flex gap-7 mt-7">
                <CTABUTTON active={ctabtn1.active} linkto={ctabtn1.linkto}>
                    <div className='flex gap-2 items-center'>
                        {ctabtn1.text}
                    </div>

                </CTABUTTON>

                <CTABUTTON active={ctabtn2.active} linkto={ctabtn2.linkto}>
                    <div className='flex gap-2 items-center'>
                        {ctabtn2.text}
                    </div>

                </CTABUTTON>
            </div>

        </div>


        {/* section2 */}

        <div className="h-fit code-border flex flex-row py-3 text-[10px] sm:text-sm leading-[18px] sm:leading-6 relative w-[100%] lg:w-[470px]">
        {backgroundGradient}
        {/* Indexing */}
        <div className="text-center flex flex-col  w-[10%] select-none text-richblack-400 font-inter font-bold ">
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>5</p>
          <p>6</p>
          <p>7</p>
          <p>8</p>
          <p>9</p>
          <p>10</p>
          <p>11</p>
        </div>

        {/* Codes */}
        <div
          className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-1`}
        >
          <TypeAnimation
            sequence={[codeblock, 1000, ""]}
            cursor={true}
            repeat={Infinity}
            style={{
              whiteSpace: "pre-line",
              display: "block",
            }}
            omitDeletionAnimation={true}
          />
        </div>
      </div>

           {/* Code Section 2 */}
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
              btnText: "Continue Lesson",
              link: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              link: "/signup",
              active: false,
            }}
            codeColor={"text-white"}
            codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
            backgroundGradient={<div className="codeblock2 absolute"></div>}
          />
        </div>
       
    </div>
  )
}

export default CodeBlocks