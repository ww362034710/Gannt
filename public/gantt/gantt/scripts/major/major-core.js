(function(window, $){
    // 预处理  将domainMap中各个domain类的fields总结出一个key:value形式的
    $.each(domainMap,function(domainName, domainObj){
        var fieldsMap = {};
        domainObj.fields.forEach(function(field, i){
            fieldsMap[field.name] = field;
        }) ;
        domainObj.fieldsMap = fieldsMap;
    });
    // 额外处理某些特殊字段
    // 展示详情页
    domainMap.PmProjectInfo.fieldsMap.name.formatter = function(v, r, i ){
        return '<a href="javascript:void(0);" onclick="top.layui.index.openTabsPage(\''+ctx + '/pmProjectInfo/detail?id='+ r.id+'\', \''+ v +'\')">'+v+'</a>';
    };


    var major = {
        domainMap: domainMap,
        /**
         * 截取字符串
         * @param t 要截取的原始文本
         * @param l 长度
         * @param a 如果原始文本长度超过了截取长度  需要追加的小尾巴 比如"..."
         * @eg
         *      cutText("Hello world", 5)   ->   "Hello"
         *      cutText("Hello world", 5, "...")   ->  "Hello..."
         * @returns {*}
         */
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
        /**
         * 将form表单元素的值序列化成对象
         * @param form  表单的dom对象
         * @requires jQuery
         * @eg
         *      当form中这个input的name只出现了一次的话  就是一般的key=value
         *      当form中这个input的name出现了多次的话   会拼成key=value1,value2,value3
         * @returns object
         */
        serializeObject : function(form) {
            var o = {};
            $.each(form.serializeArray(), function(index) {
                var n = this['name'], v = this['value'];
                if (o[n]) {
                    o[n] = o[n] + "," + v;
                } else {
                    o[n] = v;
                }
            });
            return o;
        },
        /**
         * 将时间格式化为字符串
         * 格式: 2018-01-01
         * @requires moment
         * @param date 要转换的时间
         * @returns {*}
         */
        dateFormatYMD : function(date){
            if(date==null || date==="")return date;
            if(typeof date === "string"){
                return moment(date,"YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD");
            }else{
                return moment(date).format("YYYY-MM-DD");
            }
        },
        /**
         * 将时间格式化为字符串
         * 格式: 2018-01-01 02:03:04
         * @requires moment
         * @param date 要转换的时间
         * @returns {*}
         */
        dateFormatYMDHms : function (date){
            if(date==null || date==="")return date;
            if(typeof date === "string"){
                return moment(date,"YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
            }else{
                return moment(date).format("YYYY-MM-DD HH:mm:ss");
            }
        },
        /**
         * 平滑数据格式 构建树结构
         * @eg
         *  data = [
         *          [id:1, name: 'n1'],
         *          [id:11, name: 'n11', parentId: 1],
         *          [id:2, name: 'n2']
         *  ]
         *  result = buildTree(data, "parentId", "id", "name")
         *  则result的值为  [
         *                      [id:1, text: 'n1', name: 'n1', children: [
         *                          [id:11, text: 'n1',name: 'n11', parentId: 1]
         *                      ],
         *                      [id:2, text: 'n1',name: 'n2']
         *                 ]
         */
        buildTree: function(data,parentField,idField,textFiled){
            var i, l, treeData = [], tmpMap = [];
            for (i = 0, l = data.length; i < l; i++) {
                tmpMap[data[i][idField]] = data[i];
                data[i]['text'] = data[i][textFiled];
            }
            for (i = 0, l = data.length; i < l; i++) {
                if (tmpMap[data[i][parentField]] && data[i][idField] !== data[i][parentField]) {
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
        URL: {
            page: function () {
                var strUrl = window.location.href;
                var arrUrl = strUrl.split("/");
                var strPage = arrUrl[arrUrl.length - 1];
                return strPage;
            },
            /**
             * 将url中的参数转为对象
             * @eg
             *      当前地址为   /user/index?id=1&name=2
             *      则返回的对象为   {id: "1", name: "2" }
             */
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
            /**
             * 将对象转为url中的参数字符串
             * @eg
             *      如果对象为   {id: "1", name: "2" }
             *      则返回的字符串为   id=1&name=2
             *
             */
            object2Params: function (obj) {
                var params = [];
                for (var p in obj) {
                    if (obj[p] !== undefined)
                        params.push(p + '=' + (obj[p]==null?'':obj[p]));
                }
                return params.join('&');
            }
        },
        /**
         * 下载一个文件
         * 用此方法的通用性较强   比直接拼URL适用范围更广
         * @param url     下载地址
         * @param data    传递的参数
         * @param method  请求方式  默认post
         */
        download: function(url, data, method){ // 获得url和data
            if( url && data ){
                // data 是 string 或者 array/object
                data = typeof data == 'string' ? data : jQuery.param(data); // 把参数组装成 form的 input
                var inputs = '';
                jQuery.each(data.split('&'), function(){
                    var pair = this.split('=');
                    inputs+='<input type="hidden" name="'+ pair[0] +'" value="'+ encodeURI(pair[1]) +'" />';
                }); // request发送请求
                jQuery('<form action="'+ url +'" method="'+ (method||'post') +'">'+inputs+'</form>').appendTo('body').submit().remove();
            }
        },
        /**
         * 扩展jQuery对象
         * 1 找到在数组arr中符合fn的对象    fn可以为一个函数  或者属性名字符串   为字符串时应该传第三个参数比较值
         *      示例:
         *          var arr = [{id:1, name:"a"}, {id:2, name:"b"}];
         *          $.find(arr, function(i){return i.id == 2}) -> {id:2, name:"b"}
         *          $.find(arr, "id", 2) == {id:2, name:"b"}
         * 2 找到在对象中符合fn的对象    fn可以为一个函数  或者属性名字符串   为字符串时应该传第三个参数作为比较值
         *          fn为字符串时  key 代表obj的键  value  代表obj的值   其他的代表 value的属性
         *      示例:
         *          var obj = {datagrid: [1,2], treegrid: [3,4,5], combobox: "hello"};
         *          $.find(obj, function(k, v){return k === "datagrid") -> {key: 'datagrid', value: [1,2]}
         *          $.find(obj, "key", "treegrid")  ->  {key: 'treegrid', value: [3,4,5]}
         *          $.find(obj, "value", "hello")  ->  {key: 'combobox', value: "hello"}
         *          $.find(obj, "length", 3)  -> {key: 'treegrid', value: [3,4,5]}
         * @param arr
         * @param fn
         * @param pv
         * @returns {*}
         */
        find : function(arr, fn, pv) {
            var result = null;
            if ($.isPlainObject(arr)) {
                if (typeof fn === 'function') {
                    for (var key in arr) {
                        var obj = {key: key, value: arr[key]};
                        var r = fn(key, arr[key]);
                        if (r===true) {
                            return obj;
                        }
                    }
                } else {
                    for (var key in arr) {
                        var obj = {key: key, value: arr[key]};
                        if (fn === "key" && key === pv) return obj;
                        else if (fn === "value" && arr[key] === pv) return obj;
                        else if (arr[key].hasOwnProperty(fn) && arr[key][fn] === pv) return obj;
                    }
                }
            } else if (arr && arr.length > 0) {
                if (typeof fn === 'function') {
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
        },
        // 对集合进行处理 并返回新数组
        collect : function( src , fn ) {
            var isArr = $.isArray( src ),
                result = [];
            if ( src ) {
                $.each( src , function (i, item) {
                    var v = isArr ? fn( item ) : fn( i, item);
                    result.push( v );
                });
            }
            return result;
        }
    };

    window.major = $.extend(true, window.major || {}, major);


    // 给一个form加载数据
    $.fn.formLoad = function(data){
        for(var k in data){
            var v =data[k]?data[k]:(typeof data[k] == "number"?0:"");
            $(this).find("[name="+k+"]").each(function(){
                if(["INPUT"].indexOf(this.tagName)>-1 && this.type == "radio"){
                    if(v == this.value)
                        this.checked = "true";
                }else if(["INPUT","TEXTAREA"].indexOf(this.tagName)>-1){
                    $(this).val(v);
                }else if(this.tagName=="IMG"){
                    $(this).attr("src",v);
                }else{
                    if($(this).attr("type")=="html"){
                        $(this).html(v);
                    }else{
                        $(this).text(v);
                    }
                }
            });
        }
    };

    // 保存major框架相关数据的方法  key 可能是个对象   则将对象的每个键值对保存
    $.majorData = function(dom, k, v) {
        var me = $(dom);
        if(typeof v === 'undefined') {
            if ($.isPlainObject(k)) {
                $.each(k, function(k2, v2) {
                    setData(k2, v2);
                })
            } else {
                return me.data("major." + k)
            }
        } else {
            setData(k, v);
        }

        function setData(tk, tv) {
            me.data("major." + tk, tv)
        }
    };
    $.fn.majorData = function(k, v) {
        return $.majorData(this, k, v);
    };

    // 重载方法   实际功能一样   将一个form转为对象, 对于重复name的字段 拼接为  value1,value2,value3的形式
    $.fn.formSerialize = function() {
        return major.serializeObject(this);
    };
    $.fn.serializeForm = function() {
        return major.serializeObject(this);
    };

})(window, jQuery);
