// Profielen laden
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
const odinBtn = document.getElementById("odin-btn");
const nielBtn = document.getElementById("niel-btn");
const switchBtn = document.getElementById("switch-player");
const resetBtn = document.getElementById("reset-scores");

// Events
odinBtn.onclick = () => selectPlayer("Odin");
nielBtn.onclick = () => selectPlayer("Niel");
switchBtn.onclick = switchPlayer;
resetBtn.onclick = resetScores;

// Speler kiezen
function selectPlayer(name) {
    currentPlayer = name;

    localStorage.setItem("currentPlayer", currentPlayer);
    localStorage.setItem("profiles", JSON.stringify(profiles));

    playerSelectionEl.style.display = "none";
    currentPlayerEl.style.display = "block";

    updateUI();
}

// UI update
function updateUI() {
    if (!currentPlayer) return;

    playerNameEl.textContent = currentPlayer;
    playerScoreEl.textContent = profiles[currentPlayer].score;
}

// 🔄 Wissel speler
function switchPlayer() {
    currentPlayer = "";
    localStorage.removeItem("currentPlayer");

    playerSelectionEl.style.display = "block";
    currentPlayerEl.style.display = "none";
}

// 🗑 Reset scores
function resetScores() {
    profiles = {
        "Odin": { score: 0 },
        "Niel": { score: 0 }
    };

    localStorage.setItem("profiles", JSON.stringify(profiles));

    updateUI();
}

// Bij laden
if (currentPlayer) {
    playerSelectionEl.style.display = "none";
    currentPlayerEl.style.display = "block";
    updateUI();
}
