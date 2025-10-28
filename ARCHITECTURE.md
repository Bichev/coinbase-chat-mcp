# 🏗️ Coinbase MCP - Technical Architecture

## 📋 Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Component Breakdown](#component-breakdown)
4. [Real vs. Simulated Components](#real-vs-simulated-components)
5. [Data Flow](#data-flow)
6. [Technology Stack](#technology-stack)
7. [Comparison with Alternatives](#comparison-with-alternatives)
8. [Code Examples](#code-examples)
9. [Deployment Architecture](#deployment-architecture)
10. [Security & Best Practices](#security--best-practices)

---

## Overview

This project implements a **hybrid architecture** combining:
- **Real market data** from Coinbase Public API
- **Simulated wallet** for educational crypto transactions
- **Official MCP protocol** for AI agent integration
- **Modern web stack** for beautiful UX

**Philosophy**: Real education without real risk! 🎓

---

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  Cursor IDE  │  │ Claude       │  │  Web Browser │             │
│  │  (MCP Client)│  │  Desktop     │  │  (React App) │             │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘             │
│         │                  │                  │                      │
│         └──────────────────┴──────────────────┘                      │
└────────────────────────────┼──────────────────────────────────────┘
                             │
         ┌───────────────────┴────────────────────┐
         │                                        │
         ▼                                        ▼
┌─────────────────────┐              ┌──────────────────────┐
│   MCP SERVER        │              │   API SERVER         │
│   (stdio transport) │              │   (HTTP REST)        │
│   Port: stdio       │              │   Port: 3002         │
├─────────────────────┤              ├──────────────────────┤
│ 13 MCP Tools:       │              │ REST Endpoints:      │
│ • get_spot_price    │              │ • GET  /api/v1/*     │
│ • analyze_price     │              │ • POST /api/v1/*     │
│ • buy_virtual_beer  │              │ • Swagger UI         │
│ • get_wallet        │              │ • Static files       │
│ • ...               │              │                      │
└─────────┬───────────┘              └──────────┬───────────┘
          │                                     │
          └──────────────┬──────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────┐
        │      SHARED BUSINESS LOGIC         │
        ├────────────────────────────────────┤
        │  ┌──────────────────────────────┐  │
        │  │   CoinbaseClient             │  │
        │  │   (Wrapper for Coinbase API) │  │
        │  └──────────┬───────────────────┘  │
        │             │                       │
        │  ┌──────────▼───────────────────┐  │
        │  │   DemoWalletClient           │  │
        │  │   (Transaction Simulator)    │  │
        │  └──────────────────────────────┘  │
        └────────────────┬───────────────────┘
                         │
         ┌───────────────┴────────────────┐
         │                                │
         ▼                                ▼
┌──────────────────┐          ┌────────────────────┐
│  Coinbase API    │          │  In-Memory Store   │
│  (Public v2)     │          │  (Demo Wallet)     │
│                  │          │                    │
│  Real Data:      │          │  Simulated:        │
│  • Prices        │          │  • Balances        │
│  • Market Stats  │          │  • Transactions    │
│  • Assets        │          │  • Inventory       │
│  • History       │          │  • Beer Count 🍺   │
└──────────────────┘          └────────────────────┘

┌─────────────────────────────────────────────────┐
│           EXTERNAL SERVICES                      │
│  ┌────────────────────────────────────────────┐ │
│  │  OpenAI Services (Optional)                │ │
│  │  • GPT-4 Turbo (Chat intelligence)         │ │
│  │  • Whisper (Multi-language voice input)    │ │
│  │  • TTS (Text-to-speech responses)          │ │
│  └────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. MCP Server (`/mcp-server`)

**Purpose**: Expose crypto tools to AI agents (Cursor, Claude Desktop)

**Technology**:
```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
```

**Communication**: stdio (standard input/output)

**Tools Registered**: 13 total
- 8 Market data tools
- 5 Transaction/wallet tools

**Example Tool Registration**:
```typescript
this.server.registerTool(
  'buy_virtual_beer',
  {
    title: 'Buy Virtual Beer with Crypto',
    description: 'Purchase virtual beer using cryptocurrency',
    inputSchema: BuyVirtualBeerInputSchema.shape
  },
  async ({ quantity, currency, pricePerBeer }) => {
    const result = await this.demoWalletClient.buyVirtualBeer(
      quantity, currency, pricePerBeer
    );
    return {
      content: [{ type: 'text', text: result.message }]
    };
  }
);
```

### 2. API Server (`/api-server`)

**Purpose**: REST API for web frontend

**Technology**:
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
```

**Communication**: HTTP REST (port 3002)

**Endpoints**: 20+ REST endpoints

**Key Features**:
- Rate limiting (100 req/15min)
- Swagger documentation (`/api-docs`)
- CORS enabled
- Static file serving
- Compression

**Example Endpoint**:
```typescript
app.post('/api/v1/wallet/buy-beer', async (req, res) => {
  const { quantity, currency, pricePerBeer } = req.body;
  
  const result = await demoWalletClient.buyVirtualBeer(
    quantity, currency, pricePerBeer
  );
  
  res.json({
    success: result.success,
    data: result.transaction,
    message: result.message
  });
});
```

### 3. Frontend Application (`/frontend`)

**Purpose**: Beautiful web UI for users

**Technology**:
```typescript
// React + TypeScript + Vite
import React from 'react';
import { QueryClient } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
```

**Pages**:
- `/` - Chat Interface (with voice!)
- `/wallet` - Virtual Wallet & Beer purchases
- `/mcp-tester` - MCP tool testing
- `/api-explorer` - Interactive API docs
- `/tutorial` - Comprehensive guide
- `/presentations` - Business slides
- `/architecture` - Architecture diagrams

**Key Services**:
```typescript
// AI Service - Orchestrates GPT-4 + MCP tools
aiService.processMessage("Buy me a beer")
  → Calls GPT-4 for intent understanding
  → Executes MCP tools via API
  → Returns formatted response

// Voice Service - Whisper + TTS
voiceService.transcribeAudio(blob) // → Multi-language
voiceService.textToSpeech(text)    // → Natural voice
```

### 4. Shared Business Logic

#### CoinbaseClient (Real Data Layer)

```typescript
export class CoinbaseClient {
  private client: AxiosInstance;
  private baseUrl = 'https://api.coinbase.com/v2';

  async getSpotPrice(currencyPair: string) {
    // Makes REAL API call to Coinbase
    const response = await this.client.get(`/prices/${currencyPair}/spot`);
    return response.data; // Real current price!
  }

  async getStats(currencyPair: string) {
    // Gets REAL 24-hour market statistics
    const response = await this.client.get(`/prices/${currencyPair}/stats`);
    return response.data;
  }
}
```

**What it does**:
- ✅ Fetches real-time cryptocurrency prices
- ✅ Gets actual market statistics
- ✅ Retrieves genuine historical data
- ✅ Provides real asset information
- ❌ Does NOT execute real trades
- ❌ Does NOT access wallets

#### DemoWalletClient (Simulation Layer)

```typescript
export class DemoWalletClient {
  private wallet: DemoWallet = {
    balances: { USD: 1000, BTC: 0, ETH: 0 },
    transactions: [],
    inventory: { beers: 0, items: [] },
    createdAt: new Date(),
    lastUpdated: new Date()
  };

  async simulatePurchase(from: string, to: string, amount: number) {
    // 1. Get REAL price
    const priceData = await this.coinbaseClient.getSpotPrice(`${to}-USD`);
    const price = parseFloat(priceData.data.amount); // ← REAL
    
    // 2. Calculate conversion
    const cryptoAmount = amount / price;
    
    // 3. Check SIMULATED balance
    if (this.wallet.balances[from] < amount) {
      throw new Error('Insufficient balance');
    }
    
    // 4. Update SIMULATED balances
    this.wallet.balances[from] -= amount;
    this.wallet.balances[to] += cryptoAmount;
    
    // 5. Record SIMULATED transaction
    this.wallet.transactions.push({ /* ... */ });
    
    return transaction;
  }

  async buyVirtualBeer(quantity: number, currency: string) {
    // Check crypto balance (simulated)
    const balance = this.wallet.balances[currency];
    
    // Get real price for calculation
    const price = await this.coinbaseClient.getSpotPrice(`${currency}-USD`);
    const cryptoNeeded = (quantity * 5) / parseFloat(price.data.amount);
    
    if (balance < cryptoNeeded) {
      // Smart suggestion with real prices!
      return {
        success: false,
        needsMoreCrypto: true,
        message: `You need ${cryptoNeeded} ${currency} but only have ${balance}`
      };
    }
    
    // Execute purchase (simulated)
    this.wallet.balances[currency] -= cryptoNeeded;
    this.wallet.inventory.beers += quantity;
    
    return { success: true };
  }
}
```

**What it does**:
- ✅ Manages virtual balances (in-memory)
- ✅ Simulates transactions
- ✅ Tracks inventory (beers!)
- ✅ Uses REAL prices for calculations
- ❌ No blockchain involved
- ❌ No real money moved

---

## Real vs. Simulated Components

### ✅ What's REAL

#### 1. **Coinbase Market Data**
```typescript
// REAL API Call
const response = await axios.get(
  'https://api.coinbase.com/v2/prices/BTC-USD/spot'
);

// REAL Response
{
  "data": {
    "amount": "110464.17",  // ← Live BTC price
    "base": "BTC",
    "currency": "USD"
  }
}
```

**No authentication needed** - Public API!

#### 2. **MCP Protocol**
```typescript
// Official MCP SDK from Anthropic
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// Standard MCP tool registration
server.registerTool('get_spot_price', schema, handler);

// Works with any MCP client!
```

#### 3. **OpenAI Services** (Optional)
```typescript
// REAL GPT-4 API calls
const completion = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  messages: conversation,
  tools: availableTools // Our 13 MCP tools
});

// REAL Whisper transcription
const transcription = await openai.audio.transcriptions.create({
  file: audioFile,
  model: 'whisper-1'
});

// REAL TTS audio generation
const speech = await openai.audio.speech.create({
  model: 'tts-1',
  voice: 'alloy',
  input: text
});
```

### 🎮 What's SIMULATED

#### 1. **Wallet Balances**
```typescript
// Stored in-memory (not on blockchain)
private wallet: DemoWallet = {
  balances: {
    USD: 1000.00,    // Virtual USD
    BTC: 0.00004531, // Virtual BTC
    ETH: 0.0131      // Virtual ETH
  }
};
```

**Reset on server restart!**

#### 2. **Transactions**
```typescript
// Stored in array (not on blockchain)
transactions: [
  {
    id: "tx_1735234567_abc123",
    type: "buy",
    fromCurrency: "USD",
    toCurrency: "BTC",
    fromAmount: 5.00,
    toAmount: 0.00004531,
    price: 110464.17, // ← Price was REAL at time of transaction
    timestamp: new Date()
  }
]
```

**No permanent database!**

#### 3. **Virtual Inventory**
```typescript
// Our custom inventory system
inventory: {
  beers: 3,      // Virtual beers owned
  items: [
    {
      id: "tx_...",
      name: "Beer",
      emoji: "🍺",
      quantity: 1,
      purchasePrice: 0.00004531,
      purchaseCurrency: "BTC",
      purchaseDate: new Date()
    }
  ]
}
```

**Educational only!**

---

## Data Flow

### Flow 1: Simple Price Query

```
User: "What's the Bitcoin price?"
    ↓
┌─────────────────────────────────────────┐
│ 1. CHAT UI (ChatInterface.tsx)          │
│    → User types message                 │
│    → Sends to aiService                 │
└───────────────┬─────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│ 2. AI SERVICE (aiService.ts)            │
│    → Sends to GPT-4 (OpenAI) ← REAL AI  │
│    → GPT-4 selects tool: get_spot_price │
└───────────────┬─────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│ 3. TOOL EXECUTOR (executeTool)          │
│    → HTTP GET /api/v1/prices/BTC-USD    │
└───────────────┬─────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│ 4. API SERVER (index.ts)                │
│    → Receives request                   │
│    → Calls coinbaseClient.getSpotPrice()│
└───────────────┬─────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│ 5. COINBASE CLIENT (coinbase-client.ts) │
│    → axios.get('https://api.coinbase... │
│    → Gets REAL data from Coinbase       │
└───────────────┬─────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│ 6. COINBASE API (External)              │
│    → Returns real BTC price: $110,464   │
└───────────────┬─────────────────────────┘
                ↓
                [Returns back through stack]
                ↓
┌─────────────────────────────────────────┐
│ 7. CHAT UI                              │
│    → Displays: "BTC-USD: $110,464"      │
│    → Shows tool call details            │
└─────────────────────────────────────────┘
```

### Flow 2: Circular Economy (USD → BTC → Beer)

```
User: "Buy me a beer"
    ↓
┌──────────────────────────────────────────────────────┐
│ STEP 1: Check Wallet                                 │
│ AI: Let me check your BTC balance...                 │
│ Tool: get_virtual_wallet                             │
│ Result: BTC: 0.00000000 ← SIMULATED                  │
└───────────────┬──────────────────────────────────────┘
                ↓
┌──────────────────────────────────────────────────────┐
│ STEP 2: Try to Buy Beer                             │
│ Tool: buy_virtual_beer                               │
│ Check: balance (0) < needed (0.00004531) ← SIMULATED │
│ Result: ❌ Insufficient BTC!                         │
│ Suggestion: "Buy $5 worth of BTC first"              │
└───────────────┬──────────────────────────────────────┘
                ↓
┌──────────────────────────────────────────────────────┐
│ User: "OK, buy $5 of Bitcoin"                        │
└───────────────┬──────────────────────────────────────┘
                ↓
┌──────────────────────────────────────────────────────┐
│ STEP 3: Buy BTC with USD                             │
│ Tool: simulate_btc_purchase                          │
│    ├─ Get price from Coinbase ← REAL ($110,464)      │
│    ├─ Calculate: $5 / $110,464 = 0.00004531 BTC      │
│    ├─ Check USD balance: $1000 ← SIMULATED           │
│    ├─ Deduct: USD -= $5 ← SIMULATED                  │
│    └─ Add: BTC += 0.00004531 ← SIMULATED             │
│ Result: ✅ You now have 0.00004531 BTC               │
└───────────────┬──────────────────────────────────────┘
                ↓
┌──────────────────────────────────────────────────────┐
│ User: "Now buy the beer!"                            │
└───────────────┬──────────────────────────────────────┘
                ↓
┌──────────────────────────────────────────────────────┐
│ STEP 4: Buy Beer with BTC                            │
│ Tool: buy_virtual_beer                               │
│    ├─ Get price from Coinbase ← REAL ($110,464)      │
│    ├─ Calculate needed: 0.00004531 BTC               │
│    ├─ Check BTC balance: 0.00004531 ← SIMULATED      │
│    ├─ Deduct: BTC -= 0.00004531 ← SIMULATED          │
│    └─ Add: beers += 1 ← SIMULATED                    │
│ Result: 🍺 You have 1 beer!                          │
└──────────────────────────────────────────────────────┘

FINAL STATE:
├─ USD: $995.00 (was $1000)
├─ BTC: 0.00000000 (was 0.00004531)
└─ 🍺 Beers: 1 (was 0)

All balance changes: SIMULATED
All prices used: REAL from Coinbase!
```

---

## Technology Stack

### Backend Technologies

```yaml
MCP Server:
  - Runtime: Node.js 18+
  - Language: TypeScript 5.3+
  - MCP SDK: @modelcontextprotocol/sdk ^1.0.0
  - HTTP Client: axios ^1.6.2
  - Validation: zod ^3.22.4
  - Transport: stdio (standard input/output)

API Server:
  - Framework: Express.js
  - Language: TypeScript
  - Security: helmet, cors
  - Docs: Swagger (swagger-jsdoc, swagger-ui-express)
  - Logging: winston
  - Rate Limiting: express-rate-limit
  - Compression: compression middleware

Shared:
  - coinbase-client.ts (Wrapper for Coinbase API)
  - demo-wallet-client.ts (Transaction simulator)
  - types.ts (TypeScript interfaces)
```

### Frontend Technologies

```yaml
Framework:
  - React 18
  - TypeScript
  - Vite (Build tool)

Routing:
  - react-router-dom ^6

State Management:
  - @tanstack/react-query (Server state)
  - React hooks (Local state)

UI/Styling:
  - TailwindCSS 3
  - Heroicons (Icons)
  - lucide-react (Additional icons)
  - clsx (Conditional classes)

Services:
  - OpenAI SDK (GPT-4, Whisper, TTS)
  - axios (HTTP client)
  - Custom aiService
  - Custom voiceService
  - Custom chatSessionService
```

### External APIs

```yaml
Coinbase Public API v2:
  - Base URL: https://api.coinbase.com/v2
  - Authentication: None (public endpoints)
  - Rate Limits: ~10,000 req/hour
  - Endpoints Used:
    • /prices/{pair}/spot
    • /prices/{pair}/stats
    • /prices/{pair}/historic
    • /currencies
    • /exchange-rates
    • /time

OpenAI API (Optional):
  - GPT-4 Turbo (gpt-4-turbo-preview)
  - Whisper (whisper-1)
  - TTS (tts-1)
  - Authentication: API key required
  - Used for: Chat AI, voice features
```

---

## Comparison with Alternatives

### Our Implementation vs. Base MCP

| Feature | Our Demo System | Base MCP |
|---------|-----------------|----------|
| **Purpose** | Education & Demo | Real Production |
| **Money** | Virtual (safe) | Real crypto |
| **Setup** | Zero config | API keys + wallet |
| **Blockchain** | No blockchain | Base network |
| **Transactions** | Instant | 2-5 sec confirmation |
| **Cost** | Free | Gas fees |
| **Risk** | Zero | Real financial risk |
| **Learning** | Perfect ✅ | Too risky for beginners |
| **Features** | Full control | Limited to API |

**Base MCP Example** (What we didn't use):
```typescript
// Requires real setup
import { WalletClient } from '@coinbase/coinbase-sdk';

const client = WalletClient.configureFromJson({
  apiKeyName: process.env.CDP_API_KEY_NAME,
  privateKey: process.env.CDP_PRIVATE_KEY
});

// Real transaction (costs real money!)
const transfer = await wallet.createTransfer({
  amount: 0.00001,
  assetId: 'btc',
  destination: recipientAddress,
  network: 'base-sepolia'
});

await transfer.wait(); // Wait for blockchain confirmation
```

### Our Implementation vs. x402 Protocol

| Feature | Our Demo System | x402 Protocol |
|---------|-----------------|---------------|
| **Use Case** | Crypto transactions | API micropayments |
| **Payment For** | Virtual goods | Data/services |
| **Flow** | USD→Crypto→Beer | HTTP 402→Pay→Data |
| **Technology** | Custom logic | HTTP 402 standard |
| **Setup** | None | Wallet with USDC |
| **Education** | Perfect ✅ | Advanced topic |

**x402 Example** (What we didn't use):
```typescript
// Requires wallet and USDC
import { withPaymentInterceptor } from 'x402-axios';
import { privateKeyToAccount } from 'viem/accounts';

const account = privateKeyToAccount(privateKey);
const client = withPaymentInterceptor(axios.create(), account);

// Automatically pays if server responds with 402
const response = await client.get('/paid-endpoint');
// If HTTP 402, pays with USDC, then retries
```

### Why We Built Custom

**Advantages of Our Approach**:

✅ **Zero Dependencies on Real Money**
- No wallet setup
- No blockchain
- No gas fees

✅ **Perfect for Education**
- Safe experimentation
- Unlimited "resets"
- Clear learning path

✅ **Full Feature Control**
- Add any feature we want
- Custom UI/UX
- Beer inventory!

✅ **Fast Development**
- No blockchain wait times
- Instant transactions
- Quick iterations

✅ **Wide Compatibility**
- Works in any browser
- No MetaMask needed
- No wallet extensions

**When to Use Alternatives**:

Use **Base MCP** if:
- Building real crypto app
- Need actual blockchain transactions
- Have Coinbase developer account
- Production use case

Use **x402** if:
- Building paid API service
- Micropayments for data
- Want HTTP 402 standard
- API monetization

Use **Our System** if:
- Learning crypto concepts ✅
- Demo/presentation
- Educational platform
- Safe experimentation
- Quick prototyping

---

## Code Examples

### Example 1: Fetching Real Price

```typescript
// coinbase-client.ts
export class CoinbaseClient {
  async getSpotPrice(currencyPair: string): Promise<CoinbaseSpotPrice> {
    try {
      // REAL API call to Coinbase
      const response = await this.client.get(`/prices/${currencyPair}/spot`);
      
      // Example response:
      // {
      //   "data": {
      //     "amount": "110464.17",
      //     "base": "BTC",
      //     "currency": "USD"
      //   }
      // }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch spot price');
    }
  }
}
```

### Example 2: Simulating Purchase

```typescript
// demo-wallet-client.ts
export class DemoWalletClient {
  async simulatePurchase(
    fromCurrency: string,
    toCurrency: string,
    amount: number,
    description?: string
  ): Promise<DemoTransaction> {
    const from = fromCurrency.toUpperCase();
    const to = toCurrency.toUpperCase();

    // STEP 1: Check SIMULATED balance
    const currentBalance = this.getBalance(from);
    if (currentBalance < amount) {
      throw new Error(`Insufficient ${from} balance`);
    }

    // STEP 2: Get REAL price from Coinbase
    const priceData = await this.coinbaseClient.getSpotPrice(`${to}-USD`);
    const currentPrice = parseFloat(priceData.data.amount); // ← REAL
    const cryptoAmount = amount / currentPrice;

    // STEP 3: Create transaction object
    const transaction: DemoTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'buy',
      fromCurrency: from,
      toCurrency: to,
      fromAmount: amount,
      toAmount: cryptoAmount,
      price: currentPrice, // ← REAL price at time of transaction
      description: description || `Bought ${to} with ${from}`,
      timestamp: new Date(),
      status: 'completed'
    };

    // STEP 4: Update SIMULATED balances (in-memory)
    this.wallet.balances[from] -= transaction.fromAmount;
    this.wallet.balances[to] = (this.wallet.balances[to] || 0) + transaction.toAmount;
    
    // STEP 5: Store SIMULATED transaction (in-memory array)
    this.wallet.transactions.unshift(transaction);
    this.wallet.lastUpdated = new Date();

    return transaction;
  }
}
```

### Example 3: Buying Beer with Crypto

```typescript
// demo-wallet-client.ts
async buyVirtualBeer(
  quantity: number = 1,
  currency: string = 'BTC',
  pricePerBeer: number = 5
): Promise<BeerPurchaseResult> {
  const crypto = currency.toUpperCase();
  const totalUsdCost = quantity * pricePerBeer;

  // STEP 1: Get REAL crypto price
  const priceData = await this.coinbaseClient.getSpotPrice(`${crypto}-USD`);
  const cryptoPrice = parseFloat(priceData.data.amount); // ← REAL
  const cryptoNeeded = totalUsdCost / cryptoPrice;

  // STEP 2: Check SIMULATED balance
  const currentBalance = this.getBalance(crypto);

  if (currentBalance < cryptoNeeded) {
    // Not enough - return helpful error
    return {
      success: false,
      needsMoreCrypto: true,
      suggestedAmount: totalUsdCost,
      message: `❌ Insufficient ${crypto}!\n` +
        `Need: ${cryptoNeeded.toFixed(8)} ${crypto}\n` +
        `Have: ${currentBalance.toFixed(8)} ${crypto}\n\n` +
        `💡 Buy $${totalUsdCost} worth of ${crypto} first!`
    };
  }

  // STEP 3: Execute SIMULATED beer purchase
  const transaction = {
    id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'buy' as const,
    fromCurrency: crypto,
    toCurrency: 'BEER',
    fromAmount: cryptoNeeded,
    toAmount: quantity,
    price: cryptoPrice, // ← REAL price
    description: `🍺 Bought ${quantity} beer(s) with ${crypto}`,
    timestamp: new Date(),
    status: 'completed' as const
  };

  // STEP 4: Update SIMULATED state
  this.wallet.balances[crypto] -= cryptoNeeded;
  this.wallet.inventory.beers += quantity;
  this.wallet.inventory.items.push({
    id: transaction.id,
    name: 'Beer',
    emoji: '🍺',
    quantity,
    purchasePrice: cryptoNeeded,
    purchaseCurrency: crypto,
    purchaseDate: new Date()
  });
  this.wallet.transactions.unshift(transaction);

  return {
    success: true,
    transaction,
    message: `🍺 Beer Purchase Successful!\n` +
      `Bought ${quantity} beer(s) for ${cryptoNeeded.toFixed(8)} ${crypto}\n` +
      `Total beers: ${this.wallet.inventory.beers}`
  };
}
```

### Example 4: MCP Tool Registration

```typescript
// index.ts (MCP Server)
private setupTools(): void {
  // Register tool with MCP protocol
  this.server.registerTool(
    'buy_virtual_beer', // Tool name
    {
      title: 'Buy Virtual Beer with Crypto',
      description: 'Purchase virtual beer using cryptocurrency',
      inputSchema: BuyVirtualBeerInputSchema.shape // Zod schema
    },
    async ({ quantity, currency, pricePerBeer }) => {
      // Execute business logic
      const result = await this.demoWalletClient.buyVirtualBeer(
        quantity,
        currency,
        pricePerBeer
      );

      // Return MCP-formatted response
      return {
        content: [{
          type: 'text',
          text: result.message
        }]
      };
    }
  );
}
```

### Example 5: AI Tool Orchestration

```typescript
// aiService.ts (Frontend)
async processMessage(userMessage: string): Promise<AIResponse> {
  // Send to GPT-4 with available tools
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: this.conversation,
    tools: availableTools.map(tool => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters
      }
    })),
    tool_choice: 'auto' // Let GPT-4 decide which tools to use
  });

  // Execute any tool calls GPT-4 requested
  if (response.choices[0].message.tool_calls) {
    for (const toolCall of response.choices[0].message.tool_calls) {
      const result = await this.executeTool({
        tool: toolCall.function.name,
        parameters: JSON.parse(toolCall.function.arguments)
      });
      
      // Add result back to conversation
      this.conversation.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify(result.result)
      });
    }
    
    // Get final response from GPT-4 incorporating tool results
    const finalResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: this.conversation
    });
    
    return {
      message: finalResponse.choices[0].message.content,
      toolCalls: executedTools
    };
  }
}
```

---

## Deployment Architecture

### Development (Current)

```
┌─────────────────────────────────────────┐
│ localhost:5173 (Frontend - Vite dev)    │
├─────────────────────────────────────────┤
│ • Hot reload                            │
│ • Source maps                           │
│ • Dev tools                             │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│ localhost:3002 (API Server - Node)      │
├─────────────────────────────────────────┤
│ • Express dev mode                      │
│ • Winston logging                       │
│ • Auto-restart (nodemon)                │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│ stdio (MCP Server for Cursor)           │
├─────────────────────────────────────────┤
│ • Runs when Cursor starts               │
│ • stdio communication                   │
│ • Shared with API server code           │
└─────────────────────────────────────────┘
```

### Production (Possible)

```
┌──────────────────────────────────┐
│ Vercel / Netlify (Frontend)      │
│ • Static build (npm run build)   │
│ • Global CDN                     │
│ • Auto SSL                       │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Vercel Serverless (API)          │
│ • Express app as serverless fn   │
│ • Auto-scaling                   │
│ • Environment variables          │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ External APIs                    │
│ • Coinbase (always available)    │
│ • OpenAI (if configured)         │
└──────────────────────────────────┘
```

---

## Security & Best Practices

### What We Do Right ✅

```typescript
// 1. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 100 requests per window
});

