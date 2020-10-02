/**
 * 扩展easyui
 */
// 扩展/重设form
$.extend( true , $.fn.form.defaults , {
    dataType : 'json'   //默认处理为JSON
});
$.extend( true , $.fn.form.methods , {
    disable : function (jq) {
        jq.each(function () {
            var target = this;
            $("input,select,textarea", target).each(function () {
                var clz = $(this).attr("class");
                if ((!clz) || (clz.indexOf("combo-") == -1 && clz.indexOf("ajaxfile-") == -1)) {
                    $(this).attr("disabled", "disabled");
                }
            });
            $.fn.combo && $(".combo-f", target).combo("disable");
            $.fn.combobox && $(".combobox-f", target).combobox("disable");
            $.fn.combotree && $(".combotree-f", target).combotree("disable");
            $.fn.combogrid && $(".combogrid-f", target).combogrid("disable");
            $.fn.ajaxfile && $(".ajaxfile-f", target).ajaxfile("disable");
        });
    },
    enable : function (jq) {
        jq.each(function () {
            var target = this;
            $("input,select,textarea", target).each(function () {
                var clz = $(this).attr("class");
                if ((!clz) || (clz.indexOf("combo-") == -1 && clz.indexOf("ajaxfile-") == -1)) {
                    $(this).removeAttr("disabled");
                }
            });
            if ($.fn.combo) {
                $(".combo-f", target).combo("enable");
            }
            if ($.fn.combobox) {
                $(".combobox-f", target).combobox("enable");
            }
            if ($.fn.combotree) {
                $(".combotree-f", target).combotree("enable");
            }
            if ($.fn.combogrid) {
                $(".combogrid-f", target).combogrid("enable");
            }
            if ($.fn.ajaxfile) {
                $(".ajaxfile-f", target).ajaxfile("enable");
            }
        })
    },
    readonly : function (jq, p) {
        //$('#form').form('readonly');		    // enable readonly mode
        //$('#form').form('readonly', true);	// enable readonly mode
        //$('#form').form('readonly', false);	// disable readonly mode
        jq.each(function () {
            var target = this;
            $("input,select,textarea", target).each(function () {
                var clz = $(this).attr("class");
                if ((!clz) || (clz.indexOf("combo-") == -1 && clz.indexOf("ajaxfile-") == -1)) {
                    if (p === false) {
                        $(this).removeAttr("readOnly");
                    } else {
                        $(this).attr("readOnly", "readOnly");
                    }
                }
            });
            if ($.fn.combo) {
                $(".combo-f", target).combo("readonly", p);
            }
            if ($.fn.combobox) {
                $(".combobox-f", target).combobox("readonly", p);
            }
            if ($.fn.combotree) {
                $(".combotree-f", target).combotree("readonly", p);
            }
            if ($.fn.combogrid) {
                $(".combogrid-f", target).combogrid("readonly", p);
            }
            if ($.fn.ajaxfile) {
                $(".ajaxfile-f", target).ajaxfile("readonly", p);
            }
        })
    }
});


// 扩展/重设dialog
$.extend( $.fn.dialog.defaults , {
    modal : true        // 设置dialog的modal默认为true
});


