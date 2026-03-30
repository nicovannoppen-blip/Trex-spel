const trex = document.getElementById("trex");
const lettersDiv = document.getElementById("letters");
const wordImage = document.getElementById("wordImage");
const progressEl = document.getElementById("progress");
const scoreEl = document.getElementById("score");
const message = document.getElementById("message");

const reward = document.getElementById("reward");
const starsEl = document.getElementById("stars");
const nextBtn = document.getElementById("nextBtn");

const trexFrames = [
    "assets/trex1.png",
    "assets/trex2.png"
];

let words = [
    {word:"kat", img:"assets/kat.png"},
    {word:"vis", img:"assets/vis.png"},
    {word:"boom", img:"assets/boom.png"}
];

let current = 0;
let index = 0;
let score = 0;
let mistakes = 0;

/* 🔊 geluid */
function beep(freq){
    let ctx = new (window.AudioContext || window.webkitAudioContext)();
    let o = ctx.createOscillator();
    let g = ctx.createGain();

    o.connect(g);
    g.connect(ctx.destination);

    o.frequency.value = freq;
    o.start();

    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
}

/* spraak */
function speak(text){
    let s = new SpeechSynthesisUtterance(text);
    s.lang = "nl-BE";
    speechSynthesis.cancel();
    speechSynthesis.speak(s);
}

/* ✅ FIX: letters goed verspreiden */
function randomPosition(el){
    const margin = 100;

    let x = Math.random() * (window.innerWidth - margin);
    let y = Math.random() * (window.innerHeight - margin);

    el.style.left = x + "px";
    el.style.top = y + "px";
}

/* start level */
function startLevel(){
    lettersDiv.innerHTML = "";
    message.innerText = "";
    index = 0;
    mistakes = 0;

    let w = words[current];
    wordImage.src = w.img;

    updateProgress();
    speak("Zoek het woord");

    let shuffled = w.word.split('').sort(()=>Math.random()-0.5);

    shuffled.forEach(letter=>{
        let el = document.createElement("div");
        el.className = "letter";
        el.innerText = letter;

        randomPosition(el); // ✅ FIX

        el.onclick = ()=>eatLetter(el, letter);

        lettersDiv.appendChild(el);
    });
}

function eatLetter(el, letter){
    let correct = words[current].word[index];

    if(letter === correct){
        el.classList.add("pop"); // 💥 animatie
        setTimeout(()=>el.remove(), 300);

        index++;
        score += 10;

        trex.classList.add("bite"); // 🦖 hap
        setTimeout(()=>trex.classList.remove("bite"), 200);

        beep(600);
        speak(letter);

        updateProgress();

        if(index === words[current].word.length){
            let woord = words[current].word;

            setTimeout(()=>speak(woord), 500);

            showReward();
        }

    } else {
        mistakes++;
        score -= 5;

        trex.classList.add("shake"); // ❌ fout animatie
        setTimeout(()=>trex.classList.remove("shake"), 300);

        beep(200);
        speak("fout");
    }
    moveToElement(el);
    scoreEl.innerText = "⭐ " + score;
}

function createConfetti(){
    for(let i=0;i<30;i++){
        let c = document.createElement("div");
        c.className = "confetti";

        c.style.left = Math.random()*100 + "vw";
        c.style.background = ["red","yellow","blue","green"][Math.floor(Math.random()*4)];

        document.body.appendChild(c);

        setTimeout(()=>c.remove(),2000);
    }
}
/* beloning */
function showReward(){
    running = false; // 🛑 stop lopen

    reward.style.display = "flex";

    let stars = 3;
    if(mistakes > 1) stars = 2;
    if(mistakes > 3) stars = 1;

    starsEl.innerText = "⭐".repeat(stars);

    createConfetti();
}

nextBtn.onclick = ()=>{
    reward.style.display = "none";

    running = true;
    animateTrex();

    current++;

    if(current >= words.length){
        message.innerText = "Alles klaar!";
        speak("Goed gewerkt");
    } else {
        startLevel();
    }
};

/* voortgang */
function updateProgress(){
    let word = words[current].word;
    progressEl.innerText =
        word.slice(0,index) +
        "_".repeat(word.length-index);
}

/* bewegen */
document.addEventListener("click", e=>{
    trex.style.left = e.clientX + "px";
    trex.style.top = e.clientY + "px";
});
let running = true;
let frame = 0;

function animateTrex(){
    if(!running) return;

    frame = (frame + 1) % 2;
    trex.src = trexFrames[frame];

    setTimeout(animateTrex, 2000); // snelheid van lopen
}

function moveToElement(el){
    const rect = el.getBoundingClientRect();
    trex.style.left = rect.left + "px";
    trex.style.top = rect.top + "px";
}

startLevel();
animateTrex();
