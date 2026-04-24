import React from 'react';

const TargetBullseye = () => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className="target-logo"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer ring */}
      <circle cx="50" cy="50" r="45" fill="none" stroke="#000000" strokeWidth="14"/>
      {/* Middle ring */}
      <circle cx="50" cy="50" r="25" fill="none" stroke="#000000" strokeWidth="14"/>
      {/* Inner dot */}
      <circle cx="50" cy="50" r="8" fill="#000000"/>
    </svg>
  );
};

export default TargetBullseye;
