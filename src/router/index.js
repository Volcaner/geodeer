import App from '../compparent/index.vue';

// 1. 定义（路由）组件。
// 可以从其他文件 import 进来
const Home = require('../compparent/home.vue');
const About = require('../compparent/about.vue');
const Product = require('../compparent/product.vue');
const Contact = require('../compparent/contact.vue');

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
// 我们晚点再讨论嵌套路由。
const routes = [
    { path: '/', component: Home },
    // {
    //     path: '/foo',
    //     component: Foo ,
    //     children: [
    //         {
    //             path: 'bbb',
    //             component: Bbb,
    //         }
    //     ]
    // },
    { path: '/about', component: About },
    { path: '/product', component: Product },
    { path: '/contact', component: Contact },
];

export default {
    routes
};

// export default [{
//     path: '/',
//     component: App,
//     children: [],
//     // routes: routes,
// }];
