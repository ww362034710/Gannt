import routes from './routerConfig.js';

import menus from '@/assets/data/menu.js';
let data = []
let menuData = []

// 筛选出有 title 字段的路由 
function filterMenu(arr, parent) {
    for (let i = 0; i < arr.length; i++) {
        let item = arr[i]
        if (parent) {
            item.parent = parent
        }
        if (item.title) {
            let tempItem = {...item }
            tempItem.id = item.name === 'home' ? 'home' : new Date().getTime() + (item.name || item.path);
            tempItem.pathName = tempItem.name
            delete tempItem.children
            data.push(tempItem)
            if (item.children && item.children.length > 0) {
                filterMenu(item.children, item.title)
            }
        }
    }
}

filterMenu(routes[0].children)

// 从指定树结构找指定字段
function setChildren(arr, itemData) {
    for (let i = 0; i < arr.length; i++) {
        let item = arr[i]
        if (item.title == itemData.parent) {
            if (!item.children) {
                item.children = []
            }
            item.children.push(itemData)
        } else {
            if (item.children && item.children.length > 0) {
                setChildren(item.children, itemData)
            }
        }

    }
}

// 把平级的data数据变成树结构
function filterData(arr) {
    for (let i = 0; i < arr.length; i++) {
        let item = arr[i]
        if (!item.parent) {
            menuData.push(item)
        } else {
            setChildren(menuData, item)
        }
    }
}

filterData(data)
console.log([...menuData, ...menus]);

export default [...menuData, ...menus]