/**
 * 枚举基类
 */
class Enum extends Array {

    /**
     * 从数组中创建出枚举对象
     * eg.
     *      let Role = Enum.createFrom({
     *              STUDENT: {text: '学生', value: 'student'},
     *              TEACHER: {text: '老师', value: 'teacher'}
     *      })
     * 创建出来的对象:
     *  [
     *      {text: "学生", value: "student", label: "学生"},
     *      {text: "老师", value: "teacher", label: "老师"}
 *      ]
     *  并且该对象具有  .STUDENT 和 .TEACHER 属性  譬如  Role.STUDENT.value
     * 创建出来的枚举可以放到 a-select 中的option属性中使用
     *      譬如:  <a-option :options="Role" />
     * @param enumData
     */
    static createFrom(enumData) {
        let result = new Enum();
        if (enumData) {
            for (let key in enumData) {
                let value = enumData[key];
                // 设置其text 与 label 相等
                if (value.text && !value.hasOwnProperty("label")) {
                    value.label = value.text;
                } else  if (value.label && !value.hasOwnProperty("text")) {
                    value.text = value.label;
                }
                result.push(value);
                result[key] = value;
            }
        }
        return result;
    }

    /**
     * 通过value获取到他的显示文本  一般用于将数据库存储的"draft"等值  转变为可读的  "编写中"
     * 比如 Role.getText("student")  返回 "学生"
     * @param value
     * @param str
     * @returns {string}
     */
    getText(value, str) {
        str = arguments[1] ? arguments[1] : 'text';
        let text = "";
        for (const i in this) {
            let map = this[i];
            if (value === map.value) {
                text = map[str]
            }
        }
        return text;
    }
}

