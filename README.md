# Portfolio de Théo Luthin

Portfolio personnel présentant mon parcours, mes compétences, mes projets et mes coordonnées. Le site est un site statique réalisé en HTML, CSS et JavaScript, sans framework ni dépendance à installer.

## Pages

- **CV** (`index.html`) : profil, compétences, expériences et formation.
- **Projets** (`projets.html`) : projets présentés dans un carrousel et filtrables par technologie.
- **Contact** (`contact.html`) : formulaire ouvrant le client de messagerie par défaut, ainsi que mes coordonnées.

## Fonctionnalités

- Thèmes sombre (noir et jaune) et clair (noir et blanc), avec préférence enregistrée dans le navigateur.
- Interface disponible en français et en anglais ; les traductions des textes fixes sont définies directement dans le HTML.
- Carrousel de projets avec commandes de navigation et prise en charge du balayage tactile.
- Filtrage des projets par technologie.
- Compteurs de visites stockés dans le navigateur.
- Mise en page responsive pour mobile, tablette et ordinateur.

## Technologies

- HTML5
- CSS3
- JavaScript (ES6+)
- Python (serveur HTTP de déploiement sur Scalingo uniquement ; le site n’a pas de logique applicative Python)

## Projets présentés

- Jeu de rôle au tour par tour en Go.
- Puissance 4 réalisé avec Go, HTML et CSS.
- Jeu FPS en C#.
- Bibliothèque de films avec JavaScript, HTML, CSS, React et TypeScript.
- Application de gestion de frigo intelligent avec Python et FastAPI.

## Lancer le site en local

Aucune dépendance n’est nécessaire. Depuis la racine du dépôt, démarrez un serveur HTTP statique avec Python :

```bash
python -m http.server 8000
```

Puis ouvrez <http://localhost:8000>.

## Déploiement sur Scalingo

Le `Procfile` démarre le serveur HTTP standard de Python sur le port fourni par Scalingo. Le fichier `requirements.txt` permet au buildpack Python de détecter l’application ; aucune dépendance Python tierce n’est requise.

```text
web: python -m http.server $PORT --bind 0.0.0.0
```

lien de l'app déployée sur scalingo : [https://theo-luthin-objectif-pro-portfolio-app.osc-fr1.scalingo.io/](https://theo-luthin-objectif-pro-portfolio-app.osc-fr1.scalingo.io/)

## Structure du dépôt

| Fichier ou dossier | Rôle |
| --- | --- |
| `index.html` | Page du CV |
| `projets.html` | Page des projets et filtres |
| `contact.html` | Page de contact |
| `style.css` | Styles, thèmes et mise en page responsive |
| `script.js` | Changement de langue et de thème, compteurs, carrousel, filtres et formulaire de contact |
| `images/` | Photos, logos, captures de projets et drapeaux SVG |
| `Procfile` | Commande de démarrage web sur Scalingo |
| `requirements.txt` | Manifeste vide de dépendances tierces pour la détection Python sur Scalingo |
