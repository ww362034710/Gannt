// 所有的VUE对象
export default class VueSupport {
    static $vue;
    constructor(){
        this.$vue = VueSupport.$vue;
    }
    static createFrom(data) { // 创建新对象  data为一个obj 或者一个obj数组 将返回一个数组的本对象
      if (data instanceof Array) {
        return data.map((value)=>{
          return new this(value);
        });
      } else {
        return new this(data);
      }
    }
}