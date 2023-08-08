import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
/**
 * This is a file to perform common utility for OLAP and Relational datasource
 * @hidden
 */
var PivotUtil = /** @class */ (function () {
    function PivotUtil() {
    }
    PivotUtil.getType = function (value) {
        var val;
        val = (value && value.getDay) ? (value.getHours() > 0 || value.getMinutes() > 0 ||
            value.getSeconds() > 0 || value.getMilliseconds() > 0 ? 'datetime' : 'date') : !isNaN(Number(value)) ?
            'number' : typeof (value);
        return val;
    };
    PivotUtil.resetTime = function (date) {
        date.setHours(0, 0, 0, 0);
        return date;
    };
    PivotUtil.getClonedData = function (data) {
        var clonedData = [];
        if (data) {
            for (var _i = 0, _a = data; _i < _a.length; _i++) {
                var item = _a[_i];
                var fields = Object.keys(item);
                var keyPos = 0;
                /* tslint:disable:no-any */
                var framedSet = {};
                /* tslint:enable:no-any */
                while (keyPos < fields.length) {
                    framedSet[fields[keyPos]] = item[fields[keyPos]];
                    keyPos++;
                }
                clonedData.push(framedSet);
            }
        }
        return clonedData;
    };
    PivotUtil.getClonedPivotValues = function (pivotValues) {
        var clonedSets = [];
        for (var i = 0; i < pivotValues.length; i++) {
            if (pivotValues[i]) {
                clonedSets[i] = [];
                for (var j = 0; j < pivotValues[i].length; j++) {
                    if (pivotValues[i][j]) {
                        clonedSets[i][j] = this.getClonedPivotValueObj(pivotValues[i][j]);
                    }
                }
            }
        }
        return clonedSets;
    };
    PivotUtil.getClonedPivotValueObj = function (data) {
        var keyPos = 0;
        /* tslint:disable:no-any */
        var framedSet = {};
        /* tslint:enable:no-any */
        if (!(data === null || data === undefined)) {
            var fields = Object.keys(data);
            while (keyPos < fields.length) {
                framedSet[fields[keyPos]] = data[fields[keyPos]];
                keyPos++;
            }
        }
        else {
            framedSet = data;
        }
        return framedSet;
    };
    /* tslint:disable:no-any */
    PivotUtil.getDefinedObj = function (data) {
        var keyPos = 0;
        var framedSet = {};
        /* tslint:enable:no-any */
        if (!(data === null || data === undefined)) {
            var fields = Object.keys(data);
            while (keyPos < fields.length) {
                if (!(data[fields[keyPos]] === null || data[fields[keyPos]] === undefined)) {
                    framedSet[fields[keyPos]] = data[fields[keyPos]];
                }
                keyPos++;
            }
        }
        else {
            framedSet = data;
        }
        return framedSet;
    };
    PivotUtil.inArray = function (value, collection) {
        if (collection) {
            for (var i = 0, cnt = collection.length; i < cnt; i++) {
                if (collection[i] === value) {
                    return i;
                }
            }
        }
        return -1;
    };
    PivotUtil.isContainCommonElements = function (collection1, collection2) {
        var isContain = false;
        for (var i = 0, cnt = collection1.length; i < cnt; i++) {
            for (var j = 0, lnt = collection2.length; j < lnt; j++) {
                if (collection2[j] === collection1[i]) {
                    return true;
                }
            }
        }
        return false;
    };
    /* tslint:disable:no-any */
    PivotUtil.setPivotProperties = function (control, properties) {
        control.allowServerDataBinding = false;
        if (control.pivotGridModule) {
            control.pivotGridModule.allowServerDataBinding = false;
        }
        control.setProperties(properties, true);
        control.allowServerDataBinding = true;
        if (control.pivotGridModule) {
            control.pivotGridModule.allowServerDataBinding = true;
        }
    };
    /* tslint:enable:no-any */
    PivotUtil.getClonedDataSourceSettings = function (dataSourceSettings) {
        var clonesDataSource = this.getDefinedObj({
            type: dataSourceSettings.type,
            catalog: dataSourceSettings.catalog,
            cube: dataSourceSettings.cube,
            providerType: dataSourceSettings.providerType,
            url: dataSourceSettings.url,
            localeIdentifier: dataSourceSettings.localeIdentifier,
            excludeFields: isNullOrUndefined(dataSourceSettings.excludeFields) ? [] : dataSourceSettings.excludeFields.slice(),
            expandAll: dataSourceSettings.expandAll,
            allowLabelFilter: dataSourceSettings.allowLabelFilter,
            allowValueFilter: dataSourceSettings.allowValueFilter,
            allowMemberFilter: dataSourceSettings.allowMemberFilter,
            enableSorting: dataSourceSettings.enableSorting ? true : false,
            rows: this.cloneFieldSettings(dataSourceSettings.rows),
            columns: this.cloneFieldSettings(dataSourceSettings.columns),
            filters: this.cloneFieldSettings(dataSourceSettings.filters),
            values: this.cloneFieldSettings(dataSourceSettings.values),
            filterSettings: this.cloneFilterSettings(dataSourceSettings.filterSettings),
            sortSettings: this.cloneSortSettings(dataSourceSettings.sortSettings),
            drilledMembers: this.cloneDrillMemberSettings(dataSourceSettings.drilledMembers),
            valueSortSettings: this.CloneValueSortObject(dataSourceSettings.valueSortSettings),
            valueAxis: dataSourceSettings.valueAxis,
            formatSettings: this.cloneFormatSettings(dataSourceSettings.formatSettings),
            calculatedFieldSettings: this.cloneCalculatedFieldSettings(dataSourceSettings.calculatedFieldSettings),
            fieldMapping: this.cloneFieldSettings(dataSourceSettings.fieldMapping),
            showSubTotals: dataSourceSettings.showSubTotals,
            showRowSubTotals: dataSourceSettings.showRowSubTotals,
            showColumnSubTotals: dataSourceSettings.showColumnSubTotals,
            showGrandTotals: dataSourceSettings.showGrandTotals,
            showRowGrandTotals: dataSourceSettings.showRowGrandTotals,
            showColumnGrandTotals: dataSourceSettings.showColumnGrandTotals,
            showHeaderWhenEmpty: dataSourceSettings.showHeaderWhenEmpty,
            alwaysShowValueHeader: dataSourceSettings.alwaysShowValueHeader,
            conditionalFormatSettings: this.cloneConditionalFormattingSettings(dataSourceSettings.conditionalFormatSettings),
            emptyCellsTextContent: dataSourceSettings.emptyCellsTextContent,
            groupSettings: this.cloneGroupSettings(dataSourceSettings.groupSettings),
            showAggregationOnValueField: dataSourceSettings.showAggregationOnValueField,
            authentication: this.CloneAuthenticationObject(dataSourceSettings.authentication),
        });
        /* tslint:enable:no-any */
        return clonesDataSource;
    };
    PivotUtil.updateDataSourceSettings = function (control, dataSourceSettings) {
        if (control) {
            this.setPivotProperties(control, {
                dataSourceSettings: this.getDefinedObj({
                    type: dataSourceSettings.type,
                    catalog: dataSourceSettings.catalog,
                    cube: dataSourceSettings.cube,
                    providerType: dataSourceSettings.providerType,
                    url: dataSourceSettings.url,
                    localeIdentifier: dataSourceSettings.localeIdentifier,
                    excludeFields: isNullOrUndefined(dataSourceSettings.excludeFields) ? [] : dataSourceSettings.excludeFields,
                    expandAll: dataSourceSettings.expandAll,
                    allowLabelFilter: dataSourceSettings.allowLabelFilter,
                    allowValueFilter: dataSourceSettings.allowValueFilter,
                    allowMemberFilter: dataSourceSettings.allowMemberFilter,
                    enableSorting: dataSourceSettings.enableSorting ? true : false,
                    rows: dataSourceSettings.rows,
                    columns: dataSourceSettings.columns,
                    filters: dataSourceSettings.filters,
                    values: dataSourceSettings.values,
                    filterSettings: dataSourceSettings.filterSettings,
                    sortSettings: dataSourceSettings.sortSettings,
                    drilledMembers: dataSourceSettings.drilledMembers,
                    valueSortSettings: dataSourceSettings.valueSortSettings,
                    valueAxis: dataSourceSettings.valueAxis,
                    formatSettings: dataSourceSettings.formatSettings,
                    calculatedFieldSettings: dataSourceSettings.calculatedFieldSettings,
                    fieldMapping: dataSourceSettings.fieldMapping,
                    showSubTotals: dataSourceSettings.showSubTotals,
                    showRowSubTotals: dataSourceSettings.showRowSubTotals,
                    showColumnSubTotals: dataSourceSettings.showColumnSubTotals,
                    showGrandTotals: dataSourceSettings.showGrandTotals,
                    showRowGrandTotals: dataSourceSettings.showRowGrandTotals,
                    showColumnGrandTotals: dataSourceSettings.showColumnGrandTotals,
                    showHeaderWhenEmpty: dataSourceSettings.showHeaderWhenEmpty,
                    alwaysShowValueHeader: dataSourceSettings.alwaysShowValueHeader,
                    conditionalFormatSettings: dataSourceSettings.conditionalFormatSettings,
                    emptyCellsTextContent: dataSourceSettings.emptyCellsTextContent,
                    groupSettings: dataSourceSettings.groupSettings,
                    showAggregationOnValueField: dataSourceSettings.showAggregationOnValueField,
                    authentication: this.CloneAuthenticationObject(dataSourceSettings.authentication),
                })
                /* tslint:enable:no-any */
            });
        }
    };
    PivotUtil.cloneFieldSettings = function (collection) {
        if (collection) {
            var clonedCollection = [];
            for (var _i = 0, collection_1 = collection; _i < collection_1.length; _i++) {
                var set = collection_1[_i];
                var field = {};
                clonedCollection.push(this.getDefinedObj({
                    name: set.name,
                    caption: set.caption,
                    axis: set.axis,
                    baseField: set.baseField,
                    baseItem: set.baseItem,
                    isCalculatedField: set.isCalculatedField,
                    isNamedSet: set.isNamedSet,
                    showNoDataItems: set.showNoDataItems,
                    showSubTotals: set.showSubTotals,
                    type: set.type,
                    dataType: set.dataType,
                    showFilterIcon: set.showFilterIcon,
                    showSortIcon: set.showSortIcon,
                    showRemoveIcon: set.showRemoveIcon,
                    showValueTypeIcon: set.showValueTypeIcon,
                    showEditIcon: set.showEditIcon,
                    allowDragAndDrop: set.allowDragAndDrop
                    /* tslint:disable:no-any */
                }));
                /* tslint:enable:no-any */
            }
            return clonedCollection;
        }
        else {
            return collection;
        }
    };
    PivotUtil.cloneFilterSettings = function (collection) {
        if (collection) {
            var clonedCollection = [];
            for (var _i = 0, collection_2 = collection; _i < collection_2.length; _i++) {
                var set = collection_2[_i];
                clonedCollection.push(this.getDefinedObj({
                    name: set.name,
                    type: set.type,
                    condition: set.condition,
                    items: set.items ? set.items.slice() : set.items,
                    levelCount: set.levelCount,
                    measure: set.measure,
                    selectedField: set.selectedField,
                    showDateFilter: set.showDateFilter,
                    showLabelFilter: set.showLabelFilter,
                    showNumberFilter: set.showNumberFilter,
                    value1: set.value1,
                    value2: set.value2
                    /* tslint:disable:no-any */
                }));
                /* tslint:enable:no-any */
            }
            return clonedCollection;
        }
        else {
            return collection;
        }
    };
    PivotUtil.cloneSortSettings = function (collection) {
        if (collection) {
            var clonedCollection = [];
            for (var _i = 0, collection_3 = collection; _i < collection_3.length; _i++) {
                var set = collection_3[_i];
                clonedCollection.push(this.getDefinedObj({
                    name: set.name,
                    order: set.order
                    /* tslint:disable:no-any */
                }));
                /* tslint:enable:no-any */
            }
            return clonedCollection;
        }
        else {
            return collection;
        }
    };
    PivotUtil.cloneDrillMemberSettings = function (collection) {
        if (collection) {
            var clonedCollection = [];
            for (var _i = 0, collection_4 = collection; _i < collection_4.length; _i++) {
                var set = collection_4[_i];
                clonedCollection.push(this.getDefinedObj({
                    name: set.name,
                    delimiter: set.delimiter,
                    items: set.items ? set.items.slice() : set.items
                    /* tslint:disable:no-any */
                }));
                /* tslint:enable:no-any */
            }
            return clonedCollection;
        }
        else {
            return collection;
        }
    };
    PivotUtil.cloneFormatSettings = function (collection) {
        if (collection) {
            var clonedCollection = [];
            for (var _i = 0, collection_5 = collection; _i < collection_5.length; _i++) {
                var set = collection_5[_i];
                clonedCollection.push(this.getDefinedObj({
                    name: set.name,
                    calendar: set.calendar,
                    currency: set.currency,
                    format: set.format,
                    maximumFractionDigits: set.maximumFractionDigits,
                    maximumSignificantDigits: set.maximumSignificantDigits,
                    minimumFractionDigits: set.minimumFractionDigits,
                    minimumIntegerDigits: set.minimumIntegerDigits,
                    minimumSignificantDigits: set.minimumSignificantDigits,
                    skeleton: set.skeleton,
                    type: set.type,
                    useGrouping: set.useGrouping
                    /* tslint:disable:no-any */
                }));
                /* tslint:enable:no-any */
            }
            return clonedCollection;
        }
        else {
            return collection;
        }
    };
    PivotUtil.CloneValueSortObject = function (collection) {
        if (collection) {
            var clonedCollection = {
                columnIndex: collection.columnIndex,
                headerDelimiter: collection.headerDelimiter,
                headerText: collection.headerText,
                measure: collection.measure,
                sortOrder: collection.sortOrder
            };
            return clonedCollection;
        }
        else {
            return collection;
        }
    };
    PivotUtil.CloneAuthenticationObject = function (collection) {
        if (collection) {
            var clonedCollection = {
                userName: collection.userName,
                password: collection.password
            };
            return clonedCollection;
        }
        else {
            return collection;
        }
    };
    PivotUtil.cloneCalculatedFieldSettings = function (collection) {
        if (collection) {
            var clonedCollection = [];
            for (var _i = 0, collection_6 = collection; _i < collection_6.length; _i++) {
                var set = collection_6[_i];
                clonedCollection.push(this.getDefinedObj({
                    name: set.name,
                    formatString: set.formatString,
                    formula: set.formula,
                    hierarchyUniqueName: set.hierarchyUniqueName
                    /* tslint:disable:no-any */
                }));
                /* tslint:enable:no-any */
            }
            return clonedCollection;
        }
        else {
            return collection;
        }
    };
    PivotUtil.cloneConditionalFormattingSettings = function (collection) {
        if (collection) {
            var clonedCollection = [];
            for (var _i = 0, collection_7 = collection; _i < collection_7.length; _i++) {
                var set = collection_7[_i];
                clonedCollection.push(this.getDefinedObj({
                    applyGrandTotals: set.applyGrandTotals,
                    conditions: set.conditions,
                    label: set.label,
                    measure: set.measure,
                    style: set.style ? {
                        backgroundColor: set.style.backgroundColor,
                        color: set.style.color,
                        fontFamily: set.style.fontFamily,
                        fontSize: set.style.fontSize
                    } : set.style,
                    value1: set.value1,
                    value2: set.value2
                    /* tslint:disable:no-any */
                }));
                /* tslint:enable:no-any */
            }
            return clonedCollection;
        }
        else {
            return collection;
        }
    };
    PivotUtil.cloneGroupSettings = function (collection) {
        if (collection) {
            var clonedCollection = [];
            for (var _i = 0, collection_8 = collection; _i < collection_8.length; _i++) {
                var set = collection_8[_i];
                clonedCollection.push(this.getDefinedObj({
                    name: set.name,
                    caption: set.caption,
                    customGroups: this.cloneCustomGroups(set.customGroups),
                    endingAt: set.endingAt,
                    startingAt: set.startingAt,
                    groupInterval: set.groupInterval,
                    rangeInterval: set.rangeInterval,
                    type: set.type
                    /* tslint:disable:no-any */
                }));
                /* tslint:enable:no-any */
            }
            return clonedCollection;
        }
        else {
            return collection;
        }
    };
    PivotUtil.cloneCustomGroups = function (collection) {
        if (collection) {
            var clonedCollection = [];
            for (var _i = 0, collection_9 = collection; _i < collection_9.length; _i++) {
                var set = collection_9[_i];
                clonedCollection.push(this.getDefinedObj({
                    groupName: set.groupName,
                    items: set.items ? set.items.slice() : set.items
                    /* tslint:disable:no-any */
                }));
                /* tslint:enable:no-any */
            }
            return clonedCollection;
        }
        else {
            return collection;
        }
    };
    PivotUtil.getFilterItemByName = function (fieldName, fields) {
        var filterItems = new DataManager({ json: fields }).executeLocal(new Query().where('name', 'equal', fieldName));
        if (filterItems && filterItems.length > 0) {
            return filterItems[filterItems.length - 1];
        }
        return undefined;
    };
    /* tslint:disable-next-line:max-line-length */
    PivotUtil.getFieldByName = function (fieldName, fields) {
        return new DataManager({ json: fields }).executeLocal(new Query().where('name', 'equal', fieldName))[0];
    };
    PivotUtil.getFieldInfo = function (fieldName, control) {
        var rows = this.cloneFieldSettings(control.dataSourceSettings.rows);
        var columns = this.cloneFieldSettings(control.dataSourceSettings.columns);
        var values = this.cloneFieldSettings(control.dataSourceSettings.values);
        var filters = this.cloneFieldSettings(control.dataSourceSettings.filters);
        var fields = [rows, columns, values, filters];
        for (var i = 0, len = fields.length; i < len; i++) {
            for (var j = 0, cnt = (fields[i] ? fields[i].length : 0); j < cnt; j++) {
                if (fields[i][j] && fields[i][j].name === fieldName) {
                    /* tslint:disable-next-line:max-line-length */
                    return { fieldName: fieldName, fieldItem: fields[i][j], axis: i === 0 ? 'rows' : i === 1 ? 'columns' : i === 2 ? 'values' : 'filters', position: j };
                }
            }
        }
        var fieldList = control.dataType === 'olap' ?
            control.olapEngineModule.fieldList[fieldName] : control.engineModule.fieldList[fieldName];
        var fieldItem = (fieldList ? {
            name: fieldName,
            caption: fieldList.caption,
            baseField: fieldList.baseField,
            baseItem: fieldList.baseItem,
            isCalculatedField: fieldList.isCalculatedField,
            isNamedSet: fieldList.isNamedSets,
            showNoDataItems: fieldList.showNoDataItems,
            showSubTotals: fieldList.showSubTotals,
            type: fieldList.aggregateType,
            showFilterIcon: fieldList.showFilterIcon,
            showSortIcon: fieldList.showSortIcon,
            showRemoveIcon: fieldList.showRemoveIcon,
            showValueTypeIcon: fieldList.showValueTypeIcon,
            showEditIcon: fieldList.showEditIcon,
            allowDragAndDrop: fieldList.allowDragAndDrop
        } : undefined);
        return { fieldName: fieldName, fieldItem: fieldItem, axis: 'fieldlist', position: -1 };
    };
    /* tslint:disable-next-line:max-line-length */
    PivotUtil.isButtonIconRefesh = function (prop, oldProp, newProp) {
        var isButtonRefresh = false;
        try {
            if (prop === 'dataSourceSettings' && oldProp.dataSourceSettings && newProp.dataSourceSettings) {
                var propValidation = ['notAvail', 'notAvail', 'notAvail', 'notAvail'];
                var oldAxesProp = Object.keys(oldProp.dataSourceSettings);
                var newAxesProp = Object.keys(newProp.dataSourceSettings);
                if (oldAxesProp && newAxesProp && newAxesProp.length > 0 && oldAxesProp.length === newAxesProp.length) {
                    var axes = ['rows', 'columns', 'values', 'filters'];
                    /* tslint:disable:no-any */
                    for (var i = 0; i < newAxesProp.length; i++) {
                        var oldAxis = (newAxesProp[i] in oldProp.dataSourceSettings && !isNullOrUndefined(oldProp.dataSourceSettings[newAxesProp[i]])) ? Object.keys(oldProp.dataSourceSettings[newAxesProp[i]]) : [];
                        var newAxis = (newAxesProp[i] in newProp.dataSourceSettings && !isNullOrUndefined(newProp.dataSourceSettings[newAxesProp[i]])) ? Object.keys(newProp.dataSourceSettings[newAxesProp[i]]) : [];
                        if (axes.indexOf(newAxesProp[i]) !== -1 && axes.indexOf(oldAxesProp[i]) !== -1 &&
                            oldAxis && newAxis && newAxis.length > 0 && oldAxis.length === newAxis.length) {
                            /* tslint:disable-next-line:max-line-length */
                            var options = ['showFilterIcon', 'showSortIcon', 'showRemoveIcon', 'showValueTypeIcon', 'showEditIcon', 'allowDragAndDrop'];
                            for (var j = 0; j < newAxis.length; j++) {
                                var oldAxisProp = Object.keys(oldProp.dataSourceSettings[newAxesProp[i]][newAxis[j]]);
                                var newAxisProp = Object.keys(newProp.dataSourceSettings[newAxesProp[i]][newAxis[j]]);
                                for (var k = 0; k < newAxisProp.length; k++) {
                                    if (options.indexOf(newAxisProp[k]) !== -1 && options.indexOf(oldAxisProp[k]) !== -1) {
                                        propValidation[i] = 'update';
                                    }
                                    else {
                                        propValidation[i] = 'break';
                                        break;
                                    }
                                }
                                if (propValidation[i] === 'break') {
                                    break;
                                }
                            }
                        }
                        else {
                            propValidation[i] = 'break';
                        }
                        if (propValidation[i] === 'break') {
                            break;
                        }
                    }
                    /* tslint:enable:no-any */
                }
                var a = 0;
                var b = 0;
                var c = 0;
                for (var _i = 0, propValidation_1 = propValidation; _i < propValidation_1.length; _i++) {
                    var validation = propValidation_1[_i];
                    if (validation === 'break') {
                        a++;
                    }
                    if (validation === 'notAvail') {
                        b++;
                    }
                    if (validation === 'update') {
                        c++;
                    }
                }
                isButtonRefresh = (a > 0 || b === 4) ? false : (a === 0 && b < 4 && c > 0);
            }
        }
        catch (exception) {
            isButtonRefresh = false;
        }
        return isButtonRefresh;
    };
    return PivotUtil;
}());
export { PivotUtil };
