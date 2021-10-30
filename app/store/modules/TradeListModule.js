import TradeListModel from "~/model/TradeListModel";
const state ={
        filterList:[]
    };
const getters = {
    FILTER_LIST: state=>{
        return state.filterList;
    }
};
const mutations = {
    SET_FILTER_LIST: (state, payload) =>{
            return state.filterList = payload;
        },
    };
const actions = {
        SET_FILTER_LIST: (context, payload)=>{
            try {
                let filterList = [] 
                filterList = TradeListModel.filterTrade(payload);
                context.commit('SET_FILTER_LIST', filterList);
            } catch(e){console.log(e);}
        },
    };

export default {
    state,
    mutations,
    actions,
    getters
}