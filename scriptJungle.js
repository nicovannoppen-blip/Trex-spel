// Woordenlijst
const words = ["TIGER", "MONKEY", "JUNGLE", "LEAF", "RIVER"];
let currentWord = "";
let collected = "";
let score = 0;

// HTML-elementen
const wordEl = document.getElementById("word");
const collectedEl = document.getElementById("collected");
const lettersContainer = document.getElementById("letters-container");
const messageEl = document.getElementById("message");
const scoreEl = document.getElementById("score");
const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");

// Start een nieuw woord
function newWord() {
    collected = "";
    collectedEl.textContent = collected;
    messageEl.textContent = "";

    currentWord = words[Math.floor(Math.random() * words.length)];
    wordEl.textContent = currentWord;

    lettersContainer.innerHTML = "";
    let letters = currentWord.split("");

    // Voeg 3 willekeurige extra letters toe
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    while (letters.length < currentWord.length + 3) {
        letters.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }

    // Shuffle letters
    letters = letters.sort(() => Math.random() - 0.5);

    letters.forEach(l => {
        const btn = document.createElement("div");
        btn.textContent = l;
        btn.classList.add("letter");
        btn.addEventListener("click", () => clickLetter(l, btn));
        lettersContainer.appendChild(btn);
    });
}

// Letter klikken
function clickLetter(letter, btn) {
    if (currentWord[collected.length] === letter) {
        collected += letter;
        collectedEl.textContent = collected;
        btn.style.visibility = "hidden";
        correctSound.play();

        if (collected === currentWord) {
            messageEl.textContent = "Goed gedaan! 🎉";
            score += 10;
            scoreEl.textContent = "Score: " + score;
            setTimeout(newWord, 1500);
        }
    } else {
        messageEl.textContent = "Fout! Probeer opnieuw.";
        wrongSound.play();
    }
}

// Start het eerste woord
newWord();

// 🌿 Beweeg bladeren
const leavesContainer = document.getElementById("leaves-container");
function createLeaf() {
    const leaf = document.createElement("div");
    leaf.classList.add("leaf");
    leaf.style.left = Math.random() * window.innerWidth + "px";
    leaf.style.animationDuration = 5 + Math.random() * 5 + "s";
    leaf.style.transform = `rotate(${Math.random() * 360}deg)`;
    leavesContainer.appendChild(leaf);

    // Verwijder blad als animatie klaar is
    leaf.addEventListener("animationend", () => leaf.remove());
}

// Iedere 500ms een blad
setInterval(createLeaf, 500);
