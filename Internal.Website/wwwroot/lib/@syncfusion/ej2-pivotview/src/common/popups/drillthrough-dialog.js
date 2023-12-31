import { Dialog } from '@syncfusion/ej2-popups';
import { createElement, setStyleAttribute, remove, isNullOrUndefined, isBlazor } from '@syncfusion/ej2-base';
import * as cls from '../../common/base/css-constant';
import { Grid, Reorder, Resize, ColumnChooser, Toolbar } from '@syncfusion/ej2-grids';
import { VirtualScroll, Selection, Edit, Page, CommandColumn } from '@syncfusion/ej2-grids';
import * as events from '../../common/base/constant';
/**
 * `DrillThroughDialog` module to create drill-through dialog.
 */
/** @hidden */
var DrillThroughDialog = /** @class */ (function () {
    /**
     * Constructor for the dialog action.
     * @hidden
     */
    function DrillThroughDialog(parent) {
        /** @hidden */
        this.indexString = [];
        this.isUpdated = false;
        this.gridIndexObjects = {};
        this.gridData = [];
        this.parent = parent;
        this.engine = this.parent.dataType === 'olap' ? this.parent.olapEngineModule : this.parent.engineModule;
    }
    /** @hidden */
    DrillThroughDialog.prototype.showDrillThroughDialog = function (eventArgs) {
        var _this = this;
        this.gridData = eventArgs.rawData;
        this.removeDrillThroughDialog();
        var drillThroughDialog = createElement('div', {
            id: this.parent.element.id + '_drillthrough',
            className: cls.DRILLTHROUGH_DIALOG
        });
        this.parent.element.appendChild(drillThroughDialog);
        this.dialogPopUp = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: false,
            header: this.parent.localeObj.getConstant('details'),
            content: this.createDrillThroughGrid(eventArgs),
            beforeOpen: function () {
                /* tslint:disable:align */
                _this.drillThroughGrid.setProperties({
                    dataSource: _this.parent.editSettings.allowEditing ?
                        _this.dataWithPrimarykey(eventArgs) : _this.gridData,
                    height: !_this.parent.editSettings.allowEditing ? 300 : 220,
                    rowHeight: _this.parent.gridSettings.rowHeight
                }, false);
            },
            beforeClose: function () {
                if (_this.parent.editSettings.allowEditing && _this.isUpdated) {
                    if (_this.parent.dataSourceSettings.type === 'CSV') {
                        _this.updateData(_this.drillThroughGrid.dataSource);
                    }
                    var count = Object.keys(_this.gridIndexObjects).length;
                    var addItems = [];
                    /* tslint:disable:no-string-literal */
                    for (var _i = 0, _a = _this.drillThroughGrid.dataSource; _i < _a.length; _i++) {
                        var item = _a[_i];
                        if (isNullOrUndefined(item['__index']) || item['__index'] === '') {
                            for (var _b = 0, _c = _this.engine.fields; _b < _c.length; _b++) {
                                var field = _c[_b];
                                if (isNullOrUndefined(item[field])) {
                                    delete item[field];
                                }
                            }
                            delete item['__index'];
                            addItems.push(item);
                        }
                        else if (count > 0) {
                            if (isBlazor() && _this.parent.editSettings.allowCommandColumns) {
                                _this.parent.engineModule.data[Number(item['__index'])] = item;
                            }
                            delete _this.gridIndexObjects[item['__index'].toString()];
                            count--;
                        }
                    }
                    count = 0;
                    if (isBlazor() && _this.parent.enableVirtualization) {
                        var currModule_1 = _this;
                        /* tslint:disable:no-any */
                        currModule_1.parent.interopAdaptor.invokeMethodAsync('PivotInteropMethod', 'updateRawData', {
                            'AddItem': addItems, 'RemoveItem': currModule_1.gridIndexObjects, 'ModifiedItem': currModule_1.gridData
                        }).then(function (data) {
                            currModule_1.parent.updateBlazorData(data, currModule_1.parent);
                            currModule_1.parent.allowServerDataBinding = false;
                            currModule_1.parent.setProperties({ pivotValues: currModule_1.parent.engineModule.pivotValues }, true);
                            delete currModule_1.parent.bulkChanges.pivotValues;
                            currModule_1.parent.allowServerDataBinding = true;
                            currModule_1.isUpdated = false;
                            currModule_1.gridIndexObjects = {};
                        });
                        /* tslint:enable:no-any */
                    }
                    else {
                        var items = [];
                        var data = (_this.parent.allowDataCompression && _this.parent.enableVirtualization) ?
                            _this.parent.engineModule.actualData : _this.parent.engineModule.data;
                        for (var _d = 0, _e = data; _d < _e.length; _d++) {
                            var item = _e[_d];
                            delete item['__index'];
                            if (_this.gridIndexObjects[count.toString()] === undefined) {
                                items.push(item);
                            }
                            count++;
                        }
                        /* tslint:enable:no-string-literal */
                        items = items.concat(addItems);
                        _this.parent.setProperties({ dataSourceSettings: { dataSource: items } }, true);
                        _this.engine.updateGridData(_this.parent.dataSourceSettings);
                        _this.parent.pivotValues = _this.engine.pivotValues;
                    }
                }
                if (!(isBlazor() && _this.parent.enableVirtualization)) {
                    _this.isUpdated = false;
                    _this.gridIndexObjects = {};
                }
            },
            isModal: true,
            visible: true,
            showCloseIcon: true,
            locale: this.parent.locale,
            enableRtl: this.parent.enableRtl,
            width: this.parent.isAdaptive ? '100%' : '60%',
            position: { X: 'center', Y: 'center' },
            closeOnEscape: true,
            target: document.body,
            close: this.removeDrillThroughDialog.bind(this)
        });
        this.dialogPopUp.isStringTemplate = true;
        this.dialogPopUp.appendTo(drillThroughDialog);
        // this.dialogPopUp.element.querySelector('.e-dlg-header').innerHTML = this.parent.localeObj.getConstant('details');
        setStyleAttribute(this.dialogPopUp.element, { 'visibility': 'visible' });
    };
    /* tslint:disable:typedef no-any */
    DrillThroughDialog.prototype.updateData = function (dataSource) {
        var dataPos = 0;
        var data = (this.parent.allowDataCompression && this.parent.enableVirtualization) ?
            this.parent.engineModule.actualData : this.parent.engineModule.data;
        while (dataPos < dataSource.length) {
            var fields = Object.keys(dataSource[dataPos]);
            var keyPos = 0;
            var framedSet = [];
            while (keyPos < fields.length) {
                if (!isNullOrUndefined(this.parent.engineModule.fieldKeys[fields[keyPos]])) {
                    framedSet[this.parent.engineModule.fieldKeys[fields[keyPos]]] = dataSource[dataPos][fields[keyPos]];
                }
                keyPos++;
            }
            data[dataSource[dataPos]['__index']] = framedSet;
            dataPos++;
        }
        if (this.parent.allowDataCompression && this.parent.enableVirtualization) {
            this.parent.engineModule.actualData = data;
        }
        else {
            this.parent.engineModule.data = data;
        }
    };
    DrillThroughDialog.prototype.removeDrillThroughDialog = function () {
        if (this.dialogPopUp && !this.dialogPopUp.isDestroyed) {
            this.dialogPopUp.destroy();
        }
        var dialogElement = document.getElementById(this.parent.element.id + '_drillthrough');
        if (dialogElement) {
            remove(dialogElement);
        }
        if (document.getElementById(this.parent.element.id + '_drillthroughgrid_ccdlg')) {
            remove(document.getElementById(this.parent.element.id + '_drillthroughgrid_ccdlg'));
        }
    };
    /* tslint:disable:max-func-body-length */
    DrillThroughDialog.prototype.createDrillThroughGrid = function (eventArgs) {
        var drillThroughBody = createElement('div', { id: this.parent.element.id + '_drillthroughbody', className: cls.DRILLTHROUGH_BODY_CLASS });
        var drillThroughBodyHeader = createElement('div', {
            id: this.parent.element.id +
                '_drillthroughbodyheader', className: cls.DRILLTHROUGH_BODY_HEADER_CONTAINER_CLASS
        });
        if (eventArgs.rowHeaders !== '') {
            drillThroughBodyHeader.innerHTML = '<span class=' +
                cls.DRILLTHROUGH_BODY_HEADER_COMMON_CLASS + '><span class=' + cls.DRILLTHROUGH_BODY_HEADER_CLASS + '>' +
                this.parent.localeObj.getConstant('row') + '</span> :<span class=' +
                cls.DRILLTHROUGH_BODY_HEADER_VALUE_CLASS + '>' + eventArgs.rowHeaders + '</span></span>';
        }
        if (eventArgs.columnHeaders !== '') {
            drillThroughBodyHeader.innerHTML = drillThroughBodyHeader.innerHTML + '<span class=' +
                cls.DRILLTHROUGH_BODY_HEADER_COMMON_CLASS + '><span class=' +
                cls.DRILLTHROUGH_BODY_HEADER_CLASS + '>' + this.parent.localeObj.getConstant('column') +
                '</span> :<span class=' + cls.DRILLTHROUGH_BODY_HEADER_VALUE_CLASS + '>' +
                eventArgs.columnHeaders + '</span></span>';
        }
        if (eventArgs.value !== '') {
            var measure = eventArgs.value.split('(')[0];
            var value = eventArgs.value.split('(')[1].split(')')[0];
            if (value !== '0') {
                drillThroughBodyHeader.innerHTML = drillThroughBodyHeader.innerHTML + '<span class=' +
                    cls.DRILLTHROUGH_BODY_HEADER_COMMON_CLASS + '><span class=' +
                    cls.DRILLTHROUGH_BODY_HEADER_CLASS + '>' +
                    measure + '</span> :<span class=' + cls.DRILLTHROUGH_BODY_HEADER_VALUE_CLASS + '>' + value + '</span></span>';
            }
        }
        var toolbarItems = ['ColumnChooser'];
        if (this.parent.editSettings.allowEditing) {
            if (this.parent.editSettings.allowCommandColumns) {
                toolbarItems = ['ColumnChooser', 'Add'];
            }
            else if (this.parent.editSettings.mode === 'Batch') {
                toolbarItems = ['ColumnChooser', 'Add', 'Delete', 'Update', 'Cancel'];
            }
            else if (this.parent.editSettings.mode === 'Dialog') {
                toolbarItems = ['ColumnChooser', 'Add', 'Edit', 'Delete'];
            }
            else {
                toolbarItems = ['ColumnChooser', 'Add', 'Edit', 'Delete', 'Update', 'Cancel'];
            }
        }
        var drillThroughGrid = createElement('div', { id: this.parent.element.id + '_drillthroughgrid', className: cls.DRILLTHROUGH_GRID_CLASS });
        Grid.Inject(Selection, Reorder, Resize, Toolbar, ColumnChooser);
        this.drillThroughGrid = new Grid({
            gridLines: 'Default',
            allowResizing: true,
            allowReordering: true,
            showColumnChooser: true,
            enableHover: false,
            toolbar: toolbarItems,
            columns: eventArgs.gridColumns,
            locale: this.parent.locale,
            enableRtl: this.parent.enableRtl,
            enableVirtualization: !this.parent.editSettings.allowEditing,
            allowPaging: this.parent.editSettings.allowEditing
        });
        if (isBlazor()) {
            /* tslint:disable-next-line */
            this.drillThroughGrid['isJsComponent'] = true;
        }
        if (this.parent.dataType === 'olap') {
            this.formatData();
        }
        var dialogModule = this;
        this.parent.trigger(events.beginDrillThrough, {
            cellInfo: eventArgs,
            gridObj: isBlazor() ? undefined : this.drillThroughGrid,
            type: 'editing'
        });
        if (this.parent.editSettings.allowEditing) {
            Grid.Inject(Edit, Page);
            this.drillThroughGrid.editSettings = this.parent.editSettings;
            if (this.parent.editSettings.allowCommandColumns) {
                this.drillThroughGrid.editSettings.mode = 'Normal';
                this.drillThroughGrid.editSettings.allowEditOnDblClick = false;
                Grid.Inject(CommandColumn);
                this.drillThroughGrid.columns.push({
                    headerText: this.parent.localeObj.getConstant('manageRecords'), width: 160, showInColumnChooser: false,
                    commands: [
                        { type: 'Edit', buttonOption: { iconCss: ' e-icons e-edit', cssClass: 'e-flat' } },
                        { type: 'Delete', buttonOption: { iconCss: 'e-icons e-delete', cssClass: 'e-flat' } },
                        { type: 'Save', buttonOption: { iconCss: 'e-icons e-update', cssClass: 'e-flat' } },
                        { type: 'Cancel', buttonOption: { iconCss: 'e-icons e-cancel-icon', cssClass: 'e-flat' } }
                    ]
                });
            }
            else {
                this.drillThroughGrid.editSettings.allowEditOnDblClick = this.parent.editSettings.allowEditOnDblClick;
            }
            /* tslint:disable:align */
            this.drillThroughGrid.columns.push({
                field: '__index', visible: false, isPrimaryKey: true, type: 'string', showInColumnChooser: false
            });
            /* tslint:disable-next-line:no-any */
            this.drillThroughGrid.actionComplete = function (args) {
                if (args.requestType === 'batchsave' || args.requestType === 'save' || args.requestType === 'delete') {
                    dialogModule.isUpdated = true;
                }
                if ((dialogModule.drillThroughGrid.editSettings.mode === 'Normal' && args.requestType === 'save' &&
                    dialogModule.drillThroughGrid.element.querySelectorAll('.e-tbar-btn:hover').length > 0 &&
                    !dialogModule.parent.editSettings.allowCommandColumns) || args.requestType === 'batchsave') {
                    dialogModule.dialogPopUp.hide();
                }
            };
            this.drillThroughGrid.beforeBatchSave = function () {
                dialogModule.isUpdated = true;
            };
            /* tslint:enable:align */
        }
        else {
            Grid.Inject(VirtualScroll);
        }
        document.body.appendChild(drillThroughGrid);
        this.drillThroughGrid.isStringTemplate = true;
        this.drillThroughGrid.appendTo(drillThroughGrid);
        drillThroughBody.appendChild(drillThroughBodyHeader);
        drillThroughBody.appendChild(drillThroughGrid);
        return drillThroughBody;
    };
    /** @hidden */
    DrillThroughDialog.prototype.frameGridColumns = function (rawData) {
        var keys = this.parent.dataType === 'olap' ? rawData[0] ? Object.keys(rawData[0]) : [] :
            Object.keys(this.engine.fieldList);
        var columns = [];
        if (this.parent.dataType === 'olap') {
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                columns.push({
                    field: key.replace(/_x005B_|_x0020_|_x005D_|_x0024_/g, '').replace('].[', '').split('.').reverse().join(''),
                    headerText: key.replace(/_x005B_|_x005D_|_x0024_/g, '').replace(/_x0020_/g, ' ').
                        replace('].[', '').split('.').reverse().join('.'),
                    width: 120,
                    visible: true,
                    validationRules: { required: true },
                    type: 'string'
                });
            }
        }
        else {
            for (var _a = 0, keys_2 = keys; _a < keys_2.length; _a++) {
                var key = keys_2[_a];
                if (this.engine.fieldList[key].aggregateType !== 'CalculatedField') {
                    var editType = '';
                    if (this.engine.fieldList[key].type === 'number') {
                        editType = 'numericedit';
                    }
                    else if (this.engine.fieldList[key].type === 'date') {
                        editType = 'datepickeredit';
                    }
                    else {
                        editType = 'defaultedit';
                    }
                    columns.push({
                        field: key,
                        headerText: this.engine.fieldList[key].caption,
                        width: 120,
                        visible: this.engine.fieldList[key].isSelected,
                        validationRules: { required: true },
                        editType: editType,
                        type: 'string'
                    });
                }
            }
        }
        return columns;
    };
    DrillThroughDialog.prototype.formatData = function () {
        var index = 0;
        while (index < this.gridData.length) {
            var data = this.gridData[index];
            var keys = Object.keys(this.gridData[index]);
            var newData = {};
            var i = 0;
            while (i < keys.length) {
                var key = keys[i].replace(/_x005B_|_x0020_|_x005D_|_x0024_/g, '').replace('].[', '').split('.').reverse().join('');
                newData[key] = data[keys[i]];
                i++;
            }
            this.gridData[index] = newData;
            index++;
        }
    };
    DrillThroughDialog.prototype.dataWithPrimarykey = function (eventArgs) {
        var indexString = this.indexString.length > 0 ? this.indexString : Object.keys(eventArgs.currentCell.indexObject);
        var rawData = this.gridData;
        var count = 0;
        for (var _i = 0, rawData_1 = rawData; _i < rawData_1.length; _i++) {
            var item = rawData_1[_i];
            /* tslint:disable-next-line:no-string-literal */
            item['__index'] = indexString[count];
            this.gridIndexObjects[indexString[count].toString()] = Number(indexString[count]);
            count++;
        }
        return rawData;
    };
    return DrillThroughDialog;
}());
export { DrillThroughDialog };
