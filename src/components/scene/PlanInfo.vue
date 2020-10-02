<template>
    <a-table :columns="columns" :data-source="data" :row-selection="rowSelection" />
</template>
<script>
    const columns = [
        { title: '规则', dataIndex: 'name', key: 'name' },
        { title: '描述', dataIndex: 'description', key: 'description' },
        { title: '相关对象', dataIndex: 'relation', key: 'relation' },
        { title: '分组', dataIndex: 'group', key: 'group' },
        { title: '时间', dataIndex: 'time', key: 'time' },
        { title: '类型', dataIndex: 'type', key: 'type' }
    ];

    const data = [
        {
            key: 1,
            name: '活动约束 (1/1)',
            children: [
                {
                    key: 4,
                    name: "机械臂状态",
                    description: "机械臂需要为展开状态!",
                    relation: "机械臂",
                    group: "对接",
                    time: "2020-06-02",
                    type: "资源"
                }
            ],
        },
        {
            key: 2,
            name: '规划规则 (3/3)',
            children: []
        },{
            key: 3,
            name: '临时 (2/2)',
            children: []
        }
    ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
        },
    };

    export default {
        data() {
            return {
                data,
                columns,
                rowSelection,
            };
        },
    };
</script>
