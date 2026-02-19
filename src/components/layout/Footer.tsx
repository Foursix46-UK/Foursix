import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-background border-t py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2 items-center md:items-start">
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="FourSix46 Logo" 
              width={160} 
              height={60} 
              className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-500"
            />
          </Link>
          <span className="text-muted text-[10px] font-code uppercase tracking-widest text-center md:text-left mt-2">House of Multibrands</span>
        </div>
        
        <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-primary transition-colors">Inquiries</a>
        </div>

        <div className="text-muted text-[10px] font-code">
          © 2024 FOURSIX46 LTD. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}
