const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const csvFilePath = './from.csv';
const jsonFilePath = './redirects.json';

const csvToJson = (csv) => {
  const lines = csv.split('\n');
  const headers = lines[0].split(',');
  let jsonData = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(',');
    let obj = {
      id: uuidv4().toLowerCase(),
      sourceUrl: currentLine[0].trim(),
      targetUrl: currentLine[1] ? currentLine[1].trim() : '',
      targetStatusCode: currentLine[2] ? parseInt(currentLine[2].trim()) : 301,
      targetMergeQuerystring: true,
      sourceRetainQuerystring: true
    };

    // Optional parameters
    obj.sourceMustMatchDomain = obj.targetUrl.includes('http') ? false: true;
    obj.targetPreserveIncomingProtocol = obj.targetUrl.includes('http') ? false: true;
    obj.targetPreserveIncomingDomain = obj.targetUrl.includes('http') ? false: true;
    obj.labelAsSystem = true;

    jsonData.push(obj);
  }

  jsonData = { redirects: jsonData };

  return jsonData;
};

fs.readFile(csvFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading CSV file:', err);
    return;
  }

  const jsonData = csvToJson(data);
  const jsonOutput = JSON.stringify(jsonData, null, 2);

  fs.writeFile(jsonFilePath, jsonOutput, 'utf8', (err) => {
    if (err) {
      console.error('Error writing JSON file:', err);
      return;
    }
    console.log('JSON data has been written to redirects.json');
  });
});
