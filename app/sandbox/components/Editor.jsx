'use client';
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import Editor from '@monaco-editor/react';
import Settings from "./EditorSettings/Setting";
import SandboxWorker from '../sandboxWorker.worker';


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
        const code = editorRef.current?.getValue();
        if (!code) {
            setTerminalOutput("No code to execute.");
            return;
        }
        const worker = new SandboxWorker();
        worker.postMessage(code);
    
        worker.onmessage = (e) => {
            const { type, data } = e.data;
            if (type === 'success') {
                setTerminalOutput(data);
            } else if (type === 'error') {
                setTerminalOutput(`Error: ${data}`);
            }
        };
    
        worker.onerror = (error) => {
            setTerminalOutput(`Worker Error: ${error.message}`);
        };
    
        worker.onmessageerror = () => {
            setTerminalOutput("Message error in worker.");
        };
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
            <div style={{
                        backgroundColor: editorSettings?.theme === "light" ? "white" : "black",
                        color: editorSettings?.theme === "light" ? "black" : "white",
                    }} className={styles.control}>
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
                <div  style={{
                        background: editorSettings?.theme === "light" ? "white" : "linear-gradient(145deg, #1a1b1f, #2a2b2f)",
                    }} className={styles.terminal}>{terminalOutput}</div>
                <div
                    style={{
                        backgroundColor: editorSettings?.theme === "light" ? "white" : "#1e1e1e",
                    }}
                    className={styles.codeEditor}
                    ref={containerRef}
                >
                    <Editor
                        className={styles.Monacoeditor}
                        height="400px"
                        value={defaultValue}
                        language="javascript"
                        theme={editorSettings?.theme || "vs-dark"}
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
