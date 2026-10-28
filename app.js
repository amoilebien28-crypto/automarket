<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Brocante Market - Achat et Vente entre particuliers</title>
    <!-- Tailwind CSS pour un design moderne et responsive -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Ton fichier de style personnel si tu en as un -->
    <link rel="stylesheet" href="style.css">
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen flex flex-col justify-between">

    <!-- En-tête (Header) -->
    <header class="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-xs">
        <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            
            <!-- Logo et Nom -->
            <div class="flex items-center space-x-2">
                <span class="text-2xl">🏺</span>
                <span class="font-black text-slate-900 text-lg tracking-tight">Brocante<span class="text-amber-600">Market</span></span>
            </div>

            <!-- Actions principales : Vendre en vedette + Compte -->
            <div class="flex items-center space-x-2">
                <!-- Bouton Vendre ultra visible en premier -->
                <button onclick="openSellModal()" class="bg-gradient-to-r from-amber-600 to-amber-500 text-white px-4 py-2.5 rounded-2xl font-bold text-sm shadow-md shadow-amber-500/20 hover:from-amber-700 hover:to-amber-600 active:scale-95 transition flex items-center space-x-1.5">
                    <span class="text-lg leading-none">+</span>
                    <span>Vendre</span>
                </button>

                <!-- Conteneur Connexion / Déconnexion géré dynamiquement par JavaScript -->
                <div id="auth-nav-container" class="flex items-center">
                    <!-- Injecté par app.js -->
                </div>
            </div>

        </div>
    </header>

    <!-- Contenu Principal -->
    <main class="max-w-4xl w-full mx-auto px-4 py-6 flex-grow">
        
        <!-- Barre de Recherche et Filtres -->
        <div class="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-6 space-y-3">
            <input type="text" id="searchInput" placeholder="Rechercher un objet..." class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition">
            
            <div class="flex gap-2">
                <select id="categorySelect" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition">
                    <option value="">Toutes les catégories</option>
                    <option value="Meubles">Meubles</option>
                    <option value="Décoration">Décoration</option>
                    <option value="Électronique">Électronique</option>
                    <option value="Vêtements">Vêtements</option>
                    <option value="Autre">Autre</option>
                </select>
                <button onclick="performSearch()" class="bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-slate-800 transition">Filtrer</button>
            </div>
        </div>

        <!-- Liste des Annonces -->
        <section>
            <h2 class="text-lg font-black text-slate-900 mb-4">Annonces récentes</h2>
            <div id="items-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Les annonces seront injectées dynamiquement ici par app.js -->
            </div>
        </section>

    </main>

    <!-- MODALE DE PUBLICATION (Vendre) -->
    <div id="sellModal" class="hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 class="font-bold text-slate-900">Publier une annonce</h3>
                <button onclick="closeSellModal()" class="text-slate-400 hover:text-slate-700 text-xl font-bold px-2">&times;</button>
            </div>
            
            <form id="sellForm" class="p-5 overflow-y-auto space-y-4">
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Titre de l'objet</label>
                    <input type="text" id="itemTitle" required placeholder="Ex: Table ancienne en bois" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500">
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1">Catégorie</label>
                        <select id="itemCategory" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500">
                            <option value="Meubles">Meubles</option>
                            <option value="Décoration">Décoration</option>
                            <option value="Électronique">Électronique</option>
                            <option value="Vêtements">Vêtements</option>
                            <option value="Autre">Autre</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1">État</label>
                        <select id="itemCondition" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500">
                            <option value="Neuf">Neuf</option>
                            <option value="Très bon état">Très bon état</option>
                            <option value="Bon état">Bon état</option>
                            <option value="À restaurer">À restaurer</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Prix (DT)</label>
                    <input type="number" id="itemPrice" required placeholder="Ex: 150" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500">
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Description</label>
                    <textarea id="itemDescription" rows="3" placeholder="Décrivez votre objet..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500"></textarea>
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Photo (Appareil photo ou Galerie)</label>
                    <input type="file" id="itemImageFile" accept="image/*" capture="environment" required class="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100">
                </div>

                <button type="submit" class="w-full bg-amber-600 text-white font-bold py-3 rounded-xl hover:bg-amber-700 transition shadow-md shadow-amber-600/20">Publier l'annonce</button>
            </form>
        </div>
    </div>

    <!-- MODALE D'AUTHENTIFICATION (Connexion / Inscription) -->
    <div id="authModal" class="hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-sm rounded-3xl shadow-xl overflow-hidden">
            <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 class="font-bold text-slate-900">Connexion / Inscription</h3>
                <button onclick="closeAuthModal()" class="text-slate-400 hover:text-slate-700 text-xl font-bold px-2">&times;</button>
            </div>
            
            <form id="authForm" class="p-5 space-y-4">
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Adresse e-mail</label>
                    <input type="email" id="authEmail" required placeholder="nom@exemple.com" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500">
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Mot de passe</label>
                    <input type="password" id="authPassword" required placeholder="••••••••" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500">
                </div>

                <button type="submit" class="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition">Se connecter / S'inscrire</button>
            </form>
        </div>
    </div>

    <!-- Lien vers ton fichier JavaScript séparé -->
    <script type="module" src="app.js"></script>
</body>
</html>
