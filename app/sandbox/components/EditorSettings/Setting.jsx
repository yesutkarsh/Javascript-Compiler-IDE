import styles from "./styles.module.css"
import { useState, useEffect } from 'react'

export default function Settings({ onClose }) {
    const [settings, setSettings] = useState({
        minimap: false,
        lineNumbers: true,
        autoIndent: true,
        formatOnPaste: true,
        smoothScrolling: true,
        bracketPairColorization: true,
        theme: 'light',
        fontSize: 14,
        fontFamily: 'Consolas',
        tabSize: 4,
        wordWrap: 'off',
        cursorStyle: 'line',
        renderWhitespace: 'none'
    });

    useEffect(() => {
        const savedSettings = localStorage.getItem('editorSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    const handleChange = (key, value) => {
        const newSettings = {
            ...settings,
            [key]: value
        };
        setSettings(newSettings);
        localStorage.setItem('editorSettings', JSON.stringify(newSettings));
        window.dispatchEvent(new Event('settingsChanged'));
    };

    // Handle clicks on the overlay
    const handleOverlayClick = (e) => {
        if (e.target.className === styles.overlay) {
            onClose();
        }
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.settingsCard} onClick={(e) => e.stopPropagation()}>
                    <h2 className={styles.heading}>Editor Settings</h2>
                    
                    {/* Appearance Group */}
                    <div className={styles.optionGroup}>
                        <h3 className={styles.groupTitle}>Appearance</h3>
                        
                        <label className={styles.label}>Theme</label>
                        <select 
                            className={styles.select}
                            value={settings.theme}
                            onChange={(e) => handleChange('theme', e.target.value)}
                        >
                            <option value="light">light</option>
                            <option value="vs-dark">vs-dark</option>
                        </select>

                        <label className={styles.label}>Font Size</label>
                        <input 
                            type="number"
                            className={styles.input}
                            min="8"
                            max="30"
                            value={settings.fontSize}
                            onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
                        />

                        <label className={styles.label}>Font Family</label>
                        <select 
                            className={styles.select}
                            value={settings.fontFamily}
                            onChange={(e) => handleChange('fontFamily', e.target.value)}
                        >
                            <option value="Consolas">Consolas</option>
                            <option value="Fira Code">Fira Code</option>
                            <option value="Monaco">Monaco</option>
                            <option value="Source Code Pro">Source Code Pro</option>
                        </select>
                    </div>

                    {/* Editor Features Group */}
                    <div className={styles.optionGroup}>
                        <h3 className={styles.groupTitle}>Editor Features</h3>

                        <label className={styles.label}>Tab Size</label>
                        <input 
                            type="number"
                            className={styles.input}
                            min="1"
                            max="8"
                            value={settings.tabSize}
                            onChange={(e) => handleChange('tabSize', parseInt(e.target.value))}
                        />

                        <label className={styles.label}>Word Wrap</label>
                        <select 
                            className={styles.select}
                            value={settings.wordWrap}
                            onChange={(e) => handleChange('wordWrap', e.target.value)}
                        >
                            <option value="off">Off</option>
                            <option value="on">On</option>
                            <option value="wordWrapColumn">Wrap at Column</option>
                            <option value="bounded">Bounded</option>
                        </select>
                    </div>

                    {/* Toggle Options Group */}
                    <div className={styles.optionGroup}>
                        <h3 className={styles.groupTitle}>Additional Features</h3>

                        <div className={styles.toggle}>
                            <span className={styles.label}>Minimap</span>
                            <div 
                                className={styles.toggleSwitch}
                                data-checked={settings.minimap}
                                onClick={() => handleChange('minimap', !settings.minimap)}
                            >
                                <div className={styles.toggleSlider} />
                            </div>
                        </div>

                        <div className={styles.toggle}>
                            <span className={styles.label}>Line Numbers</span>
                            <div 
                                className={styles.toggleSwitch}
                                data-checked={settings.lineNumbers}
                                onClick={() => handleChange('lineNumbers', !settings.lineNumbers)}
                            >
                                <div className={styles.toggleSlider} />
                            </div>
                        </div>

                        <div className={styles.toggle}>
                            <span className={styles.label}>Auto Indent</span>
                            <div 
                                className={styles.toggleSwitch}
                                data-checked={settings.autoIndent}
                                onClick={() => handleChange('autoIndent', !settings.autoIndent)}
                            >
                                <div className={styles.toggleSlider} />
                            </div>
                        </div>

                        <div className={styles.toggle}>
                            <span className={styles.label}>Format On Paste</span>
                            <div 
                                className={styles.toggleSwitch}
                                data-checked={settings.formatOnPaste}
                                onClick={() => handleChange('formatOnPaste', !settings.formatOnPaste)}
                            >
                                <div className={styles.toggleSlider} />
                            </div>
                        </div>

                        <div className={styles.toggle}>
                            <span className={styles.label}>Smooth Scrolling</span>
                            <div 
                                className={styles.toggleSwitch}
                                data-checked={settings.smoothScrolling}
                                onClick={() => handleChange('smoothScrolling', !settings.smoothScrolling)}
                            >
                                <div className={styles.toggleSlider} />
                            </div>
                        </div>

                        <div className={styles.toggle}>
                            <span className={styles.label}>Bracket Pair Colorization</span>
                            <div 
                                className={styles.toggleSwitch}
                                data-checked={settings.bracketPairColorization}
                                onClick={() => handleChange('bracketPairColorization', !settings.bracketPairColorization)}
                            >
                                <div className={styles.toggleSlider} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}