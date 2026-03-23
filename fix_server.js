const fs = require('fs');
let code = fs.readFileSync('gui/backend/server.js', 'utf8');

const lines = code.split('\n');
let i = 0;
while (i < lines.length) {
    if (lines[i].includes('const allowedSides = [\'buy\', \'sell\'];')) {
        let isDuplicate = false;
        for (let j = i + 1; j < Math.min(i + 20, lines.length); j++) {
            if (lines[j].includes('const allowedSides = [\'buy\', \'sell\'];')) {
                // Delete everything from i to j-1
                lines.splice(i, j - i);
                isDuplicate = true;
                break;
            }
        }
        if (isDuplicate) {
            continue; // Loop again, as lines are shorter
        }
    }
    // Also fix the regex
    if (lines[i].includes('const symbolRegex')) {
        lines[i] = "  const symbolRegex = /^[A-Z0-9-]+\\/[A-Z0-9-]+$/i;";
    }
    i++;
}

fs.writeFileSync('gui/backend/server.js', lines.join('\n'));
