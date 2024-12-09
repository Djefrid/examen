"use client";
import React, { useState } from 'react';
import init from './init'
import { signInWithEmailAndPassword } from "firebase/auth"
function LoginModal({ isOpen, onClose }) {
  const { auth } = init();
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function submitForm(e) {
    e.preventDefault();
    setLoading(true); 
    setError('');

    const email = e.target.email.value;
    const password = e.target.password.value;

    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      onClose();
    })
    .catch((error) => {
      setError('Oups,vos informations ne sont pas correct,veuillez les vérifier');
    })
    .finally(() => {
      setLoading(false);
    });

  }

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Connexion</h2>
        <form onSubmit={submitForm}>
          <div>
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="password-container">
            <label htmlFor="password">Mot de passe</label>
            <div className="password-input-container">
              <input
                type="password"
                id="password"
                name="password"
                required
              />
            </div>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Un instant...' : 'Se connecter'}
          </button>
          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </>
  );
}

export default LoginModal;
