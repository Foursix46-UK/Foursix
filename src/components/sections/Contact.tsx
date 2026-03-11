"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: "",
    name: "",
    email: "",
    message: "",
  });

  const roles = ["Investor", "Partner", "Media", "Other"];

  const handleNext = () => setStep(2);
  const handlePrev = () => setStep(1);

  return (
    <section id="contact" className="relative py-20 bg-black overflow-hidden">
      {/* 1. The Expanding Divider */}
      <motion.div 
        initial={{ scaleX: 0 }} 
        whileInView={{ scaleX: 1 }} 
        viewport={{ once: true, margin: "-100px" }} 
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} 
        className="w-full h-px bg-white/20 origin-left absolute top-0 left-0" 
      />

      <div className="max-w-4xl mx-auto px-6">
        {/* 2. The Header Reveal */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-primary mb-4">Connect</h2>
          <h3 className="text-5xl md:text-6xl font-sans font-black uppercase tracking-tighter text-white">Start the Dialogue</h3>
        </motion.div>

        {/* 3. The Form Card Reveal */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="bg-[#111] border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl relative z-10"
        >
          <div className="flex flex-wrap justify-between items-center mb-12 gap-6">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black border-2 transition-colors ${step === s ? 'border-primary bg-primary text-white' : 'border-white/20 text-white/50'}`}>
                  {s}
                </div>
                <span className={`font-sans text-[10px] font-semibold uppercase tracking-widest ${step === s ? 'text-white' : 'text-white/50'}`}>
                  {s === 1 ? "Identification" : "Message"}
                </span>
                {s === 1 && <div className="hidden md:block w-24 h-px bg-white/20 ml-4" />}
              </div>
            ))}
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="min-h-[300px]"
          >
            {step === 1 ? (
              <div className="space-y-8">
                <p className="text-2xl md:text-4xl font-light text-white">I am reaching out as a...</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                  {roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => setFormData({ ...formData, role: r })}
                      className={`py-4 rounded-lg border-2 font-bold transition-all ${formData.role === r ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <div className="flex justify-end pt-8">
                  <Button 
                    disabled={!formData.role} 
                    onClick={handleNext}
                    className="group h-16 px-12 text-lg font-black bg-primary hover:bg-primary/90 text-white rounded-full disabled:opacity-50"
                  >
                    CONTINUE <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    placeholder="NAME" 
                    className="h-14 bg-black/50 border-white/10 text-white focus:ring-primary uppercase font-bold placeholder:text-white/30"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input 
                    placeholder="EMAIL" 
                    type="email"
                    className="h-14 bg-black/50 border-white/10 text-white focus:ring-primary uppercase font-bold placeholder:text-white/30"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <Textarea 
                  placeholder="TELL US ABOUT YOUR INTEREST" 
                  className="min-h-[150px] bg-black/50 border-white/10 text-white focus:ring-primary uppercase font-bold p-6 placeholder:text-white/30"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
                <div className="flex justify-between items-center pt-8">
                  <button onClick={handlePrev} className="font-sans text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-white transition-colors">
                    Go Back
                  </button>
                  <Button className="group h-16 px-12 text-lg font-black bg-primary hover:bg-primary/90 text-white rounded-full">
                    SUBMIT <Send className="ml-2 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}