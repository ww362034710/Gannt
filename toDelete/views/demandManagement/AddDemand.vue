<template>
    <div class='main-component addDemad-main'>
        <div class="demand-top">
            <a-steps :current="stepsCur">
                <a-step v-for="(item,index) in stepsData" :title="item.title" :key="index" @click="stepsCur = index" style="cursor:pointer">
                    <a-icon :type="item.icon" slot="icon" />
                </a-step>
            </a-steps>
        </div>
        <div class="demand-content">
            <!-- 基本信息 -->
            <div class="steps-one" v-show="stepsCur===0">
                <demand-add ref="demandAdd"></demand-add>
            </div>
            <!-- 上传附件 -->
            <upload-file v-show="stepsCur===1"></upload-file>
            <!-- 关联需求 -->
            <RelatedRequirements ref="relatedRequirements" v-show="stepsCur===2" />
            <!-- 需求拆解 -->
            <div v-show="stepsCur===3" class="lastSteps">
                <DemandItem />
            </div>
        </div>
        <div class="steps-bottom">
            <a-button type="primary" icon="arrow-left" v-if="stepsCur!='0'" @click="stepsCur--"></a-button>

            <a-button type="primary" icon="arrow-right" v-if="stepsCur!='3'" @click="nextSteps()" :loading="loading"></a-button>
            <a-button type="primary" v-if="stepsCur=='3'" @click="addHandler()" :loading="loading">完成</a-button>
        </div>
    </div>
</template>

<script>
import DemandAdd from '@/components/demand/Add'
import UploadFile from '@/components/demand/UploadFile'
import RelatedRequirements from '@/components/demand/RelatedRequirements'

import DemandItem from '@/views/demandManagement/Item'
export default {
    name: "demandManagementAddDemand",
    components: { DemandAdd, UploadFile, RelatedRequirements, DemandItem },
    data() {
        return {
            loading: false,//下一步提交保存
            stepsCur: 0,
            stepsData: [{
                title: "基本信息",
                icon: "snippets"
            }, {
                title: "关联附件",
                icon: "cloud-upload",
            }, {
                title: "关联需求",
                icon: "link",
            }, {
                title: "需求拆解",
                icon: "block",
            }]
        };
    },
    computed: {},
    watch: {},
    methods: {
        //下一步
        async nextSteps() {
            try {
                this.loading = true;
                if (this.stepsCur === 0) {
                    //提交信息
                    await this.handlerStepsOne();
                } else if (this.stepsCur === 2) {//保存关联需求
                    console.log('关联需求数据：', this.$refs.relatedRequirements.targetKeys);
                    await this.handlerRelements();
                }
                //下一步
                this.stepsCur++;
            } catch (e) {
                this.loading = false;
            }
        },
        //需求拆解提交
        addHandler() {

        },
        //保存关联需求
        handlerRelements() {
            return this.$http.postForm("/", values).then(() => {
                resolve('成功')
            }).catch(() => {
                reject(false)
            });
        },
        //提交基本信息
        handlerStepsOne() {
            return new Promise((resolve, reject) => {
                this.$refs.demandAdd.addForm.validateFields((err, values) => {
                    if (!err) {
                        console.log("数据：" + JSON.stringify(values));
                        this.$http.postForm("/bs/demandDoc/add", values).then(() => {
                            resolve('成功')
                        }).catch(() => {
                            reject(false)
                        });
                    } else {
                        reject(false)
                    }
                });
            })
        },

    },
    created() {

    },
    mounted() {

    },
    activated() { }, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
.addDemad-main {
    margin: 16px;
    background-color: #ffffff;
    .demand-content {
        position: absolute;
        top: 45px;
        bottom: 50px;
        left: 0;
        right: 0;
        padding: 5px 16px;
        box-sizing: border-box;
        overflow: auto;
        .steps-one {
            width: 80%;
            text-align: center;
        }
    }
    .steps-bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
        line-height: 50px;
        button {
            width: 120px;
            margin-right: 10px;
        }
    }
    .lastSteps {
        > div {
            min-height: calc(100vh - 242px);
        }
    }
}
</style>