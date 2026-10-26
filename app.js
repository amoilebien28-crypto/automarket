import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDWCnu5-8DA5fvTQCwIs4m-6R70PypJuGw",
  authDomain: "automarket-app-852e4.firebaseapp.com",
  projectId: "automarket-app-852e4",
  storageBucket: "automarket-app-852e4.firebasestorage.app",
  messagingSenderId: "682094581154",
  appId: "1:682094581154:web:361952f7d1ea69fcdc0efb",
  measurementId: "G-PTBME91XGB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Gestion de la modale d'authentification
window.openAuthModal = function(mode) {
    const modal = document.getElementById('authModal');
    const title = document.getElementById('authModalTitle');
    title.textContent = mode === 'login' ? 'Connexion' : 'Inscription';
    modal.classList.remove('hidden');
};

window.closeAuthModal = function() {
    document.getElementById('authModal').classList.add('hidden');
};

// Gestion de la modale de vente
window.openSellModal = function() {
    document.getElementById('sellModal').classList.remove('hidden');
};

window.closeSellModal = function() {
    document.getElementById('sellModal').classList.add('hidden');
};

window.filterByBrand = function(brand) {
    alert(`Filtrer les annonces pour la marque : ${brand}`);
};
