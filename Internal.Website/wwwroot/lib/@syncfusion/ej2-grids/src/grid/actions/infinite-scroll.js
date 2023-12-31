import { isNullOrUndefined, remove, extend } from '@syncfusion/ej2-base';
import { RowModelGenerator } from '../services/row-model-generator';
import { FreezeRowModelGenerator } from '../services/freeze-row-model-generator';
import { RowRenderer } from '../renderer/row-renderer';
import * as events from '../base/constant';
import { getScrollBarWidth, ensureLastRow, ensureFirstRow, getEditedDataIndex } from '../base/util';
/**
 * Infinite Scrolling class
 */
var InfiniteScroll = /** @class */ (function () {
    /**
     * Constructor for the Grid infinite scrolling.
     * @hidden
     */
    function InfiniteScroll(parent, serviceLocator) {
        this.infiniteCache = {};
        this.infiniteFrozenCache = {};
        this.isDownScroll = false;
        this.isUpScroll = false;
        this.isScroll = true;
        this.enableContinuousScroll = false;
        this.initialRender = true;
        this.isRemove = false;
        this.isInitialCollapse = false;
        this.prevScrollTop = 0;
        this.actions = ['filtering', 'searching', 'grouping', 'ungrouping', 'reorder', 'sorting'];
        this.keys = ['downArrow', 'upArrow', 'PageUp', 'PageDown'];
        this.rowTop = 0;
        this.isInitialMovableRender = true;
        this.virtualInfiniteData = {};
        this.isCancel = false;
        this.emptyRowData = {};
        this.isNormaledit = false;
        this.isInfiniteScroll = false;
        this.isLastPage = false;
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.isNormaledit = this.parent.editSettings.mode === 'Normal';
        this.addEventListener();
        this.rowModelGenerator = this.parent.getFrozenColumns() ? new FreezeRowModelGenerator(this.parent)
            : new RowModelGenerator(this.parent);
    }
    InfiniteScroll.prototype.getModuleName = function () {
        return 'infiniteScroll';
    };
    /**
     * @hidden
     */
    InfiniteScroll.prototype.addEventListener = function () {
        this.parent.on(events.dataReady, this.onDataReady, this);
        this.parent.on(events.dataSourceModified, this.dataSourceModified, this);
        this.parent.on(events.infinitePageQuery, this.infinitePageQuery, this);
        this.parent.on(events.infiniteScrollHandler, this.infiniteScrollHandler, this);
        this.parent.on(events.beforeCellFocused, this.infiniteCellFocus, this);
        this.parent.on(events.appendInfiniteContent, this.appendInfiniteRows, this);
        this.parent.on(events.removeInfiniteRows, this.removeInfiniteCacheRows, this);
        this.parent.on(events.resetInfiniteBlocks, this.resetInfiniteBlocks, this);
        this.parent.on(events.setInfiniteCache, this.setCache, this);
        this.parent.on(events.initialCollapse, this.ensureIntialCollapse, this);
        this.parent.on(events.keyPressed, this.infiniteCellFocus, this);
        this.parent.on(events.infiniteShowHide, this.setDisplayNone, this);
        this.parent.on(events.virtualScrollEditActionBegin, this.editActionBegin, this);
        this.parent.on(events.getVirtualData, this.getVirtualInfiniteData, this);
        this.parent.on(events.editReset, this.resetInfiniteEdit, this);
        this.parent.on(events.virtualScrollEditSuccess, this.infiniteEditSuccess, this);
        this.parent.on(events.refreshVirtualCache, this.refreshInfiniteCache, this);
        this.parent.on(events.infiniteEditHandler, this.infiniteEditHandler, this);
        this.parent.on(events.virtualScrollAddActionBegin, this.infiniteAddActionBegin, this);
        this.parent.on(events.modelChanged, this.modelChanged, this);
        this.parent.addEventListener(events.actionBegin, this.actionBegin.bind(this));
        this.parent.addEventListener(events.actionComplete, this.actionComplete.bind(this));
    };
    /**
     * @hidden
     */
    InfiniteScroll.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.dataReady, this.onDataReady);
        this.parent.off(events.dataSourceModified, this.dataSourceModified);
        this.parent.off(events.infinitePageQuery, this.infinitePageQuery);
        this.parent.off(events.infiniteScrollHandler, this.infiniteScrollHandler);
        this.parent.off(events.beforeCellFocused, this.infiniteCellFocus);
        this.parent.off(events.appendInfiniteContent, this.appendInfiniteRows);
        this.parent.off(events.removeInfiniteRows, this.removeInfiniteCacheRows);
        this.parent.off(events.resetInfiniteBlocks, this.resetInfiniteBlocks);
        this.parent.off(events.setInfiniteCache, this.setCache);
        this.parent.off(events.initialCollapse, this.ensureIntialCollapse);
        this.parent.off(events.keyPressed, this.infiniteCellFocus);
        this.parent.off(events.infiniteShowHide, this.setDisplayNone);
        this.parent.off(events.virtualScrollEditActionBegin, this.editActionBegin);
        this.parent.off(events.getVirtualData, this.getVirtualInfiniteData);
        this.parent.off(events.editReset, this.resetInfiniteEdit);
        this.parent.off(events.virtualScrollEditSuccess, this.infiniteEditSuccess);
        this.parent.off(events.refreshVirtualCache, this.refreshInfiniteCache);
        this.parent.off(events.infiniteEditHandler, this.infiniteEditHandler);
        this.parent.off(events.virtualScrollAddActionBegin, this.infiniteAddActionBegin);
        this.parent.off(events.modelChanged, this.modelChanged);
        this.parent.removeEventListener(events.actionBegin, this.actionBegin.bind(this));
        this.parent.removeEventListener(events.actionComplete, this.actionComplete.bind(this));
    };
    InfiniteScroll.prototype.modelChanged = function (args) {
        if (args.requestType !== 'infiniteScroll' && (args.requestType === 'delete' || this.requestType === 'add')) {
            var rows = this.parent.getRows();
            this.firstIndex = parseInt(rows[0].getAttribute('aria-rowindex'), 10);
            this.firstBlock = Math.ceil((this.firstIndex + 1) / this.parent.pageSettings.pageSize);
            this.lastIndex = parseInt(rows[rows.length - 1].getAttribute('aria-rowindex'), 10);
            if (args.requestType === 'delete') {
                var rowObj = this.parent.getRowsObject();
                args.startIndex = this.parent.infiniteScrollSettings.enableCache
                    ? (this.firstBlock - 1) * this.parent.pageSettings.pageSize : rowObj[rowObj.length - 1].index;
            }
            else {
                args.startIndex = this.firstIndex;
            }
            if (!this.parent.infiniteScrollSettings.enableCache
                && this.parent.pageSettings.currentPage === this.maxPage && args.requestType === 'delete') {
                this.isLastPage = true;
                this.lastIndex = this.lastIndex - 1;
            }
        }
    };
    InfiniteScroll.prototype.infiniteAddActionBegin = function (args) {
        if (this.isNormaledit) {
            this.isAdd = true;
            if (this.parent.infiniteScrollSettings.enableCache) {
                if (!Object.keys(this.emptyRowData).length) {
                    this.createEmptyRowdata();
                }
                if (this.parent.pageSettings.currentPage > 1) {
                    args.startEdit = false;
                    this.resetInfiniteBlocks({}, true);
                    this.makeRequest({ currentPage: 1 });
                }
            }
        }
    };
    InfiniteScroll.prototype.infiniteEditHandler = function (args) {
        if (!this.parent.infiniteScrollSettings.enableCache && (args.e.requestType === 'delete'
            || (args.e.requestType === 'save' && this.requestType === 'add'))) {
            var frozenCols = this.parent.getFrozenColumns();
            var rowElms = this.parent.getRows();
            var rows = this.parent.getRowsObject();
            if (this.ensureRowAvailability(rows, args.result[0])) {
                this.resetRowIndex(rows, args.e, rowElms, this.requestType === 'add');
                if (frozenCols) {
                    var rows_1 = this.parent.getMovableRowsObject();
                    this.resetRowIndex(rows_1, args.e, this.parent.getMovableDataRows(), this.requestType === 'add');
                }
                if (!this.isLastPage) {
                    this.createRow(rows, args);
                }
                else {
                    this.isLastPage = false;
                    this.parent.pageSettings.currentPage = this.maxPage;
                    if (this.parent.selectionModule.index < this.parent.frozenRows) {
                        remove(rowElms[this.parent.frozenRows - 1]);
                        this.createRow([rows[this.parent.frozenRows - 1]], args, false, true);
                        if (frozenCols) {
                            var movableRows = this.parent.getMovableDataRows();
                            remove(movableRows[this.parent.frozenRows]);
                            this.createRow([this.parent.getMovableRowsObject()[this.parent.frozenRows - 1]], args, true, true);
                        }
                        this.setRowElements();
                    }
                }
            }
            this.parent.hideSpinner();
            this.requestType === 'delete' ? this.parent.notify(events.deleteComplete, args.e)
                : this.parent.notify(events.saveComplete, args.e);
        }
    };
    InfiniteScroll.prototype.createRow = function (rows, args, isMovable, isFrozenRows) {
        var row = !isFrozenRows ? this.generateRows(args.result, args.e) : rows;
        var rowRenderer = new RowRenderer(this.serviceLocator, null, this.parent);
        var tbody = !this.parent.getFrozenColumns() ? this.parent.getContent().querySelector('tbody') : isMovable
            ? this.parent.getMovableVirtualContent().querySelector('tbody') : this.parent.getFrozenVirtualContent().querySelector('tbody');
        if (this.parent.frozenRows) {
            tbody = isFrozenRows && this.requestType !== 'add' || !isFrozenRows && this.requestType === 'add'
                ? !this.parent.getFrozenColumns() ? this.parent.getHeaderContent().querySelector('tbody')
                    : isMovable ? this.parent.getMovableVirtualHeader().querySelector('tbody')
                        : this.parent.getFrozenVirtualHeader().querySelector('tbody') : tbody;
        }
        for (var i = row.length - 1; i >= 0; i--) {
            if (this.requestType === 'delete') {
                tbody.appendChild(rowRenderer.render(row[i], this.parent.getColumns()));
            }
            else {
                tbody.insertBefore(rowRenderer.render(row[i], this.parent.getColumns()), tbody.firstElementChild);
            }
        }
        if (!isFrozenRows && this.parent.frozenRows
            && (this.parent.selectionModule.index < this.parent.frozenRows || this.requestType === 'add')) {
            var rowElems = isMovable ? this.parent.getMovableDataRows() : this.parent.getRows();
            var index = isMovable && this.requestType === 'add' ? this.parent.frozenRows : this.parent.frozenRows - 1;
            remove(rowElems[index]);
            this.createRow([rows[this.parent.frozenRows - 1]], args, isMovable, true);
        }
        if (!this.parent.infiniteScrollSettings.enableCache && !isFrozenRows) {
            if (!this.parent.getFrozenColumns() || isMovable) {
                this.setRowElements();
                this.parent.contentModule.visibleRows = this.requestType === 'add'
                    ? row.concat(rows) : rows.concat(row);
            }
            else {
                this.parent.contentModule.visibleFrozenRows = this.requestType === 'add'
                    ? row.concat(rows) : rows.concat(row);
                this.createRow(this.parent.getMovableRowsObject(), args, true);
            }
        }
    };
    InfiniteScroll.prototype.ensureRowAvailability = function (rows, data) {
        var resume = true;
        if (this.parent.frozenRows && !this.parent.infiniteScrollSettings.enableCache
            && this.parent.sortSettings.columns && this.requestType === 'add') {
            var key = this.parent.getPrimaryKeyFieldNames()[0];
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].data[key] === data[key]) {
                    resume = false;
                    break;
                }
            }
        }
        return resume;
    };
    InfiniteScroll.prototype.generateRows = function (data, args) {
        return this.rowModelGenerator.generateRows(data, args);
    };
    InfiniteScroll.prototype.resetRowIndex = function (rows, args, rowElms, isAdd) {
        var keyField = this.parent.getPrimaryKeyFieldNames()[0];
        var isRemove = !(rowElms.length % this.parent.pageSettings.pageSize);
        if (isAdd) {
            if (isRemove) {
                remove(rowElms[rows.length - 1]);
                rowElms.splice(rows.length - 1, 1);
                rows.splice(rows.length - 1, 1);
            }
        }
        else {
            rows.filter(function (e, index) {
                if (e.data[keyField] === args.data[0][keyField]) {
                    rows.splice(index, 1);
                    remove(rowElms[index]);
                    rowElms.splice(index, 1);
                }
            });
        }
        var startIndex = isAdd ? 1 : 0;
        for (var i = 0; i < rows.length; i++) {
            rows[i].index = startIndex;
            rowElms[i].setAttribute('aria-rowindex', startIndex.toString());
            this.resetCellIndex(rowElms[i].cells, startIndex);
            startIndex++;
        }
        if (!rows.length) {
            this.renderEmptyRow();
        }
    };
    InfiniteScroll.prototype.renderEmptyRow = function () {
        this.parent.renderModule.emptyRow(true);
    };
    InfiniteScroll.prototype.resetCellIndex = function (cells, index) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].setAttribute('index', index.toString());
        }
    };
    InfiniteScroll.prototype.setDisplayNone = function (args) {
        if (this.parent.infiniteScrollSettings.enableCache) {
            var frozenCols = this.parent.getFrozenColumns();
            var keys = frozenCols ? Object.keys(this.infiniteFrozenCache) : Object.keys(this.infiniteCache);
            for (var i = 1; i <= keys.length; i++) {
                var cache = frozenCols ? args.isFreeze ? this.infiniteFrozenCache[i][0]
                    : this.infiniteFrozenCache[i][1] : this.infiniteCache[i];
                cache.filter(function (e) {
                    e.cells[args.index].visible = args.visible === '';
                });
            }
            this.resetContentModuleCache(frozenCols ? this.infiniteFrozenCache : this.infiniteCache);
        }
    };
    InfiniteScroll.prototype.refreshInfiniteCache = function (data) {
        this.getEditedRowObject().data = data;
    };
    InfiniteScroll.prototype.getEditedRowObject = function () {
        var rowObjects = this.parent.getRowsObject();
        var editedrow;
        for (var i = 0; i < rowObjects.length; i++) {
            if (rowObjects[i].index === this.editRowIndex) {
                editedrow = rowObjects[i];
            }
        }
        return editedrow;
    };
    InfiniteScroll.prototype.infiniteEditSuccess = function (args) {
        if (this.isNormaledit) {
            if (!this.isAdd && args.data) {
                this.updateCurrentViewRecords(args.data);
            }
            this.isAdd = false;
        }
    };
    InfiniteScroll.prototype.updateCurrentViewRecords = function (data) {
        var index = getEditedDataIndex(this.parent, data);
        if (!isNullOrUndefined(index)) {
            this.parent.getCurrentViewRecords()[index] = data;
        }
    };
    InfiniteScroll.prototype.actionBegin = function (args) {
        if (args.requestType === 'add' || args.requestType === 'delete') {
            this.requestType = args.requestType;
        }
    };
    InfiniteScroll.prototype.actionComplete = function (args) {
        if (args.requestType === 'delete' || args.requestType === 'save' || args.requestType === 'cancel') {
            this.requestType = this.empty;
            this.isCancel = args.requestType === 'cancel' || args.requestType === 'save';
            this.isAdd = this.isEdit = false;
            if (this.isNormaledit) {
                this.editRowIndex = this.empty;
                this.virtualInfiniteData = {};
                this.parent.editModule.previousVirtualData = {};
            }
        }
    };
    InfiniteScroll.prototype.resetInfiniteEdit = function () {
        if (this.parent.enableInfiniteScrolling && this.isNormaledit) {
            if ((this.parent.editSettings.allowEditing && this.isEdit) || (this.parent.editSettings.allowAdding && this.isAdd)) {
                this.parent.isEdit = true;
            }
        }
    };
    InfiniteScroll.prototype.getVirtualInfiniteData = function (data) {
        data.virtualData = this.virtualInfiniteData;
        data.isAdd = this.isAdd;
        data.isCancel = this.isCancel;
    };
    InfiniteScroll.prototype.editActionBegin = function (e) {
        this.isEdit = true;
        this.editRowIndex = e.index;
        var rowObject = extend({}, this.getEditedRowObject().data);
        e.data = Object.keys(this.virtualInfiniteData).length ? this.virtualInfiniteData : rowObject;
    };
    InfiniteScroll.prototype.dataSourceModified = function () {
        this.resetInfiniteBlocks({ requestType: this.empty }, true);
    };
    InfiniteScroll.prototype.onDataReady = function (e) {
        if (!isNullOrUndefined(e.count)) {
            this.maxPage = Math.ceil(e.count / this.parent.pageSettings.pageSize);
        }
    };
    InfiniteScroll.prototype.ensureIntialCollapse = function (isExpand) {
        this.isInitialCollapse = !isExpand;
    };
    InfiniteScroll.prototype.infiniteScrollHandler = function (e) {
        var _this = this;
        this.restoreInfiniteEdit();
        this.restoreInfiniteAdd();
        var targetEle = e.target;
        var isInfinite = targetEle.classList.contains('e-content')
            || targetEle.classList.contains('e-movablecontent');
        if (isInfinite && this.parent.enableInfiniteScrolling) {
            var scrollEle = this.parent.getFrozenColumns() ? this.parent.getMovableVirtualContent()
                : this.parent.getContent().firstElementChild;
            this.prevScrollTop = scrollEle.scrollTop;
            var rows = this.parent.getRows();
            var index = parseInt(rows[rows.length - 1].getAttribute('aria-rowindex'), 10) + 1;
            var prevPage = this.parent.pageSettings.currentPage;
            var args = void 0;
            var offset = targetEle.scrollHeight - targetEle.scrollTop;
            var round = Math.round(targetEle.scrollHeight - targetEle.scrollTop);
            var floor = offset < targetEle.clientHeight ? Math.ceil(offset) : Math.floor(offset);
            var isBottom = (floor === targetEle.clientHeight || round === targetEle.clientHeight);
            if (this.isScroll && isBottom && (this.parent.pageSettings.currentPage <= this.maxPage - 1 || this.enableContinuousScroll)) {
                if (this.parent.infiniteScrollSettings.enableCache) {
                    this.isUpScroll = false;
                    this.isDownScroll = true;
                    setTimeout(function () {
                        _this.isScroll = true;
                    }, 600);
                }
                var rows_2 = [].slice.call(scrollEle.querySelectorAll('.e-row:not(.e-addedrow)'));
                var row = rows_2[rows_2.length - 1];
                var rowIndex = parseInt(row.getAttribute('aria-rowindex'), 10);
                this.parent.pageSettings.currentPage = Math.ceil(rowIndex / this.parent.pageSettings.pageSize) + 1;
                args = {
                    requestType: 'infiniteScroll',
                    currentPage: this.parent.pageSettings.currentPage,
                    prevPage: prevPage,
                    startIndex: index,
                    direction: 'down'
                };
                this.makeRequest(args);
            }
            if (this.isScroll && this.parent.infiniteScrollSettings.enableCache && targetEle.scrollTop === 0
                && this.parent.pageSettings.currentPage !== 1) {
                if (this.parent.infiniteScrollSettings.enableCache) {
                    this.isDownScroll = false;
                    this.isUpScroll = true;
                    setTimeout(function () {
                        _this.isScroll = true;
                    }, 600);
                }
                var row = [].slice.call(scrollEle.querySelectorAll('.e-row'));
                var rowIndex = parseInt(row[this.parent.pageSettings.pageSize - 1].getAttribute('aria-rowindex'), 10);
                var startIndex = parseInt(row[0].getAttribute('aria-rowindex'), 10) - this.parent.pageSettings.pageSize;
                this.parent.pageSettings.currentPage = Math.ceil(rowIndex / this.parent.pageSettings.pageSize) - 1;
                if (this.parent.pageSettings.currentPage) {
                    args = {
                        requestType: 'infiniteScroll',
                        currentPage: this.parent.pageSettings.currentPage,
                        prevPage: prevPage,
                        startIndex: startIndex,
                        direction: 'up'
                    };
                    this.makeRequest(args);
                }
            }
            if (this.parent.infiniteScrollSettings.enableCache && !this.isScroll && isNullOrUndefined(args)) {
                if (this.isDownScroll || this.isUpScroll) {
                    scrollEle.scrollTop = this.top;
                }
            }
        }
    };
    InfiniteScroll.prototype.makeRequest = function (args) {
        var _this = this;
        if (this.parent.pageSettings.currentPage !== args.prevPage) {
            if (this.parent.pageSettings.currentPage <= this.maxPage) {
                this.isInfiniteScroll = true;
                if (isNullOrUndefined(this.infiniteCache[args.currentPage])) {
                    setTimeout(function () {
                        _this.getVirtualInfiniteEditedData();
                        _this.parent.notify('model-changed', args);
                    }, 100);
                }
                else {
                    setTimeout(function () {
                        _this.getVirtualInfiniteEditedData();
                        _this.parent.notify(events.refreshInfiniteModeBlocks, args);
                    }, 100);
                }
            }
            else {
                this.parent.pageSettings.currentPage = this.maxPage;
            }
        }
    };
    InfiniteScroll.prototype.infinitePageQuery = function (query) {
        if (this.initialRender) {
            this.initialRender = false;
            this.intialPageQuery(query);
        }
        else {
            if (!this.isInfiniteScroll && (this.requestType === 'delete' || this.requestType === 'add')) {
                this.editPageQuery(query);
            }
            else {
                query.page(this.parent.pageSettings.currentPage, this.parent.pageSettings.pageSize);
            }
        }
    };
    InfiniteScroll.prototype.editPageQuery = function (query) {
        var initialBlocks = this.parent.infiniteScrollSettings.initialBlocks;
        var isCache = this.parent.infiniteScrollSettings.enableCache;
        if (isCache) {
            this.infiniteCache = {};
            this.infiniteFrozenCache = {};
            query.skip(this.firstIndex);
            query.take(initialBlocks * this.parent.pageSettings.pageSize);
        }
        else {
            if (this.parent.editSettings.mode === 'Dialog') {
                this.parent.clearSelection();
            }
            var index = this.requestType === 'delete' ? this.lastIndex : this.firstIndex;
            query.skip(index);
            query.take(1);
        }
    };
    InfiniteScroll.prototype.intialPageQuery = function (query) {
        if (this.parent.infiniteScrollSettings.enableCache
            && this.parent.infiniteScrollSettings.initialBlocks > this.parent.infiniteScrollSettings.maxBlocks) {
            this.parent.infiniteScrollSettings.initialBlocks = this.parent.infiniteScrollSettings.maxBlocks;
        }
        var pageSize = this.parent.pageSettings.pageSize * this.parent.infiniteScrollSettings.initialBlocks;
        query.page(1, pageSize);
    };
    InfiniteScroll.prototype.infiniteCellFocus = function (e) {
        if (e.byKey && (e.keyArgs.action === 'upArrow' || e.keyArgs.action === 'downArrow')) {
            this.pressedKey = e.keyArgs.action;
            var ele = document.activeElement;
            var rowIndex = parseInt(ele.parentElement.getAttribute('aria-rowindex'), 10);
            var scrollEle = this.parent.getContent().firstElementChild;
            this.rowIndex = e.keyArgs.action === 'downArrow' ? rowIndex + 1 : rowIndex - 1;
            this.cellIndex = parseInt(ele.getAttribute('aria-colindex'), 10);
            var row = this.parent.getRowByIndex(rowIndex);
            var visibleRowCount = Math.floor(scrollEle.offsetHeight / this.parent.getRowHeight());
            if (!row || ensureLastRow(row, this.parent) || ensureFirstRow(row, this.rowTop)) {
                var height = row ? row.getBoundingClientRect().height : this.parent.getRowHeight();
                if (!this.parent.infiniteScrollSettings.enableCache) {
                    if (e.keyArgs.action === 'downArrow' && (ensureLastRow(row, this.parent) || !row)) {
                        var nTop = (this.rowIndex - visibleRowCount) * height;
                        var oTop = scrollEle.scrollTop + this.parent.getRowHeight();
                        scrollEle.scrollTop = nTop < oTop ? oTop : nTop;
                    }
                    if (e.keyArgs.action === 'upArrow' && ensureFirstRow(row, this.rowTop)) {
                        scrollEle.scrollTop = this.rowIndex * height;
                    }
                }
            }
            else {
                this.pressedKey = this.empty;
            }
        }
        else if (e.key === 'PageDown' || e.key === 'PageUp') {
            this.pressedKey = e.key;
        }
    };
    InfiniteScroll.prototype.createEmptyRowdata = function () {
        var _this = this;
        this.parent.getColumns().filter(function (e) {
            _this.emptyRowData[e.field] = _this.empty;
        });
    };
    InfiniteScroll.prototype.getVirtualInfiniteEditedData = function () {
        var editForm = this.parent.element.querySelector('.e-editedrow');
        var addForm = this.parent.element.querySelector('.e-addedrow');
        var gridForm = this.parent.element.querySelector('.e-gridform');
        if (this.parent.infiniteScrollSettings.enableCache && (editForm || addForm)) {
            var rowData = editForm ? extend({}, this.getEditedRowObject().data)
                : extend({}, this.emptyRowData);
            this.virtualInfiniteData = this.parent.editModule.getCurrentEditedData(gridForm, rowData);
            if (this.parent.getFrozenColumns()) {
                this.virtualInfiniteData = this.parent.editModule
                    .getCurrentEditedData(this.parent.getMovableVirtualContent().querySelector('.e-gridform'), rowData);
            }
        }
    };
    InfiniteScroll.prototype.restoreInfiniteEdit = function () {
        var content = this.parent.getFrozenColumns() ? this.parent.getMovableVirtualContent()
            : this.parent.getContent().firstElementChild;
        var frozenEdit = this.parent.frozenRows ? this.editRowIndex >= this.parent.frozenRows : true;
        if (this.isNormaledit && this.parent.infiniteScrollSettings.enableCache && frozenEdit) {
            if (this.parent.editSettings.allowEditing && !isNullOrUndefined(this.editRowIndex)) {
                var row = this.parent.getRowByIndex(this.editRowIndex);
                if (Object.keys(this.virtualInfiniteData).length && row && !this.parent.getContent().querySelector('.e-editedrow')) {
                    var top_1 = row.getBoundingClientRect().top;
                    if (top_1 < content.offsetHeight && top_1 > this.parent.getRowHeight()) {
                        this.parent.isEdit = false;
                        this.parent.editModule.startEdit(row);
                    }
                }
            }
        }
    };
    InfiniteScroll.prototype.restoreInfiniteAdd = function () {
        var content = this.parent.getFrozenColumns() ? this.parent.getMovableVirtualContent()
            : this.parent.getContent().firstElementChild;
        if (this.parent.getRowByIndex(0) && this.isNormaledit && this.parent.infiniteScrollSettings.enableCache
            && this.isAdd && !content.querySelector('.e-addedrow')) {
            var isTop = content.scrollTop < this.parent.getRowHeight();
            if (isTop) {
                this.parent.isEdit = false;
                this.parent.addRecord();
            }
        }
    };
    InfiniteScroll.prototype.appendInfiniteRows = function (e) {
        var target = document.activeElement;
        var frozenCols = this.parent.getFrozenColumns();
        var scrollEle = frozenCols ? this.parent.getMovableVirtualContent()
            : this.parent.getContent().firstElementChild;
        var isInfiniteScroll = this.parent.enableInfiniteScrolling && e.args.requestType === 'infiniteScroll';
        if ((isInfiniteScroll && !e.args.isFrozen) || !isInfiniteScroll) {
            if (isInfiniteScroll && e.args.direction === 'up') {
                e.tbody.insertBefore(e.frag, e.tbody.firstElementChild);
            }
            else {
                e.tbody.appendChild(e.frag);
            }
        }
        if (!frozenCols) {
            this.parent.contentModule.getTable().appendChild(e.tbody);
        }
        else {
            if (isInfiniteScroll) {
                if (e.args.isFrozen) {
                    this.frozenFrag = e.frag;
                }
                else {
                    var tbody = this.parent.getFrozenVirtualContent().querySelector('tbody');
                    e.args.direction === 'up' ? tbody.insertBefore(this.frozenFrag, tbody.firstElementChild)
                        : tbody.appendChild(this.frozenFrag);
                    this.parent.getMovableVirtualContent().querySelector('.e-table').appendChild(e.tbody);
                }
            }
            else {
                var table = e.args.isFrozen ? this.parent.getFrozenVirtualContent().querySelector('.e-table')
                    : this.parent.getMovableVirtualContent().querySelector('.e-table');
                table.appendChild(e.tbody);
            }
        }
        if (!e.args.isFrozen) {
            this.rowTop = !this.rowTop ? this.parent.getRows()[0].getBoundingClientRect().top : this.rowTop;
            if (isInfiniteScroll) {
                if (this.parent.infiniteScrollSettings.enableCache && this.isRemove) {
                    scrollEle.scrollTop = this.top;
                    if (frozenCols) {
                        this.parent.getFrozenVirtualContent().scrollTop = this.top;
                    }
                }
                this.setRowElements();
                this.selectNewRow(e.tbody, e.args.startIndex);
                this.pressedKey = undefined;
            }
            this.restoreInfiniteAdd();
        }
        this.isInfiniteScroll = false;
    };
    InfiniteScroll.prototype.setRowElements = function () {
        if (this.parent.getFrozenColumns()) {
            this.parent.contentModule.rowElements =
                [].slice.call(this.parent.element.querySelectorAll('.e-movableheader .e-row, .e-movablecontent .e-row'));
            this.parent.contentModule.freezeRowElements =
                [].slice.call(this.parent.element.querySelectorAll('.e-frozenheader .e-row, .e-frozencontent .e-row'));
        }
        else {
            this.parent.contentModule.rowElements =
                [].slice.call(this.parent.element.querySelectorAll('.e-row:not(.e-addedrow)'));
        }
    };
    InfiniteScroll.prototype.selectNewRow = function (tbody, startIndex) {
        var _this = this;
        var row = this.parent.getRowByIndex(this.rowIndex);
        if (this.keys.some(function (value) { return value === _this.pressedKey; })) {
            if (this.pressedKey === 'downArrow' || (this.parent.infiniteScrollSettings.enableCache && this.pressedKey === 'upArrow')) {
                setTimeout(function () {
                    // tslint:disable-next-line:no-any
                    var target = row.cells[0];
                    target.focus({ preventScroll: true });
                    _this.parent.selectRow(_this.rowIndex);
                    _this.parent.getContent().firstElementChild.scrollTop += _this.parent.getRowHeight();
                }, 0);
            }
            if (this.pressedKey === 'PageDown') {
                var row_1 = this.parent.getRowByIndex(startIndex);
                if (row_1) {
                    row_1.cells[0].focus();
                }
            }
            if (this.pressedKey === 'PageUp') {
                tbody.querySelector('.e-row').cells[0].focus();
            }
        }
    };
    InfiniteScroll.prototype.removeInfiniteCacheRows = function (e) {
        var isInfiniteScroll = this.parent.enableInfiniteScrolling && e.args.requestType === 'infiniteScroll';
        if (!e.args.isFrozen && isInfiniteScroll && this.parent.infiniteScrollSettings.enableCache && this.isRemove) {
            var rows = [].slice.call(this.parent.getContentTable().querySelectorAll('.e-row'));
            if (e.args.direction === 'down') {
                if (this.parent.allowGrouping && this.parent.groupSettings.columns.length) {
                    var captionRows = [].slice.call(this.parent.getContentTable().querySelectorAll('tr'));
                    this.removeCaptionRows(captionRows, e.args);
                }
                var addRowCount = this.parent.element.querySelector('.e-addedrow') ? 0 : 1;
                this.removeTopRows(rows, this.parent.pageSettings.pageSize - addRowCount);
            }
            if (e.args.direction === 'up') {
                if (this.parent.allowGrouping && this.parent.groupSettings.columns.length) {
                    var captionRows = [].slice.call(this.parent.getContentTable().querySelectorAll('tr'));
                    this.removeCaptionRows(captionRows, e.args);
                }
                else {
                    this.removeBottomRows(rows, rows.length - 1, e.args);
                }
            }
            this.isScroll = false;
            this.top = this.calculateScrollTop(e.args);
        }
    };
    InfiniteScroll.prototype.calculateScrollTop = function (args) {
        var top = 0;
        var scrollCnt = this.parent.getFrozenColumns() ? this.parent.getMovableVirtualContent()
            : this.parent.getContent().firstElementChild;
        if (args.direction === 'down') {
            if (this.parent.allowGrouping && this.parent.groupSettings.columns.length && !this.isInitialCollapse) {
                top = this.captionRowHeight();
            }
            var captionRows = [].slice.call(this.parent.getContent().firstElementChild.querySelectorAll('tr:not(.e-row)'));
            var captionCount = 0;
            if (this.isInitialCollapse && !isNullOrUndefined(captionRows)) {
                captionCount = Math.round((captionRows.length - 1) / this.parent.groupSettings.columns.length);
            }
            var value = captionCount ? captionCount
                : this.parent.pageSettings.pageSize * (this.parent.infiniteScrollSettings.maxBlocks - 1);
            var currentViewRowCount = 0;
            var i = 0;
            while (currentViewRowCount < scrollCnt.clientHeight) {
                i++;
                currentViewRowCount = i * this.parent.getRowHeight();
            }
            i = i - 1;
            top += (value - i) * this.parent.getRowHeight();
        }
        if (args.direction === 'up') {
            if (this.parent.allowGrouping && this.parent.groupSettings.columns.length && !this.isInitialCollapse) {
                top = this.infiniteCache[this.parent.pageSettings.currentPage].length * this.parent.getRowHeight();
            }
            else if (this.isInitialCollapse) {
                var groupedData = this.infiniteCache[this.parent.pageSettings.currentPage];
                var count = 0;
                for (var i = 0; i < groupedData.length; i++) {
                    if (groupedData[i].isCaptionRow) {
                        count++;
                    }
                }
                top += Math.round(count / this.parent.groupSettings.columns.length) * this.parent.getRowHeight();
            }
            else {
                top += (this.parent.pageSettings.pageSize * this.parent.getRowHeight() + getScrollBarWidth());
            }
        }
        return top;
    };
    InfiniteScroll.prototype.captionRowHeight = function () {
        var rows = [].slice.call(this.parent.getContent().querySelectorAll('tr:not(.e-row)'));
        return rows.length * this.parent.getRowHeight();
    };
    InfiniteScroll.prototype.removeTopRows = function (rows, maxIndx) {
        var frozeCols = this.parent.getFrozenColumns();
        var movableRows = frozeCols ?
            [].slice.call(this.parent.getMovableVirtualContent().querySelectorAll('.e-row')) : null;
        for (var i = 0; i <= maxIndx; i++) {
            if (this.parent.frozenRows && this.parent.pageSettings.currentPage === this.parent.infiniteScrollSettings.maxBlocks + 1
                && i > (maxIndx - this.parent.frozenRows)) {
                continue;
            }
            remove(rows[i]);
            if (movableRows) {
                remove(movableRows[i]);
            }
        }
    };
    InfiniteScroll.prototype.removeBottomRows = function (rows, maxIndx, args) {
        var cnt = 0;
        var frozeCols = this.parent.getFrozenColumns();
        var movableRows = frozeCols ?
            [].slice.call(this.parent.getMovableVirtualContent().querySelectorAll('.e-row')) : null;
        var pageSize = this.parent.pageSettings.pageSize;
        if (!frozeCols && this.infiniteCache[args.prevPage].length < pageSize) {
            cnt = this.parent.pageSettings.pageSize - this.infiniteCache[args.prevPage].length;
        }
        if (frozeCols && this.infiniteFrozenCache[args.prevPage][1].length < pageSize) {
            cnt = this.parent.pageSettings.pageSize - this.infiniteFrozenCache[args.prevPage][1].length;
        }
        for (var i = maxIndx; cnt < pageSize; i--) {
            cnt++;
            remove(rows[i]);
            if (movableRows) {
                remove(movableRows[i]);
            }
        }
    };
    InfiniteScroll.prototype.removeCaptionRows = function (rows, args) {
        if (args.direction === 'down') {
            var lastRow = this.parent.getRows()[this.parent.pageSettings.pageSize];
            var lastRowIndex = parseInt(lastRow.getAttribute('aria-rowindex'), 10) - 1;
            var k = 0;
            for (var i = 0; k < lastRowIndex; i++) {
                if (!rows[i].classList.contains('e-row')) {
                    remove(rows[i]);
                }
                else {
                    k = parseInt(rows[i].getAttribute('aria-rowindex'), 10);
                }
            }
        }
        if (args.direction === 'up') {
            var rowElements = [].slice.call(this.parent.getContent().querySelectorAll('.e-row'));
            var lastIndex = parseInt(rowElements[rowElements.length - 1].getAttribute('aria-rowindex'), 10);
            var page = Math.ceil(lastIndex / this.parent.pageSettings.pageSize);
            var startIndex = 0;
            for (var i = this.parent.pageSettings.currentPage + 1; i < page; i++) {
                startIndex += this.infiniteCache[i].length;
            }
            for (var i = startIndex; i < rows.length; i++) {
                remove(rows[i]);
            }
        }
    };
    InfiniteScroll.prototype.resetInfiniteBlocks = function (args, isDataModified) {
        var isInfiniteScroll = this.parent.enableInfiniteScrolling && args.requestType !== 'infiniteScroll';
        if (!this.initialRender && !isNullOrUndefined(this.parent.infiniteScrollModule) && isInfiniteScroll) {
            if (this.actions.some(function (value) { return value === args.requestType; }) || isDataModified) {
                var scrollEle = this.parent.getFrozenColumns() ? this.parent.getMovableVirtualContent()
                    : this.parent.getContent().firstElementChild;
                this.initialRender = true;
                scrollEle.scrollTop = 0;
                this.parent.pageSettings.currentPage = 1;
                this.infiniteCache = this.infiniteFrozenCache = {};
                this.resetContentModuleCache({});
                this.isRemove = false;
                this.top = 0;
                this.isInitialMovableRender = true;
                this.isInitialCollapse = false;
                this.parent.contentModule.isRemove = this.isRemove;
                this.parent.contentModule.isAddRows = this.isRemove;
                this.parent.contentModule.visibleRows = [];
                this.parent.contentModule.visibleFrozenRows = [];
            }
        }
    };
    InfiniteScroll.prototype.setCache = function (e) {
        if (this.parent.enableInfiniteScrolling && this.parent.infiniteScrollSettings.enableCache) {
            var frozeCols = this.parent.getFrozenColumns();
            var idx = e.args.isFrozen ? 1 : 0;
            var isEdit = e.args.requestType !== 'infiniteScroll'
                && (this.requestType === 'delete' || this.requestType === 'add');
            var currentPage = this.parent.pageSettings.currentPage;
            if ((frozeCols && this.isInitialMovableRender) || (!frozeCols && !Object.keys(this.infiniteCache).length) || isEdit) {
                this.isInitialMovableRender = !e.args.isFrozen;
                this.setInitialCache(e.modelData, e.args, isEdit);
            }
            if (!frozeCols && isNullOrUndefined(this.infiniteCache[this.parent.pageSettings.currentPage])) {
                this.infiniteCache[this.parent.pageSettings.currentPage] = e.modelData;
                this.resetContentModuleCache(this.infiniteCache);
            }
            if (frozeCols) {
                if ((idx === 0 && isNullOrUndefined(this.infiniteFrozenCache[currentPage]))
                    || !this.infiniteFrozenCache[currentPage][idx].length) {
                    this.createFrozenCache(currentPage);
                    this.infiniteFrozenCache[currentPage][idx] = e.modelData;
                    if (idx === 1) {
                        this.resetContentModuleCache(this.infiniteFrozenCache);
                    }
                }
            }
            if (e.isInfiniteScroll && !this.isRemove) {
                this.isRemove = (currentPage - 1) % this.parent.infiniteScrollSettings.maxBlocks === 0;
                this.parent.contentModule.isRemove = this.isRemove;
            }
        }
    };
    InfiniteScroll.prototype.setInitialCache = function (data, args, isEdit) {
        var frozenCols = this.parent.getFrozenColumns();
        var idx = args.isFrozen ? 1 : 0;
        var k = !isEdit ? 1 : this.firstBlock;
        for (var i = 1; i <= this.parent.infiniteScrollSettings.initialBlocks; i++) {
            var startIndex = (i - 1) * this.parent.pageSettings.pageSize;
            var endIndex = i * this.parent.pageSettings.pageSize;
            if (this.parent.allowGrouping && this.parent.groupSettings.columns.length) {
                this.setInitialGroupCache(data, k, startIndex, endIndex);
            }
            else {
                if (frozenCols) {
                    this.createFrozenCache(k);
                    this.infiniteFrozenCache[k][idx] = data.slice(startIndex, endIndex);
                    this.resetContentModuleCache(this.infiniteFrozenCache);
                }
                else {
                    this.infiniteCache[k] = data.slice(startIndex, endIndex);
                    this.resetContentModuleCache(this.infiniteCache);
                }
            }
            k++;
        }
    };
    InfiniteScroll.prototype.createFrozenCache = function (index) {
        if (!this.infiniteFrozenCache[index]) {
            this.infiniteFrozenCache[index] = [[], []];
        }
    };
    InfiniteScroll.prototype.setInitialGroupCache = function (data, index, sIndex, eIndex) {
        var pageData = [];
        var startIndex = 0;
        for (var i = 1; i <= Object.keys(this.infiniteCache).length; i++) {
            startIndex += this.infiniteCache[i].length;
        }
        var k = sIndex;
        for (var i = startIndex; i < data.length && k < eIndex; i++) {
            if (data[i].index < eIndex || data[i].isCaptionRow) {
                k = data[i].isCaptionRow ? k : data[i].index;
                pageData.push(data[i]);
            }
            if (data[i].index >= eIndex || data[i].index === eIndex - 1) {
                break;
            }
        }
        this.infiniteCache[index] = pageData;
        this.resetContentModuleCache(this.infiniteCache);
    };
    InfiniteScroll.prototype.resetContentModuleCache = function (data) {
        this.parent.contentModule
            .infiniteCache = data;
    };
    /**
     * @hidden
     */
    InfiniteScroll.prototype.destroy = function () {
        this.removeEventListener();
    };
    return InfiniteScroll;
}());
export { InfiniteScroll };
