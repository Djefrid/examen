import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import init from './init'; // Votre fichier d'initialisation Firebase

function SignupModal({ isOpen, onClose }) {
  const { auth } = init(); // Assurez-vous que l'authentification est aussi initialisée
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function submitForm(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    // Vérifie si tous les champs sont remplis
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      setLoading(false);
      return;
    }

    try {
      // Crée l'utilisateur seulement si tous les champs sont remplis
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Ici, vous pouvez ajouter la logique pour gérer la photo de profil ultérieurement

      onClose(); // Fermer le modal après la création du compte
    } catch (error) {
      console.error("Erreur lors de l'inscription : ", error);
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('Oups, vous avez déjà un compte utilisateur avec cet e-mail.');
          break;
        case 'auth/invalid-email':
          setError('L\'email fourni est invalide.');
          break;
        case 'auth/weak-password':
          setError('Le mot de passe doit comporter au moins 6 caractères.');
          break;
        default:
          setError('Oups, quelque chose a mal tourné. Vérifiez vos informations et réessayez.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Inscription</h2>
        <form onSubmit={submitForm}>
          <div>
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="password-container">
            <label htmlFor="password">Mot de passe</label>
            <div className="password-input-container">
              <input type="password" id="password" name="password" required />
            </div>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Chargement...' : 'S\'inscrire'}
          </button>
          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </>
  );
}

export default SignupModal;