// 2. Input Validation (Zod schemas)
const SimulatePurchaseInputSchema = z.object({
  fromCurrency: z.string(),
  toCurrency: z.string(),
  amount: z.number().positive()
});

// 3. Error Handling
try {
  const result = await coinbaseClient.getSpotPrice(pair);
  return result;
} catch (error) {
  logger.error('API error:', error);
  throw new CoinbaseAPIError(error.message);
}

// 4. CORS Configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || '*',
  credentials: true
}));

// 5. Security Headers (Helmet)
app.use(helmet());

// 6. Request Logging (Winston)
logger.info('Request received', {
  method: req.method,
  path: req.path,
  ip: req.ip
});
```

### Security Notes

**Safe for Demo**:
- ✅ No real money at risk
- ✅ In-memory storage only
- ✅ No sensitive data stored
- ✅ Public API only (no auth needed)

**Production Considerations** (if upgrading):
- 🔐 Use environment variables for API keys
- 🔐 Implement user authentication
- 🔐 Use database for persistence
- 🔐 Add request signing
- 🔐 Implement withdrawal limits
- 🔐 Add 2FA for transactions
- 🔐 Server-side API key management (not browser)

---

## File Structure

```
coinbase-chat-mcp/
│
├── mcp-server/                    # MCP Protocol Server
│   ├── src/
│   │   ├── index.ts              # MCP tool registration
│   │   ├── coinbase-client.ts    # Coinbase API wrapper (REAL)
│   │   ├── demo-wallet-client.ts # Transaction simulator (SIMULATED)
│   │   └── types.ts              # TypeScript interfaces
│   ├── dist/                     # Compiled JavaScript
│   └── package.json              # Dependencies
│
├── api-server/                    # REST API Server
│   ├── src/
│   │   ├── index.ts              # Express routes
│   │   ├── coinbase-client.ts    # Same as MCP server
│   │   ├── demo-wallet-client.ts # Same as MCP server
│   │   └── types.ts              # Same types
│   ├── dist/                     # Compiled JavaScript
│   └── package.json
│
├── frontend/                      # React Web Application
│   ├── src/
│   │   ├── App.tsx               # Main app & routing
│   │   ├── components/
│   │   │   └── Layout.tsx        # Sidebar navigation
│   │   ├── pages/
│   │   │   ├── ChatInterface.tsx # AI chat with voice 🎤
│   │   │   ├── Wallet.tsx        # Virtual wallet UI 🍺₿
│   │   │   ├── APIExplorer.tsx   # Interactive API docs
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── aiService.ts      # GPT-4 + tool orchestration
│   │   │   ├── voiceService.ts   # Whisper + TTS
│   │   │   └── chatSessionService.ts
│   │   └── main.tsx
│   ├── dist/                     # Production build
│   └── package.json
│
├── docs/                          # Documentation
│   ├── ARCHITECTURE.md           # This file! 🏗️
│   ├── DEMO_TRANSACTIONS.md      # Transaction tools guide
│   ├── CIRCULAR_ECONOMY.md       # Beer economy guide
│   ├── CHAT_WALLET_INTEGRATION.md
│   └── ...
│
├── .cursor/
│   └── mcp.json                  # Cursor MCP configuration
│
├── README.md                      # Main documentation
└── package.json                   # Root package
```

---

## MCP Protocol Integration

### How MCP Works in Our System

```typescript
// 1. Server Setup
const server = new McpServer({
  name: 'coinbase-mcp-server',
  version: '1.0.0'
});

