// https://www.omdbapi.com/?i=tt3896198&apikey=bcafafa5

const movieSearch = document.getElementById('movie-search');
const posterList = document.getElementById('poster-list');
const resultGrid = document.getElementById('result');

async function loadMovies(searchTerm) {
  const URL = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=bcafafa5`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  // console.log(data.Search);
  if (data.Response === 'True') displayMovieList(data);
}

function findMovies() {
  let searchTerm = movieSearch.value.trim();
  if (searchTerm.length > 0) {
    loadMovies(searchTerm);
  }
}

function displayMovieList(movies) {
  posterList.innerHTML = '';
  for (let idx = 0; idx < movies.lgnth; idx++) {
    let movieListItem = document.createElement('div');
    movieListItem.dataset.id = movies[idx].imdbID;
    movieListItem.classList.add('search-list-item');
    if (movies[idx].Poster !== 'N/A') moviePoster = movies[idx].Poster;
    else moviePoster = './image/image_not_found.png';
    movieListItem.innerHTML = `
    <div class="movie-poster">
    <img src="${moviePoster}" alt="" />
    </div>
    <div class="movie-info">
      <h3>${movies[idx].Title}</h3>
      <p>${movies[idx].Year}</p>
    </div>`;
    posterList.appendChild(movieListItem);
  }
}
