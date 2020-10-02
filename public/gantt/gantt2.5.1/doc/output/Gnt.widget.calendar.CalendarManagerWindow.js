Ext.data.JsonP.Gnt_widget_calendar_CalendarManagerWindow({"tagname":"class","name":"Gnt.widget.calendar.CalendarManagerWindow","autodetected":{"aliases":true,"alternateClassNames":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"CalendarManagerWindow.js","href":"CalendarManagerWindow.html#Gnt-widget-calendar-CalendarManagerWindow"}],"extends":"Ext.window.Window","aside":[{"tagname":"aside","type":"guide","name":"gantt_calendars"}],"aliases":{"widget":["calendarmanagerwindow"]},"alternateClassNames":[],"mixins":["Gnt.mixin.Localizable"],"requires":["Gnt.widget.calendar.CalendarManager"],"uses":[],"members":[{"name":"calendarConfig","tagname":"cfg","owner":"Gnt.widget.calendar.CalendarManagerWindow","id":"cfg-calendarConfig","meta":{}},{"name":"calendarManager","tagname":"cfg","owner":"Gnt.widget.calendar.CalendarManagerWindow","id":"cfg-calendarManager","meta":{}},{"name":"l10n","tagname":"cfg","owner":"Gnt.widget.calendar.CalendarManagerWindow","id":"cfg-l10n","meta":{}},{"name":"activeLocaleId","tagname":"property","owner":"Sch.mixin.Localizable","id":"property-activeLocaleId","meta":{"private":true}},{"name":"border","tagname":"property","owner":"Gnt.widget.calendar.CalendarManagerWindow","id":"property-border","meta":{"private":true}},{"name":"calendarWidget","tagname":"property","owner":"Gnt.widget.calendar.CalendarManagerWindow","id":"property-calendarWidget","meta":{}},{"name":"height","tagname":"property","owner":"Gnt.widget.calendar.CalendarManagerWindow","id":"property-height","meta":{"private":true}},{"name":"layout","tagname":"property","owner":"Gnt.widget.calendar.CalendarManagerWindow","id":"property-layout","meta":{"private":true}},{"name":"legacyMode","tagname":"property","owner":"Sch.mixin.Localizable","id":"property-legacyMode","meta":{"private":true}},{"name":"width","tagname":"property","owner":"Gnt.widget.calendar.CalendarManagerWindow","id":"property-width","meta":{"private":true}},{"name":"L","tagname":"method","owner":"Sch.mixin.Localizable","id":"method-L","meta":{}},{"name":"applyChanges","tagname":"method","owner":"Gnt.widget.calendar.CalendarManagerWindow","id":"method-applyChanges","meta":{}},{"name":"applyLocale","tagname":"method","owner":"Sch.mixin.Localizable","id":"method-applyLocale","meta":{"private":true}},{"name":"isLocaleApplied","tagname":"method","owner":"Sch.mixin.Localizable","id":"method-isLocaleApplied","meta":{"private":true}},{"name":"localize","tagname":"method","owner":"Sch.mixin.Localizable","id":"method-localize","meta":{}},{"name":"onBeforeClose","tagname":"method","owner":"Gnt.widget.calendar.CalendarManagerWindow","id":"method-onBeforeClose","meta":{"private":true}}],"code_type":"ext_define","id":"class-Gnt.widget.calendar.CalendarManagerWindow","short_doc":"This is just a Gnt.widget.calendar.CalendarManager widget, wrapped with the Ext.window.Window instance. ...","component":false,"superclasses":["Ext.window.Window"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.window.Window<div class='subclass '><strong>Gnt.widget.calendar.CalendarManagerWindow</strong></div></div><h4>Mixins</h4><div class='dependency'><a href='#!/api/Gnt.mixin.Localizable' rel='Gnt.mixin.Localizable' class='docClass'>Gnt.mixin.Localizable</a></div><h4>Requires</h4><div class='dependency'><a href='#!/api/Gnt.widget.calendar.CalendarManager' rel='Gnt.widget.calendar.CalendarManager' class='docClass'>Gnt.widget.calendar.CalendarManager</a></div><h4>Files</h4><div class='dependency'><a href='source/CalendarManagerWindow.html#Gnt-widget-calendar-CalendarManagerWindow' target='_blank'>CalendarManagerWindow.js</a></div></pre><div class='doc-contents'>            <div class='aside guide'>\n              <h4>Guide</h4>\n              <p><a href='#!/guide/gantt_calendars'><img src='guides/gantt_calendars/icon.png' alt=''> Using calendars</a></p>\n            </div>\n<p><p><img src=\"images/gantt/images/calendar.png\" alt=\"\" width=\"605\" height=\"549\"></p></p>\n\n<p>This is just a <a href=\"#!/api/Gnt.widget.calendar.CalendarManager\" rel=\"Gnt.widget.calendar.CalendarManager\" class=\"docClass\">Gnt.widget.calendar.CalendarManager</a> widget, wrapped with the Ext.window.Window instance.\nIt proxies the calendar config and <a href=\"#!/api/Gnt.widget.calendar.CalendarManagerWindow-method-applyChanges\" rel=\"Gnt.widget.calendar.CalendarManagerWindow-method-applyChanges\" class=\"docClass\">applyChanges</a> method.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-calendarConfig' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.widget.calendar.CalendarManagerWindow'>Gnt.widget.calendar.CalendarManagerWindow</span><br/><a href='source/CalendarManagerWindow.html#Gnt-widget-calendar-CalendarManagerWindow-cfg-calendarConfig' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.widget.calendar.CalendarManagerWindow-cfg-calendarConfig' class='name expandable'>calendarConfig</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'><p>An object to be applied to the newly created instance of the <a href=\"#!/api/Gnt.widget.calendar.Calendar\" rel=\"Gnt.widget.calendar.Calendar\" class=\"docClass\">Gnt.widget.calendar.Calendar</a></p>\n</div><div class='long'><p>An object to be applied to the newly created instance of the <a href=\"#!/api/Gnt.widget.calendar.Calendar\" rel=\"Gnt.widget.calendar.Calendar\" class=\"docClass\">Gnt.widget.calendar.Calendar</a></p>\n</div></div></div><div id='cfg-calendarManager' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.widget.calendar.CalendarManagerWindow'>Gnt.widget.calendar.CalendarManagerWindow</span><br/><a href='source/CalendarManagerWindow.html#Gnt-widget-calendar-CalendarManagerWindow-cfg-calendarManager' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.widget.calendar.CalendarManagerWindow-cfg-calendarManager' class='name expandable'>calendarManager</a> : <a href=\"#!/api/Gnt.data.CalendarManager\" rel=\"Gnt.data.CalendarManager\" class=\"docClass\">Gnt.data.CalendarManager</a><span class=\"signature\"></span></div><div class='description'><div class='short'><p>An instance of the <a href=\"#!/api/Gnt.data.CalendarManager\" rel=\"Gnt.data.CalendarManager\" class=\"docClass\">Gnt.data.CalendarManager</a></p>\n</div><div class='long'><p>An instance of the <a href=\"#!/api/Gnt.data.CalendarManager\" rel=\"Gnt.data.CalendarManager\" class=\"docClass\">Gnt.data.CalendarManager</a></p>\n</div></div></div><div id='cfg-l10n' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.widget.calendar.CalendarManagerWindow'>Gnt.widget.calendar.CalendarManagerWindow</span><br/><a href='source/CalendarManagerWindow.html#Gnt-widget-calendar-CalendarManagerWindow-cfg-l10n' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.widget.calendar.CalendarManagerWindow-cfg-l10n' class='name expandable'>l10n</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>A object, purposed for the class localization. ...</div><div class='long'><p>A object, purposed for the class localization. Contains the following keys/values:</p>\n\n<pre><code>        - ok         : 'Ok',\n        - cancel     : 'Cancel',\n</code></pre>\n<p>Overrides: <a href=\"#!/api/Sch.mixin.Localizable-cfg-l10n\" rel=\"Sch.mixin.Localizable-cfg-l10n\" class=\"docClass\">Sch.mixin.Localizable.l10n</a></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-activeLocaleId' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Sch.mixin.Localizable' rel='Sch.mixin.Localizable' class='defined-in docClass'>Sch.mixin.Localizable</a><br/><a href='source/Localizable2.html#Sch-mixin-Localizable-property-activeLocaleId' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.mixin.Localizable-property-activeLocaleId' class='name expandable'>activeLocaleId</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>''</code></p></div></div></div><div id='property-border' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.widget.calendar.CalendarManagerWindow'>Gnt.widget.calendar.CalendarManagerWindow</span><br/><a href='source/CalendarManagerWindow.html#Gnt-widget-calendar-CalendarManagerWindow-property-border' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.widget.calendar.CalendarManagerWindow-property-border' class='name expandable'>border</a> : Boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='property-calendarWidget' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.widget.calendar.CalendarManagerWindow'>Gnt.widget.calendar.CalendarManagerWindow</span><br/><a href='source/CalendarManagerWindow.html#Gnt-widget-calendar-CalendarManagerWindow-property-calendarWidget' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.widget.calendar.CalendarManagerWindow-property-calendarWidget' class='name expandable'>calendarWidget</a> : <a href=\"#!/api/Gnt.widget.calendar.Calendar\" rel=\"Gnt.widget.calendar.Calendar\" class=\"docClass\">Gnt.widget.calendar.Calendar</a><span class=\"signature\"></span></div><div class='description'><div class='short'><p>An underlying calendar widget instance</p>\n</div><div class='long'><p>An underlying calendar widget instance</p>\n</div></div></div><div id='property-height' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.widget.calendar.CalendarManagerWindow'>Gnt.widget.calendar.CalendarManagerWindow</span><br/><a href='source/CalendarManagerWindow.html#Gnt-widget-calendar-CalendarManagerWindow-property-height' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.widget.calendar.CalendarManagerWindow-property-height' class='name expandable'>height</a> : Number<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>600</code></p></div></div></div><div id='property-layout' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.widget.calendar.CalendarManagerWindow'>Gnt.widget.calendar.CalendarManagerWindow</span><br/><a href='source/CalendarManagerWindow.html#Gnt-widget-calendar-CalendarManagerWindow-property-layout' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.widget.calendar.CalendarManagerWindow-property-layout' class='name expandable'>layout</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>'fit'</code></p></div></div></div><div id='property-legacyMode' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Sch.mixin.Localizable' rel='Sch.mixin.Localizable' class='defined-in docClass'>Sch.mixin.Localizable</a><br/><a href='source/Localizable2.html#Sch-mixin-Localizable-property-legacyMode' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.mixin.Localizable-property-legacyMode' class='name expandable'>legacyMode</a> : Boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='property-width' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.widget.calendar.CalendarManagerWindow'>Gnt.widget.calendar.CalendarManagerWindow</span><br/><a href='source/CalendarManagerWindow.html#Gnt-widget-calendar-CalendarManagerWindow-property-width' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.widget.calendar.CalendarManagerWindow-property-width' class='name expandable'>width</a> : Number<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>800</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-L' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Sch.mixin.Localizable' rel='Sch.mixin.Localizable' class='defined-in docClass'>Sch.mixin.Localizable</a><br/><a href='source/Localizable2.html#Sch-mixin-Localizable-method-L' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.mixin.Localizable-method-L' class='name expandable'>L</a>( <span class='pre'>id, [legacyHolderProp], [skipLocalizedCheck]</span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>This is shorthand reference to localize. ...</div><div class='long'><p>This is shorthand reference to <a href=\"#!/api/Sch.mixin.Localizable-method-localize\" rel=\"Sch.mixin.Localizable-method-localize\" class=\"docClass\">localize</a>. Retrieves translation of a phrase.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>id</span> : String<div class='sub-desc'><p>Identifier of phrase.</p>\n</div></li><li><span class='pre'>legacyHolderProp</span> : String (optional)<div class='sub-desc'><p>Legacy class property name containing locales.</p>\n<p>Defaults to: <code>this.legacyHolderProp</code></p></div></li><li><span class='pre'>skipLocalizedCheck</span> : Boolean (optional)<div class='sub-desc'><p>Do not localize class if it's not localized yet.</p>\n<p>Defaults to: <code>false</code></p></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>Translation of specified phrase.</p>\n</div></li></ul></div></div></div><div id='method-applyChanges' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.widget.calendar.CalendarManagerWindow'>Gnt.widget.calendar.CalendarManagerWindow</span><br/><a href='source/CalendarManagerWindow.html#Gnt-widget-calendar-CalendarManagerWindow-method-applyChanges' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.widget.calendar.CalendarManagerWindow-method-applyChanges' class='name expandable'>applyChanges</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Call this method when user is satisfied with the current state of the calendar in the UI. ...</div><div class='long'><p>Call this method when user is satisfied with the current state of the calendar in the UI. It will apply all the changes made in the UI\nto the original calendar.</p>\n</div></div></div><div id='method-applyLocale' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Sch.mixin.Localizable' rel='Sch.mixin.Localizable' class='defined-in docClass'>Sch.mixin.Localizable</a><br/><a href='source/Localizable2.html#Sch-mixin-Localizable-method-applyLocale' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.mixin.Localizable-method-applyLocale' class='name expandable'>applyLocale</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-isLocaleApplied' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Sch.mixin.Localizable' rel='Sch.mixin.Localizable' class='defined-in docClass'>Sch.mixin.Localizable</a><br/><a href='source/Localizable2.html#Sch-mixin-Localizable-method-isLocaleApplied' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.mixin.Localizable-method-isLocaleApplied' class='name expandable'>isLocaleApplied</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-localize' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Sch.mixin.Localizable' rel='Sch.mixin.Localizable' class='defined-in docClass'>Sch.mixin.Localizable</a><br/><a href='source/Localizable2.html#Sch-mixin-Localizable-method-localize' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.mixin.Localizable-method-localize' class='name expandable'>localize</a>( <span class='pre'>id, [legacyHolderProp], [skipLocalizedCheck]</span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Retrieves translation of a phrase. ...</div><div class='long'><p>Retrieves translation of a phrase. There is a shorthand <a href=\"#!/api/Sch.mixin.Localizable-method-L\" rel=\"Sch.mixin.Localizable-method-L\" class=\"docClass\">L</a> for this method.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>id</span> : String<div class='sub-desc'><p>Identifier of phrase.</p>\n</div></li><li><span class='pre'>legacyHolderProp</span> : String (optional)<div class='sub-desc'><p>Legacy class property name containing locales.</p>\n<p>Defaults to: <code>this.legacyHolderProp</code></p></div></li><li><span class='pre'>skipLocalizedCheck</span> : Boolean (optional)<div class='sub-desc'><p>Do not localize class if it's not localized yet.</p>\n<p>Defaults to: <code>false</code></p></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>Translation of specified phrase.</p>\n</div></li></ul></div></div></div><div id='method-onBeforeClose' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.widget.calendar.CalendarManagerWindow'>Gnt.widget.calendar.CalendarManagerWindow</span><br/><a href='source/CalendarManagerWindow.html#Gnt-widget-calendar-CalendarManagerWindow-method-onBeforeClose' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.widget.calendar.CalendarManagerWindow-method-onBeforeClose' class='name expandable'>onBeforeClose</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div></div></div></div></div>","meta":{}});