import { Langues } from "@/data/Langues";
import Image from "next/image";

const VIDEO_SRC = "/vds/bsVd2.webm";
const VIDEO_POSTER = "/imgs/video-poster.webp";

export default function About() {
  return (
    <main id="about" className="h-max grid content-start justify-items-center px-5 sm:px-8 md:px-16" tabIndex={-1}>
      <section aria-labelledby="who-am-i-heading" className="grid content-center justify-items-start w-full max-w-4xl mb-10">
        <p id="who-am-i-heading" className="text-[#dfd9ff] font-medium lg:text-[30px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px] mb-2">Who am I</p>
        <h2 className="text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px] mb-6">About</h2>
      </section>

      <section className="flex items-center justify-center w-full" aria-label="Profile description and media">
        <aside aria-label="Decorative circle and vertical line" className="relative z-10 flex flex-col justify-center items-center h-full mr-6">
          <div className="w-5 h-5 bg-[#ffffff] rounded-full" style={{ boxShadow: '0 0 10px #ffffff' }} aria-hidden="true"></div>
          <div className="h-[250px] sm:h-[300px] md:h-[350px] w-[2px] heroLine" aria-hidden="true"></div>
        </aside>

        <article className="grid content-center justify-items-center gap-1 max-w-4xl" aria-label="Profile image and logo video">
          <blockquote className='text-[#ffffff] w-full flex items-center justify-center rounded-lg text-[15px] md:text-[18px] italic select-none' tabIndex={0}>"Where Every Detail is important"</blockquote>

          <div className="flex items-center justify-center gap-4">
            <figure className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] rounded-md overflow-hidden hover:shadow-[0_0_5px_#ffffff] duration-300 transition-all hover:scale-[1.01]">
<Image 
  src='/imgs/profileIMG.webp' 
  alt="Profile image of Salah Berredjem" 
  width={300} 
  height={300} 
  className="object-cover w-full h-full" 
  priority
  // Add these props to ensure consistency
  placeholder="empty"
  onError={(e) => {
    // Fallback handling if needed
    console.error('Image failed to load:', e);
  }}
/>              <figcaption className="sr-only">Profile image of Salah Berredjem</figcaption>
            </figure>

            <figure className="relative w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] rounded-md overflow-hidden hover:shadow-[0_0_5px_#ffffff] duration-300 transition-all hover:scale-[1.01]">
              <video  className="w-full h-full object-cover rounded-md" muted playsInline preload="metadata" poster={VIDEO_POSTER} loop autoPlay aria-label="Logo animation video">
                <source src={VIDEO_SRC} type="video/webm" />Your browser does not support the video tag.
              </video>
              <figcaption className="sr-only">Animated logo video</figcaption>
            </figure>
          </div>
        </article>
      </section>

      <section className="w-full grid content-center justify-items-center px-16 gap-10 mb-5" aria-labelledby="skills-heading">
        <h3 id="skills-heading" className='text-[35px] w-full font-bold text-center' style={{ textShadow: '0 0 10px #fff' }}>Web Frontend Developer &amp; Graphic Designer</h3>

        <article className="grid content-center justify-items-center w-full gap-2" aria-label="Languages spoken">
          <p className="text-[#dfd9ff] w-full font-medium lg:text-[30px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px] text-center">What languages I can speak</p>
          <ul className="flex space-x-3 h-full flex-wrap items-center justify-center gap-2" role="list">
            {Langues.map((lang) => (
              <li key={lang._id} className="grid content-center justify-items-center">
                <span  className="flex items-center justify-center px-3 py-1 rounded-full text-sm w-max duration-300 transition-all hover:px-6 hover:shadow-[0_0_5px_white] bg-gray-200 text-black hover:text-white" style={{ backgroundColor: '#e5e7eb', color: 'black' }}>{lang.langName}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section  className='border-2 h-max border-white rounded-md p-3 relative grid content-center justify-items-center gap-2 backdrop-blur-md max-w-4xl'  style={{ boxShadow: '0 0 5px #ffffff' }}  aria-label="Branding solutions description">
        <p className="text-gray-200 text-[18px] text-center">I deliver end-to-end branding solutions, from visual identity and logo design to front-end website development. Discover my capabilities through the projects featured in my portfolio.</p>
        <a  href="#project"  className="flex items-center gap-2 cursor-pointer hover:opacity-70 duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0db988]" aria-label="Browse to my Projects">
          <span  className="text-[#0db988] w-full py-1 px-2 rounded-md font-semibold transition-all border-[1px] duration-300 hover:no-underline hover:bg-white hover:text-black hover:tracking-widest"  style={{ boxShadow: '0 0 5px #ffffff' }}><i className="fas fa-hand-pointer duration-300 hover:scale-125" aria-hidden="true"></i>Browse to my Projects</span>
        </a>
      </section>
    </main>
  );
}
