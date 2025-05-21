# 🎬 Filmder - Interactieve Filmzoeker Webapplicatie (Project Web Advanced)

Filmder is een dynamische single-page webapplicatie (SPA) ontworpen om gebruikers te helpen bij het ontdekken, zoeken, filteren en beheren van hun favoriete films. Deze applicatie haalt real-time filmdata op via de **TMDB (The Movie Database) API** en biedt een rijke, interactieve gebruikerservaring.

## 🌐 Live Demo

Bekijk de live demo van Filmder hier:
👉 [Live Project Link](https://jouw-live-project-url.hier) *(Vervang met je daadwerkelijke deployment link, bv. Vercel, Netlify)*

---

## 🌟 Functionaliteiten

De Filmder applicatie biedt de volgende kernfunctionaliteiten:

* **Uitgebreide Filmcatalogus:**
    * Ontdek populaire films, de nieuwste releases, en films per genre direct op de startpagina.
    * Haalt en toont een breed scala aan filmdata van de TMDB API.
* **Geavanceerd Zoeken & Filteren:**
    * Zoek films op titel, trefwoorden, acteurs, etc.
    * Filter filmresultaten op basis van genre.
    * Sorteer resultaten op populariteit, releasedatum, beoordeling (hoog/laag), en titel (A-Z/Z-A).
* **Gedetailleerde Filminformatie:**
    * Bekijk uitgebreide details per film in een modal, inclusief poster, releasedatum, beoordeling, populariteitsscore, originele taal, genres en een volledige synopsis.
* **Personalisatie:**
    * **Favorieten:** Markeer films als favoriet en beheer je persoonlijke favorietenlijst. Favorieten worden opgeslagen in `localStorage` en blijven bewaard tussen sessies.
    * **Gebruikersnaam:** Sla je naam op voor een gepersonaliseerde begroeting.
    * **Thema Keuze:** Wissel tussen een licht en donker thema voor de applicatie. Thema voorkeur wordt ook opgeslagen.
* **Gebruikerservaring (UX):**
    * **Single Page Application (SPA):** Naadloze navigatie tussen secties (Home, Zoeken, Favorieten) zonder volledige paginaherlaadingen, gebruikmakend van hash-based routing.
    * **Responsive Design:** Volledig functioneel en visueel aantrekkelijk op desktops, tablets en mobiele apparaten.
    * **Lazy Loading:** Afbeeldingen (filmposters) worden "lui" geladen voor betere initiële laadprestaties.
    * **Infinite Scroll:** Laad meer filmresultaten automatisch bij het scrollen op de zoekpagina.
    * **Visuele Feedback:** Duidelijke laadindicatoren, skeleton screens (conceptueel) en toast notificaties voor gebruikersacties en API status.
    * **Toegankelijkheid (A11y):** Gebruik van ARIA-attributen en semantische HTML voor verbeterde toegankelijkheid.

---

## 🖼️ Screenshots

*(Voeg hier screenshots toe van je applicatie. Voorbeelden:)*
* *Afbeelding 1: Startpagina met filmcarrousels.*
* *Afbeelding 2: Zoekpagina met resultaten en filters.*
* *Afbeelding 3: Detailpagina van een film (modal).*
* *Afbeelding 4: Favorietenpagina.*
* *Afbeelding 5: Applicatie in donker thema.*
* *Afbeelding 6: Mobiele weergave.*

---

## 🛠️ Gebruikte Technologieën & API

### Kerntechnologieën:
* **HTML5:** Semantische structuur en content.
* **CSS3:** Styling, theming, responsive design (Flexbox, Grid, Custom Properties).
* **JavaScript (ES6+):** Applicatielogica, DOM-manipulatie, API-interactie, en moderne features.

### Tools & Libraries:
* **Vite:** Snelle frontend build tool en development server.

### Externe API:
* **TMDB (The Movie Database) API:**
    * Website: [The Movie Database API](https://www.themoviedb.org/documentation/api)
    * Developer Docs: [TMDB Developer Docs](https://developer.themoviedb.org/docs)
    * Gebruikte Endpoints (voorbeelden):
        * `/movie/popular` (voor populaire films)
        * `/discover/movie` (voor nieuwste releases, films per genre, sorteren)
        * `/search/movie` (voor zoekfunctionaliteit)
        * `/genre/movie/list` (voor het ophalen van alle genres)
        * `/movie/{movie_id}` (voor gedetailleerde filminformatie)

### Browser Features:
* **Fetch API:** Voor het maken van HTTP-verzoeken naar de TMDB API.
* **LocalStorage API:** Voor het persistent opslaan van gebruikersfavorieten, naam en themavoorkeur.
* **Intersection Observer API:** Voor lazy loading van afbeeldingen en het triggeren van infinite scroll.
* **Template Element:** Voor het efficiënt creëren van herbruikbare HTML-structuren (filmkaarten).

---

## ✅ Technische Vereisten & Implementatie

| Concept                       | Bestand(en)         | Voorbeeld Regel(s) / Locatie (main.js tenzij anders vermeld)                      | Korte Beschrijving Implementatie                                                                 |
| :---------------------------- | :------------------ | :------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------- |
| **Structuur & Setup** |                     |                                                                                 |                                                                                                  |
| Project met Vite              | `package.json`, `vite.config.js` | Project setup                                                                 | Applicatie gebouwd en geserveerd met Vite.                                                       |
| Folderstructuur               | Gehele project      | `src/css`, `src/js`, `src/assets`                                               | Logische scheiding van bestanden voor HTML, CSS, JavaScript en assets.                           |
| **HTML** |                     |                                                                                 |                                                                                                  |
| Semantische HTML5             | `index.html`        | `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<button>`, `<template>` | Gebruik van semantische elementen voor structuur en betekenis.                                   |
| **CSS** |                     |                                                                                 |                                                                                                  |
| CSS Custom Properties         | `style.css`         | `:root { --primary: ...; }`, `var(--primary)`                                   | Uitgebreid gebruik voor theming (licht/donker) en consistente styling.                           |
| Responsive Design             | `style.css`         | `@media (max-width: ...)`                                                       | Flexbox, Grid en media queries voor aanpasbare layout op verschillende schermformaten.             |
| **JavaScript Algemeen** |                     |                                                                                 |                                                                                                  |
| DOM Selectie                  | `main.js`           | Lijnen ~5-70 (DOM Elements sectie)                                              | Selectie van HTML-elementen via `getElementById`, `querySelector`.                             |
| DOM Manipulatie               | `main.js`           | `displayMovies()`, `showMovieDetailModal()`, `applyTheme()`                       | Dynamisch content en attributen van elementen aanpassen, elementen toevoegen/verwijderen.        |
| Event Listeners               | `main.js`           | Lijnen ~700+ (Event Listeners sectie)                                           | Koppelen van functies aan gebruikersinteracties (klik, change, scroll, submit).                  |
| **Modern JavaScript (ES6+)** |                     |                                                                                 |                                                                                                  |
| `const` / `let`               | `main.js`           | Overal                                                                          | Gebruik van block-scoped variabelen.                                                             |
| Arrow Functions               | `main.js`           | Overal, e.g., `() => {...}` in event listeners                                  | Compacte syntax voor functies.                                                                   |
| Template Literals             | `main.js`           | `WorkspaceFromTMDB()`: `\`${BASE_URL}${endpoint}\``, `displayMovies()`                 | Makkelijk samenstellen van strings met variabelen.                                                 |
| Array Methods                 | `main.js`           | `favoriteMovies.some()`, `allGenres.forEach()`, `data.results.slice()`          | `forEach`, `map`, `filter`, `find`, `some`, `findIndex`, `slice` voor dataverwerking.           |
| Destructuring (optioneel)     | `main.js`           | (Kan gebruikt worden bij object/array uitlezing)                                | Uitpakken van waarden uit arrays of properties van objecten in variabelen.                      |
| Spread/Rest operator (optioneel) | `main.js`        | (Kan gebruikt worden voor array/object manipulatie)                             | Flexibel werken met lijsten van argumenten of elementen.                                         |
| Modules (impliciet via Vite)  | `index.html`, `main.js` | `<script type="module" src="./src/js/main.js"></script>`                       | JavaScript is opgezet als een module, wat Vite standaard doet.                                   |
| **Asynchroon JavaScript** |                     |                                                                                 |                                                                                                  |
| Promises                      | `main.js`           | `Workspace()` retourneert een Promise                                               | Basis van asynchrone operaties.                                                                  |
| `async` / `await`             | `main.js`           | `WorkspaceFromTMDB()`, `WorkspaceMovies()`, `showMovieDetailModal()`                      | Syntactische suiker over Promises voor schonere asynchrone code.                                 |
| **API & Data** |                     |                                                                                 |                                                                                                  |
| Fetch API                     | `main.js`           | `WorkspaceFromTMDB()`                                                               | Ophalen van data van de TMDB API.                                                                |
| JSON Manipulatie              | `main.js`           | `response.json()`, verwerking van API data                                      | Converteren van JSON responses naar JavaScript objecten en dataverwerking.                       |
| **Browser Features** |                     |                                                                                 |                                                                                                  |
| LocalStorage                  | `main.js`           | `localStorage.setItem()`, `localStorage.getItem()` in `toggleFavorite()`, `applyTheme()`, `loadUserName()` | Opslaan en ophalen van favorieten, themavoorkeur en gebruikersnaam.                          |
| Formulier Validatie           | `main.js`, `index.html` | `handleNameFormSubmit()`, `performSearch()`, `required` attribuut               | Client-side validatie van input (naam, zoekterm lengte, thema selectie).                        |
| Intersection Observer API     | `main.js`           | `setupIntersectionObserver()`, `handleIntersection()` (impliciet)               | Lazy loading van afbeeldingen (via `loading="lazy"`) & infinite scroll (`loadMoreTrigger`).    |
| Hash-based Routing            | `main.js`           | `handleHashChange()`, `window.addEventListener('hashchange', ...)`              | Navigatie binnen de SPA via URL hashes (bv. `#search`, `#favorites`).                            |
| **Gebruikerservaring** |                     |                                                                                 |                                                                                                  |
| Toast Notificaties            | `main.js`           | `showToast()`                                                                   | Feedback aan gebruiker over acties.                                                              |
| Laadindicator                 | `main.js`           | `showLoading()`, `hideLoading()`                                                | Visuele indicatie tijdens data ophalen.                                                          |
| Toegankelijkheid (ARIA)       | `index.html`        | `aria-label`, `aria-live`, `aria-modal`, `aria-hidden`                          | Verbeteren van toegankelijkheid voor screenreaders en andere hulptechnologieën.                    |

---

## 📁 Projectstructuur
Partenaire de code

Afficher le raisonnement
Oké, laten we die README.md perfectioneren!

Op basis van je code en de vereisten, hier is een voorgestelde, uitgebreide README.md. Ik heb geprobeerd de beste elementen van je twee versies te combineren en aan te vullen waar nodig.

Markdown

# 🎬 Filmder - Interactieve Filmzoeker Webapplicatie (Project Web Advanced)

Filmder is een dynamische single-page webapplicatie (SPA) ontworpen om gebruikers te helpen bij het ontdekken, zoeken, filteren en beheren van hun favoriete films. Deze applicatie haalt real-time filmdata op via de **TMDB (The Movie Database) API** en biedt een rijke, interactieve gebruikerservaring.

## 🌐 Live Demo

Bekijk de live demo van Filmder hier:
👉 [Live Project Link](https://jouw-live-project-url.hier) *(Vervang met je daadwerkelijke deployment link, bv. Vercel, Netlify)*

---

## 🌟 Functionaliteiten

De Filmder applicatie biedt de volgende kernfunctionaliteiten:

* **Uitgebreide Filmcatalogus:**
    * Ontdek populaire films, de nieuwste releases, en films per genre direct op de startpagina.
    * Haalt en toont een breed scala aan filmdata van de TMDB API.
* **Geavanceerd Zoeken & Filteren:**
    * Zoek films op titel, trefwoorden, acteurs, etc.
    * Filter filmresultaten op basis van genre.
    * Sorteer resultaten op populariteit, releasedatum, beoordeling (hoog/laag), en titel (A-Z/Z-A).
* **Gedetailleerde Filminformatie:**
    * Bekijk uitgebreide details per film in een modal, inclusief poster, releasedatum, beoordeling, populariteitsscore, originele taal, genres en een volledige synopsis.
* **Personalisatie:**
    * **Favorieten:** Markeer films als favoriet en beheer je persoonlijke favorietenlijst. Favorieten worden opgeslagen in `localStorage` en blijven bewaard tussen sessies.
    * **Gebruikersnaam:** Sla je naam op voor een gepersonaliseerde begroeting.
    * **Thema Keuze:** Wissel tussen een licht en donker thema voor de applicatie. Thema voorkeur wordt ook opgeslagen.
* **Gebruikerservaring (UX):**
    * **Single Page Application (SPA):** Naadloze navigatie tussen secties (Home, Zoeken, Favorieten) zonder volledige paginaherlaadingen, gebruikmakend van hash-based routing.
    * **Responsive Design:** Volledig functioneel en visueel aantrekkelijk op desktops, tablets en mobiele apparaten.
    * **Lazy Loading:** Afbeeldingen (filmposters) worden "lui" geladen voor betere initiële laadprestaties.
    * **Infinite Scroll:** Laad meer filmresultaten automatisch bij het scrollen op de zoekpagina.
    * **Visuele Feedback:** Duidelijke laadindicatoren, skeleton screens (conceptueel) en toast notificaties voor gebruikersacties en API status.
    * **Toegankelijkheid (A11y):** Gebruik van ARIA-attributen en semantische HTML voor verbeterde toegankelijkheid.

---

## 🖼️ Screenshots

*(Voeg hier screenshots toe van je applicatie. Voorbeelden:)*
* *Afbeelding 1: Startpagina met filmcarrousels.*
* *Afbeelding 2: Zoekpagina met resultaten en filters.*
* *Afbeelding 3: Detailpagina van een film (modal).*
* *Afbeelding 4: Favorietenpagina.*
* *Afbeelding 5: Applicatie in donker thema.*
* *Afbeelding 6: Mobiele weergave.*

---

## 🛠️ Gebruikte Technologieën & API

### Kerntechnologieën:
* **HTML5:** Semantische structuur en content.
* **CSS3:** Styling, theming, responsive design (Flexbox, Grid, Custom Properties).
* **JavaScript (ES6+):** Applicatielogica, DOM-manipulatie, API-interactie, en moderne features.

### Tools & Libraries:
* **Vite:** Snelle frontend build tool en development server.

### Externe API:
* **TMDB (The Movie Database) API:**
    * Website: [The Movie Database API](https://www.themoviedb.org/documentation/api)
    * Developer Docs: [TMDB Developer Docs](https://developer.themoviedb.org/docs)
    * Gebruikte Endpoints (voorbeelden):
        * `/movie/popular` (voor populaire films)
        * `/discover/movie` (voor nieuwste releases, films per genre, sorteren)
        * `/search/movie` (voor zoekfunctionaliteit)
        * `/genre/movie/list` (voor het ophalen van alle genres)
        * `/movie/{movie_id}` (voor gedetailleerde filminformatie)

### Browser Features:
* **Fetch API:** Voor het maken van HTTP-verzoeken naar de TMDB API.
* **LocalStorage API:** Voor het persistent opslaan van gebruikersfavorieten, naam en themavoorkeur.
* **Intersection Observer API:** Voor lazy loading van afbeeldingen en het triggeren van infinite scroll.
* **Template Element:** Voor het efficiënt creëren van herbruikbare HTML-structuren (filmkaarten).

---

## ✅ Technische Vereisten & Implementatie

| Concept                       | Bestand(en)         | Voorbeeld Regel(s) / Locatie (main.js tenzij anders vermeld)                      | Korte Beschrijving Implementatie                                                                 |
| :---------------------------- | :------------------ | :------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------- |
| **Structuur & Setup** |                     |                                                                                 |                                                                                                  |
| Project met Vite              | `package.json`, `vite.config.js` | Project setup                                                                 | Applicatie gebouwd en geserveerd met Vite.                                                       |
| Folderstructuur               | Gehele project      | `src/css`, `src/js`, `src/assets`                                               | Logische scheiding van bestanden voor HTML, CSS, JavaScript en assets.                           |
| **HTML** |                     |                                                                                 |                                                                                                  |
| Semantische HTML5             | `index.html`        | `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<button>`, `<template>` | Gebruik van semantische elementen voor structuur en betekenis.                                   |
| **CSS** |                     |                                                                                 |                                                                                                  |
| CSS Custom Properties         | `style.css`         | `:root { --primary: ...; }`, `var(--primary)`                                   | Uitgebreid gebruik voor theming (licht/donker) en consistente styling.                           |
| Responsive Design             | `style.css`         | `@media (max-width: ...)`                                                       | Flexbox, Grid en media queries voor aanpasbare layout op verschillende schermformaten.             |
| **JavaScript Algemeen** |                     |                                                                                 |                                                                                                  |
| DOM Selectie                  | `main.js`           | Lijnen ~5-70 (DOM Elements sectie)                                              | Selectie van HTML-elementen via `getElementById`, `querySelector`.                             |
| DOM Manipulatie               | `main.js`           | `displayMovies()`, `showMovieDetailModal()`, `applyTheme()`                       | Dynamisch content en attributen van elementen aanpassen, elementen toevoegen/verwijderen.        |
| Event Listeners               | `main.js`           | Lijnen ~700+ (Event Listeners sectie)                                           | Koppelen van functies aan gebruikersinteracties (klik, change, scroll, submit).                  |
| **Modern JavaScript (ES6+)** |                     |                                                                                 |                                                                                                  |
| `const` / `let`               | `main.js`           | Overal                                                                          | Gebruik van block-scoped variabelen.                                                             |
| Arrow Functions               | `main.js`           | Overal, e.g., `() => {...}` in event listeners                                  | Compacte syntax voor functies.                                                                   |
| Template Literals             | `main.js`           | `WorkspaceFromTMDB()`: `\`${BASE_URL}${endpoint}\``, `displayMovies()`                 | Makkelijk samenstellen van strings met variabelen.                                                 |
| Array Methods                 | `main.js`           | `favoriteMovies.some()`, `allGenres.forEach()`, `data.results.slice()`          | `forEach`, `map`, `filter`, `find`, `some`, `findIndex`, `slice` voor dataverwerking.           |
| Destructuring (optioneel)     | `main.js`           | (Kan gebruikt worden bij object/array uitlezing)                                | Uitpakken van waarden uit arrays of properties van objecten in variabelen.                      |
| Spread/Rest operator (optioneel) | `main.js`        | (Kan gebruikt worden voor array/object manipulatie)                             | Flexibel werken met lijsten van argumenten of elementen.                                         |
| Modules (impliciet via Vite)  | `index.html`, `main.js` | `<script type="module" src="./src/js/main.js"></script>`                       | JavaScript is opgezet als een module, wat Vite standaard doet.                                   |
| **Asynchroon JavaScript** |                     |                                                                                 |                                                                                                  |
| Promises                      | `main.js`           | `Workspace()` retourneert een Promise                                               | Basis van asynchrone operaties.                                                                  |
| `async` / `await`             | `main.js`           | `WorkspaceFromTMDB()`, `WorkspaceMovies()`, `showMovieDetailModal()`                      | Syntactische suiker over Promises voor schonere asynchrone code.                                 |
| **API & Data** |                     |                                                                                 |                                                                                                  |
| Fetch API                     | `main.js`           | `WorkspaceFromTMDB()`                                                               | Ophalen van data van de TMDB API.                                                                |
| JSON Manipulatie              | `main.js`           | `response.json()`, verwerking van API data                                      | Converteren van JSON responses naar JavaScript objecten en dataverwerking.                       |
| **Browser Features** |                     |                                                                                 |                                                                                                  |
| LocalStorage                  | `main.js`           | `localStorage.setItem()`, `localStorage.getItem()` in `toggleFavorite()`, `applyTheme()`, `loadUserName()` | Opslaan en ophalen van favorieten, themavoorkeur en gebruikersnaam.                          |
| Formulier Validatie           | `main.js`, `index.html` | `handleNameFormSubmit()`, `performSearch()`, `required` attribuut               | Client-side validatie van input (naam, zoekterm lengte, thema selectie).                        |
| Intersection Observer API     | `main.js`           | `setupIntersectionObserver()`, `handleIntersection()` (impliciet)               | Lazy loading van afbeeldingen (via `loading="lazy"`) & infinite scroll (`loadMoreTrigger`).    |
| Hash-based Routing            | `main.js`           | `handleHashChange()`, `window.addEventListener('hashchange', ...)`              | Navigatie binnen de SPA via URL hashes (bv. `#search`, `#favorites`).                            |
| **Gebruikerservaring** |                     |                                                                                 |                                                                                                  |
| Toast Notificaties            | `main.js`           | `showToast()`                                                                   | Feedback aan gebruiker over acties.                                                              |
| Laadindicator                 | `main.js`           | `showLoading()`, `hideLoading()`                                                | Visuele indicatie tijdens data ophalen.                                                          |
| Toegankelijkheid (ARIA)       | `index.html`        | `aria-label`, `aria-live`, `aria-modal`, `aria-hidden`                          | Verbeteren van toegankelijkheid voor screenreaders en andere hulptechnologieën.                    |

---

## 📁 Projectstructuur

filmder/
│
├── index.html                      # Hoofd HTML-bestand voor de Single Page Application
├── package.json                    # Project metadata en dependencies
├── vite.config.js                  # Vite configuratiebestand
├── .env.example                    # Voorbeeld voor environment variabelen (bv. API key)
├── README.md                       # Deze documentatie
│
└── src/
├── css/
│   └── style.css               # Hoofd CSS-bestand voor alle styling
│
├── js/
│   └── main.js                 # Hoofd JavaScript-bestand met alle applicatielogica
│
└── assets/                     # Map voor statische assets zoals favicon
└── favicon.ico             # Favicon voor de website

---

## 🚀 Installatie & Gebruik

Volg deze stappen om Filmder lokaal op te zetten en te draaien:

1.  **Clone de repository:**
    ```bash
    git clone [https://github.com/jouw-gebruikersnaam/filmder.git](https://github.com/jouw-gebruikersnaam/filmder.git)
    cd filmder
    ```

2.  **Installeer dependencies:**
    Zorg dat [Node.js](https://nodejs.org/) (wat npm bevat) geïnstalleerd is.
    ```bash
    npm install
    ```

3.  **Configureer de API Sleutel:**
    Maak een `.env` bestand aan in de root van het project (kopieer van `.env.example` als die bestaat) en voeg je TMDB API sleutel toe:
    ```env
    VITE_TMDB_API_KEY=jouw_unieke_tmdb_api_sleutel
    ```
    *Vraag een gratis API sleutel aan op [TMDB](https://www.themoviedb.org/settings/api).*

4.  **Start de ontwikkelingsserver:**
    ```bash
    npm run dev
    ```

5.  **Open de applicatie:**
    Open je browser en navigeer naar `http://localhost:5173` (of de poort die Vite aangeeft).

---

## 📚 Bronnen & Erkenningen

* **TMDB API:** Voor het leveren van de filmdata.
* **MDN Web Docs:** Een onmisbare bron voor HTML, CSS, en JavaScript documentatie.
* **Vite Documentation:** Voor informatie over de build tool.
* *Eventuele andere tutorials, iconensets, lettertypes, etc. die je hebt gebruikt.*

### AI Ondersteuning
Voor dit project is gebruik gemaakt van AI-assistentie (zoals ChatGPT of Google Gemini) voor de volgende doeleinden:
* Brainstormen over oplossingsrichtingen voor specifieke problemen.
* Hulp bij het debuggen van JavaScript-code en het identificeren van logische fouten.
* Genereren van boilerplate code of codefragmenten als startpunt.
* Formuleren van comments en documentatie.
* Advies over best practices en code optimalisaties.

**Voorbeeld van interactie (conceptueel):**
*Vraag aan AI:* "Hoe kan ik het beste de thema-wissel implementeren en opslaan in localStorage?"
*Antwoord AI (samengevat):* "Gebruik een data-attribuut op de `<body>` tag. Sla de gekozen themawaarde ('light' of 'dark') op in localStorage. Bij het laden van de pagina, controleer localStorage en pas het thema toe. Voeg een event listener toe aan je thema-selectie-element om het thema bij te werken en de nieuwe waarde in localStorage op te slaan."

---

Gemaakt door Adil BENALI - Studentnummer [Jouw Studentnummer]
Vak: Web Advanced - Academiejaar 2024-2025