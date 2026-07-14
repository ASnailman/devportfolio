"use client";

import { motion } from "motion/react";
import styles from "./background.module.css";

// One wave palette per theme. Keys match COLOR_OPTIONS in src/components/dock.js
// and the [data-theme] accents in src/app/page.module.css. Each is a layered
// dark→bright gradient in that hue (7 stops, one per animated wave).
const PALETTES = {
    default: [
        '#2b2d36', '#0a9683', '#09caba', '#00d2ff',
        '#3b8df0', '#5e6fc8', '#303096'
    ],
    red: [
        '#2a1113', '#7a1420', '#b21e2b', '#e23b3b',
        '#ff5a5a', '#c8384a', '#5c1622'
    ],
    amber: [
        '#2a1e0a', '#7a4b12', '#c07d16', '#f0a91e',
        '#ffd23f', '#e0952a', '#5c3a12'
    ],
    green: [
        '#0f2417', '#155f34', '#1f8f4a', '#37b95a',
        '#7ed957', '#2e9d55', '#123a24'
    ],
    cyan: [
        '#0a2430', '#0f5f74', '#159fb8', '#22c1e0',
        '#5fe0ef', '#1f9fc0', '#123a44'
    ],
    blue: [
        '#141a33', '#1d3a86', '#2d5ad9', '#4b7bec',
        '#5f8def', '#3b6bd0', '#101d44'
    ],
    violet: [
        '#1e1633', '#4c1d95', '#6d28d9', '#8b5cf6',
        '#c74fe0', '#7c3aed', '#3b0764'
    ],
};

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

export default function Background({ theme = 'default' }) {
    const width = 1200;
    const height = 800;
    const colors = PALETTES[theme] ?? PALETTES.default;

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