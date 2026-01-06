# Multi-Language URL Opener

A Chrome browser extension for opening multiple URL variants simultaneously in separate tabs. Useful for checking the same page across different language versions.

## Features

- Auto-populates with current tab's URL
- Visual path segment selector to identify the language code
- 10 default languages: EN, FR, ES, ZH, JA, IT, RU, NL, PL, DE
- Quick select All/None for languages
- Saves language preferences across sessions

## Installation

### From Source

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Load in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist/` folder

## Usage

1. Navigate to a page with a language code in the URL path (e.g., `https://example.com/de/products`)
2. Click the extension icon
3. Click the path segment containing the language code (e.g., "de")
4. Select/deselect languages as needed
5. Click "Open X Tabs" to open all variants

## Development

```bash
npm run dev      # Start dev server (UI works without Chrome APIs)
npm run build    # Production build
npm run lint     # Run ESLint
```

Dev mode uses a sample URL and shows alerts instead of opening tabs, allowing UI development in a regular browser.

## Tech Stack

- Chrome Extension Manifest V3
- React + TypeScript
- Vite + CRXJS plugin
