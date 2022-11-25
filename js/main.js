// https://www.omdbapi.com/?i=tt3896198&apikey=7035c60c
const ajax = new XMLHttpRequest();
const movieSearch = document.getElementById('movie-search');
const mainList = document.getElementById('main-list');
const resultGrid = document.getElementById('result-container');
const result = document.getElementById('result');
const loading = document.getElementById('main-loading');
const detailsLoading = document.getElementById('details-loading');
const URL = 'https://www.omdbapi.com/?apikey=7035c60c';
const store = {
	currentPage: 1,
};

function enterkeySearch() {
	if (window.event.keyCode === 13) {
		let searchTerm = movieSearch.value;
		console.log(searchTerm);
		getMovies(searchTerm);
		if (searchTerm === '') mainList.innerHTML = '';
	}
}

//api에서 영화 데이터 가져오기
async function getMovies(title, year = '', page = 1) {
	const s = `&s=${title}`;
	const y = `&y=${year}`;
	const p = `&page=${page}`;
	const res = await fetch(`https://omdbapi.com/?apikey=7035c60c${s}${y}${p}`);
	const json = await res.json();
	if (json.Response === 'True') {
		const { Search: movies, totalResults } = json;
		displayMovieList(movies);
	}
	return json.Error;
}

//불러온 영화목록을 movie-list-item에 담아주기
function displayMovieList(movies) {
	mainList.innerHTML = '';
	for (let idx = (store.currentPage - 1) * 10; idx < store.currentPage * 10; idx++) {
		let movieListItem = document.createElement('div');
		movieListItem.dataset.id = movies[idx].imdbID;
		movieListItem.classList.add('main-list-item');
		movieListItem.innerHTML = `<a href="javascript:void(0)" class="main-list-item__link">
      <div class="title-poster">
        <picture class="title-poster__image">
          <img alt="${movies[idx].Title}" src="${
			movies[idx].Poster !== 'N/A'
				? movies[idx].Poster
				: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80'
		}" loading="eager" class="picture__${movies[idx].imdbID}" />
        </picture>
      </div>
    </a>`;
		mainList.appendChild(movieListItem);
	}

	loadMovieDetails();
}

//상세페이지를 위해서 api에서 데이터 불러오기
function loadMovieDetails() {
	const mainListMovies = mainList.querySelectorAll('.main-list-item');
	mainListMovies.forEach(movie => {
		movie.addEventListener('click', async () => {
			const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=7035c60c`);
			const movieDetails = await result.json();
			//상세화면 로딩보이기
			detailsLoading.classList.remove('hidden');
			mainList.classList.add('hidden');
			resultGrid.classList.remove('hidden');
			setTimeout(hideAndPrint, 500);
			function hideAndPrint() {
				detailsLoading.classList.add('hidden');
				//로딩 후 결과화면 보이도록
				displayMovieDetails(movieDetails);
			}
		});
	});
}

//상세페이지
function displayMovieDetails(movie) {
	//검색결과화면은 숨기고 상세페이지 표시
	result.innerHTML = `
  <div class="movie-poster">
  <img
    src= "${
			movie.Poster !== 'N/A'
				? movie.Poster
				: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80'
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

	//상세페이지 클릭시 다시 검색결과 화면으로
	resultGrid.addEventListener('click', () => {
		if (mainList.classList.contains('hidden')) {
			//상세화면 초기화
			result.innerHTML = '';
			mainList.classList.remove('hidden');
			resultGrid.classList.add('hidden');
		}
	});
}

//IntersectionObserver

var intersectionObserver = new IntersectionObserver(function (entries) {
	if (entries[0].intersectionRatio <= 0) return;
});
