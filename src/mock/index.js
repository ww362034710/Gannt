import Mock from 'mockjs';
//格式： Mock.mock( url, post/get , 返回的数据)；
// 获取 mock.Random 对象
const Random = Mock.Random;
Random.extend({
    constellation: function() {
        var constellations = ['中期任务', '长期任务', '短期任务', ]
        return this.pick(constellations)
    }
});
Mock.mock('/table', 'get', () => {
    return Mock.mock({
        'tblData|1-60': [{
            "uuid": '@natural(1,3000)',
            "name": '@csentence(3,8)',
            "category": '@cparagraph()',
            "type": "@constellation()",
            "time": '@date()',
            "person": '@cname()',
            "section": "运营规划中心 ",
            "dec": "空间站运营规划，任务需求",
            "flie": "需求文档doc",
            "user": "Admin",
            "createTime": '@date()',
            "status": '@natural(1,3)',
            "cz": "0"
        }]
    })
})

Mock.mock('system/user/list', 'post', () => {
    return Mock.mock({
        'rows|1-60': [{
            "uuid": '@natural(1,3000)',
            "level": '@csentence(3,8)',
            "name": '@csentence(3,8)',
            "userName": "@constellation()",
            "name": "@constellation()",
            "dept": {
                "deptName": 'dd'
            },
            "system": '@cname()',
            "phonenumber": "13969633230",
            "user": "Admin",
            "createTime": '@date()',
            "status": '@natural(1,4)',
            "cz": "0",
            "loadType": "dsdfs",
            "type": "@csentence(3,8)",
            "model": "都是打算多"
        }],
        total: 10
    })
})


Mock.mock('/relatedData', 'post', () => {
    return Mock.mock({
        'data|60-100': [{
            "key": '@natural(1,1000000)',
            "title": '@csentence(3,50)',
            "name": "@csentence(3,8)",
            "createTime": '@date()',
            "day": '@natural(1,20)',
        }]
    })
})
Mock.mock('/bs/demandDoc/list', 'post', () => {
    return Mock.mock({
        'rows|1-60': [{
            "uuid": '@natural(1,3000)',
            "name": '@csentence(3,8)'
        }],
        total: 10
    })
})


Mock.mock('/comboBox', 'get', () => {
    return [{
            text: "文档一",
            value: 1
        },
        {
            text: "文档二",
            value: 2
        },
        {
            text: "文档三",
            value: 3
        }
    ]
})

Mock.mock('/getStatus', 'get', () => {
    return {
        status: 2,
        events: [{
                label: "所属系统",
                content: "AST支持中心",
                id: 1
            },
            {
                label: "优先级",
                content: "一级事件",
                id: 2
            }, {
                label: "所属系统",
                content: "AST支持中心",
                id: 3
            },
            {
                label: "优先级",
                content: "一级事件",
                id: 4
            }
        ]
    }
})

Mock.mock('/getVersion', 'get', () => {
    return [{
            text: "版本一",
            value: 1
        },
        {
            text: "版本2",
            value: 2
        },
        {
            text: "版本3",
            value: 3
        }
    ]
})
Mock.mock('/bs/demandDocFolder/tree', 'post', () => {
    return [{
            title: "1、设计文档集合",
            key: 1,
            value: '1',
            children: [{
                title: "文档子级",
                key: 1.1,
                value: '1.1'
            }]
        },
        {
            title: "2、需求文档集合",
            key: 2,
            value: '222'
        },
        {
            title: "3、测试大纲集合",
            key: 3,
            value: '3'
        }
    ]
})

Mock.mock('/add', 'post', () => {
    return {
        message: '保存成功!',
        code: 2
    }
})

Mock.mock('/del', 'post', () => {
    return {
        message: '删除成功!'
    }
})

Mock.mock('/upload', 'post', () => {
    return {
        message: '上传!'
    }
})


Mock.mock('/bs/demandDocFolder/show', 'post', () => {
    return {
        "msg": "操作成功",
        "code": 0,
        "data": {
            "searchValue": null,
            "createBy": null,
            "createTime": "2020-01-18 15:20:29",
            "updateBy": null,
            "updateTime": null,
            "remark": null,
            "params": {},
            "folderUid": "23a90fd8abac40e68c9abeb16c7c0ee6",
            "fatherFolderUid": null,
            "name": "1、需求文档合集",
            "comm": null,
            "isDeleted": 0,
            "deletePersonId": null,
            "deleteIp": null,
            "deleteTime": null
        }
    }
})

Mock.mock('/gantt', 'get', () => {
    return {
        code: 0,
        data: {
            resourcesData: [{
                "id": "r1",
                "name": "水",
                "role": "h2o",
                "scalePoints": [{ "value": 2, "text": "0t" }, { "value": 10, "text": "10t" }],
                "type": "h2o"
            }, {
                "id": "r2",
                "name": "氧气",
                "role": "o2",
                "scalePoints": [{ "value": 2, "text": "频道一" }, { "value": 10, "text": "频道二" }],
                "type": "o2"
            }, {
                "id": "r3",
                "name": "氢气",
                "role": "h2",
                "scalePoints": [{ "value": 2, "text": "0L" }, { "value": 12, "text": "10L" }, { "value": 24, "text": "20L" }],
                "type": "h2"
            }],
            eventsData: [{
                    "id": 1,
                    "startDate": "2020-04-27",
                    "duration": 4,
                    "name": "用水",
                    "percentDone": 50,
                    "iconCls": "b-fa b-fa-calendar"
                },
                {
                    "id": 2,
                    "startDate": "2020-04-28",
                    "endDate": "2020-04-30",
                    "name": "用氧气",
                    "percentDone": 50,
                    "iconCls": "b-fa b-fa-pen",
                    "eventColor": "indigo"
                },
                {
                    "id": 3,
                    "startDate": "2020-04-28",
                    "endDate": "2020-04-30",
                    "name": "用氢气",
                    "percentDone": 50,
                    "iconCls": "b-fa b-fa-pen",
                    "eventColor": "red"
                }
            ],
            assignmentsData: [{
                    "id": 1,
                    "resource": "r1",
                    "event": 1
                },
                {
                    "id": 2,
                    "resource": "r2",
                    "event": 1
                },
                {
                    "id": 3,
                    "resource": "r3",
                    "event": 2
                },
                {
                    "id": 4,
                    "resource": "r2",
                    "event": 2
                },
                {
                    "id": 5,
                    "resource": "r2",
                    "event": 3
                }

            ],
            dependenciesData: [
                //     {
                //     "id": 1,
                //     "fromEvent": 1,
                //     "toEvent": 2,
                //     "fromSide": "bottom"
                // }
            ]
        }
    }
})