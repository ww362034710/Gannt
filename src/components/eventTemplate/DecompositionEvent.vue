<!--分解事件页面-->
<template>
    <div class="main">
        <div ref="myDiagramDiv" class="gojs"></div>
        <div v-if="editMode == 'edit'" class="save-main" @click="handlerData()">保存</div>
        <!-- 选择模板数据 -->
        <a-modal title="模板数据" :width="650" :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="visible=false">
            <m-table ref="template" :scroll="scroll" tsize="small" url="/bs/resolveSchemeTemplate/list" rowSelection :columns="columns" :params="{rootType: this.templateNodeType}" />
        </a-modal>
    </div>
</template>

<script>
import go, { Binding } from 'gojs'
import MTable from "../common/MTable";
export default {
    components: { MTable },
    props: {
        schemeType:String,
        target: Boolean,
        editMode:String//类型: true: 目标 false:事件
    },
    data() {
        return {
            templateNode: {},       // 点击了哪个节点的模板按钮  注意 这是个 gojs 对象  需要用它的.part.data 来获取节点数据
            templateNodeType: null,   // 点击了哪个节点的模板按钮 的类型  只读  由templateNode而来
            columns: [
                {
                    title: "名称",
                    dataIndex: "name",
                },
                {
                    title: "编码",
                    dataIndex: "code",
                    width: "20%"
                }, {
                    title: "优先级",
                    dataIndex: "priority",
                    width: "20%"
                }, {
                    title: "所属系统",
                    dataIndex: "ownerSystem",
                    width: "20%"
                },
            ],
            visible: false,
            confirmLoading: false,

            gojs: go.GraphObject.make,
            horizontal: false,
            isReadOnly: false,//只读
            selectKey: "",//当前选中的节点key
            images: require('@/assets/images/u830.svg'),
            myDiagram: null,
            nodeData: [],
            nodeType: {
                goal: {
                    name: '新目标',
                    color: "#ffffff",
                    border: "#000000",
                    tcolor: "#000000",
                    data: {
                        node: {
                            id: null,
                            nodeType: 'goal',
                            nodeId: null,   // 数据库中的id
                        },
                        entity: {
                            id: null,
                            name: "新目标",
                            code: "",
                            ownerSystem: ""
                        }
                    },
                },
                event: {
                    name: '新事件',
                    color: "#f59a23",
                    border: "transparent",
                    tcolor: "#ffffff",
                    category: "Event",
                    data: {
                        node: {
                            id: null,
                            nodeType: 'event',
                            nodeId: null,   // 数据库中的id
                        },
                        entity: {
                            id: null,
                            name: "新事件",
                            code: "",
                            ownerSystem: ""
                        },
                        featureList: [],
                        tplLogicList: [],
                        tplTimeList: []
                    },
                },
            }
        };
    },
    computed: {
        //表格高度
        scroll() {
            return {
                y: Math.ceil(document.documentElement.clientHeight * 0.6) - 100
            }
        }
    },
    watch: {
        // //监听选择节点变化
        // selectKey: {
        //     handler(newValue, oldValue) {
        //         console.log(' 当前选中节点的数据', this.myDiagram.model.findNodeDataForKey(this.selectKey));
        //         this.setFormData()
        //     },
        //     deep: true
        // },
        templateNode(v) {
            console.log('Watch: DecopositionEvent templateNode:', v);
            if (v) {
                this.templateNodeType = v.part.data.data.node.nodeType;
            }
        }
    },
    methods: {

        //保存模块信息
        handlerData() {
            this.$emit("handlerData")
        },
        //点击节点获取节点属性值
        setFormData() {
            //   console.log("查找" + this.selectKey)
            //通过key查找 节点数据
            let thisemp = this.myDiagram.model.findNodeDataForKey(this.selectKey);
            this.$emit('click', thisemp)
        },
        /**
         * 更改节点属性
         * @param {*} data 当前属性值
         * @param {*} type 节点属性
        */
        saveNodeData(data, type) {
            if (this.selectKey == "") {
                return
            }

            let thisemp = this.myDiagram.model.findNodeDataForKey(this.selectKey);
            this.myDiagram.startTransaction("vacate");

            //修改节点名称
            // this.myDiagram.model.setDataProperty(thisemp, "name", data.name);
            // this.myDiagram.model.setDataProperty(thisemp, "parentName", data.id);

            this.myDiagram.model.setDataProperty(thisemp, type, data);

            //修改其他属性
            // let data = [
            //     { name: "阶段目标", type: "1", info: this.form.fields1, color: "#F7B84B", figure: "Ellipse" }]
            // this.myDiagram.model.setDataProperty(thisemp, "data", fields);

            this.myDiagram.commitTransaction("vacate");
        },
        //获取当前选中数据
        getSelectNodeData() {
            return this.myDiagram.model.findNodeDataForKey(this.selectKey);
        },
        //初始化流程图
        init() {
            this.myDiagram = this.gojs(go.Diagram, this.$refs.myDiagramDiv,
                {
                    layout: this.gojs('TreeLayout',  // BandedTreeLayout  DoubleTreeLayout
                        {
                            angle: 0,
                            arrangement: this.horizontal ? go.TreeLayout.ArrangementVertical : go.TreeLayout.ArrangementHorizontal,

                        }),
                    //  isReadOnly: true, // 只读
                    "undoManager.isEnabled": false,
                    initialContentAlignment: go.Spot.Center,
                    initialAutoScale: go.Diagram.Uniform,
                    "commandHandler.deletesTree": true,
                    "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom, //有鼠标滚轮事件放大和缩小
                    click: (a, b) => {
                        //点击画布 选择节点重置
                        this.selectKey = ""
                        this.setFormData()
                    },
                });

            this.myDiagram.nodeTemplate = this.getComTemplate({ type: 'goal' });
            //设置事件节点样式
            this.myDiagram.nodeTemplateMap.add('Event', this.getComTemplate({ type: "event" }))

            ////////////////////////////
            this.myDiagram.linkTemplate =
                this.gojs(go.Link,//MultiArrowLink
                    {
                        toShortLength: 3,
                        // relinkableFrom: true,
                        // relinkableTo: true,
                        // reshapable: true,
                        // resegmentable: true
                    },
                    go.Link.Bezier,//连线样式 go.Link.Bezier  Orthogonal

                    //连接线颜色设置
                    this.gojs(go.Shape, { strokeWidth: 1, stroke: "#9e9e9e" }),
                    // 箭头样式设置
                    this.gojs(go.Shape, { toArrow: "Standard", scale: 0.8, strokeWidth: 0, },
                    ),//  new go.Binding("fill", "color")
                );


            //右键事件
            //  this.addContextMenu()


            // this.myDiagram.model = this.gojs(go.GraphLinksModel,
            //     {
            //         copiesArrays: true,
            //         copiesArrayObjects: true,
            //         nodeDataArray: this.nodeData.nodearray,
            //         linkDataArray: this.nodeData.linkDataArray
            //     });

            //自适应大小
            //this.myDiagram.commandHandler.zoomToFit();
            //设置某一个节点位于屏幕中心
            //   this.myDiagram.commandHandler.scrollToPart(this.myDiagram.findNodeForKey());
            //监听连线生成事件
            // this.myDiagram.addDiagramListener("LinkDrawn", function (e) {
            //     console.log(e.subject.data.to);
            // })
        },
        //初始化流程图
        initGojs(data) {
            console.log('[DecompositionEvent]树组件加载的数据####', data);
            this.nodeData = this.setTreeDataToArr(data, "", '')
            console.log('nodeData的数据', this.nodeData);
            this.myDiagram.model = new go.TreeModel(this.nodeData);
        },
        //将当前选中的至于中间位置
        zoomFit() {
            this.myDiagram.commandHandler.zoomToFit();
            this.myDiagram.commandHandler.scrollToPart(this.myDiagram.findNodeForKey(this.selectKey));
        },
        //获取模板
        getComTemplate({ type }) {
            return this.gojs(go.Node, go.Panel.Auto,
                {

                    selectionAdorned: false,//选中不显示外边框
                    textEditable: false,
                    fromLinkable: false,
                    toLinkable: false,
                    contextMenu: this.addContextMenu()//添加右键事件
                },
                //自定义节点背景颜色
                this.gojs(go.Panel, "Auto", {
                    padding: new go.Margin(0, 20, 0, 0),
                    margin: new go.Margin(0, 0, 0, 0),//-15
                    fromLinkable: true,
                    toLinkable: true,
                    click: (a, b) => {
                        //保存当前选择的节点
                        this.selectKey = b.part.data.key
                        this.setFormData()
                    },

                },
                    this.gojs(go.Shape,
                        {
                            isPanelMain: true,
                            margin: 0,
                            //  stroke: 'transparent',//边框颜色
                            strokeWidth: 1,
                            minSize: new go.Size(120, 50),
                            //    fill: "#f59a23"
                        },
                        new go.Binding("key", "key"),
                        new go.Binding("stroke", "isSelected", (s, a) => {//设置选中边框颜色
                            return s ? "#05f33a" : this.nodeData.find(v => v.key === a.key).border
                        }).ofObject(),
                        new go.Binding("fill", "color")
                    ),//背景色

                    this.gojs(go.TextBlock, {
                        margin: 5,
                        height: 50,
                        width: 120,
                        textAlign: "center",
                        wrap: go.TextBlock.WrapBreakAll,// TextBlock.WrapDesiredSize, TextBlock.
                        verticalAlignment: go.Spot.Center,//文字垂直居中
                        overflow: go.TextBlock.OverflowEllipsis,
                        editable: true,
                    },//样式大小
                        new go.Binding("text", "name"),//显示文字  text 为key
                        new go.Binding("stroke", "tcolor")//自定义字体颜色
                    )
                ),
                ///添加子级
                this.getAddTemplate({ type: 'goal', nodeType: type }),
                //添加 目标
                this.getAddTemplate({ type: 'event', nodeType: type }),
                //模板按钮
                this.templateTemplate(type)
            )
        },
        /**
         * 获取添加子级panel
         * @param {*} type 添加子级类型
        */
        getAddTemplate({ type, nodeType }) {
            //不同模块 根据target(目标)  如果是事件 target:false  不显示目标按钮（黑色）
            /**
             * 事件 并且是事件按钮
            */
            if ((type === 'goal' && !this.target) || (type === 'goal' && nodeType === 'event' && this.target)) {
                return ""
            }
            //事件添加按钮为黄色 白字； 目标为黑色
            let color = (type === 'event') ? ['#f59a23', '#ffffff'] : ['#ffffff', '#000000'];
            let alignment = (type === 'event' && this.target && nodeType === 'goal') ? go.Spot.RightCenter : go.Spot.TopRight;
            return this.gojs(go.Panel, "Auto",
                {
                    alignment: alignment, portId: "froms", fromLinkable: true, cursor: "pointer", click: (a, b) => {
                        //点击添加一个子级目标
                        this.addNodeAndLink(a, b, type)
                    }
                },
                this.gojs(go.Shape, "Circle",
                    { width: 15, height: 15, margin: new go.Margin(0, 2, 0, 0), fill: color[0], stroke: color[1], strokeWidth: 1 }),
                this.gojs(go.Shape, "PlusLine",
                    { width: 8, height: 8, fill: null, stroke: color[1], strokeWidth: 3 })
            )
        },
        //设置事件模板添加按钮
        templateTemplate(type) {
            return this.gojs(go.Panel, "Auto",
                {
                    //含有事件节点并且 当前节点不是事件节点 节点模板添加按钮位于底部
                    alignment: (this.target && type !== 'event') ? go.Spot.BottomRight : go.Spot.RightCenter, portId: "from", fromLinkable: true, cursor: "pointer", click: (a, b) => {
                        // 点击添加模板按钮时运行该方法
                        this.templateNode = b;
                        this.visible = true
                    }
                },
                this.gojs(go.Picture, {
                    source: this.images,
                    background: null,
                    width: 15,
                    height: 15,
                    margin: new go.Margin(10, 2, 0, 0)
                })
            )
        },
        //添加一个子节点
        addNodeAndLink(e, obj, type) {
            //先添加泳道
            let fromNode = obj.part;
            let fromData = fromNode.data;
            let diagram = fromNode.diagram;
            // diagram.startTransaction("Add State");
            // get the node data for which the user clicked the button

            // create a new "State" data object, positioned off to the right of the fromNode
            let p = fromNode.location.copy();
            p.x += diagram.toolManager.draggingTool.gridSnapCellSize.width;
            let toData = null
            let model = diagram.model;
            //添加倒数第二个节点  进行节点连线至最后节点
            toData = Object.assign({
                key: (Math.random() * (36 - 1) + 1).toString(32).substr(3, 6),
                parent: fromData.key,
                parentName: fromData.name,//上级名称
                name: "一个名字"
                // loc: go.Point.stringify(p),
            }, JSON.parse(JSON.stringify(this.nodeType[type])));
            console.log("@@@@@@@@@@@",this.nodeType[type]);

            // add the new node data to the model
            model.addNodeData(toData);
            //  添加连线
            //  this.setLinks(model, fromData, toData)
            // 选中新增的node
            let newnode = diagram.findNodeForData(toData);

            diagram.select(newnode);
            // console.log(toData)
            this.$nextTick(() => {
                this.selectKey = newnode.key
                this.setFormData()
            })
            //  将新节点吸附到有效位置
            newnode.location = diagram.toolManager.draggingTool.computeMove(newnode, p);
            // 考虑重叠部分
            this.shiftNodesToEmptySpaces();
            //新增动画
            //  diagram.commitTransaction("Add State");
            // })
        },
        /**
         * 添加模板数据
         * @param {*} templateData 模板数据
        */
        addMultiNode(templateData) {
            let fromNode = this.templateNode.part;
            let diagram = fromNode.diagram;
            let model = diagram.model;
            //  diagram.startTransaction("Add State");
            //根节点数据
            let fromData = fromNode.data;
            //获取节点数据
            let data = this.setTreeDataToArr(templateData, fromData.key, fromData.name)
            //显示弹窗选择模板
            this.visible = true;
            //添加数组集合
            model.addNodeDataCollection(data);

            //  diagram.commitTransaction("Add State");
        },
        //选择完数据模板
        handleOk() {
            //选择的模板数据
            let data = this.$refs.template.selectedRowDatas[0];
            //请求数据
            this.confirmLoading = true
            // 获取模板分解方案
            this.$http.postBody('/bs/resolveSchemeTemplate/getSchemeTreeData', { schemeTemplateId: data.id }).then(rst => {
                this.addMultiNode(rst.data.treeNodes);
                this.confirmLoading = false
                this.visible = false
            })
        },

        setLinks(model, fromData, toData) {
            let linkdata = {
                from: model.getKeyForNodeData(fromData),
                to: model.getKeyForNodeData(toData)
            };
            // 添加连线
            model.addLinkData(linkdata);
        },
        //添加右键事件
        addContextMenu() {
            //  this.myDiagram.nodeTemplate.contextMenu =
            return this.gojs("ContextMenu",
                // add one for Editing...
                this.gojs("ContextMenuButton",
                    this.gojs(go.TextBlock, " 删 除 ", {
                        margin: 5,
                        width: 60,
                        textAlign: "center",
                    }),
                    {
                        click: (e, obj) => {
                            e.diagram.commandHandler.deleteSelection();
                        }
                    },
                    new go.Binding("visible", "", function (o) { return o.diagram && o.diagram.commandHandler.canDeleteSelection(); }).ofObject())
            );

        },
        //新增节点重叠部分处理
        shiftNodesToEmptySpaces() {
            this.myDiagram.selection.each((node) => {
                if (!(node instanceof go.Node)) return;
                // look for Parts overlapping the node
                while (true) {
                    let exist = this.myDiagram.findObjectsIn(node.actualBounds,
                        // only consider Parts
                        function (obj) { return obj.part; },
                        // ignore Links and the dropped node itself
                        function (part) { return part instanceof go.Node && part !== node; },
                        // check for any overlap, not complete containment
                        true).first();
                    if (exist === null) break;
                    // try shifting down beyond the existing node to see if there's empty space
                    node.position = new go.Point(node.actualBounds.x, exist.actualBounds.bottom + 10);
                }
            });
        },
        //获取数据
        getData() {
            let data = JSON.parse(this.myDiagram.model.toJson())

            return this.setArrToTreeData(data.nodeDataArray)
        },
        /**
      * 将后台返回的节点数据转为一维数组 同时 添加 parent
      * @param {*} data
      * @param {*} parent 上级节点key
      * @param {*} parentName 上级节点名称
     */
        setTreeDataToArr(data, parent, parentName) {
            let newData = []
            for (let i = 0, l = data.length; i < l; i++) {
                //设置连接线
                data[i].parent = parent// data[i].parentId
                data[i].parentName = parentName
                //添加节点默认属性
                data[i] = Object.assign({}, this.nodeType[data[i].data.node.nodeType], data[i])
                if (!Object.prototype.hasOwnProperty.call(data[i], 'children')) {
                    newData = [...newData, data[i]]
                } else {
                    let _data = JSON.parse(JSON.stringify(data[i]))
                    delete _data.children
                    newData = [...newData, _data, ...this.setTreeDataToArr(data[i].children, data[i].key, data[i].name)]
                }
            }
            return newData
        },
        //将流程图数据转换为树形结构
        setArrToTreeData(data) {
            let result = [];
            // 将主键与对象形成映射关系
            let map = {};
            data.forEach((it) => {
                //删除没用属性
                delete it.border
                delete it.color
                delete it.tcolor
                map[it.key] = it;
            });
            data.forEach((it) => {
                let parentKey = it.parent;
                if (map.hasOwnProperty(parentKey)) {
                    // 将各节点 加入到自己的父节点的children中
                    if (!map[parentKey].children) map[parentKey].children = [];
                    map[parentKey].children.push(it);
                } else {
                    // 作为主节点  因为没找到他的上级
                    result.push(it);
                }
            });
            return result;
        }

    },
    created() {

    },
    beforeCreate() {

    },
    mounted() {
        this.init();

    },

}
</script>
<style  scoped lang="scss">
.main {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 16px;
    box-sizing: border-box;
    user-select: none;
    .gojs {
        width: 100%;
        height: 100%;
    }
    .save-main {
        position: absolute;
        bottom: 20px;
        right: 20px;
        z-index: 10;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #1890ff;
        color: #ffffff;
        font-size: 13px;
        line-height: 40px;
        text-align: center;
        box-shadow: 1px 1px 5px #2a2929;
        cursor: pointer;
        transition: all 0.2s;
        &:hover {
            transform: scale(1.1);
        }
    }
}
</style>
