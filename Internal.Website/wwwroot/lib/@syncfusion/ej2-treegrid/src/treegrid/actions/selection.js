import { isNullOrUndefined, removeClass, isBlazor } from '@syncfusion/ej2-base';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { parentsUntil, getObject } from '@syncfusion/ej2-grids';
import * as events from '../base/constant';
import { getParentData, isRemoteData, isCheckboxcolumn } from '../utils';
/**
 * TreeGrid Selection module
 * @hidden
 */
var Selection = /** @class */ (function () {
    /**
     * Constructor for Selection module
     */
    function Selection(parent) {
        this.parent = parent;
        this.selectedItems = [];
        this.selectedIndexes = [];
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Selection.prototype.getModuleName = function () {
        return 'selection';
    };
    Selection.prototype.addEventListener = function () {
        this.parent.on('dataBoundArg', this.headerCheckbox, this);
        this.parent.on('columnCheckbox', this.columnCheckbox, this);
        this.parent.on('updateGridActions', this.updateGridActions, this);
        this.parent.grid.on('colgroup-refresh', this.headerCheckbox, this);
        this.parent.on('checkboxSelection', this.checkboxSelection, this);
    };
    Selection.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('dataBoundArg', this.headerCheckbox);
        this.parent.off('columnCheckbox', this.columnCheckbox);
        this.parent.grid.off('colgroup-refresh', this.headerCheckbox);
        this.parent.off('checkboxSelection', this.checkboxSelection);
        this.parent.off('updateGridActions', this.updateGridActions);
    };
    /**
     * To destroy the Selection
     * @return {void}
     * @hidden
     */
    Selection.prototype.destroy = function () {
        this.removeEventListener();
    };
    Selection.prototype.checkboxSelection = function (args) {
        var target = getObject('target', args);
        var checkWrap = parentsUntil(target, 'e-checkbox-wrapper');
        var checkBox;
        if (checkWrap && checkWrap.querySelectorAll('.e-treecheckselect').length > 0) {
            checkBox = checkWrap.querySelector('input[type="checkbox"]');
            var rowIndex = void 0;
            rowIndex = [];
            rowIndex.push(target.closest('tr').rowIndex);
            this.selectCheckboxes(rowIndex);
            this.triggerChkChangeEvent(checkBox, checkBox.nextElementSibling.classList.contains('e-check'), target.closest('tr'));
        }
        else if (checkWrap && checkWrap.querySelectorAll('.e-treeselectall').length > 0 && this.parent.autoCheckHierarchy) {
            var checkBoxvalue = !checkWrap.querySelector('.e-frame').classList.contains('e-check')
                && !checkWrap.querySelector('.e-frame').classList.contains('e-stop');
            this.headerSelection(checkBoxvalue);
            checkBox = checkWrap.querySelector('input[type="checkbox"]');
            this.triggerChkChangeEvent(checkBox, checkBoxvalue, target.closest('tr'));
        }
    };
    Selection.prototype.triggerChkChangeEvent = function (checkBox, checkState, rowElement) {
        var data = this.parent.getCurrentViewRecords()[rowElement.rowIndex];
        var args = { checked: checkState, target: checkBox, rowElement: rowElement,
            rowData: checkBox.classList.contains('e-treeselectall')
                ? this.parent.getCheckedRecords() : data };
        this.parent.trigger(events.checkboxChange, args);
    };
    Selection.prototype.getCheckboxcolumnIndex = function () {
        var mappingUid;
        var columnIndex;
        var columns = (this.parent.columns);
        for (var col = 0; col < columns.length; col++) {
            if (columns[col].showCheckbox) {
                mappingUid = this.parent.columns[col].uid;
            }
        }
        var headerCelllength = this.parent.getHeaderContent().querySelectorAll('.e-headercelldiv').length;
        for (var j = 0; j < headerCelllength; j++) {
            var headercell = this.parent.getHeaderContent().querySelectorAll('.e-headercelldiv')[j];
            if (headercell.getAttribute('e-mappinguid') === mappingUid) {
                columnIndex = j;
            }
        }
        return columnIndex;
    };
    Selection.prototype.headerCheckbox = function () {
        this.columnIndex = this.getCheckboxcolumnIndex();
        if (this.columnIndex > -1 && this.parent.getHeaderContent().querySelectorAll('.e-treeselectall').length === 0) {
            var headerElement = this.parent.getHeaderContent().querySelectorAll('.e-headercelldiv')[this.columnIndex];
            var checkWrap = void 0;
            var value = false;
            var rowChkBox = this.parent.createElement('input', { className: 'e-treeselectall', attrs: { 'type': 'checkbox' } });
            checkWrap = createCheckBox(this.parent.createElement, false, { checked: value, label: ' ' });
            checkWrap.classList.add('e-hierarchycheckbox');
            checkWrap.querySelector('.e-frame').style.width = '18px';
            checkWrap.insertBefore(rowChkBox.cloneNode(), checkWrap.firstChild);
            if (!isNullOrUndefined(headerElement)) {
                headerElement.insertBefore(checkWrap, headerElement.firstChild);
            }
            if (this.parent.autoCheckHierarchy) {
                this.headerSelection();
            }
        }
        else if (this.columnIndex > -1 && this.parent.getHeaderContent().querySelectorAll('.e-treeselectall').length > 0) {
            var checkWrap = this.parent.getHeaderContent().querySelectorAll('.e-checkbox-wrapper')[0];
            var checkBoxvalue = checkWrap.querySelector('.e-frame').classList.contains('e-check');
            if (this.parent.autoCheckHierarchy && checkBoxvalue) {
                this.headerSelection(checkBoxvalue);
            }
        }
    };
    Selection.prototype.renderColumnCheckbox = function (args) {
        var checkWrap;
        var rowChkBox = this.parent.createElement('input', { className: 'e-treecheckselect', attrs: { 'type': 'checkbox' } });
        var data = args.data;
        args.cell.classList.add('e-treegridcheckbox');
        args.cell.setAttribute('aria-label', 'checkbox');
        var value = (isNullOrUndefined(data.checkboxState) || data.checkboxState === 'uncheck') ? false : true;
        checkWrap = createCheckBox(this.parent.createElement, false, { checked: value, label: ' ' });
        checkWrap.classList.add('e-hierarchycheckbox');
        checkWrap.querySelector('.e-frame').style.width = '18px';
        if (data.checkboxState === 'indeterminate') {
            var checkbox = checkWrap.querySelectorAll('.e-frame')[0];
            removeClass([checkbox], ['e-check', 'e-stop', 'e-uncheck']);
            checkWrap.querySelector('.e-frame').classList.add('e-stop');
        }
        checkWrap.insertBefore(rowChkBox.cloneNode(), checkWrap.firstChild);
        return checkWrap;
    };
    Selection.prototype.columnCheckbox = function (container) {
        var checkWrap = this.renderColumnCheckbox(container);
        var containerELe = container.cell.querySelector('.e-treecolumn-container');
        if (!isNullOrUndefined(containerELe)) {
            if (!container.cell.querySelector('.e-hierarchycheckbox')) {
                containerELe.insertBefore(checkWrap, containerELe.querySelectorAll('.e-treecell')[0]);
            }
        }
        else {
            var spanEle = this.parent.createElement('span', { className: 'e-treecheckbox' });
            var data = container.cell.innerHTML;
            container.cell.innerHTML = '';
            spanEle.innerHTML = data;
            var divEle = this.parent.createElement('div', { className: 'e-treecheckbox-container' });
            divEle.appendChild(checkWrap);
            divEle.appendChild(spanEle);
            container.cell.appendChild(divEle);
        }
    };
    Selection.prototype.selectCheckboxes = function (rowIndexes) {
        var adaptorName = 'adaptorName';
        for (var i = 0; i < rowIndexes.length; i++) {
            var record = this.parent.getCurrentViewRecords()[rowIndexes[i]];
            var flatRecord = getParentData(this.parent, record.uniqueID);
            record = (isBlazor() && this.parent.dataSource[adaptorName] === 'BlazorAdaptor') ?
                record : flatRecord;
            var checkboxState = (record.checkboxState === 'uncheck') ? 'check' : 'uncheck';
            record.checkboxState = checkboxState;
            var keys = Object.keys(record);
            for (var j = 0; j < keys.length; j++) {
                if (flatRecord.hasOwnProperty(keys[j])) {
                    flatRecord[keys[j]] = record[keys[j]];
                }
            }
            this.traverSelection(record, checkboxState, false);
            if (this.parent.autoCheckHierarchy) {
                this.headerSelection();
            }
        }
    };
    Selection.prototype.traverSelection = function (record, checkboxState, ischildItem) {
        var length = 0;
        this.updateSelectedItems(record, checkboxState);
        if (!ischildItem && record.parentItem && this.parent.autoCheckHierarchy) {
            this.updateParentSelection(record.parentItem);
        }
        if (record.childRecords && this.parent.autoCheckHierarchy) {
            var childRecords = record.childRecords;
            if (!isNullOrUndefined(this.parent.filterModule) &&
                this.parent.filterModule.filteredResult.length > 0 && this.parent.autoCheckHierarchy) {
                childRecords = this.getFilteredChildRecords(childRecords);
            }
            length = childRecords.length;
            for (var count = 0; count < length; count++) {
                if (!childRecords[count].isSummaryRow) {
                    if (childRecords[count].hasChildRecords) {
                        this.traverSelection(childRecords[count], checkboxState, true);
                    }
                    else {
                        this.updateSelectedItems(childRecords[count], checkboxState);
                    }
                }
            }
        }
    };
    Selection.prototype.getFilteredChildRecords = function (childRecords) {
        var _this = this;
        var filteredChildRecords = childRecords.filter(function (e) {
            return _this.parent.filterModule.filteredResult.indexOf(e) > -1;
        });
        return filteredChildRecords;
    };
    Selection.prototype.updateParentSelection = function (parentRecord) {
        var adaptorName = 'adaptorName';
        var length = 0;
        var childRecords = [];
        var record = getParentData(this.parent, parentRecord.uniqueID);
        if (record && record.childRecords) {
            childRecords = record.childRecords;
        }
        if (!isNullOrUndefined(this.parent.filterModule) &&
            this.parent.filterModule.filteredResult.length > 0 && this.parent.autoCheckHierarchy) {
            childRecords = this.getFilteredChildRecords(childRecords);
        }
        length = childRecords && childRecords.length;
        var indeter = 0;
        var checkChildRecords = 0;
        if (!isNullOrUndefined(record)) {
            var _loop_1 = function (i) {
                var childRecord = this_1.parent.getCurrentViewRecords().filter(function (e) {
                    return e.uniqueID === childRecords[i].uniqueID;
                });
                var currentRecord = getParentData(this_1.parent, childRecords[i].uniqueID);
                var checkBoxRecord = (isBlazor() && this_1.parent.dataSource[adaptorName] === 'BlazorAdaptor') ?
                    childRecord[0] : currentRecord;
                if (!isNullOrUndefined(checkBoxRecord)) {
                    if (checkBoxRecord.checkboxState === 'indeterminate') {
                        indeter++;
                    }
                    else if (checkBoxRecord.checkboxState === 'check') {
                        checkChildRecords++;
                    }
                }
            };
            var this_1 = this;
            for (var i = 0; i < childRecords.length; i++) {
                _loop_1(i);
            }
            if (indeter > 0 || (checkChildRecords > 0 && checkChildRecords !== length)) {
                record.checkboxState = 'indeterminate';
            }
            else if (checkChildRecords === 0 && indeter === 0) {
                record.checkboxState = 'uncheck';
            }
            else {
                record.checkboxState = 'check';
            }
            this.updateSelectedItems(record, record.checkboxState);
            if (record.parentItem) {
                this.updateParentSelection(record.parentItem);
            }
        }
    };
    Selection.prototype.headerSelection = function (checkAll) {
        var _this = this;
        var adaptorName = 'adaptorName';
        var index = -1;
        var length = 0;
        var data = (!isNullOrUndefined(this.parent.filterModule) &&
            this.parent.filterModule.filteredResult.length > 0) ? this.parent.filterModule.filteredResult :
            this.parent.flatData;
        data = (isBlazor() && this.parent.dataSource[adaptorName] === 'BlazorAdaptor') || isRemoteData(this.parent) ?
            this.parent.getCurrentViewRecords() : data;
        if (!isNullOrUndefined(checkAll)) {
            for (var i = 0; i < data.length; i++) {
                if (checkAll) {
                    if (data[i].checkboxState === 'check') {
                        continue;
                    }
                    data[i].checkboxState = 'check';
                    this.updateSelectedItems(data[i], data[i].checkboxState);
                }
                else {
                    index = this.selectedItems.indexOf(data[i]);
                    if (index > -1) {
                        data[i].checkboxState = 'uncheck';
                        this.updateSelectedItems(data[i], data[i].checkboxState);
                        if (this.parent.autoCheckHierarchy) {
                            this.updateParentSelection(data[i]);
                        }
                    }
                }
            }
        }
        if (checkAll === false && this.parent.enableVirtualization) {
            this.selectedItems = [];
            this.selectedIndexes = [];
            data.filter(function (rec) {
                rec.checkboxState = 'uncheck';
                _this.updateSelectedItems(rec, rec.checkboxState);
            });
        }
        length = this.selectedItems.length;
        var checkbox = this.parent.getHeaderContent().querySelectorAll('.e-frame')[0];
        if (length > 0 && data.length > 0) {
            if (length !== data.length && !checkAll) {
                removeClass([checkbox], ['e-check']);
                checkbox.classList.add('e-stop');
            }
            else {
                removeClass([checkbox], ['e-stop']);
                checkbox.classList.add('e-check');
            }
        }
        else {
            removeClass([checkbox], ['e-check', 'e-stop']);
        }
    };
    Selection.prototype.updateSelectedItems = function (currentRecord, checkState, filter) {
        var record = this.parent.getCurrentViewRecords().filter(function (e) {
            return e.uniqueID === currentRecord.uniqueID;
        });
        var checkedRecord;
        var adaptorName = 'adaptorName';
        var recordIndex = this.parent.getCurrentViewRecords().indexOf(record[0]);
        var checkboxRecord = getParentData(this.parent, currentRecord.uniqueID);
        var checkbox;
        if (recordIndex > -1) {
            var tr = this.parent.getRows()[recordIndex];
            var movableTr = void 0;
            if (this.parent.frozenRows || this.parent.getFrozenColumns()) {
                movableTr = this.parent.getMovableDataRows()[recordIndex];
            }
            checkbox = tr.querySelectorAll('.e-frame')[0] ? tr.querySelectorAll('.e-frame')[0]
                : movableTr.querySelectorAll('.e-frame')[0];
            if (!isNullOrUndefined(checkbox)) {
                removeClass([checkbox], ['e-check', 'e-stop', 'e-uncheck']);
            }
        }
        checkedRecord = (isBlazor() && this.parent.dataSource[adaptorName] === 'BlazorAdaptor') ?
            record[0] : checkboxRecord;
        if (isNullOrUndefined(checkedRecord)) {
            checkedRecord = currentRecord;
        }
        checkedRecord.checkboxState = checkState;
        if (checkState === 'check' && isNullOrUndefined(currentRecord.isSummaryRow)) {
            if (recordIndex !== -1 && this.selectedIndexes.indexOf(recordIndex) === -1) {
                this.selectedIndexes.push(recordIndex);
            }
            if (this.selectedItems.indexOf(checkedRecord) === -1 && (recordIndex !== -1 &&
                (!isNullOrUndefined(this.parent.filterModule) && this.parent.filterModule.filteredResult.length > 0))) {
                this.selectedItems.push(checkedRecord);
            }
            if (this.selectedItems.indexOf(checkedRecord) === -1 && (!isNullOrUndefined(this.parent.filterModule) &&
                this.parent.filterModule.filteredResult.length === 0)) {
                this.selectedItems.push(checkedRecord);
            }
            if (this.selectedItems.indexOf(checkedRecord) === -1 && isNullOrUndefined(this.parent.filterModule)) {
                this.selectedItems.push(checkedRecord);
            }
        }
        else if ((checkState === 'uncheck' || checkState === 'indeterminate') && isNullOrUndefined(currentRecord.isSummaryRow)) {
            var index = this.selectedItems.indexOf(checkedRecord);
            if (index !== -1) {
                this.selectedItems.splice(index, 1);
            }
            if (this.selectedIndexes.indexOf(recordIndex) !== -1) {
                var checkedIndex = this.selectedIndexes.indexOf(recordIndex);
                this.selectedIndexes.splice(checkedIndex, 1);
            }
        }
        var checkBoxclass = checkState === 'indeterminate' ? 'e-stop' : 'e-' + checkState;
        if (recordIndex > -1) {
            if (!isNullOrUndefined(checkbox)) {
                checkbox.classList.add(checkBoxclass);
            }
        }
    };
    Selection.prototype.updateGridActions = function (args) {
        var _this = this;
        var requestType = args.requestType;
        var childData;
        var childLength;
        if (isCheckboxcolumn(this.parent)) {
            if (this.parent.autoCheckHierarchy) {
                if ((requestType === 'sorting' || requestType === 'paging')) {
                    var rows = this.parent.grid.getRows();
                    childData = this.parent.getCurrentViewRecords();
                    childLength = childData.length;
                    this.selectedIndexes = [];
                    for (var i = 0; i < childLength; i++) {
                        if (!rows[i].classList.contains('e-summaryrow')) {
                            this.updateSelectedItems(childData[i], childData[i].checkboxState, true);
                        }
                    }
                }
                else if (requestType === 'delete' || args.action === 'add') {
                    var updatedData = [];
                    if (requestType === 'delete') {
                        updatedData = args.data;
                    }
                    else {
                        updatedData.push(args.data);
                    }
                    for (var i = 0; i < updatedData.length; i++) {
                        if (requestType === 'delete') {
                            var index = this.parent.flatData.indexOf(updatedData[i]);
                            var checkedIndex = this.selectedIndexes.indexOf(index);
                            this.selectedIndexes.splice(checkedIndex, 1);
                            this.updateSelectedItems(updatedData[i], 'uncheck');
                        }
                        if (!isNullOrUndefined(updatedData[i].parentItem)) {
                            this.updateParentSelection(updatedData[i].parentItem);
                        }
                    }
                }
                else if (args.requestType === 'add' && this.parent.autoCheckHierarchy) {
                    args.data.checkboxState = 'uncheck';
                }
                else if (requestType === 'filtering' || requestType === 'searching' || requestType === 'refresh'
                    && !isRemoteData(this.parent)) {
                    this.selectedItems = [];
                    this.selectedIndexes = [];
                    childData = (!isNullOrUndefined(this.parent.filterModule) && this.parent.filterModule.filteredResult.length > 0) ?
                        this.parent.getCurrentViewRecords() : this.parent.flatData;
                    childData.forEach(function (record) {
                        if (record.hasChildRecords) {
                            _this.updateParentSelection(record);
                        }
                        else {
                            _this.updateSelectedItems(record, record.checkboxState);
                        }
                    });
                    this.headerSelection();
                }
            }
        }
    };
    Selection.prototype.getCheckedrecords = function () {
        return this.selectedItems;
    };
    Selection.prototype.getCheckedRowIndexes = function () {
        return this.selectedIndexes;
    };
    return Selection;
}());
export { Selection };
