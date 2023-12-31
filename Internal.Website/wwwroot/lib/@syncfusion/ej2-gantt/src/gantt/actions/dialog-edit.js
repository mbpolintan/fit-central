import { remove, extend, isNullOrUndefined, createElement, getValue, setValue, closest, isBlazor } from '@syncfusion/ej2-base';
import { DataManager, DataUtil } from '@syncfusion/ej2-data';
import { Dialog } from '@syncfusion/ej2-popups';
import { Tab } from '@syncfusion/ej2-navigations';
import { Grid, Edit, Toolbar as GridToolbar, Page } from '@syncfusion/ej2-grids';
import { ForeignKey, getActualProperties } from '@syncfusion/ej2-grids';
import { RichTextEditor, Toolbar as RTEToolbar, Link, HtmlEditor, QuickToolbar, Count } from '@syncfusion/ej2-richtexteditor';
import { TextBox, NumericTextBox, MaskedTextBox } from '@syncfusion/ej2-inputs';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { DatePicker, DateTimePicker } from '@syncfusion/ej2-calendars';
import { DropDownList, ComboBox } from '@syncfusion/ej2-dropdowns';
import { isScheduledTask } from '../base/utils';
import { TreeGrid, Selection, Filter, Edit as TreeGridEdit } from '@syncfusion/ej2-treegrid';
import { getUid } from '../base/utils';
/**
 *
 * @hidden
 */
