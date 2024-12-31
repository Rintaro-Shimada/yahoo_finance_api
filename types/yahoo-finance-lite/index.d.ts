declare module "yahoo-finance-lite" {
  export default class YahooFinanceLite {
    constructor(symbol: string);
    getHistorical(
      periodType: string,
      period: number,
      frequencyType: string,
      frequency: number
    ): Promise<{
      timestamp: number[];
      open: number[];
      high: number[];
      low: number[];
      close: number[];
      volume: number[];
    }>;
  }
}
