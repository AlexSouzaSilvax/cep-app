import React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-12 h-12 border-t-4 border-gray-400 border-solid rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
