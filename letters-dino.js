const words = [
    {word:"kat", img:"assets/kat.png"},
    {word:"vis", img:"assets/vis.png"},
    {word:"boom", img:"assets/boom.png"},
    {word:"hond", img:"assets/hond.png"}
];

let currentWord="";
let collected="";
let level=1;
let movingLetters=[];

const wordEl = document.getElementById("word");
const messageEl = document.getElementById("message");
const scoreEl = document.getElementById("score");
const wordImageEl = document.getElementById("word-image");
const lettersLayer = document.getElementById("letters-layer");
const trex = document.getElementById("trex");

const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");

// profiel
let profiles = JSON.parse(localStorage.getItem("profiles")) || {
    "Odin": { score:0 },
    "Niel": { score:0 }
};

let currentPlayer = localStorage.getItem("currentPlayer");

// speler kiezen
document.getElementById("odin-btn").onclick=()=>selectPlayer("Odin");
document.getElementById("niel-btn").onclick=()=>selectPlayer("Niel");

function selectPlayer(name){
    currentPlayer=name;
    localStorage.setItem("currentPlayer",name);

    document.getElementById("player-selection").style.display="none";
    document.getElementById("game").style.display="block";

    startGame();
}

if(currentPlayer){
    document.getElementById("player-selection").style.display="none";
    document.getElementById("game").style.display="block";
    startGame();
}

// spraak
function speak(text){
    let u=new SpeechSynthesisUtterance(text);
    u.lang="nl-NL";
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
}

function speakLetterNL(letter){
    const map={"m":"em"};
    let u=new SpeechSynthesisUtterance(map[letter]||letter);
    u.lang="nl-NL";
    speechSynthesis.speak(u);
}

// woord display
function updateWordDisplay(){
    wordEl.innerHTML="";
    for(let i=0;i<currentWord.length;i++){
        let span=document.createElement("span");
        span.textContent=i<collected.length?currentWord[i]:"_";
        wordEl.appendChild(span);
        wordEl.appendChild(document.createTextNode(" "));
    }
}

// nieuwe ronde
function newWord(){

    collected="";
    messageEl.textContent="";
    lettersLayer.innerHTML="";
    movingLetters=[];

    let w=words[Math.floor(Math.random()*words.length)];
    currentWord=w.word;
    wordImageEl.src=w.img;

    updateWordDisplay();

    let letters=currentWord.split("");

    const alphabet="abcdefghijklmnopqrstuvwxyz";
    let extra=[];

    while(extra.length<3){
        let l=alphabet[Math.floor(Math.random()*alphabet.length)];
        if(!letters.includes(l)) extra.push(l);
    }

    if(level===1){
        letters=[...letters,...extra];
    } else {
        let first=letters[0];
        let rest=letters.slice(1).concat(extra);
        rest.sort(()=>Math.random()-0.5);
        letters=[first,...rest];
    }

    letters.forEach(l=>{
        let el=document.createElement("div");
        el.className="letter";
        el.innerText=l;

        // random positie over scherm
        el.style.left=Math.random()*(window.innerWidth-80)+"px";
        el.style.top=Math.random()*(window.innerHeight-80)+"px";

        el.onclick=()=>clickLetter(l,el);

        lettersLayer.appendChild(el);

        if(level>=2) movingLetters.push(el);
    });

    if(level>=2) moveLetters();
}

// letters bewegen
function moveLetters(){
    setInterval(()=>{
        movingLetters.forEach(el=>{
            let x=parseFloat(el.style.left);
            let y=parseFloat(el.style.top);

            x += (Math.random()*20-10);
            y += (Math.random()*20-10);

            el.style.left=x+"px";
            el.style.top=y+"px";
        });
    },800);
}

// klik
function clickLetter(letter,el){
    speakLetterNL(letter);

    if(letter===currentWord[collected.length]){
        collected+=letter;
        el.remove();
        updateWordDisplay();

        trex.classList.add("bite");
        setTimeout(()=>trex.classList.remove("bite"),300);

        correctSound?.play();

        if(collected===currentWord){

            createConfetti();

            speak("Het woord is "+currentWord);
            setTimeout(()=>speak("Goed gedaan!"),1500);

            profiles[currentPlayer].score+=10;
            localStorage.setItem("profiles",JSON.stringify(profiles));
            updateScore();

            setTimeout(()=>{
                level=Math.min(level+1,2);
                newWord();
            },3000);
        }

    } else {
        messageEl.textContent="Fout!";
        wrongSound?.play();
        speak("Fout");
    }
}

// score
function updateScore(){
    scoreEl.textContent=`${currentPlayer} score: ${profiles[currentPlayer].score}`;
}

// start
function startGame(){
    updateScore();
    speak(`Welkom ${currentPlayer}. Klik de letters in de juiste volgorde.`);
    setTimeout(newWord,1500);
}

// dino volgt klik
document.addEventListener("click",e=>{
    trex.style.left=e.clientX+"px";
    trex.style.top=e.clientY+"px";
});

// switch
document.getElementById("switch-btn").onclick=()=>{
    localStorage.removeItem("currentPlayer");
    location.reload();
};

// confetti
function createConfetti(){
    for(let i=0;i<30;i++){
        let c=document.createElement("div");
        c.className="confetti";
        c.style.left=Math.random()*100+"vw";
        document.body.appendChild(c);
        setTimeout(()=>c.remove(),2000);
    }
}
