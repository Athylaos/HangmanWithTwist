const MAX_LIVES = 11;

/*
 AI Generated
 Model: Gemini 3.6 Flash
*/
const SECRET_WORDS = [
    "PROGRAMOVÁNÍ", "KROKODÝL", "ČOKOLÁDA", "ŠIBENICE", "AUTOMOBIL",
    "POČÍTAČ", "JABLKO", "ELEKTŘINA", "RESTAURACE", "TELEVIZE",
    "LOKOMOTIVA", "KONTINENT", "RADOST", "SLUNCE", "VESMÍR",
    "ASTRONAUT", "ARCHITEKTURA", "BRAMBORA", "CESTOVÁNÍ", "DEŠTNÍK",
    "DETEKTIV", "ELEKTRONIKA", "FOTOGRAFIE", "FOTBAL", "GRAMOFON",
    "HARMONIE", "HELIKOPTÉRA", "INFORMACE", "JEDNOROŽEC", "KALKULAČKA",
    "KNIHOVNA", "KUCHAŘKA", "LABORATOŘ", "MIKROSKOP", "NEMOCNICE",
    "OCEÁN", "PARAPLE", "PLANETA", "PODZEMÍ", "PYRAMIDA",
    "REVOLUCE", "SCÉNÁŘ", "SOUHVĚZDÍ", "STRAŠIDLO", "SYMFONIE",
    "TELEFON", "TELESKOP", "UNIVERZITA", "ZEMĚKOULE", "ŽELEZNICE"
];

const gameStats = {
    secretWord: "",
    guessedLetters: new Set(),
    lives: MAX_LIVES,
    lastPickedLetter: "",
    isGameOver: false
};

const secretWordContainer = document.getElementById("secret-word-container");
const livesCountDisplay = document.getElementById("lives-count");
const hangmanSvg = document.getElementById("hangman-svg");
const chainContainer = document.getElementById("word-chain-container");
const messageBox = document.getElementById("message-box");

function initGame() {
    const randomIndex = Math.floor(Math.random() * SECRET_WORDS.length);
    gameStats.secretWord = SECRET_WORDS[randomIndex].toUpperCase();
    gameStats.guessedLetters.clear();
    gameStats.lives = MAX_LIVES;
    gameStats.lastPickedLetter = "";
    gameStats.isGameOver = false;
    
    livesCountDisplay.textContent = gameStats.lives;
    chainContainer.innerHTML = "";
    hideMessage();

    renderSecretWord();
    renderHangman();
    
    createNewInputRow("");
}

function renderSecretWord() {
    secretWordContainer.innerHTML = "";

    for (const char of gameStats.secretWord) {
        const box = document.createElement("div");
        box.className = "letter-box";

        if (gameStats.guessedLetters.has(char)) {
            box.textContent = char;
        } else {
            box.textContent = "";
        }

        secretWordContainer.appendChild(box);
    }
}

function renderHangman() {
    const errors = MAX_LIVES - gameStats.lives;

    /*
     AI Generated
     Model: Gemini 3.6 Flash
    */
    const parts = [
        '<line x1="20" y1="180" x2="100" y2="180" />',
        '<line x1="60" y1="180" x2="60" y2="20" />',
        '<line x1="60" y1="20" x2="130" y2="20" />',
        '<line x1="60" y1="50" x2="90" y2="20" />',
        '<line x1="130" y1="20" x2="130" y2="45" />',
        '<circle cx="130" cy="60" r="15" />',
        '<line x1="130" y1="75" x2="130" y2="120" />',
        '<line x1="130" y1="90" x2="110" y2="110" />',
        '<line x1="130" y1="90" x2="150" y2="110" />',
        '<line x1="130" y1="120" x2="110" y2="150" />',
        '<line x1="130" y1="120" x2="150" y2="150" />'
    ];

    let svgContent = "";
    for (let i = 0; i < errors; i++) {
        svgContent += parts[i];
    }

    hangmanSvg.innerHTML = svgContent;
}

