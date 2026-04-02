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
const resetBtn = document.getElementById("resetBtn");

const levelText = document.getElementById("levelText");
const levelButtonsContainer = document.getElementById("levelButtons");

let words = [
    {word:"kat", img:"assets/kat.png"},
    {word:"vis", img:"assets/vis.png"},
    {word:"boom", img:"assets/boom.png"},
    {word:"hond", img:"assets/hond.png"},
    {word:"fiets", img:"assets/fiets.png"}
];

let current=0, index=0, score=0, mistakes=0, level=1;

/* geluid */
function beep(freq){
    let ctx = new AudioContext();
    let o = ctx.createOscillator();
    let g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value=freq;
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.2);
}

/* spraak */
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

/* level letters */
function getLetters(word){
    let letters=word.split("");
    return level===1 ? letters : letters.sort(()=>Math.random()-0.5);
}

/* start */
function startGame(){
    menu.style.display="none";
    game.style.display="block";
    startLevel();
}

function startLevel(){
    lettersDiv.innerHTML="";
    index=0;
    mistakes=0;

    let w = words[current];
    wordImage.src = w.img;

    updateProgress();
    levelText.innerText=level;

    getLetters(w.word).forEach(letter=>{
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
                beep(600);
                speak(letter);
                updateProgress();

                if(index===w.word.length){
                    showReward();
                }
            } else {
                score-=5;
                mistakes++;
                trex.classList.add("shake");
                setTimeout(()=>trex.classList.remove("shake"),200);
                beep(200);
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
        level++;
    }

    startLevel();
};

/* menu */
menuBtn.onclick=()=>{
    game.style.display="none";
    reward.style.display="none";
    menu.style.display="flex";
};

/* reset */
resetBtn.onclick=()=>{
    score=0;
    current=0;
    level=1;
    scoreEl.innerText="⭐ 0";
    startLevel();
};

/* start */
startBtn.onclick=startGame;

/* level knoppen */
function createLevels(){
    levelButtonsContainer.innerHTML="";
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
