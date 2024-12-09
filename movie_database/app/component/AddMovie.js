"use client";

import { useEffect, useState } from "react";
import init from "./init";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getStorage } from "firebase/storage";
import { useRouter } from "next/navigation";
import { getMessaging, getToken, sendMessage } from "firebase/messaging";

export default function AddMovie({ idAuteur }) {
    const { auth, db } = init();
    const [nom, setNom] = useState("");
    const [nomImage, setNomImage] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const router = useRouter();
    const storage = getStorage();
    const messaging = getMessaging();

    // Fonction pour envoyer une notification
    const sendNotificationToSubscribers = async (movieName) => {
        try {
            const response = await fetch("/api/send-message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    topic: "notification",
                    notification: {
                        title: "Nouveau Film Ajouté",
                        body: `Un nouveau film, "${movieName}", a été ajouté.`,
                    },
                }),
            });
    
            if (!response.ok) {
                const error = await response.json();
                console.error("Erreur lors de l'envoi de la notification :", error);
                return;
            }
    
            console.log("Notification envoyée avec succès !");
        } catch (error) {
            console.error("Erreur lors de l'appel à l'API de notification :", error);
        }
    };
    
    

    // Fonction pour ajouter un sujet dans Firestore
    const handleAddMovie = async (imageName) => {
        if (!idAuteur) {
            console.error("ID d'auteur manquant");
            return;
        }

        const newMovie = {
            idAuteur: idAuteur,
            nom,
            dateCreation: new Date().toISOString().slice(0, 10),
            nomImage: imageName,
            description: description,
        };

        // Mettre à jour le statut de chargement
        setLoading(true);

        try {
            // Ajouter le sujet dans Firestore
            const docRef = await addDoc(collection(db, "movies"), newMovie);
            console.log("movie créé avec succès. ID :", docRef.id);

            // Envoyer une notification après ajout
            await sendNotificationToSubscribers(nom);

            // Rediriger vers la page de gestion des sujets
            router.push(`/`);

            // Réinitialiser les champs après succès
            resetForm();
        } catch (error) {
            console.error("Erreur lors de l'ajout du Movie :", error);
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour uploader l'image
    const handleUploadImage = async (e) => {
        e.preventDefault();

        if (!file) {
            console.error("Aucun fichier sélectionné");
            return;
        }

        const fileRef = ref(storage, `imagesMovies/${file.name}`);

        setLoading(true);

        try {
            // Mettre à jour le statut de chargement
            await uploadBytes(fileRef, file);
            console.log("Fichier uploadé avec succès :", file.name);

            // Appeler la fonction pour ajouter le sujet
            await handleAddMovie(file.name);
        } catch (error) {
            console.error("Erreur lors de l'upload du fichier :", error);
        } finally {
            setLoading(false);
        }
    };

    // Réinitialiser le formulaire
    const resetForm = () => {

        setNom("");
        setNomImage("");
        setDescription("");
        setFile(null);
    };

    // Gestion de la sélection de fichier
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setNomImage(selectedFile.name);
        }
    };

    return (
        <div className="container-fluid">
            <form className="form-group" onSubmit={handleUploadImage}>
                
                <div className="row">
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Nom du Movie"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        required
                    />
                </div>
                <div className="row">
                    <input
                        type="file"
                        className="form-control mb-2"
                        onChange={handleFileChange}
                        required
                    />
                </div>
                <div className="row">
                    <textarea
                        placeholder="Contenu"
                        className="form-control mb-2"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="row">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? "Ajout en cours..." : "Ajouter"}
                    </button>
                </div>
            </form>
        </div>
    );
}
