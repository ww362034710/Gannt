// 原始数据
(function(scope){
    var OriginalData = (function(){
        return function(){
            this.group = null;
            this.remark = null;
            this.InitialCondition = null;
            this.time = null;
            this.specification = null;
            this.data = null;
            this.hasOriginalData = null;
        };
    })();
    OriginalData.fromObjList = function(objList) {
        var beanList = [];
        if (objList) {
            $.each(objList, function(i,obj) {
                beanList.push(OriginalData.fromObj(obj));
            });
        }
        return beanList;
    };
    OriginalData.fromObj = function(obj) {
        var bean = new OriginalData();
        if (obj) {
            bean.id = obj.id;
            bean.group = obj.group;
            bean.remark = obj.remark;
            console.log('obj', obj);
            bean.InitialCondition = InitialCondition.fromObj(obj.InitialCondition);
            bean.time = Time.fromObj(obj.time);
            bean.specification = Specification.fromObj(obj.specification);
            bean.data = Data.fromObj(obj.data);
            bean.hasOriginalData = obj.hasOriginalData;
        }
        return bean;
    }

    scope.OriginalData = OriginalData;
})(window);