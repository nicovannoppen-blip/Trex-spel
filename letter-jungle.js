// Woordenlijst
const words = [
  "tijger", "aap", "leeuw", "olifant", "slang", "papegaai", "kikker", "vlinder", 
  "apen", "boom", "struik", "rivier", "waterval", "lianen", "jungle", "bloem", 
  "blad", "wortel", "rots", "nevel", "zon", "regen", "regenwoud", "oerwoud", 
  "schorpioen", "spin", "mieren", "bijen", "kolibrie", "slingeren", "boomtop", 
  "groen", "dier", "vogels", "insect", "water", "slurf", "staart", "klimmen", 
  "spring", "luiaard", "panter", "cheeta", "gorilla", "tropisch", "zand", "grond", 
  "tak", "wortels", "boomstam", "schaduw", "moeras", "vijver", "libel", "spinweb", 
  "geur", "fruit", "banaan", "mango", "papaja", "ananas", "noot", "wortelstok", 
  "paradijs", "geluid", "gekraak", "geritsel", "schemering", "nacht", "dag", 
  "zonlicht", "regenbui", "mist", "vogeltje", "kikkerdril", "olifantenpad", 
  "apenrots", "waterdruppel", "druppel", "takken", "slurfbeweging", "boomschors", 
  "planten", "wortelslingers", "bos", "bamboe", "panterprint", "speurtocht", 
  "verstoppen", "schuilplaats", "luipaard", "kapokboom", "monkey", "boomvarken", 
  "rotsformatie", "rotsen", "natuur"
];

let currentWord = "";
let collected = "";

// Profielen
let currentPlayer = localStorage.getItem("currentPlayer") || "Odin";
let profiles = JSON.parse(localStorage.getItem("profiles")) || {
    "Odin": { score: 0 },
    "Niel": { score: 0 }
};

const wordEl = document.getElementById("word");
const collectedEl = document.getElementById("collected");
const lettersContainer = document.getElementById("letters-container");
const messageEl = document.getElementById("message");
const scoreEl = document.getElementById("score");

const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");

// -------------------- Player Selection --------------------
const playerSelectionEl = document.getElementById("player-selection");

document.getElementById("odin-btn").addEventListener("click", () => selectPlayer("Odin"));
document.getElementById("niel-btn").addEventListener("click", () => selectPlayer("Niel"));

function selectPlayer(name) {
    currentPlayer = name;
    playerSelectionEl.style.display = "none"; // verberg keuze
    updateScoreDisplay();
    startGame();
}

// -------------------- TTS --------------------
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "nl-NL";
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
}

// Phonetic letters voor NL
function speakLetterNL(letter) {
    const phonetic = {
        "a": "a", "b": "b", "c": "c", "d": "d", "e": "e", "f": "f",
        "g": "g", "h": "h", "i": "i", "j": "j", "k": "k", "l": "l",
        "m": "em", "n": "n", "o": "o", "p": "p", "q": "q", "r": "r",
        "s": "s", "t": "t", "u": "u", "v": "v", "w": "w", "x": "x",
        "y": "y", "z": "z"
    };
    const utterance = new SpeechSynthesisUtterance(phonetic[letter.toLowerCase()] || letter);
    utterance.lang = "nl-NL";
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
}

// -------------------- Spel functies --------------------
function updateWordDisplay() {
    wordEl.innerHTML = "";
    for (let i = 0; i < currentWord.length; i++) {
        const span = document.createElement("span");
        if (i < collected.length) {
            span.classList.add("guessed");
            span.style.fontWeight = "bold"; // Vetgedrukte geraden letters
            span.textContent = currentWord[i];
        } else {
            span.classList.add("unguessed");
            span.textContent = currentWord[i];
        }
        wordEl.appendChild(span);
    }
}

function startGame() {
    speak(`Welkom ${currentPlayer} bij Letter Jungle! Klik op de letters in de juiste volgorde om het woord te bouwen.`);
    setTimeout(newWord, 3000);
}

function newWord() {
    collected = "";
    collectedEl.textContent = collected;
    messageEl.textContent = "";

    currentWord = words[Math.floor(Math.random() * words.length)];
    updateWordDisplay();

    speak("Bouw het woord: " + currentWord);

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
        btn.addEventListener("click", () => clickLetter(l, btn));
        lettersContainer.appendChild(btn);
    });
}

function clickLetter(letter, btn) {
    speakLetterNL(letter); // uitspraak letter

    setTimeout(() => {
        if (currentWord[collected.length] === letter) {
            collected += letter;
            collectedEl.textContent = collected;
            btn.style.visibility = "hidden";
            updateWordDisplay();
            correctSound?.play();

            if (collected === currentWord) {
                messageEl.textContent = "Goed gedaan! 🎉";

                // Score bijwerken van huidige speler
                profiles[currentPlayer].score += 10;
                updateScoreDisplay();

                speak("Goed gedaan!");
                setTimeout(newWord, 1500);
            }
        } else {
            messageEl.textContent = "Fout! Probeer opnieuw.";
            speak("Fout! Probeer opnieuw.");
            wrongSound?.play();
        }
    }, 500);
}

function updateScoreDisplay() {
localStorage.setItem("profiles", JSON.stringify(profiles));    
scoreEl.textContent = `${currentPlayer} score: ${profiles[currentPlayer].score}`;
}

// -------------------- Start Bladeren animatie --------------------
const leavesContainer = document.getElementById("leaves-container");
function createLeaf() {
    const leaf = document.createElement("div");
    leaf.classList.add("leaf");
    leaf.style.left = Math.random() * window.innerWidth + "px";
    leaf.style.animationDuration = 5 + Math.random() * 5 + "s";
    leaf.style.transform = `rotate(${Math.random() * 360}deg)`;
    leavesContainer.appendChild(leaf);
    leaf.addEventListener("animationend", () => leaf.remove());
}
setInterval(createLeaf, 500);
