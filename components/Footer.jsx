import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";

// Constants for better maintainability
const SOCIAL_LINKS = [
  {href: "https://www.linkedin.com/in/salah-eddine-berredjem-2a3953361/",src: '/imgs/linkedin.png',
    target: "_blank",alt: 'LinkedIn icon',width: 40,height: 40,containerClass: "w-16 h-16"
  },
  {href: "mailto:berredjem.salah.eddine@gmail.com",src: '/imgs/gMail.png',
    target: "_blank",alt: 'Gmail icon', width: 40,height: 40,containerClass: "w-20 h-20"
  },
  {href: "https://github.com/salahBerr0",src: '/imgs/gitHub.png',
    target: "_blank",alt: 'GitHub icon',width: 40,height: 40,containerClass: "w-16 h-16"
  }
];

const CURRENT_YEAR = new Date().getFullYear();

// Memoized Social Link Component
const SocialLink = React.memo(({ href, src, alt, width, height, containerClass, target }) => (
  <Link href={href} target={target} prefetch={false}>
    <div className={`${containerClass} cursor-pointer hover:scale-110 transition-all duration-200 hover:opacity-70`}>
      <Image  src={src}  alt={alt}  width={width}  height={height}  className="w-full h-full object-contain" loading="lazy"/>
    </div>
  </Link>
));

SocialLink.displayName = 'SocialLink';
// Main Footer Component
export default function Footer() {
  
  // Memoize social links to prevent unnecessary re-renders
  const socialLinks = useMemo(() => 
    SOCIAL_LINKS.map((link, index) => (
      <SocialLink key={`${link.href}-${index}`} href={link.href} src={link.src} alt={link.alt} width={link.width} height={link.height} containerClass={link.containerClass} target={link.target}/>
    )),
    []
  );

  return (
    <footer id="footer" className="w-full h-[500px] border-t-[2px] py-4 mt-16 px-4 grid content-center justify-items-center gap-4 backdrop-blur-lg z-50"  style={{ boxShadow: '0 0px 5px #fff' }}>
      {/* Brand Name */}
      <div role="textbox" aria-label="My fist and last Name" className="flex items-center justify-center gap-3">
        <span  className="font-bold text-[60px] text-center" style={{ textShadow: '0 0 1px #fff' }}>Berredjem Salah | Portfolio</span>
      </div>

      {/* Social Links */}
      <div role="link" aria-label="social Links" className='bg-transparent h-max w-full flex items-center justify-center gap-3'>
        {socialLinks}
      </div>

      {/* Copyright */}
      <span className="text-[20px] text-center">
        ©{CURRENT_YEAR}. <strong>www.salah-berredjem-portfolio</strong>
      </span>

      {/* Logo */}
      <Image  src='/imgs/bs3d.png'  alt='Berredjem Salah logo'  width={60}  height={60}  priority  loading="eager"  className="w-auto h-auto"/>
    </footer>
  );
}