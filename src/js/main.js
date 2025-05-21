// API sleutel voor The Movie Database (TMDB)
const API_KEY = '3dc52d407bf54ef45f6f26cfb3bbc07a';
// Basis-URL voor het zoeken naar films
const API_SEARCH_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=nl-NL&query=`;
// URL voor populaire films bij het laden van de pagina
const POPULAR_MOVIES_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=nl-NL`;
// Basis-URL voor het ophalen van filmdetails
const API_DETAIL_URL = `https://api.themoviedb.org/3/movie/`;


// Elementen uit de DOM ophalen
const searchInput = document.getElementById('search-input');
const genreSelect = document.getElementById('genre-select');
const sortSelect = document.getElementById('sort-select');
const movieContainer = document.getElementById('movie-container');
const favoritesContainer = document.getElementById('favorites-container');
const messageArea = document.getElementById('message-area');
const loadingIndicator = document.getElementById('loading-indicator');
const mainContent = document.getElementById('main-content'); // Niet direct gebruikt, maar kan voor toekomstige lay-out nuttig zijn
const movieDetailContainer = document.getElementById('movie-detail');
const detailContent = document.getElementById('detail-content');
const backToSearchButton = document.getElementById('back-to-search');


/**
 * Toont of verbergt de laadindicator.
 * @param {boolean} show - True om te tonen, false om te verbergen.
 */
function showLoadingIndicator(show) {
  if (show) {
    loadingIndicator.classList.add('show');
  } else {
    loadingIndicator.classList.remove('show');
  }
}

/**
 * Toont een tijdelijke melding aan de gebruiker.
 * @param {string} message - Het bericht dat getoond moet worden.
 * @param {string} type - Het type melding ('success', 'error', 'info').
 */
