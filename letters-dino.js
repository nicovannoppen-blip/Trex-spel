const LETTER_SIZE = 50;

const words = [
  {word:"boom", img:"assets/boom.png"},
  {word:"vis", img:"assets/vis.png"},
  {word:"kat", img:"assets/kat.png"},
  {word:"hond", img:"assets/hond.png"}
];

let currentWord = "";
let collected = "";
let gameCount = 0;

// snelheid per level
let speedPerLevel = [0, 0, 0.1, 0.2, 0.2, 0.3,0.3,0.3,0.4,0.5];

const wordEl = document.getElementById("word");
const lettersContainer = document.getElementById("letters-container");
const scoreEl = document.getElementById("score");
const messageEl = document.getElementById("message");
const wordImage = document.getElementById("word-image");
const trex = document.getElementById("trex");

const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");

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

// spraak
function speak(text){
    let u = new SpeechSynthesisUtterance(text);
    u.lang="nl-NL";
    speechSynthesis.speak(u);
}

function speakLetterNL(letter){
    const phonetic = { m:"m" };
    let u = new SpeechSynthesisUtterance(phonetic[letter] || letter);
    u.lang="nl-NL";
    speechSynthesis.speak(u);
}

// start
function startGame(){
    speak(`Welkom ${currentPlayer}. Klik de letters in de juiste volgorde.`);
    setTimeout(newWord,2000);
}

// woord display
function updateWordDisplay(){
    wordEl.innerHTML="";
    for(let i=0;i<currentWord.length;i++){
        const span=document.createElement("span");
        span.textContent = (i < collected.length) ? currentWord[i] : "_";
        wordEl.appendChild(span);
        wordEl.appendChild(document.createTextNode(" "));
    }
}

// nieuw woord
function newWord(){
    collected="";
    lettersContainer.innerHTML="";
    lettersContainer.appendChild(trex); // dino terugzetten
    messageEl.textContent="";

    const w = words[Math.floor(Math.random()*words.length)];
    currentWord = w.word;
    wordImage.src = w.img;

    updateWordDisplay();

    let letters = currentWord.split("");
    const alphabet="abcdefghijklmnopqrstuvwxyz";

    while(letters.length < currentWord.length+3){
        let l = alphabet[Math.floor(Math.random()*alphabet.length)];
        if(!letters.includes(l)) letters.push(l);
    }

    if(gameCount >= 1){
        let first = letters[0];
        let rest = letters.slice(1).sort(()=>Math.random()-0.5);
        letters = [first,...rest];
    }

    letters.forEach((l,index)=>{
        const btn=document.createElement("div");
        btn.className="letter";
        btn.innerText=l;
        btn.onclick=()=>clickLetter(l,btn);

        let speed = speedPerLevel[Math.min(gameCount, speedPerLevel.length-1)];

        if(gameCount >= 1 && index === 0){
            btn.dx = 0;
            btn.dy = 0;
        } else {
            btn.dx = speed * (Math.random()<0.5?-1:1);
            btn.dy = speed * (Math.random()<0.5?-1:1);
        }

        lettersContainer.appendChild(btn);
    });

    positionLetters();

    if(gameCount >= 2){
        animateLetters();
    }
}

// positionering
function positionLetters(){
    const width = lettersContainer.clientWidth;
    const height = lettersContainer.clientHeight;

    document.querySelectorAll(".letter").forEach(el=>{
        el.style.left = Math.random()*(width-LETTER_SIZE)+"px";
        el.style.top = Math.random()*(height-LETTER_SIZE)+"px";
    });
}

// animatie + botsing
function animateLetters(){
    const width = lettersContainer.clientWidth;
    const height = lettersContainer.clientHeight;
    const letters = document.querySelectorAll(".letter");

    letters.forEach(el=>{
        let x = parseFloat(el.style.left);
        let y = parseFloat(el.style.top);

        x += el.dx;
        y += el.dy;

        if(x <=0 || x >= width-LETTER_SIZE){
            el.dx *= -1;
        }
        if(y <=0 || y >= height-LETTER_SIZE){
            el.dy *= -1;
        }

        // botsing met andere letters
        letters.forEach(other=>{
            if(el !== other){
                let dx = x - parseFloat(other.style.left);
                let dy = y - parseFloat(other.style.top);
                let dist = Math.sqrt(dx*dx + dy*dy);

                if(dist < LETTER_SIZE){
                    el.dx *= -1;
                    el.dy *= -1;
                }
            }
        });

        el.style.left = x+"px";
        el.style.top = y+"px";
    });

    requestAnimationFrame(animateLetters);
}

// klik
function clickLetter(letter,btn){
    speakLetterNL(letter);

    // 🦖 dino beweegt
    trex.style.left = btn.style.left;
    trex.style.top = btn.style.top;

    if(letter === currentWord[collected.length]){

        collected += letter;
        btn.style.visibility="hidden";
        updateWordDisplay();

        // 🔥 check of dit de LAATSTE letter is
        if(collected === currentWord){

            // 👉 slechts 1x geluid
            correctSound.currentTime = 0;
            correctSound.play();

            speak(currentWord);

            setTimeout(()=>{
                speak("Goed gedaan!");

                profiles[currentPlayer].score += 10;
                localStorage.setItem("profiles", JSON.stringify(profiles));
                updateScore();

                gameCount++;
                setTimeout(newWord,1500);
            },1000);

        } else {

            // 👉 normale correcte letter
            correctSound.currentTime = 0;
            correctSound.play();
        }

    } else {

        wrongSound.currentTime = 0;
        wrongSound.play();

        speak("Fout");
    }
}

function updateScore(){
    scoreEl.textContent = `${currentPlayer} score: ${profiles[currentPlayer].score}`;
}

function switchPlayer(){
    localStorage.removeItem("currentPlayer");
    location.reload();
}
