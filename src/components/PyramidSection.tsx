"use client";

import { useEffect, useRef, useState, useCallback, type CSSProperties } from "react";
import styles from "./PyramidSection.module.css";

interface PyramidLayer {
  id: string;
  label: string;
  description: string;
}

const layers: PyramidLayer[] = [
  {
    id: "protein",
    label: "Protein & Healthy Fats",
    description:
      "Protein & Healthy Fats power strength, focus, and repair. For decades, they were pushed aside while cheap grains and sugar took center stage. The new Pyramid puts them back at the top where they belong.",
  },
  {
    id: "vegetables",
    label: "Vegetables & Fruit",
    description:
      "Protein & Healthy Fats power strength, focus, and repair. For decades, they were pushed aside while cheap grains and sugar took center stage. The new Pyramid puts them back at the top where they belong.",
  },
  {
    id: "grains",
    label: "Whole Grains",
    description:
      "Protein & Healthy Fats power strength, focus, and repair. For decades, they were pushed aside while cheap grains and sugar took center stage. The new Pyramid puts them back at the top where they belong.",
  },
];

const TOTAL_STATES = 3;

export default function PyramidSection() {
  const [activeState, setActiveState] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const sectionHeight = sectionRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;

    const scrolled = -rect.top + viewportHeight * 0.3;
    const scrollableHeight = sectionHeight - viewportHeight * 0.4;
    const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
    setScrollProgress(progress);

    const stateIndex = Math.min(
      TOTAL_STATES - 1,
      Math.floor(progress * TOTAL_STATES)
    );
    setActiveState(stateIndex);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const activeLayerId = layers[activeState].id;
  const pyramidFocusClass =
    activeState === 0
      ? styles.focusProtein
      : activeState === 1
      ? styles.focusVegetables
      : styles.focusGrains;
  const panelMorph = Math.min(1, scrollProgress / 0.08);
  const panelInset = 18 * (1 - panelMorph);
  const panelRadius = 120 * (1 - panelMorph);
  const stateAnchors = [0.07, 0.4, 0.73];

  const scrollToState = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;

    const clampedIndex = Math.max(0, Math.min(TOTAL_STATES - 1, index));
    const targetProgress = stateAnchors[clampedIndex] ?? 0;
    const viewportHeight = window.innerHeight;
    const sectionTop = window.scrollY + section.getBoundingClientRect().top;
    const scrollableHeight = section.offsetHeight - viewportHeight * 0.4;

    const targetY =
      sectionTop -
      viewportHeight * 0.3 +
      targetProgress * Math.max(scrollableHeight, 1);

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  };

  return (
    <>
      <section id="pyramid" ref={sectionRef} className={styles.section}>
        <div className={styles.stickyContainer}>
        <div
          className={styles.panelFrame}
          style={
            {
              "--panel-inset": `${panelInset}px`,
              "--panel-radius": `${panelRadius}px`,
            } as CSSProperties
          }
        >
          <div className={styles.panelSurface}>
            <div className={styles.inner}>
              <h2 className={styles.heading}>
                Three easy steps.
                <br />
                A world of change.
              </h2>

              {/* Main pyramid + overlay container */}
              <div className={styles.stage}>
                {/* The SVG pyramid fills this area */}
                <div className={`${styles.pyramidVisual} ${pyramidFocusClass}`}>
                  <svg
                    viewBox="0 0 400 360"
                    className={styles.pyramidSvg}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                <defs>
                  <clipPath id="tier1Clip">
                    <polygon points="10,0 390,0 325,115 75,115" />
                  </clipPath>
                  <clipPath id="tier2Clip">
                    <polygon points="75,120 325,120 270,230 130,230" />
                  </clipPath>
                  <clipPath id="tier3Clip">
                    <polygon points="130,235 270,235 200,355 200,355" />
                  </clipPath>
                </defs>

                {/* Tier 1: Protein & Healthy Fats */}
                <g
                  clipPath="url(#tier1Clip)"
                  style={{
                    opacity: activeLayerId === "protein" ? 1 : 0.3,
                    transition: "opacity 0.5s ease",
                  }}
                >
                  <image
                    href="/images/pryamid/protien.png"
                    x="0"
                    y="0"
                    width="400"
                    height="120"
                    preserveAspectRatio="xMidYMid slice"
                  />
                </g>

                {/* Tier 2: Vegetables & Fruit */}
                <g
                  clipPath="url(#tier2Clip)"
                  style={{
                    opacity: activeLayerId === "vegetables" ? 1 : 0.3,
                    transition: "opacity 0.5s ease",
                  }}
                >
                  <image
                    href="/images/pryamid/vegetables.png"
                    x="70"
                    y="118"
                    width="260"
                    height="115"
                    preserveAspectRatio="xMidYMid slice"
                  />
                </g>

                {/* Tier 3: Whole Grains */}
                <g
                  clipPath="url(#tier3Clip)"
                  style={{
                    opacity: activeLayerId === "grains" ? 1 : 0.3,
                    transition: "opacity 0.5s ease",
                  }}
                >
                  <image
                    href="/images/pryamid/whole-grains.png"
                    x="128"
                    y="233"
                    width="144"
                    height="125"
                    preserveAspectRatio="xMidYMid slice"
                  />
                </g>

                {/* Divider lines */}
                <line x1="75" y1="117" x2="325" y2="117" stroke="var(--color-green-dark)" strokeWidth="3" />
                <line x1="130" y1="232" x2="270" y2="232" stroke="var(--color-green-dark)" strokeWidth="3" />
                  </svg>

                </div>

                {/* Accordion overlaid on the LEFT side of the pyramid */}
                <div className={styles.accordion}>
                  {layers.map((layer, index) => (
                    <div
                      key={layer.id}
                      className={`${styles.accordionItem} ${
                        activeLayerId === layer.id ? styles.active : ""
                      }`}
                    >
                      <button
                        type="button"
                        className={styles.accordionHeader}
                        onClick={() => scrollToState(index)}
                        aria-expanded={activeLayerId === layer.id}
                        aria-controls={`accordion-panel-${layer.id}`}
                      >
                        <span className={styles.accordionLabel}>{layer.label}</span>
                        <img
                          src="/images/expand-icon.svg"
                          alt=""
                          aria-hidden="true"
                          className={`${styles.chevron} ${
                            activeLayerId === layer.id ? styles.chevronOpen : ""
                          }`}
                        />
                      </button>
                      <div
                        id={`accordion-panel-${layer.id}`}
                        className={styles.accordionContent}
                        style={{
                          maxHeight: activeLayerId === layer.id ? "200px" : "0",
                        }}
                      >
                        <p className={styles.accordionText}>{layer.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
        </div>
      </section>

      <section className={styles.normalOutro}>
        <div className={styles.normalOutroInner}>
          <div className={styles.productCard}>
            <img
              src="/images/bottom-cards.png"
              alt="United States Dietary Guidelines card"
              className={styles.productCardImage}
            />
          </div>

          <a
            href="https://cdn.realfood.gov/DGA.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whiteCta}
          >
            <span>Download the guidelines</span>
            <svg
              width="33"
              height="33"
              viewBox="0 0 33 33"
              fill="none"
              className={styles.whiteCtaIcon}
            >
              <circle opacity="0.2" cx="16.5" cy="16.5" r="16.5" fill="#1C3A16" />
              <path
                d="M15.91 20.21L19.71 16.41L15.92 12.61H17.47L21.26 16.41L17.47 20.2L15.91 20.21ZM12.87 16.98V15.85H20.52V16.98H12.87Z"
                fill="#1C3A16"
              />
            </svg>
          </a>
        </div>
      </section>
    </>
  );
}
