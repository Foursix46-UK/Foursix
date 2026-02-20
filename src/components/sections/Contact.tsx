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
    <section id="contact" className="relative py-32 bg-surface overflow-hidden">
      {/* The Expanding Divider (The Structural Line) */}
      <motion.div 
        initial={{ scaleX: 0 }} 
        whileInView={{ scaleX: 1 }} 
        viewport={{ once: true, margin: "-100px" }} 
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} 
        className="w-full h-px bg-white/20 origin-left absolute top-0 left-0" 
      />

      <div className="max-w-4xl mx-auto px-6">
        {/* Staggered Header (Delay 1) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-primary mb-4">Connect</h2>
          <h3 className="text-6xl font-headline font-black uppercase">Start the Dialogue</h3>
        </motion.div>

        {/* Staggered Form Card (Delay 2) */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="bg-background border border-border p-8 md:p-12 rounded-2xl shadow-2xl relative z-10"
        >
          <div className="flex justify-between items-center mb-12">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black border-2 transition-colors ${step === s ? 'border-primary bg-primary text-white' : 'border-border text-muted'}`}>
                  {s}
                </div>
                <span className={`font-sans text-[10px] font-semibold uppercase tracking-widest ${step === s ? 'text-foreground' : 'text-muted'}`}>
                  {s === 1 ? "Identification" : "Message"}
                </span>
                {s === 1 && <div className="hidden md:block w-24 h-px bg-border ml-4" />}
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
                <p className="text-2xl font-light">I am reaching out as a...</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => setFormData({ ...formData, role: r })}
                      className={`py-4 rounded-lg border-2 font-bold transition-all ${formData.role === r ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted hover:border-muted-foreground'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <div className="flex justify-end pt-8">
                  <Button 
                    disabled={!formData.role} 
                    onClick={handleNext}
                    className="group h-16 px-12 text-lg font-black bg-primary hover:bg-primary/90 rounded-full"
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
                    className="h-14 bg-surface border-border focus:ring-primary uppercase font-bold"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input 
                    placeholder="EMAIL" 
                    type="email"
                    className="h-14 bg-surface border-border focus:ring-primary uppercase font-bold"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <Textarea 
                  placeholder="TELL US ABOUT YOUR INTEREST" 
                  className="min-h-[150px] bg-surface border-border focus:ring-primary uppercase font-bold p-6"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
                <div className="flex justify-between items-center pt-8">
                  <button onClick={handlePrev} className="font-sans text-xs font-semibold uppercase tracking-widest text-muted hover:text-foreground">
                    Go Back
                  </button>
                  <Button 
                    className="group h-16 px-12 text-lg font-black bg-primary hover:bg-primary/90 rounded-full"
                  >
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
