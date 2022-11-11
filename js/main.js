// https://www.omdbapi.com/?i=tt3896198&apikey=bcafafa5

const movieSearch = document.getElementById('movie-search');
const mainList = document.getElementById('main-list');
const resultGrid = document.getElementById('result');

movieSearch.addEventListener('input', (e) => {
  let searchTerm = e.target.value;
  console.log(searchTerm);
  getMovies(searchTerm);
});

async function getMovies(searchTerm) {
  const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=bcafafa5`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  console.log(data.Search);
  if (data.Response == 'True') return displayMovieList(data.Search);
}

function displayMovieList(movies) {
  mainList.innerHTML = '';
  for (let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement('div');
    movieListItem.dataset.id = movies[idx].Title;
    movieListItem.classList.add('main-list-item');
    // if (`${movies[idx].Poster}` === 'N/A') {
    //   var img = document.querySelector(`picture__${movies[idx].imdbID}`);
    //   img.src = './images/image_not_found.png';
    // }
    movieListItem.innerHTML = `<a href="javascript:void(0)" class="main-list-item__link">
      <div class="title-poster">
        <picture class="title-poster__image">
          <img alt="${movies[idx].Title}" src="${movies[idx].Poster}" loading="eager" class="picture__${movies[idx].imdbID}" />
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
      console.log(movie.dataset.id);
      resultGrid.classList.remove('hidden');
      mainList.classList.add('hidden');
    });
  });
  resultGrid.addEventListener('click', () => {
    if (mainList.classList.contains('hidden')) {
      mainList.classList.remove('hidden');
      resultGrid.classList.add('hidden');
    }
  });
}
