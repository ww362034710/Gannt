Ext.data.JsonP.Sch_model_Range({"tagname":"class","name":"Sch.model.Range","autodetected":{"aliases":true,"alternateClassNames":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"Range.js","href":"Range.html#Sch-model-Range"}],"extends":"Sch.model.Customizable","aliases":{},"alternateClassNames":[],"mixins":[],"requires":["Sch.util.Date"],"uses":[],"members":[{"name":"clsField","tagname":"cfg","owner":"Sch.model.Range","id":"cfg-clsField","meta":{}},{"name":"customizableFields","tagname":"cfg","owner":"Sch.model.Range","id":"cfg-customizableFields","meta":{}},{"name":"endDateField","tagname":"cfg","owner":"Sch.model.Range","id":"cfg-endDateField","meta":{}},{"name":"nameField","tagname":"cfg","owner":"Sch.model.Range","id":"cfg-nameField","meta":{}},{"name":"startDateField","tagname":"cfg","owner":"Sch.model.Range","id":"cfg-startDateField","meta":{}},{"name":"idProperty","tagname":"property","owner":"Sch.model.Range","id":"property-idProperty","meta":{"private":true}},{"name":"forEachDate","tagname":"method","owner":"Sch.model.Range","id":"method-forEachDate","meta":{}},{"name":"fullCopy","tagname":"method","owner":"Sch.model.Range","id":"method-fullCopy","meta":{"private":true}},{"name":"getCls","tagname":"method","owner":"Sch.model.Range","id":"method-getCls","meta":{}},{"name":"getDates","tagname":"method","owner":"Sch.model.Range","id":"method-getDates","meta":{}},{"name":"getEndDate","tagname":"method","owner":"Sch.model.Range","id":"method-getEndDate","meta":{}},{"name":"getName","tagname":"method","owner":"Sch.model.Range","id":"method-getName","meta":{}},{"name":"getStartDate","tagname":"method","owner":"Sch.model.Range","id":"method-getStartDate","meta":{}},{"name":"isValid","tagname":"method","owner":"Sch.model.Range","id":"method-isValid","meta":{"private":true}},{"name":"setCls","tagname":"method","owner":"Sch.model.Range","id":"method-setCls","meta":{}},{"name":"setEndDate","tagname":"method","owner":"Sch.model.Range","id":"method-setEndDate","meta":{}},{"name":"setName","tagname":"method","owner":"Sch.model.Range","id":"method-setName","meta":{}},{"name":"setStartDate","tagname":"method","owner":"Sch.model.Range","id":"method-setStartDate","meta":{}},{"name":"setStartEndDate","tagname":"method","owner":"Sch.model.Range","id":"method-setStartEndDate","meta":{}},{"name":"shift","tagname":"method","owner":"Sch.model.Range","id":"method-shift","meta":{}}],"code_type":"ext_define","id":"class-Sch.model.Range","short_doc":"This class represent a simple date range. ...","component":false,"superclasses":["Ext.data.Model","Sch.model.Customizable"],"subclasses":["Gnt.model.Task","Sch.model.Event"],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.data.Model<div class='subclass '><a href='#!/api/Sch.model.Customizable' rel='Sch.model.Customizable' class='docClass'>Sch.model.Customizable</a><div class='subclass '><strong>Sch.model.Range</strong></div></div></div><h4>Requires</h4><div class='dependency'><a href='#!/api/Sch.util.Date' rel='Sch.util.Date' class='docClass'>Sch.util.Date</a></div><h4>Subclasses</h4><div class='dependency'><a href='#!/api/Gnt.model.Task' rel='Gnt.model.Task' class='docClass'>Gnt.model.Task</a></div><div class='dependency'><a href='#!/api/Sch.model.Event' rel='Sch.model.Event' class='docClass'>Sch.model.Event</a></div><h4>Files</h4><div class='dependency'><a href='source/Range.html#Sch-model-Range' target='_blank'>Range.js</a></div></pre><div class='doc-contents'><p>This class represent a simple date range. It is being used in various subclasses and plugins which operate on date ranges.</p>\n\n<p>Its a subclass of the <a href=\"#!/api/Sch.model.Customizable\" rel=\"Sch.model.Customizable\" class=\"docClass\">Sch.model.Customizable</a>, which is in turn subclass of Ext.data.Model.\nPlease refer to documentation of those classes to become familar with the base interface of this class.</p>\n\n<p>A range has the following fields:</p>\n\n<ul>\n<li><code>StartDate</code>   - start date of the task in the ISO 8601 format</li>\n<li><code>EndDate</code>     - end date of the task in the ISO 8601 format (not inclusive)</li>\n<li><code>Name</code>        - an optional name of the range</li>\n<li><code>Cls</code>         - an optional CSS class to be associated with the range.</li>\n</ul>\n\n\n<p>The name of any field can be customized in the subclass. Please refer to <a href=\"#!/api/Sch.model.Customizable\" rel=\"Sch.model.Customizable\" class=\"docClass\">Sch.model.Customizable</a> for details.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-clsField' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.model.Range'>Sch.model.Range</span><br/><a href='source/Range.html#Sch-model-Range-cfg-clsField' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.model.Range-cfg-clsField' class='name expandable'>clsField</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>The name of the field that holds the range \"class\" value (usually corresponds to a CSS class). ...</div><div class='long'><p>The name of the field that holds the range \"class\" value (usually corresponds to a CSS class). Defaults to \"Cls\".</p>\n<p>Defaults to: <code>'Cls'</code></p></div></div></div><div id='cfg-customizableFields' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.model.Range'>Sch.model.Range</span><br/><a href='source/Range.html#Sch-model-Range-cfg-customizableFields' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.model.Range-cfg-customizableFields' class='name expandable'>customizableFields</a> : Array<span class=\"signature\"></span></div><div class='description'><div class='short'>The array of customizale fields definitions. ...</div><div class='long'><p>The array of customizale fields definitions.</p>\n<p>Defaults to: <code>[{name: 'StartDate', type: 'date', dateFormat: 'c'}, {name: 'EndDate', type: 'date', dateFormat: 'c'}, {name: 'Cls', type: 'string'}, {name: 'Name', type: 'string'}]</code></p><p>Overrides: <a href=\"#!/api/Sch.model.Customizable-cfg-customizableFields\" rel=\"Sch.model.Customizable-cfg-customizableFields\" class=\"docClass\">Sch.model.Customizable.customizableFields</a></p></div></div></div><div id='cfg-endDateField' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.model.Range'>Sch.model.Range</span><br/><a href='source/Range.html#Sch-model-Range-cfg-endDateField' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.model.Range-cfg-endDateField' class='name expandable'>endDateField</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>The name of the field that defines the range end date. ...</div><div class='long'><p>The name of the field that defines the range end date. Defaults to \"EndDate\".</p>\n<p>Defaults to: <code>'EndDate'</code></p></div></div></div><div id='cfg-nameField' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.model.Range'>Sch.model.Range</span><br/><a href='source/Range.html#Sch-model-Range-cfg-nameField' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.model.Range-cfg-nameField' class='name expandable'>nameField</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>The name of the field that defines the range name. ...</div><div class='long'><p>The name of the field that defines the range name. Defaults to \"Name\".</p>\n<p>Defaults to: <code>'Name'</code></p></div></div></div><div id='cfg-startDateField' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.model.Range'>Sch.model.Range</span><br/><a href='source/Range.html#Sch-model-Range-cfg-startDateField' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.model.Range-cfg-startDateField' class='name expandable'>startDateField</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>The name of the field that defines the range start date. ...</div><div class='long'><p>The name of the field that defines the range start date. Defaults to \"StartDate\".</p>\n<p>Defaults to: <code>'StartDate'</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-idProperty' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.model.Range'>Sch.model.Range</span><br/><a href='source/Range.html#Sch-model-Range-property-idProperty' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.model.Range-property-idProperty' class='name expandable'>idProperty</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>'Id'</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-forEachDate' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.model.Range'>Sch.model.Range</span><br/><a href='source/Range.html#Sch-model-Range-method-forEachDate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.model.Range-method-forEachDate' class='name expandable'>forEachDate</a>( <span class='pre'>func, scope</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Iterates over the results from getDates ...</div><div class='long'><p>Iterates over the results from <a href=\"#!/api/Sch.model.Range-method-getDates\" rel=\"Sch.model.Range-method-getDates\" class=\"docClass\">getDates</a></p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>func</span> : Function<div class='sub-desc'><p>The function to call for each date</p>\n</div></li><li><span class='pre'>scope</span> : Object<div class='sub-desc'><p>The scope to use for the function call</p>\n</div></li></ul></div></div></div><div id='method-fullCopy' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.model.Range'>Sch.model.Range</span><br/><a href='source/Range.html#Sch-model-Range-method-fullCopy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.model.Range-method-fullCopy' class='name expandable'>fullCopy</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-getCls' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.model.Range'>Sch.model.Range</span><br/><a href='source/Range.html#Sch-model-Range-method-getCls' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.model.Range-method-getCls' class='name expandable'>getCls</a>( <span class='pre'></span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Gets the \"class\" of the range ...</div><div class='long'><p>Gets the \"class\" of the range</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>cls The \"class\" of the range</p>\n</div></li></ul></div></div></div><div id='method-getDates' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.model.Range'>Sch.model.Range</span><br/><a href='source/Range.html#Sch-model-Range-method-getDates' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.model.Range-method-getDates' class='name expandable'>getDates</a>( <span class='pre'></span> ) : Date[]<span class=\"signature\"></span></div><div class='description'><div class='short'>Returns an array of dates in this range. ...</div><div class='long'><p>Returns an array of dates in this range. If the range starts/ends not at the beginning of day, the whole day will be included.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Date[]</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getEndDate' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.model.Range'>Sch.model.Range</span><br/><a href='source/Range.html#Sch-model-Range-method-getEndDate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.model.Range-method-getEndDate' class='name expandable'>getEndDate</a>( <span class='pre'></span> ) : Date<span class=\"signature\"></span></div><div class='description'><div class='short'>Returns the range end date ...</div><div class='long'><p>Returns the range end date</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Date</span><div class='sub-desc'><p>The end date</p>\n</div></li></ul></div></div></div><div id='method-getName' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.model.Range'>Sch.model.Range</span><br/><a href='source/Range.html#Sch-model-Range-method-getName' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.model.Range-method-getName' class='name expandable'>getName</a>( <span class='pre'></span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Gets the name of the range ...</div><div class='long'><p>Gets the name of the range</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>name The \"name\" of the range</p>\n</div></li></ul></div></div></div><div id='method-getStartDate' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.model.Range'>Sch.model.Range</span><br/><a href='source/Range.html#Sch-model-Range-method-getStartDate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.model.Range-method-getStartDate' class='name expandable'>getStartDate</a>( <span class='pre'></span> ) : Date<span class=\"signature\"></span></div><div class='description'><div class='short'>Returns the range start date ...</div><div class='long'><p>Returns the range start date</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Date</span><div class='sub-desc'><p>The start date</p>\n</div></li></ul></div></div></div><div id='method-isValid' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.model.Range'>Sch.model.Range</span><br/><a href='source/Range.html#Sch-model-Range-method-isValid' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.model.Range-method-isValid' class='name expandable'>isValid</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Simple check if end date is greater than start date ...</div><div class='long'><p>Simple check if end date is greater than start date</p>\n</div></div></div><div id='method-setCls' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.model.Range'>Sch.model.Range</span><br/><a href='source/Range.html#Sch-model-Range-method-setCls' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.model.Range-method-setCls' class='name expandable'>setCls</a>( <span class='pre'>cls</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the \"class\" of the range ...</div><div class='long'><p>Sets the \"class\" of the range</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>cls</span> : String<div class='sub-desc'><p>The new class of the range</p>\n</div></li></ul></div></div></div><div id='method-setEndDate' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.model.Range'>Sch.model.Range</span><br/><a href='source/Range.html#Sch-model-Range-method-setEndDate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.model.Range-method-setEndDate' class='name expandable'>setEndDate</a>( <span class='pre'>date, keepDuration</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the range end date ...</div><div class='long'><p>Sets the range end date</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>date</span> : Date<div class='sub-desc'><p>The new end date</p>\n</div></li><li><span class='pre'>keepDuration</span> : Boolean<div class='sub-desc'><p>Pass <code>true</code> to keep the duration of the task (\"move\" the event), <code>false</code> to change the duration (\"resize\" the event).\nDefaults to <code>false</code></p>\n</div></li></ul></div></div></div><div id='method-setName' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.model.Range'>Sch.model.Range</span><br/><a href='source/Range.html#Sch-model-Range-method-setName' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.model.Range-method-setName' class='name expandable'>setName</a>( <span class='pre'>name</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the \"name\" of the range ...</div><div class='long'><p>Sets the \"name\" of the range</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>The new name of the range</p>\n</div></li></ul></div></div></div><div id='method-setStartDate' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.model.Range'>Sch.model.Range</span><br/><a href='source/Range.html#Sch-model-Range-method-setStartDate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.model.Range-method-setStartDate' class='name expandable'>setStartDate</a>( <span class='pre'>date, keepDuration</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the range start date ...</div><div class='long'><p>Sets the range start date</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>date</span> : Date<div class='sub-desc'><p>The new start date</p>\n</div></li><li><span class='pre'>keepDuration</span> : Boolean<div class='sub-desc'><p>Pass <code>true</code> to keep the duration of the task (\"move\" the event), <code>false</code> to change the duration (\"resize\" the event).\nDefaults to <code>false</code></p>\n</div></li></ul></div></div></div><div id='method-setStartEndDate' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.model.Range'>Sch.model.Range</span><br/><a href='source/Range.html#Sch-model-Range-method-setStartEndDate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.model.Range-method-setStartEndDate' class='name expandable'>setStartEndDate</a>( <span class='pre'>start, end</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the event start and end dates ...</div><div class='long'><p>Sets the event start and end dates</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>start</span> : Date<div class='sub-desc'><p>The new start date</p>\n</div></li><li><span class='pre'>end</span> : Date<div class='sub-desc'><p>The new end date</p>\n</div></li></ul></div></div></div><div id='method-shift' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.model.Range'>Sch.model.Range</span><br/><a href='source/Range.html#Sch-model-Range-method-shift' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.model.Range-method-shift' class='name expandable'>shift</a>( <span class='pre'>unit, amount</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Shift the dates for the date range by the passed amount and unit ...</div><div class='long'><p>Shift the dates for the date range by the passed amount and unit</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>unit</span> : String<div class='sub-desc'><p>The unit to shift by (e.g. range.shift(<a href=\"#!/api/Sch.util.Date-static-property-DAY\" rel=\"Sch.util.Date-static-property-DAY\" class=\"docClass\">Sch.util.Date.DAY</a>, 2); ) to bump the range 2 days forward</p>\n</div></li><li><span class='pre'>amount</span> : Number<div class='sub-desc'><p>The amount to shift</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});