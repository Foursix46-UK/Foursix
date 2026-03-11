import Navbar from "@/components/navigation/Navbar";
import About from "@/components/sections/About";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black overflow-x-hidden w-full max-w-[100vw] relative">
      <Navbar />
      <About />
      <Footer />
    </main>
  );
}
