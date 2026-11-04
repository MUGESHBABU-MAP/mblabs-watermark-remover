# MBLabs Watermark Remover

Private, local-first toolkit for removing supported visible watermarks from Gemini-generated images and videos.

The application uses known watermark geometry, alpha compositing, and local cleanup models. Supported content is processed on your device; files are not uploaded to a hosted service by the local app.

> See `LICENSE` and the source headers for copyright and license notices.

## Features

- Removes supported Gemini/Veo visible watermarks from images and videos
- 100% local processing in the browser or on your machine
- Reverse alpha blending for supported visible marks
- Automatic detection for known output sizes and watermark variants
- Browser UI for image and video workflows
- CLI and agent Skill for scripted processing
- Userscript integration for supported Gemini page flows
- English web interface

## Quick Start

Requires Node.js 20+ and pnpm 10.11.0. If `pnpm` is not available, enable Corepack once:

```bash
corepack enable
```

Clone this repository, install dependencies, and start the local development server:

```bash
git clone https://github.com/MUGESHBABU-MAP/mblabs-watermark-remover.git
cd mblabs-watermark-remover
corepack pnpm install
corepack pnpm dev
```

Open the local tool:

```text
http://localhost:4173/video-preview.html
```

Other local pages:

- `http://localhost:4173/` — image/video debug harness in development mode
- `http://localhost:4173/dev-preview.html` — single-image comparison harness
- `http://localhost:4173/index.html` — local entry page

To stop the server, press `Ctrl+C`.

## Local Browser Workflow

### Images

1. Start the local server with `pnpm dev`.
2. Open `http://localhost:4173/`.
3. Select or drag in a supported image or video.
4. Review the before/after comparison.
5. Copy or download the processed result.

### Videos

1. Open `http://localhost:4173/video-preview.html`.
2. Select or drag in a supported video.
3. Review the detected watermark candidate and export settings.
4. Export the processed video.

The video path runs in the browser through WebCodecs and local model assets. It may take significant CPU or GPU resources for longer videos.

### Userscript

To try the userscript locally:

```bash
pnpm build
corepack pnpm dev
```

Then install Tampermonkey and open the local userscript URL:

```text
http://localhost:4173/userscript/gemini-watermark-remover.user.js
```

The userscript processes supported Gemini page previews and native copy/download flows. It is not a public release channel.

### Unpacked Browser Extension

After building, load `dist/extension` as an unpacked extension in Chrome or Edge. The extension includes an enable/disable toggle on supported Gemini pages.

## Command Line

Repo-local usage:

```bash
node bin/gwr.mjs remove <input> --output <file>
```

After a package is installed or linked:

```bash
gwr remove <input> [--output <file> | --out-dir <dir>] [--overwrite] [--json]
```

Video exports use the calibrated 12 Mbps AVC profile by default. For a higher target:

```bash
gwr remove input.mp4 --output clean.mp4 --video-bitrate-mbps 20
```

The CLI reports video frame progress on stderr. `--video-timeout-ms` is an inactivity timeout; exports may run longer while frames continue advancing.

The default file decoder/encoder uses `sharp`. Browser and `ImageData` SDK consumers do not need it.

## Skill

The repository includes a packaged agent Skill at `skills/gemini-watermark-remover/`.

```bash
node skills/gemini-watermark-remover/scripts/run.mjs remove <input> --output <file>
```

## How It Works

For supported semi-transparent watermarks, the engine models the overlay as alpha compositing:

```text
watermarked = α · logo + (1 − α) · original
```

The original pixel value is recovered from:

```text
original = (watermarked − α · logo) / (1 − α)
```

Detection uses:

1. Known output-size and watermark catalog lookup
2. Local anchor search
3. Restoration validation

Video exports re-encode the video track and pass through compatible audio tracks when supported.

## Supported Scope

Supported:

- Gemini/Veo visible watermarks in supported image outputs
- Gemini/Veo visible watermarks in supported video outputs
- Known catalog variants for size, position, and margin variants
- Local browser preview, video export, CLI, and userscript repair flows

Not supported:

- Invisible or steganographic watermarks
- Arbitrary logos or text not matching supported Gemini/Veo templates
- Generic watermark removal from unrelated third-party images or videos
- Guaranteed results on screenshots, re-encoded files, or previously processed media

This tool targets visible watermarks only. Results can vary with source quality and export settings.

## Development

```bash
# Install dependencies
corepack pnpm install

# Development build and local server
corepack pnpm dev

# Production build
corepack pnpm build

# Local static serving
corepack pnpm serve
```

Full test suite:

```bash
corepack pnpm exec playwright install chromium-headless-shell
corepack pnpm test
```

Integration checks:

```bash
corepack pnpm test
corepack pnpm build
```

## Project Structure

```text
.
├── bin/                   # CLI entrypoint
├── public/                # Local pages and browser assets
├── skills/                # Packaged agent Skill
├── src/
│   ├── cli/               # File processing commands
│   ├── core/              # Detection and restoration pipeline
│   ├── page/              # Gemini page integration
│   ├── sdk/               # Advanced SDK surface
│   ├── shared/            # Shared DOM and session helpers
│   ├── userscript/        # Userscript entrypoints and hooks
│   ├── video/             # Video decode, detect, and export pipeline
│   └── workers/           # Worker runtime
├── tests/                 # Unit, regression, and packaging tests
├── scripts/               # Local automation
└── package.json
```

## Legal Notice

This private repository is licensed under the MIT License. The removal of watermarks may have legal implications depending on jurisdiction and use. You are responsible for ensuring your use complies with applicable laws, terms of service, and intellectual property rights. Do not use this tool to misrepresent authorship or infringe the rights of others.

## License

[MIT License](./LICENSE)
