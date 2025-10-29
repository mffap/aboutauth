import React, { useState } from 'react';
import styles from './styles.module.css';

export default function LoginCard() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showFingerprintModal, setShowFingerprintModal] = useState(false);
  const [webauthnStatus, setWebauthnStatus] = useState('idle');

  const submit = (e) => {
    e.preventDefault();
    // placeholder - replace with auth logic
    console.log('login', { username, password });
  };

  const handlePhoneSignIn = async (e) => {
    e.preventDefault();
    // Open the fingerprint modal; user must explicitly Continue to start device prompt
    setShowFingerprintModal(true);
    setWebauthnStatus('idle');
  };

  const startWebAuthn = async () => {
    setWebauthnStatus('starting');

    if (window.PublicKeyCredential && navigator.credentials) {
      try {
        // A real implementation must fetch proper publicKey options from the server.
        const options = {
          publicKey: {
            challenge: new Uint8Array([/* server challenge */]).buffer,
            timeout: 60000,
            userVerification: 'preferred',
            allowCredentials: [],
          },
        };

        setWebauthnStatus('prompting');
        const cred = await navigator.credentials.get(options);
        console.log('webauthn credential', cred);
        setWebauthnStatus('success');
      } catch (err) {
        console.warn('WebAuthn get failed:', err);
        setWebauthnStatus('failed');
      }
    } else {
      setWebauthnStatus('unsupported');
    }
  };

  const closeModal = () => {
    setShowFingerprintModal(false);
    setWebauthnStatus('idle');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card} role="region" aria-label="Login form">
        <h2 className={styles.header}>Welcome back</h2>

        <form className={styles.form} onSubmit={submit}>
          <label className={styles.label}>
            Username
            <input
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              name="username"
              type="text"
              autoComplete="username"
              required
            />
          </label>

          <label className={styles.label}>
            Password
            <input
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>

          <div className={styles.row}>
            <a className={styles.link} href="#" onClick={(e)=>e.preventDefault()}>Forgot password</a>
            <a className={styles.link} href="#" onClick={(e)=>e.preventDefault()}>Register</a>
          </div>

          <button className={styles.buttonPrimary} type="submit">Login</button>
        </form>

        <div className={styles.or}>Or sign in with</div>

        <div className={styles.socialRow}>
          <button className={styles.socialButton} aria-label="Sign in with Google" title="Sign in with Google">
            <svg className={styles.googleIcon} viewBox="0 0 48 48" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path fill="#EA4335" d="M24 12.5c3.9 0 7 1.6 9.1 3.9l6.8-6.8C35.6 6 30.1 3.5 24 3.5 14.7 3.5 6.9 8.9 3.1 16.8l7.9 6.1C12.5 17.1 17.7 12.5 24 12.5z"/>
              <path fill="#34A853" d="M46.5 24c0-1.6-.1-3.1-.4-4.5H24v8.6h12.7c-.5 2.9-2 5.3-4.3 6.9l6.8 5.3C44.6 36.9 46.5 30.8 46.5 24z"/>
              <path fill="#4A90E2" d="M10.9 28.9A14.9 14.9 0 0 1 9.5 24c0-1.7.3-3.3.8-4.8L1.9 13.1A24 24 0 0 0 0 24c0 3.9.9 7.6 2.6 10.9l8.3-6z"/>
              <path fill="#FBBC05" d="M24 46.5c6.1 0 11.6-2 15.6-5.4l-7.5-5.8c-2 1.3-4.4 2-7.9 2-6.3 0-11.5-4.6-13.3-10.8L3.1 31.2C6.9 39.1 14.7 44.5 24 44.5z"/>
            </svg>
          </button>

          <button className={styles.socialButton} aria-label="Sign in with GitHub" title="Sign in with GitHub">
            <svg className={styles.githubIcon} viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path fill="currentColor" d="M12 .5a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.6 1.2 1.6 1.2.9 1.6 2.4 1.2 3 .9.1-.7.4-1.2.7-1.5-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.6.1-3.4 0 0 1-.3 3.4 1.2a11.7 11.7 0 016.2 0c2.4-1.5 3.4-1.2 3.4-1.2.6 1.8.2 3.1.1 3.4.8.9 1.2 2 1.2 3.3 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.3v3.4c0 .3.2.7.8.6A12 12 0 0012 .5z"/>
            </svg>
          </button>

          <button
            className={`${styles.socialButton} ${styles.phoneButton}`}
            aria-label="Sign in with phone"
            title="Sign in with phone"
            onClick={handlePhoneSignIn}
            type="button"
          >
            <svg className={styles.phoneIcon} viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path fill="currentColor" d="M6.6 10.8c1.7 3.5 4.8 6.6 8.3 8.3l2-2a1 1 0 01.9-.3c1 .3 2 .5 3.1.5a1 1 0 011 1V21a1 1 0 01-1 1C10.3 22 2 13.7 2 3a1 1 0 011-1h3.5a1 1 0 011 1c0 1.1.2 2.1.5 3.1.1.4 0 .8-.3.9l-2 2z"/>
            </svg>
            <span className={styles.phoneBadge} aria-hidden></span>
          </button>
        </div>
        {/* Fingerprint / phone modal overlay */}
        {showFingerprintModal && (
          <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-label="Fingerprint unlock">
            <div className={styles.modal}>
              <h3 className={styles.modalTitle}>Use Self-Issued Identity Provider</h3>
              <p className={styles.modalText}>
                {webauthnStatus === 'idle' && 'Continue to open the system fingerprint dialog, or Cancel.'}
                {webauthnStatus === 'starting' && 'Preparing authentication...'}
                {webauthnStatus === 'prompting' && 'System fingerprint prompt should appear. Follow the device instructions.'}
                {webauthnStatus === 'success' && 'Authentication succeeded.'}
                {webauthnStatus === 'failed' && 'Authentication failed or was cancelled.'}
                {webauthnStatus === 'unsupported' && 'Fingerprint authentication is not available in this browser.'}
              </p>
              <div className={styles.modalActions}>
                <button className={styles.buttonSecondary} onClick={closeModal}>Cancel</button>
                <button
                  className={styles.buttonPrimary}
                  onClick={startWebAuthn}
                  disabled={webauthnStatus === 'prompting' || webauthnStatus === 'starting'}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}