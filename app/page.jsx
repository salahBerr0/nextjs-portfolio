import About from "@/components/About";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import Project from '@/components/Project';
import Feedback from "@/components/Feedback";
export default function Home() {
  return (
    <main className="relative min-h-screen grid content-center justify-items-center py-32"> {/* Added relative and min-h-screen */}
      <div className="relative z-10">
        <section id="hero">
          <Hero/>
        </section>
        <section id="about">
          <About />
        </section>
        <section id="project">
          <Project />
        </section>
        <section id="feedback">
          <Feedback/>
        </section>
        <section id="experience">
          <Experience />
        </section>
      </div>
    </main>
  );
}