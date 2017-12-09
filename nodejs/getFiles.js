/*jshint esversion: 6 */
const path = '../img';

function getFilesFrom(path) {
  'use strict';

  const fs = require('fs');
  let listFiles = [];

  function gatheringFiles(path) {
    let arr = fs.readdirSync(path);

    arr.forEach(elem => {
      listFiles.push(`${elem}`);
    });

  }
  gatheringFiles(path);

  fs.writeFileSync('bundle.js', listFiles);
}

getFilesFrom(path);