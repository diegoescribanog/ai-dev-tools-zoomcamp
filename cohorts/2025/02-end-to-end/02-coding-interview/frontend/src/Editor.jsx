import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, setCode, language, socket, theme }) => {
  const editorRef = useRef(null);
  const isRemoteUpdate = useRef(false);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function handleEditorChange(value, event) {
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }
    setCode(value);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'code_update',
        language: language,
        code: value
      }));
    }
  }

  useEffect(() => {
    if (editorRef.current && code !== editorRef.current.getValue()) {
      isRemoteUpdate.current = true;
    }
  }, [code]);

  return (
    <Editor
      height="100%"
      defaultLanguage="python"
      language={language}
      value={code}
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      theme={theme === 'dark' ? 'vs-dark' : 'light'}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        padding: { top: 16 },
        scrollBeyondLastLine: false,
        fontFamily: "'Fira Code', monospace",
      }}
    />
  );
};

export default CodeEditor;
