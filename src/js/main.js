// === DOM Elementen ===
// --- Navigatie Elementen ---
const navSearchLink = document.getElementById('nav-search');
const navFavoritesLink = document.getElementById('nav-favorites');
const navLogo = document.getElementById('nav-logo');
const navWatchedLink = document.getElementById('nav-watched'); // Link naar "Mijn Bekeken Films"

// --- Algemene Pagina Secties ---
const mainPageSection = document.getElementById('main-page-section');
const searchPageSection = document.getElementById('search-page-section');
const favoritesPageSection = document.getElementById('favorites-page-section');
const watchedMoviesPageSection = document.getElementById('watched-movies-page-section'); // Sectie voor "Mijn Bekeken Films"

// --- Thema Instellingen ---
const themeSelectHeader = document.getElementById('theme-select-header');
const themeErrorHeader = document.getElementById('theme-error-header');
const themeSelectMainPage = document.getElementById('theme-select-main-page'); 
const themeErrorMainPage = document.getElementById('theme-error-main-page');

// --- Gebruikersvoorkeur (Naam) ---
const nameForm = document.getElementById('name-form');
const usernameInput = document.getElementById('username');
const greetingElement = document.getElementById('greeting');
const editNameButton = document.getElementById('edit-name-button');

// --- Zoekpagina Elementen ---
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchError = document.getElementById('search-error');
const genreSelect = document.getElementById('genre-select');
const sortSelect = document.getElementById('sort-select');
const movieContainer = document.getElementById('movie-container'); 
const loadMoreTrigger = document.getElementById('load-more-trigger');

// --- Hoofdpagina Zoekelementen ---
const searchInputMainPage = document.getElementById('search-input-main-page');
const searchButtonMainPage = document.getElementById('search-button-main-page');
const searchErrorMainPage = document.getElementById('search-error-main-page');

// --- Favorietenpagina Elementen ---
const favoritesContainer = document.getElementById('favorites-container');
const clearAllFavoritesButton = document.getElementById('clear-all-favorites-button');

// --- Bekeken Films Pagina Elementen ---
const watchedMoviesContainer = document.getElementById('watched-movies-container'); 
const clearAllWatchedButton = document.getElementById('clear-all-watched-button'); 

// --- Globale Elementen ---
const loadingIndicator = document.getElementById('loading-indicator');
const toastContainer = document.getElementById('toast-container');
const backToTopButton = document.getElementById('back-to-top');
const movieItemTemplate = document.getElementById('movie-item-template'); // HTML template voor een filmkaart

// --- Film Detail Modal ---
const movieDetailModal = document.getElementById('movie-detail-modal');
const modalCloseButton = movieDetailModal.querySelector('.modal-close-button');
const modalAddFavoriteButton = document.getElementById('modal-add-favorite-button');
const modalToggleWatchedButton = document.getElementById('modal-toggle-watched-button');

// --- Mobiele Navigatie (Hamburger Menu) ---
const hamburgerMenu = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.nav-links');

// --- Hoofdpagina Filmsectie Containers ---
const popularMoviesContainer = document.getElementById('popular-movies-container');
const latestMoviesContainer = document.getElementById('latest-movies-container');
const actionMoviesContainer = document.getElementById('action-movies-container');
const comedyMoviesContainer = document.getElementById('comedy-movies-container');
const dramaMoviesContainer = document.getElementById('drama-movies-container');
const scifiMoviesContainer = document.getElementById('scifi-movies-container');
const recommendedMoviesSection = document.getElementById('recommended-movies-section');
const recommendedMoviesContainer = document.getElementById('recommended-movies-container');

// --- Hoofdpagina "Ontdek meer" Knoppen ---
const discoverPopularButton = document.getElementById('discover-popular-button');
const discoverLatestButton = document.getElementById('discover-latest-button');
const discoverGenresButton = document.getElementById('discover-genres-button');

// === Globale Variabelen ===
const API_KEY = '3dc52d407bf54ef45f6f26cfb3bbc07a'; // VERVANG INDIEN NODIG MET EIGEN KEY
const BASE_URL = 'https://api.themoviedb.org/3'; // Basis URL voor TMDB API
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; // Basis URL voor filmposters

// Statusvariabelen voor de applicatie
let currentSearchQuery = '';         // Huidige zoekterm
let currentPage = 1;               // Huidige paginanummer voor resultaten
let totalPages = 1;                // Totaal aantal pagina's voor huidige zoekopdracht/filter
let currentGenre = '';             // Geselecteerd genre ID
let currentSortBy = 'popularity.desc'; // Standaard sorteermethode
let isLoading = false;             // Vlag om dubbele API-aanroepen te voorkomen

// Data opslag
let allGenres = [];        // Array met alle beschikbare filmgenres (id, naam)
let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || []; // Favoriete films uit localStorage
let watchedMovies = JSON.parse(localStorage.getItem('watchedMovies')) || [];   // Bekeken films uit localStorage

let observer; // Variabele voor de Intersection Observer (infinite scroll)

// === Utility Functies ===

/**
 * Toont een toast notificatie.
 * @param {string} message - Het te tonen bericht.
 * @param {'success'|'error'|'info'|'warning'} [type='info'] - Het type toast (voor styling).
 */
function showToast(message, type = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.classList.add('toast', type);
    toast.textContent = message;
    toastContainer.appendChild(toast);
    toast.offsetHeight; // Forceer reflow voor CSS transitie
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 3000); // Toast verdwijnt na 3 seconden
}

/** Toont de laadindicator. */
function showLoading() {
    if (loadingIndicator) {
        loadingIndicator.style.display = 'flex';
        loadingIndicator.setAttribute('aria-hidden', 'false');
    }
}

