<template>
    <transition name="fade">
        <div class="home">
            <div class="h_top">
                <div class="h_topTab">
                    <Top></Top>
                </div>

                <div class="h_topLogo">
                    <img src="../images/03figure-1.png" alt="">
                    <p>一点偷闲·就在手边</p>
                </div>
            </div>

            <div class="h_content">
                <div class="hc_about">
                    <div class="hc_about_title">
                        <p>
                            Pay attention to the spiritual life of modern professional women.<br />
                            Help soothe the state of depression,<br />
                            Spread the relaxed and leisure culture.
                        </p>
                    </div>

                    <div class="hc_about_content clearfix">
                        <div class="hc_about_cPic"><img src="../images/06deer.png" alt=""></div>
                        <div class="hc_about_cText">
                            <p>
                                迷鹿几何食品有限公司位于吉林省，是一家以以坚果、干果、茶叶、休闲零食等食品的研发、分装及销售的为主的产业链平台型企业。围绕“帮助现代女性缓解压抑”的使命，迷鹿几何未来的业务范围还将扩展至动漫、影视等领域。
                                在“大众创业、万众创新”的时代大潮下，迷鹿几何从五个人的创业团队，仅用五年的时间就成为一家年销售额超过50亿元的企业。截至目前，迷鹿几何拥有员工3200多人，平均年龄24.5岁。<br />
                                “做强一个IP，横跨多个产业，以三驾马车为驱动”是迷鹿几何未来五年的战略规划，借此努力实现销售额达300亿+，进入中国500强的目标。从2012年至今，迷鹿几何的产品全面覆盖天猫、京东、苏宁易购等各类电商渠道，并已建成十二个仓储物流中心以及三大配送中心。
                            </p>
                        </div>
                    </div>

                    <div class="hc_about_btn">
                        <router-link tag="input" type="button" value="FIND MORE" to="/about" @click.native='clickFindMore()'></router-link>
                    </div>
                </div>

                <div class="hc_product">
                    <div class="hc_product_title clearfix">
                        <div>
                            <img src="../images/point.png" alt="" style="background-image: url(../images/04figure-2.png); background-position: 8px 8px;">
                            <img src="../images/point.png" alt="" style="background-image: url(../images/04figure-2.png); background-position: -43px 8px;">
                            <img src="../images/point.png" alt="" style="background-image: url(../images/04figure-2.png); background-position: -93px 8px;">
                        </div>
                    </div>

                    <div class="hc_product_content clearfix">
                        <div class="hc_product_cShow hc_product_cShow1">
                            <img src="../images/07nut-1.jpg" alt="">
                            <div class="hc_product_cShow_shadow clearfix">
                                <div class="shadow_lineTop"></div>
                                <div class="shadow_circle"></div>
                                <div class="shadow_text">
                                    <span>
                                        The particles are full, mellow and crisp, lightly roasted<br />
                                        The best of the nuts<br />
                                    </span>
                                    <b>
                                        ·迷鹿优选榛子·
                                    </b>
                                </div>
                                <div class="shadow_lineBottom"></div>
                            </div>
                        </div>
                        <div class="hc_product_cShow hc_product_cShow2">
                            <img src="../images/08nut-2.jpg" alt="">
                            <div class="hc_product_cShow_shadow clearfix">
                                <div class="shadow_lineTop"></div>
                                <div class="shadow_circle"></div>
                                <div class="shadow_text">
                                    <span>
                                        The particles are full, mellow and crisp, lightly roasted<br />
                                        The best of the nuts<br />
                                    </span>
                                    <b>
                                        ·迷鹿优选杏仁·
                                    </b>
                                </div>
                                <div class="shadow_lineBottom"></div>
                            </div>
                        </div>
                        <div class="hc_product_cShow hc_product_cShow3">
                            <img src="../images/point.png" alt="">
                            <div class="hc_product_cShow_light clearfix">
                                <div class="light_advert tb-rl">一点偷闲·就在手边</div>
                                <div class="light_line"></div>
                                <div class="light_pic">
                                    <img src="../images/09nut-3.png" width="255" height="125" alt="">
                                    <p>A little leisure. It's on the hand</p>
                                </div>
                            </div>
                        </div>
                        <div class="hc_product_cShow hc_product_cShow4">
                            <img src="../images/point.png" alt="">
                            <div class="hc_product_cShow_weight clearfix">
                                <div class="weight_advert tb-rl">一点偷闲·就在手边</div>
                                <div class="weight_line"></div>
                                <div class="weight_pic">
                                    <img src="../images/10nut-4.png" width="240" height="240" alt="">
                                </div>
                            </div>
                        </div>
                        <div class="hc_product_cShow hc_product_cShow5">
                            <img src="../images/11nut-5.jpg" alt="">
                            <div class="hc_product_cShow_shadow clearfix">
                                <div class="shadow_lineTop"></div>
                                <div class="shadow_circle"></div>
                                <div class="shadow_text">
                                    <span>
                                        The particles are full, mellow and crisp, lightly roasted<br />
                                        The best of the nuts<br />
                                    </span>
                                    <b>
                                        ·迷鹿优选核桃·
                                    </b>
                                </div>
                                <div class="shadow_lineBottom"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="hc_manager">
                    <div class="hc_manager_title">
                        <p>The elegant demeanor of the elite</p>
                        <i></i>
                    </div>

                    <div class="hc_manager_content">
                        <Manager></Manager>
                    </div>
                </div>

                <div class="hc_cooperate clearfix">
                    <div>
                        <img src="../images/13Cooperativepartner-1.png" alt="">
                        <img src="../images/14Cooperativepartner-2.png" alt="">
                        <img src="../images/15Cooperativepartner-3.png" alt="">
                        <img src="../images/16Cooperativepartner-4.png" alt="">
                        <img src="../images/18Cooperativepartner-6.png" alt="">
                        <img src="../images/19Cooperativepartner-7.png" alt="">
                    </div>
                </div>

            </div>

            <div class="h_footer">
                <div class="h_footerBox">
                    <Foot></Foot>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import Top from "../compchild/top.vue";
