import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDWCnu5-8DA5fvTQCwTs4m-6R70PypJuGw",
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
    if (!navContainer) return;
    if (user) {
        navContainer.innerHTML = `
            <span class="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-2 rounded-xl">👤 ${user.email}</span>
            <button onclick="logoutUser()" class="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-xl shadow-md hover:bg-red-600 transition">Se déconnecter</button>
        `;
    } else {
        navContainer.innerHTML = `
            <button onclick="openAuthModal('login')" class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-amber-600 transition">Se connecter</button>
            <button onclick="openAuthModal('register')" class="px-4 py-2 text-sm font-medium bg-amber-600 text-white rounded-xl shadow-md hover:bg-amber-700 transition">S'inscrire</button>
        `;
    }
});

// Fonctions des Modals
window.openAuthModal = function(mode) {
    currentAuthMode = mode;
    const modal = document.getElementById('authModal');
    const title = document.getElementById('authModalTitle');
    if (title) title.textContent = mode === 'login' ? 'Connexion' : 'Inscription';
    if (modal) modal.classList.remove('hidden');
};

window.closeAuthModal = function() {
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.add('hidden');
};

window.openSellModal = function() {
    const user = auth.currentUser;
    if (!user) {
        alert("Veuillez vous connecter d'abord pour pouvoir vendre un objet.");
        openAuthModal('login');
        return;
    }
    const sellModal = document.getElementById('sellModal');
    if (sellModal) sellModal.classList.remove('hidden');
};

window.closeSellModal = function() {
    const sellModal = document.getElementById('sellModal');
    if (sellModal) sellModal.classList.add('hidden');
};

window.scrollToSearch = function() {
    const searchSection = document.getElementById('search-section');
    if (searchSection) searchSection.scrollIntoView({ behavior: 'smooth' });
};

window.filterByCategory = function(category) {
    const categorySelect = document.getElementById('categorySelect');
    if (categorySelect) categorySelect.value = category;
    scrollToSearch();
    loadItems(category);
};

window.logoutUser = function() {
    signOut(auth).then(() => {
        alert("Vous êtes déconnecté avec succès.");
    }).catch((error) => {
        console.error("Erreur lors de la déconnexion", error);
    });
};

// Gestion de la soumission du formulaire d'authentification
const authForm = document.getElementById('authForm');
if (authForm) {
    authForm.addEventListener('submit', async (e) => {
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
}

// Gestion de l'ajout d'un objet (Brocante) avec sélection de photo locale
const sellForm = document.getElementById('sellForm');
if (sellForm) {
    sellForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('itemTitle').value;
        const category = document.getElementById('itemCategory').value;
        const condition = document.getElementById('itemCondition').value;
        const price = document.getElementById('itemPrice').value;
        const description = document.getElementById('itemDescription').value;
        
        // Récupération de l'élément fichier (si présent dans ton HTML)
        const fileInput = document.getElementById('itemImageFile');

        const processImageAndSubmit = async (imageUrl) => {
            try {
                await addDoc(collection(db, "items"), {
                    title, category, condition, price, 
                    image: imageUrl || 'https://via.placeholder.com/300', 
                    description,
                    seller: auth.currentUser.email,
                    createdAt: new Date()
                });
                alert("Annonce publiée avec succès !");
                closeSellModal();
                sellForm.reset();
                loadItems();
            } catch (error) {
                alert("Erreur lors de l'ajout de l'annonce : " + error.message);
            }
        };

        if (fileInput && fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(uploadEvent) {
                processImageAndSubmit(uploadEvent.target.result);
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            // Rétrocompatibilité si un champ texte "itemImage" existe encore
            const textImage = document.getElementById('itemImage');
            processImageAndSubmit(textImage ? textImage.value : '');
        }
    });
}

// Fonction pour charger et afficher les annonces depuis Firestore
async function loadItems(selectedCategory = "") {
    const grid = document.getElementById('items-grid');
    if (!grid) return;
    grid.innerHTML = '<p class="text-gray-500 col-span-3 text-center py-8">Chargement des annonces...</p>';

    try {
        let q = collection(db, "items");
        if (selectedCategory) {
            q = query(collection(db, "items"), where("category", "==", selectedCategory));
        }

        const querySnapshot = await getDocs(q);
        grid.innerHTML = "";

        if (querySnapshot.empty) {
            grid.innerHTML = '<p class="text-gray-500 col-span-3 text-center py-8">Aucune annonce trouvée dans cette catégorie.</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const item = doc.data();
            const card = document.createElement('div');
            card.className = "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col justify-between";
            card.innerHTML = `
                <div>
                    <div class="h-48 bg-gray-100 overflow-hidden flex items-center justify-center">
                        <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='<span class=\'text-gray-400\'>Image indisponible</span>'">
                    </div>
                    <div class="p-5">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="font-bold text-lg text-gray-900">${item.title}</h3>
                            <span class="bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-lg">${item.condition}</span>
                        </div>
                        <p class="text-gray-500 text-sm mb-4 line-clamp-2">${item.description || 'Aucune description fournie.'}</p>
                    </div>
                </div>
                <div class="p-5 pt-0 flex justify-between items-center">
                    <span class="text-xl font-extrabold text-amber-600">${item.price} DT</span>
                    <span class="text-xs text-gray-400">Par ${item.seller ? item.seller.split('@')[0] : 'Inconnu'}</span>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error("Erreur de chargement : ", error);
        grid.innerHTML = '<p class="text-red-500 col-span-3 text-center py-8">Erreur lors du chargement des annonces.</p>';
    }
}

window.performSearch = function() {
    const category = document.getElementById('categorySelect').value;
    loadItems(category);
};

// Charger les annonces au démarrage de la page
document.addEventListener('DOMContentLoaded', () => {
    loadItems();
});
