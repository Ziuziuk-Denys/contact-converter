const readline = require('readline');
const { convertContact } = require('./src/converter');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('Paste contact details (press Enter twice when done):');

let lines = [];
let emptyLineCount = 0;

rl.on('line', (line) => {
    if (line === '') {
        emptyLineCount++;
    }

    if (emptyLineCount >= 2) {
        rl.close();
        const inputText = lines.join('\n');

        (async () => {
            const result = await convertContact(inputText);
            console.log(result);
        })();

    } else {
        lines.push(line);
        emptyLineCount = 0;
    }
});