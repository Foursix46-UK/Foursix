"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, ArrowRight } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { LeadershipProfile } from "@/lib/leadership-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * @fileOverview Reusable UI components for Leadership profiles.
 * - LeadershipCard: The grid preview item.
 * - LeadershipModal: The detailed bio view.
 */

interface LeadershipCardProps {
  leader: LeadershipProfile;
  onClick: () => void;
}

export const LeadershipCard = ({ leader, onClick }: LeadershipCardProps) => {
  const leaderImg = PlaceHolderImages.find(img => img.id === leader.profilePhoto);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div 
        onClick={onClick}
        className="flex flex-col md:flex-row items-start gap-8 p-8 md:p-10 bg-white/5 border border-white/10 rounded-3xl transition-all duration-500 hover:border-white/20 hover:bg-white/[0.07] h-full cursor-pointer"
      >
        {/* Photo Section */}
        <div className="relative w-full md:w-48 h-64 md:h-64 flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-700 overflow-hidden rounded-2xl">
          {leaderImg && (
            <Image
              src={leaderImg.imageUrl}
              alt={leader.fullName}
              fill
              className="object-cover"
              data-ai-hint={leaderImg.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Info Section */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-3xl font-bold uppercase tracking-tight text-white group-hover:text-primary transition-colors">
                {leader.fullName}
              </h3>
              {!leader.isActive && (
                <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest text-white/30 border-white/10 rounded-sm">
                  Alumni
                </Badge>
              )}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6">
              {leader.roleTitle}
            </p>
            <p className="text-sm text-white/50 leading-relaxed font-light mb-8 line-clamp-3">
              {leader.shortBio}
            </p>
          </div>

          <div className="flex items-center gap-3 font-sans text-[10px] font-bold uppercase tracking-widest text-white hover:text-primary transition-colors group/btn w-fit">
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover/btn:border-primary transition-colors">
              <Plus className="w-3 h-3" />
            </div>
            Read Full Profile
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface LeadershipModalProps {
  leader: LeadershipProfile | null;
  onClose: () => void;
}

export const LeadershipModal = ({ leader, onClose }: LeadershipModalProps) => {
  if (!leader) return null;

  const leaderImg = PlaceHolderImages.find(img => img.id === leader.profilePhoto);

  return (
    <AnimatePresence>
      {leader && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#0A0A0A] border border-white/10 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-white/50 hover:text-white z-50 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Image Section */}
            <div className="relative w-full md:w-5/12 h-64 md:h-auto overflow-hidden">
              {leaderImg && (
                <Image
                  src={leaderImg.imageUrl}
                  alt={leader.fullName}
                  fill
                  className="object-cover grayscale"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
            </div>

            {/* Modal Content Section */}
            <div className="flex-1 p-8 md:p-16 overflow-y-auto">
              <header className="mb-10">
                <div className="flex items-center gap-4 mb-2">
                  <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-white">
                    {leader.fullName}
                  </h2>
                  {!leader.isActive && (
                    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 border-white/5 px-3 py-1">
                      Alumni
                    </Badge>
                  )}
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
                  {leader.roleTitle}
                </p>
              </header>

              <div className="space-y-6 mb-12">
                <p className="text-lg text-white/80 font-light leading-relaxed font-sans">
                  {leader.longBio}
                </p>
              </div>

              {/* LinkedIn Action */}
              <div className="pt-10 border-t border-white/5 flex items-center justify-between">
                <a 
                  href={leader.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors flex items-center gap-3"
                >
                  Connect on LinkedIn <ArrowRight className="w-3 h-3" />
                </a>
                <div className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-white/10">
                  FourSix46 Corporate
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
