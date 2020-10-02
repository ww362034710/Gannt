// Echart 管理
// 生成Echart配置项  刷新echart等
!function() {

    var ViewControl = function( opts) {
        var self = this;
        self.$paramCon = null;
        self.echart = null;    // echart

        self.envelopeLineGrid = null;   // 包络线grid

        self.init();

        return self;
    };

    $.extend(true, ViewControl.prototype, {
        init: function(opts) {
            this.initDomComponents();
            this.initLayout();
            // this.bindParamInputEvent();
        },
        initDomComponents: function() {
            var self = this;
            self.$paramCon = $("#echartParamCon");
            self.envelopeLineGrid = new EnvelopeLineGrid();

            $("[name=arithmetic]").on('change', function() {
                controller.autoDraw();
            })
        },
        initLayout : function () {     // 初始化布局
            var self = this;
            $("#echartparent").panel({
                doResize: true,
                onResize: function (width, height) {
                    console.log('resize');
                    if (window.echart) {
                        echart.setWidth(width);
                        echart.setHeight(height);
                        echart.resize();
                    }
                }
            });

            // fix group width
            $(".pieParamGroupCon").css("width", $("#pieParamCon").panel('panel').width() - 20);
            var $innerInputs = $(".pieParamGroupCon").find(".easyui-textbox, .easyui-combobox");
            if($innerInputs.length>0) {
                $.each($innerInputs, function(i, item) {
                    if ($(item).textbox ) {
                        $(item).textbox('resize');
                    } else if ($(item).combobox) {
                        $(item).combobox('resize');
                    }
                })
            }

            $("#titleId").textbox({
                onChange: function(n, o) {
                    self.setTitle(n);
                    // self.drawEchartOnConfig();
                }
            });

            $("#pieParamCon").panel('close');
        }
    });
    window.ViewControl = ViewControl;
}();