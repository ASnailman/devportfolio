"use client";
import { motion } from 'motion/react';
import { useState } from 'react';
import styles from '../app/page.module.css';

export default function Window({ app, isActive, isMinimized, handleClose, handleMinimize, handleFocus, screenRef }) {
    const [size, setSize] = useState({ width: 600, height: 400 });
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleDragEnd = (event, info) => {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const { x } = info.point;

        if (x < 50) {
            setSize({ width: screenWidth / 2, height: screenHeight });
            setPosition({ x: -screenWidth / 4, y: 0 }); 
        } else if (x > screenWidth - 50) {
            setSize({ width: screenWidth / 2, height: screenHeight });
            setPosition({ x: screenWidth / 4, y: 0 });
        }
    };

    const handleResize = (e) => {
        e.stopPropagation();
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = size.width;
        const startHeight = size.height;

        const onPointerMove = (moveEvent) => {
            setSize({
                width: Math.max(300, startWidth + (moveEvent.clientX - startX)),
                height: Math.max(200, startHeight + (moveEvent.clientY - startY))
            });
        };

        const onPointerUp = () => {
            document.removeEventListener("pointermove", onPointerMove);
            document.removeEventListener("pointerup", onPointerUp);
        };

        document.addEventListener("pointermove", onPointerMove);
        document.addEventListener("pointerup", onPointerUp);
    };

    return (
        <motion.div
            className={`${styles.glassEffect} ${styles.windowContainer}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
                opacity: isMinimized ? 0 : 1, 
                scale: isMinimized ? 0.8 : 1, 
                width: size.width, 
                height: size.height,
                x: position.x,
                y: isMinimized ? position.y + 50 : position.y, // Drops down slightly when minimizing
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{ 
                zIndex: isActive ? 20 : 10, 
                position: 'absolute',
                pointerEvents: isMinimized ? 'none' : 'auto' // Prevents ghost clicks while invisible
            }}
            onMouseDown={() => handleFocus(app.id)}
            drag
            dragConstraints={screenRef}
            dragElastic={0} 
            dragMomentum={false} 
            onDragEnd={handleDragEnd}
        >
            <div className={styles.windowHeader} onPointerDown={() => handleFocus(app.id)}>
                <div className={styles.windowControls}>
                    <button className={styles.controlBtn} onClick={(e) => handleClose(app.id, e)}>✕</button>
                    <button className={styles.controlBtn} onClick={(e) => handleMinimize(app.id, e)}>—</button>
                    <button className={styles.controlBtn} onClick={() => setSize({ width: window.innerWidth, height: window.innerHeight })}>◻</button>
                </div>
                <span className={styles.windowTitle}>{app.label}</span>
            </div>

            <div className={styles.windowContent}>
                <h2>Welcome to {app.label}</h2>
                <p>Content goes here.</p>
            </div>

            <div className={styles.resizeHandle} onPointerDown={handleResize} />
        </motion.div>
    );
}