/** Verbergt de laadindicator. */
function hideLoading() {
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
        loadingIndicator.setAttribute('aria-hidden', 'true');
    }
}

/** Verbergt alle pagina secties en deactiveert navigatielinks. */
function hideAllPageSections() {
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active-page');
        section.style.display = 'none';
    });
    document.querySelectorAll('.nav-links a.active').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    });
}

/**
 * Toont een specifieke pagina sectie en werkt de actieve navigatielink bij.
 * @param {HTMLElement} section - De te tonen sectie.
 * @param {HTMLElement | null} navLink - De bijbehorende navigatielink (optioneel).
 */
function showPageSection(section, navLink) {
    if (!section) return;
    hideAllPageSections();
    section.classList.add('active-page');
    section.style.display = 'block';
    if (navLink) {
        navLink.classList.add('active');
        navLink.setAttribute('aria-current', 'page');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll naar boven bij paginawissel
}

/** Regelt de zichtbaarheid van de "terug naar boven" knop. */
function handleBackToTopButton() {
    if (backToTopButton) {
        backToTopButton.classList.toggle('visible', window.scrollY > 300);
    }
}

/** Scrollt het venster vloeiend naar de top. */
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Toont een foutmelding voor zoekinvoervelden.
 * @param {HTMLElement} errorElement - Het element waarin de fout getoond wordt.
 * @param {string} message - De foutmelding.
 * @param {number} [duration=3000] - Zichtbaarheid van de melding in ms.
 */
function displaySearchError(errorElement, message, duration = 3000) {
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        setTimeout(() => {
            errorElement.style.display = 'none';
            errorElement.textContent = '';
        }, duration);
    }
}

/** Leegt de filmcontainer op de zoekpagina. */
function clearMovieContainer() {
    if (movieContainer) movieContainer.innerHTML = '';
}

/**
 * Creëert een "debounced" versie van een functie.
 * @param {Function} func - De uit te voeren functie.
 * @param {number} delay - Vertraging in ms.
 * @returns {Function} De gedebouncede functie.
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// === API Gerelateerde Functies ===

/**
 * Haalt data op van de TMDB API.
 * @param {string} endpoint - Het API eindpunt (bijv. '/movie/popular').
 * @param {Object} [params={}] - Query parameters.
 * @returns {Promise<Object|null>} De JSON respons of null bij een fout.
 */
async function fetchFromTMDB(endpoint, params = {}) {
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', API_KEY);
    url.searchParams.append('language', 'nl-NL');
    for (const key in params) {
        if (params[key]) url.searchParams.append(key, params[key]);
    }

    showLoading();
    try {
        // console.log(`API Aanroep: ${url.toString()}`); // Voor debugging
        const response = await fetch(url);
        if (!response.ok) {
            let errorMessage = `Fout bij API-verzoek (${response.status})`;
            if (response.status === 401) errorMessage = 'API-sleutel ongeldig. Controleer configuratie.';
            else if (response.status === 404) { console.warn(`Hulpbron niet gevonden: ${url.toString()}`); return null; }
            else if (response.status === 429) errorMessage = 'Te veel API aanvragen. Probeer later.';
            
            if (response.status !== 404) showToast(errorMessage, 'error');
            console.error(`API Fout: ${response.status} ${response.statusText} voor URL: ${url.toString()}`);
            return null; 
        }
        return await response.json();
    } catch (error) { // Netwerkfouten etc.
        console.error('Netwerk/algemene fout bij TMDB fetch:', error);
        showToast('Kon geen verbinding maken met de filmserver. Controleer je internet.', 'error');
        return null;
    } finally {
        hideLoading();
    }
}

/** Haalt filmgenres op en vult de genre filter dropdown. */
async function fetchGenres() {
    const data = await fetchFromTMDB('/genre/movie/list');
    if (data && data.genres) {
        allGenres = data.genres;
        if (genreSelect) {
            genreSelect.disabled = false;
            genreSelect.innerHTML = '<option value="">Alle genres</option>';
            allGenres.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre.id;
                option.textContent = genre.name;
                genreSelect.appendChild(option);
            });
        }
    } else { 
        showToast('Genres konden niet geladen worden. Filteren op genre is mogelijk beperkt.', 'error');
        if (genreSelect) {
            genreSelect.disabled = true;
            genreSelect.innerHTML = '<option value="">Genres niet beschikbaar</option>';
        }
        allGenres = []; 
    }
}

/**
 * Haalt films op o.b.v. huidige zoekterm, genre, en sortering (voor zoekpagina).
 * @param {boolean} clearExisting - Of bestaande films gewist moeten worden.
 */
async function fetchMovies(clearExisting = false) {
    if (isLoading) return;
    isLoading = true;

    const params = { page: currentPage };
    let endpoint;

    if (currentSearchQuery) {
        endpoint = '/search/movie';
        params.query = currentSearchQuery;
        if (genreSelect) genreSelect.value = ''; // Reset genre dropdown bij tekst zoeken
    } else {
        endpoint = '/discover/movie';
        if (currentGenre) params.with_genres = currentGenre;
    }
    params.sort_by = currentSortBy || 'popularity.desc';
    
        // Als we sorteren op nieuwste releases, filter dan op films tot en met vandaag
    if (currentSortBy === 'primary_release_date.desc') {
        const today = new Date().toISOString().split('T')[0];
        params['primary_release_date.lte'] = today; 
    }

    const data = await fetchFromTMDB(endpoint, params);

    if (data && data.results) {
        totalPages = data.total_pages;
        if (clearExisting && movieContainer) clearMovieContainer();
        if (movieContainer) displayMovies(data.results, movieContainer);
        if (loadMoreTrigger) loadMoreTrigger.style.display = (currentPage >= totalPages || data.results.length === 0) ? 'none' : 'block';
        if (data.results.length === 0 && clearExisting && movieContainer) {
            movieContainer.innerHTML = '<p class="no-content-message">Geen films gevonden die voldoen aan je criteria.</p>';
        }
    } else if (clearExisting && movieContainer) {
        clearMovieContainer();
        movieContainer.innerHTML = '<p class="no-content-message">Geen films gevonden.</p>';
        if (loadMoreTrigger) loadMoreTrigger.style.display = 'none';
    }
    isLoading = false;
}

