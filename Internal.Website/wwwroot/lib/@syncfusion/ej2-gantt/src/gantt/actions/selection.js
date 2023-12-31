import { parentsUntil, getActualProperties } from '@syncfusion/ej2-grids';
import { setCssInGridPopUp } from '@syncfusion/ej2-grids';
import { isNullOrUndefined, removeClass, getValue, addClass, closest, setValue, extend, isBlazor } from '@syncfusion/ej2-base';
import { Deferred } from '@syncfusion/ej2-data';
/**
 * The Selection module is used to handle cell and row selection.
 */
var Selection = /** @class */ (function () {
    function Selection(gantt) {
        this.isSelectionFromChart = false;
        this.multipleIndexes = [];
        this.selectedRowIndexes = [];
        this.enableSelectMultiTouch = false;
        this.openPopup = false;
        this.parent = gantt;
        this.bindEvents();
        this.parent.treeGrid.selectedRowIndex = this.parent.selectedRowIndex;
        this.parent.treeGrid.allowSelection = this.parent.allowSelection;
        this.parent.treeGrid.grid.selectionSettings.enableToggle = this.parent.selectionSettings.enableToggle;
        this.parent.treeGrid.selectionSettings = getActualProperties(this.parent.selectionSettings);
        this.wireEvents();
    }
    /**
     * Get module name
     */
    Selection.prototype.getModuleName = function () {
        return 'selection';
    };
    Selection.prototype.wireEvents = function () {
        this.parent.on('selectRowByIndex', this.selectRowByIndex, this);
        if (this.parent.isAdaptive) {
            this.parent.on('chartMouseClick', this.mouseUpHandler, this);
            this.parent.on('treeGridClick', this.popUpClickHandler, this);
        }
        else {
            this.parent.on('chartMouseUp', this.mouseUpHandler, this);
        }
    };
    /**
     * To update selected index.
     * @return {void}
     * @private
     */
    Selection.prototype.selectRowByIndex = function () {
        if (this.parent.selectedRowIndex !== -1 || this.parent.staticSelectedRowIndex !== -1) {
            this.selectRow(this.parent.staticSelectedRowIndex !== -1 ? this.parent.staticSelectedRowIndex : this.parent.selectedRowIndex);
            this.parent.staticSelectedRowIndex = -1;
        }
    };
    /**
     * To bind selection events.
     * @return {void}
     * @private
     */
    Selection.prototype.bindEvents = function () {
        this.parent.treeGrid.rowSelecting = this.rowSelecting.bind(this);
        this.parent.treeGrid.rowSelected = this.rowSelected.bind(this);
        this.parent.treeGrid.rowDeselecting = this.rowDeselecting.bind(this);
        this.parent.treeGrid.rowDeselected = this.rowDeselected.bind(this);
        this.parent.treeGrid.cellSelecting = this.cellSelecting.bind(this);
        this.parent.treeGrid.cellSelected = this.cellSelected.bind(this);
        this.parent.treeGrid.cellDeselecting = this.cellDeselecting.bind(this);
        this.parent.treeGrid.cellDeselected = this.cellDeselected.bind(this);
    };
    Selection.prototype.rowSelecting = function (args) {
        if (!this.parent.isGanttChartRendered) {
            args.cancel = true;
            return;
        }
        args.isCtrlPressed = this.isMultiCtrlRequest;
        args.isShiftPressed = this.isMultiShiftRequest;
        args.target = this.actualTarget;
        if (!isNullOrUndefined(args.foreignKeyData) && Object.keys(args.foreignKeyData).length === 0) {
            delete args.foreignKeyData;
        }
        this.parent.trigger('rowSelecting', args);
    };
    Selection.prototype.rowSelected = function (args) {
        var rowIndexes = 'rowIndexes';
        var index = (this.parent.selectionSettings.type === 'Multiple' && !isNullOrUndefined(args[rowIndexes])) ?
            args[rowIndexes] : [args.rowIndex];
        this.addClass(index);
        this.selectedRowIndexes = extend([], this.getSelectedRowIndexes(), [], true);
        this.parent.setProperties({ selectedRowIndex: this.parent.treeGrid.grid.selectedRowIndex }, true);
        if (this.isMultiShiftRequest) {
            this.selectedRowIndexes = index;
        }
        if (this.parent.autoFocusTasks) {
            this.parent.ganttChartModule.updateScrollLeft(getValue('data.ganttProperties.left', args));
        }
        args.target = this.actualTarget;
        if (!isNullOrUndefined(args.foreignKeyData) && Object.keys(args.foreignKeyData).length === 0) {
            delete args.foreignKeyData;
        }
        this.prevRowIndex = args.rowIndex;
        if (!isNullOrUndefined(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems(args);
        }
        this.parent.trigger('rowSelected', args);
    };
    Selection.prototype.rowDeselecting = function (args) {
        args.target = this.actualTarget;
        args.isInteracted = this.isInteracted;
        if (isBlazor() && this.parent.selectionSettings.type === 'Multiple') {
            this.multipleIndexes = extend([], args.rowIndex, [], true);
        }
        this.parent.trigger('rowDeselecting', args);
    };
    Selection.prototype.rowDeselected = function (args) {
        var rowIndexes = 'rowIndexes';
        var index;
        var isContains;
        if (this.multipleIndexes.length !== 0) {
            index = this.multipleIndexes;
        }
        else {
            if (this.isMultiCtrlRequest) {
                index = args.rowIndex;
            }
            else {
                if (!isNullOrUndefined(args.rowIndexes)) {
                    for (var i = 0; i < args.rowIndexes.length; i++) {
                        if (args.rowIndexes[i] === args.rowIndex) {
                            isContains = true;
                        }
                    }
                    if (isContains) {
                        index = args.rowIndexes;
                    }
                }
                else {
                    index = args.rowIndex;
                }
            }
        }
        this.removeClass(index);
        this.selectedRowIndexes = extend([], this.getSelectedRowIndexes(), [], true);
        this.parent.setProperties({ selectedRowIndex: -1 }, true);
        if (!isNullOrUndefined(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems();
        }
        if (this.parent.selectionSettings.type === 'Multiple' && this.parent.isAdaptive
            && this.selectedRowIndexes.length === 0) {
            this.hidePopUp();
        }
        args.target = this.actualTarget;
        args.isInteracted = this.isInteracted;
        this.parent.trigger('rowDeselected', args);
        this.isInteracted = false;
        this.multipleIndexes = [];
    };
    Selection.prototype.cellSelecting = function (args) {
        var callBackPromise = new Deferred();
        this.parent.trigger('cellSelecting', args, function (cellselectingArgs) {
            callBackPromise.resolve(cellselectingArgs);
        });
        return callBackPromise;
    };
    Selection.prototype.cellSelected = function (args) {
        this.parent.trigger('cellSelected', args);
        if (!isNullOrUndefined(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems();
        }
    };
    Selection.prototype.cellDeselecting = function (args) {
        this.parent.trigger('cellDeselecting', args);
    };
    Selection.prototype.cellDeselected = function (args) {
        this.parent.trigger('cellDeselected', args);
        if (!isNullOrUndefined(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems();
        }
    };
    /**
     * Selects a cell by given index.
     * @param  {IIndex} cellIndex - Defines the row and column indexes.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    Selection.prototype.selectCell = function (cellIndex, isToggle) {
        this.parent.treeGrid.selectCell(cellIndex, isToggle);
    };
    /**
     * Selects a collection of cells by row and column indexes.
     * @param  {ISelectedCell[]} rowCellIndexes - Specifies the row and column indexes.
     * @return {void}
     */
    Selection.prototype.selectCells = function (rowCellIndexes) {
        this.parent.treeGrid.grid.selectCells(rowCellIndexes);
    };
    /**
     * Selects a row by given index.
     * @param  {number} index - Defines the row index.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    Selection.prototype.selectRow = function (index, isToggle, isPreventFocus) {
        var selectedRow = this.parent.getRowByIndex(index);
        if (index === -1 || isNullOrUndefined(selectedRow) || this.parent.selectionSettings.mode === 'Cell') {
            return;
        }
        if (this.parent.showActiveElement && !isPreventFocus) {
            this.parent.treeGrid.grid.selectionModule.preventFocus = true;
        }
        else {
            this.parent.treeGrid.grid.selectionModule.preventFocus = false;
        }
        this.parent.treeGrid.selectRow(index, isToggle);
        this.parent.treeGrid.grid.selectionModule.preventFocus = this.parent.treeGrid.grid.selectionModule.preventFocus === true ?
            false : this.parent.treeGrid.grid.selectionModule.preventFocus;
        this.prevRowIndex = index;
    };
    /**
     * Selects a collection of rows by indexes.
     * @param  {number[]} records - Defines the collection of row indexes.
     * @return {void}
     */
    Selection.prototype.selectRows = function (records) {
        if (!isNullOrUndefined(records) && records.length > 0) {
            this.parent.treeGrid.selectRows(records);
        }
    };
    /**
     * Gets the collection of selected row indexes.
     * @return {number[]}
     */
    Selection.prototype.getSelectedRowIndexes = function () {
        return this.parent.treeGrid.getSelectedRowIndexes();
    };
    /**
     * Gets the collection of selected row and cell indexes.
     * @return {number[]}
     */
    Selection.prototype.getSelectedRowCellIndexes = function () {
        return this.parent.treeGrid.getSelectedRowCellIndexes();
    };
    /**
     * Gets the collection of selected records.
     * @return {Object[]}
     */
    Selection.prototype.getSelectedRecords = function () {
        if (isBlazor()) {
            return this.parent.getRecordFromFlatdata(this.parent.treeGrid.getSelectedRecords());
        }
        else {
            return this.parent.treeGrid.getSelectedRecords();
        }
    };
    /**
     * Get the selected records for cell selection.
     * @return {IGanttData[]}
     */
    Selection.prototype.getCellSelectedRecords = function () {
        var cellDetails = this.parent.selectionModule.getSelectedRowCellIndexes();
        var cellSelectedRecords = [];
        for (var i = 0; i < cellDetails.length; i++) {
            cellSelectedRecords.push(this.parent.currentViewData[cellDetails[i].rowIndex]);
        }
        if (isBlazor()) {
            return this.parent.getRecordFromFlatdata(cellSelectedRecords);
        }
        else {
            return cellSelectedRecords;
        }
    };
    /**
     * Gets the collection of selected rows.
     * @return {Element[]}
     */
    Selection.prototype.getSelectedRows = function () {
        return this.parent.treeGrid.getSelectedRows();
    };
    /**
     * Deselects the current selected rows and cells.
     * @return {void}
     */
    Selection.prototype.clearSelection = function () {
        this.removeClass(this.selectedRowIndexes);
        this.parent.treeGrid.clearSelection();
        this.parent.selectedRowIndex = -1;
        this.selectedRowIndexes = [];
        if (!isNullOrUndefined(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems();
        }
        this.isInteracted = false;
    };
    Selection.prototype.highlightSelectedRows = function (e, fromChart) {
        var rows = closest(e.target, 'tbody').children;
        var selectedRow = closest(e.target, 'tr.e-chart-row');
        var rIndex = [].slice.call(rows).indexOf(selectedRow);
        this.isMultiCtrlRequest = e.ctrlKey || this.enableSelectMultiTouch;
        this.isMultiShiftRequest = e.shiftKey;
        this.actualTarget = e.target;
        this.isInteracted = true;
        this.isSelectionFromChart = fromChart;
        var isToggle = this.parent.selectionSettings.enableToggle;
        if (fromChart) {
            if (this.parent.selectionSettings.type === 'Single' || (!this.isMultiCtrlRequest && !this.isMultiShiftRequest)) {
                this.selectRow(rIndex, isToggle);
            }
            else {
                if (this.isMultiShiftRequest) {
                    this.selectRowsByRange(isNullOrUndefined(this.prevRowIndex) ? rIndex : this.prevRowIndex, rIndex);
                }
                else {
                    setValue('isMultiCtrlRequest', true, this.parent.treeGrid.grid.selectionModule);
                    this.parent.treeGrid.grid.selectionModule.addRowsToSelection([rIndex]);
                }
            }
        }
    };
    Selection.prototype.getselectedrowsIndex = function (startIndex, endIndex) {
        var indexes = [];
        var _a = (startIndex < endIndex) ?
            { i: startIndex, max: endIndex } : { i: endIndex, max: startIndex }, i = _a.i, max = _a.max;
        for (; i <= max; i++) {
            indexes.push(i);
        }
        if (startIndex > endIndex) {
            indexes.reverse();
        }
        this.selectedRowIndexes = indexes;
    };
    /**
     * Selects a range of rows from start and end row indexes.
     * @param  {number} startIndex - Defines the start row index.
     * @param  {number} endIndex - Defines the end row index.
     * @return {void}
     */
    Selection.prototype.selectRowsByRange = function (startIndex, endIndex) {
        this.isSelectionFromChart = true;
        this.getselectedrowsIndex(startIndex, endIndex);
        this.selectRows(this.selectedRowIndexes);
    };
    Selection.prototype.addClass = function (records) {
        var ganttRow = document.getElementById(this.parent.element.id + 'GanttTaskTableBody').children;
        for (var i = 0; i < records.length; i++) {
            if (!isNullOrUndefined(ganttRow[records[i]])) {
                addClass([ganttRow[records[i]]], 'e-active');
                ganttRow[records[i]].setAttribute('aria-selected', 'true');
            }
        }
    };
    Selection.prototype.removeClass = function (records) {
        if (!this.parent.selectionSettings.persistSelection) {
            var ganttRow = document.getElementById(this.parent.element.id + 'GanttTaskTableBody').children;
            /* tslint:disable-next-line:no-any */
            var rowIndex = isNullOrUndefined(records.length) ? [records] : records;
            for (var i = 0; i < rowIndex.length; i++) {
                removeClass([ganttRow[rowIndex[i]]], 'e-active');
                ganttRow[rowIndex[i]].removeAttribute('aria-selected');
            }
        }
    };
    Selection.prototype.showPopup = function (e) {
        if (this.isSelectionFromChart) {
            setCssInGridPopUp(this.parent.element.querySelector('.e-ganttpopup'), e, 'e-rowselect e-icons e-icon-rowselect' +
                ((this.enableSelectMultiTouch &&
                    (this.getSelectedRecords().length > 1 || this.getSelectedRowCellIndexes().length > 1)) ? ' e-spanclicked' : ''));
            document.getElementsByClassName('e-gridpopup')[0].style.display = 'none';
            this.openPopup = true;
        }
        else if (this.selectedRowIndexes.length === 0) {
            this.hidePopUp();
        }
    };
    /** @private */
    Selection.prototype.hidePopUp = function () {
        if (this.openPopup) {
            document.getElementsByClassName('e-ganttpopup')[0].style.display = 'none';
            this.openPopup = false;
        }
        else {
            document.getElementsByClassName('e-gridpopup')[0].style.display = 'none';
        }
    };
    Selection.prototype.popUpClickHandler = function (e) {
        var target = e.target;
        var grid = this.parent.treeGrid.grid;
        var $popUpElemet = closest(target, '.e-ganttpopup') ?
            closest(target, '.e-ganttpopup') : closest(target, '.e-gridpopup');
        if ($popUpElemet) {
            var spanElement = $popUpElemet.querySelector('.' + 'e-rowselect');
            if (closest(target, '.e-ganttpopup') &&
                !spanElement.classList.contains('e-spanclicked')) {
                this.enableSelectMultiTouch = true;
                spanElement.classList.add('e-spanclicked');
            }
            else if (closest(target, '.e-gridpopup') &&
                spanElement.classList.contains('e-spanclicked')) {
                this.openPopup = true;
                this.enableSelectMultiTouch = true;
            }
            else {
                this.hidePopUp();
                this.enableSelectMultiTouch = false;
                if (closest(target, '.e-ganttpopup')) {
                    spanElement.classList.remove('e-spanclicked');
                }
            }
        }
        else if (this.parent.selectionSettings.type === 'Multiple' && this.parent.isAdaptive) {
            var $tr = closest(target, '.e-rowcell');
            if ($tr && this.selectedRowIndexes.length === 0) {
                this.hidePopUp();
            }
        }
        if (grid) {
            setValue('enableSelectMultiTouch', this.enableSelectMultiTouch, grid.selectionModule);
        }
    };
    /**
     * @return {void}
     * @private
     */
    Selection.prototype.mouseUpHandler = function (e) {
        var isTaskbarEdited = false;
        if (this.parent.editModule && this.parent.editSettings.allowTaskbarEditing && this.parent.editModule.taskbarEditModule) {
            var taskbarEdit = this.parent.editModule.taskbarEditModule;
            if (taskbarEdit.isMouseDragged || taskbarEdit.tapPointOnFocus) {
                isTaskbarEdited = true;
            }
        }
        if (!isTaskbarEdited && this.parent.element.contains(e.target)) {
            var parent_1 = parentsUntil(e.target, 'e-chart-row');
            var isSelected = e.target.classList.contains('e-rowcell') ||
                e.target.classList.contains('e-row') ||
                e.target.classList.contains('e-treegridexpand') ||
                e.target.classList.contains('e-treegridcollapse') || !isNullOrUndefined(parent_1);
            this.popUpClickHandler(e);
            if (this.parent.selectionSettings.mode !== 'Cell' && isSelected) {
                if (closest(e.target, 'tr.e-chart-row')) {
                    this.highlightSelectedRows(e, true);
                }
                else {
                    this.highlightSelectedRows(e, false);
                }
                if (this.parent.selectionSettings.type === 'Multiple' && this.parent.isAdaptive) {
                    if (this.selectedRowIndexes.length > 0) {
                        this.showPopup(e);
                    }
                    else {
                        this.hidePopUp();
                    }
                }
            }
            else {
                this.isSelectionFromChart = false;
            }
        }
    };
    /**
     * To destroy the selection module.
     * @return {void}
     * @private
     */
    Selection.prototype.destroy = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('selectRowByIndex', this.selectRowByIndex);
        if (this.parent.isAdaptive) {
            this.parent.off('chartMouseClick', this.mouseUpHandler);
            this.parent.off('treeGridClick', this.popUpClickHandler);
        }
        else {
            this.parent.off('chartMouseUp', this.mouseUpHandler);
        }
    };
    return Selection;
}());
export { Selection };
