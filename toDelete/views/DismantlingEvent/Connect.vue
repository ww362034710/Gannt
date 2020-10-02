<template>
    <div class='main-component connect-main'>
        <a-form :form="searchForm" layout="inline">
            <a-form-item label="事件目录：">
                <a-tree-select style="min-width:200px" :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }" :treeData="dventCatalogData" placeholder="Please select" v-model="searchForm.dventCatalogData" @change="getTableData">
                </a-tree-select>
            </a-form-item>
            <a-form-item style="float:right">
                <a-button icon="plus" type="primary" @click="connectNewEvent()">保存</a-button>
            </a-form-item>
        </a-form>

        <div class="transfer-main">
            <a-transfer :dataSource="relatedData" lazy :titles="['事件列表', '关联事件']" :targetKeys="targetKeys" @change="handleChange" :render="renderTransfer" :showSearch="relatedData.length>50" :listStyle="gettransferStyle">

                <div slot="footer" class="transfer-footer custom-item">
                    <span class="custom-item-name">事件名称</span>
                    <span class="custom-item-time">最早开始时间</span>
                    <span class="custom-item-time">最晚开始时间</span>
                    <span class="custom-item-day">预计完成</span>
                </div>
            </a-transfer>
            <div class="loading" v-show="loading">
                <a-spin size="large" />
            </div>
        </div>

    </div>
</template>

<script>

export default {
    components: {},
    data() {
        return {
            dventCatalogData: [],
            relatedData: [],
            targetKeys: [],//已选中关联条目
            searchForm: {
                dventCatalogData: ""
            },
            selDventCatalogId: "",
            loading: false,
        };
    },
    computed: {
        gettransferStyle() {
            let _height = document.documentElement.clientHeight;
            return {
                width: 'calc(50% - 30px)',
                height: _height - 210 + "px"
            }
        }
    },
    watch: {},
    methods: {
        //渲染穿梭框
        renderTransfer(item) {
            const customLabel = (
                <div class="custom-item">
                    <div class="custom-item-name" >{item.title}</div>
                    <div class="custom-item-time"> {item.createTime}</div>
                    <div class="custom-item-time">{item.createTime}</div>
                    <div class="custom-item-day">{item.day}天</div>
                </div >
            );
            return {
                label: customLabel, // for displayed item
                value: item.title, // for title and filter matching
            };
        },
        //获取事件目录
        getEventCatalogData() {
            this.$http.postBody("/bs/event/folder/tree").then(data => {
                this.dventCatalogData = data;
            });
        },
        /** 
         * 获取穿梭框数据
         * @param {*} value 选中文档节次值
        */
        getTableData(value) {
            this.selDventCatalogId = value;
            this.loading = true
            this.$http.post("/relatedData", {
                id: value
            }).then(data => {
                //添加唯一 key(string 类型)
                data.data.data.forEach(v => {
                    v.key = Math.random().toString(36).substr(3, 10)
                })
                //已选中重置
                this.targetKeys = [];
                this.relatedData = data.data.data;
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        //选中数据
        handleChange(targetKeys, direction, moveKeys) {
            this.targetKeys = targetKeys;
        },
        //保存
        connectNewEvent() {
            console.log(this.targetKeys);
            if (this.targetKeys.length === 0) {
                this.$message.warning("至少选择一条数据哦", 2);
            } else {
                this.$http.post("/relatedData", {
                    ids: this.targetKeys.join(',')
                }).then(data => {
                    //已选中重置
                    this.targetKeys = [];
                    //刷新左侧
                    this.getTableData(this.selDventCatalogId)
                })
            }
        },

    },
    created() {
        //获取事件目录
        this.getEventCatalogData()
    },
    mounted() {

    },

}
</script>
<style lang='scss' scoped>
.connect-main {
    margin: 16px;
    background-color: #ffffff;
    .transfer-main {
        margin-top: 10px;
        .loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    .custom-item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-top: -20px;
        margin-left: 20px;
        .custom-item-name {
            width: calc(100% - 280px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .custom-item-time {
            width: 100px;
        }

        .custom-item-day {
            width: 80px;
            color: #4b9dff;
        }
    }
    .transfer-footer {
        margin-left: 0 !important;
        .custom-item-name {
            padding-left: 30px;
            box-sizing: border-box;
        }
    }
}
</style>