export default {
    install(Vue) {
        // 提示  这里主要是在初期开发阶段使用  后期应该从后台获取

        // 场景类型 枚举
        Vue.prototype.SceneType = Enum.createFrom({
            MEDIUM : {value: 'medium', label: "中期规划"},
            FLIGHT : {value: 'flight', label: "飞行任务"},
            MONTH : {value: 'month', label: "月事件"}
        });
        // 需求(事件/目标/资源等)状态 枚举
        Vue.prototype.DemandState = Enum.createFrom({
            DRAFT : {value: "draft", text: "编写中", adminText: "编写中"},
            APPROVING : {value: "approving", text: "审批中", adminText: "待审批"},
            REJECTED : {value: "rejected", text: "被驳回", adminText: "已驳回"},
            APPROVED : {value: "approved", text: "已入库", adminText: "已入库"}
        });
        Vue.prototype.DemandState.getStateHTML = function (value) {
            return '<span class="event-status event-status-' + value + '">' + Vue.prototype.DemandState.getText(value) + '</span>';
        };
        // 场景状态 枚举
        Vue.prototype.SceneState = Enum.createFrom({
            DRAFT: {value: "draft", text: "编写中", adminText: "编写中"},
            APPROVING: {value: "approving", text: "审批中", adminText: "待审批"},
            REJECTED: {value: "rejected", text: "被驳回", adminText: "已驳回"},
            PLANNING: {value: "planning", text: "规划中", adminText: "规划中"},
            PLANED: {value: "planed", text: "规划完成", adminText: "规划完成"}
        });
        Vue.prototype.SceneState.getStateHTML = function (value) {
            return '<span class="scene-status scene-status-' + value + '">' + Vue.prototype.SceneState.getText(value) + '</span>';
        };
        // 所属系统 枚举 // todo 应该从后台获取
        Vue.prototype.OwnerSystem = Enum.createFrom({
            RCC : {value: "运行控制中心", text: "运行控制中心"},
            ASTC : {value: "AST支持中心", text: "AST支持中心"},
            HTQC : {value: "在轨HTQ支持中心", text: "在轨HTQ支持中心"},
            LC : {value: "有效载荷运营管理中心", text: "有效载荷运营管理中心"},
            TSJC : {value: "TSJSSY管理中心", text: "TSJSSY管理中心"},
            PIC : {value: "工程信息中心", text: "工程信息中心"}
        });
        // 规划等级 枚举
        Vue.prototype.PlanGrade = Enum.createFrom({
            MEDIUM : {value: "中期规划", text: "中期规划"},
            FLIGHT : {value: "飞行任务", text: "飞行任务"},
            MONTH : {value: "月事件", text: "月事件"}
        });
        // 重要等级 枚举
        Vue.prototype.ImportantGrade = Enum.createFrom({
            LEVEL1 : {value: 1, text: "一级"},
            LEVEL2 : {value: 2, text: "二级"},
            LEVEL3 : {value: 3, text: "三级"},
            LEVEL4 : {value: 4, text: "四级"}
        });
        // 单位 // todo 应该从后台获取
        Vue.prototype.Unit = Enum.createFrom({
            LITRE : {value: "litre", text: "升"},
            KILOGRAM : {value: "kilogram", text: "千克"},
            STERE : {value: "stere", text: "立方米"},
            KWH : {value: "KWH", text: "Kw·h"},
            METRE : {value: "metre", text: "米"}
        });
        // 连续类型
        Vue.prototype.ContinuityType = Enum.createFrom({
            CONTINUOUS : {value: "continuous", text: "连续"},
            SCATTER : {value: "scatter", text: "离散"}
        });
        // 资源可复用类型
        Vue.prototype.RecoverableType = Enum.createFrom({
            REUSABLE : {value: "reusable", text: "可重复资源"},
            UNREUSABLE : {value: "unReusable", text: "消耗资源"}
        });
        // 优先级
        Vue.prototype.PriorityLevel = Enum.createFrom({
            FIRST : {value: 1, text: "一级事件"},
            SECOND : {value:2, text: "二级事件"},
            THIRD : {value: 3, text: "三级事件"},
            FOURTH : {value: 4, text: "四级事件"}
        });
        // 层级
        Vue.prototype.Tier = Enum.createFrom({
            FIRST : {value: 1, text: "一层"},
            SECOND : {value:2, text: "二层"},
            THIRD : {value: 3, text: "三层"},
            FOURTH : {value: 4, text: "四层"}
        });
        // 任务目标
        Vue.prototype.taskCabinData = Enum.createFrom({
            TASK1:{value: "核心舱任务", text: "核心舱任务"},
            TASK2:{value: "天舟二号任务", text: "天舟二号任务"}
        });
        // 实验类别
        Vue.prototype.testKindData = Enum.createFrom({
            TEST1: { value: "飞行", text: "飞行" },
            TEST2: { value: "对接", text: "对接" },
            TEST3: { value: "交互", text: "交互" }
        });
        // 提出机构
        Vue.prototype.submittingAgencyData = Enum.createFrom({
            AGENCY1:{ value: "A单位", text: "A单位" },
            AGENCY2:{ value: "B单位", text: "B单位" },
            AGENCY3:{ value: "C单位", text: "C单位" },
            AGNECY4:{ value: "D单位", text: "D单位" }
        });
        // 运行阶段
        Vue.prototype.runPhaseData = Enum.createFrom({
            RUNPhASE1:  {value: "XX组合体运行阶段", text: "XX组合体运行阶段"},
            RUNPhASE2:  {value: "YY组合体运行阶段", text: "YY组合体运行阶段"}
        });
        // 责任单位
        Vue.prototype.responseOrgsData = Enum.createFrom({
            RESPONSIBLEUNIT1:{value: "A单位", text: "A单位"},
            RESPONSIBLEUNIT2:{value: "B单位", text: "B单位"},
            RESPONSIBLEUNIT3:{value: "C单位", text: "C单位"},
            RESPONSIBLEUNIT4:{value: "D单位", text: "D单位"}
        });
        // 时序约束
        Vue.prototype.TimingData = Enum.createFrom({
            "EbltSa" : {text: "Eb<Sa", value: "EbltSa" },
            "Eb=Sa"  : {text: "Eb=Sa", value: "Eb=Sa"  },
            "SbgtEa" : {text: "Sb>Ea", value: "SbgtEa" },
            "Sb=Ea" :  {text: "Sb=Ea", value: "Sb=Ea"  },
            "EbgtSa∩SbltSa" : {text: "Eb>Sa∩Sb<Sa", value: "EbgtSa∩SbltSa"},
            "SbltSa∩Eb=Ea" : {text: "Sb<Sa∩Eb=Ea", value: "SbltSa∩Eb=Ea"},
            "EbgtEa∩SbltSa" : { text: "Eb>Ea∩Sb<Sa", value: "EbgtEa∩SbltSa"},
            "Sb=Sa∩Eb<Ea" : {text: "Sb=Sa∩Eb<Ea", value: "Sb=Sa∩EbltEa"},
            "Sb=Sa∩Eb=Ea" : {text: "Sb=Sa∩Eb=Ea", value: "Sb=Sa∩Eb=Ea"},
            "Sb=Sa∩Eb>Ea" : {text: "Sb=Sa∩Eb>Ea", value: "Sb=Sa∩EbgtEa"},
            "Sb>Sa∩Eb<Ea" : {text: "Sb>Sa∩Eb<Ea", value: "SbgtSa∩EbltEa"},
            "Sb>Sa∩Eb=Ea" : {text: "Sb>Sa∩Eb=Ea", value: "SbgtSa∩Eb=Ea"},
            "Sb>Sa∩Eb>Ea" : {text: "Sb>Sa∩Eb>Ea", value: "SbgtSa∩EbgtEa"}
        });
        // 逻辑约束
        Vue.prototype.LogicData = Enum.createFrom({
            "与":{
                text: "与", value: "与"
            },
            "或":{
                text: "或", value: "或"
            },
            "异或":{
                text: "异或", value: "异或"
            },
            "互斥":{
                text: "互斥", value: "互斥"
            },
            "因果":{
                text: "因果", value: "因果"
            }
        });
        // 历史纪录操作类型 枚举
        Vue.prototype.ModifyStatus = Enum.createFrom({
            ADD : {value: 'add', text: "新增"},
            AUDIT : {value: 'audit', text: "审核"},
            EDIT : {value: 'edit', text: "编辑"},
            APPROVING : {value: 'approving', text: "提交审核"},
            APPROVED : {value: 'approved', text: "审核通过"},
            REJECTED : {value: 'rejected', text: "审核驳回"}
        });
    }
}
