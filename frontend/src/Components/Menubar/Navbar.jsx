import React from "react";
import { Link, useNavigate } from "react-router-dom";

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

  return (
    <div className="flex w-full justify-end px-8 py-3 font-bold text-lg shadow-sm bg-white">
      {user ? (
        <div className="flex gap-4 items-center">
          <img src={user.result.picture} className="w-10 rounded-full" />
          <div className="font-medium">Hy, {user.result.name}</div>
          <div className="border px-2 py-1">
            <button onClick={handleLogout}>LOGOUT</button>
          </div>
        </div>
      ) : (
        <Link to="/auth" className="">
          LOGIN
        </Link>
      )}
    </div>
  );
};

export default Navbar;
