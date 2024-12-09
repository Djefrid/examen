"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Header from "./component/Header";
import init from "./component/init";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getToken, onMessage } from 'firebase/messaging'

export default function PagePrincipale() {
  const { auth, db, messaging } = init();
  const [user, setUser] = useState(null);
  const [id, setId] = useState(null);
  const [movies, setMovies] = useState([]);

  // Récupérer l'utilisateur connecté
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setId(currentUser ? currentUser.uid : null);
    });
    return () => unsubscribe();
  }, [auth]);

  // Récupérer les films de l'utilisateur
  useEffect(() => {
    const fetchMovies = async () => {
      if (!id) return; // Vérification de l'id utilisateur

      try {
        const q = query(collection(db, "movies"), where("idAuteur", "==", id));
        const querySnapshot = await getDocs(q);

        const moviesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMovies(moviesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des films :", error);
      }
    };

    fetchMovies();
  }, [db, id]);

  // Inscription au topic et affichage des notifications
  async function setupInscriptionAbonenement() {
    try {
      /********************* Obtention de la permission de notification *************************/
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.error("L'utilisateur n'a pas donné la permission pour les notifications.");
        return;
      }

      /********************* Obtention du jeton Firebase *************************/
      const token = await getToken(messaging, {
        vapidKey: "BD8HdeTCFCkWc9V6EqWT6KTbhFKFRMfhTTw11BQIgmxeXUpfow08VcGLU0kQY0_HhTGF7WYOPcVlPc4PWaROgdw",
      });
      if (!token) {
        console.error("Impossible d'obtenir un jeton pour l'appareil.");
        return;
      }
      console.log("Jeton obtenu :", token);

      /********************* Inscription au topic *************************/
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          topic: "notification",
        }),
      });

      if (!response.ok) {
        console.error("Échec de l'inscription au topic :", await response.text());
        return;
      }

      console.log("Inscription réussie au topic 'notification'.");

      /********************* Réactions aux messages *************************/
      onMessage(messaging, (payload) => {
        console.log("Message reçu :", payload);
        alert(`Nouveau message: ${payload.notification.title} - ${payload.notification.body}`);
      });
    } catch (error) {
      console.error("Erreur lors de la configuration des notifications :", error);
    }
  }


  return (
    <>
      <nav
        className="navbar navbar-expand-lg bg-body-tertiary bg-dark"
        data-bs-theme="dark"
      >
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            The Movie Database
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href={`/CreationSujet/${id}`}>
                  ➕ Add Movie
                </a>
              </li>
            </ul>

            <form className="d-flex" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
            <Header />
          </div>
        </div>
      </nav>
      <div className="row">
        {movies.map((movie) => (
          <div className="card col-lg-4 col-12" key={movie.id}>
            <img
              src={movie.nomImage || "/placeholder.png"} // Image de secours en cas de données manquantes
              className="card-img-top"
              alt={movie.nom || "Movie"}
            />
            <div className="card-body">
              <h5 className="card-title">{movie.nom}</h5>
              <p className="card-text">{movie.description}</p>
              <a href="/" className="btn btn-primary">
                📖
              </a>{" "}
              <a href="/" className="btn btn-dark">
                🗑️
              </a>
            </div>
          </div>
        ))}
      </div>
      {user ? (
        <div>
          <p>Cliquez sur le bouton ci-dessous pour vous abonner et recevoir des notifications sur l'actualité des films :</p>
          <button onClick={setupInscriptionAbonenement}>S'inscrire</button>
        </div>
      ) : null}

    </>
  );
}
