import React, { useState, useEffect } from "react";

const StudentPage2 = () => {
  const slides = [
    {
      image: "https://via.placeholder.com/300x300?text=Image+1", // Replace with your image URL
      title: "1.4 Lakh+",
      description: "Students awarded Scholarships since 2020",
    },
    {
      image: "https://via.placeholder.com/300x300?text=Image+2", // Replace with your image URL
      title: "1700+",
      description: "Students awarded 100% Scholarship",
    },
    {
      image: "https://via.placeholder.com/300x300?text=Image+3", // Replace with your image URL
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
    <div className="relative flex justify-center bottom-3/4 left-[30%] h-full w-96">
      <div className="absolute w-96 h-3/4 overflow-hidden rounded-xl shadow-lg">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-transform duration-700 ${
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
              <div className="absolute bottom-4 left-4 text-white">
                <h2 className="text-4xl font-bold">{slide.title}</h2>
                <p className="text-lg">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentPage2;
