import { isNullOrUndefined, extend, setValue, getValue, merge } from '@syncfusion/ej2-base';
import * as events from '../base/constant';
import { DataManager } from '@syncfusion/ej2-data';
import { findChildrenRecords, getParentData, extendArray } from '../utils';
import { getUid } from '@syncfusion/ej2-grids';
import { updateParentRow, editAction } from './crud-actions';
/**
 * `BatchEdit` module is used to handle batch editing actions.
 * @hidden
 */
var BatchEdit = /** @class */ (function () {
    function BatchEdit(parent) {
        this.batchChildCount = 0;
        this.addedRecords = 'addedRecords';
        this.deletedRecords = 'deletedRecords';
        this.batchAddedRecords = [];
        this.batchDeletedRecords = [];
        this.batchAddRowRecord = [];
        this.parent = parent;
        this.isSelfReference = !isNullOrUndefined(parent.parentIdMapping);
        this.batchRecords = [];
        this.currentViewRecords = [];
        this.isAdd = false;
        this.addEventListener();
    }
    BatchEdit.prototype.addEventListener = function () {
        this.parent.on(events.cellSaved, this.cellSaved, this);
        this.parent.on(events.batchAdd, this.batchAdd, this);
        this.parent.on(events.beforeBatchAdd, this.beforeBatchAdd, this);
        this.parent.on(events.batchSave, this.batchSave, this);
        this.parent.on(events.beforeBatchDelete, this.beforeBatchDelete, this);
        this.parent.on(events.beforeBatchSave, this.beforeBatchSave, this);
        this.parent.on('batchPageAction', this.batchPageAction, this);
        this.parent.on('batchCancelAction', this.batchCancelAction, this);
    };
    /**
     * @hidden
     */
    BatchEdit.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.cellSaved, this.cellSaved);
        this.parent.off(events.batchAdd, this.batchAdd);
        this.parent.off(events.batchSave, this.batchSave);
        this.parent.off(events.beforeBatchAdd, this.beforeBatchAdd);
        this.parent.off(events.beforeBatchDelete, this.beforeBatchDelete);
        this.parent.off(events.beforeBatchSave, this.beforeBatchSave);
        this.parent.off('batchPageAction', this.batchPageAction);
        this.parent.off('batchCancelAction', this.batchCancelAction);
    };
    /**
     * To destroy the editModule
     * @return {void}
     * @hidden
     */
    BatchEdit.prototype.destroy = function () {
        this.removeEventListener();
    };
    /**
     * @hidden
     */
    BatchEdit.prototype.getBatchRecords = function () {
        return this.batchRecords;
    };
    /**
     * @hidden
     */
    BatchEdit.prototype.getAddRowIndex = function () {
        return this.addRowIndex;
    };
    /**
     * @hidden
     */
    BatchEdit.prototype.getSelectedIndex = function () {
        return this.selectedIndex;
    };
    /**
     * @hidden
     */
    BatchEdit.prototype.getBatchChildCount = function () {
        return this.batchChildCount;
    };
    BatchEdit.prototype.batchPageAction = function () {
        var data = (this.parent.grid.dataSource instanceof DataManager ?
            this.parent.grid.dataSource.dataSource.json : this.parent.grid.dataSource);
        var primaryKey = this.parent.grid.getPrimaryKeyFieldNames()[0];
        var index;
        if (!isNullOrUndefined(this.batchAddedRecords) && this.batchAddedRecords.length) {
            for (var i = 0; i < this.batchAddedRecords.length; i++) {
                index = data.map(function (e) { return e[primaryKey]; }).indexOf(this.batchAddedRecords[i][primaryKey]);
                data.splice(index, 1);
            }
        }
        this.batchAddedRecords = this.batchRecords = this.batchAddRowRecord = this.batchDeletedRecords = this.currentViewRecords = [];
    };
    BatchEdit.prototype.cellSaved = function (args) {
        var actualCellIndex = args.cell.cellIndex;
        var frozenCols = this.parent.frozenColumns || this.parent.getFrozenColumns();
        if (frozenCols && args.columnObject.index > frozenCols) {
            actualCellIndex = actualCellIndex + frozenCols;
        }
        if (actualCellIndex === this.parent.treeColumnIndex) {
            this.parent.renderModule.cellRender({ data: args.rowData, cell: args.cell,
                column: this.parent.grid.getColumnByIndex(args.cell.cellIndex)
            });
        }
        if (this.isAdd && this.parent.editSettings.mode === 'Batch' && this.parent.editSettings.newRowPosition !== 'Bottom') {
            var data = (this.parent.grid.dataSource instanceof DataManager ?
                this.parent.grid.dataSource.dataSource.json : this.parent.grid.dataSource);
            var added = void 0;
            var level = 'level';
            var expanded = 'expanded';
            var primaryKey_1 = this.parent.grid.getPrimaryKeyFieldNames()[0];
            var currentDataIndex = void 0;
            var parentRecord = void 0;
            var indexvalue = void 0;
            var index = 'index';
            var parentItem = 'parentItem';
            var uniqueID = 'uniqueID';
            parentRecord = this.selectedIndex > -1 ? this.batchRecords[this.addRowIndex][parentItem] : null;
            var idMapping = void 0;
            var parentUniqueID = void 0;
            var parentIdMapping = void 0;
            var rowObjectIndex = this.parent.editSettings.newRowPosition === 'Top' || this.selectedIndex === -1 ? 0 :
                this.parent.editSettings.newRowPosition === 'Above' ? this.addRowIndex
                    : this.addRowIndex + 1;
            rowObjectIndex = this.getActualRowObjectIndex(rowObjectIndex);
            if (this.newBatchRowAdded) {
                if (this.batchRecords.length) {
                    idMapping = this.batchRecords[this.addRowIndex][this.parent.idMapping];
                    parentIdMapping = this.batchRecords[this.addRowIndex][this.parent.parentIdMapping];
                    if (this.batchRecords[this.addRowIndex][parentItem]) {
                        parentUniqueID = this.batchRecords[this.addRowIndex][parentItem][uniqueID];
                    }
                }
                this.batchAddedRecords = extendArray(this.batchAddedRecords);
                this.batchAddRowRecord = extendArray(this.batchAddRowRecord);
                this.batchAddRowRecord.push(this.batchRecords[this.addRowIndex]);
                added = this.parent.grid.getRowsObject()[rowObjectIndex].changes;
                added.uniqueID = getUid(this.parent.element.id + '_data_');
                setValue('uniqueIDCollection.' + added.uniqueID, added, this.parent);
                if (!added.hasOwnProperty('level')) {
                    this.batchIndex = this.selectedIndex === -1 ? 0 : this.batchIndex;
                    if (this.parent.editSettings.newRowPosition === 'Child') {
                        added.primaryParent = parentRecord;
                        if (this.selectedIndex > -1) {
                            added.parentItem = extend({}, this.batchRecords[this.addRowIndex]);
                            added.parentUniqueID = added.parentItem.uniqueID;
                            delete added.parentItem.childRecords;
                            delete added.parentItem[this.parent.childMapping];
                            added.level = added.parentItem.level + 1;
                            added.index = this.batchIndex;
                            var childRecordCount = findChildrenRecords(this.batchRecords[this.addRowIndex]).length;
                            var record = findChildrenRecords(this.batchRecords[this.addRowIndex])[childRecordCount - 1];
                            record = isNullOrUndefined(record) ? this.batchRecords[this.addRowIndex] : record;
                            currentDataIndex = data.map(function (e) { return e[primaryKey_1]; }).indexOf(record[primaryKey_1]);
                            if (this.isSelfReference) {
                                added[this.parent.parentIdMapping] = idMapping;
                            }
                            updateParentRow(primaryKey_1, added.parentItem, 'add', this.parent, this.isSelfReference, added);
                        }
                    }
                    else if ((this.parent.editSettings.newRowPosition === 'Above' || this.parent.editSettings.newRowPosition === 'Below')
                        && !isNullOrUndefined(this.batchRecords[this.addRowIndex])) {
                        added.level = this.batchRecords[this.addRowIndex][level];
                        if (added.level && this.selectedIndex > -1) {
                            added.parentItem = parentRecord;
                            added.parentUniqueID = parentUniqueID;
                            delete added.parentItem.childRecords;
                            delete added.parentItem[this.parent.childMapping];
                        }
                        added.index = this.parent.editSettings.newRowPosition === 'Below' ? this.batchIndex : this.batchIndex - 1;
                        if (this.parent.editSettings.newRowPosition === 'Below' && this.selectedIndex > -1) {
                            var childRecordCount = findChildrenRecords(this.batchRecords[this.addRowIndex]).length;
                            var record = findChildrenRecords(this.batchRecords[this.addRowIndex])[childRecordCount - 1];
                            record = isNullOrUndefined(record) ? this.batchRecords[this.addRowIndex] : record;
                            currentDataIndex = data.map(function (e) { return e[primaryKey_1]; }).indexOf(record[primaryKey_1]);
                        }
                        if (this.parent.editSettings.newRowPosition === 'Above' && this.selectedIndex > -1) {
                            var record = this.batchRecords[this.addRowIndex];
                            currentDataIndex = data.map(function (e) { return e[primaryKey_1]; }).indexOf(record[primaryKey_1]);
                        }
                        if (this.isSelfReference) {
                            added[this.parent.parentIdMapping] = parentIdMapping;
                        }
                    }
                    added.index = added.index === -1 ? 0 : added.index;
                    added.hasChildRecords = false;
                    added.childRecords = [];
                    this.batchRecords.splice(added.index, 0, added);
                    this.currentViewRecords.splice(added.index, 0, added);
                    if (currentDataIndex) {
                        indexvalue = currentDataIndex;
                    }
                    else {
                        indexvalue = added.index;
                    }
                    if (this.parent.editSettings.newRowPosition !== 'Above') {
                        indexvalue = added.index === 0 ? indexvalue : indexvalue + 1;
                    }
                    data.splice(indexvalue, 0, added);
                    this.batchAddedRecords.push(added);
                }
                this.parent.grid.getRowsObject()[rowObjectIndex].data = added;
                this.newBatchRowAdded = false;
            }
            if (this.parent.frozenColumns || this.parent.getFrozenColumns()
                && this.parent.grid.getRowsObject()[rowObjectIndex].edit === 'add') {
                merge(this.currentViewRecords[rowObjectIndex], this.parent.grid.getRowsObject()[rowObjectIndex].changes);
            }
        }
    };
    BatchEdit.prototype.beforeBatchAdd = function (e) {
        var isTabLastRow = 'isTabLastRow';
        if (this.parent.editSettings.mode === 'Cell' && this.parent.editModule[isTabLastRow]) {
            e.cancel = true;
            this.parent.editModule[isTabLastRow] = false;
            return;
        }
        this.selectedIndex = this.parent.grid.selectedRowIndex;
        this.addRowIndex = this.parent.grid.selectedRowIndex > -1 ? this.parent.grid.selectedRowIndex : 0;
        this.addRowRecord = this.parent.getSelectedRecords()[0];
    };
    BatchEdit.prototype.batchAdd = function (e) {
        if (this.parent.editSettings.newRowPosition !== 'Bottom') {
            this.isAdd = true;
            this.newBatchRowAdded = true;
            var actualIndex = 0;
            if (!this.batchRecords.length) {
                this.batchAddedRecords = [];
                this.batchRecords = extendArray(this.parent.grid.getCurrentViewRecords());
                this.currentViewRecords = extendArray(this.parent.grid.getCurrentViewRecords());
            }
            if (this.parent.editSettings.newRowPosition !== 'Top') {
                var records = this.parent.grid.getCurrentViewRecords();
                if (this.parent.editSettings.mode === 'Batch' && (this.parent.getBatchChanges()[this.addedRecords].length > 1
                    || this.parent.getBatchChanges()[this.deletedRecords].length)) {
                    records = this.batchRecords;
                }
                this.updateChildCount(records);
                this.parent.notify(events.beginAdd, {});
                this.batchChildCount = 0;
            }
            this.updateRowIndex();
            // update focus module, need to refix this once grid source modified.
            var focusModule = getValue('focusModule', this.parent.grid);
            var table = this.parent.getContentTable();
            if (this.parent.getBatchChanges()[this.deletedRecords].length && this.parent.editSettings.newRowPosition === 'Above') {
                actualIndex = e.row.rowIndex;
                focusModule.getContent().matrix.matrix = this.matrix;
            }
            else {
                actualIndex = table.getElementsByClassName('e-batchrow')[0].rowIndex;
                // if (this.parent.frozenRows || this.parent.frozenColumns) {
                //   actualIndex = this.batchIndex;
                // }
            }
            focusModule.getContent().matrix.current = [actualIndex, focusModule.getContent().matrix.current[1]];
        }
    };
    BatchEdit.prototype.beforeBatchDelete = function (e) {
        if (!this.batchRecords.length) {
            this.batchRecords = extendArray(this.parent.grid.getCurrentViewRecords());
            this.currentViewRecords = extendArray(this.parent.grid.getCurrentViewRecords());
        }
        var focusModule = getValue('focusModule', this.parent.grid);
        this.matrix = focusModule.getContent().matrix.matrix;
        this.parent = this.parent;
        var row = [];
        var records;
        var data;
        var primarykey = this.parent.grid.getPrimaryKeyFieldNames()[0];
        data = this.parent.grid.getSelectedRecords()[this.parent.grid.getSelectedRecords().length - 1];
        var childs = findChildrenRecords(data);
        if (childs.length) {
            for (var i = 0; i < childs.length; i++) {
                var index = this.parent.grid.getRowIndexByPrimaryKey(childs[i][primarykey]);
                row.push(this.parent.grid.getRows()[index]);
                if (this.parent.frozenRows || this.parent.frozenColumns || this.parent.getFrozenColumns()) {
                    row.push(this.parent.grid.getMovableRows()[index]);
                }
            }
        }
        if (!isNullOrUndefined(data.parentItem)) {
            var parentItem = getParentData(this.parent, data.parentItem.uniqueID);
            if (!isNullOrUndefined(parentItem) && parentItem.hasChildRecords) {
                var childIndex = parentItem.childRecords.indexOf(data);
                parentItem.childRecords.splice(childIndex, 1);
            }
            this.batchDeletedRecords = extendArray(this.batchDeletedRecords);
            this.batchDeletedRecords.push(data);
        }
        childs.push(data);
        records = childs;
        for (var i = 0; i < records.length; i++) {
            var indexvalue = this.batchRecords.map(function (e) { return e[primarykey]; }).indexOf(records[i][primarykey]);
            if (indexvalue !== -1) {
                this.batchRecords.splice(indexvalue, 1);
            }
        }
        for (var i = 0; i < row.length; i++) {
            if (!isNullOrUndefined(row[i])) {
                this.parent.grid.selectionModule.selectedRecords.push(row[i]);
            }
        }
    };
    BatchEdit.prototype.updateRowIndex = function () {
        var rows = this.parent.grid.getDataRows();
        for (var i = 0; i < rows.length; i++) {
            rows[i].setAttribute('aria-rowindex', i.toString());
        }
        if (this.parent.frozenRows || this.parent.getFrozenColumns() || this.parent.frozenColumns) {
            var mRows = this.parent.grid.getMovableDataRows();
            for (var i = 0; i < mRows.length; i++) {
                mRows[i].setAttribute('aria-rowindex', i.toString());
            }
        }
    };
    BatchEdit.prototype.updateChildCount = function (records) {
        var primaryKey = this.parent.grid.getPrimaryKeyFieldNames()[0];
        var addedRecords = 'addedRecords';
        var deletedRecords = 'deletedRecords';
        var parentItem = this.parent.editSettings.newRowPosition === 'Child' ? 'primaryParent' : 'parentItem';
        for (var i = 0; i < this.parent.getBatchChanges()[addedRecords].length; i++) {
            if (!isNullOrUndefined(this.parent.getBatchChanges()[addedRecords][i][parentItem])) {
                if (this.parent.getBatchChanges()[addedRecords][i][parentItem][primaryKey] === records[this.addRowIndex][primaryKey]) {
                    this.batchChildCount = this.batchChildCount + 1;
                }
            }
        }
    };
    BatchEdit.prototype.beforeBatchSave = function (e) {
        var changeRecords = 'changedRecords';
        var deleterecords = 'deletedRecords';
        var changedRecords = e.batchChanges[changeRecords];
        if (e.batchChanges[changeRecords].length) {
            var columnName = void 0;
            for (var i = 0; i < changedRecords.length; i++) {
                editAction({ value: changedRecords[i], action: 'edit' }, this.parent, this.isSelfReference, this.addRowIndex, this.selectedIndex, columnName);
            }
        }
        if (e.batchChanges[deleterecords].length) {
            var deletedRecords = e.batchChanges[deleterecords];
            var record = deletedRecords;
            for (var i = 0; i < record.length; i++) {
                this.deleteUniqueID(record[i].uniqueID);
                var childs = findChildrenRecords(record[i]);
                for (var c = 0; c < childs.length; c++) {
                    this.deleteUniqueID(childs[c].uniqueID);
                }
                e.batchChanges[deleterecords] = e.batchChanges[deleterecords].concat(childs);
            }
        }
        this.isAdd = false;
    };
    BatchEdit.prototype.deleteUniqueID = function (value) {
        var idFilter = 'uniqueIDFilterCollection';
        delete this.parent[idFilter][value];
        var id = 'uniqueIDCollection';
        delete this.parent[id][value];
    };
    BatchEdit.prototype.batchCancelAction = function () {
        var targetElement = 'targetElement';
        var index;
        var parentItem = 'parentItem';
        var indexvalue = 'index';
        var currentViewRecords = this.parent.grid.getCurrentViewRecords();
        var childRecords = 'childRecords';
        var data = (this.parent.grid.dataSource instanceof DataManager ?
            this.parent.grid.dataSource.dataSource.json : this.parent.grid.dataSource);
        var primaryKey = this.parent.grid.getPrimaryKeyFieldNames()[0];
        if (!isNullOrUndefined(this.parent[targetElement])) {
            var row = this.parent[targetElement].closest('tr');
            this.parent.collapseRow(row);
            this.parent[targetElement] = null;
        }
        if (!isNullOrUndefined(this.batchAddedRecords)) {
            for (var i = 0; i < this.batchAddedRecords.length; i++) {
                index = data.map(function (e) { return e[primaryKey]; }).indexOf(this.batchAddedRecords[i][primaryKey]);
                data.splice(index, 1);
                if (this.parent.editSettings.newRowPosition === 'Child') {
                    index = currentViewRecords.map(function (e) { return e[primaryKey]; })
                        .indexOf(this.batchAddedRecords[i][parentItem] ? this.batchAddedRecords[i][parentItem][primaryKey]
                        : this.batchAddedRecords[i][primaryKey]);
                    if (!isNullOrUndefined(currentViewRecords[index])) {
                        var children = currentViewRecords[index][childRecords];
                        for (var j = 0; children && j < children.length; j++) {
                            if (children[j][primaryKey] === this.batchAddedRecords[i][primaryKey]) {
                                currentViewRecords[index][childRecords].splice(j, 1);
                            }
                        }
                    }
                }
            }
        }
        if (!isNullOrUndefined(this.batchDeletedRecords)) {
            for (var i = 0; i < this.batchDeletedRecords.length; i++) {
                if (!isNullOrUndefined(this.batchDeletedRecords[i][parentItem])) {
                    index = currentViewRecords.map(function (e) { return e[primaryKey]; })
                        .indexOf(this.batchDeletedRecords[i][parentItem][primaryKey]);
                    var positionIndex = this.batchDeletedRecords[i][indexvalue] === 0 ? this.batchDeletedRecords[i][indexvalue] :
                        this.batchDeletedRecords[i][indexvalue] - 1;
                    if (!isNullOrUndefined(currentViewRecords[index])) {
                        currentViewRecords[index][childRecords].splice(positionIndex, 0, this.batchDeletedRecords[i]);
                    }
                }
            }
        }
        this.batchAddedRecords = this.batchRecords = this.batchAddRowRecord = this.currentViewRecords = [];
        this.batchRecords = extendArray(this.parent.grid.getCurrentViewRecords());
        this.batchIndex = 0;
        this.currentViewRecords = extendArray(this.parent.grid.getCurrentViewRecords());
        this.batchDeletedRecords = [];
        this.parent.refresh();
    };
    BatchEdit.prototype.batchSave = function (args) {
        if (this.parent.editSettings.mode === 'Batch') {
            var i = void 0;
            var batchChanges = this.parent.getBatchChanges();
            var deletedRecords = 'deletedRecords';
            var addedRecords = 'addedRecords';
            var index = 'index';
            var uniqueID = 'uniqueID';
            var data = (this.parent.grid.dataSource instanceof DataManager ?
                this.parent.grid.dataSource.dataSource.json : this.parent.grid.dataSource);
            var currentViewRecords = this.parent.grid.getCurrentViewRecords();
            var primarykey_1 = this.parent.grid.getPrimaryKeyFieldNames()[0];
            var level = 'level';
            var addRecords = batchChanges[addedRecords];
            var parentItem = 'parentItem';
            var selectedIndex = void 0;
            var addRowIndex = void 0;
            var columnName = void 0;
            var addRowRecord = void 0;
            var childRecords = 'childRecords';
            if (addRecords.length > 1 && this.parent.editSettings.newRowPosition !== 'Bottom') {
                addRecords.reverse();
            }
            if (this.parent.editSettings.newRowPosition !== 'Bottom') {
                data.splice(data.length - addRecords.length, addRecords.length);
                if (!this.parent.allowPaging) {
                    if (currentViewRecords.length > addRecords.length) {
                        currentViewRecords.splice(currentViewRecords.length - addRecords.length, addRecords.length);
                    }
                }
                else {
                    var totalRecords = extendArray(data);
                    var startIndex = totalRecords.map(function (e) { return e[primarykey_1]; })
                        .indexOf(currentViewRecords[0][primarykey_1]);
                    var endIndex = startIndex + this.parent.grid.pageSettings.pageSize;
                    currentViewRecords = totalRecords.splice(startIndex, endIndex);
                }
            }
            for (i = 0; i < addRecords.length; i++) {
                var taskData = extend({}, addRecords[i]);
                delete taskData.parentItem;
                delete taskData.uniqueID;
                delete taskData.index;
                delete taskData.level;
                delete taskData.hasChildRecords;
                delete taskData.childRecords;
                delete taskData.parentUniqueID;
                if (!isNullOrUndefined(taskData.primaryParent)) {
                    delete taskData.primaryParent;
                }
                addRecords[i].taskData = taskData;
                addRowRecord = this.batchAddRowRecord[i];
                if (isNullOrUndefined(addRowRecord)) {
                    addRowRecord = this.batchAddRowRecord[i - 1];
                }
                if (this.isSelfReference) {
                    if (!isNullOrUndefined(addRecords[i].parentItem)) {
                        updateParentRow(primarykey_1, addRecords[i].parentItem, 'add', this.parent, this.isSelfReference, addRecords[i]);
                    }
                }
                if (!isNullOrUndefined(addRowRecord)) {
                    addRowIndex = addRowRecord.index;
                }
                if (this.parent.editSettings.newRowPosition !== 'Top' && this.parent.editSettings.newRowPosition !== 'Bottom') {
                    if (isNullOrUndefined(addRecords[i].parentItem) && this.selectedIndex === -1) {
                        selectedIndex = -1;
                        addRowRecord = null;
                    }
                }
                editAction({ value: addRecords[i], action: 'add' }, this.parent, this.isSelfReference, addRowIndex, selectedIndex, columnName, addRowRecord);
                selectedIndex = null;
                if (this.parent.editSettings.newRowPosition === 'Child' && !isNullOrUndefined(addRecords[i][parentItem])) {
                    var indexValue = currentViewRecords.map(function (e) { return e[primarykey_1]; })
                        .indexOf(addRecords[i][parentItem][primarykey_1]);
                    var children = currentViewRecords[indexValue][childRecords];
                    for (var j = 0; j < children.length; j++) {
                        if (children[j][primarykey_1] === addRecords[i][primarykey_1]) {
                            currentViewRecords[indexValue][childRecords].splice(j, 1);
                        }
                    }
                }
            }
            if (batchChanges[deletedRecords].length) {
                for (i = 0; i < batchChanges[deletedRecords].length; i++) {
                    editAction({ value: batchChanges[deletedRecords][i], action: 'delete' }, this.parent, this.isSelfReference, addRowIndex, selectedIndex, columnName, addRowRecord);
                }
            }
            this.parent.parentData = [];
            for (var i_1 = 0; i_1 < data.length; i_1++) {
                data[i_1][index] = i_1;
                setValue('uniqueIDCollection.' + data[i_1][uniqueID] + '.index', i_1, this.parent);
                if (!data[i_1][level]) {
                    this.parent.parentData.push(data[i_1]);
                }
            }
        }
        this.batchAddRowRecord = this.batchAddedRecords = this.batchRecords = this.batchDeletedRecords = this.currentViewRecords = [];
    };
    BatchEdit.prototype.getActualRowObjectIndex = function (index) {
        var rows = this.parent.grid.getDataRows();
        if ((this.parent.editSettings.newRowPosition === 'Below' || this.parent.editSettings.newRowPosition === 'Child')
            && this.selectedIndex > -1) {
            if (!isNullOrUndefined(this.batchRecords[this.addRowIndex]) && this.batchRecords[this.addRowIndex].expanded) {
                if (this.parent.getBatchChanges()[this.addedRecords].length > 1
                    || this.parent.getBatchChanges()[this.deletedRecords].length) {
                    index += findChildrenRecords(this.batchRecords[this.addRowIndex]).length;
                    if (this.parent.editSettings.newRowPosition !== 'Child') {
                        var batchChildCount = this.getBatchChildCount();
                        index = index + batchChildCount;
                    }
                }
                else {
                    index += findChildrenRecords(this.batchRecords[this.addRowIndex]).length;
                }
            }
            if (index >= rows.length) {
                index = rows.length - 1;
            }
            this.updateChildCount(this.parent.grid.getCurrentViewRecords());
            if (this.batchChildCount) {
                index += this.batchChildCount;
            }
            this.batchChildCount = 0;
        }
        return index;
    };
    return BatchEdit;
}());
export { BatchEdit };
