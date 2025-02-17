self.onmessage = function (e) {
    try {
        const outputs = [];
        const originalLog = console.log;

        // Override console methods to capture output
        console.log = (...args) => {
            outputs.push(args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '));
        };

        // Execute code with line breaks
        const code = `(function() { 
            ${e.data} 
        })()`;
        
        const result = eval(code);

        // Restore original console
        console.log = originalLog;

        // Handle the result
        let finalOutput = outputs.join('\n');
        if (result !== undefined) {
            finalOutput += `\n${String(result)}`;
        }

        self.postMessage({ 
            type: 'success', 
            data: finalOutput 
        });
    } catch (err) {
        self.postMessage({ 
            type: 'error', 
            data: `${err.name}: ${err.message}\n${err.stack}` 
        });
    }
};