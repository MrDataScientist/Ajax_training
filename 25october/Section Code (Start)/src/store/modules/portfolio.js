const state = {
    funds: 1000,
    stocks: []
};

const mutations = {
    'Buy_STOCK'(state, {stockId, quantity, stockPrice}) {
        const record = state.stocks.find(element => element.id == stockId);
        }
};