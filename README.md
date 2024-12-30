# 🌟 SandBox Code Editor

A fully functional **Code Editor** built using **React** and **Monaco Editor**, designed for writing, testing, and running JavaScript code in real time. The editor supports customizable settings, real-time output, and a clean user interface.

---

## 📋 Features

### 🚀 Core Functionalities
- **Code Execution**: Write and run JavaScript code directly in the editor.
- **Terminal Output**: Displays the result or errors of your code in a terminal-like interface.
- **Clear Editor**: Reset the editor with a single click to start fresh.
- **Editor Settings**: Customize the editor with themes and other options.

### 💡 Highlights
- **Dynamic Configuration**: Settings saved in `localStorage` and updated in real time.
- **Theming Support**: Switch between `vs-dark` and `light` themes for a personalized experience.
- **Error Handling**: Captures and displays errors gracefully.
- **Responsive Design**: Works seamlessly across different screen sizes.

---

---

## 🛠️ Usage

### 1️⃣ Running Code
Click on the **Run Code** button or `<i className="ri-play-circle-fill"></i>` icon to execute your code. The result will be displayed in the terminal below the editor.

### 2️⃣ Clearing the Editor
Click on the **Clear Editor** button or `<i className="ri-code-line"></i>` icon to reset the editor's content to its default placeholder.

### 3️⃣ Customizing Editor Settings
Click on the **Editor Settings** button or `<i className="ri-settings-line"></i>` icon to open the settings modal. Modify themes, font size, or other configurations.

---

## 🖥️ Component Breakdown

### `SandBox`
- **Purpose**: Main component containing the code editor, terminal, and settings UI.
- **Key States**:
  - `editorRef`: References the Monaco Editor instance.
  - `showSettings`: Toggles the visibility of the settings modal.
  - `terminalOutput`: Manages the terminal output.
- **Core Methods**:
  - `runCode`: Executes JavaScript code using `eval`.
  - `resetCodeEditor`: Clears the editor content.
  - `handleEditorDidMount`: Initializes the Monaco Editor.

### `EditorSettings/Setting`
- **Purpose**: Handles user-configurable editor settings such as themes and font size.
- **LocalStorage Integration**: Automatically saves and retrieves settings.

---

## ✨ Styling

### CSS Classes
- **`.control`**: Styles the buttons for running, clearing, and customizing the editor.
- **`.wrapper`**: Wraps the terminal and code editor for layout consistency.
- **`.terminal`**: Displays code execution output.
- **`.codeEditor`**: Contains the Monaco Editor with dynamic background based on the theme.

---

## ⚠️ Important Notes

1. **Use of `eval`**:
   - Directly executes the code in the editor.
   - **Warning**: Only use in trusted environments as `eval` can execute malicious code.

2. **Default Code**:
   - Placeholder: `// Start Writing Code ...`.
   - Can be reset with the **Clear Editor** button.

3. **Console Logging**:
   - `console.log` output will appear in the browser console, not the terminal.

---

## 🚀 Future Enhancements

1. **Improved Security**:
   - Replace `eval` with a sandboxed execution environment (e.g., `vm2`).

2. **Enhanced Terminal**:
   - Capture and display `console.log` output in the terminal.

3. **Additional Language Support**:
   - Expand to support languages like Python, C++, etc.

4. **Collaboration**:
   - Enable real-time collaborative coding using WebSockets or WebRTC.

---

## 👨‍💻 Author
Developed by **Utkarsh**, a passionate full-stack developer dedicated to creating innovative and user-friendly web applications.

---

## 📜 License
This project is licensed under the **MIT License**. Feel free to use, modify, and distribute with attribution.

---

Happy Coding! 🚀





