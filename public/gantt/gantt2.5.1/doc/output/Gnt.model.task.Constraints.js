Ext.data.JsonP.Gnt_model_task_Constraints({"tagname":"class","name":"Gnt.model.task.Constraints","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"Constraints.js","href":"Constraints.html#Gnt-model-task-Constraints"}],"mixins":[],"protected":true,"aliases":{},"alternateClassNames":[],"extends":"Ext.Base","requires":["Gnt.constraint.Base","Gnt.constraint.FinishNoEarlierThan","Gnt.constraint.FinishNoLaterThan","Gnt.constraint.MustFinishOn","Gnt.constraint.MustStartOn","Gnt.constraint.StartNoEarlierThan","Gnt.constraint.StartNoLaterThan"],"uses":[],"members":[{"name":"getConstraintClass","tagname":"method","owner":"Gnt.model.task.Constraints","id":"method-getConstraintClass","meta":{}},{"name":"hasConstraint","tagname":"method","owner":"Gnt.model.task.Constraints","id":"method-hasConstraint","meta":{}},{"name":"isConstraintSatisfied","tagname":"method","owner":"Gnt.model.task.Constraints","id":"method-isConstraintSatisfied","meta":{}},{"name":"setConstraint","tagname":"method","owner":"Gnt.model.task.Constraints","id":"method-setConstraint","meta":{}},{"name":"setConstraintDate","tagname":"method","owner":"Gnt.model.task.Constraints","id":"method-setConstraintDate","meta":{}},{"name":"setConstraintType","tagname":"method","owner":"Gnt.model.task.Constraints","id":"method-setConstraintType","meta":{}},{"name":"verifyConstraint","tagname":"method","owner":"Gnt.model.task.Constraints","id":"method-verifyConstraint","meta":{"private":true}}],"code_type":"ext_define","id":"class-Gnt.model.task.Constraints","component":false,"superclasses":["Ext.Base"],"subclasses":[],"mixedInto":["Gnt.model.Task"],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.Base<div class='subclass '><strong>Gnt.model.task.Constraints</strong></div></div><h4>Requires</h4><div class='dependency'>Gnt.constraint.Base</div><div class='dependency'>Gnt.constraint.FinishNoEarlierThan</div><div class='dependency'>Gnt.constraint.FinishNoLaterThan</div><div class='dependency'>Gnt.constraint.MustFinishOn</div><div class='dependency'>Gnt.constraint.MustStartOn</div><div class='dependency'>Gnt.constraint.StartNoEarlierThan</div><div class='dependency'>Gnt.constraint.StartNoLaterThan</div><h4>Mixed into</h4><div class='dependency'><a href='#!/api/Gnt.model.Task' rel='Gnt.model.Task' class='docClass'>Gnt.model.Task</a></div><h4>Files</h4><div class='dependency'><a href='source/Constraints.html#Gnt-model-task-Constraints' target='_blank'>Constraints.js</a></div></pre><div class='doc-contents'><p>Internal mixin class providing additional logic and functionality related to task constraints.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-getConstraintClass' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.model.task.Constraints'>Gnt.model.task.Constraints</span><br/><a href='source/Constraints.html#Gnt-model-task-Constraints-method-getConstraintClass' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.model.task.Constraints-method-getConstraintClass' class='name expandable'>getConstraintClass</a>( <span class='pre'></span> ) : Gnt.constraint.Base<span class=\"signature\"></span></div><div class='description'><div class='short'>Returns a constraint singleton class corresponding to the constraint type currently set for the task. ...</div><div class='long'><p>Returns a constraint singleton class corresponding to the constraint type currently set for the task.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Gnt.constraint.Base</span><div class='sub-desc'><p>subclass of</p>\n</div></li></ul></div></div></div><div id='method-hasConstraint' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.model.task.Constraints'>Gnt.model.task.Constraints</span><br/><a href='source/Constraints.html#Gnt-model-task-Constraints-method-hasConstraint' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.model.task.Constraints-method-hasConstraint' class='name expandable'>hasConstraint</a>( <span class='pre'></span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Checks whether a constraint is set for the task. ...</div><div class='long'><p>Checks whether a constraint is set for the task.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-isConstraintSatisfied' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.model.task.Constraints'>Gnt.model.task.Constraints</span><br/><a href='source/Constraints.html#Gnt-model-task-Constraints-method-isConstraintSatisfied' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.model.task.Constraints-method-isConstraintSatisfied' class='name expandable'>isConstraintSatisfied</a>( <span class='pre'></span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Returns true if task has no constraint set or if a constraint set is satisfied by the task. ...</div><div class='long'><p>Returns true if task has no constraint set or if a constraint set is satisfied by the task.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-setConstraint' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.model.task.Constraints'>Gnt.model.task.Constraints</span><br/><a href='source/Constraints.html#Gnt-model-task-Constraints-method-setConstraint' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.model.task.Constraints-method-setConstraint' class='name expandable'>setConstraint</a>( <span class='pre'>type, date, [callback]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the constraint type and constraining date (if applicable) to the task. ...</div><div class='long'><p>Sets the constraint type and constraining date (if applicable) to the task.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>type</span> : String<div class='sub-desc'><p>Constraint type, see <a href=\"#!/api/Gnt.model.task.Constraints-method-setConstraintType\" rel=\"Gnt.model.task.Constraints-method-setConstraintType\" class=\"docClass\">setConstraintType</a> for further description.</p>\n</div></li><li><span class='pre'>date</span> : Date<div class='sub-desc'><p>Constraint date</p>\n</div></li><li><span class='pre'>callback</span> : Function (optional)<div class='sub-desc'><p>Callback to call after constraint application and constraint conflict resolution\n if any.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>cancelChanges</span> : Boolean<div class='sub-desc'><p>Flag showing that the setting has caused a constraint violation\n and a user opted for cancelling the change and thus nothing has been updated.</p>\n</div></li><li><span class='pre'>affectedTasks</span> : Object<div class='sub-desc'><p>Object containing a map (by id) of tasks affected by changes propagation.</p>\n</div></li></ul></div></li></ul></div></div></div><div id='method-setConstraintDate' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.model.task.Constraints'>Gnt.model.task.Constraints</span><br/><a href='source/Constraints.html#Gnt-model-task-Constraints-method-setConstraintDate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.model.task.Constraints-method-setConstraintDate' class='name expandable'>setConstraintDate</a>( <span class='pre'>date, [callback]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the constraint date of the task. ...</div><div class='long'><p>Sets the constraint date of the task.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>date</span> : Date<div class='sub-desc'><p>Constraint date</p>\n</div></li><li><span class='pre'>callback</span> : Function (optional)<div class='sub-desc'><p>Callback to call after constraint application and constraint conflict resolution\n if any.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>cancelChanges</span> : Boolean<div class='sub-desc'><p>Flag showing that the setting has caused a constraint violation\n and a user opted for canceling the change and thus nothing has been updated.</p>\n</div></li><li><span class='pre'>affectedTasks</span> : Object<div class='sub-desc'><p>Object containing a map (by id) of tasks affected by changes propagation.</p>\n</div></li></ul></div></li></ul></div></div></div><div id='method-setConstraintType' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.model.task.Constraints'>Gnt.model.task.Constraints</span><br/><a href='source/Constraints.html#Gnt-model-task-Constraints-method-setConstraintType' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.model.task.Constraints-method-setConstraintType' class='name expandable'>setConstraintType</a>( <span class='pre'>type, [callback]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the constraint type of the task. ...</div><div class='long'><p>Sets the constraint type of the task. The type string can be one of the following values:</p>\n\n<ul>\n<li>finishnoearlierthan</li>\n<li>finishnolaterthan</li>\n<li>mustfinishon</li>\n<li>muststarton</li>\n<li>startnoearlierthan</li>\n<li>startnolaterthan</li>\n</ul>\n\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>type</span> : String<div class='sub-desc'><p>Constraint type</p>\n</div></li><li><span class='pre'>callback</span> : Function (optional)<div class='sub-desc'><p>Callback to call after constraint application and constraint conflict resolution\n if any.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>cancelChanges</span> : Boolean<div class='sub-desc'><p>Flag showing that the setting has caused a constraint violation\n and a user opted for canceling the change and thus nothing has been updated.</p>\n</div></li><li><span class='pre'>affectedTasks</span> : Object<div class='sub-desc'><p>Object containing a map (by id) of tasks affected by changes propagation.</p>\n</div></li></ul></div></li></ul></div></div></div><div id='method-verifyConstraint' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.model.task.Constraints'>Gnt.model.task.Constraints</span><br/><a href='source/Constraints.html#Gnt-model-task-Constraints-method-verifyConstraint' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.model.task.Constraints-method-verifyConstraint' class='name expandable'>verifyConstraint</a>( <span class='pre'>[onceResolvedContinueHere]</span> ) : Boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Verifies the constraint of the task. ...</div><div class='long'><p>Verifies the constraint of the task.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>onceResolvedContinueHere</span> : Function (optional)<div class='sub-desc'><p>Callback function to be called after constraint conflict resolution.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>constraintSatisfied</span> : Boolean<div class='sub-desc'><p>Flag showing whether constraint has been satisfied or violated.</p>\n</div></li><li><span class='pre'>cancelChanges</span> : Boolean<div class='sub-desc'><p>Flag showing whether a user has opted for changes to be canceled.</p>\n</div></li></ul></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>True if no constraint conflict has been found, false otherwise</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{"protected":true}});