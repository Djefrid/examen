importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging-compat.js')

//Configuration de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDsp-Ie3OKMslCq3VaZ2EsgSDk1IF_A1MM",
    authDomain: "movie-database-68ab5.firebaseapp.com",
    projectId: "movie-database-68ab5",
    storageBucket: "movie-database-68ab5.firebasestorage.app",
    messagingSenderId: "394434513924",
    appId: "1:394434513924:web:b3097e4cae43e14e663951"
};
const app = firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging(app);

//Configuration de la notification
messaging.onBackgroundMessage((payload) => {
    console.log("Notification reçue: ", payload)
    const titre = payload.data.message
    const options = {
        body: payload.data.message,
    }
    self.registration.showNotification(titre, options)
})
