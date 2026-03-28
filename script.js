const menu = document.getElementById("menu");
const game = document.getElementById("game");
const trex = document.getElementById("trex");
const lettersDiv = document.getElementById("letters");
const obstaclesDiv = document.getElementById("obstacles");
const wordImage = document.getElementById("wordImage");
const progressEl = document.getElementById("progress");
const scoreEl = document.getElementById("score");

let mode = "click";
let words = [
  {word:"kat", img:"assets/kat.png"},
  {word:"vis", img:"assets/vis.png"},
  {word:"boom", img:"assets/boom.png"}
];

let current = 0;
let index = 0;
let score = 0;

// physics (runner)
let velocity = 6;
let gravity = 1;
let jump = -15;
let y = 0;
let vy = 0;
let grounded = true;
function startMode(selected){
  mode = selected;
  menu.classList.add("hidden");
  game.classList.remove("hidden");
  startLevel();
  if(mode === "runner") loop();
}

function startLevel(){
  lettersDiv.innerHTML = "";
  obstaclesDiv.innerHTML = "";
  index = 0;

  let w = words[current];
  wordImage.src = w.img;
  updateProgress();

  if(mode === "click"){
    spawnClickLetters(w.word);
  } else {
    spawnRunnerLetters(w.word);
  }
}

function spawnClickLetters(word){
  word.split('').sort(()=>Math.random()-0.5).forEach(letter=>{
    let el = createLetter(letter);
    el.style.left = Math.random()*80 + "vw";
    el.style.top = Math.random()*70 + "vh";
    el.onclick = ()=>handleLetter(el, letter);
    lettersDiv.appendChild(el);
  });
}

function spawnRunnerLetters(word){
  word.split('').forEach((letter,i)=>{
    let el = createLetter(letter);
    el.style.left = (600 + i*200) + "px";
    el.style.bottom = "120px";
    lettersDiv.appendChild(el);
  });
}

function createLetter(letter){
  let el = document.createElement("div");
  el.className = "letter";
  el.innerText = letter;
  return el;
}

function handleLetter(el, letter){
  let correct = words[current].word[index];

  if(letter === correct){
    el.remove();
    index++;
    score += 10;
    updateProgress();

    if(index === words[current].word.length){
      nextWord();
    }
  } else {
    score -= 5;
  }

  scoreEl.innerText = "Score: " + score;
}