// === Film Weergave Functies ===

/**
 * Creëert een HTML element voor een filmkaart.
 * @param {Object} movie - Het filmobject.
 * @returns {HTMLElement} Het filmkaart element.
 */
function createMovieCardElement(movie) {
    if (!movieItemTemplate) {
        console.error('Movie item template niet gevonden!');
        return document.createElement('div');
    }
    const movieCard = movieItemTemplate.content.cloneNode(true).children[0];
    movieCard.setAttribute('data-movie-id', movie.id);

    const posterPath = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/200x300/2C2F33/FFFFFF?text=Geen+Poster';
    
    // Vul kaartdata in (veilig, met checks voor bestaan van elementen)
    const posterImg = movieCard.querySelector('.movie-poster');
    if (posterImg) { posterImg.src = posterPath; posterImg.alt = `Poster voor ${movie.title || 'film'}`; }
    
    const titleEl = movieCard.querySelector('.movie-title');
    if (titleEl) titleEl.textContent = movie.title || 'Titel onbekend';

    const releaseEl = movieCard.querySelector('.movie-release-date');
    if (releaseEl) releaseEl.textContent = `Uitgebracht: ${movie.release_date || 'N.v.t.'}`;
    
    const ratingEl = movieCard.querySelector('.movie-rating');
    if (ratingEl) ratingEl.textContent = `Score: ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N.v.t.'}`;
    
    const overviewEl = movieCard.querySelector('.movie-overview');
    if (overviewEl) overviewEl.textContent = movie.overview || 'Geen omschrijving.';

    const popularityEl = movieCard.querySelector('.movie-popularity');
    if (popularityEl) popularityEl.textContent = `Populariteit: ${movie.popularity ? movie.popularity.toFixed(0) : 'N.v.t.'}`;

    // Favorietenknop logica
    const addFavoriteButton = movieCard.querySelector('.add-favorite-button');
    if (addFavoriteButton) {
        const isFavorited = favoriteMovies.some(fav => fav.id === movie.id);
        updateFavoriteButton(addFavoriteButton, isFavorited);
        addFavoriteButton.addEventListener('click', (e) => { e.stopPropagation(); toggleFavorite(movie); });
    }

    // "Bekeken" knop logica
    const toggleWatchedBtn = movieCard.querySelector('.toggle-watched-button');
    if (toggleWatchedBtn) {
        const isWatched = watchedMovies.some(watchedFilm => watchedFilm.id === movie.id);
        updateWatchedButton(toggleWatchedBtn, isWatched);
        toggleWatchedBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleWatched(movie); });
    }

    movieCard.addEventListener('click', () => showMovieDetailModal(movie.id));
    return movieCard;
}

/**
 * Toont een lijst van films in een gegeven container.
 * @param {Array<Object>} movies - Array van filmobjecten.
 * @param {HTMLElement} container - De HTML container.
 */
function displayMovies(movies, container) {
    if (!container) return;
    if (movies.length === 0 && container.children.length === 0) {
        container.innerHTML = '<p class="no-content-message">Geen films gevonden voor deze selectie.</p>';
        return;
    }
    movies.forEach(movie => container.appendChild(createMovieCardElement(movie)));
}

/**
 * Haalt filmdetails op en toont deze in de modal.
 * @param {number} movieId - Het ID van de film.
 */
async function showMovieDetailModal(movieId) {
    const movie = await fetchFromTMDB(`/movie/${movieId}`, { append_to_response: 'credits,videos' }); // Haal ook credits & videos op
    if (movie && movieDetailModal) {
        movieDetailModal.setAttribute('data-movie-id', movie.id);
        document.getElementById('movie-detail-title').textContent = movie.title;
        const posterEl = document.getElementById('movie-detail-poster');
        posterEl.src = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/200x300/2C2F33/FFFFFF?text=Geen+Poster';
        posterEl.alt = `Poster voor ${movie.title}`;
        document.getElementById('movie-detail-release').textContent = movie.release_date || 'N.v.t.';
        document.getElementById('movie-detail-rating').textContent = movie.vote_average ? movie.vote_average.toFixed(1) : 'N.v.t.';
        document.getElementById('movie-detail-popularity').textContent = movie.popularity ? movie.popularity.toFixed(0) : 'N.v.t.';
        document.getElementById('movie-detail-language').textContent = movie.original_language ? movie.original_language.toUpperCase() : 'N.v.t.';
        document.getElementById('movie-detail-genres').textContent = movie.genres?.map(g => g.name).join(', ') || 'N.v.t.';
        document.getElementById('movie-detail-overview').textContent = movie.overview || 'Geen omschrijving.';

        // Favorietenknop in modal
        const isFavorited = favoriteMovies.some(fav => fav.id === movie.id);
        updateFavoriteButton(modalAddFavoriteButton, isFavorited);
        modalAddFavoriteButton.onclick = () => toggleFavorite(movie); // .onclick overschrijft eventuele vorige handler

        // "Bekeken"-knop in modal
        if (modalToggleWatchedButton) {
            const isWatched = watchedMovies.some(watchedFilm => watchedFilm.id === movie.id);
            updateWatchedButton(modalToggleWatchedButton, isWatched);
            modalToggleWatchedButton.onclick = () => toggleWatched(movie);
        }
        
        movieDetailModal.style.display = 'flex';
        movieDetailModal.setAttribute('aria-hidden', 'false');
        movieDetailModal.focus(); // Focus op modal voor toegankelijkheid
    } else if (!movie && movieDetailModal) { 
        showToast('Kon filmdetails niet laden.', 'error');
    }
}

