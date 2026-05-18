"use client";
import { motion } from 'motion/react';
import styles from '../app/page.module.css';

export default function Dock({ openWindows, handleFocusWindow }) {
  return (
    <motion.div 
        className={`${styles.glassEffect} ${styles.dock}`}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.8 }}
    >
        {openWindows.length === 0 && <span className={styles.emptyDockText}>No open apps</span>}
        
        {openWindows.map((app) => (
            <div 
              key={`dock-${app.id}`} 
              className={`${styles.glassEffect} ${styles.dockIcon}`}
              onClick={() => handleFocusWindow(app.id)}
            >
              <span className={styles.dockIconText}>{app.id}</span>
            </div>
        ))}

        <div className={styles.dockSeparator} />

        <div className={`${styles.glassEffect} ${styles.dockUtility}`}></div>
        <div className={`${styles.glassEffect} ${styles.dockUtility}`}></div>
    </motion.div>
  );
}