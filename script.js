/**
 * Movie Search - OMDb API integration
 * Get a free API key at https://www.omdbapi.com/apikey.aspx
 */

const OMDb_BASE = "https://www.omdbapi.com/";

// Replace with your OMDb API key (required for the app to work)
// Use ONLY the key string (e.g. "9ca11366"), NOT the full URL from the OMDb site
const API_KEY = "9ca11366";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchHint = document.getElementById("searchHint");
const placeholder = document.getElementById("placeholder");
const movieCard = document.getElementById("movieCard");
const errorMessage = document.getElementById("errorMessage");
const loadingSpinner = document.getElementById("loadingSpinner");
const suggestionsList = document.getElementById("suggestionsList");

const SUGGESTION_DEBOUNCE_MS = 320;
const MIN_QUERY_LENGTH = 2;
let suggestionDebounceTimer = null;
let currentSuggestions = [];
let activeSuggestionIndex = -1;

/**
 * Show one UI state and hide others
 */
function showState(placeholdershow, cardShow, errorShow, loadingShow) {
  placeholder.hidden = !placeholdershow;
  movieCard.hidden = !cardShow;
  errorMessage.hidden = !errorShow;
  loadingSpinner.hidden = !loadingShow;
}

/**
 * Display error text to the user
 */
function showError(message) {
  errorMessage.innerHTML = `<p>${escapeHtml(message)}</p>`;
  showState(false, false, true, false);
}

/**
 * Escape HTML to prevent XSS when inserting API data into DOM
 */
function escapeHtml(text) {
  if (text == null || text === "") return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Fetch search suggestions from OMDb (list of movies by search term)
 * @param {string} query - Search query
 * @returns {Promise<Object>} - JSON with Search array
 */
function fetchSearchSuggestions(query) {
  const params = new URLSearchParams({
    s: query.trim(),
    apikey: API_KEY,
  });
  const url = `${OMDb_BASE}?${params.toString()}`;
  return fetch(url).then((res) => {
    if (res.status === 401) throw new Error("Invalid API key.");
    if (!res.ok) throw new Error(`Network error: ${res.status}`);
    return res.json();
  });
}

/**
 * Fetch full movie details by IMDb ID
 * @param {string} imdbId - e.g. tt0133093
 * @returns {Promise<Object>} - Full movie object
 */
function fetchMovieByImdbId(imdbId) {
  const params = new URLSearchParams({
    i: imdbId,
    apikey: API_KEY,
  });
  const url = `${OMDb_BASE}?${params.toString()}`;
  return fetch(url).then((response) => {
    if (response.status === 401) {
      throw new Error(
        "Invalid API key. Use only your key in script.js. Get a key at https://www.omdbapi.com/apikey.aspx"
      );
    }
    if (!response.ok) throw new Error(`Network error: ${response.status}`);
    return response.json();
  });
}

/**
 * Fetch movie by title from OMDb API
 * @param {string} title - Movie title to search
 * @returns {Promise<Object>} - Parsed JSON response
 */
function fetchMovieByTitle(title) {
  const params = new URLSearchParams({
    t: title.trim(),
    apikey: API_KEY,
  });
  const url = `${OMDb_BASE}?${params.toString()}`;
  return fetch(url).then((response) => {
    if (response.status === 401) {
      throw new Error(
        "Invalid API key. Use only your key (e.g. abc12345) in script.js, not the full URL. Get a key at https://www.omdbapi.com/apikey.aspx"
      );
    }
    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }
    return response.json();
  });
}

/**
 * Build and display the movie card from API data
 * @param {Object} data - OMDb API response object
 */
