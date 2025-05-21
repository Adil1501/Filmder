// === DOM Elementen ===
// --- Navigatie Elementen ---
const navSearchLink = document.getElementById('nav-search');
const navFavoritesLink = document.getElementById('nav-favorites');
const navLogo = document.getElementById('nav-logo');

// --- Algemene Pagina Secties ---
const mainPageSection = document.getElementById('main-page-section');
const searchPageSection = document.getElementById('search-page-section');
const favoritesPageSection = document.getElementById('favorites-page-section');

// --- Thema Instellingen ---
const themeSelectHeader = document.getElementById('theme-select-header');
const themeErrorHeader = document.getElementById('theme-error-header');
// Hoofdpagina thema instellingen (indien aanwezig, momenteel niet in HTML, maar JS ondersteunt het)
const themeSelectMainPage = document.getElementById('theme-select-main-page'); 
const themeErrorMainPage = document.getElementById('theme-error-main-page');

// --- Gebruikersvoorkeur (Naam) ---
const nameForm = document.getElementById('name-form');
const usernameInput = document.getElementById('username');
const greetingElement = document.getElementById('greeting');

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

// --- Globale Elementen ---
const loadingIndicator = document.getElementById('loading-indicator');
const toastContainer = document.getElementById('toast-container');
const backToTopButton = document.getElementById('back-to-top');
const movieItemTemplate = document.getElementById('movie-item-template');

// --- Film Detail Modal ---
const movieDetailModal = document.getElementById('movie-detail-modal');
const modalCloseButton = movieDetailModal.querySelector('.modal-close-button');
const modalAddFavoriteButton = document.getElementById('modal-add-favorite-button');

// --- Mobiele Navigatie (Hamburger Menu) ---
const hamburgerMenu = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.nav-links'); // Container met navigatielinks (heeft nu ID nav-links-controlled)

// --- Hoofdpagina Filmsectie Containers ---
const popularMoviesContainer = document.getElementById('popular-movies-container');
const latestMoviesContainer = document.getElementById('latest-movies-container');
const actionMoviesContainer = document.getElementById('action-movies-container');
const comedyMoviesContainer = document.getElementById('comedy-movies-container');
const dramaMoviesContainer = document.getElementById('drama-movies-container');
const scifiMoviesContainer = document.getElementById('scifi-movies-container');

// --- Hoofdpagina "Ontdek meer" Knoppen ---
const discoverPopularButton = document.getElementById('discover-popular-button');
const discoverLatestButton = document.getElementById('discover-latest-button');
const discoverGenresButton = document.getElementById('discover-genres-button'); // Algemene knop

// === Globale Variabelen ===
const API_KEY = '3dc52d407bf54ef45f6f26cfb3bbc07a'; // VERVANG INDIEN NODIG
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

let currentSearchQuery = '';
let currentPage = 1;
let totalPages = 1;
let currentGenre = '';
let currentSortBy = 'popularity.desc'; // Standaard sortering
let isLoading = false;
let allGenres = []; // Slaat alle opgehaalde genres op (id, name)
let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];

let observer; // Voor Intersection Observer

// === Utility Functies ===
function showToast(message, type = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.classList.add('toast', type);
    toast.textContent = message;
    toastContainer.appendChild(toast);
    toast.offsetHeight; // Force reflow
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 3000);
}

function showLoading() {
    if (loadingIndicator) {
        loadingIndicator.style.display = 'flex';
        loadingIndicator.setAttribute('aria-hidden', 'false');
    }
}

function hideLoading() {
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
        loadingIndicator.setAttribute('aria-hidden', 'true');
    }
}

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

