<template>
    <div>
        <a-transfer
                :data-source="dataSource"
                :target-keys="targetKeys"
                :show-search="showSearch"
                :filter-option="searchFilter"
                :show-select-all="false"
                @change="onChange"
        >
            <template
                    slot="children"
                    slot-scope="{
                      props: { direction, filteredItems, selectedKeys, disabled: listDisabled },
                      on: { itemSelectAll, itemSelect },
                    }"
            >
                <a-table
                        :row-selection="
                            getRowSelection({ disabled: listDisabled, selectedKeys, itemSelectAll, itemSelect })
                          "
                        :columns="direction === 'left' ? leftColumns : rightColumns"
                        :data-source="filteredItems"
                        size="small"
                        :style="{ pointerEvents: listDisabled ? 'none' : null }"
                        :custom-row="
                            ({ key, disabled: itemDisabled }) => ({
                              on: {
                                click: () => {
                                  if (itemDisabled || listDisabled) return;
                                  itemSelect(key, !selectedKeys.includes(key));
                                },
                              },
                            })
                          "
                >
                    <div slot="action" slot-scope="scope" class="main-table-btns">
                        <a-button type="primary" size="small" icon="edit" @click="detail(scope)">查看</a-button>
                    </div>
                </a-table>
            </template>
        </a-transfer>
    </div>
</template>
<script>
    import difference from 'lodash/difference';

    const leftTableColumns = [
        {
            dataIndex: 'name',
            title: '事件名称',
        },
        {
            dataIndex: 'action',
            title: '操作',
            scopedSlots: {
                customRender: 'action'
            }
        },
    ];
    const rightTableColumns = [
        {
            dataIndex: 'name',
            title: '事件名称',
        },
    ];

    export default {
        data() {
            return {
                dataSource: [
                    // {key: '1', id: '1', name: '第一个事件', title: '第一个事件'},
                    // {key: '2', id: '2', name: '第2个事件', title: '第2个事件'},
                    // {key: '3', id: '3', name: '第3个事件', title: '第3个事件'},
                    // {key: '4', id: '4', name: '第4个事件', title: '第4个事件'}
                ],
                targetKeys: [],
                showSearch: true,
                leftColumns: leftTableColumns,
                rightColumns: rightTableColumns,
            };
        },
        methods: {
            searchFilter(inputValue, item) {
                return item.name.indexOf(inputValue) !== -1
            },
            onChange(nextTargetKeys) {
                this.targetKeys = nextTargetKeys;
            },
            getRowSelection({disabled, selectedKeys, itemSelectAll, itemSelect}) {
                return {
                    getCheckboxProps: item => ({props: {disabled: disabled || item.disabled}}),
                    onSelectAll(selected, selectedRows) {
                        const treeSelectedKeys = selectedRows
                            .filter(item => !item.disabled)
                            .map(({key}) => key);
                        const diffKeys = selected
                            ? difference(treeSelectedKeys, selectedKeys)
                            : difference(selectedKeys, treeSelectedKeys);
                        itemSelectAll(diffKeys, selected);
                    },
                    onSelect({key}, selected) {
                        itemSelect(key, selected);
                    },
                    selectedRowKeys: selectedKeys,
                };
            },
            detail() {
                alert("TODO");
            },
            getSelectedEvent() {
                return this.dataSource.filter(record => { return this.targetKeys.includes(record.key) }, this)
            },
            getTransferData() {
                this.$http.postBody("/bs/event/transferPage", {})
                .then(rst => {
                    this.dataSource = rst.data.rows;
                    //this.pagination.total = rst.data.total;
                })
            }
        },
        created() {
            this.getTransferData()
        }
    };
</script>
