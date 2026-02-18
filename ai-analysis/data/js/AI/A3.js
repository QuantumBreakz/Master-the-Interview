// AI-generated logging utility
// Reads logs, filters errors, and saves to JSON

const fs = require('fs');
const path = require('path');

// Directory containing log files
const LOG_DIR = './logs';

// Read all log files from directory
function readLogs(dir) {
    const files = fs.readdirSync(dir);
    const logs = [];
    for (const file of files) {
        if (file.endsWith('.log')) {
            const content = fs.readFileSync(path.join(dir, file), 'utf-8');
            const lines = content.split(/\r?\n/);
            for (const line of lines) {
                const log = parseLine(line);
                if (log) logs.push(log);
            }
        }
    }
    return logs;
}

// Parse a log line into an object
function parseLine(line) {
    // Example: [2025-08-31T12:34:56] INFO - Message
    const match = line.match(/\[(.*?)\] (\w+) - (.*)/);
    if (!match) return null;
    return { timestamp: match[1], level: match[2], message: match[3] };
}

// Save logs to JSON file
function saveJSON(data, file) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log(`Saved ${data.length} entries to ${file}`);
}

// Main processing
function main() {
    const logs = readLogs(LOG_DIR);
    const errors = logs.filter(l => l.level === 'ERROR');

    saveJSON(logs, 'all_logs.json');
    saveJSON(errors, 'error_logs.json');

    console.log(`Processed ${logs.length} logs, ${errors.length} errors`);
}

main();
