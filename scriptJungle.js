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
let score = 0;

// HTML-elementen
const wordEl = document.getElementById("word");
const collectedEl = document.getElementById("collected");
const lettersContainer = document.getElementById("letters-container");
const messageEl = document.getElementById("message");
const scoreEl = document.getElementById("score");

// Geluiden
const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");

// TTS functie
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
}

// Update woordweergave met vetgedrukte letters
function updateWordDisplay() {
    wordEl.innerHTML = "";
    for (let i = 0; i < currentWord.length; i++) {
        const span = document.createElement("span");
        if (i < collected.length) {
            span.classList.add("guessed");
            span.textContent = currentWord[i];
        } else {
            span.classList.add("unguessed");
            span.textContent = currentWord[i];
        }
        wordEl.appendChild(span);
    }
}

// Start uitleg
function startGame() {
    speak("Welkom bij Letter Jungle! Klik op de letters in de juiste volgorde om het woord te bouwen.");
    setTimeout(newWord, 3000);
}

// Nieuw woord
function newWord() {
    collected = "";
    collectedEl.textContent = collected;
    messageEl.textContent = "";

    currentWord = words[Math.floor(Math.random() * words.length)];
    updateWordDisplay();

    // Spreek hele woord uit
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

// Letter klik
function clickLetter(letter, btn) {
    // Spreek letter uit
    speak(letter);

    setTimeout(() => {
        if (currentWord[collected.length] === letter) {
            collected += letter;
            collectedEl.textContent = collected;
            btn.style.visibility = "hidden";

            updateWordDisplay();
            correctSound?.play();

            if (collected === currentWord) {
                messageEl.textContent = "Goed gedaan! 🎉";
                speak("Goed gedaan!");
                score += 10;
                scoreEl.textContent = "Score: " + score;
                setTimeout(newWord, 1500);
            }
        } else {
            messageEl.textContent = "Fout! Probeer opnieuw.";
            speak("Fout! Probeer opnieuw.");
            wrongSound?.play();
        }
    }, 1000); // 2 seconden wachten
}

// Start spel
startGame();

// 🌿 Bladeren animatie
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