// 2. Tool Registration (13 tools)
server.registerTool(
  'tool_name',
  { title, description, inputSchema },
  async (params) => {
    // Tool implementation
    return { content: [{ type: 'text', text: result }] };
  }
);

// 3. Transport Layer
const transport = new StdioServerTransport();
await server.connect(transport);

// Now Cursor can call tools via MCP protocol!
```

### MCP Message Flow

```
Cursor IDE (User types: "What's BTC price?")
    ↓
    MCP Request (JSON-RPC over stdio)
    {
      "method": "tools/call",
      "params": {
        "name": "get_spot_price",
        "arguments": { "currencyPair": "BTC-USD" }
      }
    }
    ↓
MCP Server receives via stdio
    ↓
Executes tool handler
    ↓
    MCP Response
    {
      "content": [{
        "type": "text",
        "text": "Current BTC-USD price: $110,464.17"
      }]
    }
    ↓
Cursor displays to user
```

---

## Performance Characteristics

### Response Times

```
Price Query:
├─ Coinbase API: ~200-500ms
├─ Our processing: ~10ms
└─ Total: ~210-510ms

Simulated Purchase:
├─ Coinbase API (get price): ~200-500ms
├─ Balance check: ~1ms
├─ Update wallet: ~1ms
└─ Total: ~202-502ms

