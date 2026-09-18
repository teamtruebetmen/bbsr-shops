'use strict';
const assert = require('assert');
const t = require('../crawler/tiles');

const tiles = t.buildTiles();
let n = 0;
function check(name, fn) { fn(); n++; console.log('  ok  ' + name); }

check('exactly 90 tiles', () => {
  assert.strictEqual(tiles.length, 90);
});

check('10 rows by 9 cols', () => {
  assert.strictEqual(new Set(tiles.map(x => x.row)).size, t.EXPECTED_ROWS);
  assert.strictEqual(new Set(tiles.map(x => x.col)).size, t.EXPECTED_COLS);
});

check('no sliver row past the north edge', () => {
  const maxLat = Math.max(...tiles.map(x => x.lat_max));
  assert.ok(Math.abs(maxLat - t.BBOX.lat_max / 1e6) < 1e-9, 'maxLat=' + maxLat);
});

check('tiles tile the box with no gap or overlap', () => {
  const area = tiles.reduce((s, x) =>
    s + (x.lat_max - x.lat_min) * (x.lng_max - x.lng_min), 0);
  const boxArea = ((t.BBOX.lat_max - t.BBOX.lat_min) / 1e6) *
                  ((t.BBOX.lng_max - t.BBOX.lng_min) / 1e6);
  assert.ok(Math.abs(area - boxArea) < 1e-12, 'area=' + area + ' box=' + boxArea);
});

check('ids are unique', () => {
  assert.strictEqual(new Set(tiles.map(x => x.id)).size, tiles.length);
});

check('every center is inside its own tile', () => {
  tiles.forEach(x => {
    assert.ok(x.center_lat > x.lat_min && x.center_lat < x.lat_max, x.id);
    assert.ok(x.center_lng > x.lng_min && x.center_lng < x.lng_max, x.id);
  });
});

check('float arithmetic would have been wrong', () => {
  // the bug this module exists to avoid
  assert.notStrictEqual((20.42 - 20.22) / 0.02, 10);
});

console.log('\n' + n + ' passed');
