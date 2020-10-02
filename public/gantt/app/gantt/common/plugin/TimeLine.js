Ext.define('Common.plugin.TimeLine', {
    extend: "Sch.feature.AbstractTimeSpan",
    alias: "plugin.commonschedulertimeline",
    cls: "sch-timeline",
    showTip: true,
    innerTpl: null,
    prepareTemplateData: null,
    bodyComponent: null,
    headComponent: null,
    side: null,
    init: function (_0x5220x1) {
        if (!this.innerTpl) {
            this.innerTpl = new Ext.XTemplate('<span class="line-text">{text}</span>');
        }
        this.side = _0x5220x1.rtl ? "right" : "left";
        var innerTpl = this.innerTpl;
        this.template = new Ext.XTemplate("<tpl for=\".\">", "<div id=\"{id}\" " + (this.showTip ? "title=\"{[this.getTipText(values)]}\" " : "") + "class=\"{$cls}\" style=\"" + this.side + ":{left}px;top:{top}px;width:{width}px\">" + (innerTpl ? "{[this.renderInner(values)]}" : "") + "</div>", "</tpl>", {
            getTipText: function (_0x5220x5) {
                return _0x5220x1.getSchedulingView().getFormattedDate(_0x5220x5.date) + " " + (_0x5220x5.text || "")
            }, renderInner: function (_0x5220x5) {
                return innerTpl.apply(_0x5220x5)
            }
        });
        this.headerTemplate = new Ext.XTemplate("<tpl for=\".\">", "<div id=\"{id}\" class=\"{cls}\" title=\"{[values.name || values.text || \"\"]}\" style=\"{side}:{position}px;\">" + (innerTpl ? "{[this.renderInner(values)]}" : "") + "</div>", "</tpl>", {
            renderInner: function (_0x5220x5) {
                // return innerTpl.apply(_0x5220x5)
                return _0x5220x1.getSchedulingView().getFormattedDate(_0x5220x5.date)
            }
        });
        this.callParent(arguments)
    },
    renderBodyElementsInternal: function (_0x5220x2) {
        var _0x5220x3 = this.timeAxis.getStart(), _0x5220x1 = this.timeAxis.getEnd(),
            _0x5220x5 = this.getElementData(_0x5220x3, _0x5220x1, _0x5220x2);
        this.bodyComponent = this.template.append(this.getContainerEl(), _0x5220x5, true);
    },
    renderHeaderElements: function (timeAxisHorizontal) {
        var that = this;
        var headerContainerEl = this.getHeaderContainerEl();
        if (headerContainerEl) {
            var headerElDatas = this.getHeaderElementData(timeAxisHorizontal);
            if (headerElDatas && headerElDatas.length>0) {
                headerElDatas.forEach(function(headerElData, headerElDataIndex) {
                    var headComponent = that.headerTemplate.append(headerContainerEl, headerElData, true),
                        headComponentEl = Ext.dom.Element.get(headComponent);
                    headComponentEl.addListener('dblclick', function(e) {
                        console.log('todo edit timeline');
                        e.stopPropagation();
                    });
                    headComponentEl.addListener('contextmenu', function(e) {
                        Ext.Msg.show({
                            title:'删除',
                            message: '您确定要删除该时间线么？',
                            buttons: Ext.Msg.OKCANCEL,
                            buttonText: {ok:'确认',cancel:'取消'},
                            fn: function(btn) {
                                if (btn === 'ok') {
                                    var recordIndex = that.store.find('id', headerElData.internalId),
                                        record = recordIndex!==-1? that.store.getAt(recordIndex): null;
                                    if (record) {
                                        that.store.remove(record);
                                    }
                                }
                            }
                        });
                        e.stopPropagation();
                        e.stopEvent();
                    });
                    var headDrag = Ext.create('Ext.dd.DD', headComponent, 'timeLines', {
                        isTarget: false
                    });

                    var tip = new Ext.tip.ToolTip({
                        target: headComponentEl,
                        showDelay: 0,
                        trackMouse: true
                    });
                    var positionDate = headerElData.date;
                    tip.setHtml(Ext.Date.format(positionDate,"Y-m-d H:i:s"));

                    Ext.apply(headDrag, {
                        onDrag: function(e) {
                            var positionDate = that.schedulerView.getDateFromX(e.clientX);
                            tip.setHtml(Ext.Date.format(positionDate,"Y-m-d H:i:s"));
                            tip.setPosition(e.clientX);
                            tip.show();
                        },
                        onDragDrop: function(e, dropId){
                            if (!this.invalidDrop) {
                                // 获取放置位置的时间
                                var positionDate = that.schedulerView.getDateFromX(e.clientX);
                                console.log('positionDate', positionDate);
                                // 从store中找到旧日期的记录  改为新日期
                                var recordIndex = that.store.find('id', headerElData.internalId),
                                    record = recordIndex!==-1? that.store.getAt(recordIndex): null;
                                if (record) {
                                    record.set('date', positionDate);
                                    headerElData.date = positionDate;
                                    that.refreshSingle(null, timeAxisHorizontal || that.store.getRange());
                                }
                            }
                        },
                        onInvalidDrop : function() {
                            this.invalidDrop = true;
                        },
                        endDrag: function() {
                            // console.log('3333');
                        }
                    });
                    headDrag.setYConstraint(0,0);
                });
                var dropZone =  Ext.create('Ext.dd.DDTarget', headerContainerEl.dom, 'timeLines');
            }
        }
    },
    getElementData: function (_0x5220x7, _0x5220x3, _0x5220x11) {
        var store = this.store, schedulerView = this.schedulerView, isHorizontal = schedulerView.isHorizontal(),
            isWeekView = schedulerView.isWeekView(), range = _0x5220x11 || store.getRange(),
            _0x5220x2 = schedulerView.getTimeSpanRegion(_0x5220x7, null, this.expandToFitView), data = [],
            _0x5220xe, _0x5220xd, item, date, _0x5220x4;
        for (var i = 0, max = range.length; i < max; i++) {
            item = range[i];
            date = item.get("date");
            if (date && schedulerView.timeAxis.dateInAxis(date)) {
                _0x5220x4 = Ext.apply({}, this.getTemplateData(item));
                _0x5220x4.id = this.getElementId(item);
                _0x5220x4.$cls = this.getElementCls(item, _0x5220x4);
                if (isWeekView) {
                    _0x5220x2 = schedulerView.getTimeSpanRegion(date, date);
                    _0x5220x4.left = _0x5220x2.x;
                    _0x5220x4.top = _0x5220x2.y;
                    _0x5220x4.width = _0x5220x2.right - _0x5220x2.left
                } else {
                    var _0x5220x6 = schedulerView.getCoordinateFromDate(date);
                    if (isHorizontal) {
                        _0x5220x4.left = _0x5220x6
                    } else {
                        _0x5220x4.top = _0x5220x6
                    }
                }
                ;
                data.push(_0x5220x4)
            }
        }
        ;
        return data
    },
    getHeaderElementData: function (_0x5220x5) {
        var _0x5220x1 = this.timeAxis.getStart(), _0x5220xa = this.timeAxis.getEnd(),
            _0x5220xb = this.schedulerView.isHorizontal(), _0x5220x6 = [], _0x5220x8, _0x5220x2, _0x5220xc,
            _0x5220x4;
        _0x5220x5 = _0x5220x5 || this.store.getRange();
        for (var _0x5220x7 = 0, _0x5220x3 = _0x5220x5.length; _0x5220x7 < _0x5220x3; _0x5220x7++) {
            _0x5220x8 = _0x5220x5[_0x5220x7];
            _0x5220x2 = _0x5220x8.get("date");
            if (_0x5220x2 && Sch.util.Date.betweenLesser(_0x5220x2, _0x5220x1, _0x5220xa)) {
                _0x5220xc = this.getHeaderElementPosition(_0x5220x2);
                _0x5220x4 = this.getTemplateData(_0x5220x8);
                _0x5220x4 = Ext.apply({
                    side: _0x5220xb ? this.side : "top",
                    cls: this.getHeaderElementCls(_0x5220x8, _0x5220x4),
                    position: _0x5220xc
                }, _0x5220x4);
                _0x5220x4.internalId = _0x5220x8.id;
                _0x5220x4.id = this.getHeaderElementId(_0x5220x8);
                _0x5220x6.push(_0x5220x4)
            }
        }
        ;
        return _0x5220x6
    },
    getHeaderContainerEl: function () {
        var that = this;
        var headerContainerEl = this.headerContainerEl, _0x5220x5 = Ext.baseCSSPrefix, container;
        if (!headerContainerEl || !headerContainerEl.dom) {
            if (this.schedulerView.isHorizontal()) {
                var _0x5220x1 = this.panel.getHorizontalTimeAxisColumn();
                if (_0x5220x1.headerView) {
                    container = _0x5220x1.headerView.containerEl
                } else {
                    return null
                }
            } else {
                container = this.panel.lockedGrid.getView().el
            }
            if (container) {
                headerContainerEl = container.down("." + this.headerContainerCls);
                if (!headerContainerEl) {
                    headerContainerEl = container.appendChild({cls: this.headerContainerCls})
                }
                headerContainerEl.setWidth('100%');
                this.headerContainerEl = headerContainerEl;

                headerContainerEl.addListener('dblclick', function(e) {
                    var positionDate = that.schedulerView.getDateFromX(e.clientX);
                    // 添加点
                    that.addTimeLine({
                        date: positionDate
                    });
                    e.stopPropagation();
                });
            }
        }
        return headerContainerEl
    },
    renderElementsInternal: function () {
        this.renderElementsBuffered = false;
        var _0x5220x1 = this.schedulerView;
        if (this.disabled || _0x5220x1.isDestroyed || !this.getContainerEl() || _0x5220x1.store.getCount() === 0) {
            return
        }
        if (_0x5220x1.isWeekView()) {
            var _0x5220x2 = _0x5220x1.getColumnManager().getColumns();
            if (_0x5220x2[0] && !_0x5220x2[0]["rendered"]) {
                return
            }
        }
        this.removeElements();
        this.renderBodyElementsInternal();
        if (this.showHeaderElements) {
            // this.headerContainerEl = null;
            this.renderHeaderElements()
        }
        if (this.renderingDoneEvent) {
            this.fireEvent(this.renderingDoneEvent, this)
        }
    },
    addTimeLine: function(opts) {
        opts = opts || {};
        var store = this.store;
        var bean = new Major.model.TimeLine({
            text: opts.text,
            date: opts.date
        });
        store.add(bean);
    }
});