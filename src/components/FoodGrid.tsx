"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./FoodGrid.module.css";

interface FoodItem {
  name: string;
  category: string;
  image: string;
  side: "left" | "right";
  offsetX: string;
  parallaxSpeed: number; // multiplier for scroll-driven vertical drift
}

const foodItems: FoodItem[] = [
  // Row 1
  { name: "Kiwi", category: "Vegetable and Fruit", image: "/images/food/kiwi.png", side: "left", offsetX: "28%", parallaxSpeed: 0.04 },
  { name: "Salmon", category: "Whole Grain", image: "/images/food/salmon.png", side: "right", offsetX: "18%", parallaxSpeed: -0.03 },
  // Row 2
  { name: "Chicken Breast", category: "Vegetable and Fruit", image: "/images/food/chicken.png", side: "left", offsetX: "8%", parallaxSpeed: -0.05 },
  { name: "Beans", category: "Vegetable and Fruit", image: "/images/food/beans.png", side: "right", offsetX: "6%", parallaxSpeed: 0.035 },
  // Row 3
  { name: "Brown Rice", category: "Whole Grain", image: "/images/food/brownrice.png", side: "left", offsetX: "22%", parallaxSpeed: 0.045 },
  { name: "Broccoli", category: "Vegetable and Fruit", image: "/images/food/broccoli.png", side: "right", offsetX: "0%", parallaxSpeed: -0.04 },
];

function FoodCard({ food, index }: { food: FoodItem; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const [parallaxY, setParallaxY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Scroll-triggered entrance
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Continuous parallax drift on scroll
  const handleScroll = useCallback(() => {
    const slot = slotRef.current;
    if (!slot) return;

    const rect = slot.getBoundingClientRect();
    const windowH = window.innerHeight;
    const centerOffset = rect.top - windowH / 2;
    setParallaxY(centerOffset * food.parallaxSpeed);
  }, [food.parallaxSpeed]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial position
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const isLeft = food.side === "left";

  return (
    <div
      ref={slotRef}
      className={styles.cardSlot}
      style={{
        justifySelf: isLeft ? "start" : "end",
        paddingLeft: isLeft ? food.offsetX : undefined,
        paddingRight: !isLeft ? food.offsetX : undefined,
      }}
    >
      <div
        ref={cardRef}
        className={`${styles.card} ${isLeft ? styles.fromLeft : styles.fromRight} ${isVisible ? styles.visible : ""}`}
        style={{
          transitionDelay: `${index * 150}ms`,
          transform: isVisible ? `translateY(${parallaxY}px)` : undefined,
        }}
      >
        <div className={styles.imageWrap}>
          <img
            src={food.image}
            alt={food.name}
            className={styles.foodImage}
          />
        </div>
        <div className={styles.textWrap}>
          <span className={styles.foodName}>{food.name}</span>
          <span className={styles.foodCategory}>{food.category}</span>
        </div>
      </div>
    </div>
  );
}

export default function FoodGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {foodItems.map((food, i) => (
            <FoodCard key={food.name} food={food} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
