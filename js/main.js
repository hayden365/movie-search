// https://www.omdbapi.com/?i=tt3896198&apikey=bcafafa5

const movieSearch = document.getElementById('movie-search');
const mainList = document.getElementById('main-list');
const resultGrid = document.getElementById('result');

movieSearch.addEventListener('input', (e) => {
  const searchTerm = e.target.value;
  getMovies(searchTerm);
});

async function getMovies(searchTerm) {
  const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=bcafafa5`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  console.log(data.Search);
  if (data.Response == 'True') return displayMovieList(data.Search);
}
console.log(getMovies('lord of the rings'));

function displayMovieList(movies) {
  mainList.innerHTML = '';
  for (let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement('div');
    movieListItem.dataset.id = movies[idx].Title;
    movieListItem.innerHTML = `<a href="javascript:void(0)" class="main-list-item__link">
      <div class="title-poster">
        <picture class="title-poster__image">
          <img alt="${movies[idx].Title}" src="${movies[idx].Poster}" loading="eager" class="picture__img" />
        </picture>
        <div class="title-poster__info">
          <h3>${movies[idx].Title}</h3>
          <span>${movies[idx].Year}</span>
        </div>
      </div>
    </a>`;

    mainList.appendChild(movieListItem);
  }
}
