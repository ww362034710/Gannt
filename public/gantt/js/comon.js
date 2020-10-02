;
(function ($) {
    $.fn.extend({
        //计算table高度
        setTableHeight() {
            // 获取当前dom
            let height = this.getTableHeight()
            $(this).datagrid({
                height
            })
        },
        //设置所传元素的dom高度自适应
        setDomHeight() {
            let domHtml = $(this).parent()
            this.outerHeight = 0
            this._getTabPrevHeight(domHtml)
            let winHeight = $(window).height() - 100
            let outerHeight = parseInt(this.outerHeight)
            let height = winHeight - outerHeight;
            $(this).height(height)
        },
        //设置special高度自适应
        getSpecialHeight() {
            let domHtml = $(this).parent()
            this.outerHeight = 0
            this._getTabPrevHeight(domHtml)
            let winHeight = $(window).height()
            let outerHeight = parseInt(this.outerHeight)
            let height = winHeight - outerHeight;
            return height
        },
        // 获取table的高度
        getTableHeight() {
            let domHtml = $(this).parent().parent().parent().parent().parent()
            let winHeight = $(window).height() - 40
            // 用来存储其他的高度
            this.outerHeight = 0
            this._getTabPrevHeight(domHtml)
            let outerHeight = parseInt(this.outerHeight)
            let height = winHeight - outerHeight;
            return height;
        },
        //递归获取兄弟元素高度
        _getTabPrevHeight(dom) {
            if (dom.prev().length) {
                this.outerHeight += dom.prev().outerHeight()
                this._getTabPrevHeight(dom.prev())
            } else {
                this._getTabParHeight(dom)
            }
        },
        //递归获取父元素的外边距
        _getTabParHeight(dom) {
            if (!dom.parent().find('body').length) {
                this.outerHeight += dom.parent().outerHeight() - dom.parent().height()
                this._getTabParHeight(dom.parent())
            }
        }
    })
})(jQuery);

//setTableHeight 计算table高度


/**
 * URL 工具类
 */
var m = {
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
                    params.push(p + '=' + (obj[p] == null ? '' : encodeURIComponent(obj[p])));
            }
            return params.join('&');
        }
    }
};

/**
 * 页面工具类
 */
var Page = {
    /**
     * 如果在iframe内 打开新页签
     * 否则使用window.open
     * @param url
     * @param title
     */
    open: function (url, title) {
        console.log(parent)
        if (parent && parent.addSlide) {
            parent.addSlide({
                title: title,
                url: url
            });
        } else {
            window.open(url);
        }
    },
    /**
     * 关闭当前页面
     */
    close: function (title) {
        if (parent && parent.removeSlide) {
            parent.removeSlide(title);
        } else {
            window.close();
        }
    }
};

/**
 常量
 */
var SCENE_STATUS = {
        TO_APPLY: {
            text: '待审批',
            value: '0'
        },
        APPLYING: {
            text: '审批中',
            value: '1'
        },
        PLANNING: {
            text: '规划中',
            value: '2'
        },
        FAILED: {
            text: '审核未通过',
            value: '3'
        },
        PLANNED: {
            text: '已规划',
            value: '4'
        },
    },
    SCENE_STATUSObj = {
        '0': '待审批',
        '1': '审批中',
        '2': '规划中',
        '3': '审核未通过',
        '4': '已规划'
    },
    SCENE_STATUS_COLORObj = {
        '0': '#daad0f',
        '1': '#47fff8',
        '2': '#daad0f',
        '3': '#fb3737',
        '4': '#11e055'
    };

// 点击a标签在iframe 创建新标签

$(function () {
    $('body').on('click', '.z-url', function (e) {
        e.preventDefault();
        if ($(this).attr('href') == '#') return false;
        if ($(this).attr('href') == 'javascript:;') return false;
        let url = $(this).attr('href')
        let href = '/html/' + $(this).attr('href')
        let title = url.substr(0, url.length - 5)
        Page.open(href, title)
    })

})