function displayMovie(data) {
  if (data.Response === "False") {
    showError(data.Error || "Movie not found. Try another title.");
    return;
  }

  const title = data.Title || "Unknown";
  const year = data.Year || "—";
  const imdbId = data.imdbID && data.imdbID !== "N/A" ? data.imdbID : "";
  const rating = data.imdbRating && data.imdbRating !== "N/A" ? data.imdbRating : "—";
  const posterUrl = data.Poster && data.Poster !== "N/A" ? data.Poster : "";
  const plot = data.Plot && data.Plot !== "N/A" ? data.Plot : "No plot available.";
  const genre = data.Genre && data.Genre !== "N/A" ? data.Genre : "—";
  const director = data.Director && data.Director !== "N/A" ? data.Director : "—";
  const actors = data.Actors && data.Actors !== "N/A" ? data.Actors : "—";
  const runtime = data.Runtime && data.Runtime !== "N/A" ? data.Runtime : "—";

  const trailerQuery = encodeURIComponent(`${title} ${year} official trailer`);
  const trailerUrl = `https://www.youtube.com/results?search_query=${trailerQuery}`;
  const justWatchQuery = encodeURIComponent(title);
  const justWatchUrl = `https://www.justwatch.com/us/search?q=${justWatchQuery}`;
  const imdbUrl = imdbId ? `https://www.imdb.com/title/${escapeHtml(imdbId)}/` : "";

  movieCard.innerHTML = `
    <div class="movie-card-inner">
      <div class="movie-poster-wrap">
        <img
          class="movie-poster"
          src="${posterUrl}"
          alt="Poster for ${escapeHtml(title)}"
          loading="lazy"
          onerror="this.src=''; this.alt='No poster available';"
        >
      </div>
      <div class="movie-details">
        <h2 class="movie-title">${escapeHtml(title)}</h2>
        <div class="movie-meta">
          <span>${escapeHtml(year)}</span>
          <span class="movie-rating">${escapeHtml(rating)}</span>
          ${runtime !== "—" ? `<span>${escapeHtml(runtime)}</span>` : ""}
        </div>
        <p class="movie-plot">${escapeHtml(plot)}</p>
        <ul class="movie-info-list">
          <li><span class="label">Genre</span> ${escapeHtml(genre)}</li>
          <li><span class="label">Director</span> ${escapeHtml(director)}</li>
          <li><span class="label">Actors</span> ${escapeHtml(actors)}</li>
        </ul>
        <div class="movie-actions">
          <a href="${trailerUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-trailer">🎬 Watch trailer</a>
          <a href="${justWatchUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-watch">📺 Where to watch / stream</a>
          ${imdbUrl ? `<a href="${imdbUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-imdb">IMDb page</a>` : ""}
        </div>
      </div>
    </div>
  `;

  showState(false, true, false, false);
}

function hideSuggestions() {
  suggestionsList.hidden = true;
  suggestionsList.innerHTML = "";
  suggestionsList.removeAttribute("aria-expanded");
  searchInput.removeAttribute("aria-activedescendant");
  currentSuggestions = [];
  activeSuggestionIndex = -1;
}

function showSuggestions() {
  suggestionsList.hidden = false;
  searchInput.setAttribute("aria-expanded", "true");
}

/**
 * Render suggestion list (array of { Title, Year, imdbID, Poster })
 */
function renderSuggestions(items, isLoading, isEmpty) {
  const displayed = (items || []).slice(0, 8);
  currentSuggestions = displayed;
  activeSuggestionIndex = -1;
  if (isLoading) {
    suggestionsList.innerHTML = '<div class="suggestions-loading">Searching...</div>';
    showSuggestions();
    return;
  }
  if (isEmpty || !items || items.length === 0) {
    suggestionsList.innerHTML = '<div class="suggestions-empty">No movies found. Keep typing.</div>';
    showSuggestions();
    return;
  }
  suggestionsList.innerHTML = items
    .slice(0, 8)
    .map(
      (movie, index) => {
        const title = escapeHtml(movie.Title || "Unknown");
        const year = escapeHtml(movie.Year || "");
        const poster = movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "";
        const id = `suggestion-${index}`;
        return `<button type="button" class="suggestion-item" role="option" id="${id}" data-imdb-id="${escapeHtml(movie.imdbID || "")}" data-index="${index}">
          <img src="${poster}" alt="" onerror="this.onerror=null;this.src='';">
          <span class="suggestion-item-content">
            <span class="suggestion-item-title">${title}</span>
            <span class="suggestion-item-year">${year}</span>
          </span>
        </button>`;
      }
    )
    .join("");
  showSuggestions();
}

function runSuggestionSearch() {
  const query = searchInput.value.trim();
  if (query.length < MIN_QUERY_LENGTH) {
    hideSuggestions();
    return;
  }
  renderSuggestions([], true);
  fetchSearchSuggestions(query)
    .then((data) => {
      if (data.Response === "False" || !data.Search || data.Search.length === 0) {
        renderSuggestions([], false, true);
        return;
      }
      renderSuggestions(data.Search, false);
    })
    .catch(() => {
      renderSuggestions([], false, true);
    });
}

