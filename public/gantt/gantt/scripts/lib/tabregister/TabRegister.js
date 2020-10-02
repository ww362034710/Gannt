/**
 * 用来注册常用的tab打开方式
 */
(function(){
    /**
     * 重要!!
     *      TABS成员为实体类,一定要与类名一致
     *      每个实体类中一定要包含一个deail, 为默认展示该对象时的页面
     *
     * 调用方法:
     *      TabRegister.open(new TabRegister.TABS.PmTaskInfo.detail({id: 901}));
     */
    var TabRegister = {
        open: function(tabObj) {
            var dataUrl = tabObj.dataUrl,
                menuName = tabObj.menuName;
            parent.layui.index.openTabsPage(dataUrl, menuName)
            // top.$.majortab._addTab({
            //     dataUrl: dataUrl,
            //     menuName: menuName
            // });
        },
        TABS: {
            PmTaskInfo: {
                detail: function(b) {
                    // opt: id, taskId
                    b.id = b.id || b.taskId;

                    return {
                        dataUrl: getUrl(),
                        menuName: getMenuName()
                    };

                    function getUrl() {
                        return ctx + '/pmTaskInfo/taskDetail?taskId=' + b.id;
                    }
                    function getMenuName() {
                        if (!b.name && b.cls!='project' ) {
                            var s = false, msg;
                            $.ajax(ctx + '/pmTaskInfo/show', {
                                data: {id: b.id},
                                async: false,
                                success: function (rst) {
                                    s = rst.success;
                                    if ( rst.success ) {
                                        b = rst.obj;
                                    } else {
                                        msg = rst.msg || "加载任务[ID: "+b.id+"]失败";
                                        top.dialogAlert( msg , -1 );
                                    }
                                }
                            });
                            if (!s) throw msg;
                        }
                        return b.name? "任务[ "+ b.name+" ]" : '任务';
                    }
                },
                // 任务的列表页面
                list: function(o) {
                    // 参数:
                    //      from:  从哪个实体跳转而来 比如'device'
                    //      queryParams:    打开时默认过滤的参数 比如{deviceId: 10}

                    return {
                        dataUrl: getUrl(),
                        menuName: getMenuName()
                    };

                    function getUrl() {
                        var q = o.queryParams;
                        if (q) {
                            var l = [];
                            $.each(q, function(k, v) {
                                l.push(k + "=" + v);
                            });
                            q = '?' + l.join("&")
                        }
                        return ctx + '/pmTaskInfo/list' + q;
                    }
                    function getMenuName() {
                        return "任务列表";
                    }
                }
            },
            PmProjectInfo: {
                detail: function(b) {
                    // opt: id, taskId
                    b.id = b.id || b.projectId;

                    return {
                        dataUrl: getUrl(),
                        menuName: getMenuName()
                    };

                    function getUrl() {
                        return ctx + '/pmProjectInfo/manage?id=' + b.id;
                    }
                    function getMenuName() {
                        if (!b.name) {
                            var s = false, msg;
                            $.ajax(ctx + '/pmProjectInfo/show', {
                                data: {id: b.id},
                                async: false,
                                success: function (rst) {
                                    s = rst.success;
                                    if ( rst.success ) {
                                        b = rst.obj;
                                    } else {
                                        msg = rst.msg || "加载项目[ID: "+b.id+"]失败";
                                        top.dialogAlert( msg , -1 );
                                    }
                                }
                            });
                            if (!s) throw msg;
                        }
                        return "项目[ "+ b.name+" ]";
                    }
                }
            },
            DaProductTestInformation: {     // 试验数据文件
                detail: function(b) {

                    return {
                        dataUrl: getUrl(),
                        menuName: getMenuName()
                    };

                    function getUrl() {
                        return ctx + '/taskTestData/container?testInfoId=' + b.id;
                    }
                    function getMenuName() {
                        return "试验数据";
                    }
                }
            }
        }
    };

    window.TabRegister = TabRegister;
})();