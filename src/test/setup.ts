import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Chrome APIs - but don't include tabs to simulate non-extension environment
// This makes isExtension = false, enabling dev mode for tests
const chromeMock = {
  storage: {
    sync: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
}

// Assign mock to global (without tabs, so isExtension will be false)
Object.assign(global, { chrome: chromeMock })

// Export for test access
export { chromeMock }
