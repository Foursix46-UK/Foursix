'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const words = [
  "फोरसिक्स46", 
  "福尔西克斯46", 
  "フォーシックス46", 
  "ФорСикс46", 
  "ఫోర్‌సిక్స్46", 
  "ఫోర్సిక్ఫ్46", 
  "โฤร์ซิกซ์46", 
  "Pedwar Chwech46", 
  "FourSix46®"
];

type PreloaderProps = {
  onComplete?: () => void;
};

export default function Preloader({ onComplete }: PreloaderProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index === words.length - 1) {
      const doneTimeout = setTimeout(() => {
        onComplete?.();
      }, 600);
      return () => clearTimeout(doneTimeout);
    }

    const timeout = setTimeout(() => {
      setIndex(index + 1);
    }, index === 0 ? 1200 : 150);

    return () => clearTimeout(timeout);
  }, [index, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0A0A0A] h-screen w-screen"
    >
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 text-[#FAFAFA] text-[22px] md:text-[26px] font-sans font-medium tracking-tighter z-10"
      >
        <span className="block w-2.5 h-2.5 bg-white rounded-full"></span>
        {words[index]}
      </motion.p>
    </motion.div>
  );
}
