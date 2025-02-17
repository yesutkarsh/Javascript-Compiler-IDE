'use client';
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import Editor from '@monaco-editor/react';
import Settings from "./EditorSettings/Setting";
import SandboxWorker from '../sandboxWorker.worker';
import { 
  RiPlayFill, RiTerminalLine, RiSettings3Line, 
  RiCloseCircleLine, RiArrowUpLine, RiRefreshLine,
  RiTerminalBoxLine
} from 'react-icons/ri';

export default function SandBox() {
    const editorRef = useRef(null);
    const [showSettings, setShowSettings] = useState(false);
    const [editorSettings, setEditorSettings] = useState(null);
    const [defaultValue] = useState("// Start coding...");
    const [terminalOutput, setTerminalOutput] = useState("> Ready to execute code...");
    const [showMobileTerminal, setShowMobileTerminal] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile view
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Run Code
    function runCode() {
        const code = editorRef.current?.getValue();
        if (!code) {
            setTerminalOutput("> No code to execute");
            return;
        }
        
        if (isMobile) setShowMobileTerminal(true);
        
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
    }

    // Reset Editor
    function resetCodeEditor() {
        editorRef.current?.setValue("// Start fresh...");
    }

    // Clear Terminal
    function clearTerminal() {
        setTerminalOutput("> Terminal cleared");
    }

    // Handle Editor Mount
    function handleEditorDidMount(editor) {
        editorRef.current = editor;
    }

    // Load Editor Settings
  // In SandBox component
useEffect(() => {
    const handleStorageChange = () => {
        const config = localStorage.getItem("editorSettings");
        if (config) setEditorSettings(JSON.parse(config));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
}, []);

    return (
        <div className={styles.vsCodeContainer}>
            {showSettings && <Settings onClose={() => setShowSettings(false)} />}
            
            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.toolbarLeft}>
                    <button onClick={runCode} className={styles.toolbarButton}>
                        <RiPlayFill className={styles.toolbarIcon} />
                        <span>Run</span>
                    </button>
                    <button onClick={resetCodeEditor} className={styles.toolbarButton}>
                        <RiRefreshLine className={styles.toolbarIcon} />
                        <span>Reset</span>
                    </button>
                    <button onClick={clearTerminal} className={styles.toolbarButton}>
                        <RiTerminalBoxLine className={styles.toolbarIcon} />
                        <span>Clear</span>
                    </button>
                </div>
                {/* <div className={styles.toolbarRight}>
                    <button 
                        onClick={() => setShowSettings(true)}
                        className={styles.toolbarButton}
                    >
                        <RiSettings3Line className={styles.toolbarIcon} />
                        <span>Settings</span>
                    </button>
                </div> */}
            </div>

            {/* Editor & Terminal Container */}
            <div className={styles.editorContainer}>
                {/* Code Editor */}
                <div className={styles.editorWrapper}
                    style={{
                        backgroundColor: editorSettings?.theme === 'light' 
                            ? '#ffffff' 
                            : '#1e1e1e',
                    }}>
                    <div className={styles.editorHeader}>
                        <span className={styles.tab}>index.js</span>
                        {/* <div className={styles.windowControls}>
                            <span className={styles.controlDot} style={{ backgroundColor: '#ff5f56' }} />
                            <span className={styles.controlDot} style={{ backgroundColor: '#ffbd2e' }} />
                            <span className={styles.controlDot} style={{ backgroundColor: '#27c93f' }} />
                        </div> */}
                    </div>
                    <Editor
                        height="calc(100% - 35px)"
                        value={defaultValue}
                        language="javascript"
                        theme={editorSettings?.theme || 'vs-dark'}
                        onMount={handleEditorDidMount}
                        options={{
                            ...editorSettings,
                            minimap: { enabled: true },
                            fontSize: 14,
                            lineNumbers: 'on',
                            automaticLayout: true,
                        }}
                    />
                </div>

                {/* Desktop Terminal */}
                {!isMobile && (
                    <div className={styles.terminalWrapper}>
                        <div className={styles.terminalHeader}>
                            <RiTerminalLine className={styles.terminalIcon} />
                            <span>Terminal</span>
                            <button 
                                onClick={clearTerminal}
                                className={styles.terminalClearButton}
                            >
                                {/* <RiCloseCircleLine /> */}
                            </button>
                        </div>
                        <pre className={styles.terminalContent}>
                            {terminalOutput}
                        </pre>
                    </div>
                )}
            </div>

            {/* Mobile Terminal Toggle */}
            {isMobile && !showMobileTerminal && (
                <button 
                    className={styles.mobileTerminalToggle}
                    onClick={() => setShowMobileTerminal(true)}
                >
                    <RiTerminalLine />
                    <span>Show Terminal</span>
                </button>
            )}

            {/* Mobile Terminal Modal */}
            {isMobile && showMobileTerminal && (
                <div className={styles.mobileTerminal}>
                    <div className={styles.terminalHeader}>
                        <RiTerminalLine className={styles.terminalIcon} />
                        <span>Terminal</span>
                        <button 
                            onClick={() => setShowMobileTerminal(false)}
                            className={styles.terminalClose}
                        >
                            <RiArrowUpLine />
                        </button>
                    </div>
                    <pre className={styles.terminalContent}>
                        {terminalOutput}
                    </pre>
                </div>
            )}
        </div>
    );
}