"use client"; // nextjs files defaults to server, use client executes page on browser
import { useState, useRef, useEffect } from 'react'; // usestate = memory, useref = html elements, useeffect = background tasks
import { motion, AnimatePresence } from 'motion/react';
import Background from '../components/background';
import styles from './page.module.css';

const APPS_CONFIG = [
  { id: 'profile', label: 'Profile', isLarge: true },
  { id: 'links', label: 'Links', isLarge: false },
  { id: 'skills', label: 'Skills', isLarge: false },
  { id: 'projects', label: 'Apps', isLarge: false },
];

export default function Home() {
  const screenRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openWindows, setOpenWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);

  // loading timer
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // open apps
  const handleOpenApp = (app) => {
    if (!openWindows.find((w) => w.id === app.id)) {
      setOpenWindows([...openWindows, app]);
    }
    setActiveWindow(app.id);
  };

  const handleCloseWindow = (appId, event) => {
    event.stopPropagation(); // Prevents the click from triggering window drag
    setOpenWindows(openWindows.filter((w) => w.id !== appId));
  };

  // Brings a window to the top when you click anywhere on it
  const handleFocusWindow = (appId) => {
    setActiveWindow(appId);
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  };

  const appVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 20 } }
  };

  return (
    <main ref={screenRef} style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Background />
      
      <AnimatePresence>
        {isLoading ? (
          <motion.div key="loader" className={styles.loaderContainer} exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}>
            <div className={`${styles.glassEffect} ${styles.loaderLogo}`}>
               <motion.div className={styles.spinner} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} />
            </div>
          </motion.div>
        ) : (
          <motion.div key="homescreen" className={styles.screenContainer}>
            
            {/* --- DESKTOP GRID --- */}
            <motion.div className={styles.widgetGrid} variants={gridVariants} initial="hidden" animate="visible">
                {APPS_CONFIG.map((app) => (
                    <motion.div
                        key={app.id}
                        className={`${styles.appWrapper} ${app.isLarge ? styles.profileWrapper : ''}`}
                        variants={appVariants}
                        
                        // NEW: Open the app on click!
                        onClick={() => handleOpenApp(app)}
                        
                        whileHover={{ scale: 1.05, filter: "brightness(1.15)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className={styles.glassEffect}>
                           <div className={styles.iconPlaceholder}>{app.isLarge ? 'Pfp' : 'Icon'}</div>
                        </div>
                        <span className={styles.appLabel}>{app.label}</span>
                    </motion.div>
                ))}
            </motion.div>

            {/* --- WINDOW MANAGER --- */}
            {/* We map through openWindows and render them over the desktop */}
            {openWindows.map((app) => (
                <motion.div
                    key={`window-${app.id}`}
                    className={`${styles.glassEffect} ${styles.windowContainer}`}
                    
                    // Fluid enter/exit animations
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 50 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    
                    // Z-Index Management: Active window gets 20, others get 10
                    style={{ zIndex: activeWindow === app.id ? 20 : 10, position: 'absolute' }}
                    
                    // Bring to front on click
                    onMouseDown={() => handleFocusWindow(app.id)}
                    
                    // Dragging configuration
                    drag
                    dragConstraints={screenRef}
                    dragElastic={0.1} // Limits how far you can pull it out of bounds
                    // dragListener={false} means you can't drag by clicking the body
                >
                    {/* Window Header (The draggable part) */}
                    <div className={styles.windowHeader} onPointerDown={(e) => handleFocusWindow(app.id)}>
                        <div className={styles.windowControls}>
                            <div className={`${styles.controlDot} ${styles.closeDot}`} onClick={(e) => handleCloseWindow(app.id, e)} />
                            <div className={`${styles.controlDot} ${styles.minDot}`} />
                            <div className={`${styles.controlDot} ${styles.maxDot}`} />
                        </div>
                        <span className={styles.windowTitle}>{app.label}</span>
                    </div>

                    {/* Window Content */}
                    <div className={styles.windowContent}>
                        <h2>Welcome to {app.label}</h2>
                        <p>This is the content area. We can inject different components here later based on the app.id!</p>
                    </div>
                </motion.div>
            ))}

            {/* --- UPDATED DOCK --- */}
            <motion.div 
                className={`${styles.glassEffect} ${styles.dock}`}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.8 }}
            >
                {/* Left Side: Open Apps (Acting as Minimized states) */}
                {openWindows.length === 0 && <span style={{fontSize: '12px', color: 'rgba(255,255,255,0.5)'}}>No open apps</span>}
                
                {openWindows.map((app) => (
                    <div 
                      key={`dock-${app.id}`} 
                      className={`${styles.glassEffect} ${styles.dockIcon}`}
                      onClick={() => handleFocusWindow(app.id)}
                    >
                      <span style={{fontSize: '10px'}}>{app.id}</span>
                    </div>
                ))}

                {/* Separator Line */}
                <div className={styles.dockSeparator} />

                {/* Right Side: Utilities */}
                <div className={`${styles.glassEffect} ${styles.dockUtility}`}>color icon placeholder</div>
                <div className={`${styles.glassEffect} ${styles.dockUtility}`}>sound icon placeholder</div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}