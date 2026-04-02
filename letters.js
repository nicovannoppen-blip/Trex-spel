const trex = document.getElementById("trex");
const lettersDiv = document.getElementById("letters");
const wordImage = document.getElementById("wordImage");
const progressEl = document.getElementById("progress");
const scoreEl = document.getElementById("score");

const reward = document.getElementById("reward");
const starsEl = document.getElementById("stars");
const nextBtn = document.getElementById("nextBtn");

const backBtn = document.getElementById("backBtn");
const playerBtn = document.getElementById("playerBtn");

/* woorden */
let words = [
    {word:"kat", img:"assets/kat.png"},
    {word:"vis", img:"assets/vis.png"},
    {word:"boom", img:"assets/boom.png"},
    {word:"hond", img:"assets/hond.png"}
];

let current=0, index=0, score=0, mistakes=0;

/* 🔊 EXACT zelfde letter jungle uitspraak */
function speakLetterNL(letter) {
    const phonetic = {
        "a":"a","b":"b","c":"c","d":"d","e":"e","f":"f",
        "g":"g","h":"h","i":"i","j":"j","k":"k","l":"l",
        "m":"em","n":"n","o":"o","p":"p","q":"q","r":"r",
        "s":"s","t":"t","u":"u","v":"v","w":"w","x":"x",
        "y":"y","z":"z"
    };
    const utterance = new SpeechSynthesisUtterance(phonetic[letter.toLowerCase()]);
    utterance.lang = "nl-NL";
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
}

/* zelfde stem gedrag */
function speak(text){
    let s = new SpeechSynthesisUtterance(text);
    s.lang="nl-BE";
    speechSynthesis.cancel();
    speechSynthesis.speak(s);
}

/* random positie */
function randomPosition(el){
    let x = Math.random()*(window.innerWidth-120);
    let y = Math.random()*(window.innerHeight-180);
    el.style.left = x+"px";
    el.style.top = y+"px";
}

/* start */
function startLevel(){
    lettersDiv.innerHTML="";
    index=0;
    mistakes=0;

    let w = words[current];
    wordImage.src = w.img;

    updateProgress();

    /* uitleg zoals letter jungle */
    speak("Klik de letters in de juiste volgorde");

    let letters = w.word.split("").sort(()=>Math.random()-0.5);

    letters.forEach(letter=>{
        let el=document.createElement("div");
        el.className="letter";
        el.innerText=letter;
        randomPosition(el);

        el.onclick=()=>{
            trex.style.left=el.style.left;
            trex.style.top=el.style.top;

            if(letter===w.word[index]){
                el.classList.add("pop");
                setTimeout(()=>el.remove(),200);
                index++;
                score+=10;

                speakLetterNL(letter);
                updateProgress();

                if(index===w.word.length){
                    setTimeout(()=>{
                        /* EXACT zelfde felicitatielogica */
                        speak("Goed gedaan!");
                        showReward();
                    },500);
                }

            } else {
                mistakes++;
                score-=5;
                trex.classList.add("shake");
                setTimeout(()=>trex.classList.remove("shake"),200);
                speak("fout");
            }

            scoreEl.innerText="⭐ "+score;
        };

        lettersDiv.appendChild(el);
    });
}

/* progress */
function updateProgress(){
    let word = words[current].word;
    progressEl.innerText = word.slice(0,index)+"_".repeat(word.length-index);
}

/* reward */
function showReward(){
    reward.style.display="flex";

    let stars=3;
    if(mistakes>1) stars=2;
    if(mistakes>3) stars=1;

    starsEl.innerText="⭐".repeat(stars);
}

/* next */
nextBtn.onclick=()=>{
    reward.style.display="none";
    current++;

    if(current>=words.length){
        current=0;
    }

    startLevel();
};

/* knoppen EXACT zoals letter jungle */
backBtn.onclick=()=>{
    window.location.href="index.html"; // zelfde gedrag
};

playerBtn.onclick=()=>{
    localStorage.removeItem("player");
    location.reload();
};

/* start */
startLevel();
