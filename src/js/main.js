// API sleutel voor The Movie Database (TMDB)
const API_KEY = '3dc52d407bf54ef45f6f26cfb3bbc07a';
// Basis-URL voor het zoeken naar films
const API_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=nl-NL&query=`;
// URL voor populaire films bij het laden van de pagina
const POPULAR_MOVIES_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=nl-NL`;


// Elementen uit de DOM ophalen
const searchInput = document.getElementById('search-input');
const genreSelect = document.getElementById('genre-select');
const sortSelect = document.getElementById('sort-select');
const movieContainer = document.getElementById('movie-container');
const favoritesContainer = document.getElementById('favorites-container');
const messageArea = document.getElementById('message-area'); // Nieuw: meldingen aan de gebruiker

/**
 * Toont een tijdelijke melding aan de gebruiker.
 * @param {string} message - Het bericht dat getoond moet worden.
 * @param {string} type - Het type melding ('success' of 'error').
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
  try {
    let url;
    if (query) {
      url = `${API_URL}${encodeURIComponent(query)}`; // Zoeken met query
    } else {
      url = POPULAR_MOVIES_URL; // Populaire films als geen query is gegeven
    }

    const response = await fetch(url);
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

  if (movies.length === 0) {
    container.innerHTML = '<p>Geen films gevonden...</p>';
    return;
  }

  movies.forEach(movie => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');

    // Genereer de HTML voor elke filmkaart
    movieElement.innerHTML = `
      <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=Geen+Afbeelding'}" alt="${movie.title}" />
      <h3>${movie.title}</h3>
      <p>Release: ${movie.release_date || 'Onbekend'}</p>
      <p>Beoordeling: ${movie.vote_average ? movie.vote_average.toFixed(1) : 'Onbekend'}</p>
      ${showAddButton ? '<button class="add-favorite">➕ Favoriet</button>' : '<button class="remove-favorite">🗑 Verwijder</button>'}
    `;

    // Voeg event listener toe voor de favorietenknop
    if (showAddButton) {
      movieElement.querySelector('.add-favorite').addEventListener('click', () => {
        addToFavorites(movie);
      });
    } else {
      movieElement.querySelector('.remove-favorite').addEventListener('click', () => {
        removeFromFavorites(movie.id);
      });
    }

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

// Event listeners voor zoek-, genre- en sorteerfunctionaliteit
genreSelect.addEventListener('change', () => {
  const query = searchInput.value.trim();
  const genreId = genreSelect.value;
  fetchMovies(query, genreId);
});

searchInput.addEventListener('input', () => { // Gebruik 'input' voor real-time zoeken
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
  // Controleer of de film al in de favorieten staat
  const exists = favorites.some(fav => fav.id === movie.id);
  if (!exists) {
    favorites.push({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average
    });
    localStorage.setItem('favorites', JSON.stringify(favorites));
    showMessage(`'${movie.title}' is toegevoegd aan je favorieten!`, 'success');
    renderFavorites(); // Werk de favorietenlijst bij na toevoegen
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
  renderFavorites(); // Werk de favorietenlijst bij na verwijderen
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
  // Gebruik displayMovies om de favorieten weer te geven zonder de "voeg toe" knop
  displayMovies(favorites, favoritesContainer, false);
  if (favorites.length === 0) {
      favoritesContainer.innerHTML = '<p>Nog geen favoriete films hier.</p>';
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
    case 'release_desc': // Nieuwste eerst
      return movies.sort((a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0)); // Datum parsing veiliger maken
    case 'release_asc': // Oudste eerst
      return movies.sort((a, b) => new Date(a.release_date || 0) - new Date(b.release_date || 0));
    case 'rating_desc': // Hoogste beoordeling eerst
      return movies.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    case 'rating_asc': // Laagste beoordeling eerst
      return movies.sort((a, b) => (a.vote_average || 0) - (b.vote_average || 0));
    default:
      return movies;
  }
}

// Initialiseer de pagina bij het laden
window.onload = () => {
  populateGenreDropdown(); // Vul de genre-dropdown
  fetchMovies(); // Haal de initiële films op (populaire films)
  renderFavorites(); // Toon de favorieten bij het laden
};