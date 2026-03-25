"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Volume2, VolumeX } from 'lucide-react';

export default function Home() {

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="layout-container">
      <nav className="navbar">
        
        {/* Left Side: Animated Greeting */}
        {/* <motion.div 
          className="nav-left"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Heyo, I'm Harris.
        </motion.div> */}

        {/* Right Side: Action Buttons */}
        <div className="nav-right">
          
          {/* Theme Toggle Button */}
          <button className="icon-btn" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? <Sun size={28} /> : <Moon size={28} />}
          </button>

          {/* Sound Toggle Button */}
          <button className="icon-btn" onClick={() => setIsSoundOn(!isSoundOn)}>
            {isSoundOn ? <Volume2 size={28} /> : <VolumeX size={28} />}
          </button>

        </div>
      </nav>

      <main className="main-grid">
      </main>

    </div>
  );
}
