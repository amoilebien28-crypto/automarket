import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

let currentAuthMode = 'login';

// Gestion de l'affichage de l'en-tête selon l'état de connexion
onAuthStateChanged(auth, (user) => {
    const navContainer = document.getElementById('auth-nav-container');
    if (user) {
        navContainer.innerHTML = `
            <span class="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-2 rounded-xl">👤 ${user.email}</span>
            <button onclick="logoutUser()" class="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-xl shadow-md hover:bg-red-600 transition">Se déconnecter</button>
        `;
    } else {
        navContainer.innerHTML = `
            <button onclick="openAuthModal('login')" class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition">Se connecter</button>
            <button onclick="openAuthModal('register')" class="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition">S'inscrire</button>
        `;
    }
});

// Fonctions des Modals
window.openAuthModal = function(mode) {
    currentAuthMode = mode;
    const modal = document.getElementById('authModal');
    const title = document.getElementById('authModalTitle');
    title.textContent = mode === 'login' ? 'Connexion' : 'Inscription';
    modal.classList.remove('hidden');
};

window.closeAuthModal = function() {
    document.getElementById('authModal').classList.add('hidden');
};

window.openSellModal = function() {
    const user = auth.currentUser;
    if (!user) {
        alert("Veuillez vous connecter d'abord pour pouvoir vendre une voiture.");
        openAuthModal('login');
        return;
    }
    document.getElementById('sellModal').classList.remove('hidden');
};

window.closeSellModal = function() {
    document.getElementById('sellModal').classList.add('hidden');
};

window.scrollToSearch = function() {
    document.getElementById('search-section').scrollIntoView({ behavior: 'smooth' });
};

window.filterByBrand = function(brand) {
    document.getElementById('brandSelect').value = brand;
    scrollToSearch();
};

window.logoutUser = function() {
    signOut(auth).then(() => {
        alert("Vous êtes déconnecté avec succès.");
    }).catch((error) => {
        console.error("Erreur lors de la déconnexion", error);
    });
};

// Gestion de la soumission du formulaire d'authentification
document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;

    try {
        if (currentAuthMode === 'login') {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Connexion réussie ! Bienvenue.");
        } else {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Compte créé avec succès ! Vous êtes connecté.");
        }
        closeAuthModal();
    } catch (error) {
        alert("Erreur : " + error.message);
    }
});

// Gestion de l'ajout d'une voiture
document.getElementById('sellForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('carTitle').value;
    const year = document.getElementById('carYear').value;
    const mileage = document.getElementById('carMileage').value;
    const price = document.getElementById('carPrice').value;
    const image = document.getElementById('carImage').value;
    const description = document.getElementById('carDescription').value;

    try {
        await addDoc(collection(db, "cars"), {
            title, year, mileage, price, image, description,
            seller: auth.currentUser.email,
            createdAt: new Date()
        });
        alert("Annonce publiée avec succès !");
        closeSellModal();
        document.getElementById('sellForm').reset();
    } catch (error) {
        alert("Erreur lors de l'ajout de l'annonce : " + error.message);
    }
});
