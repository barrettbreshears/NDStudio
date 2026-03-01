import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
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
    </section>
  );
}
