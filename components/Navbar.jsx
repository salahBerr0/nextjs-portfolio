"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useScrollDetection } from '../hooks/useScrollDetection';

export default function Navbar() { 
  const [toggle,setToggle]=useState(false);
  const activeSection=useScrollDetection();
  const handleLogoClick=()=>{if (typeof window!=='undefined'){window.scrollTo(0, 0);}};
  const scrollToSection=(sectionId, e) => {
    e.preventDefault();
    if (sectionId==='userProfile'){window.location.href='/userProfile';return;}
    const element=document.getElementById(sectionId);
    if (element) {const offsetTop=element.offsetTop-80;window.scrollTo({top:offsetTop,behavior:'smooth'});}
    setToggle(false);
  };

  return (
    <nav className="sm:px-16 px-4 w-full flex items-center justify-between py-2 fixed top-0 z-20 mb-4 bg-transparent">
      <Link href="/" className="flex items-center gap-2" onClick={handleLogoClick}>
        <Image src="/imgs/bs3d.png" alt="white bs logo" width={30} height={30} className="object-contain" />
        <p className="flex items-center justify-center text-[18px] font-bold cursor-pointer"><span className="navText">SALAH Berredjem</span> &nbsp;<span className="lg:hidden xl:block text-gray-400">| Portfolio</span></p>
      </Link>
      <ul className="list-none hidden lg:flex flex-row gap-10">
        <li><a href="#about" onClick={(e) => scrollToSection('about', e)} className={activeSection === "about" ? "text-white" : "text-gray-500 hover:text-gray-100"}>About</a></li>
        <li><a href="#experience" onClick={(e) => scrollToSection('experience', e)}className={activeSection === "experience" ? "text-white" : "text-gray-500 hover:text-gray-100"}>Experience</a></li>
        <li><a href="#project" onClick={(e) => scrollToSection('project', e)}className={activeSection === "project" ? "text-white" : "text-gray-500 hover:text-gray-100"}>Projects</a></li>
        <li><a href="#feedback" onClick={(e) => scrollToSection('feedback', e)}className={activeSection === "feedback" ? "text-white" : "text-gray-500 hover:text-gray-100"}>Feedbacks</a></li>
        <li><a href="#footer" onClick={(e) => scrollToSection('footer', e)}className={activeSection === "footer" ? "text-white" : "text-gray-500 hover:text-gray-100"}>Contact</a></li>
        <li><Link href="/userProfile" className={activeSection === "userProfile" ? "text-white" : "text-gray-500 hover:text-gray-100"}>My account</Link></li>        
      </ul>
      <div className="lg:hidden grid content-center justify-items-center">
        <Image src='/icons/menu.svg' alt="menu toggle" width={28} height={28} className="object-contain cursor-pointer" onClick={() => setToggle(!toggle)} />
        <ul className={`${toggle ? 'flex' : 'hidden'} bg-black absolute top-16 right-0 border-gray-500 border-[1px] p-4 mx-4 w-max z-10 rounded-xl grid`} style={{boxShadow:"0 0 5px #fff"}}>
          <li><a href="#about" onClick={(e) => scrollToSection('about', e)}className={activeSection === "about" ? "text-white" : "text-gray-500 hover:text-gray-100"}>About</a></li>
          <li><a href="#experience" onClick={(e) => scrollToSection('experience', e)}className={activeSection === "experience" ? "text-white" : "text-gray-500 hover:text-gray-100"}>Experience</a></li>
          <li><a href="#project" onClick={(e) => scrollToSection('project', e)}className={activeSection === "project" ? "text-white" : "text-gray-500 hover:text-gray-100"}>Projects</a></li>
          <li><a href="#feedback" onClick={(e) => scrollToSection('feedback', e)}className={activeSection === "feedback" ? "text-white" : "text-gray-500 hover:text-gray-100"}>Feedbacks</a></li>
          <li><a href="#footer" onClick={(e) => scrollToSection('footer', e)}className={activeSection === "footer" ? "text-white" : "text-gray-500 hover:text-gray-100"}>Contact</a></li>
          <li><Link href="/userProfile" className={activeSection === "userProfile" ? "text-white" : "text-gray-500 hover:text-gray-100"}onClick={() => setToggle(false)}>My account</Link></li>        
        </ul>
      </div>
    </nav>
  );
}