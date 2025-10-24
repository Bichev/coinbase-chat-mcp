#!/usr/bin/env node
import { CoinbaseMCPConfig } from './types.js';
declare class CoinbaseMCPServer {
    private server;
    private coinbaseClient;
    private demoWalletClient;
    private config;
    constructor(config: CoinbaseMCPConfig);
    private setupTools;
    private setupResources;
    private setupPrompts;
    start(): Promise<void>;
}
export { CoinbaseMCPServer };
//# sourceMappingURL=index.d.ts.map