Buy Beer with Crypto:
├─ Coinbase API (get price): ~200-500ms
├─ Balance check: ~1ms
├─ Update inventory: ~1ms
└─ Total: ~202-502ms

AI Chat Query:
├─ OpenAI GPT-4: ~2-5 seconds
├─ Tool execution: ~200-500ms per tool
├─ Final response: ~1-3 seconds
└─ Total: ~3-9 seconds
```

### Scalability

**Current System** (In-Memory):
- ✅ Handles: 1 wallet instance per server
- ✅ Fast: Sub-second transactions
- ❌ Limitation: Data lost on restart
- ❌ Limitation: Not multi-user

**Production Upgrade Path**:
```typescript
// Add database for persistence
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Store wallets in DB
async createWallet(userId: string) {
  return await prisma.wallet.create({
    data: {
      userId,
      balances: { USD: 1000 },
      transactions: []
    }
  });
}
```

---

## Testing Architecture

### How to Test Components

```typescript
// Test 1: Coinbase Client (Real API)
describe('CoinbaseClient', () => {
  it('should fetch real BTC price', async () => {
    const client = new CoinbaseClient();
    const price = await client.getSpotPrice('BTC-USD');
    expect(price.data.amount).toBeDefined();
    expect(parseFloat(price.data.amount)).toBeGreaterThan(0);
  });
});

