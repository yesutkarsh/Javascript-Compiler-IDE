import styles from "./styles.module.css";
import { useState, useEffect } from 'react';
import { RiSearchLine, RiCloseLine } from 'react-icons/ri';

// Default settings structure
const DEFAULT_SETTINGS = {
    minimap: false,
    lineNumbers: true,
    autoIndent: true,
    formatOnPaste: true,
    smoothScrolling: true,
    bracketPairColorization: true,
    theme: 'vs-dark',
    fontSize: 14,
    fontFamily: 'Consolas',
    tabSize: 4,
    wordWrap: 'off',
    cursorStyle: 'line',
    renderWhitespace: 'none'
};

export default function Settings({ onClose }) {
    const [activeTab, setActiveTab] = useState('appearance');
    const [searchQuery, setSearchQuery] = useState('');
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);

    useEffect(() => {
        const savedSettings = JSON.parse(localStorage.getItem('editorSettings') || '{}');
        setSettings(prev => ({ ...DEFAULT_SETTINGS, ...savedSettings }));
    }, []);

    const handleChange = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        localStorage.setItem('editorSettings', JSON.stringify(newSettings));
        window.dispatchEvent(new Event('storage'));  // Changed event name
    };

    // Rest of the component remains the same...

    // Handle clicks on the overlay
    const handleOverlayClick = (e) => {
        if (e.target.className === styles.overlay) {
            onClose();
        }
    };



      // Add tabs configuration
      const tabs = [
        { id: 'appearance', name: 'Appearance' },
        { id: 'editor', name: 'Editor' },
        { id: 'features', name: 'Features' }
    ];

    // Filtered settings based on search
    const filteredSettings = {
        appearance: [
            { type: 'select', label: 'Theme', key: 'theme', options: ['light', 'vs-dark'] },
            { type: 'number', label: 'Font Size', key: 'fontSize', min: 8, max: 30 },
            { type: 'select', label: 'Font Family', key: 'fontFamily', options: ['Consolas', 'Fira Code', 'Monaco', 'Source Code Pro'] }
        ],
        editor: [
            { type: 'number', label: 'Tab Size', key: 'tabSize', min: 1, max: 8 },
            { type: 'select', label: 'Word Wrap', key: 'wordWrap', options: ['off', 'on', 'wordWrapColumn', 'bounded'] }
        ],
        features: [
            { type: 'toggle', label: 'Minimap', key: 'minimap' },
            { type: 'toggle', label: 'Line Numbers', key: 'lineNumbers' },
            { type: 'toggle', label: 'Auto Indent', key: 'autoIndent' },
            { type: 'toggle', label: 'Format On Paste', key: 'formatOnPaste' },
            { type: 'toggle', label: 'Smooth Scrolling', key: 'smoothScrolling' },
            { type: 'toggle', label: 'Bracket Pair Colorization', key: 'bracketPairColorization' }
        ]
    };


    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
        <div className={styles.settingsCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.header}>
                <h2 className={styles.heading}>Settings</h2>
                <button className={styles.closeButton} onClick={onClose}>
                    <RiCloseLine />
                </button>
            </div>

            <div className={styles.searchBar}>
                <RiSearchLine className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Search Settings"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            <div className={styles.tabsContainer}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`${styles.tabButton} ${activeTab === tab.id ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>

            <div className={styles.settingsContent}>
                {filteredSettings[activeTab].map((setting, index) => (
                    <div key={index} className={styles.settingRow}>
                        {setting.type === 'select' && (
                            <>
                                <label className={styles.label}>{setting.label}</label>
                                <select
                                    className={styles.select}
                                    value={settings[setting.key]}
                                    onChange={(e) => handleChange(setting.key, e.target.value)}
                                >
                                    {setting.options.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </>
                        )}
                        
                        {setting.type === 'number' && (
                            <>
                                <label className={styles.label}>{setting.label}</label>
                                <input
                                    type="number"
                                    className={styles.input}
                                    min={setting.min}
                                    max={setting.max}
                                    value={settings[setting.key]}
                                    onChange={(e) => handleChange(setting.key, parseInt(e.target.value))}
                                />
                            </>
                        )}

                        {setting.type === 'toggle' && (
                            <div className={styles.toggleRow}>
                                <span className={styles.label}>{setting.label}</span>
                                <div
                                    className={styles.toggleSwitch}
                                    data-checked={settings[setting.key]}
                                    onClick={() => handleChange(setting.key, !settings[setting.key])}
                                >
                                    <div className={styles.toggleSlider} />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    </div>
    )
}