self.onmessage = function (e) {
    try {
        const outputs = [];
        const originalLog = console.log;

        // Override console.log to capture logs
        console.log = (...args) => {
            outputs.push(args.map(arg =>
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' '));
        };

        // Execute the received code
        const result = eval(e.data);

        // Restore console.log
        console.log = originalLog;

        // Append the result if not undefined
        if (result !== undefined) outputs.push(String(result));

        // Send the result back to the main thread
        self.postMessage({ type: 'success', data: outputs.join('\n') });
    } catch (err) {
        // Handle errors and send back to the main thread
        self.postMessage({ type: 'error', data: err.message });
    }
};