function showPageSection(section, navLink) {
    if (!section) return;
    hideAllPageSections();
    section.classList.add('active-page');
    section.style.display = 'block';
    if (navLink) {
        navLink.classList.add('active');
        navLink.setAttribute('aria-current', 'page');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleBackToTopButton() {
    if (backToTopButton) {
        backToTopButton.classList.toggle('visible', window.scrollY > 300);
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

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

function clearMovieContainer() {
    if (movieContainer) movieContainer.innerHTML = '';
}

// === API Gerelateerde Functies ===
async function fetchFromTMDB(endpoint, params = {}) {
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', API_KEY);
    url.searchParams.append('language', 'nl-NL');
    for (const key in params) {
        if (params[key]) url.searchParams.append(key, params[key]);
    }

    showLoading();
    try {
        // console.log(`API Call: ${url.toString()}`); // Voor debugging
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 401) showToast('API-sleutel ongeldig. Controleer configuratie.', 'error');
            else if (response.status === 404) console.warn(`Hulpbron niet gevonden: ${url.toString()}`);
            else if (response.status === 429) showToast('Te veel API aanvragen. Probeer later.', 'warning');
            else throw new Error(`HTTP error! Status: ${response.status}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('Fout bij ophalen van TMDB data:', error);
        showToast('Kon geen data ophalen van de server.', 'error');
        return null;
    } finally {
        hideLoading();
    }
}

async function fetchGenres() {
    const data = await fetchFromTMDB('/genre/movie/list');
    if (data && data.genres) {
        allGenres = data.genres;
        if (genreSelect) {
            genreSelect.innerHTML = '<option value="">Alle genres</option>';
            allGenres.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre.id;
                option.textContent = genre.name;
                genreSelect.appendChild(option);
            });
        }
    } else if (!data) { // Alleen toasten als fetchFromTMDB null retourneerde door een eerdere fout
        showToast('Kon genres niet laden.', 'error');
    }
}
/**
 * Haalt films op gebaseerd op de huidige filters en sorteervolgorde.
 * Wordt gebruikt voor de zoekpagina.
 * @param {boolean} clearExisting - Of de bestaande films gewist moeten worden.
 */
async function fetchMovies(clearExisting = false) {
    if (isLoading) return;
    isLoading = true;

    const params = { page: currentPage };
    let endpoint;

    if (currentSearchQuery) {
        endpoint = '/search/movie';
        params.query = currentSearchQuery;
        // Genre/sorteervolgorde filters zijn minder direct toepasbaar of worden anders geïnterpreteerd 
        // door de /search/movie endpoint vergeleken met /discover/movie.
        // Voor nu sturen we ze niet mee als currentSearchQuery is gezet om verwarring te voorkomen.
        // De UI (genreSelect, sortSelect) reflecteert dit best door ze te disablen of te resetten.
        if (genreSelect) genreSelect.value = ''; // Reset genre dropdown bij tekst zoeken
        // sortSelect kan actief blijven, maar de API voor /search/movie sorteert primair op relevantie.
    } else {
        // Geen zoekterm: gebruik /discover/movie voor sorteren en filteren op genre
        endpoint = '/discover/movie';
        if (currentGenre) {
            params.with_genres = currentGenre;
        }
        // Gebruik de huidige sorteervolgorde, of 'popularity.desc' als er niets is ingesteld
        params.sort_by = currentSortBy || 'popularity.desc';
    }
    
    // console.log(`WorkspaceMovies - Endpoint: ${endpoint}, Params:`, params); // Debugging

    const data = await fetchFromTMDB(endpoint, params);

    if (data && data.results) {
        totalPages = data.total_pages;
        if (clearExisting && movieContainer) clearMovieContainer();
        
        if (movieContainer) displayMovies(data.results, movieContainer);

        if (loadMoreTrigger) {
            loadMoreTrigger.style.display = (currentPage >= totalPages || data.results.length === 0) ? 'none' : 'block';
        }
        if (data.results.length === 0 && clearExisting && movieContainer) {
            movieContainer.innerHTML = '<p class="no-content-message">Geen films gevonden die voldoen aan je criteria.</p>';
        }
    } else if (clearExisting && movieContainer) { // Geen data of geen results
        clearMovieContainer();
        movieContainer.innerHTML = '<p class="no-content-message">Geen films gevonden.</p>';
        if (loadMoreTrigger) loadMoreTrigger.style.display = 'none';
    }
    isLoading = false;
}

// === Film Weergave Functies ===
function createMovieCardElement(movie) {
    if (!movieItemTemplate) {
        console.error('Movie item template niet gevonden!');
        return document.createElement('div'); // Fallback
    }
    const movieCard = movieItemTemplate.content.cloneNode(true).children[0];
    // class 'movie-card' is al in de template. Voeg data-movie-id toe.
    movieCard.setAttribute('data-movie-id', movie.id);

    const posterPath = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/200x300/2C2F33/FFFFFF?text=Geen+Poster';
    
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

    const addFavoriteButton = movieCard.querySelector('.add-favorite-button');
    if (addFavoriteButton) {
        const isFavorited = favoriteMovies.some(fav => fav.id === movie.id);
        updateFavoriteButton(addFavoriteButton, isFavorited);
        addFavoriteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(movie);
        });
    }
    movieCard.addEventListener('click', () => showMovieDetailModal(movie.id));
    return movieCard;
}

function displayMovies(movies, container) {
    if (!container) return;
    if (movies.length === 0 && container.children.length === 0) { // Alleen bericht als container echt leeg is na een 'clear'
        container.innerHTML = '<p class="no-content-message">Geen films gevonden voor deze selectie.</p>';
        return;
    }
    movies.forEach(movie => container.appendChild(createMovieCardElement(movie)));
}

async function showMovieDetailModal(movieId) {
    const movie = await fetchFromTMDB(`/movie/${movieId}`, { append_to_response: 'credits,videos' });
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

        const isFavorited = favoriteMovies.some(fav => fav.id === movie.id);
        updateFavoriteButton(modalAddFavoriteButton, isFavorited);
        modalAddFavoriteButton.onclick = () => toggleFavorite(movie); // .onclick overschrijft vorige
        
        movieDetailModal.style.display = 'flex';
        movieDetailModal.setAttribute('aria-hidden', 'false');
        movieDetailModal.focus();
    } else if (!movie && movieDetailModal) { // Als fetch mislukte maar modal bestaat
        showToast('Kon filmdetails niet laden.', 'error');
    }
}

function closeMovieDetailModal() {
    if (movieDetailModal) {
        movieDetailModal.style.display = 'none';
        movieDetailModal.setAttribute('aria-hidden', 'true');
    }
}

function toggleFavorite(movie) {
    const index = favoriteMovies.findIndex(fav => fav.id === movie.id);
    const movieTitle = movie.title || 'De film';
    if (index > -1) {
        favoriteMovies.splice(index, 1);
        showToast(`"${movieTitle}" verwijderd uit favorieten.`, 'info');
    } else {
        favoriteMovies.push(movie);
        showToast(`"${movieTitle}" toegevoegd aan favorieten!`, 'success');
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
    updateFavoriteStatusInUI(movie.id);
    if (favoritesPageSection.classList.contains('active-page')) displayFavorites();
}

function updateFavoriteButton(button, isFavorited) {
    if (!button) return;
    const iconSpan = button.querySelector('.icon');
    const textSpan = button.querySelector('.text');
    button.classList.toggle('favorited', isFavorited);
    if (iconSpan) iconSpan.textContent = isFavorited ? '❤️' : '➕';
    if (textSpan) textSpan.textContent = isFavorited ? 'Verwijder Favoriet' : 'Voeg toe Favoriet';
    button.setAttribute('aria-label', isFavorited ? 'Verwijder uit favorieten' : 'Toevoegen aan favorieten');
}

function updateFavoriteStatusInUI(movieId) {
    const isNowFavorited = favoriteMovies.some(fav => fav.id === movieId);
    if (movieDetailModal && movieDetailModal.style.display === 'flex' && movieDetailModal.getAttribute('data-movie-id') == movieId) {
        if (modalAddFavoriteButton) updateFavoriteButton(modalAddFavoriteButton, isNowFavorited);
    }
    document.querySelectorAll(`.movie-card[data-movie-id="${movieId}"] .add-favorite-button`).forEach(button => {
        updateFavoriteButton(button, isNowFavorited);
    });
}

function displayFavorites() {
    if (!favoritesContainer) return;
    favoritesContainer.innerHTML = '';
    if (favoriteMovies.length === 0) {
        favoritesContainer.innerHTML = `
            <div class="no-content-message">
                <p>Je hebt nog geen favoriete films. Voeg films toe!</p>
                <button class="button" id="goToSearchFromFavorites">Ontdek films</button>
            </div>`;
        const btn = document.getElementById('goToSearchFromFavorites');
        if (btn) btn.addEventListener('click', () => {
            showPageSection(searchPageSection, navSearchLink);
            window.location.hash = '#search';
            if (movieContainer.children.length === 0) fetchMovies(true);
        });
        return;
    }
    favoriteMovies.forEach(movie => favoritesContainer.appendChild(createMovieCardElement(movie)));
}

function updateCurrentYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear().toString();
}

// === Thema Instellingen Logica ===
function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    localStorage.setItem('theme', theme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    if (themeSelectHeader) themeSelectHeader.value = savedTheme;
    if (themeSelectMainPage) themeSelectMainPage.value = savedTheme; // Voor consistentie, als het element bestaat
}

function handleThemeChange(event, errorElement) {
    const selectedTheme = event.target.value;
    if (!selectedTheme) { // Als de "-- Thema --" optie is geselecteerd
        if (errorElement) errorElement.style.display = 'block';
        showToast('Kies een geldig thema.', 'warning');
        return;
    }
    applyTheme(selectedTheme);
    if (errorElement) errorElement.style.display = 'none';
    showToast(`Thema ingesteld op "${selectedTheme === 'dark' ? 'Donker' : 'Licht'}".`, 'info');
    // Synchroniseer andere themakiezer indien aanwezig
    if (event.target === themeSelectHeader && themeSelectMainPage) themeSelectMainPage.value = selectedTheme;
    else if (event.target === themeSelectMainPage && themeSelectHeader) themeSelectHeader.value = selectedTheme;
}

// === Gebruikersvoorkeur (Naam) Logica ===
function loadUserName() {
    const savedName = localStorage.getItem('username');
    if (usernameInput) usernameInput.value = savedName || '';
    if (greetingElement) {
        greetingElement.textContent = savedName ? `Hallo, ${savedName}! Welkom terug.` : 'Voer je naam in voor een persoonlijke touch.';
    }
}

function handleNameFormSubmit(event) {
    event.preventDefault();
    const username = usernameInput.value.trim();
    if (username) {
        localStorage.setItem('username', username);
        if (greetingElement) greetingElement.textContent = `Hallo, ${username}! Welkom bij Filmder.`;
        showToast(`Naam opgeslagen: ${username}`, 'success');
    } else {
        if (greetingElement) greetingElement.textContent = 'Vul aub je naam in.';
        localStorage.removeItem('username');
        showToast('Naam mag niet leeg zijn.', 'warning');
    }
}

// === Zoekpagina & Hoofdpagina Zoeklogica ===
function performSearch(query) { // Voor zoekpagina
    currentSearchQuery = query;
    currentPage = 1; totalPages = 1;
    if (query.length > 0 && query.length < 2) {
        displaySearchError(searchError, 'Geef minstens 2 tekens in.');
        clearMovieContainer();
        if(loadMoreTrigger) loadMoreTrigger.style.display = 'none';
        return;
    }
    if (searchError) searchError.style.display = 'none';
    fetchMovies(true);
}

function performMainPageSearch(query) { // Voor hoofdpagina zoekbalk
    if (query.length > 0 && query.length < 2) {
        displaySearchError(searchErrorMainPage, 'Minimaal 2 tekens.', 3000);
        return;
    }
    if (searchErrorMainPage) searchErrorMainPage.style.display = 'none';
    if (searchInput) searchInput.value = query;
    showPageSection(searchPageSection, navSearchLink);
    window.location.hash = '#search';
    performSearch(query); // Gebruik de zoekpagina's zoekfunctie
}

// === Hoofdpagina Secties Logica ===
async function fetchAndDisplaySectionMovies(endpoint, params, container, limit, errorMessage) {
    if (!container) return;
    const data = await fetchFromTMDB(endpoint, { ...params, page: 1 });
    if (data && data.results) {
        container.innerHTML = ''; // Leeg container voor nieuwe films (of placeholders)
        displayMovies(data.results.slice(0, limit), container);
        if (data.results.length === 0) {
            container.innerHTML = `<p class="info-message">Geen films voor deze sectie.</p>`;
        }
    } else {
        container.innerHTML = `<p class="error-message">${errorMessage}</p>`;
    }
}

async function initializeMainPageSections() {
    if (popularMoviesContainer) await fetchAndDisplaySectionMovies('/discover/movie', { sort_by: 'popularity.desc' }, popularMoviesContainer, 10, 'Populaire films konden niet geladen worden.');
    if (latestMoviesContainer) await fetchAndDisplaySectionMovies('/discover/movie', { sort_by: 'primary_release_date.desc', 'primary_release_date.lte': new Date().toISOString().split('T')[0] }, latestMoviesContainer, 10, 'Nieuwste films konden niet geladen worden.');

    if (allGenres.length === 0) await fetchGenres(); // Zorg dat genres beschikbaar zijn

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
}

// === Event Listeners Setup ===
function setupEventListeners() {
    if (navSearchLink) navSearchLink.addEventListener('click', (e) => { e.preventDefault(); showPageSection(searchPageSection, navSearchLink); window.location.hash = '#search'; if (movieContainer.children.length === 0) performSearch(searchInput.value.trim() || ''); });
    if (navFavoritesLink) navFavoritesLink.addEventListener('click', (e) => { e.preventDefault(); showPageSection(favoritesPageSection, navFavoritesLink); window.location.hash = '#favorites'; displayFavorites(); });
    if (navLogo) navLogo.addEventListener('click', (e) => { e.preventDefault(); showPageSection(mainPageSection, null); window.location.hash = '#home'; initializeMainPageSections(); });

    if (themeSelectHeader) themeSelectHeader.addEventListener('change', (event) => handleThemeChange(event, themeErrorHeader));
    if (themeSelectMainPage) themeSelectMainPage.addEventListener('change', (event) => handleThemeChange(event, themeErrorMainPage));
    
    if (nameForm) nameForm.addEventListener('submit', handleNameFormSubmit);

    if (searchButton) searchButton.addEventListener('click', () => performSearch(searchInput.value.trim()));
    if (searchInput) searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); performSearch(searchInput.value.trim()); } });
    if (searchButtonMainPage) searchButtonMainPage.addEventListener('click', () => performMainPageSearch(searchInputMainPage.value.trim()));
    if (searchInputMainPage) searchInputMainPage.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); performMainPageSearch(searchInputMainPage.value.trim()); } });

    if (genreSelect) genreSelect.addEventListener('change', (e) => { currentGenre = e.target.value; currentPage = 1; fetchMovies(true); });
    if (sortSelect) sortSelect.addEventListener('change', (e) => { currentSortBy = e.target.value; currentPage = 1; fetchMovies(true); });

    if (backToTopButton) { window.addEventListener('scroll', handleBackToTopButton); backToTopButton.addEventListener('click', scrollToTop); }
    if (modalCloseButton) modalCloseButton.addEventListener('click', closeMovieDetailModal);
    if (movieDetailModal) movieDetailModal.addEventListener('click', (e) => { if (e.target === movieDetailModal) closeMovieDetailModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && movieDetailModal && movieDetailModal.style.display === 'flex') closeMovieDetailModal(); });

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
    
    // Event listeners voor specifieke "Bekijk alle [genre]" knoppen
    document.querySelectorAll('.discover-genre-button').forEach(button => {
        button.addEventListener('click', () => {
            const genreName = button.dataset.genreName;
            const targetGenre = allGenres.find(g => g.name.toLowerCase() === genreName.toLowerCase());
            if (targetGenre) {
                currentSearchQuery = ''; currentGenre = targetGenre.id; currentSortBy = 'popularity.desc';
                if (searchInput) searchInput.value = '';
                if (genreSelect) genreSelect.value = targetGenre.id;
                if (sortSelect) sortSelect.value = currentSortBy;
                showPageSection(searchPageSection, navSearchLink); window.location.hash = '#search';
                fetchMovies(true);
            } else {
                showToast(`Genre "${genreName}" niet geconfigureerd.`, 'warning');
                // Fallback: ga naar algemene zoekpagina
                currentSearchQuery = ''; currentGenre = ''; currentSortBy = 'popularity.desc';
                if (searchInput) searchInput.value = ''; if (genreSelect) genreSelect.value = ''; if (sortSelect) sortSelect.value = 'popularity.desc';
                showPageSection(searchPageSection, navSearchLink); window.location.hash = '#search'; fetchMovies(true);
            }
        });
    });
    
    // Klikbare "Load More" trigger
    if (loadMoreTrigger) {
        loadMoreTrigger.addEventListener('click', () => {
            if (!isLoading && currentPage < totalPages) {
                currentPage++;
                fetchMovies(false);
            } else if (currentPage >= totalPages && !isLoading) { // Alleen toasten als niet al aan het laden is
                showToast('Alle films zijn al geladen.', 'info');
            }
        });
    }
}

// === Intersection Observer & Routering & Initialisatie ===
const setupIntersectionObserver = () => {
    if (observer) observer.disconnect();
    if (!loadMoreTrigger) return;
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isLoading && currentPage < totalPages) {
                currentPage++;
                fetchMovies(false);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });
    observer.observe(loadMoreTrigger);
};

const handleHashChange = async () => {
    const hash = window.location.hash || '#home';
    if (allGenres.length === 0 && (hash === '#home' || hash.startsWith('#search') || hash.startsWith('#discover'))) { // Genres nodig voor main & search
        await fetchGenres();
    }

    switch (hash) {
        case '#search':
            showPageSection(searchPageSection, navSearchLink);
            if (movieContainer.children.length === 0) performSearch(searchInput.value.trim() || '');
            break;
        case '#favorites':
            showPageSection(favoritesPageSection, navFavoritesLink);
            displayFavorites();
            break;
        case '#home':
        default:
            showPageSection(mainPageSection, null);
            if (window.location.hash !== '#home' && window.location.hash !== '') window.location.hash = '#home';
            await initializeMainPageSections();
            break;
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    updateCurrentYear();
    loadTheme();
    loadUserName();
    setupEventListeners(); // Eerst listeners, dan hash afhandelen
    await handleHashChange(); // Verwerk initiële hash, laadt genres indien nodig
    setupIntersectionObserver();
    window.addEventListener('hashchange', handleHashChange);
});