/** Sluit de film detail modal. */
function closeMovieDetailModal() {
    if (movieDetailModal) {
        movieDetailModal.style.display = 'none';
        movieDetailModal.setAttribute('aria-hidden', 'true');
    }
}

// === Favorieten Logica ===

/**
 * Wisselt favorietstatus van een film.
 * @param {Object} movie - Het filmobject.
 */
function toggleFavorite(movie) {
    const index = favoriteMovies.findIndex(fav => fav.id === movie.id);
    const movieTitle = movie.title || 'De film';
    if (index > -1) { // Verwijder uit favorieten
        favoriteMovies.splice(index, 1);
        showToast(`"${movieTitle}" verwijderd uit favorieten.`, 'info');
    } else { // Voeg toe aan favorieten
        favoriteMovies.push(movie); // Sla volledig object op
        showToast(`"${movieTitle}" toegevoegd aan favorieten!`, 'success');
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
    updateFavoriteStatusInUI(movie.id); // Update knoppen
    if (favoritesPageSection.classList.contains('active-page')) displayFavorites(); // Refresh lijst indien actief
    if (mainPageSection.classList.contains('active-page')) fetchAndDisplayRecommendedMovies(); // Update aanbevelingen
}

/**
 * Werkt de favorietenknop UI bij.
 * @param {HTMLElement} button - De knop.
 * @param {boolean} isFavorited - Of de film favoriet is.
 */
function updateFavoriteButton(button, isFavorited) {
    if (!button) return;
    const iconSpan = button.querySelector('.icon');
    const textSpan = button.querySelector('.text');
    button.classList.toggle('favorited', isFavorited);
    if (iconSpan) iconSpan.textContent = isFavorited ? '❤️' : '➕';
    if (textSpan) textSpan.textContent = isFavorited ? 'Verwijder Favoriet' : 'Voeg toe Favoriet';
    button.setAttribute('aria-label', isFavorited ? 'Verwijder uit favorieten' : 'Toevoegen aan favorieten');
}

/** Werkt alle favorietenknoppen in de UI bij voor een filmId. */
function updateFavoriteStatusInUI(movieId) {
    // Speciale case: movieId is null, reset alle favorietenknoppen (na clear all)
    if (movieId === null) {
        document.querySelectorAll('.movie-card .add-favorite-button.favorited').forEach(button => updateFavoriteButton(button, false));
        if (modalAddFavoriteButton && modalAddFavoriteButton.classList.contains('favorited')) updateFavoriteButton(modalAddFavoriteButton, false);
        return;
    }
    // Normale werking: update voor specifieke film
    const isNowFavorited = favoriteMovies.some(fav => fav.id === movieId);
    if (movieDetailModal && movieDetailModal.style.display === 'flex' && movieDetailModal.getAttribute('data-movie-id') == movieId) {
        if (modalAddFavoriteButton) updateFavoriteButton(modalAddFavoriteButton, isNowFavorited);
    }
    document.querySelectorAll(`.movie-card[data-movie-id="${movieId}"] .add-favorite-button`).forEach(button => {
        updateFavoriteButton(button, isNowFavorited);
    });
}

/** Toont de favoriete films. */
function displayFavorites() {
    if (!favoritesContainer) return;
    favoritesContainer.innerHTML = '';
    const noFavsHTML = `
        <div class="no-content-message">
            <p>Je hebt nog geen favoriete films. Voeg films toe!</p>
            <button class="button" id="goToSearchFromFavorites">Ontdek films</button>
        </div>`;
    
    displayUserMovieList(
        favoriteMovies,
        favoritesContainer,
        noFavsHTML,
        'goToSearchFromFavorites',
        clearAllFavoritesButton
    );
}

/** Handelt het wissen van alle favorieten af. */
function handleClearAllFavorites() {
    if (favoriteMovies.length === 0) {
        showToast('Je hebt nog geen favorieten om te wissen.', 'info');
        return;
    }
    if (window.confirm('Weet je zeker dat je ALLE favoriete films wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.')) {
        favoriteMovies = []; 
        localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
        displayFavorites(); 
        updateFavoriteStatusInUI(null); // Reset alle favorietenknoppen in de UI
        showToast('Alle favorieten zijn succesvol verwijderd.', 'success');
    } else {
        showToast('Verwijderen van favorieten geannuleerd.', 'info');
    }
}

// === Bekeken Films Logica ===

/**
 * Werkt de "bekeken"-knop UI bij.
 * @param {HTMLElement} button - De knop.
 * @param {boolean} isWatched - Of de film bekeken is.
 */
function updateWatchedButton(button, isWatched) {
    if (!button) return;
    const iconSpan = button.querySelector('.icon');
    const textSpan = button.querySelector('.text'); 
    button.classList.toggle('watched-active', isWatched);
    button.setAttribute('aria-pressed', isWatched.toString());
    if (isWatched) {
        if (iconSpan) iconSpan.textContent = '✅'; 
        if (textSpan) textSpan.textContent = 'Al bekeken';
        button.setAttribute('aria-label', 'Markeer als onbekeken');
    } else {
        if (iconSpan) iconSpan.textContent = '👁️';
        if (textSpan) textSpan.textContent = 'Bekeken?';
        button.setAttribute('aria-label', 'Markeer als bekeken');
    }
}

/**
 * Wisselt "bekeken"-status van een film.
 * @param {Object} movie - Het filmobject.
 */
function toggleWatched(movie) {
    const movieTitle = movie.title || 'De film';
    const index = watchedMovies.findIndex(watchedFilm => watchedFilm.id === movie.id);
    if (index > -1) { // Was bekeken, nu onbekeken
        watchedMovies.splice(index, 1);
        showToast(`"${movieTitle}" gemarkeerd als onbekeken.`, 'info');
    } else { // Was onbekeken, nu bekeken
        watchedMovies.push(movie); // Sla volledig filmobject op
        showToast(`"${movieTitle}" gemarkeerd als bekeken!`, 'success');
    }
    localStorage.setItem('watchedMovies', JSON.stringify(watchedMovies));
    updateWatchedStatusInUI(movie.id);
    if (watchedMoviesPageSection && watchedMoviesPageSection.classList.contains('active-page')) {
        displayWatchedMovies(); 
    }
}

/** Werkt alle "bekeken"-knoppen in de UI bij voor een filmId. */
function updateWatchedStatusInUI(movieId) {
    const isWatched = watchedMovies.some(watchedFilm => watchedFilm.id === movieId);
    if (movieDetailModal && movieDetailModal.style.display === 'flex' && movieDetailModal.getAttribute('data-movie-id') == movieId) {
        if (modalToggleWatchedButton) updateWatchedButton(modalToggleWatchedButton, isWatched);
    }
    document.querySelectorAll(`.movie-card[data-movie-id="${movieId}"] .toggle-watched-button`).forEach(button => {
        updateWatchedButton(button, isWatched);
    });
}

/** Helperfunctie om de "bekeken"-status voor ALLE filmknoppen in de UI te resetten. */
function updateWatchedStatusInUIForAllMovies() {
    document.querySelectorAll('.movie-card .toggle-watched-button.watched-active').forEach(button => {
        updateWatchedButton(button, false);
    });
    if (modalToggleWatchedButton && modalToggleWatchedButton.classList.contains('watched-active')) {
         updateWatchedButton(modalToggleWatchedButton, false);
    }
}

/** Toont de bekeken films. */
function displayWatchedMovies() {
    if (!watchedMoviesContainer) return;
    const noWatchedHTML = `
        <div class="no-content-message">
            <p>Je hebt nog geen films als "bekeken" gemarkeerd.</p>
            <button class="button" id="goToSearchFromWatched">Ontdek en bekijk films</button>
        </div>`;
    
    displayUserMovieList(
        watchedMovies,
        watchedMoviesContainer,
        noWatchedHTML,
        'goToSearchFromWatched',
        clearAllWatchedButton
    );
}

/** Handelt het wissen van alle bekeken films af. */
function handleClearAllWatchedMovies() {
    if (watchedMovies.length === 0) {
        showToast('Je hebt nog geen bekeken films om te wissen.', 'info');
        return;
    }
    if (window.confirm('Weet je zeker dat je ALLE bekeken films uit je lijst wilt verwijderen?')) {
        watchedMovies = []; 
        localStorage.setItem('watchedMovies', JSON.stringify(watchedMovies));
        displayWatchedMovies(); 
        updateWatchedStatusInUIForAllMovies();
        showToast('Alle bekeken films zijn succesvol verwijderd uit je lijst.', 'success');
    } else {
        showToast('Verwijderen van bekeken films geannuleerd.', 'info');
    }
}

/**
 * Generieke functie om een lijst van films weer te geven (vervangt deels displayFavorites/displayWatchedMovies).
 * @param {Array<Object>} moviesArray - De array met filmobjecten.
 * @param {HTMLElement} containerElement - De HTML-container.
 * @param {string} noContentHTML - HTML-string voor als de array leeg is.
 * @param {string} goToSearchButtonId - ID voor de "zoek films" knop in noContentHTML.
 * @param {HTMLElement|null} [clearAllButtonElement=null] - De "wis alles" knop voor deze lijst.
 */
function displayUserMovieList(moviesArray, containerElement, noContentHTML, goToSearchButtonId, clearAllButtonElement = null) {
    if (!containerElement) {
        console.warn("Display container niet gevonden voor lijstweergave.");
        return;
    }
    containerElement.innerHTML = ''; // Leeg de container

    if (moviesArray.length === 0) {
        containerElement.innerHTML = noContentHTML;
        const btn = document.getElementById(goToSearchButtonId);
        if (btn) {
            // Voorkom dubbele listeners als deze functie vaker wordt aangeroepen
            btn.replaceWith(btn.cloneNode(true)); // Kloon om oude listeners te verwijderen
            document.getElementById(goToSearchButtonId).addEventListener('click', () => {
                showPageSection(searchPageSection, navSearchLink);
                window.location.hash = '#search';
                if (movieContainer.children.length === 0) fetchMovies(true); 
            });
        }
        if (clearAllButtonElement) clearAllButtonElement.style.display = 'none';
        return;
    }

    if (clearAllButtonElement) clearAllButtonElement.style.display = 'inline-block';
    moviesArray.forEach(movie => containerElement.appendChild(createMovieCardElement(movie)));
}


// === Thema & Gebruikersnaam Logica ===
/** Werkt het huidige jaartal in de footer bij. */
function updateCurrentYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear().toString();
}

