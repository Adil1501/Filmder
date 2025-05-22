# 🎬 Filmder - Interactieve Filmzoeker Webapplicatie

Filmder is een dynamische single-page webapplicatie (SPA) ontworpen om gebruikers te helpen bij het ontdekken, zoeken, filteren en beheren van hun favoriete films en series. Deze applicatie haalt real-time filmdata op via de **TMDB (The Movie Database) API** en biedt een rijke, interactieve gebruikerservaring.

## 🌟 Functionaliteiten

De Filmder applicatie biedt de volgende kernfunctionaliteiten:

* **Uitgebreide Filmcatalogus:**
    * Ontdek populaire films, de nieuwste releases, en films per genre (Actie, Komedie, Drama, Sciencefiction) direct op de startpagina.
    * Toont aanbevelingen op de hoofdpagina gebaseerd op recent toegevoegde favoriete films.
    * Haalt en toont een breed scala aan filmdata van de TMDB API.
* **Geavanceerd Zoeken & Filteren:**
    * Zoek films en series op titel of trefwoorden.
    * Filter filmresultaten op basis van genre.
    * Sorteer resultaten op populariteit, releasedatum, beoordeling (hoog/laag), en titel (A-Z/Z-A).
* **Gedetailleerde Filminformatie:**
    * Bekijk uitgebreide details per film in een modaal venster, inclusief poster, releasedatum, beoordeling, populariteitsscore, originele taal, genres en een volledige synopsis. (Optioneel: toekomstige uitbreiding voor acteurs/trailers).
* **Personalisatie:**
    * **Favorieten:** Markeer films als favoriet en beheer een persoonlijke favorietenlijst. Een optie om alle favorieten tegelijk te verwijderen is beschikbaar.
    * **Bekeken Films:** Markeer films als "bekeken" en bekijk ze op een aparte pagina. Een optie om alle bekeken films te verwijderen is beschikbaar.
    * **Gebruikersnaam:** Sla een naam op voor een gepersonaliseerde begroeting op de hoofdpagina, met de mogelijkheid om deze later te wijzigen.
    * **Thema Keuze:** Wissel tussen een licht en donker thema voor de applicatie.
    * Alle persoonlijke data (favorieten, bekeken films, naam, thema) wordt opgeslagen in `localStorage` en blijft bewaard tussen sessies.
* **Gebruikerservaring (UX):**
    * **Single Page Application (SPA):** Naadloze navigatie tussen de secties Home, Zoeken, Mijn Favorieten, en Mijn Bekeken Films zonder volledige paginaherlaadingen, gebruikmakend van hash-based routing.
    * **Responsive Design:** De applicatie is ontworpen om functioneel en visueel aantrekkelijk te zijn op desktops, tablets en mobiele apparaten.
    * **Lazy Loading van Afbeeldingen:** Filmposters maken gebruik van het `loading="lazy"` attribuut voor betere initiële laadprestaties.
    * **Infinite Scroll & Klikbare "Load More":** Laad meer filmresultaten automatisch bij het scrollen op de zoekpagina, of door op de "laad meer" trigger te klikken.
    * **Visuele Feedback:** Duidelijke laadindicatoren (spinners), skeleton placeholders voor afbeeldingen, en toast notificaties voor gebruikersacties, API-status en foutmeldingen.
    * **Debounced Zoekinput:** API-verzoeken voor de zoekfunctie worden pas verstuurd nadat de gebruiker kort stopt met typen, wat de gebruikerservaring verbetert en het aantal API-calls reduceert.
    * **Toegankelijkheid (A11y):** Toepassing van semantische HTML-elementen en ARIA-attributen (zoals `aria-label`, `aria-live`, `aria-expanded`, `role`) om de toegankelijkheid voor hulptechnologieën te verbeteren.

---

## 🖼️ Screenshots

