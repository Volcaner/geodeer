import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const state = {
    tabType: "HOME",
};

const mutations = {
    setId(state, aaa) {

    },
    setTabType(state, tabType) {
        state.tabType = tabType;
    },
};

const actions = {};

export default new Vuex.Store({
    state,
    actions,
    mutations,
});
