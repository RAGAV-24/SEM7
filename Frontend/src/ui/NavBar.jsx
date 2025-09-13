import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black text-white shadow-md">
      <div className="flex justify-between items-center h-20 px-6">
        {/* Logo */}
        <div className="text-2xl font-bold">
          Kidney Disease Classification
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-lg text-amber-50">
          <Link
            to="/"
            className="cursor-pointer hover:text-blue-600 hover:underline"
          >
            Home
          </Link>
          <Link
            to="/model"
            className="cursor-pointer hover:text-blue-600 hover:underline"
          >
            Model
          </Link>
          <Link
            to="/login"
            className="cursor-pointer hover:text-blue-600 hover:underline"
          >
            Login
          </Link>
        </div>
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden flex flex-col space-y-4 bg-black px-6 pb-4 text-lg text-amber-50">
          <Link
            to="/"
            className="hover:text-blue-600 hover:underline"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/model"
            className="hover:text-blue-600 hover:underline"
            onClick={() => setIsOpen(false)}
          >
            Model
          </Link>
          <Link
            to="/login"
            className="hover:text-blue-600 hover:underline"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
