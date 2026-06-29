const stocks = {
  reliance: 2948.55,
  tcs: 4218.9,
  infy: 1876.3,
  hdfcbank: 1724.6,
  icicibank: 1342.75,
  sbin: 838.45,
};
const indices = {
  NIFTY: 26350.45,
  SENSEX: 86214.72,
  BANKNIFTY: 55482.3,
  FINNIFTY: 24118.65,
};

function updatePrices() {
  Object.keys(stocks).forEach((symbol) => {
    const currentPrice = stocks[symbol];

    const percentChange = (Math.random() - 0.5) * 0.0002;

    stocks[symbol] = Number((currentPrice * (1 + percentChange)).toFixed(2));

    Object.keys(indices).forEach((name) => {
      const current = indices[name];

      const percentChange = (Math.random() - 0.5) * 0.00015;

      indices[name] = Number((current * (1 + percentChange)).toFixed(2));
    });
  });

  return { stocks, indices };
}
module.exports = {
  stocks,
  indices,
  updatePrices,
};
