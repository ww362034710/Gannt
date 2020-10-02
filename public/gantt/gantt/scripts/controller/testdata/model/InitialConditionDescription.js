// 原始数据 - 初始条件 - 描述
(function(scope){
    var InitialConditionDescription = (function(){
        return function() {
            this.name = null;
            this.type = null;
            this.dimension = null;
            this.value = null;
        };
    })();
    InitialConditionDescription.fromObjList = function(objList) {
        var beanList = [];
        $.each(objList, function(i,obj) {
            var bean = InitialConditionDescription.fromObj(obj);
            beanList.push(bean);
        });
        return beanList;
    };
    InitialConditionDescription.fromObj = function(obj) {
        var bean = new InitialConditionDescription();
        bean.name = obj.name;
        bean.type = obj.type;   //DataType
        bean.dimension = obj.dimension;
        bean.value = obj.value;
        return bean;
    };

    scope.InitialConditionDescription = InitialConditionDescription;
})(window);