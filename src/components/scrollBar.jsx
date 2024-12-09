import React from "react";

const ScrollBar = ({ itemCount = 5, scrollDuration = 30 }) => {
  const items = Array.from({ length: itemCount }, (_, i) => i + 1);

  const wrapperStyles = {
    WebkitMaskImage: `linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0))`,
    maskImage: `linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0))`,
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
        {items.map((item) => (
          <div
            key={item}
            className="absolute h-full w-80 rounded-md bg-red-500"
            style={{
              animation: `scrollLeft ${scrollDuration}s linear infinite`,
              animationDelay: `calc(${scrollDuration}s / ${itemCount} * (${itemCount} - ${item}) * -1)`,
              left: "max(calc(250px * 8), 100%)",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ScrollBar;