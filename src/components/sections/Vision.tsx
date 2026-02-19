
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const timelineData = [
  { year: "2018", title: "Founding", content: "Born in a minimalist studio with a vision for multibrand synergy." },
  { year: "2020", title: "Expansion", content: "Scaling across sectors from deep tech to quiet luxury lifestyle." },
  { year: "2022", title: "Global Reach", content: "Establishing a presence in over 12 global tech hubs." },
  { year: "2024", title: "Future Forward", content: "Investing in the next generation of biophilic and orbital systems." },
];

const team = [
  { name: "Julian Thorne", role: "Chief Executive", imgId: "team-1" },
  { name: "Alara Vane", role: "Creative Director", imgId: "team-1" },
  { name: "Marcus Key", role: "Operations Lead", imgId: "team-1" },
];

export default function Vision() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });

  return (
    <section id="vision" className="relative py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24">
        {/* Timeline */}
        <div className="space-y-32">
          <div className="mb-12">
            <h2 className="text-sm font-code uppercase tracking-widest text-primary mb-4">Vision</h2>
            <h3 className="text-6xl font-headline font-black uppercase">Founding Story</h3>
          </div>

          <div className="relative pl-12 border-l border-border space-y-24">
            {timelineData.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative"
              >
                <div className="absolute -left-[54px] top-0 w-3 h-3 rounded-full bg-primary border-[3px] border-background" />
                <span className="text-xs font-code text-secondary mb-2 block">{item.year}</span>
                <h4 className="text-2xl font-black uppercase mb-4">{item.title}</h4>
                <p className="text-muted text-lg max-w-md">{item.content}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Reveal Section */}
        <div className="space-y-12">
          <div className="p-12 bg-surface rounded-2xl border border-border">
            <h4 className="text-sm font-code uppercase text-accent mb-6">Our Core Values</h4>
            <div className="space-y-8">
              <div>
                <h5 className="text-2xl font-black uppercase mb-2">Neo-Brutalism</h5>
                <p className="text-muted">Function over form, expressed with raw honesty and structural clarity.</p>
              </div>
              <div className="h-px bg-border w-full" />
              <div>
                <h5 className="text-2xl font-black uppercase mb-2">Quiet Luxury</h5>
                <p className="text-muted">Sophistication without shouting. Excellence in the smallest details.</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-4xl font-headline font-black uppercase">Leadership</h3>
            <div className="grid grid-cols-1 gap-4">
              {team.map((member) => {
                const memberImg = PlaceHolderImages.find(img => img.id === member.imgId);
                return (
                  <motion.div
                    key={member.name}
                    className="group relative h-24 bg-surface border border-border rounded-xl flex items-center px-8 overflow-hidden"
                  >
                    <div className="flex-1">
                      <h5 className="text-xl font-black uppercase group-hover:text-primary transition-colors">{member.name}</h5>
                      <p className="text-muted text-sm">{member.role}</p>
                    </div>
                    
                    {/* Hover Image Reveal */}
                    <div className="absolute right-0 top-0 h-full w-40 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out">
                      {memberImg && (
                        <Image
                          src={memberImg.imageUrl}
                          alt={member.name}
                          fill
                          className="object-cover grayscale"
                          data-ai-hint={memberImg.imageHint}
                        />
                      )}
                      <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
