// Fonctions d'interaction de l'application AutoMarket

function openAuthModal(mode) {
    const action = mode === 'login' ? 'Connexion' : 'Inscription';
    alert(`Ouverture de la fenêtre de ${action} par numéro de téléphone.`);
    // Ici, on ajoutera plus tard la logique Firebase Auth
}

function openSellModal() {
    alert("Ouverture du formulaire d'ajout de voiture (Photos, Kilométrage, Année, Prix, Description).");
    // Ici, on ajoutera le formulaire de publication lié à Firestore
}

function filterByBrand(brand) {
    alert(`Filtrer les annonces pour la marque : ${brand}`);
    // Ici, on filtrera les voitures affichées dans la grille
}