function showMessage(message, type = 'info') {
  messageArea.textContent = message;
  messageArea.className = `message-area ${type}`; // Voegt stylingklasse toe
  setTimeout(() => {
    messageArea.textContent = ''; // Maak bericht leeg na 3 seconden
    messageArea.className = 'message-area'; // Reset de stylingklasse
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
 */
async function fetchMovies(query = '', genreId = '') {
  showLoadingIndicator(true); // Toon laadindicator
  hideMovieDetail(); // Verberg detailweergave bij nieuwe zoekopdracht
  showMovieContainer(); // Zorg dat de hoofd filmcontainer zichtbaar is

  try {
    let url;
    if (query) {
      url = `${API_SEARCH_URL}${encodeURIComponent(query)}`; // Zoeken met query
    } else {
      url = POPULAR_MOVIES_URL; // Populaire films als geen query is gegeven
    }

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP fout! Status: ${response.status}`);
    }
    const data = await response.json();
    let results = data.results;

    // Filteren op genre indien een genre is geselecteerd
    if (genreId) {
      results = results.filter(movie => movie.genre_ids && movie.genre_ids.includes(parseInt(genreId)));
    }

    // Sorteren op basis van het geselecteerde sorteercriterium
    const sortValue = sortSelect?.value;
    if (sortValue) {
      results = sortMovies(results, sortValue);
    }

    displayMovies(results, movieContainer, true); // Geef aan dat dit de hoofdfilmcontainer is
    if (results.length === 0) {
        showMessage('Geen films gevonden met deze criteria.', 'info');
    }
  } catch (err) {
    console.error('Fout bij ophalen films:', err);
    showMessage('Er is een fout opgetreden bij het laden van films. Probeer het later opnieuw.', 'error');
  } finally {
    showLoadingIndicator(false); // Verberg laadindicator, ongeacht succes of fout
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
  container.innerHTML = ''; // Maak de container leeg

  if (movies.length === 0 && showAddButton) {
    container.innerHTML = '<p>Geen films gevonden...</p>';
    return;
  }

  movies.forEach(movie => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');
    movieElement.dataset.movieId = movie.id;

    // Controleer op ontbrekende poster en gebruik een placeholder
    const imageUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=Geen+Afbeelding';
    const releaseDate = movie.release_date || 'Onbekend';
    const voteAverage = movie.vote_average ? movie.vote_average.toFixed(1) : 'Onbekend';

    movieElement.innerHTML = `
      <img src="${imageUrl}" alt="${movie.title}" onerror="this.onerror=null; this.src='https://via.placeholder.com/500x750?text=Afbeelding+niet+gevonden';" />
      <h3>${movie.title}</h3>
      <p>Release: ${releaseDate}</p>
      <p>Beoordeling: ${voteAverage}</p>
      ${showAddButton ? '<button class="add-favorite">➕ Favoriet</button>' : '<button class="remove-favorite">🗑 Verwijder</button>'}
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

    movieElement.addEventListener('click', () => showMovieDetail(movie.id));
    container.appendChild(movieElement);
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

// Event listeners
genreSelect.addEventListener('change', () => {
  const query = searchInput.value.trim();
  const genreId = genreSelect.value;
  fetchMovies(query, genreId);
});

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim();
  const genreId = genreSelect.value;
  fetchMovies(query, genreId);
});

sortSelect.addEventListener('change', () => {
  const query = searchInput.value.trim();
  const genreId = genreSelect.value;
  fetchMovies(query, genreId);
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
 * Rendert de favoriete films in de favorietencontainer.
 */
function renderFavorites() {
  const favorites = getFavorites();
  displayMovies(favorites, favoritesContainer, false);
  if (favorites.length === 0) {
      favoritesContainer.innerHTML = `
        <p>Nog geen favoriete films hier.</p>
        <p>Voeg films toe vanuit de zoekresultaten door op '➕ Favoriet' te klikken.</p>
      `;
  }
}

/**
 * Sorteert een array van films op basis van opgegeven criteria.
 * @param {Array} movies - De array met filmobjecten.
 * @param {string} criteria - Het sorteercriterium (e.g., 'release_desc', 'rating_asc').
 * @returns {Array} De gesorteerde array van films.
 */
function sortMovies(movies, criteria) {
  switch (criteria) {
    case 'release_desc':
      return movies.sort((a, b) => new Date(b.release_date || '0') - new Date(a.release_date || '0'));
    case 'release_asc':
      return movies.sort((a, b) => new Date(a.release_date || '0') - new Date(b.release_date || '0'));
    case 'rating_desc':
      return movies.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    case 'rating_asc':
      return movies.sort((a, b) => (a.vote_average || 0) - (b.vote_average || 0));
    default:
      return movies;
  }
}

/**
 * Toont de detailweergave van een film.
 * @param {number} movieId - De ID van de film die getoond moet worden.
 */
async function showMovieDetail(movieId) {
    hideMovieContainer();
    showLoadingIndicator(true);

    const movie = await fetchMovieDetail(movieId);

    if (movie) {
        const imageUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=Geen+Afbeelding';
        const releaseDate = movie.release_date || 'Onbekend';
        const voteAverage = movie.vote_average ? movie.vote_average.toFixed(1) : 'Onbekend';
        const overview = movie.overview || 'Geen samenvatting beschikbaar.';
        const genres = movie.genres && movie.genres.length > 0 ? movie.genres.map(g => g.name).join(', ') : 'Onbekend';

        detailContent.innerHTML = `
            <img src="${imageUrl}" alt="${movie.title}" onerror="this.onerror=null; this.src='https://via.placeholder.com/500x750?text=Afbeelding+niet+gevonden';" />
            <h2>${movie.title}</h2>
            <p><strong>Release:</strong> ${releaseDate}</p>
            <p><strong>Beoordeling:</strong> ${voteAverage}</p>
            <p><strong>Genre(s):</strong> ${genres}</p>
            <p><strong>Samenvatting:</strong> ${overview}</p>
            <button class="add-favorite" data-movie-id="${movie.id}">➕ Favoriet</button>
        `;

        // Controleer of de film al in favorieten staat en pas de knoptekst aan
        const favorites = getFavorites();
        const isFavorite = favorites.some(fav => fav.id === movie.id);
        const favoriteButton = detailContent.querySelector('.add-favorite');
        if (isFavorite) {
            favoriteButton.textContent = '✔️ Toegevoegd aan favorieten';
            favoriteButton.disabled = true; // Maak de knop inactief
            favoriteButton.style.backgroundColor = '#6c757d'; // Grijze kleur voor inactief
            favoriteButton.style.cursor = 'not-allowed';
        } else {
            favoriteButton.textContent = '➕ Favoriet';
            favoriteButton.disabled = false;
            favoriteButton.style.backgroundColor = '#28a745';
            favoriteButton.style.cursor = 'pointer';
        }


        favoriteButton.addEventListener('click', () => {
            addToFavorites(movie);
            // Update knopstatus direct na toevoegen
            favoriteButton.textContent = '✔️ Toegevoegd aan favorieten';
            favoriteButton.disabled = true;
            favoriteButton.style.backgroundColor = '#6c757d';
            favoriteButton.style.cursor = 'not-allowed';
        });

        movieDetailContainer.style.display = 'flex'; // Toon de detailcontainer als flex
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
}

/**
 * Toont de filmcontainer (zoekresultaten).
 */
function showMovieContainer() {
    movieContainer.style.display = 'grid';
}

/**
 * Verbergt de film detailweergave.
 */
function hideMovieDetail() {
    movieDetailContainer.style.display = 'none';
}

// Event listener voor de 'Terug naar zoekresultaten' knop
backToSearchButton.addEventListener('click', () => {
    hideMovieDetail();
    showMovieContainer();
    // Laad de laatst gezochte/populaire films opnieuw
    const query = searchInput.value.trim();
    const genreId = genreSelect.value;
    fetchMovies(query, genreId);
});

// Initialiseer de pagina bij het laden
window.onload = () => {
  populateGenreDropdown();
  fetchMovies();
  renderFavorites();
};