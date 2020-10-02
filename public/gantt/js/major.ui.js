$.fn.extend({
    "mTabs": function (opts) {
        opts = opts || {};
        $(this).each(function () {
            var heads =  $(this).find("li");
            var cls = $(this).attr("for");
            var bodys=$("."+cls);
            bodys.hide();
            var selected = $(this).find("li.tabs-selected").size()>0?$(this).find("li.tabs-selected:first"):$(this).find("li:first");
            var index = heads.index(selected);
            $(bodys.get(index)).show();
            heads.on("click",function () {
                var i = heads.index($(this));
                heads.removeClass("tabs-selected");
                $(this).addClass("tabs-selected");
                bodys.hide();
                $(bodys.get(i)).show();
                if (opts.onTabChange) {
                    opts.onTabChange(i);
                }
            })
        });
    }
});

// 为演示系统， 强制增加ctx
var ctx = "";