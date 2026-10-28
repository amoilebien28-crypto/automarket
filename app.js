// --- CONFIGURATION FIREBASE (Projet brocantemarketpro) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAk9Dg4ns0QoWCl3QyoNwTxiQ9Xz5WFUAQ",
    authDomain: "brocantemarketpro.firebaseapp.com",
    projectId: "brocantemarketpro",
    storageBucket: "brocantemarketpro.firebasestorage.app",
    messagingSenderId: "343953099017",
    appId: "1:343953099017:web:3288ac33d670bfa27a6bd8",
    measurementId: "G-5LGDFGF9EE"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// --- GESTION DE L'AUTHENTIFICATION & MODALES ---
window.openAuthModal = function(mode) {
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.remove('hidden');
};

window.closeAuthModal = function() {
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.add('hidden');
};

window.openSellModal = function() {
    if (!auth.currentUser) {
        alert("Veuillez vous connecter pour publier une annonce.");
        openAuthModal();
        return;
    }
    const sellModal = document.getElementById('sellModal');
    if (sellModal) sellModal.classList.remove('hidden');
};

window.closeSellModal = function() {
    const sellModal = document.getElementById('sellModal');
    if (sellModal) sellModal.classList.add('hidden');
};

// Gestion Soumission Formulaire d'Authentification
const authForm = document.getElementById('authForm');
if (authForm) {
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('authEmail').value;
        const password = document.getElementById('authPassword').value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Connexion réussie !");
            closeAuthModal();
        } catch (error) {
            try {
                await createUserWithEmailAndPassword(auth, email, password);
                alert("Compte créé et connecté avec succès !");
                closeAuthModal();
            } catch (createError) {
                alert("Erreur : " + createError.message);
            }
        }
    });
}

// Observer l'état de l'utilisateur (Connecté / Déconnecté)
onAuthStateChanged(auth, (user) => {
    const navContainer = document.getElementById('auth-nav-container');
    if (!navContainer) return;

    if (user) {
        navContainer.innerHTML = `
            <span class="text-xs font-medium text-slate-600 hidden sm:inline">${user.email}</span>
            <button onclick="handleLogout()" class="bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-sm font-bold hover:bg-slate-300 transition">Déconnexion</button>
        `;
    } else {
        navContainer.innerHTML = `
            <button onclick="openAuthModal()" class="bg-slate-900 text-white px-3.5 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition">Connexion</button>
        `;
    }
});

window.handleLogout = async function() {
    await signOut(auth);
    alert("Déconnecté avec succès.");
};

// --- GESTION DES ANNONCES (FIRESTORE) & APPAREIL PHOTO OPTIMISÉ ---
const sellForm = document.getElementById('sellForm');
if (sellForm) {
    sellForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!auth.currentUser) {
            alert("Vous devez être connecté pour publier.");
            openAuthModal();
            return;
        }

        const title = document.getElementById('itemTitle').value;
        const category = document.getElementById('itemCategory').value;
        const condition = document.getElementById('itemCondition').value;
        const price = document.getElementById('itemPrice').value;
        const description = document.getElementById('itemDescription').value;
        const imageInput = document.getElementById('itemImageFile');

        if (!imageInput.files || imageInput.files.length === 0) {
            alert("Veuillez ajouter une photo de l'objet avec l'appareil photo.");
            return;
        }

        const imageFile = imageInput.files[0];

        // Indicateur visuel de chargement sur le bouton
        const submitBtn = sellForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.innerText : "Publier";
        if (submitBtn) {
            submitBtn.innerText = "Publication en cours...";
            submitBtn.disabled = true;
        }

        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = async function () {
            const base64Image = reader.result;

            try {
                await addDoc(collection(db, "items"), {
                    title,
                    category,
                    condition,
                    price: Number(price),
                    description,
                    image: base64Image,
                    userEmail: auth.currentUser.email,
                    createdAt: serverTimestamp()
                });

                alert("Annonce publiée avec succès !");
                sellForm.reset();
                closeSellModal();
                loadItems(); // Recharger la liste des annonces
            } catch (error) {
                alert("Erreur lors de la publication : " + error.message);
            } finally {
                if (submitBtn) {
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                }
            }
        };

        reader.onerror = function () {
            alert("Erreur lors de la lecture de la photo.");
            if (submitBtn) {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        };
    });
}

// Charger et afficher les annonces
async function loadItems(categoryFilter = "", searchKeyword = "") {
    const grid = document.getElementById('items-grid');
    if (!grid) return;

    grid.innerHTML = '<p class="text-slate-400 text-center py-8 col-span-full text-sm">Chargement des annonces...</p>';

    try {
        const querySnapshot = await getDocs(collection(db, "items"));
        grid.innerHTML = "";

        if (querySnapshot.empty) {
            grid.innerHTML = '<p class="text-slate-400 text-center py-8 col-span-full text-sm">Aucune annonce pour le moment.</p>';
            return;
        }

        querySnapshot.forEach((docSnap) => {
            const item = docSnap.data();

            if (categoryFilter && item.category !== categoryFilter) return;
            if (searchKeyword && !item.title.toLowerCase().includes(searchKeyword.toLowerCase())) return;

            const card = document.createElement('div');
            card.className = "bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col justify-between";
            card.innerHTML = `
                <div>
                    <img src="${item.image || 'https://via.placeholder.com/300'}" alt="${item.title}" class="w-full h-48 object-cover">
                    <div class="p-4">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="font-bold text-slate-900 text-base">${item.title}</h3>
                            <span class="bg-amber-50 text-amber-700 text-xs font-extrabold px-2.5 py-1 rounded-lg">${item.price} DT</span>
                        </div>
                        <p class="text-xs text-slate-500 mb-2">${item.category} • <span class="font-semibold">${item.condition}</span></p>
                        <p class="text-xs text-slate-600 line-clamp-2">${item.description || 'Aucune description.'}</p>
                    </div>
                </div>
                <div class="p-4 pt-0 text-xs text-slate-400 border-t border-slate-50 mt-2 flex justify-between items-center">
                    <span>Par : ${item.userEmail || 'Anonyme'}</span>
                </div>
            `;
            grid.appendChild(card);
        });

        if (grid.innerHTML === "") {
            grid.innerHTML = '<p class="text-slate-400 text-center py-8 col-span-full text-sm">Aucun résultat trouvé.</p>';
        }

    } catch (error) {
        console.error("Erreur de chargement:", error);
        grid.innerHTML = '<p class="text-red-400 text-center py-8 col-span-full text-sm">Erreur lors du chargement des annonces.</p>';
    }
}

window.performSearch = function() {
    const keyword = document.getElementById('searchInput').value;
    const category = document.getElementById('categorySelect').value;
    loadItems(category, keyword);
};

loadItems();
