// 仓储
(function() {

    var Store = function(opts){
        opts = opts || {};
        this.identityKey = opts.identityKey || "id";
        this.data =[];
        this.byIdMap = {};
        return this;
    };

    $.extend(Store.prototype, {
        findById: function(_id) {
            var r = null;
            if (this.data && this.data.length>0) {
                for (var i=this.data.length-1;i--;i>=0) {
                    var d = this.data[i];
                    if (d[this.identityKey]==_id) {
                        r = d;
                        break;
                    }
                }
            }
            return r;
        },
        get: function(i) {
            return this.byIdMap[i];
        },
        put: function(i) {
            if (!this.byIdMap.hasOwnProperty(i[this.identityKey])) this.byIdMap[i[this.identityKey]] = [];
            if (this.byIdMap[i[this.identityKey]].indexOf(i)==-1) {
                this.data.push(i);
                this.byIdMap[i[this.identityKey]].push(i);
            }
        },
        remove: function(i) {
            // i: id
            if (this.byIdMap.hasOwnProperty(i[this.identityKey]) ) {
                var index = this.byIdMap[i[this.identityKey]].indexOf(i);
                if (index!=-1) {
                    this.data.splice(index, 1);
                }
                this.data.splice()
            }
        },
        getAll: function(i) {
            return this.data;
        }
    });

    window.Store = Store;
})();