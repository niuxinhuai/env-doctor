import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cli = path.join(root, 'src', 'cli.js');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'env-doctor-'));

function run(args = []) {
  return spawnSync(process.execPath, [cli, ...args], { cwd: tmp, encoding: 'utf8' });
}

fs.writeFileSync(path.join(tmp, 'env-doctor.config.json'), JSON.stringify({
  checks: [
    { name: 'Node.js', command: 'node -v', minVersion: '18.0.0' }
  ]
}, null, 2));

const ok = run(['--json']);
assert.equal(ok.status, 0);
assert.equal(JSON.parse(ok.stdout)[0].ok, true);

fs.writeFileSync(path.join(tmp, 'env-doctor.config.json'), JSON.stringify({
  checks: [
    { name: 'Future Node.js', command: 'node -v', minVersion: '999.0.0', fix: 'Install a future Node.js.' }
  ]
}, null, 2));

const failed = run();
assert.equal(failed.status, 1);
assert.match(failed.stdout, /FAIL Future Node\.js/);
assert.match(failed.stdout, /Install a future Node\.js/);

console.log('env-doctor tests passed');
