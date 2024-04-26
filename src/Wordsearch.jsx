import React from "react";
import { generateWordSearch } from "./generateWordSearch";

export default function Wordsearch() {
    const [wordCount, setWordCount] = React.useState(0);
    const [wordArr, setWordArr] = React.useState([]);
    const [wordBoxes, setWordBoxes] = React.useState([]);
    const [difficulty, setDifficulty] = React.useState("Easy");
    const [displayedSearch, setDisplayedSearch] = React.useState(null); // Initialize as null

    function handleSubmit(event) {
        event.preventDefault();
        const numWords = parseInt(event.target.elements["num-words"].value);
        setWordCount(numWords);
        createWordInputs(numWords);
        const updatedWordArr = Array(numWords).fill(""); // Initialize with empty strings
        setWordArr(updatedWordArr);
        setDisplayedSearch(null); // Reset displayedSearch when form is submitted
    }

    function handleWordSearch(event) {
        event.preventDefault();
        let gridSize = Math.max(...wordArr.map(word => word.length));

        // Calculate grid size based on the longest word
        if (difficulty === "Medium") {
            gridSize = Math.round(gridSize * 1.2);
        } else if (difficulty === "Hard") {
            gridSize = Math.round(gridSize * 1.5);
        }

        // Generate the word search grid
        const wordSearchGrid = generateWordSearch(wordArr, gridSize, difficulty);

        // Map the word search grid to JSX elements
        const displayedSearch = wordSearchGrid.map((row, rowIndex) => (
            <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                ))}
            </tr>
        ));
        setDisplayedSearch(displayedSearch); // Set displayedSearch state
    }

    function handleInputChange(event, index) {
        setWordArr(prevWordArr => {
            // Use spread syntax to create a new array instead of modifying the previous state directly
            return [...prevWordArr.slice(0, index), event.target.value, ...prevWordArr.slice(index + 1)];
        });
    }

    function createWordInputs(numWords) {
        const wordInputs = [];
        for (let i = 0; i < numWords; i++) {
            wordInputs.push(
                <div key={i}>
                    <label>
                        Word {i + 1}:
                        <input type="text" name={`word-${i}`} onChange={(event) => handleInputChange(event, i)} />
                    </label>
                </div>
            );
        }
        setWordBoxes(wordInputs);
    }

    function handleDifficulty(event) {
        setDifficulty(event.target.value);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Number of Words:
                    <input type="number" name="num-words" />
                </label>
                <input type="submit" value="Submit" />
            </form>
            {wordCount > 0 && (
                <form onSubmit={handleWordSearch}> {/* Add onSubmit to the form */}
                    {wordBoxes}
                    <div onChange={(event) => handleDifficulty(event)}>
                        <label>
                            Select Difficulty
                            <input type="radio" value="Easy" name="difficulty" defaultChecked />
                            Easy
                        </label>
                        <label>
                            <input type="radio" value="Medium" name="difficulty" />
                            Medium
                        </label>
                        <label>
                            <input type="radio" value="Hard" name="difficulty" />
                            Hard
                        </label>
                    </div>
                    <button className="createWordSearch" type="submit">Create Word Search!</button>
                </form>
            )}
            {displayedSearch && ( // Conditionally render displayedSearch
                <table>
                    <tbody>
                        {displayedSearch}
                    </tbody>
                </table>
            )}
        </div>
    );
}
