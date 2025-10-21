const cardContainer = document.querySelector('[data-js="card-container"]');
const searchForm = document.querySelector('[data-js="search-bar"]'); // ✅ the <form>
const searchInput = document.querySelector('.search-bar__input'); // ✅ the input
const navigation = document.querySelector('[data-js="navigation"]');
const prevButton = document.querySelector('[data-js="button-prev"]');
const nextButton = document.querySelector('[data-js="button-next"]');
const pagination = document.querySelector('[data-js="pagination"]');

// States
let maxPage = 1;
let page = 1;
let searchQuery = "";

// ✅ Fetch characters with pagination + search
async function fetchCharacters() {
  try {
    const url = `https://rickandmortyapi.com/api/character?page=${page}${
      searchQuery ? `&name=${encodeURIComponent(searchQuery)}` : ""
    }`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Update max page
    maxPage = data.info.pages;

    // Update pagination
    pagination.textContent = `${page} / ${maxPage}`;

    // Clear and render character cards
    cardContainer.innerHTML = "";
    data.results.forEach((character) => {
      const card = document.createElement("li");
      card.classList.add("card");
      card.innerHTML = `
        <div class="card__image-container">
          <img class="card__image" src="${character.image}" alt="${character.name}" />
          <div class="card__image-gradient"></div>
        </div>
        <div class="card__content">
          <h2 class="card__title">${character.name}</h2>
          <dl class="card__info">
            <dt class="card__info-title">Status</dt>
            <dd class="card__info-description">${character.status}</dd>
            <dt class="card__info-title">Species</dt>
            <dd class="card__info-description">${character.species}</dd>
            <dt class="card__info-title">Occurrences</dt>
            <dd class="card__info-description">${character.episode.length}</dd>
          </dl>
        </div>
      `;
      cardContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching characters:", error);
    cardContainer.innerHTML = `<li><p>No characters found.</p></li>`;
    pagination.textContent = "0 / 0";
  }
}

// ✅ Pagination buttons
nextButton.addEventListener("click", () => {
  if (page < maxPage) {
    page++;
    fetchCharacters();
  }
});

prevButton.addEventListener("click", () => {
  if (page > 1) {
    page--;
    fetchCharacters();
  }
});

// ✅ Search form submit
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchQuery = searchInput.value.trim(); // get search text
  page = 1; // reset page to 1
  fetchCharacters();
});

// ✅ Initial fetch
fetchCharacters();

