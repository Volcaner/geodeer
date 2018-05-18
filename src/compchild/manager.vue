<template>
    <div class="manager">
        <div class="manager_area">
            <div class="manager_info_box">
                <ul>
                    <li style=": #444; z-index: 3;" class="mg_slide_active">
                        <div class="manager_info_pic">
                            <img src="../images/12leader.jpg" alt="">
                            <p><span>李金玲</span><br /><b>General manager</b></p>
                        </div>

                        <div class="manager_info_text">
                            <p>
                                迷鹿的使命是关注现代职业女性的精神生活状态，我们期望帮助千万女性舒缓压抑状态。<br />
                                迷鹿的愿景是成为持续为顾客、合作伙伴、员工创造新价值的公司；<br />
                                成为一家透明、简单、信任的公司；成为一个让员工有安全感、幸福感的大家庭。
                            </p>
                        </div>
                    </li>
                    <li style=": #444; z-index: 1;" class="">
                        <div class="manager_info_pic">
                            <img src="../images/13leader.jpg" alt="">
                            <p><span>李程思</span><br /><b>copartner</b></p>
                        </div>

                        <div class="manager_info_text">
                            <p>
                                现在，我们不在是单一的食品企业，却也在提醒着我们，市场在变化，我们要不断的进步；<br />
                                客户需求在改变，是对我们提出了更高的要求。而我们只有以优质的产品与诚挚的服务来迎接未来的每一个客户，我们在成长，我们在进步，我们一直在路上......
                            </p>
                        </div>
                    </li>
                    <li style=": #444; z-index: 2;" class="">
                        <div class="manager_info_pic">
                            <img src="../images/14leader.jpg" alt="">
                            <p><span>赵永兰</span><br /><b>General manager</b></p>
                        </div>

                        <div class="manager_info_text">
                            <p>
                                因为有梦想，才会有充满激情的事业，迷鹿几何环绕愿景、使命、价值观的管理理念来引领企业进步。迷鹿是每个员工实现梦想的舞台。这些年来，公司的业绩成年翻倍增长，员工的收入及待遇也每年提高，公司在高速发展中走向未来......
                            </p>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="manager_control">
                <span @click='clickToPrevious'>&lt;</span>
                <span @click='clickToNext'>&gt;</span>
                <!-- <input type="button" value="<" @click='clickToPrevious'> -->
                <!-- <input type="button" value=">" @click='clickToNext'> -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            managerTimer: null,
        }
    },
    mounted() {
        if(this.managerTimer) {
            clearInterval(this.managerTimer);
        }
        this.managerTimer = setInterval(function() {
            // console.log("managerTimer");
            $(".manager_control>span:eq(1)").trigger("click");
        }, 10000);
    },
    destroyed() {
        if(this.managerTimer) {
            clearInterval(this.managerTimer);
        }
    },
    methods: {
        clickToPrevious: function() {
            var oldActiveEl = $(".mg_slide_active");
            var zIndex = $(oldActiveEl).css("z-index");
            var preAll = $(oldActiveEl).prevAll();
            var nextAll = $(oldActiveEl).nextAll();
            if(preAll && preAll.length > 0) {
                var preEl = $(oldActiveEl).prev();
                var listAll = $(".manager_info_box>ul>li");
                listAll.each(function(index, item) {
                    $(item).removeClass("mg_slide_active");
                    $(item).removeClass("mg_slide_preActive");
                    $(item).removeClass("mg_slide_nextActive");
                });
                $(preEl).addClass("mg_slide_active");
                $(preEl).addClass("mg_slide_preActive");
                $(preEl).css("z-index", parseInt(zIndex)+1);
            }
            else if(nextAll && nextAll.length > 0) {
                var lastEl = $(".manager_info_box>ul>li").last();
                var listAll = $(".manager_info_box>ul>li");
                listAll.each(function(index, item) {
                    $(item).removeClass("mg_slide_active");
                    $(item).removeClass("mg_slide_preActive");
                    $(item).removeClass("mg_slide_nextActive");
                });
                $(lastEl).addClass("mg_slide_active");
                $(lastEl).addClass("mg_slide_preActive");
                $(lastEl).css("z-index", parseInt(zIndex)+1);
            }
        },
        clickToNext: function() {
            var oldActiveEl = $(".mg_slide_active");
            var zIndex = $(oldActiveEl).css("z-index");
            var preAll = $(oldActiveEl).prevAll();
            var nextAll = $(oldActiveEl).nextAll();
            if(nextAll && nextAll.length > 0) {
                var nextEl = $(oldActiveEl).next();
                var listAll = $(".manager_info_box>ul>li");
                listAll.each(function(index, item) {
                    $(item).removeClass("mg_slide_active");
                    $(item).removeClass("mg_slide_preActive");
                    $(item).removeClass("mg_slide_nextActive");
                });
                $(nextEl).addClass("mg_slide_active");
                $(nextEl).addClass("mg_slide_nextActive");
                $(nextEl).css("z-index", parseInt(zIndex)+1);
            }
            else if(preAll && preAll.length > 0) {
                var firstEl = $(".manager_info_box>ul>li").first();
                var listAll = $(".manager_info_box>ul>li");
                listAll.each(function(index, item) {
                    $(item).removeClass("mg_slide_active");
                    $(item).removeClass("mg_slide_preActive");
                    $(item).removeClass("mg_slide_nextActive");
                });
                $(firstEl).addClass("mg_slide_active");
                $(firstEl).addClass("mg_slide_nextActive");
                $(firstEl).css("z-index", parseInt(zIndex)+1);
            }
        },
    }
}
</script>

<style lang="less" scoped>
    @import "../less/manager.less";
</style>
