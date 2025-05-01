import '@testing-library/jest-dom';

// Mock completo de localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

// Mock completo de window.location
delete window.location;
window.location = {
  href: '',
  assign: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock para scrollTo
window.scrollTo = vi.fn();