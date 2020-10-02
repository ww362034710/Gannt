<!--选择功能-->
<template>
    <div class='connect-main'>
        <div class="transfer-main">
            <a-transfer :dataSource="relatedData" lazy :titles="['功能列表', '关联功能列表']" :targetKeys="targetKeys" @change="handleChange"
                        :listStyle="gettransferStyle" :show-search="false" :render="item => item.title">
            </a-transfer>
        </div>
    </div>
</template>
<script>
    export default {
        name: "selectFeature",
        props: {
            selected: {
                type: Array
            }
        },
        data() {
            return {
                relatedData: [],
                targetKeys: [],//已选中
                columns: [
                    {
                        dataIndex: 'name',
                        title: 'name'
                    }
                ]
            }
        },
        methods: {
            //选中数据
            handleChange(targetKeys, direction, moveKeys) {
                this.targetKeys = targetKeys;
            },
            loadTransferData() {
                this.$http.post("/bs/feature/transferData").then(rst => {
                    //添加唯一 key(string 类型)
                    this.whenSuccess(rst, data => {
                        console.log("请求到穿梭框数据：", data.data);
                        this.relatedData = data.data;
                    })
                })
            }
        },
        computed: {
            gettransferStyle() {
                let _height = document.documentElement.clientHeight;
                return {
                    width: 'calc(50% - 30px)',
                    height: _height - 400 + "px"
                }
            }
        },
        created() {
            this.targetKeys = this.selected.map(function (item) {
                 return item.featureId;
            });
            this.loadTransferData();
        },
    }

</script>