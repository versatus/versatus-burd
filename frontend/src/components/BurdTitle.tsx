import React from "react";

const BirdTitle = ({}) => {
  return (
    <>
      <div className="flex items-center justify-center p-4 flex-row gap-4 text-white text-xl">
        <img
          src="/burd.webp"
          alt="Logo"
          className="h-36 w-36 rounded-full mr-2"
        />
        <span
          className={
            "flex flex-col justify-start pr-12 text-left items-start gap-1"
          }
        >
          <span className={"text-pink-600 text-6xl font-black"}>Burd</span>
        </span>
      </div>
    </>
  );
};

export default BirdTitle;
