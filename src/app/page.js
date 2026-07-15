"use client";
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Background from '../components/background';
import Dock from '../components/dock';
import Window from '../components/Window';
import AppContent from '../components/appContent';
import { profile } from '../content/portfolio';
import { setSoundEnabled, playOpen, playClose } from '../lib/sound';
import { useIsMobile } from '../lib/useIsMobile';
import styles from './page.module.css';

// The apps on the desktop. `icon` is the emoji/text shown on the grid tile —
// change it to anything you like. Window content is edited in
// src/content/portfolio.js; add a new app by adding an entry here plus a
// matching component in src/components/appContent.js.
// `image` is the full-bleed icon shown on the grid tile — replace with a
// per-app file (e.g. '/icons/profile.png') once you have real artwork.
// `icon` (emoji) is kept as a fallback/reference and is no longer rendered.
const APPS_CONFIG = [
  { id: 'profile', label: 'Profile', isLarge: true, icon: '👋', image: '/app_images/harris_prof_clean.png' },
  { id: 'links', label: 'Links', isLarge: false, icon: '🔗', image: '/icons/links.svg' },
  { id: 'skills', label: 'Skills', isLarge: false, icon: '🛠️', image: '/icons/skills.svg' },
  { id: 'projects', label: 'Apps', isLarge: false, icon: '📦', image: '/icons/apps.svg' },
  // { id: 'FAQ', label: 'Apps', isLarge: false, icon: '📦', image: '/icons/placeholder.svg' },
];

// Startup greeting shown after the loading spinner. Change this string to
// update the message; it is split on spaces so each word pops in on its own.
const GREETING_TEXT = "Hey! I'm Harris.";
// How long (ms) the fully-revealed greeting lingers before it slides away.
const GREETING_HOLD_MS = 1300;

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
      <div className={`${styles.glassEffect} ${styles[`tile-${app.id}`] || ''}`}>
         {/* eslint-disable-next-line @next/next/no-img-element */}
         <img
           className={styles.gridIcon}
           src={app.id === 'profile' && profile.avatar ? profile.avatar : app.image}
           alt={app.label}
         />
      </div>
      <span className={styles.appLabel}>{app.label}</span>
    </motion.div>
  );
}

