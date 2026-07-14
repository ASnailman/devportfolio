"use client";
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import styles from '../app/page.module.css';
import { playOpen } from '../lib/sound';

// useLayoutEffect warns during SSR; fall back to useEffect on the server.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Background themes offered by the palette picker. `key` matches the palette in
// src/components/background.js and the [data-theme] accents in page.module.css;
// `color` is the swatch shown in the bar (mirrors the 6 hues in palette.svg,
// plus a teal chip for the default theme).
const COLOR_OPTIONS = [
  { key: 'default', label: 'Default', color: '#09caba' },
  { key: 'red', label: 'Red', color: '#ff5a5a' },
  { key: 'amber', label: 'Amber', color: '#ffd23f' },
  { key: 'green', label: 'Green', color: '#7ed957' },
  { key: 'cyan', label: 'Cyan', color: '#22c1e0' },
  { key: 'blue', label: 'Blue', color: '#5b8def' },
  { key: 'violet', label: 'Violet', color: '#c74fe0' },
];

export default function Dock({
  openWindows,
  activeWindow,
  minimizedWindows = [],
  handleFocusWindow,
  soundOn,
  theme,
  onToggleSound,
  onSelectTheme,
}) {
  const [showColors, setShowColors] = useState(false);
  // Anchor point (center-x of the color button, and its distance from the
  // viewport bottom) captured when the bar opens.
  const [anchor, setAnchor] = useState(null);
  // Resolved (on-screen-clamped) left edge of the bar + where its arrow points.
  const [barLeft, setBarLeft] = useState(0);
  const [arrowLeft, setArrowLeft] = useState(0);

  const colorBtnRef = useRef(null);
  const barRef = useRef(null);

  const openColorBar = () => {
    const btn = colorBtnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    setAnchor({
      cx: r.left + r.width / 2,
      bottom: window.innerHeight - r.top + 14, // sit 14px above the button
    });
    setShowColors(true);
  };

  // Once the bar is rendered we know its width, so center it over the wheel but
  // clamp it inside the viewport; the arrow keeps pointing at the wheel.
  useIsoLayoutEffect(() => {
    if (!showColors || !anchor || !barRef.current) return;
    const width = barRef.current.offsetWidth;
    const margin = 8;
    let left = anchor.cx - width / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - margin - width));
    setBarLeft(left);
    setArrowLeft(anchor.cx - left);
  }, [showColors, anchor]);

  // Close the bar on any pointer-down outside it (or the trigger button).
  useEffect(() => {
    if (!showColors) return;
    const onPointerDown = (e) => {
      const inBar = barRef.current && barRef.current.contains(e.target);
      const inBtn = colorBtnRef.current && colorBtnRef.current.contains(e.target);
      if (!inBar && !inBtn) setShowColors(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [showColors]);

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
                  playOpen();
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
          onClick={() => onToggleSound()}
          whileHover={{ scale: 1.12, y: -6 }}
          whileTap={{ scale: 0.94 }}
          title={soundOn ? 'Mute sounds' : 'Enable sounds'}
          aria-label={soundOn ? 'Mute sounds' : 'Enable sounds'}
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
          ref={colorBtnRef}
          className={`${styles.glassEffect} ${styles.dockUtility}`}
          onClick={() => {
            if (showColors) {
              setShowColors(false);
            } else {
              openColorBar();
              playOpen();
            }
          }}
          whileHover={{ scale: 1.12, y: -6 }}
          whileTap={{ scale: 0.94 }}
          title="Background color"
          aria-label="Choose background color"
          aria-haspopup="true"
          aria-expanded={showColors}
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

        {/* Portaled to <body> so the dock's overflow/transform can't clip it. */}
        {typeof document !== 'undefined' &&
          createPortal(
            <AnimatePresence>
              {showColors && anchor && (
                <motion.div
                  ref={barRef}
                  className={styles.colorBar}
                  style={{ left: barLeft, bottom: anchor.bottom }}
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                >
                  {COLOR_OPTIONS.map((option) => (
                    <motion.button
                      key={option.key}
                      className={`${styles.colorSwatch} ${theme === option.key ? styles.colorSwatchActive : ''}`}
                      style={{ background: option.color }}
                      onClick={() => {
                        onSelectTheme(option.key);
                        playOpen();
                        setShowColors(false);
                      }}
                      whileHover={{ scale: 1.18 }}
                      whileTap={{ scale: 0.9 }}
                      title={option.label}
                      aria-label={`${option.label} background`}
                      aria-pressed={theme === option.key}
                    />
                  ))}
                  <span className={styles.colorBarArrow} style={{ left: arrowLeft }} />
                </motion.div>
              )}
            </AnimatePresence>,
            document.body
          )}
    </motion.div>
  );
}
