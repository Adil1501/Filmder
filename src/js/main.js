const API_KEY = '3dc52d407bf54ef45f6f26cfb3bbc07a';
const API_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;

// Haal genres op
async function fetchGenres() {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`);
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error('Fout bij ophalen genres:', error);
    return [];
  }
}

// Haal films op
async function fetchMovies(query = '', genreId = '') {
  try {
    const url = `${API_URL}${query}`;
    const response = await fetch(url);
    const data = await response.json();
    let results = data.results;

    if (genreId) {
      results = results.filter(movie => movie.genre_ids.includes(parseInt(genreId)));
    }

    const sortValue = document.getElementById('sort-select')?.value;
    if (sortValue) {
      results = sortMovies(results, sortValue);
    }
    displayMovies(results);    
  } catch (err) {
    console.error('Fout bij ophalen films:', err);
  }
}

// Toon films
function displayMovies(movies) {
  const movieContainer = document.getElementById('movie-container');
  movieContainer.innerHTML = '';

  if (movies.length === 0) {
    movieContainer.innerHTML = '<p>Geen films gevonden...</p>';
    return;
  }

  movies.forEach(movie => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');

    movieElement.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
      <h3>${movie.title}</h3>
      <p>Release: ${movie.release_date}</p>
      <p>Beoordeling: ${movie.vote_average}</p>
      <button class="add-favorite">➕ Favoriet</button>
    `;

    movieElement.querySelector('.add-favorite').addEventListener('click', () => {
      addToFavorites(movie);
      renderFavorites(); // Werk favorieten bij na toevoegen
    });

    movieContainer.appendChild(movieElement);
  });
}

// Voeg genres toe aan dropdown
async function populateGenreDropdown() {
  const genres = await fetchGenres();
  const genreSelect = document.getElementById('genre-select');

  genres.forEach(genre => {
    const option = document.createElement('option');
    option.value = genre.id;
    option.textContent = genre.name;
    genreSelect.appendChild(option);
  });
}

// Event listeners
document.getElementById('genre-select').addEventListener('change', () => {
  const query = document.getElementById('search-input').value.trim();
  const genreId = document.getElementById('genre-select').value;
  fetchMovies(query, genreId);
});

document.getElementById('search-input').addEventListener('input', () => {
  const query = document.getElementById('search-input').value.trim();
  const genreId = document.getElementById('genre-select').value;
  fetchMovies(query, genreId);
});

document.getElementById('sort-select').addEventListener('change', () => {
  const query = document.getElementById('search-input').value.trim();
  const genreId = document.getElementById('genre-select').value;
  fetchMovies(query, genreId);
});


// Favorieten functies
function addToFavorites(movie) {
  const favorites = getFavorites();
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
  }
}

function removeFromFavorites(movieId) {
  let favorites = getFavorites();
  favorites = favorites.filter(movie => movie.id !== movieId);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderFavorites();
}

function getFavorites() {
  const favorites = localStorage.getItem('favorites');
  return favorites ? JSON.parse(favorites) : [];
}

function renderFavorites() {
  const favoritesContainer = document.getElementById('favorites-container');
  favoritesContainer.innerHTML = '';

  const favorites = getFavorites();
  if (favorites.length === 0) {
    favoritesContainer.innerHTML = '<p>Geen favoriete films...</p>';
  } else {
    favorites.forEach(movie => {
      const movieElement = document.createElement('div');
      movieElement.classList.add('movie');

      movieElement.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
        <h3>${movie.title}</h3>
        <p>Release: ${movie.release_date}</p>
        <p>Beoordeling: ${movie.vote_average}</p>
        <button onclick="removeFromFavorites(${movie.id})">🗑 Verwijder</button>
      `;

      favoritesContainer.appendChild(movieElement);
    });
  }
}

function sortMovies(movies, criteria) {
  switch (criteria) {
    case 'release_desc':
      return movies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    case 'release_asc':
      return movies.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
    case 'rating_desc':
      return movies.sort((a, b) => b.vote_average - a.vote_average);
    case 'rating_asc':
      return movies.sort((a, b) => a.vote_average - b.vote_average);
    default:
      return movies;
  }
}


// Bij het laden van de pagina
window.onload = () => {
  populateGenreDropdown();
  fetchMovies();
  renderFavorites();
};