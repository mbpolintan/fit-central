import { isNullOrUndefined, extend, getValue } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { extendArray, getPlainData, getParentData } from '../utils';
export function editAction(details, control, isSelfReference, addRowIndex, selectedIndex, columnName, addRowRecord) {
    var value = details.value;
    var action = details.action;
    var changedRecords = 'changedRecords';
    var i;
    var j;
    var addedRecords = 'addedRecords';
    var batchChanges;
    var key = control.grid.getPrimaryKeyFieldNames()[0];
    var treeData = control.dataSource instanceof DataManager ?
        control.dataSource.dataSource.json : control.dataSource;
    var modifiedData = [];
    var originalData = value;
    var isSkip = false;
    if (control.editSettings.mode === 'Batch') {
        batchChanges = control.grid.editModule.getBatchChanges();
    }
    if (action === 'add' || (action === 'batchsave' && (control.editSettings.mode === 'Batch'
        && batchChanges[addedRecords].length))) {
        var addAct = addAction(details, treeData, control, isSelfReference, addRowIndex, selectedIndex, addRowRecord);
        value = addAct.value;
        isSkip = addAct.isSkip;
    }
    if (value instanceof Array) {
        modifiedData = extendArray(value);
    }
    else {
        modifiedData.push(extend({}, value));
    }
    if (!isSkip && (action !== 'add' ||
        (control.editSettings.newRowPosition !== 'Top' && control.editSettings.newRowPosition !== 'Bottom'))) {
        for (var k = 0; k < modifiedData.length; k++) {
            if (typeof (modifiedData[k][key]) === 'object') {
                modifiedData[k] = modifiedData[k][key];
            }
            var keys = Object.keys(modifiedData[k].taskData);
            i = treeData.length;
            var _loop_1 = function () {
                if (treeData[i][key] === modifiedData[k][key]) {
                    if (action === 'delete') {
                        var currentData_1 = treeData[i];
                        treeData.splice(i, 1);
                        if (isSelfReference) {
                            if (!isNullOrUndefined(currentData_1[control.parentIdMapping])) {
                                var parentData = control.flatData.filter(function (e) {
                                    return e[control.idMapping] === currentData_1[control.parentIdMapping];
                                })[0];
                                var childRecords = parentData ? parentData[control.childMapping] : [];
                                for (var p = childRecords.length - 1; p >= 0; p--) {
                                    if (childRecords[p][control.idMapping] === currentData_1[control.idMapping]) {
                                        childRecords.splice(p, 1);
                                        if (!childRecords.length) {
                                            parentData.hasChildRecords = false;
                                            updateParentRow(key, parentData, action, control, isSelfReference);
                                        }
                                        break;
                                    }
                                }
                            }
                            return "break";
                        }
                    }
                    else {
                        if (action === 'edit') {
                            for (j = 0; j < keys.length; j++) {
                                if (treeData[i].hasOwnProperty(keys[j]) && ((control.editSettings.mode !== 'Cell'
                                    || (!isNullOrUndefined(batchChanges) && batchChanges[changedRecords].length === 0))
                                    || keys[j] === columnName)) {
                                    var editedData = getParentData(control, modifiedData[k].uniqueID);
                                    editedData.taskData[keys[j]] = editedData[keys[j]] = treeData[i][keys[j]] = modifiedData[k][keys[j]];
                                }
                            }
                        }
                        else if (action === 'add' || action === 'batchsave') {
                            var index = void 0;
                            if (control.editSettings.newRowPosition === 'Child') {
                                if (isSelfReference) {
                                    originalData.taskData[control.parentIdMapping] = treeData[i][control.idMapping];
                                    treeData.splice(i + 1, 0, originalData.taskData);
                                }
                                else {
                                    if (!treeData[i].hasOwnProperty(control.childMapping)) {
                                        treeData[i][control.childMapping] = [];
                                    }
                                    treeData[i][control.childMapping].push(originalData.taskData);
                                    updateParentRow(key, treeData[i], action, control, isSelfReference, originalData);
                                }
                            }
                            else if (control.editSettings.newRowPosition === 'Below') {
                                treeData.splice(i + 1, 0, originalData.taskData);
                                updateParentRow(key, treeData[i], action, control, isSelfReference, originalData);
                            }
                            else if (!addRowIndex) {
                                index = 0;
                                treeData.splice(index, 0, originalData.taskData);
                            }
                            else if (control.editSettings.newRowPosition === 'Above') {
                                treeData.splice(i, 0, originalData.taskData);
                                updateParentRow(key, treeData[i], action, control, isSelfReference, originalData);
                            }
                        }
                        return "break";
                    }
                }
                else if (!isNullOrUndefined(treeData[i][control.childMapping])) {
                    if (removeChildRecords(treeData[i][control.childMapping], modifiedData[k], action, key, control, isSelfReference, originalData, columnName)) {
                        updateParentRow(key, treeData[i], action, control, isSelfReference);
                    }
                }
            };
            while (i-- && i >= 0) {
                var state_1 = _loop_1();
                if (state_1 === "break")
                    break;
            }
        }
    }
}
export function addAction(details, treeData, control, isSelfReference, addRowIndex, selectedIndex, addRowRecord) {
    var value;
    var isSkip = false;
    var currentViewRecords = control.grid.getCurrentViewRecords();
    value = extend({}, details.value);
    value = getPlainData(value);
    switch (control.editSettings.newRowPosition) {
        case 'Top':
            treeData.unshift(value);
            isSkip = true;
            break;
        case 'Bottom':
            treeData.push(value);
            isSkip = true;
            break;
        case 'Above':
            if (!isNullOrUndefined(addRowRecord)) {
                value = extend({}, addRowRecord);
                value = getPlainData(value);
            }
            else {
                value = extend({}, currentViewRecords[addRowIndex + 1]);
                value = getPlainData(value);
            }
            break;
        case 'Below':
        case 'Child':
            if (!isNullOrUndefined(addRowRecord)) {
                value = extend({}, addRowRecord);
                value = getPlainData(value);
            }
            else {
                var primaryKeys = control.grid.getPrimaryKeyFieldNames()[0];
                var currentdata = currentViewRecords[addRowIndex];
                if (!isNullOrUndefined(currentdata) && currentdata[primaryKeys] === details.value[primaryKeys] || selectedIndex !== -1) {
                    value = extend({}, currentdata);
                }
                else {
                    value = extend({}, details.value);
                }
                value = getPlainData(value);
            }
            if (selectedIndex === -1) {
                treeData.unshift(value);
                isSkip = true;
            }
    }
    return { value: value, isSkip: isSkip };
}
export function removeChildRecords(childRecords, modifiedData, action, key, control, isSelfReference, originalData, columnName) {
    var isChildAll = false;
    var j = childRecords.length;
    while (j-- && j >= 0) {
        if (childRecords[j][key] === modifiedData[key] ||
            (isSelfReference && childRecords[j][control.parentIdMapping] === modifiedData[control.idMapping])) {
            if (action === 'edit') {
                var keys = Object.keys(modifiedData);
                var editedData = getParentData(control, modifiedData.uniqueID);
                for (var i = 0; i < keys.length; i++) {
                    if (childRecords[j].hasOwnProperty(keys[i]) && (control.editSettings.mode !== 'Cell' || keys[i] === columnName)) {
                        editedData[keys[i]] = editedData.taskData[keys[i]] = childRecords[j][keys[i]] = modifiedData[keys[i]];
                    }
                }
                break;
            }
            else if (action === 'add' || action === 'batchsave') {
                if (control.editSettings.newRowPosition === 'Child') {
                    if (isSelfReference) {
                        originalData[control.parentIdMapping] = childRecords[j][control.idMapping];
                        childRecords.splice(j + 1, 0, originalData);
                        updateParentRow(key, childRecords[j], action, control, isSelfReference, originalData);
                    }
                    else {
                        if (!childRecords[j].hasOwnProperty(control.childMapping)) {
                            childRecords[j][control.childMapping] = [];
                        }
                        childRecords[j][control.childMapping].push(originalData.taskData);
                        updateParentRow(key, childRecords[j], action, control, isSelfReference, originalData);
                    }
                }
                else if (control.editSettings.newRowPosition === 'Above') {
                    childRecords.splice(j, 0, originalData.taskData);
                    updateParentRow(key, childRecords[j], action, control, isSelfReference, originalData);
                }
                else if (control.editSettings.newRowPosition === 'Below') {
                    childRecords.splice(j + 1, 0, originalData.taskData);
                    updateParentRow(key, childRecords[j], action, control, isSelfReference, originalData);
                }
            }
            else {
                var parentItem = childRecords[j].parentItem;
                childRecords.splice(j, 1);
                if (!childRecords.length) {
                    isChildAll = true;
                }
            }
        }
        else if (!isNullOrUndefined(childRecords[j][control.childMapping])) {
            if (removeChildRecords(childRecords[j][control.childMapping], modifiedData, action, key, control, isSelfReference, originalData, columnName)) {
                updateParentRow(key, childRecords[j], action, control, isSelfReference);
            }
        }
    }
    return isChildAll;
}
export function updateParentRow(key, record, action, control, isSelfReference, child) {
    if ((control.editSettings.newRowPosition === 'Above' || control.editSettings.newRowPosition === 'Below')
        && ((action === 'add' || action === 'batchsave')) && !isNullOrUndefined(child.parentItem)) {
        var parentData = getParentData(control, child.parentItem.uniqueID);
        parentData.childRecords.push(child);
    }
    else {
        var currentRecords = control.grid.getCurrentViewRecords();
        var index_1;
        currentRecords.map(function (e, i) { if (e[key] === record[key]) {
            index_1 = i;
            return;
        } });
        record = currentRecords[index_1];
        if (control.enableVirtualization && isNullOrUndefined(record) && !isNullOrUndefined(child)) {
            record = getValue('uniqueIDCollection.' + child.parentUniqueID, control);
        }
        record.hasChildRecords = false;
        if (action === 'add' || action === 'batchsave') {
            record.expanded = true;
            record.hasChildRecords = true;
            if (control.sortSettings.columns.length && isNullOrUndefined(child)) {
                child = currentRecords.filter(function (e) {
                    if (e.parentUniqueID === record.uniqueID) {
                        return e;
                    }
                    else {
                        return null;
                    }
                });
            }
            var childRecords = child ? child instanceof Array ? child[0] : child : currentRecords[index_1 + 1];
            if (control.editSettings.newRowPosition !== 'Below') {
                if (!record.hasOwnProperty('childRecords')) {
                    record.childRecords = [];
                }
                else {
                    if (!isNullOrUndefined(child) && record[key] !== child[key]) {
                        record.childRecords.push(child);
                    }
                }
                if (record.childRecords.indexOf(childRecords) === -1 && record[key] !== child[key]) {
                    record.childRecords.unshift(childRecords);
                }
                if (isSelfReference) {
                    if (!record.hasOwnProperty(control.childMapping)) {
                        record[control.childMapping] = [];
                    }
                    if (record[control.childMapping].indexOf(childRecords) === -1 && record[key] !== child[key]) {
                        record[control.childMapping].unshift(childRecords);
                    }
                }
            }
        }
        var primaryKeys = control.grid.getPrimaryKeyFieldNames()[0];
        var data = control.grid.dataSource instanceof DataManager ?
            control.grid.dataSource.dataSource.json : control.grid.dataSource;
        for (var i = 0; i < data.length; i++) {
            if (data[i][primaryKeys] === record[primaryKeys]) {
                data[i] = record;
                break;
            }
        }
        control.grid.setRowData(key, record);
        var row = control.getRowByIndex(index_1);
        if (control.editSettings.mode === 'Batch') {
            row = control.getRows()[control.grid.getRowIndexByPrimaryKey(record[key])];
        }
        var movableRow = void 0;
        if (control.frozenRows || control.getFrozenColumns()) {
            movableRow = control.getMovableRowByIndex(index_1);
        }
        if (!control.enableVirtualization && !isNullOrUndefined(row) || !isNullOrUndefined(movableRow)) {
            control.renderModule.cellRender({
                data: record, cell: row.cells[control.treeColumnIndex] ? row.cells[control.treeColumnIndex]
                    : movableRow.cells[control.treeColumnIndex - control.frozenColumns],
                column: control.grid.getColumns()[control.treeColumnIndex],
                requestType: action
            });
        }
    }
}