function selectSuggestion(imdbId) {
  if (!imdbId) return;
  hideSuggestions();
  searchInput.value = "";
  showState(false, false, false, true);
  searchHint.textContent = "Loading movie...";
  fetchMovieByImdbId(imdbId)
    .then((data) => {
      searchHint.textContent = 'Try "Avengers", "Inception", or "The Matrix"';
      displayMovie(data);
    })
    .catch((err) => {
      searchHint.textContent = 'Try "Avengers", "Inception", or "The Matrix"';
      showError(err.message || "Something went wrong.");
    });
}

/**
 * Run search: get user input, call API, show loading/result/error
 */
function searchMovie() {
  const movieName = searchInput.value.trim();
  if (!movieName) {
    searchHint.textContent = "Please enter a movie name.";
    return;
  }

  if (API_KEY === "YOUR_OMDb_API_KEY" || !API_KEY || API_KEY.trim() === "") {
    showError(
      "API key not set. Get a free key at https://www.omdbapi.com/apikey.aspx and set API_KEY in script.js"
    );
    return;
  }

  showState(false, false, false, true);
  searchHint.textContent = `Searching for "${movieName}"...`;

  fetchMovieByTitle(movieName)
    .then((data) => {
      searchHint.textContent = 'Try "Avengers", "Inception", or "The Matrix"';
      displayMovie(data);
    })
    .catch((err) => {
      searchHint.textContent = 'Try "Avengers", "Inception", or "The Matrix"';
      showError(err.message || "Something went wrong. Please try again.");
    });
}

// Search on button click
searchBtn.addEventListener("click", () => {
  hideSuggestions();
  searchMovie();
});

// Search on Enter key in the input (only if suggestions not active)
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (activeSuggestionIndex >= 0 && currentSuggestions[activeSuggestionIndex]) {
      e.preventDefault();
      selectSuggestion(currentSuggestions[activeSuggestionIndex].imdbID);
      return;
    }
    hideSuggestions();
    searchMovie();
    return;
  }
  if (e.key === "Escape") {
    hideSuggestions();
    searchInput.blur();
    return;
  }
  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (currentSuggestions.length === 0) return;
    activeSuggestionIndex = Math.min(activeSuggestionIndex + 1, currentSuggestions.length - 1);
    updateActiveSuggestion();
    return;
  }
  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (currentSuggestions.length === 0) return;
    activeSuggestionIndex = Math.max(activeSuggestionIndex - 1, -1);
    updateActiveSuggestion();
    return;
  }
});

function updateActiveSuggestion() {
  suggestionsList.querySelectorAll(".suggestion-item").forEach((el, i) => {
    el.classList.toggle("suggestion-item--active", i === activeSuggestionIndex);
    if (i === activeSuggestionIndex) {
      el.scrollIntoView({ block: "nearest" });
      searchInput.setAttribute("aria-activedescendant", el.id);
    }
  });
}

// Suggestions dropdown: click on an option
suggestionsList.addEventListener("click", (e) => {
  const item = e.target.closest(".suggestion-item");
  if (!item) return;
  const imdbId = item.getAttribute("data-imdb-id");
  selectSuggestion(imdbId);
});

// Debounced live suggestions while typing
searchInput.addEventListener("input", () => {
  if (searchHint.textContent !== 'Try "Avengers", "Inception", or "The Matrix"') {
    searchHint.textContent = 'Try "Avengers", "Inception", or "The Matrix"';
  }
  clearTimeout(suggestionDebounceTimer);
  suggestionDebounceTimer = setTimeout(runSuggestionSearch, SUGGESTION_DEBOUNCE_MS);
});

// Close suggestions when clicking outside
document.addEventListener("click", (e) => {
  if (
    !searchInput.contains(e.target) &&
    !suggestionsList.contains(e.target) &&
    !searchBtn.contains(e.target)
  ) {
    hideSuggestions();
  }
});

// Start background video (helps when autoplay is restricted)
const bgVideo = document.querySelector(".bg-video");
if (bgVideo) {
  bgVideo.play().catch(() => {});
}
