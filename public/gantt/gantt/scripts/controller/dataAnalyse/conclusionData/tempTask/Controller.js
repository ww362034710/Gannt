// TODO 优化效率  或者使用缓存
// 控制前台原始数据的展示
var _CONFIG = {
    debug: true,                            // 调试模式
    clearCheckedBomNodeUnderOtherBom: false, //CHECK了BOM后其他BOM下的已选项清空
    autoRefresh : true,                         // 是否在变更了参数后自动刷新echart
    selectedChannelLimitInATask : 2,        // 通道tree 每个项目下最多选择多少个channel
    maxXPointCount : 500,                        // X轴最多显示多少个点
    maxXAxisCount : 2,                      // 最多多少条X轴
    maxYAxisCount : 2,                       // 最多多少条Y轴
    yAxisSplitNumber : 6                    // Y轴分段数量
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

        return this.init();
    };

    $.extend(Controller.prototype, {
        init: function( opts) {
            window.controller = this;
            window.manager = new Manager();                         // 数据管理
            window.echart = new Echart();                 // 视图控制
            window.viewControl = new ViewControl();                 // 视图控制
            window.configBucket = new ConfigBucket();               // echart选项状态

            window.channelTreeManager = new ChannelTreeManager();
            window.taskTreeManager = new TaskTreeManager();
            window.xAxisSelector = new XAxisSelector();
            window.yAxisSelector = new YAxisSelector();

            window.echartLineManager = new EchartLineManager();
            window.echartPieManager = new EchartPieManager();
            window.echartScatterManager = new EchartScatterManager();

            $("#echartparent").panel('resize');

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
                $.each(arithmeticDoms, function( i , dom ) {
                    arithmeticToCal.push($(dom).val());
                });
                if (arithmeticToCal.length>0) {
                    var htmlData = {};      // 准备的数据  {电压:{最大值:20, ...}, 电流:{最大值:0.1...}..}
                    $.each(arithmeticToCal, function (i, arithmetic) {
                        $.each(series, function ( seriesIndex, seriesData){
                            var dataEnumType = manager.getDataType( seriesData.data );
                            // 将scatter的series的数据扁平化
                            var theSeriesData = seriesData.data;
                            var thisData = [];  // 要计算的数据

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

                                var seriesName = seriesData.name,
                                    arithmeticName, arithmeticValue;
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
                                if (!htmlData.hasOwnProperty(seriesName)) htmlData[seriesName] = {};
                                htmlData[seriesName][arithmeticName] = arithmeticValue;
                            }
                        });
                    });
                    var htmls = '';
                    $.each( htmlData , function( seriesName , seriesData ) {
                        var html = '<div style="display: inline-block; width: 240px; margin-bottom: 30px; ">\
                                        <div style="display: inline-block; width: 80px; vertical-align: top;">\
                                            '+seriesName+':\
                                        </div>\
                                        <div style="display: inline-block; width: 150px; ">\
                                            <table>';
                        $.each( seriesData , function( arithmetic , arithmeticValue ){
                            html += '<tr>\
                                        <td>' + arithmetic + '</td>\
                                        <td>' + arithmeticValue + '</td>\
                                    </tr>'
                        });
                        html += '</table>\
                                    </div>\
                                </div>';
                        htmls += html;
                    });
                    $("#calculateResultCon").html(htmls);
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
        exportData: function() {
            var paramObjList = [],
                paramObjMap = {},   // {taskId:[channelIds]..}
                selectedChannels = channelTreeManager.data.getCheckedChannels();

            $.each( selectedChannels , function( selectedChannelIndex , selectedChannel ) {
                console.log('selectedChannel' , selectedChannel);
                var taskId = selectedChannel.taskId;
                if ( !paramObjMap.hasOwnProperty( taskId )) paramObjMap[ taskId ] = [];
                paramObjMap[ taskId ].push( selectedChannel.channelId );
            });

            paramObjList = major.collect( paramObjMap , function( k , v ) {
                return { taskId : k , channel : v };
            });

            var json = JSON.stringify(paramObjList) ;
            var form = $('<form style="display:none" class="hiddenDataGridForm" action="'+ctx+'/dataExport/exportOriginalDatas" target="_blank" method="post" ><input type="hidden" name="json"/></form>');
            form.find('[name=json]').val( json );
            $("body").append(form);
            form.submit();
        },
        events:{
            afterDraw: function() {
                viewControl.envelopeLineGrid.refresh();
            }
        }
    });

    window.Controller = Controller;
})();