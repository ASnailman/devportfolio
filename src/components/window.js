"use client";
import { motion, useMotionValue, useDragControls, animate } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import styles from '../app/page.module.css';

const MIN_WIDTH = 320;
const MIN_HEIGHT = 220;
const HEADER_HEIGHT = 40;
// Keep at least this many px of the window inside the viewport so it can never
// be dragged entirely off-screen and lost.
const VISIBLE_MARGIN = 80;

// Module-level counter so each freshly opened window cascades instead of
// stacking on the exact same coordinates.
let cascadeIndex = 0;

const SPRING = { type: 'spring', stiffness: 400, damping: 35 };

export default function Window({
    app,
    isActive,
    isMinimized,
    zIndex,
    handleClose,
    handleMinimize,
    handleFocus,
    constraintsRef,
    children,
}) {
    const dragControls = useDragControls();

    // Position is owned by motion values (x/y transforms). Origin (0,0) is the
    // top-left of the viewport-sized window layer, so snapping math is exact.
    // The lazy initializer runs once per mount so each window cascades.
    const [startPos] = useState(() => {
        const offset = (cascadeIndex++ % 6) * 34;
        return { x: 140 + offset, y: 70 + offset };
    });
    const x = useMotionValue(startPos.x);
    const y = useMotionValue(startPos.y);

    // Size is plain state, applied via `style` (not `animate`) so dragging the
    // resize handle is a direct 1:1 movement with no spring lag / jerk.
    const [size, setSize] = useState({ width: 640, height: 440 });

    // Remembers the pre-maximize geometry so the maximize button can toggle.
    const [isMaximized, setIsMaximized] = useState(false);
    const restoreState = useRef(null);

    const clampIntoView = () => {
        const sw = window.innerWidth;
        const sh = window.innerHeight;
        const nx = Math.min(
            Math.max(x.get(), VISIBLE_MARGIN - size.width),
            sw - VISIBLE_MARGIN
        );
        // Header must always stay reachable: never above 0, never fully below.
        const ny = Math.min(Math.max(y.get(), 0), sh - HEADER_HEIGHT);
        if (nx !== x.get()) animate(x, nx, SPRING);
        if (ny !== y.get()) animate(y, ny, SPRING);
    };

    const snapTo = (targetX, width, height) => {
        setIsMaximized(false);
        setSize({ width, height });
        animate(x, targetX, SPRING);
        animate(y, 0, SPRING);
    };

    const handleDragEnd = (_event, info) => {
        const sw = window.innerWidth;
        const pointerX = info.point.x;

        if (pointerX <= 20) {
            snapTo(0, Math.round(sw / 2), window.innerHeight);
        } else if (pointerX >= sw - 20) {
            snapTo(Math.round(sw / 2), Math.round(sw / 2), window.innerHeight);
        } else {
            clampIntoView();
        }
    };

    const handleResize = (e) => {
        // Resize must not start a window drag or select page text.
        e.preventDefault();
        e.stopPropagation();
        handleFocus(app.id);

        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = size.width;
        const startHeight = size.height;
        const maxWidth = window.innerWidth - x.get();
        const maxHeight = window.innerHeight - y.get();

        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'nwse-resize';

        const onPointerMove = (moveEvent) => {
            setSize({
                width: Math.min(
                    maxWidth,
                    Math.max(MIN_WIDTH, startWidth + (moveEvent.clientX - startX))
                ),
                height: Math.min(
                    maxHeight,
                    Math.max(MIN_HEIGHT, startHeight + (moveEvent.clientY - startY))
                ),
            });
        };

        const onPointerUp = () => {
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
        };

        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
    };

    const toggleMaximize = () => {
        if (isMaximized) {
            const prev = restoreState.current;
            if (prev) {
                setSize(prev.size);
                animate(x, prev.x, SPRING);
                animate(y, prev.y, SPRING);
            }
            setIsMaximized(false);
        } else {
            restoreState.current = { size, x: x.get(), y: y.get() };
            setSize({ width: window.innerWidth, height: window.innerHeight });
            animate(x, 0, SPRING);
            animate(y, 0, SPRING);
            setIsMaximized(true);
        }
    };

    // Keep windows on-screen (and maximized ones full-size) when the browser
    // viewport changes, so they never become unrecoverable.
    useEffect(() => {
        const onWindowResize = () => {
            if (isMaximized) {
                setSize({ width: window.innerWidth, height: window.innerHeight });
                animate(x, 0, SPRING);
                animate(y, 0, SPRING);
            } else {
                clampIntoView();
            }
        };
        window.addEventListener('resize', onWindowResize);
        return () => window.removeEventListener('resize', onWindowResize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMaximized, size.width, size.height]);

    return (
        <motion.div
            className={`${styles.glassEffect} ${styles.windowContainer} ${isActive ? styles.windowActive : ''}`}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{
                opacity: isMinimized ? 0 : 1,
                scale: isMinimized ? 0.85 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
                x,
                y,
                width: size.width,
                height: size.height,
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex,
                pointerEvents: isMinimized ? 'none' : 'auto',
            }}
            onPointerDownCapture={() => handleFocus(app.id)}
            drag
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={constraintsRef}
            dragElastic={0}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
        >
            <div
                className={styles.windowHeader}
                onPointerDown={(e) => dragControls.start(e)}
                onDoubleClick={toggleMaximize}
                style={{ touchAction: 'none' }}
            >
                <div className={styles.windowControls}>
                    <button
                        className={styles.controlBtn}
                        aria-label="Close window"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => handleClose(app.id, e)}
                    >
                        ✕
                    </button>
                    <button
                        className={styles.controlBtn}
                        aria-label="Minimize window"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => handleMinimize(app.id, e)}
                    >
                        —
                    </button>
                    <button
                        className={styles.controlBtn}
                        aria-label={isMaximized ? 'Restore window' : 'Maximize window'}
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleMaximize();
                        }}
                    >
                        ◻
                    </button>
                </div>
                <span className={styles.windowTitle}>{app.label}</span>
            </div>

            <div className={styles.windowContent}>
                {children ?? (
                    <>
                        <h2>Welcome to {app.label}</h2>
                        <p>Content goes here.</p>
                    </>
                )}
            </div>

            <div
                className={styles.resizeHandle}
                onPointerDown={handleResize}
                style={{ touchAction: 'none' }}
            />
        </motion.div>
    );
}
