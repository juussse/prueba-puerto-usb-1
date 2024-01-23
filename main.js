let serialPort;
const serialOutput = document.getElementById('serialOutput');

async function connectToArduino() {
    try {
        const port = await navigator.serial.requestPort({});
        await port.open({ baudRate: 9600 });
        serialPort = port;
        readData();
    } catch (error) {
        console.error('Error connecting to Arduino:', error);
    }
}

async function readData() {
    while (serialPort.readable) {
        const reader = serialPort.readable.getReader();
        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) {
                    break;
                }
                serialOutput.value += new TextDecoder().decode(value);
            }
        } catch (error) {
            console.error('Error reading data:', error);
        } finally {
            reader.releaseLock();
        }
    }
}

async function sendMessage() {
    const message = document.getElementById('sendMessage').value;
    const writer = serialPort.writable.getWriter();
    try {
        const encoder = new TextEncoder();
        await writer.write(encoder.encode(message + '\n'));
    } catch (error) {
        console.error('Error reading data:', error);
    } finally {
        writer.releaseLock();
    }
    
}