// 扩展/重设tree
$.extend( $.fn.tree.defaults , {
    emptyMsg : '无数据',
    loadFilter : function (data, parent) {
        // 扩展tree使其支持平滑数据格式
        // tree 扩展了三个属性字段{idField:主键列，textField:显示名称列，parentField:父亲ID列}
        var opt = $(this).data().tree.options;
        var idField = opt.idField, textField = opt.textField, parentField;
        for (i = 0, l = data.length; i < l; i++) {
            if (idField) {
                data[i]['id'] = data[i][idField];
            }
            if (textField) {
                data[i]['text'] = data[i][textField];
            }
        }
        if (opt.parentField) {
            parentField = opt.parentField;
            var i, l, treeData = [], tmpMap = [];
            for (i = 0, l = data.length; i < l; i++) {
                tmpMap[data[i]["id"]] = data[i];
            }
            for (i = 0, l = data.length; i < l; i++) {
                if (tmpMap[data[i][parentField]] && data[i]["id"] != data[i][parentField]) {
                    if (!tmpMap[data[i][parentField]]['children']) {
                        tmpMap[data[i][parentField]]['children'] = [];
                    }
                    tmpMap[data[i][parentField]]['children'].push(data[i]);
                } else {
                    treeData.push(data[i]);
                }
            }
            for (i = 0, l = data.length; i < l; i++) {
                if(!data[i].children || data[i].children.length<1){
                    //data[i].state = "open"
                }
            }
            data = treeData;
        }
        // data.
        return data;
    }
});
$.extend( $.fn.tree.methods , {
    getCheckedExt: function (jq) {// 获取checked节点(包括实心)
        var checked = $(jq).tree("getChecked");
        var checkbox2 = $(jq).find("span.tree-checkbox2").parent();
        $.each(checkbox2, function () {
            var node = $.extend({}, $.data(this, "tree-node"), {
                target: this
            });
            checked.push(node);
        });
        return checked;
    },
    getSolidExt: function (jq) {// 获取实心节点
        var checked = [];
        var checkbox2 = $(jq).find("span.tree-checkbox2").parent();
        $.each(checkbox2, function () {
            var node = $.extend({}, $.data(this, "tree-node"), {
                target: this
            });
            checked.push(node);
        });
        return checked;
    }
});


// treegrid扩展
$.extend( $.fn.treegrid.defaults , {
    emptyMsg: '无数据',
    loadMsg: false ,
    loadFilter: function (data, parentId) {
        var opt = $(this).data().treegrid.options;
        var idField = opt.idField, parentField;
        if (opt.parentField) {
            parentField = opt.parentField;
            var i, l, treeData = [], tmpMap = [];
            for (i = 0, l = data.length; i < l; i++) {
                tmpMap[data[i][idField]] = data[i];
            }
            for (i = 0, l = data.length; i < l; i++) {
                if (tmpMap[data[i][parentField]] && data[i][idField] != data[i][parentField]) {
                    if (!tmpMap[data[i][parentField]]['children']) {
                        tmpMap[data[i][parentField]]['children'] = [];
                    }
                    tmpMap[data[i][parentField]]['children'].push(data[i]);
                } else {
                    treeData.push(data[i]);
                }
            }
            for (i = 0, l = data.length; i < l; i++) {
                if (!data[i].children || data[i].children.length < 1) {
                    //data[i].state = "open"
                }
            }
            return treeData;
        }
        return data;
    }
});
$.extend( $.fn.treegrid.methods , {
    setUrl : function ( _t , url ) {
        _t.treegrid('options').url = url;
        return _t;
    },
    getRoot:function (_t, id) {
        if(id){
            var node = _t.treegrid('find',id)
            var parent = _t.treegrid('getParent',node.id)
            while(parent){
                node=parent;
                parent=_t.treegrid('getParent',node.id)
            }
            return node;
        }
        else {
            return _t.treegrid('getRoot');
        }
    }
});

