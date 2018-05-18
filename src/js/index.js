import Vue from 'vue';
// import VueResource from 'vue-resource';
import VueRouter from 'vue-router';

// Vue.use(VueResource);
Vue.use(VueRouter);

import $ from 'jquery';
import store from '../store/index';
import routers from '../router/index';
import index from '../compparent/index.vue';
import css from '../less/index.less';
require('../public/public');
// require('../../lib/qqmap');

// console.log(routers);

const router = new VueRouter(
	routers
);

var vm = new Vue({
    el: '#app',
    store,
    router,
    data: {},
    render: z=>z(index)
});
