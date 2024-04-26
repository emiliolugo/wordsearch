export function generateWordSearch(words, gridSize, difficulty) {
    const wordSearch = Array(gridSize).fill().map(() => Array(gridSize).fill("0"));
    const randall = (max) => Math.floor(Math.random() * max);

    // Function to check if a word can be placed in a certain direction
    // Function to check if a word can be placed in a certain direction
    const canPlaceWord = (word, row, col, direction) => {
        for (let i = 0; i < word.length; i++) {
            if (row < 0 || col < 0 || row >= gridSize || col >= gridSize || (wordSearch[row][col] !== "0" && wordSearch[row][col] !== word.charAt(i))) {
                return false;
            }
            row += (direction === 0 ? -1 : direction === 2 ? 1 : 0);
            col += (direction === 3 ? -1 : direction === 1 ? 1 : 0);
        }
        return true;
    };


    // Function to place a word in a certain direction
    const placeWord = (word, row, col, direction) => {
        for (let i = 0; i < word.length; i++) {
            wordSearch[row][col] = word.charAt(i);
            row += (direction === 0 ? -1 : direction === 2 ? 1 : 0);
            col += (direction === 3 ? -1 : direction === 1 ? 1 : 0);
        }
    };

    // Place each word in the grid
    for (let i = 0; i < words.length; i++) {
        let placed = false;
        while (!placed) {
            const row = randall(gridSize);
            const col = randall(gridSize);
            const direction = randall(4); // 0: Up, 1: Right, 2: Down, 3: Left

            if (wordSearch[row][col] === "0" && canPlaceWord(words[i], row, col, direction)) {
                placeWord(words[i], row, col, direction);
                placed = true;
            }
        }
    }

    //Fill remaining spaces
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (wordSearch[row][col] === "0") {
                const randomChar = String.fromCharCode(97 + randall(26)); // Random uppercase letter
                wordSearch[row][col] = randomChar;
            }
        }
    }

    return wordSearch;
}
