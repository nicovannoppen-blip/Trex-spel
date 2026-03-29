const trex = document.getElementById("trex");
const lettersDiv = document.getElementById("letters");
const wordImage = document.getElementById("wordImage");
const progressEl = document.getElementById("progress");
const scoreEl = document.getElementById("score");
const message = document.getElementById("message");

const reward = document.getElementById("reward");
const starsEl = document.getElementById("stars");
const nextBtn = document.getElementById("nextBtn");

let words = [
    {word:"kat", img:"assets/kat.png"},
    {word:"vis", img:"assets/vis.png"},
    {word:"boom", img:"assets/boom.png"}
];

let current = 0;
let index = 0;
let score = 0;
let mistakes = 0;

/* 🔊 geluid via Web Audio */
function playSound(type){
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();

    o.connect(g);
    g.connect(ctx.destination);

    if(type === "good") o.frequency.value = 800;
    if(type === "bad") o.frequency.value = 200;
    if(type === "eat") o.frequency.value = 500;

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

        el.style.left = Math.random()*80 + "vw";
        el.style.top = (Math.random()*60+20) + "vh";

        el.onclick = ()=>eatLetter(el, letter);

        lettersDiv.appendChild(el);
    });
}

function eatLetter(el, letter){
    let correct = words[current].word[index];

    if(letter === correct){
        el.remove();
        index++;
        score += 10;

        playSound("eat");
        speak(letter);

        updateProgress();

        if(index === words[current].word.length){
            let woord = words[current].word;

            playSound("good");

            setTimeout(()=>{
                speak(woord);
            },500);

            showReward();
        }

    } else {
        mistakes++;
        score -= 5;

        playSound("bad");
        speak("Foutje");

        scoreEl.innerText = "⭐ " + score;
    }

    scoreEl.innerText = "⭐ " + score;
}

function showReward(){
   reward.style.display = "flex";

    let stars = 3;
    if(mistakes > 1) stars = 2;
    if(mistakes > 3) stars = 1;

    starsEl.innerText = "⭐".repeat(stars);
}

nextBtn.onclick = ()=>{
    reward.style.display = "none";
    current++;

    if(current >= words.length){
        message.innerText = "Alles klaar! 🦖";
        speak("Goed gewerkt");
    } else {
        startLevel();
    }
};

function updateProgress(){
    let word = words[current].word;
    progressEl.innerText =
        word.slice(0,index) +
        "_".repeat(word.length-index);
}

/* bewegen */
function moveTrex(x,y){
    trex.style.left = x + "px";
    trex.style.top = y + "px";
}

document.addEventListener("click", e=>{
    moveTrex(e.clientX, e.clientY);
});

document.addEventListener("touchstart", e=>{
    let t = e.touches[0];
    moveTrex(t.clientX, t.clientY);
});

startLevel();
