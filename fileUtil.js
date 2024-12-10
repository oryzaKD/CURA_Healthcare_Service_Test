const fs = require('fs');

function getFilePath(identifier) {
  return `./lastValue-${identifier}.txt`;
}

function writeLastValue(identifier, value) {
  const FILE_PATH = getFilePath(identifier);
  fs.writeFileSync(FILE_PATH, value.toString(), 'utf8');
}

function readLastValue(identifier) {
  const FILE_PATH = getFilePath(identifier);
  try {
    const data = fs.readFileSync(FILE_PATH, 'utf8');
    return parseInt(data, 10);
  } catch (error) {
    return 1;
  }
}

module.exports = { writeLastValue, readLastValue };