// combotree扩展
// 扩展combotree的默认加载过滤   如果不是必填项的话增加第一行
$.extend( $.fn.combotree.defaults , {
    loadFilter : function (data, parent) {
        var opt = $(this).data().tree.options;
        var idField = opt.idField, textField = opt.textField, parentField;
        for (i = 0, l = data.length; i < l; i++) {
            if (idField) {
                data[i]['id'] = data[i][idField];
            }
            if (textField) {
                data[i]['text'] = data[i][textField];
            }
        }
        if (opt.parentField) {
            parentField = opt.parentField;
            var i, l, treeData = [], tmpMap = [];
            for (i = 0, l = data.length; i < l; i++) {
                tmpMap[data[i]["id"]] = data[i];
            }
            for (i = 0, l = data.length; i < l; i++) {
                if (tmpMap[data[i][parentField]] && data[i]["id"] != data[i][parentField]) {
                    if (!tmpMap[data[i][parentField]]['children']) {
                        tmpMap[data[i][parentField]]['children'] = [];
                    }
                    tmpMap[data[i][parentField]]['children'].push(data[i]);
                } else {
                    treeData.push(data[i]);
                }
            }
            data = treeData;
        }
        if (!opt.required && !opt.multiple) {
            if (opt.mode == "filter") {
                data.splice(0, 0, {id: "", text: '全部', iconCls: 'tree-icon-none'});
            } else {
                data.splice(0, 0, {id: "", text: '请选择', iconCls: 'tree-icon-none'});
            }
        }
        return data;
    }
});


// combobox
$.extend( $.fn.combobox.defaults , {
    editable: false,
    loadFilter: function (data) {
        //combobox 使其支持"请选择"空选项
        var options = $(this).combobox("options");
        if (!options.required && !options.multiple) {
            var vf = options.valueField,
                tf = options.textField;
            var eo = {iconCls: 'tree-icon-none'};
            eo[vf] = "";
            if (options.mode == "filter") {
                eo[tf] = "全部";
            } else {
                eo[tf] = "请选择";
            }
            data.splice(0, 0, eo);
        }
        return data;
    }
});

// datebox
$.extend( $.fn.datebox.methods , {
    formatter: function (date) {
        return major.dateFormatYMD(date);
    },
    onBeforeSetValue : function (value) {
        if (value) {
            var v = major.dateFormatYMD(value);
            return v;
        }
        return value;
    },
    setValueOld : $.fn.datebox.methods.setValue,
    setValue : function (jq, value) {
        jq.each(function () {
            var v = value;
            var onBeforeSetValue = $(this).datebox("options").onBeforeSetValue;
            if (onBeforeSetValue) {
                v = onBeforeSetValue(v)
            }
            $(this).datebox("setValueOld", v);
        })
    }
});


// 设置datagrid
$.extend( $.fn.datagrid.defaults , {
    fitColumns: true,
    fit: true,
    pageList: [10, 20, 50, 100, 500, 2000],
    pageSize: 20,
    emptyMsg: '无数据',
    loadMsg: false
});
$.extend( $.fn.datagrid.methods , {
    setUrl : function ( _t , url ) {
        _t.datagrid('options').url = url;
        return _t;
    }
});

// 扩展 修改 messager
!function(){
    var oldWndW, oldWndH;

    $.messager.defaults.left = "45%";
    $.messager._progress = $.messager.progress;

    $.messager.progress = function(opt){
        opt = opt || {};
        if(opt=='close') {
            $("#loading").hide();
        } else {
            var height = $(window).height();
            var width = $(window).width();
            var $html = $("#loading");
            if ($html.size()==0 || oldWndW!=width || oldWndH != height ) {
                oldWndW = width;
                oldWndH = height;
                if ($html.size()>0) {
                    $html.remove();
                }

                var leftW = (width-200) /2;

                $html = $("<div id='loading' style='position:absolute;left:0;width:100%;top:0;z-index:9999;'>\
                <div style='width:100%;height:" + height + "px;background:black;opacity:0.5;filter:alpha(opacity=80);'></div>\
<div style='opacity:1;filter:alpha(opacity=100);position:absolute; background-color:white; cursor1:wait;left:" + leftW + "px;top:"+((height-16)/2)+"px;width:200px;padding:14px 18px;\
border:2px solid #ccc;color:#000;'>\
<image src='"+ctx+"/static/jeasyui/themes/insdep/images/loading.gif' height='18' width='18' /> \
<span class='text'></span>\
</div></div>");
                $('body').append($html)
            }
            opt.text && $html.find('.text').html(opt.text) || $html.find('.text').html('正在处理，请稍候...');

            $html.show();
        }
    }
}();


