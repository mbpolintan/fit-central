import { Droppable, isBlazor, addClass } from '@syncfusion/ej2-base';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { setStyleAttribute, remove, updateBlazorTemplate, removeClass } from '@syncfusion/ej2-base';
import { getUpdateUsingRaf, appendChildren } from '../base/util';
import * as events from '../base/constant';
import { Row } from '../models/row';
import { RowRenderer } from './row-renderer';
import { CellMergeRender } from './cell-merge-renderer';
import { RowModelGenerator } from '../services/row-model-generator';
import { GroupModelGenerator } from '../services/group-model-generator';
import { getScrollBarWidth, isGroupAdaptive } from '../base/util';
/**
 * Content module is used to render grid content
 * @hidden
 */
var ContentRender = /** @class */ (function () {
    /**
     * Constructor for content renderer module
     */
    function ContentRender(parent, serviceLocator) {
        var _this = this;
        this.rows = [];
        this.freezeRows = [];
        this.movableRows = [];
        this.freezeRowElements = [];
        /** @hidden */
        this.currentInfo = {};
        this.isLoaded = true;
        this.viewColIndexes = [];
        this.drop = function (e) {
            _this.parent.notify(events.columnDrop, { target: e.target, droppedElement: e.droppedElement });
            remove(e.droppedElement);
        };
        this.infiniteCache = {};
        this.isRemove = false;
        this.visibleRows = [];
        this.visibleFrozenRows = [];
        this.isAddRows = false;
        this.isInfiniteFreeze = false;
        this.rafCallback = function (args) {
            var arg = args;
            return function () {
                if (_this.parent.getFrozenColumns() && _this.parent.enableVirtualization) {
                    var mContentRows = [].slice.call(_this.parent.getMovableVirtualContent().querySelectorAll('.e-row'));
                    var fContentRows = [].slice.call(_this.parent.getFrozenVirtualContent().querySelectorAll('.e-row'));
                    _this.isLoaded = !mContentRows ? false : mContentRows.length === fContentRows.length;
                    if (_this.parent.enableColumnVirtualization && args.requestType === 'virtualscroll' && _this.isLoaded) {
                        var mHdr = [].slice.call(_this.parent.getMovableVirtualHeader().querySelectorAll('.e-row'));
                        var fHdr = [].slice.call(_this.parent.getFrozenVirtualHeader().querySelectorAll('.e-row'));
                        _this.isLoaded = mHdr.length === fHdr.length;
                    }
                }
                _this.ariaService.setBusy(_this.getPanel().querySelector('.e-content'), false);
                if (_this.parent.isDestroyed) {
                    return;
                }
                var rows = _this.rows.slice(0);
                if (_this.parent.getFrozenColumns() !== 0) {
                    rows = args.isFrozen ? _this.freezeRows : _this.movableRows;
                }
                _this.parent.notify(events.contentReady, { rows: rows, args: arg });
                if (_this.isLoaded) {
                    _this.parent.trigger(events.dataBound, {}, function () {
                        if (_this.parent.allowTextWrap) {
                            _this.parent.notify(events.freezeRender, { case: 'textwrap' });
                        }
                    });
                }
                if (arg) {
                    var action = (arg.requestType || '').toLowerCase() + '-complete';
                    _this.parent.notify(action, arg);
                    if (args.requestType === 'batchsave') {
                        args.cancel = false;
                        _this.parent.trigger(events.actionComplete, args);
                    }
                }
                if (_this.isLoaded) {
                    _this.parent.hideSpinner();
                }
            };
        };
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.ariaService = this.serviceLocator.getService('ariaService');
        this.generator = this.getModelGenerator();
        if (this.parent.isDestroyed) {
            return;
        }
        if (!this.parent.enableColumnVirtualization && !this.parent.enableVirtualization) {
            this.parent.on(events.columnVisibilityChanged, this.setVisible, this);
        }
        this.parent.on(events.colGroupRefresh, this.colGroupRefresh, this);
        this.parent.on(events.uiUpdate, this.enableAfterRender, this);
        this.parent.on(events.refreshInfiniteModeBlocks, this.refreshContentRows, this);
        this.parent.on(events.beforeCellFocused, this.beforeCellFocused, this);
    }
    ContentRender.prototype.beforeCellFocused = function (e) {
        if (e.byKey && (e.keyArgs.action === 'upArrow' || e.keyArgs.action === 'downArrow')) {
            this.pressedKey = e.keyArgs.action;
        }
        else {
            this.pressedKey = undefined;
        }
    };
    /**
     * The function is used to render grid content div
     */
    ContentRender.prototype.renderPanel = function () {
        var gObj = this.parent;
        var div = this.parent.element.querySelector('.e-gridcontent');
        if (div) {
            this.ariaService.setOptions(this.parent.element.querySelector('.e-content'), { busy: false });
            this.setPanel(div);
            return;
        }
        div = this.parent.createElement('div', { className: 'e-gridcontent' });
        var innerDiv = this.parent.createElement('div', {
            className: 'e-content'
        });
        this.ariaService.setOptions(innerDiv, { busy: false });
        div.appendChild(innerDiv);
        this.setPanel(div);
        gObj.element.appendChild(div);
    };
    /**
     * The function is used to render grid content table
     */
    ContentRender.prototype.renderTable = function () {
        var contentDiv = this.getPanel();
        var virtualTable = contentDiv.querySelector('.e-virtualtable');
        var virtualTrack = contentDiv.querySelector('.e-virtualtrack');
        if (this.parent.enableVirtualization && !isNullOrUndefined(virtualTable) && !isNullOrUndefined(virtualTrack)
            && (!isBlazor() || (isBlazor() && !this.parent.isServerRendered))) {
            remove(virtualTable);
            remove(virtualTrack);
        }
        contentDiv.appendChild(this.createContentTable('_content_table'));
        this.setTable(contentDiv.querySelector('.e-table'));
        this.ariaService.setOptions(this.getTable(), {
            multiselectable: this.parent.selectionSettings.type === 'Multiple'
        });
        this.initializeContentDrop();
        if (this.parent.frozenRows) {
            this.parent.getHeaderContent().classList.add('e-frozenhdrcont');
        }
    };
    /**
     * The function is used to create content table elements
     * @return {Element}
     * @hidden
     */
    ContentRender.prototype.createContentTable = function (id) {
        var innerDiv = this.getPanel().firstElementChild;
        if (!isBlazor()) {
            if (this.getTable()) {
                remove(this.getTable());
            }
        }
        var table = innerDiv.querySelector('.e-table') ? innerDiv.querySelector('.e-table') :
            this.parent.createElement('table', { className: 'e-table', attrs: {
                    cellspacing: '0.25px', role: 'grid',
                    id: this.parent.element.id + id
                }
            });
        this.setColGroup(this.parent.element.querySelector('.e-gridheader').querySelector('colgroup').cloneNode(true));
        table.appendChild(this.getColGroup());
        table.appendChild(this.parent.createElement('tbody'));
        innerDiv.appendChild(table);
        return innerDiv;
    };
    ContentRender.prototype.splitRows = function (idx) {
        if (this.parent.getFrozenColumns()) {
            if (idx === 0) {
                this.freezeRows = this.rows;
                this.freezeRowElements = this.rowElements;
            }
            else {
                this.movableRows = this.rows;
            }
        }
    };
    /**
     * Refresh the content of the Grid.
     * @return {void}
     */
    // tslint:disable-next-line:max-func-body-length
    ContentRender.prototype.refreshContentRows = function (args) {
        var _this = this;
        if (args === void 0) { args = {}; }
        var gObj = this.parent;
        if (gObj.currentViewData.length === 0) {
            return;
        }
        var dataSource = this.currentMovableRows || gObj.currentViewData;
        var frag = document.createDocumentFragment();
        if (!this.initialPageRecords) {
            this.initialPageRecords = extend([], dataSource);
        }
        var hdrfrag = document.createDocumentFragment();
        var columns = gObj.getColumns();
        var tr;
        var hdrTbody;
        var frzCols = gObj.getFrozenColumns();
        var trElement;
        var row = new RowRenderer(this.serviceLocator, null, this.parent);
        var isInfiniteScroll = this.parent.enableInfiniteScrolling
            && args.requestType === 'infiniteScroll';
        this.rowElements = [];
        this.rows = [];
        var fCont = this.getPanel().querySelector('.e-frozencontent');
        var mCont = this.getPanel().querySelector('.e-movablecontent');
        var cont = this.getPanel().querySelector('.e-content');
        if (isGroupAdaptive(gObj)) {
            if (['sorting', 'filtering', 'searching', 'grouping', 'ungrouping', 'reorder']
                .some(function (value) { return args.requestType === value; })) {
                gObj.vcRows = [];
                gObj.vRows = [];
            }
        }
        var modelData;
        var isServerRendered = 'isServerRendered';
        if (isBlazor() && this.parent[isServerRendered]) {
            modelData = this.generator.generateRows(dataSource, args);
            if (this.parent.enableVirtualization) {
                this.prevInfo = this.prevInfo ? this.prevInfo : args.virtualInfo;
                this.prevInfo = args.virtualInfo.sentinelInfo && args.virtualInfo.sentinelInfo.axis === 'Y' && this.currentInfo.page &&
                    this.currentInfo.page !== args.virtualInfo.page ? this.currentInfo : args.virtualInfo;
            }
            this.rows = modelData;
            this.freezeRows = modelData;
            this.rowElements = [].slice.call(this.getTable().querySelectorAll('tr.e-row[data-uid]'));
            if (frzCols) {
                this.movableRows = modelData.map(function (mRow) {
                    var sRow = new Row(mRow);
                    sRow.cells = mRow.cells.slice(frzCols, mRow.cells.length);
                    mRow.cells = mRow.cells.slice(0, frzCols);
                    return sRow;
                });
                this.freezeRowElements = this.rowElements;
            }
            this.isLoaded = true;
            this.parent.hideSpinner();
            args.isFrozen = this.parent.getFrozenColumns() !== 0 && !args.isFrozen;
            var arg = extend({ rows: this.rows }, args);
            if (this.getTable().querySelector('.e-emptyrow')) {
                remove(this.getTable().querySelector('.e-emptyrow'));
                if (!isNullOrUndefined(this.getTable().querySelectorAll('.e-table > tbody')[1])) {
                    remove(this.getTable().querySelectorAll('.e-table > tbody')[1]);
                }
            }
            this.parent.notify('contentcolgroup', {});
            this.rafCallback(arg)();
            if (frzCols) {
                cont.style.overflowY = 'hidden';
                fCont.style.height = ((mCont.offsetHeight) - getScrollBarWidth()) + 'px';
                mCont.style.overflowY = this.parent.height !== 'auto' ? 'scroll' : 'auto';
                fCont.style.borderRightWidth = '1px';
                this.parent.notify(events.contentReady, { rows: this.movableRows, args: extend({}, arg, { isFrozen: false }) });
            }
            if (!(this.parent.isCheckBoxSelection || this.parent.selectionSettings.type === 'Multiple')
                || (!this.parent.isPersistSelection && !this.parent.enableVirtualization)) {
                var rowIndex = 'editRowIndex';
                if (this.parent.editSettings.mode === 'Normal' && !isNullOrUndefined(args[rowIndex])) {
                    this.parent.selectRow(args[rowIndex]);
                }
            }
            if (this.parent.enableVirtualization && !this.parent.getHeaderContent().querySelectorAll('.e-check').length) {
                var removeClassByUid = this.parent.getRows().filter(function (x) { return x.getAttribute('aria-selected'); })
                    .map(function (y) { return y.getAttribute('data-uid'); });
                var addClassByUid = this.parent.getRows().filter(function (x) { return x.getAttribute('aria-selected') === null; })
                    .map(function (y) { return y.getAttribute('data-uid'); });
                for (var i = 0; i < removeClassByUid.length; i++) {
                    if (!isNullOrUndefined(this.parent.getRowObjectFromUID(removeClassByUid[i])) &&
                        !this.parent.getRowObjectFromUID(removeClassByUid[i]).isSelected) {
                        this.parent.getRowElementByUID(removeClassByUid[i]).removeAttribute('aria-selected');
                        if (!isNullOrUndefined(this.parent.getRowElementByUID(removeClassByUid[i]).querySelector('.e-check'))) {
                            removeClass([this.parent.getRowElementByUID(removeClassByUid[i]).querySelector('.e-check')], ['e-check']);
                        }
                        for (var j = 0; j < this.parent.getRowElementByUID(removeClassByUid[i]).children.length; j++) {
                            this.parent.getRowElementByUID(removeClassByUid[i])
                                .children[j].classList.remove('e-selectionbackground', 'e-active');
                        }
                    }
                }
                for (var i = 0; i < addClassByUid.length; i++) {
                    if (!isNullOrUndefined(this.parent.getRowObjectFromUID(addClassByUid[i]))
                        && this.parent.getRowObjectFromUID(addClassByUid[i]).isSelected) {
                        this.parent.getRowElementByUID(addClassByUid[i]).setAttribute('aria-selected', 'true');
                        if (!isNullOrUndefined(this.parent.getRowElementByUID(addClassByUid[i]).querySelector('.e-frame'))) {
                            addClass([this.parent.getRowElementByUID(addClassByUid[i]).querySelector('.e-frame')], ['e-check']);
                        }
                        for (var j = 0; j < this.parent.getRowElementByUID(addClassByUid[i]).children.length; j++) {
                            this.parent.getRowElementByUID(addClassByUid[i])
                                .children[j].classList.add('e-selectionbackground', 'e-active');
                        }
                    }
                }
            }
            return;
        }
        if (this.parent.enableVirtualization && this.parent.getFrozenColumns()) {
            if (this.parent.enableColumnVirtualization && args.requestType === 'virtualscroll') {
                if (args.virtualInfo.sentinelInfo.axis === 'X') {
                    modelData = this.parent.contentModule.generateRows(dataSource, args);
                    args.renderMovableContent = true;
                }
                else if (mCont.scrollLeft > 0 && !args.renderMovableContent) {
                    this.viewColIndexes = args.virtualInfo.columnIndexes;
                    var indexes = [];
                    for (var i = 0; i < this.parent.getFrozenColumns(); i++) {
                        indexes.push(i);
                    }
                    this.parent.setColumnIndexesInView(indexes);
                    args.virtualInfo.columnIndexes = indexes;
                }
            }
            modelData = this.parent.contentModule.generateRows(dataSource, args);
        }
        else {
            modelData = this.checkInfiniteCache(modelData, args);
            if (!this.isAddRows) {
                modelData = this.generator.generateRows(dataSource, args);
            }
        }
        this.parent.notify(events.setInfiniteCache, { isInfiniteScroll: isInfiniteScroll, modelData: modelData, args: args });
        if (isNullOrUndefined(modelData[0].cells[0])) {
            mCont.querySelector('tbody').innerHTML = '';
        }
        var idx = modelData[0].cells[0].index;
        if (this.parent.enableColumnVirtualization && this.parent.getFrozenColumns() && args.renderMovableContent
            && args.requestType === 'virtualscroll' && mCont.scrollLeft > 0 && args.virtualInfo.columnIndexes[0] !== 0) {
            idx = this.parent.getFrozenColumns();
        }
        /* tslint:disable:no-any */
        if (args.requestType !== 'infiniteScroll' && this.parent.registeredTemplate
            && this.parent.registeredTemplate.template && !args.isFrozen) {
            var templatetoclear = [];
            for (var i = 0; i < this.parent.registeredTemplate.template.length; i++) {
                for (var j = 0; j < this.parent.registeredTemplate.template[i].rootNodes.length; j++) {
                    if (isNullOrUndefined(this.parent.registeredTemplate.template[i].rootNodes[j].parentNode)) {
                        templatetoclear.push(this.parent.registeredTemplate.template[i]);
                        /* tslint:enable:no-any */
                    }
                }
            }
            this.parent.destroyTemplate(['template'], templatetoclear);
        }
        if (this.parent.enableColumnVirtualization) {
            var cellMerge = new CellMergeRender(this.serviceLocator, this.parent);
            cellMerge.updateVirtualCells(modelData);
        }
        if (frzCols && idx >= frzCols) {
            this.tbody = mCont.querySelector('tbody');
        }
        else {
            this.tbody = this.getTable().querySelector('tbody');
        }
        var startIndex = 0;
        var blockLoad = true;
        if (isGroupAdaptive(gObj) && gObj.vcRows.length) {
            var top_1 = 'top';
            var scrollTop = !isNullOrUndefined(args.virtualInfo.offsets) ? args.virtualInfo.offsets.top :
                (!isNullOrUndefined(args.scrollTop) ? args.scrollTop[top_1] : 0);
            if (scrollTop !== 0) {
                var offsets_1 = gObj.vGroupOffsets;
                var bSize = gObj.pageSettings.pageSize / 2;
                var values = Object.keys(offsets_1).map(function (key) { return offsets_1[key]; });
                for (var m = 0; m < values.length; m++) {
                    if (scrollTop < values[m]) {
                        if (!isNullOrUndefined(args.virtualInfo) && args.virtualInfo.direction === 'up') {
                            args.virtualInfo.blockIndexes = m === 0 || m === 1 ? [1, 2] : [m, m + 1];
                            startIndex = m === 0 || m === 1 ? 0 : (m * bSize);
                            break;
                        }
                        else {
                            args.virtualInfo.blockIndexes = m === 0 || m === 1 ? [1, 2] : [m, m + 1];
                            startIndex = m === 0 || m === 1 ? 0 : (m) * bSize;
                            break;
                        }
                    }
                }
                if (scrollTop + this.contentPanel.firstElementChild.offsetHeight ===
                    this.contentPanel.firstElementChild.scrollHeight && !args.rowObject) {
                    blockLoad = false;
                }
            }
        }
        var isVFFrozenOnly = gObj.frozenRows && !gObj.getFrozenColumns() && this.parent.enableVirtualization
            && args.requestType === 'reorder';
        if ((gObj.frozenRows && args.requestType === 'virtualscroll' && args.virtualInfo.sentinelInfo.axis === 'X') || isVFFrozenOnly) {
            var bIndex = args.virtualInfo.blockIndexes;
            var page = args.virtualInfo.page;
            args.virtualInfo.blockIndexes = [1, 2];
            if (isVFFrozenOnly) {
                args.virtualInfo.page = 1;
            }
            var data = isVFFrozenOnly ? this.initialPageRecords : dataSource;
            var mhdrData = this.vgenerator
                .generateRows(data, args);
            mhdrData.splice(this.parent.frozenRows);
            for (var i = 0; i < this.parent.frozenRows; i++) {
                mhdrData[i].cells.splice(0, this.parent.getFrozenColumns());
                tr = row.render(mhdrData[i], columns);
                hdrfrag.appendChild(tr);
            }
            args.virtualInfo.blockIndexes = bIndex;
            args.virtualInfo.page = page;
            if (isVFFrozenOnly && args.virtualInfo.page === 1) {
                modelData.splice(0, this.parent.frozenRows);
            }
        }
        this.virtualFrozenHdrRefresh(hdrfrag, modelData, row, args, dataSource, columns);
        for (var i = startIndex, len = modelData.length; i < len; i++) {
            this.rows.push(modelData[i]);
            this.setInfiniteVisibleRows(args, modelData[i]);
            if (isGroupAdaptive(gObj) && this.rows.length >= (gObj.pageSettings.pageSize) && blockLoad) {
                break;
            }
            if (!gObj.rowTemplate) {
                tr = row.render(modelData[i], columns);
                var isVFreorder = this.ensureFrozenHeaderRender(args);
                if (gObj.frozenRows && i < gObj.frozenRows && !isInfiniteScroll && args.requestType !== 'virtualscroll' && isVFreorder) {
                    hdrfrag.appendChild(tr);
                }
                else {
                    frag.appendChild(tr);
                }
                if (modelData[i].isExpand) {
                    gObj.notify(events.expandChildGrid, tr.cells[gObj.groupSettings.columns.length]);
                }
            }
            else {
                var rowTemplateID = gObj.element.id + 'rowTemplate';
                var elements = gObj.getRowTemplate()(extend({ index: i }, dataSource[i]), gObj, 'rowTemplate', rowTemplateID);
                if (elements[0].tagName === 'TBODY') {
                    for (var j = 0; j < elements.length; j++) {
                        var isTR = elements[j].nodeName.toLowerCase() === 'tr';
                        if (isTR || (elements[j].querySelectorAll && elements[j].querySelectorAll('tr').length)) {
                            tr = isTR ? elements[j] : elements[j].querySelector('tr');
                        }
                    }
                    if (gObj.frozenRows && i < gObj.frozenRows) {
                        hdrfrag.appendChild(tr);
                    }
                    else {
                        frag.appendChild(tr);
                    }
                }
                else {
                    if (gObj.frozenRows && i < gObj.frozenRows) {
                        tr = appendChildren(hdrfrag, elements);
                    }
                    else {
                        // frag.appendChild(tr);
                        tr = appendChildren(frag, elements);
                        trElement = tr.lastElementChild;
                    }
                }
                var arg = { data: modelData[i].data, row: trElement ? trElement : tr };
                this.parent.trigger(events.rowDataBound, arg);
            }
            if (modelData[i].isDataRow) {
                this.rowElements.push(tr);
            }
            this.ariaService.setOptions(this.getTable(), { colcount: gObj.getColumns().length.toString() });
        }
        this.splitRows(idx);
        if ((gObj.frozenRows && args.requestType !== 'virtualscroll' && !isInfiniteScroll)
            || (args.requestType === 'virtualscroll' && args.virtualInfo.sentinelInfo && args.virtualInfo.sentinelInfo.axis === 'X')) {
            hdrTbody = frzCols ? gObj.getHeaderContent().querySelector(idx === 0 ? '.e-frozenheader'
                : '.e-movableheader').querySelector('tbody') : gObj.getHeaderTable().querySelector('tbody');
            hdrTbody.innerHTML = '';
            hdrTbody.appendChild(hdrfrag);
        }
        if (!gObj.enableVirtualization && gObj.frozenRows && idx === 0 && cont.offsetHeight === Number(gObj.height)) {
            cont.style.height = (cont.offsetHeight - hdrTbody.offsetHeight) + 'px';
        }
        if (frzCols && idx === 0) {
            this.getPanel().firstChild.style.overflowY = 'hidden';
        }
        if (!isBlazor() || this.parent.isJsComponent) {
            args.rows = this.rows.slice(0);
        }
        args.isFrozen = this.parent.getFrozenColumns() !== 0 && !args.isFrozen;
        this.index = idx;
        getUpdateUsingRaf(function () {
            _this.parent.notify(events.beforeFragAppend, args);
            var isVFTable = _this.parent.enableVirtualization && _this.parent.getFrozenColumns() !== 0;
            if (!_this.parent.enableVirtualization && !isInfiniteScroll) {
                remove(_this.tbody);
                _this.tbody = _this.parent.createElement('tbody');
            }
            if (frzCols && !isVFTable && !_this.parent.enableInfiniteScrolling) {
                _this.tbody.appendChild(frag);
                if (_this.index === 0) {
                    _this.isLoaded = false;
                    fCont.querySelector('table').appendChild(_this.tbody);
                }
                else {
                    if (_this.tbody.childElementCount < 1) {
                        _this.tbody.appendChild(_this.parent.createElement('tr').appendChild(_this.parent.createElement('td')));
                    }
                    _this.isLoaded = true;
                    mCont.querySelector('table').appendChild(_this.tbody);
                    if (_this.parent.getFrozenColumns() !== 0 && !_this.parent.allowTextWrap) {
                        _this.parent.notify(events.freezeRender, { case: 'refreshHeight' });
                    }
                    fCont.style.height = ((mCont.offsetHeight) - getScrollBarWidth()) + 'px';
                    mCont.style.overflowY = _this.parent.height !== 'auto' ? 'scroll' : 'auto';
                    fCont.style.borderRightWidth = '1px';
                }
            }
            else {
                if (gObj.rowTemplate) {
                    updateBlazorTemplate(gObj.element.id + 'rowTemplate', 'RowTemplate', gObj);
                }
                if (isVFTable) {
                    if (!args.renderMovableContent) {
                        _this.appendContent(fCont.querySelector('tbody'), frag, args);
                        if (_this.parent.enableColumnVirtualization && args.requestType === 'virtualscroll'
                            && mCont.scrollLeft > 0) {
                            _this.parent.setColumnIndexesInView(_this.viewColIndexes);
                            args.virtualInfo.columnIndexes = _this.viewColIndexes;
                        }
                    }
                    else {
                        _this.appendContent(mCont.querySelector('tbody'), frag, args);
                        if (args.virtualInfo && args.virtualInfo.direction !== 'right' && args.virtualInfo.direction !== 'left') {
                            fCont.style.height = ((mCont.offsetHeight) - getScrollBarWidth()) + 'px';
                        }
                        args.renderMovableContent = false;
                    }
                }
                else {
                    if (!isNullOrUndefined(_this.parent.infiniteScrollModule) && _this.parent.enableInfiniteScrolling) {
                        _this.isAddRows = false;
                        _this.parent.notify(events.removeInfiniteRows, { args: args });
                        _this.parent.notify(events.appendInfiniteContent, {
                            tbody: _this.tbody, frag: frag, args: args, rows: _this.rows,
                            rowElements: _this.rowElements, visibleRows: _this.visibleRows
                        });
                        if (frzCols && idx !== 0) {
                            fCont.style.height = ((mCont.offsetHeight) - getScrollBarWidth()) + 'px';
                            mCont.style.overflowY = _this.parent.height !== 'auto' ? 'scroll' : 'auto';
                            fCont.style.borderRightWidth = '1px';
                        }
                    }
                    else {
                        _this.appendContent(_this.tbody, frag, args);
                    }
                }
            }
            if (frzCols && idx === 0) {
                if (isVFTable) {
                    args.renderMovableContent = true;
                }
                _this.refreshContentRows(extend({}, args));
            }
            frag = null;
        }, this.rafCallback(extend({}, args)));
    };
    ContentRender.prototype.appendContent = function (tbody, frag, args) {
        tbody.appendChild(frag);
        this.getTable().appendChild(tbody);
    };
    ContentRender.prototype.ensureFrozenHeaderRender = function (args) {
        return !((this.parent.enableVirtualization
            && (args.requestType === 'reorder' || args.requestType === 'refresh')) || (this.parent.infiniteScrollSettings.enableCache
            && this.parent.frozenRows && this.parent.infiniteScrollModule.requestType === 'delete'
            && this.parent.pageSettings.currentPage !== 1));
    };
    ContentRender.prototype.checkInfiniteCache = function (modelData, args) {
        if (this.parent.infiniteScrollSettings.enableCache && args.requestType === 'infiniteScroll') {
            var index = args.isFrozen ? 1 : 0;
            var frozenCols = this.parent.getFrozenColumns();
            this.isAddRows = !isNullOrUndefined(this.infiniteCache[this.parent.pageSettings.currentPage]);
            if (frozenCols && !isNullOrUndefined(this.infiniteCache[this.parent.pageSettings.currentPage])) {
                this.isAddRows = this.infiniteCache[this.parent.pageSettings.currentPage][index].length !== 0;
            }
            if (this.isAddRows) {
                var data = !frozenCols ? this.infiniteCache[this.parent.pageSettings.currentPage]
                    : this.infiniteCache[this.parent.pageSettings.currentPage][index];
                modelData = this.parent.pageSettings.currentPage === 1 ? data.slice(this.parent.frozenRows) : data;
            }
            return modelData;
        }
        return null;
    };
    ContentRender.prototype.setInfiniteVisibleRows = function (args, data) {
        var frozenCols = this.parent.getFrozenColumns();
        if (this.parent.enableInfiniteScrolling && !this.parent.infiniteScrollSettings.enableCache) {
            if (frozenCols) {
                !args.isFrozen ? this.visibleFrozenRows.push(data) : this.visibleRows.push(data);
            }
            else if (!this.parent.infiniteScrollSettings.enableCache) {
                this.visibleRows.push(data);
            }
        }
    };
    ContentRender.prototype.getCurrentBlockInfiniteRecords = function (isFreeze) {
        var data = [];
        if (this.parent.infiniteScrollSettings.enableCache) {
            if (!Object.keys(this.infiniteCache).length) {
                return [];
            }
            var frozenCols = this.parent.getFrozenColumns();
            var rows = this.parent.getRows();
            var index = parseInt(rows[this.parent.frozenRows].getAttribute('aria-rowindex'), 10);
            var first = Math.ceil((index + 1) / this.parent.pageSettings.pageSize);
            index = parseInt(rows[rows.length - 1].getAttribute('aria-rowindex'), 10);
            var last = Math.ceil(index / this.parent.pageSettings.pageSize);
            if (frozenCols) {
                var idx = isFreeze ? 0 : 1;
                for (var i = first; i <= last; i++) {
                    data = !data.length ? this.infiniteCache[i][idx]
                        : data.concat(this.infiniteCache[i][idx]);
                }
                if (this.parent.frozenRows && this.parent.pageSettings.currentPage > 1) {
                    data = this.infiniteCache[1][idx].slice(0, this.parent.frozenRows).concat(data);
                }
            }
            else {
                for (var i = first; i <= last; i++) {
                    data = !data.length ? this.infiniteCache[i] : data.concat(this.infiniteCache[i]);
                }
                if (this.parent.frozenRows && this.parent.pageSettings.currentPage > 1) {
                    data = this.infiniteCache[1].slice(0, this.parent.frozenRows).concat(data);
                }
            }
        }
        return data;
    };
    ContentRender.prototype.getReorderedVFRows = function (args) {
        return this.parent.contentModule.getReorderedFrozenRows(args);
    };
    ContentRender.prototype.virtualFrozenHdrRefresh = function (hdrfrag, modelData, row, args, dataSource, columns) {
        if (this.parent.frozenRows && this.parent.getFrozenColumns() && this.parent.enableVirtualization
            && (args.requestType === 'reorder' || args.requestType === 'refresh')) {
            var tr = void 0;
            this.currentMovableRows = dataSource;
            var fhdrData = this.getReorderedVFRows(args);
            for (var i = 0; i < fhdrData.length; i++) {
                tr = row.render(fhdrData[i], columns);
                hdrfrag.appendChild(tr);
            }
            if (args.virtualInfo.page === 1) {
                modelData.splice(0, this.parent.frozenRows);
            }
            if (args.renderMovableContent) {
                this.parent.currentViewData = this.currentMovableRows;
                this.currentMovableRows = null;
            }
        }
    };
    ContentRender.prototype.getInfiniteRows = function () {
        var rows = [];
        var frozenCols = this.parent.getFrozenColumns();
        if (this.parent.enableInfiniteScrolling) {
            if (this.parent.infiniteScrollSettings.enableCache) {
                var keys = Object.keys(this.infiniteCache);
                for (var i = 0; i < keys.length; i++) {
                    rows = !frozenCols ? rows.concat(this.infiniteCache[keys[i]]) : rows.concat(this.infiniteCache[keys[i]][0]);
                }
            }
            else {
                rows = frozenCols ? this.visibleFrozenRows : this.visibleRows;
            }
        }
        return rows;
    };
    ContentRender.prototype.getInfiniteMovableRows = function () {
        var infiniteCacheRows = this.getCurrentBlockInfiniteRecords();
        var infiniteRows = this.parent.enableInfiniteScrolling ? infiniteCacheRows.length ? infiniteCacheRows
            : this.visibleRows : [];
        return infiniteRows;
    };
    /**
     * Get the content div element of grid
     * @return {Element}
     */
    ContentRender.prototype.getPanel = function () {
        return this.contentPanel;
    };
    /**
     * Set the content div element of grid
     * @param  {Element} panel
     */
    ContentRender.prototype.setPanel = function (panel) {
        this.contentPanel = panel;
    };
    /**
     * Get the content table element of grid
     * @return {Element}
     */
    ContentRender.prototype.getTable = function () {
        return this.contentTable;
    };
    /**
     * Set the content table element of grid
     * @param  {Element} table
     */
    ContentRender.prototype.setTable = function (table) {
        this.contentTable = table;
    };
    /**
     * Get the Row collection in the Grid.
     * @returns {Row[] | HTMLCollectionOf<HTMLTableRowElement>}
     */
    ContentRender.prototype.getRows = function () {
        var infiniteRows = this.getInfiniteRows();
        return infiniteRows.length ? infiniteRows : this.parent.getFrozenColumns() ? this.freezeRows : this.rows;
    };
    /**
     * Get the Movable Row collection in the Freeze pane Grid.
     * @returns {Row[] | HTMLCollectionOf<HTMLTableRowElement>}
     */
    ContentRender.prototype.getMovableRows = function () {
        var infiniteRows = this.getInfiniteMovableRows();
        return infiniteRows.length ? infiniteRows : this.movableRows;
    };
    /**
     * Get the content table data row elements
     * @return {Element}
     */
    ContentRender.prototype.getRowElements = function () {
        return this.parent.getFrozenColumns() ? this.freezeRowElements : this.rowElements;
    };
    /**
     * Get the Freeze pane movable content table data row elements
     * @return {Element}
     */
    ContentRender.prototype.getMovableRowElements = function () {
        return this.rowElements;
    };
    /**
     * Get the content table data row elements
     * @return {Element}
     */
    ContentRender.prototype.setRowElements = function (elements) {
        this.rowElements = elements;
    };
    /**
     * Get the header colgroup element
     * @returns {Element}
     */
    ContentRender.prototype.getColGroup = function () {
        return this.colgroup;
    };
    /**
     * Set the header colgroup element
     * @param {Element} colgroup
     * @returns {Element}
     */
    ContentRender.prototype.setColGroup = function (colGroup) {
        if (!isNullOrUndefined(colGroup)) {
            colGroup.id = 'content-' + colGroup.id;
        }
        return this.colgroup = colGroup;
    };
    /**
     * Function to hide content table column based on visible property
     * @param  {Column[]} columns?
     */
    ContentRender.prototype.setVisible = function (columns) {
        var gObj = this.parent;
        if (isBlazor() && gObj.isServerRendered) {
            this.parent.notify('setvisibility', columns);
        }
        var frzCols = gObj.getFrozenColumns();
        var rows = [];
        if (frzCols) {
            var fRows = this.freezeRows;
            var mRows = this.movableRows;
            var rowLen = fRows.length;
            var cellLen = void 0;
            for (var i = 0, row = void 0; i < rowLen; i++) {
                cellLen = mRows[i].cells.length;
                row = fRows[i].clone();
                for (var j = 0; j < cellLen; j++) {
                    row.cells.push(mRows[i].cells[j]);
                }
                rows.push(row);
            }
        }
        else {
            rows = this.getRows();
        }
        var element;
        var testRow;
        rows.some(function (r) { if (r.isDataRow) {
            testRow = r;
        } return r.isDataRow; });
        var tasks = [];
        var needFullRefresh = true;
        if (!gObj.groupSettings.columns.length && testRow) {
            needFullRefresh = false;
        }
        var tr = gObj.getDataRows();
        var args = {};
        var infiniteData = this.infiniteRowVisibility();
        var contentrows = infiniteData ? infiniteData
            : this.rows.filter(function (row) { return !row.isDetailRow; });
        for (var c = 0, clen = columns.length; c < clen; c++) {
            var column = columns[c];
            var idx = this.parent.getNormalizedColumnIndex(column.uid);
            var colIdx = this.parent.getColumnIndexByUid(column.uid);
            var displayVal = column.visible === true ? '' : 'none';
            if (idx !== -1 && testRow && idx < testRow.cells.length) {
                if (frzCols) {
                    if (idx < frzCols) {
                        setStyleAttribute(this.getColGroup().childNodes[idx], { 'display': displayVal });
                        var infiniteFreezeData = this.infiniteRowVisibility(true);
                        contentrows = infiniteFreezeData ? infiniteFreezeData : this.freezeRows;
                        tr = gObj.getDataRows();
                    }
                    else {
                        var mTable = gObj.getContent().querySelector('.e-movablecontent').querySelector('colgroup');
                        colIdx = idx = idx - frzCols;
                        setStyleAttribute(mTable.childNodes[idx], { 'display': displayVal });
                        tr = gObj.getMovableDataRows();
                        var infiniteMovableData = this.infiniteRowVisibility();
                        contentrows = infiniteMovableData ? infiniteMovableData : this.movableRows;
                    }
                }
                else {
                    setStyleAttribute(this.getColGroup().childNodes[idx], { 'display': displayVal });
                }
            }
            if (!needFullRefresh) {
                this.setDisplayNone(tr, colIdx, displayVal, contentrows);
            }
            if (!this.parent.invokedFromMedia && column.hideAtMedia) {
                this.parent.updateMediaColumns(column);
            }
            this.parent.invokedFromMedia = false;
        }
        if (needFullRefresh) {
            this.refreshContentRows({ requestType: 'refresh' });
        }
        else {
            if (!this.parent.getFrozenColumns()) {
                this.parent.notify(events.partialRefresh, { rows: contentrows, args: args });
            }
            else {
                this.parent.notify(events.partialRefresh, { rows: this.freezeRows, args: { isFrozen: true, rows: this.freezeRows } });
                this.parent.notify(events.partialRefresh, { rows: this.movableRows, args: { isFrozen: false, rows: this.movableRows } });
            }
        }
    };
    /**
     * @hidden
     */
    ContentRender.prototype.setDisplayNone = function (tr, idx, displayVal, rows) {
        var trs = Object.keys(tr);
        for (var i = 0; i < trs.length; i++) {
            var td = tr[trs[i]].querySelectorAll('td.e-rowcell')[idx];
            if (tr[trs[i]].querySelectorAll('td.e-rowcell').length && td) {
                setStyleAttribute(tr[trs[i]].querySelectorAll('td.e-rowcell')[idx], { 'display': displayVal });
                if (tr[trs[i]].querySelectorAll('td.e-rowcell')[idx].classList.contains('e-hide')) {
                    removeClass([tr[trs[i]].querySelectorAll('td.e-rowcell')[idx]], ['e-hide']);
                }
                if (this.parent.isRowDragable()) {
                    rows[trs[i]].cells[idx + 1].visible = displayVal === '' ? true : false;
                }
                else {
                    rows[trs[i]].cells[idx].visible = displayVal === '' ? true : false;
                }
            }
        }
        this.parent.notify(events.infiniteShowHide, { visible: displayVal, index: idx, isFreeze: this.isInfiniteFreeze });
    };
    ContentRender.prototype.infiniteRowVisibility = function (isFreeze) {
        var infiniteData;
        if (this.parent.enableInfiniteScrolling) {
            this.isInfiniteFreeze = isFreeze;
            if (this.parent.infiniteScrollSettings.enableCache) {
                infiniteData = isFreeze ? this.getCurrentBlockInfiniteRecords(true) : this.getCurrentBlockInfiniteRecords();
            }
            else {
                infiniteData = isFreeze ? this.visibleFrozenRows : this.visibleRows;
            }
        }
        return infiniteData;
    };
    ContentRender.prototype.colGroupRefresh = function () {
        if (this.getColGroup()) {
            var colGroup = void 0;
            if (this.parent.enableColumnVirtualization && this.parent.getFrozenColumns()
                && this.parent.contentModule.isXaxis()) {
                colGroup = this.parent.getMovableVirtualHeader().querySelector('colgroup').cloneNode(true);
            }
            else {
                colGroup = isBlazor() ? this.parent.getHeaderTable().querySelector('colgroup').cloneNode(true) :
                    this.parent.element.querySelector('.e-gridheader').querySelector('colgroup').cloneNode(true);
            }
            this.getTable().replaceChild(colGroup, this.getColGroup());
            this.setColGroup(colGroup);
        }
    };
    ContentRender.prototype.initializeContentDrop = function () {
        var gObj = this.parent;
        var drop = new Droppable(gObj.getContent(), {
            accept: '.e-dragclone',
            drop: this.drop
        });
    };
    ContentRender.prototype.canSkip = function (column, row, index) {
        /**
         * Skip the toggle visiblity operation when one of the following success
         * 1. Grid has empty records
         * 2. column visible property is unchanged
         * 3. cell`s isVisible property is same as column`s visible property.
         */
        return isNullOrUndefined(row) || //(1)
            isNullOrUndefined(column.visible) || //(2)    
            row.cells[index].visible === column.visible; //(3)
    };
    ContentRender.prototype.getModelGenerator = function () {
        return this.generator = this.parent.allowGrouping ? new GroupModelGenerator(this.parent) : new RowModelGenerator(this.parent);
    };
    ContentRender.prototype.renderEmpty = function (tbody) {
        if (isBlazor() && !this.parent.isJsComponent && this.parent.frozenRows) {
            return;
        }
        this.getTable().appendChild(tbody);
        if (this.parent.frozenRows) {
            this.parent.getHeaderContent().querySelector('tbody').innerHTML = '';
        }
    };
    ContentRender.prototype.setSelection = function (uid, set, clearAll) {
        if (this.parent.getFrozenColumns()) {
            var rows = this.getMovableRows().filter(function (row) { return clearAll || uid === row.uid; });
            for (var i = 0; i < rows.length; i++) {
                rows[i].isSelected = set;
            }
        }
        var row = this.getRows().filter(function (row) { return clearAll || uid === row.uid; });
        for (var j = 0; j < row.length; j++) {
            row[j].isSelected = set;
            var cells = row[j].cells;
            for (var k = 0; k < cells.length; k++) {
                cells[k].isSelected = set;
            }
        }
    };
    ContentRender.prototype.getRowByIndex = function (index) {
        index = this.getInfiniteRowIndex(index);
        return this.parent.getDataRows()[index];
    };
    ContentRender.prototype.getInfiniteRowIndex = function (index) {
        if (this.parent.infiniteScrollSettings.enableCache) {
            var fRows = this.parent.frozenRows;
            var idx = fRows > index ? 0 : fRows;
            var firstRowIndex = parseInt(this.parent.getRows()[idx].getAttribute('aria-rowindex'), 10);
            index = fRows > index ? index : (index - firstRowIndex) + fRows;
        }
        return index;
    };
    ContentRender.prototype.getVirtualRowIndex = function (index) {
        return index;
    };
    ContentRender.prototype.getMovableRowByIndex = function (index) {
        index = this.getInfiniteRowIndex(index);
        return this.parent.getMovableDataRows()[index];
    };
    ContentRender.prototype.enableAfterRender = function (e) {
        if (e.module === 'group' && e.enable) {
            this.generator = this.getModelGenerator();
        }
    };
    ContentRender.prototype.setRowObjects = function (rows) {
        this.rows = rows;
    };
    return ContentRender;
}());
export { ContentRender };
