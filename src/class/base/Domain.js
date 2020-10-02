import VueSupport from "./VueSupport";
import StringUtil from "../../utils/StringUtil";

/**
 * 领域类
 * 是所有数据库对象的基类
 */
export default class Domain extends VueSupport {

    static CLASS_NAME = '对象';  // 由子类重写 表明该类的中文名  譬如"目标"

    constructor({id}) {
        super();
        this.id = id;
    }

    openAddPage() {    // 打开新建页面 无需重写  重写的话重写 static openAddPage 方法
        this.constructor.openAddPage(this);
    }

    openEditPage() {    // 打开编辑页面 无需重写  重写的话重写 static openEditPage 方法
        this.constructor.openEditPage(this);
    }

    openViewPage() {    // 打开查看详情页面 无需重写  重写的话重写 static openViewPage 方法
        this.constructor.openViewPage(this);
    }

    static openIndexPage() {    // 打开列表页面
        this.$vue.$router.push({
            name: this.getClassNameFirstLower() + "Index",
            params: {
                tags: this.CLASS_NAME + '管理'
            }
        });
    }

    static openAddPage() {    // 打开新建页面
        this.$vue.$router.push({
            name: this.getClassNameFirstLower() + "Edit",
            params: {
                tags: '新建' + this.CLASS_NAME
            }
        });
    }

    static openEditPage(bean) {    // 打开编辑页面
        this.$vue.$router.push({
            name: 'sceneEdit',
            params: {
                tags: '编辑场景-' + bean.id,
                id: bean.id
            }
        });
    }

    static openViewPage(id) {    // 打开查看详情页面
        this.$vue.$router.push({
            name: this.getClassNameFirstLower() + "View",
            params: {
                tags: this.CLASS_NAME + '-' + id
            }
        });
    }

    /** --------------- 以下为不需关心的 --------------- */

    getClassName() { // 获得当前类的名字
        return this.constructor.name;
    }

    getClassNameFirstLower() { // 获得当前类的名字  第一个字母小写
        return StringUtil.firstLower(this.constructor.name);
    }


    static getClassName() { // 获得当前类的名字
        return this.name;
    }

    static getClassNameFirstLower() { // 获得当前类的名字  第一个字母小写
        return StringUtil.firstLower(this.name);
    }

}