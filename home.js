// Profielen Odin en Niel
let profiles = {
    "Odin": { score: 0 },
    "Niel": { score: 0 }
};

let currentPlayer = "";

const playerSelectionEl = document.getElementById("player-selection");
const currentPlayerEl = document.getElementById("current-player");
const playerNameEl = document.getElementById("player-name");
const playerScoreEl = document.getElementById("player-score");

document.getElementById("odin-btn").addEventListener("click", () => selectPlayer("Odin"));
document.getElementById("niel-btn").addEventListener("click", () => selectPlayer("Niel"));

function selectPlayer(name) {
    currentPlayer = name;
    playerSelectionEl.style.display = "none";
    currentPlayerEl.style.display = "block";
    updateScoreDisplay();
}

// Update score op homepagina
function updateScoreDisplay() {
    playerNameEl.textContent = currentPlayer;
    playerScoreEl.textContent = profiles[currentPlayer].score;
}

// Score bijwerken vanuit spellen
function setScore(newScore) {
    if (currentPlayer) {
        profiles[currentPlayer].score = newScore;
        updateScoreDisplay();
    }
}

// Optioneel: localStorage om score tussen pagina's te bewaren
// Bijv. bij redirect naar spellen kun je currentPlayer en score opslaan
localStorage.setItem("profiles", JSON.stringify(profiles));
localStorage.setItem("currentPlayer", currentPlayer);
