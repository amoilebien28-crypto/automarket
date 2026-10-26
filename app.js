// Importation des SDK Firebase depuis les CDN officiels
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Ta configuration Firebase récupérée de ton écran
const firebaseConfig = {
  apiKey: "AIzaSyDWCnu5-8DA5fvTQCwIs4m-6R70PypJuGw",
  authDomain: "automarket-app-852e4.firebaseapp.com",
  projectId: "automarket-app-852e4",
  storageBucket: "automarket-app-852e4.firebasestorage.app",
  messagingSenderId: "682094581154",
  appId: "1:682094581154:web:361952f7d1ea69fcdc0efb",
  measurementId: "G-PTBME91XGB"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log("Firebase est connecté avec succès ! 🚀");

// Fonctions d'interaction de l'interface
window.openAuthModal = function(mode) {
    const action = mode === 'login' ? 'Connexion' : 'Inscription';
    alert(`Ouverture de la fenêtre de ${action}.`);
};

window.openSellModal = function() {
    alert("Ouverture du formulaire d'ajout de voiture.");
};

window.filterByBrand = function(brand) {
    alert(`Filtrer les annonces pour la marque : ${brand}`);
};
