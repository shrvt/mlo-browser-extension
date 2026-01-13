# Multi-Language Link Manager - Browser Extension

A Chrome browser extension for opening multiple URL variants simultaneously in separate tabs. Useful for checking the same page across different language or country versions.

## Features

- Auto-populates with current tab's URL
- **Two parsing modes**:
  - **Path mode**: Replace segments in URL path (e.g., `/de/products` → `/en/products`)
  - **Query mode**: Replace segments in encoded `item` query parameter (e.g., `?item=%2Fde%2F...` → `?item=%2Fen%2F...`)
- Visual segment selector to identify the code to replace
- 14 replacement codes: EN, FR, ES, ZH, JA, IT, RU, NL, PL, DE, CH, AT, BE, ROW
  - First 10 are selected by default
  - Last 4 (CH, AT, BE, ROW) are available but unchecked by default
- Quick select All/None buttons
- Saves replacement preferences across sessions (synced via Chrome storage)

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

### Path Mode (Default)

For URLs with language/country codes in the path:

1. Navigate to a page like `https://example.com/de/products`
2. Click the extension icon
3. Ensure "Path" mode is selected (toggle at top-right)
4. Click the path segment containing the code (e.g., "de")
5. Select/deselect replacement codes as needed
6. Click "Open X Tabs" to open all variants

### Query Mode

For URLs with encoded paths in the `item` query parameter:

1. Navigate to a page like `https://example.com/page?item=%2Fcontent%2Fde%2Fdata`
2. Click the extension icon
3. Select "Query" mode (toggle at top-right)
4. Click the segment to replace from the decoded path
5. Select/deselect replacement codes
6. Click "Open X Tabs" to open all variants

Note: Query mode is only available when the URL contains an `item` query parameter.

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
