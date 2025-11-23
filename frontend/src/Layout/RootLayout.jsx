import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Menubar/Navbar";
import Sidebar from "../Components/Menubar/Sidebar";
import { Theme } from "@radix-ui/themes";

const RootLayout = () => {
  return (
    <div className="flex font-jakarta min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30">
      <Sidebar />
      <div
        className="transition-all duration-300 w-full md:w-auto flex flex-col relative"
        style={{
          marginLeft: "var(--sidebar-width, 0px)",
          width: "calc(100% - var(--sidebar-width, 0px))",
        }}
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-200/20 to-blue-200/20 rounded-full blur-3xl pointer-events-none"></div>

        <Navbar />
        <main className="m-4 md:m-8 flex-1 bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 overflow-hidden relative z-10">
          {/* Inner shadow effect */}
          <div className="absolute inset-0 shadow-inner pointer-events-none rounded-2xl"></div>
          <Theme>
            <Outlet />
          </Theme>
        </main>

        {/* Footer badge */}
        <div className="px-4 md:px-8 pb-4 flex justify-center">
          <div className="text-xs text-gray-500 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200">
            © 2025 Sistem Arsip Buku Tanah
          </div>
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
