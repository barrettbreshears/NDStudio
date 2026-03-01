"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./HeroFood.module.css";

interface FoodItem {
  name: string;
  category: string;
  image: string;
  x: string;
  y: string;
  enterX: string;
  enterY: string;
}

const foodItems: FoodItem[] = [
  { name: "Kiwi", category: "Vegetable and Fruit", image: "/images/food/kiwi.png", x: "24%", y: "18%", enterX: "-70px", enterY: "34px" },
  { name: "Salmon", category: "Whole Grain", image: "/images/food/salmon.png", x: "76%", y: "16%", enterX: "70px", enterY: "34px" },
  { name: "Chicken Breast", category: "Vegetable and Fruit", image: "/images/food/chicken.png", x: "10%", y: "50%", enterX: "-80px", enterY: "26px" },
  { name: "Beans", category: "Vegetable and Fruit", image: "/images/food/beans.png", x: "74%", y: "50%", enterX: "72px", enterY: "28px" },
  { name: "Brown Rice", category: "Whole Grain", image: "/images/food/brownrice.png", x: "26%", y: "84%", enterX: "-62px", enterY: "22px" },
  { name: "Broccoli", category: "Vegetable and Fruit", image: "/images/food/broccoli.png", x: "86%", y: "84%", enterX: "64px", enterY: "24px" },
];

export default function HeroFood() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    let rafId = 0;
    let targetX = 0;
    let targetY = 0;
    let targetScrollY = 0;
    let currentX = 0;
    let currentY = 0;
    let currentScrollY = 0;

    const clamp = (value: number, min: number, max: number) =>
      Math.max(min, Math.min(max, value));

    const tick = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      currentScrollY += (targetScrollY - currentScrollY) * 0.11;

      grid.style.setProperty("--mx", `${currentX.toFixed(2)}px`);
      grid.style.setProperty("--my", `${currentY.toFixed(2)}px`);
      grid.style.setProperty("--sy", `${currentScrollY.toFixed(2)}px`);

      if (
        Math.abs(targetX - currentX) > 0.08 ||
        Math.abs(targetY - currentY) > 0.08 ||
        Math.abs(targetScrollY - currentScrollY) > 0.08
      ) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = 0;
      }
    };

    const startTick = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const onMove = (event: MouseEvent) => {
      const rect = grid.getBoundingClientRect();
      const nx = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
      const ny = (event.clientY - (rect.top + rect.height / 2)) / rect.height;

      targetX = clamp(nx * 42, -18, 18);
      targetY = clamp(ny * 28, -12, 12);
      startTick();
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      startTick();
    };

    const onScroll = () => {
      const rect = grid.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const gridCenter = rect.top + rect.height / 2;
      const normalized = clamp(
        (gridCenter - viewportCenter) / (window.innerHeight * 0.9),
        -1,
        1
      );
      targetScrollY = -normalized * 12;
      startTick();
    };

    onScroll();
    grid.addEventListener("mousemove", onMove);
    grid.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      grid.removeEventListener("mousemove", onMove);
      grid.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Hero food intro">
      <div className={styles.container}>
        <div className={`${styles.heroContent} ${isInView ? styles.heroIn : ""}`}>
          <h1 className={styles.title}>
            A Radical New
            <br />
            Approach To Health
            <br />
            In America
          </h1>
          <a href="#pyramid" className={styles.cta}>
            <span className={styles.ctaText}>Explore the New Pyramid</span>
            <svg
              width="34"
              height="34"
              viewBox="0 0 34 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.ctaIcon}
            >
              <circle opacity="0.2" cx="17" cy="17" r="17" fill="white" />
              <path
                d="M16.3928 20.83L20.3078 16.915L16.4078 13H17.9978L21.8978 16.915L17.9978 20.815L16.3928 20.83ZM13.2578 17.5V16.33H21.1328V17.5H13.2578Z"
                fill="white"
              />
            </svg>
          </a>
        </div>

        <div
          ref={gridRef}
          className={`${styles.foodGrid} ${isInView ? styles.gridIn : ""}`}
          aria-hidden
        >
          {foodItems.map((food, index) => {
            const depth = 0.55 + (index % 3) * 0.25;
            const floatAmp = 4 + (index % 3) * 1.5;
            const floatDuration = 5.4 + (index % 3) * 0.9;
            return (
              <article
                key={food.name}
                className={styles.card}
                style={
                  {
                    "--x": food.x,
                    "--y": food.y,
                    "--enter-x": food.enterX,
                    "--enter-y": food.enterY,
                    "--depth": depth,
                    "--delay": `${index * 120}ms`,
                    "--float-amp": `${floatAmp}px`,
                    "--float-duration": `${floatDuration}s`,
                    "--float-offset": `${index * -0.55}s`,
                  } as CSSProperties
                }
              >
                <div className={styles.cardFloat}>
                  <div className={styles.cardMotion}>
                    <div className={styles.imageWrap}>
                      <img src={food.image} alt={food.name} className={styles.foodImage} />
                    </div>
                    <div className={styles.textWrap}>
                      <span className={styles.foodName}>{food.name}</span>
                      <span className={styles.foodCategory}>{food.category}</span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