// Test 2: Demo Wallet (Simulation)
describe('DemoWalletClient', () => {
  it('should simulate BTC purchase', async () => {
    const wallet = new DemoWalletClient(coinbaseClient);
    const tx = await wallet.simulatePurchase('USD', 'BTC', 5);
    
    expect(tx.fromCurrency).toBe('USD');
    expect(tx.toCurrency).toBe('BTC');
    expect(tx.fromAmount).toBe(5);
    expect(wallet.getBalance('USD')).toBe(995); // 1000 - 5
  });
  
  it('should buy beer if enough crypto', async () => {
    const wallet = new DemoWalletClient(coinbaseClient);
    
    // First buy BTC
    await wallet.simulatePurchase('USD', 'BTC', 5);
    
    // Then buy beer
    const result = await wallet.buyVirtualBeer(1, 'BTC', 5);
    
    expect(result.success).toBe(true);
    expect(wallet.getInventory().beers).toBe(1);
  });
  
  it('should suggest buying crypto if insufficient', async () => {
    const wallet = new DemoWalletClient(coinbaseClient);
    
    // Try to buy beer without BTC
    const result = await wallet.buyVirtualBeer(1, 'BTC', 5);
    
    expect(result.success).toBe(false);
    expect(result.needsMoreCrypto).toBe(true);
    expect(result.suggestedAmount).toBe(5);
  });
});
```

---

## Key Design Decisions

### 1. Why In-Memory Storage?

**Pros**:
- ✅ Zero setup - no database needed
- ✅ Perfect for demos/education
- ✅ Fast - no I/O latency
- ✅ Simple - easy to understand
- ✅ Stateless - each session is fresh

**Cons**:
- ❌ Data lost on restart
- ❌ Not suitable for production
- ❌ Can't scale to multiple users

**Alternative** (if needed):
```typescript
// Add Redis for session storage
import Redis from 'ioredis';
const redis = new Redis();

