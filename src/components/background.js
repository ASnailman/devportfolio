"use client";

import { motion } from "motion/react";
import styles from "./background.module.css";

// const colors = [
//     '#2b2d36', '#0a9683', '#09caba', '#00d2ff',
//     '#3b8df0', '#5e6fc8', '#303096'
// ];

const colors = [
    '#1a1a24','#2d2d4e','#6262a151','#272747',
    '#292b49','#1a1a24','#1a1a24',
];

// Bezier Math Logic
function generateWavePath(baseY, amplitude, phase, width = 1200, height = 800) {
    const p0y = baseY + Math.sin(phase) * amplitude;
    const p1y = baseY + Math.sin(phase + 1.5) * amplitude;
    const p2y = baseY + Math.sin(phase + 3) * amplitude;
    const p3y = baseY + Math.sin(phase + 4.5) * amplitude;

    return `M 0 ${height + 200} 
            L 0 ${p0y} 
            C 300 ${p0y}, 300 ${p1y}, 600 ${p1y} 
            C 900 ${p1y}, 900 ${p2y}, ${width} ${p2y} 
            C 1500 ${p2y}, 1500 ${p3y}, 1800 ${p3y}
            L 1800 ${height + 200} Z`;
}

export default function Background() {
    const width = 1200;
    const height = 800;

    return (
        <div className={styles.backgroundWrapper}>
            <svg 
                className={styles.svgContainer} 
                viewBox={`0 0 ${width} ${height}`} 
                preserveAspectRatio="none"
            >
                {colors.map((color, index) => {
                    const baseY = 50 + (index * 110); 
                    const amplitude = 50 + (index * 8); 
                    
                    const startPath = generateWavePath(baseY, amplitude, index, width, height);
                    const endPath = generateWavePath(baseY, amplitude, index + Math.PI, width, height);

                    return (
                        <motion.path
                            key={index}
                            fill={color}
                            initial={{ d: startPath }}
                            animate={{ d: endPath }}
                            transition={{
                                duration: 15 + (index * 2),
                                repeat: Infinity,
                                repeatType: "mirror", 
                                ease: "easeInOut"
                            }}
                        />
                    );
                })}
            </svg>
        </div>
    );
}