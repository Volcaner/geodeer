<template>
    <div class="top">
        <div class="top_tab clearfix">
            <div class="top_logo">
                <img :src='logo' alt="">
            </div>
            <div class="top_order">
                <p class="ordersEn">
                    <router-link tag="span" to="/" :class='tabType=="HOME"?"tabActive":""'>HOME<b>首页</b></router-link>
                    <router-link tag="span" to="/about" :class='tabType=="ABOUT"?"tabActive":""'>ABOUT<b>关于迷鹿</b></router-link>
                    <router-link tag="span" to="/product" :class='tabType=="PRODUCT"?"tabActive":""'>PRODUCT<b>迷鹿产品</b></router-link>
                    <router-link tag="span" to="/contact" :class='tabType=="CONTACT"?"tabActive":""'>CONTACT<b>联系我们</b></router-link>
                    <!-- <span @click='clickTab("HOME")' :class='tabType=="HOME"?"tabActive":""'>HOME<b>首页</b></span> -->
                    <!-- <span @click='clickTab("ABOUT")' :class='tabType=="ABOUT"?"tabActive":""'>ABOUT<b>关于迷鹿</b></span> -->
                    <!-- <span @click='clickTab("PRODUCT")' :class='tabType=="PRODUCT"?"tabActive":""'>PRODUCT<b>迷鹿产品</b></span> -->
                    <!-- <span @click='clickTab("CONTACT")' :class='tabType=="CONTACT"?"tabActive":""'>CONTACT<b>联系我们</b></span> -->
                </p>
                <hr />
            </div>
            <div class="top_others clearfix">
                <img src="../images/point.png" alt="" style="background-image: url(../images/04figure-2.png); background-position: 8px 8px;">
                <img src="../images/point.png" alt="" style="background-image: url(../images/04figure-2.png); background-position: -43px 8px;">
                <img src="../images/point.png" alt="" style="background-image: url(../images/04figure-2.png); background-position: -93px 8px;">
            </div>
        </div>
    </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex';
export default {
    data() {
        return {
            logo: require('../images/01logo.png'),
            // tabType: "HOME",
        }
    },
    computed: {
        ...mapState(['tabType']),
    },
    mounted() {
        let that = this;
    },
    methods: {
        clickTab: function(strTab) {
            this.$store.commit('setTabType', strTab);
        },
    }
}
</script>

<style lang="less" scoped>
    @import "../less/top.less";
</style>
