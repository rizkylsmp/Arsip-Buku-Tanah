import React from "react";
import { Separator } from "radix-ui";

const Header = ({ title = "", children }) => {
  return (
    <div>
      <div className="flex justify-between items-center px-8 py-4">
        <div className="font-bold text-2xl ">{title}</div>
        {children}
      </div>
      <Separator.Root className=" bg-abu/50 data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px" />
    </div>
  );
};

export default Header;
