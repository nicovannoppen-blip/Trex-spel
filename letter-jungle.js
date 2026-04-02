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

const wordEl = document.getElementById("word");
const collectedEl = document.getElementById("collected");
const lettersContainer = document.getElementById("letters-container");
const messageEl = document.getElementById("message");
const scoreEl = document.getElementById("score");

const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");

// Profielen ophalen
let profiles = JSON.parse(localStorage.getItem("profiles")) || {
    "Odin": { score: 0 },
    "Niel": { score: 0 }
};

let currentPlayer = localStorage.getItem("currentPlayer");

// Elements
const playerSelectionEl = document.getElementById("player-selection");

// Knoppen koppelen
document.getElementById("odin-btn").onclick = () => selectPlayer("Odin");
document.getElementById("niel-btn").onclick = () => selectPlayer("Niel");

function selectPlayer(name) {
    currentPlayer = name;

    localStorage.setItem("currentPlayer", currentPlayer);

    playerSelectionEl.style.display = "none";
    startGame();
}

// Als speler al gekozen is → direct starten
if (currentPlayer) {
    playerSelectionEl.style.display = "none";
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
function updateWordDisplay(){
    wordDisplayEl.innerHTML = "";

    for(let i=0;i<currentWord.length;i++){
        const span = document.createElement("span");
        function updateWordDisplay(){
    wordDisplayEl.innerHTML = "";

    for(let i = 0; i < currentWord.length; i++){
        const span = document.createElement("span");

        if(i < collected.length){
            span.textContent = currentWord[i];
            span.classList.add("guessed");
        } else {
            span.textContent = "_";
        }

        wordDisplayEl.appendChild(span);

        // spatie tussen letters
        const space = document.createTextNode(" ");
        wordDisplayEl.appendChild(space);
          }
        }      
        if(i < collected.length){
            span.textContent = currentWord[i];
        } else {
            span.textContent = "_";
        }

        wordDisplayEl.appendChild(span);
        wordDisplayEl.appendChild(document.createTextNode(" "));
    }
}

function newWord(){
    console.log("newWord gestart");

    collected = "";
    messageEl.textContent = "";
    lettersContainer.innerHTML = "";

    // kies woord
    const w = words[Math.floor(Math.random()*words.length)];
    currentWord = w.word;

    console.log("woord:", currentWord);

    wordImageEl.src = w.img;

    updateWordDisplay();

    let letters = currentWord.split("");

    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    let distractors = [];

    while(distractors.length < 3){
        const l = alphabet[Math.floor(Math.random()*alphabet.length)];
        if(!letters.includes(l) && !distractors.includes(l)){
            distractors.push(l);
        }
    }

    letters = letters.concat(distractors);

    console.log("letters:", letters);

    // shuffle
    letters.sort(()=>Math.random()-0.5);

    // MAKEN KNOPPEN
    letters.forEach(l=>{
        const btn = document.createElement("div");
        btn.innerText = l;
        btn.className = "letter";

        btn.addEventListener("click", function(){
            clickLetter(l, btn);
        });

        lettersContainer.appendChild(btn);
    });

    console.log("Aantal knoppen:", lettersContainer.children.length);
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
    }, 500);
}

function updateScoreDisplay() {
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
//----------------------wisselen speler---------------
function switchPlayer() {
    localStorage.removeItem("currentPlayer");
    location.reload();
}
