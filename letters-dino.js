// woorden + pictogrammen
const words = [
  {word:"boom", img:"assets/boom.png"},
  {word:"vis", img:"assets/vis.png"},
  {word:"kat", img:"assets/kat.png"},
  {word:"hond", img:"assets/hond.png"}
];

let currentWord = "";
let collected = "";
let gameCount = 0;

const wordEl = document.getElementById("word");
const lettersContainer = document.getElementById("letters-container");
const scoreEl = document.getElementById("score");
const messageEl = document.getElementById("message");
const wordImage = document.getElementById("word-image");

// spelers
let profiles = JSON.parse(localStorage.getItem("profiles")) || {
    "Odin": { score: 0 },
    "Niel": { score: 0 }
};

let currentPlayer = localStorage.getItem("currentPlayer");

// selectie
document.getElementById("odin-btn").onclick = ()=>selectPlayer("Odin");
document.getElementById("niel-btn").onclick = ()=>selectPlayer("Niel");

function selectPlayer(name){
    currentPlayer = name;
    localStorage.setItem("currentPlayer", name);
    document.getElementById("player-selection").style.display="none";
    startGame();
}

if(currentPlayer){
    document.getElementById("player-selection").style.display="none";
    startGame();
}

// -------- spraak --------
function speak(text){
    let u = new SpeechSynthesisUtterance(text);
    u.lang="nl-NL";
    speechSynthesis.speak(u);
}

function speakLetterNL(letter){
    const phonetic = { m:"em" };
    let u = new SpeechSynthesisUtterance(phonetic[letter] || letter);
    u.lang="nl-NL";
    speechSynthesis.speak(u);
}

// -------- spel --------
function startGame(){
    speak(`Welkom ${currentPlayer}. Klik de letters in de juiste volgorde.`);
    setTimeout(newWord,2000);
}

function updateWordDisplay(){
    wordEl.innerHTML="";
    for(let i=0;i<currentWord.length;i++){
        const span=document.createElement("span");
        span.textContent = (i < collected.length) ? currentWord[i] : "_";
        wordEl.appendChild(span);
        wordEl.appendChild(document.createTextNode(" "));
    }
}

function newWord(){
    collected="";
    lettersContainer.innerHTML="";
    messageEl.textContent="";

    const w = words[Math.floor(Math.random()*words.length)];
    currentWord = w.word;
    wordImage.src = w.img;

    updateWordDisplay();

    let letters = currentWord.split("");

    // 3 foute letters
    const alphabet="abcdefghijklmnopqrstuvwxyz";
    while(letters.length < currentWord.length+3){
        let l = alphabet[Math.floor(Math.random()*alphabet.length)];
        if(!letters.includes(l)) letters.push(l);
    }

    // level gedrag
    if(gameCount===0){
        // juiste volgorde
    } else {
        // eerste letter juist, rest random
        let first = letters[0];
        let rest = letters.slice(1).sort(()=>Math.random()-0.5);
        letters = [first,...rest];
    }

    letters.forEach(l=>{
        const btn=document.createElement("div");
        btn.className="letter";
        btn.innerText=l;
        btn.onclick=()=>clickLetter(l,btn);
        lettersContainer.appendChild(btn);
    });

    positionLetters();

    if(gameCount>=1){
        moveLetters();
    }
}

function clickLetter(letter,btn){
    speakLetterNL(letter);

    if(letter === currentWord[collected.length]){
        collected += letter;
        btn.style.visibility="hidden";
        updateWordDisplay();

        if(collected === currentWord){
            speak(currentWord);

            setTimeout(()=>{
                speak("Goed gedaan!");
                profiles[currentPlayer].score += 10;
                localStorage.setItem("profiles", JSON.stringify(profiles));
                updateScore();

                gameCount++;
                setTimeout(newWord,1500);
            },1000);
        }

    } else {
        speak("Fout");
    }
}

function updateScore(){
    scoreEl.textContent = `${currentPlayer} score: ${profiles[currentPlayer].score}`;
}

// -------- positie binnen container --------
function positionLetters(){
    const container = document.querySelector(".game-container");
    const rect = container.getBoundingClientRect();

    document.querySelectorAll(".letter").forEach(el=>{
        const x = Math.random()*(rect.width-60);
        const y = Math.random()*(rect.height-200);

        el.style.left = x+"px";
        el.style.top = (y+120)+"px";
    });
}

// -------- bewegen --------
function moveLetters(){
    const container = document.querySelector(".game-container");
    const rect = container.getBoundingClientRect();

    document.querySelectorAll(".letter").forEach(el=>{
        let x=parseFloat(el.style.left);
        let y=parseFloat(el.style.top);

        x += (Math.random()-0.5)*2;
        y += (Math.random()-0.5)*2;

        x = Math.max(0, Math.min(rect.width-60,x));
        y = Math.max(100, Math.min(rect.height-60,y));

        el.style.left=x+"px";
        el.style.top=y+"px";
    });

    requestAnimationFrame(moveLetters);
}

// bladeren
setInterval(()=>{
    const leaf=document.createElement("div");
    leaf.className="leaf";
    leaf.style.left=Math.random()*window.innerWidth+"px";
    document.getElementById("leaves-container").appendChild(leaf);
    setTimeout(()=>leaf.remove(),5000);
},500);

// wissel speler
function switchPlayer(){
    localStorage.removeItem("currentPlayer");
    location.reload();
}
