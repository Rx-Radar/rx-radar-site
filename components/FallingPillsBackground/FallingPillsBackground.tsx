import React from 'react';
import styles from './FallingPillsBackground.module.css';

export default function FallingPillsBackground() {
  return (
    <div className={styles.snowflakes}>
      {[...Array(10)].map((_, i) => (
        <div key={i} className={styles.snowflake}>
          💊
        </div>
      ))}
    </div>
  );
}