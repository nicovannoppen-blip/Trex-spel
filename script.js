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

/* spraak */
function speak(text){
    let s = new SpeechSynthesisUtterance(text);
    s.lang = "nl-BE";
    speechSynthesis.cancel(); // voorkomt overlap
    speechSynthesis.speak(s);
}

/* level starten */
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
        el.style.top = (Math.random()*60+20) + "vh";

        el.onclick = ()=>eatLetter(el, letter);

        lettersDiv.appendChild(el);
    });
}

/* letter eten */
function eatLetter(el, letter){
    let correct = words[current].word[index];

    if(letter === correct){
        el.remove();
        index++;
        score += 10;

        scoreEl.innerText = "⭐ " + score;

        trex.style.transform = "scale(1.3)";
        setTimeout(()=>trex.style.transform="scale(1)",150);

        speak(letter);
        updateProgress();

        if(index === words[current].word.length){
            let woord = words[current].word;

            message.innerText = "Goed gedaan! 🎉";

            // 👉 NIEUW: volledig woord zeggen
            setTimeout(()=>{
                speak(woord);
            }, 500);

            current++;

            if(current >= words.length){
                setTimeout(()=>{
                    message.innerText = "Alles klaar! 🦖";
                    speak("Goed gewerkt");
                },1500);
            } else {
                setTimeout(startLevel, 2500);
            }
        }
    } else {
        message.innerText = "Foutje!";
        speak("Probeer opnieuw");
        score -= 5;
        scoreEl.innerText = "⭐ " + score;
    }
}

/* voortgang */
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
