import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";

const SOCIAL_LINKS = [
  { href: "https://www.linkedin.com/in/salah-eddine-berredjem-2a3953361/", src: '/imgs/linkedin.webp',
    target: "_blank", alt: 'LinkedIn icon', width: 40, height: 40, containerClass: "w-16 h-16"
  },
  { href: "mailto:berredjem.salah.eddine@gmail.com", src: '/imgs/gmail.webp',
    target: "_blank", alt: 'Gmail icon', width: 40, height: 40, containerClass: "w-16 h-16"
  },
  { href: "https://github.com/salahBerr0", src: '/imgs/gitHub.webp',
    target: "_blank", alt: 'GitHub icon', width: 40, height: 40, containerClass: "w-16 h-16"
  }
];

const CURRENT_YEAR = new Date().getFullYear();

const SocialLink = React.memo(({ href, src, alt, width, height, containerClass, target }) => (
  <Link href={href} target={target} prefetch={false} rel="noopener noreferrer" aria-label={`Link to ${alt}`}>
      <Image src={src} alt={alt} width={width} height={height} className="w-8 h-8 mx-3 object-contain opacity-70 hover:opacity-100" loading="lazy"/>
  </Link>
));

SocialLink.displayName = 'SocialLink';

export default function Footer() {
  const socialLinks = useMemo(() =>
    SOCIAL_LINKS.map((link, index) => (
      <SocialLink key={`${link.href}-${index}`} {...link} />
    )),
    []
  );

  return (
    <footer id="footer" className="w-full h-[600px] border-t-[2px] py-4 mt-16 px-4 grid content-center justify-items-center gap-4 backdrop-blur-lg z-50" style={{ boxShadow: '0 0px 5px #fff' }}>
      <div role="contentinfo" aria-label="Author name">
        <span className="font-bold text-[60px] text-center" style={{ textShadow: '0 0 1px #fff' }}>
          Berredjem Salah | Portfolio
        </span>
      </div>

<nav aria-label="Social media links" className='bg-transparent h-max w-full flex items-center justify-center gap-3'>
  {socialLinks}
</nav>


      <span className="text-[20px] text-center" aria-label={`Copyright ${CURRENT_YEAR}`}>
        ©{CURRENT_YEAR}. Salah Eddine Berredjem Portfolio
      </span>

      <Image src='/imgs/bs3d.png' alt='Berredjem Salah logo' width={60} height={60} priority loading="eager" className="w-auto h-auto" />
    </footer>
  );
}