/** Past het thema toe. */
function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    localStorage.setItem('theme', theme);
}

/** Laadt het opgeslagen thema. */
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    if (themeSelectHeader) themeSelectHeader.value = savedTheme;
    if (themeSelectMainPage) themeSelectMainPage.value = savedTheme;
}

/** Verwerkt themawijziging. */
function handleThemeChange(event, errorElement) {
    const selectedTheme = event.target.value;
    if (!selectedTheme) {
        if (errorElement) errorElement.style.display = 'block';
        showToast('Kies een geldig thema.', 'warning');
        return;
    }
    applyTheme(selectedTheme);
    if (errorElement) errorElement.style.display = 'none';
    showToast(`Thema ingesteld op "${selectedTheme === 'dark' ? 'Donker' : 'Licht'}".`, 'info');
    if (event.target === themeSelectHeader && themeSelectMainPage) themeSelectMainPage.value = selectedTheme;
    else if (event.target === themeSelectMainPage && themeSelectHeader) themeSelectHeader.value = selectedTheme;
}

/** Laadt opgeslagen gebruikersnaam. */
function loadUserName() {
    const savedName = localStorage.getItem('username');
    if (savedName) {
        if (usernameInput) usernameInput.value = savedName;
        if (greetingElement) greetingElement.textContent = `Hallo, ${savedName}! Welkom terug.`;
        if (nameForm) nameForm.style.display = 'none'; // Verberg formulier
        if (editNameButton) editNameButton.classList.remove('hidden'); // Toon "Wijzig naam" knop
    } else {
        if (greetingElement) greetingElement.textContent = 'Voer je naam in voor een persoonlijke touch.';
        if (nameForm) nameForm.style.display = 'flex'; // Toon formulier (flex, omdat het een form is)
        if (editNameButton) editNameButton.classList.add('hidden'); // Verberg "Wijzig naam" knop
    }
}

