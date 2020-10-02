Ext.data.JsonP.Gnt_field_StartDate({"tagname":"class","name":"Gnt.field.StartDate","autodetected":{"aliases":true,"alternateClassNames":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"StartDate.js","href":"StartDate.html#Gnt-field-StartDate"}],"extends":"Ext.form.field.Date","aliases":{"widget":["startdatefield"]},"alternateClassNames":[],"mixins":["Gnt.field.mixin.TaskField"],"requires":["Sch.util.Date"],"uses":[],"members":[{"name":"adjustMilestones","tagname":"cfg","owner":"Gnt.field.StartDate","id":"cfg-adjustMilestones","meta":{}},{"name":"highlightColor","tagname":"cfg","owner":"Gnt.field.mixin.TaskField","id":"cfg-highlightColor","meta":{}},{"name":"highlightTaskUpdates","tagname":"cfg","owner":"Gnt.field.mixin.TaskField","id":"cfg-highlightTaskUpdates","meta":{}},{"name":"instantUpdate","tagname":"cfg","owner":"Gnt.field.mixin.TaskField","id":"cfg-instantUpdate","meta":{}},{"name":"keepDuration","tagname":"cfg","owner":"Gnt.field.StartDate","id":"cfg-keepDuration","meta":{}},{"name":"suppressTaskUpdate","tagname":"cfg","owner":"Gnt.field.mixin.TaskField","id":"cfg-suppressTaskUpdate","meta":{}},{"name":"task","tagname":"cfg","owner":"Gnt.field.mixin.TaskField","id":"cfg-task","meta":{}},{"name":"taskStore","tagname":"cfg","owner":"Gnt.field.mixin.TaskField","id":"cfg-taskStore","meta":{}},{"name":"lastHighlight","tagname":"property","owner":"Gnt.field.mixin.TaskField","id":"property-lastHighlight","meta":{"private":true}},{"name":"taskField","tagname":"property","owner":"Gnt.field.StartDate","id":"property-taskField","meta":{"private":true}},{"name":"constructor","tagname":"method","owner":"Gnt.field.StartDate","id":"method-constructor","meta":{}},{"name":"applyChanges","tagname":"method","owner":"Gnt.field.StartDate","id":"method-applyChanges","meta":{}},{"name":"assertValue","tagname":"method","owner":"Gnt.field.StartDate","id":"method-assertValue","meta":{"private":true}},{"name":"beforeBlur","tagname":"method","owner":"Gnt.field.StartDate","id":"method-beforeBlur","meta":{"private":true}},{"name":"checkChange","tagname":"method","owner":"Gnt.field.StartDate","id":"method-checkChange","meta":{"private":true}},{"name":"destroy","tagname":"method","owner":"Gnt.field.StartDate","id":"method-destroy","meta":{"private":true}},{"name":"destroyTaskListener","tagname":"method","owner":"Gnt.field.mixin.TaskField","id":"method-destroyTaskListener","meta":{"private":true}},{"name":"getSuppressTaskUpdate","tagname":"method","owner":"Gnt.field.mixin.TaskField","id":"method-getSuppressTaskUpdate","meta":{"private":true}},{"name":"getValue","tagname":"method","owner":"Gnt.field.StartDate","id":"method-getValue","meta":{}},{"name":"getVisibleValue","tagname":"method","owner":"Gnt.field.StartDate","id":"method-getVisibleValue","meta":{"private":true}},{"name":"highlightField","tagname":"method","owner":"Gnt.field.mixin.TaskField","id":"method-highlightField","meta":{"private":true}},{"name":"onExpand","tagname":"method","owner":"Gnt.field.StartDate","id":"method-onExpand","meta":{"private":true}},{"name":"onSelect","tagname":"method","owner":"Gnt.field.StartDate","id":"method-onSelect","meta":{"private":true}},{"name":"onSetTask","tagname":"method","owner":"Gnt.field.StartDate","id":"method-onSetTask","meta":{"private":true}},{"name":"onTaskUpdateProcess","tagname":"method","owner":"Gnt.field.mixin.TaskField","id":"method-onTaskUpdateProcess","meta":{"private":true}},{"name":"rawToValue","tagname":"method","owner":"Gnt.field.StartDate","id":"method-rawToValue","meta":{"private":true}},{"name":"setSuppressTaskUpdate","tagname":"method","owner":"Gnt.field.mixin.TaskField","id":"method-setSuppressTaskUpdate","meta":{"private":true}},{"name":"setTask","tagname":"method","owner":"Gnt.field.mixin.TaskField","id":"method-setTask","meta":{}},{"name":"setValue","tagname":"method","owner":"Gnt.field.StartDate","id":"method-setValue","meta":{}},{"name":"setVisibleValue","tagname":"method","owner":"Gnt.field.StartDate","id":"method-setVisibleValue","meta":{"private":true}},{"name":"updateReadOnly","tagname":"method","owner":"Gnt.field.mixin.TaskField","id":"method-updateReadOnly","meta":{"private":true}},{"name":"valueToRaw","tagname":"method","owner":"Gnt.field.StartDate","id":"method-valueToRaw","meta":{"private":true}},{"name":"valueToVisible","tagname":"method","owner":"Gnt.field.StartDate","id":"method-valueToVisible","meta":{"private":true}},{"name":"visibleToValue","tagname":"method","owner":"Gnt.field.StartDate","id":"method-visibleToValue","meta":{"private":true}}],"code_type":"ext_define","id":"class-Gnt.field.StartDate","short_doc":"A specialized field for editing the task start date value. ...","component":false,"superclasses":["Ext.form.field.Date"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.form.field.Date<div class='subclass '><strong>Gnt.field.StartDate</strong></div></div><h4>Mixins</h4><div class='dependency'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='docClass'>Gnt.field.mixin.TaskField</a></div><h4>Requires</h4><div class='dependency'><a href='#!/api/Sch.util.Date' rel='Sch.util.Date' class='docClass'>Sch.util.Date</a></div><h4>Files</h4><div class='dependency'><a href='source/StartDate.html#Gnt-field-StartDate' target='_blank'>StartDate.js</a></div></pre><div class='doc-contents'><p>A specialized field for editing the task start date value. This class inherits from the <code>Ext.form.field.Date</code> field\nso any of its configuration options can be used. You can find this field in <a href=\"#!/api/Gnt.widget.taskeditor.TaskForm\" rel=\"Gnt.widget.taskeditor.TaskForm\" class=\"docClass\">Gnt.widget.TaskForm</a>\nand in <a href=\"#!/api/Gnt.column.StartDate\" rel=\"Gnt.column.StartDate\" class=\"docClass\">Gnt.column.StartDate</a> but you can use it in your own components as well (see \"Using field standalone\" below).</p>\n\n<p>This field requires to be bound to <a href=\"#!/api/Gnt.model.Task\" rel=\"Gnt.model.Task\" class=\"docClass\">task</a> instance, which is used for date value processing\n(calendars, holidays etc).</p>\n\n<h1>Task interacting</h1>\n\n<p>By default field instantly applies all changes to the bound task. This can be turned off with the <a href=\"#!/api/Gnt.field.StartDate-cfg-instantUpdate\" rel=\"Gnt.field.StartDate-cfg-instantUpdate\" class=\"docClass\">instantUpdate</a> option.</p>\n\n<h1>Using field standalone</h1>\n\n<p>To use this field standalone you have to provide <a href=\"#!/api/Gnt.model.Task\" rel=\"Gnt.model.Task\" class=\"docClass\">task</a> instance to it. You can make it by two ways:</p>\n\n<ul>\n<li><p>Set the <a href=\"#!/api/Gnt.field.StartDate-cfg-task\" rel=\"Gnt.field.StartDate-cfg-task\" class=\"docClass\">task</a> configuration option at field constructing step. Like this:</p>\n\n<pre><code> var startDateField = Ext.create('<a href=\"#!/api/Gnt.field.StartDate\" rel=\"Gnt.field.StartDate\" class=\"docClass\">Gnt.field.StartDate</a>', {\n     task : someTask\n });\n</code></pre></li>\n<li><p>Or by calling <a href=\"#!/api/Gnt.field.StartDate-method-setTask\" rel=\"Gnt.field.StartDate-method-setTask\" class=\"docClass\">setTask</a> method after field was created. Like this:</p>\n\n<pre><code> startDateField.setTask(someTask);\n</code></pre></li>\n</ul>\n\n\n<p><strong>Note:</strong> If task does not belong to any <a href=\"#!/api/Gnt.data.TaskStore\" rel=\"Gnt.data.TaskStore\" class=\"docClass\">Gnt.data.TaskStore</a> you also <strong>have to</strong> specify <a href=\"#!/api/Gnt.field.StartDate-cfg-taskStore\" rel=\"Gnt.field.StartDate-cfg-taskStore\" class=\"docClass\">taskStore</a> config option for this field otherwise it won't work:</p>\n\n<pre><code>    // some task not inserted in the task store yet\n    var someTask    = new <a href=\"#!/api/Gnt.model.Task\" rel=\"Gnt.model.Task\" class=\"docClass\">Gnt.model.Task</a>({ ... })\n\n    var startDateField = Ext.create('<a href=\"#!/api/Gnt.field.StartDate\" rel=\"Gnt.field.StartDate\" class=\"docClass\">Gnt.field.StartDate</a>', {\n        task        : someTask,\n        // need to provide a task store instance in this case\n        taskStore   : taskStore\n    });\n</code></pre>\n\n<p><strong>Note</strong>, that value displayed in the field can be different from the value in the task model when editing milestones.\nPlease refer to <a href=\"#!/api/Gnt.field.StartDate-cfg-adjustMilestones\" rel=\"Gnt.field.StartDate-cfg-adjustMilestones\" class=\"docClass\">adjustMilestones</a> for details.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-adjustMilestones' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.StartDate'>Gnt.field.StartDate</span><br/><a href='source/StartDate.html#Gnt-field-StartDate-cfg-adjustMilestones' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.StartDate-cfg-adjustMilestones' class='name expandable'>adjustMilestones</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>When set to true, the start/end dates of the milestones will be adjusted -1 day during rendering and editing. ...</div><div class='long'><p>When set to <code>true</code>, the start/end dates of the milestones will be adjusted -1 day <em>during rendering and editing</em>. The task model will still hold unmodified date.</p>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='cfg-highlightColor' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='defined-in docClass'>Gnt.field.mixin.TaskField</a><br/><a href='source/TaskField.html#Gnt-field-mixin-TaskField-cfg-highlightColor' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.mixin.TaskField-cfg-highlightColor' class='name expandable'>highlightColor</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>A color to use when highlighting the field. ...</div><div class='long'><p>A color to use when highlighting the field. See <a href=\"#!/api/Gnt.field.mixin.TaskField-cfg-highlightTaskUpdates\" rel=\"Gnt.field.mixin.TaskField-cfg-highlightTaskUpdates\" class=\"docClass\">highlightTaskUpdates</a> option.</p>\n<p>Defaults to: <code>'#009900'</code></p></div></div></div><div id='cfg-highlightTaskUpdates' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='defined-in docClass'>Gnt.field.mixin.TaskField</a><br/><a href='source/TaskField.html#Gnt-field-mixin-TaskField-cfg-highlightTaskUpdates' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.mixin.TaskField-cfg-highlightTaskUpdates' class='name expandable'>highlightTaskUpdates</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>When set to true, field will highlight itself when its value is changed due to changes in some other field. ...</div><div class='long'><p>When set to <code>true</code>, field will highlight itself when its value is changed due to changes in some other field.\nFor example when changing the end date of the task, its duration will change as well and will highlight itself.</p>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='cfg-instantUpdate' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='defined-in docClass'>Gnt.field.mixin.TaskField</a><br/><a href='source/TaskField.html#Gnt-field-mixin-TaskField-cfg-instantUpdate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.mixin.TaskField-cfg-instantUpdate' class='name expandable'>instantUpdate</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Set to false to prevent automatic applying changes to task on each setValue call. ...</div><div class='long'><p>Set to <code>false</code> to prevent automatic applying changes to task on each setValue call.\nTo apply changes manually one can use applyChanges method.</p>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='cfg-keepDuration' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.StartDate'>Gnt.field.StartDate</span><br/><a href='source/StartDate.html#Gnt-field-StartDate-cfg-keepDuration' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.StartDate-cfg-keepDuration' class='name expandable'>keepDuration</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Pass true to keep the duration of the task (\"move\" the task), false to change the duration (\"resize\" the task). ...</div><div class='long'><p>Pass <code>true</code> to keep the duration of the task (\"move\" the task), <code>false</code> to change the duration (\"resize\" the task).</p>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='cfg-suppressTaskUpdate' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='defined-in docClass'>Gnt.field.mixin.TaskField</a><br/><a href='source/TaskField.html#Gnt-field-mixin-TaskField-cfg-suppressTaskUpdate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.mixin.TaskField-cfg-suppressTaskUpdate' class='name expandable'>suppressTaskUpdate</a> : Number<span class=\"signature\"></span></div><div class='description'><div class='short'>A number flag, when greater than 0 prevents task updates. ...</div><div class='long'><p>A number flag, when greater than 0 prevents task updates.</p>\n<p>Defaults to: <code>0</code></p></div></div></div><div id='cfg-task' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='defined-in docClass'>Gnt.field.mixin.TaskField</a><br/><a href='source/TaskField.html#Gnt-field-mixin-TaskField-cfg-task' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.mixin.TaskField-cfg-task' class='name expandable'>task</a> : <a href=\"#!/api/Gnt.model.Task\" rel=\"Gnt.model.Task\" class=\"docClass\">Gnt.model.Task</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Task being edited. ...</div><div class='long'><p>Task being edited. Field will apply all it's value changes directly to this task (if <a href=\"#!/api/Gnt.field.mixin.TaskField-cfg-instantUpdate\" rel=\"Gnt.field.mixin.TaskField-cfg-instantUpdate\" class=\"docClass\">instantUpdate</a> is <code>true</code>).</p>\n</div></div></div><div id='cfg-taskStore' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='defined-in docClass'>Gnt.field.mixin.TaskField</a><br/><a href='source/TaskField.html#Gnt-field-mixin-TaskField-cfg-taskStore' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.mixin.TaskField-cfg-taskStore' class='name expandable'>taskStore</a> : <a href=\"#!/api/Gnt.data.TaskStore\" rel=\"Gnt.data.TaskStore\" class=\"docClass\">Gnt.data.TaskStore</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Task store should provided if task being edited is not in any task store yet and thus does not have a calendar. ...</div><div class='long'><p>Task store should provided if task being edited is not in any task store yet and thus does not have a calendar.\nIn such case we'll retrieve a calendar from the task store (project calendar).</p>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-lastHighlight' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='defined-in docClass'>Gnt.field.mixin.TaskField</a><br/><a href='source/TaskField.html#Gnt-field-mixin-TaskField-property-lastHighlight' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.mixin.TaskField-property-lastHighlight' class='name expandable'>lastHighlight</a> : Number<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>0</code></p></div></div></div><div id='property-taskField' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.StartDate'>Gnt.field.StartDate</span><br/><a href='source/StartDate.html#Gnt-field-StartDate-property-taskField' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.StartDate-property-taskField' class='name expandable'>taskField</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>'startDateField'</code></p><p>Overrides: <a href=\"#!/api/Gnt.field.mixin.TaskField-property-taskField\" rel=\"Gnt.field.mixin.TaskField-property-taskField\" class=\"docClass\">Gnt.field.mixin.TaskField.taskField</a></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.StartDate'>Gnt.field.StartDate</span><br/><a href='source/StartDate.html#Gnt-field-StartDate-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Gnt.field.StartDate-method-constructor' class='name expandable'>Gnt.field.StartDate</a>( <span class='pre'>config</span> ) : <a href=\"#!/api/Gnt.field.StartDate\" rel=\"Gnt.field.StartDate\" class=\"docClass\">Gnt.field.StartDate</a><span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Gnt.field.StartDate\" rel=\"Gnt.field.StartDate\" class=\"docClass\">Gnt.field.StartDate</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-applyChanges' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.StartDate'>Gnt.field.StartDate</span><br/><a href='source/StartDate.html#Gnt-field-StartDate-method-applyChanges' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.StartDate-method-applyChanges' class='name expandable'>applyChanges</a>( <span class='pre'>[toTask]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>This method applies the changes from the field to the bound task or to the task provided as 1st argument. ...</div><div class='long'><p>This method applies the changes from the field to the bound task or to the task provided as 1st argument.\nIf <a href=\"#!/api/Gnt.field.StartDate-cfg-instantUpdate\" rel=\"Gnt.field.StartDate-cfg-instantUpdate\" class=\"docClass\">instantUpdate</a> option is enabled this method is called automatically after any change in the field.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>toTask</span> : <a href=\"#!/api/Gnt.model.Task\" rel=\"Gnt.model.Task\" class=\"docClass\">Gnt.model.Task</a> (optional)<div class='sub-desc'><p>The task to apply the changes to. If not provided, changes will be applied to the last bound task\n(with <a href=\"#!/api/Gnt.field.StartDate-cfg-task\" rel=\"Gnt.field.StartDate-cfg-task\" class=\"docClass\">task</a> config option or {@link <a href=\"#!/api/Gnt.field.StartDate-method-setTask\" rel=\"Gnt.field.StartDate-method-setTask\" class=\"docClass\">setTask</a>) method)</p>\n</div></li></ul></div></div></div><div id='method-assertValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.StartDate'>Gnt.field.StartDate</span><br/><a href='source/StartDate.html#Gnt-field-StartDate-method-assertValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.StartDate-method-assertValue' class='name expandable'>assertValue</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>it's called in editor.completeEdit() ...</div><div class='long'><p>it's called in editor.completeEdit()</p>\n</div></div></div><div id='method-beforeBlur' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.StartDate'>Gnt.field.StartDate</span><br/><a href='source/StartDate.html#Gnt-field-StartDate-method-beforeBlur' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.StartDate-method-beforeBlur' class='name expandable'>beforeBlur</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>@OVERRIDE ...</div><div class='long'><p>@OVERRIDE</p>\n</div></div></div><div id='method-checkChange' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.StartDate'>Gnt.field.StartDate</span><br/><a href='source/StartDate.html#Gnt-field-StartDate-method-checkChange' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.StartDate-method-checkChange' class='name expandable'>checkChange</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>We overrode 'getValue' method and broke default 'checkChange' method. ...</div><div class='long'><p>We overrode 'getValue' method and broke default 'checkChange' method.\nThis fix is required for validation on-the-fly (as user type).\nhttps://www.assembla.com/spaces/bryntum/tickets/1361</p>\n<h3 class='pa'>Fires</h3><ul><li>change</li></ul></div></div></div><div id='method-destroy' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.StartDate'>Gnt.field.StartDate</span><br/><a href='source/StartDate.html#Gnt-field-StartDate-method-destroy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.StartDate-method-destroy' class='name expandable'>destroy</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-destroyTaskListener' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='defined-in docClass'>Gnt.field.mixin.TaskField</a><br/><a href='source/TaskField.html#Gnt-field-mixin-TaskField-method-destroyTaskListener' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.mixin.TaskField-method-destroyTaskListener' class='name expandable'>destroyTaskListener</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-getSuppressTaskUpdate' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='defined-in docClass'>Gnt.field.mixin.TaskField</a><br/><a href='source/TaskField.html#Gnt-field-mixin-TaskField-method-getSuppressTaskUpdate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.mixin.TaskField-method-getSuppressTaskUpdate' class='name expandable'>getSuppressTaskUpdate</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-getValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.StartDate'>Gnt.field.StartDate</span><br/><a href='source/StartDate.html#Gnt-field-StartDate-method-getValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.StartDate-method-getValue' class='name expandable'>getValue</a>( <span class='pre'></span> ) : Date<span class=\"signature\"></span></div><div class='description'><div class='short'>Returns the value of the field. ...</div><div class='long'><p>Returns the value of the field.</p>\n\n<p><strong>Note</strong>, that this method returns the actual start date value, as it is stored in the data model.\nThe displayed value can be different, when editing milestones.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Date</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getVisibleValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.StartDate'>Gnt.field.StartDate</span><br/><a href='source/StartDate.html#Gnt-field-StartDate-method-getVisibleValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.StartDate-method-getVisibleValue' class='name expandable'>getVisibleValue</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-highlightField' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='defined-in docClass'>Gnt.field.mixin.TaskField</a><br/><a href='source/TaskField.html#Gnt-field-mixin-TaskField-method-highlightField' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.mixin.TaskField-method-highlightField' class='name expandable'>highlightField</a>( <span class='pre'>color, options</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>color</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>options</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-onExpand' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.StartDate'>Gnt.field.StartDate</span><br/><a href='source/StartDate.html#Gnt-field-StartDate-method-onExpand' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.StartDate-method-onExpand' class='name expandable'>onExpand</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>@OVERRIDE ...</div><div class='long'><p>@OVERRIDE</p>\n</div></div></div><div id='method-onSelect' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.StartDate'>Gnt.field.StartDate</span><br/><a href='source/StartDate.html#Gnt-field-StartDate-method-onSelect' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.StartDate-method-onSelect' class='name expandable'>onSelect</a>( <span class='pre'>picker, pickerDate</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>@OVERRIDE ...</div><div class='long'><p>@OVERRIDE</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>picker</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>pickerDate</span> : Object<div class='sub-desc'></div></li></ul><h3 class='pa'>Fires</h3><ul><li>select</li></ul></div></div></div><div id='method-onSetTask' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.StartDate'>Gnt.field.StartDate</span><br/><a href='source/StartDate.html#Gnt-field-StartDate-method-onSetTask' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.StartDate-method-onSetTask' class='name expandable'>onSetTask</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-onTaskUpdateProcess' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='defined-in docClass'>Gnt.field.mixin.TaskField</a><br/><a href='source/TaskField.html#Gnt-field-mixin-TaskField-method-onTaskUpdateProcess' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.mixin.TaskField-method-onTaskUpdateProcess' class='name expandable'>onTaskUpdateProcess</a>( <span class='pre'>task, initiator</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>task</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>initiator</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-rawToValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.StartDate'>Gnt.field.StartDate</span><br/><a href='source/StartDate.html#Gnt-field-StartDate-method-rawToValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.StartDate-method-rawToValue' class='name expandable'>rawToValue</a>( <span class='pre'>rawValue</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>@OVERRIDE ...</div><div class='long'><p>@OVERRIDE</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>rawValue</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-setSuppressTaskUpdate' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='defined-in docClass'>Gnt.field.mixin.TaskField</a><br/><a href='source/TaskField.html#Gnt-field-mixin-TaskField-method-setSuppressTaskUpdate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.mixin.TaskField-method-setSuppressTaskUpdate' class='name expandable'>setSuppressTaskUpdate</a>( <span class='pre'>inc</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>inc</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-setTask' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='defined-in docClass'>Gnt.field.mixin.TaskField</a><br/><a href='source/TaskField.html#Gnt-field-mixin-TaskField-method-setTask' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.mixin.TaskField-method-setTask' class='name expandable'>setTask</a>( <span class='pre'>task</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Binds task to the field. ...</div><div class='long'><p>Binds task to the field.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>task</span> : <a href=\"#!/api/Gnt.model.Task\" rel=\"Gnt.model.Task\" class=\"docClass\">Gnt.model.Task</a><div class='sub-desc'><p>Task to bind.</p>\n</div></li></ul></div></div></div><div id='method-setValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.StartDate'>Gnt.field.StartDate</span><br/><a href='source/StartDate.html#Gnt-field-StartDate-method-setValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.StartDate-method-setValue' class='name expandable'>setValue</a>( <span class='pre'>value</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the value of the field. ...</div><div class='long'><p>Sets the value of the field.</p>\n\n<p><strong>Note</strong>, that this method accept the actual start date value, as it is stored in the data model.\nThe displayed value can be different, when editing milestones.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>value</span> : Date<div class='sub-desc'><p>New value of the field.</p>\n</div></li></ul></div></div></div><div id='method-setVisibleValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.StartDate'>Gnt.field.StartDate</span><br/><a href='source/StartDate.html#Gnt-field-StartDate-method-setVisibleValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.StartDate-method-setVisibleValue' class='name expandable'>setVisibleValue</a>( <span class='pre'>value</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>value</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-updateReadOnly' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='defined-in docClass'>Gnt.field.mixin.TaskField</a><br/><a href='source/TaskField.html#Gnt-field-mixin-TaskField-method-updateReadOnly' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.mixin.TaskField-method-updateReadOnly' class='name expandable'>updateReadOnly</a>( <span class='pre'>task</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>task</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-valueToRaw' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.StartDate'>Gnt.field.StartDate</span><br/><a href='source/StartDate.html#Gnt-field-StartDate-method-valueToRaw' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.StartDate-method-valueToRaw' class='name expandable'>valueToRaw</a>( <span class='pre'>value</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>@OVERRIDE ...</div><div class='long'><p>@OVERRIDE</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>value</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-valueToVisible' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.StartDate'>Gnt.field.StartDate</span><br/><a href='source/StartDate.html#Gnt-field-StartDate-method-valueToVisible' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.StartDate-method-valueToVisible' class='name expandable'>valueToVisible</a>( <span class='pre'>value, task</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>value</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>task</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-visibleToValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.StartDate'>Gnt.field.StartDate</span><br/><a href='source/StartDate.html#Gnt-field-StartDate-method-visibleToValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.StartDate-method-visibleToValue' class='name expandable'>visibleToValue</a>( <span class='pre'>value</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>value</span> : Object<div class='sub-desc'></div></li></ul></div></div></div></div></div></div></div>","meta":{}});