var DialogEdit = /** @class */ (function () {
    /**
     * Constructor for render module
     */
    function DialogEdit(parent) {
        /**
         * @private
         */
        this.updatedEditFields = null;
        this.updatedAddFields = null;
        this.addedRecord = null;
        this.dialogEditValidationFlag = false;
        this.ganttResources = [];
        /**
         * @private
         */
        this.previousResource = [];
        /**
         * @private
         */
        this.isResourceUpdate = false;
        this.parent = parent;
        this.localeObj = this.parent.localeObj;
        this.beforeOpenArgs = { cancel: false };
        this.types = this.getPredecessorType();
        this.rowData = {};
        this.editedRecord = {};
        this.inputs = {
            booleanedit: CheckBox,
            dropdownedit: DropDownList,
            datepickeredit: DatePicker,
            datetimepickeredit: DateTimePicker,
            maskededit: MaskedTextBox,
            numericedit: NumericTextBox,
            stringedit: TextBox,
        };
        this.processDialogFields();
        this.wireEvents();
    }
    DialogEdit.prototype.wireEvents = function () {
        this.parent.on('chartDblClick', this.dblClickHandler, this);
    };
    DialogEdit.prototype.dblClickHandler = function (e) {
        var ganttData = this.parent.ganttChartModule.getRecordByTarget(e);
        if (!isNullOrUndefined(ganttData)) {
            this.openEditDialog(ganttData);
        }
    };
    /**
     * Method to validate add and edit dialog fields property.
     * @private
     */
    DialogEdit.prototype.processDialogFields = function () {
        if (isNullOrUndefined(this.parent.editDialogFields) ||
            this.parent.editDialogFields && this.parent.editDialogFields.length === 0) {
            this.updatedEditFields = this.getDefaultDialogFields();
            this.updatedEditFields = this.validateDialogFields(this.updatedEditFields);
        }
        else {
            this.updatedEditFields = this.validateDialogFields(this.parent.editDialogFields);
        }
        if (isNullOrUndefined(this.parent.addDialogFields) ||
            this.parent.addDialogFields && this.parent.addDialogFields.length === 0) {
            this.updatedAddFields = this.getDefaultDialogFields();
            this.updatedAddFields = this.validateDialogFields(this.updatedAddFields);
        }
        else {
            this.updatedAddFields = this.validateDialogFields(this.parent.addDialogFields);
        }
    };
    DialogEdit.prototype.validateDialogFields = function (dialogFields) {
        var newDialogFields = [];
        var emptyCustomColumn = 0;
        for (var i = 0; i < dialogFields.length; i++) {
            var fieldItem = getActualProperties(dialogFields[i]);
            if (fieldItem.type === 'General' && (isNullOrUndefined(fieldItem.fields) || fieldItem.fields.length === 0)) {
                fieldItem.fields = this.getGeneralColumnFields();
            }
            if (fieldItem.type === 'Dependency' && isNullOrUndefined(this.parent.taskFields.dependency)
                || fieldItem.type === 'Resources' && isNullOrUndefined(this.parent.taskFields.resourceInfo)
                || fieldItem.type === 'Notes' && isNullOrUndefined(this.parent.taskFields.notes)) {
                continue;
            }
            if (fieldItem.type === 'Custom' && (isNullOrUndefined(fieldItem.fields) || fieldItem.fields.length === 0)) {
                emptyCustomColumn += 1;
                fieldItem.fields = this.getCustomColumnFields();
            }
            if (emptyCustomColumn > 1) {
                continue;
            }
            newDialogFields.push(fieldItem);
        }
        return newDialogFields;
    };
    /**
     * Method to get general column fields
     */
    DialogEdit.prototype.getGeneralColumnFields = function () {
        var fields = [];
        for (var _i = 0, _a = Object.keys(this.parent.columnMapping); _i < _a.length; _i++) {
            var key = _a[_i];
            if (key === 'dependency' || key === 'resourceInfo' || key === 'notes') {
                continue;
            }
            fields.push(this.parent.columnMapping[key]);
        }
        return fields;
    };
    /**
     * Method to get custom column fields
     */
    DialogEdit.prototype.getCustomColumnFields = function () {
        var fields = [];
        for (var i = 0; i < this.parent.customColumns.length; i++) {
            fields.push(this.parent.customColumns[i]);
        }
        return fields;
    };
    /**
     * Get default dialog fields when fields are not defined for add and edit dialogs
     */
    DialogEdit.prototype.getDefaultDialogFields = function () {
        var dialogFields = [];
        var fieldItem = {};
        var fields;
        var columnMapping = this.parent.columnMapping;
        if (Object.keys(columnMapping).length !== 0) {
            fieldItem.type = 'General';
            fields = this.getGeneralColumnFields();
            dialogFields.push(fieldItem);
        }
        if (!isNullOrUndefined(getValue('dependency', columnMapping))) {
            fieldItem = {};
            if (this.parent.columnByField[columnMapping.dependency.valueOf()].visible !== false) {
                fieldItem.type = 'Dependency';
            }
            dialogFields.push(fieldItem);
        }
        if (!isNullOrUndefined(getValue('resourceInfo', columnMapping))) {
            fieldItem = {};
            if (this.parent.columnByField[columnMapping.resourceInfo.valueOf()].visible !== false) {
                fieldItem.type = 'Resources';
            }
            dialogFields.push(fieldItem);
        }
        if (!isNullOrUndefined(getValue('notes', columnMapping))) {
            fieldItem = {};
            if (this.parent.columnByField[columnMapping.notes.valueOf()].visible !== false) {
                fieldItem.type = 'Notes';
            }
            dialogFields.push(fieldItem);
        }
        if (this.parent.customColumns.length > 0) {
            fieldItem = {};
            fieldItem.type = 'Custom';
            dialogFields.push(fieldItem);
        }
        return dialogFields;
    };
    /**
     * @private
     */
    DialogEdit.prototype.openAddDialog = function () {
        this.isEdit = false;
        this.editedRecord = this.composeAddRecord();
        this.createDialog();
    };
    /**
     *
     * @return {Date}
     * @private
     */
    DialogEdit.prototype.getMinimumStartDate = function () {
        var minDate = DataUtil.aggregates.min(this.parent.flatData, 'ganttProperties.startDate');
        if (!isNullOrUndefined(minDate)) {
            minDate = new Date(minDate.getTime());
        }
        else {
            minDate = new Date(this.parent.timelineModule.timelineStartDate.getTime());
        }
        minDate = this.parent.dateValidationModule.checkStartDate(minDate);
        return new Date(minDate.getTime());
    };
    /**
     * @private
     */
    DialogEdit.prototype.composeAddRecord = function () {
        var tempData = {};
        tempData.ganttProperties = {};
        var columns = this.parent.ganttColumns;
        var taskSettings = this.parent.taskFields;
        var id = this.parent.editModule.getNewTaskId();
        for (var i = 0; i < columns.length; i++) {
            var field = columns[i].field;
            if (field === taskSettings.id) {
                tempData[field] = id;
                tempData.ganttProperties.rowUniqueID = tempData[field];
            }
            else if (columns[i].field === taskSettings.startDate) {
                if (isNullOrUndefined(tempData[taskSettings.endDate])) {
                    tempData[field] = this.getMinimumStartDate();
                }
                else {
                    tempData[field] = new Date(tempData[taskSettings.endDate]);
                }
                tempData.ganttProperties.startDate = new Date(tempData[field]);
            }
            else if (columns[i].field === taskSettings.endDate) {
                if (isNullOrUndefined(tempData[taskSettings.startDate])) {
                    tempData[field] = this.getMinimumStartDate();
                }
                else {
                    tempData[field] = new Date(tempData[taskSettings.startDate]);
                }
                tempData.ganttProperties.endDate = new Date(tempData[field]);
            }
            else if (columns[i].field === taskSettings.duration) {
                tempData[field] = 1;
                tempData.ganttProperties.duration = tempData[field];
                tempData.ganttProperties.durationUnit = this.parent.durationUnit.toLocaleLowerCase();
            }
            else if (columns[i].field === taskSettings.name) {
                tempData[field] = 'New Task ' + id;
                tempData.ganttProperties.taskName = tempData[field];
            }
            else if (columns[i].field === taskSettings.progress) {
                tempData[field] = 0;
                tempData.ganttProperties.progress = tempData[field];
            }
            else if (columns[i].field === taskSettings.work) {
                tempData[field] = 0;
                tempData.ganttProperties.work = tempData[field];
            }
            else if (columns[i].field === 'taskType') {
                tempData[field] = this.parent.taskType;
                tempData.ganttProperties.taskType = tempData[field];
            }
            else {
                tempData[this.parent.ganttColumns[i].field] = '';
            }
        }
        return tempData;
    };
    /**
     * @private
     */
    DialogEdit.prototype.openToolbarEditDialog = function () {
        var gObj = this.parent;
        if (gObj.editModule && gObj.editSettings.allowEditing) {
            var selectedRowId = gObj.selectionModule ?
                (gObj.selectionSettings.mode === 'Row' || gObj.selectionSettings.mode === 'Both') &&
                    gObj.selectionModule.selectedRowIndexes.length === 1 ?
                    gObj.currentViewData[gObj.selectionModule.selectedRowIndexes[0]].ganttProperties.rowUniqueID :
                    gObj.selectionSettings.mode === 'Cell' &&
                        gObj.selectionModule.getSelectedRowCellIndexes().length === 1 ?
                        gObj.currentViewData[gObj.selectionModule.getSelectedRowCellIndexes()[0].rowIndex].ganttProperties.rowUniqueID :
                        null : null;
            if (!isNullOrUndefined(selectedRowId)) {
                this.openEditDialog(selectedRowId);
            }
        }
    };
    /**
     * @param taskId
     * @private
     */
    DialogEdit.prototype.openEditDialog = function (taskId) {
        var ganttObj = this.parent;
        if (typeof taskId === 'object' && !isNullOrUndefined(taskId)) {
            this.rowIndex = this.parent.currentViewData.indexOf(taskId);
            if (this.rowIndex > -1) {
                this.rowData = taskId;
            }
        }
        else if (!isNullOrUndefined(taskId)) {
            this.rowIndex = ganttObj.ids.indexOf(taskId.toString());
            if (this.rowIndex > -1) {
                this.rowData = ganttObj.flatData[this.rowIndex];
            }
        }
        else if (ganttObj.selectedRowIndex > -1) {
            this.rowData = ganttObj.currentViewData[ganttObj.selectedRowIndex];
            this.rowIndex = ganttObj.selectedRowIndex;
        }
        this.isEdit = true;
        if (this.parent.viewType === 'ResourceView' && this.rowData.level === 0) {
            return;
        }
        if (Object.keys(this.rowData).length !== 0) {
            this.editedRecord = extend({}, {}, this.rowData, true);
            this.createDialog();
        }
    };
    DialogEdit.prototype.createDialog = function () {
        var _this = this;
        var ganttObj = this.parent;
        var dialogModel = {};
        this.beforeOpenArgs.dialogModel = dialogModel;
        this.beforeOpenArgs.rowData = this.editedRecord;
        this.beforeOpenArgs.rowIndex = this.rowIndex;
        var dialogMaxWidth = this.parent.isAdaptive ? '' : '600px';
        var dialog = this.parent.createElement('div', { id: ganttObj.element.id + '_dialog', styles: 'max-width:' + dialogMaxWidth });
        ganttObj.element.appendChild(dialog);
        dialogModel.animationSettings = { effect: 'None' };
        dialogModel.header = this.localeObj.getConstant(this.isEdit ? 'editDialogTitle' : 'addDialogTitle');
        dialogModel.isModal = true;
        dialogModel.cssClass = 'e-gantt-dialog';
        dialogModel.allowDragging = this.parent.isAdaptive ? false : true;
        dialogModel.showCloseIcon = true;
        var position = this.parent.isAdaptive ? { X: 'top', Y: 'left' } : { X: 'center', Y: 'center' };
        dialogModel.position = position;
        //dialogModel.width = '750px';
        dialogModel.height = this.parent.isAdaptive ? '100%' : 'auto';
        dialogModel.target = this.parent.element;
        dialogModel.close = this.dialogClose.bind(this);
        dialogModel.closeOnEscape = true;
        dialogModel.open = function (args) {
            var dialogElement = getValue('element', args);
            var generalTabElement = dialogElement.querySelector('#' + _this.parent.element.id + 'GeneralTabContainer');
            if (generalTabElement && generalTabElement.scrollHeight > generalTabElement.offsetHeight) {
                generalTabElement.classList.add('e-scroll');
            }
            if (_this.tabObj.selectedItem === 0) {
                _this.tabObj.select(0);
            }
            if (_this.parent.isAdaptive) {
                dialogElement.style.maxHeight = 'none';
            }
        };
        dialogModel.locale = this.parent.locale;
        dialogModel.buttons = [{
                buttonModel: {
                    content: this.localeObj.getConstant('saveButton'), cssClass: 'e-primary'
                },
                click: this.buttonClick.bind(this)
            }, {
                buttonModel: { cssClass: 'e-flat', content: this.localeObj.getConstant('cancel') },
                click: this.buttonClick.bind(this)
            }];
        this.createTab(dialogModel, dialog);
    };
    DialogEdit.prototype.buttonClick = function (e) {
        var target = e.target;
        target.style.pointerEvents = 'none';
        if ((this.localeObj.getConstant('cancel')).toLowerCase() === e.target.innerText.trim().toLowerCase()) {
            if (this.dialog && !this.dialogObj.isDestroyed) {
                this.dialogObj.hide();
                this.dialogClose();
            }
        }
        else {
            this.initiateDialogSave();
            target.style.pointerEvents = 'auto';
        }
    };
    /**
     * @private
     */
    DialogEdit.prototype.dialogClose = function () {
        if (this.dialog) {
            this.resetValues();
        }
    };
    DialogEdit.prototype.resetValues = function () {
        this.isEdit = false;
        this.isAddNewResource = false;
        this.editedRecord = {};
        this.rowData = {};
        this.rowIndex = -1;
        this.addedRecord = null;
        this.ganttResources = [];
        if (this.dialog && !this.dialogObj.isDestroyed) {
            this.destroyDialogInnerElements();
            this.dialogObj.destroy();
            remove(this.dialog);
        }
    };
    DialogEdit.prototype.destroyDialogInnerElements = function () {
        var ganttObj = this.parent;
        var tabModel = this.beforeOpenArgs.tabModel;
        var items = tabModel.items;
        for (var i = 0; i < items.length; i++) {
            var element = items[i].content;
            var id = element.id;
            if (!isNullOrUndefined(id) || id !== '') {
                id = id.replace(ganttObj.element.id, '');
                id = id.replace('TabContainer', '');
                if (id === 'General') {
                    this.destroyCustomField(element);
                }
                else if (id === 'Dependency') {
                    var gridObj = element.ej2_instances[0];
                    gridObj.destroy();
                }
                else if (id === 'Notes') {
                    var rte = element.ej2_instances[0];
                    rte.destroy();
                }
                else if (id === 'Resources') {
                    var treeGridObj = element.ej2_instances[0];
                    treeGridObj.destroy();
                }
                else if (id.indexOf('Custom') !== -1) {
                    this.destroyCustomField(element);
                }
            }
        }
    };
    DialogEdit.prototype.destroyCustomField = function (element) {
        var childNodes = element.childNodes;
        var ganttObj = this.parent;
        for (var i = 0; i < childNodes.length; i++) {
            var div = childNodes[i];
            var inputElement = div.querySelector('input[id^="' + ganttObj.element.id + '"]');
            if (inputElement) {
                var fieldName = inputElement.id.replace(ganttObj.element.id, '');
                /* tslint:disable-next-line:no-any */
                var controlObj = div.querySelector('#' + ganttObj.element.id + fieldName).ej2_instances[0];
                if (!isNullOrUndefined(controlObj)) {
                    var column = ganttObj.columnByField[fieldName];
                    if (!isNullOrUndefined(column.edit) && isNullOrUndefined(column.edit.params)) {
                        var destroy = column.edit.destroy;
                        if (typeof destroy !== 'string') {
                            column.edit.destroy();
                        }
                    }
                    else {
                        controlObj.destroy();
                    }
                }
            }
        }
    };
    /**
     * @private
     */
    DialogEdit.prototype.destroy = function () {
        this.resetValues();
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('chartDblClick', this.dblClickHandler);
        this.parent.editModule.dialogModule = undefined;
    };
    /**
     * Method to get current edit dialog fields value
     */
    DialogEdit.prototype.getEditFields = function () {
        if (this.isEdit) {
            return this.updatedEditFields;
        }
        else {
            return this.updatedAddFields;
        }
    };
    /* tslint:disable-next-line:max-func-body-length */
    DialogEdit.prototype.createTab = function (dialogModel, dialog) {
        var _this = this;
        var ganttObj = this.parent;
        var tabModel = {};
        var tabItems = [];
        var dialogSettings = this.getEditFields();
        var tabElement;
        var tasks = ganttObj.taskFields;
        var length = dialogSettings.length;
        tabModel.items = tabItems;
        tabModel.locale = this.parent.locale;
        this.beforeOpenArgs.tabModel = tabModel;
        var count = 0;
        var index = 0;
        if (length > 0) {
            for (var i = 0; i < length; i++) {
                var dialogField = dialogSettings[i];
                var tabItem = {};
                if (dialogField.type === 'General') {
                    if (Object.keys(ganttObj.columnMapping).length === 0) {
                        continue;
                    }
                    if (isNullOrUndefined(dialogField.headerText)) {
                        dialogField.headerText = this.localeObj.getConstant('generalTab');
                    }
                    tabItem.content = 'General';
                    this.beforeOpenArgs[tabItem.content] = this.getFieldsModel(dialogField.fields);
                }
                else if (dialogField.type === 'Dependency') {
                    if (isNullOrUndefined(tasks.dependency)) {
                        continue;
                    }
                    if (isNullOrUndefined(dialogField.headerText)) {
                        dialogField.headerText = this.localeObj.getConstant('dependency');
                    }
                    tabItem.content = 'Dependency';
                    this.beforeOpenArgs[tabItem.content] = this.getPredecessorModel(dialogField.fields);
                }
                else if (dialogField.type === 'Resources') {
                    if (isNullOrUndefined(tasks.resourceInfo)) {
                        continue;
                    }
                    if (isNullOrUndefined(dialogField.headerText)) {
                        dialogField.headerText = this.localeObj.getConstant('resourceName');
                    }
                    tabItem.content = 'Resources';
                    this.beforeOpenArgs[tabItem.content] = this.getResourcesModel(dialogField.fields);
                }
                else if (dialogField.type === 'Notes') {
                    if (isNullOrUndefined(tasks.notes)) {
                        continue;
                    }
                    if (isNullOrUndefined(dialogField.headerText)) {
                        dialogField.headerText = this.localeObj.getConstant('notes');
                    }
                    tabItem.content = 'Notes';
                    this.beforeOpenArgs[tabItem.content] = this.getNotesModel(dialogField.fields);
                }
                else {
                    if (isNullOrUndefined(dialogField.fields) || dialogField.fields.length === 0) {
                        continue;
                    }
                    if (isNullOrUndefined(dialogField.headerText)) {
                        dialogField.headerText = this.localeObj.getConstant('customTab');
                        count++;
                    }
                    tabItem.content = 'Custom' + '' + index++;
                    this.beforeOpenArgs[tabItem.content] = this.getFieldsModel(dialogField.fields);
                }
                tabItem.header = { text: dialogField.headerText };
                tabItems.push(tabItem);
            }
        }
        this.beforeOpenArgs.requestType = this.isEdit ? 'beforeOpenEditDialog' : 'beforeOpenAddDialog';
        var args = {
            rowData: this.beforeOpenArgs.rowData,
            name: this.beforeOpenArgs.name,
            requestType: this.beforeOpenArgs.requestType,
            cancel: this.beforeOpenArgs.cancel
        };
        this.parent.trigger('actionBegin', isBlazor() ? args : this.beforeOpenArgs, function (args) {
            _this.renderTabItems();
            if (!args.cancel) {
                tabModel.selected = _this.tabSelectedEvent.bind(_this);
                tabModel.height = _this.parent.isAdaptive ? '100%' : 'auto';
                tabModel.overflowMode = 'Scrollable';
                _this.tabObj = new Tab(tabModel);
                _this.tabObj.isStringTemplate = true;
                tabElement = _this.parent.createElement('div', { id: ganttObj.element.id + '_Tab' });
                _this.tabObj.appendTo(tabElement);
                dialogModel.content = tabElement;
                _this.dialog = dialog;
                _this.dialogObj = new Dialog(dialogModel);
                _this.dialogObj.isStringTemplate = true;
                _this.dialogObj.appendTo(_this.dialog);
                var actionCompleteArgs = {
                    action: 'OpenDialog',
                    requestType: _this.isEdit ? 'openEditDialog' : 'openAddDialog',
                    data: _this.beforeOpenArgs.rowData,
                    element: _this.dialog,
                    cancel: false
                };
                if (isBlazor()) {
                    _this.parent.updateDataArgs(actionCompleteArgs);
                }
                _this.parent.trigger('actionComplete', actionCompleteArgs, function (actionCompleteArgs) {
                    if (actionCompleteArgs.cancel) {
                        _this.resetValues();
                    }
                });
            }
        });
    };
    DialogEdit.prototype.tabSelectedEvent = function (args) {
        var ganttObj = this.parent;
        var id = args.selectedContent.childNodes[0].id;
        if (this.parent.isAdaptive) {
            this.responsiveTabContent(id, ganttObj);
        }
        if (id === ganttObj.element.id + 'ResourcesTabContainer') {
            var resourceTreeGrid_1 = ganttObj.element.querySelector('#' + id).ej2_instances[0];
            var resources_1 = this.ganttResources;
            var currentViewData = resourceTreeGrid_1.getCurrentViewRecords();
            if (resources_1 && resources_1.length > 0) {
                currentViewData.forEach(function (data, index) {
                    for (var i = 0; i < resources_1.length; i++) {
                        if (data.taskData[ganttObj.resourceFields.id] === resources_1[i][ganttObj.resourceFields.id] &&
                            !isNullOrUndefined(resourceTreeGrid_1.selectionModule) &&
                            resourceTreeGrid_1.getSelectedRowIndexes().indexOf(index) === -1) {
                            resourceTreeGrid_1.selectRow(index);
                        }
                    }
                });
            }
        }
        else if (id === ganttObj.element.id + 'NotesTabContainer') {
            ganttObj.element.querySelector('#' + id).ej2_instances[0].refresh();
        }
    };
    DialogEdit.prototype.responsiveTabContent = function (id, ganttObj) {
        var dialogContent = document.getElementById(ganttObj.element.id + '_dialog_dialog-content');
        var dialogContentHeight = dialogContent.clientHeight;
        dialogContentHeight -= dialogContent.querySelector('.e-tab-header').offsetHeight;
        var grid = document.querySelector('#' + id);
        if (grid.classList.contains('e-grid')) {
            dialogContentHeight -= grid.ej2_instances[0].getHeaderContent().offsetHeight;
            var toolbar_1 = grid.querySelector('.e-toolbar');
            if (toolbar_1) {
                dialogContentHeight -= toolbar_1.offsetHeight;
            }
        }
        grid.parentElement.style.height = dialogContentHeight + 'px';
    };
    DialogEdit.prototype.getFieldsModel = function (fields) {
        var fieldsModel = {};
        var columnByField = this.parent.columnByField;
        for (var i = 0; i < fields.length; i++) {
            if (fields[i] === this.parent.taskFields.dependency ||
                fields[i] === this.parent.taskFields.resourceInfo ||
                fields[i] === this.parent.taskFields.notes) {
                continue;
            }
            if (!isNullOrUndefined(columnByField[fields[i]])) {
                var fieldName = fields[i];
                this.createInputModel(columnByField[fieldName], fieldsModel);
            }
        }
        return fieldsModel;
    };
    DialogEdit.prototype.createInputModel = function (column, fieldsModel) {
        var _this = this;
        var ganttObj = this.parent;
        var locale = this.parent.locale;
        var taskSettings = this.parent.taskFields;
        var common = {
            placeholder: column.headerText,
            floatLabelType: 'Auto',
        };
        switch (column.editType) {
            case 'booleanedit':
                var checkboxModel = {
                    label: column.headerText,
                    locale: locale,
                };
                fieldsModel[column.field] = checkboxModel;
                break;
            case 'stringedit':
                var textBox = common;
                if (column.field === ganttObj.columnMapping.duration) {
                    textBox.change = function (args) {
                        _this.validateScheduleFields(args, column, ganttObj);
                    };
                }
                fieldsModel[column.field] = common;
                break;
            case 'numericedit':
                var numeric = common;
                if (taskSettings.progress === column.field) {
                    numeric.min = 0;
                    numeric.max = 100;
                }
                if (taskSettings.work === column.field) {
                    numeric.change = function (args) {
                        _this.validateScheduleFields(args, column, ganttObj);
                    };
                }
                fieldsModel[column.field] = numeric;
                break;
            case 'datepickeredit':
                var datePickerObj = common;
                datePickerObj.format = this.parent.getDateFormat();
                datePickerObj.strictMode = true;
                datePickerObj.firstDayOfWeek = ganttObj.timelineModule.customTimelineSettings.weekStartDay;
                if (column.field === ganttObj.columnMapping.startDate ||
                    column.field === ganttObj.columnMapping.endDate) {
                    datePickerObj.renderDayCell = this.parent.renderWorkingDayCell.bind(this.parent);
                    datePickerObj.change = function (args) {
                        _this.validateScheduleFields(args, column, ganttObj);
                    };
                }
                fieldsModel[column.field] = datePickerObj;
                break;
            case 'datetimepickeredit':
                var dateTimePickerObj = common;
                dateTimePickerObj.format = this.parent.getDateFormat();
                dateTimePickerObj.strictMode = true;
                dateTimePickerObj.firstDayOfWeek = ganttObj.timelineModule.customTimelineSettings.weekStartDay;
                if (column.field === ganttObj.columnMapping.startDate ||
                    column.field === ganttObj.columnMapping.endDate) {
                    dateTimePickerObj.renderDayCell = this.parent.renderWorkingDayCell.bind(this.parent);
                    dateTimePickerObj.change = function (args) {
                        _this.validateScheduleFields(args, column, ganttObj);
                    };
                }
                fieldsModel[column.field] = dateTimePickerObj;
                break;
            case 'dropdownedit':
                if (column.field === 'taskType' || column.field === ganttObj.columnMapping.manual) {
                    var dataKey = 'dataSource';
                    var fieldsKey = 'fields';
                    var types = [
                        { 'ID': 1, 'Value': 'FixedUnit' }, { 'ID': 2, 'Value': 'FixedWork' }, { 'ID': 3, 'Value': 'FixedDuration' }
                    ];
                    common[dataKey] = types;
                    common[fieldsKey] = { value: 'Value' };
                    var dropDownListObj = common;
                    dropDownListObj.change = function (args) {
                        if (column.field === taskSettings.manual) {
                            _this.editedRecord.ganttProperties.isAutoSchedule = !args.value;
                        }
                        _this.validateScheduleFields(args, column, ganttObj);
                    };
                }
                fieldsModel[column.field] = common;
                break;
            case 'maskededit':
                fieldsModel[column.field] = common;
                break;
        }
        if (!isNullOrUndefined(column.edit) && !isNullOrUndefined(column.edit.params)) {
            extend(fieldsModel[column.field], column.edit.params);
        }
        return fieldsModel;
    };
    DialogEdit.prototype.validateScheduleFields = function (args, column, ganttObj) {
        var dialog = ganttObj.editModule.dialogModule.dialog;
        var targetId = null;
        var inputElement;
        var currentData = ganttObj.editModule.dialogModule.editedRecord;
        if (!isNullOrUndefined(args.element)) {
            inputElement = args.element;
            targetId = inputElement.getAttribute('id');
        }
        else if (!isNullOrUndefined(args.container)) {
            inputElement = args.container;
            targetId = inputElement.querySelector('input').getAttribute('id');
            inputElement = inputElement.querySelector('#' + targetId);
        }
        else if (!isNullOrUndefined(args.event.path[1])) {
            inputElement = args.event.path[1];
            targetId = inputElement.querySelector('input').getAttribute('id');
            inputElement = inputElement.querySelector('#' + targetId);
        }
        var cellValue = inputElement.value;
        var colName = targetId.replace(ganttObj.element.id, '');
        this.validateScheduleValuesByCurrentField(colName, cellValue, this.editedRecord);
        var ganttProp = currentData.ganttProperties;
        var tasks = ganttObj.taskFields;
        if (!isNullOrUndefined(tasks.startDate)) {
            this.updateScheduleFields(dialog, ganttProp, 'startDate');
        }
        if (!isNullOrUndefined(tasks.endDate)) {
            this.updateScheduleFields(dialog, ganttProp, 'endDate');
        }
        if (!isNullOrUndefined(tasks.duration)) {
            this.updateScheduleFields(dialog, ganttProp, 'duration');
        }
        if (!isNullOrUndefined(tasks.work)) {
            this.updateScheduleFields(dialog, ganttProp, 'work');
        }
        this.dialogEditValidationFlag = false;
        return true;
    };
    DialogEdit.prototype.updateScheduleFields = function (dialog, ganttProp, ganttField) {
        var ganttObj = this.parent;
        var ganttId = ganttObj.element.id;
        var columnName = getValue(ganttField, ganttObj.columnMapping);
        var col = ganttObj.columnByField[columnName];
        var tempValue;
        if (col.editType === 'stringedit') {
            var textBox = dialog.querySelector('#' + ganttId + columnName).ej2_instances[0];
            tempValue = !isNullOrUndefined(col.edit) && !isNullOrUndefined(col.edit.read) ? col.edit.read() :
                !isNullOrUndefined(col.valueAccessor) ? col.valueAccessor(columnName, ganttObj.editModule.dialogModule.editedRecord, col) :
                    this.parent.dataOperation.getDurationString(ganttProp.duration, ganttProp.durationUnit);
            if (textBox.value !== tempValue.toString()) {
                textBox.value = tempValue;
                textBox.dataBind();
            }
        }
        else if (col.editType === 'datepickeredit' || col.editType === 'datetimepickeredit') {
            var picker = col.editType === 'datepickeredit' ?
                dialog.querySelector('#' + ganttId + columnName).ej2_instances[0] :
                dialog.querySelector('#' + ganttId + columnName).ej2_instances[0];
            tempValue = ganttProp[ganttField];
            if (((isNullOrUndefined(picker.value)) && !isNullOrUndefined(tempValue)) ||
                (isNullOrUndefined(tempValue) && !isNullOrUndefined(picker.value)) ||
                (picker.value !== tempValue && !isNullOrUndefined(picker.value) && !isNullOrUndefined(tempValue)
                    && picker.value.toString() !== tempValue.toString())) {
                picker.value = tempValue;
                picker.dataBind();
            }
        }
        else if (col.editType === 'numericedit') {
            var numericTextBox = dialog.querySelector('#' + ganttId + columnName).ej2_instances[0];
            tempValue = ganttProp[ganttField];
            if (!isNullOrUndefined(tempValue)) {
                numericTextBox.value = tempValue;
                numericTextBox.dataBind();
            }
        }
    };
    /**
     * @private
     */
    DialogEdit.prototype.validateDuration = function (ganttData) {
        var ganttProp = ganttData.ganttProperties;
        if (!this.dialogEditValidationFlag) {
            if (isNullOrUndefined(ganttProp.duration)) {
                this.parent.setRecordValue('endDate', null, ganttProp, true);
                this.parent.setRecordValue('isMilestone', false, ganttProp, true);
            }
            else if (isScheduledTask(ganttProp) || !isNullOrUndefined(ganttProp.startDate)) {
                if (ganttData.ganttProperties.isMilestone && ganttData.ganttProperties.duration !== 0) {
                    this.parent.dateValidationModule.calculateStartDate(ganttData);
                }
                this.parent.dateValidationModule.calculateEndDate(ganttData);
            }
            else if (!isScheduledTask(ganttProp) && !isNullOrUndefined(ganttProp.endDate)) {
                this.parent.dateValidationModule.calculateStartDate(ganttData);
            }
            var milestone = ganttProp.duration === 0 ? true : false;
            this.parent.setRecordValue('isMilestone', milestone, ganttProp, true);
            this.dialogEditValidationFlag = true;
        }
    };
    DialogEdit.prototype.validateStartDate = function (ganttData) {
        var ganttProp = ganttData.ganttProperties;
        var tasks = this.parent.taskFields;
        if (!this.dialogEditValidationFlag) {
            if (isNullOrUndefined(ganttProp.startDate)) {
                this.parent.setRecordValue('duration', null, ganttProp, true);
                this.parent.setRecordValue('isMilestone', false, ganttProp, true);
                if (this.parent.allowUnscheduledTasks && isNullOrUndefined(tasks.endDate)) {
                    this.parent.setRecordValue('endDate', null, ganttProp, true);
                }
            }
            else if (isScheduledTask(ganttProp)) {
                if (isNullOrUndefined(tasks.duration)) {
                    this.parent.dateValidationModule.calculateDuration(ganttData);
                }
                else if (isNullOrUndefined(tasks.endDate)) {
                    this.parent.dateValidationModule.calculateEndDate(ganttData);
                }
                else {
                    this.parent.dateValidationModule.calculateEndDate(ganttData);
                }
            }
            else {
                if (!isNullOrUndefined(ganttProp.endDate)) {
                    this.parent.dateValidationModule.calculateDuration(ganttData);
                }
                else if (!isNullOrUndefined(ganttProp.duration)) {
                    this.parent.dateValidationModule.calculateEndDate(ganttData);
                }
            }
            this.dialogEditValidationFlag = true;
        }
    };
    DialogEdit.prototype.validateEndDate = function (ganttData) {
        var ganttProp = ganttData.ganttProperties;
        var tasks = this.parent.taskFields;
        if (!this.dialogEditValidationFlag) {
            if (isNullOrUndefined(ganttProp.endDate)) {
                this.parent.setRecordValue('duration', null, ganttProp, true);
                this.parent.setRecordValue('isMilestone', false, ganttProp, true);
            }
            else if (isScheduledTask(ganttProp)) {
                if (isNullOrUndefined(tasks.duration)) {
                    this.parent.dateValidationModule.calculateDuration(ganttData);
                }
                else if (isNullOrUndefined(ganttProp.startDate)) {
                    this.parent.dateValidationModule.calculateStartDate(ganttData);
                }
                else {
                    this.parent.dateValidationModule.calculateDuration(ganttData);
                }
            }
            else {
                if (!isNullOrUndefined(ganttProp.duration)) {
                    this.parent.dateValidationModule.calculateStartDate(ganttData);
                }
                else if (!isNullOrUndefined(ganttProp.startDate)) {
                    this.parent.dateValidationModule.calculateDuration(ganttData);
                }
            }
            this.dialogEditValidationFlag = true;
        }
    };
    /**
     *
     * @param columnName
     * @param value
     * @param currentData
     * @private
     */
    DialogEdit.prototype.validateScheduleValuesByCurrentField = function (columnName, value, currentData) {
        var ganttObj = this.parent;
        var ganttProp = currentData.ganttProperties;
        var taskSettings = ganttObj.taskFields;
        if (taskSettings.duration === columnName) {
            if (!isNullOrUndefined(value) && value !== '') {
                ganttObj.dataOperation.updateDurationValue(value, ganttProp);
            }
            else {
                if (ganttObj.allowUnscheduledTasks) {
                    this.parent.setRecordValue('duration', null, ganttProp, true);
                }
            }
            this.validateDuration(currentData);
            this.parent.editModule.updateResourceRelatedFields(currentData, 'duration');
        }
        if (taskSettings.startDate === columnName) {
            if (value !== '') {
                var startDate = this.parent.dateValidationModule.getDateFromFormat(value);
                startDate = this.parent.dateValidationModule.checkStartDate(startDate);
                this.parent.setRecordValue('startDate', startDate, ganttProp, true);
            }
            else {
                if (ganttObj.allowUnscheduledTasks && !(currentData.hasChildRecords)) {
                    this.parent.setRecordValue('startDate', null, ganttProp, true);
                }
            }
            this.validateStartDate(currentData);
        }
        if (taskSettings.endDate === columnName) {
            if (value !== '') {
                var endDate = this.parent.dateValidationModule.getDateFromFormat(value);
                if (endDate.getHours() === 0 && ganttObj.defaultEndTime !== 86400) {
                    this.parent.dateValidationModule.setTime(ganttObj.defaultEndTime, endDate);
                }
                endDate = this.parent.dateValidationModule.checkEndDate(endDate, ganttProp);
                if (isNullOrUndefined(ganttProp.startDate) || endDate.getTime() > (ganttProp.startDate).getTime()) {
                    this.parent.setRecordValue('endDate', endDate, ganttProp, true);
                }
            }
            else {
                if (ganttObj.allowUnscheduledTasks) {
                    this.parent.setRecordValue('endDate', null, ganttProp, true);
                }
            }
            this.validateEndDate(currentData);
        }
        if (taskSettings.work === columnName) {
            if (!isNullOrUndefined(value) && value !== '') {
                this.parent.setRecordValue('work', value, ganttProp, true);
                this.parent.editModule.updateResourceRelatedFields(currentData, 'work');
                this.validateDuration(currentData);
            }
        }
        if (columnName === 'taskType') {
            this.parent.setRecordValue('taskType', value, ganttProp, true);
        }
        if (taskSettings.manual === columnName) {
            this.parent.editModule.updateTaskScheduleModes(currentData);
        }
        return true;
    };
    DialogEdit.prototype.getPredecessorModel = function (fields) {
        if (isNullOrUndefined(fields) || fields.length === 0) {
            fields = ['ID', 'Name', 'Type', 'Offset', 'UniqueId'];
        }
        var inputModel = {};
        inputModel.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' };
        inputModel.locale = this.parent.locale;
        inputModel.dataSource = [];
        inputModel.rowHeight = this.parent.isAdaptive ? 48 : null;
        inputModel.toolbar = [
            {
                id: this.parent.element.id + 'DependencyTabContainer' + '_add', prefixIcon: 'e-add',
                tooltipText: this.localeObj.getConstant('add'), align: 'Right',
                text: this.parent.isAdaptive ? '' : this.localeObj.getConstant('add')
            },
            {
                id: this.parent.element.id + 'DependencyTabContainer' + '_delete', prefixIcon: 'e-delete',
                tooltipText: this.localeObj.getConstant('delete'), align: 'Right',
                text: this.parent.isAdaptive ? '' : this.localeObj.getConstant('delete')
            },
        ];
        var columns = [];
        for (var i = 0; i < fields.length; i++) {
            var column = {};
            if (fields[i].toLowerCase() === 'id') {
                column = {
                    field: 'id', headerText: this.localeObj.getConstant('id'), allowEditing: false, width: '70px'
                };
                columns.push(column);
            }
            else if (fields[i].toLowerCase() === 'name') {
                column = {
                    field: 'name', headerText: this.localeObj.getConstant('name'), editType: 'stringedit', width: '250px',
                    validationRules: { required: true }
                };
                columns.push(column);
            }
            else if (fields[i].toLowerCase() === 'type') {
                column = {
                    field: 'type', headerText: this.localeObj.getConstant('type'), editType: 'dropdownedit',
                    dataSource: this.types, foreignKeyField: 'id', foreignKeyValue: 'text',
                    defaultValue: 'FS', validationRules: { required: true }, width: '150px'
                };
                columns.push(column);
            }
            else if (fields[i].toLowerCase() === 'offset') {
                column = {
                    field: 'offset', headerText: this.localeObj.getConstant('offset'), editType: 'stringedit',
                    defaultValue: '0 days', validationRules: { required: true }, width: '100px'
                };
                columns.push(column);
            }
            else if (fields[i].toLowerCase() === 'uniqueid') {
                column = {
                    field: 'uniqueId', isPrimaryKey: true, visible: false, defaultValue: getUid().toString()
                };
                columns.push(column);
            }
        }
        inputModel.columns = columns;
        inputModel.height = this.parent.isAdaptive ? '100%' : '153px';
        return inputModel;
    };
    DialogEdit.prototype.getResourcesModel = function (fields) {
        var ganttObj = this.parent;
        var resourceSettings = ganttObj.resourceFields;
        if (isNullOrUndefined(fields) || fields.length === 0) {
            fields = [resourceSettings.id, resourceSettings.name, resourceSettings.unit, resourceSettings.group];
        }
        var inputModel = {
            allowFiltering: true,
            treeColumnIndex: 5,
            editSettings: { allowEditing: true, mode: 'Cell' },
            locale: this.parent.locale,
            allowSelection: true,
            rowHeight: this.parent.isAdaptive ? 48 : null,
            filterSettings: { type: 'Menu' },
            selectionSettings: { checkboxOnly: true, checkboxMode: 'Default', persistSelection: true, type: 'Multiple' }
        };
        var columns = [
            { type: 'checkbox', allowEditing: false, allowSorting: false, allowFiltering: false, width: 60 },
        ];
        for (var i = 0; i < fields.length; i++) {
            var column = {};
            if (fields[i] === resourceSettings.id) {
                column = {
                    field: resourceSettings.id,
                    headerText: this.localeObj.getConstant('id'), isPrimaryKey: true, width: '100px',
                    allowEditing: false
                };
                columns.push(column);
            }
            else if (fields[i] === resourceSettings.name) {
                column = {
                    field: resourceSettings.name, headerText: this.localeObj.getConstant('name'),
                    allowEditing: false
                };
                columns.push(column);
            }
            else if (fields[i] === resourceSettings.unit) {
                column = {
                    field: resourceSettings.unit,
                    headerText: this.localeObj.getConstant('unit'),
                    editType: 'numericedit',
                    edit: { params: { min: 0 } }
                };
                columns.push(column);
            }
            else if (fields[i] === resourceSettings.group && !isNullOrUndefined(resourceSettings.group)) {
                column = {
                    field: resourceSettings.group,
                    headerText: this.localeObj.getConstant('group'),
                    allowEditing: false
                };
                columns.push(column);
            }
        }
        inputModel.columns = columns;
        inputModel.height = this.parent.isAdaptive ? '100%' : '196px';
        return inputModel;
    };
    DialogEdit.prototype.getNotesModel = function (fields) {
        if (isNullOrUndefined(fields) || fields.length === 0) {
            fields = ['Bold', 'Italic', 'Underline', 'StrikeThrough',
                'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
                'LowerCase', 'UpperCase', '|',
                'Alignments', 'OrderedList', 'UnorderedList',
                'Outdent', 'Indent', '|', 'CreateTable',
                'CreateLink', '|', 'ClearFormat', 'Print',
                '|', 'Undo', 'Redo'];
        }
        var inputModel = {
            placeholder: this.localeObj.getConstant('writeNotes'),
            toolbarSettings: {
                items: fields
            },
            height: this.parent.isAdaptive ? '100%' : 'auto',
            locale: this.parent.locale
        };
        return inputModel;
    };
    DialogEdit.prototype.createDivElement = function (className, id) {
        return createElement('div', { className: className, id: id });
    };
    DialogEdit.prototype.createInputElement = function (className, id, fieldName, type) {
        return createElement(type || 'input', {
            className: className, attrs: {
                type: 'text', id: id, name: fieldName,
                title: fieldName
            }
        });
    };
    DialogEdit.prototype.renderTabItems = function () {
        var tabModel = this.beforeOpenArgs.tabModel;
        var items = tabModel.items;
        var index = 0;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.content instanceof HTMLElement) {
                continue;
            }
            else if (item.content === 'General') {
                item.content = this.renderGeneralTab(item.content);
            }
            else if (item.content === 'Dependency') {
                if (this.editedRecord.hasChildRecords) {
                    item.disabled = true;
                }
                item.content = this.renderPredecessorTab(item.content);
            }
            else if (item.content === 'Resources') {
                item.content = this.renderResourceTab(item.content);
            }
            else if (item.content === ('Custom' + '' + index)) {
                item.content = this.renderCustomTab(item.content);
                index++;
            }
            else if (item.content === 'Notes') {
                item.content = this.renderNotesTab(item.content);
            }
        }
    };
    DialogEdit.prototype.renderGeneralTab = function (itemName) {
        var ganttObj = this.parent;
        var itemModel = this.beforeOpenArgs[itemName];
        var divElement = this.createDivElement('e-edit-form-row', ganttObj.element.id
            + '' + itemName + 'TabContainer');
        for (var _i = 0, _a = Object.keys(itemModel); _i < _a.length; _i++) {
            var key = _a[_i];
            if (this.parent.columnByField[key].visible === false) {
                continue;
            }
            var column = this.parent.columnByField[key];
            var inputModel = itemModel[key];
            divElement.appendChild(this.renderInputElements(inputModel, column));
        }
        return divElement;
    };
    DialogEdit.prototype.isCheckIsDisabled = function (column) {
        var disabled = false;
        if (column.allowEditing === false || column.isPrimaryKey || this.parent.readOnly) {
            if (this.parent.customColumns.indexOf(column.field) !== -1) {
                disabled = true;
            }
            else {
                if (column.field === this.parent.taskFields.id) {
                    disabled = true;
                }
                else if (column.field === this.parent.taskFields.name) {
                    disabled = true;
                }
                else if (column.field === this.parent.taskFields.duration) {
                    disabled = true;
                }
                else if (column.field === this.parent.taskFields.progress) {
                    disabled = true;
                }
                else if (column.field === this.parent.taskFields.startDate) {
                    disabled = true;
                }
                else if (column.field === this.parent.taskFields.endDate) {
                    disabled = true;
                }
                else if (column.field === this.parent.taskFields.baselineStartDate) {
                    disabled = true;
                }
                else if (column.field === this.parent.taskFields.baselineEndDate) {
                    disabled = true;
                }
                else if (column.field === this.parent.taskFields.work) {
                    disabled = true;
                }
                else if (column.field === 'taskType') {
                    disabled = true;
                }
            }
        }
        if (this.isEdit) {
            if (column.field === this.parent.taskFields.id) {
                disabled = true;
            }
            if (this.editedRecord.hasChildRecords) {
                if (column.field === this.parent.taskFields.endDate) {
                    disabled = true;
                }
                else if (column.field === this.parent.taskFields.duration) {
                    disabled = true;
                }
                else if (column.field === this.parent.taskFields.progress) {
                    disabled = true;
                }
                else if (column.field === this.parent.taskFields.work) {
                    disabled = true;
                }
                else if (column.field === 'taskType') {
                    disabled = true;
                }
            }
        }
        return disabled;
    };
    DialogEdit.prototype.renderPredecessorTab = function (itemName) {
        var _this = this;
        var ganttObj = this.parent;
        var gridModel = this.beforeOpenArgs[itemName];
        var dependencyColumn = this.parent.columnByField[this.parent.taskFields.dependency];
        if (dependencyColumn.allowEditing === false || dependencyColumn.isPrimaryKey || this.parent.readOnly) {
            gridModel.editSettings.allowEditing = false;
            gridModel.editSettings.allowAdding = false;
            gridModel.editSettings.allowDeleting = false;
        }
        var ganttData = this.beforeOpenArgs.rowData;
        var preData = [];
        this.taskNameCollection();
        if (this.isEdit) {
            preData = this.predecessorEditCollection(ganttData);
            this.updatePredecessorDropDownData(ganttData);
        }
        gridModel.dataSource = preData;
        var columns = gridModel.columns;
        columns[1].edit = {
            write: function (args) {
                if (getValue('requestType', args) === 'add') {
                    setValue('rowData.uniqueId', getUid(), args);
                }
                var field = 'name';
                var autoObj = new ComboBox({
                    dataSource: new DataManager(_this.preTableCollection),
                    popupHeight: '180px',
                    allowCustom: false,
                    fields: { value: 'text' },
                    value: args.rowData[field],
                    change: function (args) {
                        var tr = closest(args.element, 'tr');
                        var idInput = tr.querySelector('#' + _this.parent.element.id + 'DependencyTabContainerid');
                        if (idInput) {
                            if (!isNullOrUndefined(args.itemData) && !isNullOrUndefined(args.item)) {
                                idInput.value = args.itemData.id;
                            }
                            else {
                                idInput.value = '';
                            }
                        }
                    },
                    autofill: true,
                });
                autoObj.appendTo(args.element);
            },
            read: function (args) {
                var ej2Instance = args.ej2_instances[0];
                return ej2Instance.value;
            }
        };
        Grid.Inject(Edit, Page, GridToolbar, ForeignKey);
        var gridObj = new Grid(gridModel);
        var divElement = this.createDivElement('e-dependent-div', ganttObj.element.id + '' + itemName + 'TabContainer');
        gridObj.appendTo(divElement);
        return divElement;
    };
    DialogEdit.prototype.updateResourceCollection = function (args, resourceTreeGridId) {
        if (!isNullOrUndefined(args.data) && Object.keys(args.data).length) {
            var ganttObj = this.parent;
            var treeGridId = ganttObj.element.querySelector('#' + resourceTreeGridId);
            var resourceTreeGrid = treeGridId.ej2_instances[0];
            if (!isNullOrUndefined(resourceTreeGrid) && resourceTreeGrid.getSelectedRecords().length > 0) {
                var tempRecords = resourceTreeGrid.getSelectedRecords();
                var index = void 0;
                var selectedItems = [];
                for (index = 0; index < tempRecords.length; index++) {
                    selectedItems.push(tempRecords[index].taskData);
                }
                this.ganttResources = extend([], selectedItems);
            }
            else {
                this.ganttResources = [];
            }
        }
        else {
            this.ganttResources = [];
        }
    };
    DialogEdit.prototype.renderResourceTab = function (itemName) {
        var _this = this;
        var ganttObj = this.parent;
        var resourceSettings = ganttObj.resourceFields;
        var ganttData = this.beforeOpenArgs.rowData;
        var rowResource = ganttData.ganttProperties.resourceInfo;
        var inputModel = this.beforeOpenArgs[itemName];
        var resourceTreeGridId = ganttObj.element.id + '' + itemName + 'TabContainer';
        var resourceData = extend([], [], ganttObj.resources, true);
        this.parent.dataOperation.updateResourceUnit(resourceData);
        if (!isNullOrUndefined(rowResource)) {
            var count = void 0;
            var rowResourceLength = rowResource.length;
            var index = void 0;
            var resourceDataLength = resourceData.length;
            for (count = 0; count < rowResourceLength; count++) {
                for (index = 0; index < resourceDataLength; index++) {
                    if (rowResource[count][resourceSettings.id] === resourceData[index][resourceSettings.id]) {
                        resourceData[index][resourceSettings.unit] = rowResource[count][resourceSettings.unit];
                    }
                }
            }
        }
        inputModel.dataSource = resourceData;
        var resourceInfo = ganttData.ganttProperties.resourceInfo;
        if (this.isEdit && !isNullOrUndefined(resourceInfo)) {
            for (var i = 0; i < resourceInfo.length; i++) {
                this.ganttResources.push(resourceInfo[i]);
            }
        }
        inputModel.rowSelected = function (args) {
            _this.updateResourceCollection(args, resourceTreeGridId);
        };
        inputModel.rowDeselected = function (args) {
            _this.updateResourceCollection(args, resourceTreeGridId);
        };
        var divElement = this.createDivElement('e-resource-div', resourceTreeGridId);
        TreeGrid.Inject(Selection, Filter, TreeGridEdit);
        var treeGridObj = new TreeGrid(inputModel);
        var resourceColumn = this.parent.columnByField[this.parent.taskFields.resourceInfo];
        if (resourceColumn.allowEditing === false || resourceColumn.isPrimaryKey || this.parent.readOnly) {
            treeGridObj.allowSelection = false;
            treeGridObj.allowFiltering = false;
            treeGridObj.editSettings.allowEditing = false;
        }
        treeGridObj.appendTo(divElement);
        return divElement;
    };
    DialogEdit.prototype.renderCustomTab = function (itemName) {
        return this.renderGeneralTab(itemName);
    };
    DialogEdit.prototype.renderNotesTab = function (itemName) {
        var ganttObj = this.parent;
        var inputModel = this.beforeOpenArgs[itemName];
        var ganttProp = this.editedRecord.ganttProperties;
        var divElement = this.createDivElement('', ganttObj.element.id + '' + itemName + 'TabContainer');
        RichTextEditor.Inject(RTEToolbar, Link, HtmlEditor, QuickToolbar, Count);
        inputModel.value = ganttProp.notes;
        var notesColumn = this.parent.columnByField[this.parent.taskFields.notes];
        if (notesColumn.allowEditing === false || notesColumn.isPrimaryKey || this.parent.readOnly) {
            inputModel.enabled = false;
        }
        var rteObj = new RichTextEditor(inputModel);
        rteObj.appendTo(divElement);
        return divElement;
    };
    DialogEdit.prototype.renderInputElements = function (inputModel, column) {
        var _this = this;
        var ganttId = this.parent.element.id;
        var ganttData = this.editedRecord;
        var divElement = this.createDivElement('e-edit-form-column');
        var inputElement;
        var editArgs = { column: column, data: ganttData };
        if (!isNullOrUndefined(column.edit) && isNullOrUndefined(column.edit.params)) {
            var create = column.edit.create;
            if (typeof create !== 'string') {
                inputElement = column.edit.create(editArgs);
                inputElement.className = '';
                inputElement.setAttribute('type', 'text');
                inputElement.setAttribute('id', ganttId + '' + column.field);
                inputElement.setAttribute('name', column.field);
                inputElement.setAttribute('title', column.field);
                divElement.appendChild(inputElement);
            }
        }
        else {
            inputElement = this.createInputElement('', ganttId + '' + column.field, column.field);
            divElement.appendChild(inputElement);
        }
        inputModel.enabled = !this.isCheckIsDisabled(column);
        if (column.field === this.parent.taskFields.duration) {
            if (!isNullOrUndefined(column.valueAccessor)) {
                inputModel.value = column.valueAccessor(column.field, ganttData, column);
            }
            else if (isNullOrUndefined(column.edit)) {
                var ganttProp = ganttData.ganttProperties;
                inputModel.value = this.parent.dataOperation.getDurationString(ganttProp.duration, ganttProp.durationUnit);
            }
        }
        else {
            if (column.editType === 'booleanedit') {
                if (ganttData[column.field] === true) {
                    inputModel.checked = true;
                }
                else {
                    inputModel.checked = false;
                }
            }
            else {
                inputModel.value = ganttData[column.field];
            }
        }
        if (!isNullOrUndefined(column.edit) && isNullOrUndefined(column.edit.params)) {
            var write = column.edit.write;
            if (typeof write !== 'string') {
                var inputObj = column.edit.write({ column: column, rowData: ganttData, element: inputElement });
                if (column.field === this.parent.taskFields.duration) {
                    inputObj.change = function (args) {
                        _this.validateScheduleFields(args, column, _this.parent);
                    };
                }
            }
        }
        else {
            var inputObj = new this.inputs[column.editType](inputModel);
            inputObj.appendTo(inputElement);
        }
        return divElement;
    };
    ;
    DialogEdit.prototype.taskNameCollection = function () {
        var flatData = this.parent.flatData;
        this.preTaskIds = [];
        this.preTableCollection = [];
        for (var i = 0; i < flatData.length; i++) {
            var data = flatData[i];
            if (data.hasChildRecords) {
                continue;
            }
            var taskId = this.parent.viewType === 'ResourceView' ? data.ganttProperties.taskId.toString()
                : data.ganttProperties.rowUniqueID.toString();
            var tempObject = {
                id: taskId,
                text: (taskId + '-' + data.ganttProperties.taskName),
                value: taskId
            };
            this.preTaskIds.push(tempObject.id);
            this.preTableCollection.push(tempObject);
        }
    };
    DialogEdit.prototype.predecessorEditCollection = function (ganttData) {
        var preDataCollection = [];
        var ganttProp = ganttData.ganttProperties;
        if (this.isEdit && !isNullOrUndefined(this.parent.taskFields.dependency) && !isNullOrUndefined(ganttData) &&
            !isNullOrUndefined(ganttProp.predecessor)) {
            var predecessor = ganttProp.predecessor;
            var idCollection = this.preTableCollection;
            for (var i = 0; i < predecessor.length; i++) {
                var from = predecessor[i].from.toString();
                var preData = {};
                var taskID = this.parent.viewType === 'ResourceView' ? ganttProp.taskId : ganttProp.rowUniqueID;
                if (taskID.toString() !== from) {
                    preData.id = from;
                    for (var index = 0; index < idCollection.length; index++) {
                        if (idCollection[index].value === from) {
                            preData.name = idCollection[index].text;
                            break;
                        }
                    }
                    preData.type = predecessor[i].type;
                    var offset = predecessor[i].offset;
                    var offsetUnit = predecessor[i].offsetUnit;
                    preData.offset = this.parent.dataOperation.getDurationString(offset, offsetUnit);
                    preData.uniqueId = getUid();
                    preDataCollection.push(preData);
                }
            }
        }
        return preDataCollection;
    };
    DialogEdit.prototype.updatePredecessorDropDownData = function (ganttData) {
        var index = -1;
        var id = this.parent.viewType === 'ResourceView' ? ganttData.ganttProperties.taskId.toString()
            : ganttData.ganttProperties.rowUniqueID.toString();
        index = this.preTaskIds.indexOf(id);
        this.preTableCollection.splice(index, 1);
        this.preTaskIds.splice(index, 1);
        this.validSuccessorTasks(ganttData, this.preTaskIds, this.preTableCollection);
    };
    DialogEdit.prototype.validSuccessorTasks = function (data, ids, idCollection) {
        var _this = this;
        var ganttProp = data.ganttProperties;
        if (ganttProp.predecessor && ganttProp.predecessor.length > 0) {
            var predecessor = ganttProp.predecessor;
            var fromId_1 = this.parent.viewType === 'ResourceView' ? ganttProp.taskId.toString() : ganttProp.rowUniqueID.toString();
            predecessor.forEach(function (item) {
                if (item.from.toString() === fromId_1) {
                    var toId = item.to;
                    var idIndex = -1;
                    idIndex = ids.indexOf(toId);
                    if (idIndex > -1) {
                        ids.splice(idIndex, 1);
                        idCollection.splice(idIndex, 1);
                    }
                    var ganttData = _this.parent.connectorLineModule.getRecordByID(toId);
                    _this.validSuccessorTasks(ganttData, ids, idCollection);
                }
            });
        }
    };
    DialogEdit.prototype.getPredecessorType = function () {
        var typeText = [this.parent.getPredecessorTextValue('SS'), this.parent.getPredecessorTextValue('SF'),
            this.parent.getPredecessorTextValue('FS'), this.parent.getPredecessorTextValue('FF')];
        var types = [
            { id: 'FS', text: typeText[2], value: typeText[2] },
            { id: 'FF', text: typeText[3], value: typeText[3] },
            { id: 'SS', text: typeText[0], value: typeText[0] },
            { id: 'SF', text: typeText[1], value: typeText[1] }
        ];
        return types;
    };
    DialogEdit.prototype.initiateDialogSave = function () {
        if (this.isEdit) {
            this.parent.initiateEditAction(true);
        }
        else {
            this.addedRecord = {};
        }
        var ganttObj = this.parent;
        var tabModel = this.beforeOpenArgs.tabModel;
        var items = tabModel.items;
        for (var i = 0; i < items.length; i++) {
            var element = items[i].content;
            var id = element.id;
            if (!isNullOrUndefined(id) || id !== '') {
                id = id.replace(ganttObj.element.id, '');
                id = id.replace('TabContainer', '');
                if (id === 'General') {
                    this.updateGeneralTab(element, false);
                }
                else if (id === 'Dependency') {
                    this.updatePredecessorTab(element);
                }
                else if (id === 'Notes') {
                    this.updateNotesTab(element);
                }
                else if (id === 'Resources') {
                    this.updateResourceTab(element);
                }
                else if (id.indexOf('Custom') !== -1) {
                    this.updateCustomTab(element);
                }
            }
        }
        if (this.isEdit) {
            /**
             * If any update on edited task do it here
             */
            this.parent.dataOperation.updateWidthLeft(this.rowData);
            var editArgs = {
                data: this.rowData,
                action: 'DialogEditing'
            };
            this.parent.editModule.initiateUpdateAction(editArgs);
        }
        else {
            if (this.parent.viewType === 'ResourceView') {
                var newRecords = extend({}, this.addedRecord, true);
                if (newRecords[this.parent.taskFields.resourceInfo].length) {
                    for (var i = 0; i < newRecords[this.parent.taskFields.resourceInfo].length; i++) {
                        var id = newRecords[this.parent.taskFields.resourceInfo][i].toString();
                        var parentRecordIndex = this.parent.getTaskIds().indexOf('R' + id.toString());
                        if (parentRecordIndex !== -1) {
                            this.parent.editModule.addRecord(this.addedRecord, 'Child', parentRecordIndex);
                            break;
                        }
                    }
                }
                else {
                    this.parent.editModule.addRecord(this.addedRecord, 'Bottom');
                }
            }
            else {
                this.parent.editModule.addRecord(this.addedRecord, this.parent.editSettings.newRowPosition);
            }
        }
        return true;
    };
    DialogEdit.prototype.updateGeneralTab = function (generalForm, isCustom) {
        var ganttObj = this.parent;
        var childNodes = generalForm.childNodes;
        var tasksData = {};
        if (!this.isEdit) {
            tasksData = this.addedRecord;
        }
        for (var i = 0; i < childNodes.length; i++) {
            var div = childNodes[i];
            var inputElement = div.querySelector('input[id^="' + ganttObj.element.id + '"]');
            if (inputElement) {
                var fieldName = inputElement.id.replace(ganttObj.element.id, '');
                var controlObj = div.querySelector('#' + ganttObj.element.id + fieldName).ej2_instances[0];
                var column = ganttObj.columnByField[fieldName];
                if (!isNullOrUndefined(column.edit) && isNullOrUndefined(column.edit.params)) {
                    var read = column.edit.read;
                    if (typeof read !== 'string') {
                        tasksData[fieldName] = column.edit.read(inputElement, controlObj.value);
                    }
                }
                else if (isCustom && column.editType === 'booleanedit') {
                    if (inputElement.checked === true) {
                        tasksData[fieldName] = true;
                    }
                    else {
                        tasksData[fieldName] = false;
                    }
                }
                else {
                    tasksData[fieldName] = controlObj.value;
                }
            }
        }
        if (this.isEdit) {
            this.updateScheduleProperties(this.editedRecord, this.rowData);
            ganttObj.editModule.validateUpdateValues(tasksData, this.rowData, true);
        }
    };
    DialogEdit.prototype.updateScheduleProperties = function (fromRecord, toRecord) {
        this.parent.setRecordValue('startDate', fromRecord.ganttProperties.startDate, toRecord.ganttProperties, true);
        this.parent.setRecordValue('endDate', fromRecord.ganttProperties.endDate, toRecord.ganttProperties, true);
        this.parent.setRecordValue('duration', fromRecord.ganttProperties.duration, toRecord.ganttProperties, true);
        this.parent.setRecordValue('durationUnit', fromRecord.ganttProperties.durationUnit, toRecord.ganttProperties, true);
        this.parent.setRecordValue('work', fromRecord.ganttProperties.work, toRecord.ganttProperties, true);
        if (!isNullOrUndefined(this.parent.taskFields.startDate)) {
            this.parent.dataOperation.updateMappingData(this.rowData, this.parent.taskFields.startDate);
        }
        if (!isNullOrUndefined(this.parent.taskFields.endDate)) {
            this.parent.dataOperation.updateMappingData(this.rowData, this.parent.taskFields.endDate);
        }
        if (!isNullOrUndefined(this.parent.taskFields.duration)) {
            this.parent.dataOperation.updateMappingData(this.rowData, this.parent.taskFields.duration);
            this.parent.setRecordValue('durationUnit', fromRecord.ganttProperties.durationUnit, this.rowData, true);
            if (this.rowData.ganttProperties.duration === 0) {
                this.parent.setRecordValue('isMilestone', true, this.rowData.ganttProperties, true);
            }
            else {
                this.parent.setRecordValue('isMilestone', false, this.rowData.ganttProperties, true);
            }
        }
        if (!isNullOrUndefined(this.parent.taskFields.work)) {
            this.parent.dataOperation.updateMappingData(this.rowData, this.parent.taskFields.work);
        }
        if (!isNullOrUndefined(this.parent.taskFields.manual)) {
            this.parent.dataOperation.updateMappingData(this.rowData, this.parent.taskFields.manual);
        }
    };
    DialogEdit.prototype.updatePredecessorTab = function (preElement) {
        var gridObj = preElement.ej2_instances[0];
        if (gridObj.isEdit) {
            gridObj.endEdit();
        }
        var dataSource = gridObj.dataSource;
        var predecessorName = [];
        var newValues = [];
        var predecessorString = '';
        var ids = [];
        for (var i = 0; i < dataSource.length; i++) {
            var preData = dataSource[i];
            var newId = preData.name.split('-')[0];
            if (preData.id !== newId) {
                preData.id = newId;
            }
            if (ids.indexOf(preData.id) === -1) {
                var name_1 = preData.id + preData.type;
                if (preData.offset && preData.offset.indexOf('-') !== -1) {
                    name_1 += preData.offset;
                }
                else {
                    name_1 += ('+' + preData.offset);
                }
                predecessorName.push(name_1);
                ids.push(preData.id);
            }
        }
        if (this.isEdit) {
            if (predecessorName.length > 0) {
                newValues = this.parent.predecessorModule.calculatePredecessor(predecessorName.join(','), this.rowData);
                this.parent.setRecordValue('predecessor', newValues, this.rowData.ganttProperties, true);
                predecessorString = this.parent.predecessorModule.getPredecessorStringValue(this.rowData);
            }
            else {
                newValues = [];
                this.parent.setRecordValue('predecessor', newValues, this.rowData.ganttProperties, true);
                predecessorString = '';
            }
            this.parent.setRecordValue('predecessorsName', predecessorString, this.rowData.ganttProperties, true);
            this.parent.setRecordValue('taskData.' + this.parent.taskFields.dependency, predecessorString, this.rowData);
            this.parent.setRecordValue(this.parent.taskFields.dependency, predecessorString, this.rowData);
            this.parent.predecessorModule.updateUnscheduledDependency(this.rowData);
        }
        else {
            this.addedRecord[this.parent.taskFields.dependency] = predecessorName.length > 0 ? predecessorName.join(',') : '';
        }
    };
    DialogEdit.prototype.updateResourceTab = function (resourceElement) {
        var treeGridObj = resourceElement.ej2_instances[0];
        if (treeGridObj) {
            treeGridObj.grid.endEdit();
        }
        var selectedItems = this.ganttResources;
        if (this.parent.viewType === 'ResourceView' && !isNullOrUndefined(this.rowData.ganttProperties)) {
            if (JSON.stringify(this.ganttResources) !== JSON.stringify(this.rowData.ganttProperties.resourceInfo)) {
                this.isResourceUpdate = true;
                this.previousResource = !isNullOrUndefined(this.rowData.ganttProperties.resourceInfo) ? this.rowData.ganttProperties.resourceInfo.slice() : [];
            }
            else {
                this.isResourceUpdate = false;
            }
        }
        var idArray = [];
        if (this.isEdit) {
            this.parent.setRecordValue('resourceInfo', selectedItems, this.rowData.ganttProperties, true);
            this.parent.dataOperation.updateMappingData(this.rowData, 'resourceInfo');
            this.parent.editModule.updateResourceRelatedFields(this.rowData, 'resource');
            this.validateDuration(this.rowData);
        }
        else {
            for (var i = 0; i < selectedItems.length; i++) {
                idArray.push(selectedItems[i][this.parent.resourceFields.id]);
                this.isAddNewResource = true;
            }
            this.addedRecord[this.parent.taskFields.resourceInfo] = idArray;
        }
    };
    DialogEdit.prototype.updateNotesTab = function (notesElement) {
        var ganttObj = this.parent;
        var rte = notesElement.ej2_instances[0];
        if (this.isEdit) {
            this.parent.setRecordValue('notes', rte.getHtml(), this.rowData.ganttProperties, true);
            ganttObj.dataOperation.updateMappingData(this.rowData, 'notes');
        }
        else {
            this.addedRecord[this.parent.taskFields.notes] = rte.getHtml();
        }
    };
    DialogEdit.prototype.updateCustomTab = function (customElement) {
        this.updateGeneralTab(customElement, true);
    };
    return DialogEdit;
}());
export { DialogEdit };
