<template>
    <a-modal
        :confirm-loading="confirmLoading"
        :visible="visible"
        @cancel="handleCancel"
        @ok="handleOk"
        title="活动详情"
        width="900px"
    >
        <article class="activity-deta">
            <section>
                <h3>基本信息</h3>
                <a-form :form="baseForm" @submit="baseFormSubmit" autocomplete="off">
                    <a-form-item :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }" label="名称">
                        <a-input
                            placeholder="请输入名称"
                            v-decorator="['name',{ rules: [{ required: true, message: '请输入名称' }] }]"
                        />
                    </a-form-item>
                    <!-- <a-form-item
                            label="ID"
                            :label-col="{ span: 7 }"
                            :wrapper-col="{ span: 12 }"
                            >{{activityData.id}}</a-form-item>-->
                    <a-form-item
                        :label-col="{ span: 7 }"
                        :wrapper-col="{ span: 12 }"
                        label="子系统"
                        v-if="activityData"
                    >{{activityData.subSystem}}</a-form-item>
                    <a-form-item :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }" label="描述">
                        <a-textarea placeholder="请输入描述" v-decorator="['description']" />
                    </a-form-item>
                    <a-form-item :wrapper-col="{ span: 12, offset: 9 }">
                        <a-button html-type="submit" type="primary">保存</a-button>
                    </a-form-item>
                </a-form>
                <!--  -->
                <h3>时间规划</h3>
                <a-form :form="planForm" @submit="planFormSubmit" autocomplete="off">
                    <a-form-item :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }" label="开始时间">
                        <a-date-picker placeholder="请选择开始时间" show-time v-decorator="['startTime']" />
                    </a-form-item>
                    <a-form-item
                        :label-col="{ span: 7 }"
                        :wrapper-col="{ span: 12 }"
                        label="活动间隔"
                    >{{activityData.duration}}</a-form-item>
                    <a-form-item :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }" label="结束时间">
                        <a-date-picker placeholder="请选择结束时间" show-time v-decorator="['endTime']" />
                    </a-form-item>
                    <a-form-item :wrapper-col="{ span: 12, offset: 9 }">
                        <a-button html-type="submit" type="primary">保存</a-button>
                    </a-form-item>
                </a-form>
            </section>
            <section>
                <!--  -->
                <h3>时间约束</h3>
                <a-form :form="timeForm" @submit="timeFormSubmit" autocomplete="off">
                    <a-form-item
                        :label-col="{ span: 7 }"
                        :wrapper-col="{ span: 12 }"
                        label="固定开始时间"
                    >
                        <a-date-picker placeholder="请选择开始时间" show-time v-decorator="['pin']" />
                    </a-form-item>
                    <a-form-item
                        :label-col="{ span: 7 }"
                        :wrapper-col="{ span: 12 }"
                        label="最早开始时间"
                    >
                        <a-date-picker placeholder="请选择开始时间" show-time v-decorator="['earliest']" />
                    </a-form-item>
                    <a-form-item
                        :label-col="{ span: 7 }"
                        :wrapper-col="{ span: 12 }"
                        label="最晚结束时间"
                    >
                        <a-date-picker placeholder="请选择结束时间" show-time v-decorator="['latest']" />
                    </a-form-item>
                    <a-form-item :wrapper-col="{ span: 12, offset: 9 }">
                        <a-button html-type="submit" type="primary">保存</a-button>
                    </a-form-item>
                </a-form>
                <a-form :form="properForm" @submit="properFormSubmit" autocomplete="off">
                    <h3>活动属性</h3>
                    <a-form-item :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }" label="活动间隔">
                        <a-input addon-after="秒" v-decorator="['s']" />
                    </a-form-item>
                    <a-form-item :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }" label="功率">
                        <a-input addon-after="瓦特" v-decorator="['w']" />
                    </a-form-item>
                    <a-form-item :wrapper-col="{ span: 12, offset: 9 }">
                        <a-button html-type="submit" type="primary">保存</a-button>
                    </a-form-item>
                </a-form>
                <a-form>
                    <h3>活动对资源的影响</h3>
                    <div class="impact-list">
                        <a-row>
                            <a-col :span="7">
                                <div class="right">能耗：</div>
                            </a-col>
                            <a-col :span="12">12.5 焦耳</a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="7">
                                <div class="right">机械臂：</div>
                            </a-col>
                            <a-col :span="12">02:30:00</a-col>
                        </a-row>
                    </div>
                </a-form>
            </section>
        </article>
    </a-modal>
