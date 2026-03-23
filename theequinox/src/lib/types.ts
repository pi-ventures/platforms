export interface Stock {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe: number;
  high52: number;
  low52: number;
}

export interface Holding {
  stockId: string;
  symbol: string;
  name: string;
  qty: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  pnl: number;
  pnlPercent: number;
  dayChange: number;
}

export interface Portfolio {
  holdings: Holding[];
  totalValue: number;
  totalInvested: number;
  totalPnL: number;
  totalPnLPercent: number;
  dayPnL: number;
  dayPnLPercent: number;
}

export interface AutoTradeRule {
  id: string;
  name: string;
  type: 'buy' | 'sell' | 'rebalance' | 'sip' | 'stop-loss';
  condition: string;
  target: string;
  active: boolean;
  triggered: boolean;
  profit?: number;
}

export interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  qty: number;
  price: number;
  total: number;
  status: 'completed' | 'pending' | 'cancelled';
  timestamp: Date;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  alert?: {
    type: 'high' | 'low';
    value: number;
  };
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface VaultSyncPayload {
  userId: string;
  holdings: Holding[];
  totalValue: number;
  timestamp: Date;
  syncStatus: 'pending' | 'synced' | 'failed';
}

export interface PortfolioMetrics {
  date: string;
  value: number;
  invested: number;
  pnl: number;
}
