/**
 * Created by Grain on 2017/5/13.
 */
(function(){
    window.PmProjectRecord = function() {
        var projectId,
            type,
            entityTpe,
            entityId,
            targetType,
            targetId,
            content,
            opUserId,
            logDate


        function getContent(templateName) {
            if (PmProjectRecord.templates.hasOwnProperty(templateName)) {
                baidu.template(PmProjectRecord.templates[templateName], this);
            }
        }
    }
    window.PmProjectRecord.templates = {
        gridView: '<!=opUser.name!> <!=content!>'
    }
})();