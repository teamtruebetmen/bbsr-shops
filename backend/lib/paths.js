'use strict';
// Single source of truth for every path. Nothing else names a directory.
const fs = require('fs');
const path = require('path');

const KEYS = ['data_root','cache_file','tiles_file','place_index_file',
  'state_file','own_root','photos_root','frontend_root','tests_root','backend_root'];

function findRoot(dir) {
  for (;;) {
    if (fs.existsSync(path.join(dir, 'paths.json'))) return dir;
    const up = path.dirname(dir);
    if (up === dir) throw new Error('paths.json not found above ' + __dirname);
    dir = up;
  }
}

const root = findRoot(__dirname);
const raw = JSON.parse(fs.readFileSync(path.join(root, 'paths.json'), 'utf8'));

const bad = KEYS.filter(k => typeof raw[k] !== 'string' || !raw[k]);
if (bad.length) throw new Error('paths.json missing/empty: ' + bad.join(', '));

KEYS.forEach(k => {
  if (path.isAbsolute(raw[k])) throw new Error(k + ' must be relative: ' + raw[k]);
  const abs = path.resolve(root, raw[k]);
  if (abs !== root && !abs.startsWith(root + path.sep))
    throw new Error(k + ' escapes repo root: ' + raw[k]);
});

const out = { root };
KEYS.forEach(k => { out[k] = path.resolve(root, raw[k]); });

out.rel = key => {
  if (!(key in raw)) throw new Error('unknown path key: ' + key);
  return raw[key];
};

out.ensureDirFor = key => {
  if (out[key] === undefined) throw new Error('unknown path key: ' + key);
  const dir = key.endsWith('_file') ? path.dirname(out[key]) : out[key];
  fs.mkdirSync(dir, { recursive: true });
  return dir;
};

module.exports = Object.freeze(out);
