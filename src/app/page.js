"use client";
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Background from '../components/background';
import Dock from '../components/dock';
import Window from '../components/window';
import styles from './page.module.css';

const APPS_CONFIG = [
  { id: 'profile', label: 'Profile', isLarge: true },
  { id: 'links', label: 'Links', isLarge: false },
  { id: 'skills', label: 'Skills', isLarge: false },
  { id: 'projects', label: 'Apps', isLarge: false },
];

// Extracted the GridApp component for cleaner mapping and independent animations
function GridApp({ app, onOpen }) {
  const appVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 300, damping: 20 } 
    }
  };

  return (
    <motion.div
      variants={appVariants}
      className={`${styles.appWrapper} ${app.isLarge ? styles.profileWrapper : ''}`}
      onClick={() => onOpen(app)}
      whileHover={{ scale: 1.05, filter: "brightness(1.15)" }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={styles.glassEffect}>
         <div className={styles.iconPlaceholder}>{app.isLarge ? 'Pfp' : 'Icon'}</div>
      </div>
      <span className={styles.appLabel}>{app.label}</span>
    </motion.div>
  );
}

export default function Home() {
  const screenRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [openWindows, setOpenWindows] = useState([]);
  const [minimizedWindows, setMinimizedWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenApp = (app) => {
    if (!openWindows.find((w) => w.id === app.id)) {
      setOpenWindows([...openWindows, app]);
    }
    if (minimizedWindows.includes(app.id)) {
      setMinimizedWindows(minimizedWindows.filter(id => id !== app.id));
    }
    setActiveWindow(app.id);
  };

  const handleCloseWindow = (appId, event) => {
    event?.stopPropagation();
    setOpenWindows(openWindows.filter((w) => w.id !== appId));
    setMinimizedWindows(minimizedWindows.filter((id) => id !== appId));
  };

  const handleMinimizeWindow = (appId, event) => {
    event?.stopPropagation();
    if (!minimizedWindows.includes(appId)) {
      setMinimizedWindows([...minimizedWindows, appId]);
    }
  };

  const handleFocusWindow = (appId) => {
    setActiveWindow(appId);
    if (minimizedWindows.includes(appId)) {
      setMinimizedWindows(minimizedWindows.filter(id => id !== appId));
    }
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.15, 
        delayChildren: 0.2 
      } 
    }
  };

  return (
    <main ref={screenRef} style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Background />
      
      <AnimatePresence>
        {isLoading ? (
          <motion.div 
            key="loader" 
            className={styles.loaderContainer} 
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          >
            <div className={`${styles.glassEffect} ${styles.loaderLogo}`}>
               <motion.div 
                 className={styles.spinner} 
                 animate={{ rotate: 360 }} 
                 transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
               />
            </div>
          </motion.div>
        ) : (
          <motion.div key="homescreen" className={styles.screenContainer}>
            
            <motion.div 
              className={styles.widgetGrid} 
              variants={gridVariants} 
              initial="hidden" 
              animate="visible"
            >
                {APPS_CONFIG.map((app) => (
                    <GridApp key={app.id} app={app} onOpen={handleOpenApp} />
                ))}
            </motion.div>

            {openWindows.map((app) => (
                <Window 
                    key={`window-${app.id}`} 
                    app={app} 
                    isActive={activeWindow === app.id} 
                    isMinimized={minimizedWindows.includes(app.id)}
                    handleClose={handleCloseWindow} 
                    handleMinimize={handleMinimizeWindow}
                    handleFocus={handleFocusWindow}
                    screenRef={screenRef}
                />
            ))}

            <Dock openWindows={openWindows} handleFocusWindow={handleFocusWindow} />

          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}