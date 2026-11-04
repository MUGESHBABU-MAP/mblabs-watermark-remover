import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function readText(relativePath) {
    return readFile(new URL(`../../${relativePath}`, import.meta.url), 'utf8');
}

test('public root page should stay noindex and stay on the private local product', async () => {
    const html = await readText('public/index.html');

    assert.match(html, /<meta\s+name="robots"\s+content="[^"]*noindex[^"]*nofollow[^"]*"/i);
    assert.match(html, /MBLabs Watermark Remover/i);
    assert.match(html, /href="video-preview\.html"/i);
    assert.match(html, /href="dev-preview\.html"/i);
    assert.doesNotMatch(html, /geminiwatermarkremover\.io/i);
});

test('public root page should point users to the local video tool, userscript, and image studio', async () => {
    const html = await readText('public/index.html');

    assert.match(html, /href="video-preview\.html"/i);
    assert.match(html, /href="userscript\/gemini-watermark-remover\.user\.js"/i);
    assert.match(html, /href="dev-preview\.html"/i);
});

test('internal dev preview page should retain the browser preview app entry', async () => {
    const html = await readText('public/dev-preview.html');

    assert.match(html, /id="uploadArea"/i);
    assert.match(html, /id="comparisonContainer"/i);
    assert.match(html, /<script\s+src="app\.js"><\/script>/i);
});

test('internal dev preview page should use local MBLabs styles and no external Tailwind CDN', async () => {
    const html = await readText('public/dev-preview.html');
    const css = await readText('public/mblabs.css');

    assert.doesNotMatch(html, /cdn\.tailwindcss\.com/i);
    assert.doesNotMatch(html, /\btailwind\.config\b/i);
    assert.match(html, /href="mblabs\.css"/i);
    assert.match(css, /\.comparison-frame\s*\{/i);
});

test('internal dev preview page should support multi-file image batches without old zip download UI', async () => {
    const html = await readText('public/dev-preview.html');

    assert.match(html, /<input[^>]+id="fileInput"[^>]+\bmultiple\b/i);
    assert.match(html, /id="multiPreview"/i);
    assert.match(html, /id="imageList"/i);
    assert.match(html, /id="progressText"/i);
    assert.doesNotMatch(html, /id="downloadAllBtn"/i);
});

test('internal dev preview page should not expose language switch, theme toggle, or html i18n hooks', async () => {
    const html = await readText('public/dev-preview.html');

    assert.doesNotMatch(html, /id="langSwitch"/i);
    assert.doesNotMatch(html, /id="themeToggle"/i);
    assert.doesNotMatch(html, /data-i18n="/i);
    assert.doesNotMatch(html, /\bdark:/i);
});
