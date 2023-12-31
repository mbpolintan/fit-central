import { Tab } from '@syncfusion/ej2-navigations';
import { refreshSheetTabs, locale, insertSheetTab, cMenuBeforeOpen, dialog, renameSheet, hideSheet, beginAction } from '../common/index';
import { sheetNameUpdate, clearUndoRedoCollection, completeAction, showAggregate } from '../common/index';
import { sheetTabs, renameSheetTab, removeSheetTab, activeSheetChanged, onVerticalScroll, onHorizontalScroll } from '../common/index';
import { protectSheet } from '../common/index';
import { getSheetName, aggregateComputation } from '../../workbook/index';
import { isSingleCell, getRangeIndexes, getSheet, getSheetIndex } from '../../workbook/index';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';
import { isCollide, calculatePosition } from '@syncfusion/ej2-popups';
import { rippleEffect, closest, EventHandler, remove, isNullOrUndefined } from '@syncfusion/ej2-base';
import { sheetsDestroyed, activeCellChanged, workbookFormulaOperation } from '../../workbook/common/index';
import { insertModel } from './../../workbook/common/index';
/**
 * Represents SheetTabs for Spreadsheet.
 */
var SheetTabs = /** @class */ (function () {
    function SheetTabs(parent) {
        this.aggregateContent = '';
        this.isSelectCancel = false;
        this.selaggregateCnt = 'Sum';
        this.parent = parent;
        this.addEventListener();
    }
    SheetTabs.prototype.getModuleName = function () {
        return 'sheetTabs';
    };
    SheetTabs.prototype.createSheetTabs = function () {
        var _this = this;
        if (!this.parent.showSheetTabs && this.tabInstance) {
            this.destroy();
            return;
        }
        var l10n = this.parent.serviceLocator.getService(locale);
        var panel = this.parent.createElement('div', {
            className: 'e-sheet-tab-panel', id: this.parent.element.id + '_sheet_tab_panel'
        });
        var addBtn = this.parent.createElement('button', {
            className: 'e-add-sheet-tab e-btn e-css e-flat e-icon-btn' + (this.parent.allowInsert ? '' : ' e-disabled'),
            attrs: { 'title': l10n.getConstant('AddSheet') }
        });
        addBtn.appendChild(this.parent.createElement('span', { className: 'e-btn-icon e-icons e-add-icon' }));
        addBtn.addEventListener('click', this.addSheetTab.bind(this));
        addBtn.disabled = !this.parent.allowInsert;
        panel.appendChild(addBtn);
        if (this.parent.allowInsert) {
            this.addBtnRipple = rippleEffect(panel, { selector: '.e-add-sheet-tab' });
        }
        var ddb = this.parent.createElement('button', { attrs: { 'title': l10n.getConstant('ListAllSheets') } });
        panel.appendChild(ddb);
        this.parent.element.appendChild(panel);
        var items = this.getSheetTabItems();
        this.dropDownInstance = new DropDownButton({
            iconCss: 'e-icons',
            items: items.ddbItems,
            beforeItemRender: function (args) {
                var sheet = _this.parent.sheets[_this.dropDownInstance.items.indexOf(args.item)];
                if (sheet.state === 'Hidden') {
                    args.element.classList.add('e-hide');
                }
                else if (sheet.state === 'VeryHidden') {
                    args.element.style.display = 'none';
                }
            },
            select: function (args) { return _this.updateSheetTab({ idx: _this.dropDownInstance.items.indexOf(args.item) }); },
            beforeOpen: function (args) { return _this.beforeOpenHandler(_this.dropDownInstance, args.element); },
            open: function (args) { return _this.openHandler(_this.dropDownInstance, args.element, 'left'); },
            cssClass: 'e-sheets-list e-flat e-caret-hide',
            close: function () { return _this.parent.element.focus(); }
        });
        this.dropDownInstance.createElement = this.parent.createElement;
        this.dropDownInstance.appendTo(ddb);
        var sheetTab = this.parent.createElement('div', { className: 'e-sheet-tab' });
        this.tabInstance = new Tab({
            selectedItem: this.parent.activeSheetIndex,
            overflowMode: 'Scrollable',
            items: items.tabItems,
            scrollStep: 250,
            selecting: function (args) {
                var beginEventArgs = {
                    currentSheetIndex: args.selectingIndex, previousSheetIndex: args.selectedIndex, cancel: false
                };
                if (!_this.isSelectCancel) {
                    _this.parent.notify(beginAction, { eventArgs: beginEventArgs, action: 'gotoSheet' });
                }
                _this.isSelectCancel = beginEventArgs.cancel;
            },
            selected: function (args) {
                if (args.selectedIndex === args.previousIndex) {
                    return;
                }
                if (_this.isSelectCancel) {
                    _this.tabInstance.selectedItem = args.previousIndex;
                    _this.tabInstance.dataBind();
                    _this.parent.element.focus();
                }
                else {
                    _this.parent.activeSheetIndex = args.selectedIndex;
                    _this.parent.dataBind();
                    _this.updateDropDownItems(args.selectedIndex, args.previousIndex);
                    _this.parent.element.focus();
                    var completeEventArgs = {
                        previousSheetIndex: args.previousIndex, currentSheetIndex: args.selectedIndex
                    };
                    _this.parent.notify(completeAction, { eventArgs: completeEventArgs, action: 'gotoSheet' });
                }
            },
            created: function () {
                var tBarItems = _this.tabInstance.element.querySelector('.e-toolbar-items');
                tBarItems.classList.add('e-sheet-tabs-items');
                EventHandler.add(tBarItems, 'dblclick', _this.renameSheetTab, _this);
            },
        });
        panel.appendChild(sheetTab);
        this.tabInstance.createElement = this.parent.createElement;
        this.tabInstance.appendTo(sheetTab);
        // tslint:disable-next-line:no-any
        EventHandler.remove(this.tabInstance.element, 'keydown', this.tabInstance.spaceKeyDown);
        var sheetCount = items.tabItems.length;
        for (var i = 0; i < sheetCount; i++) {
            var sheetName = getSheetName(this.parent, i);
            var arg = { action: 'addSheet', sheetName: 'Sheet' + (i + 1), index: i + 1, visibleName: sheetName };
            this.parent.notify(workbookFormulaOperation, arg);
        }
        this.parent.notify(workbookFormulaOperation, { action: 'initiateDefinedNames' });
        this.parent.notify(protectSheet, null);
    };
    SheetTabs.prototype.updateDropDownItems = function (curIdx, prevIdx) {
        if (prevIdx > -1) {
            this.dropDownInstance.items[prevIdx].iconCss = '';
        }
        this.dropDownInstance.items[curIdx].iconCss = 'e-selected-icon e-icons';
        this.dropDownInstance.setProperties({ 'items': this.dropDownInstance.items }, true);
    };
    SheetTabs.prototype.beforeOpenHandler = function (instance, element) {
        var viewportHeight = this.parent.viewport.height;
        var actualHeight = (parseInt(getComputedStyle(element.firstElementChild).height, 10) *
            instance.items.length) + (parseInt(getComputedStyle(element).paddingTop, 10) * 2);
        if (actualHeight > viewportHeight) {
            element.style.height = viewportHeight + "px";
            element.style.overflowY = 'auto';
        }
        element.parentElement.style.visibility = 'hidden';
    };
    SheetTabs.prototype.openHandler = function (instance, element, positionX) {
        var wrapper = element.parentElement;
        var height;
        var collide = isCollide(wrapper);
        if (collide.indexOf('bottom') === -1) {
            height = element.style.overflowY === 'auto' ? this.parent.viewport.height : wrapper.getBoundingClientRect().height;
            var offset = calculatePosition(instance.element, positionX, 'top');
            if (positionX === 'right') {
                offset.left -= wrapper.getBoundingClientRect().width;
            }
            wrapper.style.left = offset.left + "px";
            wrapper.style.top = offset.top - height + "px";
        }
        wrapper.style.visibility = '';
    };
    SheetTabs.prototype.getSheetTabItems = function () {
        var _this = this;
        var tabItems = [];
        var ddbItems = [];
        var sheetName;
        this.parent.sheets.forEach(function (sheet, index) {
            sheetName = getSheetName(_this.parent, index);
            tabItems.push({ header: { 'text': sheetName }, cssClass: sheet.state === 'Visible' ? '' : 'e-hide' });
            ddbItems.push({ text: sheetName, iconCss: index === _this.parent.activeSheetIndex ? 'e-selected-icon e-icons' : '' });
        });
        return { tabItems: tabItems, ddbItems: ddbItems };
    };
    SheetTabs.prototype.refreshSheetTab = function () {
        var items = this.getSheetTabItems();
        this.dropDownInstance.items = items.ddbItems;
        this.dropDownInstance.setProperties({ 'items': this.dropDownInstance.items }, true);
        this.tabInstance.items = items.tabItems;
        this.tabInstance.selectedItem = this.parent.activeSheetIndex;
        this.tabInstance.dataBind();
    };
    SheetTabs.prototype.addSheetTab = function () {
        this.parent.notify(insertModel, { model: this.parent, start: this.parent.activeSheetIndex + 1, end: this.parent.activeSheetIndex + 1, modelType: 'Sheet', isAction: true, activeSheetIndex: this.parent.activeSheetIndex + 1 });
        this.parent.element.focus();
    };
    SheetTabs.prototype.insertSheetTab = function (args) {
        this.dropDownInstance.items[this.tabInstance.selectedItem].iconCss = '';
        for (var i = args.startIdx; i <= args.endIdx; i++) {
            var sheetName = this.parent.sheets[i].name;
            this.dropDownInstance.items.splice(i, 0, { text: sheetName });
            this.tabInstance.addTab([{ header: { text: sheetName }, content: '' }], i);
        }
        this.dropDownInstance.items[args.startIdx].iconCss = 'e-selected-icon e-icons';
        this.dropDownInstance.setProperties({ 'items': this.dropDownInstance.items }, true);
        this.updateSheetTab({ idx: args.startIdx });
    };
    SheetTabs.prototype.updateSheetTab = function (args) {
        if (args.name === 'activeSheetChanged') {
            args.idx = this.parent.skipHiddenSheets(args.idx);
        }
        else {
            if (this.parent.sheets[args.idx].state === 'Hidden') {
                this.parent.sheets[args.idx].state = 'Visible';
                this.tabInstance.items[args.idx].cssClass = '';
                this.tabInstance.items = this.tabInstance.items;
                this.tabInstance.dataBind();
            }
        }
        this.tabInstance.selectedItem = args.idx;
        this.tabInstance.dataBind();
        this.parent.notify(protectSheet, null);
    };
    SheetTabs.prototype.switchSheetTab = function (args) {
        var target = closest(args.event.target, '.e-toolbar-item');
        if (!target) {
            return;
        }
        var text = target.querySelector('.e-tab-text').textContent;
        for (var i = 0, len = this.tabInstance.items.length; i < len; i++) {
            if (this.tabInstance.items[i].header.text === text) {
                if (this.parent.activeSheetIndex !== i) {
                    this.updateSheetTab({ idx: i });
                }
                break;
            }
        }
        if (args.element.classList.contains('e-contextmenu') && args.items[0] &&
            args.items[0].id === this.parent.element.id + "_cmenu_insert_sheet") {
            if (this.skipHiddenSheets() === 1) {
                //let id: string = `${this.parent.element.id}_cmenu`;
                //this.parent.enableFileMenuItems([`${id}_hide_sheet`, `${id}_delete_sheet`], false, true);
                args.element.children[1].classList.add('e-disabled');
                args.element.children[3].classList.add('e-disabled');
            }
            if (!this.parent.allowInsert) {
                args.element.children[0].classList.add('e-disabled');
            }
        }
    };
    SheetTabs.prototype.skipHiddenSheets = function () {
        var count = this.parent.sheets.length;
        this.parent.sheets.forEach(function (sheet) {
            if (sheet.state !== 'Visible') {
                --count;
            }
        });
        return count;
    };
    SheetTabs.prototype.renameSheetTab = function () {
        var target = this.tabInstance.element.querySelector('.e-toolbar-item.e-active');
        if (target) {
            target = target.querySelector('.e-text-wrap');
            var value = target.querySelector('.e-tab-text').textContent;
            var input = this.parent.createElement('input', {
                id: this.parent.element.id + '_rename_input',
                className: 'e-input e-sheet-rename', styles: "width: " + target.getBoundingClientRect().width + "px", attrs: {
                    'type': 'text', 'name': 'Rename', 'required': '', 'value': value, 'spellcheck': 'false', 'maxlength': '31'
                }
            });
            target.firstElementChild.style.display = 'none';
            target.appendChild(input);
            EventHandler.add(document, 'mousedown touchstart', this.renameInputFocusOut, this);
            EventHandler.add(input, 'input', this.updateWidth, this);
            input.focus();
            input.setSelectionRange(0, value.length);
            EventHandler.remove(closest(target, '.e-toolbar-items'), 'dblclick', this.renameSheetTab);
        }
    };
    SheetTabs.prototype.updateWidth = function (e) {
        var target = e.target;
        var len = target.value.length;
        var value = target.value.split(' ');
        if (value.length) {
            var spaceLen = value.length - 1;
            len -= spaceLen;
            len += (spaceLen * 0.5);
        }
        target.style.width = len + "ch";
    };
    SheetTabs.prototype.renameInputFocusOut = function (e) {
        var target = e.target;
        if ((e.type === 'mousedown' || e.type === 'touchstart') && (target.classList.contains('e-sheet-rename') ||
            closest(target, '.e-dlg-container'))) {
            return;
        }
        target = document.getElementById(this.parent.element.id + '_rename_input');
        if (e.type === 'keydown' && e.keyCode === 27) {
            this.removeRenameInput(target);
            this.parent.element.focus();
            return;
        }
        var value = target.value;
        var l10n = this.parent.serviceLocator.getService(locale);
        if (value) {
            var idx = this.tabInstance.selectedItem;
            if (!value.match(new RegExp('.*[\\[\\]\\*\\\\\/\\?].*'))) {
                if (this.tabInstance.items[idx].header.text !== value) {
                    for (var i = 0, len = this.parent.sheets.length; i < len; i++) {
                        if (i !== this.parent.activeSheetIndex && this.parent.sheets[i].name.toLowerCase() === value.toLowerCase()) {
                            this.showRenameDialog(target, l10n.getConstant('SheetRenameAlreadyExistsAlert'));
                            return;
                        }
                    }
                }
                var items = this.removeRenameInput(target);
                if (this.tabInstance.items[idx].header.text !== value) {
                    this.parent.sheets[idx].name = value;
                    this.updateSheetName({ value: value, idx: idx, items: items });
                }
                if (e.type === 'keydown' || (closest(e.target, '.e-spreadsheet'))) {
                    this.parent.element.focus();
                }
            }
            else {
                this.showRenameDialog(target, l10n.getConstant('SheetRenameInvalidAlert'));
            }
        }
        else {
            this.showRenameDialog(target, l10n.getConstant('SheetRenameEmptyAlert'));
        }
        var sheetIndex = this.parent.getActiveSheet().id;
        var args = { action: 'renameUpdation', value: value, sheetId: sheetIndex };
        this.parent.notify(workbookFormulaOperation, args);
        var eventArgs = {
            index: sheetIndex,
            value: value
        };
        this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'renameSheet' });
    };
    SheetTabs.prototype.updateSheetName = function (args) {
        this.tabInstance.items[args.idx].header.text = args.value;
        this.dropDownInstance.items[args.idx].text = args.value;
        this.dropDownInstance.setProperties({ 'items': this.dropDownInstance.items }, true);
        if (args.value.indexOf('  ') > -1) {
            this.tabInstance.setProperties({ 'items': this.tabInstance.items }, true);
            args.items.querySelector('.e-toolbar-item.e-active .e-tab-text').textContent = args.value;
        }
        else {
            this.tabInstance.items = this.tabInstance.items;
            this.tabInstance.dataBind();
        }
    };
    SheetTabs.prototype.hideSheet = function () {
        this.parent.getActiveSheet().state = 'Hidden';
        this.tabInstance.items[this.parent.activeSheetIndex].cssClass = 'e-hide';
        this.tabInstance.items = this.tabInstance.items;
        this.tabInstance.dataBind();
        this.tabInstance.selectedItem = this.parent.skipHiddenSheets(this.parent.activeSheetIndex === this.parent.sheets.length - 1 ? this.parent.activeSheetIndex - 1 :
            this.parent.activeSheetIndex + 1);
        this.tabInstance.dataBind();
    };
    SheetTabs.prototype.removeRenameInput = function (target) {
        var textEle = target.parentElement.querySelector('.e-tab-text');
        var sheetItems = closest(target, '.e-toolbar-items');
        EventHandler.add(sheetItems, 'dblclick', this.renameSheetTab, this);
        EventHandler.remove(document, 'mousedown touchstart', this.renameInputFocusOut);
        EventHandler.remove(target, 'input', this.updateWidth);
        remove(target);
        textEle.style.display = '';
        return sheetItems;
    };
    SheetTabs.prototype.showRenameDialog = function (target, content) {
        var _this = this;
        var dialogInst = this.parent.serviceLocator.getService(dialog);
        dialogInst.show({
            target: document.getElementById(this.parent.element.id + '_sheet_panel'),
            height: 180, width: 400, isModal: true, showCloseIcon: true,
            content: content,
            beforeOpen: function (args) {
                var dlgArgs = {
                    dialogName: 'SheetRenameDialog',
                    element: args.element, target: args.target, cancel: args.cancel
                };
                _this.parent.trigger('dialogBeforeOpen', dlgArgs);
                if (dlgArgs.cancel) {
                    args.cancel = true;
                }
                target.focus();
            },
            close: function () { return target.setSelectionRange(0, target.value.length); }
        });
    };
    SheetTabs.prototype.focusRenameInput = function () {
        var input = document.getElementById(this.parent.element.id + '_rename_input');
        if (input) {
            input.focus();
        }
    };
    SheetTabs.prototype.removeSheetTab = function (args) {
        var _this = this;
        if (args.count && (args.count === this.parent.sheets.length)) {
            return;
        }
        var l10n = this.parent.serviceLocator.getService(locale);
        if (this.skipHiddenSheets() > 1) {
            var sheet = args.sheetName ? getSheet(this.parent, getSheetIndex(this.parent, args.sheetName)) :
                this.parent.getActiveSheet();
            var sheetIndex_1 = args.index || getSheetIndex(this.parent, sheet.name);
            var eventArgs_1 = {
                index: sheetIndex_1,
                sheetCount: this.parent.sheets.length,
                sheetName: sheet.name
            };
            var isDataAvail = sheet.rows && sheet.rows.length ?
                (sheet.rows.length === 1 ? (sheet.rows[0].cells && sheet.rows[0].cells.length ? true : false) : true) : false;
            if (isDataAvail) {
                var dialogInst_1 = this.parent.serviceLocator.getService(dialog);
                if (args.clicked) {
                    this.forceDelete(sheetIndex_1);
                }
                else {
                    dialogInst_1.show({
                        height: 200, width: 400, isModal: true, showCloseIcon: true,
                        content: l10n.getConstant('DeleteSheetAlert'),
                        beforeOpen: function (args) {
                            var dlgArgs = {
                                dialogName: 'DeleteSheetDialog',
                                element: args.element, target: args.target, cancel: args.cancel
                            };
                            _this.parent.trigger('dialogBeforeOpen', dlgArgs);
                            if (dlgArgs.cancel) {
                                args.cancel = true;
                            }
                            _this.parent.element.focus();
                        },
                        buttons: [{
                                buttonModel: {
                                    content: l10n.getConstant('Ok'), isPrimary: true
                                },
                                click: function () {
                                    dialogInst_1.hide();
                                    _this.forceDelete(sheetIndex_1);
                                    _this.parent.notify(clearUndoRedoCollection, null);
                                    if (args && !args.isAction) {
                                        eventArgs_1.sheetCount = _this.parent.sheets.length;
                                        _this.parent.notify(completeAction, { eventArgs: eventArgs_1, action: 'removeSheet' });
                                    }
                                }
                            }]
                    });
                }
            }
            else {
                this.destroySheet(sheetIndex_1);
                var sheetArgs = {
                    action: 'deleteSheetTab', sheetName: '', index: sheetIndex_1
                };
                this.parent.notify(workbookFormulaOperation, sheetArgs);
                this.parent.notify(clearUndoRedoCollection, null);
                if (args && !args.isAction) {
                    eventArgs_1.sheetCount = this.parent.sheets.length;
                    this.parent.notify(completeAction, { eventArgs: eventArgs_1, action: 'removeSheet' });
                }
            }
        }
        else {
            this.parent.serviceLocator.getService(dialog).show({
                target: document.getElementById(this.parent.element.id + '_sheet_panel'),
                height: 180, width: 400, isModal: true, showCloseIcon: true,
                content: l10n.getConstant('DeleteSingleLastSheetAlert'),
                beforeOpen: function (args) {
                    var dlgArgs = {
                        dialogName: 'DeleteSingleSheetDialog',
                        element: args.element, target: args.target, cancel: args.cancel
                    };
                    _this.parent.trigger('dialogBeforeOpen', dlgArgs);
                    if (dlgArgs.cancel) {
                        args.cancel = true;
                    }
                    _this.parent.element.focus();
                },
            });
        }
    };
    SheetTabs.prototype.forceDelete = function (sheetIndex) {
        this.destroySheet(sheetIndex);
        var sheetArgs = {
            action: 'deleteSheetTab', sheetName: '', index: sheetIndex
        };
        this.parent.notify(workbookFormulaOperation, sheetArgs);
    };
    SheetTabs.prototype.destroySheet = function (sheetIndex) {
        var activeSheetIdx = sheetIndex || this.parent.activeSheetIndex;
        this.parent.removeSheet(activeSheetIdx);
        this.parent.notify(sheetsDestroyed, { sheetIndex: activeSheetIdx });
        this.dropDownInstance.items.splice(activeSheetIdx, 1);
        this.dropDownInstance.setProperties({ 'items': this.dropDownInstance.items }, true);
        this.tabInstance.removeTab(activeSheetIdx);
        var activeIndex = this.parent.skipHiddenSheets(this.tabInstance.selectedItem);
        this.parent.activeSheetIndex = activeIndex;
        this.parent.setProperties({ activeSheetIndex: activeIndex }, true);
        this.parent.renderModule.refreshSheet();
        this.tabInstance.selectedItem = activeIndex;
        this.tabInstance.dataBind();
        this.updateDropDownItems(activeIndex);
        this.parent.notify(protectSheet, null);
        this.parent.element.focus();
    };
    SheetTabs.prototype.showAggregate = function () {
        var _this = this;
        if (isSingleCell(getRangeIndexes(this.parent.getActiveSheet().selectedRange))) {
            return;
        }
        var eventArgs = { Count: 0, Sum: '0', Avg: '0', Min: '0', Max: '0', countOnly: true };
        this.parent.notify(aggregateComputation, eventArgs);
        if (eventArgs.Count > 1) {
            this.aggregateContent = eventArgs.countOnly ? 'Count' : this.selaggregateCnt;
            if (eventArgs.countOnly) {
                this.aggregateContent = 'Count';
                delete eventArgs.Sum;
                delete eventArgs.Avg;
                delete eventArgs.Min;
                delete eventArgs.Max;
            }
            var btnClass = eventArgs.countOnly ? 'e-aggregate-list e-flat e-aggregate-list-countonly e-caret-hide'
                : 'e-aggregate-list e-flat';
            delete eventArgs.countOnly;
            var key = this.aggregateContent;
            var content = key + ": " + eventArgs[key];
            if (!this.aggregateDropDown) {
                var aggregateEle = this.parent.createElement('button');
                document.getElementById(this.parent.element.id + "_sheet_tab_panel").appendChild(aggregateEle);
                this.aggregateDropDown = new DropDownButton({
                    content: content,
                    items: this.getAggregateItems(eventArgs),
                    select: function (args) { return _this.updateAggregateContent(args.item.text, eventArgs, true); },
                    beforeOpen: function (args) {
                        return _this.beforeOpenHandler(_this.aggregateDropDown, args.element);
                    },
                    open: function (args) { return _this.openHandler(_this.aggregateDropDown, args.element, 'right'); },
                    close: function () { return _this.parent.element.focus(); },
                    cssClass: btnClass
                });
                this.aggregateDropDown.createElement = this.parent.createElement;
                this.aggregateDropDown.appendTo(aggregateEle);
            }
            else {
                this.updateAggregateContent(content, eventArgs);
            }
        }
        else {
            this.removeAggregate();
        }
    };
    SheetTabs.prototype.getAggregateItems = function (args) {
        var _this = this;
        var items = [];
        var text;
        var iconCss;
        Object.keys(args).forEach(function (key) {
            if (args[key] !== aggregateComputation) {
                text = key + ": " + args[key];
                iconCss = key === _this.aggregateContent ? 'e-selected-icon e-icons' : '';
                items.push({ text: text, iconCss: iconCss });
            }
        });
        return items;
    };
    SheetTabs.prototype.updateAggregateContent = function (text, eventArgs, isSelect) {
        this.aggregateContent = text.split(': ')[0];
        if (isSelect) {
            this.selaggregateCnt = text.split(': ')[0];
        }
        this.aggregateDropDown.content = text;
        this.aggregateDropDown.dataBind();
        this.aggregateDropDown.setProperties({ 'items': this.getAggregateItems(eventArgs) }, true);
    };
    SheetTabs.prototype.removeAggregate = function () {
        if (!isNullOrUndefined(this.aggregateDropDown)) {
            this.aggregateDropDown.destroy();
            remove(this.aggregateDropDown.element);
            this.aggregateDropDown = null;
        }
    };
    SheetTabs.prototype.addEventListener = function () {
        this.parent.on(sheetTabs, this.createSheetTabs, this);
        this.parent.on(refreshSheetTabs, this.refreshSheetTab, this);
        this.parent.on(insertSheetTab, this.insertSheetTab, this);
        this.parent.on(removeSheetTab, this.removeSheetTab, this);
        this.parent.on(renameSheetTab, this.renameSheetTab, this);
        this.parent.on(cMenuBeforeOpen, this.switchSheetTab, this);
        this.parent.on(activeSheetChanged, this.updateSheetTab, this);
        this.parent.on(renameSheet, this.renameInputFocusOut, this);
        this.parent.on(activeCellChanged, this.removeAggregate, this);
        this.parent.on(onVerticalScroll, this.focusRenameInput, this);
        this.parent.on(onHorizontalScroll, this.focusRenameInput, this);
        this.parent.on(sheetNameUpdate, this.updateSheetName, this);
        this.parent.on(hideSheet, this.hideSheet, this);
        this.parent.on(showAggregate, this.showAggregate, this);
    };
    SheetTabs.prototype.destroy = function () {
        this.removeEventListener();
        this.dropDownInstance.destroy();
        this.dropDownInstance = null;
        this.tabInstance.destroy();
        this.tabInstance = null;
        this.aggregateDropDown = null;
        this.aggregateContent = null;
        this.addBtnRipple();
        this.addBtnRipple = null;
        EventHandler.remove(document, 'mousedown touchstart', this.renameInputFocusOut);
        var ele = document.getElementById(this.parent.element.id + '_sheet_tab_panel');
        if (ele) {
            remove(ele);
        }
        this.parent = null;
    };
    SheetTabs.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(sheetTabs, this.createSheetTabs);
            this.parent.off(refreshSheetTabs, this.refreshSheetTab);
            this.parent.off(insertSheetTab, this.insertSheetTab);
            this.parent.off(removeSheetTab, this.removeSheetTab);
            this.parent.off(renameSheetTab, this.renameSheetTab);
            this.parent.off(cMenuBeforeOpen, this.switchSheetTab);
            this.parent.off(activeSheetChanged, this.updateSheetTab);
            this.parent.off(renameSheet, this.renameInputFocusOut);
            this.parent.off(activeCellChanged, this.removeAggregate);
            this.parent.off(onVerticalScroll, this.focusRenameInput);
            this.parent.off(onHorizontalScroll, this.focusRenameInput);
            this.parent.off(sheetNameUpdate, this.updateSheetName);
            this.parent.off(hideSheet, this.hideSheet);
            this.parent.off(showAggregate, this.showAggregate);
        }
    };
    return SheetTabs;
}());
export { SheetTabs };
