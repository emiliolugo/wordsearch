import { nanoid } from "nanoid";

export function generateWordSearch(words, gridSize, difficulty) {
    let wordSearch;
    const randall = max => Math.floor(Math.random() * max);

    const generateGrid = () => {
        wordSearch = Array(gridSize).fill().map(() => Array(gridSize).fill({ word: null, selected: false, guessed: false, value: "", key: nanoid() }));
        wordSearch.sort((a, b) => {
            const lengthA = a.filter(cell => cell.word).length;
            const lengthB = b.filter(cell => cell.word).length;
            return lengthB - lengthA; // Sort in descending order by word length
        });

        

        const canPlaceWord = (word, row, col, direction) => {
            const wordLength = word.length;
            const rowIncrement = [-1, -1, 0, 1, 1, 1, 0, -1]; // Up, UpRight, Right, DownRight, Down, DownLeft, Left, UpLeft
            const colIncrement = [0, 1, 1, 1, 0, -1, -1, -1];
            for (let i = 0; i < wordLength; i++) {
                const newRow = row + i * rowIncrement[direction];
                const newCol = col + i * colIncrement[direction];
                if (newRow < 0 || newCol < 0 || newRow >= gridSize || newCol >= gridSize || (wordSearch[newRow][newCol].word && wordSearch[newRow][newCol].word !== word.charAt(i))) {
                    return false;
                }
            }
            return true;
        };

        const placeWord = (word, row, col, direction) => {
            const wordLength = word.length;
            const rowIncrement = [-1, -1, 0, 1, 1, 1, 0, -1]; // Up, UpRight, Right, DownRight, Down, DownLeft, Left, UpLeft
            const colIncrement = [0, 1, 1, 1, 0, -1, -1, -1];
            for (let i = 0; i < wordLength; i++) {
                const upperCaseChar = word.charAt(i).toUpperCase(); // Convert character to uppercase
                wordSearch[row][col] = { word: word.toUpperCase(), selected: false, guessed: false, value: upperCaseChar, key: nanoid() }; // Set word, selected, guessed, and value properties
                row += rowIncrement[direction];
                col += colIncrement[direction];
            }
        };

        for (let i = 0; i < words.length; i++) {
            let placed = false;
            let attempts = 0;
            while (!placed && attempts < 100) { // Limiting attempts to prevent infinite loop
                const row = randall(gridSize);
                const col = randall(gridSize);
                const direction = randall(8); // 0: Up, 1: UpRight, 2: Right, 3: DownRight, 4: Down, 5: DownLeft, 6: Left, 7: UpLeft

                if (!wordSearch[row][col].word && canPlaceWord(words[i], row, col, direction)) {
                    placeWord(words[i], row, col, direction);
                    placed = true;
                }
                attempts++;
            }
            if (!placed) {
                return false; // Word couldn't be placed, restart the whole process
            }
        }

        return true; // All words placed successfully
    };

    // Attempt to generate the grid until all words are placed
    let success = false;
    while (!success) {
        success = generateGrid();
    }

    // Fill remaining spaces with random characters and nullify the word property
    const randChar = () => String.fromCharCode(65 + randall(26)); // Random uppercase letter
    wordSearch.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (!cell.word) {
                wordSearch[rowIndex][colIndex] = { word: null, selected: false, guessed: false, value: randChar(), key: nanoid() };
            }
        });
    });

    return wordSearch;
}

