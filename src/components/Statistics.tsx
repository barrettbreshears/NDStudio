"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Statistics.module.css";

export default function Statistics() {
  const [isVisible, setIsVisible] = useState(false);
  const [count, setCount] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let current = 0;
    const target = 60;
    const duration = 1500;
    const stepTime = duration / target;

    const timer = setInterval(() => {
      current++;
      setCount(current);
      if (current >= target) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible]);

  const circumference = 2 * Math.PI * 92;
  const dashOffset = circumference - (count / 100) * circumference;

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.circle}>
          <svg
            width="218"
            height="218"
            viewBox="0 0 218 218"
            className={styles.svg}
          >
            <circle
              cx="109"
              cy="109"
              r="92"
              fill="none"
              stroke="var(--color-cream-dark)"
              strokeWidth="6"
            />
            <circle
              cx="109"
              cy="109"
              r="92"
              fill="none"
              stroke="#1C3A16"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(90 109 109)"
              className={styles.progress}
            />
          </svg>
          <span className={styles.value}>{count}%</span>
        </div>
        <p className={styles.text}>
          Over half of American adults now live with at least one chronic disease
          despite decades of federal nutrition guidance.
        </p>
        <a href="#pyramid" className={styles.link}>
          Let&apos;s Fix this
        </a>
      </div>
    </section>
  );
}
