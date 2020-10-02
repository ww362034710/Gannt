StartTest(function (t) {
    t.expectGlobal('Docs'); // JsDuck

    // Ignore some symbols that should be ignore + some bugs in the Ext docs
    var ignoreRe = /Ext.dd|AbstractStore.destroy|DragZone.destroy|DragDrop.destroy|DragSource.destroy|Ext.grid.plugin.Editing.init|afterRender|initComponent|Ext.Base.configClass|Ext.Base.destroy|Ext.data.AbstractStore.getCount/;

    var isPrivate = function(fullName) {
        var priv = false;

        Ext.Array.each(Docs.data.search, function(property) {

            if (property.fullName === fullName){
                priv = property.meta.private;
                return false;
            }
        });

        return priv;
    };


    function findInSuperClasses(sourceCls, property) {
        var cls = sourceCls.superclass.self;

        while (cls && cls.prototype) {
            var name = Ext.ClassManager.getName(cls);
            var fullName = name + '.' + property;

            if (name.match(/^Ext./) && !ignoreRe.test(fullName) && cls.prototype.hasOwnProperty(property)) {
                if (isPrivate(fullName)) {
                    return name;
                } else {
                    return false;
                }
            }
            cls = cls.superclass && cls.superclass.self;
        }

        return false;
    }

    var MAX_NBR_OVERRIDES = Ext.isIE ? 21 : 20;
    var nbrFound = 0;

    t.todo(function(t) {

        Ext.iterate(Ext.ClassManager.classes, function (className, constr) {
            if (!className.match('Gnt.')) return;

            // to exclude duplicating reports for each alternative class name
            if (constr.prototype && className == constr.prototype.$className) {

                for (var o in constr.prototype) {
                    // Check only own properties, and only functions for now
                    if (constr.prototype.hasOwnProperty(o) && typeof constr.prototype[o] === 'function') {
                        var result = findInSuperClasses(constr, o);

                        if (result) {
                            t.fail('Class ' + className + ' overrides ' + result + ':' + o);
                            nbrFound++;
                        }
                    }
                }

            }
        });
    })

    t.isLE(nbrFound, MAX_NBR_OVERRIDES, 'Should not introduce new overrides of private methods. ' + nbrFound + ' found');
})
