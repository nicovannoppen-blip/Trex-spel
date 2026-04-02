// Woorden + afbeeldingen
const words = [
  {word:"kat", img:"assets/kat.png"},
  {word:"vis", img:"assets/vis.png"},
  {word:"boom", img:"assets/boom.png"},
  {word:"hond", img:"assets/hond.png"}
];

let currentWord = "";
let currentImage = "";
let collected = "";

const wordEl = document.getElementById("word");
const collectedEl = document.getElementById("collected");
const lettersContainer = document.getElementById("letters-container");
const messageEl = document.getElementById("message");
const scoreEl = document.getElementById("score");
const imageEl = document.getElementById("word-image");
const trex = document.getElementById("trex");

const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");

// Profielen
let profiles = JSON.parse(localStorage.getItem("profiles")) || {
    "Odin": { score: 0 },
    "Niel": { score: 0 }
};

let currentPlayer = localStorage.getItem("currentPlayer");

const playerSelectionEl = document.getElementById("player-selection");

document.getElementById("odin-btn").onclick = () => selectPlayer("Odin");
document.getElementById("niel-btn").onclick = () => selectPlayer("Niel");

function selectPlayer(name) {
    currentPlayer = name;
    localStorage.setItem("currentPlayer", currentPlayer);
    playerSelectionEl.style.display = "none";
    startGame();
}

if (currentPlayer) {
    playerSelectionEl.style.display = "none";
    startGame();
}

/* ---------- TTS ---------- */
function speak(text) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "nl-NL";
    window.speechSynthesis.speak(u);
}

function speakLetterNL(letter) {
    const phonetic = {
        "m":"em","n":"n","b":"b","p":"p","k":"k"
    };
    const u = new SpeechSynthesisUtterance(phonetic[letter] || letter);
    u.lang = "nl-NL";
    window.speechSynthesis.speak(u);
}

/* ---------- GAME ---------- */

function updateWordDisplay() {
    wordEl.innerHTML = "";
    for (let i = 0; i < currentWord.length; i++) {
        const span = document.createElement("span");

        if (i < collected.length) {
            span.classList.add("guessed");
            span.textContent = currentWord[i];
        } else {
            span.textContent = "_";
        }

        wordEl.appendChild(span);
    }
}

function startGame() {
    speak(`Welkom ${currentPlayer}! Klik de letters in de juiste volgorde.`);
    updateScoreDisplay();
    setTimeout(newWord, 2000);
}

function newWord() {
    collected = "";
    collectedEl.textContent = "";
    messageEl.textContent = "";

    const obj = words[Math.floor(Math.random() * words.length)];
    currentWord = obj.word;
    currentImage = obj.img;

    imageEl.src = currentImage;

    updateWordDisplay();

    speak("Welk woord is dit?");

    lettersContainer.innerHTML = "";

    let letters = currentWord.split("");
    const alphabet = "abcdefghijklmnopqrstuvwxyz";

    while (letters.length < currentWord.length + 3) {
        letters.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }

    letters = letters.sort(() => Math.random() - 0.5);

    letters.forEach(l => {
        const btn = document.createElement("div");
        btn.textContent = l;
        btn.classList.add("letter");

        btn.addEventListener("click", (e) => clickLetter(l, btn, e));

        lettersContainer.appendChild(btn);
    });
}

function clickLetter(letter, btn, event) {
    speakLetterNL(letter);

    // DINO beweegt naar klik
    trex.style.left = event.clientX + "px";
    trex.style.top = event.clientY + "px";

    setTimeout(() => {
        if (currentWord[collected.length] === letter) {
            collected += letter;
            collectedEl.textContent = collected;

            btn.style.visibility = "hidden";
            updateWordDisplay();

            correctSound?.play();

            if (collected === currentWord) {
                messageEl.textContent = "Goed gedaan! 🎉";

                profiles[currentPlayer].score += 10;
                localStorage.setItem("profiles", JSON.stringify(profiles));
                updateScoreDisplay();

                speak("Goed gedaan!");
                setTimeout(newWord, 1500);
            }
        } else {
            messageEl.textContent = "Fout! Probeer opnieuw.";
            speak("Fout! Probeer opnieuw.");
            wrongSound?.play();
        }
    }, 300);
}

function updateScoreDisplay() {
    scoreEl.textContent = `${currentPlayer} score: ${profiles[currentPlayer].score}`;
}

/* bladeren */
const leavesContainer = document.getElementById("leaves-container");
function createLeaf() {
    const leaf = document.createElement("div");
    leaf.classList.add("leaf");
    leaf.style.left = Math.random() * window.innerWidth + "px";
    leaf.style.animationDuration = 5 + Math.random() * 5 + "s";
    leavesContainer.appendChild(leaf);
    leaf.addEventListener("animationend", () => leaf.remove());
}
setInterval(createLeaf, 500);

/* wissel speler */
function switchPlayer() {
    localStorage.removeItem("currentPlayer");
    location.reload();
}
