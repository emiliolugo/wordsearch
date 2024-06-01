import React from "react";
import { generateWordSearch } from "./generateWordSearch";
import Letter from "./Letter";
import Word from "./Word";
import Timer from "./Timer";
import { generate } from "random-words";

export default function Wordsearch() {
  const [wordCount, setWordCount] = React.useState(0);
  const [wordArr, setWordArr] = React.useState([]);
  const [wordBoxes, setWordBoxes] = React.useState([]);
  const [difficulty, setDifficulty] = React.useState("Easy");
  const [wordSearchGrid, setWordSearchGrid] = React.useState(null);
  const [totalGuessedWords, setTotalGuessedWords] = React.useState(0);
  const [displayedWordArr, setDisplayedWordArr] = React.useState([]);
  const [win, setWin] = React.useState(false);
  const [timerStart, setTimerStart] = React.useState(false);
  const [trackSelected, setTrackSelected] = React.useState([]);
  const [title, setTitle] = React.useState("My Word Search");
  const [runSearch, setRunSearch] = React.useState(false);

  // Function to handle form submission for entering the number of words
  function handleSubmit(event) {
    event.preventDefault();
    const numWords = parseInt(document.getElementById("num-words").value);
    setWordCount(numWords);
    createWordInputs(numWords);
    const updatedWordArr = Array(numWords).fill(""); // Initialize with empty strings
    setWordArr(updatedWordArr);
    setWordSearchGrid(null); // Reset displayedSearch when form is submitted
  }

  function hasOnlyAlphabeticalLetters(arr) {
    // Regular expression to match only alphabetical letters
    const regex = /^[a-zA-Z]+$/;

    // Iterate through each string in the array
    for (const str of arr) {
      // Test if the string contains only alphabetical letters
      if (!regex.test(str)) {
        return false; // Return false if any string contains non-alphabetical characters
      }
    }

    return true; // Return true if all strings contain only alphabetical letters
  }

  // Function to handle word search generation
  function createRandomWords(event) {
    event.preventDefault();
    event.preventDefault();
    const numWords = parseInt(document.getElementById("num-words").value);
    setWordCount(numWords);
    const updatedWordArr = Array(numWords).fill(""); // Initialize with empty strings
    setWordArr(updatedWordArr);
    setWordArr((prevWordArr) => {
      const randomWordsArray = generate(prevWordArr.length); // Adjust the options as needed
      return randomWordsArray;
    });
    console.log(wordArr);
    setRunSearch((prevRunSearch) => !prevRunSearch);
  }

  React.useEffect(() => {
    if (runSearch) {
      handleWordSearch();
    }
  }, [runSearch]);

  function handleWordSearch(event) {
    if (event) {
      event.preventDefault();
    }

    if (!hasOnlyAlphabeticalLetters(wordArr)) {
      return alert("Please enter only alphabetical characters!");
    }

    let gridSize = Math.max(wordArr.length, Math.max(...wordArr.map((word) => word.length)));
    // Calculate grid size based on the longest word
    if (difficulty === "Medium") {
      gridSize = Math.round(gridSize * 1.2);
    } else if (difficulty === "Hard") {
      gridSize = Math.round(gridSize * 1.5);
    }

    // Generate the word search grid
    setWordSearchGrid(generateWordSearch(wordArr, gridSize, difficulty));
    // Map the word search grid to JSX elements

    const updatedDisplayedWordArr = wordArr.map((word, index) => ({
      key: index,
      word: word,
      guessed: false,
    }));
    setDisplayedWordArr(updatedDisplayedWordArr);
    setTimerStart(true);
  }

  const displayedSearch =
    wordSearchGrid !== null ? (
      wordSearchGrid.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {row.map((cell, cellIndex) => {
            return (
              <Letter
                key={`${rowIndex}-${cellIndex}`}
                word={cell.word}
                selected={cell.selected}
                guessed={cell.guessed}
                value={cell.value}
                toggleSelected={() => toggleSelected(rowIndex, cellIndex)}
              />
            );
          })}
        </tr>
      ))
    ) : null;

  function giveUp() {
    setWordSearchGrid((prevWordSearchGrid) => {
      return prevWordSearchGrid.map((row) => {
        return row.map((cell) => {
          if (!cell.word) return { ...cell, guessed: true };
          const updatedCell = { ...cell, selected: !cell.selected, guessed: true };
          return updatedCell;
        });
      });
    });
  }

  function toggleSelected(rowIndex, cellIndex) {
    setWordSearchGrid((prevWordSearchGrid) => {
      return prevWordSearchGrid.map((row, rIndex) => {
        if (rIndex !== rowIndex) return row;
        return row.map((cell, cIndex) => {
          if (cIndex !== cellIndex || cell.guessed) return cell;
          const updatedCell = { ...cell, selected: !cell.selected };
          if (updatedCell.selected) {
            const newTrackSelected = [...trackSelected, updatedCell];
            setTrackSelected(newTrackSelected);
          } else {
            setTrackSelected((prevTrackSelected) => {
              return prevTrackSelected.filter((item) => item.key !== updatedCell.key);
            });
          }
          return updatedCell;
        });
      });
    });
  }

  React.useEffect(() => {
    console.log(trackSelected);
  }, [trackSelected]);

  React.useEffect(() => {
    if (trackSelected.length > 0) {
      correctWord(trackSelected);
    }
  }, [trackSelected]);

  function correctWord(trackSelected) {
    if (trackSelected[0].word) {
      const guessedWord = trackSelected[0].word;
      let sameWord = true;
      for (const element of trackSelected) {
        if (element.word !== guessedWord) {
          sameWord = false;
          break;
        }
      }
      if (trackSelected.length === guessedWord.length && sameWord) {
        setWordSearchGrid((prevWordSearchGrid) => {
          return prevWordSearchGrid.map((row) => {
            return row.map((cell) => {
              if (cell.word !== guessedWord) return cell;
              const updatedCell = { ...cell, guessed: true };
              return updatedCell;
            });
          });
        });
        setDisplayedWordArr((prevDisplayedWordArr) => {
          return prevDisplayedWordArr.map((element) =>
            element.word.toLowerCase() === guessedWord.toLowerCase()
              ? { ...element, guessed: !element.guessed }
              : element
          );
        });

        const newGuessedWords = totalGuessedWords + 1;
        setTotalGuessedWords(newGuessedWords);
        setTrackSelected([]);
        checkWin(newGuessedWords, wordArr.length);
      }
    }
  }

  function checkWin(totalGuessedWords, length) {
    if (totalGuessedWords > 0) {
      if (totalGuessedWords === length) {
        setWordSearchGrid((prevWordSearchGrid) => {
          return prevWordSearchGrid.map((row) => {
            return row.map((cell) => {
              const updatedCell = { ...cell, guessed: true };
              return updatedCell;
            });
          });
        });
        setWin(true);
        document.getElementById("win-screen").classList.add("slide-down");
        // Select the element with the class 'word-search-proper' after a delay
        setTimeout(() => {
          const wordSearchProper = document.querySelector(".word-search-proper");
          // Apply the blur effect
          wordSearchProper.style.filter = "blur(5px)";
        }, 500); // Delay
      }
    }
  }

  // Function to create word input boxes
  function createWordInputs(numWords) {
    const wordInputs = [];
    for (let i = 0; i < numWords; i++) {
      wordInputs.push(
        <div className="text-box" key={i}>
          <label className="word-label">
            Word {i + 1}:
            
            <input
              type="text"
              name={`word-${i}`}
              onChange={(event) => handleInputChange(event, i)}
            />
          </label>
        </div>
      );
    }
    setWordBoxes(wordInputs);
  }

  // Function to handle changes in word inputs
  function handleInputChange(event, index) {
    setWordArr((prevWordArr) => {
      return [
        ...prevWordArr.slice(0, index),
        event.target.value,
        ...prevWordArr.slice(index + 1),
      ];
    });
  }

  // Function to handle difficulty selection
  function handleDifficulty(event) {
    setDifficulty(event.target.value);
    
  }

  React.useEffect(() => {
    setDifficulty(difficulty);
    console.log(difficulty)
  }, [difficulty]);
  const mediaQuery = window.matchMedia('(max-width: 600px)');
  let numcols = 4
  if (mediaQuery.matches) {
    numcols = 2}
  const gridTemplateColumns = `repeat(${wordArr.length < numcols ? wordArr.length : numcols}, 1fr)`;

  function handleTitle(event) {
    setTitle(event.target.value);
  }

  return (
    <div className="word-search-main">
      <div className="spacer-main">
        {!displayedSearch && (
          <form className="title-prompt">
            <label className="word-title-label">
              <h2>Step 1</h2>
              <p>Enter A Wordsearch Title</p>
              
              <input
                onChange={(event) => handleTitle(event)}
                type="text"
                name="word-title"
                className="word-title"
                autoFocus
              />
            </label>
          </form>
        )}
        {!displayedSearch && (
          <div className="intro">
            <h2>Step 2</h2>              
              <form className="word-count-prompt" onSubmit={handleSubmit}>
                <label className="word-count-label">
                  Enter Number of Words<br></br>
                  <input
                    id="num-words"
                    type="number"
                    name="num-words"
                    className="num-words"
                  />
                </label>
                <div
                  onChange={(event) => handleDifficulty(event)}
                  className="difficulty"
                >
                  <h2>Step 3</h2>
                  <label id="diff-label">Choose a Difficulty</label>
                  <div className="difficulty-radio">
                    <label className="diff-labels">
                      <input
                        type="radio"
                        value="Easy"
                        name="difficulty"
                        defaultChecked
                      />
                      &#160;Easy
                    </label>
                    <label className="diff-labels">
                      <input type="radio" value="Medium" name="difficulty" />
                      &#160;Medium
                    </label>
                    <label className="diff-labels">
                      <input type="radio" value="Hard" name="difficulty" />
                      &#160;Hard
                    </label>
                  </div>
                  <div className="wrd-srch-btn">
                  <button
                  type="submit"
                  className="create-word-search"
                >
                  Choose Words
                </button>
                
                <button className="create-word-search" onClick={createRandomWords}  >
                 Random Words
                </button>
              
                </div>
                </div>
                
              </form>
          </div>
        )}

        {wordCount > 0 && !displayedSearch && (
          <div className="submit-words">
            <div className="text-boxes"
            style={{
              margin: "auto",
              display: "grid",
              gridTemplateColumns: gridTemplateColumns,
              width: "60%",
            }}>{wordBoxes}</div>
            <div className="form-buttons">
              <form onSubmit={handleWordSearch}>
                <button className="create-word-search" type="submit">
                  Create Custom Search
                </button>
              </form>
              
            </div>
          </div>
        )}
      </div>
      {displayedSearch && (
        <div className="word-search-proper">
          <div className="wrd-srch-title">
          <h2 >{title}</h2>
          </div>
          <table className="displayed-word-search">
            <tbody>{displayedSearch}</tbody>
          </table>

          <div
            id="word-checklist"
            style={{
              margin: "auto",
              display: "grid",
              gridTemplateColumns: gridTemplateColumns,
              width: "60%",
            }}
          >
            {displayedWordArr
              .slice() // Create a shallow copy of the array to avoid mutating the original
              .sort((a, b) => a.word.localeCompare(b.word)) // Sort the array alphabetically based on the word property
              .map((wordObj) => (
                <Word
                  key={wordObj.index}
                  word={wordObj.word.toUpperCase()}
                  guessed={wordObj.guessed}
                />
              ))}
          </div>
          <div className="ws-buttons">
            <button className="create-word-search" onClick={() => location.reload()}>
              New Word Search
            </button>
            <button className="create-word-search" onClick={giveUp}>
              Give Up
            </button>
          </div>
        </div>
      )}

      <div id="win-screen" style={{ display: win ? "block" : "none" }}>
        <h1>Congratulations, you win!</h1>
        <p>Final Time:</p>
        <Timer win={win} start={timerStart} />
        <br></br>
        <button className="create-word-search" onClick={() => location.reload()}>
          Create New Word Search
        </button>
      </div>
    </div>
  );
}
