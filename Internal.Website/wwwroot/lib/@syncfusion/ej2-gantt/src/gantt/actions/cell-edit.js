import { isNullOrUndefined as isNOU, getValue, isBlazor, getElement, extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { TreeGrid, Edit } from '@syncfusion/ej2-treegrid';
import { Deferred } from '@syncfusion/ej2-data';
/**
 * To handle cell edit action on default columns and custom columns
 */
var CellEdit = /** @class */ (function () {
    function CellEdit(ganttObj) {
        /**
         * @private
         */
        this.isCellEdit = false;
        this.parent = ganttObj;
        this.bindTreeGridProperties();
    }
    /**
     * Bind all editing related properties from Gantt to TreeGrid
     */
    CellEdit.prototype.bindTreeGridProperties = function () {
        this.parent.treeGrid.editSettings.allowEditing = this.parent.editSettings.allowEditing;
        this.parent.treeGrid.editSettings.mode = 'Cell';
        this.parent.treeGrid.cellEdit = this.ensureEditCell.bind(this);
        if (this.parent.editSettings.allowEditing) {
            TreeGrid.Inject(Edit);
        }
    };
    /**
     * Ensure current cell was editable or not
     * @param args
     */
    CellEdit.prototype.ensureEditCell = function (args) {
        var _this = this;
        var data = args.rowData;
        var field = args.columnName;
        this.editedColumn = this.parent.getColumnByField(field, this.parent.ganttColumns);
        var taskSettings = this.parent.taskFields;
        if (this.parent.readOnly) {
            args.cancel = true;
            return;
        }
        if (this.parent.editSettings.mode === 'Dialog') {
            args.cancel = true;
            return;
        }
        if (data.hasChildRecords && (field === taskSettings.endDate || field === taskSettings.duration
            || field === taskSettings.dependency || field === taskSettings.progress
            || field === taskSettings.work || field === 'taskType')) {
            args.cancel = true;
        }
        else {
            var callBackPromise_1 = new Deferred();
            this.parent.trigger('cellEdit', args, function (args) {
                if (isBlazor()) {
                    args.cell = getElement(args.cell);
                    args.row = getElement(args.row);
                }
                if (data.level === 0 && _this.parent.viewType === 'ResourceView') {
                    args.cancel = true;
                }
                callBackPromise_1.resolve(args);
                if (!args.cancel) {
                    if (args.columnName === _this.parent.taskFields.notes) {
                        _this.openNotesEditor(args);
                    }
                    else {
                        _this.isCellEdit = true;
                        if (!isNOU(_this.parent.toolbarModule)) {
                            _this.parent.toolbarModule.refreshToolbarItems();
                        }
                    }
                }
            });
            return callBackPromise_1;
        }
    };
    /**
     * To render edit dialog and to focus on notes tab
     * @param args
     */
    CellEdit.prototype.openNotesEditor = function (args) {
        var taskSettings = this.parent.taskFields;
        var data = args.rowData;
        var field = args.columnName;
        if ((field === taskSettings.notes && !this.parent.showInlineNotes)) {
            args.cancel = true;
            var columnTypes = this.parent.editModule.dialogModule.updatedEditFields.map(function (x) { return x.type; });
            var index = columnTypes.indexOf('Notes');
            if (index !== -1) {
                this.parent.editModule.dialogModule.openEditDialog(data.ganttProperties.rowUniqueID);
                var tabObj = document.getElementById(this.parent.element.id + '_Tab').ej2_instances[0];
                tabObj.selectedItem = index;
            }
        }
        if (field === taskSettings.notes && this.parent.showInlineNotes === true) {
            this.isCellEdit = true;
        }
    };
    CellEdit.prototype.isValueChange = function (args, field) {
        var data = getValue('data', args);
        var editedValue = data[field];
        var previousValue = getValue('previousData', args);
        if ((isNOU(editedValue) && !isNOU(previousValue)) || (!isNOU(editedValue) && isNOU(previousValue))) {
            return true;
        }
        else if (!isNOU(editedValue) && !isNOU(previousValue)) {
            if (editedValue instanceof Date) {
                return editedValue.getTime() !== data.taskData[field].getTime() ? true : false;
            }
            else if (field === this.parent.taskFields.resourceInfo) {
                return editedValue !== previousValue ? true : false;
            }
            else if (editedValue !== data.taskData[field]) {
                return true;
            }
        }
        return false;
    };
    /**
     * Initiate cell save action on Gantt with arguments from TreeGrid
     * @param args
     * @param editedObj
     * @private
     */
    CellEdit.prototype.initiateCellEdit = function (args, editedObj) {
        var column = getValue('column', args);
        var data = getValue('data', args);
        var editedArgs = {};
        editedArgs.action = 'CellEditing';
        editedArgs.data = this.parent.getTaskByUniqueID(data.uniqueID);
        var previousValue = getValue('previousData', args);
        var editedValue = this.parent.allowUnscheduledTasks ? data[column.field] : ((isNullOrUndefined(data[column.field])
            || data[column.field] === '') && (this.parent.taskFields.duration === column.field ||
            this.parent.taskFields.startDate === column.field || this.parent.taskFields.endDate === column.field)) ? previousValue
            : data[column.field];
        if (!isNOU(data)) {
            data[column.field] = previousValue;
            editedArgs.data[column.field] = previousValue;
            this.parent.initiateEditAction(true);
            this.parent.setRecordValue(column.field, editedValue, editedArgs.data);
            if (column.field === this.parent.taskFields.name) {
                this.taskNameEdited(editedArgs);
            }
            else if (column.field === this.parent.taskFields.startDate) {
                this.startDateEdited(editedArgs);
            }
            else if (column.field === this.parent.taskFields.endDate) {
                this.endDateEdited(editedArgs);
            }
            else if (column.field === this.parent.taskFields.duration) {
                this.durationEdited(editedArgs);
            }
            else if (column.field === this.parent.taskFields.resourceInfo) {
                this.resourceEdited(editedArgs, editedObj, data);
            }
            else if (column.field === this.parent.taskFields.progress) {
                this.progressEdited(editedArgs);
            }
            else if (column.field === this.parent.taskFields.baselineStartDate
                || column.field === this.parent.taskFields.baselineEndDate) {
                this.baselineEdited(editedArgs);
            }
            else if (column.field === this.parent.taskFields.dependency) {
                this.dependencyEdited(editedArgs, previousValue);
            }
            else if (column.field === this.parent.taskFields.notes) {
                this.notedEdited(editedArgs);
            }
            else if (column.field === this.parent.taskFields.work) {
                this.workEdited(editedArgs);
            }
            else if (column.field === 'taskType' && !isNOU(this.parent.taskFields.work)) {
                this.typeEdited(editedArgs, editedObj);
            }
            else if (column.field === this.parent.taskFields.manual) {
                this.taskmodeEdited(editedArgs);
            }
            else {
                this.parent.setRecordValue('taskData.' + column.field, editedArgs.data[column.field], editedArgs.data);
                this.parent.editModule.initiateSaveAction(editedArgs);
            }
        }
        else {
            this.parent.editModule.endEditAction(args);
        }
        this.isCellEdit = false;
        if (!isNOU(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems();
        }
    };
    /**
     * To update task name cell with new value
     * @param args
     */
    CellEdit.prototype.taskNameEdited = function (args) {
        this.parent.setRecordValue('taskData.' + this.parent.taskFields.name, args.data[this.parent.taskFields.name], args.data);
        this.parent.setRecordValue('taskName', args.data[this.parent.taskFields.name], args.data.ganttProperties, true);
        this.updateEditedRecord(args);
    };
    /**
     * To update task notes cell with new value
     * @param args
     */
    CellEdit.prototype.notedEdited = function (args) {
        this.parent.setRecordValue('taskData.' + this.parent.taskFields.notes, args.data[this.parent.taskFields.name], args.data);
        this.parent.setRecordValue('notes', args.data[this.parent.taskFields.notes], args.data.ganttProperties, true);
        this.updateEditedRecord(args);
    };
    /**
     * To update task schedule mode cell with new value
     * @param args
     */
    CellEdit.prototype.taskmodeEdited = function (args) {
        this.parent.setRecordValue('isAutoSchedule', !args.data[this.parent.taskFields.manual], args.data.ganttProperties, true);
        this.parent.editModule.updateTaskScheduleModes(args.data);
        this.updateEditedRecord(args);
    };
    /**
     * To update task start date cell with new value
     * @param args
     */
    CellEdit.prototype.startDateEdited = function (args) {
        var ganttData = args.data;
        var ganttProb = args.data.ganttProperties;
        var currentValue = args.data[this.parent.taskFields.startDate];
        currentValue = currentValue ? new Date(currentValue.getTime()) : null;
        currentValue = this.parent.dateValidationModule.checkStartDate(currentValue);
        if (isNOU(currentValue)) {
            if (!ganttData.hasChildRecords) {
                this.parent.setRecordValue('startDate', null, ganttProb, true);
                this.parent.setRecordValue('duration', null, ganttProb, true);
                this.parent.setRecordValue('isMilestone', false, ganttProb, true);
                if (this.parent.allowUnscheduledTasks && isNOU(this.parent.taskFields.endDate)) {
                    this.parent.setRecordValue('endDate', null, ganttProb, true);
                }
            }
        }
        else if (ganttProb.endDate || !isNOU(ganttProb.duration)) {
            this.parent.setRecordValue('startDate', new Date(currentValue.getTime()), ganttProb, true);
            this.parent.dateValidationModule.calculateEndDate(ganttData);
        }
        else if (isNOU(ganttProb.endDate) && isNOU(ganttProb.duration)) {
            this.parent.setRecordValue('startDate', new Date(currentValue.getTime()), ganttProb, true);
        }
        this.parent.setRecordValue('isMilestone', ganttProb.duration === 0 ? true : false, ganttProb, true);
        this.parent.dataOperation.updateWidthLeft(args.data);
        this.parent.dataOperation.updateMappingData(ganttData, 'startDate');
        this.parent.dataOperation.updateMappingData(ganttData, 'endDate');
        this.parent.dataOperation.updateMappingData(ganttData, 'duration');
        this.updateEditedRecord(args);
    };
    /**
     * To update task end date cell with new value
     * @param args
     */
    CellEdit.prototype.endDateEdited = function (args) {
        var ganttProb = args.data.ganttProperties;
        var currentValue = args.data[this.parent.taskFields.endDate];
        currentValue = currentValue ? new Date(currentValue.getTime()) : null;
        if (isNOU(currentValue)) {
            this.parent.setRecordValue('endDate', currentValue, ganttProb, true);
            this.parent.setRecordValue('duration', null, ganttProb, true);
            this.parent.setRecordValue('isMilestone', false, ganttProb, true);
        }
        else {
            if ((currentValue.getHours() === 0 && this.parent.defaultEndTime !== 86400)) {
                this.parent.dateValidationModule.setTime(this.parent.defaultEndTime, currentValue);
            }
            currentValue = this.parent.dateValidationModule.checkEndDate(currentValue, ganttProb);
            this.parent.setRecordValue('endDate', currentValue, ganttProb, true);
            if (!isNOU(ganttProb.startDate) && isNOU(ganttProb.duration)) {
                if (this.parent.dateValidationModule.compareDates(ganttProb.endDate, ganttProb.startDate) === -1) {
                    this.parent.setRecordValue('endDate', new Date(ganttProb.startDate.getTime()), ganttProb, true);
                    this.parent.dateValidationModule.setTime(this.parent.defaultEndTime, ganttProb.endDate);
                }
            }
            else if (!isNOU(ganttProb.duration) && isNOU(ganttProb.startDate)) {
                this.parent.setRecordValue('startDate', this.parent.dateValidationModule.getStartDate(ganttProb.endDate, ganttProb.duration, ganttProb.durationUnit, ganttProb), ganttProb, true);
            }
            if (this.compareDatesFromRecord(ganttProb) === -1) {
                this.parent.dateValidationModule.calculateDuration(args.data);
            }
            else {
                this.parent.editModule.revertCellEdit(args);
            }
            this.parent.setRecordValue('isMilestone', (ganttProb.duration === 0 ? true : false), ganttProb, true);
            if (ganttProb.isMilestone) {
                this.parent.setRecordValue('startDate', this.parent.dateValidationModule.checkStartDate(ganttProb.startDate, ganttProb), ganttProb, true);
            }
        }
        this.parent.dataOperation.updateWidthLeft(args.data);
        this.parent.dataOperation.updateMappingData(args.data, 'startDate');
        this.parent.dataOperation.updateMappingData(args.data, 'endDate');
        this.parent.dataOperation.updateMappingData(args.data, 'duration');
        this.parent.editModule.updateResourceRelatedFields(args.data, 'endDate');
        this.updateEditedRecord(args);
    };
    /**
     * To update duration cell with new value
     * @param args
     */
    CellEdit.prototype.durationEdited = function (args) {
        var ganttProb = args.data.ganttProperties;
        var durationString = args.data[this.parent.taskFields.duration];
        this.parent.dataOperation.updateDurationValue(durationString, ganttProb);
        this.updateDates(args);
        this.parent.editModule.updateResourceRelatedFields(args.data, 'duration');
        this.updateEditedRecord(args);
    };
    /**
     * To update start date, end date based on duration
     * @param args
     */
    CellEdit.prototype.updateDates = function (args) {
        var ganttProb = args.data.ganttProperties;
        var endDate = this.parent.dateValidationModule.getDateFromFormat(ganttProb.endDate);
        var startDate = this.parent.dateValidationModule.getDateFromFormat(ganttProb.startDate);
        var currentDuration = ganttProb.duration;
        if (isNOU(currentDuration)) {
            this.parent.setRecordValue('isMilestone', false, ganttProb, true);
            this.parent.setRecordValue('endDate', null, ganttProb, true);
        }
        else {
            if (isNOU(startDate) && !isNOU(endDate)) {
                this.parent.setRecordValue('startDate', this.parent.dateValidationModule.getStartDate(endDate, currentDuration, ganttProb.durationUnit, ganttProb), ganttProb, true);
            }
            if (currentDuration !== 0 && ganttProb.isMilestone) {
                this.parent.setRecordValue('isMilestone', false, ganttProb, true);
                this.parent.setRecordValue('startDate', this.parent.dateValidationModule.checkStartDate(ganttProb.startDate, ganttProb), ganttProb, true);
            }
            this.parent.setRecordValue('isMilestone', (ganttProb.duration === 0 ? true : false), ganttProb, true);
            this.parent.dateValidationModule.calculateEndDate(args.data);
        }
        this.parent.dataOperation.updateWidthLeft(args.data);
        this.parent.dataOperation.updateMappingData(args.data, 'endDate');
        this.parent.dataOperation.updateMappingData(args.data, 'startDate');
        this.parent.dataOperation.updateMappingData(args.data, 'duration');
    };
    /**
     * To update progress cell with new value
     * @param args
     */
    CellEdit.prototype.progressEdited = function (args) {
        var ganttRecord = args.data;
        this.parent.setRecordValue('progress', (ganttRecord[this.parent.taskFields.progress] > 100 ? 100 : ganttRecord[this.parent.taskFields.progress]), ganttRecord.ganttProperties, true);
        this.parent.setRecordValue('taskData.' + this.parent.taskFields.progress, (ganttRecord[this.parent.taskFields.progress] > 100 ? 100 : ganttRecord[this.parent.taskFields.progress]), args.data);
        if (!args.data.hasChildRecords) {
            var width = ganttRecord.ganttProperties.isAutoSchedule ? ganttRecord.ganttProperties.width :
                ganttRecord.ganttProperties.autoWidth;
            this.parent.setRecordValue('progressWidth', this.parent.dataOperation.getProgressWidth(width, ganttRecord.ganttProperties.progress), ganttRecord.ganttProperties, true);
        }
        this.updateEditedRecord(args);
    };
    /**
     * To update baselines with new baseline start date and baseline end date
     * @param args
     */
    CellEdit.prototype.baselineEdited = function (args) {
        var ganttRecord = args.data.ganttProperties;
        var baseLineStartDate = args.data[this.parent.taskFields.baselineStartDate];
        var baseLineEndDate = args.data[this.parent.taskFields.baselineEndDate];
        if (baseLineEndDate && baseLineEndDate.getHours() === 0 && this.parent.defaultEndTime !== 86400) {
            this.parent.dateValidationModule.setTime(this.parent.defaultEndTime, baseLineEndDate);
        }
        this.parent.setRecordValue('baselineStartDate', this.parent.dateValidationModule.checkBaselineStartDate(baseLineStartDate), ganttRecord, true);
        this.parent.setRecordValue('baselineEndDate', this.parent.dateValidationModule.checkBaselineEndDate(baseLineEndDate), ganttRecord, true);
        if (ganttRecord.baselineStartDate && ganttRecord.baselineEndDate) {
            this.parent.setRecordValue('baselineLeft', this.parent.dataOperation.calculateBaselineLeft(ganttRecord), ganttRecord, true);
            this.parent.setRecordValue('baselineWidth', this.parent.dataOperation.calculateBaselineWidth(ganttRecord), ganttRecord, true);
        }
        this.updateEditedRecord(args);
    };
    /**
     * To update task's resource cell with new value
     * @param args
     * @param editedObj
     */
    CellEdit.prototype.resourceEdited = function (args, editedObj, previousData) {
        var resourceSettings = this.parent.resourceFields;
        var editedResourceId = editedObj[this.parent.taskFields.resourceInfo];
        if (editedResourceId) {
            var tempResourceInfo = this.parent.dataOperation.setResourceInfo(editedObj);
            var editedResouceLength = tempResourceInfo.length;
            var previousResource = previousData.ganttProperties.resourceInfo;
            var index = void 0;
            var editedResources = [];
            var resourceData = this.parent.resources;
            var newIndex = void 0;
            var _loop_1 = function (count) {
                if (previousResource) {
                    var previousResourceLength = previousResource.length;
                    for (newIndex = 0; newIndex < previousResourceLength; newIndex++) {
                        if (previousResource[newIndex][resourceSettings.id] === editedResourceId[count]) {
                            index = newIndex;
                            break;
                        }
                        else {
                            index = -1;
                        }
                    }
                }
                if (!isNOU(index) && index !== -1) {
                    editedResources.push(previousResource[index]);
                }
                else {
                    var resource = resourceData.filter(function (resourceInfo) {
                        return (editedResourceId[count] === resourceInfo[resourceSettings.id]);
                    });
                    var ganttDataResource = extend({}, resource[0]);
                    ganttDataResource[resourceSettings.unit] = 100;
                    editedResources.push(ganttDataResource);
                }
            };
            for (var count = 0; count < editedResouceLength; count++) {
                _loop_1(count);
            }
            args.data.ganttProperties.resourceInfo = editedResources;
            this.parent.dataOperation.updateMappingData(args.data, 'resourceInfo');
            this.parent.editModule.updateResourceRelatedFields(args.data, 'resource');
            if (this.parent.viewType === 'ResourceView') {
                this.parent.editModule.dialogModule.isResourceUpdate = true;
                this.parent.editModule.dialogModule.previousResource = previousResource;
            }
            this.updateEditedRecord(args);
        }
    };
    /**
     * To update task's predecessor cell with new value
     * @param editedArgs
     * @param cellEditArgs
     */
    CellEdit.prototype.dependencyEdited = function (editedArgs, cellEditArgs) {
        this.parent.predecessorModule.updateUnscheduledDependency(editedArgs.data);
        if (!this.parent.connectorLineEditModule.updatePredecessor(editedArgs.data, editedArgs.data[this.parent.taskFields.dependency], editedArgs)) {
            this.parent.editModule.revertCellEdit(cellEditArgs);
        }
    };
    /**
     * To update task's work cell with new value
     * @param editedArgs
     */
    CellEdit.prototype.workEdited = function (editedArgs) {
        var ganttProb = editedArgs.data.ganttProperties;
        var workValue = editedArgs.data[this.parent.taskFields.work];
        this.parent.setRecordValue('work', workValue, ganttProb, true);
        this.parent.editModule.updateResourceRelatedFields(editedArgs.data, 'work');
        this.updateDates(editedArgs);
        this.updateEditedRecord(editedArgs);
    };
    /**
     * To update task type cell with new value
     * @param args
     * @param editedObj
     */
    CellEdit.prototype.typeEdited = function (args, editedObj) {
        var key = 'taskType';
        var ganttProb = args.data.ganttProperties;
        var taskType = editedObj[key];
        this.parent.setRecordValue('taskType', taskType, ganttProb, true);
        //this.parent.dataOperation.updateMappingData(args.data, 'taskType');
        this.updateEditedRecord(args);
    };
    /**
     * To compare start date and end date from Gantt record
     * @param ganttRecord
     */
    CellEdit.prototype.compareDatesFromRecord = function (ganttRecord) {
        var sDate = this.parent.dateValidationModule.getValidStartDate(ganttRecord);
        var eDate = this.parent.dateValidationModule.getValidEndDate(ganttRecord);
        return this.parent.dateValidationModule.compareDates(sDate, eDate);
    };
    /**
     * To start method save action with edited cell value
     * @param args
     */
    CellEdit.prototype.updateEditedRecord = function (args) {
        this.parent.editModule.initiateUpdateAction(args);
    };
    /**
     * To remove all public private properties
     * @private
     */
    CellEdit.prototype.destroy = function () {
        // Destroy Method
        this.parent.editModule.cellEditModule = undefined;
    };
    return CellEdit;
}());
export { CellEdit };
