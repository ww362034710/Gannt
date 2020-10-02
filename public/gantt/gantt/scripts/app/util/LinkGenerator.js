(function() {
    /**
     * 链接生成器
     */
    var taskStore = new Store(),
        projectStore = new Store();

    var LinkGenerator = {
        create: function(type, bean, opt) {
            var opts = $.extend({}, bean, opt);
            if (LinkGenerator.TYPE.hasOwnProperty(type)) {
                return LinkGenerator.TYPE[type].create(opts);
            } else {
                throw "无法生成类型为"+type+"的链接";
            }
        },
        TYPE: {
            PmTaskInfo: {
                /*
                     id: 必传
                     name/taskInfoType/isDelete: 尽量传  不传将从后台取
                     text: 展示的文本, 可以传方法,其接收的参数为task对象   不传则使用任务的名称
                            当传递了text参数, 并且该参数为字符串时, 当不是试验任务或者已经被删除了  则不显示内容
                  */
                create: function(opts) {
                    opts = opts || {};
                    // text 是否设置为字符串
                    var textSot = opts.hasOwnProperty('text') && typeof opts.text == 'string';

                    // 缺少必要参数则从后台获取
                    if (!opts.hasOwnProperty('name') || !opts.hasOwnProperty('taskInfoType') || !opts.hasOwnProperty('isDelete') ) {
                        var task = taskStore.get(opts.id);
                        if (task) {
                            opts = task;
                        } else {
                            var s = false, msg;
                            $.ajax(ctx + '/pmTaskInfo/show', {
                                data: {id: opts.id},
                                async: false,
                                success: function (rst) {
                                    s = rst.success;
                                    if (rst.success && rst.obj) {
                                        opts.name = rst.obj.name;
                                        opts.taskInfoType = rst.obj.taskInfoType;
                                        opts.isDelete = rst.obj.isDelete;
                                        // taskStore.put(rst.obj);
                                    } else {
                                        opts.isDelete = "1";
                                        msg = rst.msg || "加载任务[ID: " + opts.id + "]失败";
                                        //top.dialogAlert(msg, -1);
                                    }
                                }
                            });
                            //if (!s) throw msg;
                        }
                    }

                    var deleted = opts.isDelete + '' == "1";

                    opts.text = !opts.hasOwnProperty('text') ? opts.name :
                                typeof opts.text == 'function'? opts.text(opts):
                                opts.text ;

                    // 如果是正式或临时任务, 并且未删除, 则生成跳转链接
                    if ([PmTaskInfo.TASKINFOTYPE.NORMAL.type , PmTaskInfo.TASKINFOTYPE.TEMP.type ].indexOf( opts.taskInfoType ) != -1 && !deleted ) {
                        return '<a class="link" href="javascript: void(0);" onclick="top.TabRegister.open(new top.TabRegister.TABS.PmTaskInfo.detail({id:' + opts.id + ', name: \'' + opts.name + '\'}));">' + opts.text + '</a>'
                    }
                    // 其他情况下(批次任务/已删除等)  如果设置了文本, 则显示空
                    if (textSot) {
                        return '';
                    }
                    // 其他情况下(批次任务/已删除等)  如果未设置文本, 则显示任务名
                    return opts.text;
                }
            },
            PmProjectInfo: {
                create: function(opts) {
                    if (opts.id) {
                        if (!opts.name) {
                            var project = projectStore.get(opts.id);
                            if (project) {
                                opts = project;
                            } else {
                                var s = false, msg;
                                $.ajax(ctx + '/pmProjectInfo/show', {
                                    data: {id: opts.id},
                                    async: false,
                                    success: function (rst) {
                                        s = rst.success;
                                        if (rst.success && rst.obj) {
                                            opts.name = rst.obj.name;
                                            projectStore.put(rst.obj);
                                        } else {
                                            msg = rst.msg || "加载项目[ID: " + opts.id + "]失败";
                                            //top.dialogAlert(msg, -1);
                                        }
                                    }
                                });
                                //if (!s) throw msg;
                            }
                        }
                        return '<a class="link" href="javascript: void(0);" onclick="top.TabRegister.open(new top.TabRegister.TABS.PmProjectInfo.detail({id:' + opts.id + ', name: \'' + opts.name + '\'}));">' + (opts.showName || opts.name) + '</a>'
                    } else {
                        return '';
                    }
                }
            },
            DaProductTestInformation: {
                create: function(opts) {
                    return '<a class="link" href="javascript: void(0);" onclick="top.TabRegister.open(new top.TabRegister.TABS.DaProductTestInformation.detail({id:'+opts.id+', name: \'试验数据\'}));">试验数据</a>'
                }
            }
        }
    };
    window.LinkGenerator = LinkGenerator;
    return LinkGenerator;
})();