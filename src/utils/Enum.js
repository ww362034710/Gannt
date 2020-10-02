//资源类型
export const resourceType = [
    {str: "能源", value: 1},
    {str: "工具", value: 2}
];

//功能类型
export const functionType = [
    {str: "平台保障", value: 1},
    {str: "生命保障", value: 2},
    {str: "综合", value: 3},
    {str: "测控", value: 4},
    {str: "空间应用", value: 5}
];
//装载类型
export const loadType = [
    {str: "罐装", value: 1},
    {str: "电池组", value: 2},
    {str: "机柜", value: 3},
    {str: "依附机柜", value: 4}
                        ];

//场景类型
export const sceneType = [
    {str: "中期场景", value: 'medium'},
    {str: "飞行任务场景", value: 'flight'},
    {str: "月事件场景", value: 'month'}
];

//场景状态
export const sceneStateType = [
    {str: "规划中", value: 1},
    {str: "审批中", value: 2},
    {str: "通过", value: 3},
    {str: "失败", value: 4}
];

//子需求状态
export const status = [
    {str: "新建", value: 1},
    {str: "已批准", value: 2},
    {str: "已分配", value: 3},
    {str: "已实现", value: 4},
    {str: "已测试通过", value: 5},
    {str: "已确认通过", value: 6},
    {str: "确认未通过", value: 7},
    {str: "不采纳", value: 8}
];

//子需求类型
export const itemType = [
    {str: "普通需求", value: 1},
    {str: "资源需求", value: 2},
    {str: "概要需求", value: 3},
    {str: "场景需求", value: 4}
];

//普通是否
export const is = [
    {str: "是", value: 1},
    {str: "否", value: 2}
];

//子需求难度
export const difficulty = [
    {str: "容易", value: 1},
    {str: "一般", value: 2},
    {str: "困难", value: 3}
];

//子需求稳定度
export const stability = [
    {str: "稳定", value: 1},
    {str: "易变", value: 2}
];

//子需求期望等级
export const expectedLevel = [
    {str: "必须提供", value: 1},
    {str: "应该提供", value: 2},
    {str: "可以提供", value: 3},
    {str: "不要提供", value: 4}
];

//次要，方便 getStr 方法获取 str的
const Enum = {
    resourceType: resourceType,
    functionType: functionType,
    loadType: loadType,
    sceneType: sceneType,
    sceneStateType: sceneStateType,
    status: status,
    itemType: itemType,
    is: is,
    difficulty: difficulty,
    stability: stability,
    expectedLevel: expectedLevel
};

//根据类型名和值获取对应的枚举名称
export function getStr(enumName, value) {
    let data = Enum[enumName];
    let text = "";
    if (data && value != undefined && value != null && value != ""){
        for (var i in data){
            let map = data[i];
            if (value == map.value){
                text = map.str
            }
        }
    }
    return text;
}

