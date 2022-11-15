// https://www.omdbapi.com/?i=tt3896198&apikey=bcafafa5

const movieSearch = document.getElementById('movie-search');
const mainList = document.getElementById('main-list');
const resultGrid = document.getElementById('result-container');
const result = document.getElementById('result');

movieSearch.addEventListener('input', (e) => {
  let title = e.target.value;
  console.log(title);
  getMovies(title);
});

async function getMovies(title, page) {
  const URL = `https://omdbapi.com/?s=${title}&page=${page}&apikey=bcafafa5`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  const pageLength = parseInt(data.totalResults / 10) || 0;
  console.log(pageLength);
  if (pageLength <= 1 && data.Response == 'True')
    return displayMovieList(data.Search);
  else if (pageLength > 1) {
    const URL2 = `https://omdbapi.com/?s=${title}&page=2&apikey=bcafafa5`;
    const res2 = await fetch(`${URL2}`);
    const data2 = await res2.json();

    const URL3 = `https://omdbapi.com/?s=${title}&page=3  &apikey=bcafafa5`;
    const res3 = await fetch(`${URL3}`);
    const data3 = await res3.json();

    displayMovieList([...data.Search, ...data2.Search, ...data3.Search]);
  }
}

function displayMovieList(movies) {
  mainList.innerHTML = '';
  for (let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement('div');
    movieListItem.classList.add('main-list-item');
    movieListItem.innerHTML = `<a href="javascript:void(0)" class="main-list-item__link">
      <div class="title-poster">
        <picture class="title-poster__image">
          <img alt="${movies[idx].Title}" src="${
      movies[idx].Poster !== 'N/A'
        ? movies[idx].Poster
        : './images/image_not_found.png'
    }" loading="eager" class="picture__${movies[idx].imdbID}" />
        </picture>
      </div>
    </a>`;
    mainList.appendChild(movieListItem);
  }
  loadMovieDetails();
}

function loadMovieDetails() {
  const mainListMovies = mainList.querySelectorAll('.main-list-item');
  mainListMovies.forEach((movie) => {
    movie.addEventListener('click', async () => {
      const result = await fetch(
        `https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=bcafafa5`
      );
      const movieDetails = await result.json();
      displayMovieDetails(movieDetails);
    });
  });
}
function displayMovieDetails(movie) {
  resultGrid.classList.remove('hidden');
  mainList.classList.add('hidden');
  result.innerHTML = `
  <div class="movie-poster">
  <img
    src= "${
      movie.Poster !== 'N/A' ? movie.Poster : './images/image_not_found.png'
    }"
    alt="movie-poster"
  />
</div>
<div class="movie-info">
  <h3 class="movie-title">${movie.Title}</h3>
  <ul class="movie-more-info">
    <li class="year">Year: ${movie.Year}</li>
    <li class="rated">Ratings: ${movie.Rated}</li>
    <li class="released">Released: ${movie.Released}</li>
  </ul>
  <p class="genre"><b>Genre:</b> ${movie.Genre}</p>
  <p class="writer">
    <b>Writer:</b> ${movie.Writer}
  </p>
  <p class="actor">
    <b>Actors:</b> ${movie.Actors}
  </p>
  <p class="plot">
    <b>Plot:</b> ${movie.Plot}
  </p>
  <p class="language"><b>Language:</b> ${movie.Language}</p>
  <p class="awards">
    <b
      ><i class="fas fa-award"></i> ${movie.Awards}</b
    >
  </p>
</div>`;
  resultGrid.addEventListener('click', () => {
    if (mainList.classList.contains('hidden')) {
      mainList.classList.remove('hidden');
      resultGrid.classList.add('hidden');
    }
  });
}
