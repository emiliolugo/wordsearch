import { nanoid } from "nanoid";

export function generateWordSearch(words, gridSize, difficulty) {
    const wordSearch = Array(gridSize).fill().map(() => Array(gridSize).fill({ word: null, selected: false, guessed: false, value: "", key: nanoid() }));
    const randall = (max) => Math.floor(Math.random() * max);

    // Function to check if a word can be placed in a certain direction
    const canPlaceWord = (word, row, col, direction) => {
        const wordLength = word.length;
        const rowIncrement = [-1, 0, 1, 1]; // Up, Right, Down, Left
        const colIncrement = [1, 1, 1, 0];
        for (let i = 0; i < wordLength; i++) {
            if (row < 0 || col < 0 || row >= gridSize || col >= gridSize || (wordSearch[row][col].word && wordSearch[row][col].word !== word.charAt(i))) {
                return false;
            }
            row += rowIncrement[direction];
            col += colIncrement[direction];
        }
        return true;
    };

    // Function to place a word in a certain direction
    const placeWord = (word, row, col, direction) => {
        const wordLength = word.length;
        const rowIncrement = [-1, 0, 1, 1]; // Up, Right, Down, Left
        const colIncrement = [1, 1, 1, 0];
        for (let i = 0; i < wordLength; i++) {
            const upperCaseChar = word.charAt(i).toUpperCase(); // Convert character to uppercase
            wordSearch[row][col] = { word: word.toUpperCase(), selected: false, guessed: false, value: upperCaseChar, key: nanoid() }; // Set word, selected, guessed, and value properties
            row += rowIncrement[direction];
            col += colIncrement[direction];
        }
    };

    // Place each word in the grid
    for (let i = 0; i < words.length; i++) {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 100) { // Limiting attempts to prevent infinite loop
            const row = randall(gridSize);
            const col = randall(gridSize);
            const direction = randall(4); // 0: Up, 1: Right, 2: Down, 3: Left

            if (!wordSearch[row][col].word && canPlaceWord(words[i], row, col, direction)) {
                placeWord(words[i], row, col, direction);
                placed = true;
            }
            attempts++;
        }
    }

    // Fill remaining spaces with random characters and nullify the word property
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (!wordSearch[row][col].word) {
                const randomChar = String.fromCharCode(65 + randall(26)); // Random uppercase letter
                wordSearch[row][col] = { word: null, selected: false, guessed: false, value: randomChar, key: nanoid() };
            }
        }
    }

    return wordSearch;
}
