import { TreeGrid } from '@syncfusion/ej2-treegrid';
import { createElement, isNullOrUndefined, getValue, extend, EventHandler, deleteObject } from '@syncfusion/ej2-base';
import { setValue, isBlazor, getElement } from '@syncfusion/ej2-base';
import { Deferred, Query } from '@syncfusion/ej2-data';
import { Column as GanttColumn } from '../models/column';
/**
 * TreeGrid related code goes here
 */
var GanttTreeGrid = /** @class */ (function () {
    function GanttTreeGrid(parent) {
        var _this = this;
        this.previousScroll = { top: 0, left: 0 };
        this.queryCellInfo = function (args) {
            _this.parent.trigger('queryCellInfo', args);
        };
        this.headerCellInfo = function (args) {
            _this.parent.trigger('headerCellInfo', args);
        };
        this.rowDataBound = function (args) {
            _this.parent.trigger('rowDataBound', args);
        };
        this.columnMenuOpen = function (args) {
            _this.parent.notify('columnMenuOpen', args);
            _this.parent.trigger('columnMenuOpen', args);
        };
        this.columnMenuClick = function (args) {
            _this.parent.trigger('columnMenuClick', args);
        };
        this.parent = parent;
        this.parent.treeGrid = new TreeGrid();
        this.parent.treeGrid.allowSelection = false;
        this.parent.treeGrid.allowKeyboard = this.parent.allowKeyboard;
        this.treeGridColumns = [];
        this.validateGanttColumns();
        this.addEventListener();
    }
    GanttTreeGrid.prototype.addEventListener = function () {
        this.parent.on('renderPanels', this.createContainer, this);
        this.parent.on('chartScroll', this.updateScrollTop, this);
        this.parent.on('destroy', this.destroy, this);
    };
    GanttTreeGrid.prototype.createContainer = function () {
        //let height: number = this.parent.ganttHeight - this.parent.toolbarModule.element.offsetHeight - 46;
        this.treeGridElement = createElement('div', {
            id: 'treeGrid' + this.parent.element.id, className: 'e-gantt-tree-grid',
        });
        var tempHeader = createElement('div', { className: 'e-gantt-temp-header' });
        this.parent.treeGridPane.appendChild(this.treeGridElement);
        this.treeGridElement.appendChild(tempHeader);
        this.parent.treeGridPane.classList.add('e-temp-content');
    };
    /**
     * Method to initiate TreeGrid
     */
    GanttTreeGrid.prototype.renderTreeGrid = function () {
        this.composeProperties();
        this.bindEvents();
        this.parent.treeGrid.appendTo(this.treeGridElement);
        this.wireEvents();
    };
    GanttTreeGrid.prototype.composeProperties = function () {
        this.parent.treeGrid.showColumnMenu = this.parent.showColumnMenu;
        this.parent.treeGrid.columnMenuItems = this.parent.columnMenuItems;
        this.parent.treeGrid.childMapping = this.parent.taskFields.child;
        this.parent.treeGrid.treeColumnIndex = this.parent.treeColumnIndex;
        this.parent.treeGrid.columns = this.treeGridColumns;
        this.parent.treeGrid.dataSource = this.parent.flatData;
        this.parent.treeGrid.expandStateMapping = this.parent.taskFields.expandState;
        var isGantt = 'isGantt';
        this.parent.treeGrid[isGantt] = true;
        this.parent.treeGrid.rowHeight = this.parent.rowHeight;
        this.parent.treeGrid.gridLines = this.parent.gridLines;
        if (!isBlazor()) {
            this.parent.treeGrid.searchSettings = this.parent.searchSettings;
        }
        else if (this.parent.searchSettings.fields.length !== 0 || this.parent.searchSettings.key !== '') {
            this.parent.treeGrid.searchSettings = this.parent.searchSettings;
        }
        var isJsComponent = 'isJsComponent';
        this.parent.treeGrid[isJsComponent] = true;
        var toolbarHeight = 0;
        if (!isNullOrUndefined(this.parent.toolbarModule) && !isNullOrUndefined(this.parent.toolbarModule.element)) {
            toolbarHeight = this.parent.toolbarModule.element.offsetHeight;
        }
        this.parent.treeGrid.height = this.parent.ganttHeight - toolbarHeight - 46;
    };
    GanttTreeGrid.prototype.getContentDiv = function () {
        return this.treeGridElement.querySelector('.e-content');
    };
    GanttTreeGrid.prototype.getHeaderDiv = function () {
        return this.treeGridElement.querySelector('.e-headercontent');
    };
    GanttTreeGrid.prototype.getScrollbarWidth = function () {
        var outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.overflow = 'scroll';
        outer.style.msOverflowStyle = 'scrollbar';
        var inner = document.createElement('div');
        outer.appendChild(inner);
        this.parent.element.appendChild(outer);
        var scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
        outer.parentNode.removeChild(outer);
        return scrollbarWidth;
    };
    GanttTreeGrid.prototype.ensureScrollBar = function () {
        var content = this.getContentDiv();
        var headerDiv = this.getHeaderDiv();
        var scrollWidth = this.getScrollbarWidth();
        var isMobile = /Android|Mac|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (scrollWidth !== 0) {
            content.style.cssText += 'width: calc(100% + ' + scrollWidth + 'px);';
        }
        else {
            content.classList.add('e-gantt-scroll-padding');
        }
        if (scrollWidth === 0 && isMobile) {
            headerDiv.style.cssText += 'width: calc(100% + 17px);';
        }
    };
    GanttTreeGrid.prototype.bindEvents = function () {
        this.parent.treeGrid.dataBound = this.dataBound.bind(this);
        this.parent.treeGrid.collapsing = this.collapsing.bind(this);
        this.parent.treeGrid.collapsed = this.collapsed.bind(this);
        this.parent.treeGrid.expanding = this.expanding.bind(this);
        this.parent.treeGrid.expanded = this.expanded.bind(this);
        this.parent.treeGrid.actionBegin = this.actionBegin.bind(this);
        this.parent.treeGrid.actionComplete = this.treeActionComplete.bind(this);
        this.parent.treeGrid.created = this.created.bind(this);
        this.parent.treeGrid.actionFailure = this.actionFailure.bind(this);
        this.parent.treeGrid.queryCellInfo = this.queryCellInfo.bind(this);
        this.parent.treeGrid.headerCellInfo = this.headerCellInfo.bind(this);
        this.parent.treeGrid.rowDataBound = this.rowDataBound.bind(this);
        this.parent.treeGrid.columnMenuOpen = this.columnMenuOpen.bind(this);
        this.parent.treeGrid.columnMenuClick = this.columnMenuClick.bind(this);
    };
    GanttTreeGrid.prototype.dataBound = function (args) {
        this.ensureScrollBar();
        this.parent.treeDataBound(args);
    };
    GanttTreeGrid.prototype.collapsing = function (args) {
        var _this = this;
        // Collapsing event
        var callBackPromise = new Deferred();
        if (!this.parent.ganttChartModule.isExpandCollapseFromChart) {
            var collapsingArgs = this.createExpandCollapseArgs(args);
            if (isBlazor()) {
                this.parent.trigger('collapsing', collapsingArgs, function (args) {
                    callBackPromise.resolve(args);
                    setValue('chartRow', getElement(getValue('chartRow', args)), args);
                    setValue('gridRow', getElement(getValue('gridRow', args)), args);
                    if (!getValue('cancel', args)) {
                        _this.parent.ganttChartModule.collapseGanttRow(args, true);
                    }
                });
                return callBackPromise;
            }
            else {
                this.parent.ganttChartModule.collapseGanttRow(collapsingArgs);
            }
            setValue('cancel', getValue('cancel', collapsingArgs), args);
        }
    };
    GanttTreeGrid.prototype.expanding = function (args) {
        var _this = this;
        // Expanding event
        var callBackPromise = new Deferred();
        if (!this.parent.ganttChartModule.isExpandCollapseFromChart) {
            var expandingArgs = this.createExpandCollapseArgs(args);
            if (isBlazor()) {
                this.parent.trigger('expanding', expandingArgs, function (args) {
                    callBackPromise.resolve(args);
                    setValue('chartRow', getElement(getValue('chartRow', args)), args);
                    setValue('gridRow', getElement(getValue('gridRow', args)), args);
                    if (!getValue('cancel', args)) {
                        _this.parent.ganttChartModule.expandGanttRow(args, true);
                    }
                });
                return callBackPromise;
            }
            else {
                this.parent.ganttChartModule.expandGanttRow(expandingArgs);
            }
            setValue('cancel', getValue('cancel', expandingArgs), args);
        }
    };
    GanttTreeGrid.prototype.collapsed = function (args) {
        this.updateExpandStatus(args);
        if (!this.parent.ganttChartModule.isExpandCollapseFromChart) {
            var collapsedArgs = this.createExpandCollapseArgs(args);
            this.parent.ganttChartModule.collapsedGanttRow(collapsedArgs);
        }
    };
    GanttTreeGrid.prototype.expanded = function (args) {
        this.updateExpandStatus(args);
        if (!this.parent.ganttChartModule.isExpandCollapseFromChart) {
            var expandedArgs = this.createExpandCollapseArgs(args);
            this.parent.ganttChartModule.expandedGanttRow(expandedArgs);
        }
    };
    GanttTreeGrid.prototype.updateExpandStatus = function (args) {
        if (getValue('data', args) && isBlazor()) {
            var record = this.parent.getTaskByUniqueID(getValue('data', args).uniqueID);
            record.expanded = getValue('data', args).expanded;
        }
    };
    GanttTreeGrid.prototype.actionBegin = function (args) {
        this.parent.notify('actionBegin', args);
        this.parent.trigger('actionBegin', args);
    };
    GanttTreeGrid.prototype.created = function (args) {
        this.updateKeyConfigSettings();
    };
    GanttTreeGrid.prototype.actionFailure = function (args) {
        this.parent.trigger('actionFailure', args);
    };
    GanttTreeGrid.prototype.createExpandCollapseArgs = function (args) {
        var record = getValue('data', args);
        var gridRow = getValue('row', args);
        var chartRow;
        if (isBlazor()) {
            /* tslint:disable-next-line */
            chartRow = this.parent.ganttChartModule.getChartRows()[this.parent.currentViewData.indexOf(this.parent.getTaskByUniqueID(record.uniqueID))];
        }
        else {
            chartRow = this.parent.ganttChartModule.getChartRows()[this.parent.currentViewData.indexOf(record)];
        }
        var eventArgs = { data: record, gridRow: gridRow, chartRow: chartRow, cancel: false };
        return eventArgs;
    };
    GanttTreeGrid.prototype.treeActionComplete = function (args) {
        var updatedArgs = extend({}, args, true);
        if (getValue('requestType', args) === 'sorting') {
            this.parent.notify('updateModel', {});
            deleteObject(updatedArgs, 'isFrozen');
        }
        else if (getValue('requestType', args) === 'filtering') {
            this.parent.notify('updateModel', {});
            var focussedElement = this.parent.element.querySelector('.e-treegrid');
            focussedElement.focus();
        }
        else if (getValue('type', args) === 'save') {
            if (this.parent.editModule && this.parent.editModule.cellEditModule) {
                var data = getValue('data', args);
                if (!isNullOrUndefined(data) && !isNullOrUndefined(this.parent.getTaskByUniqueID(data.uniqueID))) {
                    /* tslint:disable-next-line */
                    this.parent.getTaskByUniqueID(data.uniqueID).taskData[this.parent.taskFields.duration] = data.taskData[this.parent.taskFields.duration];
                    this.parent.getTaskByUniqueID(data.uniqueID).taskData[this.parent.taskFields.resourceInfo] = data.taskData[this.parent.taskFields.resourceInfo];
                }
                this.parent.editModule.cellEditModule.initiateCellEdit(args, this.currentEditRow);
                this.currentEditRow = {};
            }
        }
        if (getValue('requestType', args) === 'filterafteropen') {
            this.parent.notify('actionComplete', args);
        }
        if (getValue('requestType', args) === 'searching') {
            this.parent.notify('actionComplete', args);
        }
        if (!isNullOrUndefined(getValue('batchChanges', args)) && !isNullOrUndefined(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems();
        }
        if (isBlazor()) {
            this.parent.updateDataArgs(updatedArgs);
        }
        if (this.parent.isCancelled) {
            setValue('requestType', 'cancel', updatedArgs);
            setValue('action', 'CellEditing', updatedArgs);
            this.parent.isCancelled = false;
        }
        this.parent.trigger('actionComplete', updatedArgs);
    };
    GanttTreeGrid.prototype.updateKeyConfigSettings = function () {
        delete this.parent.treeGrid.grid.keyboardModule.keyConfigs.delete;
        delete this.parent.treeGrid.grid.keyboardModule.keyConfigs.insert;
        delete this.parent.treeGrid.grid.keyboardModule.keyConfigs.upArrow;
        delete this.parent.treeGrid.grid.keyboardModule.keyConfigs.downArrow;
        delete this.parent.treeGrid.grid.keyboardModule.keyConfigs.ctrlHome;
        delete this.parent.treeGrid.grid.keyboardModule.keyConfigs.ctrlEnd;
        delete this.parent.treeGrid.grid.keyboardModule.keyConfigs.enter;
        delete this.parent.treeGrid.grid.keyboardModule.keyConfigs.tab;
        delete this.parent.treeGrid.grid.keyboardModule.keyConfigs.shiftTab;
        delete this.parent.treeGrid.keyboardModule.keyConfigs.enter;
        delete this.parent.treeGrid.keyboardModule.keyConfigs.upArrow;
        delete this.parent.treeGrid.keyboardModule.keyConfigs.downArrow;
        delete this.parent.treeGrid.keyboardModule.keyConfigs.ctrlShiftUpArrow;
        delete this.parent.treeGrid.keyboardModule.keyConfigs.ctrlShiftDownArrow;
        delete this.parent.treeGrid.keyboardModule.keyConfigs.ctrlUpArrow;
        delete this.parent.treeGrid.keyboardModule.keyConfigs.ctrlDownArrow;
        delete this.parent.treeGrid.keyboardModule.keyConfigs.tab;
        delete this.parent.treeGrid.keyboardModule.keyConfigs.shiftTab;
    };
    /**
     * Method to bind internal events on TreeGrid element
     */
    GanttTreeGrid.prototype.wireEvents = function () {
        var content = this.parent.treeGrid.element.querySelector('.e-content');
        if (content) {
            EventHandler.add(content, 'scroll', this.scrollHandler, this);
        }
        if (this.parent.isAdaptive) {
            EventHandler.add(this.parent.treeGridPane, 'click', this.treeGridClickHandler, this);
        }
    };
    GanttTreeGrid.prototype.unWireEvents = function () {
        var content = this.parent.treeGrid.element &&
            this.parent.treeGrid.element.querySelector('.e-content');
        if (content) {
            EventHandler.remove(content, 'scroll', this.scrollHandler);
        }
        if (this.parent.isAdaptive) {
            EventHandler.remove(this.parent.treeGridPane, 'click', this.treeGridClickHandler);
        }
    };
    GanttTreeGrid.prototype.scrollHandler = function (e) {
        var content = this.parent.treeGrid.element.querySelector('.e-content');
        if (content.scrollTop !== this.previousScroll.top) {
            this.parent.notify('grid-scroll', { top: content.scrollTop });
        }
        this.previousScroll.top = content.scrollTop;
        if (this.parent.contextMenuModule && this.parent.contextMenuModule.isOpen) {
            this.parent.contextMenuModule.contextMenu.close();
        }
    };
    /**
     * @private
     */
    GanttTreeGrid.prototype.validateGanttColumns = function () {
        var ganttObj = this.parent;
        var length = ganttObj.columns.length;
        var tasks = this.parent.taskFields;
        this.parent.columnMapping = {};
        this.parent.columnByField = {};
        this.parent.customColumns = [];
        var tasksMapping = ['id', 'name', 'startDate', 'endDate', 'duration', 'dependency',
            'progress', 'baselineStartDate', 'baselineEndDate', 'resourceInfo', 'notes', 'work', 'manual', 'type'];
        var _loop_1 = function (i) {
            var column = {};
            if (typeof ganttObj.columns[i] === 'string') {
                column.field = ganttObj.columns[i];
            }
            else {
                column = ganttObj.columns[i];
            }
            var columnName = [];
            if (tasksMapping.length > 0) {
                columnName = tasksMapping.filter(function (name) {
                    return column.field === tasks[name];
                });
            }
            if (columnName.length === 0) {
                if (column.field === this_1.parent.resourceFields.group) {
                    return "continue";
                }
                this_1.parent.customColumns.push(column.field);
                column.headerText = column.headerText ? column.headerText : column.field;
                column.width = column.width ? column.width : 150;
                column.editType = column.editType ? column.editType : 'stringedit';
                column.type = column.type ? column.type : 'string';
                this_1.bindTreeGridColumnProperties(column, true);
                return "continue";
            }
            else {
                var index = tasksMapping.indexOf(columnName[0]);
                tasksMapping.splice(index, 1);
                this_1.createTreeGridColumn(column, true);
                this_1.parent.columnMapping[columnName[0]] = column.field;
            }
        };
        var this_1 = this;
        for (var i = 0; i < length; i++) {
            _loop_1(i);
        }
        /** Create default columns with task settings property */
        for (var j = 0; j < tasksMapping.length; j++) {
            var column = {};
            if (!isNullOrUndefined(tasks[tasksMapping[j]])) {
                column.field = tasks[tasksMapping[j]];
                this.createTreeGridColumn(column, length === 0);
                this.parent.columnMapping[tasksMapping[j]] = column.field;
            }
        }
        if (this.parent.viewType !== 'ProjectView') {
            var column = {};
            this.composeUniqueIDColumn(column);
            this.createTreeGridColumn(column, true);
        }
    };
    /**
     *
     * @param column
     * @param isDefined
     */
    /* tslint:disable-next-line:max-func-body-length */
    GanttTreeGrid.prototype.createTreeGridColumn = function (column, isDefined) {
        var taskSettings = this.parent.taskFields;
        column.disableHtmlEncode = column.disableHtmlEncode ? column.disableHtmlEncode : this.parent.disableHtmlEncode;
        if (taskSettings.id !== column.field) {
            column.clipMode = column.clipMode ? column.clipMode : 'EllipsisWithTooltip';
        }
        if (taskSettings.id === column.field) {
            /** Id column */
            this.composeIDColumn(column);
        }
        else if (taskSettings.name === column.field) {
            /** Name column */
            column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('name');
            column.width = column.width ? column.width : 150;
            column.editType = column.editType ? column.editType : 'stringedit';
            column.type = column.type ? column.type : 'string';
        }
        else if (taskSettings.startDate === column.field) {
            /** Name column */
            column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('startDate');
            column.editType = column.editType ? column.editType :
                this.parent.getDateFormat().toLowerCase().indexOf('hh') !== -1 ? 'datetimepickeredit' : 'datepickeredit';
            column.format = column.format ? column.format : { type: 'date', format: this.parent.getDateFormat() };
            column.width = column.width ? column.width : 150;
            column.edit = { params: { renderDayCell: this.parent.renderWorkingDayCell.bind(this.parent) } };
        }
        else if (taskSettings.endDate === column.field) {
            column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('endDate');
            column.format = column.format ? column.format : { type: 'date', format: this.parent.getDateFormat() };
            column.editType = column.editType ? column.editType :
                this.parent.getDateFormat().toLowerCase().indexOf('hh') !== -1 ? 'datetimepickeredit' : 'datepickeredit';
            column.width = column.width ? column.width : 150;
            column.edit = { params: { renderDayCell: this.parent.renderWorkingDayCell.bind(this.parent) } };
        }
        else if (taskSettings.duration === column.field) {
            column.width = column.width ? column.width : 150;
            column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('duration');
            column.valueAccessor = column.valueAccessor ? column.valueAccessor : !isNullOrUndefined(column.edit) ? null :
                this.durationValueAccessor.bind(this);
            column.editType = column.editType ? column.editType : 'stringedit';
            column.type = 'string';
        }
        else if (taskSettings.progress === column.field) {
            this.composeProgressColumn(column);
        }
        else if (taskSettings.dependency === column.field) {
            column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('dependency');
            column.width = column.width ? column.width : 150;
            column.editType = column.editType ? column.editType : 'stringedit';
            column.type = 'string';
            column.allowFiltering = column.allowFiltering === false ? false : true;
        }
        else if (taskSettings.resourceInfo === column.field) {
            this.composeResourceColumn(column);
        }
        else if (taskSettings.notes === column.field) {
            column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('notes');
            column.width = column.width ? column.width : 150;
            column.editType = column.editType ? column.editType : 'stringedit';
            if (isBlazor() && !column.template) {
                this.parent.setProperties({ 'showInlineNotes': true }, true);
            }
            if (!this.parent.showInlineNotes) {
                if (!column.template) {
                    column.template = '<div class="e-ganttnotes-info">' +
                        '<span class="e-icons e-notes-info"></span></div>';
                }
            }
            else {
                column.disableHtmlEncode = false;
            }
        }
        else if (taskSettings.baselineStartDate === column.field ||
            taskSettings.baselineEndDate === column.field) {
            var colName = (taskSettings.baselineEndDate === column.field) ? 'baselineEndDate' :
                'baselineStartDate';
            column.width = column.width ? column.width : 150;
            column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant(colName);
            column.format = column.format ? column.format : { type: 'date', format: this.parent.getDateFormat() };
            column.editType = column.editType ? column.editType :
                this.parent.getDateFormat().toLowerCase().indexOf('hh') !== -1 ? 'datetimepickeredit' : 'datepickeredit';
        }
        else if (taskSettings.work === column.field) {
            column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('work');
            column.width = column.width ? column.width : 150;
            column.valueAccessor = column.valueAccessor ? column.valueAccessor : this.workValueAccessor.bind(this);
            column.editType = column.editType ? column.editType : 'numericedit';
        }
        else if (taskSettings.type === column.field) {
            column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('taskType');
            column.width = column.width ? column.width : 150;
            //column.type = 'string';
            column.editType = 'dropdownedit';
            column.valueAccessor = column.valueAccessor ? column.valueAccessor : this.taskTypeValueAccessor.bind(this);
        }
        else if (taskSettings.manual === column.field && this.parent.taskMode === 'Custom') {
            column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('taskMode');
            column.width = column.width ? column.width : 120;
            column.editType = column.editType ? column.editType : 'dropdownedit';
            column.valueAccessor = column.valueAccessor ? column.valueAccessor : this.modeValueAccessor.bind(this);
            column.edit = {
                params: {
                    query: new Query(),
                    dataSource: [
                        { id: 1, text: this.parent.localeObj.getConstant('manual'), value: true },
                        { id: 2, text: this.parent.localeObj.getConstant('auto'), value: false }
                    ],
                    fields: { text: 'text', value: 'value' }
                },
            };
        }
        this.bindTreeGridColumnProperties(column, isDefined);
    };
    /**
     * Compose Resource columns
     * @param column
     */
    GanttTreeGrid.prototype.composeResourceColumn = function (column) {
        column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('resourceName');
        column.width = column.width ? column.width : 150;
        column.type = 'string';
        column.valueAccessor = column.valueAccessor ? column.valueAccessor : this.resourceValueAccessor.bind(this);
        column.allowFiltering = column.allowFiltering === false ? false : true;
    };
    /**
     *
     * @private
     */
    GanttTreeGrid.prototype.getResourceIds = function (data) {
        var value = getValue(this.parent.taskFields.resourceInfo, data.taskData);
        var id = [];
        if (!isNullOrUndefined(value)) {
            for (var i = 0; i < value.length; i++) {
                id.push(typeof value[i] === 'object' ? value[i][this.parent.resourceFields.id] : value[i]);
            }
            return id;
        }
        else {
            return value;
        }
    };
    /**
     * Create Id column
     * @param column
     */
    GanttTreeGrid.prototype.composeIDColumn = function (column) {
        column.isPrimaryKey = isNullOrUndefined(column.isPrimaryKey) ? true : column.isPrimaryKey;
        column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('id');
        column.width = column.width ? column.width : 100;
        column.allowEditing = column.allowEditing ? column.allowEditing : false;
        column.editType = column.editType ? column.editType : 'numericedit';
        if (this.parent.viewType !== 'ProjectView') {
            column.valueAccessor = this.idValueAccessor.bind(this);
            column.isPrimaryKey = false;
        }
    };
    GanttTreeGrid.prototype.composeUniqueIDColumn = function (column) {
        column.field = 'rowUniqueID';
        column.isPrimaryKey = true;
        column.headerText = 'UniqueID';
        column.allowEditing = false;
        column.visible = false;
    };
    /**
     * Create progress column
     * @param column
     */
    GanttTreeGrid.prototype.composeProgressColumn = function (column) {
        column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('progress');
        column.width = column.width ? column.width : 150;
        column.editType = column.editType ? column.editType : 'numericedit';
    };
    /**
     *
     */
    GanttTreeGrid.prototype.bindTreeGridColumnProperties = function (newGanttColumn, isDefined) {
        var treeGridColumn = {};
        var ganttColumn = {};
        for (var _i = 0, _a = Object.keys(newGanttColumn); _i < _a.length; _i++) {
            var prop = _a[_i];
            treeGridColumn[prop] = ganttColumn[prop] = newGanttColumn[prop];
        }
        this.parent.columnByField[ganttColumn.field] = ganttColumn;
        this.parent.ganttColumns.push(new GanttColumn(ganttColumn));
        if (isDefined) {
            this.treeGridColumns.push(treeGridColumn);
        }
    };
    GanttTreeGrid.prototype.durationValueAccessor = function (field, data, column) {
        var ganttProp = data.ganttProperties;
        if (!isNullOrUndefined(ganttProp)) {
            return this.parent.dataOperation.getDurationString(ganttProp.duration, ganttProp.durationUnit);
        }
        return '';
    };
    GanttTreeGrid.prototype.resourceValueAccessor = function (field, data, column) {
        var ganttProp = data.ganttProperties;
        if (!isNullOrUndefined(ganttProp)) {
            return ganttProp.resourceNames;
        }
        return '';
    };
    GanttTreeGrid.prototype.workValueAccessor = function (field, data, column) {
        var ganttProp = data.ganttProperties;
        if (!isNullOrUndefined(ganttProp)) {
            return this.parent.dataOperation.getWorkString(ganttProp.work, ganttProp.workUnit);
        }
        return '';
    };
    GanttTreeGrid.prototype.taskTypeValueAccessor = function (field, data, column) {
        var ganttProp = data.ganttProperties;
        if (!isNullOrUndefined(ganttProp)) {
            return ganttProp.taskType;
        }
        return '';
    };
    GanttTreeGrid.prototype.modeValueAccessor = function (field, data, column) {
        if (data[field]) {
            return 'Manual';
        }
        else {
            return 'Auto';
        }
    };
    GanttTreeGrid.prototype.idValueAccessor = function (field, data, column) {
        return data.level === 0 ? 'R-' + data.ganttProperties.taskId : 'T-' + data.ganttProperties.taskId;
    };
    GanttTreeGrid.prototype.updateScrollTop = function (args) {
        this.treeGridElement.querySelector('.e-content').scrollTop = getValue('top', args);
        this.previousScroll.top = this.treeGridElement.querySelector('.e-content').scrollTop;
    };
    GanttTreeGrid.prototype.treeGridClickHandler = function (e) {
        this.parent.notify('treeGridClick', e);
    };
    GanttTreeGrid.prototype.removeEventListener = function () {
        this.parent.off('renderPanels', this.createContainer);
        this.parent.off('chartScroll', this.updateScrollTop);
        this.parent.off('destroy', this.destroy);
    };
    GanttTreeGrid.prototype.destroy = function () {
        this.removeEventListener();
        this.unWireEvents();
        if (this.parent.treeGrid.element) {
            this.parent.treeGrid.destroy();
        }
    };
    return GanttTreeGrid;
}());
export { GanttTreeGrid };
