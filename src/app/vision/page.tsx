import Navbar from "@/components/navigation/Navbar";
import About from "@/components/sections/About";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <About />
      <Footer />
    </main>
  );
}