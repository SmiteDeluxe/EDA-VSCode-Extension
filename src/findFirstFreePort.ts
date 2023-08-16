import * as net from "net";

export default async function findFirstFreePort(startPort: number): Promise<number> {
    return new Promise((resolve) => {
        let port = startPort;

        function tryNextPort() {
            const server = net.createServer();

            server.listen(port, () => {
                server.once('close', () => {
                    resolve(port); // Port is free, resolve with the current port number.
                });
                server.close(); // Immediately close the server after it's opened.
            });

            server.on('error', (err: any) => {
                if (err.code === 'EADDRINUSE') {
                    port++;
                    tryNextPort(); // Port is occupied, try the next one.
                } else {
                    resolve(-1); // An unexpected error occurred, resolve with -1.
                }
            });
        }

        tryNextPort();
    });
} 