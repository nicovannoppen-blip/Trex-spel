const trex = document.getElementById("trex");
const lettersDiv = document.getElementById("letters");
const wordImage = document.getElementById("wordImage");
const progressEl = document.getElementById("progress");
const scoreEl = document.getElementById("score");

const reward = document.getElementById("reward");
const starsEl = document.getElementById("stars");
const nextBtn = document.getElementById("nextBtn");

const menu = document.getElementById("menu");
const game = document.getElementById("game");

const startBtn = document.getElementById("startBtn");
const menuBtn = document.getElementById("menuBtn");
const playerBtn = document.getElementById("playerBtn");

const levelText = document.getElementById("levelText");
const levelButtonsContainer = document.getElementById("levelButtons");

/* woorden */
let words = [
    {word:"kat", img:"assets/kat.png"},
    {word:"vis", img:"assets/vis.png"},
    {word:"boom", img:"assets/boom.png"},
    {word:"hond", img:"assets/hond.png"}
];

let current=0, index=0, score=0, mistakes=0, level=1;

/* 🔊 PHONETIC LETTERS */
function speakLetterNL(letter) {
    const phonetic = {
        "a":"a","b":"b","c":"c","d":"d","e":"e","f":"f",
        "g":"g","h":"h","i":"i","j":"j","k":"k","l":"l",
        "m":"em","n":"n","o":"o","p":"p","q":"q","r":"r",
        "s":"s","t":"t","u":"u","v":"v","w":"w","x":"x",
        "y":"y","z":"z"
    };
    const utterance = new SpeechSynthesisUtterance(phonetic[letter.toLowerCase()] || letter);
    utterance.lang = "nl-NL";
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
}

/* algemene spraak */
function speak(text){
    let s=new SpeechSynthesisUtterance(text);
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

/* start spel */
function startGame(){
    menu.style.display="none";
    game.style.display="block";

    speak("Zoek de letters in de juiste volgorde om het woord te maken");

    startLevel();
}

/* start level */
function startLevel(){
    lettersDiv.innerHTML="";
    index=0;
    mistakes=0;

    let w = words[current];
    wordImage.src = w.img;

    levelText.innerText=level;
    updateProgress();

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
                        speak("Goed gedaan!");
                        showReward();
                    },500);
                }
            } else {
                score-=5;
                mistakes++;
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

/* volgende */
nextBtn.onclick=()=>{
    reward.style.display="none";
    current++;

    if(current>=words.length){
        current=0;
        level++;
        speak("Level "+level);
    }

    startLevel();
};

/* menu = terug naar levels */
menuBtn.onclick=()=>{
    game.style.display="none";
    reward.style.display="none";
    menu.style.display="flex";
};

/* wissel speler */
playerBtn.onclick=()=>{
    localStorage.removeItem("player");
    location.reload();
};

/* start knop */
startBtn.onclick=startGame;

/* level knoppen */
function createLevels(){
    for(let i=1;i<=5;i++){
        let btn=document.createElement("button");
        btn.innerText="Level "+i;

        btn.onclick=()=>{
            level=i;
            current=0;
            score=0;
            startGame();
        };

        levelButtonsContainer.appendChild(btn);
    }
}

createLevels();
