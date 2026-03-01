"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./MissionText.module.css";

export default function MissionText() {
  const copy =
    "We’re turning health on its head for Americans, uniting decades of science and wisdom to create a clear framework for living well. One with whole foods, at every level.";
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.7,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <p className={`${styles.text} ${isVisible ? styles.visible : ""}`}>
          <span className={styles.textBase}>{copy}</span>
          <span className={styles.textGradient} aria-hidden>
            {copy}
          </span>
        </p>
      </div>
    </section>
  );
}
