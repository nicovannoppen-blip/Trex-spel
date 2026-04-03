const gameWorld = document.getElementById("game-world");
const velociraptor = document.getElementById("velociraptor");
const scoreEl = document.getElementById("score");
const targetEl = document.getElementById("target-eggs");
const timerEl = document.getElementById("timer");

let score = 0;
let targetEggs = Math.floor(Math.random() * 10) + 1;
let collectedEggs = 0;
let timeLeft = 120; // 2 minuten
targetEl.textContent = targetEggs;

// Platforms & ladders (voorbeeld)
const platforms = [
    {x:0, y:500, width:800},
    {x:100, y:400, width:600},
    {x:0, y:300, width:500},
    {x:200, y:200, width:600},
];

const ladders = [
    {x:150, y:300, height:100},
    {x:500, y:200, height:100},
];

// Voeg platforms toe aan DOM
platforms.forEach(p => {
    const plat = document.createElement('div');
    plat.className = 'platform';
    plat.style.left = p.x + 'px';
    plat.style.top = p.y + 'px';
    plat.style.width = p.width + 'px';
    gameWorld.appendChild(plat);
});

// Voeg ladders toe aan DOM
ladders.forEach(l => {
    const lad = document.createElement('div');
    lad.className = 'ladder';
    lad.style.left = l.x + 'px';
    lad.style.top = l.y + 'px';
    lad.style.height = l.height + 'px';
    gameWorld.appendChild(lad);
});

// Eieren
let eggs = [];
function spawnEggs() {
    // verwijder oude
    eggs.forEach(e => e.remove());
    eggs = [];
    for(let i=0;i<10;i++){
        const egg = document.createElement('div');
        egg.className = 'egg';
        egg.style.left = Math.random() * 770 + 'px';
        egg.style.top = Math.random() * 540 + 'px';
        gameWorld.appendChild(egg);
        eggs.push(egg);
    }
}
spawnEggs();

// Velociraptor bewegen
let velociraptorPos = {x:50, y:500};
const moveSpeed = 5;

document.addEventListener('keydown', e => {
    switch(e.key.toLowerCase()){
        case 'q': // links
            velociraptorPos.x -= moveSpeed; break;
        case 'd': // rechts
            velociraptorPos.x += moveSpeed; break;
        case 'z': // omhoog via ladder
            if(isOnLadder()) velociraptorPos.y -= moveSpeed; break;
        case 's': // omlaag via ladder
            if(isOnLadder()) velociraptorPos.y += moveSpeed; break;
    }
});

function isOnLadder(){
    return ladders.some(l => {
        return velociraptorPos.x+25 >= l.x && velociraptorPos.x <= l.x+20 &&
               velociraptorPos.y >= l.y && velociraptorPos.y <= l.y + l.height;
    });
}

function updateVelociraptor() {
    // Simpele platform collision
    platforms.forEach(p => {
        if(velociraptorPos.y + 50 > p.y && velociraptorPos.y + 50 < p.y + 20 &&
           velociraptorPos.x + 50 > p.x && velociraptorPos.x < p.x + p.width){
            velociraptorPos.y = p.y - 50; // staat op platform
        }
    });

    // Grenzen
    if(velociraptorPos.x<0) velociraptorPos.x = 0;
    if(velociraptorPos.x>750) velociraptorPos.x = 750;
    if(velociraptorPos.y>550) velociraptorPos.y = 550;
    if(velociraptorPos.y<40) velociraptorPos.y = 40;

    velociraptor.style.left = velociraptorPos.x + 'px';
    velociraptor.style.top = velociraptorPos.y + 'px';
}

function checkEggCollision() {
    eggs.forEach((egg, idx) => {
        const ex = parseInt(egg.style.left);
        const ey = parseInt(egg.style.top);
        if(Math.abs(velociraptorPos.x - ex) < 30 && Math.abs(velociraptorPos.y - ey) < 40){
            // hap geluid
            const audio = new Audio('assets/bite.mp3');
            audio.play();
            egg.remove();
            eggs.splice(idx,1);
            collectedEggs++;
        }
    });
}

function updateTimer() {
    timeLeft--;
    const minutes = Math.floor(timeLeft/60).toString().padStart(2,'0');
    const seconds = (timeLeft%60).toString().padStart(2,'0');
    timerEl.textContent = `${minutes}:${seconds}`;
    if(timeLeft <= 0){
        clearInterval(timerInterval);
        endGame();
    }
}

function endGame(){
    if(collectedEggs === targetEggs){
        alert('Goed gedaan! +10 punten');
        score += 10;
        scoreEl.textContent = score;
    } else {
        alert('Helaas! Je hebt het exacte aantal niet gegeten.');
    }
    // reset
    targetEggs = Math.floor(Math.random()*10)+1;
    targetEl.textContent = targetEggs;
    collectedEggs = 0;
    velociraptorPos = {x:50, y:500};
    spawnEggs();
    timeLeft = 120;
    timerInterval = setInterval(updateTimer,1000);
}

function gameLoop(){
    updateVelociraptor();
    checkEggCollision();
    requestAnimationFrame(gameLoop);
}

let timerInterval = setInterval(updateTimer, 1000);
gameLoop();
