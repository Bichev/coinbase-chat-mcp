import { CoinbaseClient } from './coinbase-client.js';
import { 
  DemoWallet, 
  DemoTransaction, 
  PurchaseCalculation
} from './types.js';

/**
 * Demo Wallet Client for simulating crypto purchases
 * Perfect for educational demos like "buy a beer worth of Bitcoin"
 */
export class DemoWalletClient {
  private wallet: DemoWallet;
  private coinbaseClient: CoinbaseClient;

  constructor(coinbaseClient: CoinbaseClient) {
    this.coinbaseClient = coinbaseClient;
    
    // Initialize demo wallet with starting balance
    this.wallet = {
      balances: {
        USD: 1000.00,  // Start with $1000 USD
        BTC: 0,
        ETH: 0,
        USDC: 0
      },
      transactions: [],
      inventory: {
        beers: 0,
        items: []
      },
      createdAt: new Date(),
      lastUpdated: new Date()
    };
  }

  /**
   * Get current wallet balances
   */
  getWallet(): DemoWallet {
    return { ...this.wallet };
  }

  /**
   * Get balance for specific currency
   */
  getBalance(currency: string): number {
    return this.wallet.balances[currency.toUpperCase()] || 0;
  }

  /**
   * Calculate how much crypto you can buy for a "beer"
   */
  async calculateBeerCost(
    currency: string = 'BTC',
    beerCount: number = 1,
    pricePerBeer: number = 5
  ): Promise<PurchaseCalculation> {
    const usdAmount = beerCount * pricePerBeer;
    const currencyPair = `${currency.toUpperCase()}-USD`;
    
    try {
      const priceData = await this.coinbaseClient.getSpotPrice(currencyPair);
      const currentPrice = parseFloat(priceData.data.amount);
      const cryptoAmount = usdAmount / currentPrice;

      return {
        usdAmount,
        cryptoAmount,
        cryptoCurrency: currency.toUpperCase(),
        currentPrice,
        description: `${beerCount} beer${beerCount > 1 ? 's' : ''} 🍺 = ${cryptoAmount.toFixed(8)} ${currency.toUpperCase()}`
      };
    } catch (error) {
      throw new Error(`Failed to calculate beer cost: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Simulate purchasing crypto with USD
   */
  async simulatePurchase(
    fromCurrency: string,
    toCurrency: string,
    amount: number,
    description?: string
  ): Promise<DemoTransaction> {
    const from = fromCurrency.toUpperCase();
    const to = toCurrency.toUpperCase();

    // Check if user has enough balance
    const currentBalance = this.getBalance(from);
    if (currentBalance < amount) {
      throw new Error(
        `Insufficient ${from} balance. Available: ${currentBalance.toFixed(2)}, Required: ${amount.toFixed(2)}`
      );
    }

    // Get current price
    let currentPrice: number;
    let cryptoAmount: number;

    if (from === 'USD' && to !== 'USD') {
      // Buying crypto with USD
      const currencyPair = `${to}-USD`;
      try {
        const priceData = await this.coinbaseClient.getSpotPrice(currencyPair);
        currentPrice = parseFloat(priceData.data.amount);
        cryptoAmount = amount / currentPrice;
      } catch (error) {
        throw new Error(`Failed to get price for ${currencyPair}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else if (to === 'USD' && from !== 'USD') {
      // Selling crypto for USD
      const currencyPair = `${from}-USD`;
      try {
        const priceData = await this.coinbaseClient.getSpotPrice(currencyPair);
        currentPrice = parseFloat(priceData.data.amount);
        cryptoAmount = amount * currentPrice;
      } catch (error) {
        throw new Error(`Failed to get price for ${currencyPair}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      throw new Error('At least one currency must be USD for demo transactions');
    }

    // Create transaction
    const transactionType: 'buy' | 'sell' = from === 'USD' ? 'buy' : 'sell';
    const transaction: DemoTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: transactionType,
      fromCurrency: from,
      toCurrency: to,
      fromAmount: from === 'USD' ? amount : amount,
      toAmount: from === 'USD' ? cryptoAmount : cryptoAmount,
      price: currentPrice,
      description: description || `${transactionType === 'buy' ? 'Bought' : 'Sold'} ${to} with ${from}`,
      timestamp: new Date(),
      status: 'completed'
    };

    // Update balances
    this.wallet.balances[from] = (this.wallet.balances[from] || 0) - transaction.fromAmount;
    this.wallet.balances[to] = (this.wallet.balances[to] || 0) + transaction.toAmount;
    
    // Add to transaction history
    this.wallet.transactions.unshift(transaction);
    this.wallet.lastUpdated = new Date();

    return transaction;
  }

  /**
   * Get transaction history
   */
  getTransactionHistory(limit: number = 10, currency?: string): DemoTransaction[] {
    let transactions = this.wallet.transactions;

    // Filter by currency if specified
    if (currency) {
      const curr = currency.toUpperCase();
      transactions = transactions.filter(
        tx => tx.fromCurrency === curr || tx.toCurrency === curr
      );
    }

    return transactions.slice(0, limit);
  }

  /**
   * Add funds to wallet (for testing)
   */
  addFunds(currency: string, amount: number): void {
    const curr = currency.toUpperCase();
    this.wallet.balances[curr] = (this.wallet.balances[curr] || 0) + amount;
    this.wallet.lastUpdated = new Date();
  }

  /**
   * Reset wallet to initial state
   */
  resetWallet(): void {
    this.wallet = {
      balances: {
        USD: 1000.00,
        BTC: 0,
        ETH: 0,
        USDC: 0
      },
      transactions: [],
      inventory: {
        beers: 0,
        items: []
      },
      createdAt: new Date(),
      lastUpdated: new Date()
    };
  }

  /**
   * Get wallet statistics
   */
  getWalletStats(): {
    totalTransactions: number;
    totalSpentUSD: number;
    totalCryptoBought: { [currency: string]: number };
    portfolioValue: Promise<number>;
  } {
    const totalTransactions = this.wallet.transactions.length;
    const totalSpentUSD = this.wallet.transactions
      .filter(tx => tx.fromCurrency === 'USD')
      .reduce((sum, tx) => sum + tx.fromAmount, 0);
    
    const totalCryptoBought: { [currency: string]: number } = {};
    this.wallet.transactions
      .filter(tx => tx.type === 'buy' && tx.toCurrency !== 'USD')
      .forEach(tx => {
        totalCryptoBought[tx.toCurrency] = 
          (totalCryptoBought[tx.toCurrency] || 0) + tx.toAmount;
      });

    const portfolioValue = this.calculatePortfolioValue();

    return {
      totalTransactions,
      totalSpentUSD,
      totalCryptoBought,
      portfolioValue
    };
  }

  /**
   * Calculate current portfolio value in USD
   */
  private async calculatePortfolioValue(): Promise<number> {
    let totalValue = this.wallet.balances.USD || 0;

    // Add value of crypto holdings
    for (const [currency, balance] of Object.entries(this.wallet.balances)) {
      if (currency !== 'USD' && balance > 0) {
        try {
          const priceData = await this.coinbaseClient.getSpotPrice(`${currency}-USD`);
          const price = parseFloat(priceData.data.amount);
          totalValue += balance * price;
        } catch (error) {
          // Skip if can't get price
          console.error(`Could not get price for ${currency}:`, error);
        }
      }
    }

    return totalValue;
  }

  /**
   * Buy a virtual beer with cryptocurrency!
   * This creates a complete circular economy: USD → BTC → Beer
   */
  async buyVirtualBeer(
    quantity: number = 1,
    currency: string = 'BTC',
    pricePerBeer: number = 5
  ): Promise<{
    success: boolean;
    message: string;
    transaction?: DemoTransaction;
    needsMoreCrypto?: boolean;
    suggestedAmount?: number;
  }> {
    const crypto = currency.toUpperCase();
    const totalUsdCost = quantity * pricePerBeer;

    try {
      // Get current crypto price
      const currencyPair = `${crypto}-USD`;
      const priceData = await this.coinbaseClient.getSpotPrice(currencyPair);
      const cryptoPrice = parseFloat(priceData.data.amount);
      const cryptoNeeded = totalUsdCost / cryptoPrice;

      // Check if user has enough crypto
      const currentBalance = this.getBalance(crypto);

      if (currentBalance < cryptoNeeded) {
        return {
          success: false,
          needsMoreCrypto: true,
          suggestedAmount: totalUsdCost,
          message: `❌ Insufficient ${crypto} balance!\n\n` +
            `You need: ${cryptoNeeded.toFixed(8)} ${crypto}\n` +
            `You have: ${currentBalance.toFixed(8)} ${crypto}\n\n` +
            `💡 Suggestion: First buy $${totalUsdCost.toFixed(2)} worth of ${crypto}, then try again!\n` +
            `Say: "Buy $${totalUsdCost} worth of ${crypto}"`
        };
      }

      // User has enough crypto - execute the beer purchase!
      const transactionType: 'buy' | 'sell' | 'transfer' = 'buy';
      const transaction: DemoTransaction = {
        id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: transactionType,
        fromCurrency: crypto,
        toCurrency: 'BEER',
        fromAmount: cryptoNeeded,
        toAmount: quantity,
        price: cryptoPrice,
        description: `🍺 Bought ${quantity} virtual beer${quantity > 1 ? 's' : ''} with ${crypto}`,
        timestamp: new Date(),
        status: 'completed'
      };

      // Deduct crypto from balance
      this.wallet.balances[crypto] = (this.wallet.balances[crypto] || 0) - cryptoNeeded;

      // Add beers to inventory
      this.wallet.inventory.beers += quantity;

      // Add item to inventory list
      this.wallet.inventory.items.push({
        id: transaction.id,
        name: 'Beer',
        emoji: '🍺',
        quantity: quantity,
        purchasePrice: cryptoNeeded,
        purchaseCurrency: crypto,
        purchaseDate: new Date()
      });

      // Record transaction
      this.wallet.transactions.unshift(transaction);
      this.wallet.lastUpdated = new Date();

      return {
        success: true,
        transaction,
        message: `🍺 Beer Purchase Successful!\n\n` +
          `You bought ${quantity} virtual beer${quantity > 1 ? 's' : ''} for ${cryptoNeeded.toFixed(8)} ${crypto}\n` +
          `Price: $${cryptoPrice.toLocaleString()} per ${crypto}\n\n` +
          `🎉 Total beers in inventory: ${this.wallet.inventory.beers}\n` +
          `Remaining ${crypto}: ${this.wallet.balances[crypto].toFixed(8)}`
      };
    } catch (error) {
      throw new Error(`Failed to buy virtual beer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get inventory
   */
  getInventory() {
    return this.wallet.inventory;
  }
}

