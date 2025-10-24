# 🍺₿ Demo Transaction Features

## Overview

The Coinbase MCP now includes **4 new transaction tools** that simulate crypto purchases in a safe, educational demo mode! Perfect for understanding crypto transactions without risking real money.

## 🎯 Use Cases

- **"Buy a beer worth of Bitcoin"** - Convert everyday purchases to crypto amounts
- **Educational demos** - Learn how crypto transactions work
- **Portfolio simulation** - Test trading strategies
- **Price understanding** - See real-time crypto values in relatable terms

## 🔧 New MCP Tools

### 1. `calculate_beer_cost` 🍺
Calculate how much crypto you can buy with beer money!

**Parameters:**
- `currency` (optional): Crypto currency to buy (default: BTC)
- `beerCount` (optional): Number of beers (default: 1)
- `pricePerBeer` (optional): Price per beer in USD (default: $5)

**Example Usage:**
```
User: "How much Bitcoin can I buy for the price of a beer?"
AI calls: calculate_beer_cost({ currency: "BTC", beerCount: 1, pricePerBeer: 5 })
Result: "🍺 1 beer at $5 = 0.00005 BTC at current price of $100,000"
```

### 2. `simulate_btc_purchase` 💰
Simulate buying crypto with USD (or selling crypto for USD)

**Parameters:**
- `fromCurrency`: Currency to spend (e.g., "USD")
- `toCurrency`: Currency to buy (e.g., "BTC", "ETH")
- `amount`: Amount to spend
- `description` (optional): Transaction description

**Example Usage:**
```
User: "Buy $5 worth of Bitcoin"
AI calls: simulate_btc_purchase({ 
  fromCurrency: "USD", 
  toCurrency: "BTC", 
  amount: 5,
  description: "Beer money investment"
})
Result: ✅ Purchased 0.00005 BTC for $5.00
```

### 3. `get_virtual_wallet` 👛
View your demo wallet balance and statistics

**Parameters:** None

**Example Usage:**
```
User: "Show my wallet"
AI calls: get_virtual_wallet()
Result:
  👛 Demo Wallet
  💵 USD: $995.00
  🪙 BTC: 0.00005
  Total Transactions: 1
  Total Spent: $5.00
```

### 4. `get_transaction_history` 📝
View transaction history with filtering options

**Parameters:**
- `limit` (optional): Number of transactions to show (default: 10)
- `currency` (optional): Filter by currency

**Example Usage:**
```
User: "Show my last 5 transactions"
AI calls: get_transaction_history({ limit: 5 })
Result: Lists all transactions with details
```

## 🚀 Quick Start

### Using with Cursor IDE

1. **Restart Cursor** - The MCP server auto-loads with new tools
2. **Ask the AI**: 
   - "How much Bitcoin can I buy for $10?"
   - "Buy me a beer's worth of Bitcoin"
   - "Show my wallet balance"
   - "What's my transaction history?"

### Example Conversation Flow

```
User: "Hey, I want to buy a beer worth of Bitcoin"

AI: Let me calculate that for you!
[Calls calculate_beer_cost]
Result: At current BTC price of $100,243, one $5 beer equals 0.00004988 BTC

User: "Great! Let's buy it"

AI: [Calls simulate_btc_purchase]
✅ Transaction Successful!
- Purchased: 0.00004988 BTC
- Cost: $5.00
- Transaction ID: tx_1735234567_abc123

User: "Show my wallet"

AI: [Calls get_virtual_wallet]
👛 Your Demo Wallet:
  💵 USD: $995.00
  🪙 BTC: 0.00004988
  Total Transactions: 1
```

## 🎓 Educational Features

### Starting Balance
- $1,000 USD (virtual)
- $0 in all cryptocurrencies

### Transaction Types
- **Buy**: USD → Crypto
- **Sell**: Crypto → USD
- **Transfer**: Future feature

### Real-Time Pricing
All transactions use **real Coinbase prices** at the moment of transaction!

## 🔐 Safety Features

1. **Virtual Money Only** - No real transactions
2. **Isolated Wallet** - Each session has its own wallet
3. **No API Keys Required** - Works with public Coinbase API
4. **Reset Anytime** - Can reset wallet to initial state

## 📊 Available Currencies

