var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, addClass, createElement, EventHandler, isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { removeClass, Complex, Collection, isBlazor, getElement, getValue } from '@syncfusion/ej2-base';
import { Event, Property, NotifyPropertyChanges, setValue, KeyboardEvents, L10n } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { RowDropSettings, getUid } from '@syncfusion/ej2-grids';
import { FilterSettings } from '../models/filter-settings';
import { TextWrapSettings } from '../models/textwrap-settings';
import { gridObserver } from '@syncfusion/ej2-grids';
import { TreeClipboard } from '../actions/clipboard';
import { Selection as TreeGridSelection } from '../actions/selection';
import { Print } from '../actions/print';
import * as events from '../base/constant';
import { SearchSettings } from '../models/search-settings';
import { SelectionSettings } from '../models/selection-settings';
import { getActualProperties, getObject } from '@syncfusion/ej2-grids';
import { DataManager, RemoteSaveAdaptor, JsonAdaptor, Deferred } from '@syncfusion/ej2-data';
import { createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { isRemoteData, isOffline, extendArray, isCountRequired } from '../utils';
import { Grid } from '@syncfusion/ej2-grids';
import { Render } from '../renderer/render';
import { DataManipulation } from './data';
import { iterateArrayOrObject } from '@syncfusion/ej2-grids';
import { ToolbarItem, ContextMenuItems } from '../enum';
import { PageSettings } from '../models/page-settings';
import { AggregateRow } from '../models/summary';
import { EditSettings } from '../models/edit-settings';
import { SortSettings } from '../models/sort-settings';
import { isHidden } from '../utils';
/**
 * Represents the TreeGrid component.
 * ```html
 * <div id='treegrid'></div>
 * <script>
 *  var treegridObj = new TreeGrid({ allowPaging: true });
 *  treegridObj.appendTo('#treegrid');
 * </script>
 * ```
 */
var TreeGrid = /** @class */ (function (_super) {
    __extends(TreeGrid, _super);
    function TreeGrid(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.dataResults = {};
        _this.uniqueIDCollection = {};
        _this.uniqueIDFilterCollection = {};
        _this.changedRecords = 'changedRecords';
        _this.deletedRecords = 'deletedRecords';
        _this.addedRecords = 'addedRecords';
        TreeGrid_1.Inject(TreeGridSelection);
        setValue('mergePersistData', _this.mergePersistTreeGridData, _this);
        _this.grid = new Grid();
        return _this;
    }
    TreeGrid_1 = TreeGrid;
    /**
     * Export TreeGrid data to Excel file(.xlsx).
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the TreeGrid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @return {Promise<any>}
     * @blazorType void
     */
    TreeGrid.prototype.excelExport = function (excelExportProperties, isMultipleExport, 
    /* tslint:disable-next-line:no-any */
    workbook, isBlob) {
        if (isBlazor()) {
            this.excelExportModule.Map(excelExportProperties, isMultipleExport, workbook, isBlob, false);
            return null;
        }
        return this.excelExportModule.Map(excelExportProperties, isMultipleExport, workbook, isBlob, false);
    };
    /**
     * Export TreeGrid data to CSV file.
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the TreeGrid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @return {Promise<any>}
     * @blazorType void
     */
    TreeGrid.prototype.csvExport = function (excelExportProperties, 
    /* tslint:disable-next-line:no-any */
    isMultipleExport, workbook, isBlob) {
        if (isBlazor()) {
            this.excelExportModule.Map(excelExportProperties, isMultipleExport, workbook, isBlob, true);
            return null;
        }
        return this.excelExportModule.Map(excelExportProperties, isMultipleExport, workbook, isBlob, true);
    };
    /**
     * Export TreeGrid data to PDF document.
     * @param  {pdfExportProperties} PdfExportProperties - Defines the export properties of the Grid.
     * @param  {isMultipleExport} isMultipleExport - Define to enable multiple export.
     * @param  {pdfDoc} pdfDoc - Defined the Pdf Document if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @return {Promise<any>}
     * @blazorType void
     */
    TreeGrid.prototype.pdfExport = function (pdfExportProperties, 
    /* tslint:disable-next-line:no-any */
    isMultipleExport, pdfDoc, isBlob) {
        if (isBlazor()) {
            this.pdfExportModule.Map(pdfExportProperties, isMultipleExport, pdfDoc, isBlob);
            return null;
        }
        return this.pdfExportModule.Map(pdfExportProperties, isMultipleExport, pdfDoc, isBlob);
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    TreeGrid.prototype.getModuleName = function () {
        return 'treegrid';
    };
    /**
     * For internal use only - Initialize the event handler;
     * @private
     */
    TreeGrid.prototype.preRender = function () {
        this.TreeGridLocale();
        this.initProperties();
        this.defaultLocale = {
            Above: 'Above',
            Below: 'Below',
            AddRow: 'Add Row',
            ExpandAll: 'Expand All',
            CollapseAll: 'Collapse All',
            RowIndent: 'Indent',
            RowOutdent: 'Outdent'
        };
        this.l10n = new L10n('treegrid', this.defaultLocale, this.locale);
        if (this.isSelfReference && isNullOrUndefined(this.childMapping)) {
            this.childMapping = 'Children';
        }
    };
    /**
     * Sorts a column with the given options.
     * @param {string} columnName - Defines the column name to be sorted.
     * @param {SortDirection} direction - Defines the direction of sorting field.
     * @param {boolean} isMultiSort - Specifies whether the previous sorted columns are to be maintained.
     * @return {void}
     */
    TreeGrid.prototype.sortByColumn = function (columnName, direction, isMultiSort) {
        this.sortModule.sortColumn(columnName, direction, isMultiSort);
    };
    /**
     * Clears all the sorted columns of the TreeGrid.
     * @return {void}
     */
    TreeGrid.prototype.clearSorting = function () {
        if (this.sortModule) {
            this.sortModule.clearSorting();
        }
    };
    /**
     * Remove sorted column by field name.
     * @param {string} field - Defines the column field name to remove sort.
     * @return {void}
     * @hidden
     */
    TreeGrid.prototype.removeSortColumn = function (field) {
        this.sortModule.removeSortColumn(field);
    };
    /**
     * Searches TreeGrid records using the given key.
     * You can customize the default search option by using the
     * [`searchSettings`](./#searchsettings/).
     * @param  {string} searchString - Defines the key.
     * @return {void}
     */
    TreeGrid.prototype.search = function (searchString) {
        this.grid.search(searchString);
    };
    /**
     * Changes the column width to automatically fit its content to ensure that the width shows the content without wrapping/hiding.
     * > * This method ignores the hidden columns.
     * > * Uses the `autoFitColumns` method in the `dataBound` event to resize at initial rendering.
     * @param  {string |string[]} fieldNames - Defines the column names.
     * @return {void}
     *
     *
     *
     */
    TreeGrid.prototype.autoFitColumns = function (fieldNames) {
        this.resizeModule.autoFitColumns(fieldNames);
        this.updateColumnModel();
    };
    /**
     * Changes the TreeGrid column positions by field names.
     * @param  {string} fromFName - Defines the origin field name.
     * @param  {string} toFName - Defines the destination field name.
     * @return {void}
     */
    TreeGrid.prototype.reorderColumns = function (fromFName, toFName) {
        this.grid.reorderColumns(fromFName, toFName);
    };
    TreeGrid.prototype.TreeGridLocale = function () {
        /* tslint:disable-next-line:no-any */
        var locale = L10n.locale;
        var localeObject;
        localeObject = {};
        setValue(this.locale, {}, localeObject);
        var gridLocale;
        gridLocale = {};
        gridLocale = getObject(this.locale, locale);
        var treeGridLocale;
        treeGridLocale = {};
        treeGridLocale = getObject(this.getModuleName(), gridLocale);
        setValue('grid', treeGridLocale, getObject(this.locale, localeObject));
        L10n.load(localeObject);
    };
    /**
     * By default, prints all the pages of the TreeGrid and hides the pager.
     * > You can customize print options using the
     * [`printMode`](./#printmode).
     * @return {void}
     */
    TreeGrid.prototype.print = function () {
        this.printModule.print();
    };
    TreeGrid.prototype.treeGridkeyActionHandler = function (e) {
        if (this.allowKeyboard) {
            switch (e.action) {
                case 'ctrlDownArrow':
                    this.expandAll();
                    break;
                case 'ctrlUpArrow':
                    this.collapseAll();
                    break;
                case 'ctrlShiftUpArrow':
                    var collapsetarget = e.target;
                    var collapsecolumn = collapsetarget.closest('.e-rowcell');
                    var collapserow = collapsecolumn.closest('tr');
                    var collapseRow = collapserow.querySelector('.e-treegridexpand');
                    if (collapseRow !== null && collapseRow !== undefined) {
                        this.expandCollapseRequest(collapserow.querySelector('.e-treegridexpand'));
                    }
                    break;
                case 'ctrlShiftDownArrow':
                    var expandtarget = e.target;
                    var expandcolumn = expandtarget.closest('.e-rowcell');
                    var expandrow = expandcolumn.closest('tr');
                    var expandRow = expandrow.querySelector('.e-treegridcollapse');
                    if (expandRow !== null && expandRow !== undefined) {
                        this.expandCollapseRequest(expandrow.querySelector('.e-treegridcollapse'));
                    }
                    break;
                case 'downArrow':
                    var target = e.target.parentElement;
                    var summaryElement = this.findnextRowElement(target);
                    if (summaryElement !== null) {
                        var rowIndex = summaryElement.rowIndex;
                        this.selectRow(rowIndex);
                        var cellIndex = e.target.cellIndex;
                        var row = summaryElement.children[cellIndex];
                        addClass([row], 'e-focused');
                        addClass([row], 'e-focus');
                    }
                    else {
                        this.clearSelection();
                    }
                    break;
                case 'upArrow':
                    var targetRow = e.target.parentElement;
                    var summaryRowElement = this.findPreviousRowElement(targetRow);
                    if (summaryRowElement !== null) {
                        var rIndex = summaryRowElement.rowIndex;
                        this.selectRow(rIndex);
                        var cIndex = e.target.cellIndex;
                        var rows = summaryRowElement.children[cIndex];
                        addClass([rows], 'e-focused');
                        addClass([rows], 'e-focus');
                    }
                    else {
                        this.clearSelection();
                    }
            }
        }
    };
    // Get Proper Row Element from the summary 
    TreeGrid.prototype.findnextRowElement = function (summaryRowElement) {
        var rowElement = summaryRowElement.nextElementSibling;
        if (rowElement !== null && (rowElement.className.indexOf('e-summaryrow') !== -1 ||
            rowElement.style.display === 'none')) {
            rowElement = this.findnextRowElement(rowElement);
        }
        return rowElement;
    };
    // Get Proper Row Element from the summary 
    TreeGrid.prototype.findPreviousRowElement = function (summaryRowElement) {
        var rowElement = summaryRowElement.previousElementSibling;
        if (rowElement !== null && (rowElement.className.indexOf('e-summaryrow') !== -1 ||
            rowElement.style.display === 'none')) {
            rowElement = this.findPreviousRowElement(rowElement);
        }
        return rowElement;
    };
    TreeGrid.prototype.initProperties = function () {
        this.defaultLocale = {};
        this.flatData = [];
        this.parentData = [];
        this.columnModel = [];
        this.isExpandAll = false;
        this.isCollapseAll = false;
        this.keyConfigs = {
            ctrlDownArrow: 'ctrl+downarrow',
            ctrlUpArrow: 'ctrl+uparrow',
            ctrlShiftUpArrow: 'ctrl+shift+uparrow',
            ctrlShiftDownArrow: 'ctrl+shift+downarrow',
            downArrow: 'downArrow',
            upArrow: 'upArrow'
        };
        this.isLocalData = (!(this.dataSource instanceof DataManager) || this.dataSource.dataSource.offline
            || (!isNullOrUndefined(this.dataSource.ready)) || this.dataSource.adaptor instanceof RemoteSaveAdaptor);
        this.isSelfReference = !isNullOrUndefined(this.parentIdMapping);
    };
    /**
     * Binding events to the element while component creation.
     * @hidden
     */
    TreeGrid.prototype.wireEvents = function () {
        EventHandler.add(this.grid.element, 'click', this.mouseClickHandler, this);
        EventHandler.add(this.element, 'touchend', this.mouseClickHandler, this);
        this.keyboardModule = new KeyboardEvents(this.element, {
            keyAction: this.treeGridkeyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown'
        });
        if (this.allowKeyboard) {
            this.element.tabIndex = this.element.tabIndex === -1 ? 0 : this.element.tabIndex;
        }
    };
    /**
     * To provide the array of modules needed for component rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    TreeGrid.prototype.requiredModules = function () {
        var modules = [];
        if (this.isDestroyed) {
            return modules;
        }
        modules.push({
            member: 'filter', args: [this, this.filterSettings]
        });
        if (!isNullOrUndefined(this.toolbar)) {
            modules.push({
                member: 'toolbar',
                args: [this]
            });
        }
        if (this.contextMenuItems) {
            modules.push({
                member: 'contextMenu',
                args: [this]
            });
        }
        if (this.allowPaging) {
            modules.push({
                member: 'pager',
                args: [this, this.pageSettings]
            });
        }
        if (this.allowReordering) {
            modules.push({
                member: 'reorder',
                args: [this]
            });
        }
        if (this.allowSorting) {
            modules.push({
                member: 'sort',
                args: [this]
            });
        }
        if (this.aggregates.length > 0) {
            modules.push({
                member: 'summary', args: [this]
            });
        }
        modules.push({
            member: 'resize', args: [this]
        });
        if (this.allowExcelExport) {
            modules.push({
                member: 'ExcelExport', args: [this]
            });
        }
        if (this.frozenColumns || this.frozenRows || this.getFrozenColumns()) {
            modules.push({
                member: 'freeze', args: [this]
            });
        }
        if (this.detailTemplate) {
            modules.push({
                member: 'detailRow', args: [this]
            });
        }
        if (this.allowPdfExport) {
            modules.push({
                member: 'PdfExport', args: [this]
            });
        }
        if (this.showColumnMenu) {
            modules.push({
                member: 'columnMenu', args: [this]
            });
        }
        if (this.showColumnChooser) {
            modules.push({
                member: 'ColumnChooser', args: [this]
            });
        }
        this.extendRequiredModules(modules);
        return modules;
    };
    TreeGrid.prototype.extendRequiredModules = function (modules) {
        if (this.allowRowDragAndDrop) {
            modules.push({
                member: 'rowDragAndDrop',
                args: [this]
            });
        }
        if (this.editSettings.allowAdding || this.editSettings.allowDeleting || this.editSettings.allowEditing) {
            modules.push({
                member: 'edit',
                args: [this]
            });
        }
        if (this.isCommandColumn(this.columns)) {
            modules.push({
                member: 'commandColumn',
                args: [this]
            });
        }
        if (this.allowSelection) {
            modules.push({
                member: 'selection',
                args: [this]
            });
        }
        if (this.enableVirtualization) {
            modules.push({
                member: 'virtualScroll',
                args: [this]
            });
        }
    };
    TreeGrid.prototype.isCommandColumn = function (columns) {
        var _this = this;
        return columns.some(function (col) {
            if (col.columns) {
                return _this.isCommandColumn(col.columns);
            }
            return !!(col.commands || col.commandsTemplate);
        });
    };
    /**
     * Unbinding events from the element while component destroy.
     * @hidden
     */
    TreeGrid.prototype.unwireEvents = function () {
        if (this.grid && this.grid.element) {
            EventHandler.remove(this.grid.element, 'click', this.mouseClickHandler);
        }
    };
    /**
     * For internal use only - To Initialize the component rendering.
     * @private
     */
    TreeGrid.prototype.render = function () {
        var _this = this;
        createSpinner({ target: this.element }, this.createElement);
        this.renderModule = new Render(this);
        this.dataModule = new DataManipulation(this);
        this.printModule = new Print(this);
        var clientRender = 'isClientRender';
        if (this[clientRender]) {
            this.isServerRendered = false;
        }
        this.trigger(events.load);
        this.autoGenerateColumns();
        this.initialRender = true;
        if (!isNullOrUndefined(this.dataSource)) {
            this.convertTreeData(this.dataSource);
        }
        if (!isBlazor() || !this.isServerRendered) {
            this.loadGrid();
            if (this.element.classList.contains('e-treegrid') && this.rowDropSettings.targetID) {
                this.grid.rowDropSettings.targetID += '_gridcontrol';
            }
            this.addListener();
            var gridContainer = createElement('div', { id: this.element.id + '_gridcontrol' });
            addClass([this.element], 'e-treegrid');
            if (!isNullOrUndefined(this.height) && typeof (this.height) === 'string' && this.height.indexOf('%') !== -1) {
                this.element.style.height = this.height;
            }
            if (!isNullOrUndefined(this.width) && typeof (this.width) === 'string' && this.width.indexOf('%') !== -1) {
                this.element.style.width = this.width;
            }
            this.element.appendChild(gridContainer);
            this.grid.appendTo(gridContainer);
            this.wireEvents();
        }
        this.renderComplete();
        var destroyTemplate = 'destroyTemplate';
        var destroyTemplateFn = this.grid[destroyTemplate];
        //tslint:disable-next-line:no-any
        this.grid[destroyTemplate] = function (args, index) {
            destroyTemplateFn.apply(_this.grid);
            _this.clearTemplate(args, index);
        };
        if (isBlazor() && this.isServerRendered) {
            var fn_1 = function (args) { return _this.gridRendered(args, fn_1); };
            gridObserver.on('component-rendered', fn_1, this);
        }
    };
    TreeGrid.prototype.afterGridRender = function () {
        if (!isNullOrUndefined(this.grid.clipboardModule)) {
            this.grid.clipboardModule.destroy();
        }
        this.clipboardModule = this.grid.clipboardModule = new TreeClipboard(this);
    };
    TreeGrid.prototype.gridRendered = function (args, fn) {
        if (args.id === this.element.id + '_gridcontrol') {
            this.grid = args.grid;
        }
        else {
            return;
        }
        this.grid.query.queries = [];
        var isJsComponent = 'isJsComponent';
        var isHybrid = 'isHybrid';
        if (!this.isServerRendered) {
            this.grid[isJsComponent] = true;
        }
        else {
            this.grid[isHybrid] = true;
        }
        this.setBlazorGUID();
        this.setColIndex(this.grid.columns);
        this.bindGridEvents();
        var headerCheckbox = 'headerCheckbox';
        if (!isNullOrUndefined(this.selectionModule)) {
            this.grid.on('colgroup-refresh', this.selectionModule[headerCheckbox], this.selectionModule);
        }
        for (var i = 0; i < this.columns.length; i++) {
            this.columns[i].uid = this.grid.columns[i].uid;
        }
        this.wireEvents();
        this.afterGridRender();
        var processModel = 'processModel';
        this.grid[processModel]();
        gridObserver.off('component-rendered', this.gridRendered);
    };
    TreeGrid.prototype.setColIndex = function (columnModel, ind) {
        if (ind === void 0) { ind = 0; }
        for (var i = 0, len = columnModel.length; i < len; i++) {
            if (columnModel[i].columns) {
                columnModel[i].index = isNullOrUndefined(columnModel[i].index) ? ind :
                    columnModel[i].index;
                ind++;
                ind = this.setColIndex(columnModel[i].columns, ind);
            }
            else {
                columnModel[i].index = isNullOrUndefined(columnModel[i].index) ? ind :
                    columnModel[i].index;
                ind++;
            }
        }
        return ind;
    };
    TreeGrid.prototype.setBlazorGUID = function () {
        var guid = 'guid';
        if (this.editSettings) {
            this.grid.editSettings[guid] = this.editSettings[guid];
            this.grid.editSettings.template = this.editSettings.template;
        }
        for (var i = 0; i < this.aggregates.length; i++) {
            for (var j = 0; j < this.aggregates[i].columns.length; j++) {
                this.grid.aggregates[i].columns[j][guid] = this.aggregates[i].columns[j][guid];
            }
        }
        for (var i = 0; i < this.columns.length; i++) {
            this.grid.columns[i][guid] = this.columns[i][guid];
        }
    };
    ;
    TreeGrid.prototype.convertTreeData = function (data) {
        var _this = this;
        if (data instanceof Array && data.length > 0 && data[0].hasOwnProperty('level')) {
            this.flatData = isCountRequired(this) ? getValue('result', data) : data;
            this.flatData.filter(function (e) {
                setValue('uniqueIDCollection.' + e.uniqueID, e, _this);
                if (e.level === 0) {
                    _this.parentData.push(e);
                }
            });
        }
        else {
            if (isCountRequired(this)) {
                var griddata = getValue('result', this.dataSource);
                this.dataModule.convertToFlatData(griddata);
            }
            else {
                this.dataModule.convertToFlatData(data);
            }
        }
    };
    // private getGridData(): Object {
    //   if (isRemoteData(this)) {
    //     return this.dataSource;
    //   } else if (this.isLocalData && this.dataSource instanceof DataManager) {
    //     this.dataSource.dataSource.json = this.flatData;
    //     return this.dataSource;
    //   }
    //   return this.flatData;
    // }
    TreeGrid.prototype.bindGridProperties = function () {
        var edit = {};
        this.bindedDataSource();
        this.grid.enableRtl = this.enableRtl;
        this.grid.allowKeyboard = this.allowKeyboard;
        this.grid.columns = this.getGridColumns(this.columns);
        this.grid.allowExcelExport = this.allowExcelExport;
        this.grid.allowPdfExport = this.allowPdfExport;
        this.grid.query = this.query;
        this.grid.columnQueryMode = this.columnQueryMode;
        this.grid.allowPaging = this.allowPaging;
        this.grid.pageSettings = getActualProperties(this.pageSettings);
        this.grid.pagerTemplate = this.pagerTemplate;
        this.grid.showColumnMenu = this.showColumnMenu;
        this.grid.allowSorting = this.allowSorting;
        this.grid.allowFiltering = this.allowFiltering;
        this.grid.enableVirtualization = this.enableVirtualization;
        this.grid.width = this.width;
        this.grid.height = this.height;
        this.grid.enableAltRow = this.enableAltRow;
        this.grid.allowReordering = this.allowReordering;
        this.grid.allowTextWrap = this.allowTextWrap;
        this.grid.allowResizing = this.allowResizing;
        this.grid.enableHover = this.enableHover;
        this.grid.enableAutoFill = this.enableAutoFill;
        this.grid.allowRowDragAndDrop = this.allowRowDragAndDrop;
        this.grid.rowDropSettings = getActualProperties(this.rowDropSettings);
        this.grid.rowHeight = this.rowHeight;
        this.grid.gridLines = this.gridLines;
        this.grid.allowSelection = this.allowSelection;
        this.grid.toolbar = getActualProperties(this.getGridToolbar());
        this.grid.toolbarTemplate = this.toolbarTemplate;
        this.grid.showColumnChooser = this.showColumnChooser;
        this.grid.filterSettings = getActualProperties(this.filterSettings);
        this.grid.selectionSettings = getActualProperties(this.selectionSettings);
        this.grid.sortSettings = getActualProperties(this.sortSettings);
        this.grid.searchSettings = getActualProperties(this.searchSettings);
        this.grid.aggregates = getActualProperties(this.aggregates);
        this.grid.textWrapSettings = getActualProperties(this.textWrapSettings);
        this.grid.printMode = getActualProperties(this.printMode);
        this.grid.locale = getActualProperties(this.locale);
        this.grid.selectedRowIndex = this.selectedRowIndex;
        this.grid.contextMenuItems = getActualProperties(this.getContextMenu());
        this.grid.columnMenuItems = getActualProperties(this.columnMenuItems);
        this.grid.editSettings = this.getGridEditSettings();
        this.grid.rowTemplate = getActualProperties(this.rowTemplate);
        this.grid.detailTemplate = getActualProperties(this.detailTemplate);
        this.grid.frozenRows = this.frozenRows;
        this.grid.frozenColumns = this.frozenColumns;
        var templateInstance = 'templateDotnetInstance';
        this.grid[templateInstance] = this[templateInstance];
        var isJsComponent = 'isJsComponent';
        this.grid[isJsComponent] = true;
    };
    TreeGrid.prototype.triggerEvents = function (args) {
        this.trigger(getObject('name', args), args);
    };
    TreeGrid.prototype.bindGridEvents = function () {
        var _this = this;
        var treeGrid = this;
        this.grid.rowSelecting = this.triggerEvents.bind(this);
        this.grid.rowSelected = function (args) {
            if (!isBlazor()) {
                _this.selectedRowIndex = _this.grid.selectedRowIndex;
            }
            else if (isBlazor() && _this.isServerRendered) {
                _this.allowServerDataBinding = false;
                _this.setProperties({ selectedRowIndex: _this.grid.selectedRowIndex }, true);
                _this.allowServerDataBinding = true;
            }
            treeGrid.notify(events.rowSelected, args);
            _this.trigger(events.rowSelected, args);
        };
        this.grid.rowDeselected = function (args) {
            _this.selectedRowIndex = _this.grid.selectedRowIndex;
            _this.trigger(events.rowDeselected, args);
        };
        this.grid.resizeStop = function (args) {
            _this.updateColumnModel();
            _this.trigger(events.resizeStop, args);
        };
        this.grid.excelQueryCellInfo = function (args) {
            _this.notify('excelCellInfo', args);
            args = _this.dataResults;
        };
        this.grid.pdfQueryCellInfo = function (args) {
            _this.notify('pdfCellInfo', args);
            args = _this.dataResults;
        };
        this.grid.checkBoxChange = function (args) {
            _this.trigger(events.checkboxChange, args);
        };
        this.grid.pdfExportComplete = this.triggerEvents.bind(this);
        this.grid.excelExportComplete = this.triggerEvents.bind(this);
        this.grid.excelHeaderQueryCellInfo = this.triggerEvents.bind(this);
        this.grid.pdfHeaderQueryCellInfo = this.triggerEvents.bind(this);
        this.grid.dataSourceChanged = this.triggerEvents.bind(this);
        this.grid.recordDoubleClick = this.triggerEvents.bind(this);
        this.grid.rowDeselecting = this.triggerEvents.bind(this);
        this.grid.cellDeselected = this.triggerEvents.bind(this);
        this.grid.cellDeselecting = this.triggerEvents.bind(this);
        this.grid.columnMenuOpen = this.triggerEvents.bind(this);
        this.grid.columnMenuClick = this.triggerEvents.bind(this);
        this.grid.cellSelected = this.triggerEvents.bind(this);
        this.grid.headerCellInfo = this.triggerEvents.bind(this);
        this.grid.resizeStart = this.triggerEvents.bind(this);
        this.grid.resizing = this.triggerEvents.bind(this);
        this.grid.columnDrag = this.triggerEvents.bind(this);
        this.grid.columnDragStart = this.triggerEvents.bind(this);
        this.grid.columnDrop = this.triggerEvents.bind(this);
        this.grid.beforePrint = this.triggerEvents.bind(this);
        this.grid.beforeCopy = this.triggerEvents.bind(this);
        this.grid.beforePaste = function (args) {
            var rows = _this.getRows();
            var rowIndex = 'rowIndex';
            while (rows[args[rowIndex]].classList.contains('e-summaryrow')) {
                args[rowIndex]++;
            }
            _this.trigger(events.beforePaste, args);
        };
        this.grid.load = function () {
            treeGrid.grid.on('initial-end', treeGrid.afterGridRender, treeGrid);
        };
        this.grid.printComplete = this.triggerEvents.bind(this);
        this.grid.actionFailure = this.triggerEvents.bind(this);
        this.extendedGridDataBoundEvent();
        this.extendedGridEvents();
        this.extendedGridActionEvents();
        this.extendedGridEditEvents();
        this.bindGridDragEvents();
        this.bindCallBackEvents();
    };
    TreeGrid.prototype.lastRowBorder = function (visiblerow, isAddBorder) {
        for (var j = 0; j < visiblerow.cells.length; j++) {
            isAddBorder ? addClass([visiblerow.cells[j]], 'e-lastrowcell') : removeClass([visiblerow.cells[j]], 'e-lastrowcell');
        }
    };
    ;
    TreeGrid.prototype.isPixelHeight = function () {
        if (this.height !== 'auto' && this.height.toString().indexOf('%') === -1) {
            return true;
        }
        else {
            return false;
        }
    };
    ;
    TreeGrid.prototype.extendedGridDataBoundEvent = function () {
        var _this = this;
        var treeGrid = this;
        this.grid.dataBound = function (args) {
            _this.updateRowTemplate(args);
            _this.updateColumnModel();
            _this.updateAltRow(_this.getRows());
            _this.notify('dataBoundArg', args);
            if (isRemoteData(_this) && !isOffline(_this) && !_this.hasChildMapping) {
                var req = getObject('dataSource.requests', _this).filter(function (e) {
                    return e.httpRequest.statusText !== 'OK';
                }).length;
                setValue('grid.contentModule.isLoaded', !(req > 0), _this);
            }
            if (_this.isPixelHeight() && _this.initialRender) {
                var totalRows = _this.getRows();
                for (var i = totalRows.length - 1; i > 0; i--) {
                    if (!isHidden(totalRows[i])) {
                        if (totalRows[i].nextElementSibling) {
                            _this.lastRowBorder(totalRows[i], true);
                        }
                        break;
                    }
                }
            }
            _this.trigger(events.dataBound, args);
            _this.initialRender = false;
        };
        this.grid.beforeDataBound = function (args) {
            var dataSource = 'dataSource';
            var requestType = getObject('action', args);
            if (isRemoteData(treeGrid) && !isOffline(treeGrid) && requestType !== 'edit') {
                treeGrid.notify('updateRemoteLevel', args);
                args = (treeGrid.dataResults);
            }
            else if (treeGrid.flatData.length === 0 && isOffline(treeGrid) && treeGrid.dataSource instanceof DataManager) {
                var dm = treeGrid.dataSource;
                treeGrid.dataModule.convertToFlatData(dm.dataSource.json);
                args.result = treeGrid.grid.dataSource[dataSource].json = treeGrid.flatData;
            }
            if (!isRemoteData(treeGrid) && !isCountRequired(this) && !isNullOrUndefined(treeGrid.dataSource)) {
                if (this.isPrinting) {
                    setValue('isPrinting', true, args);
                }
                treeGrid.notify('dataProcessor', args);
                //args = this.dataModule.dataProcessor(args);
            }
            extend(args, treeGrid.dataResults);
            // this.notify(events.beforeDataBound, args);
            if (!this.isPrinting) {
                var callBackPromise_1 = new Deferred();
                treeGrid.trigger(events.beforeDataBound, args, function (beforeDataBoundArgs) {
                    callBackPromise_1.resolve(beforeDataBoundArgs);
                });
                return callBackPromise_1;
            }
        };
    };
    TreeGrid.prototype.bindCallBackEvents = function () {
        var _this = this;
        var beginEdit;
        if (isBlazor() && this.isServerRendered) {
            if (!isNullOrUndefined(this.grid.beginEdit)) {
                beginEdit = this.grid.beginEdit;
            }
        }
        this.grid.toolbarClick = function (args) {
            var callBackPromise = new Deferred();
            _this.trigger(events.toolbarClick, args, function (toolbarargs) {
                if (!toolbarargs.cancel) {
                    _this.notify(events.toolbarClick, args);
                }
                callBackPromise.resolve(toolbarargs);
            });
            return callBackPromise;
        };
        this.grid.cellSelecting = function (args) {
            var callBackPromise = new Deferred();
            _this.trigger(getObject('name', args), args, function (cellselectingArgs) {
                callBackPromise.resolve(cellselectingArgs);
            });
            return callBackPromise;
        };
        this.grid.beginEdit = function (args) {
            if (isBlazor() && _this.isServerRendered) {
                if (beginEdit && typeof beginEdit === 'function') {
                    beginEdit.apply(_this, [args]);
                }
            }
            var callBackPromise = new Deferred();
            _this.trigger(events.beginEdit, args, function (begineditArgs) {
                callBackPromise.resolve(begineditArgs);
            });
            return callBackPromise;
        };
    };
    TreeGrid.prototype.extendedGridEditEvents = function () {
        var _this = this;
        var keypressed = 'key-pressed';
        var editKeyPress = 'keyPressed';
        var localobserver = 'localObserver';
        var cellEdit;
        var cellSave;
        if (isBlazor() && this.isServerRendered) {
            if (!isNullOrUndefined(this.grid.cellEdit)) {
                cellEdit = this.grid.cellEdit;
            }
            if (!isNullOrUndefined(this.grid.cellSave)) {
                cellSave = this.grid.cellSave;
            }
        }
        if (this.editModule && isBlazor() && this.isServerRendered) {
            this.grid.on(keypressed, this.editModule[editKeyPress], this.editModule);
            var events_1 = this.grid[localobserver].boundedEvents['key-pressed'];
            events_1.splice(0, 0, events_1.pop());
        }
        this.grid.dataStateChange = function (args) {
            if (_this.isExpandRefresh) {
                _this.isExpandRefresh = false;
                _this.grid.dataSource = { result: _this.flatData, count: getValue('count', _this.grid.dataSource) };
            }
            else {
                _this.trigger(events.dataStateChange, args);
            }
        };
        this.grid.cellSave = function (args) {
            if (isBlazor() && _this.isServerRendered) {
                if (cellSave && typeof cellSave === 'function') {
                    cellSave.apply(_this, [args]);
                }
            }
            if (_this.grid.isContextMenuOpen()) {
                var contextitems = void 0;
                contextitems = _this.grid.contextMenuModule.contextMenu.element.getElementsByClassName('e-selected')[0];
                if ((isNullOrUndefined(contextitems) || contextitems.id !== _this.element.id + '_gridcontrol_cmenu_Save')) {
                    args.cancel = true;
                }
            }
            var callBackPromise = new Deferred();
            _this.trigger(events.cellSave, args, function (cellsaveArgs) {
                if (isBlazor() && !_this.isServerRendered) {
                    cellsaveArgs.cell = getElement(cellsaveArgs.cell);
                }
                if (!cellsaveArgs.cancel) {
                    _this.notify(events.cellSave, cellsaveArgs);
                }
                callBackPromise.resolve(cellsaveArgs);
            });
            return callBackPromise;
        };
        this.grid.cellSaved = function (args) {
            _this.trigger(events.cellSaved, args);
            _this.notify(events.cellSaved, args);
        };
        this.grid.cellEdit = function (args) {
            if (isBlazor() && _this.isServerRendered) {
                if (cellEdit && typeof cellEdit === 'function') {
                    cellEdit.apply(_this, [args]);
                }
            }
            var prom = 'promise';
            var promise = new Deferred();
            args[prom] = promise;
            _this.notify(events.cellEdit, args);
            return promise;
        };
        this.grid.batchAdd = function (args) {
            _this.trigger(events.batchAdd, args);
            _this.notify(events.batchAdd, args);
        };
        this.grid.beforeBatchSave = function (args) {
            _this.trigger(events.beforeBatchSave, args);
            _this.notify(events.beforeBatchSave, args);
        };
        this.grid.beforeBatchAdd = function (args) {
            _this.trigger(events.beforeBatchAdd, args);
            _this.notify(events.beforeBatchAdd, args);
        };
        this.grid.batchDelete = function (args) {
            _this.trigger(events.batchDelete, args);
            _this.notify(events.batchDelete, args);
        };
        this.grid.beforeBatchDelete = function (args) {
            _this.trigger(events.beforeBatchDelete, args);
            _this.notify(events.beforeBatchDelete, args);
        };
        this.grid.batchCancel = function (args) {
            if (_this.editSettings.mode !== 'Cell') {
                _this.trigger(events.batchCancel, args);
            }
            _this.notify(events.batchCancel, args);
        };
    };
    TreeGrid.prototype.updateRowTemplate = function (args) {
        var _this = this;
        if (isBlazor() && !this.isServerRendered) {
            setTimeout(function () {
                _this.treeColumnRowTemplate(args);
            }, 1000);
        }
        else {
            this.treeColumnRowTemplate(args);
        }
    };
    TreeGrid.prototype.bindedDataSource = function () {
        var dataSource = 'dataSource';
        var isDataAvailable = 'isDataAvailable';
        var adaptor = 'adaptor';
        var ready = 'ready';
        var adaptorName = 'adaptorName';
        var dotnetInstance = 'dotnetInstance';
        var key = 'key';
        if (this.dataSource && isCountRequired(this)) {
            var data = this.flatData;
            var datacount = getValue('count', this.dataSource);
            this.grid.dataSource = { result: data, count: datacount };
        }
        else {
            this.grid.dataSource = !(this.dataSource instanceof DataManager) ?
                this.flatData : new DataManager(this.dataSource.dataSource, this.dataSource.defaultQuery, this.dataSource.adaptor);
        }
        if (isBlazor() && this.dataSource instanceof DataManager) {
            this.grid.dataSource[adaptorName] = this.dataSource[adaptorName];
            this.grid.dataSource[dotnetInstance] = this.dataSource[dotnetInstance];
            this.grid.dataSource[key] = this.dataSource[key];
        }
        if (this.dataSource instanceof DataManager && (this.dataSource.dataSource.offline || this.dataSource.ready)) {
            this.grid.dataSource[dataSource].json = extendArray(this.dataSource[dataSource].json);
            this.grid.dataSource[ready] = this.dataSource.ready;
            var dm_1 = this.grid.dataSource;
            if (!isNullOrUndefined(this.grid.dataSource[ready])) {
                this.grid.dataSource[ready].then(function (e) {
                    dm_1[dataSource].offline = true;
                    dm_1[isDataAvailable] = true;
                    dm_1[dataSource].json = e.result;
                    dm_1[adaptor] = new JsonAdaptor();
                });
            }
        }
    };
    TreeGrid.prototype.extendedGridActionEvents = function () {
        var _this = this;
        var actionComplete;
        if (isBlazor() && this.isServerRendered) {
            if (!isNullOrUndefined(this.grid.actionComplete)) {
                actionComplete = this.grid.actionComplete;
            }
        }
        this.grid.actionBegin = function (args) {
            if (args.requestType === 'sorting' && args.target && args.target.parentElement &&
                args.target.parentElement.classList.contains('e-hierarchycheckbox')) {
                args.cancel = true;
            }
            var requestType = getObject('requestType', args);
            if (requestType === 'reorder') {
                _this.notify('getColumnIndex', {});
            }
            _this.notify('actionBegin', { editAction: args });
            if (!isRemoteData(_this) && !isNullOrUndefined(_this.filterModule) && !isCountRequired(_this)
                && (_this.grid.filterSettings.columns.length === 0 || _this.grid.searchSettings.key.length === 0)) {
                _this.notify('clearFilters', { flatData: _this.grid.dataSource });
                _this.grid.dataSource = _this.dataResults.result;
            }
            var callBackPromise = new Deferred();
            if (isBlazor() && args.requestType === 'delete' && !_this.isServerRendered) {
                var data = 'data';
                args[data] = args[data][0];
            }
            _this.trigger(events.actionBegin, args, function (actionArgs) {
                if (isBlazor() && actionArgs.requestType === 'delete' && !_this.isServerRendered) {
                    var data = 'data';
                    actionArgs[data] = [actionArgs[data]];
                }
                if (!actionArgs.cancel) {
                    _this.notify(events.beginEdit, actionArgs);
                }
                if (isBlazor() && actionArgs.requestType === 'beginEdit' && !_this.isServerRendered) {
                    actionArgs.row = getElement(actionArgs.row);
                }
                callBackPromise.resolve(actionArgs);
            });
            return callBackPromise;
        };
        this.grid.actionComplete = function (args) {
            if (isBlazor() && _this.isServerRendered && args.requestType !== 'filterAfterOpen') {
                var rows = _this.getRows();
                for (var i = 0; i < rows.length; i++) {
                    if (rows[i].classList.contains('e-treerowcollapsed') || rows[i].classList.contains('e-treerowexpanded')) {
                        (_this.enableCollapseAll && args.requestType === 'paging') ? removeClass([rows[i]], 'e-treerowexpanded') :
                            removeClass([rows[i]], 'e-treerowcollapsed');
                        (_this.enableCollapseAll && args.requestType === 'paging') ? addClass([rows[i]], 'e-treerowcollapsed') :
                            addClass([rows[i]], 'e-treerowexpanded');
                    }
                    var cells = rows[i].querySelectorAll('.e-rowcell');
                    var expandicon = cells[_this.treeColumnIndex].getElementsByClassName('e-treegridcollapse')[0] ||
                        cells[_this.treeColumnIndex].getElementsByClassName('e-treegridexpand')[0];
                    if (expandicon) {
                        (_this.enableCollapseAll && args.requestType === 'paging') ? removeClass([expandicon], 'e-treegridexpand') :
                            removeClass([expandicon], 'e-treegridcollapse');
                        (_this.enableCollapseAll && args.requestType === 'paging') ? addClass([expandicon], 'e-treegridcollapse') :
                            addClass([expandicon], 'e-treegridexpand');
                    }
                }
                if (actionComplete && typeof actionComplete === 'function') {
                    actionComplete.apply(_this, [args]);
                }
            }
            _this.notify('actioncomplete', args);
            _this.updateColumnModel();
            _this.updateTreeGridModel();
            if (args.requestType === 'reorder') {
                _this.notify('setColumnIndex', {});
            }
            _this.notify('actionComplete', { editAction: args });
            if (args.requestType === 'add' && (_this.editSettings.newRowPosition !== 'Top' && _this.editSettings.newRowPosition !== 'Bottom')) {
                _this.notify(events.beginAdd, args);
            }
            if (args.requestType === 'batchsave') {
                _this.notify(events.batchSave, args);
            }
            _this.notify('updateGridActions', args);
            if (isBlazor() && args.requestType === 'delete' && !_this.isServerRendered) {
                var data = 'data';
                args[data] = args[data][0];
            }
            _this.trigger(events.actionComplete, args);
        };
    };
    TreeGrid.prototype.extendedGridEvents = function () {
        var _this = this;
        var treeGrid = this;
        this.grid.recordDoubleClick = function (args) {
            _this.trigger(events.recordDoubleClick, args);
            _this.notify(events.recordDoubleClick, args);
        };
        this.grid.detailDataBound = function (args) {
            _this.notify('detaildataBound', args);
            _this.trigger(events.detailDataBound, args);
        };
        this.grid.rowDataBound = function (args) {
            if (isNullOrUndefined(this.isPrinting)) {
                setValue('isPrinting', false, args);
            }
            else {
                setValue('isPrinting', this.isPrinting, args);
            }
            treeGrid.renderModule.RowModifier(args);
        };
        this.grid.queryCellInfo = function (args) {
            if (isNullOrUndefined(this.isPrinting)) {
                setValue('isPrinting', false, args);
            }
            else {
                setValue('isPrinting', this.isPrinting, args);
            }
            treeGrid.renderModule.cellRender(args);
        };
        this.grid.contextMenuClick = function (args) {
            _this.notify(events.contextMenuClick, args);
            _this.trigger(events.contextMenuClick, args);
        };
        this.grid.contextMenuOpen = function (args) {
            _this.notify(events.contextMenuOpen, args);
            _this.trigger(events.contextMenuOpen, args);
        };
        this.grid.queryCellInfo = function (args) {
            _this.renderModule.cellRender(args);
        };
    };
    TreeGrid.prototype.bindGridDragEvents = function () {
        var _this = this;
        var treeGrid = this;
        this.grid.rowDragStartHelper = function (args) {
            treeGrid.trigger(events.rowDragStartHelper, args);
        };
        this.grid.rowDragStart = function (args) {
            treeGrid.trigger(events.rowDragStart, args);
        };
        this.grid.rowDrag = function (args) {
            if (_this.grid.isEdit) {
                args.cancel = true;
                return;
            }
            treeGrid.notify(events.rowdraging, args);
            treeGrid.trigger(events.rowDrag, args);
        };
        this.grid.rowDrop = function (args) {
            if (_this.grid.isEdit) {
                args.cancel = true;
                return;
            }
            treeGrid.notify(events.rowDropped, args);
            args.cancel = true;
        };
    };
    /**
     * Renders TreeGrid component
     * @private
     */
    TreeGrid.prototype.loadGrid = function () {
        this.bindGridProperties();
        this.bindGridEvents();
        setValue('registeredTemplate', this.registeredTemplate, this.grid);
        var ref = 'viewContainerRef';
        setValue('viewContainerRef', this[ref], this.grid);
    };
    /**
     * AutoGenerate TreeGrid columns from first record
     * @hidden
     */
    TreeGrid.prototype.autoGenerateColumns = function () {
        if (!this.columns.length && (!this.dataModule.isRemote() && Object.keys(this.dataSource).length)) {
            this.columns = [];
            var record = void 0;
            // if (this.dataSource instanceof DataManager) {
            //   record = (<DataManager>this.dataSource).dataSource.json[0];
            // } else {
            record = this.dataSource[0];
            // }
            var keys = Object.keys(record);
            for (var i = 0; i < keys.length; i++) {
                if ([this.childMapping, this.parentIdMapping].indexOf(keys[i]) === -1) {
                    this.columns.push(keys[i]);
                }
            }
        }
    };
    TreeGrid.prototype.getGridEditSettings = function () {
        var edit = {};
        var guid = 'guid';
        edit.allowAdding = this.editSettings.allowAdding;
        edit.allowEditing = this.editSettings.allowEditing;
        edit.allowDeleting = this.editSettings.allowDeleting;
        edit.newRowPosition = this.editSettings.newRowPosition === 'Bottom' ? 'Bottom' : 'Top';
        edit.allowEditOnDblClick = this.editSettings.allowEditOnDblClick;
        edit.showConfirmDialog = this.editSettings.showConfirmDialog;
        edit.template = this.editSettings.template;
        edit.showDeleteConfirmDialog = this.editSettings.showDeleteConfirmDialog;
        edit[guid] = this.editSettings[guid];
        edit.dialog = this.editSettings.dialog;
        switch (this.editSettings.mode) {
            case 'Dialog':
                edit.mode = this.editSettings.mode;
                break;
            case 'Batch':
                edit.mode = this.editSettings.mode;
                break;
            case 'Row':
                edit.mode = 'Normal';
                break;
            case 'Cell':
                edit.mode = 'Normal';
                edit.showConfirmDialog = false;
                break;
        }
        return edit;
    };
    /**
     * Defines grid toolbar from treegrid toolbar model
     * @hidden
     */
    TreeGrid.prototype.getContextMenu = function () {
        if (this.contextMenuItems) {
            var items = [];
            for (var i = 0; i < this.contextMenuItems.length; i++) {
                var item = void 0;
                switch (this.contextMenuItems[i]) {
                    case 'AddRow':
                    case ContextMenuItems.AddRow:
                        items.push({ text: this.l10n.getConstant('AddRow'),
                            target: '.e-content', id: this.element.id + '_gridcontrol_cmenu_AddRow',
                            items: [{ text: this.l10n.getConstant('Above'), id: 'Above' }, { text: this.l10n.getConstant('Below'), id: 'Below' }] });
                        break;
                    default:
                        items.push(this.contextMenuItems[i]);
                }
            }
            return items;
        }
        else {
            return null;
        }
    };
    /**
     * Defines grid toolbar from treegrid toolbar model
     * @hidden
     */
    TreeGrid.prototype.getGridToolbar = function () {
        if (this.toolbar) {
            var items = [];
            for (var i = 0; i < this.toolbar.length; i++) {
                var item = void 0;
                switch (this.toolbar[i]) {
                    case 'Search':
                    case ToolbarItem.Search:
                        items.push('Search');
                        break;
                    case 'Print':
                    case ToolbarItem.Print:
                        items.push('Print');
                        break;
                    case 'ExpandAll':
                    case ToolbarItem.ExpandAll:
                        var tooltipText = this.l10n.getConstant('ExpandAll');
                        items.push({ text: tooltipText, tooltipText: tooltipText,
                            prefixIcon: 'e-expand', id: this.element.id + '_gridcontrol_expandall' });
                        break;
                    case 'CollapseAll':
                    case ToolbarItem.CollapseAll:
                        var tooltip = this.l10n.getConstant('CollapseAll');
                        items.push({ text: tooltip,
                            tooltipText: tooltip, prefixIcon: 'e-collapse', id: this.element.id + '_gridcontrol_collapseall'
                        });
                        break;
                    case 'Indent':
                    case ToolbarItem.RowIndent:
                        var tooltipindent = this.l10n.getConstant('RowIndent');
                        items.push({
                            text: tooltipindent, tooltipText: tooltipindent,
                            prefixIcon: 'e-indent', id: this.element.id + '_gridcontrol_indent'
                        });
                        break;
                    case 'Outdent':
                    case ToolbarItem.RowOutdent:
                        var tooltipoutdent = this.l10n.getConstant('RowOutdent');
                        items.push({
                            text: tooltipoutdent, tooltipText: tooltipoutdent,
                            prefixIcon: 'e-outdent', id: this.element.id + '_gridcontrol_outdent'
                        });
                        break;
                    default:
                        items.push(this.toolbar[i]);
                }
            }
            return items;
        }
        else {
            return null;
        }
    };
    /**
     * Convert TreeGrid ColumnModel to Grid Column
     * @hidden
     */
    TreeGrid.prototype.getGridColumns = function (columns) {
        var column = columns;
        this.columnModel = [];
        var treeGridColumn;
        var gridColumn;
        var gridColumnCollection = [];
        for (var i = 0; i < column.length; i++) {
            var treeColumn = this.grid.getColumnByUid(column[i].uid);
            gridColumn = treeColumn ? treeColumn : {};
            treeGridColumn = {};
            if (typeof this.columns[i] === 'string') {
                gridColumn.field = treeGridColumn.field = this.columns[i];
            }
            else {
                for (var _i = 0, _a = Object.keys(column[i]); _i < _a.length; _i++) {
                    var prop = _a[_i];
                    gridColumn[prop] = treeGridColumn[prop] = column[i][prop];
                }
            }
            if (column[i].columns) {
                this.getGridColumns(columns[i].columns);
            }
            else {
                this.columnModel.push(new Column(treeGridColumn));
            }
            gridColumnCollection.push(gridColumn);
        }
        return gridColumnCollection;
    };
    /**
     * Called internally if any of the property value changed.
     * @hidden
     */
    /* tslint:disable-next-line:max-line-length */
    // tslint:disable-next-line:max-func-body-length
    TreeGrid.prototype.onPropertyChanged = function (newProp, oldProp) {
        var properties = Object.keys(newProp);
        var requireRefresh = false;
        var preventUpdate = 'preventUpdate';
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var prop = properties_1[_i];
            switch (prop) {
                case 'columns':
                    if (!(isBlazor() && this.isServerRendered && this[preventUpdate])) {
                        this.grid.columns = this.getGridColumns(this.columns);
                    }
                    break;
                case 'treeColumnIndex':
                    this.grid.refreshColumns();
                    break;
                case 'allowPaging':
                    this.grid.allowPaging = this.allowPaging;
                    break;
                case 'pageSettings':
                    this.grid.pageSettings = getActualProperties(this.pageSettings);
                    requireRefresh = true;
                    break;
                case 'enableVirtualization':
                    this.grid.enableVirtualization = this.enableVirtualization;
                    break;
                case 'toolbar':
                    this.grid.toolbar = this.getGridToolbar();
                    break;
                case 'allowSelection':
                    this.grid.allowSelection = this.allowSelection;
                    break;
                case 'selectionSettings':
                    this.grid.selectionSettings = getActualProperties(this.selectionSettings);
                    break;
                case 'allowSorting':
                    this.grid.allowSorting = this.allowSorting;
                    break;
                case 'allowMultiSorting':
                    this.grid.allowMultiSorting = this.allowMultiSorting;
                    break;
                case 'sortSettings':
                    this.grid.sortSettings = getActualProperties(this.sortSettings);
                    break;
                case 'searchSettings':
                    this.grid.searchSettings = getActualProperties(this.searchSettings);
                    break;
                case 'allowFiltering':
                    this.grid.allowFiltering = this.allowFiltering;
                    break;
                case 'filterSettings':
                    this.grid.filterSettings = getActualProperties(this.filterSettings);
                    break;
                case 'showColumnMenu':
                    this.grid.showColumnMenu = this.showColumnMenu;
                    break;
                case 'allowRowDragAndDrop':
                    this.grid.allowRowDragAndDrop = this.allowRowDragAndDrop;
                    break;
                case 'aggregates':
                    this.grid.aggregates = getActualProperties(this.aggregates);
                    break;
                case 'dataSource':
                    this.isLocalData = (!(this.dataSource instanceof DataManager) || (!isNullOrUndefined(this.dataSource.ready))
                        || this.dataSource.adaptor instanceof RemoteSaveAdaptor);
                    this.convertTreeData(this.dataSource);
                    if (this.isLocalData) {
                        if (isCountRequired(this)) {
                            var count = getValue('count', this.dataSource);
                            this.grid.dataSource = { result: this.flatData, count: count };
                        }
                        else {
                            this.grid.dataSource = this.flatData;
                        }
                    }
                    else {
                        this.bindedDataSource();
                        if (this.enableVirtualization) {
                            this.grid.contentModule.removeEventListener();
                            this.grid.contentModule.eventListener('on');
                            this.grid.contentModule.renderTable();
                        }
                    }
                    break;
                case 'query':
                    this.grid.query = this.query;
                    break;
                case 'enableCollapseAll':
                    if (newProp[prop]) {
                        this.collapseAll();
                    }
                    else {
                        this.expandAll();
                    }
                    break;
                case 'expandStateMapping':
                    this.refresh();
                    break;
                case 'gridLines':
                    this.grid.gridLines = this.gridLines;
                    break;
                case 'rowTemplate':
                    this.grid.rowTemplate = getActualProperties(this.rowTemplate);
                    break;
                case 'frozenRows':
                    this.grid.frozenRows = this.frozenRows;
                    break;
                case 'frozenColumns':
                    this.grid.frozenColumns = this.frozenColumns;
                    break;
                case 'rowHeight':
                    this.grid.rowHeight = this.rowHeight;
                    break;
                case 'height':
                    if (!isNullOrUndefined(this.height) && typeof (this.height) === 'string' && this.height.indexOf('%') !== -1) {
                        this.element.style.height = this.height;
                    }
                    this.grid.height = this.height;
                    break;
                case 'width':
                    if (!isNullOrUndefined(this.width) && typeof (this.width) === 'string' && this.width.indexOf('%') !== -1) {
                        this.element.style.width = this.width;
                    }
                    this.grid.width = this.width;
                    break;
                case 'locale':
                    this.grid.locale = this.locale;
                    break;
                case 'selectedRowIndex':
                    this.grid.selectedRowIndex = this.selectedRowIndex;
                    break;
                case 'enableAltRow':
                    this.grid.enableAltRow = this.enableAltRow;
                    break;
                case 'enableHover':
                    this.grid.enableHover = this.enableHover;
                    break;
                case 'enableAutoFill':
                    this.grid.enableAutoFill = this.enableAutoFill;
                    break;
                case 'allowExcelExport':
                    this.grid.allowExcelExport = this.allowExcelExport;
                    break;
                case 'allowPdfExport':
                    this.grid.allowPdfExport = this.allowPdfExport;
                    break;
                case 'enableRtl':
                    this.grid.enableRtl = this.enableRtl;
                    break;
                case 'allowReordering':
                    this.grid.allowReordering = this.allowReordering;
                    break;
                case 'allowResizing':
                    this.grid.allowResizing = this.allowResizing;
                    break;
                case 'textWrapSettings':
                    this.grid.textWrapSettings = getActualProperties(this.textWrapSettings);
                    break;
                case 'allowTextWrap':
                    this.grid.allowTextWrap = getActualProperties(this.allowTextWrap);
                    this.refresh();
                    break;
                case 'contextMenuItems':
                    this.grid.contextMenuItems = this.getContextMenu();
                    break;
                case 'showColumnChooser':
                    this.grid.showColumnChooser = this.showColumnChooser;
                    break;
                case 'detailTemplate':
                    this.grid.detailTemplate = getActualProperties(this.detailTemplate);
                    break;
                case 'columnMenuItems':
                    this.grid.columnMenuItems = getActualProperties(this.columnMenuItems);
                    break;
                case 'editSettings':
                    if (this.grid.isEdit && this.grid.editSettings.mode === 'Normal' && newProp[prop].mode &&
                        (newProp[prop].mode === 'Cell' || newProp[prop].mode === 'Row')) {
                        this.grid.closeEdit();
                    }
                    this.grid.editSettings = this.getGridEditSettings();
                    break;
            }
            if (requireRefresh) {
                this.refresh();
            }
        }
    };
    /**
     * Destroys the component (detaches/removes all event handlers, attributes, classes, and empties the component element).
     * @method destroy
     * @return {void}
     */
    TreeGrid.prototype.destroy = function () {
        this.removeListener();
        this.unwireEvents();
        _super.prototype.destroy.call(this);
        if (this.grid) {
            this.grid.destroy();
        }
        if (this.dataModule) {
            this.dataModule.destroy();
        }
        var modules = ['dataModule', 'sortModule', 'renderModule', 'filterModule', 'printModule', 'clipboardModule',
            'excelExportModule', 'pdfExportModule', 'toolbarModule', 'summaryModule', 'reorderModule', 'resizeModule',
            'pagerModule', 'keyboardModule', 'columnMenuModule', 'contextMenuModule', 'editModule', 'virtualScrollModule',
            'selectionModule', 'detailRow', 'rowDragAndDropModule', 'freezeModule'];
        for (var i = 0; i < modules.length; i++) {
            if (this[modules[i]]) {
                this[modules[i]] = null;
            }
        }
        this.element.innerHTML = '';
        this.grid = null;
    };
    /**
     * Update the TreeGrid model
     * @method dataBind
     * @return {void}
     * @private
     */
    TreeGrid.prototype.dataBind = function () {
        _super.prototype.dataBind.call(this);
        if (!(isBlazor() && this.isServerRendered) || getValue('isRendered', this.grid) && !this.initialRender) {
            this.grid.dataBind();
        }
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @return {string}
     * @hidden
     */
    TreeGrid.prototype.getPersistData = function () {
        var keyEntity = ['pageSettings', 'sortSettings',
            'filterSettings', 'columns', 'searchSettings', 'selectedRowIndex'];
        var ignoreOnPersist = {
            pageSettings: ['template', 'pageSizes', 'pageSizeMode', 'enableQueryString', 'totalRecordsCount', 'pageCount'],
            filterSettings: ['type', 'mode', 'showFilterBarStatus', 'immediateModeDelay', 'ignoreAccent', 'hierarchyMode'],
            searchSettings: ['fields', 'operator', 'ignoreCase'],
            sortSettings: [], columns: [], selectedRowIndex: []
        };
        var ignoreOnColumn = ['filter', 'edit', 'filterBarTemplate', 'headerTemplate', 'template',
            'commandTemplate', 'commands', 'dataSource'];
        for (var i = 0; i < keyEntity.length; i++) {
            var currentObject = this[keyEntity[i]];
            for (var _i = 0, _a = ignoreOnPersist[keyEntity[i]]; _i < _a.length; _i++) {
                var val = _a[_i];
                delete currentObject[val];
            }
        }
        this.ignoreInArrays(ignoreOnColumn, this.columns);
        return this.addOnPersist(keyEntity);
    };
    TreeGrid.prototype.ignoreInArrays = function (ignoreOnColumn, columns) {
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].columns) {
                this.ignoreInColumn(ignoreOnColumn, columns[i]);
                this.ignoreInArrays(ignoreOnColumn, columns[i].columns);
            }
            else {
                this.ignoreInColumn(ignoreOnColumn, columns[i]);
            }
        }
    };
    TreeGrid.prototype.ignoreInColumn = function (ignoreOnColumn, column) {
        for (var i = 0; i < ignoreOnColumn.length; i++) {
            delete column[ignoreOnColumn[i]];
            column.filter = {};
        }
    };
    TreeGrid.prototype.mouseClickHandler = function (e) {
        if (!isNullOrUndefined(e.touches)) {
            return;
        }
        var target = e.target;
        if ((target.classList.contains('e-treegridexpand') ||
            target.classList.contains('e-treegridcollapse')) && (!this.isEditCollapse && !this.grid.isEdit)) {
            this.expandCollapseRequest(target);
        }
        this.isEditCollapse = false;
        this.notify('checkboxSelection', { target: target });
    };
    /**
     * Returns TreeGrid rows
     * @return {HTMLTableRowElement[]}
     */
    TreeGrid.prototype.getRows = function () {
        return this.grid.getRows();
    };
    /**
     * Gets the pager of the TreeGrid.
     * @return {Element}
     */
    TreeGrid.prototype.getPager = function () {
        return this.grid.getPager(); //get element from pager
    };
    /**
     * Adds a new record to the TreeGrid. Without passing parameters, it adds empty rows.
     * > `editSettings.allowEditing` should be true.
     * @param {Object} data - Defines the new add record data.
     * @param {number} index - Defines the row index to be added.
     * @param {RowPosition} position - Defines the new row position to be added.
     */
    TreeGrid.prototype.addRecord = function (data, index, position) {
        if (this.editModule) {
            this.editModule.addRecord(data, index, position);
        }
    };
    /**
     * Cancels edited state.
     */
    TreeGrid.prototype.closeEdit = function () {
        if (this.grid.editModule) {
            this.grid.editModule.closeEdit();
        }
    };
    /**
     * Saves the cell that is currently edited. It does not save the value to the DataSource.
     */
    TreeGrid.prototype.saveCell = function () {
        if (this.grid.editModule) {
            this.grid.editModule.saveCell();
        }
    };
    /**
     * To update the specified cell by given value without changing into edited state.
     * @param {number} rowIndex Defines the row index.
     * @param {string} field Defines the column field.
     * @param {string | number | boolean | Date} value - Defines the value to be changed.
     */
    TreeGrid.prototype.updateCell = function (rowIndex, field, value) {
        if (this.grid.editModule) {
            this.grid.editModule.updateCell(rowIndex, field, value);
        }
    };
    /**
     * To update the specified row by given values without changing into edited state.
     * @param {number} index Defines the row index.
     * @param {Object} data Defines the data object to be updated.
     */
    TreeGrid.prototype.updateRow = function (index, data) {
        if (this.grid.editModule) {
            var griddata = this.grid.getCurrentViewRecords()[index];
            extend(griddata, data);
            this.grid.editModule.updateRow(index, griddata);
        }
    };
    /**
     * Delete a record with Given options. If fieldName and data is not given then TreeGrid will delete the selected record.
     * > `editSettings.allowDeleting` should be true.
     * @param {string} fieldName - Defines the primary key field, 'Name of the column'.
     * @param {Object} data - Defines the JSON data of the record to be deleted.
     */
    TreeGrid.prototype.deleteRecord = function (fieldName, data) {
        if (this.grid.editModule) {
            this.grid.editModule.deleteRecord(fieldName, data);
        }
    };
    /**
     * To edit any particular row by TR element.
     * @param {HTMLTableRowElement} tr - Defines the table row to be edited.
     */
    TreeGrid.prototype.startEdit = function (row) {
        if (this.grid.editModule) {
            this.grid.editModule.startEdit(row);
        }
    };
    /**
     * To edit any particular cell using row index and cell index.
     * @param {number} rowIndex - Defines row index to edit a particular cell.
     * @param {string} field - Defines the field name of the column to perform cell edit.
     */
    TreeGrid.prototype.editCell = function (rowIndex, field) {
        if (this.editModule) {
            this.editModule.editCell(rowIndex, field);
        }
    };
    /**
     * Enables or disables ToolBar items.
     * @param {string[]} items - Defines the collection of itemID of ToolBar items.
     * @param {boolean} isEnable - Defines the items to be enabled or disabled.
     */
    TreeGrid.prototype.enableToolbarItems = function (items, isEnable) {
        if (this.grid.toolbarModule) {
            this.grid.toolbarModule.enableItems(items, isEnable);
        }
    };
    /**
     * If TreeGrid is in editable state, you can save a record by invoking endEdit.
     */
    TreeGrid.prototype.endEdit = function () {
        if (this.grid.editModule) {
            this.grid.editModule.endEdit();
        }
    };
    /**
     * Column chooser can be displayed on screen by given position(X and Y axis).
     * @param  {number} X - Defines the X axis.
     * @param  {number} Y - Defines the Y axis.
     * @return {void}
     */
    TreeGrid.prototype.openColumnChooser = function (x, y) {
        if (this.columnChooserModule) {
            this.columnChooserModule.openColumnChooser(x, y);
        }
    };
    /**
     * Delete any visible row by TR element.
     * @param {HTMLTableRowElement} tr - Defines the table row element.
     */
    TreeGrid.prototype.deleteRow = function (tr) {
        if (this.grid.editModule) {
            this.grid.editModule.deleteRow(tr);
        }
    };
    /**
     * Get the names of the primary key columns of the TreeGrid.
     * @return {string[]}
     */
    TreeGrid.prototype.getPrimaryKeyFieldNames = function () {
        return this.grid.getPrimaryKeyFieldNames();
    };
    /**
     * Updates particular cell value based on the given primary key value.
     * > Primary key column must be specified using `columns.isPrimaryKey` property.
     * @param {string| number} key - Specifies the PrimaryKey value of dataSource.
     * @param {string } field - Specifies the field name which you want to update.
     * @param {string | number | boolean | Date} value - To update new value for the particular cell.
     */
    TreeGrid.prototype.setCellValue = function (key, field, value) {
        this.grid.setCellValue(key, field, value);
    };
    /**
     * Updates and refresh the particular row values based on the given primary key value.
     * > Primary key column must be specified using `columns.isPrimaryKey` property.
     *  @param {string| number} key - Specifies the PrimaryKey value of dataSource.
     *  @param {Object} rowData - To update new data for the particular row.
     */
    TreeGrid.prototype.setRowData = function (key, rowData) {
        var currentRecords = this.getCurrentViewRecords();
        var primaryKey = this.grid.getPrimaryKeyFieldNames()[0];
        var level = 0;
        var record = {};
        currentRecords.some(function (value, i, e) {
            if (value[primaryKey] === key) {
                record = value;
                return true;
            }
            else {
                return false;
            }
        });
        level = record.level;
        rowData.level = level;
        rowData.index = record.index;
        rowData.childRecords = record.childRecords;
        rowData.taskData = record.taskData;
        rowData.uniqueID = record.uniqueID;
        rowData.parentItem = record.parentItem;
        rowData.checkboxState = record.checkboxState;
        rowData.hasChildRecords = record.hasChildRecords;
        rowData.parentUniqueID = record.parentUniqueID;
        rowData.expanded = record.expanded;
        this.grid.setRowData(key, rowData);
    };
    /**
     * Navigates to the specified target page.
     * @param  {number} pageNo - Defines the page number to navigate.
     * @return {void}
     */
    TreeGrid.prototype.goToPage = function (pageNo) {
        if (this.grid.pagerModule) {
            this.grid.pagerModule.goToPage(pageNo);
        }
    };
    /**
     * Defines the text of external message.
     * @param  {string} message - Defines the message to update.
     * @return {void}
     */
    TreeGrid.prototype.updateExternalMessage = function (message) {
        if (this.pagerModule) {
            this.grid.pagerModule.updateExternalMessage(message);
        }
    };
    /**
     * Gets a cell by row and column index.
     * @param  {number} rowIndex - Specifies the row index.
     * @param  {number} columnIndex - Specifies the column index.
     * @return {Element}
     */
    TreeGrid.prototype.getCellFromIndex = function (rowIndex, columnIndex) {
        return this.grid.getCellFromIndex(rowIndex, columnIndex);
    };
    /**
     * Gets a Column by column name.
     * @param  {string} field - Specifies the column name.
     * @return {Column}
     */
    TreeGrid.prototype.getColumnByField = function (field) {
        if (isBlazor() && this.isServerRendered) {
            return iterateArrayOrObject(this.grid.columns, function (item, index) {
                if (item.field === field) {
                    return item;
                }
                return undefined;
            })[0];
        }
        else {
            return iterateArrayOrObject(this.columnModel, function (item, index) {
                if (item.field === field) {
                    return item;
                }
                return undefined;
            })[0];
        }
    };
    /**
     * Gets a column by UID.
     * @param  {string} uid - Specifies the column UID.
     * @return {Column}
     */
    TreeGrid.prototype.getColumnByUid = function (uid) {
        if (isBlazor() && this.isServerRendered) {
            return iterateArrayOrObject(this.grid.columns, function (item, index) {
                if (item.uid === uid) {
                    return item;
                }
                return undefined;
            })[0];
        }
        else {
            return iterateArrayOrObject(this.columnModel, function (item, index) {
                if (item.uid === uid) {
                    return item;
                }
                return undefined;
            })[0];
        }
    };
    /**
     * Gets the collection of column fields.
     * @return {string[]}
     */
    TreeGrid.prototype.getColumnFieldNames = function () {
        return this.grid.getColumnFieldNames();
    };
    /**
     * Gets the footer div of the TreeGrid.
     * @return {Element}
     */
    TreeGrid.prototype.getFooterContent = function () {
        return this.grid.getFooterContent();
    };
    /**
     * Gets the footer table element of the TreeGrid.
     * @return {Element}
     */
    TreeGrid.prototype.getFooterContentTable = function () {
        return this.grid.getFooterContentTable();
    };
    /**
     * Shows a column by its column name.
     * @param  {string|string[]} keys - Defines a single or collection of column names.
     * @param  {string} showBy - Defines the column key either as field name or header text.
     * @return {void}
     */
    TreeGrid.prototype.showColumns = function (keys, showBy) {
        this.grid.showColumns(keys, showBy);
        this.updateColumnModel();
    };
    /**
     * Hides a column by column name.
     * @param  {string|string[]} keys - Defines a single or collection of column names.
     * @param  {string} hideBy - Defines the column key either as field name or header text.
     * @return {void}
     */
    TreeGrid.prototype.hideColumns = function (keys, hideBy) {
        this.grid.hideColumns(keys, hideBy);
        this.updateColumnModel();
    };
    /**
     * Gets a column header by column name.
     * @param  {string} field - Specifies the column name.
     * @return {Element}
     */
    TreeGrid.prototype.getColumnHeaderByField = function (field) {
        return this.grid.getColumnHeaderByField(field);
    };
    /**
     * Gets a column header by column index.
     * @param  {number} index - Specifies the column index.
     * @return {Element}
     */
    TreeGrid.prototype.getColumnHeaderByIndex = function (index) {
        return this.grid.getColumnHeaderByIndex(index);
    };
    /**
     * Gets a column header by UID.
     * @param  {string} field - Specifies the column uid.
     * @return {Element}
     */
    TreeGrid.prototype.getColumnHeaderByUid = function (uid) {
        return this.grid.getColumnHeaderByUid(uid);
    };
    /**
     * Gets a column index by column name.
     * @param  {string} field - Specifies the column name.
     * @return {number}
     */
    TreeGrid.prototype.getColumnIndexByField = function (field) {
        return this.grid.getColumnIndexByField(field);
    };
    /**
     * Gets a column index by UID.
     * @param  {string} uid - Specifies the column UID.
     * @return {number}
     */
    TreeGrid.prototype.getColumnIndexByUid = function (uid) {
        return this.grid.getColumnIndexByUid(uid);
    };
    /**
     * Gets the columns from the TreeGrid.
     * @return {Column[]}
     */
    TreeGrid.prototype.getColumns = function (isRefresh) {
        if (isBlazor() && this.isServerRendered) {
            return this.grid.columns;
        }
        else {
            this.updateColumnModel(this.grid.getColumns(isRefresh));
            return this.columnModel;
        }
    };
    TreeGrid.prototype.updateColumnModel = function (column) {
        this.columnModel = [];
        var stackedHeader = false;
        var gridColumns = isNullOrUndefined(column) ? this.grid.getColumns() : column;
        var gridColumn;
        for (var i = 0; i < gridColumns.length; i++) {
            gridColumn = {};
            for (var _i = 0, _a = Object.keys(gridColumns[i]); _i < _a.length; _i++) {
                var prop = _a[_i];
                if (!isBlazor() || prop !== 'edit') {
                    gridColumn[prop] = gridColumns[i][prop];
                }
            }
            this.columnModel.push(new Column(gridColumn));
        }
        if (!isBlazor() || !this.isServerRendered) {
            var merge = 'deepMerge';
            this[merge] = ['columns']; // Workaround for blazor updateModel
            if (this.grid.columns.length !== this.columnModel.length) {
                stackedHeader = true;
            }
            if (!stackedHeader) {
                this.setProperties({ columns: this.columnModel }, true);
            }
            this[merge] = undefined; // Workaround for blazor updateModel
        }
        return this.columnModel;
    };
    /**
     * Gets the content div of the TreeGrid.
     * @return {Element}
     */
    TreeGrid.prototype.getContent = function () {
        return this.grid.getContent();
    };
    TreeGrid.prototype.mergePersistTreeGridData = function () {
        var persist1 = 'mergePersistGridData';
        this.grid[persist1].apply(this);
    };
    TreeGrid.prototype.mergeColumns = function (storedColumn, columns) {
        var persist2 = 'mergeColumns';
        this.grid[persist2].apply(this, [storedColumn, columns]);
    };
    TreeGrid.prototype.updateTreeGridModel = function () {
        this.setProperties({ filterSettings: getObject('properties', this.grid.filterSettings) }, true);
        this.setProperties({ pageSettings: getObject('properties', this.grid.pageSettings) }, true);
        this.setProperties({ searchSettings: getObject('properties', this.grid.searchSettings) }, true);
        this.setProperties({ sortSettings: getObject('properties', this.grid.sortSettings) }, true);
    };
    /**
     * Gets the content table of the TreeGrid.
     * @return {Element}
     */
    TreeGrid.prototype.getContentTable = function () {
        return this.grid.getContentTable();
    };
    /**
     * Gets all the TreeGrid's data rows.
     * @return {Element[]}
     */
    TreeGrid.prototype.getDataRows = function () {
        var dRows = [];
        var rows = this.grid.getDataRows();
        for (var i = 0, len = rows.length; i < len; i++) {
            if (!rows[i].classList.contains('e-summaryrow')) {
                dRows.push(rows[i]);
            }
        }
        return dRows;
    };
    /**
     * Get current visible data of TreeGrid.
     * @return {Object[]}
     * @isGenericType true
     */
    TreeGrid.prototype.getCurrentViewRecords = function () {
        return this.grid.currentViewData;
    };
    /**
     * Gets the added, edited,and deleted data before bulk save to the DataSource in batch mode.
     * @return {Object}
     */
    TreeGrid.prototype.getBatchChanges = function () {
        return this.grid.editModule.getBatchChanges();
    };
    /**
     * Gets the header div of the TreeGrid.
     * @return {Element}
     */
    TreeGrid.prototype.getHeaderContent = function () {
        return this.grid.getHeaderContent();
    };
    /**
     * Gets the header table element of the TreeGrid.
     * @return {Element}
     */
    TreeGrid.prototype.getHeaderTable = function () {
        return this.grid.getHeaderTable();
    };
    /**
     * Gets a row by index.
     * @param  {number} index - Specifies the row index.
     * @return {Element}
     */
    TreeGrid.prototype.getRowByIndex = function (index) {
        return this.grid.getRowByIndex(index);
    };
    /**
     * Get a row information based on cell
     * @param {Element}
     * @return RowInfo
     */
    TreeGrid.prototype.getRowInfo = function (target) {
        return this.grid.getRowInfo(target);
    };
    /**
     * Gets UID by column name.
     * @param  {string} field - Specifies the column name.
     * @return {string}
     */
    TreeGrid.prototype.getUidByColumnField = function (field) {
        return this.grid.getUidByColumnField(field);
    };
    /**
     * Gets the visible columns from the TreeGrid.
     * @return {Column[]}
     */
    TreeGrid.prototype.getVisibleColumns = function () {
        var cols = [];
        for (var _i = 0, _a = this.columnModel; _i < _a.length; _i++) {
            var col = _a[_i];
            if (col.visible) {
                cols.push(col);
            }
        }
        return cols;
    };
    /**
     * By default, TreeGrid shows the spinner for all its actions. You can use this method to show spinner at your needed time.
     */
    TreeGrid.prototype.showSpinner = function () {
        showSpinner(this.element);
    };
    /**
     * Manually shown spinner needs to hide by `hideSpinnner`.
     */
    TreeGrid.prototype.hideSpinner = function () {
        hideSpinner(this.element);
    };
    /**
     * Refreshes the TreeGrid header and content.
     */
    TreeGrid.prototype.refresh = function () {
        this.grid.refresh();
    };
    /**
     * Get the records of checked rows.
     * @return {Object[]}
     * @isGenericType true
     */
    TreeGrid.prototype.getCheckedRecords = function () {
        return this.selectionModule.getCheckedrecords();
    };
    /**
     * Get the indexes of checked rows.
     * @return {number[]}
     */
    TreeGrid.prototype.getCheckedRowIndexes = function () {
        return this.selectionModule.getCheckedRowIndexes();
    };
    /**
     * Checked the checkboxes using rowIndexes.
     */
    TreeGrid.prototype.selectCheckboxes = function (indexes) {
        this.selectionModule.selectCheckboxes(indexes);
    };
    /**
     * Refreshes the TreeGrid column changes.
     */
    TreeGrid.prototype.refreshColumns = function (refreshUI) {
        if (isNullOrUndefined(refreshUI) || refreshUI) {
            this.grid.columns = this.getGridColumns(this.columns);
            this.grid.refreshColumns();
        }
        else {
            this.grid.setProperties({ columns: this.getGridColumns(this.columns) }, true);
        }
    };
    /**
     * Refreshes the TreeGrid header.
     */
    TreeGrid.prototype.refreshHeader = function () {
        this.grid.refreshHeader();
    };
    /**
     * Expands or collapse child records
     * @return {string}
     * @hidden
     */
    TreeGrid.prototype.expandCollapseRequest = function (target) {
        if (this.editSettings.mode === 'Batch') {
            var obj = 'dialogObj';
            var showDialog = 'showDialog';
            if (this.getBatchChanges()[this.changedRecords].length ||
                this.getBatchChanges()[this.deletedRecords].length || this.getBatchChanges()[this.addedRecords].length) {
                var dialogObj = this.grid.editModule[obj];
                this.grid.editModule[showDialog]('CancelEdit', dialogObj);
                this.targetElement = target;
                return;
            }
        }
        if (this.rowTemplate) {
            var rowInfo = target.closest('.e-treerowcell').parentElement;
            var record = this.getCurrentViewRecords()[rowInfo.rowIndex];
            if (target.classList.contains('e-treegridexpand')) {
                this.collapseRow(rowInfo, record);
            }
            else {
                this.expandRow(rowInfo, record);
            }
        }
        else {
            var rowInfo = this.grid.getRowInfo(target);
            var record = rowInfo.rowData;
            if (target.classList.contains('e-treegridexpand')) {
                this.collapseRow(rowInfo.row, record);
            }
            else {
                this.expandRow(rowInfo.row, record);
            }
        }
    };
    /**
     * Expands child rows
     * @return {void}
     */
    TreeGrid.prototype.expandRow = function (row, record) {
        var _this = this;
        record = this.getCollapseExpandRecords(row, record);
        if (!isNullOrUndefined(row) && row.cells[0].classList.contains('e-lastrowcell')) {
            this.lastRowBorder(row, false);
        }
        var args = { data: record, row: row, cancel: false };
        this.trigger(events.expanding, args, function (expandingArgs) {
            if (!expandingArgs.cancel) {
                _this.expandCollapse('expand', row, record);
                if (!(isRemoteData(_this) && !isOffline(_this)) && !isCountRequired(_this)) {
                    var collapseArgs = { data: record, row: row };
                    _this.trigger(events.expanded, collapseArgs);
                }
            }
        });
    };
    TreeGrid.prototype.getCollapseExpandRecords = function (row, record) {
        if (this.allowPaging && this.pageSettings.pageSizeMode === 'All' && this.isExpandAll && isNullOrUndefined(record) &&
            !isRemoteData(this)) {
            record = this.flatData.filter(function (e) {
                return e.hasChildRecords;
            });
        }
        else if (isNullOrUndefined(record)) {
            record = this.grid.getCurrentViewRecords()[row.rowIndex];
        }
        return record;
    };
    /**
     * Collapses child rows
     * @return {void}
     */
    TreeGrid.prototype.collapseRow = function (row, record) {
        var _this = this;
        record = this.getCollapseExpandRecords(row, record);
        var args = { data: record, row: row, cancel: false };
        this.trigger(events.collapsing, args, function (collapsingArgs) {
            if (!collapsingArgs.cancel) {
                _this.expandCollapse('collapse', row, record);
                var collapseArgs = { data: record, row: row };
                if (!isRemoteData(_this)) {
                    _this.trigger(events.collapsed, collapseArgs);
                }
            }
        });
    };
    /**
     * Expands the records at specific hierarchical level
     * @return {void}
     */
    TreeGrid.prototype.expandAtLevel = function (level) {
        if (((this.allowPaging && this.pageSettings.pageSizeMode === 'All') || this.enableVirtualization) && !isRemoteData(this)) {
            var rec = this.grid.dataSource.filter(function (e) {
                if (e.hasChildRecords && e.level === level) {
                    e.expanded = true;
                }
                return e.hasChildRecords && e.level === level;
            });
            this.expandRow(null, rec);
        }
        else {
            var rec = this.getRecordDetails(level);
            var row = getObject('rows', rec);
            var record = getObject('records', rec);
            for (var i = 0; i < record.length; i++) {
                this.expandRow(row[i], record[i]);
            }
        }
    };
    TreeGrid.prototype.getRecordDetails = function (level) {
        var rows = this.getRows().filter(function (e) {
            return (e.className.indexOf('level' + level) !== -1
                && (e.querySelector('.e-treegridcollapse') || e.querySelector('.e-treegridexpand')));
        });
        var records = this.getCurrentViewRecords().filter(function (e) { return e.level === level && e.hasChildRecords; });
        var obj = { records: records, rows: rows };
        return obj;
    };
    /**
     * Collapses the records at specific hierarchical level
     * @return {void}
     */
    TreeGrid.prototype.collapseAtLevel = function (level) {
        if (((this.allowPaging && this.pageSettings.pageSizeMode === 'All') || this.enableVirtualization) && !isRemoteData(this)) {
            var record = this.grid.dataSource.filter(function (e) {
                if (e.hasChildRecords && e.level === level) {
                    e.expanded = false;
                }
                return e.hasChildRecords && e.level === level;
            });
            this.collapseRow(null, record);
        }
        else {
            var rec = this.getRecordDetails(level);
            var rows = getObject('rows', rec);
            var records = getObject('records', rec);
            for (var i = 0; i < records.length; i++) {
                this.collapseRow(rows[i], records[i]);
            }
        }
    };
    /**
     * Expands All the rows
     * @return {void}
     */
    TreeGrid.prototype.expandAll = function () {
        this.expandCollapseAll('expand');
    };
    /**
     * Collapses All the rows
     * @return {void}
     */
    TreeGrid.prototype.collapseAll = function () {
        this.expandCollapseAll('collapse');
    };
    TreeGrid.prototype.expandCollapseAll = function (action) {
        var rows = this.getRows().filter(function (e) {
            return e.querySelector('.e-treegrid' + (action === 'expand' ? 'collapse' : 'expand'));
        });
        this.isExpandAll = true;
        this.isCollapseAll = true;
        if (((this.allowPaging && this.pageSettings.pageSizeMode === 'All') || this.enableVirtualization) && !isRemoteData(this)) {
            this.flatData.filter(function (e) {
                if (e.hasChildRecords) {
                    e.expanded = action === 'collapse' ? false : true;
                }
            });
            if (rows.length) {
                action === 'collapse' ? this.collapseRow(rows[0]) : this.expandRow(rows[0]);
            }
            else {
                var isExpandCollapseall = this.enableCollapseAll;
                this.setProperties({ enableCollapseAll: true }, true);
                this.grid.pagerModule.goToPage(1);
                this.setProperties({ enableCollapseAll: isExpandCollapseall }, true);
            }
        }
        else {
            for (var i = 0; i < rows.length; i++) {
                action === 'collapse' ? this.collapseRow(rows[i]) : this.expandRow(rows[i]);
            }
        }
        this.isExpandAll = false;
        this.isCollapseAll = false;
    };
    TreeGrid.prototype.expandCollapse = function (action, row, record, isChild) {
        var expandingArgs = { row: row, data: record, childData: [], requestType: action };
        if (!isRemoteData(this) && action === 'expand' && this.isSelfReference && isCountRequired(this)) {
            this.updateChildOnDemand(expandingArgs);
        }
        var gridRows = this.getRows();
        if (this.rowTemplate) {
            var rows = this.getContentTable().rows;
            gridRows = [].slice.call(rows);
        }
        var rowIndex;
        if (isNullOrUndefined(row)) {
            rowIndex = this.getCurrentViewRecords().indexOf(record);
            row = gridRows[rowIndex];
        }
        else {
            rowIndex = +row.getAttribute('aria-rowindex');
        }
        if (!isNullOrUndefined(row)) {
            row.setAttribute('aria-expanded', action === 'expand' ? 'true' : 'false');
        }
        if (((this.allowPaging && this.pageSettings.pageSizeMode === 'All') || this.enableVirtualization) && !isRemoteData(this)
            && !isCountRequired(this)) {
            this.notify(events.localPagedExpandCollapse, { action: action, row: row, record: record });
        }
        else {
            var displayAction = void 0;
            if (action === 'expand') {
                displayAction = 'table-row';
                if (!isChild) {
                    record.expanded = true;
                    this.uniqueIDCollection[record.uniqueID].expanded = record.expanded;
                }
                var targetEle = row.getElementsByClassName('e-treegridcollapse')[0];
                if (isChild && !isNullOrUndefined(record[this.expandStateMapping]) &&
                    record[this.expandStateMapping] && isNullOrUndefined(targetEle)) {
                    targetEle = row.getElementsByClassName('e-treegridexpand')[0];
                }
                if (isNullOrUndefined(targetEle)) {
                    return;
                }
                if (!targetEle.classList.contains('e-treegridexpand')) {
                    addClass([targetEle], 'e-treegridexpand');
                }
                removeClass([targetEle], 'e-treegridcollapse');
            }
            else {
                displayAction = 'none';
                if (!isChild) {
                    record.expanded = false;
                    this.uniqueIDCollection[record.uniqueID].expanded = record.expanded;
                }
                var targetEle = row.getElementsByClassName('e-treegridexpand')[0];
                if (isChild && !isNullOrUndefined(record[this.expandStateMapping]) &&
                    !record[this.expandStateMapping] && isNullOrUndefined(targetEle)) {
                    targetEle = row.getElementsByClassName('e-treegridcollapse')[0];
                }
                if (isNullOrUndefined(targetEle)) {
                    return;
                }
                if (!targetEle.classList.contains('e-treegridcollapse')) {
                    addClass([targetEle], 'e-treegridcollapse');
                }
                removeClass([targetEle], 'e-treegridexpand');
            }
            var detailrows = gridRows.filter(function (r) {
                return r.classList.contains('e-griddetailrowindex' + record.index + 'level' + (record.level + 1));
            });
            if (isRemoteData(this) && !isOffline(this)) {
                this.remoteExpand(action, row, record, isChild);
            }
            else {
                if (!isCountRequired(this) || action === 'collapse') {
                    this.localExpand(action, row, record, isChild);
                }
            }
            if (this.isPixelHeight() && !row.cells[0].classList.contains('e-lastrowcell')) {
                var totalRows = this.getRows();
                for (var i = totalRows.length - 1; i > 0; i--) {
                    if (!isHidden(totalRows[i])) {
                        var table = this.getContentTable();
                        var sHeight = table.scrollHeight;
                        var clientHeight = this.getContent().clientHeight;
                        this.lastRowBorder(totalRows[i], sHeight <= clientHeight);
                        break;
                    }
                }
            }
            this.notify('rowExpandCollapse', { detailrows: detailrows, action: displayAction, record: record, row: row });
            this.updateAltRow(gridRows);
        }
    };
    TreeGrid.prototype.updateChildOnDemand = function (expandingArgs) {
        var _this = this;
        var deff = new Deferred();
        var childDataBind = 'childDataBind';
        expandingArgs[childDataBind] = deff.resolve;
        var record = expandingArgs.data;
        this.trigger(events.dataStateChange, expandingArgs);
        deff.promise.then(function (e) {
            if (expandingArgs.childData.length) {
                var currentData = (_this.flatData);
                var index = 0;
                for (var i = 0; i < currentData.length; i++) {
                    if (currentData[i].taskData === record.taskData) {
                        index = i;
                        break;
                    }
                }
                var data_1 = getValue('result', _this.dataSource);
                var childData = extendArray(expandingArgs.childData);
                var length_1 = record[_this.childMapping] ?
                    record[_this.childMapping].length > childData.length ? record[_this.childMapping].length : childData.length : childData.length;
                for (var i = 0; i < length_1; i++) {
                    if (record[_this.childMapping]) {
                        data_1.filter(function (e, i) {
                            if (e[_this.parentIdMapping] === record[_this.idMapping]) {
                                data_1.splice(i, 1);
                            }
                        });
                    }
                    if (childData[i]) {
                        childData[i].level = record.level + 1;
                        childData[i].index = Math.ceil(Math.random() * 1000);
                        childData[i].parentItem = extend({}, record);
                        childData[i].taskData = extend({}, childData[i]);
                        delete childData[i].parentItem.childRecords;
                        delete childData[i].taskData.parentItem;
                        childData[i].parentUniqueID = record.uniqueID;
                        childData[i].uniqueID = getUid(_this.element.id + '_data_');
                        setValue('uniqueIDCollection.' + childData[i].uniqueID, childData[i], _this);
                        if (!isNullOrUndefined(childData[i][_this.childMapping]) ||
                            (childData[i][_this.hasChildMapping] && isCountRequired(_this))) {
                            childData[i].hasChildRecords = true;
                        }
                        currentData.splice(index + 1 + i, record[_this.childMapping] && record[_this.childMapping][i] ? 1 : 0, childData[i]);
                    }
                    else {
                        currentData.splice(index + 1 + i, 1);
                    }
                }
                currentData[index][_this.childMapping] = childData;
                currentData[index].childRecords = childData;
                currentData[index].expanded = true;
                setValue('uniqueIDCollection.' + currentData[index].uniqueID, currentData[index], _this);
                for (var j = 0; j < expandingArgs.childData.length; j++) {
                    data_1.push(expandingArgs.childData[j]);
                }
            }
            _this.isExpandRefresh = true;
            _this.refresh();
            _this.trigger(events.expanded, expandingArgs);
        });
    };
    TreeGrid.prototype.remoteExpand = function (action, row, record, isChild) {
        var gridRows = this.getRows();
        if (this.rowTemplate) {
            var rows_1 = this.getContentTable().rows;
            gridRows = [].slice.call(rows_1);
        }
        var args = { data: record, row: row };
        var rows = [];
        rows = gridRows.filter(function (r) {
            return r.querySelector('.e-gridrowindex' + record.index + 'level' + (record.level + 1));
        });
        if (action === 'expand') {
            this.notify(events.remoteExpand, { record: record, rows: rows, parentRow: row });
            var args_1 = { row: row, data: record };
            if (rows.length > 0) {
                this.trigger(events.expanded, args_1);
            }
        }
        else {
            this.collapseRemoteChild({ record: record, rows: rows });
            this.trigger(events.collapsed, args);
        }
    };
    TreeGrid.prototype.localExpand = function (action, row, record, isChild) {
        var childRecords = this.getCurrentViewRecords().filter(function (e) {
            return e.parentUniqueID === record.uniqueID;
        });
        if (this.isPixelHeight() && row.cells[0].classList.contains('e-lastrowcell')) {
            this.lastRowBorder(row, false);
        }
        var movableRows;
        var gridRows = this.getRows();
        if (this.rowTemplate) {
            var rows_2 = this.getContentTable().rows;
            gridRows = [].slice.call(rows_2);
        }
        var displayAction = (action === 'expand') ? 'table-row' : 'none';
        var index = childRecords[0].parentItem.index;
        var rows = gridRows.filter(function (r) {
            return r.querySelector('.e-gridrowindex' + record.index + 'level' + (record.level + 1));
        });
        if (this.frozenRows || this.frozenColumns || this.getFrozenColumns()) {
            movableRows = this.getMovableRows().filter(function (r) {
                return r.querySelector('.e-gridrowindex' + record.index + 'level' + (record.level + 1));
            });
        }
        for (var i = 0; i < rows.length; i++) {
            rows[i].style.display = displayAction;
            if (!isNullOrUndefined(movableRows)) {
                movableRows[i].style.display = displayAction;
            }
            this.notify('childRowExpand', { row: rows[i] });
            if (!isNullOrUndefined(childRecords[i].childRecords) && (action !== 'expand' ||
                isNullOrUndefined(childRecords[i].expanded) || childRecords[i].expanded)) {
                this.expandCollapse(action, rows[i], childRecords[i], true);
                if (this.frozenColumns <= this.treeColumnIndex && !isNullOrUndefined(movableRows)) {
                    this.expandCollapse(action, movableRows[i], childRecords[i], true);
                }
            }
        }
    };
    TreeGrid.prototype.updateAltRow = function (rows) {
        if (this.enableAltRow && !this.rowTemplate) {
            var visibleRowCount = 0;
            for (var i = 0; rows && i < rows.length; i++) {
                var gridRow = rows[i];
                if (gridRow.style.display !== 'none') {
                    if (gridRow.classList.contains('e-altrow')) {
                        removeClass([gridRow], 'e-altrow');
                    }
                    if (visibleRowCount % 2 !== 0 && !gridRow.classList.contains('e-summaryrow') && !gridRow.classList.contains('e-detailrow')) {
                        addClass([gridRow], 'e-altrow');
                    }
                    if (!gridRow.classList.contains('e-summaryrow') && !gridRow.classList.contains('e-detailrow')) {
                        visibleRowCount++;
                    }
                }
            }
        }
    };
    TreeGrid.prototype.treeColumnRowTemplate = function (args) {
        if (this.rowTemplate) {
            var rows = this.getContentTable().rows;
            rows = [].slice.call(rows);
            for (var i = 0; i < rows.length; i++) {
                var rcell = this.grid.getContentTable().rows[i].cells[this.treeColumnIndex];
                var row = rows[i];
                var rowData = this.grid.getRowsObject()[i].data;
                var arg = { data: rowData, row: row, cell: rcell, column: this.getColumns()[this.treeColumnIndex] };
                this.renderModule.cellRender(arg);
            }
        }
    };
    TreeGrid.prototype.collapseRemoteChild = function (rowDetails, isChild) {
        if (!isChild) {
            rowDetails.record.expanded = false;
        }
        var rows = rowDetails.rows;
        var childRecord;
        for (var i = 0; i < rows.length; i++) {
            if (isBlazor() && this.isServerRendered) {
                removeClass([rows[i]], 'e-treerowexpanded');
                addClass([rows[i]], 'e-treerowcollapsed');
            }
            else {
                rows[i].style.display = 'none';
            }
            var collapsingTd = rows[i].querySelector('.e-detailrowexpand');
            if (!isNullOrUndefined(collapsingTd)) {
                this.grid.detailRowModule.collapse(collapsingTd);
            }
            if (rows[i].querySelector('.e-treecolumn-container .e-treegridexpand')) {
                var expandElement = rows[i].querySelector('.e-treecolumn-container .e-treegridexpand');
                childRecord = this.rowTemplate ? this.grid.getCurrentViewRecords()[rows[i].rowIndex] :
                    this.grid.getRowObjectFromUID(rows[i].getAttribute('data-Uid')).data;
                if (!isNullOrUndefined(expandElement) && childRecord.expanded) {
                    removeClass([expandElement], 'e-treegridexpand');
                    addClass([expandElement], 'e-treegridcollapse');
                }
                var cRow = [];
                var eRows = this.getRows();
                for (var i_1 = 0; i_1 < eRows.length; i_1++) {
                    if (eRows[i_1].querySelector('.e-gridrowindex' + childRecord.index + 'level' + (childRecord.level + 1))) {
                        cRow.push(eRows[i_1]);
                    }
                }
                if (cRow.length && childRecord.expanded) {
                    this.collapseRemoteChild({ record: childRecord, rows: cRow }, true);
                }
            }
        }
    };
    /**
     * @hidden
     */
    TreeGrid.prototype.addListener = function () {
        this.on('updateResults', this.updateResultModel, this);
        this.grid.on('initial-end', this.afterGridRender, this);
    };
    TreeGrid.prototype.updateResultModel = function (returnResult) {
        this.dataResults = returnResult;
    };
    /**
     * @hidden
     */
    TreeGrid.prototype.removeListener = function () {
        if (this.isDestroyed) {
            return;
        }
        this.off('updateResults', this.updateResultModel);
        this.grid.off('initial-end', this.afterGridRender);
    };
    /**
     * Filters TreeGrid row by column name with the given options.
     * @param  {string} fieldName - Defines the field name of the column.
     * @param  {string} filterOperator - Defines the operator to filter records.
     * @param  {string | number | Date | boolean} filterValue - Defines the value used to filter records.
     * @param  {string} predicate - Defines the relationship between one filter query and another by using AND or OR predicate.
     * @param  {boolean} matchCase - If match case is set to true, TreeGrid filters the records with exact match. if false, it filters case
     * insensitive records (uppercase and lowercase letters treated the same).
     * @param  {boolean} ignoreAccent - If ignoreAccent set to true,
     * then filter ignores the diacritic characters or accents while filtering.
     * @param  {string} actualFilterValue - Defines the actual filter value for the filter column.
     * @param  {string} actualOperator - Defines the actual filter operator for the filter column.
     * @return {void}
     */
    TreeGrid.prototype.filterByColumn = function (fieldName, filterOperator, filterValue, predicate, matchCase, ignoreAccent, actualFilterValue, actualOperator) {
        this.grid.filterByColumn(fieldName, filterOperator, filterValue, predicate, matchCase, ignoreAccent, actualFilterValue, actualOperator);
    };
    /**
     * Clears all the filtered rows of the TreeGrid.
     * @return {void}
     */
    TreeGrid.prototype.clearFiltering = function () {
        this.grid.clearFiltering();
    };
    /**
     * Removes filtered column by field name.
     * @param  {string} field - Defines column field name to remove filter.
     * @param  {boolean} isClearFilterBar -  Specifies whether the filter bar value needs to be cleared.
     * @return {void}
     * @hidden
     */
    TreeGrid.prototype.removeFilteredColsByField = function (field, isClearFilterBar) {
        this.grid.removeFilteredColsByField(field, isClearFilterBar);
    };
    /**
     * Selects a row by given index.
     * @param  {number} index - Defines the row index.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    TreeGrid.prototype.selectRow = function (index, isToggle) {
        this.grid.selectRow(index, isToggle);
    };
    /**
     * Selects a collection of rows by indexes.
     * @param  {number[]} rowIndexes - Specifies the row indexes.
     * @return {void}
     */
    TreeGrid.prototype.selectRows = function (rowIndexes) {
        this.grid.selectRows(rowIndexes);
    };
    /**
     * Deselects the current selected rows and cells.
     * @return {void}
     */
    TreeGrid.prototype.clearSelection = function () {
        this.grid.clearSelection();
    };
    /**
     * Copy the selected rows or cells data into clipboard.
     * @param {boolean} withHeader - Specifies whether the column header text needs to be copied along with rows or cells.
     */
    TreeGrid.prototype.copy = function (withHeader) {
        this.clipboardModule.copy(withHeader);
    };
    /**
     * Paste data from clipboard to selected cells.
     * @param {boolean} data - Specifies the date for paste.
     * @param {boolean} rowIndex - Specifies the row index.
     * @param {boolean} colIndex - Specifies the column index.
     */
    TreeGrid.prototype.paste = function (data, rowIndex, colIndex) {
        this.clipboardModule.paste(data, rowIndex, colIndex);
    };
    /**
     * Selects a cell by the given index.
     * @param  {IIndex} cellIndex - Defines the row and column indexes.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    TreeGrid.prototype.selectCell = function (cellIndex, isToggle) {
        this.grid.selectCell(cellIndex, isToggle);
    };
    /**
     * Gets the collection of selected rows.
     * @return {Element[]}
     */
    TreeGrid.prototype.getSelectedRows = function () {
        return this.grid.getSelectedRows();
    };
    /**
     * Gets a movable table cell by row and column index.
     * @param  {number} rowIndex - Specifies the row index.
     * @param  {number} columnIndex - Specifies the column index.
     * @return {Element}
     */
    TreeGrid.prototype.getMovableCellFromIndex = function (rowIndex, columnIndex) {
        return this.grid.getMovableCellFromIndex(rowIndex, columnIndex);
    };
    /**
     * Gets all the TreeGrid's movable table data rows.
     * @return {Element[]}
     */
    TreeGrid.prototype.getMovableDataRows = function () {
        return this.grid.getMovableDataRows();
    };
    /**
     * Gets a movable tables row by index.
     * @param  {number} index - Specifies the row index.
     * @return {Element}
     */
    TreeGrid.prototype.getMovableRowByIndex = function (index) {
        return this.grid.getMovableRowByIndex(index);
    };
    /**
     * Gets the TreeGrid's movable content rows from frozen treegrid.
     * @return {Element[]}
     */
    TreeGrid.prototype.getMovableRows = function () {
        return this.grid.getMovableRows();
    };
    /**
     * @hidden
     */
    TreeGrid.prototype.getFrozenColumns = function () {
        return this.getFrozenCount(this.columns, 0);
    };
    TreeGrid.prototype.getFrozenCount = function (cols, cnt) {
        for (var i = 0, len = cols.length; i < len; i++) {
            if (cols[i].columns) {
                cnt = this.getFrozenCount(cols[i].columns, cnt);
            }
            else {
                if (cols[i].isFrozen) {
                    cnt++;
                }
            }
        }
        return cnt;
    };
    /**
     * Gets the collection of selected row indexes.
     * @return {number[]}
     */
    TreeGrid.prototype.getSelectedRowIndexes = function () {
        return this.grid.getSelectedRowIndexes();
    };
    /**
     * Gets the collection of selected row and cell indexes.
     * @return {number[]}
     */
    TreeGrid.prototype.getSelectedRowCellIndexes = function () {
        return this.grid.getSelectedRowCellIndexes();
    };
    /**
     * Gets the collection of selected records.
     * @isGenericType true
     * @return {Object[]}
     */
    TreeGrid.prototype.getSelectedRecords = function () {
        return this.grid.getSelectedRecords();
    };
    /**
     * Gets the data module.
     * @return {Data}
     */
    TreeGrid.prototype.getDataModule = function () {
        return { baseModule: this.grid.getDataModule(), treeModule: this.dataModule };
    };
    /**
     * Reorder the rows based on given indexes and position
     */
    TreeGrid.prototype.reorderRows = function (fromIndexes, toIndex, position) {
        this.rowDragAndDropModule.reorderRows(fromIndexes, toIndex, position);
    };
    var TreeGrid_1;
    __decorate([
        Property(0)
    ], TreeGrid.prototype, "frozenRows", void 0);
    __decorate([
        Property(0)
    ], TreeGrid.prototype, "frozenColumns", void 0);
    __decorate([
        Property('Ellipsis')
    ], TreeGrid.prototype, "clipMode", void 0);
    __decorate([
        Property([])
    ], TreeGrid.prototype, "columns", void 0);
    __decorate([
        Property(null)
    ], TreeGrid.prototype, "childMapping", void 0);
    __decorate([
        Property(null)
    ], TreeGrid.prototype, "hasChildMapping", void 0);
    __decorate([
        Property(0)
    ], TreeGrid.prototype, "treeColumnIndex", void 0);
    __decorate([
        Property(null)
    ], TreeGrid.prototype, "idMapping", void 0);
    __decorate([
        Property(null)
    ], TreeGrid.prototype, "parentIdMapping", void 0);
    __decorate([
        Property(false)
    ], TreeGrid.prototype, "enableCollapseAll", void 0);
    __decorate([
        Property(null)
    ], TreeGrid.prototype, "expandStateMapping", void 0);
    __decorate([
        Property(false)
    ], TreeGrid.prototype, "allowRowDragAndDrop", void 0);
    __decorate([
        Property([])
    ], TreeGrid.prototype, "dataSource", void 0);
    __decorate([
        Property()
    ], TreeGrid.prototype, "query", void 0);
    __decorate([
        Property()
    ], TreeGrid.prototype, "cloneQuery", void 0);
    __decorate([
        Property('AllPages')
    ], TreeGrid.prototype, "printMode", void 0);
    __decorate([
        Property(false)
    ], TreeGrid.prototype, "allowPaging", void 0);
    __decorate([
        Property(false)
    ], TreeGrid.prototype, "loadChildOnDemand", void 0);
    __decorate([
        Property(false)
    ], TreeGrid.prototype, "allowTextWrap", void 0);
    __decorate([
        Complex({}, TextWrapSettings)
    ], TreeGrid.prototype, "textWrapSettings", void 0);
    __decorate([
        Property(false)
    ], TreeGrid.prototype, "allowReordering", void 0);
    __decorate([
        Property(false)
    ], TreeGrid.prototype, "allowResizing", void 0);
    __decorate([
        Property(false)
    ], TreeGrid.prototype, "autoCheckHierarchy", void 0);
    __decorate([
        Complex({}, PageSettings)
    ], TreeGrid.prototype, "pageSettings", void 0);
    __decorate([
        Complex({}, RowDropSettings)
    ], TreeGrid.prototype, "rowDropSettings", void 0);
    __decorate([
        Property()
    ], TreeGrid.prototype, "pagerTemplate", void 0);
    __decorate([
        Property(false)
    ], TreeGrid.prototype, "showColumnMenu", void 0);
    __decorate([
        Property(false)
    ], TreeGrid.prototype, "showColumnChooser", void 0);
    __decorate([
        Property(false)
    ], TreeGrid.prototype, "allowSorting", void 0);
    __decorate([
        Property(true)
    ], TreeGrid.prototype, "allowMultiSorting", void 0);
    __decorate([
        Complex({}, SortSettings)
    ], TreeGrid.prototype, "sortSettings", void 0);
    __decorate([
        Collection([], AggregateRow)
    ], TreeGrid.prototype, "aggregates", void 0);
    __decorate([
        Complex({}, EditSettings)
    ], TreeGrid.prototype, "editSettings", void 0);
    __decorate([
        Property(false)
    ], TreeGrid.prototype, "allowFiltering", void 0);
    __decorate([
        Property()
    ], TreeGrid.prototype, "detailTemplate", void 0);
    __decorate([
        Complex({}, FilterSettings)
    ], TreeGrid.prototype, "filterSettings", void 0);
    __decorate([
        Complex({}, SearchSettings)
    ], TreeGrid.prototype, "searchSettings", void 0);
    __decorate([
        Property()
    ], TreeGrid.prototype, "toolbar", void 0);
    __decorate([
        Property()
    ], TreeGrid.prototype, "toolbarTemplate", void 0);
    __decorate([
        Property('Default')
    ], TreeGrid.prototype, "gridLines", void 0);
    __decorate([
        Property()
    ], TreeGrid.prototype, "contextMenuItems", void 0);
    __decorate([
        Property()
    ], TreeGrid.prototype, "columnMenuItems", void 0);
    __decorate([
        Property()
    ], TreeGrid.prototype, "rowTemplate", void 0);
    __decorate([
        Property('Parent')
    ], TreeGrid.prototype, "copyHierarchyMode", void 0);
    __decorate([
        Property(null)
    ], TreeGrid.prototype, "rowHeight", void 0);
    __decorate([
        Property(true)
    ], TreeGrid.prototype, "enableAltRow", void 0);
    __decorate([
        Property(true)
    ], TreeGrid.prototype, "allowKeyboard", void 0);
    __decorate([
        Property(false)
    ], TreeGrid.prototype, "enableHover", void 0);
    __decorate([
        Property(false)
    ], TreeGrid.prototype, "enableAutoFill", void 0);
    __decorate([
        Property('auto')
    ], TreeGrid.prototype, "height", void 0);
    __decorate([
        Property('auto')
    ], TreeGrid.prototype, "width", void 0);
    __decorate([
        Property(false)
    ], TreeGrid.prototype, "enableVirtualization", void 0);
    __decorate([
        Property('All')
    ], TreeGrid.prototype, "columnQueryMode", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "created", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "load", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "expanding", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "expanded", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "collapsing", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "collapsed", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "cellSave", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "cellSaved", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "actionBegin", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "actionComplete", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "beginEdit", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "batchAdd", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "batchDelete", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "batchCancel", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "beforeBatchAdd", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "beforeBatchDelete", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "beforeBatchSave", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "cellEdit", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "actionFailure", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "dataBound", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "dataSourceChanged", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "dataStateChange", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "recordDoubleClick", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "rowDataBound", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "detailDataBound", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "queryCellInfo", void 0);
    __decorate([
        Property(true)
    ], TreeGrid.prototype, "allowSelection", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "rowSelecting", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "rowSelected", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "rowDeselecting", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "rowDeselected", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "headerCellInfo", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "cellSelecting", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "columnMenuOpen", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "columnMenuClick", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "cellSelected", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "cellDeselecting", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "cellDeselected", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "resizeStart", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "resizing", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "resizeStop", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "columnDragStart", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "columnDrag", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "columnDrop", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "checkboxChange", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "printComplete", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "beforePrint", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "toolbarClick", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "beforeDataBound", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "contextMenuOpen", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "contextMenuClick", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "beforeCopy", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "beforePaste", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "rowDrag", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "rowDragStart", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "rowDragStartHelper", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "rowDrop", void 0);
    __decorate([
        Property(-1)
    ], TreeGrid.prototype, "selectedRowIndex", void 0);
    __decorate([
        Complex({}, SelectionSettings)
    ], TreeGrid.prototype, "selectionSettings", void 0);
    __decorate([
        Property(false)
    ], TreeGrid.prototype, "allowExcelExport", void 0);
    __decorate([
        Property(false)
    ], TreeGrid.prototype, "allowPdfExport", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "pdfQueryCellInfo", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "pdfHeaderQueryCellInfo", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "excelQueryCellInfo", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "excelHeaderQueryCellInfo", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "beforeExcelExport", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "excelExportComplete", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "beforePdfExport", void 0);
    __decorate([
        Event()
    ], TreeGrid.prototype, "pdfExportComplete", void 0);
    TreeGrid = TreeGrid_1 = __decorate([
        NotifyPropertyChanges
    ], TreeGrid);
    return TreeGrid;
}(Component));
export { TreeGrid };
