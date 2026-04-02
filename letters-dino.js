// -------------------- DATA --------------------
const words = [
    {word:"kat", img:"assets/kat.png"},
    {word:"vis", img:"assets/vis.png"},
    {word:"boom", img:"assets/boom.png"},
    {word:"hond", img:"assets/hond.png"}
];

let currentWord = "";
let collected = "";

// -------------------- ELEMENTEN --------------------
const wordEl = document.getElementById("word");
const lettersContainer = document.getElementById("letters-container");
const messageEl = document.getElementById("message");
const scoreEl = document.getElementById("score");
const wordImageEl = document.getElementById("word-image");

const trex = document.getElementById("trex");

const playerSelectionEl = document.getElementById("player-selection");

// -------------------- PROFIELEN --------------------
let profiles = JSON.parse(localStorage.getItem("profiles")) || {
    "Odin": { score: 0 },
    "Niel": { score: 0 }
};

let currentPlayer = localStorage.getItem("currentPlayer");

// -------------------- SPELER KIEZEN --------------------
document.getElementById("odin-btn").onclick = () => selectPlayer("Odin");
document.getElementById("niel-btn").onclick = () => selectPlayer("Niel");

function selectPlayer(name){
    currentPlayer = name;
    localStorage.setItem("currentPlayer", name);
    playerSelectionEl.style.display = "none";
    startGame();
}

if(currentPlayer){
    playerSelectionEl.style.display = "none";
    startGame();
}

// -------------------- SPRAAK --------------------
function speak(text){
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "nl-NL";
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
}

function speakLetterNL(letter){
    const phonetic = {
        "m":"em","n":"n","b":"b","p":"p","t":"t","k":"k"
    };
    const u = new SpeechSynthesisUtterance(phonetic[letter] || letter);
    u.lang = "nl-NL";
    speechSynthesis.speak(u);
}

// -------------------- WOORD TONEN --------------------
function updateWordDisplay(){
    wordEl.innerHTML = "";

    for(let i=0;i<currentWord.length;i++){
        const span = document.createElement("span");

        if(i < collected.length){
            span.textContent = currentWord[i];
            span.classList.add("guessed");
        } else {
            span.textContent = "_";
        }

        wordEl.appendChild(span);
        wordEl.appendChild(document.createTextNode(" "));
    }
}

// -------------------- NIEUW WOORD --------------------
function newWord(){
    collected = "";
    messageEl.textContent = "";
    lettersContainer.innerHTML = "";

    const w = words[Math.floor(Math.random()*words.length)];
    currentWord = w.word;

    wordImageEl.src = w.img;

    updateWordDisplay();

    let letters = currentWord.split("");

    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    let extra = [];

    while(extra.length < 3){
        const l = alphabet[Math.floor(Math.random()*alphabet.length)];
        if(!letters.includes(l)){
            extra.push(l);
        }
    }

    letters = letters.concat(extra);
    letters.sort(()=>Math.random()-0.5);

    letters.forEach(l=>{
        const btn = document.createElement("div");
        btn.className = "letter";
        btn.textContent = l;

        btn.onclick = ()=>clickLetter(l, btn);

        lettersContainer.appendChild(btn);
    });
}

// -------------------- LETTER KLIK --------------------
function clickLetter(letter, btn){
    speakLetterNL(letter);

    if(letter === currentWord[collected.length]){
        collected += letter;
        btn.style.visibility = "hidden";

        updateWordDisplay();

        if(collected === currentWord){
            messageEl.textContent = "Goed gedaan!";
            profiles[currentPlayer].score += 10;
            localStorage.setItem("profiles", JSON.stringify(profiles));
            updateScore();

            speak("Goed gedaan!");
            setTimeout(newWord, 1500);
        }
    } else {
        messageEl.textContent = "Fout!";
        speak("Fout");
    }
}

// -------------------- SCORE --------------------
function updateScore(){
    scoreEl.textContent = `${currentPlayer} score: ${profiles[currentPlayer].score}`;
}

// -------------------- START --------------------
function startGame(){
    updateScore();
    speak(`Welkom ${currentPlayer}. Klik de letters in de juiste volgorde.`);
    setTimeout(newWord, 1500);
}

// -------------------- DINO VOLGEN --------------------
document.addEventListener("click", e=>{
    trex.style.left = e.clientX + "px";
    trex.style.top = e.clientY + "px";
});

// -------------------- WISSEL SPELER --------------------
function switchPlayer(){
    localStorage.removeItem("currentPlayer");
    location.reload();
}
