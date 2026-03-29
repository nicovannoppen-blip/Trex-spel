const trex = document.getElementById("trex");
const lettersDiv = document.getElementById("letters");
const wordImage = document.getElementById("wordImage");
const progressEl = document.getElementById("progress");
const scoreEl = document.getElementById("score");
const message = document.getElementById("message");

let words = [
    {word:"kat", img:"assets/kat.png"},
    {word:"vis", img:"assets/vis.png"},
    {word:"boom", img:"assets/boom.png"},
    {word:"maan", img:"assets/maan.png"},
    {word:"boek", img:"assets/boek.png"}
];

let current = 0;
let index = 0;
let score = 0;

function speak(text){
    let s = new SpeechSynthesisUtterance(text);
    s.lang = "nl-BE";
    speechSynthesis.speak(s);
}

function startLevel(){
    lettersDiv.innerHTML = "";
    message.innerText = "";
    index = 0;

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
        el.style.top = (Math.random()*70+10) + "vh";

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
        scoreEl.innerText = "Score: " + score;

        trex.style.transform = "scale(1.2)";
        setTimeout(()=>trex.style.transform="scale(1)",150);

        speak(letter);
        updateProgress();

        if(index === words[current].word.length){
            message.innerText = "Goed gedaan! 🎉";
            speak("Goed gedaan");

            current++;

            if(current >= words.length){
                message.innerText = "Alles klaar! 🦖";
                speak("Je bent klaar");
            } else {
                setTimeout(startLevel, 1500);
            }
        }
    } else {
        message.innerText = "Foutje!";
        speak("Probeer opnieuw");
        score -= 5;
        scoreEl.innerText = "Score: " + score;
    }
}

function updateProgress(){
    let word = words[current].word;
    progressEl.innerText =
        word.slice(0,index) +
        "_".repeat(word.length-index);
}

// bewegen met klik/touch
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