/**
 扩展validateBox
 */
$.extend($.fn.validatebox.defaults.rules, {
    minLength: {
        validator: function(value, param){
            return value.length >= param[0];
        },
        message: '最少{0}个字符.'
    }
});

/**
 * 扩展filebox
 * 配置项增加:
 *  viewBtn: true/false  是否显示预览按钮
 *  downloadBtn:  true/false 是否显示下载按钮
 *  clearBtn: true/false 是否显示清空按钮
 *  onClickViewBtn:
 *  onClickDownloadBtn:
 *  onClickClearBtn
 */
(function() {
    var index=0;

    var originalFilebox = $.fn.filebox;

    $.fn.filebox=function(fun,param){
        if(typeof fun=="string"){
            var _55b=$.fn.filebox.methods[fun];
            if(_55b){
                return _55b(this,param);
            }else{
                return this.textbox(fun,param);
            }
        }
        fun=fun||{};
        return this.each(function(){
            var _55c=$.data(this,"filebox");
            if(_55c){
                $.extend(_55c.options,fun);
            }else{
                $.data(this,"filebox",{options:$.extend({},$.fn.filebox.defaults,$.fn.filebox.parseOptions(this),fun)});
            }
            init(this);
        });
    };

    $.extend(true, $.fn.filebox, originalFilebox);

    $.extend($.fn.filebox.defaults, {
        editable: false,
        buttonText: '选择',
        viewBtn: false,
        downloadBtn: false,
        clearBtn: false,
        viewBtnText: '预览',
        downloadBtnText: '下载',
        clearBtnText: '清空',
        onClickViewBtn: function(){
            var file = $(this ).filebox('getStorageFile');
            return file && window.open(file.viewURL) || null;
        },
        onClickDownloadBtn: function(){
            var file = $(this ).filebox('getStorageFile');
            return file && window.open(file.downloadURL) || null;
        },
        onClickClearBtn: function(){
            initInputs(this );
            $(this).filebox("getViewBtn").linkbutton('disable');
            $(this).filebox("getDownloadBtn").linkbutton('disable');
            $(this).filebox("getClearBtn").linkbutton('disable');;
        }
    });

    $.extend($.fn.filebox.methods, {
        getViewBtn: function(jq){
            return $.data(jq[0],"textbox").textbox.find(".textbox-button2.viewBtn");
        },
        getDownloadBtn: function(jq){
            return $.data(jq[0],"textbox").textbox.find(".textbox-button2.downloadBtn");
        },
        getClearBtn: function(jq){
            return $.data(jq[0],"textbox").textbox.find(".textbox-button2.clearBtn");
        },
        setValue: function(jq, v) {
            $.data(jq[0], "textbox").textbox.find(".textbox-value").val(v );
            var storageFile = v? StorageFile.get(v): null;
            $(jq).filebox("setText", storageFile ? storageFile.fileName : v);
            $(jq).filebox('getViewBtn').linkbutton(storageFile ? 'enable' : 'disable');
            $(jq).filebox('getDownloadBtn').linkbutton(storageFile ? 'enable' : 'disable');
            $(jq).filebox('getClearBtn').linkbutton(storageFile ? 'enable' : 'disable');
        },
        setValues: function(jq) {
            //TODO
        },
        getValue: function(jq) {
            return $.data(jq[0], "textbox").textbox.find(".textbox-value").val( );
        },
        // 获得隐藏的值(封装成StorageFile对象)
        getStorageFile: function(jq){
            var value = $(jq).filebox("getValue");
            var storageFile = StorageFile.get(value );
            return storageFile;
        },
        clear:function(jq){
            return jq.each(function(){
                // $(this).textbox("setValue", '');
                initInputs(this);
            });
        }
    });

    function init(dom){
        var fileboxData = $.data(dom,"filebox");
        var opts=fileboxData.options;
        opts.fileboxId="filebox_file_id_"+(++index);
        $(dom).addClass("filebox-f").textbox(opts);
        $(dom).textbox("textbox").attr("readonly","readonly");
        fileboxData.filebox=$(dom).next().addClass("filebox");
        var file = initInputs(dom);
        // 追加按钮
        // r: 是否右对齐  true 右对齐
        (function(r){
            var perWidth = 45, btnCount = 0;
            var queue = [function(){
                var btn=$(dom).filebox("button");
                if(btn.length){
                    $("<label class=\"filebox-label\" for=\""+opts.fileboxId+"\"></label>").appendTo(btn);
                    if(btn.linkbutton("options").disabled){
                        file.attr("disabled","disabled");
                    }else{
                        file.removeAttr("disabled");
                    }
                    $.data(dom,"textbox").textbox.find('.textbox-button').css('margin-right', btnCount * perWidth);
                    btnCount++
                }
            }, function(){
                if (opts.viewBtn) {
                    var viewBtn=$(dom).filebox("getViewBtn");
                    if(!viewBtn.length){
                    // 增加 预览按钮
                        var tb = $.data(dom,"textbox").textbox;
                        var btn=$("<a href=\"javascript:;\" class=\"textbox-button2 viewBtn\"></a>").prependTo(tb);
                        btn.addClass("textbox-button-"+opts.buttonAlign).linkbutton({text:opts.viewBtnText,disabled: true, iconCls:opts.buttonIcon,onClick:function(){
                            var t=$(this).parent().prev();
                            t.filebox("options").onClickViewBtn.call(t[0]);
                        }});
                    } else {
                        viewBtn.linkbutton('disable');
                    }
                    $.data(dom,"textbox").textbox.find('.textbox-button2.viewBtn').css('margin-right', btnCount * perWidth).find('span:eq(0)').css('margin-top', -2);
                    btnCount++
                }
            }, function() {
                if (opts.downloadBtn) {
                    var downloadBtn = $(dom).filebox("getDownloadBtn");
                    if (!downloadBtn.length) {
                    // 增加 下载按钮
                        var tb = $.data(dom, "textbox").textbox;
                        var btn = $("<a href=\"javascript:;\" class=\"textbox-button2 downloadBtn\"></a>").prependTo(tb);
                        btn.addClass("textbox-button-" + opts.buttonAlign).linkbutton({
                            text: opts.downloadBtnText, iconCls: opts.buttonIcon, disabled: true, onClick: function () {
                                var t = $(this).parent().prev();
                                t.filebox("options").onClickDownloadBtn.call(t[0]);
                            }
                        });
                    } else {
                        downloadBtn.linkbutton('disable');
                    }
                    $.data(dom,"textbox").textbox.find('.textbox-button2.downloadBtn').css('margin-right', btnCount * perWidth).find('span:eq(0)').css('margin-top', -2);
                    btnCount++
                }
            }, function(){
                if (opts.clearBtn) {
                    var clearBtn=$(dom).filebox("getClearBtn");
                    if(!clearBtn.length){
                    // 增加 下载按钮
                        var tb = $.data(dom,"textbox").textbox;
                        var btn=$("<a href=\"javascript:;\" class=\"textbox-button2 clearBtn\"></a>").prependTo(tb);
                        btn.addClass("textbox-button-"+opts.buttonAlign).linkbutton({text:opts.clearBtnText,disabled: true, iconCls:opts.buttonIcon,onClick:function(){
                            var t=$(this).parent().prev();
                            t.filebox("options").onClickClearBtn.call(t[0]);
                        }});
                    } else {
                        clearBtn.linkbutton('disable');
                    }
                    $.data(dom,"textbox").textbox.find('.textbox-button2.clearBtn').css('margin-right', btnCount * perWidth).find('span:eq(0)').css('margin-top', -2);
                    btnCount++
                }
            }];
            $.each(r? queue.reverse(): queue, function(){
                this.call();
            });
            // 设置文本输入框大小
            var tb = $(dom).textbox("textbox"),
                cw = (btnCount>1? btnCount-1: 0) * perWidth;
            _tb = tb;
            tb.css('width', tb.css('width') - cw).css('margin-right', tb.css('margin-right') + cw);
        })(opts.buttonAlign == 'right')


    }

    function initInputs(jq){
        var fileboxData=$.data(jq,"filebox");
        var opts=fileboxData.options;
        fileboxData.filebox.find(".textbox-text").val('');
        fileboxData.filebox.find(".filebox-file").remove();
        fileboxData.filebox.find(".textbox-value").remove();
        opts.oldValue="";

        // 增加隐藏的文件控件
        var file=$("<input type=\"file\" class=\"filebox-file hide\">").appendTo(fileboxData.filebox);
        file.attr("id",opts.fileboxId).attr("name",($(jq).attr("textboxName")||"") + "_file");
        file.attr("accept",opts.accept);
        // 增加隐藏的文本控件
        var valueInput = $("<input type=\"hidden\" class=\"textbox-value\">").appendTo(fileboxData.filebox);
        valueInput.attr("name", ($(jq).attr("textboxName") || ""));

        if(opts.multiple){
            file.attr("multiple","multiple");
        }
        file.change(function(){
            var v = this.value;
            if(this.files){
                v=$.map(this.files,function(file){
                    return file.name;
                }).join(opts.separator);
            }
            $(jq).filebox("setText",v);
            opts.onChange.call(jq,v,opts.oldValue);
            opts.oldValue=v;
        });
        return file;
    }

})();

