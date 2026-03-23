"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getFirebaseImageUrl } from "@/lib/utils";

interface LeadershipCardProps {
  leader: any; 
}

export const LeadershipCard = ({ leader }: LeadershipCardProps) => {
  const photoUrl = getFirebaseImageUrl(leader.profilePhoto);

  return (
    <Link href={`/leadership/${leader.slug}`} className="block h-full group">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative h-full">
        <div className="flex flex-col md:flex-row items-start gap-8 p-8 md:p-10 bg-white/5 border border-white/10 rounded-3xl transition-all duration-500 hover:border-white/20 hover:bg-white/[0.07] h-full cursor-pointer">
          <div className="relative w-full md:w-48 h-64 md:h-64 flex-shrink-0 transition-all duration-700 overflow-hidden rounded-2xl">
            {photoUrl && <Image src={photoUrl} alt={leader.fullName} fill className="object-cover" />}
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="flex-1 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {/* --- REDUCED TEXT SIZE --- */}
                <h3 className="text-2xl font-bold uppercase tracking-tight text-white group-hover:text-primary transition-colors">
                  {leader.fullName}
                </h3>
                {!leader.isActive && (
                  <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest text-white/30 border-white/10 rounded-sm px-2">Alumni</Badge>
                )}
              </div>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary mb-6 flex flex-wrap items-center">
                {leader.roleTitle}
                
                {/* --- FIX: HIGHLIGHTED TEXT & SLUG LINKING --- */}
                {leader.associatedVentureName && (
                  leader.associatedVentureSlug ? (
                    <span 
                      onClick={(e) => {
                        e.preventDefault(); 
                        window.location.href = `/ventures/${leader.associatedVentureSlug}`;
                      }}
                      className="text-primary ml-2 hover:text-primary/80 transition-colors cursor-pointer relative z-10"
                    >
                      {leader.associatedVentureName}
                    </span>
                  ) : (
                    <span className="text-primary ml-2">{leader.associatedVentureName}</span>
                  )
                )}
              </p>
              {/* --- REDUCED TEXT SIZE --- */}
              <p className="text-xs text-white/50 leading-relaxed font-light mb-8 line-clamp-3">
                {leader.shortBio}
              </p>
            </div>

            <div className="flex items-center gap-3 font-sans text-[10px] font-bold uppercase tracking-widest text-white hover:text-primary transition-colors group/btn w-fit">
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover/btn:border-primary transition-colors"><Plus className="w-3 h-3" /></div>
              Read Full Profile
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};