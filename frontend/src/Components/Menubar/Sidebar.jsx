import React from "react";
import { Link } from "react-router-dom";
import {
  ArchiveIcon,
  HomeIcon,
  PersonIcon,
  FileTextIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";

const Sidebar = () => {
  const menu = [
    { name: "Dashboard", link: "/", icon: <HomeIcon /> },
    { name: "Data Buku Tanah", link: "/buku-tanah", icon: <ArchiveIcon /> },
    { name: "Data Petugas", link: "/petugas", icon: <PersonIcon /> },
    { name: "Data Peminjaman", link: "/", icon: <FileTextIcon /> },
    { name: "Data Pengambilan", link: "/", icon: <PaperPlaneIcon /> },
  ];

  return (
    <div className="h-lvh py-10 px-6 w-1/6 space-y-10 fixed shadow-md">
      <div className="font-bold text-center text-2xl">LOGO</div>
      <div className="flex flex-col gap-3">
        {menu.map((item) => (
          <Link
            key={item.name}
            to={item.link}
            className="w-full px-4 py-2 hover:bg-gray-200 cursor-pointer rounded flex gap-3 items-center"
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
