"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ClosingText.module.css";

export default function ClosingText() {
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
          With a focus on real, simple ingredients over additives and marketing
          claims, the New Pyramid restores honesty, strength, and clear science
          to the way America eats.
        </p>
      </div>
    </section>
  );
}
