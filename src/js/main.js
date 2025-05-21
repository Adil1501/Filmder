// API sleutel voor The Movie Database (TMDB)
const API_KEY = '3dc52d407bf54ef45f6f26cfb3bbc07a';
// Basis-URL voor het zoeken naar films
const API_SEARCH_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=nl-NL&query=`;
// URL voor populaire films bij het laden van de pagina
const POPULAR_MOVIES_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=nl-NL`;
// Basis-URL voor het ophalen van filmdetails
const API_DETAIL_URL = `https://api.themoviedb.org/3/movie/`;
// Basis-URL voor afbeeldingen van TMDB
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';


// Elementen uit de DOM ophalen
const searchInput = document.getElementById('search-input');
const genreSelect = document.getElementById('genre-select');
const sortSelect = document.getElementById('sort-select');
const movieContainer = document.getElementById('movie-container');
const favoritesContainer = document.getElementById('favorites-container');
const messageArea = document.getElementById('message-area');
const loadingIndicator = document.getElementById('loading-indicator');
const mainContent = document.getElementById('main-content');
const movieDetailContainer = document.getElementById('movie-detail');
const detailContent = document.getElementById('detail-content');
const backToSearchButton = document.getElementById('back-to-search');

// Paginering elementen
const paginationControls = document.getElementById('pagination-controls');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const pageInfoSpan = document.getElementById('page-info');

// Favorieten zoek- en sorteer elementen
const favoritesSearchInput = document.getElementById('favorites-search-input');
const favoritesSortSelect = document.getElementById('favorites-sort-select');
const clearFavoritesButton = document.getElementById('clear-favorites-button');


// Globale variabelen voor paginering en zoekstatus
let currentPage = 1;
let totalPages = 1;
let currentSearchQuery = '';
let currentGenreId = '';


/**
 * Toont of verbergt de laadindicator.
 * @param {boolean} show - True om te tonen, false om te verbergen.
 */
function showLoadingIndicator(show) {
  if (show) {
    loadingIndicator.classList.add('show');
    loadingIndicator.setAttribute('aria-hidden', 'false');
  } else {
    loadingIndicator.classList.remove('show');
    loadingIndicator.setAttribute('aria-hidden', 'true');
  }
}

/**
 * Toont een tijdelijke melding aan de gebruiker.
 * @param {string} message - Het bericht dat getoond moet worden.
 * @param {string} type - Het type melding ('success', 'error', 'info').
 */
function showMessage(message, type = 'info') {
  messageArea.textContent = message;
  messageArea.className = `message-area ${type}`;
  messageArea.setAttribute('aria-live', 'polite');
  setTimeout(() => {
    messageArea.textContent = '';
    messageArea.className = 'message-area';
    messageArea.removeAttribute('aria-live');
  }, 3000);
}

/**
 * Haalt de lijst met filmgenres op van de TMDB API.
 * @returns {Promise<Array>} Een array met genre-objecten.
 */
async function fetchGenres() {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=nl-NL`);
    if (!response.ok) {
        throw new Error(`HTTP fout! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error('Fout bij ophalen genres:', error);
    showMessage('Fout bij het laden van genres. Probeer opnieuw.', 'error');
    return [];
  }
}

/**
 * Haalt films op basis van een zoekterm en genre-ID, of populaire films indien leeg.
 * Sorteert de resultaten indien een sorteercriterium is geselecteerd.
 * @param {string} query - De zoekterm voor films.
 * @param {string} genreId - De ID van het geselecteerde genre.
 * @param {number} page - Het paginanummer dat moet worden opgehaald.
 */
