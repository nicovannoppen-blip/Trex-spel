// ---------- DATA ----------
const words = [
    {word:"kat", img:"assets/kat.png"},
    {word:"vis", img:"assets/vis.png"},
    {word:"boom", img:"assets/boom.png"},
    {word:"hond", img:"assets/hond.png"}
];

let currentWord = "";
let collected = "";
let level = 1;
let moveInterval = null;

// ---------- ELEMENTEN ----------
const wordEl = document.getElementById("word");
const lettersContainer = document.getElementById("letters-container");
const messageEl = document.getElementById("message");
const scoreEl = document.getElementById("score");
const wordImageEl = document.getElementById("word-image");
const trex = document.getElementById("trex");

// ---------- PROFIEL ----------
let profiles = JSON.parse(localStorage.getItem("profiles")) || {
    "Odin": { score: 0 },
    "Niel": { score: 0 }
};

let currentPlayer = localStorage.getItem("currentPlayer");

// ---------- SPELER ----------
document.getElementById("odin-btn")?.addEventListener("click",()=>selectPlayer("Odin"));
document.getElementById("niel-btn")?.addEventListener("click",()=>selectPlayer("Niel"));

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

// ---------- SPRAAK ----------
function speak(text){
    const u = new SpeechSynthesisUtterance(text);
    u.lang="nl-NL";
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
}

function speakLetterNL(letter){
    const map = {"m":"em"};
    const u = new SpeechSynthesisUtterance(map[letter]||letter);
    u.lang="nl-NL";
    speechSynthesis.speak(u);
}

// ---------- WOORD ----------
function updateWordDisplay(){
    wordEl.innerHTML = "";

    for(let i=0;i<currentWord.length;i++){
        const span=document.createElement("span");
        span.textContent = i<collected.length ? currentWord[i] : "_";
        wordEl.appendChild(span);
        wordEl.appendChild(document.createTextNode(" "));
    }
}

// ---------- NIEUW WOORD ----------
function newWord(){

    if(moveInterval){
        clearInterval(moveInterval);
        moveInterval = null;
    }

    collected="";
    messageEl.textContent="";
    lettersContainer.innerHTML="";

    const w = words[Math.floor(Math.random()*words.length)];
    currentWord = w.word;

    wordImageEl.src = w.img;

    updateWordDisplay();

    let letters = currentWord.split("");

    const alphabet="abcdefghijklmnopqrstuvwxyz";
    let extra=[];

    while(extra.length<3){
        let l=alphabet[Math.floor(Math.random()*alphabet.length)];
        if(!letters.includes(l)) extra.push(l);
    }

    if(level === 1){
        letters = [...letters, ...extra];
    } else {
        let first = letters[0];
        let rest = letters.slice(1).concat(extra);
        rest.sort(()=>Math.random()-0.5);
        letters = [first, ...rest];
    }

    letters.forEach(l=>{
        const btn=document.createElement("div");
        btn.className="letter";
        btn.textContent=l;
        btn.onclick=()=>clickLetter(l,btn);
        lettersContainer.appendChild(btn);
    });

    if(level >= 2){
        moveLetters();
    }
}

// ---------- LETTER KLIK ----------
function clickLetter(letter,btn){
    speakLetterNL(letter);

    if(letter===currentWord[collected.length]){
        collected+=letter;
        btn.style.visibility="hidden";
        updateWordDisplay();

        if(collected===currentWord){

            messageEl.textContent="Goed gedaan! 🎉";

            trex.classList.add("jump");
            setTimeout(()=>trex.classList.remove("jump"),600);

            createConfetti();
            showStars();

            speak("Het woord is " + currentWord);
            setTimeout(()=>speak("Goed gedaan!"),1500);

            profiles[currentPlayer].score+=10;
            localStorage.setItem("profiles",JSON.stringify(profiles));
            updateScore();

            setTimeout(()=>{
                level = Math.min(level+1,2);
                newWord();
            },3000);
        }
    } else {
        messageEl.textContent="Fout!";
        speak("Fout");
    }
}

// ---------- SCORE ----------
function updateScore(){
    scoreEl.textContent = `${currentPlayer} score: ${profiles[currentPlayer].score}`;
}

// ---------- START ----------
function startGame(){
    updateScore();
    speak(`Welkom ${currentPlayer}. Klik de letters in de juiste volgorde.`);
    setTimeout(newWord,1500);
}

// ---------- DINO ----------
document.addEventListener("click",e=>{
    trex.style.left=e.clientX+"px";
    trex.style.top=e.clientY+"px";
});

// ---------- SWITCH ----------
document.getElementById("switch-btn").onclick = ()=>{
    localStorage.removeItem("currentPlayer");
    location.reload();
};

// ---------- CONFETTI ----------
function createConfetti(){
    for(let i=0;i<30;i++){
        const c=document.createElement("div");
        c.className="confetti";
        c.style.left=Math.random()*100+"vw";
        document.body.appendChild(c);
        setTimeout(()=>c.remove(),2000);
    }
}

// ---------- STERREN ----------
function showStars(){
    const s=document.createElement("div");
    s.className="stars";
    s.innerText="⭐⭐⭐";
    document.body.appendChild(s);
    setTimeout(()=>s.remove(),2000);
}

// ---------- BEWEGING ----------
function moveLetters(){
    moveInterval = setInterval(()=>{
        document.querySelectorAll(".letter").forEach(el=>{
            let x=Math.random()*10-5;
            let y=Math.random()*10-5;
            el.style.transform=`translate(${x}px,${y}px)`;
        });
    },800);
}
