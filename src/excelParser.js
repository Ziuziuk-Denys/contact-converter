const XLSX = require('xlsx');

function parseExcel(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const result = []

    for(const row of rows) {
        let text = '';
        for (const key in row) {
            text += key + ': ' + row[key] + '\n';
        }
        result.push(text)
    }
    return result;
}


module.exports = { parseExcel };