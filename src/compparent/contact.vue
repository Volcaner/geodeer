<template>
    <transition name="fade">
        <div class="contact">
            <div class="contact_top" @click='goToMap($event)'>
                <!-- <div id="container" style="position: absolute; width: 100%;"></div> -->
                <div class="contact_topTab" >
                    <Top></Top>
                </div>
            </div>

            <div class="contact_assort">
                <div class="contact_assort_area">
                    <div class="contact_assort_areaTab">
                        <span class="assortTabActive" @click='clickShowContactAssort($event, "FEEDBACK")'>信息反馈</span>
                        <i></i>
                        <span  @click='clickShowContactAssort($event, "CONTACT")'>联系方式</span>
                        <i></i>
                        <span @click='clickShowContactAssort($event, "RECRUIT")'>招聘信息</span>
                    </div>

                    <div class="contact_assort_areaDetail">
                        <transition name="slide-fade">
                            <div v-show='assortTab=="FEEDBACK"' class="ca_areaDetail_feedback assort_detail clearfix">
                                <div class="ca_areaDetail_feedback_contactInfo">
                                    <p>
                                        <img src="../images/01lianxiwomen.png" width="180" height="25" alt="">
                                    </p>
                                    <hr />
                                    <p><span>地　址：</span><b>吉林省长春市大丰区大中镇</b></p>
                                    <p><span>联系人：</span><b>李先生</b></p>
                                    <p><span>手　机：</span><b>13196640658</b></p>
                                    <p><span>网　址：</span><b>www.geodeer.com</b></p>
                                    <p>
                                        <img src="../images/02erweima.png" width="68" height="68" style="margin-top: 30px;" alt="">
                                    </p>
                                </div>
                                <div class="ca_areaDetail_feedback_input">
                                    <p><input type="text" name="name" placeholder="姓名"></p>
                                    <p><input type="text" name="email" placeholder="邮箱"></p>
                                    <p>
                                        <textarea name="content" rows="5" cols="" placeholder="内容"></textarea>
                                    </p>
                                    <p><input type="button" name="submit" value="提交"></p>
                                </div>
                            </div>
                        </transition>

                        <transition name="slide-fade">
                            <div v-show='assortTab=="CONTACT"' class="ca_areaDetail_contact assort_detail">
                                <div class="ca_areaDetail_contact_tab">
                                    <span @click='clickContactTab($event, "ADDRESS")'><img data-key="03address" src="../images/03address-1.png" alt=""></span>
                                    <span @click='clickContactTab($event, "PHONE")'><img data-key="02phone" src="../images/02phone.png" alt=""></span>
                                    <span @click='clickContactTab($event, "EMAIL")'><img data-key="04email" src="../images/04email.png" alt=""></span>
                                    <span @click='clickContactTab($event, "WEB")'><img data-key="05web" src="../images/05web.png" alt=""></span>
                                </div>

                                <div class="ca_areaDetail_contact_text clearfix">
                                    <div v-if='assortContactTab=="ADDRESS"' class="">
                                        <p>地址：吉林省长春市迷鹿几何食品</p>
                                    </div>
                                    <div v-if='assortContactTab=="PHONE"' class="">
                                        <p>电话：13196640658</p>
                                    </div>
                                    <div v-if='assortContactTab=="EMAIL"' class="">
                                        <p>邮箱：geodeer@163.com</p>
                                    </div>
                                    <div v-if='assortContactTab=="WEB"' class="">
                                        <p>网址：www.geodeer.com</p>
                                    </div>
                                </div>
                            </div>
                        </transition>

                        <transition name="slide-fade">
                            <div v-show='assortTab=="RECRUIT"' class="ca_areaDetail_recruit assort_detail">
                                <div v-show='!bIsShowRecruitDetail' class="ca_areaDetail_recruit_box">
                                    <div class="ca_areaDetail_recruit_search clearfix">
                                        <input type="text" name="recruitSearch" value="" placeholder="搜索职位">
                                        <span>
                                            <img src="../images/search.png" alt="" width="27" height="27">
                                        </span>
                                    </div>
                                    <div class="ca_areaDetail_recruit_list">
                                        <div class="recruit_list_nav clearfix">
                                            <span style="width: 25%;">职位</span>
                                            <span style="width: 25%;">地点</span>
                                            <span style="width: 25%;">工作年限</span>
                                            <span style="width: 25%;"></span>
                                        </div>
                                        <div class="recruit_list_ul">
                                            <ul>
                                                <li class="clearfix">
                                                    <span style="width: 25%;">投资经理</span>
                                                    <span style="width: 25%;">长春</span>
                                                    <span style="width: 25%;">3年</span>
                                                    <span style="width: 25%; cursor: pointer;" @click='clickToShowRecruit({})'>查看</span>
                                                </li>
                                                <li class="clearfix">
                                                    <span style="width: 25%;">生产组长</span>
                                                    <span style="width: 25%;">长春</span>
                                                    <span style="width: 25%;">1~2年</span>
                                                    <span style="width: 25%; cursor: pointer;" @click='clickToShowRecruit({})'>查看</span>
                                                </li>
                                                <li class="clearfix">
                                                    <span style="width: 25%;">3D动画师</span>
                                                    <span style="width: 25%;">大连</span>
                                                    <span style="width: 25%;">1~2年</span>
                                                    <span style="width: 25%; cursor: pointer;" @click='clickToShowRecruit({})'>查看</span>
                                                </li>
                                                <li class="clearfix">
                                                    <span style="width: 25%;">文秘</span>
                                                    <span style="width: 25%;">长春</span>
                                                    <span style="width: 25%;">1~2年</span>
                                                    <span style="width: 25%; cursor: pointer;" @click='clickToShowRecruit({})'>查看</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <transition name="slide-fade">
                                    <div v-if='bIsShowRecruitDetail' class="ca_areaDetail_recruit_detail con_text">
                                        <div class="ca_areaDetail_recruit_detail_close" @click='clickToCloseShowRecruit'>
                                            <i>&times;</i>
                                        </div>
                                        <div class="con_text">
                                            <h5>安装工程师，迷鹿几何，技术类，吉林长春市</h5>
                                            <p>
                                                <span>
                                                    2018.3.5
                                                </span>
                                            </p>
                                            <p>
                                                <span>
                                                    岗位职责：<br />
                                                    1.负责项目的安装部分项目管理工作，包括强电、弱电、给排水、暖通、设备安装的工程管理工作； <br />
                                                    2.根据工程施工计划对安装工程的进度进行监督、检查，并根据情况提出调整意见；<br />
                                                    3.参与图纸会审和技术交底病督促执行，跟踪处理图纸会审中提出的问题； <br />
                                                    4.负责审查安装工程相关各单位提出的安装工程变更要求；<br />
                                                    5.根据相关规范标准对安装工程施工质量进行控制，对承包单位与监理单位的质量完成情况进行检查考核；<br />
                                                    6.对安装工程中出现的不合格事项进行检查，并提出处理意见；<br />
                                                    7.参加安装施工验收工作，督促施工单位对验收中提出的问题实施整改，并对整改后的情况进行复验。
                                                </span>
                                            </p>
                                            <p>
                                                <span>
                                                    任职要求：<br />
                                                    1.本科及以上学历，工程、电气、给排水、暖通等相关专业；<br />
                                                    2.三年以上施工单位或大型房产公司任职经验，有参与商业或旅游地产项目全过程经历优先；<br />
                                                    3.熟悉国家及地方相关法规、政策，熟悉安装类施工图、施工规范及要求，有较强的图纸审核及现场施工管理能力，熟悉施工现场管理流程、专业知识；<br />
                                                    4.熟练操作Office、Auto CAD等计算机软；<br />
                                                    5.富有责任心、事业心及团队合作精神，具有良好的沟通能力，严谨细致，抗压能力强，吃苦耐劳。
                                                </span>
                                            </p>
                                            <p>
                                                <span>
                                                    简历发送邮箱：1846600351@qq.com. 联系电话：13855303932
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </transition>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>

            <div class="contact_footer">
                <div class="contact_footerBox">
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
            assortTab: 'FEEDBACK',
            assortContactTab: 'ADDRESS',
            bIsShowRecruitDetail: false,
        }
    },
    mounted() {
        let that = this;
        this.$store.commit('setTabType', "CONTACT");

        // this.initMap();
    },
    methods: {
        clickShowContactAssort: function(eClick, strTab) {
            var that = this;
            var el = eClick.currentTarget;
            this.assortTab = strTab;

            $(el).addClass("assortTabActive");
            $(el).siblings().removeClass("assortTabActive");
        },
        clickContactTab: function(eClick, strTab) {
            var that = this;
            var el = eClick.currentTarget;
            this.assortContactTab = strTab;

            var dataKey = $(el).find("img").attr("data-key");
            var src = require("../images/" + dataKey + "-1.png");
            $(el).find("img").attr("src", src);

            var elSiblings = $(el).siblings();
            elSiblings.each(function(index, item) {
                var itemDataKey = $(item).find("img").attr("data-key");
                $(item).find("img").attr("src", "../images/" + itemDataKey + ".png");
            });
        },
        clickToShowRecruit: function(obj) {
            var that = this;

            this.bIsShowRecruitDetail = true;
        },
        clickToCloseShowRecruit: function() {
            var that = this;

            this.bIsShowRecruitDetail = false;
        },
        initMap: function() {
            var map = new qq.maps.Map(document.getElementById("container"), {
                center: new qq.maps.LatLng(39.916527,116.397128),      // 地图的中心地理坐标。
                zoom:8                                                 // 地图的中心地理坐标。
            });
        },
        goToMap: function(e) {
            if(e.currentTarget == e.target) {
                window.location.href = 'http://map.qq.com/';
            }
        },
    },
    components: {
        "Top": Top,
        "Foot": Footer,
    }
}
</script>

<style lang="less" scoped>
    @import "../less/contact.less";
</style>
