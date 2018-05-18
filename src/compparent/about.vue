<template>
    <transition name="fade">
        <div class="about">
            <div class="about_top">
                <div class="about_topTab">
                    <Top></Top>
                </div>
            </div>

            <div class="about_content">
                <div class="about_contentTab">
                    <div class="about_contentTab_order">
                        <span class="contentTabActive" @click='clickShowACAssort($event, "BRIEF")'>企业简介</span>
                        <i></i>
                        <span  @click='clickShowACAssort($event, "CULTURE")'>企业文化</span>
                        <i></i>
                        <span @click='clickShowACAssort($event, "NEWS")'>迷鹿新闻</span>
                        <i></i>
                        <span @click='clickShowACAssort($event, "MANAGER")'>团队精英</span>
                    </div>

                    <div class="about_content_assort">
                        <transition name="slide-fade">
                            <div v-if='contentAssort=="BRIEF"' class="ac_assort_brief con_text">
                                <p>
                                    <span>
                                        <img src="../images/02introduction.png" alt="">
                                    </span>
                                </p>
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
                            <div v-if='contentAssort=="CULTURE"' class="ac_assort_culture con_text">
                                <p>
                                    <span>
                                        <img src="../images/03culture.png" alt="">
                                    </span>
                                </p>
                                <p>
                                    <span>
                                        品牌slogan：一点偷闲，就在手边。<br />
                                        都市白领女性长期处于压抑状态下，长此以往，对于身体和精神的健康也很不利，我们提出“减压休闲坚果”的概念，既是为了联想“压抑场景”及“舒缓作用”，从而与竞品做有效区别，也是希望对于女性更多维度的健康和发展做更多的努力。<br />
                                        坚果在“职场”这个比较严肃的场合出现时，食用过程可能会由于需要剥壳而不方便，slogan力求在传递“减压休闲”概念、表达轻松愉悦氛围的同时，摒除负面印象，传达“随时随地帮你解压”的轻松之感。
                                    </span>
                                </p>
                                <p>
                                    <span>品牌调性：简约精致、轻松休闲。</span>
                                </p>
                                <p>
                                    <span>迷鹿使命：关注现代职业女性的精神生活，帮助舒缓压抑状态，传播轻松休闲文化.</span>
                                </p>
                                <p>
                                    <span>迷鹿愿景：成为持续为消费者、合作伙伴、员工创造新价值的公司；成为一家透明、简单、信任的公司；成为一个让员工有安全感、幸福感的大家庭。</span>
                                </p>
                            </div>
                        </transition>

                        <transition name="slide-fade">
                            <div v-if='contentAssort=="NEWS"' class="ac_assort_news">
                                <div v-show='!bIsNewsDetailShow' class="ac_assort_newsPages">
                                    <div class="ac_assort_newsPages_box">
                                        <div class="aca_news">
                                            <b>2018-3-15</b>
                                            <hr />
                                            <h5>迷鹿几何每日坚果惊艳亮相【东京国际食品展】迷鹿几何每日坚果惊艳亮相【东京国际食品展】</h5>
                                            <p>
                                                2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。
                                            </p>
                                            <i @click='clickShowNewsText()'>>></i>
                                        </div>
                                        <div class="aca_news">
                                            <b>2018-3-15</b>
                                            <hr />
                                            <h5>迷鹿几何每日坚果惊艳亮相【东京国际食品展】迷鹿几何每日坚果惊艳亮相【东京国际食品展】</h5>
                                            <p>
                                                2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。
                                            </p>
                                            <i>>></i>
                                        </div>
                                        <div class="aca_news">
                                            <b>2018-3-15</b>
                                            <hr />
                                            <h5>迷鹿几何每日坚果惊艳亮相【东京国际食品展】迷鹿几何每日坚果惊艳亮相【东京国际食品展】</h5>
                                            <p>
                                                2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。
                                            </p>
                                            <i>>></i>
                                        </div>
                                        <div class="aca_news">
                                            <b>2018-3-15</b>
                                            <hr />
                                            <h5>迷鹿几何每日坚果惊艳亮相【东京国际食品展】迷鹿几何每日坚果惊艳亮相【东京国际食品展】</h5>
                                            <p>
                                                2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。
                                            </p>
                                            <i>>></i>
                                        </div>
                                        <div class="aca_news">
                                            <b>2018-3-15</b>
                                            <hr />
                                            <h5>迷鹿几何每日坚果惊艳亮相【东京国际食品展】迷鹿几何每日坚果惊艳亮相【东京国际食品展】</h5>
                                            <p>
                                                2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。
                                            </p>
                                            <i>>></i>
                                        </div>
                                        <div class="aca_news">
                                            <b>2018-3-15</b>
                                            <hr />
                                            <h5>迷鹿几何每日坚果惊艳亮相【东京国际食品展】迷鹿几何每日坚果惊艳亮相【东京国际食品展】</h5>
                                            <p>
                                                2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。
                                            </p>
                                            <i>>></i>
                                        </div>
                                        <div class="aca_news">
                                            <b>2018-3-15</b>
                                            <hr />
                                            <h5>迷鹿几何每日坚果惊艳亮相【东京国际食品展】迷鹿几何每日坚果惊艳亮相【东京国际食品展】</h5>
                                            <p>
                                                2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。
                                            </p>
                                            <i>>></i>
                                        </div>
                                        <div class="aca_news">
                                            <b>2018-3-15</b>
                                            <hr />
                                            <h5>迷鹿几何每日坚果惊艳亮相【东京国际食品展】迷鹿几何每日坚果惊艳亮相【东京国际食品展】</h5>
                                            <p>
                                                2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。
                                            </p>
                                            <i>>></i>
                                        </div>
                                        <div class="aca_news">
                                            <b>2018-3-15</b>
                                            <hr />
                                            <h5>迷鹿几何每日坚果惊艳亮相【东京国际食品展】迷鹿几何每日坚果惊艳亮相【东京国际食品展】</h5>
                                            <p>
                                                2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。
                                            </p>
                                            <i>>></i>
                                        </div>
                                        <div class="aca_news">
                                            <b>2018-3-15</b>
                                            <hr />
                                            <h5>迷鹿几何每日坚果惊艳亮相【东京国际食品展】迷鹿几何每日坚果惊艳亮相【东京国际食品展】</h5>
                                            <p>
                                                2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。
                                            </p>
                                            <i>>></i>
                                        </div>
                                    </div>
                                </div>
                                <div v-show='bIsNewsDetailShow' class="ac_assort_newsText ">
                                    <div class="ac_assort_newsText_close">
                                        <i @click='clickCloseNewsText'>&times;</i>
                                    </div>
                                    <div class="ac_assort_newsText_box con_text">
                                        <h5>迷鹿几何每日坚果惊艳亮相【东京国际食品展】</h5>
                                        <b>2018.3.5   来源：网易新闻</b>
                                        <p>
                                            <span>
                                                <img src="../images/04news-1.png" alt="">
                                            </span>
                                        </p>
                                        <p>
                                            2018年3月5日，第43届东京国际食品饮料展（FOODEX）在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展，开幕吸引专业采购商16604人。
                                        </p>
                                        <p>
                                            据了解，东京国际食品饮料展是亚太地区规模最大、声誉最高、品种最全、交易量最大的食品和饮料专项展览会。规模仅次于德国科隆、法国巴黎国际食品展，位列世界第三大规模。
                                        </p>
                                        <p>
                                            东京国际食品饮料展为期4天，此次展会，迷鹿几何作为行业优秀企业代表参展，在众多品牌中，以新颖的产品理念与良好的用户口碑，受到日本客商与消费者的青睐。
                                        </p>
                                        <p>
                                            理念新颖：迷鹿几何每日坚果系列产品由沃隆团队自主创新研发，以“甄选全球每一颗”“每日25g 营养定制”的核心产品理念，率先在国内市场倡导“沃隆每日坚果,引领健康生活”的消费理念。将“坚果”变成“每日坚果”，引领国内坚果市场进入2.0时代。
                                        </p>
                                        <p>
                                            优质品质：迷鹿几何每日坚果中所有坚果果干的原料，均源自全球领先产区的优质原料基地。并采用轻烤烘焙工艺,坚守原味无添加,配料表为百分百坚果配比,无任何添加剂。
                                        </p>
                                        <p>
                                            科学配比：迷鹿几何根据人体每日所需营养，将6种全球优质坚果果干科学配比制成，每日定量25g，开创了“每日坚果”品类，也开创了一个健康的新食代。
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </transition>

                        <transition name="slide-fade">
                            <div v-if='contentAssort=="MANAGER"' class="ac_assort_manager">
                                <div class="ac_assort_manager_box">
                                    <Manager></Manager>
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>

            <div class="about_footer">
                <div class="about_footerBox">
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
export default {
    data() {
        return {
            contentAssort: 'BRIEF',
            bIsNewsDetailShow: false,
        }
    },
    mounted() {
        let that = this;
        this.$store.commit('setTabType', "ABOUT");
    },
    methods:{
        clickShowACAssort: function(eClick, strAssort) {
            var that = this;
            var el = eClick.currentTarget;
            this.contentAssort = strAssort;

            $(el).addClass("contentTabActive");
            $(el).siblings().removeClass("contentTabActive");
        },
        clickCloseNewsText: function() {
            this.bIsNewsDetailShow = false;
        },
        clickShowNewsText: function() {
            this.bIsNewsDetailShow = true;
        },
    },
    components: {
        "Top": Top,
        "Foot": Footer,
        "Manager": Manager,
    }
}
</script>

<style lang="less" scoped>
    @import "../less/about.less";
</style>
