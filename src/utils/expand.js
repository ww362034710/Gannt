// 工具集等

/**
 * 处理请求返回信息  如果成功  则执行成功回调   如果失败 默认弹出提示信息
 */
function whenSuccess(rst, callbackFunction) {
    if (rst.code === 500) {
        this.$message.error(rst.msg || '系统繁忙, 请稍后再试');
    } else if (rst.code === 301) {
        this.$message.warn(rst.msg || '操作出现警告');
    } else {
        if (callbackFunction) {
            callbackFunction.call(this, rst.data);
        } else {
            this.$message.success(rst.msg || '操作成功');
        }
    }
}

/**
 * 根据模板中拥有的字段  把一个对象的值拷贝到另一个对象
 * @param src
 * @param tmpl
 */
export function copyModel(src, dest, tmpl) {
    for (let k in tmpl) {
        dest[k] = src[k];
    }
}

/**
 * 将字符串截短, 多于的使用省略符
 */
export function shortCutText(text, length, append) {
    append = append !== undefined && append || "...";
    if (text && text.length>length) {
        return text.substring(0, length) + append;
    } else {
        return text;
    }
}

/**
 * 需要某个对象必须存在, 成功则调用successcallback, 否则弹出错误提示, 内容为errormsg 默认为"请先选择记录"
 * 一般用于页面进行操作前, 必须选中了某个对象的情形
 * @param obj
 * @param successcallback
 * @param errormsg
 */
export function requireObj(obj, successcallback, errormsg) {
    if(obj){
        successcallback.call(this, obj);
    } else {
        this.$messager.alert({
            title: "系统提示",
            icon: 'info',
            msg: errormsg || '请先选择记录'
        });
    }
}

function generateUUID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid.replace(/-/g, '');
}

export default {
    copyModel: copyModel,
    shortCutText: shortCutText,
    requireObj: requireObj,
    whenSuccess: whenSuccess,
    generateUUID: generateUUID
}