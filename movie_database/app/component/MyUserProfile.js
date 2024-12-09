import { useEffect, useState } from "react";
import MyUserProfileModal from './MyUserProfileModal';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";

function MyUserProfile({ user, storage }) {
    const defaultProfilePicture = "user.png";
    const [profilePicture, setProfilePicture] = useState(defaultProfilePicture);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setProfilePicture(user.photoURL || defaultProfilePicture);
        }
    }, [user]);

    const handleProfileClick = () => {
        setIsModalOpen(true);
    };

    const handleProfilePictureChange = async (e) => {
        console.log("Utilisateur:", user);
        if (!user) {
            console.error("Utilisateur non authentifié");
            return;
        }
        else if (e.target.files.length > 0) {
            const file = e.target.files[0];
            setLoading(true);

            try {
                const profilePicRef = ref(storage, `profileImages/${user.uid}/${file.name}`);
                await uploadBytes(profilePicRef, file);
                const downloadURL = await getDownloadURL(profilePicRef);

                await updateProfile(user, { photoURL: downloadURL });
                setProfilePicture(downloadURL);
            } catch (error) {
                setError("Erreur lors de la mise à jour de la photo de profil");
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        else{
            alert("RAS");
            return;
        }
    };
    
    return (
        <div>
            <div className="MyUserProfile" onClick={handleProfileClick}>
                <img 
                    className="userPicture" 
                    src={profilePicture} 
                    alt="User profile picture" 
                    width={40} 
                    height={40} 
                />
            </div>

            <input
                type="file"
                id="profilePicInput"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleProfilePictureChange}
            />
            <button onClick={() => document.getElementById('profilePicInput').click()}>
                Changer la photo de profil
            </button>

            <MyUserProfileModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                imageUrl={profilePicture} 
            />

            {error && <div className="error-message">{error}</div>}
            {loading && <div className="loading">Chargement...</div>}
        </div>
    );
}

export default MyUserProfile;
