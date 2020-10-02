<template>
    <div class='upload-main'>
        <a-upload-dragger action="https://www.mocky.io/v2/5cc8019d300000980a055e76" @change="uploadFile" listType="text" :defaultFileList="fileList" @remove="delFile" class="upload-list-inline">
            <p class="ant-upload-drag-icon" style="margin-bottom:10px">
                <a-icon type="cloud-upload" />
            </p>
            <p class="ant-upload-text" style="font-size:14px">选择或拖拽文件至此</p>
            <p class="ant-upload-hint">
            </p>
        </a-upload-dragger>

    </div>
</template>

<script>

export default {
    components: {},
    data() {
        return {
            fileList: [
                {
                    uid: '-1',
                    name: '系统名称',
                    status: 'done',
                },
            ]
        };
    },
    computed: {},
    watch: {},
    methods: {
        //文件上传回调
        uploadFile(item) {
            let status = item.file.status;//uploading done error removed
            if (status === 'done')
                this.fileList.push({
                    uid: item.file.uid,
                    name: item.file.name,
                    status: item.file.status
                });
            else if (status === 'error') {
                this.$message.error("服务器错误");
            } else if (status === 'removed') {
                this.delFile(item.file)
            }
        },
        delFile(file) {
            console.log('删除文件', file)
        }
    },
    created() {

    },
    mounted() {

    },
}
</script>
<style lang='scss' >
.upload-main {
    width: 100%;
    height: 100%;
    .upload-list-inline {
        display: inline-block;
        width: 100%;
        .ant-upload-list {
            position: absolute;
            top: 135px;
            left: 0;
            bottom: 0;
            width: 100%;
            padding: 0 10px;
            box-sizing: border-box;
            overflow: auto;
        }
        .ant-upload {
            display: table;
            height: 100%;
            width: 100%;
        }
    }
}
</style>