//扩展easyui
(function(window, $){

    // $.messager.defaults.left="45%";


    $.extend(true, $.fn.validatebox, {
        defaults: {
            rules: {
                equals: {
                    validator: function(value,param){
                        return value === $(param[0]).val();
                    },
                    message: '两次密码不一致'
                }
            }
        }
    });


    /**
     *  扩展/重写easyui datebox
     */
    $.extend(true, $.fn.datebox, {
        defaults: {
            editable: false
        }
    });

    /**
     * 扩展/重写easyui form
     */
    $.extend(true, $.fn.form, {
        defaults: {
            dataType: 'json'    //默认处理为JSON
        },
        methods: {
            disable: function (jq) {
                jq.each(function () {
                    var target = this;
                    $("input,select,textarea", target).each(function () {
                        var clz = $(this).attr("class");
                        if ((!clz) || (clz.indexOf("combo-") == -1 && clz.indexOf("ajaxfile-") == -1)) {
                            $(this).attr("disabled", "disabled");
                        }
                    });
                    if ($.fn.combo) {
                        $(".combo-f", target).combo("disable");
                    }
                    if ($.fn.combobox) {
                        $(".combobox-f", target).combobox("disable");
                    }
                    if ($.fn.combotree) {
                        $(".combotree-f", target).combotree("disable");
                    }
                    if ($.fn.combogrid) {
                        $(".combogrid-f", target).combogrid("disable");
                    }
                    if ($.fn.ajaxfile) {
                        $(".ajaxfile-f", target).ajaxfile("disable");
                    }
                });
            },
            enable: function (jq) {
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
            readonly: function (jq, p) {
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
        }
    });

    /**
     *  扩展/重写easyui combo
     */
    $.extend(true, $.fn.combo, {
        defaults: {
            panelHeight: 400
        }
    });


    /**
     *  扩展/重写easyui combobox
     */
    $.extend(true, $.fn.combobox, {
        defaults: {
            editable: false,
            panelHeight: 400,
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
        }
    });

    /**
     *  扩展/重写easyui tree
     */
    $.extend(true, $.fn.tree, {
        defaults : {
            editable: false,
            loadFilter: function (data) {
                /**
                 * 使其支持"请选择"空选项
                 */
                var options = $(this).tree("options");
                data = major.buildTree(data, options.parentField || "parentId", options.idField || "id", options.textField || "text");
                return data;
            }
        },
        methods: {
            // 使其可以获取实心节点
            getCheckedExt : function(jq) {// 获取checked节点(包括实心)
                var checked = $(jq).tree("getChecked");
                var checkbox2 = $(jq).find("span.tree-checkbox2").parent();
                $.each(checkbox2, function() {
                    var node = $.extend({}, $.data(this, "tree-node"), {
                        target : this
                    });
                    checked.push(node);
                });
                return checked;
            },
            getSolidExt : function(jq) {// 获取实心节点
                var checked = [];
                var checkbox2 = $(jq).find("span.tree-checkbox2").parent();
                $.each(checkbox2, function() {
                    var node = $.extend({}, $.data(this, "tree-node"), {
                        target : this
                    });
                    checked.push(node);
                });
                return checked;
            }
        }
    });

    /**
     *  扩展/重写easyui datagrid
     */
    $.extend(true, $.fn.datagrid, {
        defaults: {
            view: {
                onAfterRender: function(view, data) {
                    var _84f=$.data(view,"datagrid");
                    var opts=_84f.options;
                    if(opts.showFooter){
                        var _850=$(view).datagrid("getPanel").find("div.datagrid-footer");
                        _850.find("div.datagrid-cell-rownumber,div.datagrid-cell-check").css("visibility","hidden");
                    }
                    this.setEmptyMsg(view);

                    $.majorParser.parse($(view).datagrid('getPanel').children());
                }
            }
        }
    });

    /**
     *  扩展/重写easyui combotree
     */
    $.extend(true, $.fn.combotree, {
        defaults: {
            editable: false,
            panelHeight: 400,
            loadFilter : function(data, parent) {
                var opt = $(this).data().tree.options;
                var idField = opt.idField, textField = opt.textField, parentField;
                for (i = 0, l = data.length; i < l; i++) {
                    if(idField){
                        data[i]['id'] = data[i][idField];
                    }
                    if(textField){
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
                            if (!tmpMap[data[i][parentField]]['children']){
                                tmpMap[data[i][parentField]]['children'] = [];
                            }
                            tmpMap[data[i][parentField]]['children'].push(data[i]);
                        } else {
                            treeData.push(data[i]);
                        }
                    }
                    data = treeData;
                }
                // data.
                console.log('data', data);

                return data;
            }
        }
    });

    /**
     *  扩展/重写easyui combogrid
     */
    $.extend(true, $.fn.combogrid, {
        defaults: {
            editable: false,
            panelHeight: 400
        }
    });

    /**
     *  扩展/重写easyui combotreegrid
     */
    $.extend(true, $.fn.combotreegrid, {
        defaults: {
            pagination: false,
            editable: false,
            panelHeight: 400,
            loadFilter : function(data, parent) {
                var opt = $(this).data().treegrid.options;
                var idField = opt.idField, textField = opt.textField, parentField;
                for (i = 0, l = data.length; i < l; i++) {
                    if(idField){
                        data[i]['id'] = data[i][idField];
                    }
                    if(textField){
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
                            if (!tmpMap[data[i][parentField]]['children']){
                                tmpMap[data[i][parentField]]['children'] = [];
                            }
                            tmpMap[data[i][parentField]]['children'].push(data[i]);
                        } else {
                            treeData.push(data[i]);
                        }
                    }
                    data = treeData;
                }
                // data.
                console.log('data', data);

                return data;
            }
        }
    });

    $.fn.extend({
        /**
         * 获取组件的类型  是datagrid  treegrid  combobox 等
         */
        getCompType : function() {
            var dataObj = $(this).data(),
                compObj = dataObj? major.find(dataObj, function(k, v){ return $.parser.plugins.indexOf(k)!==-1 }): null;;
            return compObj? compObj.key: null;
        },
        /**
         * 获得选中的记录  datagrid  treegrid  其他不包含 getSelections方法的组件会出异常
         */
        getSelections : function() {
            var me = $(this),
                compType = me.getCompType();
            if (compType === "tree") {
                return [me[compType]('getSelected')];
            } else {
                return me[compType]('getSelections');
            }
        },
        /**
         * 获得选中的记录的id  datagrid  treegrid  其他不包含 getSelections方法的组件会出异常
         */
        getSelectionIds : function() {
            var result = [];
            $(this).each(function(){
                result = result.concat($(this).getSelections().map(function(a){return a.id}));
            });
            return result;
        },
        /**
         * 查询
         */
        mload : function(params) {
            var me = $(this),
                compType = me.getCompType(); // 组件类型
            switch (compType) {
                case "datagrid":
                    return me.datagrid("load", params);
                case "treegrid":
                    return me.treegrid('load', params);
                case "combogrid":
                    return me.combogrid('grid').datagrid("load", params);
                case "combotreegrid":
                    return me.combotreegrid('grid').treegrid("load", params);
                default:
                    console.error("暂不支持的组件类型:", compType);
            }
        },
        /**
         * 刷新datagrid/treegrid
         */
        reload : function() {
            var me = $(this),
                compType = me.getCompType();
            return me[compType]('reload');
        }
    });

    /**
     *  扩展/重写easyui treegrid
     */
    $.extend(true, $.fn.treegrid, {
        defaults: {
            loadFilter : function(data, parentId) {
                var opt = $(this).data().treegrid.options;
                var idField=opt.idField,parentField;
                if (opt.parentField) {
                    parentField = opt.parentField;
                    var i, l, treeData = [], tmpMap = [];
                    for (i = 0, l = data.length; i < l; i++) {
                        tmpMap[data[i][idField]] = data[i];
                    }
                    for (i = 0, l = data.length; i < l; i++) {
                        if (tmpMap[data[i][parentField]] && data[i][idField] != data[i][parentField]) {
                            if (!tmpMap[data[i][parentField]]['children']){
                                tmpMap[data[i][parentField]]['children'] = [];
                            }
                            tmpMap[data[i][parentField]]['children'].push(data[i]);
                        } else {
                            treeData.push(data[i]);
                        }
                    }
                    return treeData;
                }
                return data;
            },
            view: {
                onAfterRender : function(view, data) {
                    var _84f=$.data(view,"datagrid");
                    var opts=_84f.options;
                    if(opts.showFooter){
                        var _850=$(view).datagrid("getPanel").find("div.datagrid-footer");
                        _850.find("div.datagrid-cell-rownumber,div.datagrid-cell-check").css("visibility","hidden");
                    }
                    this.setEmptyMsg(view);

                    $.majorParser.parse($(view).treegrid('getPanel').children());
                }
            }
        }
    });

    /**
     * 扩展filebox  TODO 整合到源码中   并支持自动预览
     * 配置项增加:
     *  viewBtn: true/false  是否显示预览按钮     默认false
     *  downloadBtn:  true/false 是否显示下载按钮 默认false
     *  clearBtn: true/false 是否显示清空按钮     默认false
     *  onClickViewBtn:
     *  onClickDownloadBtn:
     *  onClickClearBtn
     */
    // $.extend(true, $.fn.filebox, {
    //     defaults: {
    //         buttonText: '选择文件'
    //     },
    //     methods: {
    //         setValue: function (jq, v) {
    //             $.data(jq[0], "textbox").textbox.find(".textbox-value").val(v);
    //             var storageFile = v ? StorageFile.get(v) : null;
    //             $(jq).filebox("setText", storageFile ? storageFile.fileName : v);
    //             $(jq).filebox('getViewBtn').linkbutton(storageFile ? 'enable' : 'disable');
    //             $(jq).filebox('getDownloadBtn').linkbutton(storageFile ? 'enable' : 'disable');
    //             $(jq).filebox('getClearBtn').linkbutton(storageFile ? 'enable' : 'disable');
    //         }
    //     }
    // });

    (function() {
        var index=0;

        var originalFilebox = $.fn.filebox;

        $.fn.filebox=function(fun,param){
            if(typeof fun==="string"){
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
            var fileboxData=$.data(dom,"filebox");
            var opts=fileboxData.options;
            opts.fileboxId="filebox_file_id_"+(++index);
            $(dom).addClass("filebox-f").textbox(opts);
            $(dom).textbox("textbox").attr("readonly","readonly");
            var currentValue = $(dom).textbox("textbox").val()
            if (currentValue ){
                var file = StorageFile.get(currentValue);
                if (file) {
                    $(dom).textbox("textbox").val(file.fileName);
                }
            }
            fileboxData.filebox=$(dom).next().addClass("filebox");
            var file=initInputs(dom);

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
            })(opts.buttonAlign === 'right')


        }

        function initInputs(jq){
            var fileboxData=$.data(jq,"filebox"),
                    opts=fileboxData.options;
            fileboxData.filebox.find(".textbox-text").val('');
            fileboxData.filebox.find(".filebox-file").remove();

            var file=$('<input type=\"file\" name="'+($(jq).attr("textboxName")||"")+'" class=\"filebox-file hide\">').appendTo(fileboxData.filebox);
            file.attr("id",opts.fileboxId);
            file.attr("accept",opts.accept);
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



    // TODO 临时  与 Component中的重复了
    $.major = {
        // 找到某个组件的m-class  没有的话查找最近父节点的
        findMClass: function(dom, opts) {
            opts = opts || {};
            var me = $(dom);
            // 找到当前作用域的domain
            var domainName = opts.class || opts.mClass || me.attr("m-class");
            if (!domainName) {
                // 寻找上级的domain声明
                domainName = me.parents("[m-class]:eq(0)").attr('m-class');
            }
            return major.domainMap[domainName];
        },
    }


    // 解析dom元素  自动绑定上一些基本的业务逻辑
    $.majorParser = {
        parse: function(scope){
            scope = scope || window;
            // 先找到所有的for组件  确立关联关系
            this.initFor(scope);

            // 初始化字段组件
            $("[m-field]", scope).each(function(){
                $.majorParser.initFieldComponent(this);
            });

            // 初始化组件
            $("[m-easyui]", scope).each(function(){
                $.majorParser.initEasyuiComponent(this);
            });

            // 自动绑定m-event事件 支持的事件见上方枚举  TODO 目前仅支持click事件
            // 其实就是button  可以省略m-easyui="button"
            $("[m-event]", scope).each(function(){
                var me = $(this);
                if (!me.attr("m-field") && !me.attr("m-class")) {
                    var compType = me.getCompType();
                    if (!compType) {
                        me.attr('m-easyui', 'linkbutton');
                        $.majorParser.initEasyuiComponent(this);
                    }
                }
            });
        },
        // 先找到所有的for组件  确立关联关系
        initFor: function(scope) {
            $("[m-event],[m-easyui],[m-field]", scope).each(function(){
                var opts = $.parser.parseOptions(this),
                    forId = opts.for;
                if (!opts.for) {
                    forId = $(this).attr("for");
                }
                if (forId) {
                    var $for = forId[0] === "#" ? $(forId) : $("#" + forId);
                    var list = $for.data("mfored") || [];
                    list.push($(this));
                    $for.data('mfored', list);
                }
            });
        },
        // 初始化字段组件
        initFieldComponent: function(that) {
            var me = $(that),
                opts = $.parser.parseOptions(that) || {};   // 传递给easyui的初始化组件参数

            // 找到当前作用域的domain
            var domain = $.major.findMClass(that);

            // 找到field
            var fieldText = me.attr("m-field");
            // 字段类型
            var field = domain.fieldsMap[fieldText];

            // 找到字段的组件类型
            // 如果明确声明了m-class 则以声明的为准  否则以field中的声明
            var fieldType = (opts.class || opts.mClass || me.attr("m-class")) && 'domain' || field.type;

            // 字段类型分类  比如  基本类型"string"  时间类型"date"  数字类型"number"  domain类型"domain"
            // 组件类型
            var compType = me.attr("m-easyui");
            if(!compType) {
                // 通过字段的类型声明  使用默认的组件
                switch (fieldType) {
                    case "file":
                        compType = "filebox";
                        break;
                    case "string":
                        compType = "textbox";
                        break;
                    case "date":
                        compType = "datebox";
                        break;
                    case "number":
                        compType = "numberbox";
                        break;
                    case "enum":
                        compType = "combobox";
                        break;
                    case "domain":
                        compType = domain.isTree? "combotreegrid": "combogrid";
                        break;
                    default:
                        return console.error("暂不支持字段", field, "的类型:", fieldType);
                }
            }
            // 自动补充输入框的name属性
            if (!me.attr('name')) {
                if(fieldType === "domain") {
                    // 字段是domain时 则自动将name设置为该字段的id
                    if (fieldText.substring(fieldText.length-2) !== 'Id') { // TODO 存在隐患  此处是看该field是否以Id结尾  不是的话追加Id
                        fieldText += "Id";
                    }
                }
                me.attr('name', fieldText);
            }

            // 创建easyui组件
            // TODO 此处逻辑有问题
            var AUTO_CREATE_TYPES = ['textbox', 'datebox', 'numberbox'];    // 支持自动创建的easyui类型
            if(AUTO_CREATE_TYPES.indexOf(compType) !== -1) {
                // 基础类型
                me[compType](opts);
            } else if (fieldType === 'enum' && enums.hasOwnProperty(field.enumKey)) {
                // 枚举
                me.mcombobox({ enumKey: field.enumKey });
            } else if (compType === 'filebox') {
                if (field.collection) {
                    opts.multiple = true;
                }
                me.mfilebox(opts);
            } else if (fieldType === 'domain') {
                if (!domain.displayField || domain.displayField.length === 0) {
                    console.log('没有给类', domain, "配置主显示字段, 请到DomainDisplayConfig.groovy中配置"+domain.className +"字段");
                    return $.messager.alert("错误", "没有给类"+domain.className+"配置主显示字段, 请到DomainDisplayConfig.groovy中配置"+domain.className +"字段", 'error');
                }
                var fieldDomain = field? domainMap[field.fieldType]: domain;
                switch (compType) {
                    case "combobox":
                        me.mcombobox($.extend({ url: fieldDomain.listDataUrl }, opts));
                        break;
                    case "combogrid":
                        me.mcombogrid($.extend({ class: fieldDomain.className }, opts));
                        break;
                    case "combotree":
                        me.mcombotree($.extend({ class: fieldDomain.className }, opts));
                        break;
                    case "combotreegrid":
                        me.mcombotreegrid($.extend({ class: fieldDomain.className }, opts));
                        break;
                }
            } else {
                console.error('未知的组件类型: ', me);
            }
        },
        // 初始化easyui组件
        initEasyuiComponent: function(that) {
            var me = $(that),
                    compType = me.attr("m-easyui");
            compType = 'm' + compType;
            me[compType]();
        }
    };

    $(function(){
        // 自动解析
        $.majorParser.parse(document);
    });


})(window, jQuery);