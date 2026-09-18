'use strict';
// Writes the grid to the tiles_file named in paths.json. No network.
const fs = require('fs');
const paths = require('../backend/lib/paths');
const { buildTiles, EXPECTED_TILES } = require('./tiles');

const tiles = buildTiles();
paths.ensureDirFor('tiles_file');
fs.writeFileSync(paths.tiles_file, JSON.stringify(tiles, null, 2) + '\n');
console.log('wrote ' + tiles.length + '/' + EXPECTED_TILES + ' tiles to ' + paths.rel('tiles_file'));
