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
                <goal-add ref="GoalAdd" ></goal-add>
            </div>
<!--            &lt;!&ndash; 上传附件 &ndash;&gt;-->
<!--            <upload-file v-show="stepsCur===1"></upload-file>-->
            <!-- 这里加一个树控件 -->

<!--            <RelatedRequirements ref="relatedRequirements" v-show="stepsCur===1" />-->
<!--             目标拆解-->
            <div v-show="stepsCur===1" class="lastSteps">
              <goal-children-add ref="GoalChildren"></goal-children-add>
            </div>
        </div>
        <div class="steps-bottom">
            <a-button type="primary" icon="arrow-left" v-if="stepsCur!='0'" :loading="false" @click="stepsCur--"></a-button>

            <a-button type="primary" icon="arrow-right" v-if="stepsCur!='1'"  @click="nextSteps()" :loading="loading"></a-button>
            <a-button type="primary" v-if="stepsCur=='1'" @click="addHandler()" :loading="false">完成</a-button>
        </div>
    </div>
</template>

<script>
import GoalAdd from '@/components/goal/Add'
import GoalChildrenAdd from '@/components/goal/childrenGoal'
import GoalChildren from '@/views/goal/addChildren/addChildrenGoal'
export default {
    name: "addGoal",
    components: { GoalAdd, GoalChildrenAdd },
    data() {
        return {
            parentId:null,
            resolveSchemeId:null,
            childrenAddForm:null,
            goalAndScheme :{
                data:{},
                baseInfo:{},
                childrenInfo:{},
                nodeType:null,
            },
            addFormRule: {
                name: {
                    initialValue: "",
                    rules: [
                    ]
                },
                testKind: {
                    initialValue: "",
                    rules: [
                    ]
                },
                importantGrade: [
                    { value: 1, text: "重大目标" },
                    { value: 2, text: "重要目标" },
                    { value: 3, text: "普通目标" },
                    { value: 4, text: "一般目标" }
                ],
                planGrade: {
                    initialValue: "",
                    rules: [
                    ]
                },
                parentId:{},
                submittingAgency:{
                    rules:[]
                },
                createPerson: {
                    initialValue: "",
                    rules: [
                    ]
                },
                updatePerson: {
                    initialValue: "",
                    rules: [
                    ]
                },
                mark: {
                    initialValue: "",
                    rules: [
                    ]
                },

            },
            loading: false,//下一步提交保存
            stepsCur: 0,
            stepsData: [{
                title: "基本信息",
                icon: "snippets"
             },
                {title:'目标分解',
                icon: "snippets"
                }
             ]
        };
    },
    computed: {},
    watch: {},
    methods: {
        //下一步
         nextSteps() {
            try {
                // this.loading = true;
                if (this.stepsCur === 0) {
                    console.log("到我了！")
                    //提交信息
                     this.handlerStepsOne();
                } else if (this.stepsCur === 1) {//保存关联需求
                    console.log('目標分解');
                     // this.handlerRelements();
                }
                //下一步
                this.stepsCur++;
            } catch (e) {
                this.loading = false;
            }
        },
        //拆解提交
        addHandler() {
            this.loading = true;
            let _this = this;
            this.$refs.GoalChildren.getChildrenData().then(function (result) {
                console.log(result);
                _this.goalAndScheme.childrenInfo = result;
            })
            console.log(this.goalAndScheme);
            debugger;

            //模拟下传回到后台的是一颗树

            _this.goalAndScheme.data = JSON.stringify({"name":"根目标","key":"cb1922bb979f47619d0ddd00f039b0cf","value":null,"parentId":null,"state":"open","children":[{"name":"子目标2","key":"03d402bb22ef4871ad833be27df70bd0","value":null,"parentId":"cb1922bb979f47619d0ddd00f039b0cf","state":"open","children":[]},{"name":"子目标1","key":"03d402bb22ef4871ad833be27df70bde","value":null,"parentId":"cb1922bb979f47619d0ddd00f039b0cf","state":"open","children":[{"name":"二级子目标1","key":"03d402bb22ef4871ad833be27df70bdd","value":null,"parentId":"03d402bb22ef4871ad833be27df70bde","state":"open","children":[]},{"name":"子目标1下的事件1","key":"03d402bb22ef4871ad833be27df70bdf","value":null,"parentId":"03d402bb22ef4871ad833be27df70bde","state":"open","children":[]}]}]});
            return new Promise((resolve, reject) => {
                this.$http.postBody("/bs/deprecated/goal/add", this.goalAndScheme).then((res) => {
                    console.log(res);
                    resolve(res);
                    this.$router.push({
                        name: "goalIndex"
                    });
                }).catch(() => {
                    reject('出错了！ 请联系管理员');
                });
            });


        },
        //保存分解的目标

        //提交基本信息
        handlerStepsOne() {
             console.log("第一步")
            let _this = this;
             this.$refs.GoalAdd.handlerStepsOne().then(function (result) {
                console.log(result);
               _this.goalAndScheme.baseInfo = result;
                _this.loading = false;
            });

            // console.log(this.goalAndScheme);

            // return new Promise((resolve, reject) => {
            //     this.$refs.GoalChildrenAdd.addForm.validateFields((err, values) => {
            //         if (!err) {
            //             console.log("数据：" + JSON.stringify(values));
            //             values.parentId = this.parentId;
            //             values.resolveSchemeId = this.resolveSchemeId;
            //             this.goalAndScheme.baseInfo = values;
            //             console.log(this.goalAndScheme.baseInfo);
            //
            //             // this.$http.postBody("/bs/deprecated/goal/add", values).then(() => {
            //             //     resolve('成功');
            //             //     this.$router.push({
            //             //         name: "goalIndex"
            //             //     });
            //             // }).catch(() => {
            //             //     reject(false)
            //             // });
            //         } else {
            //             reject(false);
            //         }
            //     });
            //
            // });

        },
        // queryRoot(data){
        //      console.log("去后台查数据: " + data);
        // }


    },
    created() {
    this.parentId = this.$route.params.parentId;
    this.resolveSchemeId = this.$route.params.resolveSchemeId;
    // let type = this.$route.params.type;
    // if (this.resolveSchemeId!=='undefined'&& type ==='编辑'){
    //         console.log(this.resolveSchemeId);
    //         this.queryRoot(this.resolveSchemeId);
    //     }
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