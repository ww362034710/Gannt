// 挂接任务
(function() {
    var mountDialog={};
    var mountTaskWindow;
    var bInit = false;

    // 成功 回调
    var successCallback = null;

    mountDialog.init = function(opts) {
        opts = opts || {};

        bInit = true;

        successCallback = opts.successCallback;


        var smallWindow = true;//$(window.top).width()<1025;
        var src=ctx + '/dialog/mountTaskWnd';
        var html = '<div id="mountTaskWindow" style="width:60%;height:100%;max-width:800px;"> <iframe src="'+src+'" frameborder="0" id="mountTaskFrame" style="width:100%; height:98%;"></iframe> </div>';
        // var html = '<div id="mountTaskWindow" style="width:60%;height:100%;max-width:800px;"> </div>';
        $(document.body).append(html);

        mountTaskWindow = $('#mountTaskWindow').dialog({
            cls:'dialog',
            title : '挂接任务',
            closed: true,
            modal: true,
            maximized: smallWindow,
            width: 1200,
            maxWidth: 100000
            // buttons: [{
            //     text:'取消',
            //     handler:function() {
            //         mountTaskWindow.dialog('close');
            //     }
            // }]
        });
    }
    mountDialog.show = function(id,name){
        if(!bInit){
            mountDialog.init();
        }
        var frame = document.getElementById('mountTaskFrame'),
            wnd = frame.window || frame.contentWindow;
        wnd.setData(id,name);
        mountTaskWindow.dialog('open');
    };
    mountDialog.hide = function () {
        mountTaskWindow.dialog('close');
    };
    mountDialog.successDelegate = function(selectedTaskId) {
        mountDialog.hide();
        if(typeof successCallback == "function") {
            successCallback(selectedTaskId)
        }
    };

    window.mountDialog=mountDialog;
})();
