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

async function getMovies(title) {
  const pageOne = await fetch(
    `https://omdbapi.com/?s=${title}&apikey=bcafafa5&page=1`
  )
    .then((res) => res.json())
    .catch((error) => console.log(error));
  const pageTwo = await fetch(
    `https://omdbapi.com/?s=${title}&apikey=bcafafa5&page=2`
  )
    .then((res) => res.json())
    .catch((error) => console.log(error));
  const pageThree = await fetch(
    `https://omdbapi.com/?s=${title}&apikey=bcafafa5&page=3`
  )
    .then((res) => res.json())
    .catch((error) => console.log(error));
  const pages = [...pageOne.Search,...pageTwo.Search,...pageThree.Search].map((movie)=>movie.imdbID)
  return displayMovieList(pages)

function displayMovieList(movies) {
  mainList.innerHTML = '';
  for (let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement('div');
    movieListItem.dataset.id = movies[idx].imdbID;
    movieListItem.classList.add('main-list-item');
    movieListItem.innerHTML = `<a href="javascript:void(0)" class="main-list-item__link">
      <div class="title-poster">
        <picture class="title-poster__image">
          <img alt="${movies[idx].Title}" src="${
      movies[idx].Poster !== 'N/A'
        ? movies[idx].Poster
        : 'images/image_not_found.png'
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
      movie.Poster !== 'N/A' ? movie.Poster : 'images/image_not_found.png'
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

