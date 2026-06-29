@AGENTS.md

Developer Portfolio - OS-Style UI Plan

🎯 Purpose

This project is an interactive, web-based developer portfolio styled as a lightweight desktop operating system. It aims to showcase projects, skills, and links through an immersive, window-based interface rather than a traditional scrolling webpage.

🛠 Tech Stack

Framework: Next.js (App Router, primarily Client Components)

UI Library: React

Animations: Framer Motion (motion/react)

Styling: CSS Modules (.module.css) + global CSS resets

Fonts: next/font/google (Geist & Geist Mono)

🎨 Design Philosophy & UI Rules

NOT a Mac Clone: We are explicitly avoiding a 1:1 macOS copy. Window controls are monochromatic, transparent squares (Close, Minimize, Maximize) placed on the top left.

Glassmorphism: Heavy use of semi-transparent backgrounds with backdrop-filter: blur(5px) and soft borders.

Dark Theme Default: True dark background (#0a0a0a) with animated, subtle colored bezier waves.

Motion & Physics: * Smooth, staggered drop-in animations on load.

Spring physics for scaling and hovering.

NO Sliding/Momentum Physics on draggable windows (they should stop exactly where the cursor drops them).

Snappy Interactions: Windows should cleanly snap to the left or right halves of the screen when dragged to the edges.

🏗 Current Architecture & State

The codebase was recently refactored from a single monolithic file into modular components:

src/app/page.js: The main Desktop environment. Manages the state of openWindows, minimizedWindows, and the activeWindow. Handles the loading screen and renders the desktop grid (staggered entrance).

src/components/Window.js: The draggable, resizable window interface. Includes edge-snapping logic, custom bottom-right resize handles, and monochromatic control buttons.

src/components/Dock.js: An adaptive bottom dock that expands based on open/minimized apps. Contains icons to refocus/un-minimize apps and placeholders for utilities.

src/components/background.js: An animated SVG bezier curve background.

src/app/page.module.css: The cleaned-up stylesheet containing specific layout grids, glass effect utilities, and window styling.

🐛 Audit & Bug Check Requirements (ACTION REQUIRED)

The app is currently in a functional draft state, but needs a thorough audit to fix lingering bugs:

Minimize Logic State: Verify the minimizedWindows state array properly hides the window (using opacity/pointer-events) without unmounting it, and ensure clicking the dock icon perfectly restores its exact previous position and size.

Z-Index & Focus: Ensure that clicking inside a window (or dragging it) always correctly bumps its zIndex above all other open windows.

Resize Handle Glitches: Check the custom resize event listener in Window.js. Ensure dragging the bottom right corner doesn't cause text selection or jerky movements, and enforces minimum dimensions securely.

Drag Boundary Constraints: Ensure windows cannot be dragged entirely off-screen, making them unrecoverable.

Window Snapping Overlaps: Verify that snapping to the left/right 50% screen space properly updates the window's internal size and position state so it doesn't snap back to the wrong size on the next drag.

🚀 Future Additions & Roadmap

Once the core window management is bug-free, implement the following:

Phase 1: Window Content Injection

Build out specific inner components for each app (Profile, Links, Skills, Projects).

Pass these components dynamically into Window.js based on the app.id.

Create a grid-based "Projects" layout inside the Apps window to showcase external links and screenshots.

Phase 2: Mobile Responsiveness

The current grid is responsive, but dragging and resizing windows on a touch screen (mobile) will feel clunky.

Implement a mobile-specific view: If window.innerWidth < 768px, apps should open in full-screen modals rather than draggable windows.

Phase 3: Utilities & Polish

Dock Utilities: Implement functional sound (mute/unmute background music/SFX) and a color theme picker inside the dock utility circles.

Context Menus: Add custom right-click menus on the desktop to change the background colors.

Clock/Status Bar: Add a subtle top right or dock-integrated clock.