await redis.set(`wallet:${userId}`, JSON.stringify(wallet));
const wallet = JSON.parse(await redis.get(`wallet:${userId}`));
```

### 2. Why Not Real Blockchain?

**Our Approach** (Simulation):
- ✅ Instant transactions
- ✅ No gas fees
- ✅ Educational
- ✅ Safe

**Real Blockchain** (Base MCP):
- ⏱️ 2-5 second confirmations
- 💰 Gas fees (~$0.01-0.10)
- ⚠️ Financial risk
- 🔐 Complex setup

**Best Use Case**: Start with our simulation, upgrade to real later if needed!

### 3. Why Hybrid (Real Prices + Simulated Wallet)?

This gives:
- 🎓 **Educational value** - Learn with real market data
- 🔒 **Safety** - No financial risk
- ⚡ **Speed** - Instant transactions
- 💡 **Realism** - Prices match reality
- 🎮 **Fun** - Gamified experience

---

## Extension Points

### Easy to Add

```typescript
// Add new virtual item type
async buyVirtualPizza(quantity: number, currency: string) {
  // Same pattern as beer!
  const cryptoNeeded = (quantity * 15) / cryptoPrice;
  this.wallet.inventory.pizzas += quantity;
}

// Add new cryptocurrency
async simulatePurchase(from, to, amount) {
  // Already supports ANY crypto Coinbase has!
  // Just needs valid pair like "DOGE-USD"
}

