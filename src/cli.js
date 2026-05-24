#!/usr/bin/env node
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`env-doctor

Usage:
  env-doctor [--config env-doctor.config.json] [--json]

Runs project-defined environment checks and prints fix-friendly diagnostics.`);
  process.exit(0);
}

const configIndex = args.indexOf('--config');
const configPath = configIndex >= 0 ? args[configIndex + 1] : 'env-doctor.config.json';
const asJson = args.includes('--json');

function semver(text) {
  const match = String(text).match(/(\d+)\.(\d+)\.(\d+)/);
  return match ? match.slice(1, 4).map(Number) : null;
}

function gte(actual, required) {
  for (let i = 0; i < 3; i += 1) {
    if (actual[i] > required[i]) return true;
    if (actual[i] < required[i]) return false;
  }
  return true;
}

if (!fs.existsSync(configPath)) {
  console.error(`Missing config: ${configPath}`);
  process.exit(2);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const results = [];
for (const check of config.checks || []) {
  const parts = check.command.split(/\s+/);
  const run = spawnSync(parts[0], parts.slice(1), { encoding: 'utf8' });
  const output = `${run.stdout || ''}${run.stderr || ''}`.trim();
  const actual = semver(output);
  const required = check.minVersion ? semver(check.minVersion) : null;
  const ok = run.status === 0 && (!required || (actual && gte(actual, required)));
  results.push({ name: check.name, command: check.command, ok, output, minVersion: check.minVersion || null, fix: check.fix || null });
}

if (asJson) {
  console.log(JSON.stringify(results, null, 2));
} else {
  for (const result of results) {
    console.log(`${result.ok ? 'OK' : 'FAIL'} ${result.name}: ${result.output || result.command}`);
    if (!result.ok && result.fix) console.log(`  fix: ${result.fix}`);
  }
}

process.exit(results.every((result) => result.ok) ? 0 : 1);
