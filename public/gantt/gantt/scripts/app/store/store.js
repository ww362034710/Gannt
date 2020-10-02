(function(){
    var Store = function() {
        this._store = [];

        $.extend(this, {
            put: function(o) {
                // TODO 去重
                this._store.push(o);
            },
            get: function(_id) {
                var r = null;
                if (this._store.length>0) {
                    $.each(this._store, function(i,item) {
                        if (item.id==_id) {
                            r = item;
                            return false;
                        }
                    });
                    return r;
                }
            }
        });
    };

    window.Store = Store;
})();