/**
 扩展tabs

$.extend($.fn.tabs.defaults, {
    tools: [{
        iconCls:'icon-refresh',
        handler:function(){
            // todo 需完善
            var selectedTab = tabs.tabs('getSelected'),
                children = selectedTab.children();
            $.each( children , function(i , item ) {
                if ( item.tagName == "IFRAME" ) {
                    var o = item.attributes.src.value;
                    item.attributes.src.value = '';
                    item.attributes.src.value = o;
                }
            })
        }
    }]
});
 */


// 调整
$(function(){
    // 修复dropdown-menu点击日期控件自动缩回的BUG
    $(document).on('click.dropdown.data-api touchstart.dropdown.data-api', '.advanced-search', function (e) { e.stopPropagation() });
    // 高级查询阻止click事件冒泡 combo
    $(".combo-panel").off("click.dropdown.data-api").on("click.dropdown.data-api",function(e){ e.stopPropagation()});
});


/**
 增加方便方法
 */
!function(){
    $.extend(window, {
        // 当选中了某行时
        // msg 选填 未填时默认提示"请选择要操作的记录"   设置为0或者false '' 等可以取消
        ifRowSelected: function(jq, fn, msg ) {
            var row;
            if ($.data(jq[0], 'datagrid')) {
                row = $(jq).datagrid('getSelected');
            } else if ($.data(jq[0], 'treegrid')) {
                row = $(jq).treegrid('getSelected');
            } else {
                throw new Error("ifRowSelected不支持的对象,仅支持datagrid, treegrid")
            }
            if (row) {
                fn(row);
            } else if (msg === undefined || (typeof msg !='string' && msg)) { // 未填  或者  1,true
                $.messager.alert("提示", "请选择要操作的记录", "info");
            } else if (typeof msg == 'string' ) {
                $.messager.alert("提示", msg, "info");
            }
        },
        // 如果ajax返回的结果正确
        whenSuccess: function(rst, scb, fcb){
            if (rst.success) {
                typeof scb == "function" && scb.call(window, rst.obj );
            } else if(typeof fcb == "function") {
                fcb.call(window, rst.msg || defaultErrorMsg );
            } else {
                $.messager.alert("错误", rst.msg || defaultErrorMsg,'error');
            }
        }
    })
}();