/** Verwerkt inzending van naamformulier. */
function handleNameFormSubmit(event) {
    event.preventDefault();
    const username = usernameInput.value.trim();
    if (username) {
        localStorage.setItem('username', username);
        // loadUserName() zal de UI correct bijwerken, inclusief het verbergen van het formulier
        loadUserName(); 
        showToast(`Naam opgeslagen: ${username}`, 'success');
    } else {
        // ... (bestaande logica voor lege naam) ...
        showToast('Naam mag niet leeg zijn.', 'warning');
    }
}

// === Zoekpagina & Hoofdpagina Zoeklogica ===
/** Start een zoekopdracht op de zoekpagina. */
function performSearch(query) {
    currentSearchQuery = query;
    currentPage = 1; totalPages = 1;
    if (query.length > 0 && query.length < 2) {
        displaySearchError(searchError, 'Geef minstens 2 tekens in.');
        clearMovieContainer();
        if(loadMoreTrigger) loadMoreTrigger.style.display = 'none';
        return;
    }
    if (searchError) searchError.style.display = 'none';
    fetchMovies(true); // Wis bestaande en haal nieuwe op
}

/** Start een zoekopdracht vanaf de hoofdpagina. */
function performMainPageSearch(query) {
    if (query.length > 0 && query.length < 2) {
        displaySearchError(searchErrorMainPage, 'Minimaal 2 tekens.', 3000);
        return;
    }
    if (searchErrorMainPage) searchErrorMainPage.style.display = 'none';
    if (searchInput) searchInput.value = query; // Vul zoekbalk op zoekpagina
    showPageSection(searchPageSection, navSearchLink); // Ga naar zoekpagina
    window.location.hash = '#search';
    performSearch(query); // Gebruik zoekfunctie van zoekpagina
}

// === Hoofdpagina Secties Logica ===

/**
 * Haalt films op voor een sectie op de hoofdpagina.
 * @param {string} endpoint - API eindpunt.
 * @param {Object} params - API parameters.
 * @param {HTMLElement} container - De HTML container.
 * @param {number} limit - Maximaal aantal films.
 * @param {string} errorMessage - Foutmelding bij falen.
 */
async function fetchAndDisplaySectionMovies(endpoint, params, container, limit, errorMessage) {
    if (!container) return;
    const data = await fetchFromTMDB(endpoint, { ...params, page: 1 });
    if (data && data.results) {
        container.innerHTML = ''; 
        displayMovies(data.results.slice(0, limit), container);
        if (data.results.length === 0) {
            container.innerHTML = `<p class="info-message">Geen films voor deze sectie.</p>`;
        }
    } else {
        container.innerHTML = `<p class="error-message">${errorMessage}</p>`;
    }
}

/** Initialiseert de filmsecties op de hoofdpagina. */
async function initializeMainPageSections() {
    if (popularMoviesContainer) await fetchAndDisplaySectionMovies('/discover/movie', { sort_by: 'popularity.desc' }, popularMoviesContainer, 10, 'Populaire films konden niet geladen worden.');
    if (latestMoviesContainer) await fetchAndDisplaySectionMovies('/discover/movie', { sort_by: 'primary_release_date.desc', 'primary_release_date.lte': new Date().toISOString().split('T')[0] }, latestMoviesContainer, 10, 'Nieuwste films konden niet geladen worden.');

    if (allGenres.length === 0) await fetchGenres(); 

    const genreSections = [
        { name: 'Actie', container: actionMoviesContainer }, { name: 'Komedie', container: comedyMoviesContainer },
        { name: 'Drama', container: dramaMoviesContainer }, { name: 'Sciencefiction', container: scifiMoviesContainer }
    ];
    for (const section of genreSections) {
        if (section.container) {
            const genreObj = allGenres.find(g => g.name.toLowerCase() === section.name.toLowerCase());
            if (genreObj) {
                await fetchAndDisplaySectionMovies('/discover/movie', { with_genres: genreObj.id, sort_by: 'popularity.desc' }, section.container, 6, `${section.name} films konden niet geladen worden.`);
            } else {
                section.container.innerHTML = `<p class="info-message">Genre ${section.name} niet gevonden.</p>`;
            }
        }
    }
    await fetchAndDisplayRecommendedMovies(); // Laad ook aanbevolen films
}

