// Éléments du DOM
const formTache = document.getElementById("form-tache");
const tacheInput = document.getElementById("tache");
const categorieInput = document.getElementById("categorie");
const listeTaches = document.getElementById("liste-taches");
const searchInput = document.getElementById("search");
const filterCategory = document.getElementById("filter-category");
const filterStatus = document.getElementById("filter-status");

// Charger les tâches depuis le localStorage
let taches = JSON.parse(localStorage.getItem("taches")) || [];

// Afficher les tâches au démarrage
afficherTaches();

// Ajouter une tâche
formTache.addEventListener("submit", (e) => {
    e.preventDefault();
    const texteTache = tacheInput.value.trim();
    const categorie = categorieInput.value;

    if (texteTache !== "") {
        const nouvelleTache = {
            id: Date.now(),
            texte: texteTache,
            categorie: categorie,
            complete: false
        };
        taches.push(nouvelleTache);
        sauvegarderTaches();
        afficherTaches();
        tacheInput.value = "";
    }
});

// Afficher les tâches
function afficherTaches() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = filterCategory.value;
    const selectedStatus = filterStatus.value;

    listeTaches.innerHTML = "";

    taches
        .filter(tache => (selectedCategory === "Toutes" || tache.categorie === selectedCategory) &&
                         (selectedStatus === "Toutes" || 
                          (selectedStatus === "Terminées" && tache.complete) || 
                          (selectedStatus === "Non terminées" && !tache.complete)) &&
                         tache.texte.toLowerCase().includes(searchTerm))
        .forEach(tache => {
            const li = document.createElement("li");
            li.textContent = tache.texte;
            li.dataset.id = tache.id;

            if (tache.complete) {
                li.classList.add("complete");
            }

            // Afficher la catégorie
            const categorie = document.createElement("div");
            categorie.classList.add("categorie");
            categorie.textContent = tache.categorie;
            li.appendChild(categorie);

            // Bouton pour marquer comme terminée
            const btnComplete = document.createElement("button");
            btnComplete.textContent = tache.complete ? "Annuler" : "Terminer";
            btnComplete.addEventListener("click", () => {
                tache.complete = !tache.complete;
                sauvegarderTaches();
                afficherTaches();
            });

            // Bouton pour supprimer
            const btnSupprimer = document.createElement("button");
            btnSupprimer.textContent = "Supprimer";
            btnSupprimer.addEventListener("click", () => {
                taches = taches.filter(t => t.id !== tache.id);
                sauvegarderTaches();
                afficherTaches();
            });

            // Bouton pour éditer
            const btnEditer = document.createElement("button");
            btnEditer.textContent = "✏️";
            btnEditer.addEventListener("click", () => {
                editerTache(tache);
            });

            // Ajouter les boutons à la tâche
            const actions = document.createElement("div");
            actions.classList.add("actions");
            actions.appendChild(btnComplete);
            actions.appendChild(btnEditer);
            actions.appendChild(btnSupprimer);
            li.appendChild(actions);

            // Ajouter la tâche à la liste
            listeTaches.appendChild(li);
        });
}

// Éditer une tâche
function editerTache(tache) {
    const nouveauTexte = prompt("Modifier la tâche :", tache.texte);
    if (nouveauTexte !== null && nouveauTexte.trim() !== "") {
        tache.texte = nouveauTexte.trim();
        sauvegarderTaches();
        afficherTaches();
    }
}

// Sauvegarder les tâches dans le localStorage
function sauvegarderTaches() {
    localStorage.setItem("taches", JSON.stringify(taches));
}

// Filtrer les tâches
searchInput.addEventListener("input", afficherTaches);
filterCategory.addEventListener("change", afficherTaches);
filterStatus.addEventListener("change", afficherTaches);
