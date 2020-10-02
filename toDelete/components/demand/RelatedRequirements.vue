<template>
    <div class=''>
        <a-form layout='inline'>
            <a-form-item label="需求目录">
                <a-tree-select style="width:260px" :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }" :treeData="treeData" @change="getTableData" placeholder="请选择事件目录" treeDefaultExpandAll v-model="directory">
                </a-tree-select>
            </a-form-item>
        </a-form>
        <div class="transfer-main ">
            <a-transfer :dataSource="relatedData" lazy :titles="['需求列表', '已关联上级需求列表']" :targetKeys="targetKeys" @change="handleChange" :render="renderTransfer" :showSearch="relatedData.length>50" :listStyle="gettransferStyle" @selectChange="selectChange">
                <div slot="footer" class="transfer-footer custom-item">
                    <span class="custom-item-name">事件名称</span>
                    <span class="custom-item-version">版本号</span>
                </div>

            </a-transfer>

        </div>

    </div>
</template>

<script>

export default {
    components: {},
    data() {
        return {
            directory: "",
            treeData: [],
            targetKeys: [],
            relatedData: [],
            beforeSelect: []
        };
    },
    computed: {
        gettransferStyle() {
            let _height = document.documentElement.clientHeight;
            return {
                width: 'calc(50% - 30px)',
                height: _height - 300 + "px"
            }
        }
    },
    watch: {},
    methods: {
        //获取需求目录
        getTreeData() {
            this.$http.postBody("/bs/demandDocFolder/tree").then(data => {
                this.treeData = data;
            });
        },
        //选中数据
        handleChange(targetKeys, direction, moveKeys) {
            this.targetKeys = targetKeys;
        },
        /** 
         * 获取穿梭框数据
         * @param {*} value 选中文档节次值
        */
        getTableData(value) {
            this.$http.post("/relatedData", {
                id: value
            }).then(data => {
                //添加唯一 key(string 类型)
                data.data.data.forEach(v => {
                    v.key = Math.random().toString(36).substr(3, 10);
                    //添加版本号
                    v.versionData = []
                    v.version = ""
                    v.loading = false
                })
                //已选中重置
                this.targetKeys = [];
                this.relatedData = data.data.data;
            })
        },
        //左侧勾选
        selectChange(sourceSelectedKeys, targetSelectedKeys) {
            if (sourceSelectedKeys.length > this.beforeSelect.length) {
                this.getVersion(sourceSelectedKeys[sourceSelectedKeys.length - 1])
            }
            //记录左侧选中状态
            this.beforeSelect = sourceSelectedKeys;
        },
        //根据key 获取对应得版本号
        getVersion(key) {
            let index = this.relatedData.findIndex(v => {
                return v.key === key
            });
            let relData = this.relatedData[index];
            //显示加载状态
            this.setDirectoryLoadingStatus(relData, true, index)

            this.$http.get('/getVersion').then(data => {

                relData.versionData = data.data;
                this.setDirectoryLoadingStatus(relData, false, index)
            }).catch(() => {
                relData.version = '暂无版本号'
                this.setDirectoryLoadingStatus(relData, false, index)
            })
        },
        setDirectoryLoadingStatus(data, status, index) {
            data.loading = status;
            this.$set(this.relatedData, index, data);
        },
        /** 
         * 选择版本号
         * @param {*} data 选择版本号
         * @param {*} item 选择需求
        */
        chosenVersion(data, item) {
            let index = this.relatedData.findIndex(v => {
                return v.key === item.key
            });
            //获取选择得版本号
            let relData = this.relatedData[index]
            relData.version = data.text;
            this.$set(this.relatedData, index, relData)
        },
        //点击版本号选择 阻止事件上传
        stopChange(e) {
            e.preventDefault()
            e.stopPropagation()
        },
        //渲染穿梭框
        renderTransfer(item, a, b, c) {
            let customLabel = null;
            //渲染右侧
            if (this.targetKeys.includes(item.key)) {
                customLabel = (
                    <div class="custom-item">
                        <div class="custom-item-name" >{item.title}</div>
                        <div class="custom-item-version" >{item.version || '无'}</div>
                    </div >
                );
            } else {
                customLabel = this.setVersionText(item)
            }
            return {
                label: customLabel, // for displayed item
                value: item.title, // for title and filter matching
            };
        },
        setVersionText(item) {
            /** 
                          * 根据选择状态显示对应文本
                          * 加载中
                          * 勾选中
                          * 其他情况
                         */
            let _includes = this.beforeSelect.includes(item.key);
            let _ele = item.loading ? <a-icon type="loading" /> : _includes ? <div onClick={e => this.stopChange(e)} >{item.version || '选择版本'}</div> : <div></div>;

            return (
                <div class="custom-item">
                    <div class="custom-item-name" >{item.title}</div>
                    <div class={_includes ? 'custom-item-version-left' : ''}>
                        <a-popover placement="right" >
                            <ul slot="content" class='version-main'>
                                {
                                    item.versionData.map(v => {
                                        return <li key={v.value} onClick={e => this.chosenVersion(v, item)}>{v.text}</li>
                                    })
                                }
                            </ul>
                            {_ele}
                        </a-popover>

                    </div>
                </div >
            );
        }
    },
    created() {
        this.getTreeData()
    },
    mounted() {

    },
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    beforeDestroy() { }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { }, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
@mixin relatedOver() {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.transfer-main {
    margin-top: 10px;

    .custom-item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-top: -20px;
        margin-left: 20px;
        .custom-item-name {
            width: calc(100% - 110px);
            @include relatedOver();
        }

        .custom-item-version {
            width: 90px;
            text-align: center;
            margin-left: 5px;
            background-color: #f0f2f5;
            border-radius: 3px;
            @include relatedOver();
        }
        .custom-item-version-left {
            @extend .custom-item-version;
            background-color: #ffffff;
            border: 1px solid #f0f2f5;
            height: 20px;
        }
    }
    .transfer-footer {
        margin-left: 0 !important;
        .custom-item-name {
            padding-left: 30px;
            box-sizing: border-box;
        }
        .custom-item-version {
            background-color: transparent;
            border-radius: 0;
        }
    }
}
.version-main {
    min-width: 120px;
    max-height: 300px;
    overflow: auto;
    margin: 0;
    padding: 0;
    li {
        margin-bottom: 3px;
        padding: 2px 10px;
        box-sizing: border-box;
        cursor: pointer;
        &:hover {
            background-color: #f0f2f5;
        }
    }
}
</style>