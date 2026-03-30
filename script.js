const trex = document.getElementById("trex");
const lettersDiv = document.getElementById("letters");
const wordImage = document.getElementById("wordImage");
const progressEl = document.getElementById("progress");
const scoreEl = document.getElementById("score");
const message = document.getElementById("message");

const reward = document.getElementById("reward");
const starsEl = document.getElementById("stars");
const nextBtn = document.getElementById("nextBtn");

const menu = document.getElementById("menu");
const game = document.getElementById("game");
const startBtn = document.getElementById("startBtn");
const backBtn = document.getElementById("backBtn");

const levelText = document.getElementById("levelText");
const levelFill = document.getElementById("levelFill");

let words = [
    {word:"kat", img:"assets/kat.png"},
    {word:"vis", img:"assets/vis.png"},
    {word:"boom", img:"assets/boom.png"}
];

let current = 0;
let index = 0;
let score = 0;
let mistakes = 0;
let level = 1;
let movingLetters = [];

/* geluid */
function beep(freq){
    let ctx = new (window.AudioContext || window.webkitAudioContext)();
    let o = ctx.createOscillator();
    let g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = freq; o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
}

/* vrouwenstem */
function speak(text){
    let s = new SpeechSynthesisUtterance(text);
    let voices = speechSynthesis.getVoices();
    let femaleVoice = voices.find(v=>v.lang.includes("nl")&&v.name.toLowerCase().includes("female")) || voices.find(v=>v.lang.includes("nl"));
    if(femaleVoice) s.voice = femaleVoice;
    s.lang = "nl-BE";
    s.pitch=1.2; s.rate=0.9;
    speechSynthesis.cancel();
    speechSynthesis.speak(s);
}

/* random pos */
function randomPosition(el){
    const margin = 120;
    let x = Math.random()*(window.innerWidth-margin);
    let y = Math.random()*(window.innerHeight-margin);
    el.style.left = x+"px";
    el.style.top = y+"px";
}

/* LEVEL LOGICA */
function getLettersForLevel(word){
    let letters = word.split("");
    if(level===1) return letters;
    if(level===2){
        let first = letters[0];
        let rest = letters.slice(1).sort(()=>Math.random()-0.5);
        return [first,...rest];
    }
    return letters.sort(()=>Math.random()-0.5);
}

/* bewegende letters */
function moveLetters(){
    movingLetters.forEach(el=>{
        let x = parseFloat(el.style.left);
        let y = parseFloat(el.style.top);
        x += (Math.random()-0.5)*2;
        y += (Math.random()-0.5)*2;
        el.style.left = x+"px";
        el.style.top = y+"px";
    });
    if(level>=4) requestAnimationFrame(moveLetters);
}

/* start level */
function startLevel(){
    lettersDiv.innerHTML="";
    movingLetters=[];
    message.innerText="";
    index=0;
    mistakes=0;

    let w = words[current];
    wordImage.src=w.img;

    updateProgress(); updateLevelUI();
    speak("Zoek het woord");

    let letters = getLettersForLevel(w.word);

    letters.forEach(letter=>{
        let el = document.createElement("div");
        el.className="letter";
        el.innerText=letter;
        randomPosition(el);
        el.onclick=()=>eatLetter(el,letter);
        lettersDiv.appendChild(el);
        if(level>=4) movingLetters.push(el);
    });

    if(level>=4) moveLetters();
}

/* eet letter */
function eatLetter(el,letter){
    let correct = words[current].word[index];
    if(letter===correct){
        el.classList.add("pop");
        setTimeout(()=>el.remove(),300);
        index++;
        score+=10;
        trex.classList.add("bite");
        setTimeout(()=>trex.classList.remove("bite"),200);
        beep(600);
        speak(letter);
        updateProgress();
        if(index===words[current].word.length){
            setTimeout(()=>speak(words[current].word),500);
            showReward();
        }
    } else {
        mistakes++;
        score-=5;
        trex.classList.add("shake");
        setTimeout(()=>trex.classList.remove("shake"),300);
        beep(200);
        speak("fout");
    }
    scoreEl.innerText="⭐ "+score;
}

/* confetti */
function createConfetti(){
    for(let i=0;i<30;i++){
        let c=document.createElement("div");
        c.className="confetti";
        c.style.left=Math.random()*100+"vw";
        c.style.background=["red","yellow","blue","green"][Math.floor(Math.random()*4)];
        document.body.appendChild(c);
        setTimeout(()=>c.remove(),2000);
    }
}

/* reward */
function showReward(){
    reward.style.display="flex";
    let stars=3;
    if(mistakes>1) stars=2;
    if(mistakes>3) stars=1;
    starsEl.innerText="⭐".repeat(stars);
    createConfetti();
}

/* NEXT LEVEL */
nextBtn.onclick=()=>{
    reward.style.display="none";
    current++;
    if(current>=words.length){ current=0; level++; speak("Level "+level); }
    startLevel();
};

/* voortgang */
function updateProgress(){
    let word = words[current].word;
    progressEl.innerText = word.slice(0,index)+"_".repeat(word.length-index);
}

/* LEVEL UI */
function updateLevelUI(){
    levelText.innerText=level;
    let progress=(current/words.length)*100;
    levelFill.style.width=progress+"%";
}

/* T-Rex volgen */
document.addEventListener("click",e=>{
    trex.style.left=e.clientX+"px";
    trex.style.top=e.clientY+"px";
});

/* START / MENU */
startBtn.onclick=()=>{
    menu.style.display="none";
    game.style.display="block";
    level=1; current=0; score=0;
    startLevel();
};
backBtn.onclick=()=>{
    game.style.display="none";
    menu.style.display="flex";
};
