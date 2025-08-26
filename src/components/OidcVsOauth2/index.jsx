import React from "react";
import styles from './styles.module.css';

export default function OidcVsOauth2() {
  return (
    <div className={styles.cardContainer}>
        <div className={styles.card}>
            <span class={styles.icon}>🔐</span>
            <h3>Authentication</h3>
            <p>(OIDC's Job)</p>
            <p>Answers the question: <strong>"Who are you?"</strong> It verifies a user's identity and provides proof via an ID Token.</p>
        </div>
        <div className={styles.card}>
            <span className={styles.icon}>🔑</span>
            <h3>Authorization </h3>
            <p>(OAuth 2.0's Job)</p>
            <p>Answers the question: <strong>"What are you allowed to do?"</strong> It grants permission to access specific resources via an Access Token.</p>
        </div>
    </div>
  );
}