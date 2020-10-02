// 挂载数据
(function() {
    var mountDataDialog={};
    var mountDataWindow;
    var bInit = false;
    var bModal = false;

    // 成功 回调
    var successCallback = null;

    mountDataDialog.init = function(opts) {
        opts = opts || {};

        bInit = true;

        successCallback = opts.successCallback;
        if(opts.bModal){
            bModal= opts.bModal;
        }

        var smallWindow = true;//$(window.top).width()<1025;
        var src=ctx + '/dialog/mountDataWnd';
        var html = '<div id="mountDataWindow" style="width:60%;height:100%;max-width:800px;"> <iframe src="'+src+'" frameborder="0" id="mountDataFrame" style="width:100%; height:98%;"></iframe> </div>';
        // var html = '<div id="mountDataWindow" style="width:60%;height:100%;max-width:800px;">  </div>';
        $(document.body).append(html);


        mountDataWindow = $('#mountDataWindow').dialog({
            cls:'dialog',
            title : '挂载数据',
            closed: true,
            modal: bModal,
            maximized: false,
            width: 650,
            height:450,
            maxWidth: 100000
        });
    }
    mountDataDialog.show = function(id,name){
        if(!bInit){
            mountDataDialog.init();
        }
        var frame = document.getElementById('mountDataFrame'),
            wnd = frame.window || frame.contentWindow;
        wnd.setData(id,name);
        mountDataWindow.dialog('open');
    };
    mountDataDialog.hide = function () {
        mountDataWindow.dialog('close');
    };
    mountDataDialog.successDelegate = function(selectedDataId) {
        if(bModal){
            mountDataDialog.hide();
        }
        if(typeof successCallback == "function") {
            successCallback(selectedDataId)
        }
    };

    window.mountDataDialog=mountDataDialog;
})();
