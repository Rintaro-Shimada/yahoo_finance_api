import axios from 'axios';

const PERIOD_TYPE_DAY = 'day';
const PERIOD_TYPE_WEEK = 'week';
const PERIOD_TYPE_MONTH = 'month';
const PERIOD_TYPE_YEAR = 'year';

// Valid frequencies: [1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo]
const FREQUENCY_TYPE_MINUTE = 'm';
const FREQUENCY_TYPE_HOUR = 'h';
const FREQUENCY_TYPE_DAY = 'd';
const FREQUENCY_TYPE_WEEK = 'wk';
const FREQUENCY_TYPE_MONTH = 'mo';

class YahooFinanceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'YahooFinanceError';
  }
}

export class YahooFinanceService {
  private symbol: string;

  constructor(symbol: string) {
    this.symbol = symbol;
  }

  /**
   * Fetches historical financial data from Yahoo Finance.
   * @param periodType - The type of period (e.g., "day", "month").
   * @param period - The length of the period.
   * @param frequencyType - The frequency of data (e.g., "d", "wk").
   * @param frequency - The number of intervals.
   * @returns The financial data as an object.
   */
  public async getHistorical(
    periodType: string,
    period: number,
    frequencyType: string,
    frequency: number
  ) {
    try {
      console.debug(
        `Fetching historical data for symbol: ${this.symbol}, periodType: ${periodType}, period: ${period}, frequencyType: ${frequencyType}, frequency: ${frequency}`
      );

      const data = await this.downloadSymbolData(
        periodType,
        period,
        frequencyType,
        frequency
      );

      const validFrequencyTypes = [
        FREQUENCY_TYPE_MINUTE,
        FREQUENCY_TYPE_HOUR,
        FREQUENCY_TYPE_DAY,
        FREQUENCY_TYPE_WEEK,
        FREQUENCY_TYPE_MONTH,
      ];

      if (!validFrequencyTypes.includes(frequencyType)) {
        throw new Error(`Invalid frequency type: ${frequencyType}`);
      }

      if (!data.timestamp) {
        console.warn(`No timestamp data found for symbol: ${this.symbol}`);
        return null;
      }

      const returnData = {
        timestamp: data.timestamp.map((x: number) => x * 1000),
        open: data.indicators.quote[0].open,
        high: data.indicators.quote[0].high,
        low: data.indicators.quote[0].low,
        close: data.indicators.quote[0].close,
        volume: data.indicators.quote[0].volume,
      };

      console.debug(`Successfully fetched data for symbol: ${this.symbol}`);
      return returnData;
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `Error fetching historical data for symbol: ${this.symbol} - ${error.message}`,
          { stack: error.stack }
        );
      } else {
        console.error('Unknown error occurred while fetching historical data');
      }
      throw error; // Rethrow to allow further handling up the call chain if needed
    }
  }

  private setTimeFrame(periodType: string, period: number): [number, number] {
    try {
      const now = new Date();
      let startTime: Date;

      switch (periodType) {
        case PERIOD_TYPE_DAY:
          period = Math.min(period, 59);
          startTime = new Date(now.getTime() - period * 24 * 60 * 60 * 1000);
          break;
        case PERIOD_TYPE_WEEK:
          period = Math.min(period, 59);
          startTime = new Date(
            now.getTime() - period * 7 * 24 * 60 * 60 * 1000
          );
          break;
        case PERIOD_TYPE_MONTH:
          period = Math.min(period, 59);
          startTime = new Date(
            now.getTime() - period * 30 * 24 * 60 * 60 * 1000
          );
          break;
        case PERIOD_TYPE_YEAR:
          period = Math.min(period, 59);
          startTime = new Date(
            now.getTime() - period * 365 * 24 * 60 * 60 * 1000
          );
          break;
        default:
          throw new Error(`Invalid period type: ${periodType}`);
      }

      const endTime = now.getTime() / 1000;
      console.debug(
        `Timeframe set: startTime=${startTime}, endTime=${endTime}`
      );

      return [Math.floor(startTime.getTime() / 1000), Math.floor(endTime)];
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `Error setting time frame for periodType: ${periodType}, period: ${period} - ${error.message}`,
          { stack: error.stack }
        );
      } else {
        console.error('Unknown error occurred while setting time frame');
      }
      throw error;
    }
  }

  private async downloadSymbolData(
    periodType: string,
    period: number,
    frequencyType: string,
    frequency: number
  ) {
    try {
      const [startTime, endTime] = this.setTimeFrame(periodType, period);
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${this.symbol}?symbol=${this.symbol}&period1=${startTime}&period2=${endTime}&interval=${this.frequencyStr(frequencyType, frequency)}&includePrePost=true&events=div%7Csplit%7Cearn&lang=en-US®ion=US&crumb=t5QZMhgytYZ&corsDomain=finance.yahoo.com`;

      console.debug(`Fetching data from URL: ${url}`);

      const headers = {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
      };
      const resp = await axios.get(url, { headers });
      const respJson = resp.data;

      if (this.isYfResponseError(respJson)) {
        this.raiseYfResponseError(respJson);
      }

      const dataJson = respJson.chart.result[0];

      console.debug(`Successfully downloaded data for symbol: ${this.symbol}`);
      return dataJson;
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `Error downloading symbol data for: ${this.symbol} - ${error.message}`,
          { stack: error.stack }
        );
      } else {
        console.error('Unknown error occurred while downloading symbol data');
      }
      throw error;
    }
  }

  private isYfResponseError(resp: any) {
    try {
      return resp.chart.error !== null;
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `Error checking Yahoo Finance response for errors - ${error.message}`,
          { stack: error.stack }
        );
      } else {
        console.error(
          'Unknown error occurred while checking Yahoo Finance response'
        );
      }
      throw error;
    }
  }

  private raiseYfResponseError(resp: any) {
    try {
      throw new YahooFinanceError(
        `${resp.chart.error.code}: ${resp.chart.error.description}`
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `Yahoo Finance error: ${resp.chart.error.code}: ${resp.chart.error.description}`,
          { stack: error.stack }
        );
      } else {
        console.error(
          'Unknown error occurred while raising Yahoo Finance error'
        );
      }
      throw error;
    }
  }

  private frequencyStr(frequencyType: string, frequency: number) {
    try {
      return `${frequency}${frequencyType}`;
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `Error constructing frequency string: frequencyType=${frequencyType}, frequency=${frequency} - ${error.message}`,
          { stack: error.stack }
        );
      } else {
        console.error(
          'Unknown error occurred while constructing frequency string'
        );
      }
      throw error;
    }
  }
}
