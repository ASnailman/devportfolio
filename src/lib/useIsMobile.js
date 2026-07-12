"use client";
// Reports whether the viewport is phone/tablet-portrait sized, so the desktop
// window manager can switch to a touch-friendly full-screen "sheet" layout.
// Kept in one place (this hook + the MOBILE_BREAKPOINT constant) so the JS
// breakpoint and the CSS `@media (max-width: 767px)` rules stay in sync.
import { useState, useEffect } from 'react';

// Matches the CSS breakpoint: below this width we use the mobile layout.
export const MOBILE_BREAKPOINT = 768;

export function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  // Start `false` so the server render and first client render agree (desktop),
  // avoiding a hydration mismatch; the effect corrects it immediately on mount.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [breakpoint]);

  return isMobile;
}
