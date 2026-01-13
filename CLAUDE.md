# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm run dev      # Dev server at localhost:5173
npm run build    # Production build to dist/
npm run lint     # ESLint
```

After building, reload the extension in `chrome://extensions/` by clicking the refresh icon.

## Architecture

**Single-file popup extension** - all UI logic is in `src/App.tsx`.

```
src/App.tsx      # All component logic, state, and Chrome API calls
src/App.css      # Styling (CSS variables using shadcn/ui zinc palette)
manifest.json    # MV3 manifest (permissions: tabs, storage)
vite.config.ts   # Vite + CRXJS plugin
```

## Key Patterns

### Chrome API Detection

```typescript
const isExtension = typeof chrome !== 'undefined' && chrome.tabs !== undefined
```

Used to enable dev mode in regular browser (sample URL, alerts instead of tabs).

### URL Parsing (Two Modes)

**Path mode**: Segments extracted from URL pathname via `new URL(url).pathname.split('/').filter(Boolean)`.

**Query mode**: Segments extracted from the `item` query parameter's decoded value. Used for URLs like `?item=%2Fcontent%2Fhello%2Fde%2Fwhatever` where the path is encoded in a query param.

### State

- `url` - current URL string
- `parseMode` - 'path' or 'query' (determines which part of URL to parse)
- `segmentIndex` - selected segment index (null if none)
- `selectedReplacements` - array of replacement codes (languages or country codes)
- `pathSegments` - parsed segments (from URL path or query param depending on mode)

### Storage

Replacement preferences saved to `chrome.storage.sync` on every toggle for cross-device sync.

## Chrome APIs Used

- `chrome.tabs.query({ active: true, currentWindow: true })` - get current tab
- `chrome.tabs.create({ url })` - open new tab
- `chrome.storage.sync.get/set` - persist preferences
