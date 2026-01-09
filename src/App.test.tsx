import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Header', () => {
    it('renders the app title', () => {
      render(<App />)
      expect(screen.getByText('Multi-Language URL Opener')).toBeInTheDocument()
    })

    it('shows DEV MODE badge when not in extension context', () => {
      render(<App />)
      expect(screen.getByText('DEV MODE')).toBeInTheDocument()
    })
  })

  describe('URL Input', () => {
    it('renders URL input with placeholder', () => {
      render(<App />)
      const input = screen.getByPlaceholderText('Enter or paste URL here')
      expect(input).toBeInTheDocument()
    })

    it('has default dev mode URL pre-filled', () => {
      render(<App />)
      const input = screen.getByPlaceholderText('Enter or paste URL here') as HTMLInputElement
      expect(input.value).toBe('https://example.com/de/products/category/item')
    })

    it('updates URL when user types', () => {
      render(<App />)
      const input = screen.getByPlaceholderText('Enter or paste URL here') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'https://test.com/en/page' } })
      expect(input.value).toBe('https://test.com/en/page')
    })

    it('shows error message for invalid URL', () => {
      render(<App />)
      const input = screen.getByPlaceholderText('Enter or paste URL here')
      fireEvent.change(input, { target: { value: 'not-a-valid-url' } })
      expect(screen.getByText('Please enter a valid URL')).toBeInTheDocument()
    })

    it('applies invalid class to input for invalid URL', () => {
      render(<App />)
      const input = screen.getByPlaceholderText('Enter or paste URL here')
      fireEvent.change(input, { target: { value: 'invalid' } })
      expect(input).toHaveClass('invalid')
    })

    it('applies valid class to input for valid URL', () => {
      render(<App />)
      const input = screen.getByPlaceholderText('Enter or paste URL here')
      fireEvent.change(input, { target: { value: 'https://example.com/path' } })
      expect(input).toHaveClass('valid')
    })
  })

  describe('Path Segments', () => {
    it('displays path segments for valid URL', () => {
      render(<App />)
      // Default URL is https://example.com/de/products/category/item
      expect(screen.getByText('de')).toBeInTheDocument()
      expect(screen.getByText('products')).toBeInTheDocument()
      expect(screen.getByText('category')).toBeInTheDocument()
      expect(screen.getByText('item')).toBeInTheDocument()
    })

    it('shows segment selection prompt when no segment selected', () => {
      render(<App />)
      expect(screen.getByText('Click a path segment above to select it')).toBeInTheDocument()
    })

    it('marks segment as selected when clicked', () => {
      render(<App />)
      const deButton = screen.getByText('de').closest('button')
      if (deButton) {
        fireEvent.click(deButton)
        expect(deButton).toHaveClass('selected')
      }
    })

    it('shows info message when URL has no path segments', () => {
      render(<App />)
      const input = screen.getByPlaceholderText('Enter or paste URL here')
      fireEvent.change(input, { target: { value: 'https://example.com' } })
      expect(screen.getByText('URL has no path segments to replace')).toBeInTheDocument()
    })
  })

  describe('Language Selection', () => {
    it('renders all default language checkboxes', () => {
      render(<App />)
      const languages = ['EN', 'FR', 'ES', 'ZH', 'JA', 'IT', 'RU', 'NL', 'PL', 'DE']
      languages.forEach(lang => {
        expect(screen.getByText(lang)).toBeInTheDocument()
      })
    })

    it('all languages are selected by default', () => {
      render(<App />)
      const checkboxes = screen.getAllByRole('checkbox')
      checkboxes.forEach(checkbox => {
        expect(checkbox).toBeChecked()
      })
    })

    it('toggles language when checkbox clicked', () => {
      render(<App />)
      const enCheckbox = screen.getAllByRole('checkbox')[0]
      expect(enCheckbox).toBeChecked()
      fireEvent.click(enCheckbox)
      expect(enCheckbox).not.toBeChecked()
    })

    it('selects all languages when All button clicked', () => {
      render(<App />)
      // First uncheck one
      const firstCheckbox = screen.getAllByRole('checkbox')[0]
      fireEvent.click(firstCheckbox)
      expect(firstCheckbox).not.toBeChecked()

      // Click All
      fireEvent.click(screen.getByText('All'))

      // All should be checked
      const checkboxes = screen.getAllByRole('checkbox')
      checkboxes.forEach(checkbox => {
        expect(checkbox).toBeChecked()
      })
    })

    it('deselects all languages when None button clicked', () => {
      render(<App />)
      fireEvent.click(screen.getByText('None'))

      const checkboxes = screen.getAllByRole('checkbox')
      checkboxes.forEach(checkbox => {
        expect(checkbox).not.toBeChecked()
      })
    })
  })

  describe('Open Button', () => {
    it('shows correct tab count in button text', () => {
      render(<App />)
      expect(screen.getByText(/Open 10 Tabs/)).toBeInTheDocument()
    })

    it('uses singular "Tab" when only one language selected', () => {
      render(<App />)
      // Deselect all, then select one
      fireEvent.click(screen.getByText('None'))
      const firstCheckbox = screen.getAllByRole('checkbox')[0]
      fireEvent.click(firstCheckbox)

      expect(screen.getByText(/Open 1 Tab$/)).toBeInTheDocument()
    })

    it('button is disabled when no segment selected', () => {
      render(<App />)
      const button = screen.getByRole('button', { name: /Open.*Tab/ })
      expect(button).toBeDisabled()
    })

    it('button is disabled when no languages selected', () => {
      render(<App />)
      // Select a segment
      const deButton = screen.getByText('de').closest('button')
      if (deButton) {
        fireEvent.click(deButton)
      }

      // Deselect all languages
      fireEvent.click(screen.getByText('None'))

      const openButton = screen.getByRole('button', { name: /Open.*Tab/ })
      expect(openButton).toBeDisabled()
    })

    it('button is enabled when segment and languages are selected', () => {
      render(<App />)
      // Select a segment
      const deButton = screen.getByText('de').closest('button')
      if (deButton) {
        fireEvent.click(deButton)
      }

      const openButton = screen.getByRole('button', { name: /Open.*Tab/ })
      expect(openButton).not.toBeDisabled()
    })

    it('button is disabled for invalid URL', () => {
      render(<App />)
      const input = screen.getByPlaceholderText('Enter or paste URL here')
      fireEvent.change(input, { target: { value: 'invalid-url' } })

      const button = screen.getByRole('button', { name: /Open.*Tab/ })
      expect(button).toBeDisabled()
    })
  })

  describe('Open All functionality', () => {
    it('shows alert in dev mode when open button clicked', () => {
      const alertSpy = vi.spyOn(globalThis, 'alert').mockImplementation(() => {})

      render(<App />)
      // Select a segment
      const deButton = screen.getByText('de').closest('button')
      if (deButton) {
        fireEvent.click(deButton)
      }

      // Click open button
      const openButton = screen.getByRole('button', { name: /Open.*Tab/ })
      fireEvent.click(openButton)

      expect(alertSpy).toHaveBeenCalled()
      alertSpy.mockRestore()
    })
  })
})
