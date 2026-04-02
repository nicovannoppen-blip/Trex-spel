// ---------- DATA ----------
const words = [
    {word:"kat", img:"assets/kat.png"},
    {word:"vis", img:"assets/vis.png"},
    {word:"boom", img:"assets/boom.png"},
    {word:"hond", img:"assets/hond.png"}
];

let currentWord = "";
let collected = "";

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
const odinBtn = document.getElementById("odin-btn");
const nielBtn = document.getElementById("niel-btn");

if(odinBtn) odinBtn.onclick = ()=>selectPlayer("Odin");
if(nielBtn) nielBtn.onclick = ()=>selectPlayer("Niel");

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
        const span = document.createElement("span");

        if(i < collected.length){
            span.textContent = currentWord[i];
        } else {
            span.textContent = "_";
        }

        wordEl.appendChild(span);
        wordEl.appendChild(document.createTextNode(" "));
    }
}

// ---------- NIEUW WOORD ----------
function newWord(){
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

    letters = letters.concat(extra);
    letters.sort(()=>Math.random()-0.5);

    letters.forEach(l=>{
        const btn=document.createElement("div");
        btn.className="letter";
        btn.textContent=l;

        btn.onclick=()=>clickLetter(l,btn);

        lettersContainer.appendChild(btn);
    });
}

// ---------- CLICK ----------
function clickLetter(letter,btn){
    speakLetterNL(letter);

    if(letter===currentWord[collected.length]){
        collected+=letter;
        btn.style.visibility="hidden";
        updateWordDisplay();

        if(collected===currentWord){
            messageEl.textContent="Goed gedaan!";
        
            // Eerst het woord zeggen
            speak("Het woord is " + currentWord);
        
            // Daarna feliciteren (met kleine vertraging)
            setTimeout(()=>{
                speak("Goed gedaan!");
            }, 1200);
        
            profiles[currentPlayer].score+=10;
            localStorage.setItem("profiles",JSON.stringify(profiles));
            updateScore();
        
            setTimeout(newWord, 2500); // iets langer wachten
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

// ---------- BLADEREN ----------
const leavesContainer = document.getElementById("leaves-container");
setInterval(()=>{
    const leaf=document.createElement("div");
    leaf.className="leaf";
    leaf.style.left=Math.random()*window.innerWidth+"px";
    leaf.style.animationDuration=5+Math.random()*5+"s";
    leavesContainer.appendChild(leaf);
    leaf.addEventListener("animationend",()=>leaf.remove());
},500);
