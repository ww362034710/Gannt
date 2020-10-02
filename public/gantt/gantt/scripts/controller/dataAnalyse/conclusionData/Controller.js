// TODO 优化效率  或者使用缓存
// 控制前台原始数据的展示
var _CONFIG = {
    debug: true,                            // 调试模式
    clearCheckedBomNodeUnderOtherBom: false, //CHECK了BOM后其他BOM下的已选项清空
    autoRefresh : true,                         // 是否在变更了参数后自动刷新echart
    selectedChannelLimitInATestProject : 100,     // 参数tree 每个试验项目下最多选择多少个channel
    maxXPointCount : 500,                        // X轴最多显示多少个点
    maxXAxisCount : 2,                      // 最多多少条X轴
    maxYAxisCount : 1,                       // 最多多少条Y轴（如果是1不限制参数个数，全部画在一个y轴上，否则一个轴对应一个y轴）
    yAxisSplitNumber : 5                    // Y轴分段数量
};
// 兼容
var debug = _CONFIG.debug;

(function () {

    // var EVENTS = {
    //     BOMTREE_CHECKROW: 'bomTree.checkRow',
    //     BOMTREE_UNCHECKROW: 'bomTree.uncheckRow',
    //     BOMTREE_LOADSUCCESS: 'bomTree.loadSuccess',
    //     BOMTREE_CHECKTESTPROJECT: 'bomTree.checkTestProject',
    //
    //     BEFORE_TESTPROJECT_REMOVENODE: 'before.testProject.removeNode'
    // };
    // window.EVENTS = EVENTS;

    var Controller = function () {
        this.echartType = 'scatter';
        this.$datagrid = null;
        return this.init();
    };

    $.extend(Controller.prototype, {
        init: function( opts) {
            window.controller = this;
            window.manager = new Manager();                         // 数据管理
            window.echart = new Echart();                 // 视图控制
            window.viewControl = new ViewControl();                 // 视图控制
            window.configBucket = new ConfigBucket();               // echart选项状态

            window.bomTreeManager = new BomTreeManager();
            window.channelTreeManager = new ChannelTreeManager();
            window.productTreeManager = new ProductTreeManager();
            window.xAxisSelector = new XAxisSelector();
            window.yAxisSelector = new YAxisSelector();

            window.echartLineManager = new EchartLineManager();
            window.echartPieManager = new EchartPieManager();
            window.echartScatterManager = new EchartScatterManager();

            $("#echartparent").panel('resize');

            this.$datagrid = $("#calculateResultCon").datagrid({
                emptyMsg: '未设置',
                fit:true,
                fitColumns:true,
                columns: [[
                    {field:'name',title:'参数名称',width:100,align:'center',resizable:false,sortable:false},
                    {field:'max',title:'最大值',width:40,align:'center',resizable:false,sortable:false},
                    {field:'min',title:'最小值',width:40,align:'center',resizable:false,sortable:false},
                    {field:'avg',title:'平均值',width:40,align:'center',resizable:false,sortable:false},
                    {field:'theo',title:'理论值',width:100,resizable:false,align:'center',sortable:false}
                ]]
            });

            return this;
        },
        autoDraw: function() {
            if (_CONFIG.autoRefresh) {
                this.drawEchart();
            }
        },
        drawEchart : function () {
            var self = this,
                echartManager = manager.echartManager;

            var echartType = this.getEchartType();
            switch (echartType) {
                case 'pie':
                    echartManager = echartPieManager;
                    break;
                case 'line':
                    echartManager = echartLineManager;
                    break;
                case 'scatter':
                    echartManager = echartScatterManager;
                    break;
                default:
                    throw new Error('未知的Echart图表类型:' + echartType)
            }

            configBucket.refresh();
            manager.refresh();

            // 清空算法内容
            $("#calculateResultCon").html('');

            var preparedOption = echartManager.prepareOption();
            debug && console.log('preparedOption:', preparedOption);
            debug && console.log('preparedOption:', JSON.stringify(preparedOption));
            if (!preparedOption.success) {
                return this.showConfigWarning(preparedOption.msg);
            } else {
                this.hideConfigWarning();
            }

            var echartOption = preparedOption.obj;
            // 判断series是否有有效数据
            var series = echartOption.series,
                seriesHasEffectData = false;
            if (series && series.length>0) {
                $.each( series , function( i , seriesData ) {
                    if ( seriesData.data && seriesData.data.length>0 ) {
                        seriesHasEffectData = true;
                    }
                });
            }
            if ( !seriesHasEffectData ) {
                return this.showConfigWarning('该设置中没有找到有效的数据用于展示');
            }
            // 计算各series的最大值最小值等算法
            if (['scatter', 'line'].indexOf(this.echartType)!=-1) {
                var arithmeticToCal = [],        // 要使用的算法
                    arithmeticDoms = $("[name=arithmetic]:checked");
                var theoValue = manager.legendsTheoValue;
                $.each(arithmeticDoms, function( i , dom ) {
                    arithmeticToCal.push($(dom).val());
                });
                arithmeticToCal.push('theo');
                if (arithmeticToCal.length>0) {
                    // var htmlData = {};      // 准备的数据  {电压:{最大值:20, ...}, 电流:{最大值:0.1...}..}
                    var gridData = {};      // 准备的数据  {电压:{max:20, ...}, 电流:{max:0.1...}..}
                    $.each(arithmeticToCal, function (i, arithmetic) {
                        $.each(series, function ( seriesIndex, seriesData){
                            var dataEnumType = manager.getDataType( seriesData.data );
                            // 将scatter的series的数据扁平化
                            var theSeriesData = seriesData.data;
                            var thisData = [];  // 要计算的数据
                            var seriesName = seriesData.name,
                                arithmeticName='',
                                arithmeticValue='';
                            if (dataEnumType == 'number') {
                                if (self.echartType == "scatter" ) {
                                    $.each(theSeriesData, function(i, item) {
                                        if (item!='-' && item!==null) {
                                            thisData.push(parseFloat(item[1]));
                                        }
                                    })
                                } else {
                                    $.each(theSeriesData, function(i, item) {
                                        if (item!='-' && item!==null) {
                                            thisData.push(parseFloat(item));
                                        }
                                    })
                                }

                                switch (arithmetic) {
                                    case 'max' :
                                        arithmeticName = '最大值:';
                                        arithmeticValue = major.MATH.max( thisData );
                                        break;
                                    case 'min' :
                                        arithmeticName = '最小值:';
                                        arithmeticValue = major.MATH.min( thisData );
                                        break;
                                    case 'avg' :
                                        arithmeticName = '均值:';
                                        arithmeticValue = major.MATH.avg( thisData );
                                        break;

                                }
                                // if (!htmlData.hasOwnProperty(seriesName)) htmlData[seriesName] = {};
                                // htmlData[seriesName][arithmeticName] = arithmeticValue;

                            }else {
                                arithmeticValue="--"
                            }
                            if(arithmetic== 'theo'){
                                arithmeticValue = theoValue[seriesName];
                            }
                            if (!gridData.hasOwnProperty(seriesName)) gridData[seriesName] = {};
                            gridData[seriesName][arithmetic] = arithmeticValue;
                        });
                    });
                    // var htmls = '';
                    var data = [];
                    $.each( gridData , function( seriesName , seriesData ) {
                        var row = {};
                        row['name']=seriesName;
                        $.each( seriesData , function( arithmetic , arithmeticValue ){
                            row[arithmetic]=arithmeticValue;
                        });
                        data.push(row)
                        // self.$datagrid.datagrid('appendRow',row);

                        // var html = '<div style="display: inline-block; width: 300px; margin-bottom: 30px; ">\
                        //                 <div style="display: inline-block; width: 80px; vertical-align: top;">\
                        //                     '+seriesName+':\
                        //                 </div>\
                        //                 <div style="display: inline-block; width: 200px; ">\
                        //                     <table style="width: 180">';
                        // $.each( seriesData , function( arithmetic , arithmeticValue ){
                        //     html += '<tr >\
                        //                 <td>' + arithmetic + '</td>\
                        //                 <td>' + arithmeticValue + '</td>\
                        //             </tr>'
                        // });
                        // html += '</table>\
                        //             </div>\
                        //         </div>';
                        // htmls += html;
                    });
                    //$("#calculateResultCon").html(htmls);
                    self.$datagrid.datagrid('loadData',data);

                }
            }

            echart.draw(echartOption);

            this.events.afterDraw();
            return;
        },
        showConfigWarning: function(msg) {
            $("#echartConfigWarning").text(msg);
            $("#echartWarningCon").show();
            $("#blankTips").show();
            $("#echartDiv").hide();
        },
        hideConfigWarning: function() {
            $("#echartConfigWarning").text('');
            $("#echartWarningCon").hide();
            $("#blankTips").hide();
            $("#echartDiv").show();
            $("#echartparent").panel('resize');
        },
        getEchartType: function() {
            return this.echartType;
        },
        setEchartType: function(_dom) {
            var $d = $(_dom),
                $p = $d.parent(),
                v = $d.data('type');
            this.echartType = v;
            $("#scatterParamCon").panel(['scatter', 'line'].indexOf(v)!=-1? 'open': 'close');
            $("#pieParamCon").panel('pie'==v? 'open': 'close');
            $p.addClass('on').siblings('.echartType').removeClass('on');
            $("#echartXYAxisCon").toggle(v != "pie");

            // 处理 for-echarttype 的
            $("[for-echarttype]").each(function() {
                var $this = $(this),
                    forEchartType = $this.attr('for-echarttype'),
                    forEchartTypeArr = eval("([" + forEchartType + "])");
                $this.toggle(forEchartTypeArr.indexOf(v)!=-1)
            })

            this.autoDraw();
        },
        addPieParamExpression : function(dom) {    // 添加饼图分组
            var s = $(".pieParamExpressionTmpl").html(),
                $t = $(s);
            $(dom).siblings(".pieParamExpressionCon").append($t);
            $t.find("input").addClass("easyui-textbox");
            $t.find("select").addClass("easyui-combobox");
            $.parser.parse($t);
        },
        addPieParamGroup : function() {  // 添加饼图分组参数
            var s = $(".pieParamGroupTmpl").html(),
                $t = $(s);
            $(".pieParamGroupCon").append($t);
            $t.find("input").addClass("easyui-textbox");
            $t.find("select").addClass("easyui-combobox");
            $.parser.parse($t);
        },
        events:{
            afterDraw: function() {
                viewControl.envelopeLineGrid.refresh();
            }
        }
    });

    window.Controller = Controller;
})();