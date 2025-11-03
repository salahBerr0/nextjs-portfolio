"use client";
import { useState, useCallback, useMemo } from "react";
import { Link as ScrollLink } from "react-scroll";
import Image from "next/image";

const NAV_ITEMS = [
  { id: "hero", label: "BS" },
  { id: "about", label: "About" },
  { id: "skill", label: "Skills" },
  { id: "project", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "footer", label: "Contact" },
];

const SCROLL_PROPS = {
  smooth: true,
  duration: 600,
  offset: -100,
  spy: true,
};

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [toggle, setToggle] = useState(false);
  const handleSetActive = useCallback((to) => {setActiveSection(to);}, []);
  const handleToggle = useCallback(() => {setToggle(prev => !prev);}, []);

  // Combine static and dynamic props
  const commonScrollProps = useMemo(() => ({
    ...SCROLL_PROPS,
    onSetActive: handleSetActive,
  }), [handleSetActive]);

  const getLinkClassName = useCallback((itemId) => 
    `cursor-pointer transition-colors duration-300 ${
      activeSection === itemId 
        ? "text-white font-semibold" 
        : "text-gray-400 hover:text-white"
    }`
  , [activeSection]);

  // Memoized nav items
  const desktopNavItems = useMemo(() => (
    NAV_ITEMS.map((item) => (
      <li key={item.id} className="hover:scale-110 duration-300">
        <ScrollLink {...commonScrollProps} to={item.id} className={getLinkClassName(item.id)}>
          {item.label}
        </ScrollLink>
      </li>
    ))
  ), [commonScrollProps, getLinkClassName]);

  const mobileNavItems = useMemo(() => (
    NAV_ITEMS.map((item) => (
      <li key={item.id}>
        <ScrollLink {...commonScrollProps} to={item.id} onClick={handleToggle} className={`${getLinkClassName(item.id)} block w-full text-left py-2 px-4`}>
          {item.label}
        </ScrollLink>
      </li>
    ))
  ), [commonScrollProps, getLinkClassName]);

  return (
    <nav className="navbar-fadeDown fixed top-0 left-0 w-full z-50 transition-all duration-300 sm:px-16 px-6 flex items-center justify-between py-2 mb-4 bg-transparent backdrop-blur-md">
      <ScrollLink {...commonScrollProps}  to="hero"  className="flex items-center gap-2 cursor-pointer hover:opacity-70 duration-300"
      >
        <Image src="/imgs/bs3d.png" alt="BS Logo" width={30} height={30}  className="object-contain w-auto h-auto" priority/>
        <p className="flex items-center justify-center text-[18px] font-bold">
          <span className="navText">SALAH Berredjem</span>
          <span className="lg:hidden xl:block text-gray-400">&nbsp;| Portfolio</span>
        </p>
      </ScrollLink>

      {/* Desktop Nav */}
      <ul className="list-none hidden lg:flex flex-row gap-10">
        {desktopNavItems}
      </ul>

      {/* Mobile Menu */}
      <div className="lg:hidden text-white">
        <button className="font-bold text-xl" onClick={handleToggle} aria-label="Toggle menu" aria-expanded={toggle}>☰</button>
        {toggle && (
          <ul className="absolute top-16 right-0 border-gray-500 border-[1px] p-4 mx-4 w-max z-10 rounded-xl grid bg-black backdrop-blur-xl">
            {mobileNavItems}
          </ul>
        )}
      </div>
    </nav>
  );
}