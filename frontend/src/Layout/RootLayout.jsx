import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Menubar/Navbar";
import Sidebar from "../Components/Menubar/Sidebar";
import { Theme } from "@radix-ui/themes";

const RootLayout = () => {
  return (
    <div className="flex font-jakarta">
      <div className="w-1/6 relative">
        <Sidebar />
      </div>
      <div className="w-5/6 bg-abu/30">
        <Navbar />
        <main className="m-8 h-screen bg-white shadow-md">
          <Theme>
            <Outlet />
          </Theme>
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