async function fetchMovies(query = '', genreId = '', page = 1) {
  showLoadingIndicator(true);
  hideMovieDetail();
  showMovieContainer();
  paginationControls.style.display = 'none';

  currentSearchQuery = query;
  currentGenreId = genreId;
  currentPage = page;

  try {
    let url;
    if (query) {
      url = `${API_SEARCH_URL}${encodeURIComponent(query)}&page=${page}`;
    } else {
      url = `${POPULAR_MOVIES_URL}&page=${page}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP fout! Status: ${response.status}`);
    }
    const data = await response.json();
    let results = data.results;
    totalPages = data.total_pages;

    // Filteren op genre indien een genre is geselecteerd
    if (genreId) {
      results = results.filter(movie => movie.genre_ids && movie.genre_ids.includes(parseInt(genreId)));
    }

    // Sorteren op basis van het geselecteerde sorteercriterium (hoofdzoekopdracht)
    const sortValue = sortSelect?.value;
    if (sortValue) {
      results = sortMovies(results, sortValue);
    }

    displayMovies(results, movieContainer, true);
    updatePaginationControls();

    if (results.length === 0 && !query && !genreId) {
        showMessage('Geen films gevonden. Probeer een andere zoekterm.', 'info');
        paginationControls.style.display = 'none';
    } else if (results.length === 0 && (query || genreId)) {
        showMessage('Geen films gevonden met deze criteria.', 'info');
        paginationControls.style.display = 'none';
    }
    else {
        paginationControls.style.display = 'flex';
    }

  } catch (err) {
    console.error('Fout bij ophalen films:', err);
    showMessage('Er is een fout opgetreden bij het laden van films. Probeer het later opnieuw.', 'error');
    movieContainer.innerHTML = '<p>Kon geen films laden. Probeer het later opnieuw.</p>';
    paginationControls.style.display = 'none';
  } finally {
    showLoadingIndicator(false);
  }
}

/**
 * Haalt de details van een specifieke film op.
 * @param {number} movieId - De ID van de film waarvan de details moeten worden opgehaald.
 * @returns {Promise<Object>} Het filmobject met details.
 */
async function fetchMovieDetail(movieId) {
    showLoadingIndicator(true);
    try {
        const url = `${API_DETAIL_URL}${movieId}?api_key=${API_KEY}&language=nl-NL`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP fout! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Fout bij ophalen filmdetails voor ID ${movieId}:`, error);
        showMessage('Kon filmdetails niet laden. Probeer later opnieuw.', 'error');
        return null;
    } finally {
        showLoadingIndicator(false);
    }
}

/**
 * Toont een lijst met films in de opgegeven container.
 * @param {Array} movies - Een array met filmobjecten.
 * @param {HTMLElement} container - Het DOM-element waarin de films moeten worden weergegeven.
 * @param {boolean} showAddButton - Geeft aan of de 'voeg toe aan favorieten' knop getoond moet worden.
 */
function displayMovies(movies, container, showAddButton) {
  container.innerHTML = '';

  if (movies.length === 0 && showAddButton) {
    container.innerHTML = '<p>Geen films gevonden...</p>';
    return;
  }

  movies.forEach(movie => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');
    movieElement.dataset.movieId = movie.id;
    movieElement.setAttribute('tabindex', '0');
    movieElement.setAttribute('role', 'article');

    // Gebruik de 'loading="lazy"' attribuut voor lazy loading
    const imageUrl = movie.poster_path ? `${IMAGE_BASE_URL}w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=Geen+Afbeelding';
    const placeholderUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Tiny transparent GIF

    const releaseDate = movie.release_date || 'Onbekend';
    const voteAverage = movie.vote_average ? movie.vote_average.toFixed(1) : 'Onbekend';

    movieElement.innerHTML = `
      <img src="${placeholderUrl}" data-src="${imageUrl}" alt="Poster voor ${movie.title}" loading="lazy" onerror="this.onerror=null; this.src='https://via.placeholder.com/500x750?text=Afbeelding+niet+gevonden';" />
      <h3>${movie.title}</h3>
      <p>Release: ${releaseDate}</p>
      <p>Beoordeling: ${voteAverage}</p>
      ${showAddButton ? `<button class="add-favorite" aria-label="Voeg ${movie.title} toe aan favorieten">➕ Favoriet</button>` : `<button class="remove-favorite" aria-label="Verwijder ${movie.title} uit favorieten">🗑 Verwijder</button>`}
    `;

    const favoriteButton = movieElement.querySelector('.add-favorite') || movieElement.querySelector('.remove-favorite');
    if (favoriteButton) {
      favoriteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        if (showAddButton) {
          addToFavorites(movie);
        } else {
          removeFromFavorites(movie.id);
        }
      });
    }

    movieElement.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        showMovieDetail(movie.id);
      }
    });
    movieElement.addEventListener('click', () => showMovieDetail(movie.id));
    container.appendChild(movieElement);
  });

  // Observeer de afbeeldingen voor lazy loading
  observeImages();
}

