<template>
    <transition name="fade">
        <div class="product">
            <div class="product_top">
                <div class="product_topTab">
                    <Top></Top>
                </div>
            </div>

            <div class="product_assort">
                <div class="product_assort_area">
                    <div class="product_assort_areaTab">
                        <span class="assortTabActive" @click='clickShowProAssort($event, "MIXEDNUT")'>混合坚果系列</span>
                        <i></i>
                        <span  @click='clickShowProAssort($event, "PARTABLEBAG")'>便携袋装系列</span>
                        <i></i>
                        <span @click='clickShowProAssort($event, "BOXED")'>畅想盒装系列</span>
                    </div>

                    <div class="product_assort_areaDetail">
                        <transition name="slide-fade">
                            <div v-if='assortTab=="MIXEDNUT"' class="pa_areaDetail_mixednut con_text">
                                <div class="con_image" style="width: 1200px; position: relative;">
                                    <p>
                                        <span>
                                            <img src="../images/02mixednuts-1.png" alt="" style="max-width: 490px;">
                                        </span>
                                    </p>
                                </div>
                                <p>
                                    迷鹿几何食品有限公司位于吉林省，是一家以以坚果、干果、茶叶、休闲零食等食品的研发、分装及销售的为主的产业链平台型企业。围绕“帮助现代女性缓解压抑”的使命，迷鹿几何未来的业务范围还将扩展至动漫、影视等领域。
                                </p>
                                <p>
                                    在“大众创业、万众创新”的时代大潮下，迷鹿几何从五个人的创业团队，仅用五年的时间就成为一家年销售额超过50亿元的企业。截至目前，迷鹿几何拥有员工3200多人，平均年龄24.5岁。
                                </p>
                                <p>
                                    “做强一个IP，横跨多个产业，以三驾马车为驱动”是迷鹿几何未来五年的战略规划，借此努力实现销售额达300亿+，进入中国500强的目标。从2012年至今，迷鹿几何的产品全面覆盖天猫、京东、苏宁易购等各类电商渠道，并已建成十二个仓储物流中心以及三大配送中心。
                                </p>
                            </div>
                        </transition>

                        <transition name="slide-fade">
                            <div v-if='assortTab=="PARTABLEBAG"' class="pa_areaDetail_partablebag con_text">
                                <div class="con_image" style="width: 1200px; position: relative;">
                                    <p>
                                        <span>
                                            <img src="../images/06Bagged-1.png" alt="" style="max-width: 320px;">
                                        </span>
                                    </p>
                                    <p>
                                        <span>
                                            <img src="../images/06Bagged-2.png" alt="" style="max-width: 320px;">
                                        </span>
                                    </p>
                                    <p>
                                        <span>
                                            <img src="../images/06Bagged-3.png" alt="" style="max-width: 320px;">
                                        </span>
                                    </p>
                                </div>
                                <p>
                                    迷鹿几何食品有限公司位于吉林省，是一家以以坚果、干果、茶叶、休闲零食等食品的研发、分装及销售的为主的产业链平台型企业。围绕“帮助现代女性缓解压抑”的使命，迷鹿几何未来的业务范围还将扩展至动漫、影视等领域。
                                </p>
                                <p>
                                    在“大众创业、万众创新”的时代大潮下，迷鹿几何从五个人的创业团队，仅用五年的时间就成为一家年销售额超过50亿元的企业。截至目前，迷鹿几何拥有员工3200多人，平均年龄24.5岁。
                                </p>
                                <p>
                                    “做强一个IP，横跨多个产业，以三驾马车为驱动”是迷鹿几何未来五年的战略规划，借此努力实现销售额达300亿+，进入中国500强的目标。从2012年至今，迷鹿几何的产品全面覆盖天猫、京东、苏宁易购等各类电商渠道，并已建成十二个仓储物流中心以及三大配送中心。
                                </p>
                            </div>
                        </transition>

                        <transition name="slide-fade">
                            <div v-if='assortTab=="BOXED"' class="pa_areaDetail_boxed con_text">
                                <div class="con_image" style="width: 1200px; position: relative;">
                                    <p>
                                        <span>
                                            <img src="../images/08box.png" alt="" style="max-width: 490px;">
                                        </span>
                                    </p>
                                </div>
                                <p>
                                    迷鹿几何食品有限公司位于吉林省，是一家以以坚果、干果、茶叶、休闲零食等食品的研发、分装及销售的为主的产业链平台型企业。围绕“帮助现代女性缓解压抑”的使命，迷鹿几何未来的业务范围还将扩展至动漫、影视等领域。
                                </p>
                                <p>
                                    在“大众创业、万众创新”的时代大潮下，迷鹿几何从五个人的创业团队，仅用五年的时间就成为一家年销售额超过50亿元的企业。截至目前，迷鹿几何拥有员工3200多人，平均年龄24.5岁。
                                </p>
                                <p>
                                    “做强一个IP，横跨多个产业，以三驾马车为驱动”是迷鹿几何未来五年的战略规划，借此努力实现销售额达300亿+，进入中国500强的目标。从2012年至今，迷鹿几何的产品全面覆盖天猫、京东、苏宁易购等各类电商渠道，并已建成十二个仓储物流中心以及三大配送中心。
                                </p>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>

            <div class="product_footer">
                <div class="product_footerBox">
                    <Foot></Foot>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import Top from "../compchild/top.vue";
import Footer from "../compchild/footer.vue";
export default {
    data() {
        return {
            assortTab: 'MIXEDNUT',
        }
    },
    mounted() {
        let that = this;
        this.$store.commit('setTabType', "PRODUCT");
    },
    methods: {
        clickShowProAssort: function(eClick, strTab) {
            var that = this;
            var el = eClick.currentTarget;
            this.assortTab = strTab;

            $(el).addClass("assortTabActive");
            $(el).siblings().removeClass("assortTabActive");
        },
    },
    components: {
        "Top": Top,
        "Foot": Footer,
    }
}
</script>

<style lang="less" scoped>
    @import "../less/product.less";
</style>
