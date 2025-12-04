import React, { useState, useEffect } from 'react';

const Output = ({ code, language }) => {
  const [output, setOutput] = useState([]);
  const [pyodide, setPyodide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPyodide = async () => {
      try {
        if (window.loadPyodide) {
            const pyodideInstance = await window.loadPyodide();
            setPyodide(pyodideInstance);
            setIsLoading(false);
        } else {
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
            script.onload = async () => {
                const pyodideInstance = await window.loadPyodide();
                setPyodide(pyodideInstance);
                setIsLoading(false);
            };
            document.head.appendChild(script);
        }
      } catch (error) {
        console.error("Error loading Pyodide:", error);
        setOutput(["Error loading Python environment."]);
        setIsLoading(false);
      }
    };

    loadPyodide();
  }, []);

  const runPython = async () => {
    if (!pyodide) return;
    setOutput([]);
    try {
      pyodide.setStdout({ batched: (msg) => setOutput((prev) => [...prev, msg]) });
      await pyodide.runPythonAsync(code);
    } catch (error) {
      setOutput((prev) => [...prev, `Error: ${error.message}`]);
    }
  };

  const runJavascript = () => {
    setOutput([]);
    const logs = [];
    
    // Capture console.log
    const originalLog = console.log;
    console.log = (...args) => {
      logs.push(args.map(arg => String(arg)).join(' '));
      // originalLog(...args); // Optional: keep logging to browser console
    };

    try {
      // Use new Function to execute code in a slightly isolated scope
      // Note: This is NOT secure for untrusted code in a real production environment without sandboxing (e.g. iframes/WebWorkers)
      // But for this homework/demo it's sufficient.
      new Function(code)();
    } catch (error) {
      logs.push(`Error: ${error.message}`);
    } finally {
      console.log = originalLog;
      setOutput(logs);
    }
  };

  const runCode = () => {
    if (language === 'python') {
      runPython();
    } else if (language === 'javascript') {
      runJavascript();
    }
  };

  return (
    <div className="output-panel">
      <div className="output-header">
        <h3>Output ({language})</h3>
        <button 
          onClick={runCode} 
          disabled={language === 'python' && isLoading} 
          className="run-button"
        >
          {language === 'python' && isLoading ? 'Loading Python...' : 'Run Code'}
        </button>
      </div>
      <div className="output-content">
        {output.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
    </div>
  );
};

export default Output;
