import { YahooFinanceService } from "../src/services/yahooFinanceService";

describe("YahooFinanceService", () => {
  it("should fetch financial data successfully", async () => {
    const yahooFinanceService = new YahooFinanceService("8306.T");
    const data = await yahooFinanceService.getHistorical('year', 40, 'd', 1);
    expect(data).toBeDefined();
  });
});
