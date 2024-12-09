import React from 'react';
import Modal from 'react-modal';

const MyUserProfileModal = ({ isOpen, onClose, imageUrl }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="User Profile Picture"
            className="modal-content"
            overlayClassName="modal-overlay"
        >
            <h2 className="titreProfil">Mon profil</h2>
            <img src={imageUrl} alt="Large User Profile" style={{ width: '100%', height: 'auto' }} />
            <button className='boutonProfil' onClick={onClose}>Fermer</button>
        </Modal>
    );
};

export default MyUserProfileModal;
