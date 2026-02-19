
export default function Footer() {
  return (
    <footer className="bg-background border-t py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-2xl font-black font-headline">FOURSIX<span className="text-primary">46</span></span>
          <span className="text-muted text-xs font-code uppercase tracking-widest">House of Multibrands</span>
        </div>
        
        <div className="flex gap-8 text-sm font-bold uppercase tracking-widest">
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-primary transition-colors">Inquiries</a>
        </div>

        <div className="text-muted text-xs font-code">
          © 2024 FOURSIX46 LTD. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}
