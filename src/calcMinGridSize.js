function calculateMinGridSize(words) {
    const maxWordLength = Math.max(...words.map(word => word.length));
    const numWords = words.length;
    // For horizontal orientation, the minimum grid size is the maximum word length
    // For vertical orientation, the minimum grid size is the number of words
    return Math.max(maxWordLength, numWords);
}