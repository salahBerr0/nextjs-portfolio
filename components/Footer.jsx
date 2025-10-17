import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer id="footer" className="w-full h-[600px] border-t-[2px] py-4 mt-16 px-4 grid content-center justify-items-center gap-4 backdrop-blur-lg" style={{boxShadow:'0 0px 5px #fff'}}>
            <div className="flex items-center justify-center gap-3">
                <span className="font-bold text-[60px]" style={{textShadow:'0 0 1px #fff'}}>Berredjem Salah | Portfolio</span>
            </div>
            <div className='bg-transparent h-max w-full flex items-center justify-center gap-3'>
                <Link href="https://www.linkedin.com/in/salah-eddine-berredjem-2a3953361/" target="_blank">
                    <div className="w-16 h-16 cursor-pointer hover:scale-110 transition-transform duration-200"> {/* Reduced size */}
                        <Image src='/imgs/linkedIn.png' alt='linkedIn icon' width={40} height={40} className="w-full h-full object-contain"loading="lazy"/>
                    </div>
                </Link>
                <Link href="mailto:berredjem.salah.eddine@gmail.com">
                    <div className="w-20 h-20 cursor-pointer hover:scale-110 transition-transform duration-200">
                        <Image src='/imgs/gmail.png' alt='gmail icon' width={40} height={40} className="w-full h-full object-contain" loading="lazy"/>
                    </div>
                </Link>
                <Link href="https://github.com/salahBerr0" target="_blank">
                    <div className="w-16 h-16 cursor-pointer hover:scale-110 transition-transform duration-200">
                        <Image src='/imgs/github.png' alt='gitHub icon' width={40} height={40} className="w-full h-full object-contain" loading="lazy"/>
                    </div>
                </Link>
            </div>
            <span className="text-[20px]">©{new Date().getFullYear()}.  <strong>www.salah-berredjem-portfolio</strong></span>
            <Image  src='/imgs/bs3d.png' alt='logo image' width={60} height={60} priority loading="eager" className="w-auto h-auto"/>

        </footer>
    );
}