"use client";
import init from './init';
import HeaderButtons from "./HeaderButtons";
import React, { useState, useEffect } from 'react';
import SignupModal from "./SignUpModal";
import LoginModal from "./LoginModal";
import { signOut } from "firebase/auth";
import MyUserProfile from './MyUserProfile';
import MyUserProfileModal from './MyUserProfileModal';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";




function Header() {

  const { auth, storage } = init();
  const [isInscriptionModalOpen, setIsInscriptionModalOpen] = useState(false);
  const [isConnexionModalOpen, setIsConnexionModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMyUserProfileModalOpen, setIsMyUserProfileModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleInscriptionButtonClick = () => {
    setIsInscriptionModalOpen(true);
  };

  const handleInscriptionCloseModal = () => {
    setIsInscriptionModalOpen(false);
  };

  const handleConnexionCloseModal = () => {
    setIsConnexionModalOpen(false);
  };

  const handleConnexionButtonClick = () => {
    setIsConnexionModalOpen(true);
  };

  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Logged out");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const handleProfilePictureChange = async (e) => {
    if (!user) {
        setError("Utilisateur non connecté.");
        return;
    }

    if (e.target.files.length > 0) {
        const file = e.target.files[0];
        setLoading(true);

        try {
            const profilePicRef = ref(storage, `profileImages/${user.uid}/${file.name}`);
            await uploadBytes(profilePicRef, file);
            const downloadURL = await getDownloadURL(profilePicRef);

            await updateProfile(user, { photoURL: downloadURL });
            setImageUrl(downloadURL);
        } catch (error) {
            setError(`Erreur lors de la mise à jour de la photo de profil : ${error.message}`);
            console.error("Erreur : ", error);
        } finally {
            setLoading(false);
        }
    }
};


  const handleProfilePictureClick = () => {
    setImageUrl(user.photoURL || "user.png");
    setIsMyUserProfileModalOpen(true);
  };

  const handleClick = () => {
    document.getElementById('profilePicInput').click();
  };

  return (
    <nav className="Header">


      
      <div className="headerButtons_Section">
      {user ? (
          <>
            <HeaderButtons nom="Se déconnecter" action={handleLogOut} />
            <MyUserProfile user={user} storage={storage} />
            <input
              type="file"
              id="profilePicInput"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleProfilePictureChange}
            />
            {error && <div className="error-message">{error}</div>}
            {loading && <div className="loading">Chargement...</div>}
          </>
        ) : (
          <>
            <HeaderButtons nom="S'inscrire" action={handleInscriptionButtonClick} />
            <HeaderButtons nom="Se connecter" action={handleConnexionButtonClick} />
          </>
        )}
      </div>

      <SignupModal isOpen={isInscriptionModalOpen} onClose={handleInscriptionCloseModal} />
      <LoginModal isOpen={isConnexionModalOpen} onClose={handleConnexionCloseModal} />
      <MyUserProfileModal 
        isOpen={isMyUserProfileModalOpen} 
        onClose={() => setIsMyUserProfileModalOpen(false)} 
        imageUrl={imageUrl} 
      />
      
    </nav>
    
  );
}

export default Header;
