"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Footer(){
    return(
        <footer id="footer" className="w-full border-t-[2px] border-white py-4 mt-12 px-4 grid content-center justify-items-center gap-4 bg-black" style={{boxShadow:'0 0px 5px #fff'}}>
            <div className="flex items-center justify-center gap-3">
                <Image src='/imgs/bs3d.png' alt='logo image' width={20} height={20}/>
                <span className="font-bold text-[20px]" style={{textShadow:'0 0 1px #fff'}}>Berredjem Salah | Portfolio</span>
            </div>
            <div className='w-max bg-transparent h-max flex items-center justify-center gap-3'>
                <Link href="https://www.linkedin.com/in/salah-eddine-berredjem-2a3953361/" target="_blank"><motion.div  className="w-12 h-12 cursor-pointer hover:scale-110 hover:opacity-80 hover:border hover:border-black hover:bg-gray-100 rounded-2xl p-1 transition-all" animate={{ x: [0, -3, 3, -3, 0], y: [0, 0, 0, 0, 0] }}  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}><Image src='/imgs/linkedIn.png' alt='linkedIn icon' width={48} height={48} className="w-full h-full object-contain" /></motion.div></Link>
                <Link href="mailto:berredjem.salah.eddine@gmail.com"><motion.div  className="w-12 h-12 cursor-pointer hover:scale-110 hover:opacity-80 hover:border hover:border-black hover:bg-gray-100 rounded-2xl p-1 transition-all" animate={{ x: [0, 0, 0, 0, 0], y: [0, -3, 3, -3, 0] }}  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}><Image src='/imgs/gmail.png' alt='gmail icon' width={48} height={48} className="w-full h-full object-contain" /></motion.div></Link>
                <Link href="https://github.com/salahBerr0" target="_blank"><motion.div  className="w-12 h-12 cursor-pointer hover:scale-110 hover:opacity-80 hover:border hover:border-black hover:bg-gray-100 rounded-2xl p-1 transition-all" animate={{ x: [0, 3, -3, 3, 0], y: [0, 0, 0, 0, 0] }}  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}><Image src='/imgs/github.png' alt='gitHub icon' width={48} height={48} className="w-full h-full object-contain" /></motion.div></Link>
            </div>
            <span className="text-[15px]">© BSalah-portfolio {new Date().getFullYear()}.</span>
        </footer>
    );
}