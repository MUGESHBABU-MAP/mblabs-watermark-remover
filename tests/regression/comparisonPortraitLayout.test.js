import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');

function readRepoText(relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('portrait comparison layout should shrink to image width and align to right-bottom', () => {
  const html = readRepoText('public/dev-preview.html');
  const css = readRepoText('public/mblabs.css');

  assert.match(html, /<div[^>]+id="comparisonContainer"[^>]+class="comparison-frame"/i);
  assert.match(css, /\.comparison-frame\s*\{[^}]*width:\s*fit-content/i);
  assert.match(css, /\.comparison-frame\s*\{[^}]*max-width:\s*100%/i);
  assert.match(css, /\.comparison-frame\s+img\s*\{[^}]*width:\s*auto/i);
  assert.match(css, /\.comparison-frame\s+img\s*\{[^}]*height:\s*auto/i);
  assert.match(css, /\.comparison-frame\s+img\s*\{[^}]*max-width:\s*100%/i);
  assert.match(css, /\.comparison-frame\s+img\s*\{[^}]*object-position:\s*right bottom/i);
});
