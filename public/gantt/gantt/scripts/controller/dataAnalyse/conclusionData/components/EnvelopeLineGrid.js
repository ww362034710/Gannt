!function(){
    var EnvelopeLineGrid = function() {
        this.CACHE_DATA = {}; // {seriesName: {u:1, p: 2}..}
        this.$grid = null;
        this.currentIndex = 0;
        this.init();
    };
    $.extend(true, EnvelopeLineGrid.prototype, {
        init: function() {
            var self = this;
            this.$grid = $("#scatterParamGrid").propertygrid({
                emptyMsg: '未设置',
                showGroup: true,
                columns: [[
                    {field:'name',title:'参数',width:80,resizable:false,sortable:false},
                    {field:'value',title:'值',width:80,resizable:false,sortable:false}
                ]],
                onAfterEdit: function(index,row,changes) {
                    console.log('propertyGrid afteredit:', index, row, changes);
                    self.addToCache.call(self, row.group, row.key, row.value);
                    controller.autoDraw();
                    // return true;
                }
            });
        },
        refresh: function() {
            var self = this;
            // 缓存当前的设置
            var oldPropertyData = this.$grid.propertygrid('getData').rows;
            if (oldPropertyData.length>0) {
                var groupedData = {};       // 振动-电压: {up:1, down: 2}...
                $.each(oldPropertyData, function(i, propertyData){
                    self.addToCache.call(self, propertyData.group, propertyData.key, propertyData.value);
                });
            }
            debug && console.log('enve refresh mid', this.CACHE_DATA);
            this.$grid.propertygrid('loadData', {total:0, rows: []});
            // 加载新表格
            var legends = manager.legends;
            var theoValues = manager.legendsTheoValue;

            if (legends && legends.length>0) {
                $.each(legends, function(i, legend){
                    self.appendGroup(legend,theoValues[legend]);
                });
            }
        },
        addToCache: function(groupName, key, value) {
            this.box(this.CACHE_DATA, groupName, key, value);
        },
        box: function(box, groupName, key, value) {
            if (!box.hasOwnProperty(groupName)) box[groupName] = {};
            if (key.substring(0,1)=='u') {
                box[groupName]['u'] = value;
            } else {
                box[groupName]['d'] = value;
            }
        },
        appendGroup: function(groupName,theoValue) {

            var cacheData = this.CACHE_DATA.hasOwnProperty(groupName)? this.CACHE_DATA[groupName]: null;
            // this.$grid.propertygrid('appendRow', {
            //     name: '理论值',
            //     key: 'theo_' + this.currentIndex,
            //     value: theoValue,
            //     group: groupName
            // });
            this.$grid.propertygrid('appendRow', {
                name: '上限',
                key: 'u_' + this.currentIndex,
                value: cacheData? cacheData.u: '',
                group: groupName,
                editor: 'text'
            });
            this.$grid.propertygrid('appendRow', {
                name: '下限',
                key: 'd_' + this.currentIndex,
                value: cacheData? cacheData.d: '',
                group: groupName,
                editor: 'text'
            });
            this.currentIndex++;
        },
        data: {
            // 获取包络线的设置
            getData: function() {
                var self = this,
                    result = {},        // {振动-电压: {u:20, d: 10}..}
                    envelopeData = this.$grid.propertygrid('getData').rows;
                if (envelopeData.length>0) {
                    $.each(envelopeData, function(i, data) {
                        var groupName = data.group,
                            key = data.key,
                            value = data.value;
                        self.box.call(self, result, groupName, key, value);
                    })
                }
                console.log('enve getData result', result);
                return result;
            }
        }
    });
    window.EnvelopeLineGrid = EnvelopeLineGrid;
}();
