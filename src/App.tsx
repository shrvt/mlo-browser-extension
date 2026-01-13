import { useEffect, useState } from 'react'
import './App.css'

const DEFAULT_LANGUAGES = [
  'en',
  'fr',
  'es',
  'zh',
  'ja',
  'it',
  'ru',
  'nl',
  'pl',
  'de',
]
const DEV_MODE_URL = 'https://example.com/de/products/category/item'

const isExtension = typeof chrome !== 'undefined' && chrome.tabs !== undefined

const getInitialPathSegments = (urlString: string): string[] => {
  try {
    const urlObj = new URL(urlString)
    return urlObj.pathname.split('/').filter(Boolean)
  } catch {
    return []
  }
}

function App() {
  const [url, setUrl] = useState(() => (isExtension ? '' : DEV_MODE_URL))
  const [segmentIndex, setSegmentIndex] = useState<number | null>(null)
  const [selectedLanguages, setSelectedLanguages] =
    useState<string[]>(DEFAULT_LANGUAGES)
  const [pathSegments, setPathSegments] = useState<string[]>(() =>
    isExtension ? [] : getInitialPathSegments(DEV_MODE_URL),
  )

  const updatePathSegments = (urlString: string) => {
    const segments = getInitialPathSegments(urlString)
    setPathSegments(segments)
    setSegmentIndex(null)
  }

  useEffect(() => {
    if (isExtension) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentUrl = tabs[0]?.url || ''
        setUrl(currentUrl)
        updatePathSegments(currentUrl)
      })

      chrome.storage.sync.get(
        ['selectedLanguages'],
        (result: { selectedLanguages?: string[] }) => {
          if (result.selectedLanguages) {
            setSelectedLanguages(result.selectedLanguages)
          }
        },
      )
    }
  }, [])

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl)
    updatePathSegments(newUrl)
  }

  const handleLanguageToggle = (lang: string) => {
    const newSelection = selectedLanguages.includes(lang)
      ? selectedLanguages.filter((l) => l !== lang)
      : [...selectedLanguages, lang]
    setSelectedLanguages(newSelection)
    if (isExtension) {
      chrome.storage.sync.set({ selectedLanguages: newSelection })
    }
  }

  const handleSelectAll = () => {
    setSelectedLanguages(DEFAULT_LANGUAGES)
    if (isExtension) {
      chrome.storage.sync.set({ selectedLanguages: DEFAULT_LANGUAGES })
    }
  }

  const handleSelectNone = () => {
    setSelectedLanguages([])
    if (isExtension) {
      chrome.storage.sync.set({ selectedLanguages: [] })
    }
  }

  const handleOpenAll = () => {
    if (segmentIndex === null || !url) return

    try {
      const urlObj = new URL(url)
      const segments = urlObj.pathname.split('/').filter(Boolean)

      const urls = selectedLanguages.map((lang) => {
        const newSegments = [...segments]
        newSegments[segmentIndex] = lang
        const newUrl = new URL(urlObj)
        newUrl.pathname = '/' + newSegments.join('/')
        return newUrl.toString()
      })

      if (isExtension) {
        urls.forEach((u) => chrome.tabs.create({ url: u }))
      } else {
        // Dev mode: log URLs that would be opened
        console.log('Would open tabs:', urls)
        alert(`Dev mode: Would open ${urls.length} tabs:\n${urls.join('\n')}`)
      }
    } catch (error) {
      console.error('Invalid URL:', error)
    }
  }

  const isValidUrl = (() => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  })()

  const getInputClassName = () => {
    if (!url) return ''
    return isValidUrl ? 'valid' : 'invalid'
  }

  return (
    <div className="popup">
      <header className="header">
        <div className="logo">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <h1>Multi-Language URL Opener</h1>
        {!isExtension && <span className="dev-badge">DEV MODE</span>}
      </header>

      <div className="section">
        <label htmlFor="url-input">
          <span className="label-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </span>{' '}
          URL
        </label>
        <input
          id="url-input"
          type="text"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="Enter or paste URL here"
          className={getInputClassName()}
        />
      </div>

      {isValidUrl && pathSegments.length > 0 && (
        <div className="section">
          <span className="section-label">
            <span className="label-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
              </svg>
            </span>{' '}
            Select the language segment
          </span>
          <div className="segments">
            {pathSegments.map((segment, index) => (
              <button
                key={`${segment}-${index}`}
                className={`segment ${segmentIndex === index ? 'selected' : ''}`}
                onClick={() => setSegmentIndex(index)}
                title={`Click to select "${segment}" as language segment`}
              >
                <span className="segment-index">{index + 1}</span>
                {segment}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="section">
        <div className="languages-header">
          <span className="section-label">
            <span className="label-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </span>{' '}
            Languages
          </span>
          <div className="quick-select">
            <button onClick={handleSelectAll} className="link-button">
              All
            </button>
            <span className="divider">|</span>
            <button onClick={handleSelectNone} className="link-button">
              None
            </button>
          </div>
        </div>
        <div className="languages">
          {DEFAULT_LANGUAGES.map((lang) => (
            <label
              key={lang}
              className={`language-checkbox ${selectedLanguages.includes(lang) ? 'checked' : ''}`}
            >
              <input
                type="checkbox"
                checked={selectedLanguages.includes(lang)}
                onChange={() => handleLanguageToggle(lang)}
              />
              <span className="checkmark">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span className="lang-code">{lang.toUpperCase()}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        className="open-button"
        onClick={handleOpenAll}
        disabled={
          !isValidUrl || segmentIndex === null || selectedLanguages.length === 0
        }
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        Open {selectedLanguages.length} Tab
        {selectedLanguages.length === 1 ? '' : 's'}
      </button>

      {!isValidUrl && url && (
        <div className="error-message">Please enter a valid URL</div>
      )}
      {isValidUrl && pathSegments.length === 0 && (
        <div className="info-message">URL has no path segments to replace</div>
      )}
      {isValidUrl && pathSegments.length > 0 && segmentIndex === null && (
        <div className="info-message">
          Click a path segment above to select it
        </div>
      )}
    </div>
  )
}

export default App