// Add portfolio analytics
getPortfolioValue() {
  // Calculate total value using real prices
  let total = this.wallet.balances.USD;
  for (const [crypto, balance] of Object.entries(this.wallet.balances)) {
    if (crypto !== 'USD') {
      const price = await getSpotPrice(`${crypto}-USD`);
      total += balance * price;
    }
  }
  return total;
}
```

### Requires More Work

```typescript
// Real trading integration
import { CoinbaseAdvancedTradeClient } from 'coinbase-advanced-node';
// Needs: API keys, authentication, order management

// Blockchain integration
import { Wallet } from 'base-mcp';
// Needs: Private keys, network config, gas management

// Multi-user system
// Needs: Database, authentication, user sessions
```

---

## Summary

### What We Built

A **sophisticated educational platform** that combines:

**REAL Components** (External):
- ✅ Coinbase price data
- ✅ MCP protocol (Anthropic)
- ✅ OpenAI AI services
- ✅ Market statistics
- ✅ Historical data

**CUSTOM Components** (Our Code):
- 🎨 Demo wallet system
- 🎨 Transaction simulator
- 🎨 Beer economy
- 🎨 Beautiful UI
- 🎨 Voice integration
- 🎨 AI orchestration

**NOT Using** (Researched):
- ❌ Base MCP (too complex, real money)
- ❌ x402 (different use case)
- ❌ Real blockchain (unnecessary risk)
- ❌ Coinbase trading API (overkill)

### The Result

A **perfect educational platform** that:
- Teaches crypto concepts safely
- Uses real market data for accuracy
- Provides instant feedback
- Requires zero setup
- Costs nothing to run
- Is production-quality code
- Can upgrade to real transactions later

**It's the best of all worlds!** 🌟

---

## 📚 Further Reading

- **README.md** - Project overview
- **DEMO_TRANSACTIONS.md** - Transaction tools reference
- **CIRCULAR_ECONOMY.md** - Beer economy guide
- **CHAT_WALLET_INTEGRATION.md** - Chat integration
- **MCP_SETUP_NOTES.md** - MCP configuration

## 🔗 External References

- [Model Context Protocol](https://modelcontextprotocol.io) - Official MCP docs
- [Coinbase API v2](https://developers.coinbase.com/api/v2) - Public API reference
- [Base MCP](https://github.com/base/base-mcp) - Real blockchain integration
- [x402 Protocol](https://docs.cdp.coinbase.com/x402/mcp-server) - Micropayments
- [OpenAI Platform](https://platform.openai.com/docs) - AI services

---

**Built with ❤️ for crypto education and AI innovation!** 🚀🍺₿

