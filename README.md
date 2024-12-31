# yahoo-finance-lite

A lightweight library for fetching historical financial data from Yahoo Finance.

## Installation
```bash
npm install yahoo-finance-lite
```

## Usage
```javascript
const { YahooFinanceService } = require("yahoo-finance-api");

const service = new YahooFinanceService("AAPL");
service.getHistorical("year", 40, "d", 1).then(data => console.log(data));
```

## Methods
```
getHistorical(periodType: string, period: number, frequencyType: string, frequency: number)
periodType: The type of period (e.g., "day", "month").
period: The length of the period.
frequencyType: The frequency of data (e.g., "d", "wk").
frequency: The number of intervals.
```

## License
MIT