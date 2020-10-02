!function(){
    var BomBaseinfo = function(opts) {
        opts = opts || {};

        this.id = opts.hasOwnProperty('id')? opts.id: null;
        this.name = opts.hasOwnProperty('name')? opts.name: null;
        this.symbol = opts.hasOwnProperty('symbol')? opts.symbol: null;
        this.drawingNo = opts.hasOwnProperty('drawingNo')? opts.drawingNo: null;
        this.code = opts.hasOwnProperty('code')? opts.code: null;
        this.type = opts.hasOwnProperty('type')? opts.type: null;
        this.typeName = opts.hasOwnProperty('typeName')? opts.typeName: null;
        this.typeSymbol = opts.hasOwnProperty('typeSymbol')? opts.typeSymbol: null;
        this.pid = opts.hasOwnProperty('pid')? opts.pid: null;
        this.partType = opts.hasOwnProperty('partType')? opts.partType: null;
        this.researchStep = opts.hasOwnProperty('researchStep')? opts.researchStep: null;
        this.modeId = opts.hasOwnProperty('modeId')? opts.modeId: null;
        this.source = opts.hasOwnProperty('source')? opts.source: null;
        this.mngDepartmentId = opts.hasOwnProperty('mngDepartmentId')? opts.mngDepartmentId: null;
        this.bomVersion = opts.hasOwnProperty('bomVersion')? opts.bomVersion: null;
        this.bomRemark = opts.hasOwnProperty('bomRemark')? opts.bomRemark: null;
        this.isDelete = opts.hasOwnProperty('isDelete')? opts.isDelete: null;
        this.level = opts.hasOwnProperty('level')? opts.level: null;
        // 不再返回 lft rgt
        // this.lft = opts.hasOwnProperty('lft')? opts.lft: null;
        // this.rgt = opts.hasOwnProperty('rgt')? opts.rgt: null;


    };
    // 静态方法
    $.extend( true , BomBaseinfo, {
        // 获得信息
        get : function(id) {
            var bean = null;
            $.ajax(ctx + "/bomBaseinfo/show", {
                data: {id: id},
                async: false,
                success: function(rst) {
                    bean = rst.obj;
                }
            });
            return bean;
        }
    });

    window.BomBaseinfo = BomBaseinfo;
}();