/**
 * Initialiseert Intersection Observer voor lazy loading van afbeeldingen.
 */
function observeImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}


/**
 * Vult de dropdown met genres.
 */
async function populateGenreDropdown() {
  const genres = await fetchGenres();
  genres.forEach(genre => {
    const option = document.createElement('option');
    option.value = genre.id;
    option.textContent = genre.name;
    genreSelect.appendChild(option);
  });
}

// Event listeners voor hoofdzoek-, genre- en sorteerfunctionaliteit
// Gebruik een debounce-functie voor searchInput om API calls te beperken
let searchTimeout;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage = 1;
    fetchMovies(searchInput.value.trim(), genreSelect.value, currentPage);
  }, 300); // Wacht 300ms na de laatste input
});

genreSelect.addEventListener('change', () => {
  currentPage = 1;
  fetchMovies(searchInput.value.trim(), genreSelect.value, currentPage);
});

sortSelect.addEventListener('change', () => {
  fetchMovies(searchInput.value.trim(), genreSelect.value, currentPage);
});


/**
 * Voegt een film toe aan de favorieten in localStorage.
 * @param {Object} movie - Het filmobject om toe te voegen.
 */
function addToFavorites(movie) {
  const favorites = getFavorites();
  const exists = favorites.some(fav => fav.id === movie.id);
  if (!exists) {
    favorites.push({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      overview: movie.overview,
      genre_ids: movie.genre_ids
    });
    localStorage.setItem('favorites', JSON.stringify(favorites));
    showMessage(`'${movie.title}' is toegevoegd aan je favorieten!`, 'success');
    renderFavorites();
  } else {
    showMessage(`'${movie.title}' staat al in je favorieten.`, 'info');
  }
}

/**
 * Verwijdert een film uit de favorieten in localStorage.
 * @param {number} movieId - De ID van de film die verwijderd moet worden.
 */
function removeFromFavorites(movieId) {
  let favorites = getFavorites();
  const movieToRemove = favorites.find(movie => movie.id === movieId);
  favorites = favorites.filter(movie => movie.id !== movieId);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  if (movieToRemove) {
      showMessage(`'${movieToRemove.title}' is verwijderd uit je favorieten.`, 'success');
  }
  renderFavorites();
}

/**
 * Haalt de lijst met favoriete films op uit localStorage.
 * @returns {Array} Een array met favoriete filmobjecten.
 */
function getFavorites() {
  const favorites = localStorage.getItem('favorites');
  return favorites ? JSON.parse(favorites) : [];
}

/**
 * Rendert de favoriete films in de favorietencontainer, inclusief zoek- en sorteerfunctionaliteit.
 * Controleert ook of de 'Wis alle favorieten' knop moet worden getoond/verborgen.
 */
function renderFavorites() {
  let favorites = getFavorites();

  // Filteren op zoekterm voor favorieten
  // Gebruik debounce voor favorieten zoekveld
  let favoritesSearchTimeout;
  favoritesSearchInput.removeEventListener('input', renderFavorites); // Voorkom dubbele listeners
  favoritesSearchInput.addEventListener('input', () => {
    clearTimeout(favoritesSearchTimeout);
    favoritesSearchTimeout = setTimeout(() => {
        renderFavoritesInternal(getFavorites()); // Roep interne functie aan om favorites array te updaten
    }, 300);
  });
  
  // Direct renderen voor sorteerwijzigingen
  favoritesSortSelect.removeEventListener('change', renderFavorites); // Voorkom dubbele listeners
  favoritesSortSelect.addEventListener('change', () => renderFavoritesInternal(getFavorites()));

  renderFavoritesInternal(favorites); // Initieel renderen
}