* *Afbeelding 1: Startpagina met filmcarrousels.*
![alt text](</public/Capture d'écran 2025-05-22 233137.png>)

* *Afbeelding 2: Zoekpagina met resultaten en filters.*
![alt text](</public/Capture d'écran 2025-05-22 233338.png>)

* *Afbeelding 3: Detailpagina van een film.*
![alt text](</public/Capture d'écran 2025-05-22 233252.png>)

* *Afbeelding 4: Favorietenpagina.*
![alt text](</public/Capture d'écran 2025-05-22 233308.png>)

* *Afbeelding 6: Mobiele weergave.*
![alt text](</public/Capture d'écran 2025-05-22 234011.png>)

---

## 🛠️ Gebruikte Technologieën & API

### Kerntechnologieën:
* **HTML:** Voor de semantische structuur en content van de webapplicatie.
* **CSS:** Voor styling, layout (middels Flexbox en Grid), thematisering (via Custom Properties), animaties, en responsive design.
* **JavaScript:** Voor de volledige applicatielogica, DOM-manipulatie, interactie met de TMDB API, en het gebruik van moderne JavaScript features.

### Tools & Libraries:
* **Vite:** Als snelle frontend build tool en development server.

### Externe API:
* **TMDB (The Movie Database) API:** De primaire bron voor alle film- en seriedata.
    * Website: [The Movie Database API](https://www.themoviedb.org/documentation/api)
    * Developer Documentatie: [TMDB Developer Docs](https://developer.themoviedb.org/docs)
    * Gebruikte Endpoints (een selectie):
        * `/discover/movie` (o.a. voor populaire films, nieuwste releases, films per genre, sorteren)
        * `/search/movie` (voor de zoekfunctionaliteit op trefwoord)
        * `/genre/movie/list` (voor het ophalen van de lijst met beschikbare filmgenres)
        * `/movie/{movie_id}` (voor gedetailleerde informatie per film, inclusief `append_to_response=credits,videos`)
        * `/movie/{movie_id}/recommendations` (voor het ophalen van aanbevolen films)

### Browser Features:
* **Fetch API:** Voor het uitvoeren van asynchrone HTTP-verzoeken naar de TMDB API.
* **LocalStorage API:** Voor het client-side opslaan van gebruikersvoorkeuren (naam, thema) en lijsten (favorieten, bekeken films), zodat deze bewaard blijven tussen sessies.
* **Intersection Observer API:** Geïmplementeerd voor de "infinite scroll" functionaliteit op de zoekpagina.
* **`<template>` Element:** Gebruikt voor het efficiënt en herbruikbaar genereren van de HTML-structuur voor filmkaarten.
* **URL Hash (Location API & `hashchange` event):** Voor het implementeren van client-side routing binnen de Single Page Application.

---

## ✅ Technische Vereisten & Implementatie

Deze tabel licht toe hoe verschillende technische JavaScript-concepten zijn toegepast in het project.
| Concept                     | Bestand(en)             | Voorbeeld in Code (Functie / Concept)                                  | Korte Beschrijving Implementatie                                                                     |
| :-------------------------- | :---------------------- | :--------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| **Structuur & Setup** |                         |                                                                        |                                                                                                      |
| Project met Vite            | `package.json`, etc.    | Project setup                                                          | Applicatie ontwikkeld en geserveerd met Vite.                                                        |
| Folderstructuur             | Gehele project          | `public/`, `src/css/`, `src/js/`                                       | Logische scheiding van publieke assets, stylesheets en JavaScript-bestanden.                           |
| **HTML** |                         |                                                                        |                                                                                                      |
| Semantische HTML5           | `index.html`            | `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<button>`, `<template>` | Gebruik van correcte HTML5-elementen voor een duidelijke structuur en betekenis.                       |
| **CSS** |                         |                                                                        |                                                                                                      |
| CSS Custom Properties       | `style.css`             | `:root { --primary: ...; }`, `var(--primary)`                          | Uitgebreid gebruik voor theming (licht/donker), afstanden, en consistente styling.                   |
| Responsive Design           | `style.css`             | `@media (max-width: ...)`                                              | Gebruik van Flexbox, Grid, en media queries voor een optimale weergave op diverse schermformaten.     |
| **JavaScript Algemeen** |                         |                                                                        |                                                                                                      |
| DOM Selectie                | `main.js`               | `// === DOM Elementen ===` sectie bovenaan                             | Consistente selectie van HTML-elementen via `getElementById`, `querySelector`.                       |
| DOM Manipulatie             | `main.js`               | `displayMovies()`, `showMovieDetailModal()`, `applyTheme()`, `showToast()` | Dynamisch aanpassen van content, attributen, en structuur van de DOM.                                 |
| Event Listeners             | `main.js`               | `setupEventListeners()` functie en diverse individuele listeners         | Koppelen van functies aan gebruikersinteracties (klik, input, change, scroll, submit).               |
| **Modern JavaScript (ES6+)**|                         |                                                                        |                                                                                                      |
| `const` / `let`             | `main.js`               | Consistent gebruik door het hele script                                  | Gebruik van block-scoped variabelen voor betere codeveiligheid en leesbaarheid.                   |
| Arrow Functions             | `main.js`               | Veelvuldig in event listeners en callbacks, bijv. `(e) => {...}`         | Compacte syntax voor functies, behoud van `this` context waar relevant.                               |
| Template Literals           | `main.js`               | `WorkspaceFromTMDB()` (URL opbouw), `showToast()` (berichten)                 | Eenvoudig en leesbaar samenstellen van strings met ingebedde JavaScript expressies.                    |
| Array Methods               | `main.js`               | `forEach`, `map`, `find`, `some`, `findIndex`, `slice`                    | Efficiënte dataverwerking en iteratie over arrays (bijv. `favoriteMovies`, `allGenres`, API resultaten). |
| Destructuring               | `main.js`               | (Beperkt, bijv. in `const { id, title } = movie` indien toegepast)       | Kan gebruikt worden voor het eenvoudig uitpakken van waarden uit objecten of arrays.                  |
| Spread/Rest Operator        | `main.js`               | `debounce(...args)`, `WorkspaceAndDisplaySectionMovies({...params})`          | Voor het flexibel doorgeven van functieargumenten en het samenvoegen/kopiëren van objecten/arrays.      |
| Modules (via Vite)          | `index.html`, `main.js` | `<script type="module" ...>`                                           | JavaScript code is opgezet als een ES-module, wat standaard is voor Vite-projecten.                   |
| **Asynchroon JavaScript** |                         |                                                                        |                                                                                                      |
| Promises                    | `main.js`               | `Workspace()` in `WorkspaceFromTMDB()` retourneert een Promise                    | Fundament voor het afhandelen van asynchrone operaties zoals API-verzoeken.                           |
| `async` / `await`           | `main.js`               | `WorkspaceFromTMDB()`, `WorkspaceMovies()`, `initializeMainPageSections()`, etc. | Maakt asynchrone code beter leesbaar en schrijfbaar, alsof het synchroon is.                        |
| **API & Data** |                         |                                                                        |                                                                                                      |
| Fetch API                   | `main.js`               | `WorkspaceFromTMDB()`                                                      | Gebruikt voor het ophalen van filmdata van de externe TMDB API.                                      |
| JSON Manipulatie            | `main.js`               | `response.json()`, `JSON.parse()`, `JSON.stringify()`                  | Converteren van JSON data van de API naar JavaScript objecten en vice versa voor `localStorage`.     |
| **Browser Features** |                         |                                                                        |                                                                                                      |
| LocalStorage                | `main.js`               | `toggleFavorite()`, `toggleWatched()`, `applyTheme()`, `handleNameFormSubmit()` | Persistent opslaan van gebruikersdata (favorieten, bekeken, thema, naam) in de browser.          |
| Formulier Validatie (basis) | `main.js`, `index.html` | `performSearch()` (min. lengte), `handleNameFormSubmit()` (naam vereist)  | Client-side controles op gebruikersinvoer om ongeldige data te voorkomen.                           |
| Intersection Observer       | `main.js`               | `setupIntersectionObserver()`                                          | Efficiënt implementeren van "infinite scroll" functionaliteit.                                        |
| Hash-based Routing          | `main.js`               | `handleHashChange()`, `window.addEventListener('hashchange', ...)`       | Navigatie binnen de Single Page Application zonder volledige paginaherlaadingen.                     |
| **Gebruikerservaring** |                         |                                                                        |                                                                                                      |
| Toast Notificaties          | `main.js`               | `showToast()`                                                          | Korte, niet-intrusieve feedbackberichten aan de gebruiker.                                            |
| Laadindicator               | `main.js`               | `showLoading()`, `hideLoading()`                                       | Visuele indicatie (spinner) dat de applicatie bezig is met het ophalen van data.                   |
| Debouncing                  | `main.js`               | `debounce()` functie toegepast op zoekinput                             | Optimaliseert API-aanroepen bij zoekopdrachten.                                                      |
| Toegankelijkheid (ARIA)     | `index.html`, `main.js` | `aria-label`, `aria-live`, `aria-expanded`, `role`, etc.                | Toepassing van ARIA-attributen om de toegankelijkheid voor diverse gebruikers te verbeteren.        |

---

## 📁 Projectstructuur

filmder/
│
├── public/                      # Map voor statische assets (direct gekopieerd naar build output)
├── src/                         # Map voor de broncode
│   ├── assets/   
│   │   ├── favicon.ico 
│   │   └── logo.png 
│   ├── css/
│   │   └── style.css            # Hoofd CSS-bestand voor alle styling
│   └── js/
│       └── main.js              # Hoofd JavaScript-bestand met de applicatielogica
│
├── .gitignore                   # Specificeert bestanden en mappen die Git moet negeren
├── index.html                   # Het hoofd HTML-bestand (entry point voor Vite)
├── package.json                 # Bevat project metadata, scripts en dependencies
├── README.md                    # Deze documentatie
└── 

---

## 🚀 Installatie & Gebruik

Volg deze stappen om Filmder lokaal op te zetten en te draaien:

1.  **Clone de repository:**
    ```bash
    git clone [https://github.com/jouw-gebruikersnaam/filmder.git](https://github.com/jouw-gebruikersnaam/filmder.git)
    cd filmder
    ```

2.  **Installeer dependencies:**
    Zorg dat [Node.js](https://nodejs.org/) (inclusief npm) geïnstalleerd is op je systeem.
    ```bash
    npm install
    ```

3.  **API Sleutel:**
    * De TMDB API sleutel die nodig is voor dit project is direct opgenomen in de broncode (`src/js/main.js` in de variabele `API_KEY`). Er is geen verdere configuratie van de API-sleutel nodig om het project lokaal uit te voeren.

4.  **Start de ontwikkelingsserver:**
    ```bash
    npm run dev
    ```

5.  **Open de applicatie:**
    Open je browser en navigeer naar de lokale URL die Vite aangeeft.

---

## 📚 Bronnen & Erkenningen

* **TMDB API:** Voor het leveren van alle film- en seriedata.
* **MDN Web Docs:** Een essentiële en onmisbare bron voor HTML, CSS, en JavaScript documentatie en voorbeelden.
* **Vite Documentation:** Voor informatie over de build tool en development server.
* ### AI Ondersteuning
Voor de ontwikkeling van dit project is gebruik gemaakt van AI-assistentie (Google Gemini) voor diverse aspecten, waaronder:
* Brainstormen over oplossingsrichtingen voor specifieke programmeeruitdagingen.
* Hulp bij het debuggen van JavaScript-code en het identificeren van logische fouten.
* Genereren van codefragmenten en voorbeelden als startpunt voor implementaties.
* Formuleren en structureren van commentaar in de code en documentatie (zoals deze README).
* Advies over best practices in webontwikkeling, code-optimalisaties en toegankelijkheid.

---

Gemaakt door **Adil BENALI**
Vak: Web Advanced - Academiejaar 2024-2025