import * as events from '../../common/base/constant';
import { isBlazor } from '@syncfusion/ej2-base';
import { PivotUtil } from '../../base/util';
/**
 * `DataSourceUpdate` module is used to update the dataSource.
 */
/** @hidden */
var DataSourceUpdate = /** @class */ (function () {
    /**
     * Constructor for the dialog action.
     * @hidden
     */
    function DataSourceUpdate(parent) {
        this.parent = parent;
    }
    /**
     * Updates the dataSource by adding the given field along with field dropped position to the dataSource.
     * @param  {string} fieldName - Defines dropped field name to update dataSource.
     * @param  {string} droppedClass -  Defines dropped field axis name to update dataSource.
     * @param  {number} fieldCaption - Defines dropped position to the axis based on field position.
     * @method updateDataSource
     * @return {void}
     * @hidden
     */
    DataSourceUpdate.prototype.updateDataSource = function (fieldName, droppedClass, droppedPosition) {
        var _this = this;
        var dataSourceItem;
        var draggedClass;
        var row = this.parent.dataSourceSettings.rows;
        var column = this.parent.dataSourceSettings.columns;
        var value = this.parent.dataSourceSettings.values;
        var filter = this.parent.dataSourceSettings.filters;
        var field = [row, column, value, filter];
        for (var len = 0, lnt = field.length; len < lnt; len++) {
            if (field[len]) {
                for (var i = 0, n = field[len].length; i < n; i++) {
                    if (field[len][i].name === fieldName || (this.parent.dataType === 'olap' &&
                        field[len][i].name.toLowerCase() === '[measures]' && field[len][i].name.toLowerCase() === fieldName)) {
                        draggedClass = len === 0 ? 'rows' : len === 1 ? 'columns' : len === 2 ? 'values' : 'filters';
                    }
                    if (!draggedClass) {
                        draggedClass = 'fieldList';
                    }
                }
            }
        }
        var eventdrop = {
            fieldName: fieldName, dropField: PivotUtil.getFieldInfo(fieldName, this.control).fieldItem,
            dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.parent.dataSourceSettings),
            dropAxis: droppedClass, dropPosition: droppedPosition, draggedAxis: draggedClass, cancel: false
        };
        var control = this.control.getModuleName() === 'pivotfieldlist' && this.control.isPopupView ?
            this.control.pivotGridModule : this.control;
        control.trigger(events.fieldDrop, eventdrop, function (observedArgs) {
            if (!observedArgs.cancel) {
                droppedClass = observedArgs.dropAxis;
                droppedPosition = observedArgs.dropPosition;
                fieldName = observedArgs.dropField ? observedArgs.dropField.name : observedArgs.fieldName;
                dataSourceItem = observedArgs.dropField;
                if (_this.control && _this.btnElement && _this.btnElement.getAttribute('isvalue') === 'true') {
                    switch (droppedClass) {
                        case '':
                            _this.control.setProperties({ dataSourceSettings: { values: [] } }, true);
                            break;
                        case 'rows':
                            _this.control.setProperties({ dataSourceSettings: { valueAxis: 'row' } }, true);
                            break;
                        case 'columns':
                            _this.control.setProperties({ dataSourceSettings: { valueAxis: 'column' } }, true);
                            break;
                    }
                }
                else {
                    // dataSourceItem = this.removeFieldFromReport(fieldName.toString());
                    // dataSourceItem = dataSourceItem ? dataSourceItem : this.getNewField(fieldName.toString());
                    _this.removeFieldFromReport(fieldName.toString());
                    dataSourceItem = _this.getNewField(fieldName.toString(), observedArgs.dropField);
                    if (dataSourceItem.type === 'CalculatedField' && droppedClass !== '') {
                        droppedClass = 'values';
                    }
                }
                if (_this.parent.dataType === 'olap') {
                    // dataSourceItem = this.removeFieldFromReport(fieldName.toString());
                    // dataSourceItem = dataSourceItem ? dataSourceItem : this.getNewField(fieldName.toString());
                    _this.removeFieldFromReport(fieldName.toString());
                    dataSourceItem = _this.getNewField(fieldName.toString(), observedArgs.dropField);
                    if (_this.parent.dataSourceSettings.values.length === 0) {
                        _this.removeFieldFromReport('[measures]');
                    }
                    if (dataSourceItem.type === 'CalculatedField' && droppedClass !== '') {
                        droppedClass = 'values';
                    }
                }
                if (_this.control) {
                    var eventArgs = {
                        fieldName: fieldName, droppedField: dataSourceItem,
                        dataSourceSettings: PivotUtil.getClonedDataSourceSettings(_this.parent.dataSourceSettings),
                        droppedAxis: droppedClass, droppedPosition: droppedPosition
                    };
                    /* tslint:disable */
                    var dataSourceUpdate_1 = _this;
                    control.trigger(events.onFieldDropped, eventArgs, function (droppedArgs) {
                        dataSourceItem = droppedArgs.droppedField;
                        if (dataSourceItem) {
                            droppedPosition = droppedArgs.droppedPosition;
                            droppedClass = droppedArgs.droppedAxis;
                            switch (droppedClass) {
                                case 'filters':
                                    droppedPosition !== -1 ?
                                        (isBlazor() ? dataSourceUpdate_1.parent.dataSourceSettings.filters.splice(droppedPosition, 0, dataSourceItem) : _this.parent.dataSourceSettings.filters.splice(droppedPosition, 0, dataSourceItem)) :
                                        (isBlazor() ? dataSourceUpdate_1.parent.dataSourceSettings.filters.push(dataSourceItem) : _this.parent.dataSourceSettings.filters.push(dataSourceItem));
                                    break;
                                case 'rows':
                                    droppedPosition !== -1 ?
                                        (isBlazor() ? dataSourceUpdate_1.parent.dataSourceSettings.rows.splice(droppedPosition, 0, dataSourceItem) : _this.parent.dataSourceSettings.rows.splice(droppedPosition, 0, dataSourceItem)) :
                                        (isBlazor() ? dataSourceUpdate_1.parent.dataSourceSettings.rows.push(dataSourceItem) : _this.parent.dataSourceSettings.rows.push(dataSourceItem));
                                    break;
                                case 'columns':
                                    droppedPosition !== -1 ?
                                        (isBlazor() ? dataSourceUpdate_1.parent.dataSourceSettings.columns.splice(droppedPosition, 0, dataSourceItem) : _this.parent.dataSourceSettings.columns.splice(droppedPosition, 0, dataSourceItem)) :
                                        (isBlazor() ? dataSourceUpdate_1.parent.dataSourceSettings.columns.push(dataSourceItem) : _this.parent.dataSourceSettings.columns.push(dataSourceItem));
                                    break;
                                case 'values':
                                    droppedPosition !== -1 ?
                                        (isBlazor() ? dataSourceUpdate_1.parent.dataSourceSettings.values.splice(droppedPosition, 0, dataSourceItem) : _this.parent.dataSourceSettings.values.splice(droppedPosition, 0, dataSourceItem)) :
                                        (isBlazor() ? dataSourceUpdate_1.parent.dataSourceSettings.values.push(dataSourceItem) : _this.parent.dataSourceSettings.values.push(dataSourceItem));
                                    if (isBlazor()) {
                                        if (dataSourceUpdate_1.parent.dataType === 'olap' && !dataSourceUpdate_1.parent.engineModule.isMeasureAvail) {
                                            var measureField = {
                                                name: '[Measures]', caption: 'Measures', showRemoveIcon: true, allowDragAndDrop: true
                                            };
                                            var fieldAxis = dataSourceUpdate_1.parent.dataSourceSettings.valueAxis === 'row' ?
                                                dataSourceUpdate_1.parent.dataSourceSettings.rows : dataSourceUpdate_1.parent.dataSourceSettings.columns;
                                            fieldAxis.push(measureField);
                                        }
                                    }
                                    else {
                                        if (_this.parent.dataType === 'olap' && !_this.parent.engineModule.isMeasureAvail) {
                                            var measureField = {
                                                name: '[Measures]', caption: 'Measures', showRemoveIcon: true, allowDragAndDrop: true
                                            };
                                            var fieldAxis = _this.parent.dataSourceSettings.valueAxis === 'row' ?
                                                _this.parent.dataSourceSettings.rows : _this.parent.dataSourceSettings.columns;
                                            fieldAxis.push(measureField);
                                        }
                                    }
                                    break;
                            }
                            if (isBlazor()) {
                                dataSourceUpdate_1.parent.control.pivotButtonModule.updateDataSource();
                                dataSourceUpdate_1.parent.control.axisFieldModule.render();
                            }
                        }
                    });
                }
            }
        });
    };
    /* tslint:enable */
    /**
     * Updates the dataSource by removing the given field from the dataSource.
     * @param  {string} fieldName - Defines dropped field name to remove dataSource.
     * @method removeFieldFromReport
     * @return {void}
     * @hidden
     */
    DataSourceUpdate.prototype.removeFieldFromReport = function (fieldName) {
        var dataSourceItem;
        var isDataSource = false;
        var rows = this.parent.dataSourceSettings.rows;
        var columns = this.parent.dataSourceSettings.columns;
        var values = this.parent.dataSourceSettings.values;
        var filters = this.parent.dataSourceSettings.filters;
        var fields = [rows, columns, values, filters];
        var field = this.parent.engineModule.fieldList[fieldName];
        for (var len = 0, lnt = fields.length; len < lnt; len++) {
            if (!isDataSource && fields[len]) {
                for (var i = 0, n = fields[len].length; i < n; i++) {
                    if (fields[len][i].name === fieldName || (this.parent.dataType === 'olap' &&
                        fields[len][i].name.toLowerCase() === '[measures]' && fields[len][i].name.toLowerCase() === fieldName)) {
                        dataSourceItem = fields[len][i].properties ?
                            fields[len][i].properties : fields[len][i];
                        dataSourceItem.type = (field && field.type === 'number') ? dataSourceItem.type :
                            'Count';
                        fields[len].splice(i, 1);
                        if (this.parent.dataType === 'olap') {
                            var engineModule = this.parent.engineModule;
                            if (engineModule && engineModule.fieldList[fieldName]) {
                                engineModule.fieldList[fieldName].currrentMembers = {};
                                engineModule.fieldList[fieldName].searchMembers = [];
                            }
                        }
                        isDataSource = true;
                        break;
                    }
                }
            }
        }
        return dataSourceItem;
    };
    /**
     * Creates new field object given field name from the field list data.
     * @param  {string} fieldName - Defines dropped field name to add dataSource.
     * @method getNewField
     * @return {void}
     * @hidden
     */
    DataSourceUpdate.prototype.getNewField = function (fieldName, fieldItem) {
        var newField;
        if (this.parent.dataType === 'olap') {
            var field = this.parent.engineModule.fieldList[fieldName];
            newField = {
                name: fieldItem ? fieldItem.name : fieldName,
                caption: fieldItem ? fieldItem.caption : field.caption,
                isNamedSet: fieldItem ? fieldItem.isNamedSet : field.isNamedSets,
                isCalculatedField: fieldItem ? fieldItem.isCalculatedField : field.isCalculatedField,
                type: (fieldItem ? (fieldItem.type === undefined ? field.type === 'number' ? 'Sum' :
                    'Count' : fieldItem.type) :
                    (field.aggregateType === undefined ? field.type === 'number' ? 'Sum' :
                        'Count' : field.aggregateType)),
                showFilterIcon: fieldItem ? fieldItem.showFilterIcon : field.showFilterIcon,
                showSortIcon: fieldItem ? fieldItem.showSortIcon : field.showSortIcon,
                showEditIcon: fieldItem ? fieldItem.showEditIcon : field.showEditIcon,
                showRemoveIcon: fieldItem ? fieldItem.showRemoveIcon : field.showRemoveIcon,
                showValueTypeIcon: fieldItem ? fieldItem.showValueTypeIcon : field.showValueTypeIcon,
                allowDragAndDrop: fieldItem ? fieldItem.allowDragAndDrop : field.allowDragAndDrop,
                showSubTotals: fieldItem ? fieldItem.showSubTotals : field.showSubTotals
            };
        }
        else {
            var field = this.parent.engineModule.fieldList[fieldName];
            newField = {
                name: fieldItem ? fieldItem.name : fieldName,
                caption: fieldItem ? fieldItem.caption : field.caption,
                type: (fieldItem ? ((fieldItem.type === undefined || fieldItem.type === null) ?
                    field.type === 'number' ? 'Sum' : 'Count' : fieldItem.type) :
                    ((field.aggregateType === undefined || field.aggregateType === null) ?
                        field.type === 'number' ? 'Sum' :
                            'Count' : field.aggregateType)),
                showNoDataItems: fieldItem ? fieldItem.showNoDataItems : field.showNoDataItems,
                baseField: fieldItem ? fieldItem.baseField : field.baseField,
                baseItem: fieldItem ? fieldItem.baseItem : field.baseItem,
                allowDragAndDrop: fieldItem ? fieldItem.allowDragAndDrop : field.allowDragAndDrop,
                showSubTotals: fieldItem ? fieldItem.showSubTotals : field.showSubTotals,
                showFilterIcon: fieldItem ? fieldItem.showFilterIcon : field.showFilterIcon,
                showSortIcon: fieldItem ? fieldItem.showSortIcon : field.showSortIcon,
                showEditIcon: fieldItem ? fieldItem.showEditIcon : field.showEditIcon,
                showRemoveIcon: fieldItem ? fieldItem.showRemoveIcon : field.showRemoveIcon,
                showValueTypeIcon: fieldItem ? fieldItem.showValueTypeIcon : field.showValueTypeIcon
            };
        }
        return newField;
    };
    return DataSourceUpdate;
}());
export { DataSourceUpdate };
