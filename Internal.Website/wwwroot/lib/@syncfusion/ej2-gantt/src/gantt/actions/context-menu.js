import * as cons from './../base/css-constants';
import { TreeGrid, ContextMenu as TreeGridContextMenu } from '@syncfusion/ej2-treegrid';
import { remove, closest, isNullOrUndefined, getValue, extend, getElement, isBlazor } from '@syncfusion/ej2-base';
import { Deferred } from '@syncfusion/ej2-data';
import { ContextMenu as Menu } from '@syncfusion/ej2-navigations';
/**
 * The ContextMenu module is used to handle the context menu items & sub-menu items.
 */
var ContextMenu = /** @class */ (function () {
    function ContextMenu(parent) {
        var _this = this;
        this.headerContextMenuClick = function (args) {
            var gridRow = closest(args.event.target, '.e-row');
            var chartRow = closest(args.event.target, '.e-chart-row');
            if (isNullOrUndefined(gridRow) && isNullOrUndefined(chartRow)) {
                args.type = 'Header';
                _this.parent.trigger('contextMenuClick', args);
            }
        };
        this.headerContextMenuOpen = function (args) {
            var gridRow = closest(args.event.target, '.e-row');
            var chartRow = closest(args.event.target, '.e-chart-row');
            if (isNullOrUndefined(gridRow) && isNullOrUndefined(chartRow)) {
                args.type = 'Header';
                _this.parent.trigger('contextMenuOpen', args);
            }
            else {
                args.cancel = true;
            }
        };
        this.parent = parent;
        this.ganttID = parent.element.id;
        TreeGrid.Inject(TreeGridContextMenu);
        this.parent.treeGrid.contextMenuClick = this.headerContextMenuClick.bind(this);
        this.parent.treeGrid.contextMenuOpen = this.headerContextMenuOpen.bind(this);
        this.addEventListener();
        this.resetItems();
    }
    ContextMenu.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on('initiate-contextMenu', this.render, this);
        this.parent.on('reRender-contextMenu', this.reRenderContextMenu, this);
        this.parent.on('contextMenuClick', this.contextMenuItemClick, this);
        this.parent.on('contextMenuOpen', this.contextMenuBeforeOpen, this);
    };
    ContextMenu.prototype.reRenderContextMenu = function (e) {
        if (e.module === this.getModuleName() && e.enable) {
            if (this.contextMenu) {
                this.contextMenu.destroy();
                remove(this.element);
            }
            this.resetItems();
            this.render();
        }
    };
    ContextMenu.prototype.render = function () {
        this.element = this.parent.createElement('ul', {
            id: this.ganttID + '_contextmenu', className: cons.focusCell
        });
        this.parent.element.appendChild(this.element);
        var target = '#' + this.ganttID;
        this.contextMenu = new Menu({
            items: this.getMenuItems(),
            locale: this.parent.locale,
            target: target,
            animationSettings: { effect: 'None' },
            select: this.contextMenuItemClick.bind(this),
            beforeOpen: this.contextMenuBeforeOpen.bind(this),
            onOpen: this.contextMenuOpen.bind(this),
            onClose: this.contextMenuOnClose.bind(this),
            cssClass: 'e-gantt'
        });
        this.contextMenu.appendTo(this.element);
        this.parent.treeGrid.contextMenuItems = this.headerMenuItems;
    };
    ContextMenu.prototype.contextMenuItemClick = function (args) {
        this.item = this.getKeyFromId(args.item.id);
        var parentItem = getValue('parentObj', args.item);
        var index = -1;
        if (parentItem && !isNullOrUndefined(parentItem.id) && this.getKeyFromId(parentItem.id) === 'DeleteDependency') {
            index = parentItem.items.indexOf(args.item);
        }
        if (this.parent.isAdaptive) {
            if (this.item === 'TaskInformation' || this.item === 'Above' || this.item === 'Below'
                || this.item === 'Child' || this.item === 'DeleteTask') {
                if (this.parent.selectionModule && this.parent.selectionSettings.type === 'Multiple') {
                    this.parent.selectionModule.hidePopUp();
                    document.getElementsByClassName('e-gridpopup')[0].style.display = 'none';
                }
            }
        }
        switch (this.item) {
            case 'TaskInformation':
                this.parent.openEditDialog(Number(this.rowData.ganttProperties.rowUniqueID));
                break;
            case 'Above':
            case 'Below':
            case 'Child':
                var position = this.item;
                var data = extend({}, {}, this.rowData.taskData, true);
                var taskfields = this.parent.taskFields;
                if (!isNullOrUndefined(taskfields.dependency)) {
                    data[taskfields.dependency] = null;
                }
                if (!isNullOrUndefined(taskfields.child) && data[taskfields.child]) {
                    delete data[taskfields.child];
                }
                if (!isNullOrUndefined(taskfields.parentID) && data[taskfields.parentID]) {
                    data[taskfields.parentID] = null;
                }
                if (this.rowData) {
                    var rowIndex = this.parent.currentViewData.indexOf(this.rowData);
                    this.parent.addRecord(data, position, rowIndex);
                }
                break;
            case 'Milestone':
            case 'ToMilestone':
                this.parent.convertToMilestone(this.rowData.ganttProperties.rowUniqueID);
                break;
            case 'DeleteTask':
                this.parent.editModule.deleteRecord(this.rowData);
                break;
            case 'ToTask':
                data = extend({}, {}, this.rowData.taskData, true);
                taskfields = this.parent.taskFields;
                if (!isNullOrUndefined(taskfields.duration)) {
                    var ganttProp = this.rowData.ganttProperties;
                    data[taskfields.duration] = '1 ' + ganttProp.durationUnit;
                }
                else {
                    data[taskfields.startDate] = new Date(this.rowData.taskData[taskfields.startDate]);
                    var endDate = new Date(this.rowData.taskData[taskfields.startDate]);
                    endDate.setDate(endDate.getDate() + 1);
                    data[taskfields.endDate] = endDate;
                }
                if (!isNullOrUndefined(data[taskfields.milestone])) {
                    if (data[taskfields.milestone] === true) {
                        data[taskfields.milestone] = false;
                    }
                }
                this.parent.updateRecordByID(data);
                break;
            case 'Cancel':
                this.parent.cancelEdit();
                break;
            case 'Save':
                this.parent.editModule.cellEditModule.isCellEdit = false;
                this.parent.treeGrid.grid.saveCell();
                break;
            case 'Dependency' + index:
                this.parent.connectorLineEditModule.removePredecessorByIndex(this.rowData, index);
                break;
            case 'Auto':
            case 'Manual':
                this.parent.changeTaskMode(this.rowData);
                break;
            case 'Indent':
                this.parent.indent();
                break;
            case 'Outdent':
                this.parent.outdent();
                break;
        }
        args.type = 'Content';
        args.rowData = this.rowData;
        this.parent.trigger('contextMenuClick', args);
    };
    ContextMenu.prototype.contextMenuBeforeOpen = function (args) {
        var _this = this;
        args.gridRow = closest(args.event.target, '.e-row');
        args.chartRow = closest(args.event.target, '.e-chart-row');
        var menuElement = closest(args.event.target, '.e-gantt');
        var editForm = closest(args.event.target, cons.editForm);
        if (!editForm && this.parent.editModule && this.parent.editModule.cellEditModule
            && this.parent.editModule.cellEditModule.isCellEdit
            && !this.parent.editModule.dialogModule.dialogObj.open) {
            this.parent.treeGrid.grid.saveCell();
            this.parent.editModule.cellEditModule.isCellEdit = false;
        }
        if (this.parent.readOnly) {
            this.contextMenu.enableItems(['Add', 'Save', 'Convert', 'Delete Dependency', 'Delete Task', 'TaskMode', 'Indent', 'Outdent'], false);
        }
        if ((isNullOrUndefined(args.gridRow) && isNullOrUndefined(args.chartRow)) || this.contentMenuItems.length === 0) {
            if (!isNullOrUndefined(args.parentItem) && !isNullOrUndefined(menuElement)) {
                args.cancel = false;
            }
            else {
                args.cancel = true;
            }
        }
        if (!args.cancel) {
            var rowIndex = -1;
            if (args.gridRow) {
                rowIndex = parseInt(args.gridRow.getAttribute('aria-rowindex'), 0);
            }
            else if (args.chartRow) {
                rowIndex = parseInt(getValue('rowIndex', args.chartRow), 0);
            }
            if (this.parent.selectionModule && this.parent.allowSelection) {
                this.parent.selectionModule.selectRow(rowIndex);
            }
            if (!args.parentItem) {
                this.rowData = this.parent.currentViewData[rowIndex];
            }
            for (var _i = 0, _a = args.items; _i < _a.length; _i++) {
                var item = _a[_i];
                var target = args.event.target;
                if (!item.separator) {
                    this.updateItemStatus(item, target);
                }
            }
            args.rowData = this.rowData;
            args.type = 'Content';
            args.disableItems = this.disableItems;
            args.hideItems = this.hideItems;
            if (args.rowData.level === 0 && this.parent.viewType === 'ResourceView') {
                args.cancel = true;
                return;
            }
            var callBackPromise_1 = new Deferred();
            this.parent.trigger('contextMenuOpen', args, function (args) {
                callBackPromise_1.resolve(args);
                if (isBlazor()) {
                    args.element = !isNullOrUndefined(args.element) ? getElement(args.element) : args.element;
                    args.gridRow = !isNullOrUndefined(args.gridRow) ? getElement(args.gridRow) : args.gridRow;
                    args.chartRow = !isNullOrUndefined(args.chartRow) ? getElement(args.chartRow) : args.chartRow;
                }
                _this.hideItems = args.hideItems;
                _this.disableItems = args.disableItems;
                if (!args.parentItem && args.hideItems.length === args.items.length) {
                    _this.revertItemStatus();
                    args.cancel = true;
                }
                if (_this.hideItems.length > 0) {
                    _this.contextMenu.hideItems(_this.hideItems);
                }
                if (_this.disableItems.length > 0) {
                    _this.contextMenu.enableItems(_this.disableItems, false);
                }
            });
            return callBackPromise_1;
        }
    };
    ContextMenu.prototype.updateItemStatus = function (item, target) {
        var key = this.getKeyFromId(item.id);
        var editForm = closest(target, cons.editForm);
        if (editForm) {
            if (!(key === 'Save' || key === 'Cancel')) {
                this.hideItems.push(item.text);
            }
        }
        else {
            switch (key) {
                case 'TaskInformation':
                    if (!this.parent.editSettings.allowEditing || !this.parent.editModule) {
                        this.updateItemVisibility(item.text);
                    }
                    break;
                case 'Add':
                    if (!this.parent.editSettings.allowAdding || !this.parent.editModule) {
                        this.updateItemVisibility(item.text);
                    }
                    break;
                case 'Save':
                case 'Cancel':
                    this.hideItems.push(item.text);
                    break;
                case 'Convert':
                    if (this.rowData.hasChildRecords) {
                        this.hideItems.push(item.text);
                    }
                    else if (!this.parent.editSettings.allowEditing || !this.parent.editModule) {
                        this.updateItemVisibility(item.text);
                    }
                    else {
                        var subMenu_1 = [];
                        if (!this.rowData.ganttProperties.isMilestone) {
                            subMenu_1.push(this.createItemModel(cons.content, 'ToMilestone', this.getLocale('toMilestone')));
                        }
                        else {
                            subMenu_1.push(this.createItemModel(cons.content, 'ToTask', this.getLocale('toTask')));
                        }
                        item.items = subMenu_1;
                    }
                    break;
                case 'DeleteDependency':
                    var items = this.getPredecessorsItems();
                    if (this.rowData.hasChildRecords) {
                        this.hideItems.push(item.text);
                    }
                    else if (!this.parent.editSettings.allowDeleting || items.length === 0 || !this.parent.editModule) {
                        this.updateItemVisibility(item.text);
                    }
                    else if (items.length > 0) {
                        item.items = items;
                    }
                    break;
                case 'DeleteTask':
                    if (!this.parent.editSettings.allowDeleting || !this.parent.editModule) {
                        this.updateItemVisibility(item.text);
                    }
                    break;
                case 'TaskMode':
                    var subMenu = [];
                    if (this.parent.taskMode !== 'Custom') {
                        this.updateItemVisibility(item.text);
                    }
                    else {
                        if (this.rowData.ganttProperties.isAutoSchedule) {
                            subMenu.push(this.createItemModel(cons.content, 'Manual', this.getLocale('manual')));
                        }
                        else {
                            subMenu.push(this.createItemModel(cons.content, 'Auto', this.getLocale('auto')));
                        }
                        item.items = subMenu;
                    }
                    break;
                case 'Indent':
                    var index = this.parent.selectedRowIndex;
                    var isSelected = this.parent.selectionModule ? this.parent.selectionModule.selectedRowIndexes.length === 1 ||
                        this.parent.selectionModule.getSelectedRowCellIndexes().length === 1 ? true : false : false;
                    var prevRecord = this.parent.currentViewData[this.parent.selectionModule.getSelectedRowIndexes()[0] - 1];
                    if (!this.parent.editSettings.allowEditing || index === 0 || index === -1 || !isSelected ||
                        this.parent.viewType === 'ResourceView' || this.parent.currentViewData[index].level - prevRecord.level === 1) {
                        this.hideItems.push(item.text);
                    }
                    break;
                case 'Outdent':
                    var ind = this.parent.selectionModule.getSelectedRowIndexes()[0];
                    var isSelect = this.parent.selectionModule ? this.parent.selectionModule.selectedRowIndexes.length === 1 ||
                        this.parent.selectionModule.getSelectedRowCellIndexes().length === 1 ? true : false : false;
                    if (!this.parent.editSettings.allowEditing || ind === -1 || ind === 0 || !isSelect ||
                        this.parent.viewType === 'ResourceView' || this.parent.currentViewData[ind].level === 0) {
                        this.hideItems.push(item.text);
                    }
                    break;
            }
        }
    };
    ContextMenu.prototype.updateItemVisibility = function (text) {
        var isDefaultItem = !isNullOrUndefined(this.parent.contextMenuItems) ? false : true;
        if (isDefaultItem) {
            this.hideItems.push(text);
        }
        else {
            this.disableItems.push(text);
        }
    };
    ContextMenu.prototype.contextMenuOpen = function () {
        this.isOpen = true;
    };
    ContextMenu.prototype.getMenuItems = function () {
        var menuItems = !isNullOrUndefined(this.parent.contextMenuItems) ?
            this.parent.contextMenuItems : this.getDefaultItems();
        for (var _i = 0, menuItems_1 = menuItems; _i < menuItems_1.length; _i++) {
            var item = menuItems_1[_i];
            if (typeof item === 'string' && this.getDefaultItems().indexOf(item) !== -1) {
                this.buildDefaultItems(item);
            }
            else if (typeof item !== 'string') {
                if (this.getDefaultItems().indexOf(item.text) !== -1) {
                    this.buildDefaultItems(item.text, item.iconCss);
                }
                else if (item.target === cons.columnHeader) {
                    this.headerMenuItems.push(item);
                }
                else {
                    this.contentMenuItems.push(item);
                }
            }
        }
        return this.contentMenuItems;
    };
    ContextMenu.prototype.createItemModel = function (target, item, text, iconCss) {
        var itemModel = {
            text: text,
            id: this.generateID(item),
            target: target,
            iconCss: iconCss ? 'e-icons ' + iconCss : ''
        };
        return itemModel;
    };
    ContextMenu.prototype.getLocale = function (text) {
        var localeText = this.parent.localeObj.getConstant(text);
        return localeText;
    };
    ContextMenu.prototype.buildDefaultItems = function (item, iconCSS) {
        var contentMenuItem;
        switch (item) {
            case 'AutoFitAll':
            case 'AutoFit':
            case 'SortAscending':
            case 'SortDescending':
                this.headerMenuItems.push(item);
                break;
            case 'TaskInformation':
                contentMenuItem = this.createItemModel(cons.content, item, this.getLocale('taskInformation'), this.getIconCSS(cons.editIcon, iconCSS));
                break;
            case 'Indent':
                contentMenuItem = this.createItemModel(cons.content, item, this.getLocale('indent'), this.getIconCSS(cons.indentIcon, iconCSS));
                break;
            case 'Outdent':
                contentMenuItem = this.createItemModel(cons.content, item, this.getLocale('outdent'), this.getIconCSS(cons.outdentIcon, iconCSS));
                break;
            case 'Save':
                contentMenuItem = this.createItemModel(cons.editIcon, item, this.getLocale('save'), this.getIconCSS(cons.saveIcon, iconCSS));
                break;
            case 'Cancel':
                contentMenuItem = this.createItemModel(cons.editIcon, item, this.getLocale('cancel'), this.getIconCSS(cons.cancelIcon, iconCSS));
                break;
            case 'Add':
                contentMenuItem = this.createItemModel(cons.content, item, this.getLocale('add'), this.getIconCSS(cons.addIcon, iconCSS));
                //Sub item menu
                contentMenuItem.items = [];
                contentMenuItem.items.push(this.createItemModel(cons.content, 'Above', this.getLocale('above'), this.getIconCSS(cons.addAboveIcon, iconCSS)));
                contentMenuItem.items.push(this.createItemModel(cons.content, 'Below', this.getLocale('below'), this.getIconCSS(cons.addBelowIcon, iconCSS)));
                if (this.parent.viewType !== 'ResourceView') {
                    contentMenuItem.items.push(this.createItemModel(cons.content, 'Child', this.getLocale('child')));
                }
                contentMenuItem.items.push(this.createItemModel(cons.content, 'Milestone', this.getLocale('milestone')));
                break;
            case 'DeleteTask':
                contentMenuItem = this.createItemModel(cons.content, item, this.getLocale('deleteTask'), this.getIconCSS(cons.deleteIcon, iconCSS));
                break;
            case 'DeleteDependency':
                contentMenuItem = this.createItemModel(cons.content, item, this.getLocale('deleteDependency'));
                contentMenuItem.items = [];
                contentMenuItem.items.push({});
                break;
            case 'Convert':
                contentMenuItem = this.createItemModel(cons.content, item, this.getLocale('convert'));
                contentMenuItem.items = [];
                contentMenuItem.items.push({});
                break;
            case 'TaskMode':
                contentMenuItem = this.createItemModel(cons.content, item, this.getLocale('changeScheduleMode'));
                contentMenuItem.items = [];
                contentMenuItem.items.push({});
                break;
        }
        if (contentMenuItem) {
            this.contentMenuItems.push(contentMenuItem);
        }
    };
    ContextMenu.prototype.getIconCSS = function (menuClass, iconString) {
        return isNullOrUndefined(iconString) ? menuClass : iconString;
    };
    ContextMenu.prototype.getPredecessorsItems = function () {
        this.predecessors = this.parent.predecessorModule.getValidPredecessor(this.rowData);
        var items = [];
        var itemModel;
        var increment = 0;
        for (var _i = 0, _a = this.predecessors; _i < _a.length; _i++) {
            var predecessor = _a[_i];
            var ganttData = this.parent.getRecordByID(predecessor.from);
            var ganttProp = ganttData.ganttProperties;
            var text = ganttProp.rowUniqueID + ' - ' + ganttProp.taskName;
            var id = 'Dependency' + increment++;
            itemModel = this.createItemModel(cons.content, id, text);
            items.push(itemModel);
        }
        return items;
    };
    ContextMenu.prototype.getDefaultItems = function () {
        return ['AutoFitAll', 'AutoFit',
            'TaskInformation', 'DeleteTask', 'Save', 'Cancel',
            'SortAscending', 'SortDescending', 'Add',
            'DeleteDependency', 'Convert', 'TaskMode', 'Indent', 'Outdent'
        ];
    };
    /**
     * To get ContextMenu module name.
     */
    ContextMenu.prototype.getModuleName = function () {
        return 'contextMenu';
    };
    ContextMenu.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('initiate-contextMenu', this.render);
        this.parent.off('reRender-contextMenu', this.reRenderContextMenu);
        this.parent.off('contextMenuClick', this.contextMenuItemClick);
        this.parent.off('contextMenuOpen', this.contextMenuOpen);
    };
    ContextMenu.prototype.contextMenuOnClose = function (args) {
        var parent = 'parentObj';
        if (args.items.length > 0 && args.items[0][parent] instanceof Menu) {
            this.revertItemStatus();
        }
    };
    ContextMenu.prototype.revertItemStatus = function () {
        if (isBlazor() && isNullOrUndefined(this.disableItems)) {
            this.disableItems = [];
        }
        this.contextMenu.showItems(this.hideItems);
        this.contextMenu.enableItems(this.disableItems);
        this.hideItems = [];
        this.disableItems = [];
        this.isOpen = false;
    };
    ContextMenu.prototype.resetItems = function () {
        this.hideItems = [];
        this.disableItems = [];
        this.headerMenuItems = [];
        this.contentMenuItems = [];
        this.item = null;
    };
    ContextMenu.prototype.generateID = function (item) {
        return this.ganttID + '_contextMenu_' + item;
    };
    ContextMenu.prototype.getKeyFromId = function (id) {
        var idPrefix = this.ganttID + '_contextMenu_';
        if (id.indexOf(idPrefix) > -1) {
            return id.replace(idPrefix, '');
        }
        else {
            return 'Custom';
        }
    };
    /**
     * To destroy the contextmenu module.
     * @return {void}
     * @private
     */
    ContextMenu.prototype.destroy = function () {
        this.contextMenu.destroy();
        remove(this.element);
        this.removeEventListener();
        this.contextMenu = null;
        this.element = null;
    };
    return ContextMenu;
}());
export { ContextMenu };
