import React from "react";
import { generateWordSearch } from "./generateWordSearch";
import Letter from "./Letter";
import Word from "./Word";
import Timer from "./Timer";

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
  const [title, setTitle] = React.useState("My Word Search")

  // Function to handle form submission for entering the number of words
  function handleSubmit(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      const numWords = parseInt(event.currentTarget.elements["num-words"].value);
      setWordCount(numWords);
      createWordInputs(numWords);
      const updatedWordArr = Array(numWords).fill(""); // Initialize with empty strings
      setWordArr(updatedWordArr);
      setWordSearchGrid(null); // Reset displayedSearch when form is submitted
    }
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
  function handleWordSearch(event) {
    event.preventDefault();
    if (!hasOnlyAlphabeticalLetters(wordArr)) {
      return alert("please enter only alphabetical characters!");
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
            element.word === guessedWord ? { ...element, guessed: !element.guessed } : element
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
        document.getElementById('win-screen').classList.add('slide-down');
        // Select the element with the class 'word-search-proper' after a delay
setTimeout(() => {
    const wordSearchProper = document.querySelector('.word-search-proper');
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
            <input type="text" name={`word-${i}`} onChange={(event) => handleInputChange(event, i)} />
          </label>
        </div>
      );
    }
    setWordBoxes(wordInputs);
  }

  // Function to handle changes in word inputs
  function handleInputChange(event, index) {
    setWordArr((prevWordArr) => {
      return [...prevWordArr.slice(0, index), event.target.value, ...prevWordArr.slice(index + 1)];
    });
  }

  // Function to handle difficulty selection
  function handleDifficulty(event) {
    setDifficulty(event.target.value);
  }

  const gridTemplateColumns = `repeat(${wordArr.length < 4 ? wordArr.length : 4}, 1fr)`;

  function handleTitle(event){
    setTitle(event.target.value)
  }



  return (
    <div className="word-search-main">
        {!displayedSearch &&(
            <form  className="title-prompt">
            <label className="word-count-label">
              Enter A Wordsearch Title<br></br>
              <input onChange={(event) =>handleTitle(event)} type="text" name="word-title" className="word-title" autoFocus />
            </label>
          </form>
        )}
      {!displayedSearch && (
        <div className="intro">
          <form onKeyDown={handleSubmit} className="word-count-prompt">
            <label className="word-count-label">
              Number of Words:<br />
              <input type="number" name="num-words" className="num-words"/>
            </label>
            <p className="enter-text">Press enter to submit</p>
          </form>
          <div onChange={(event) => handleDifficulty(event)} className="difficulty">
            <label id="diff-label">Difficulty:</label>
            <div className="difficulty-radio">
              <label className="diff-labels">
                <input type="radio" value="Easy" name="difficulty" defaultChecked />
                Easy
              </label>
              <label className="diff-labels">
                <input type="radio" value="Medium" name="difficulty" />
                Medium
              </label>
              <label className="diff-labels">
                <input type="radio" value="Hard" name="difficulty" />
                Hard
              </label>
            </div>
          </div>
        </div>
      )}

      {wordCount > 0 && !displayedSearch && (
        <form className="submit-words" onSubmit={handleWordSearch}>
          <div className="text-boxes">{wordBoxes}</div>

          <button className="create-word-search" type="submit">
            Create Word Search
          </button>
        </form>
      )}

      {displayedSearch && (
        <div className = "word-search-proper">
            <h2>{title}</h2>
          <table className="displayed-word-search">
            <tbody>{displayedSearch}</tbody>
          </table>

          <div id="word-checklist" style={{ margin: "auto", display: "grid", gridTemplateColumns: gridTemplateColumns, width: "60%" }}>
            {displayedWordArr.map((wordObj) => (
              <Word key={wordObj.index} word={wordObj.word.toUpperCase()} guessed={wordObj.guessed} />
            ))}
          </div>
          <button className="create-word-search" onClick={()=> location.reload()}>
            Create New Word Search
          </button>
        </div>
      )}

        <div id="win-screen" style = {{display: win?"block":"none"}}>
            <h1>Congratulations, you win!</h1>
            <p>Final Time:</p>
          <Timer win={win} start={timerStart} />
          <br></br>
          <button 
          className="create-word-search" onClick={()=> location.reload()}>
            Create New Word Search
          </button>
        </div>
      
    </div>
  );
}
