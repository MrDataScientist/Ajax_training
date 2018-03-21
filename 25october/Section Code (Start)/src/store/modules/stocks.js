import stocks from '../../data/stocks';

const state = {
    stocks: []
};

const mutations = {
  'SET_STOCKS' (state, stocks){ //to get the state
      state.stocks = stocks; // overwriting the stocks here
  },
    'RND_STOCKS' (state) { // randomize
    }
};

const actions = { // which actions do I need ? I need to buy stocks
    buyStock:({commit}, order)=> {
        commit('BUY_STOCK', order);
    },
    initStocks:({commit}) => {
        commit('SET_STOCKS')
    },
    randomizeStocks:({commit})=>{
        commit('RND_STOCKS');
    }
};

const getters={
    stocks: state => {
        return state.stocks;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};