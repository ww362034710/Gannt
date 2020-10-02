<template>
    <div>
        <a-form :form="assignForm">
            <a-form-item label="规划人">
                <a-select mode="multiple" v-model="assignForm.planners" placeholder="请选择规划人">
                    <a-select-option v-for="item in userData" :key="item.userId" :value="item.userId">
                        {{item.userName}}
                    </a-select-option>
                </a-select>
            </a-form-item>
        </a-form>
    </div>
</template>

<script>
    export default {
        name: "AssignPlannersForm",
        props: {
            sceneId: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                userData: [],
                assignForm: {
                    planners: []
                }
            }
        },
        methods: {
            handleSubmit() {
                let params = {
                    sceneId: this.sceneId,
                    plannerIds: this.assignForm.planners
                }
                //TODO 分配规划人
                //console.log('场景分发提交后台参数信息：', params);
                this.$http.postBody("/bs/distribute/add", params).then(rst => {
                    this.$message.success("分配成功", 2);
                    console.log(rst);
                })
            },
            getSelectUserData() {
                this.$http.postBody("/system/user/selectList", {}).then(rst => {
                    this.userData = rst.data;
                })
            }
        },
        mounted() {
            this.getSelectUserData();
        }
    }
</script>

<style scoped>

</style>