// ---------- WOORDEN + PICTOGRAMMEN ----------
const words = [
    { word: "kat", img:"assets/kat.png" },
    { word: "vis", img:"assets/vis.png" },
    { word: "boom", img:"assets/boom.png" },
    { word: "hond", img:"assets/hond.png" }
];

let currentWord = "";
let collected = "";
let currentPlayer = null;
let profiles = JSON.parse(localStorage.getItem("profiles")) || { Odin:{score:0}, Niel:{score:0} };

// ---------- ELEMENTEN ----------
const playerSelectionEl = document.getElementById("player-selection");
const wordDisplayEl = document.getElementById("word-display");
const lettersContainer = document.getElementById("letters-container");
const messageEl = document.getElementById("message");
const scoreEl = document.getElementById("score");
const wordImageEl = document.getElementById("word-image");
const trex = document.getElementById("trex");
const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");

// ---------- PROFIELKEUZE ----------
document.getElementById("player1-btn").onclick = ()=>selectPlayer("Odin");
document.getElementById("player2-btn").onclick = ()=>selectPlayer("Niel");

function selectPlayer(name){
    currentPlayer = name;
    localStorage.setItem("currentPlayer", currentPlayer);
    playerSelectionEl.style.display = "none";
    startGame();
}

// Als speler al gekozen is → direct starten
const savedPlayer = localStorage.getItem("currentPlayer");
if(savedPlayer){
    currentPlayer = savedPlayer;
    playerSelectionEl.style.display = "none";
    startGame();
}

// ---------- TTS ----------
function speak(text){
    const u = new SpeechSynthesisUtterance(text);
    u.lang="nl-NL";
    u.rate = 1;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
}

// Phonetic letters
function speakLetterNL(letter){
    const phonetic = {
        "a": "a", "b": "b", "c": "c", "d": "d", "e": "e", "f": "f",
        "g": "g", "h": "h", "i": "i", "j": "j", "k": "k", "l": "l",
        "m": "em", "n": "n", "o": "o", "p": "p", "q": "q", "r": "r",
        "s": "s", "t": "t", "u": "u", "v": "v", "w": "w", "x": "x",
        "y": "y", "z": "z"
    };
    const u = new SpeechSynthesisUtterance(phonetic[letter.toLowerCase()]||letter);
    u.lang="nl-NL"; u.rate=1; u.pitch=1;
    window.speechSynthesis.speak(u);
}

// ---------- SPEL FUNCTIES ----------
function startGame(){
    updateScore();
    speak(`Welkom ${currentPlayer}! Klik op de letters in de juiste volgorde om het woord te bouwen.`);
    setTimeout(newWord, 2000);
}

function newWord(){
    collected = "";
    messageEl.textContent = "";
    lettersContainer.innerHTML = "";

    // kies random woord
    const w = words[Math.floor(Math.random()*words.length)];
    currentWord = w.word;
    wordImageEl.src = w.img;

    // underscores onder pictogram
    updateWordDisplay();

    // Letters van het woord
    let letters = currentWord.split("");

    // Voeg 3 letters toe die niet in het woord zitten
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    let distractors = [];
    while(distractors.length < 3){
        const l = alphabet[Math.floor(Math.random()*alphabet.length)];
        if(!letters.includes(l) && !distractors.includes(l)){
            distractors.push(l);
        }
    }
    letters = letters.concat(distractors);
    letters.sort(()=>Math.random()-0.5);

    // Voeg letters toe aan container
    letters.forEach(l=>{
        const btn = document.createElement("div");
        btn.textContent = l;
        btn.className = "letter";
        btn.addEventListener("click", ()=>clickLetter(l, btn));
        lettersContainer.appendChild(btn);
    });
}

// Klik letter
function clickLetter(letter, btn){
    speakLetterNL(letter);

    setTimeout(()=>{
        if(currentWord[collected.length]===letter){
            collected += letter;
            correctSound.play();
            updateWordDisplay();

            if(collected===currentWord){
                messageEl.textContent="Goed gedaan! 🎉";
                speak("Goed gedaan!");
                profiles[currentPlayer].score += 10;
                localStorage.setItem("profiles", JSON.stringify(profiles));
                updateScore();
                setTimeout(newWord, 1500);
            }
        } else {
            messageEl.textContent="Fout! Probeer opnieuw.";
            speak("Fout! Probeer opnieuw.");
            wrongSound.play();
        }
    }, 300);
}

// Update underscores en ingevulde letters
function updateWordDisplay(){
    wordDisplayEl.innerHTML = "";
    for(let i=0;i<currentWord.length;i++){
        const span = document.createElement("span");
        span.textContent = i<collected.length ? currentWord[i] : "_";
        span.classList.add(i<collected.length ? "guessed" : "");
        wordDisplayEl.appendChild(span);
        wordDisplayEl.appendChild(document.createTextNode(" ")); // spatie
    }
}

function updateScore(){
    scoreEl.textContent=`${currentPlayer} score: ${profiles[currentPlayer].score}`;
}

// ---------- KNOPPEN ----------
document.getElementById("back-btn").onclick = ()=>{
    window.location.href="index.html";
};

document.getElementById("switch-btn").onclick = ()=>{
    localStorage.removeItem("currentPlayer");
    location.reload();
};

// ---------- DINO VOLGT MUIS ----------
document.addEventListener("click", e=>{
    trex.style.left = e.clientX+"px";
    trex.style.top = e.clientY+"px";
});

// ---------- TREX ANIMATIE ----------
const trexFrames = ["assets/trex1.png","assets/trex2.png"];
let frame = 0;
function animateTrex(){
    frame = (frame+1)%2;
    trex.src = trexFrames[frame];
    setTimeout(animateTrex, 500);
}
animateTrex();

// ---------- BLADEREN ANIMATIE ----------
const leavesContainer = document.getElementById("leaves-container");
function createLeaf(){
    const leaf = document.createElement("div");
    leaf.className="leaf";
    leaf.style.left=Math.random()*window.innerWidth+"px";
    leaf.style.animationDuration=5+Math.random()*5+"s";
    leaf.style.transform=`rotate(${Math.random()*360}deg)`;
    leavesContainer.appendChild(leaf);
    leaf.addEventListener("animationend", ()=>leaf.remove());
}
setInterval(createLeaf, 500);