// iPad-style startup greeting: each word pops in one after another, the phrase
// lingers, then the whole line slides off to the side and calls onComplete.
function Greeting({ text, onComplete }) {
  const words = text.split(' ');
  const [slideOut, setSlideOut] = useState(false);

  const STAGGER = 0;
  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: STAGGER, delayChildren: 0.1 },
    },
  };
  const wordVariant = {
    hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 400, damping: 22 },
    },
  };

  useEffect(() => {
    // Wait for every word to finish popping in, hold, then start the slide-out.
    const popInMs = 100 + words.length * STAGGER * 1000;
    const timer = setTimeout(() => setSlideOut(true), popInMs + GREETING_HOLD_MS);
    return () => clearTimeout(timer);
  }, [words.length]);

  return (
    <motion.div
      className={styles.greeting}
      variants={container}
      initial="hidden"
      animate={slideOut ? { x: '-120%', opacity: 0 } : 'visible'}
      transition={slideOut ? { duration: 0.55, ease: 'easeIn' } : undefined}
      onAnimationComplete={() => {
        if (slideOut) onComplete();
      }}
    >
      {words.map((word, i) => (
        <motion.span key={i} className={styles.greetingWord} variants={wordVariant}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

export default function Home() {
  // Below 768px we switch windows to touch-friendly full-screen sheets instead
  // of draggable/resizable desktop windows (see src/lib/useIsMobile.js).
  const isMobile = useIsMobile();
  // Startup sequence: 'spinner' (loading wheel) -> 'greeting' (word-by-word
  // hello) -> 'done' (desktop revealed). The background stays blurred until done.
  const [phase, setPhase] = useState('spinner');
  const isLoading = phase !== 'done';

  const [openWindows, setOpenWindows] = useState([]);
  const [minimizedWindows, setMinimizedWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);

  // Dock utilities: click-sound toggle and background palette swap.
  const [soundOn, setSoundOn] = useState(true);
  const [theme, setTheme] = useState('default');

  // Mirror the sound toggle into the sound module so every play() respects it.
  useEffect(() => {
    setSoundEnabled(soundOn);
  }, [soundOn]);

  const toggleSound = () => setSoundOn((s) => !s);

  // Incrementing z-index per focus, so the most-recently-touched window is
  // always on top and the prior stacking order is preserved underneath.
  const [zIndices, setZIndices] = useState({});
  const zCounter = useRef(10);

  const bringToFront = (appId) => {
    zCounter.current += 1;
    setZIndices((prev) => ({ ...prev, [appId]: zCounter.current }));
  };

  useEffect(() => {
    // Same spinner duration as before, then hand off to the greeting phase.
    const timer = setTimeout(() => setPhase('greeting'), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenApp = (app) => {
    playOpen();
    setOpenWindows((prev) =>
      prev.find((w) => w.id === app.id) ? prev : [...prev, app]
    );
    setMinimizedWindows((prev) => prev.filter((id) => id !== app.id));
    setActiveWindow(app.id);
    bringToFront(app.id);
  };

  const handleCloseWindow = (appId, event) => {
    event?.stopPropagation();
    playClose();
    setOpenWindows((prev) => prev.filter((w) => w.id !== appId));
    setMinimizedWindows((prev) => prev.filter((id) => id !== appId));
    setActiveWindow((prev) => (prev === appId ? null : prev));
  };

  const handleMinimizeWindow = (appId, event) => {
    event?.stopPropagation();
    setMinimizedWindows((prev) =>
      prev.includes(appId) ? prev : [...prev, appId]
    );
    setActiveWindow((prev) => (prev === appId ? null : prev));
  };

  const handleFocusWindow = (appId) => {
    setActiveWindow(appId);
    setMinimizedWindows((prev) => prev.filter((id) => id !== appId));
    bringToFront(appId);
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
    <main
      data-theme={theme}
      style={{ position: "relative", width: "100vw", height: "100dvh", overflow: "hidden" }}
    >
      {/* Background sits in its own layer so it can blur during startup and
          sharpen once the desktop is revealed, without touching Background. */}
      <motion.div
        style={{ position: "fixed", inset: 0, zIndex: 0 }}
        animate={{ filter: isLoading ? "blur(14px)" : "blur(0px)" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Background theme={theme} />
      </motion.div>

      <AnimatePresence>
        {isLoading ? (
          <motion.div
            key="loader"
            className={styles.loaderContainer}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          >
            <AnimatePresence mode="wait">
              {phase === 'spinner' ? (
                <motion.div
                  key="spinner"
                  className={`${styles.glassEffect} ${styles.loaderLogo}`}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                >
                  <motion.div
                    className={styles.spinner}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  />
                </motion.div>
              ) : (
                <Greeting
                  key="greeting"
                  text={GREETING_TEXT}
                  onComplete={() => setPhase('done')}
                />
              )}
            </AnimatePresence>
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

            {/* Dedicated full-viewport layer: it is the positioning context for
                windows, so window (0,0) maps to the viewport's top-left exactly.
                pointer-events:none lets clicks fall through to the grid where no
                window covers it. */}
            <div className={styles.windowLayer}>
              {openWindows.map((app) => (
                  <Window
                      key={`window-${app.id}`}
                      app={app}
                      isActive={activeWindow === app.id}
                      isMinimized={minimizedWindows.includes(app.id)}
                      zIndex={zIndices[app.id] ?? 10}
                      handleClose={handleCloseWindow}
                      handleMinimize={handleMinimizeWindow}
                      handleFocus={handleFocusWindow}
                      isMobile={isMobile}
                  >
                      <AppContent appId={app.id} />
                  </Window>
              ))}
            </div>

            <Dock
              openWindows={openWindows}
              activeWindow={activeWindow}
              minimizedWindows={minimizedWindows}
              handleFocusWindow={handleFocusWindow}
              soundOn={soundOn}
              theme={theme}
              onToggleSound={toggleSound}
              onSelectTheme={setTheme}
            />

          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
