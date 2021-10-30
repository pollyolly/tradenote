import Vue from 'nativescript-vue';
import Vuex from 'vuex';

import TradeListModule from './modules/TradeListModule';
import TradeNoteModule from './modules/TradeNoteModule';

Vue.use(Vuex);

const debug = 'debug';

const store = new Vuex.Store({
    modules: {
        TradeListModule,
        TradeNoteModule,
    },
    strict: process.env.NODE_ENV !== 'production',
});

Vue.prototype.$store = store;

export default store;