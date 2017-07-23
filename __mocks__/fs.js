// __mocks__/fs.js
'use strict';

const path = require('path');

const fs = jest.genMockFromModule('fs');

let mockFiles = Object.create(null);
function __setMockFiles(newMockFiles) {
  mockFiles = Object.create(null);
  for (const file in newMockFiles) {
    let dir = path.dirname(file);

    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }

    mockFiles[dir].push({
      basename: path.basename(file),
      content: newMockFiles[file],
    });
  }
}

function findFile(filePath) {
  if (mockFiles[filePath]) return mockFiles[filePath];

  const dir = mockFiles[path.dirname(filePath)];
  if (!dir) {
    return null;
  }

  const basename = path.basename(filePath);
  return dir.find(f => f.basename === basename);
}

function readdirSync(directoryPath) {
  return mockFiles[directoryPath] || [];
}

function existsSync(filePath) {
  return !!findFile(filePath);
}

function readFileSync(filePath) {
  const file = findFile(filePath);

  if (!file) {
    throw new Error(`File not found ${filePath}`);
  }

  return file.content;
}

fs.__setMockFiles = __setMockFiles;
fs.readdirSync = readdirSync;
fs.existsSync = existsSync;
fs.readFileSync = readFileSync;
module.exports = fs;
