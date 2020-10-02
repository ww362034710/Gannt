/* 定义全局对象，类似于命名空间或包的作用 */
var major = $.extend(true, window.major || {}, {
    logger: {
        INFO: 0,
        WARN: 1,
        ERROR: 2,
        
        level: 1,
        log: function() {
            if (major.logger.level >= major.logger.INFO ) {
                console.log.apply(console, arguments);
            }
        },
        warn: function() {
            if (major.logger.level >= major.logger.WARN ) {
                console.warn.apply(console, arguments);
            }
        },
        error: function() {
            if (major.logger.level >= major.logger.ERROR ) {
                console.error.apply(console, arguments);
            }
        }
    },
    // 序列化form,一个name有多个值时以","分隔
    serializeObject : function(form) {
        var o = {};
        $.each(form.serializeArray(), function(index) {
            if (o[this['name']]) {
                o[this['name']] = o[this['name']] + "," + this['value'];
            } else {
                o[this['name']] = this['value'];
            }
        });
        return o;
    },
    dateFormatYMD: function(date){
        if(date==null || date=="")return date;
        if(typeof date =="string"){
            return moment(date,"YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD");
        }else{
            return moment(date).format("YYYY-MM-DD");
        }
    },
    dateFormatYMDHm: function(date){
        if(date==null || date=="")return date;
        if(typeof date =="string"){
            return moment(date,"YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm");
        }else{
            return moment(date).format("YYYY-MM-DD HH:mm");
        }
    },
    dateFormatYMDHms: function(date){
        if(date==null || date=="")return date;
        if(typeof date =="string"){
            return moment(date,"YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
        }else{
            return moment(date).format("YYYY-MM-DD HH:mm:ss");
        }
    },
    /**
     * 平滑数据格式 构建树结构
     */
    buildTree: function(data,parentField,idField,textFiled){
        var i, l, treeData = [], tmpMap = [];
        for (i = 0, l = data.length; i < l; i++) {
            tmpMap[data[i][idField]] = data[i];
            data[i]['text'] = data[i][textFiled];
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
    },
    // 寻找树状结构一个叶子节点的所有上级节点
    upstreamTreeParents: function(data, leaf, parentField, idField) {
        var r = [];
        if (data && data.length>0) {
            for (var i=0;i<data.length;i++) {
                var item = data[i];
                if (leaf[parentField]==item[idField]) {
                    r.push(item);
                    r = r.concat(major.upstreamTreeParents(r, item, parentField, idField));
                }
            }
        }
        return r;
    },
    // 准备datagrid的数据 导出
    // checked: 是否导出所有数据  否则仅展示的数据
    // 示例
    /*
        var json =  major._datagridParse(grid);
        json.title =$('title').text();
        var data = JSON.stringify(json);
        major._exportExcel(data);
    */
    _datagridParse : function(datagrid,checked){
        var grid = datagrid;
        if(typeof(grid) == 'string'){
            grid = $(grid);
        }
        var data = {};
        data.header = [];
        data.rows = [];
        data.objRows = [];
        data.fields = [];
        data.footer = [];
        data.objFooter = [];
        data.footerCount = [];
        data.total = 0;
        var selected = [];
        //表头
        grid.datagrid("getPanel").find(".datagrid-header .datagrid-htable").each(function(){
            $(this).find("tr.datagrid-header-row").each(function(i){
                $(this).find("td:not([field='ck'])").each(function(){
                    if($(this).css("display")!='none'){
                        var it = $(this).find("span:not(.datagrid-sort-icon),div.datagrid-cell-group");
                        data.header.push(it.text());
                    }
                });
            });
        })
        //表内容
        grid.datagrid("getPanel").find(".datagrid-body .datagrid-btable").each(function(){
            $(this).find("tr.datagrid-row").each(function(i){
                data.total = i+1;
                if(data.rows.length < data.total){
                    data.rows.push([]);
                    data.objRows.push({});
                }
                var checkbox = $(this).find("td[field='ck'] input:checkbox");
                if(checkbox.size()==1){
                    selected[i] = checkbox.is(':checked');
                }else{
                    selected[i] = selected[i] || (selected[i]=== undefined);
                }
                $(this).find("td:not([field='ck'])").each(function(j){
                    var field = $(this).attr("field");
                    if(i==0){data.fields.push(field?field:"_index")}
                    if($(this).css("display")!='none'){
                        var it = $(this).find("div.datagrid-cell,div.datagrid-cell-rownumber");
                        data.rows[i].push(it.text());
                        data.objRows[i][field?field:"_index"]=it.text();
                    }
                });
            });
        })
        //表footer
        grid.datagrid("getPanel").find(".datagrid-footer .datagrid-ftable").each(function(){
            $(this).find("tr.datagrid-row").each(function(i){
                data.footerCount = i+1;
                if(data.footer.length < data.footerCount){
                    data.footer.push([]);
                    data.objFooter.push({});
                }
                $(this).find("td:not([field='ck'])").each(function(j){
                    var field = $(this).attr("field");
                    if($(this).css("display")!='none'){
                        var it = $(this).find("div.datagrid-cell,div.datagrid-cell-rownumber");
                        data.footer[i].push(it.text());
                        data.objFooter[i][field?field:"_index"]=it.text();
                    }
                });
            });
        })
        if(checked){
            var newrows = [];
            for(var i=0,l=selected.length;i<l;i++){
                if(selected[i]){
                    newrows.push(data.rows[i]);
                }
            }
            data.rows = newrows;
        }
        return data;
    },
    // 导出datagrid的数据到excel
    _exportExcel : function(data){
        $("form.hiddenDataGridForm").remove();
        var form = $("<form style='display:none' calss='hiddenDataGridForm' action='"+ctx+"/dataExport/exportDataGrid' target='_blank' method='post' ><input type='hidden' name='data' /></form>");
        form.find("input").val(data);
        $("body").append(form);
        form.submit();
    },
    MATH: {
        max: function(arr) {
            var r;
            if (typeof arr!='undefined' && arr.length>0) {
                r = arr.reduce(function(pre, cur) {
                    return Math.max(pre,cur);
                });
            } else {
                r = '-'
            }
            return r
        },
        min: function(arr) {
            var r;
            if (typeof arr!='undefined' && arr.length>0) {
                r = arr.reduce(function(pre, cur) {
                    return Math.min(pre,cur);
                });
            } else {
                r = '-'
            }
            return r
        },
        avg: function(arr) {
            var r, total = 0, count = 0;
            if (typeof arr!='undefined' && arr.length>0) {
                $.each(arr, function(i , e) {
                    if (typeof e != 'undefined' && e !== null ) {
                        total += parseFloat( e );
                        count++;
                    }
                });
            }
            if (count!=0) {
                r = total / count;
                r = Math.floor(r * Math.pow(10 , 3 )) / Math.pow(10 , 3);
            } else {
                r = '-';
            }
            return r
        }
    },
    COLLECTIONS: {
        // 检测数组中有无重复项项
        existsDuplicate: function(arr) {
            var seen = {};

            return arr.filter(function(item) {
                return seen.hasOwnProperty(item) ? false : (seen[item] = true);
            });
        },
        // 找到数组中的重复项项
        findDuplicate: function(arr) {
            var seen = {};
            var duplicateArr = [];
            var duplicateArrSeen = {};
            arr.filter(function(item) {
                seen.hasOwnProperty(item) ? (duplicateArrSeen.hasOwnProperty(item) ? null : ( duplicateArrSeen[item] = true && duplicateArr.push( item ) ) ) : (seen[item] = true);
            });
            return duplicateArr;
        }
    },
    cutText: function(t, l, a) {
        t = t || '';

        var len = t.length || 0;
        if (l && len > l) {
            t = t.substring(0, l);
            if ( a ) {
                t += a;
            }
        }
        return t
    },
    URL: {
        page: function () {
            var strUrl = window.location.href;
            var arrUrl = strUrl.split("/");
            var strPage = arrUrl[arrUrl.length - 1];
            return strPage;
        },
        params2Object: function () {
            var args = {};
            var query = location.search.substring(1);
            var pairs = query.split("&");
            for (var i = 0; i < pairs.length; i++) {
                var pos = pairs[i].indexOf('=');
                if (pos == -1) continue;
                var argname = pairs[i].substring(0, pos); // Extract the name
                var value = pairs[i].substring(pos + 1); // Extract the value
                value = decodeURIComponent(value); // Decode it, if needed
                args[argname] = value;
            }
            return args; // Return the object
        },
        object2Params: function (obj) {
            var params = [];
            for (var p in obj) {
                if (obj[p] !== undefined)
                    params.push(p + '=' + (obj[p]==null?'':obj[p]));
            }
            return params.join('&');
        }
    },
    download:  function(url, data, method){ // 获得url和data
        if( url && data ){
            // data 是 string 或者 array/object
            data = typeof data == 'string' ? data : jQuery.param(data); // 把参数组装成 form的 input
            var inputs = '';
            jQuery.each(data.split('&'), function(){
                var pair = this.split('=');
                inputs+='<input type="hidden" name="'+ pair[0] +'" value="'+ encodeURI(pair[1]) +'" />';
            }); // request发送请求
            jQuery('<form action="'+ url +'" method="'+ (method||'post') +'">'+inputs+'</form>').appendTo('body').submit().remove();
        };
    },
    dataCollector: (function(){
        /**
         * 注册一个获取数据对象的方法
         * 好处: 懒加载  而且只需加载一次  而且避免了忘记extend新对象时造成其他依赖该数据对象组件异常的问题
         * 坏处: 同步后台查询  大数据量的情况下可能慢
         * 主要用于多个combox  tree 等等  共用同一份数据时
         * 替代
         *      $.post(dataUrl..,function(){
         *          $(xxx).each(function(){
         *              $(this).combox({
         *                  data: $.extend([], data)
         *              }
         *          })
         *     })
         * 为
         *      $(xxx).each(function(){
         *           $(this).combox({
         *               data: major.dataCollect(dataUrl)
         *           });
         *       })
         */
        var _data = {},             // 保存url所获取到的数据
            defaultParams = {       // 默认值
                loadErrorMsg: '加载数据失败',
                params: {}
            };
        return function(dataUrl, opts) {
            opts = $.extend(defaultParams, opts || {});

            var loadErrorMsg = opts.loadErrorMsg,
                params = opts.params || {}; //传递到后台的参数

            var key = dataUrl + JSON.stringify(params);
            if (!_data.hasOwnProperty(key)) {
                $.ajax(dataUrl, {
                    async: false,
                    data: params,
                    success: function (rst) {
                        if ($.isArray(rst)) {
                            _data[key] = rst;
                        } else {
                            whenSuccess(rst, function (data) {
                                _data[key] = data;
                            }, loadErrorMsg);
                        }
                    }
                });
            }
            return $.extend([], _data[key]);
        }
    })()
});

// 扩展jQuery对象
// 找到在数组arr中符合fn的对象
// 示例:
//      var arr = [{id:1, name:"a"}, {id:2, name:"b"}];
//      $.find(arr, function(i){return i.id == 2}) == {id:2, name:"b"}
//      $.find(arr, "id", 2) == {id:2, name:"b"}
major.find = function(arr, fn, pv) {
    var result = null;
    if (arr && arr.length>0) {
        if (typeof fn == 'function') {
            $.each(arr, function (i, item) {
                var r = fn.call(this, item);
                if (r == true) {
                    result = item;
                    return false;
                }
            });
        } else {
            $.each(arr, function (i, item) {
                var r = item[fn] == pv;
                if (r == true) {
                    result = item;
                    return false;
                }
            });
        }
    }
    return result;
};
// 对集合进行处理 并返回新数组
major.collect = function( src , fn ) {
    var isArr = $.isArray( src ),
        result = [];
    if ( src ) {
        $.each( src , function (i, item) {
            var v = isArr ? fn( item ) : fn( i, item);
            result.push( v );
        });
    }
    return result;
};

// 找到在数组arr中符合fn的对象(只取第一个匹配的index)
// 示例:
//      var arr = [{id:1, name:"a"}, {id:2, name:"b"}];
//      $.indexOf(arr, function(i){return i.id == 2}) == 1
//      $.indexOf(arr, "id", 2) == 1
$.indexOf = function(arr, fn, pv) {
    var index = -1;
    if (arr && arr.length>0) {
        if (typeof fn == 'function') {
            $.each(arr, function (i, item) {
                var r = fn.call(this, item);
                if (r == true) {
                    index = i;
                    return false;
                }
            });
        } else {
            $.each(arr, function (i, item) {
                var r = item[fn] == pv;
                if (r == true) {
                    index = i;
                    return false;
                }
            });
        }
    }
    return index;
};
// 搜索数组arr/对象中是否存在符合fn的对象
// 示例:
//      var arr = [{id:1, name:"a"}, {id:2, name:"b"}];
//      $.any(arr, function(i){return i.id == 2}) == true
//      $.any(arr, "id", 2) == true

//      var obj = {id:1, name:"a"};
//      $.any(obj, "id", 1) == true
//      $.any(obj, function(k,v){return v=="a"}) == true
//      $.any(obj, "id", 2) == false
$.any = function(arr, fn, pv) {
    var result = false;
    // 对象
    if ($.isPlainObject(arr)) {
        if (typeof fn == 'function') {
            $.each(arr, function (i, item) {
                var r = fn.call(this, i, item);
                if (r == true) {
                    result = true;
                    return false;
                }
            });
        } else {
            result = (arr[fn] == pv);
        }
    } else {
        // 数组
        result = $.indexOf(arr, fn, pv)!=-1;
    }
    return result;
};

// 序列化form,一个name有多个值时以","分隔
$.fn.serializeForm = function() {
    if (this[0].tagName == 'FORM') {
        return major.serializeObject(this);
    }
};

// 加上全局的ajax 默认progress
(function(){
    var queue = 0,
        progressing = false;
    //
    $.ajaxSetup ({
        cache: false,
        type : 'POST'/*,
        // 发送请求前 弹出加载框
        beforeSend: function(callbackContext, jqXHR, s ) {
            if($.messager && $.messager.progress) {
                queue++;
                if (queue>0 && !progressing) {
                    $.messager.progress();
                    progressing = true;
                }
            }
        }*/
    });

    // 给全局绑定ajaxComplete事件
    $(document).ajaxComplete(function(){
        if($.messager && $.messager.progress) {
            queue--;
            if (queue==0) {
                $.messager.progress('close');
                progressing = false;
            }
        }
    })
})();

Loading = function (bool, text) {
    var ajaxbg = top.$("#loading_background,#loading_manage");
    if (bool) {
        ajaxbg.show();
    } else {
        if (top.$("#loading_manage").attr('istableloading') == undefined) {
            ajaxbg.hide();
            // top.$(".ajax-loader").remove();
        }
    }
    if (!!text) {
        top.$("#loading_manage").html(text);
    } else {
        top.$("#loading_manage").html("正在加载，请稍后……");
    }
    top.$("#loading_manage").css("left", (top.$('body').width() - top.$("#loading_manage").width()) / 2 - 54);
    top.$("#loading_manage").css("top", (top.$('body').height() - top.$("#loading_manage").height()) / 2);
}
tabiframeId = function () {
    var iframeId = top.$(".LRADMS_iframe:visible").attr("id");
    return iframeId;
}
reload = function () {
    location.reload();
    return false;
}

dialogTop = function (content, type) {
    $(".tip_container").remove();
    var bid = parseInt(Math.random() * 100000);
    $("body").prepend('<div id="tip_container' + bid + '" class="container tip_container"><div id="tip' + bid + '" class="mtip"><i class="micon"></i><span id="tsc' + bid + '"></span><i id="mclose' + bid + '" class="mclose"></i></div></div>');
    var $this = $(this);
    var $tip_container = $("#tip_container" + bid);
    var $tip = $("#tip" + bid);
    var $tipSpan = $("#tsc" + bid);
    //先清楚定时器
    clearTimeout(window.timer);
    //主体元素绑定事件
    $tip.attr("class", type).addClass("mtip");
    $tipSpan.html(content);
    $tip_container.slideDown(300);
    //提示层隐藏定时器
    window.timer = setTimeout(function () {
        $tip_container.slideUp(300);
        $(".tip_container").remove();
    }, 4000);
    $("#tip_container" + bid).css("left", ($(window).width() - $("#tip_container" + bid).width()) / 2);
};
dialogOpen = function (options) {
    Loading(true);
    var defaults = {
        id: null,
        title: '系统窗口',
        width: "100px",
        height: "100px",
        url: '',
        shade: 0.3,
        btn: ['确认', '关闭'],
        callBack: null
    };
    var options = $.extend(defaults, options);
    var _url = options.url;
    var _width = top.$.windowWidth() > parseInt(options.width.replace('px', '')) ? options.width : top.$.windowWidth() + 'px';
    var _height = top.$.windowHeight() > parseInt(options.height.replace('px', '')) ? options.height : top.$.windowHeight() + 'px';
    top.layer.open({
        id: options.id,
        type: 2,
        shade: options.shade,
        title: options.title,
        fix: false,
        area: [_width, _height],
        content: top.contentPath + _url,
        btn: options.btn,
        yes: function () {
            options.callBack(options.id)
        }, cancel: function () {
            if (options.cancel != undefined)
            {
                options.cancel();
            }
            return true;
        }
    });
}
dialogContent = function (options) {
    var defaults = {
        id: null,
        title: '系统窗口',
        width: "100px",
        height: "100px",
        content: '',
        btn: ['确认', '关闭'],
        callBack: null
    };
    var options = $.extend(defaults, options);
    top.layer.open({
        id: options.id,
        type: 1,
        title: options.title,
        fix: false,
        area: [options.width, options.height],
        content: options.content,
        btn: options.btn,
        yes: function () {
            options.callBack(options.id)
        }
    });
}
dialogAlert = function (content, type) {
    if (type == -1) {
        type = 2;
    }
    top.layer.alert(content, {
        icon: type,
        title: "提示"
    });
}
dialogConfirm = function (content, callBack) {
    top.layer.confirm(content, {
        icon: 7,
        title: "提示",
        btn: ['确认', '取消'],
    }, function () {
        callBack(true);
    }, function () {
        callBack(false)
    });
}
dialogMsg = function (content, type) {
    if (type == -1) {
        type = 2;
    }
    top.layer.msg(content, { icon: type, time: 4000, shift: 5 });
}
dialogClose = function () {
    try {
        var index = top.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        var $IsdialogClose = top.$("#layui-layer" + index).find('.layui-layer-btn').find("#IsdialogClose");
        var IsClose = $IsdialogClose.is(":checked");
        if ($IsdialogClose.length == 0) {
            IsClose = true;
        }
        if (IsClose) {
            top.layer.close(index);
        } else {
            location.reload();
        }
    } catch (e) {
        alert(e)
    }
}
function ajaxLoading(t) {
    var i;
    // if (window.parent) {
    //     i = parent.$("#ajaxLoader");
    // } else {
        i = $("#ajaxLoader");
    // }
    t ? i.show() : i.fadeOut()
}
function setThemeType(){
    if(top!=window){
        if(top && top.theme){
            switch (top.theme.type) {
                case "1":
                    $("body").addClass("uiDefault");
                    break;
                case "2":
                    $("body").addClass("uiLTE");
                    break;
                case "3":
                    $("body").addClass("uiWindows");
                    break;
                case "4":
                    $("body").addClass("uiPretty")
            }
        }

    }

}

$(function(){
    window.onload = function () {
        // Loading(true);
        //setThemeType();
        //ajaxLoading(0);
    }
});


/*
 自动解析
 支持 mh-tab
    options:
        dataUrl:
        menuName:
        dataId: 可选

 依赖:  使用 easyui的parser解析参数
  */
$(function() {
    var pluginPrefix = '.mh-' ,
        supportedPlugins = ['tab'];
    supportedPlugins.each(function(pluginTag, _s){
        $(pluginPrefix + pluginTag).each(function(){
            var $t = $(this),
                opts = $.parser.parseOptions(this, false);
            $.data( $t, 'mh.tab' , opts );

            $t.off('click.mh.tab').on('click.mh.tab', function(e){
                top.$.majortab._addTab(opts);
                e.stopPropagation();
            });
        });
    });
});

$.ajaxSetup({
    complete:function(XMLHttpRequest){
        // 通过XMLHttpRequest取得响应头
        if (XMLHttpRequest.getResponseHeader && XMLHttpRequest.getResponseHeader("AjaxRedirect") == "AjaxRedirect") {
            var win = window;
            while (win != win.top){
                win = win.top;
            }
            win.location.href= win.contentPath + "/login";
        }
    }
});
