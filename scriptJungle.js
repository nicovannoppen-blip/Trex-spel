// Woordenlijst
const words = ["TIGER", "MONKEY", "JUNGLE", "LEAF", "RIVER"];
let currentWord = "";
let collected = "";

// HTML-elementen
const wordEl = document.getElementById("word");
const collectedEl = document.getElementById("collected");
const lettersContainer = document.getElementById("letters-container");
const messageEl = document.getElementById("message");

// Start een nieuw woord
function newWord() {
    collected = "";
    collectedEl.textContent = collected;
    messageEl.textContent = "";

    // Kies willekeurig een woord
    currentWord = words[Math.floor(Math.random() * words.length)];
    wordEl.textContent = currentWord;

    // Genereer letters (random volgorde + extra letters)
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

        if (collected === currentWord) {
            messageEl.textContent = "Goed gedaan! 🎉";
            setTimeout(newWord, 1500);
        }
    } else {
        messageEl.textContent = "Fout! Probeer opnieuw.";
    }
}

// Start het eerste woord
newWord();
