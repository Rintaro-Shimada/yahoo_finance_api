export class YahooFinanceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'YahooFinanceError';
  }
}
