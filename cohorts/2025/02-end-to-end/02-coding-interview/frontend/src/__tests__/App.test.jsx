import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

// Mock WebSocket as a proper constructor
class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.readyState = 1; // OPEN
    MockWebSocket.instance = this;
    // Simulate connection after a tick
    setTimeout(() => {
      if (this.onopen) this.onopen();
    }, 0);
  }
  
  send = vi.fn();
  close = vi.fn();
  onopen = null;
  onmessage = null;
  onclose = null;
  onerror = null;
}

global.WebSocket = MockWebSocket;

// Mock Monaco Editor
vi.mock('@monaco-editor/react', () => ({
  default: ({ value, onChange, language }) => (
    <textarea 
      data-testid="code-editor"
      data-language={language}
      value={value} 
      onChange={(e) => onChange && onChange(e.target.value)} 
    />
  ),
}));

// Mock Pyodide loading
global.window = global.window || {};
global.window.loadPyodide = vi.fn();

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<App />);
    expect(screen.getByText('CodeInterview.ai')).toBeInTheDocument();
    // Button shows "Loading Python..." initially while Pyodide loads
    expect(screen.getByText('Loading Python...')).toBeInTheDocument();
  });

  it('switches languages', async () => {
    render(<App />);
    const select = screen.getByRole('combobox');
    
    // Default is Python
    expect(select.value).toBe('python');
    expect(screen.getByText('Output (python)')).toBeInTheDocument();
    
    // Switch to JS
    fireEvent.change(select, { target: { value: 'javascript' } });
    expect(select.value).toBe('javascript');
    expect(screen.getByText('Output (javascript)')).toBeInTheDocument();
  });

  it('toggles theme', () => {
    render(<App />);
    
    // Initially in dark mode
    expect(screen.getByText('☀️ Light Mode')).toBeInTheDocument();
    
    // Click to switch to light mode
    fireEvent.click(screen.getByText('☀️ Light Mode'));
    expect(screen.getByText('🌙 Dark Mode')).toBeInTheDocument();
    
    // Click to switch back to dark mode
    fireEvent.click(screen.getByText('🌙 Dark Mode'));
    expect(screen.getByText('☀️ Light Mode')).toBeInTheDocument();
  });

  it('connects to WebSocket on mount', () => {
    render(<App />);
    expect(MockWebSocket.instance).toBeDefined();
    expect(MockWebSocket.instance.url).toBe('ws://localhost:8000/ws');
  });
});
