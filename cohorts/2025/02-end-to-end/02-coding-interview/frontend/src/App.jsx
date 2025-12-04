import React, { useState, useEffect, useRef } from 'react';
import CodeEditor from './Editor';
import Output from './Output';
import './App.css';

function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [socket, setSocket] = useState(null);
  const [theme, setTheme] = useState('dark');
  
  // Store local copies of code for switching views instantly
  const codeCache = useRef({
    python: "# Write your Python code here\nprint('Hello World')",
    javascript: "// Write your JavaScript code here\nconsole.log('Hello World');"
  });

  useEffect(() => {
    // Apply theme to body
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket('ws://localhost:8000/ws');

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'init') {
        // Initialize cache and set current code
        codeCache.current = { ...codeCache.current, ...message.code };
        setCode(codeCache.current[language]);
      } else if (message.type === 'code_update') {
        // Update cache
        codeCache.current[message.language] = message.code;
        // Only update state if it matches current language
        if (message.language === language) {
          setCode(message.code);
        }
      }
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []); // Run once on mount

  // When language changes, update the displayed code from cache
  useEffect(() => {
    setCode(codeCache.current[language] || "");
  }, [language]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    codeCache.current[language] = newCode;
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <header className="app-header">
        <h1 className="app-title">CodeInterview.ai</h1>
        <div className="header-controls">
          <select 
            className="language-select" 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </select>
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </header>
      
      <div className="app-container">
        <div className="editor-section">
          <CodeEditor 
            code={code} 
            setCode={handleCodeChange} 
            language={language} 
            socket={socket}
            theme={theme}
          />
        </div>
        <div className="output-section">
          <Output code={code} language={language} />
        </div>
      </div>
    </>
  );
}

export default App;
