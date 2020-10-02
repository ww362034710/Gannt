Ext.define('Common.model.TaskSegment', {
    extend              : 'Gnt.model.TaskSegment',
    customizableFields: [
        {name: "cls", type: "string", persist: false, defaultValue: null}
    ],
    durationField:"duration",
    durationUnitField:"durationUnit",
    clsField:"cls",
    startDateField:"startDate",
    endDateField:"endDate",
    phantomIdField:"phantomId",
    setStartDateWithoutPropagation: function () {
        this.beginEdit();
        this.callParent(arguments);
        this.updateOffsetsByDates();
        // if (!this.inShifting && this.respectNeighbours && this.getNextSegment()) {
        //     var nextSegment = this.getNextSegment();
        //     var _0x5220x2 = this.getEndOffset() - nextSegment.getStartOffset();
        //     if (nextSegment && _0x5220x2 > 0) {
        //         nextSegment.suspendTaskNotifying();
        //         nextSegment.enableRespectNeighbours();
        //         nextSegment.shiftWithoutPropagation(_0x5220x2);
        //         nextSegment.resumeTaskNotifying();
        //         nextSegment.disableRespectNeighbours()
        //     }
        // }
        ;
        this.endEdit();
        return true
    },
    updateDatesByOffsets: function (_0x5220x7) {
        _0x5220x7 = _0x5220x7 || {};
        if (this.updatingDates || this.updatingOffsets) {
            return
        }
        ;
        var _0x5220x6 = _0x5220x7.isForward !== false, _0x5220x4 = _0x5220x7.useAbsoluteOffset !== false,
            _0x5220x2 = _0x5220x7.startDate, _0x5220x8 = _0x5220x7.endDate,
            _0x5220x3 = this.getTaskStore(true);
        if (!_0x5220x3) {
            return
        }
        ;
        this.updatingDates = true;
        var _0x5220x5, _0x5220x1;
        if (_0x5220x6) {
            _0x5220x1 = this.getPrevSegment();
            if (_0x5220x1 && !_0x5220x4) {
                _0x5220x5 = this.skipWorkingTime(_0x5220x1.getEndDate(), this.getStartOffset() - _0x5220x1.getEndOffset())
            } else {
                _0x5220x5 = this.skipWorkingTime(_0x5220x2 || this.getTask().getStartDate(), this.getStartOffset())
            }
        } else {
            _0x5220x1 = this.getNextSegment();
            if (_0x5220x1 && !_0x5220x4) {
                // _0x5220x5 = this.skipWorkingTime(_0x5220x1.getStartDate(), _0x5220x1.getStartOffset() - this.getEndOffset() + this.getDuration("MILLI"), false)
            } else {
                _0x5220x5 = this.skipWorkingTime(_0x5220x8 || this.getTask().getEndDate(), this.getDuration("MILLI"), false)
            }
        }
        ;
        this.setStartDateWithoutPropagation(_0x5220x5, true, _0x5220x3.skipWeekendsDuringDragDrop);
        this.updatingDates = false
    }
});
