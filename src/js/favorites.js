const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
const favoriteContainer = document.getElementById('favorite-movies');

if (favorites.length === 0) {
  favoriteContainer.innerHTML = '<p>Je hebt nog geen favoriete films opgeslagen.</p>';
} else {
  favorites.forEach(movie => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');

    movieElement.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
      <h3>${movie.title}</h3>
      <p>Release: ${movie.release_date}</p>
      <p>Beoordeling: ${movie.vote_average}</p>
      <button onclick="removeFavorite(${movie.id})">🗑 Verwijder</button>
    `;

    favoriteContainer.appendChild(movieElement);
  });
}

window.removeFavorite = function(id) {
  let updatedFavorites = favorites.filter(movie => movie.id !== id);
  localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  location.reload(); // Pagina herladen na verwijdering
};