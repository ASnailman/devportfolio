"use client";
import { motion } from 'motion/react';
import styles from '../app/page.module.css';

export default function Dock({ openWindows, activeWindow, minimizedWindows = [], handleFocusWindow }) {
  return (
    <motion.div
        className={`${styles.glassEffect} ${styles.dock}`}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.8 }}
    >
        {openWindows.length === 0 && <span className={styles.emptyDockText}>No open apps</span>}

        {openWindows.map((app) => {
            const isActive = activeWindow === app.id;
            const isMinimized = minimizedWindows.includes(app.id);
            return (
              <motion.button
                key={`dock-${app.id}`}
                className={`${styles.glassEffect} ${styles.dockIcon} ${isActive ? styles.dockIconActive : ''}`}
                onClick={() => handleFocusWindow(app.id)}
                whileHover={{ scale: 1.12, y: -6 }}
                whileTap={{ scale: 0.94 }}
                title={app.label}
                aria-label={`${app.label}${isMinimized ? ' (minimized)' : ''}`}
              >
                <span className={styles.dockIconText}>{app.label}</span>
                <span
                  className={`${styles.dockIndicator} ${isMinimized ? styles.dockIndicatorMinimized : ''}`}
                />
              </motion.button>
            );
        })}

        <div className={styles.dockSeparator} />

        <div className={`${styles.glassEffect} ${styles.dockUtility}`}></div>
        <div className={`${styles.glassEffect} ${styles.dockUtility}`}></div>
    </motion.div>
  );
}
