
const BASE_URL = "https://fsa-puppy-bowl.herokuapp.com/api/2506-SMITHCHAD";
const PLAYERS_URL = `${BASE_URL}/players`;

const playersContainer = document.getElementById("puppy-list");
const detailsContainer = document.getElementById("details-container");
const form = document.getElementById("puppy-form");


async function fetchAllPlayers() {
  try {
    const response = await fetch(PLAYERS_URL);
    const data = await response.json();
    return data.data.players;
  } catch (err) {
    console.error("Error fetching players:", err);
  }
}


async function fetchSinglePlayer(id) {
  try {
    const response = await fetch(`${PLAYERS_URL}/${id}`);
    const data = await response.json();
    return data.data.player;
  } catch (err) {
    console.error("Error fetching player:", err);
  }
}

async function addNewPlayer(name, breed) {
  try {
    const defaultImage = "https://learndotresources.s3.amazonaws.com/workshop/60ad725bbe74cd0004a6cba0/puppybowl-default-dog.png";
    const response = await fetch(PLAYERS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, breed, imageUrl: defaultImage }),
    });
    const data = await response.json();
    return data.data.newPlayer;
  } catch (err) {
    console.error("Error adding player:", err);
  }
}


async function removePlayer(id) {
  try {
    await fetch(`${PLAYERS_URL}/${id}`, { method: "DELETE" });
  } catch (err) {
    console.error("Error removing player:", err);
  }
}


async function renderAllPlayers() {
  const players = await fetchAllPlayers();
  playersContainer.innerHTML = "";

  players.forEach((p) => {
    const card = document.createElement("div");
    card.classList.add("player-card");

    card.innerHTML = `
      <img src="${p.imageUrl}" alt="${p.name}" />
      <h3>${p.name}</h3>
    `;

    card.addEventListener("click", async () => {
      const details = await fetchSinglePlayer(p.id);
      renderSinglePlayer(details);
    });

    playersContainer.appendChild(card);
  });
}


function renderSinglePlayer(player) {
  detailsContainer.innerHTML = `
    <img src="${player.imageUrl}" alt="${player.name}" />
    <h3>${player.name}</h3>
    <p><strong>ID:</strong> ${player.id}</p>
    <p><strong>Breed:</strong> ${player.breed}</p>
    <p><strong>Status:</strong> ${player.status}</p>
    <p><strong>Team:</strong> ${player.team?.name || "Unassigned"}</p>
    <button id="remove-btn">Remove from Roster</button>
  `;

  const removeBtn = document.getElementById("remove-btn");
  removeBtn.addEventListener("click", async () => {
    await removePlayer(player.id);
    detailsContainer.innerHTML = "Please select a puppy.";
    renderAllPlayers();
  });
}


form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const breed = form.breed.value.trim();
  if (!name || !breed) return;

  await addNewPlayer(name, breed);
  form.reset();
  renderAllPlayers();
});

renderAllPlayers();
