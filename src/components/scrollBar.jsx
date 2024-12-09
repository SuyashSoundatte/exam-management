import React from "react";

const ScrollBar = ({ itemCount = 5, scrollDuration = 30 }) => {
  const items = Array.from({ length: itemCount }, (_, i) => i + 1);
  const images = [
    "https://via.placeholder.com/300?text=Image+1",
    "https://via.placeholder.com/300?text=Image+2",
    "https://via.placeholder.com/300?text=Image+3",
    "https://via.placeholder.com/300?text=Image+4",
    "https://via.placeholder.com/300?text=Image+5",
  ];

  const wrapperStyles = {
    WebkitMaskImage: `linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 5%, rgba(0, 0, 0, 1) 95%, rgba(0, 0, 0, 0))`,
    maskImage: `linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 5%, rgba(0, 0, 0, 1) 95%, rgba(0, 0, 0, 0))`,
  };

  const keyframesScrollLeft = `
    @keyframes scrollLeft {
      to {
        left: -300px;
      }
    }
  `;

  return (
    <div>
      <style>
        {keyframesScrollLeft}
      </style>
      <div
        className="relative mx-auto mt-40 h-96 w-full max-w-[1536px] overflow-hidden"
        style={wrapperStyles}
      >
        {items.map((item, index) => (
          <div
            key={item}
            className="absolute h-full w-80 rounded-md bg-red-500"
            style={{
              animation: `scrollLeft ${scrollDuration}s linear infinite`,
              animationDelay: `calc(${scrollDuration}s / ${itemCount} * (${itemCount} - ${index}) * -1)`,
              left: "max(calc(250px * 8), 100%)",
            }}
          >
            {/* Updated Image Logic */}
            <img
              src={images[index % images.length]}
              alt={`Item ${index + 1}`}
              className="h-full w-full object-cover rounded-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollBar;
