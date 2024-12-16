import React, { useState, useEffect } from "react";
import ScrollBar from "../components/scrollBar";

const StudentPage2 = () => {
  const slides = [
    {
      image: "./public/assets/dk1.webp", 
      title: "1.4 Lakh+",
      description: "Students awarded Scholarships since 2020",
    },
    {
      image: "./public/assets/dk3.webp", 
      title: "1700+",
      description: "Students awarded 100% Scholarship",
    },
    {
      image: "./public/assets/dk4.webp", 
      title: "26000+",
      description: "Students awarded 50% Scholarship",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000); 

    return () => clearInterval(interval); 
  }, [slides.length]);

  return (
    <div className="relative flex justify-center items-center h-full w-full p-4 lg:p-8 ">
      <div className="relative w-full max-w-lg h-3/4 sm:h-3/4 md:h-[550px] lg:h-[650px] lg:w-[390px] overflow-hidden rounded-lg shadow-lg lg:bottom-[93%] lg:right-20">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
              index === currentIndex ? "translate-x-0" : "translate-x-full"
            }`}
            style={{
              transform: `translateX(${(index - currentIndex) * 100}%)`,
            }}
          >
            <div className="relative w-full h-full">
              <img
                src={slide.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 p-4 rounded-lg">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{slide.title}</h2>
                <p className="text-sm sm:text-base lg:text-lg">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="infoContent absolute top-full lg:top-60 h-full w-full flex bg-[#f0f0f0]">
          <div className="scroller h-full w-full">
            <ScrollBar />
          </div>
      </div>
     
      

<footer className="pageFooter w-full absolute top-[200%] lg:top-[125%] bg-white">
    <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
      <span className="text-sm text-black- font-medium sm:text-center">© 2023 <a href="https://www.dkte.ac.in/" target="_blank" className="hover:underline">DKTE</a>. All Rights Reserved.
    </span>
    <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-black sm:mt-0">
        <li>
            <a href="#" className="hover:underline me-4 md:me-6">About</a>
        </li>
        <li>
            <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
        </li>
        <li>
            <a href="#" className="hover:underline me-4 md:me-6">Licensing</a>
        </li>
        <li>
            <a href="#" className="hover:underline">Contact</a>
        </li>
    </ul>
    </div>
</footer>


      
    </div>
  );
};

export default StudentPage2;
