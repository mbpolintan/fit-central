import { getObject } from '@syncfusion/ej2-grids';
import { DataManager, ODataAdaptor, UrlAdaptor } from '@syncfusion/ej2-data';
import { WebApiAdaptor, WebMethodAdaptor, CacheAdaptor } from '@syncfusion/ej2-data';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
export function isRemoteData(parent) {
    if (parent.dataSource instanceof DataManager) {
        var adaptor = parent.dataSource.adaptor;
        return (adaptor instanceof ODataAdaptor ||
            (adaptor instanceof WebApiAdaptor) || (adaptor instanceof WebMethodAdaptor) ||
            (adaptor instanceof CacheAdaptor) || adaptor instanceof UrlAdaptor);
    }
    return false;
}
export function isCountRequired(parent) {
    if (parent.dataSource && 'result' in parent.dataSource) {
        return true;
    }
    return false;
}
export function isCheckboxcolumn(parent) {
    for (var i = 0; i < parent.columns.length; i++) {
        if (parent.columns[i].showCheckbox) {
            return true;
        }
    }
    return false;
}
export function isFilterChildHierarchy(parent) {
    if ((!isNullOrUndefined(parent.grid.searchSettings.key) && parent.grid.searchSettings.key !== '' &&
        (parent.searchSettings.hierarchyMode === 'Child' || parent.searchSettings.hierarchyMode === 'None')) ||
        (parent.allowFiltering && parent.grid.filterSettings.columns.length &&
            (parent.filterSettings.hierarchyMode === 'Child' || parent.filterSettings.hierarchyMode === 'None'))) {
        return true;
    }
    return false;
}
/**
 * @hidden
 */
export function findParentRecords(records) {
    var datas;
    datas = [];
    var recordsLength = Object.keys(records).length;
    for (var i = 0, len = recordsLength; i < len; i++) {
        var hasChild = getObject('hasChildRecords', records[i]);
        if (hasChild) {
            datas.push(records[i]);
        }
    }
    return datas;
}
/**
 * @hidden
 */
export function getExpandStatus(parent, record, parents) {
    var parentRecord = isNullOrUndefined(record.parentItem) ? null :
        getParentData(parent, record.parentItem.uniqueID);
    var childParent;
    if (parentRecord != null) {
        if (parent.initialRender && !isNullOrUndefined(parentRecord[parent.expandStateMapping])
            && !parentRecord[parent.expandStateMapping]) {
            parentRecord.expanded = false;
            return false;
        }
        else if (parentRecord.expanded === false) {
            return false;
        }
        else if (parentRecord.parentItem) {
            childParent = getParentData(parent, parentRecord.parentItem.uniqueID);
            if (childParent && parent.initialRender && !isNullOrUndefined(childParent[parent.expandStateMapping])
                && !childParent[parent.expandStateMapping]) {
                childParent.expanded = false;
                return false;
            }
            if (childParent && childParent.expanded === false) {
                return false;
            }
            else if (childParent) {
                return getExpandStatus(parent, childParent, parents);
            }
            return true;
        }
        else {
            return true;
        }
    }
    else {
        return true;
    }
}
/**
 * @hidden
 */
export function findChildrenRecords(records) {
    var datas = [];
    if (isNullOrUndefined(records) || (!records.hasChildRecords && !isNullOrUndefined(records.childRecords)
        && !records.childRecords.length)) {
        return [];
    }
    if (!isNullOrUndefined(records.childRecords)) {
        var childRecords = records.childRecords;
        for (var i = 0, len = Object.keys(childRecords).length; i < len; i++) {
            datas.push(childRecords[i]);
            if (childRecords[i].hasChildRecords || (!isNullOrUndefined(childRecords[i].childRecords) &&
                childRecords[i].childRecords.length)) {
                datas = datas.concat(findChildrenRecords(childRecords[i]));
            }
        }
    }
    return datas;
}
export function isOffline(parent) {
    if (isRemoteData(parent)) {
        var dm = parent.dataSource;
        return !isNullOrUndefined(dm.ready);
    }
    return true;
}
export function extendArray(array) {
    var objArr = [];
    var obj;
    var keys;
    for (var i = 0; array && i < array.length; i++) {
        keys = Object.keys(array[i]);
        obj = {};
        for (var j = 0; j < keys.length; j++) {
            obj[keys[j]] = array[i][keys[j]];
        }
        objArr.push(obj);
    }
    return objArr;
}
export function getPlainData(value) {
    delete value.hasChildRecords;
    delete value.childRecords;
    delete value.index;
    delete value.parentItem;
    delete value.level;
    return value;
}
export function getParentData(parent, value, requireFilter) {
    if (requireFilter) {
        var idFilter = 'uniqueIDFilterCollection';
        return parent[idFilter][value];
    }
    else {
        var id = 'uniqueIDCollection';
        return parent[id][value];
    }
}
export function isHidden(el) {
    var style = window.getComputedStyle(el);
    return ((style.display === 'none') || (style.visibility === 'hidden'));
}
