"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// --- FIREBASE IMPORTS ---
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Contact() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    role: "",
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const roles = ["Investor", "Partner", "Media", "Other"];

  const handleNext = () => setStep(2);
  const handlePrev = () => setStep(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // --- EXACT API CATEGORY MAPPING ---
    // This translates the short buttons to match your API routing logic perfectly
    let apiCategory = "General Question"; // Default to contact@
    if (formData.role === "Investor") apiCategory = "Investment Inquiry"; // Routes to partners@
    if (formData.role === "Partner") apiCategory = "Partnership Opportunity"; // Routes to partners@
    if (formData.role === "Media") apiCategory = "Media Inquiry"; // Routes to press@
    if (formData.role === "Other") apiCategory = "General Question"; // Routes to contact@

    try {
      // 1. Backup to Firebase
      await addDoc(collection(db, "contact_inquiries"), {
        fullName: formData.name,
        email: formData.email,
        company: formData.company || "Not provided",
        category: apiCategory, // Sends the mapped category
        message: formData.message,
        source: "Home Page Multi-Step Form",
        createdAt: serverTimestamp(),
        status: "Unread"
      });

      // 2. Trigger Nodemailer Email API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          company: formData.company || "Not provided",
          category: apiCategory, // Sends the exact string your API expects
          message: formData.message,
        }),
      });

      if (!response.ok) throw new Error('Failed to send email');

      setIsSuccess(true);
      
      // Reset form and return to step 1 after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ role: "", name: "", email: "", company: "", message: "" });
        setStep(1);
      }, 3000);

    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong sending the email, but your inquiry was saved. We will be in touch.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    placeholder="NAME" 
                    required
                    className="h-14 bg-black/50 border-white/10 text-white focus:ring-primary font-bold placeholder:text-white/30"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input 
                    placeholder="EMAIL" 
                    type="email"
                    required
                    className="h-14 bg-black/50 border-white/10 text-white focus:ring-primary font-bold placeholder:text-white/30"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <Input 
                  placeholder="COMPANY / ORGANIZATION (OPTIONAL)" 
                  className="h-14 bg-black/50 border-white/10 text-white focus:ring-primary font-bold placeholder:text-white/30"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
                <Textarea 
                  placeholder="TELL US ABOUT YOUR INTEREST" 
                  required
                  className="min-h-[150px] bg-black/50 border-white/10 text-white focus:ring-primary font-bold p-6 placeholder:text-white/30"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
                <div className="flex justify-between items-center pt-8">
                  <button type="button" onClick={handlePrev} className="font-sans text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-white transition-colors">
                    Go Back
                  </button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || isSuccess}
                    className="group h-16 px-12 text-lg font-black bg-primary hover:bg-primary/90 text-white rounded-full disabled:opacity-80"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse flex items-center">SENDING...</span>
                    ) : isSuccess ? (
                      <span className="flex items-center">RECEIVED <CheckCircle2 className="ml-2 w-5 h-5" /></span>
                    ) : (
                      <span className="flex items-center">SUBMIT <Send className="ml-2 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" /></span>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}