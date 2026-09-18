'use strict';
// Tile grid for the Bhubaneswar bounding box.
//
// Works entirely in integer micro-degrees. Doing this in floats is a trap:
// (20.42 - 20.22) / 0.02 evaluates to 9.999999999999986, so a naive
// while-loop emits a spurious 11th sliver row. Integers make the count exact.

const BBOX = {
  lat_min: 20220000,   // 20.22 N
  lat_max: 20420000,   // 20.42 N
  lng_min: 85740000,   // 85.74 E
  lng_max: 85920000    // 85.92 E
};

const TILE = 20000;          // 0.02 deg in micro-degrees
const SEARCH_RADIUS_M = 1600; // covers the tile's half-diagonal (~1.52 km)

const EXPECTED_ROWS = 10;
const EXPECTED_COLS = 9;
const EXPECTED_TILES = EXPECTED_ROWS * EXPECTED_COLS;  // 90

function toDeg(micro) {
  return micro / 1e6;
}

function buildTiles() {
  const latSpan = BBOX.lat_max - BBOX.lat_min;
  const lngSpan = BBOX.lng_max - BBOX.lng_min;

  if (latSpan % TILE !== 0 || lngSpan % TILE !== 0) {
    throw new Error(
      'bounding box is not a whole number of tiles: latSpan=' + latSpan +
      ' lngSpan=' + lngSpan + ' tile=' + TILE
    );
  }

  const rows = latSpan / TILE;
  const cols = lngSpan / TILE;
  const tiles = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lat0 = BBOX.lat_min + r * TILE;
      const lng0 = BBOX.lng_min + c * TILE;
      tiles.push({
        id: 'r' + r + 'c' + c,
        row: r,
        col: c,
        lat_min: toDeg(lat0),
        lat_max: toDeg(lat0 + TILE),
        lng_min: toDeg(lng0),
        lng_max: toDeg(lng0 + TILE),
        center_lat: toDeg(lat0 + TILE / 2),
        center_lng: toDeg(lng0 + TILE / 2),
        radius_m: SEARCH_RADIUS_M
      });
    }
  }

  if (tiles.length !== EXPECTED_TILES) {
    throw new Error('expected ' + EXPECTED_TILES + ' tiles, got ' + tiles.length);
  }

  return tiles;
}

module.exports = {
  BBOX,
  TILE,
  SEARCH_RADIUS_M,
  EXPECTED_ROWS,
  EXPECTED_COLS,
  EXPECTED_TILES,
  buildTiles
};
