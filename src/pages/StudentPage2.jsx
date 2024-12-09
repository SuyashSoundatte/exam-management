import React, { useState, useEffect } from "react";
import ScrollBar from "../components/scrollBar";

const StudentPage2 = () => {
  const slides = [
    {
      image: "./public/assets/dk1.webp", // Replace with your image URL
      title: "1.4 Lakh+",
      description: "Students awarded Scholarships since 2020",
    },
    {
      image: "./public/assets/dk3.webp", // Replace with your image URL
      title: "1700+",
      description: "Students awarded 100% Scholarship",
    },
    {
      image: "./public/assets/dk4.webp", // Replace with your image URL
      title: "26000+",
      description: "Students awarded 50% Scholarship",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [slides.length]);

  return (
    <div className="relative flex justify-center items-center h-full w-full p-4 lg:p-8 ">
      <div className="relative w-full max-w-lg h-3/4 sm:h-3/4 md:h-[550px] lg:h-[650px] lg:w-[450px] overflow-hidden rounded-xl shadow-lg lg:bottom-3/4 lg:right-20">
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
      <div className="pageFooter h-28 w-full absolute bg-pink-500 top-[200%] lg:top-[125%]">

      </div>
    </div>
  );
};

export default StudentPage2;
