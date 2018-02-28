const state = {
    stocks: []
};

const mutations = {
  'SET_STOCKS' (state, stocks){
      state.stocks = stocks;
  },
    'RND_STOCKS' (state) {
    }
};

const actions = {
    buyStock:({commit}, order)=> {
        commit();
}
};