import Footer from "../compchild/footer.vue";
import Manager from "../compchild/manager.vue";
import {mapState, mapMutations, mapActions} from 'vuex';
export default {
    data() {
        return {

        }
    },
    mounted() {
        let that = this;
        this.$store.commit('setTabType', "HOME");

        this.refrashShadowHeight();
    },
    computed: {

    },
    methods:{
        clickFindMore: function() {
            $("body").scrollTop(0);
        },
        refrashShadowHeight: function() {
            var that = this;
            var showList = $(".hc_product_cShow");
            showList.each(function(index, el) {
                var elH = $(el).find(".shadow_text").css("height");
                $(el).find(".shadow_lineTop").css("height", "calc( 50% - " + (parseInt(elH)/2+6+50) + "px)");
                $(el).find(".shadow_lineBottom").css("height", "calc( 50% - " + (parseInt(elH)/2+50) + "px)");
            });

            showList.each(function(index, el) {
                var elPic = $(el).find(".light_pic").css("height");
                var elAdvert = $(el).find(".light_advert").css("height");
                $(el).find(".light_line").css("height", "calc( 100% - " + (parseInt(elPic)+parseInt(elAdvert)+30) + "px)");
            });

            showList.each(function(index, el) {
                var elPic = $(el).find(".weight_pic").css("height");
                var elAdvert = $(el).find(".weight_advert").css("height");
                $(el).find(".weight_line").css("height", "calc( 100% - " + (parseInt(elPic)+parseInt(elAdvert)+30) + "px)");
            });
        },
    },
    watch: {
        // deep: true,
    },
    components: {
        "Top": Top,
        "Foot": Footer,
        "Manager": Manager,
    }
}
</script>

<style lang="less" scoped>
    @import "../less/home.less";
</style>
