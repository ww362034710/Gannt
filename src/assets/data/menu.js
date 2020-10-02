const menu = [
    {
        title: "模型管理",
        iconCls: "build",
        theme: 'filled',
        children: [{
            title: "模型列表",
            pathName: "modelListIndex"
        },{
            title: "资源库",
            pathName: "resourceIndex"
        },{
            title: "事件库",
            pathName: "eventIndex"
        }]
    },
    {
        title: "场景管理",
        iconCls: "build",
        theme: 'filled',
        children: [{
            title: "场景列表",
            pathName: "planListIndex"
        }]
    },
    {
        title: "-------------",
        theme: 'filled',
    },{
    title: "需求管理",
    iconCls: "codepen-circle",
    children: [ {
        title: "事件库",
        iconCls: "codepen-circle",
        children: [{
            title: "事件管理",
            pathName: "eventTemplateManageIndex",
        }, {
            title: "事件采集",
            pathName: "eventTemplateGatherIndex",
        }, {
            title: "事件接收",
            pathName: "eventTemplateReceiveIndex",
        },
            {
                title: "事件分解",
                pathName: "eventTemplateDecomposeIndex",
            },
            // {
            //     title: "事件对可用物功能的需求",
            //     pathName: "eventStuffFeatureDemandIndex",
            // }
        ]
    }, {
        title: "资源库",
        iconCls: "codepen-circle",
        children: [{
            title: "资源管理",
            pathName: "resourceIndex",
        }, {
            title: "资源模型管理",
            pathName: "resourceModelIndex",
        }]
    }, {
        title: "物资库",
        iconCls: "codepen-circle",
        children: [{
            title: "物资管理",
            pathName: "goodsIndex",
        }, {
            title: "物资模型管理",
            pathName: "goodsModelIndex",
        }]
    },{
        title: "约束库",
        disabled: true
    }, {
        title: "规则库",
        disabled: true
    }, {
        title: "状态库",
        disabled: true
    }, {
        title: "资源功能管理",
        pathName: "featureIndex"
    }]
}, {
    title: "目标管理",
    iconCls: "fullscreen-exit",
    children: [{
        title: "目标管理",
        pathName: "goalManageIndex"
    }, {
        title: "目标采集",
        pathName: "goalGatherIndex"
    }, {
        title: "目标接收",
        pathName: "goalReceiveIndex"
    }, {
        title: "目标分解模板",
        pathName: "goalTemplateIndex"
    },
    {
        title: "规划事件管理",
        pathName: "eventIndex"
    }
    ]
},
    {
        title: "场景规划管理",
        iconCls: "build",
        theme: 'filled',
        children: [{
            title: "场景管理",
            pathName: "sceneIndex"
        }, {
            title: "场景规划",
            pathName: "scenePlan"
        }]
    },
    {
        title: "规划计划",
        iconCls: "build",
        theme: 'filled',
        children: [{
            title: "规划计划管理",
            pathName: "sPlanIndex"
        },{
            title: "目标需求管理",
            pathName: "dGoalIndex"
        },{
            title: "目标需求拆解",
            pathName: "dGoalDecomposeIndex"
        }]
    },
{
    title: "以下为旧版(待清理)",
    iconCls: "fire",
    children: [{
        title: "需求采集",
        iconCls: "codepen-circle",
        children: [{
            title: "资源模型库",
            pathName: "resourceModelIndex"
        }, {
            title: "资源库",
            pathName: "resourceIndex"
        }, {
            title: "物资模型库",
            pathName: "goodsModelIndex"
        }, {
            title: "物资库",
            pathName: "goodsIndex"
        }, {
            title: "功能库",
            pathName: "featureIndex"
        }]
    }, {
        title: "综合管理",
        iconCls: "codepen-circle",
        children: [{
            title: "目标管理",
            pathName: 'goalIndex'
        },
        {
            title: "目标模板",
            pathName: 'goalTemplateIndex'
        },
        //{
        //     title: "任务管理",
        //     pathName: 'demandManagementIndex'
        // },
        {
            title: "场景规划",
            pathName: 'sceneIndex'
        },
        {
            title: "事件管理",
            pathName: 'eventIndex'
        },
        // {
        //     title: "事件模型管理",
        //     pathName: 'eventModelIndex'
        //   },
        {
            title: "资源管理",
            pathName: 'resourceIndex'
        }, {
            title: "约束管理",
            pathName: 'constraintIndex'
        }
        ]
    }, {
        title: "系统管理",
        iconCls: "codepen-circle",
        children: [{
            title: "用户管理",
            pathName: 'sysuserIndex'
        }, {
            title: "角色管理",
            pathName: 'sysuserRole'
        }, {
            title: "菜单管理",
            pathName: 'sysMenuIndex'
        }, {
            title: "部门管理",
            pathName: 'sysDeptIndex'
        }, {
            title: "字典管理",
            pathName: 'sysDictDataIndex'
        }]
    }, {
        title: "演示",
        iconCls: "codepen-circle",
        children: [{
            title: "增删改查",
            pathName: 'demoIndex'
        }, {
            title: "新增表格",
            pathName: 'demoAddRow'
        }, {
            title: "事件管理",
            pathName: 'demoEventManage'
        }, {
            title: "目标分解",
            pathName: 'demoTarget'
        }, {
            title: "事件分解",
            pathName: 'demoEvent'
        }, {
            title: "饼状图",
            pathName: 'demoMpie'
        }, {
            title: "scheduler",
            pathName: 'demoScheduler'
        }, {
            title: "资源冲突",
            pathName: 'demoResourceHistogram'
        }, {
            title: "甘特图",
            pathName: 'demoBrynGantt'
        }, {
            title: "甘特图冲突",
            pathName: 'demoGanttForHistogram'
        }]
    }]
},
];

// 创建菜单唯一id
addMenu(menu)

function addMenu(menu, index = 0) {
    menu.forEach((item, idx) => {
        item.id = index === 0 ? idx + 1 + '' : index + '.' + (idx + 1)
        if (item.children && item.children.length > 0) {
            addMenu(item.children, item.id)
        }
    })
}


export default menu