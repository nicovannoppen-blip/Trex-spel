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

// Geluiden optioneel
const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");

// Functie om tekst voor te lezen
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1; // snelheid
    utterance.pitch = 1; // toonhoogte
    window.speechSynthesis.speak(utterance);
}

// Start uitleg bij het begin
function startGame() {
    speak("Welkom bij Letter Jungle! Klik op de letters in de juiste volgorde om het woord te bouwen.");
    setTimeout(newWord, 3000); // start eerste woord na uitleg
}

// Start een nieuw woord
function newWord() {
    collected = "";
    collectedEl.textContent = collected;
    messageEl.textContent = "";

    currentWord = words[Math.floor(Math.random() * words.length)];
    wordEl.textContent = currentWord;

    // Spreek het doelwoord uit (hele woord, niet gespeld)
    speak("Bouw het woord: " + currentWord);

    lettersContainer.innerHTML = "";
    let letters = currentWord.split("");

    // Voeg 3 willekeurige extra letters toe
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    while (letters.length < currentWord.length + 3) {
        letters.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }

    // Shuffle letters
    letters = letters.sort(() => Math.random() - 0.5);

    letters.forEach(l => {
        const btn = document.createElement("div");
        btn.textContent = l;
        btn.classList.add("letter");
        btn.addEventListener("click", () => clickLetter(l, btn));
        lettersContainer.appendChild(btn);
    });
}

// Letter klikken
function clickLetter(letter, btn) {
    // Spreek de aangeklikte letter uit
    speak(letter);

    // Pas geluid na 1 seconde toe
    setTimeout(() => {
        if (currentWord[collected.length] === letter) {
            collected += letter;
            collectedEl.textContent = collected;
            btn.style.visibility = "hidden";
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

// Start spel
startGame();

// Bladeren animatie blijft hetzelfde
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
