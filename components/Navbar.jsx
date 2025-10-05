"use client";
import { useState, useCallback } from "react";
import { Link as ScrollLink } from "react-scroll";
import Image from "next/image";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [toggle, setToggle] = useState(false);

  // Debounced scroll handler to reduce performance impact
  const handleSetActive = useCallback((to) => {setActiveSection(to);}, []);

  const navItems = [
    { id: "hero", label: "BS" },
    { id: "about", label: "About" },
    { id: "skill", label: "Skills" },
    { id: "project", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "footer", label: "Contact" },
  ];

  return (
    <nav className="navbar-fadeDown fixed top-0 left-0 w-full z-50 transition-all duration-300 sm:px-16 px-4 flex items-center justify-between py-2 mb-4 bg-transparent backdrop-blur-sm">
      <ScrollLink to="hero" smooth={true} duration={600} offset={-100}className="flex items-center gap-2 cursor-pointer hover:opacity-70 duration-300">
        <Image src="/imgs/bs3d.png" alt="white bs logo" width={30} height={30} className="object-contain"priority/>
        <p className="flex items-center justify-center text-[18px] font-bold"><span className="navText">SALAH Berredjem</span>&nbsp;<span className="lg:hidden xl:block text-gray-400">| Portfolio</span></p>
      </ScrollLink>

      {/* Desktop Nav */}
      <ul className="list-none hidden lg:flex flex-row gap-10">
        {navItems.map((item) => (<li key={item.id} className="hover:scale-110 duration-300"><ScrollLink to={item.id} smooth={true} duration={600} offset={-100}spy={true}onSetActive={handleSetActive}className={`cursor-pointer transition-colors duration-300 ${activeSection === item.id  ? "text-white font-semibold"  : "text-gray-400 hover:text-white"}`}>{item.label}</ScrollLink></li>))}
      </ul>

      {/* Mobile Menu */}
      <div className="lg:hidden text-white">
        <button className="font-bold text-xl" onClick={() => setToggle(!toggle)}>☰</button>
        {toggle && (
          <ul className="absolute top-16 right-0 border-gray-500 border-[1px] p-4 mx-4 w-max z-10 rounded-xl grid bg-black backdrop-blur-xl">
            {navItems.map((item) => (<li key={item.id}><ScrollLink to={item.id} smooth={true} duration={600} offset={-100}spy={true}onSetActive={handleSetActive}onClick={() => setToggle(false)}className={`cursor-pointer transition-colors duration-300 block w-full text-left py-2 px-4 ${activeSection === item.id ? "text-white font-semibold" : "text-gray-400 hover:text-white"}`}>{item.label}</ScrollLink></li>))}
          </ul>
        )}
      </div>
    </nav>
  );
}