function createNewInputRow(startingLetter) {
    if (gameStats.isGameOver) return;

    const row = document.createElement("div");
    row.className = "chain-row";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "word-input";
    input.placeholder = startingLetter
        ? `Napiš slovo začínající na "${startingLetter}"...`
        : "Napiš libovolné slovo...";
    
    if (startingLetter) {
        input.value = startingLetter;
    }
    
    input.addEventListener("input", () => {
        input.value = input.value.toUpperCase();
        if (startingLetter && !input.value.startsWith(startingLetter)) {
            input.value = startingLetter;
        }
    });

    const confirmBtn = document.createElement("button");
    confirmBtn.className = "btn";
    confirmBtn.textContent = "Potvrdit";

    const errorSpan = document.createElement("span");
    errorSpan.className = "error-msg";
    
    const handleConfirm = () => {
        const word = input.value.trim().toUpperCase();
        
        if (word.length < 2) {
            errorSpan.textContent = "Slovo musí mít alespoň 2 písmena!";
            return;
        }

        if (startingLetter && word[0] !== startingLetter) {
            errorSpan.textContent = `Slovo musí začínat na písmeno "${startingLetter}"!`;
            return;
        }

        const isAllGuessed = [...word].every((char) => gameStats.guessedLetters.has(char));
        if (isAllGuessed) {
            errorSpan.textContent = "Slovo musí obsahovat alespoň jedno dosud nehádané písmeno!";
            return;
        }

        if (word === gameStats.secretWord) {
            gameStats.isGameOver = true;
            
            [...word].forEach((char) => gameStats.guessedLetters.add(char));
            renderSecretWord();
            
            row.className = "chain-row completed";
            row.innerHTML = `<span class="word-label">${word}</span>
                             <span class="picked-badge">Uhádnuto celé slovo!</span>`;

            showMessage(`Uhádl jsi slovo "${gameStats.secretWord}"!`, "win");
            addRestartButton();
            return;
        }
        
        transformRowToLetterPicker(row, word);
    };

    confirmBtn.addEventListener("click", handleConfirm);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleConfirm();
    });

    row.appendChild(input);
    row.appendChild(confirmBtn);
    row.appendChild(errorSpan);
    chainContainer.appendChild(row);

    input.focus();
}

function transformRowToLetterPicker(row, word) {
    row.innerHTML = "";

    const label = document.createElement("span");
    label.style.cssText = "font-size: 0.85rem; color: #64748b; width: 100%;";
    label.textContent = "Klikni na písmeno, které chceš hádat:";

    const lettersPicker = document.createElement("div");
    lettersPicker.className = "letters-picker";

    for (const char of word) {
        const letterBtn = document.createElement("button");
        letterBtn.className = "letter-btn";
        letterBtn.textContent = char;
        
        if (gameStats.guessedLetters.has(char)) {
            letterBtn.disabled = true;
            letterBtn.style.opacity = "0.3";
            letterBtn.style.cursor = "not-allowed";
        } else {
            letterBtn.addEventListener("click", () => handleLetterPick(row, word, char));
        }

        lettersPicker.appendChild(letterBtn);
    }

    row.appendChild(label);
    row.appendChild(lettersPicker);
}

function handleLetterPick(row, word, pickedLetter) {
    if (gameStats.isGameOver) return;

    gameStats.guessedLetters.add(pickedLetter);
    gameStats.lastPickedLetter = pickedLetter;
    
    row.className = "chain-row completed";
    row.innerHTML = `<span class="word-label">${word}</span>
                     <span class="picked-badge">Hádané: ${pickedLetter}</span>`;
    
    if (gameStats.secretWord.includes(pickedLetter)) {
        showMessage(`Písmeno "${pickedLetter}" je v tajném slově`, "win");
    } else {
        gameStats.lives--;
        showMessage(`Písmeno "${pickedLetter}" není v tajném slově`, "lose");
    }
    
    livesCountDisplay.textContent = gameStats.lives;
    renderSecretWord();
    renderHangman();
    
    checkGameEnd();
    
    if (!gameStats.isGameOver) {
        createNewInputRow(pickedLetter);
    }
}

function checkGameEnd() {
    const isWon = [...gameStats.secretWord].every((char) => gameStats.guessedLetters.has(char));

    if (isWon) {
        gameStats.isGameOver = true;
        showMessage(`Uhádl jsi slovo "${gameStats.secretWord}"!`, "win");
        addRestartButton();
        return;
    }
    
    if (gameStats.lives <= 0) {
        gameStats.isGameOver = true;
        showMessage(`Nestihl jsi uhádnout tajné slovo! Tajné slovo bylo "${gameStats.secretWord}".`, "lose");
        addRestartButton();
    }
}

function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = `message-box ${type}`;
}

function hideMessage() {
    messageBox.textContent = "";
    messageBox.className = "message-box hidden";
}

function addRestartButton() {
    const restartBtn = document.createElement("button");
    restartBtn.className = "btn";
    restartBtn.style.cssText = "margin-top: 10px; width: 100%;";
    restartBtn.textContent = "Hrát znovu";
    restartBtn.addEventListener("click", initGame);
    messageBox.appendChild(document.createElement("br"));
    messageBox.appendChild(restartBtn);
}

document.addEventListener("DOMContentLoaded", initGame);