Ext.data.JsonP.Gnt_field_Dependency({"tagname":"class","name":"Gnt.field.Dependency","autodetected":{"aliases":true,"alternateClassNames":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"Dependency.js","href":"Dependency.html#Gnt-field-Dependency"}],"extends":"Ext.form.field.Text","aliases":{"widget":["dependencyfield"]},"alternateClassNames":["Gnt.widget.DependencyField"],"mixins":["Gnt.mixin.Localizable"],"requires":["Gnt.util.DependencyParser"],"uses":[],"members":[{"name":"dependencyParserConfig","tagname":"cfg","owner":"Gnt.field.Dependency","id":"cfg-dependencyParserConfig","meta":{}},{"name":"invalidDependencyText","tagname":"cfg","owner":"Gnt.field.Dependency","id":"cfg-invalidDependencyText","meta":{"deprecated":{"text":"<p>Please use <a href=\"#!/api/Gnt.field.Dependency-cfg-l10n\" rel=\"Gnt.field.Dependency-cfg-l10n\" class=\"docClass\">l10n</a> instead.</p>\n"}}},{"name":"invalidFormatText","tagname":"cfg","owner":"Gnt.field.Dependency","id":"cfg-invalidFormatText","meta":{"deprecated":{"text":"<p>Please use <a href=\"#!/api/Gnt.field.Dependency-cfg-l10n\" rel=\"Gnt.field.Dependency-cfg-l10n\" class=\"docClass\">l10n</a> instead.</p>\n"}}},{"name":"l10n","tagname":"cfg","owner":"Gnt.field.Dependency","id":"cfg-l10n","meta":{}},{"name":"separator","tagname":"cfg","owner":"Gnt.field.Dependency","id":"cfg-separator","meta":{}},{"name":"type","tagname":"cfg","owner":"Gnt.field.Dependency","id":"cfg-type","meta":{}},{"name":"useSequenceNumber","tagname":"cfg","owner":"Gnt.field.Dependency","id":"cfg-useSequenceNumber","meta":{}},{"name":"activeLocaleId","tagname":"property","owner":"Sch.mixin.Localizable","id":"property-activeLocaleId","meta":{"private":true}},{"name":"dependencyParser","tagname":"property","owner":"Gnt.field.Dependency","id":"property-dependencyParser","meta":{}},{"name":"legacyMode","tagname":"property","owner":"Sch.mixin.Localizable","id":"property-legacyMode","meta":{"private":true}},{"name":"task","tagname":"property","owner":"Gnt.field.Dependency","id":"property-task","meta":{"private":true}},{"name":"constructor","tagname":"method","owner":"Gnt.field.Dependency","id":"method-constructor","meta":{}},{"name":"L","tagname":"method","owner":"Sch.mixin.Localizable","id":"method-L","meta":{}},{"name":"applyChanges","tagname":"method","owner":"Gnt.field.Dependency","id":"method-applyChanges","meta":{}},{"name":"applyLocale","tagname":"method","owner":"Sch.mixin.Localizable","id":"method-applyLocale","meta":{"private":true}},{"name":"getDependencies","tagname":"method","owner":"Gnt.field.Dependency","id":"method-getDependencies","meta":{}},{"name":"getDisplayValue","tagname":"method","owner":"Gnt.field.Dependency","id":"method-getDisplayValue","meta":{"private":true}},{"name":"getErrors","tagname":"method","owner":"Gnt.field.Dependency","id":"method-getErrors","meta":{"private":true}},{"name":"getTaskIdFromDependency","tagname":"method","owner":"Gnt.field.Dependency","id":"method-getTaskIdFromDependency","meta":{"private":true}},{"name":"isDirty","tagname":"method","owner":"Gnt.field.Dependency","id":"method-isDirty","meta":{"private":true}},{"name":"isLocaleApplied","tagname":"method","owner":"Sch.mixin.Localizable","id":"method-isLocaleApplied","meta":{"private":true}},{"name":"isPredecessor","tagname":"method","owner":"Gnt.field.Dependency","id":"method-isPredecessor","meta":{"private":true}},{"name":"localize","tagname":"method","owner":"Sch.mixin.Localizable","id":"method-localize","meta":{}},{"name":"setTask","tagname":"method","owner":"Gnt.field.Dependency","id":"method-setTask","meta":{}}],"code_type":"ext_define","id":"class-Gnt.field.Dependency","short_doc":"A specialized field allowing a user to change the dependencies of a task. ...","component":false,"superclasses":["Ext.form.field.Text"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Alternate names</h4><div class='alternate-class-name'>Gnt.widget.DependencyField</div><h4>Hierarchy</h4><div class='subclass first-child'>Ext.form.field.Text<div class='subclass '><strong>Gnt.field.Dependency</strong></div></div><h4>Mixins</h4><div class='dependency'><a href='#!/api/Gnt.mixin.Localizable' rel='Gnt.mixin.Localizable' class='docClass'>Gnt.mixin.Localizable</a></div><h4>Requires</h4><div class='dependency'><a href='#!/api/Gnt.util.DependencyParser' rel='Gnt.util.DependencyParser' class='docClass'>Gnt.util.DependencyParser</a></div><h4>Files</h4><div class='dependency'><a href='source/Dependency.html#Gnt-field-Dependency' target='_blank'>Dependency.js</a></div></pre><div class='doc-contents'><p>A specialized field allowing a user to change the dependencies of a task. The type of dependecies\ncreated by this field is controlled by the <a href=\"#!/api/Gnt.field.Dependency-cfg-type\" rel=\"Gnt.field.Dependency-cfg-type\" class=\"docClass\">type</a> config.</p>\n\n<p>The text describing a dependency can be one or more values in the following format, separated with a <a href=\"#!/api/Gnt.field.Dependency-cfg-separator\" rel=\"Gnt.field.Dependency-cfg-separator\" class=\"docClass\">separator</a> string:</p>\n\n<pre><code>[TaskId][DependencyType][Lag]\n</code></pre>\n\n<p>where:</p>\n\n<ul>\n<li><code>TaskId</code> is the id of the predecessor/successor task, can be a \"real\" or \"sequential\" id, see below.</li>\n<li><code>DependencyType</code> (optional, default value is \"FS\") is one of the following (based on the <a href=\"#!/api/Gnt.util.DependencyParser-cfg-l10n\" rel=\"Gnt.util.DependencyParser-cfg-l10n\" class=\"docClass\">Gnt.util.DependencyParser.l10n</a>) property.\n<strong>Please note</strong> that dependency types are localized and depend on selected language (following values present English translation):\n\n<ul>\n<li><code>FS</code> - for \"Finish-To-Start\"</li>\n<li><code>FF</code> - for \"Finish-To-Finish\"</li>\n<li><code>SF</code> - for \"Start-To-Finish\"</li>\n<li><code>SS</code> - for \"Start-To-Start\"</li>\n</ul>\n</li>\n<li><code>Lag</code> (optional). Should start with <code>+</code> or <code>-</code> followed by a number indicating the lag amount\nand duration unit.</li>\n</ul>\n\n\n<p>The <code>TaskId</code> part can contain either \"real\" id of the task (the id that is stored in the database) or \"sequential\" id.\nThe sequential id corresponds to the ordinal position of the task in the whole dataset. When you add or remove tasks\nfrom the dataset, the sequential id of the tasks may change. Which type of id is used is controled by the\n<a href=\"#!/api/Gnt.field.Dependency-cfg-useSequenceNumber\" rel=\"Gnt.field.Dependency-cfg-useSequenceNumber\" class=\"docClass\">useSequenceNumber</a> config.</p>\n\n<p>For example:\n    10          - Finish to start dependency from task with Id 10\n    10SS        - Start to start dependency from task with Id 10\n    3FS+1d      - Finish to start dependency from task with Id 3, with +1 day lag\n    3FS-10h      - Finish to start dependency from task with Id 3, with -10 hours lag</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-dependencyParserConfig' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Dependency'>Gnt.field.Dependency</span><br/><a href='source/Dependency.html#Gnt-field-Dependency-cfg-dependencyParserConfig' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.Dependency-cfg-dependencyParserConfig' class='name expandable'>dependencyParserConfig</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'><p>A config object to be passed to <a href=\"#!/api/Gnt.util.DependencyParser\" rel=\"Gnt.util.DependencyParser\" class=\"docClass\">Gnt.util.DependencyParser</a> constructor.</p>\n</div><div class='long'><p>A config object to be passed to <a href=\"#!/api/Gnt.util.DependencyParser\" rel=\"Gnt.util.DependencyParser\" class=\"docClass\">Gnt.util.DependencyParser</a> constructor.</p>\n</div></div></div><div id='cfg-invalidDependencyText' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Dependency'>Gnt.field.Dependency</span><br/><a href='source/Dependency.html#Gnt-field-Dependency-cfg-invalidDependencyText' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.Dependency-cfg-invalidDependencyText' class='name expandable'>invalidDependencyText</a> : String<span class=\"signature\"><span class='deprecated' >deprecated</span></span></div><div class='description'><div class='short'>An error message when one of the dependencies being created\nis invalid - ie forms a cycle. ...</div><div class='long'><p>An error message when one of the dependencies being created\nis invalid - ie forms a cycle.</p>\n        <div class='rounded-box deprecated-box deprecated-tag-box'>\n        <p>This cfg has been <strong>deprected</strong> </p>\n        <p>Please use <a href=\"#!/api/Gnt.field.Dependency-cfg-l10n\" rel=\"Gnt.field.Dependency-cfg-l10n\" class=\"docClass\">l10n</a> instead.</p>\n\n        </div>\n</div></div></div><div id='cfg-invalidFormatText' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Dependency'>Gnt.field.Dependency</span><br/><a href='source/Dependency.html#Gnt-field-Dependency-cfg-invalidFormatText' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.Dependency-cfg-invalidFormatText' class='name expandable'>invalidFormatText</a> : String<span class=\"signature\"><span class='deprecated' >deprecated</span></span></div><div class='description'><div class='short'>An error message when the value is not in a recognized format. ...</div><div class='long'><p>An error message when the value is not in a recognized format.</p>\n        <div class='rounded-box deprecated-box deprecated-tag-box'>\n        <p>This cfg has been <strong>deprected</strong> </p>\n        <p>Please use <a href=\"#!/api/Gnt.field.Dependency-cfg-l10n\" rel=\"Gnt.field.Dependency-cfg-l10n\" class=\"docClass\">l10n</a> instead.</p>\n\n        </div>\n</div></div></div><div id='cfg-l10n' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Dependency'>Gnt.field.Dependency</span><br/><a href='source/Dependency.html#Gnt-field-Dependency-cfg-l10n' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.Dependency-cfg-l10n' class='name expandable'>l10n</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>A object, purposed for the class localization. ...</div><div class='long'><p>A object, purposed for the class localization. Contains the following keys/values:</p>\n\n<pre><code>        - invalidFormatText   : 'Invalid dependency format',\n        - invalidDependencyText : 'Invalid dependency found, please make sure you have no cyclic paths between your tasks',\n        - invalidDependencyType : 'Invalid dependency type {0}. Allowed values are: {1}.'\n</code></pre>\n<p>Overrides: <a href=\"#!/api/Sch.mixin.Localizable-cfg-l10n\" rel=\"Sch.mixin.Localizable-cfg-l10n\" class=\"docClass\">Sch.mixin.Localizable.l10n</a></p></div></div></div><div id='cfg-separator' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Dependency'>Gnt.field.Dependency</span><br/><a href='source/Dependency.html#Gnt-field-Dependency-cfg-separator' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.Dependency-cfg-separator' class='name expandable'>separator</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>A separator between the dependency values in the text field. ...</div><div class='long'><p>A separator between the dependency values in the text field.</p>\n<p>Defaults to: <code>';'</code></p></div></div></div><div id='cfg-type' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Dependency'>Gnt.field.Dependency</span><br/><a href='source/Dependency.html#Gnt-field-Dependency-cfg-type' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.Dependency-cfg-type' class='name expandable'>type</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Either predecessors or successors. ...</div><div class='long'><p>Either <code>predecessors</code> or <code>successors</code>. Defines the type of dependencies managed by this field. Defaults to 'predecessors'.</p>\n<p>Defaults to: <code>'predecessors'</code></p></div></div></div><div id='cfg-useSequenceNumber' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Dependency'>Gnt.field.Dependency</span><br/><a href='source/Dependency.html#Gnt-field-Dependency-cfg-useSequenceNumber' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.Dependency-cfg-useSequenceNumber' class='name expandable'>useSequenceNumber</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Set to true to use auto-generated sequential identifiers\nto reference other tasks (see Gnt.model.Task.getSequenceNumb...</div><div class='long'><p>Set to <code>true</code> to use auto-generated sequential identifiers\nto reference other tasks (see <a href=\"#!/api/Gnt.model.Task-method-getSequenceNumber\" rel=\"Gnt.model.Task-method-getSequenceNumber\" class=\"docClass\">Gnt.model.Task.getSequenceNumber</a> for definition).\nIf value is <code>false</code>then \"real\" id (that is stored in the database) will be used.</p>\n<p>Defaults to: <code>false</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-activeLocaleId' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Sch.mixin.Localizable' rel='Sch.mixin.Localizable' class='defined-in docClass'>Sch.mixin.Localizable</a><br/><a href='source/Localizable2.html#Sch-mixin-Localizable-property-activeLocaleId' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.mixin.Localizable-property-activeLocaleId' class='name expandable'>activeLocaleId</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>''</code></p></div></div></div><div id='property-dependencyParser' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Dependency'>Gnt.field.Dependency</span><br/><a href='source/Dependency.html#Gnt-field-Dependency-property-dependencyParser' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.Dependency-property-dependencyParser' class='name expandable'>dependencyParser</a> : <a href=\"#!/api/Gnt.util.DependencyParser\" rel=\"Gnt.util.DependencyParser\" class=\"docClass\">Gnt.util.DependencyParser</a><span class=\"signature\"></span></div><div class='description'><div class='short'>An object used to parse entered string to a proper dependency data. ...</div><div class='long'><p>An object used to parse entered string to a proper dependency data.\n<strong>See also</strong> <a href=\"#!/api/Gnt.field.Dependency-cfg-dependencyParserConfig\" rel=\"Gnt.field.Dependency-cfg-dependencyParserConfig\" class=\"docClass\">dependencyParserConfig</a> config.</p>\n</div></div></div><div id='property-legacyMode' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Sch.mixin.Localizable' rel='Sch.mixin.Localizable' class='defined-in docClass'>Sch.mixin.Localizable</a><br/><a href='source/Localizable2.html#Sch-mixin-Localizable-property-legacyMode' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.mixin.Localizable-property-legacyMode' class='name expandable'>legacyMode</a> : Boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='property-task' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Dependency'>Gnt.field.Dependency</span><br/><a href='source/Dependency.html#Gnt-field-Dependency-property-task' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.Dependency-property-task' class='name expandable'>task</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Dependency'>Gnt.field.Dependency</span><br/><a href='source/Dependency.html#Gnt-field-Dependency-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Gnt.field.Dependency-method-constructor' class='name expandable'>Gnt.field.Dependency</a>( <span class='pre'>config</span> ) : <a href=\"#!/api/Gnt.field.Dependency\" rel=\"Gnt.field.Dependency\" class=\"docClass\">Gnt.field.Dependency</a><span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Gnt.field.Dependency\" rel=\"Gnt.field.Dependency\" class=\"docClass\">Gnt.field.Dependency</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-L' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Sch.mixin.Localizable' rel='Sch.mixin.Localizable' class='defined-in docClass'>Sch.mixin.Localizable</a><br/><a href='source/Localizable2.html#Sch-mixin-Localizable-method-L' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.mixin.Localizable-method-L' class='name expandable'>L</a>( <span class='pre'>id, [legacyHolderProp], [skipLocalizedCheck]</span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>This is shorthand reference to localize. ...</div><div class='long'><p>This is shorthand reference to <a href=\"#!/api/Sch.mixin.Localizable-method-localize\" rel=\"Sch.mixin.Localizable-method-localize\" class=\"docClass\">localize</a>. Retrieves translation of a phrase.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>id</span> : String<div class='sub-desc'><p>Identifier of phrase.</p>\n</div></li><li><span class='pre'>legacyHolderProp</span> : String (optional)<div class='sub-desc'><p>Legacy class property name containing locales.</p>\n<p>Defaults to: <code>this.legacyHolderProp</code></p></div></li><li><span class='pre'>skipLocalizedCheck</span> : Boolean (optional)<div class='sub-desc'><p>Do not localize class if it's not localized yet.</p>\n<p>Defaults to: <code>false</code></p></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>Translation of specified phrase.</p>\n</div></li></ul></div></div></div><div id='method-applyChanges' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Dependency'>Gnt.field.Dependency</span><br/><a href='source/Dependency.html#Gnt-field-Dependency-method-applyChanges' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.Dependency-method-applyChanges' class='name expandable'>applyChanges</a>( <span class='pre'>[toTask]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>This method applies the changes from the field to the bound task or to the task provided as 1st argument. ...</div><div class='long'><p>This method applies the changes from the field to the bound task or to the task provided as 1st argument.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>toTask</span> : <a href=\"#!/api/Gnt.model.Task\" rel=\"Gnt.model.Task\" class=\"docClass\">Gnt.model.Task</a> (optional)<div class='sub-desc'><p>The task to apply the changes to. If not provided, changes will be applied to the last bound task\n(with <a href=\"#!/api/Gnt.field.Dependency-property-task\" rel=\"Gnt.field.Dependency-property-task\" class=\"docClass\">task</a> config option or {@link <a href=\"#!/api/Gnt.field.Dependency-method-setTask\" rel=\"Gnt.field.Dependency-method-setTask\" class=\"docClass\">setTask</a>) method)</p>\n</div></li></ul></div></div></div><div id='method-applyLocale' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Sch.mixin.Localizable' rel='Sch.mixin.Localizable' class='defined-in docClass'>Sch.mixin.Localizable</a><br/><a href='source/Localizable2.html#Sch-mixin-Localizable-method-applyLocale' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.mixin.Localizable-method-applyLocale' class='name expandable'>applyLocale</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-getDependencies' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Dependency'>Gnt.field.Dependency</span><br/><a href='source/Dependency.html#Gnt-field-Dependency-method-getDependencies' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.Dependency-method-getDependencies' class='name expandable'>getDependencies</a>( <span class='pre'></span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Returns an array of dependency objects representing the current value of the field:\n\n    [\n        {\n            task...</div><div class='long'><p>Returns an array of dependency objects representing the current value of the field:</p>\n\n<pre><code>    [\n        {\n            taskId  : 3,    // Int, always present\n            type    : \"FS\", // String, always present\n            lag     : 3,    // Int, optional\n            lagUnit : 'd'   // String, optional\n        },\n        ...\n    ]\n</code></pre>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>The dependencies</p>\n</div></li></ul></div></div></div><div id='method-getDisplayValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Dependency'>Gnt.field.Dependency</span><br/><a href='source/Dependency.html#Gnt-field-Dependency-method-getDisplayValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.Dependency-method-getDisplayValue' class='name expandable'>getDisplayValue</a>( <span class='pre'>task</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>task</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-getErrors' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Dependency'>Gnt.field.Dependency</span><br/><a href='source/Dependency.html#Gnt-field-Dependency-method-getErrors' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.Dependency-method-getErrors' class='name expandable'>getErrors</a>( <span class='pre'>value</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>value</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-getTaskIdFromDependency' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Dependency'>Gnt.field.Dependency</span><br/><a href='source/Dependency.html#Gnt-field-Dependency-method-getTaskIdFromDependency' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.Dependency-method-getTaskIdFromDependency' class='name expandable'>getTaskIdFromDependency</a>( <span class='pre'>dependencyData</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>dependencyData</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-isDirty' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Dependency'>Gnt.field.Dependency</span><br/><a href='source/Dependency.html#Gnt-field-Dependency-method-isDirty' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.Dependency-method-isDirty' class='name expandable'>isDirty</a>( <span class='pre'>task</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>task</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-isLocaleApplied' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Sch.mixin.Localizable' rel='Sch.mixin.Localizable' class='defined-in docClass'>Sch.mixin.Localizable</a><br/><a href='source/Localizable2.html#Sch-mixin-Localizable-method-isLocaleApplied' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.mixin.Localizable-method-isLocaleApplied' class='name expandable'>isLocaleApplied</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-isPredecessor' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Dependency'>Gnt.field.Dependency</span><br/><a href='source/Dependency.html#Gnt-field-Dependency-method-isPredecessor' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.Dependency-method-isPredecessor' class='name expandable'>isPredecessor</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-localize' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Sch.mixin.Localizable' rel='Sch.mixin.Localizable' class='defined-in docClass'>Sch.mixin.Localizable</a><br/><a href='source/Localizable2.html#Sch-mixin-Localizable-method-localize' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.mixin.Localizable-method-localize' class='name expandable'>localize</a>( <span class='pre'>id, [legacyHolderProp], [skipLocalizedCheck]</span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Retrieves translation of a phrase. ...</div><div class='long'><p>Retrieves translation of a phrase. There is a shorthand <a href=\"#!/api/Sch.mixin.Localizable-method-L\" rel=\"Sch.mixin.Localizable-method-L\" class=\"docClass\">L</a> for this method.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>id</span> : String<div class='sub-desc'><p>Identifier of phrase.</p>\n</div></li><li><span class='pre'>legacyHolderProp</span> : String (optional)<div class='sub-desc'><p>Legacy class property name containing locales.</p>\n<p>Defaults to: <code>this.legacyHolderProp</code></p></div></li><li><span class='pre'>skipLocalizedCheck</span> : Boolean (optional)<div class='sub-desc'><p>Do not localize class if it's not localized yet.</p>\n<p>Defaults to: <code>false</code></p></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>Translation of specified phrase.</p>\n</div></li></ul></div></div></div><div id='method-setTask' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Dependency'>Gnt.field.Dependency</span><br/><a href='source/Dependency.html#Gnt-field-Dependency-method-setTask' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.Dependency-method-setTask' class='name expandable'>setTask</a>( <span class='pre'>task</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Set the task this field is bound to. ...</div><div class='long'><p>Set the task this field is bound to.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>task</span> : <a href=\"#!/api/Gnt.model.Task\" rel=\"Gnt.model.Task\" class=\"docClass\">Gnt.model.Task</a><div class='sub-desc'>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});