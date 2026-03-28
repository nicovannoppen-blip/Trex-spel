const trex = document.getElementById("trex");
const lettersDiv = document.getElementById("letters");
const wordImage = document.getElementById("wordImage");
const message = document.getElementById("message");

let words = [
    {word:"kat", img:"assets/kat.png"},
    {word:"vis", img:"assets/vis.png"},
    {word:"boom", img:"assets/boom.png"}
];

let current = 0;
let index = 0;

function startLevel(){
    lettersDiv.innerHTML="";
    message.innerText="";
    index = 0;

    let w = words[current];
    wordImage.src = w.img;

    let shuffled = w.word.split('').sort(() => Math.random()-0.5);

    shuffled.forEach(letter => {
        let el = document.createElement("div");
        el.className = "letter";
        el.innerText = letter;

        el.style.left = Math.random()*80 + "vw";
        el.style.top = (Math.random()*70+10) + "vh";

        el.onclick = () => eatLetter(el, letter);

        lettersDiv.appendChild(el);
    });
}

function eatLetter(el, letter){
    let correct = words[current].word[index];

    if(letter === correct){
        el.remove();
        index++;

        if(index === words[current].word.length){
            message.innerText = "Goed gedaan! 🎉";
            current++;

            if(current >= words.length){
                message.innerText = "Alles klaar! 🦖";
            } else {
                setTimeout(startLevel, 1500);
            }
        }
    } else {
        message.innerText = "Foutje, probeer opnieuw!";
    }
}

document.addEventListener("click", (e)=>{
    trex.style.left = e.clientX + "px";
    trex.style.top = e.clientY + "px";
});

startLevel();
