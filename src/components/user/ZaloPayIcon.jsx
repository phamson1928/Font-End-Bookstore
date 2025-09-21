import React from "react";

const ZaloPayIcon = ({ className = "w-6 h-6", color = "#0068FF" }) => {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <rect
          x="2"
          y="2"
          width="20"
          height="20"
          rx="4"
          fill={color}
        />
        <path
          d="M7 8h10v2H7V8zm0 3h10v2H7v-2zm0 3h7v2H7v-2z"
          fill="white"
        />
        <circle
          cx="16"
          cy="16"
          r="2"
          fill="white"
        />
      </svg>
    </div>
  );
};

export default ZaloPayIcon;