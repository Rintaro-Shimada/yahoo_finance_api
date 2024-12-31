'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create(
        (typeof Iterator === 'function' ? Iterator : Object).prototype
      );
    return (
      (g.next = verb(0)),
      (g['throw'] = verb(1)),
      (g['return'] = verb(2)),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                    ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.YahooFinanceService = void 0;
var axios_1 = require('axios');
var exceptions_1 = require('../utils/exceptions');
var PERIOD_TYPE_DAY = 'day';
var PERIOD_TYPE_WEEK = 'week';
var PERIOD_TYPE_MONTH = 'month';
var PERIOD_TYPE_YEAR = 'year';
// Valid frequencies: [1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo]
var FREQUENCY_TYPE_MINUTE = 'm';
var FREQUENCY_TYPE_HOUR = 'h';
var FREQUENCY_TYPE_DAY = 'd';
var FREQUENCY_TYPE_WEEK = 'wk';
var FREQUENCY_TYPE_MONTH = 'mo';
var YahooFinanceService = /** @class */ (function () {
  function YahooFinanceService(symbol) {
    this.symbol = symbol;
  }
  YahooFinanceService.prototype.getHistorical = function (
    periodType,
    period,
    frequencyType,
    frequency
  ) {
    return __awaiter(this, void 0, void 0, function () {
      var data, validFrequencyTypes, returnData, error_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            console.debug(
              'Fetching historical data for symbol: '
                .concat(this.symbol, ', periodType: ')
                .concat(periodType, ', period: ')
                .concat(period, ', frequencyType: ')
                .concat(frequencyType, ', frequency: ')
                .concat(frequency)
            );
            return [
              4 /*yield*/,
              this.downloadSymbolData(
                periodType,
                period,
                frequencyType,
                frequency
              ),
            ];
          case 1:
            data = _a.sent();
            validFrequencyTypes = [
              FREQUENCY_TYPE_MINUTE,
              FREQUENCY_TYPE_HOUR,
              FREQUENCY_TYPE_DAY,
              FREQUENCY_TYPE_WEEK,
              FREQUENCY_TYPE_MONTH,
            ];
            if (!validFrequencyTypes.includes(frequencyType)) {
              throw new Error('Invalid frequency type: '.concat(frequencyType));
            }
            if (!data.timestamp) {
              console.warn(
                'No timestamp data found for symbol: '.concat(this.symbol)
              );
              return [2 /*return*/, null];
            }
            returnData = {
              timestamp: data.timestamp.map(function (x) {
                return x * 1000;
              }),
              open: data.indicators.quote[0].open,
              high: data.indicators.quote[0].high,
              low: data.indicators.quote[0].low,
              close: data.indicators.quote[0].close,
              volume: data.indicators.quote[0].volume,
            };
            console.debug(
              'Successfully fetched data for symbol: '.concat(this.symbol)
            );
            return [2 /*return*/, returnData];
          case 2:
            error_1 = _a.sent();
            if (error_1 instanceof Error) {
              console.error(
                'Error fetching historical data for symbol: '
                  .concat(this.symbol, ' - ')
                  .concat(error_1.message),
                { stack: error_1.stack }
              );
            } else {
              console.error(
                'Unknown error occurred while fetching historical data'
              );
            }
            throw error_1; // Rethrow to allow further handling up the call chain if needed
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  YahooFinanceService.prototype.setTimeFrame = function (periodType, period) {
    try {
      var now = new Date();
      var startTime = void 0;
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
          throw new Error('Invalid period type: '.concat(periodType));
      }
      var endTime = now.getTime() / 1000;
      console.debug(
        'Timeframe set: startTime='
          .concat(startTime, ', endTime=')
          .concat(endTime)
      );
      return [Math.floor(startTime.getTime() / 1000), Math.floor(endTime)];
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          'Error setting time frame for periodType: '
            .concat(periodType, ', period: ')
            .concat(period, ' - ')
            .concat(error.message),
          { stack: error.stack }
        );
      } else {
        console.error('Unknown error occurred while setting time frame');
      }
      throw error;
    }
  };
  YahooFinanceService.prototype.downloadSymbolData = function (
    periodType,
    period,
    frequencyType,
    frequency
  ) {
    return __awaiter(this, void 0, void 0, function () {
      var _a,
        startTime,
        endTime,
        url,
        headers,
        resp,
        respJson,
        dataJson,
        error_2;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            _b.trys.push([0, 2, , 3]);
            (_a = this.setTimeFrame(periodType, period)),
              (startTime = _a[0]),
              (endTime = _a[1]);
            url = 'https://query1.finance.yahoo.com/v8/finance/chart/'
              .concat(this.symbol, '?symbol=')
              .concat(this.symbol, '&period1=')
              .concat(startTime, '&period2=')
              .concat(endTime, '&interval=')
              .concat(
                this.frequencyStr(frequencyType, frequency),
                '&includePrePost=true&events=div%7Csplit%7Cearn&lang=en-US\u00AEion=US&crumb=t5QZMhgytYZ&corsDomain=finance.yahoo.com'
              );
            console.debug('Fetching data from URL: '.concat(url));
            headers = {
              'User-Agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
            };
            return [
              4 /*yield*/,
              axios_1.default.get(url, { headers: headers }),
            ];
          case 1:
            resp = _b.sent();
            respJson = resp.data;
            if (this.isYfResponseError(respJson)) {
              this.raiseYfResponseError(respJson);
            }
            dataJson = respJson.chart.result[0];
            console.debug(
              'Successfully downloaded data for symbol: '.concat(this.symbol)
            );
            return [2 /*return*/, dataJson];
          case 2:
            error_2 = _b.sent();
            if (error_2 instanceof Error) {
              console.error(
                'Error downloading symbol data for: '
                  .concat(this.symbol, ' - ')
                  .concat(error_2.message),
                { stack: error_2.stack }
              );
            } else {
              console.error(
                'Unknown error occurred while downloading symbol data'
              );
            }
            throw error_2;
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  YahooFinanceService.prototype.isYfResponseError = function (resp) {
    try {
      return resp.chart.error !== null;
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          'Error checking Yahoo Finance response for errors - '.concat(
            error.message
          ),
          { stack: error.stack }
        );
      } else {
        console.error(
          'Unknown error occurred while checking Yahoo Finance response'
        );
      }
      throw error;
    }
  };
  YahooFinanceService.prototype.raiseYfResponseError = function (resp) {
    try {
      throw new exceptions_1.YahooFinanceError(
        ''
          .concat(resp.chart.error.code, ': ')
          .concat(resp.chart.error.description)
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          'Yahoo Finance error: '
            .concat(resp.chart.error.code, ': ')
            .concat(resp.chart.error.description),
          { stack: error.stack }
        );
      } else {
        console.error(
          'Unknown error occurred while raising Yahoo Finance error'
        );
      }
      throw error;
    }
  };
  YahooFinanceService.prototype.frequencyStr = function (
    frequencyType,
    frequency
  ) {
    try {
      return ''.concat(frequency).concat(frequencyType);
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          'Error constructing frequency string: frequencyType='
            .concat(frequencyType, ', frequency=')
            .concat(frequency, ' - ')
            .concat(error.message),
          { stack: error.stack }
        );
      } else {
        console.error(
          'Unknown error occurred while constructing frequency string'
        );
      }
      throw error;
    }
  };
  return YahooFinanceService;
})();
exports.YahooFinanceService = YahooFinanceService;
