import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { List, SignOut } from "@phosphor-icons/react";

const Navbar = () => {
  const [user, setUser] = React.useState(
    JSON.parse(localStorage.getItem("profile"))
  );
  const navigate = useNavigate();

  const handleLogout = () => {
    // remove auth data and redirect to login
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    setUser(null);
    navigate("/auth");
  };

  const toggleSidebar = () => {
    const event = new CustomEvent("toggleSidebar");
    window.dispatchEvent(event);
  };

  return (
    <div className="flex w-full justify-between items-center px-4 md:px-8 py-4 font-bold text-sm md:text-base shadow-lg bg-white/80 backdrop-blur-md border-b border-gray-200/50 relative z-20">
      {/* Gradient decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-cyan-50/50 pointer-events-none"></div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2.5 cursor-pointer hover:bg-blue-100 rounded-lg transition-all relative z-10 border border-gray-200 shadow-sm"
        aria-label="Toggle Menu"
      >
        <List size={24} weight="bold" className="text-blue-600" />
      </button>

      {/* Spacer for desktop */}
      <div className="hidden md:block flex-1"></div>

      {/* User Section */}
      {user ? (
        <div className="flex gap-3 md:gap-4 items-center relative z-10">
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2 rounded-xl border border-blue-200 shadow-sm">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md">
              {user.result.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs text-gray-500 font-normal">
                Selamat datang,
              </div>
              <div className="font-semibold text-gray-800">
                {user.result.name}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl text-white text-xs md:text-sm px-4 py-2.5 cursor-pointer transition-all shadow-md hover:shadow-lg font-semibold"
          >
            <SignOut size={17} weight="bold" />
            LOGOUT
          </button>
        </div>
      ) : (
        <Link
          to="/auth"
          className="cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
        >
          LOGIN
        </Link>
      )}
    </div>
  );
};

export default Navbar;
