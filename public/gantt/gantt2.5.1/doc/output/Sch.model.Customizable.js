Ext.data.JsonP.Sch_model_Customizable({"tagname":"class","name":"Sch.model.Customizable","autodetected":{},"files":[{"filename":"Customizable.js","href":"Customizable.html#Sch-model-Customizable"}],"extends":"Ext.data.Model","members":[{"name":"customizableFields","tagname":"cfg","owner":"Sch.model.Customizable","id":"cfg-customizableFields","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-Sch.model.Customizable","short_doc":"This class represent a model with customizable field names. ...","component":false,"superclasses":["Ext.data.Model"],"subclasses":["Gnt.model.Assignment","Gnt.model.Calendar","Gnt.model.CalendarDay","Gnt.model.Dependency","Sch.model.Range","Sch.model.Resource"],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.data.Model<div class='subclass '><strong>Sch.model.Customizable</strong></div></div><h4>Subclasses</h4><div class='dependency'><a href='#!/api/Gnt.model.Assignment' rel='Gnt.model.Assignment' class='docClass'>Gnt.model.Assignment</a></div><div class='dependency'><a href='#!/api/Gnt.model.Calendar' rel='Gnt.model.Calendar' class='docClass'>Gnt.model.Calendar</a></div><div class='dependency'><a href='#!/api/Gnt.model.CalendarDay' rel='Gnt.model.CalendarDay' class='docClass'>Gnt.model.CalendarDay</a></div><div class='dependency'><a href='#!/api/Gnt.model.Dependency' rel='Gnt.model.Dependency' class='docClass'>Gnt.model.Dependency</a></div><div class='dependency'><a href='#!/api/Sch.model.Range' rel='Sch.model.Range' class='docClass'>Sch.model.Range</a></div><div class='dependency'><a href='#!/api/Sch.model.Resource' rel='Sch.model.Resource' class='docClass'>Sch.model.Resource</a></div><h4>Files</h4><div class='dependency'><a href='source/Customizable.html#Sch-model-Customizable' target='_blank'>Customizable.js</a></div></pre><div class='doc-contents'><p>This class represent a model with customizable field names. Customizable fields are defined in separate\nclass config <code>customizableFields</code>. The format of definition is just the same as for usual fields:</p>\n\n<pre><code>    Ext.define('BaseModel', {\n        extend      : '<a href=\"#!/api/Sch.model.Customizable\" rel=\"Sch.model.Customizable\" class=\"docClass\">Sch.model.Customizable</a>',\n\n        customizableFields  : [\n            { name      : 'StartDate',  type    : 'date', dateFormat : 'c' },\n            { name      : 'EndDate',    type    : 'date', dateFormat : 'c' }\n        ],\n\n        fields              : [\n            'UsualField'\n        ],\n\n        getEndDate : function () {\n            return \"foo\"\n        }\n    });\n</code></pre>\n\n<p>For each customizable field will be created getter and setter, using the camel-cased name of the field (\"stable name\"),\nprepended with \"get/set\" respectively. They will not overwrite any existing methods:</p>\n\n<pre><code>    var baseModel   = new BaseModel({\n        StartDate   : new Date(2012, 1, 1),\n        EndDate     : new Date(2012, 2, 3)\n    });\n\n    // using getter for \"StartDate\" field\n    // returns date for \"2012/02/01\"\n    var startDate   = baseModel.getStartDate();\n\n    // using custom getter for \"EndDate\" field\n    // returns \"foo\"\n    var endDate     = baseModel.getEndDate();\n</code></pre>\n\n<p>You can change the name of the customizable fields in the subclasses of the model or completely re-define them.\nFor that, add a special property to the class, name of this property should be formed as name of the field with lowercased first\nletter, appended with \"Field\". The value of the property should contain the new name of the field.</p>\n\n<pre><code>    Ext.define('SubModel', {\n        extend      : 'BaseModel',\n\n        startDateField      : 'beginDate',\n        endDateField        : 'finalizeDate',\n\n        fields              : [\n            { name      : 'beginDate',  type    : 'date', dateFormat : 'Y-m-d' },\n        ]\n    });\n\n    var subModel       = new SubModel({\n        beginDate       : new Date(2012, 1, 1),\n        finalizeDate    : new Date(2012, 2, 3)\n    });\n\n    // name of getter is still the same\n    var startDate   = subModel.getStartDate();\n</code></pre>\n\n<p>In the example above the <code>StartDate</code> field was completely re-defined to the <code>beginDate</code> field with different date format.\nThe <code>EndDate</code> has just changed its name to \"finalizeDate\". Note, that getters and setters are always named after \"stable\"\nfield name, not the customized one.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-customizableFields' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.model.Customizable'>Sch.model.Customizable</span><br/><a href='source/Customizable.html#Sch-model-Customizable-cfg-customizableFields' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.model.Customizable-cfg-customizableFields' class='name expandable'>customizableFields</a> : Array<span class=\"signature\"></span></div><div class='description'><div class='short'><p>The array of customizale fields definitions.</p>\n</div><div class='long'><p>The array of customizale fields definitions.</p>\n</div></div></div></div></div></div></div>","meta":{}});