### Supported for Demo Purchases
- **BTC** - Bitcoin
- **ETH** - Ethereum
- **LTC** - Litecoin
- **BCH** - Bitcoin Cash
- **ADA** - Cardano
- **SOL** - Solana
- **MATIC** - Polygon
- **AVAX** - Avalanche
- **ALGO** - Algorand
- **USDC** - USD Coin
- And many more!

## 🎯 Fun Scenarios to Try

### Beer-to-Crypto Calculator
```
"How many beers equal 1 full Bitcoin?"
"If I stopped buying coffee for a month ($150), how much ETH could I buy?"
"Compare the price of a pizza ($20) in BTC vs ETH"
```

### Portfolio Building
```
"Buy $50 worth of Bitcoin"
"Buy $30 worth of Ethereum"
"Buy $20 worth of Solana"
"Show my portfolio value"
```

### Market Timing
```
"What's the current BTC price?"
"Buy $100 of Bitcoin"
[Wait for price change]
"Show my transaction history"
"Calculate my gains"
```

## 🔧 Technical Details

### Architecture
```
┌─────────────────┐
│   Cursor IDE    │
│   (User Query)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   MCP Server    │
│  (Tool Router)  │
└────────┬────────┘
         │
    ┌────┴─────┐
    ▼          ▼
┌──────────┐ ┌─────────────────┐
│ Coinbase │ │  Demo Wallet    │
│  Client  │ │     Client      │
│(Prices)  │ │  (Simulator)    │
└──────────┘ └─────────────────┘
```

### Data Flow
1. User asks question → Cursor sends to MCP
2. MCP calls appropriate tool (calculate, purchase, etc.)
3. Tool fetches real price from Coinbase
4. Tool simulates transaction locally
5. Result returned to user

### Storage
- Transactions stored in-memory
- Wallet reset on server restart
- No persistent database required

## 🎨 Response Format Examples

### Successful Purchase
```
✅ Transaction Successful!

Transaction ID: tx_1735234567_abc123
Type: BUY

From: 5.00 USD
To: 0.00004988 BTC

Price: $100,243 per BTC
Description: Beer money investment

Status: completed
Time: 10/24/2025, 3:45:23 PM

🎉 You now own 0.00004988 BTC!
```

### Wallet Display
```
👛 Demo Wallet Overview

📊 Balances:
  💵 USD: $950.00
  🪙 BTC: 0.00015
  🪙 ETH: 0.012

📈 Statistics:
  Total Transactions: 3
  Total Spent (USD): $50.00
  
🗓️ Account Info:
  Created: 10/24/2025
  Last Updated: 10/24/2025, 3:45:23 PM

💡 This is a demo wallet for educational purposes
   Use 'simulate_btc_purchase' to buy crypto!
```

## 🚀 Future Enhancements

### Planned Features
- [ ] Crypto-to-crypto swaps
- [ ] Historical price at time of purchase
- [ ] Portfolio performance tracking
- [ ] Export transaction history
- [ ] Multiple wallet profiles
- [ ] Web UI for visual wallet management
- [ ] Real Coinbase API integration option

### Potential Integrations
- [ ] x402 micropayments
- [ ] Base MCP wallet sync
- [ ] Coinbase CDP API (for real transactions)
- [ ] Trading simulator with fees

## 📖 Related Documentation

- [MCP Setup Notes](./MCP_SETUP_NOTES.md) - How to configure MCP
- [README.md](./README.md) - Main project documentation
- [Coinbase API Docs](https://docs.cdp.coinbase.com) - Official Coinbase docs

## ❓ FAQ

**Q: Is this using real money?**
A: No! All transactions are simulated. You start with $1000 virtual USD.

**Q: Are prices real?**
A: Yes! Prices are fetched live from Coinbase's public API.

**Q: Can I lose money?**
A: No, it's all educational/demo mode.

**Q: How do I reset my wallet?**
A: Restart the MCP server or ask "reset my wallet" (if implemented).

**Q: Can I upgrade to real transactions?**
A: In the future! We can integrate with Coinbase's actual trading API.

**Q: What happens if I run out of virtual USD?**
A: You'll get an "insufficient balance" error. You can reset your wallet.

## 🎉 Try It Now!

Ask your AI assistant:
- "How much Bitcoin is a beer worth?"
- "Buy me $10 worth of Ethereum"
- "Show my crypto portfolio"
- "What's my transaction history?"

**Have fun learning about crypto! 🍺₿**

