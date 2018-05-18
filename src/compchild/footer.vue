<template>
    <div class="footer">
        <div class="footer_box">
            <div class="footer_content clearfix">
                <div class="footer_logo">
                    <img src="../images/01logo.png" alt="">
                    <img src="../images/03figure-2.png" alt="">
                </div>
                <div class="footer_about">
                    <router-link tag="h5" to="/about">关于迷鹿</router-link>
                    <ul>
                        <li>企业介绍</li>
                        <li>企业文化</li>
                        <li>迷鹿新闻</li>
                        <li>团队精英</li>
                    </ul>
                </div>
                <div class="footer_product">
                    <router-link tag="h5" to="/product">迷鹿产品</router-link>
                    <ul>
                        <li>混合坚果系列</li>
                        <li>便携袋装系列</li>
                        <li>畅想盒装系列</li>
                    </ul>
                </div>
                <div class="footer_contact">
                    <router-link tag="h5" to="/contact">联系我们</router-link>
                    <ul>
                        <li>信息反馈</li>
                        <li>联系方式</li>
                        <li>招聘信息</li>
                    </ul>
                </div>
            </div>

            <hr />

            <div class="footer_concat">
                <div class="footer_wqw">
                    <span><img src="../images/23qq.png" alt=""></span>
                    <span><img src="../images/22wechart.png" alt=""></span>
                    <span><img src="../images/24wb.png" alt=""></span>
                </div>
                <div class="footer_comp">
                    <p>吉林省迷鹿几何食品有限公司&nbsp;&nbsp;/GEODEER&nbsp;Food&nbsp;Co.,&nbsp;Ltd.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    methods: {
        returnToTop: function() {
            $("body").scrollTop(0);
        },
    },
}
</script>

<style lang="less" scoped>
    @import "../less/footer.less";
</style>
