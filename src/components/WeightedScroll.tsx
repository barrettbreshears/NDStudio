"use client";

import { useEffect } from "react";

function hasScrollableParent(target: EventTarget | null): boolean {
  let el = target as HTMLElement | null;

  while (el && el !== document.body) {
    const style = window.getComputedStyle(el);
    const overflowY = style.overflowY;
    const canScroll =
      (overflowY === "auto" || overflowY === "scroll") &&
      el.scrollHeight > el.clientHeight;

    if (canScroll) return true;
    el = el.parentElement;
  }

  return false;
}

export default function WeightedScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (prefersReducedMotion || isTouchDevice) return;

    let current = window.scrollY;
    let target = current;
    let rafId = 0;
    let maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const LERP = 0.075;
    const EPSILON = 0.2;
    const WHEEL_MULTIPLIER = 1.15;
    const MAX_WHEEL_STEP = 160;

    const run = () => {
      const delta = target - current;
      current += delta * LERP;

      if (Math.abs(delta) < EPSILON) {
        current = target;
      }

      window.scrollTo(0, current);

      if (Math.abs(target - current) >= EPSILON) {
        rafId = requestAnimationFrame(run);
      } else {
        rafId = 0;
      }
    };

    const clampTarget = (value: number) =>
      Math.max(0, Math.min(maxScroll, value));

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || hasScrollableParent(event.target)) return;

      event.preventDefault();
      maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      const modeFactor = event.deltaMode === 1 ? 18 : event.deltaMode === 2 ? window.innerHeight : 1;
      const rawStep = event.deltaY * modeFactor * WHEEL_MULTIPLIER;
      const boundedStep = Math.max(-MAX_WHEEL_STEP, Math.min(MAX_WHEEL_STEP, rawStep));
      target = clampTarget(target + boundedStep);

      if (!rafId) {
        rafId = requestAnimationFrame(run);
      }
    };

    const onResize = () => {
      maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      target = clampTarget(target);
      current = clampTarget(current);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (hasScrollableParent(event.target)) return;

      let delta = 0;

      if (event.key === "ArrowDown") delta = 90;
      if (event.key === "ArrowUp") delta = -90;
      if (event.key === "PageDown" || event.key === " ") delta = window.innerHeight * 0.9;
      if (event.key === "PageUp") delta = -window.innerHeight * 0.9;
      if (event.key === "Home") {
        event.preventDefault();
        target = 0;
      }
      if (event.key === "End") {
        event.preventDefault();
        target = maxScroll;
      }

      if (delta !== 0) {
        event.preventDefault();
        target = clampTarget(target + delta);
      }

      if (!rafId && (delta !== 0 || event.key === "Home" || event.key === "End")) {
        rafId = requestAnimationFrame(run);
      }
    };

    const onNativeScroll = () => {
      // Keep targets synced when user drags the scrollbar thumb.
      if (!rafId) {
        current = window.scrollY;
        target = current;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("keydown", onKeyDown, { capture: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onNativeScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onNativeScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
