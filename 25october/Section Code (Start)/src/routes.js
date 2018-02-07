import Home from './components/Home.vue';
import Blocks from './components/Blockchain/Blocks.vue';
import Portfolio from './components/portfolio/Portfolio.vue';
import Stocks from './components/stocks/Stocks.vue';

export const routes = [
    {path: '/', component: Home},
    {path: '/Blockchain', component: Blocks},
    {path: '/portfolio', component: Portfolio},
    {path: '/stocks', component: Stocks}
];