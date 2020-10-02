(function(window, $) {
    var MLinkbutton = new Class({
        Extends: Component,
        initialize: function ($dom, opts) {
            this.parent("linkbutton", $dom, opts);
        },
        init: function ($dom, opts) {
            this.parent($dom, opts);
            // 如果没有for 则找到上一个form / datagrid / treegrid
            if (!this.$for) this.$for = this.$dom.parents("form:eq(0)");
        },
        extendOptions: function() {
            var me = this;
            this.opts.onClick = function () {
                $.each(me.events, function(i, event){
                    if (MLinkbutton.prototype.EVENTS.hasOwnProperty(event)) {
                        MLinkbutton.prototype.EVENTS[event].apply(me);
                    } else {
                        console.error("不支持的自定义DOM事件类型: ", event);
                    }
                });
            };
        },
        EVENTS: {
            /**
             * 提交表单
             */
            submit: function() {
                if (this.$for) {
                    this.$for.submit();
                } else {
                    console.log('声明这个事件的意义是想做什么?');
                }
            },
            /**
             * 清空
             */
            clear: function() {
                if (this.$for) {
                    this.$for.form("clear");
                } else {
                    console.log('声明这个事件的意义是想做什么?');
                }
            },
            /**
             * 记录对象的增删改
             */
            view: function() {
                var id = this.$dom.data('id');
                if (!id) {
                    var row = this.$for.getSelections();
                    if(row){
                        id = row[0].id;
                    } else {
                        return  top.layer.alert("请选择要查看的记录！", {icon: 2});
                    }
                }
                window.location.href = this.class.viewUrl + "?id=" +id;
            },
            /**
             * 新增页面
             */
            add: function() {
                if (eventOpenNewWindow) {
                    window.location.href = this.class.addUrl;
                } else {
                    $("#addWindow").dialog("open");
                }
            },
            /**
             * 编辑页面
             */
            edit: function() {
                var me = this,
                    id = this.$dom.data('id');
                if (!id) {
                    var row = this.$for.getSelections();
                    if(row){
                        id = row[0].id
                    } else {
                        top.layer.alert("请选择要编辑的记录！", {icon: 2});
                        return
                    }
                }
                if (eventOpenNewWindow) {
                    window.location.href = this.class.addUrl + "?id=" + id
                } else {
                    $("#addForm").form("clear");
                    $.ajax({
                        url:me.class.viewUrl,
                        data:{id:row.id},
                        dataType:"json",
                        success:function(response){
                            $("#addForm").form("load",response.obj);
                            $("#addWindow").dialog('open');
                        }
                    });
                }
            },
            /**
             * 放入回收站
             */
            recycle: function() {
                var me = this,
                    id = me.$dom.data('id'),
                    ids = [];
                if (id) {
                    if ($.isArray(id) ) {
                        ids = id;
                    } else {
                        ids = [id];
                    }
                } else {
                    ids = me.$for.getSelectionIds();
                }
                if (ids.length > 0) {
                    top.layer.confirm('确定要删除选择的记录吗？', {
                        btn: ['确定','取消'] //按钮
                    }, function(){
                        $.post(me.class.baseUrl + "/recycle", {ids: ids.join(",")},function(data){
                            if (data.success) {
                                top.layer.alert(data.msg, {icon: 1});
                                me.$for && me.$for.reload();
                            } else {
                                top.layer.alert(data.msg, {icon: 2});
                            }
                        });
                    });
                }else {
                    top.layer.alert('请选择要删除的记录！');
                }
            },
            /**
             * 删除
             */
            delete: function() {
                var me = this,
                    id = me.$dom.data('id'),
                    ids = [];
                if (id) {
                    if ($.isArray(id) ) {
                        ids = id;
                    } else {
                        ids = [id];
                    }
                } else {
                    ids = me.$for.getSelectionIds();
                }
                if (ids.length > 0) {
                    top.layer.confirm('确定要删除选择的记录吗？', {
                        btn: ['确定','取消'] //按钮
                    }, function(){
                        $.post(me.class.deleteUrl, {ids: ids.join(",")},function(data){
                            if (data.success) {
                                top.layer.alert(data.msg, {icon: 1});
                                me.$for && me.$for.reload();
                            } else {
                                top.layer.alert(data.msg, {icon: 2});
                            }
                        });
                    });
                }else {
                    top.layer.alert('请选择要删除的记录！');
                }
            },
            /**
             * 页面后退
             */
            back: function() {
                history.back();
            }
        }
    });

    $.fn.mlinkbutton = function(opts, args) {
        if (typeof opts === "string") {
            return this.data("m")[opts](this, args);
        } else if (!this.data("m")) {
            this.data("m", new MLinkbutton($(this), opts));
        }
    };
})(window, jQuery);