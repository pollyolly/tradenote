import CoinModel from "~/model/CoinModel";
import TradeNoteModel from "~/model/TradeNoteModel";

const state ={
        coinList:[],
        tradeList:[]
    };
const getters = {
    COIN_LIST: state=>{
        return state.coinList;
    },
    TRADE_LIST: state=>{
        return state.tradeList;
    }
};
const mutations = {
        SET_COIN_LIST: (state, payload) =>{
            return state.coinList = payload;
        },
        SET_TRADE_LIST: (state, payload) =>{
            return state.tradeList = payload;
        }
    };
const actions = {
        SET_COIN_LIST: (context, payload)=>{
            try {  
                let coinList =[]
                coinList= CoinModel.listCoin();
                context.commit('SET_COIN_LIST', coinList);
            } catch(e){console.log(e);}
        },
        SET_TRADE_LIST: (context, payload)=>{
            try {  
                let tradeList = [] 
                tradeList = TradeNoteModel.listTrade([payload]);
                context.commit('SET_TRADE_LIST', tradeList);
            } catch(e){console.log(e);}
        }
    };

export default {
    state,
    mutations,
    actions,
    getters
}