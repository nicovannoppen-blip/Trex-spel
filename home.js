// Profielen laden of maken
let profiles = JSON.parse(localStorage.getItem("profiles")) || {
    "Odin": { score: 0 },
    "Niel": { score: 0 }
};

let currentPlayer = localStorage.getItem("currentPlayer") || "";

// Elements
const playerSelectionEl = document.getElementById("player-selection");
const currentPlayerEl = document.getElementById("current-player");
const playerNameEl = document.getElementById("player-name");
const playerScoreEl = document.getElementById("player-score");

// Knoppen
document.getElementById("odin-btn").onclick = () => selectPlayer("Odin");
document.getElementById("niel-btn").onclick = () => selectPlayer("Niel");

function selectPlayer(name) {
    currentPlayer = name;

    localStorage.setItem("currentPlayer", currentPlayer);
    localStorage.setItem("profiles", JSON.stringify(profiles));

    playerSelectionEl.style.display = "none";
    currentPlayerEl.style.display = "block";

    updateUI();
}

function updateUI() {
    if (!currentPlayer) return;

    playerNameEl.textContent = currentPlayer;
    playerScoreEl.textContent = profiles[currentPlayer].score;
}

// Bij laden pagina
if (currentPlayer) {
    playerSelectionEl.style.display = "none";
    currentPlayerEl.style.display = "block";
    updateUI();
}