/**
 * Interne functie om favorieten te renderen na filteren/sorteren.
 * @param {Array} allFavorites - De volledige lijst met favorieten.
 */
function renderFavoritesInternal(allFavorites) {
    let filteredAndSortedFavorites = [...allFavorites]; // Werk met een kopie

    const searchTerm = favoritesSearchInput.value.trim().toLowerCase();
    if (searchTerm) {
        filteredAndSortedFavorites = filteredAndSortedFavorites.filter(movie =>
            (movie.title && movie.title.toLowerCase().includes(searchTerm)) ||
            (movie.overview && movie.overview.toLowerCase().includes(searchTerm))
        );
    }

    const sortCriteria = favoritesSortSelect.value;
    if (sortCriteria) {
        filteredAndSortedFavorites = sortMovies(filteredAndSortedFavorites, sortCriteria);
    }

    displayMovies(filteredAndSortedFavorites, favoritesContainer, false);

    if (allFavorites.length > 0) {
        clearFavoritesButton.style.display = 'block';
        clearFavoritesButton.disabled = false;
    } else {
        clearFavoritesButton.style.display = 'none';
        clearFavoritesButton.disabled = true;
    }

    if (filteredAndSortedFavorites.length === 0 && allFavorites.length > 0) {
        favoritesContainer.innerHTML = `
            <p>Geen favorieten gevonden met deze zoekterm of sorteercriteria.</p>
        `;
    } else if (allFavorites.length === 0) {
        favoritesContainer.innerHTML = `
            <p>Nog geen favoriete films hier.</p>
            <p>Voeg films toe vanuit de zoekresultaten door op '➕ Favoriet' te klikken.</p>
        `;
    }
}


// Event listener voor de 'Wis alle favorieten' knop
clearFavoritesButton.addEventListener('click', () => {
    if (confirm('Weet je zeker dat je AL je favoriete films wilt wissen? Dit kan niet ongedaan gemaakt worden.')) {
        localStorage.removeItem('favorites');
        showMessage('Alle favorieten zijn gewist.', 'success');
        renderFavorites(); // Update de weergave
    }
});


/**
 * Sorteert een array van films op basis van opgegeven criteria.
 * @param {Array} movies - De array met filmobjecten.
 * @param {string} criteria - Het sorteercriterium (e.g., 'release_desc', 'rating_asc').
 * @returns {Array} De gesorteerde array van films.
 */
function sortMovies(movies, criteria) {
  const sortedMovies = [...movies];
  switch (criteria) {
    case 'release_desc':
      return sortedMovies.sort((a, b) => new Date(b.release_date || '0') - new Date(a.release_date || '0'));
    case 'release_asc':
      return sortedMovies.sort((a, b) => new Date(a.release_date || '0') - new Date(b.release_date || '0'));
    case 'rating_desc':
      return sortedMovies.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    case 'rating_asc':
      return sortedMovies.sort((a, b) => (a.vote_average || 0) - (b.vote_average || 0));
    default:
      return sortedMovies;
  }
}

/**
 * Toont de detailweergave van een film.
 * @param {number} movieId - De ID van de film die getoond moet worden.
 */
