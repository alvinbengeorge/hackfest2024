import React from "react";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center h-16 bg-blue-300 text-black relative shadow-sm font-sans" role="navigation">
      <a href="/" className="pl-8">
        <h1 className="font-bold text-2xl">MediCo.</h1>
      </a>
    </nav>
  );
}