/** Haalt aanbevolen films op en toont deze. */
async function fetchAndDisplayRecommendedMovies() {
    if (!recommendedMoviesSection || !recommendedMoviesContainer) return;
    if (favoriteMovies.length > 0) {
        const lastFavorite = favoriteMovies[favoriteMovies.length - 1];
        const data = await fetchFromTMDB(`/movie/${lastFavorite.id}/recommendations`);
        if (data && data.results && data.results.length > 0) {
            recommendedMoviesContainer.innerHTML = '';
            displayMovies(data.results.slice(0, 10), recommendedMoviesContainer);
            recommendedMoviesSection.classList.remove('hidden');
        } else {
            recommendedMoviesSection.classList.add('hidden');
        }
    } else {
        recommendedMoviesSection.classList.add('hidden');
    }
}

// === Event Listeners Setup ===
/** Registreert alle initiële event listeners. */
function setupEventListeners() {
    // Navigatie
    if (navSearchLink) navSearchLink.addEventListener('click', (e) => { e.preventDefault(); showPageSection(searchPageSection, navSearchLink); window.location.hash = '#search'; if (movieContainer && movieContainer.children.length === 0) performSearch(searchInput.value.trim() || ''); });
    if (navFavoritesLink) navFavoritesLink.addEventListener('click', (e) => { e.preventDefault(); showPageSection(favoritesPageSection, navFavoritesLink); window.location.hash = '#favorites'; displayFavorites(); });
    if (navWatchedLink) navWatchedLink.addEventListener('click', (e) => { e.preventDefault(); showPageSection(watchedMoviesPageSection, navWatchedLink); window.location.hash = '#watched'; displayWatchedMovies(); });
    if (navLogo) navLogo.addEventListener('click', (e) => { e.preventDefault(); showPageSection(mainPageSection, null); window.location.hash = '#home'; initializeMainPageSections(); });

    // Thema & Gebruikersnaam
    if (themeSelectHeader) themeSelectHeader.addEventListener('change', (event) => handleThemeChange(event, themeErrorHeader));
    if (themeSelectMainPage) themeSelectMainPage.addEventListener('change', (event) => handleThemeChange(event, themeErrorMainPage));
    if (nameForm) nameForm.addEventListener('submit', handleNameFormSubmit);

    // Debounced zoekfuncties
    const debouncedPerformSearch = debounce(performSearch, 500);
    const debouncedPerformMainPageSearch = debounce(performMainPageSearch, 500);

    // Zoekfunctionaliteit (Zoekpagina)
    if (searchButton) searchButton.addEventListener('click', () => performSearch(searchInput.value.trim()));
    if (searchInput) {
        searchInput.addEventListener('input', (e) => debouncedPerformSearch(e.target.value.trim()));
        searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); performSearch(searchInput.value.trim()); } }); // Enter = direct zoeken
    }
    // Zoekfunctionaliteit (Hoofdpagina)
    if (searchButtonMainPage) searchButtonMainPage.addEventListener('click', () => performMainPageSearch(searchInputMainPage.value.trim()));
    if (searchInputMainPage) {
        searchInputMainPage.addEventListener('input', (e) => debouncedPerformMainPageSearch(e.target.value.trim()));
        searchInputMainPage.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); performMainPageSearch(searchInputMainPage.value.trim()); } }); // Enter = direct zoeken
    }
    
    // Filters & Sortering (Zoekpagina)
    if (genreSelect) genreSelect.addEventListener('change', (e) => { currentGenre = e.target.value; currentPage = 1; fetchMovies(true); });
    if (sortSelect) sortSelect.addEventListener('change', (e) => { currentSortBy = e.target.value; currentPage = 1; fetchMovies(true); });

    // Overige UI elementen
    if (backToTopButton) { window.addEventListener('scroll', handleBackToTopButton); backToTopButton.addEventListener('click', scrollToTop); }
    if (modalCloseButton) modalCloseButton.addEventListener('click', closeMovieDetailModal);
    if (movieDetailModal) movieDetailModal.addEventListener('click', (e) => { if (e.target === movieDetailModal) closeMovieDetailModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && movieDetailModal && movieDetailModal.style.display === 'flex') closeMovieDetailModal(); });

    // Hamburger menu
    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            hamburgerMenu.setAttribute('aria-expanded', isActive.toString());
            const themeSettingsForm = document.getElementById('theme-settings-form-header');
            if (!themeSettingsForm) return;
            const placeholder = document.getElementById('header-theme-settings-placeholder');
            if (isActive && !navLinks.contains(themeSettingsForm)) navLinks.appendChild(themeSettingsForm);
            else if (!isActive && placeholder && !placeholder.contains(themeSettingsForm)) placeholder.appendChild(themeSettingsForm);
        });
    }

    // "Ontdek meer" knoppen
    if (discoverPopularButton) discoverPopularButton.addEventListener('click', () => { currentSearchQuery = ''; currentGenre = ''; currentSortBy = 'popularity.desc'; if (searchInput) searchInput.value = ''; if (genreSelect) genreSelect.value = ''; if (sortSelect) sortSelect.value = 'popularity.desc'; showPageSection(searchPageSection, navSearchLink); window.location.hash = '#search'; fetchMovies(true); });
    if (discoverLatestButton) discoverLatestButton.addEventListener('click', () => { currentSearchQuery = ''; currentGenre = ''; currentSortBy = 'primary_release_date.desc'; if (searchInput) searchInput.value = ''; if (genreSelect) genreSelect.value = ''; if (sortSelect) sortSelect.value = 'primary_release_date.desc'; showPageSection(searchPageSection, navSearchLink); window.location.hash = '#search'; fetchMovies(true); });
    if (discoverGenresButton) discoverGenresButton.addEventListener('click', () => { currentSearchQuery = ''; currentGenre = ''; currentSortBy = 'popularity.desc'; if (searchInput) searchInput.value = ''; if (genreSelect) genreSelect.value = ''; if (sortSelect) sortSelect.value = 'popularity.desc'; showPageSection(searchPageSection, navSearchLink); window.location.hash = '#search'; fetchMovies(true); });
    
    // Specifieke "Bekijk alle [genre]" knoppen
    document.querySelectorAll('.discover-genre-button').forEach(button => {
        button.addEventListener('click', () => {
            const genreName = button.dataset.genreName;
            const targetGenre = allGenres.find(g => g.name.toLowerCase() === genreName.toLowerCase());
            if (targetGenre) {
                currentSearchQuery = ''; currentGenre = targetGenre.id; currentSortBy = 'popularity.desc';
                if (searchInput) searchInput.value = ''; if (genreSelect) genreSelect.value = targetGenre.id; if (sortSelect) sortSelect.value = currentSortBy;
                showPageSection(searchPageSection, navSearchLink); window.location.hash = '#search'; fetchMovies(true);
            } else {
                showToast(`Genre "${genreName}" niet geconfigureerd.`, 'warning');
                currentSearchQuery = ''; currentGenre = ''; currentSortBy = 'popularity.desc'; /* Fallback */
                if (searchInput) searchInput.value = ''; if (genreSelect) genreSelect.value = ''; if (sortSelect) sortSelect.value = 'popularity.desc';
                showPageSection(searchPageSection, navSearchLink); window.location.hash = '#search'; fetchMovies(true);
            }
        });
    });
    
    // Klikbare "Load More" trigger
    if (loadMoreTrigger) {
        loadMoreTrigger.addEventListener('click', () => {
            if (!isLoading && currentPage < totalPages) { currentPage++; fetchMovies(false); }
            else if (currentPage >= totalPages && !isLoading) { showToast('Alle films zijn al geladen.', 'info'); }
        });
    }

    // "Wis alles" knoppen
    if (clearAllFavoritesButton) clearAllFavoritesButton.addEventListener('click', handleClearAllFavorites);
    if (clearAllWatchedButton) clearAllWatchedButton.addEventListener('click', handleClearAllWatchedMovies);

    if (editNameButton) {
        editNameButton.addEventListener('click', () => {
            if (nameForm) nameForm.style.display = 'flex'; // Toon het formulier weer
            if (usernameInput) usernameInput.focus(); // Zet focus op het inputveld
            editNameButton.classList.add('hidden'); // Verberg de "Wijzig naam" knop
            if (greetingElement) greetingElement.textContent = 'Pas hieronder je naam aan:'; // Update begroeting
        });
    }
}

