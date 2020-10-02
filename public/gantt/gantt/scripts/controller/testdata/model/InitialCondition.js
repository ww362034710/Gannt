// 原始数据 - 初始条件
(function(scope){
    var InitialCondition = (function(){
        return function(){
            this.descriptionList = [];
        };
    })();
    InitialCondition.fromObj = function(obj) {
        var bean = new InitialCondition();
        bean.descriptionList = InitialConditionDescription.fromObjList(obj.descriptionList);
        return bean;
    };

    scope.InitialCondition = InitialCondition;
})(window);