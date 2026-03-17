import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Certifications from "@/components/Certifications";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <hr style={{ borderColor: "var(--border-color)", margin: 0, border: "none", borderTop: "1px solid var(--border-color)" }} />
        <About />
        <hr style={{ borderColor: "var(--border-color)", margin: 0, border: "none", borderTop: "1px solid var(--border-color)" }} />
        <Skills />
        <hr style={{ borderColor: "var(--border-color)", margin: 0, border: "none", borderTop: "1px solid var(--border-color)" }} />
        <Projects />
        <hr style={{ borderColor: "var(--border-color)", margin: 0, border: "none", borderTop: "1px solid var(--border-color)" }} />
        <Experience />
        <hr style={{ borderColor: "var(--border-color)", margin: 0, border: "none", borderTop: "1px solid var(--border-color)" }} />
        <Certifications />
        <hr style={{ borderColor: "var(--border-color)", margin: 0, border: "none", borderTop: "1px solid var(--border-color)" }} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
