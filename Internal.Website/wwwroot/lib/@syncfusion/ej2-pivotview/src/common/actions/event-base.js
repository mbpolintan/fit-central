import { isNullOrUndefined, removeClass, addClass } from '@syncfusion/ej2-base';
import * as cls from '../base/css-constant';
import { PivotUtil } from '../../base/util';
/**
 * `EventBase` for active fields action.
 */
/** @hidden */
var EventBase = /** @class */ (function () {
    /**
     * Constructor for the dialog action.
     * @hidden
     */
    function EventBase(parent) {
        this.parent = parent;
    }
    /**
     * Updates sorting order for the selected field.
     * @method updateSorting
     * @param  {Event} args - Contains clicked element information to update dataSource.
     * @return {void}
     * @hidden
     */
    EventBase.prototype.updateSorting = function (args) {
        if (!(args.target.classList.contains(cls.FILTER_COMMON_CLASS)) &&
            !(args.target.classList.contains(cls.REMOVE_CLASS))) {
            if (this.parent.filterDialog.dialogPopUp) {
                this.parent.filterDialog.dialogPopUp.close();
            }
            var target = args.target;
            var fieldName = void 0;
            var checkisDescending = void 0;
            var isDescending = void 0;
            if (target.id) {
                fieldName = target.id;
                checkisDescending = [].slice.call(target.querySelectorAll('.' + cls.SORT_DESCEND_CLASS));
            }
            else {
                fieldName = target.parentElement.id;
                checkisDescending = [].slice.call(target.parentElement.querySelectorAll('.' + cls.SORT_DESCEND_CLASS));
            }
            if (checkisDescending.length === 0) {
                isDescending = false;
            }
            else {
                isDescending = true;
            }
            //isDescending = (target.querySelectorAll(cls.SORT_DESCEND_CLASS));
            var sortObj = PivotUtil.getFieldByName(fieldName, this.parent.dataSourceSettings.sortSettings);
            if (!isNullOrUndefined(sortObj)) {
                for (var i = 0; i < this.parent.dataSourceSettings.sortSettings.length; i++) {
                    if (this.parent.dataSourceSettings.sortSettings[i].name === fieldName) {
                        this.parent.dataSourceSettings.sortSettings.splice(i, 1);
                        break;
                    }
                }
                var newSortObj = { name: fieldName, order: isDescending ? 'Ascending' : 'Descending' };
                // let newSortObj: ISort = { name: fieldName, order: isNone ? 'Ascending' : isDescending ? 'None' : 'Descending' };
                this.parent.dataSourceSettings.sortSettings.push(newSortObj);
            }
            else {
                var newSortObj = { name: fieldName, order: isDescending ? 'Ascending' : 'Descending' };
                //let newSortObj: ISort = { name: fieldName, order: isNone ? 'Ascending' : isDescending ? 'None' : 'Descending'  };
                this.parent.dataSourceSettings.sortSettings.push(newSortObj);
            }
            this.parent.control.lastSortInfo =
                this.parent.dataSourceSettings.sortSettings[this.parent.dataSourceSettings.sortSettings.length - 1];
            isDescending ? removeClass([target], cls.SORT_DESCEND_CLASS) : addClass([target], cls.SORT_DESCEND_CLASS);
            // if (isDescending) {
            //     removeClass([target], cls.SORT_DESCEND_CLASS);
            //     addClass([target], cls.SORTING);
            // } else if (!isDescending && !isNone) {
            //     addClass([target], cls.SORT_DESCEND_CLASS);
            // } else if (isNone) {
            //     removeClass([target], cls.SORTING);
            // } else if (!isNone) {
            //     removeClass([target], cls.SORT_DESCEND_CLASS);
            //     removeClass([target], cls.SORTING);
            //    //addClass([target], cls.SORT_CLASS);
            // }
        }
    };
    /**
     * Updates sorting order for the selected field.
     * @method updateFiltering
     * @param  {Event} args - Contains clicked element information to update dataSource.
     * @return {void}
     * @hidden
     */
    EventBase.prototype.updateFiltering = function (args) {
        var target = args.target;
        var fieldName = target.parentElement.id;
        var fieldCaption = target.parentElement.textContent;
        var isInclude = false;
        var filterItems = [];
        var treeData = [];
        if (this.parent.dataSourceSettings.allowMemberFilter) {
            if (this.parent.dataType === 'olap') {
                treeData = this.getOlapData(fieldName, isInclude);
            }
            else {
                var members = PivotUtil.getClonedData(this.parent.engineModule.fieldList[fieldName].dateMember);
                /* tslint:disable:typedef */
                members =
                    this.parent.engineModule.fieldList[fieldName].sort === 'Ascending' ?
                        (members.sort(function (a, b) { return (a.actualText > b.actualText) ? 1 :
                            ((b.actualText > a.actualText) ? -1 : 0); })) :
                        this.parent.engineModule.fieldList[fieldName].sort === 'Descending' ?
                            (members.sort(function (a, b) { return (a.actualText < b.actualText) ? 1 :
                                ((b.actualText < a.actualText) ? -1 : 0); })) :
                            members;
                /* tslint:enable:typedef */
                var filterObj = PivotUtil.getFilterItemByName(fieldName, this.parent.dataSourceSettings.filterSettings);
                if (!isNullOrUndefined(filterObj)) {
                    isInclude = this.isValidFilterItemsAvail(fieldName, filterObj) && filterObj.type === 'Include' ? true : false;
                    filterItems = filterObj.items ? filterObj.items : [];
                }
                treeData =
                    this.getTreeData(isInclude, members, filterItems, fieldName);
            }
        }
        if (this.parent.filterDialog.dialogPopUp) {
            this.parent.filterDialog.dialogPopUp.close();
        }
        var popupTarget;
        popupTarget = this.parent.moduleName !== 'pivotfieldlist' ?
            this.parent.element : document.getElementById(this.parent.parentID + '_Wrapper');
        this.parent.filterDialog.createFilterDialog(treeData, fieldName, fieldCaption, popupTarget);
    };
    /**
     * Returns boolean by checing the valid filter members from the selected filter settings.
     * @method isValidFilterItemsAvail
     * @param  {string} fieldName - Gets filter members for the given field name.
     * @return {boolean}
     * @hidden
     */
    EventBase.prototype.isValidFilterItemsAvail = function (fieldName, filterObj) {
        var isItemAvail = false;
        var filterTypes = ['Include', 'Exclude'];
        if (filterObj && filterTypes.indexOf(filterObj.type) >= 0) {
            var engineModule = this.parent.engineModule;
            var field = engineModule.fieldList[fieldName];
            var members = (engineModule.formatFields[fieldName] &&
                (['date', 'dateTime', 'time'].indexOf(engineModule.formatFields[fieldName].type) > -1)) ?
                field.formattedMembers : field.members;
            for (var _i = 0, _a = filterObj.items; _i < _a.length; _i++) {
                var item = _a[_i];
                if (members[item]) {
                    isItemAvail = true;
                    break;
                }
            }
        }
        return isItemAvail;
    };
    EventBase.prototype.getOlapData = function (fieldName, isInclude) {
        var treeData = [];
        var filterItems = [];
        this.parent.filterDialog.isSearchEnabled = false;
        var updatedTreeData = [];
        var engineModule = this.parent.engineModule;
        var filterObj = PivotUtil.getFilterItemByName(fieldName, this.parent.dataSourceSettings.filterSettings);
        if (engineModule.fieldList[fieldName].filterMembers.length === 0) {
            if (!this.parent.control.loadOnDemandInMemberEditor) {
                engineModule.getMembers(this.parent.dataSourceSettings, fieldName, true);
            }
            else if (filterObj && filterObj.levelCount > 1 && engineModule.fieldList[fieldName].levels.length > 1) {
                engineModule.getFilterMembers(this.parent.dataSourceSettings, fieldName, filterObj.levelCount);
            }
            else {
                engineModule.fieldList[fieldName].levelCount = 1;
                engineModule.getMembers(this.parent.dataSourceSettings, fieldName);
            }
        }
        else {
            engineModule.fieldList[fieldName].currrentMembers = {};
            engineModule.fieldList[fieldName].searchMembers = [];
        }
        var isHierarchy = engineModule.fieldList[fieldName].isHierarchy;
        treeData = engineModule.fieldList[fieldName].filterMembers;
        if (!isNullOrUndefined(filterObj)) {
            isInclude = filterObj.type ? filterObj.type === 'Include' ? true : false : true;
            filterItems = filterObj.items ? filterObj.items : [];
        }
        var filterItemObj = {};
        var dummyfilterItems = {};
        var memberObject = engineModule.fieldList[fieldName].members;
        for (var _i = 0, filterItems_1 = filterItems; _i < filterItems_1.length; _i++) {
            var item = filterItems_1[_i];
            filterItemObj[item] = item;
            dummyfilterItems[item] = item;
            if (memberObject[item]) {
                dummyfilterItems = this.getParentNode(fieldName, item, dummyfilterItems);
            }
        }
        treeData = this.getFilteredTreeNodes(fieldName, treeData, dummyfilterItems, updatedTreeData, isHierarchy);
        treeData = this.getOlapTreeData(isInclude, PivotUtil.getClonedData(treeData), filterItemObj, fieldName, isHierarchy);
        treeData = this.sortOlapFilterData(treeData, engineModule.fieldList[fieldName].sort);
        return treeData;
    };
    /**
     * Gets sorted filter members for the selected field.
     * @method sortFilterData
     * @param  {{ [key: string]: Object }[]} treeData - Gets filter members for the given field name.
     * @return {{ [key: string]: Object }[]}
     * @hidden
     */
    EventBase.prototype.sortOlapFilterData = function (treeData, order) {
        if (treeData.length > 0) {
            /* tslint:disable:typedef */
            treeData = order === 'Ascending' ?
                (treeData.sort(function (a, b) { return (a.caption > b.caption) ? 1 :
                    ((b.caption > a.caption) ? -1 : 0); })) : order === 'Descending' ?
                (treeData.sort(function (a, b) { return (a.caption < b.caption) ? 1 :
                    ((b.caption < a.caption) ? -1 : 0); })) : treeData;
            /* tslint:enable:typedef */
        }
        return treeData;
    };
    EventBase.prototype.getParentIDs = function (treeObj, id, parent) {
        var data = treeObj.fields.dataSource;
        var pid;
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var li = data_1[_i];
            if (li.id === id) {
                pid = li.pid;
                break;
            }
        }
        if (pid) {
            parent.push(pid);
            this.getParentIDs(treeObj, pid, parent);
        }
        return parent;
    };
    EventBase.prototype.getChildIDs = function (treeObj, id, children) {
        var data = treeObj.fields.dataSource;
        var cID;
        for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
            var li = data_2[_i];
            if (li.pid === id) {
                cID = li.id;
                break;
            }
        }
        if (cID) {
            children.push(cID);
            this.getParentIDs(treeObj, cID, children);
        }
        return children;
    };
    /**
     * show tree nodes using search text.
     * @hidden
     */
    /* tslint:disable:max-func-body-length */
    EventBase.prototype.searchTreeNodes = function (args, treeObj, isFieldCollection, isHierarchy) {
        if (isFieldCollection) {
            var searchList = [];
            var nonSearchList = [];
            var list = [].slice.call(treeObj.element.querySelectorAll('li'));
            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                var element = list_1[_i];
                if ((element.querySelector('.e-list-text').textContent.toLowerCase()).indexOf(args.value.toLowerCase()) > -1) {
                    searchList.push(element);
                }
                else {
                    nonSearchList.push(element);
                }
            }
            treeObj.enableNodes(searchList);
            removeClass(searchList, cls.ICON_DISABLE);
            treeObj.disableNodes(nonSearchList);
            addClass(nonSearchList, cls.ICON_DISABLE);
            if (searchList.length > 0 && nonSearchList.length > 0) {
                for (var _a = 0, searchList_1 = searchList; _a < searchList_1.length; _a++) {
                    var currentNode = searchList_1[_a];
                    var id = currentNode.getAttribute('data-uid');
                    var parentIDs = this.getParentIDs(treeObj, id, []);
                    var childIDs = this.getChildIDs(treeObj, id, []);
                    var pNodes = [];
                    if (parentIDs.length > 0) {
                        for (var _b = 0, nonSearchList_1 = nonSearchList; _b < nonSearchList_1.length; _b++) {
                            var li = nonSearchList_1[_b];
                            if (PivotUtil.inArray(li.getAttribute('data-uid'), parentIDs) !== -1) {
                                pNodes.push(li);
                            }
                        }
                    }
                    if (childIDs.length > 0) {
                        for (var _c = 0, nonSearchList_2 = nonSearchList; _c < nonSearchList_2.length; _c++) {
                            var li = nonSearchList_2[_c];
                            if (PivotUtil.inArray(li.getAttribute('data-uid'), childIDs) !== -1) {
                                pNodes.push(li);
                            }
                        }
                    }
                    treeObj.enableNodes(pNodes);
                    removeClass(pNodes, cls.ICON_DISABLE);
                }
            }
            if ([].slice.call(treeObj.element.querySelectorAll('li.' + cls.ICON_DISABLE)).length === 0) {
                treeObj.collapseAll();
            }
            else {
                treeObj.expandAll(undefined, undefined, true);
            }
        }
        else {
            this.parent.searchTreeItems = [];
            if (this.parent.dataType === 'olap' && !isHierarchy) {
                this.updateOlapSearchTree(args, treeObj, isHierarchy);
            }
            else {
                var searchList = [];
                var memberCount = 0;
                memberCount = 1;
                for (var _d = 0, _e = this.parent.currentTreeItems; _d < _e.length; _d++) {
                    var item = _e[_d];
                    if (item.name.toLowerCase().indexOf(args.value.toLowerCase()) > -1) {
                        this.parent.searchTreeItems.push(item);
                        if (memberCount <= this.parent.control.maxNodeLimitInMemberEditor) {
                            searchList.push(item);
                        }
                        memberCount++;
                    }
                }
                memberCount--;
                if (memberCount > this.parent.control.maxNodeLimitInMemberEditor) {
                    this.parent.editorLabelElement.innerText = (memberCount - this.parent.control.maxNodeLimitInMemberEditor) +
                        this.parent.control.localeObj.getConstant('editorDataLimitMsg');
                    this.parent.filterDialog.dialogPopUp.height = (this.parent.filterDialog.allowExcelLikeFilter ? '440px' : '400px');
                    this.parent.isDataOverflow = true;
                }
                else {
                    this.parent.editorLabelElement.innerText = '';
                    this.parent.filterDialog.dialogPopUp.height = (this.parent.filterDialog.allowExcelLikeFilter ? '400px' : '350px');
                    this.parent.isDataOverflow = false;
                }
                this.parent.isDataOverflow = (memberCount > this.parent.control.maxNodeLimitInMemberEditor);
                this.parent.editorLabelElement.parentElement.style.display = this.parent.isDataOverflow ? 'block' : 'none';
                treeObj.fields = { dataSource: searchList, id: 'id', text: 'name', isChecked: 'isSelected', parentID: 'pid' };
                treeObj.dataBind();
            }
        }
    };
    EventBase.prototype.updateOlapSearchTree = function (args, treeObj, isHierarchy) {
        var treeData = [];
        var filterDialog = this.parent.filterDialog.dialogPopUp.element;
        var fieldName = filterDialog.getAttribute('data-fieldname');
        if (args.value.toLowerCase() === '') {
            this.parent.filterDialog.isSearchEnabled = false;
            this.parent.engineModule.fieldList[fieldName].searchMembers = [];
            // (this.parent.engineModule.fieldList[fieldName] as IOlapField).currrentMembers = {};
            var updatedTreeData = [];
            var filterItemObj = {};
            var dummyfilterItems = {};
            var memberObject = this.parent.engineModule.fieldList[fieldName].members;
            var members = Object.keys(memberObject);
            var filterItems = [];
            for (var _i = 0, members_1 = members; _i < members_1.length; _i++) {
                var item = members_1[_i];
                if (memberObject[item].isSelected) {
                    if (!(memberObject[item].parent && memberObject[memberObject[item].parent].isSelected)) {
                        filterItems.push(item);
                    }
                }
            }
            for (var _a = 0, filterItems_2 = filterItems; _a < filterItems_2.length; _a++) {
                var item = filterItems_2[_a];
                filterItemObj[item] = item;
                dummyfilterItems[item] = item;
                if (memberObject[item]) {
                    dummyfilterItems = this.getParentNode(fieldName, item, dummyfilterItems);
                }
            }
            var searchData = this.parent.engineModule.fieldList[fieldName].filterMembers;
            treeData = this.getFilteredTreeNodes(fieldName, searchData, dummyfilterItems, updatedTreeData, isHierarchy);
            treeData = this.getOlapTreeData(true, PivotUtil.getClonedData(treeData), filterItemObj, fieldName, isHierarchy, true);
        }
        else {
            this.parent.filterDialog.isSearchEnabled = true;
            var searchData = this.parent.engineModule.fieldList[fieldName].searchMembers;
            treeData = PivotUtil.getClonedData(searchData);
            treeData = this.getOlapSearchTreeData(true, treeData, fieldName);
        }
        treeObj.fields = { dataSource: treeData, id: 'id', text: 'name', isChecked: 'isSelected', parentID: 'pid' };
        treeObj.dataBind();
    };
    EventBase.prototype.getTreeData = function (isInclude, members, filterItems, fieldName) {
        this.parent.currentTreeItems = [];
        this.parent.searchTreeItems = [];
        this.parent.currentTreeItemsPos = {};
        this.parent.savedTreeFilterPos = {};
        var engineModule = this.parent.engineModule;
        this.parent.isDateField = engineModule.formatFields[fieldName] &&
            ((['date', 'dateTime', 'time']).indexOf(engineModule.formatFields[fieldName].type) > -1);
        var list = [];
        var memberCount = 1;
        var filterObj = {};
        for (var _i = 0, filterItems_3 = filterItems; _i < filterItems_3.length; _i++) {
            var item = filterItems_3[_i];
            filterObj[item] = item;
        }
        for (var _a = 0, members_2 = members; _a < members_2.length; _a++) {
            var member = members_2[_a];
            var memberName = this.parent.isDateField ? member.formattedText : member.actualText.toString();
            /* tslint:disable */
            var obj = {
                id: member.actualText.toString(),
                actualText: member.actualText,
                name: memberName,
                isSelected: isInclude ? false : true
            };
            /* tslint:enable */
            if (filterObj[memberName] !== undefined) {
                obj.isSelected = isInclude ? true : false;
            }
            if (memberCount <= this.parent.control.maxNodeLimitInMemberEditor) {
                list.push(obj);
            }
            if (!obj.isSelected) {
                this.parent.savedTreeFilterPos[memberCount - 1] = memberName;
            }
            this.parent.currentTreeItems.push(obj);
            this.parent.searchTreeItems.push(obj);
            this.parent.currentTreeItemsPos[member.actualText] = { index: memberCount - 1, isSelected: obj.isSelected };
            memberCount++;
        }
        this.parent.isDataOverflow = ((memberCount - 1) > this.parent.control.maxNodeLimitInMemberEditor);
        return list;
    };
    /* tslint:disable-next-line:max-line-length */
    EventBase.prototype.getOlapTreeData = function (isInclude, members, filterObj, fieldName, isHierarchy, isSearchRender) {
        var engineModule = this.parent.engineModule;
        var fieldList = engineModule.fieldList[fieldName];
        this.parent.currentTreeItems = [];
        this.parent.searchTreeItems = [];
        this.parent.currentTreeItemsPos = {};
        var list = [];
        var memberCount = 1;
        for (var _i = 0, members_3 = members; _i < members_3.length; _i++) {
            var member = members_3[_i];
            var obj = member;
            var memberName = member.id.toString();
            if (!isSearchRender) {
                obj.isSelected = isInclude ? false : true;
            }
            if (filterObj[memberName] !== undefined) {
                obj.isSelected = isInclude ? true : false;
            }
            if (!isSearchRender && member.hasChildren) {
                this.updateChildNodeStates(fieldList.filterMembers, fieldName, member.id, obj.isSelected);
            }
            fieldList.members[memberName].isSelected = obj.isSelected;
            if (fieldList.currrentMembers && fieldList.currrentMembers[memberName]) {
                fieldList.currrentMembers[memberName].isSelected = obj.isSelected;
            }
            if (memberCount <= this.parent.control.maxNodeLimitInMemberEditor && isHierarchy) {
                list.push(obj);
            }
            this.parent.currentTreeItems.push(obj);
            this.parent.searchTreeItems.push(obj);
            this.parent.currentTreeItemsPos[memberName] = { index: memberCount - 1, isSelected: obj.isSelected };
            memberCount++;
        }
        this.parent.isDataOverflow = isHierarchy ? ((memberCount - 1) > this.parent.control.maxNodeLimitInMemberEditor) : false;
        return isHierarchy ? list : members;
    };
    /* tslint:disable-next-line:max-line-length */
    EventBase.prototype.getOlapSearchTreeData = function (isInclude, members, fieldName) {
        var cMembers = this.parent.engineModule.fieldList[fieldName].members;
        for (var _i = 0, members_4 = members; _i < members_4.length; _i++) {
            var member = members_4[_i];
            var memberName = member.id.toString();
            if (cMembers[memberName]) {
                member.isSelected = cMembers[memberName].isSelected;
            }
            this.parent.searchTreeItems.push(member);
        }
        return members;
    };
    EventBase.prototype.updateChildNodeStates = function (members, fieldName, node, state) {
        var cMembers = this.parent.engineModule.fieldList[fieldName].members;
        var sMembers = this.parent.engineModule.fieldList[fieldName].currrentMembers;
        for (var _i = 0, members_5 = members; _i < members_5.length; _i++) {
            var member = members_5[_i];
            if (member.pid && member.pid.toString() === node) {
                cMembers[member.id].isSelected = state;
                if (sMembers && sMembers[member.id]) {
                    sMembers[member.id].isSelected = state;
                }
                if (member.hasChildren) {
                    this.updateChildNodeStates(members, fieldName, member.id, state);
                }
            }
        }
    };
    /**
     * get the parent node of particular filter members.
     * @hidden
     */
    EventBase.prototype.getParentNode = function (fieldName, item, filterObj) {
        var members = this.parent.engineModule.fieldList[fieldName].members;
        if (members[item].parent && item !== members[item].parent) {
            var parentItem = members[item].parent;
            filterObj[parentItem] = parentItem;
            this.getParentNode(fieldName, parentItem, filterObj);
        }
        return filterObj;
    };
    /* tslint:disable-next-line:max-line-length */
    EventBase.prototype.getFilteredTreeNodes = function (fieldName, members, filterObj, treeData, isHierarchy) {
        var parentNodes = [];
        var memberObject = this.parent.engineModule.fieldList[fieldName].members;
        var selectedNodes = filterObj ? Object.keys(filterObj) : [];
        for (var _i = 0, selectedNodes_1 = selectedNodes; _i < selectedNodes_1.length; _i++) {
            var node = selectedNodes_1[_i];
            var parent_1 = memberObject[node].parent;
            if (parent_1 !== undefined && PivotUtil.inArray(parent_1, parentNodes) === -1) {
                parentNodes.push(parent_1);
            }
        }
        for (var _a = 0, members_6 = members; _a < members_6.length; _a++) {
            var member = members_6[_a];
            if (isNullOrUndefined(member.pid) || PivotUtil.inArray(member.pid, parentNodes) !== -1) {
                treeData.push(member);
                if (isNullOrUndefined(member.pid) && PivotUtil.inArray(member.id, parentNodes) !== -1) {
                    memberObject[member.id].isNodeExpand = true;
                }
                else if (!isNullOrUndefined(member.pid) && PivotUtil.inArray(member.pid, parentNodes) !== -1) {
                    memberObject[member.id].isNodeExpand = false;
                    memberObject[member.pid].isNodeExpand = true;
                }
                else {
                    memberObject[member.id].isNodeExpand = false;
                }
            }
            else {
                memberObject[member.id].isNodeExpand = false;
            }
        }
        return treeData;
    };
    return EventBase;
}());
export { EventBase };
