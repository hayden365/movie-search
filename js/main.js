// https://www.omdbapi.com/?i=tt3896198&apikey=7035c60c

const movieSearch = document.getElementById('movie-search');
const mainList = document.getElementById('main-list');
const resultGrid = document.getElementById('result-container');
const result = document.getElementById('result');
const loading = document.getElementById('main-loading');
const detailsLoading = document.getElementById('details-loading');

//검색창에서 한글자씩 input할때마다 감지
movieSearch.addEventListener('input', (e) => {
  let title = e.target.value;
  console.log(title);

  //로딩화면
  loading.classList.remove('hidden');
  setTimeout(hideLoading, 1500);

  function hideLoading() {
    loading.classList.add('hidden');
    getMovies(title);
  }
  if (title.length < 3) {
    mainList.innerHTML = '';
  }
});

//api에서 영화 데이터 가져오기
async function getMovies(title) {
  const URL = `https://omdbapi.com/?s=${title}&page=1&apikey=7035c60c`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  const pageLength = Math.ceil(data.totalResults / 10) || 0;
  //2페이지
  const URL2 = `https://omdbapi.com/?s=${title}&page=2&apikey=7035c60c`;
  const res2 = await fetch(`${URL2}`);
  const data2 = await res2.json();
  //3페이지
  const URL3 = `https://omdbapi.com/?s=${title}&page=3&apikey=7035c60c`;
  const res3 = await fetch(`${URL3}`);
  const data3 = await res3.json();
  //페이지 길이가 1페이지 이하일때는 그대로 불러오기
  if (pageLength <= 1 && data.Response == 'True') displayMovieList(data.Search);
  //페이지길이가 2페이지 이상일때는 3페이지까지 불러오기
  else if (pageLength >= 2) {
    displayMovieList([...data.Search, ...data2.Search]);
  } else if (pageLength >= 3) {
    displayMovieList([...data.Search, ...data2.Search, ...data3.Search]);
  }

  console.log(pageLength);
  //search글자수가 2개 이상이지만 데이터가 없다면 화면 비우기&모달창
  if (title.length > 2 && pageLength == 0) {
    mainList.innerHTML = '';
  }
}

//불러온 영화목록을 movie-list-item에 담아주기
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
  mainListMovies.forEach((movie) => {
    movie.addEventListener('click', async () => {
      const result = await fetch(
        `https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=7035c60c`
      );
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
