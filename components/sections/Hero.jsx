"use client";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";

export default function Hero(){
    return(
        <main id="hero" className="h-screen w-full  grid content-start justify-items-center gap-56 lg:content-center lg:justify-start lg:gap-10 text-white font-bold px-5 lg:px-20 xl:px-48 z-0">
            <div className="">
                <span className='text-[88px] lg:text-[100px] grid content-center  h-max justify-items-start w-full' style={{textShadow:'0 0 15px rgb(0,0,0)'}}>BERREDJEM <span className="-translate-y-12">SALAH</span></span>
                <span className='text-[27px] lg:text-[30px] px-1 w-full -translate-y-[130px] lg:-translate-y-[140px] flex items-center justify-end' style={{textShadow:'0 0 10px rgb(255,255,255)'}}>-3D PORTFOLIO</span>
            </div>
            <div role="button" aria-label="CTA buttons" className="flex items-center h-max w-full  justify-center gap-3 -translate-y-10">
                <ScrollLink to="footer" smooth={true} duration={600} offset={-100} className="flex items-center gap-2 cursor-pointer hover:opacity-70 duration-300"><span className="bg-white text-[#0db988] py-1 px-10 rounded-2xl border-[1px] text-[20px] hover:px-16 duration-300 hover:bg-gray-400 hover:text-indigo-950 transition-all hover:tracking-widest" style={{boxShadow:'0 0 10px #ffffff'}}>GET IN TOUCH</span></ScrollLink>
                <Link href="/resume.pdf" download="Berredjem-Salah-Resume.pdf" className="text-[15px] underline hover:tracking-widest duration-300 hover:text-gray-400 flex items-center gap-2" style={{textShadow:'0 0 5px #000000'}} target="_blank" rel="noopener noreferrer">download resume<i className="fas fa-download"></i></Link>
            </div>
        </main>
    )
}