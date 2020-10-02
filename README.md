# mpts

## 变更

* 手路由配置，之前自动路由尚未删除，规则没变；主动配置路由文件添加在 src/pages 文件夹下，添加文件完毕，需要在 src/router/routerConfig.js 中配置对应的路由。参见 home 配置。
* 有时候是用的payload  不是  formData的形式  所以http/index.js加了两个方法明确区分下
* 新增本地代理配置 项目根目录创建 .env.local 文件，写入 proxyUrl= http://sever.majorsofter.com:57699/ 类似这种即可优先于vue.config.js中的代理配置。避免修改提交到远程仓库。

## 编码原则：简洁、直观

* 尽可能少的文件层级结构
* 尽量用2个空格做文档缩进
* 使用第三方库，优先扩展该库而不是覆写or二次封装（ps：三方库有完整的通用的文档）
* 不在组件内写全局样式，要么加 scope 要么写层级样式
* 统一css命名规则，不得使用大小写混合，用中划线链接，框架自带的除外，
* 优先使用 post-payload 请求数据 （具体优先payload还是formData根据接口情况来定，建议payload优先）
* 后端接口，如无特殊情况，一律采用POST请求

## 介绍
* 采用框架   Ant Design 地址：https://www.antdv.com/docs/vue/introduce/
* Ant Design 组件按需加载，用新组件前请在 src/utils/antd 里面进行注册
* css编译器采用 node-sass


## 安装依赖
```
npm install
```

### 开发环境运行
```
npm run serve
```

### 打包
```
npm run build
```

### git地址
```
https://github.com/ww362034710/Gannt.git

### 本地示例地址
启动后使用http://localhost:8010/demoXXX, 如http://localhost:8010/demoganntAndSchedule 见src/views/demo目录
```

### 组合图效果:
![image](https://github.com/ww362034710/Gannt/blob/main/public/demoimg/composed.png)
### 皮肤定制效果：
![image](https://github.com/ww362034710/Gannt/blob/main/public/demoimg/customtheme.png)
### 资源冲突定制效果:
![image](https://github.com/ww362034710/Gannt/blob/main/public/demoimg/quxiantu.png)

