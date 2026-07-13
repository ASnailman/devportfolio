"use client";
import { motion } from 'motion/react';
import styles from '../app/page.module.css';

export default function Dock({
  openWindows,
  activeWindow,
  minimizedWindows = [],
  handleFocusWindow,
  soundOn,
  theme,
  onToggleSound,
  onToggleTheme,
  playClick,
}) {
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
                onClick={() => {
                  handleFocusWindow(app.id);
                  playClick?.();
                }}
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

        <motion.button
          className={`${styles.glassEffect} ${styles.dockUtility}`}
          onClick={() => {
            onToggleSound();
            playClick?.();
          }}
          whileHover={{ scale: 1.12, y: -6 }}
          whileTap={{ scale: 0.94 }}
          title={soundOn ? 'Mute click sounds' : 'Enable click sounds'}
          aria-label={soundOn ? 'Mute click sounds' : 'Enable click sounds'}
          aria-pressed={soundOn}
          style={{ background: 'transparent', border: 'none' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.dockUtilityIcon}
            src={soundOn ? '/icons/sound-on.svg' : '/icons/sound-off.svg'}
            alt=""
            aria-hidden="true"
            draggable={false}
          />
        </motion.button>

        <motion.button
          className={`${styles.glassEffect} ${styles.dockUtility}`}
          onClick={() => {
            onToggleTheme();
            playClick?.();
          }}
          whileHover={{ scale: 1.12, y: -6 }}
          whileTap={{ scale: 0.94 }}
          title="Swap color palette"
          aria-label="Swap color palette"
          aria-pressed={theme === 'purple'}
          style={{ background: 'transparent', border: 'none' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.dockUtilityIcon}
            src="/icons/palette.svg"
            alt=""
            aria-hidden="true"
            draggable={false}
          />
        </motion.button>
    </motion.div>
  );
}