// === Intersection Observer & Routering & Initialisatie ===

/** Stelt de Intersection Observer in voor infinite scroll. */
const setupIntersectionObserver = () => {
    if (observer) observer.disconnect();
    if (!loadMoreTrigger) return;
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isLoading && currentPage < totalPages) {
                currentPage++;
                fetchMovies(false); // Laad volgende pagina zonder bestaande te wissen
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });
    observer.observe(loadMoreTrigger);
};

/** Verwerkt URL hash wijzigingen voor paginanavigatie. */
const handleHashChange = async () => {
    const hash = window.location.hash || '#home'; // Default naar hoofdpagina
    // Laad genres indien nodig (essentieel voor diverse functies)
    if (allGenres.length === 0 && (hash === '#home' || hash.startsWith('#search') || hash.startsWith('#discover') || hash === '#watched')) {
        await fetchGenres();
    }

    switch (hash) {
        case '#search':
            showPageSection(searchPageSection, navSearchLink);
            if (movieContainer && movieContainer.children.length === 0) performSearch(searchInput.value.trim() || '');
            break;
        case '#favorites':
            showPageSection(favoritesPageSection, navFavoritesLink);
            displayFavorites();
            break;
        case '#watched':
            showPageSection(watchedMoviesPageSection, navWatchedLink);
            displayWatchedMovies();
            break;
        case '#home':
        default: // Fallback naar hoofdpagina
            showPageSection(mainPageSection, null);
            if (window.location.hash !== '#home' && window.location.hash !== '') window.location.hash = '#home'; // Normaliseer hash
            await initializeMainPageSections();
            break;
    }
};

/** Initialiseert de applicatie na het laden van de DOM. */
document.addEventListener('DOMContentLoaded', async () => {
    updateCurrentYear();
    loadTheme();
    loadUserName();
    setupEventListeners(); // Belangrijk: eerst listeners, dan hash afhandelen die mogelijk functies aanroept
    await handleHashChange(); // Verwerk initiële URL hash (kan async operaties bevatten)
    setupIntersectionObserver();
    window.addEventListener('hashchange', handleHashChange); // Luister naar toekomstige hash wijzigingen
});