Ext.data.JsonP.Gnt_widget_ConstraintResolutionForm({"tagname":"class","name":"Gnt.widget.ConstraintResolutionForm","autodetected":{"aliases":true,"alternateClassNames":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"ConstraintResolutionForm.js","href":"ConstraintResolutionForm.html#Gnt-widget-ConstraintResolutionForm"}],"extends":"Ext.form.Panel","aliases":{"widget":["constraintresolutionform"]},"alternateClassNames":[],"mixins":["Gnt.mixin.Localizable"],"requires":["Ext.form.RadioGroup","Ext.form.field.Display"],"uses":[],"members":[{"name":"dateFormat","tagname":"cfg","owner":"Gnt.widget.ConstraintResolutionForm","id":"cfg-dateFormat","meta":{}},{"name":"l10n","tagname":"cfg","owner":"Gnt.widget.ConstraintResolutionForm","id":"cfg-l10n","meta":{}},{"name":"resolutionContext","tagname":"cfg","owner":"Gnt.widget.ConstraintResolutionForm","id":"cfg-resolutionContext","meta":{}},{"name":"activeLocaleId","tagname":"property","owner":"Sch.mixin.Localizable","id":"property-activeLocaleId","meta":{"private":true}},{"name":"autoScroll","tagname":"property","owner":"Gnt.widget.ConstraintResolutionForm","id":"property-autoScroll","meta":{"private":true}},{"name":"bodyPadding","tagname":"property","owner":"Gnt.widget.ConstraintResolutionForm","id":"property-bodyPadding","meta":{"private":true}},{"name":"legacyMode","tagname":"property","owner":"Gnt.widget.ConstraintResolutionForm","id":"property-legacyMode","meta":{"private":true}},{"name":"L","tagname":"method","owner":"Sch.mixin.Localizable","id":"method-L","meta":{}},{"name":"applyLocale","tagname":"method","owner":"Sch.mixin.Localizable","id":"method-applyLocale","meta":{"private":true}},{"name":"getConstraintViolationDescription","tagname":"method","owner":"Gnt.widget.ConstraintResolutionForm","id":"method-getConstraintViolationDescription","meta":{"private":true}},{"name":"getDontAskValue","tagname":"method","owner":"Gnt.widget.ConstraintResolutionForm","id":"method-getDontAskValue","meta":{"private":true}},{"name":"getOptimalHeight","tagname":"method","owner":"Gnt.widget.ConstraintResolutionForm","id":"method-getOptimalHeight","meta":{"private":true}},{"name":"getResolutionOptionDescription","tagname":"method","owner":"Gnt.widget.ConstraintResolutionForm","id":"method-getResolutionOptionDescription","meta":{"private":true}},{"name":"initComponent","tagname":"method","owner":"Gnt.widget.ConstraintResolutionForm","id":"method-initComponent","meta":{"private":true}},{"name":"isLocaleApplied","tagname":"method","owner":"Sch.mixin.Localizable","id":"method-isLocaleApplied","meta":{"private":true}},{"name":"localize","tagname":"method","owner":"Sch.mixin.Localizable","id":"method-localize","meta":{}},{"name":"onUserActionCancel","tagname":"method","owner":"Gnt.widget.ConstraintResolutionForm","id":"method-onUserActionCancel","meta":{"private":true}},{"name":"onUserActionOk","tagname":"method","owner":"Gnt.widget.ConstraintResolutionForm","id":"method-onUserActionOk","meta":{"private":true}},{"name":"setupFooterFromResolutionContext","tagname":"method","owner":"Gnt.widget.ConstraintResolutionForm","id":"method-setupFooterFromResolutionContext","meta":{"private":true}},{"name":"setupItemsFromResolutionContext","tagname":"method","owner":"Gnt.widget.ConstraintResolutionForm","id":"method-setupItemsFromResolutionContext","meta":{"private":true}}],"code_type":"ext_define","id":"class-Gnt.widget.ConstraintResolutionForm","component":false,"superclasses":["Ext.form.Panel"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.form.Panel<div class='subclass '><strong>Gnt.widget.ConstraintResolutionForm</strong></div></div><h4>Mixins</h4><div class='dependency'><a href='#!/api/Gnt.mixin.Localizable' rel='Gnt.mixin.Localizable' class='docClass'>Gnt.mixin.Localizable</a></div><h4>Requires</h4><div class='dependency'>Ext.form.RadioGroup</div><div class='dependency'>Ext.form.field.Display</div><h4>Files</h4><div class='dependency'><a href='source/ConstraintResolutionForm.html#Gnt-widget-ConstraintResolutionForm' target='_blank'>ConstraintResolutionForm.js</a></div></pre><div class='doc-contents'>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-dateFormat' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.widget.ConstraintResolutionForm'>Gnt.widget.ConstraintResolutionForm</span><br/><a href='source/ConstraintResolutionForm.html#Gnt-widget-ConstraintResolutionForm-cfg-dateFormat' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.widget.ConstraintResolutionForm-cfg-dateFormat' class='name expandable'>dateFormat</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Date format string to use in vialotion description string. ...</div><div class='long'><p>Date format string to use in vialotion description string. If none is given then\nthe one from <a href=\"#!/api/Gnt.widget.ConstraintResolutionForm-cfg-l10n\" rel=\"Gnt.widget.ConstraintResolutionForm-cfg-l10n\" class=\"docClass\">l10n</a> will be used otherwise Ext.Date.defaultFormat.</p>\n<p>Defaults to: <code>null</code></p></div></div></div><div id='cfg-l10n' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.widget.ConstraintResolutionForm'>Gnt.widget.ConstraintResolutionForm</span><br/><a href='source/ConstraintResolutionForm.html#Gnt-widget-ConstraintResolutionForm-cfg-l10n' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.widget.ConstraintResolutionForm-cfg-l10n' class='name expandable'>l10n</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Object containing localication strings ...</div><div class='long'><p>Object containing localication strings</p>\n<p>Defaults to: <code>{dateFormat: &quot;m/d/Y&quot;, &quot;OK&quot;: 'OK', &quot;Cancel&quot;: 'Cancel', &quot;Resolution options&quot;: &quot;Resolution options&quot;, &quot;Don't ask again&quot;: &quot;Don't ask again&quot;, &quot;Task {0} violates constraint {1}&quot;: &quot;Task {0} violates constraint {1}&quot;, &quot;Task {0} violates constraint {1} {2}&quot;: &quot;Task {0} violates constraint {1} {2}&quot;}</code></p><p>Overrides: <a href=\"#!/api/Sch.mixin.Localizable-cfg-l10n\" rel=\"Sch.mixin.Localizable-cfg-l10n\" class=\"docClass\">Sch.mixin.Localizable.l10n</a></p></div></div></div><div id='cfg-resolutionContext' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.widget.ConstraintResolutionForm'>Gnt.widget.ConstraintResolutionForm</span><br/><a href='source/ConstraintResolutionForm.html#Gnt-widget-ConstraintResolutionForm-cfg-resolutionContext' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.widget.ConstraintResolutionForm-cfg-resolutionContext' class='name expandable'>resolutionContext</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Object containing a set of possible resolutions provided by Gnt.constraint.Base.getResolution().</p>\n</div><div class='long'><p>Object containing a set of possible resolutions provided by Gnt.constraint.Base.getResolution().</p>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-activeLocaleId' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Sch.mixin.Localizable' rel='Sch.mixin.Localizable' class='defined-in docClass'>Sch.mixin.Localizable</a><br/><a href='source/Localizable2.html#Sch-mixin-Localizable-property-activeLocaleId' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.mixin.Localizable-property-activeLocaleId' class='name expandable'>activeLocaleId</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>''</code></p></div></div></div><div id='property-autoScroll' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.widget.ConstraintResolutionForm'>Gnt.widget.ConstraintResolutionForm</span><br/><a href='source/ConstraintResolutionForm.html#Gnt-widget-ConstraintResolutionForm-property-autoScroll' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.widget.ConstraintResolutionForm-property-autoScroll' class='name expandable'>autoScroll</a> : Boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='property-bodyPadding' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.widget.ConstraintResolutionForm'>Gnt.widget.ConstraintResolutionForm</span><br/><a href='source/ConstraintResolutionForm.html#Gnt-widget-ConstraintResolutionForm-property-bodyPadding' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.widget.ConstraintResolutionForm-property-bodyPadding' class='name expandable'>bodyPadding</a> : Number<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>5</code></p></div></div></div><div id='property-legacyMode' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.widget.ConstraintResolutionForm'>Gnt.widget.ConstraintResolutionForm</span><br/><a href='source/ConstraintResolutionForm.html#Gnt-widget-ConstraintResolutionForm-property-legacyMode' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.widget.ConstraintResolutionForm-property-legacyMode' class='name expandable'>legacyMode</a> : Boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>false</code></p><p>Overrides: <a href=\"#!/api/Sch.mixin.Localizable-property-legacyMode\" rel=\"Sch.mixin.Localizable-property-legacyMode\" class=\"docClass\">Sch.mixin.Localizable.legacyMode</a></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-L' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Sch.mixin.Localizable' rel='Sch.mixin.Localizable' class='defined-in docClass'>Sch.mixin.Localizable</a><br/><a href='source/Localizable2.html#Sch-mixin-Localizable-method-L' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.mixin.Localizable-method-L' class='name expandable'>L</a>( <span class='pre'>id, [legacyHolderProp], [skipLocalizedCheck]</span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>This is shorthand reference to localize. ...</div><div class='long'><p>This is shorthand reference to <a href=\"#!/api/Sch.mixin.Localizable-method-localize\" rel=\"Sch.mixin.Localizable-method-localize\" class=\"docClass\">localize</a>. Retrieves translation of a phrase.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>id</span> : String<div class='sub-desc'><p>Identifier of phrase.</p>\n</div></li><li><span class='pre'>legacyHolderProp</span> : String (optional)<div class='sub-desc'><p>Legacy class property name containing locales.</p>\n<p>Defaults to: <code>this.legacyHolderProp</code></p></div></li><li><span class='pre'>skipLocalizedCheck</span> : Boolean (optional)<div class='sub-desc'><p>Do not localize class if it's not localized yet.</p>\n<p>Defaults to: <code>false</code></p></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>Translation of specified phrase.</p>\n</div></li></ul></div></div></div><div id='method-applyLocale' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Sch.mixin.Localizable' rel='Sch.mixin.Localizable' class='defined-in docClass'>Sch.mixin.Localizable</a><br/><a href='source/Localizable2.html#Sch-mixin-Localizable-method-applyLocale' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.mixin.Localizable-method-applyLocale' class='name expandable'>applyLocale</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-getConstraintViolationDescription' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.widget.ConstraintResolutionForm'>Gnt.widget.ConstraintResolutionForm</span><br/><a href='source/ConstraintResolutionForm.html#Gnt-widget-ConstraintResolutionForm-method-getConstraintViolationDescription' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.widget.ConstraintResolutionForm-method-getConstraintViolationDescription' class='name expandable'>getConstraintViolationDescription</a>( <span class='pre'>resolutionContext</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>resolutionContext</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-getDontAskValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.widget.ConstraintResolutionForm'>Gnt.widget.ConstraintResolutionForm</span><br/><a href='source/ConstraintResolutionForm.html#Gnt-widget-ConstraintResolutionForm-method-getDontAskValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.widget.ConstraintResolutionForm-method-getDontAskValue' class='name expandable'>getDontAskValue</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-getOptimalHeight' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.widget.ConstraintResolutionForm'>Gnt.widget.ConstraintResolutionForm</span><br/><a href='source/ConstraintResolutionForm.html#Gnt-widget-ConstraintResolutionForm-method-getOptimalHeight' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.widget.ConstraintResolutionForm-method-getOptimalHeight' class='name expandable'>getOptimalHeight</a>( <span class='pre'>width</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>width</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-getResolutionOptionDescription' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.widget.ConstraintResolutionForm'>Gnt.widget.ConstraintResolutionForm</span><br/><a href='source/ConstraintResolutionForm.html#Gnt-widget-ConstraintResolutionForm-method-getResolutionOptionDescription' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.widget.ConstraintResolutionForm-method-getResolutionOptionDescription' class='name expandable'>getResolutionOptionDescription</a>( <span class='pre'>rawDescription, resolutionContext</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>rawDescription</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>resolutionContext</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-initComponent' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.widget.ConstraintResolutionForm'>Gnt.widget.ConstraintResolutionForm</span><br/><a href='source/ConstraintResolutionForm.html#Gnt-widget-ConstraintResolutionForm-method-initComponent' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.widget.ConstraintResolutionForm-method-initComponent' class='name expandable'>initComponent</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-isLocaleApplied' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Sch.mixin.Localizable' rel='Sch.mixin.Localizable' class='defined-in docClass'>Sch.mixin.Localizable</a><br/><a href='source/Localizable2.html#Sch-mixin-Localizable-method-isLocaleApplied' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.mixin.Localizable-method-isLocaleApplied' class='name expandable'>isLocaleApplied</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-localize' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Sch.mixin.Localizable' rel='Sch.mixin.Localizable' class='defined-in docClass'>Sch.mixin.Localizable</a><br/><a href='source/Localizable2.html#Sch-mixin-Localizable-method-localize' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.mixin.Localizable-method-localize' class='name expandable'>localize</a>( <span class='pre'>id, [legacyHolderProp], [skipLocalizedCheck]</span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Retrieves translation of a phrase. ...</div><div class='long'><p>Retrieves translation of a phrase. There is a shorthand <a href=\"#!/api/Sch.mixin.Localizable-method-L\" rel=\"Sch.mixin.Localizable-method-L\" class=\"docClass\">L</a> for this method.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>id</span> : String<div class='sub-desc'><p>Identifier of phrase.</p>\n</div></li><li><span class='pre'>legacyHolderProp</span> : String (optional)<div class='sub-desc'><p>Legacy class property name containing locales.</p>\n<p>Defaults to: <code>this.legacyHolderProp</code></p></div></li><li><span class='pre'>skipLocalizedCheck</span> : Boolean (optional)<div class='sub-desc'><p>Do not localize class if it's not localized yet.</p>\n<p>Defaults to: <code>false</code></p></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>Translation of specified phrase.</p>\n</div></li></ul></div></div></div><div id='method-onUserActionCancel' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.widget.ConstraintResolutionForm'>Gnt.widget.ConstraintResolutionForm</span><br/><a href='source/ConstraintResolutionForm.html#Gnt-widget-ConstraintResolutionForm-method-onUserActionCancel' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.widget.ConstraintResolutionForm-method-onUserActionCancel' class='name expandable'>onUserActionCancel</a>( <span class='pre'>btn</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>btn</span> : Object<div class='sub-desc'></div></li></ul><h3 class='pa'>Fires</h3><ul><li>cancel</li></ul></div></div></div><div id='method-onUserActionOk' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.widget.ConstraintResolutionForm'>Gnt.widget.ConstraintResolutionForm</span><br/><a href='source/ConstraintResolutionForm.html#Gnt-widget-ConstraintResolutionForm-method-onUserActionOk' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.widget.ConstraintResolutionForm-method-onUserActionOk' class='name expandable'>onUserActionOk</a>( <span class='pre'>btn</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>btn</span> : Object<div class='sub-desc'></div></li></ul><h3 class='pa'>Fires</h3><ul><li>ok</li></ul></div></div></div><div id='method-setupFooterFromResolutionContext' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.widget.ConstraintResolutionForm'>Gnt.widget.ConstraintResolutionForm</span><br/><a href='source/ConstraintResolutionForm.html#Gnt-widget-ConstraintResolutionForm-method-setupFooterFromResolutionContext' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.widget.ConstraintResolutionForm-method-setupFooterFromResolutionContext' class='name expandable'>setupFooterFromResolutionContext</a>( <span class='pre'>resolutionContext</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>resolutionContext</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-setupItemsFromResolutionContext' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.widget.ConstraintResolutionForm'>Gnt.widget.ConstraintResolutionForm</span><br/><a href='source/ConstraintResolutionForm.html#Gnt-widget-ConstraintResolutionForm-method-setupItemsFromResolutionContext' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.widget.ConstraintResolutionForm-method-setupItemsFromResolutionContext' class='name expandable'>setupItemsFromResolutionContext</a>( <span class='pre'>resolutionContext</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>resolutionContext</span> : Object<div class='sub-desc'></div></li></ul></div></div></div></div></div></div></div>","meta":{}});