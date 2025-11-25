import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArchiveIcon,
  HomeIcon,
  PersonIcon,
  FileTextIcon,
  PaperPlaneIcon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  // Get user role from localStorage
  const profile = JSON.parse(localStorage.getItem("profile") || "{}");
  const userRole = profile?.result?.role || "pegawai";

  const menu = [
    { name: "Dashboard", link: "/", icon: "🏠" },
    { name: "Data Buku Tanah", link: "/buku-tanah", icon: "📚" },
    { name: "Data Peminjaman", link: "/peminjaman", icon: "📤" },
    {
      name: "Data Pengembalian",
      link: "/pengembalian",
      icon: "📥",
    },
    { name: "Data Petugas", link: "/petugas", icon: "👥", adminOnly: true },
  ];

  const isActive = (link) => {
    if (link === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(link);
  };

  // Listen for toggle event from Navbar
  React.useEffect(() => {
    const handleToggle = () => {
      setIsOpen((prev) => !prev);
    };

    window.addEventListener("toggleSidebar", handleToggle);
    return () => window.removeEventListener("toggleSidebar", handleToggle);
  }, []);

  // Update CSS variable for layout adjustment
  React.useEffect(() => {
    // On mobile: always 0px (sidebar is overlay)
    // On desktop: 16.666667% when open, 80px when closed
    const width =
      window.innerWidth >= 768 ? (isOpen ? "16.666667%" : "80px") : "0px";

    document.documentElement.style.setProperty("--sidebar-width", width);

    // Update on resize
    const handleResize = () => {
      const width =
        window.innerWidth >= 768 ? (isOpen ? "16.666667%" : "80px") : "0px";
      document.documentElement.style.setProperty("--sidebar-width", width);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`h-lvh py-6 md:py-10 space-y-6 md:space-y-10 fixed shadow-2xl bg-gradient-to-b from-slate-50 via-blue-50 to-blue-100 transition-all duration-300 z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${isOpen ? "md:w-1/6" : "md:w-20"}
          w-64 px-6 md:px-6
          ${!isOpen ? "md:px-3" : ""}
        `}
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-transparent pointer-events-none"></div>

        {/* Toggle Button */}
        <div className="flex items-center justify-between relative z-10">
          {isOpen && (
            <div className="flex items-center justify-center flex-1 py-2">
              <img
                src="/bpn.png"
                alt="Logo BPN"
                className="w-auto h-16 md:h-20 object-contain"
              />
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`hidden md:block p-2.5 bg-blue-100 hover:bg-blue-200 rounded-lg transition-all border border-blue-200 shadow-md ${
              !isOpen ? "mx-auto" : ""
            }`}
            title={isOpen ? "Tutup Sidebar" : "Buka Sidebar"}
          >
            <HamburgerMenuIcon className="w-5 h-5 text-blue-700" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-3 relative z-10">
          {menu
            .filter((item) => !item.adminOnly || userRole === "admin")
            .map((item) => (
              <Link
                key={item.name}
                to={item.link}
                onClick={() => {
                  // Only close sidebar on mobile (< 768px)
                  if (window.innerWidth < 768) {
                    setIsOpen(false);
                  }
                }}
                className={`group px-4 cursor-pointer rounded-xl flex gap-3 items-center transition-all transform ${
                  isActive(item.link)
                    ? "bg-blue-600 text-white font-semibold shadow-lg scale-105"
                    : "text-gray-700 hover:bg-blue-100 border border-transparent hover:border-blue-200"
                } ${!isOpen ? "md:justify-center py-1" : "py-2"}`}
                title={!isOpen ? item.name : ""}
              >
                <span className="flex-shrink-0 group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span
                  className={`whitespace-nowrap ${
                    !isOpen ? "md:hidden" : "md:text-md text-sm"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
