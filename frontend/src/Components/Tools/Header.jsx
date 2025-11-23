import React from "react";
import { Separator } from "radix-ui";

const Header = ({ title = "", children }) => {
  return (
    <div className="bg-gradient-to-r from-slate-50 via-blue-50 to-slate-50 border-b-2 border-blue-200 shadow-sm">
      <div className="flex justify-between items-center px-4 md:px-8 py-4 md:py-5">
        <div className="flex justify-between items-center font-bold text-xl md:text-2xl text-gray-800">
          {title}
        </div>
        {children}
      </div>
    </div>
  );
};

export default Header;
