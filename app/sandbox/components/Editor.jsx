'use client';
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import Editor from '@monaco-editor/react';
import Settings from "./EditorSettings/Setting";

export default function SandBox() {
    const editorRef = useRef(null);
    const containerRef = useRef(null);
    const [showSettings, setShowSettings] = useState(false);
    const [editorSettings, setEditorSettings] = useState(null);
    const [defaultValue, setDefaultValue] = useState("// Start Writing Code ...");
    const [terminalOutput, setTerminalOutput] = useState("Nothing To Show Here");

    // Resetting Editor
    function resetCodeEditor() {
        setDefaultValue("// Start Fresh");
    }

    // Clear Terminal
    function clearTerminal() {
        setTerminalOutput("Nothing To Show Here");
    }

    // Handle Editor Mount
    function handleEditorDidMount(editor) {
        editorRef.current = editor;
    }

    // Run Code
    function runCode() {
        try {
            // Retrieve the code from Monaco Editor
            let code = editorRef.current.getValue();
    
            // Capture output using a custom function
            let output;
            const log = (value) => (output = value);
    
            // Wrap the code to intercept console.log and return the output
            const wrappedCode = `
                (function() {
                    const consoleLog = console.log;
                    console.log = log;
                    ${code};
                    console.log = consoleLog;
                    return output;
                })()
            `;
    
            // Use eval to execute the wrapped code
            output = eval(wrappedCode);
    
            // Display the output in the terminal
            if (output === undefined) {
                setTerminalOutput("No output or value is undefined");
            } else {
                setTerminalOutput(output.toString());
            }
        } catch (error) {
            setTerminalOutput(`Error: ${error.message}`);
        }
    }
    

    // Load Editor Settings from Local Storage
    useEffect(() => {
        const configuration = localStorage.getItem("editorSettings");
        if (configuration) {
            setEditorSettings(JSON.parse(configuration));
        }
    }, []);

    // Listen for Storage Changes
    useEffect(() => {
        const handleStorageChange = () => {
            const configuration = localStorage.getItem("editorSettings");
            if (configuration) {
                setEditorSettings(JSON.parse(configuration));
            }
        };

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("settingsChanged", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("settingsChanged", handleStorageChange);
        };
    }, []);

    return (
        <>
            {showSettings && <Settings onClose={() => setShowSettings(false)} />}
            <div className={styles.control}>
                <span onClick={runCode}>
                    <i className="ri-play-circle-fill"></i> Run Code
                </span>
                <span onClick={resetCodeEditor}>
                    <i className="ri-code-line"></i> Clear Editor
                </span>
                <span onClick={clearTerminal}>
                    <i className="ri-terminal-line"></i> Clear Terminal
                </span>
                <span onClick={() => setShowSettings(true)}>
                    <i className="ri-settings-line"></i> Editor Settings
                </span>
            </div>

            <div className={styles.wrapper}>
                <div className={styles.terminal}>{terminalOutput}</div>
                <div
                    style={{
                        backgroundColor: editorSettings?.theme === "vs-dark" ? "#1e1e1e" : "white",
                    }}
                    className={styles.codeEditor}
                    ref={containerRef}
                >
                    <Editor
                        className={styles.Monacoeditor}
                        height="400px"
                        value={defaultValue}
                        language="javascript"
                        theme={editorSettings?.theme || "light"}
                        onMount={handleEditorDidMount}
                        options={{
                            ...editorSettings,
                            automaticLayout: true,
                        }}
                    />
                </div>
            </div>
        </>
    );
}