</template>

<script>
import changeSceneData from '@mixins/changeSceneData';
import moment from 'moment';
import { mapGetters, mapMutations } from 'vuex';

export default {
    name: 'activityDetaDialog',
    mixins: [ changeSceneData ],
    computed: {
        ...mapGetters('Scene', ['sceneList', 'getSceneItemById'])
    },
    data() {
        return {
            activityData: {},
            visible: false, // 是否显示dialog
            confirmLoading: false, //是否正在加载
            baseForm: this.$form.createForm(this, 'base'),
            planForm: this.$form.createForm(this, 'plan'),
            properForm: this.$form.createForm(this, 'proper'),
            timeForm: this.$form.createForm(this, 'time'),
        };
    },
    props: {
        show: {
            //是否显示dialog
            type: Boolean,
            default: false,
        },
        planActivityId: {
            type: String,
            required: true,
        },
    },
    watch: {
        show: {
            immediate: true,
            handler: function (v) {
                this.visible = v;
            },
        },
    },
    methods: {
        ...mapMutations('Scene', ['SET_SCENE']),

        // 保存基本信息
        baseFormSubmit(e) {
            e.preventDefault();
            this.baseForm.validateFields((err, values) => {
                if (!err) {
                    this._activitySubmit(values);
                }
            });
        },
        // 保存时间规划
        planFormSubmit(e) {
            e.preventDefault();
            this.planForm.validateFields((err, values) => {
                if (!err) {
                    console.log(values);
                    this._activitySubmit(values);
                }
            });
        },
        // 保存活动
        properFormSubmit(e) {
            e.preventDefault();
            this.properForm.validateFields((err, values) => {
                if (!err) {
                    console.log(values);
                }
            });
        },
        // 保存活动
        timeFormSubmit(e) {
            e.preventDefault();
            this.timeForm.validateFields((err, values) => {
                if (!err) {
                    console.log(values);
                    this._activitySubmit(values);
                }
            });
        },
        async _activitySubmit(values) {
            let param = Object.assign({}, values, { id: this.activityData.id });
            let res = await this.$http.postBody(
                '/bs/ns/plan/activity/edit',
                param
            );
            if (res.code) return false;

            // 修改vuex中的数据副本.
            this.changeDataStore(this.planActivityId, values);

            this.$message.success('操作成功');
        },
        // 关闭
        handleCancel() {
            this.$emit('close');
            this.visible = false;
        },
        handleOk() {
            this.$emit('close');
            this.visible = false;
        },
        async _getActivityInfo() {
            let res = await this.$http.get(
                '/bs/ns/plan/activity/show',
                Object.assign({}, { id: this.planActivityId })
            );
            if (res.code) {
                this.$message.error(res.msg);
            } else {
                this.activityData = res.data;
                //加载form
                this.loadActivityForm();
            }
        },
        loadActivityForm() {
            this.$nextTick(function () {
                this.baseForm.setFieldsValue({
                    name: this.activityData.name,
                    description: this.activityData.description,
                });
                this.planForm.setFieldsValue({
                    startTime: moment(this.activityData.startTime),
                    endTime: moment(this.activityData.endTime),
                });
                this.timeForm.setFieldsValue({
                    pin: moment(this.activityData.pin),
                    earliest: moment(this.activityData.earliest),
                    latest: moment(this.activityData.latest),
                });
            });
        },
    },
    mounted() {
        this._getActivityInfo();
    },
};
</script>

<style lang="scss" scoped>
.activity-deta {
    display: flex;
    justify-content: space-between;
    max-height: 70vh;
    overflow-y: auto;
    .impact-list {
        margin-top: 15px;
        .right {
            text-align: right;
        }
        .ant-row {
            margin-bottom: 8px;
        }
    }
    h3 {
        margin: 0;
    }
    section {
        width: 50%;
    }
}
</style>