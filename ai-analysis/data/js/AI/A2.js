// AI-generated text processing example
// Reads multiple text files, cleans, tokenizes, and counts word frequency

const fs = require('fs');
const path = require('path');

// Directory containing text files
const TEXT_DIR = './texts';

// Example stop words
const stopWords = new Set(['the','and','is','in','of','to']);

// Load all text files
function loadTexts(dir) {
    const files = fs.readdirSync(dir);
    const texts = [];
    for (const file of files) {
        if (file.endsWith('.txt')) {
            const content = fs.readFileSync(path.join(dir, file), 'utf-8');
            texts.push(content);
        }
    }
    return texts;
}

// Clean text: lowercase, remove punctuation
function cleanText(text) {
    return text.toLowerCase().replace(/[^\w\s]/g, ' ').trim();
}

// Tokenize text into words
function tokenize(text) {
    return text.split(/\s+/);
}

// Remove stopwords
function removeStopWords(tokens) {
    return tokens.filter(t => !stopWords.has(t));
}

// Count word frequency
function countWords(tokens) {
    const freq = {};
    for (const t of tokens) {
        freq[t] = (freq[t] || 0) + 1;
    }
    return freq;
}

// Main processing
function main() {
    const texts = loadTexts(TEXT_DIR);
    let globalFreq = {};

    for (const text of texts) {
        let tokens = tokenize(cleanText(text));
        tokens = removeStopWords(tokens);
        const freq = countWords(tokens);
        for (const [word, count] of Object.entries(freq)) {
            globalFreq[word] = (globalFreq[word] || 0) + count;
        }
    }

    // Get top 20 words
    const top = Object.entries(globalFreq)
        .sort((a,b)=>b[1]-a[1])
        .slice(0,20);

    console.log("Top 20 words:");
    top.forEach(([w,c]) => console.log(`${w}: ${c}`));
}

main();