async function showMovieDetail(movieId) {
    hideMovieContainer();
    paginationControls.style.display = 'none';
    showLoadingIndicator(true);

    const movie = await fetchMovieDetail(movieId);

    if (movie) {
        const imageUrl = movie.poster_path ? `${IMAGE_BASE_URL}w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=Geen+Afbeelding';
        const releaseDate = movie.release_date || 'Onbekend';
        const voteAverage = movie.vote_average ? movie.vote_average.toFixed(1) : 'Onbekend';
        const overview = movie.overview || 'Geen samenvatting beschikbaar.';
        const genres = movie.genres && movie.genres.length > 0 ? movie.genres.map(g => g.name).join(', ') : 'Onbekend';

        detailContent.innerHTML = `
            <img src="${imageUrl}" alt="Poster voor ${movie.title}" onerror="this.onerror=null; this.src='https://via.placeholder.com/500x750?text=Afbeelding+niet+gevonden';" />
            <h2>${movie.title}</h2>
            <p><strong>Release:</strong> ${releaseDate}</p>
            <p><strong>Beoordeling:</strong> ${voteAverage}</p>
            <p><strong>Genre(s):</strong> ${genres}</p>
            <p><strong>Samenvatting:</strong> ${overview}</p>
            <button class="add-favorite" data-movie-id="${movie.id}" aria-label="Voeg ${movie.title} toe aan favorieten">➕ Favoriet</button>
        `;

        const favorites = getFavorites();
        const isFavorite = favorites.some(fav => fav.id === movie.id);
        const favoriteButton = detailContent.querySelector('.add-favorite');
        if (isFavorite) {
            favoriteButton.textContent = '✔️ Toegevoegd aan favorieten';
            favoriteButton.disabled = true;
            favoriteButton.style.backgroundColor = '#6c757d';
            favoriteButton.style.cursor = 'not-allowed';
            favoriteButton.setAttribute('aria-disabled', 'true');
        } else {
            favoriteButton.textContent = '➕ Favoriet';
            favoriteButton.disabled = false;
            favoriteButton.style.backgroundColor = '#28a745';
            favoriteButton.style.cursor = 'pointer';
            favoriteButton.setAttribute('aria-disabled', 'false');
        }

        favoriteButton.addEventListener('click', () => {
            addToFavorites(movie);
            favoriteButton.textContent = '✔️ Toegevoegd aan favorieten';
            favoriteButton.disabled = true;
            favoriteButton.style.backgroundColor = '#6c757d';
            favoriteButton.style.cursor = 'not-allowed';
            favoriteButton.setAttribute('aria-disabled', 'true');
        });

        movieDetailContainer.style.display = 'flex';
        movieDetailContainer.focus();
    } else {
        movieDetailContainer.style.display = 'none';
    }
    showLoadingIndicator(false);
}

/**
 * Verbergt de filmcontainer (zoekresultaten).
 */
function hideMovieContainer() {
    movieContainer.style.display = 'none';
    movieContainer.setAttribute('aria-hidden', 'true');
}

/**
 * Toont de filmcontainer (zoekresultaten).
 */
function showMovieContainer() {
    movieContainer.style.display = 'grid';
    movieContainer.setAttribute('aria-hidden', 'false');
}

/**
 * Verbergt de film detailweergave.
 */
function hideMovieDetail() {
    movieDetailContainer.style.display = 'none';
    movieDetailContainer.setAttribute('aria-hidden', 'true');
}

// Event listener voor de 'Terug naar zoekresultaten' knop
backToSearchButton.addEventListener('click', () => {
    hideMovieDetail();
    showMovieContainer();
    fetchMovies(currentSearchQuery, currentGenreId, currentPage);
    searchInput.focus();
});

// Paginering event listeners
prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchMovies(currentSearchQuery, currentGenreId, currentPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

nextPageButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        fetchMovies(currentSearchQuery, currentGenreId, currentPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

/**
 * Update de status en tekst van de paginering knoppen.
 */
function updatePaginationControls() {
    pageInfoSpan.textContent = `Pagina ${currentPage} van ${totalPages}`;
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;

    prevPageButton.setAttribute('aria-disabled', currentPage === 1);
    nextPageButton.setAttribute('aria-disabled', currentPage === totalPages);
}


// Initialiseer de pagina bij het laden
window.onload = () => {
  populateGenreDropdown();
  fetchMovies();
  renderFavorites(); // Nu wordt de lazy loading geactiveerd voor favorieten
};