import { isNullOrUndefined, isUndefined, remove, addClass } from '@syncfusion/ej2-base';
import { removeClass, isObject, getValue, createElement, extend } from '@syncfusion/ej2-base';
import * as cls from '../base/css-constants';
import { parentsUntil, formatString, isScheduledTask, getIndex } from '../base/utils';
import { Dialog } from '@syncfusion/ej2-popups';
/**
 * File for handling connector line edit operation in Gantt.
 */
var ConnectorLineEdit = /** @class */ (function () {
    function ConnectorLineEdit(ganttObj) {
        /**
         * @private
         */
        this.validationPredecessor = null;
        /** @private */
        this.confirmPredecessorDialog = null;
        /** @private */
        this.predecessorIndex = null;
        /** @private */
        this.childRecord = null;
        this.parent = ganttObj;
        this.dateValidateModule = this.parent.dateValidationModule;
        this.parent.on('initPredessorDialog', this.initPredecessorValidationDialog, this);
    }
    /**
     * To update connector line edit element.
     * @return {void}
     * @private
     */
    ConnectorLineEdit.prototype.updateConnectorLineEditElement = function (e) {
        var element = this.getConnectorLineHoverElement(e.target);
        if (!getValue('editModule.taskbarEditModule.taskBarEditAction', this.parent)) {
            this.highlightConnectorLineElements(element);
        }
    };
    /**
     * To get hovered connector line element.
     * @return {void}
     * @private
     */
    ConnectorLineEdit.prototype.getConnectorLineHoverElement = function (target) {
        var isOnLine = parentsUntil(target, cls.connectorLine);
        var isOnRightArrow = parentsUntil(target, cls.connectorLineRightArrow);
        var isOnLeftArrow = parentsUntil(target, cls.connectorLineLeftArrow);
        if (isOnLine || isOnRightArrow || isOnLeftArrow) {
            return parentsUntil(target, cls.connectorLineContainer);
        }
        else {
            return null;
        }
    };
    /**
     * To highlight connector line while hover.
     * @return {void}
     * @private
     */
    ConnectorLineEdit.prototype.highlightConnectorLineElements = function (element) {
        if (element) {
            if (element !== this.connectorLineElement) {
                this.removeHighlight();
                this.addHighlight(element);
            }
        }
        else {
            this.removeHighlight();
        }
    };
    /**
     * To add connector line highlight class.
     * @return {void}
     * @private
     */
    ConnectorLineEdit.prototype.addHighlight = function (element) {
        this.connectorLineElement = element;
        addClass([element], [cls.connectorLineHoverZIndex]);
        addClass(element.querySelectorAll('.' + cls.connectorLine), [cls.connectorLineHover]);
        addClass(element.querySelectorAll('.' + cls.connectorLineRightArrow), [cls.connectorLineRightArrowHover]);
        addClass(element.querySelectorAll('.' + cls.connectorLineLeftArrow), [cls.connectorLineLeftArrowHover]);
    };
    /**
     * To remove connector line highlight class.
     * @return {void}
     * @private
     */
    ConnectorLineEdit.prototype.removeHighlight = function () {
        if (!isNullOrUndefined(this.connectorLineElement)) {
            removeClass([this.connectorLineElement], [cls.connectorLineHoverZIndex]);
            removeClass(this.connectorLineElement.querySelectorAll('.' + cls.connectorLine), [cls.connectorLineHover]);
            removeClass(this.connectorLineElement.querySelectorAll('.' + cls.connectorLineRightArrow), [cls.connectorLineRightArrowHover]);
            removeClass(this.connectorLineElement.querySelectorAll('.' + cls.connectorLineLeftArrow), [cls.connectorLineLeftArrowHover]);
            this.connectorLineElement = null;
        }
    };
    /**
     * To remove connector line highlight class.
     * @return {void}
     * @private
     */
    ConnectorLineEdit.prototype.getEditedConnectorLineString = function (records) {
        var ganttRecord;
        var predecessorsCollection;
        var predecessor;
        var parentGanttRecord;
        var childGanttRecord;
        var connectorObj;
        var idArray = [];
        var lineArray = [];
        var editedConnectorLineString = '';
        for (var count = 0; count < records.length; count++) {
            ganttRecord = records[count];
            predecessorsCollection = ganttRecord.ganttProperties.predecessor;
            if (predecessorsCollection) {
                for (var predecessorCount = 0; predecessorCount < predecessorsCollection.length; predecessorCount++) {
                    predecessor = predecessorsCollection[predecessorCount];
                    var from = 'from';
                    var to = 'to';
                    this.removeConnectorLineById('parent' + predecessor[from] + 'child' + predecessor[to]);
                    parentGanttRecord = this.parent.connectorLineModule.getRecordByID(predecessor[from]);
                    childGanttRecord = this.parent.connectorLineModule.getRecordByID(predecessor[to]);
                    if ((parentGanttRecord && parentGanttRecord.expanded === true) ||
                        (childGanttRecord && childGanttRecord.expanded === true)) {
                        connectorObj =
                            this.parent.predecessorModule.updateConnectorLineObject(parentGanttRecord, childGanttRecord, predecessor);
                        if (!isNullOrUndefined(connectorObj)) {
                            var lineIndex = idArray.indexOf(connectorObj.connectorLineId);
                            var lineString = this.parent.connectorLineModule.getConnectorLineTemplate(connectorObj);
                            if (lineIndex !== -1) {
                                lineArray[lineIndex] = lineString;
                            }
                            else {
                                idArray.push(connectorObj.connectorLineId);
                                lineArray.push(lineString);
                            }
                        }
                    }
                }
                editedConnectorLineString = lineArray.join('');
            }
        }
        return editedConnectorLineString;
    };
    /**
     * Tp refresh connector lines of edited records
     * @param editedRecord
     * @private
     */
    ConnectorLineEdit.prototype.refreshEditedRecordConnectorLine = function (editedRecord) {
        this.removePreviousConnectorLines(this.parent.previousRecords);
        this.parent.connectorLineModule.expandedRecords = this.parent.getExpandedRecords(this.parent.currentViewData);
        var editedConnectorLineString;
        editedConnectorLineString = this.getEditedConnectorLineString(editedRecord);
        this.parent.connectorLineModule.dependencyViewContainer.innerHTML =
            this.parent.connectorLineModule.dependencyViewContainer.innerHTML + editedConnectorLineString;
    };
    /**
     * Method to remove connector line from DOM
     * @param records
     * @private
     */
    ConnectorLineEdit.prototype.removePreviousConnectorLines = function (records) {
        var isObjectType;
        if (isObject(records) === true) {
            isObjectType = true;
        }
        else {
            isObjectType = false;
        }
        var length = isObjectType ? Object.keys(records).length : records.length;
        var keys = Object.keys(records);
        for (var i = 0; i < length; i++) {
            var data = void 0;
            var predecessors = void 0;
            if (isObjectType) {
                var uniqueId = keys[i];
                data = records[uniqueId];
            }
            else {
                data = records[i];
            }
            predecessors = data.ganttProperties && data.ganttProperties.predecessor;
            if (predecessors && predecessors.length > 0) {
                for (var pre = 0; pre < predecessors.length; pre++) {
                    var lineId = 'parent' + predecessors[pre].from + 'child' + predecessors[pre].to;
                    this.removeConnectorLineById(lineId);
                }
            }
        }
    };
    ConnectorLineEdit.prototype.removeConnectorLineById = function (id) {
        var element = this.parent.connectorLineModule.dependencyViewContainer.querySelector('#ConnectorLine' + id);
        if (!isNullOrUndefined(element)) {
            remove(element);
        }
    };
    ConnectorLineEdit.prototype.idFromPredecessor = function (pre) {
        var preArray = pre.split(',');
        var preIdArray = [];
        for (var j = 0; j < preArray.length; j++) {
            var strArray = [];
            for (var i = 0; i < preArray[j].length; i++) {
                if (!isNullOrUndefined(preArray[j].charAt(i)) && parseInt(preArray[j].charAt(i), 10).toString() !== 'NaN') {
                    strArray.push(preArray[j].charAt(i));
                }
                else {
                    break;
                }
            }
            preIdArray.push((strArray.join('')));
        }
        return preIdArray;
    };
    ConnectorLineEdit.prototype.predecessorValidation = function (predecessor, record) {
        var recordId = record.rowUniqueID;
        var currentId;
        var currentRecord;
        for (var count = 0; count < predecessor.length; count++) {
            currentId = predecessor[count];
            var visitedIdArray = [];
            var predecessorCollection = predecessor.slice(0);
            predecessorCollection.splice(count, 1);
            var _loop_1 = function () {
                var currentIdArray = [];
                if (visitedIdArray.indexOf(currentId) === -1) {
                    //Predecessor id not in records collection
                    if (isNullOrUndefined(this_1.parent.connectorLineModule.getRecordByID(currentId))) {
                        return { value: false };
                    }
                    currentRecord = this_1.parent.connectorLineModule.getRecordByID(currentId).ganttProperties;
                    if (!isNullOrUndefined(currentRecord.predecessor) && currentRecord.predecessor.length > 0) {
                        currentRecord.predecessor.forEach(function (value) {
                            if (currentRecord.rowUniqueID.toString() !== value.from) {
                                currentIdArray.push(value.from.toString());
                            }
                        });
                    }
                    /* tslint:disable-next-line */
                    if (recordId.toString() === currentRecord.rowUniqueID.toString() || currentIdArray.indexOf(recordId.toString()) !== -1) {
                        return { value: false };
                    }
                    visitedIdArray.push(currentId);
                    if (!isNullOrUndefined(currentRecord.predecessor) && currentRecord.predecessor.length > 0) {
                        currentId = currentRecord.predecessor[0].from;
                    }
                    else {
                        return "break";
                    }
                }
                else {
                    return "break";
                }
            };
            var this_1 = this;
            while (currentId !== null) {
                var state_1 = _loop_1();
                if (typeof state_1 === "object")
                    return state_1.value;
                if (state_1 === "break")
                    break;
            }
        }
        return true;
    };
    /**
     * To validate predecessor relations
     * @param ganttRecord
     * @param predecessorString
     * @private
     */
    ConnectorLineEdit.prototype.validatePredecessorRelation = function (ganttRecord, predecessorString) {
        var flag = true;
        var recordId = this.parent.viewType === 'ResourceView' ? ganttRecord.ganttProperties.taskId
            : ganttRecord.ganttProperties.rowUniqueID;
        var predecessorIdArray;
        var currentId;
        if (!isNullOrUndefined(predecessorString) && predecessorString.length > 0) {
            predecessorIdArray = this.idFromPredecessor(predecessorString);
            var _loop_2 = function (count) {
                //Check edited item has parent item in predecessor collection
                var checkParent = this_2.checkParentRelation(ganttRecord, predecessorIdArray);
                if (!checkParent) {
                    return { value: false };
                }
                // Check if predecessor exist more then one 
                var tempIdArray = predecessorIdArray.slice(0);
                var checkArray = [];
                var countFlag = true;
                tempIdArray.forEach(function (value) {
                    if (checkArray.indexOf(value) === -1) {
                        checkArray.push(value);
                    }
                    else {
                        countFlag = false;
                    }
                });
                if (!countFlag) {
                    return { value: false };
                }
                //Cyclick check  
                currentId = predecessorIdArray[count];
                var visitedIdArray = [];
                var predecessorCollection = predecessorIdArray.slice(0);
                predecessorCollection.splice(count, 1);
                var _loop_3 = function () {
                    var currentIdArray = [];
                    var currentIdIndex;
                    var currentRecord;
                    if (visitedIdArray.indexOf(currentId) === -1) {
                        //Predecessor id not in records collection
                        if (isNullOrUndefined(this_2.parent.connectorLineModule.getRecordByID(currentId.toString()))) {
                            return { value: false };
                        }
                        currentRecord = this_2.parent.connectorLineModule.getRecordByID(currentId.toString()).ganttProperties;
                        //  let currentPredecessor='';
                        if (!isNullOrUndefined(currentRecord.predecessor) && currentRecord.predecessor.length > 0) {
                            currentRecord.predecessor.forEach(function (value, index) {
                                if (currentRecord.rowUniqueID.toString() !== value.from) {
                                    currentIdArray.push(value.from.toString());
                                    currentIdIndex = index;
                                }
                            });
                            //    currentPredecessor=currentRecord.predecessor[0].from
                        }
                        if (recordId.toString() === currentRecord.rowUniqueID.toString() ||
                            currentIdArray.indexOf(recordId.toString()) !== -1) {
                            return { value: false };
                        }
                        visitedIdArray.push(currentId);
                        if (!isNullOrUndefined(currentRecord.predecessor) && currentRecord.predecessor.length > 0) {
                            var result = void 0;
                            if (currentIdArray.length > 1) {
                                result = this_2.predecessorValidation(currentIdArray, ganttRecord.ganttProperties);
                            }
                            else if (currentIdArray.length === 1) {
                                currentId = currentRecord.predecessor[currentIdIndex].from;
                            }
                            if (result === false) {
                                return { value: false };
                            }
                        }
                        else {
                            return "break";
                        }
                    }
                    else {
                        return "break";
                    }
                };
                while (currentId !== null) {
                    var state_3 = _loop_3();
                    if (typeof state_3 === "object")
                        return state_3;
                    if (state_3 === "break")
                        break;
                }
            };
            var this_2 = this;
            for (var count = 0; count < predecessorIdArray.length; count++) {
                var state_2 = _loop_2(count);
                if (typeof state_2 === "object")
                    return state_2.value;
            }
        }
        return flag;
    };
    /**
     * To add dependency for Task
     * @param ganttRecord
     * @param predecessorString
     * @private
     */
    ConnectorLineEdit.prototype.addPredecessor = function (ganttRecord, predecessorString) {
        var tempPredecessorString = isNullOrUndefined(ganttRecord.ganttProperties.predecessorsName) ||
            ganttRecord.ganttProperties.predecessorsName === '' ?
            predecessorString : (ganttRecord.ganttProperties.predecessorsName + ',' + predecessorString);
        this.updatePredecessorHelper(ganttRecord, tempPredecessorString);
    };
    /**
     * To remove dependency from task
     * @param ganttRecord
     * @private
     */
    ConnectorLineEdit.prototype.removePredecessor = function (ganttRecord) {
        this.updatePredecessorHelper(ganttRecord, null);
    };
    /**
     * To modify current dependency values of Task
     * @param ganttRecord
     * @param predecessorString
     * @private
     */
    ConnectorLineEdit.prototype.updatePredecessor = function (ganttRecord, predecessorString, editedArgs) {
        return this.updatePredecessorHelper(ganttRecord, predecessorString, editedArgs);
    };
    ConnectorLineEdit.prototype.updatePredecessorHelper = function (ganttRecord, predecessorString, editedArgs) {
        if (isUndefined(predecessorString) || this.validatePredecessorRelation(ganttRecord, predecessorString)) {
            this.parent.isOnEdit = true;
            var predecessorCollection = [];
            if (!isNullOrUndefined(predecessorString) && predecessorString !== '') {
                predecessorCollection = this.parent.predecessorModule.calculatePredecessor(predecessorString, ganttRecord);
            }
            this.parent.setRecordValue('predecessor', predecessorCollection, ganttRecord.ganttProperties, true);
            var stringValue = this.parent.predecessorModule.getPredecessorStringValue(ganttRecord);
            this.parent.setRecordValue('predecessorsName', stringValue, ganttRecord.ganttProperties, true);
            this.parent.setRecordValue('taskData.' + this.parent.taskFields.dependency, stringValue, ganttRecord);
            this.parent.setRecordValue(this.parent.taskFields.dependency, stringValue, ganttRecord);
            var args = {};
            args.action = editedArgs && editedArgs.action && editedArgs.action === 'CellEditing' ? editedArgs.action : 'DrawConnectorLine';
            args.data = ganttRecord;
            this.parent.editModule.initiateUpdateAction(args);
            return true;
        }
        else {
            return false;
        }
    };
    ConnectorLineEdit.prototype.checkParentRelation = function (ganttRecord, predecessorIdArray) {
        var editingData = ganttRecord;
        var checkParent = true;
        if (editingData && editingData.parentItem) {
            if (predecessorIdArray.indexOf(editingData.parentItem.taskId.toString()) !== -1) {
                return false;
            }
        }
        var _loop_4 = function (p) {
            var record = this_3.parent.currentViewData.filter(function (item) {
                return item && item.ganttProperties.rowUniqueID.toString() === predecessorIdArray[p].toString();
            });
            if (record[0] && record[0].hasChildRecords) {
                return { value: false };
            }
        };
        var this_3 = this;
        for (var p = 0; p < predecessorIdArray.length; p++) {
            var state_4 = _loop_4(p);
            if (typeof state_4 === "object")
                return state_4.value;
        }
        return checkParent;
    };
    ConnectorLineEdit.prototype.initPredecessorValidationDialog = function () {
        if (this.parent.taskFields.dependency && this.parent.isInPredecessorValidation) {
            var dialogElement = createElement('div', {
                id: this.parent.element.id + '_dialogValidationRule',
            });
            this.parent.element.appendChild(dialogElement);
            this.renderValidationDialog();
        }
    };
    /**
     * To render validation dialog
     * @return {void}
     * @private
     */
    ConnectorLineEdit.prototype.renderValidationDialog = function () {
        var validationDialog = new Dialog({
            header: 'Validate Editing',
            isModal: true,
            visible: false,
            width: '50%',
            showCloseIcon: true,
            close: this.validationDialogClose.bind(this),
            content: '',
            buttons: [
                {
                    click: this.validationDialogOkButton.bind(this),
                    buttonModel: { content: this.parent.localeObj.getConstant('okText'), isPrimary: true }
                },
                {
                    click: this.validationDialogCancelButton.bind(this),
                    buttonModel: { content: this.parent.localeObj.getConstant('cancel') }
                }
            ],
            target: this.parent.element,
            animationSettings: { effect: 'None' },
        });
        document.getElementById(this.parent.element.id + '_dialogValidationRule').innerHTML = '';
        validationDialog.isStringTemplate = true;
        validationDialog.appendTo('#' + this.parent.element.id + '_dialogValidationRule');
        this.parent.validationDialogElement = validationDialog;
    };
    ConnectorLineEdit.prototype.validationDialogOkButton = function () {
        var currentArgs = this.parent.currentEditedArgs;
        currentArgs.validateMode.preserveLinkWithEditing =
            document.getElementById(this.parent.element.id + '_ValidationAddlineOffset').checked;
        currentArgs.validateMode.removeLink =
            document.getElementById(this.parent.element.id + '_ValidationRemoveline').checked;
        currentArgs.validateMode.respectLink =
            document.getElementById(this.parent.element.id + '_ValidationCancel').checked;
        this.applyPredecessorOption();
        this.parent.validationDialogElement.hide();
    };
    ConnectorLineEdit.prototype.validationDialogCancelButton = function () {
        this.parent.currentEditedArgs.validateMode.respectLink = true;
        this.applyPredecessorOption();
        this.parent.validationDialogElement.hide();
    };
    ConnectorLineEdit.prototype.validationDialogClose = function (e) {
        if (getValue('isInteraction', e)) {
            this.parent.currentEditedArgs.validateMode.respectLink = true;
            this.applyPredecessorOption();
        }
    };
    /**
     * Validate and apply the predecessor option from validation dialog
     * @param buttonType
     * @return {void}
     * @private
     */
    ConnectorLineEdit.prototype.applyPredecessorOption = function () {
        var args = this.parent.currentEditedArgs;
        var ganttRecord = args.data;
        if (args.validateMode.respectLink) {
            this.parent.editModule.reUpdatePreviousRecords();
            this.parent.chartRowsModule.refreshRecords([args.data]);
        }
        else if (args.validateMode.removeLink) {
            this.removePredecessors(ganttRecord, this.validationPredecessor);
            this.parent.editModule.updateEditedTask(args.editEventArgs);
        }
        else if (args.validateMode.preserveLinkWithEditing) {
            this.calculateOffset(ganttRecord);
            this.parent.editModule.updateEditedTask(args.editEventArgs);
        }
    };
    ConnectorLineEdit.prototype.calculateOffset = function (record) {
        var prevPredecessor = extend([], record.ganttProperties.predecessor, [], true);
        var validPredecessor = this.parent.predecessorModule.getValidPredecessor(record);
        for (var i = 0; i < validPredecessor.length; i++) {
            var predecessor = validPredecessor[i];
            var parentTask = this.parent.connectorLineModule.getRecordByID(predecessor.from);
            var offset = void 0;
            if (isScheduledTask(parentTask.ganttProperties) && isScheduledTask(record.ganttProperties)) {
                var tempStartDate = void 0;
                var tempEndDate = void 0;
                var tempDuration = void 0;
                var isNegativeOffset = void 0;
                switch (predecessor.type) {
                    case 'FS':
                        tempStartDate = new Date(parentTask.ganttProperties.endDate.getTime());
                        tempEndDate = new Date(record.ganttProperties.startDate.getTime());
                        break;
                    case 'SS':
                        tempStartDate = new Date(parentTask.ganttProperties.startDate.getTime());
                        tempEndDate = new Date(record.ganttProperties.startDate.getTime());
                        break;
                    case 'SF':
                        tempStartDate = new Date(parentTask.ganttProperties.startDate.getTime());
                        tempEndDate = new Date(record.ganttProperties.endDate.getTime());
                        break;
                    case 'FF':
                        tempStartDate = new Date(parentTask.ganttProperties.endDate.getTime());
                        tempEndDate = new Date(record.ganttProperties.endDate.getTime());
                        break;
                }
                if (tempStartDate.getTime() < tempEndDate.getTime()) {
                    tempStartDate = this.dateValidateModule.checkStartDate(tempStartDate);
                    tempEndDate = this.dateValidateModule.checkEndDate(tempEndDate, null);
                    isNegativeOffset = false;
                }
                else {
                    var tempDate = new Date(tempStartDate.getTime());
                    tempStartDate = this.dateValidateModule.checkStartDate(tempEndDate);
                    tempEndDate = this.dateValidateModule.checkEndDate(tempDate, null);
                    isNegativeOffset = true;
                }
                if (tempStartDate.getTime() < tempEndDate.getTime()) {
                    tempDuration = this.dateValidateModule.getDuration(tempStartDate, tempEndDate, predecessor.offsetUnit, true, false);
                    offset = isNegativeOffset ? (tempDuration * -1) : tempDuration;
                }
                else {
                    offset = 0;
                }
            }
            else {
                offset = 0;
            }
            var preIndex = getIndex(predecessor, 'from', prevPredecessor, 'to');
            prevPredecessor[preIndex].offset = offset;
            // Update predecessor in predecessor task
            var parentPredecessors = extend([], parentTask.ganttProperties.predecessor, [], true);
            var parentPreIndex = getIndex(predecessor, 'from', parentPredecessors, 'to');
            parentPredecessors[parentPreIndex].offset = offset;
            this.parent.setRecordValue('predecessor', parentPredecessors, parentTask.ganttProperties, true);
        }
        this.parent.setRecordValue('predecessor', prevPredecessor, record.ganttProperties, true);
        var predecessorString = this.parent.predecessorModule.getPredecessorStringValue(record);
        this.parent.setRecordValue('taskData.' + this.parent.taskFields.dependency, predecessorString, record);
        this.parent.setRecordValue(this.parent.taskFields.dependency, predecessorString, record);
        this.parent.setRecordValue('predecessorsName', predecessorString, record.ganttProperties, true);
    };
    /**
     * Update predecessor value with user selection option in predecessor validation dialog
     * @param args
     * @return {void}
     */
    ConnectorLineEdit.prototype.removePredecessors = function (ganttRecord, predecessor) {
        var prevPredecessor = extend([], [], ganttRecord.ganttProperties.predecessor, true);
        var preLength = predecessor.length;
        for (var i = 0; i < preLength; i++) {
            var parentGanttRecord = this.parent.connectorLineModule.getRecordByID(predecessor[i].from);
            var parentPredecessor = extend([], [], parentGanttRecord.ganttProperties.predecessor, true);
            var index = getIndex(predecessor[i], 'from', prevPredecessor, 'to');
            prevPredecessor.splice(index, 1);
            var parentIndex = getIndex(predecessor[i], 'from', parentPredecessor, 'to');
            parentPredecessor.splice(parentIndex, 1);
            this.parent.setRecordValue('predecessor', parentPredecessor, parentGanttRecord.ganttProperties, true);
        }
        if (prevPredecessor.length !== ganttRecord.ganttProperties.predecessor.length) {
            this.parent.setRecordValue('predecessor', prevPredecessor, ganttRecord.ganttProperties, true);
            var predecessorString = this.parent.predecessorModule.getPredecessorStringValue(ganttRecord);
            this.parent.setRecordValue('predecessorsName', predecessorString, ganttRecord.ganttProperties, true);
            this.parent.setRecordValue('taskData.' + this.parent.taskFields.dependency, predecessorString, ganttRecord);
            this.parent.setRecordValue(this.parent.taskFields.dependency, predecessorString, ganttRecord);
        }
    };
    /**
     * To open predecessor validation dialog
     * @param args
     * @return {void}
     * @private
     */
    ConnectorLineEdit.prototype.openValidationDialog = function (args) {
        var contentTemplate = this.validationDialogTemplate(args);
        this.parent.validationDialogElement.setProperties({ content: contentTemplate });
        this.parent.validationDialogElement.show();
    };
    /**
     * Predecessor link validation dialog template
     * @param args
     * @private
     */
    ConnectorLineEdit.prototype.validationDialogTemplate = function (args) {
        var ganttId = this.parent.element.id;
        var contentdiv = createElement('div', {
            className: 'e-ValidationContent'
        });
        var taskData = getValue('task', args);
        var parenttaskData = getValue('parentTask', args);
        var violationType = getValue('violationType', args);
        var recordName = taskData.ganttProperties.taskName;
        var recordNewStartDate = this.parent.getFormatedDate(taskData.ganttProperties.startDate, 'MM/dd/yyyy');
        var parentName = parenttaskData.ganttProperties.taskName;
        var recordArgs = [recordName, parentName];
        var topContent;
        var topContentText;
        if (violationType === 'taskBeforePredecessor_FS') {
            topContentText = this.parent.localeObj.getConstant('taskBeforePredecessor_FS');
        }
        else if (violationType === 'taskAfterPredecessor_FS') {
            topContentText = this.parent.localeObj.getConstant('taskAfterPredecessor_FS');
        }
        else if (violationType === 'taskBeforePredecessor_SS') {
            topContentText = this.parent.localeObj.getConstant('taskBeforePredecessor_SS');
        }
        else if (violationType === 'taskAfterPredecessor_SS') {
            topContentText = this.parent.localeObj.getConstant('taskAfterPredecessor_SS');
        }
        else if (violationType === 'taskBeforePredecessor_FF') {
            topContentText = this.parent.localeObj.getConstant('taskBeforePredecessor_FF');
        }
        else if (violationType === 'taskAfterPredecessor_FF') {
            topContentText = this.parent.localeObj.getConstant('taskAfterPredecessor_FF');
        }
        else if (violationType === 'taskBeforePredecessor_SF') {
            topContentText = this.parent.localeObj.getConstant('taskBeforePredecessor_SF');
        }
        else if (violationType === 'taskAfterPredecessor_SF') {
            topContentText = this.parent.localeObj.getConstant('taskAfterPredecessor_SF');
        }
        topContentText = formatString(topContentText, recordArgs);
        topContent = '<div id="' + ganttId + '_ValidationText">' + topContentText + '<div>';
        var innerTable = '<table>' +
            '<tr><td><input type="radio" id="' + ganttId + '_ValidationCancel" name="ValidationRule" checked/><label for="'
            + ganttId + '_ValidationCancel" id= "' + ganttId + '_cancelLink">Cancel, keep the existing link</label></td></tr>' +
            '<tr><td><input type="radio" id="' + ganttId + '_ValidationRemoveline" name="ValidationRule"/><label for="'
            + ganttId + '_ValidationRemoveline" id="' + ganttId + '_removeLink">Remove the link and move <b>'
            + recordName + '</b> to start on <b>' + recordNewStartDate + '</b>.</label></td></tr>' +
            '<tr><td><input type="radio" id="' + ganttId + '_ValidationAddlineOffset" name="ValidationRule"/><label for="'
            + ganttId + '_ValidationAddlineOffset" id="' + ganttId + '_preserveLink">Move the <b>'
            + recordName + '</b> to start on <b>' + recordNewStartDate + '</b> and keep the link.</label></td></tr></table>';
        contentdiv.innerHTML = topContent + innerTable;
        return contentdiv;
    };
    /**
     * To validate the types while editing the taskbar
     * @param args
     * @return {boolean}
     * @private
     */
    ConnectorLineEdit.prototype.validateTypes = function (ganttRecord) {
        var predecessor = this.parent.predecessorModule.getValidPredecessor(ganttRecord);
        var parentGanttRecord;
        this.validationPredecessor = [];
        var violatedParent;
        var violateType;
        var startDate = this.parent.predecessorModule.getPredecessorDate(ganttRecord, predecessor);
        var ganttTaskData = ganttRecord.ganttProperties;
        var endDate = this.parent.allowUnscheduledTasks && isNullOrUndefined(startDate) ?
            ganttTaskData.endDate :
            this.dateValidateModule.getEndDate(startDate, ganttTaskData.duration, ganttTaskData.durationUnit, ganttTaskData, false);
        for (var i = 0; i < predecessor.length; i++) {
            parentGanttRecord = this.parent.connectorLineModule.getRecordByID(predecessor[i].from);
            var violationType = null;
            if (predecessor[i].type === 'FS') {
                if (ganttTaskData.startDate < startDate) {
                    this.validationPredecessor.push(predecessor[i]);
                    violationType = 'taskBeforePredecessor_FS';
                }
                else if (ganttTaskData.startDate > startDate) {
                    this.validationPredecessor.push(predecessor[i]);
                    violationType = 'taskAfterPredecessor_FS';
                }
            }
            else if (predecessor[i].type === 'SS') {
                if (ganttTaskData.startDate < startDate) {
                    this.validationPredecessor.push(predecessor[i]);
                    violationType = 'taskBeforePredecessor_SS';
                }
                else if (ganttTaskData.startDate > startDate) {
                    this.validationPredecessor.push(predecessor[i]);
                    violationType = 'taskAfterPredecessor_SS';
                }
            }
            else if (predecessor[i].type === 'FF') {
                if (endDate <= parentGanttRecord.ganttProperties.endDate) {
                    this.validationPredecessor.push(predecessor[i]);
                    violationType = 'taskBeforePredecessor_FF';
                }
                else if (endDate > parentGanttRecord.ganttProperties.endDate) {
                    this.validationPredecessor.push(predecessor[i]);
                    violationType = 'taskAfterPredecessor_FF';
                }
            }
            else if (predecessor[i].type === 'SF') {
                if (endDate < parentGanttRecord.ganttProperties.startDate) {
                    this.validationPredecessor.push(predecessor[i]);
                    violationType = 'taskBeforePredecessor_SF';
                }
                else if (endDate > parentGanttRecord.ganttProperties.startDate) {
                    this.validationPredecessor.push(predecessor[i]);
                    violationType = 'taskAfterPredecessor_SF';
                }
            }
            if (!isNullOrUndefined(violationType) && isNullOrUndefined(violateType)) {
                violatedParent = parentGanttRecord;
                violateType = violationType;
            }
        }
        var validateArgs = {
            parentTask: violatedParent,
            task: ganttRecord,
            violationType: violateType
        };
        return validateArgs;
    };
    /**
     * Method to remove and update new predecessor collection in successor record
     * @param data
     * @private
     */
    ConnectorLineEdit.prototype.addRemovePredecessor = function (data) {
        var prevData = this.parent.previousRecords[data.uniqueID];
        var newPredecessor = data.ganttProperties.predecessor.slice();
        if (prevData && prevData.ganttProperties && prevData.ganttProperties.hasOwnProperty('predecessor')) {
            var prevPredecessor = prevData.ganttProperties.predecessor;
            if (!isNullOrUndefined(prevPredecessor)) {
                for (var p = 0; p < prevPredecessor.length; p++) {
                    var parentGanttRecord = this.parent.connectorLineModule.getRecordByID(prevPredecessor[p].from);
                    if (parentGanttRecord === data) {
                        data.ganttProperties.predecessor.push(prevPredecessor[p]);
                    }
                    else {
                        var parentPredecessor = extend([], [], parentGanttRecord.ganttProperties.predecessor, true);
                        var parentIndex = getIndex(prevPredecessor[p], 'from', parentPredecessor, 'to');
                        if (parentIndex !== -1) {
                            parentPredecessor.splice(parentIndex, 1);
                            this.parent.setRecordValue('predecessor', parentPredecessor, parentGanttRecord.ganttProperties, true);
                        }
                    }
                }
            }
            if (!isNullOrUndefined(newPredecessor)) {
                for (var n = 0; n < newPredecessor.length; n++) {
                    var parentGanttRecord = this.parent.connectorLineModule.getRecordByID(newPredecessor[n].from);
                    var parentPredecessor = extend([], [], parentGanttRecord.ganttProperties.predecessor, true);
                    parentPredecessor.push(newPredecessor[n]);
                    this.parent.setRecordValue('predecessor', parentPredecessor, parentGanttRecord.ganttProperties, true);
                }
            }
        }
    };
    /**
     * Method to remove a predecessor from a record.
     * @param childRecord
     * @param index
     * @private
     */
    ConnectorLineEdit.prototype.removePredecessorByIndex = function (childRecord, index) {
        var childPredecessor = childRecord.ganttProperties.predecessor;
        var predecessor = childPredecessor.splice(index, 1);
        var parentRecord = this.parent.connectorLineModule.getRecordByID(predecessor[0].from);
        var parentPredecessor = parentRecord.ganttProperties.predecessor;
        var parentIndex = getIndex(predecessor[0], 'from', parentPredecessor, 'to');
        parentPredecessor.splice(parentIndex, 1);
        var predecessorString = this.parent.predecessorModule.getPredecessorStringValue(childRecord);
        childPredecessor.push(predecessor[0]);
        this.parent.connectorLineEditModule.updatePredecessor(childRecord, predecessorString);
    };
    /**
     * To render predecessor delete confirmation dialog
     * @return {void}
     * @private
     */
    ConnectorLineEdit.prototype.renderPredecessorDeleteConfirmDialog = function () {
        this.confirmPredecessorDialog = new Dialog({
            width: '320px',
            isModal: true,
            content: this.parent.localeObj.getConstant('confirmPredecessorDelete'),
            buttons: [
                {
                    click: this.confirmOkDeleteButton.bind(this),
                    buttonModel: { content: this.parent.localeObj.getConstant('okText'), isPrimary: true }
                },
                {
                    click: this.confirmCloseDialog.bind(this),
                    buttonModel: { content: this.parent.localeObj.getConstant('cancel') }
                }
            ],
            target: this.parent.element,
            animationSettings: { effect: 'None' },
        });
        var confirmDialog = createElement('div', {
            id: this.parent.element.id + '_deletePredecessorConfirmDialog',
        });
        this.parent.element.appendChild(confirmDialog);
        this.confirmPredecessorDialog.isStringTemplate = true;
        this.confirmPredecessorDialog.appendTo(confirmDialog);
    };
    ConnectorLineEdit.prototype.confirmCloseDialog = function () {
        this.confirmPredecessorDialog.destroy();
    };
    ConnectorLineEdit.prototype.confirmOkDeleteButton = function () {
        this.removePredecessorByIndex(this.childRecord, this.predecessorIndex);
        this.confirmPredecessorDialog.destroy();
    };
    return ConnectorLineEdit;
}());
export { ConnectorLineEdit };
