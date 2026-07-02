// ======================================
// VELOCIRAPTOR
// Basis van de spelmotor
// ======================================

// ----------------------
// DOM
// ----------------------

const world = document.getElementById("world");
const player = document.getElementById("player");

const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const targetElement = document.getElementById("target-eggs");

// ----------------------
// Wereld
// ----------------------

const WORLD_WIDTH = 900;
const WORLD_HEIGHT = 650;

const PLAYER_WIDTH = 56;
const PLAYER_HEIGHT = 56;

const PLATFORM_HEIGHT = 18;

// ----------------------
// Score
// ----------------------

let score = 0;

let targetEggs =
    Math.floor(Math.random()*10)+1;

let collectedEggs = 0;

targetElement.textContent = targetEggs;

// ----------------------
// Timer
// ----------------------

let timeLeft = 120;

// ----------------------
// Player
// ----------------------

const dino = {

    x:40,
    y:540,

    width:PLAYER_WIDTH,
    height:PLAYER_HEIGHT,

    vx:0,
    vy:0,

    speed:4,

    gravity:0.45,

    onGround:false,

    climbing:false

};

// ----------------------
// Keyboard
// ----------------------

const keys = {};

document.addEventListener("keydown",e=>{

    keys[e.key.toLowerCase()] = true;

});

document.addEventListener("keyup",e=>{

    keys[e.key.toLowerCase()] = false;

});

// ======================================
// LEVEL
// ======================================

const platforms = [

{
    x:0,
    y:580,
    width:900
},

{
    x:80,
    y:470,
    width:650
},

{
    x:250,
    y:360,
    width:600
},

{
    x:0,
    y:250,
    width:500
},

{
    x:180,
    y:140,
    width:720
}

];

const ladders=[

{
    x:170,
    y:470,
    height:110
},

{
    x:620,
    y:360,
    height:110
},

{
    x:250,
    y:250,
    height:110
},

{
    x:700,
    y:140,
    height:110
}

];

// ======================================
// PLATFORMEN
// ======================================

platforms.forEach(platform=>{

    const div=document.createElement("div");

    div.className="platform";

    div.style.left=platform.x+"px";
    div.style.top=platform.y+"px";
    div.style.width=platform.width+"px";

    world.appendChild(div);

});

// ======================================
// LADDERS
// ======================================

ladders.forEach(ladder=>{

    const div=document.createElement("div");

    div.className="ladder";

    div.style.left=ladder.x+"px";
    div.style.top=ladder.y+"px";
    div.style.height=ladder.height+"px";

    world.appendChild(div);

});

// ======================================
// Eierlijst
// ======================================

let eggs = [];
// ======================================
// PLATFORM COLLISION
// ======================================

function standingOnPlatform(){

    for(const platform of platforms){

        if(

            dino.x + dino.width > platform.x &&
            dino.x < platform.x + platform.width &&

            dino.y + dino.height >= platform.y &&
            dino.y + dino.height <= platform.y + 15

        ){

            dino.y = platform.y - dino.height;
            dino.vy = 0;
            dino.onGround = true;

            return true;

        }

    }

    dino.onGround = false;

    return false;

}

// ======================================
// LADDER DETECTIE
// ======================================

function onLadder(){

    for(const ladder of ladders){

        const centerX = dino.x + dino.width/2;

        if(

            centerX >= ladder.x &&
            centerX <= ladder.x + 32 &&

            dino.y + dino.height >= ladder.y &&
            dino.y <= ladder.y + ladder.height

        ){

            return true;

        }

    }

    return false;

}

// ======================================
// INPUT
// ======================================

function processInput(){

    dino.vx = 0;

    if(keys["q"]){

        dino.vx = -dino.speed;

    }

    if(keys["d"]){

        dino.vx = dino.speed;

    }

    dino.x += dino.vx;

    if(dino.x < 0){

        dino.x = 0;

    }

    if(dino.x > WORLD_WIDTH-dino.width){

        dino.x = WORLD_WIDTH-dino.width;

    }

}

// ======================================
// ZWAARTEKRACHT
// ======================================

function applyGravity(){

    if(onLadder()){

        dino.climbing = true;

        dino.vy = 0;

        if(keys["z"]){

            dino.y -= dino.speed;

        }

        if(keys["s"]){

            dino.y += dino.speed;

        }

        return;

    }

    dino.climbing = false;

    dino.vy += dino.gravity;

    if(dino.vy > 12){

        dino.vy = 12;

    }

    dino.y += dino.vy;

    standingOnPlatform();

    if(dino.y > WORLD_HEIGHT-dino.height){

        dino.y = WORLD_HEIGHT-dino.height;
        dino.vy = 0;
        dino.onGround = true;

    }

}

// ======================================
// PLAYER UPDATE
// ======================================

function updatePlayer(){

    processInput();

    applyGravity();

    player.style.left = dino.x + "px";
    player.style.top = dino.y + "px";

}
// ======================================
// EIEREN
// ======================================

function spawnEggs() {

    eggs.forEach(egg => egg.remove());
    eggs = [];

    for (let i = 0; i < 10; i++) {

        const platform = platforms[Math.floor(Math.random() * platforms.length)];

        const egg = document.createElement("div");
        egg.className = "egg";

        // mooi verdeeld over het platform
        const x = platform.x + 20 + Math.random() * (platform.width - 60);

        // exact boven op de balk
        const y = platform.y - 36;

        egg.style.left = x + "px";
        egg.style.top = y + "px";

        world.appendChild(egg);

        eggs.push({
            element: egg,
            x: x,
            y: y
        });

    }

}

// ======================================
// BOTSING MET EIEREN
// ======================================

function checkEggCollision() {

    for (let i = eggs.length - 1; i >= 0; i--) {

        const egg = eggs[i];

        if (

            dino.x < egg.x + 28 &&
            dino.x + dino.width > egg.x &&
            dino.y < egg.y + 36 &&
            dino.y + dino.height > egg.y

        ) {

            const sound = new Audio("assets/bite.mp3");
            sound.play();

            egg.element.remove();

            eggs.splice(i, 1);

            collectedEggs++;

        }

    }

}

// ======================================
// TIMER
// ======================================

function updateTimer() {

    timeLeft--;

    const minutes = Math.floor(timeLeft / 60)
        .toString()
        .padStart(2, "0");

    const seconds = (timeLeft % 60)
        .toString()
        .padStart(2, "0");

    timerElement.textContent = minutes + ":" + seconds;

    if (timeLeft <= 0) {

        endGame();

    }

}

// ======================================
// EINDE SPEL
// ======================================

function endGame() {

    clearInterval(timer);

    if (collectedEggs === targetEggs) {

        score += 10;

        alert("Goed gedaan! +10 punten");

    } else {

        alert(
            "Je at " +
            collectedEggs +
            " eieren.\nDoel was " +
            targetEggs + "."
        );

    }

    scoreElement.textContent = score;

    collectedEggs = 0;

    targetEggs = Math.floor(Math.random() * 10) + 1;

    targetElement.textContent = targetEggs;

    timeLeft = 120;

    dino.x = 40;
    dino.y = 520;
    dino.vx = 0;
    dino.vy = 0;

    spawnEggs();

    timer = setInterval(updateTimer, 1000);

}

// ======================================
// GAME LOOP
// ======================================

function gameLoop() {

    updatePlayer();

    checkEggCollision();

    requestAnimationFrame(gameLoop);

}

// ======================================
// START
// ======================================

spawnEggs();

player.style.left = dino.x + "px";
player.style.top = dino.y + "px";

timerElement.textContent = "02:00";

let timer = setInterval(updateTimer, 1000);

gameLoop();
