import { EventHandler, Browser, closest, isUndefined } from '@syncfusion/ej2-base';
import { getRangeIndexes, getRangeFromAddress, getIndexesFromAddress, getRangeAddress } from '../../workbook/common/address';
import { keyDown, editOperation, clearCopy, mouseDown, selectionComplete, enableToolbarItems, completeAction } from '../common/event';
import { formulaBarOperation, formulaOperation, setActionData, keyUp, getCellPosition } from '../common/index';
import { workbookEditOperation, getFormattedBarText, getFormattedCellObject, wrapEvent, isValidation } from '../../workbook/common/event';
import { getSheetName, getSheetIndex, getCell } from '../../workbook/base/index';
import { getSheetNameFromAddress, getSheet } from '../../workbook/base/index';
import { hasTemplate, editAlert } from '../common/index';
import { getSwapRange, getCellIndexes } from '../../workbook/index';
import { checkConditionalFormat } from '../common/event';
/**
 * The `Protect-Sheet` module is used to handle the Protecting functionalities in Spreadsheet.
 */
var Edit = /** @class */ (function () {
    /**
     * Constructor for protect-sheet module in Spreadsheet.
     * @private
     */
    function Edit(parent) {
        this.editorElem = null;
        this.editCellData = {};
        this.isEdit = false;
        this.isCellEdit = true;
        this.isNewValueEdit = true;
        this.keyCodes = {
            BACKSPACE: 8,
            SPACE: 32,
            TAB: 9,
            DELETE: 46,
            ESC: 27,
            ENTER: 13,
            FIRSTALPHABET: 65,
            LASTALPHABET: 90,
            FIRSTNUMBER: 48,
            LASTNUMBER: 59,
            FIRSTNUMPAD: 96,
            LASTNUMPAD: 111,
            SYMBOLSETONESTART: 186,
            SYMBOLSETONEEND: 192,
            SYMBOLSETTWOSTART: 219,
            SYMBOLSETTWOEND: 222,
            FIREFOXEQUALPLUS: 61,
            FIREFOXMINUS: 173,
            F2: 113
        };
        this.parent = parent;
        this.init();
        //Spreadsheet.Inject(WorkbookEdit);
    }
    Edit.prototype.init = function () {
        this.addEventListener();
    };
    /**
     * To destroy the edit module.
     * @return {void}
     * @hidden
     */
    Edit.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
        this.editorElem = null;
    };
    Edit.prototype.addEventListener = function () {
        EventHandler.add(this.parent.element, 'dblclick', this.dblClickHandler, this);
        this.parent.on(mouseDown, this.mouseDownHandler, this);
        this.parent.on(keyUp, this.keyUpHandler, this);
        this.parent.on(keyDown, this.keyDownHandler, this);
        this.parent.on(editOperation, this.performEditOperation, this);
    };
    Edit.prototype.removeEventListener = function () {
        EventHandler.remove(this.parent.element, 'dblclick', this.dblClickHandler);
        if (!this.parent.isDestroyed) {
            this.parent.off(mouseDown, this.mouseDownHandler);
            this.parent.off(keyUp, this.keyUpHandler);
            this.parent.off(keyDown, this.keyDownHandler);
            this.parent.off(editOperation, this.performEditOperation);
        }
    };
    /**
     * Get the module name.
     * @returns string
     * @private
     */
    Edit.prototype.getModuleName = function () {
        return 'edit';
    };
    Edit.prototype.performEditOperation = function (args) {
        var action = args.action;
        switch (action) {
            case 'renderEditor':
                this.renderEditor();
                break;
            case 'refreshEditor':
                this.refreshEditor(args.value, args.refreshFormulaBar, args.refreshEditorElem, args.isAppend, args.trigEvent);
                if (args.refreshCurPos) {
                    this.setCursorPosition();
                }
                break;
            case 'startEdit':
                if (!this.isEdit) {
                    this.isNewValueEdit = args.isNewValueEdit;
                    this.startEdit(args.address, args.value, args.refreshCurPos);
                }
                break;
            case 'endEdit':
                if (this.isEdit) {
                    this.endEdit(args.refreshFormulaBar);
                }
                break;
            case 'cancelEdit':
                if (this.isEdit) {
                    this.cancelEdit(args.refreshFormulaBar);
                }
                break;
            case 'getCurrentEditValue':
                args.editedValue = this.editCellData.value;
                break;
            case 'refreshDependentCellValue':
                this.refreshDependentCellValue(args.rowIdx, args.colIdx, args.sheetIdx);
                break;
            case 'getPosition':
                args.position = this.editorElem.getBoundingClientRect();
                break;
            case 'focusEditorElem':
                this.editorElem.focus();
                break;
        }
    };
    Edit.prototype.keyUpHandler = function (e) {
        if (this.isEdit) {
            if (this.isCellEdit && this.editCellData.value !== this.editorElem.textContent) {
                this.refreshEditor(this.editorElem.textContent, this.isCellEdit);
            }
        }
    };
    Edit.prototype.keyDownHandler = function (e) {
        var trgtElem = e.target;
        var keyCode = e.keyCode;
        var sheet = this.parent.getActiveSheet();
        var actCell = getCellIndexes(sheet.activeCell);
        var cell = getCell(actCell[0], actCell[1], sheet) || {};
        if (!closest(e.target, '.e-findtool-dlg') && !closest(e.target, '.e-validationerror-dlg')) {
            if (!sheet.isProtected || closest(e.target, '.e-sheet-rename') || (cell.isLocked === false)) {
                if (this.isEdit) {
                    if (this.isCellEdit) {
                        this.refreshEditor(this.editorElem.textContent, this.isCellEdit);
                    }
                    switch (keyCode) {
                        case this.keyCodes.ENTER:
                            if (Browser.isWindows) {
                                e.preventDefault();
                            }
                            this.endEdit(false, e);
                            break;
                        case this.keyCodes.TAB:
                            if (!this.hasFormulaSuggSelected()) {
                                this.endEdit(false, e);
                            }
                            break;
                        case this.keyCodes.ESC:
                            this.cancelEdit(true, true, e);
                            break;
                    }
                }
                else {
                    if (!this.isEdit && (trgtElem.classList.contains('e-spreadsheet') || closest(trgtElem, '.e-sheet-panel'))) {
                        var isAlphabet = (keyCode >= this.keyCodes.FIRSTALPHABET && keyCode <= this.keyCodes.LASTALPHABET);
                        var isNumeric = (keyCode >= this.keyCodes.FIRSTNUMBER && keyCode <= this.keyCodes.LASTNUMBER);
                        var isNumpadKeys = (keyCode >= this.keyCodes.FIRSTNUMPAD && keyCode <= this.keyCodes.LASTNUMPAD);
                        var isSymbolkeys = (keyCode >= this.keyCodes.SYMBOLSETONESTART &&
                            keyCode <= this.keyCodes.SYMBOLSETONEEND);
                        if (!isSymbolkeys) {
                            isSymbolkeys = (keyCode >= this.keyCodes.SYMBOLSETTWOSTART && keyCode <= this.keyCodes.SYMBOLSETTWOEND);
                        }
                        var isFirefoxExceptionkeys = (keyCode === this.keyCodes.FIREFOXEQUALPLUS) ||
                            (keyCode === this.keyCodes.FIREFOXMINUS);
                        var isF2Edit = (!e.shiftKey && !e.ctrlKey && keyCode === this.keyCodes.F2);
                        var isBackSpace = keyCode === this.keyCodes.BACKSPACE;
                        if ((!e.ctrlKey && !e.altKey && ((!e.shiftKey && keyCode === this.keyCodes.SPACE) || isAlphabet || isNumeric ||
                            isNumpadKeys || isSymbolkeys || (Browser.info.name === 'mozilla' && isFirefoxExceptionkeys))) || isF2Edit || isBackSpace) {
                            if (isF2Edit) {
                                this.isNewValueEdit = false;
                            }
                            this.startEdit();
                        }
                        if (keyCode === this.keyCodes.DELETE) {
                            this.editingHandler('delete');
                        }
                    }
                }
            }
            else {
                if (((keyCode >= this.keyCodes.FIRSTALPHABET && keyCode <= this.keyCodes.LASTALPHABET) ||
                    (keyCode >= this.keyCodes.FIRSTNUMBER && keyCode <= this.keyCodes.LASTNUMBER)
                    || (keyCode === this.keyCodes.DELETE) || (keyCode === this.keyCodes.BACKSPACE) || (keyCode === this.keyCodes.SPACE)
                    || (keyCode >= this.keyCodes.FIRSTNUMPAD && keyCode <= this.keyCodes.LASTNUMPAD) ||
                    (keyCode >= this.keyCodes.SYMBOLSETONESTART && keyCode <= this.keyCodes.SYMBOLSETONEEND)
                    || (keyCode >= 219 && keyCode <= 222) || (!e.shiftKey && !e.ctrlKey && keyCode === this.keyCodes.F2))
                    && (keyCode !== 67) && (keyCode !== 89) && (keyCode !== 90)) {
                    if (sheet.protectSettings.insertLink && keyCode === 75) {
                        return;
                    }
                    if (!this.parent.element.querySelector('.e-editAlert-dlg')) {
                        this.parent.notify(editAlert, null);
                    }
                }
            }
        }
    };
    Edit.prototype.renderEditor = function () {
        if (!this.editorElem || !this.parent.element.querySelector('#' + this.parent.element.id + '_edit')) {
            var editor = void 0;
            editor = this.parent.createElement('div', { id: this.parent.element.id + '_edit', className: 'e-spreadsheet-edit' });
            editor.contentEditable = 'true';
            editor.spellcheck = false;
            this.editorElem = editor;
            if (this.parent.element.getElementsByClassName('e-spreadsheet-edit')[0]) {
                this.parent.element.getElementsByClassName('e-spreadsheet-edit')[0].remove();
            }
            this.parent.element.querySelector('.e-sheet-content').appendChild(this.editorElem);
        }
        this.parent.notify(formulaOperation, { action: 'renderAutoComplete' });
    };
    Edit.prototype.refreshEditor = function (value, refreshFormulaBar, refreshEditorElem, isAppend, trigEvent) {
        if (trigEvent === void 0) { trigEvent = true; }
        if (isAppend) {
            value = this.editCellData.value = this.editCellData.value + value;
        }
        else {
            this.editCellData.value = value;
        }
        if (refreshEditorElem) {
            this.editorElem.textContent = value;
        }
        if (refreshFormulaBar) {
            this.parent.notify(formulaBarOperation, { action: 'refreshFormulabar', value: value });
        }
        if (trigEvent && this.editCellData.value === this.editorElem.textContent) {
            if (this.triggerEvent('cellEditing')) {
                this.cancelEdit();
            }
        }
        // if (this.editorElem.scrollHeight + 2 <= this.editCellData.element.offsetHeight) {
        //     this.editorElem.style.height = (this.editCellData.element.offsetHeight + 1) + 'px';
        // } else {
        //     this.editorElem.style.removeProperty('height');
        // }
    };
    Edit.prototype.startEdit = function (address, value, refreshCurPos) {
        if (refreshCurPos === void 0) { refreshCurPos = true; }
        var range = getRangeIndexes(this.parent.getActiveSheet().activeCell);
        if (hasTemplate(this.parent, range[0], range[1], this.parent.activeSheetIndex)) {
            return;
        }
        this.updateEditCellDetail(address, value);
        this.initiateEditor(refreshCurPos);
        this.positionEditor();
        this.parent.isEdit = this.isEdit = true;
        this.parent.notify(clearCopy, null);
        this.parent.notify(enableToolbarItems, [{ enable: false }]);
    };
    Edit.prototype.setCursorPosition = function () {
        var elem = this.editorElem;
        var textLen = elem.textContent.length;
        if (textLen) {
            var selection = document.getSelection();
            var range = document.createRange();
            range.setStart(elem.firstChild, textLen);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        elem.focus();
    };
    Edit.prototype.hasFormulaSuggSelected = function () {
        var suggDdlElem = document.getElementById(this.parent.element.id + '_ac_popup');
        return suggDdlElem && suggDdlElem.style.visibility === 'visible' &&
            suggDdlElem.querySelectorAll('.e-item-focus').length > 0;
    };
    Edit.prototype.editingHandler = function (action) {
        switch (action) {
            case 'delete':
                var address = this.parent.getActiveSheet().selectedRange;
                var range = getIndexesFromAddress(address);
                range = range[0] > range[2] ? getSwapRange(range) : range;
                address = getRangeAddress(range);
                this.parent.clearRange(address, null, true);
                this.parent.serviceLocator.getService('cell').refreshRange(range);
                this.parent.notify(selectionComplete, {});
                break;
        }
    };
    Edit.prototype.mouseDownHandler = function (e) {
        if (!closest(e.target, '.e-findtool-dlg')) {
            if (this.isEdit) {
                var trgtElem = e.target;
                this.isCellEdit = trgtElem.classList.contains('e-spreadsheet-edit');
                if (trgtElem.classList.contains('e-cell') || trgtElem.classList.contains('e-header-cell') ||
                    trgtElem.classList.contains('e-selectall') || closest(trgtElem, '.e-toolbar-item.e-active')) {
                    this.endEdit(false, e);
                }
            }
        }
    };
    Edit.prototype.dblClickHandler = function (e) {
        var trgtElem = e.target;
        var sheet = this.parent.getActiveSheet();
        var actCell = getCellIndexes(sheet.activeCell);
        var cell = getCell(actCell[0], actCell[1], sheet) || {};
        if (!sheet.isProtected || (cell.isLocked === false)) {
            if ((trgtElem.className.indexOf('e-ss-overlay') < 0) &&
                (trgtElem.classList.contains('e-active-cell') || trgtElem.classList.contains('e-cell')
                    || closest(trgtElem, '.e-sheet-content'))) {
                if (this.isEdit) {
                    this.endEdit();
                }
                else {
                    this.isNewValueEdit = false;
                    this.startEdit();
                }
            }
        }
        else {
            if (trgtElem.classList.contains('e-active-cell') || trgtElem.classList.contains('e-cell')) {
                this.parent.notify(editAlert, null);
            }
        }
    };
    Edit.prototype.updateEditCellDetail = function (addr, value) {
        var sheetIdx;
        var sheet;
        if (!this.editCellData.sheetIndex) {
            if (addr && addr.split('!').length > 1) {
                sheetIdx = getSheetIndex(this.parent, getSheetNameFromAddress(addr));
            }
            else {
                sheetIdx = this.parent.activeSheetIndex;
            }
        }
        if (!this.editCellData.addr) {
            sheet = getSheet(this.parent, sheetIdx);
            if (addr) {
                addr = getRangeFromAddress(addr);
            }
            else {
                addr = sheet.activeCell;
            }
        }
        var range = getRangeIndexes(addr);
        var rowIdx = range[0];
        var colIdx = range[1];
        var cellElem = this.parent.getCell(rowIdx, colIdx);
        var cellPosition = getCellPosition(sheet, range);
        this.editCellData = {
            addr: addr,
            fullAddr: getSheetName(this.parent, sheetIdx) + '!' + addr,
            rowIndex: rowIdx,
            colIndex: colIdx,
            sheetIndex: sheetIdx,
            element: cellElem,
            value: value || '',
            position: cellPosition
        };
    };
    Edit.prototype.initiateEditor = function (refreshCurPos) {
        var _this = this;
        var data = this.parent.getData(this.editCellData.fullAddr);
        data.then(function (values) {
            values.forEach(function (cell, key) {
                var args = { cell: cell, value: cell ? cell.value : '' };
                _this.parent.notify(getFormattedBarText, args);
                var value = cell ? args.value : '';
                if (cell && cell.formula) {
                    value = cell.formula;
                }
                _this.editCellData.oldValue = value;
                if (_this.editCellData.value) {
                    value = _this.editCellData.value;
                }
                else {
                    _this.editCellData.value = value;
                }
                if (_this.isNewValueEdit) {
                    value = '';
                }
                else {
                    _this.isNewValueEdit = true;
                }
                if (!isUndefined(value)) {
                    _this.refreshEditor(value, false, true, false, false);
                }
                if (refreshCurPos) {
                    _this.setCursorPosition();
                }
                if (_this.triggerEvent('cellEdit')) {
                    _this.cancelEdit(true, false);
                }
            });
        });
    };
    Edit.prototype.positionEditor = function () {
        var tdElem = this.editCellData.element;
        tdElem.classList.add('e-ss-edited');
        var cell = getCell(this.editCellData.rowIndex, this.editCellData.colIndex, this.parent.getActiveSheet());
        var left = this.editCellData.position.left + 1;
        var top = this.editCellData.position.top + 1;
        var minHeight = this.editCellData.element.offsetHeight - 3;
        var minWidth = this.editCellData.element.offsetWidth - 3;
        var mainContElement = this.parent.getMainContent();
        var editWidth = mainContElement.offsetWidth - left - 28;
        //let editHeight: number = mainContElement.offsetHeight - top - 28;
        var inlineStyles = 'display:block;top:' + top + 'px;' + (this.parent.enableRtl ? 'right:' : 'left:') + left + 'px;' +
            'min-width:' + minWidth + 'px;max-width:' + editWidth + 'px;' + ((cell && cell.wrap) ? 'min-height:' : 'height:') +
            minHeight + 'px;' + ((cell && cell.wrap) ? ('width:' + minWidth + 'px;') : '');
        inlineStyles += tdElem.style.cssText;
        this.editorElem.setAttribute('style', inlineStyles);
        if (tdElem.classList.contains('e-right-align')) {
            this.editorElem.classList.add('e-right-align');
        }
        else if (tdElem.classList.contains('e-center-align')) {
            this.editorElem.classList.add('e-center-align');
        }
    };
    Edit.prototype.updateEditedValue = function (tdRefresh) {
        if (tdRefresh === void 0) { tdRefresh = true; }
        var oldCellValue = this.editCellData.oldValue;
        var oldValue = oldCellValue ? oldCellValue.toString().toUpperCase() : '';
        var isValidate = true;
        var address = this.editCellData.addr;
        var cellIndex = getRangeIndexes(this.parent.getActiveSheet().activeCell);
        var sheet = this.parent.getActiveSheet();
        var cell = getCell(cellIndex[0], cellIndex[1], sheet);
        /* To set the before cell details for undo redo. */
        this.parent.notify(setActionData, { args: { action: 'beforeCellSave', eventArgs: { address: this.editCellData.addr } } });
        if (this.parent.allowDataValidation && cell && cell.validation) {
            var value = this.parent.element.getElementsByClassName('e-spreadsheet-edit')[0].innerText;
            var isCell = true;
            var sheetIdx = this.parent.activeSheetIndex;
            var range = void 0;
            if (typeof address === 'string') {
                range = getRangeIndexes(address);
            }
            else {
                range = address;
            }
            this.parent.notify(isValidation, { value: value, range: range, sheetIdx: sheetIdx, isCell: isCell });
            isValidate = this.parent.allowDataValidation;
            this.editCellData.value = isValidate ? value : this.editCellData.value;
            this.parent.allowDataValidation = true;
        }
        if ((oldCellValue !== this.editCellData.value || oldValue.indexOf('=RAND()') > -1 || oldValue.indexOf('RAND()') > -1 ||
            oldValue.indexOf('=RANDBETWEEN(') > -1 || oldValue.indexOf('RANDBETWEEN(') > -1) && isValidate) {
            var sheet_1 = this.parent.getActiveSheet();
            var cellIndex_1 = getRangeIndexes(sheet_1.activeCell);
            this.parent.notify(workbookEditOperation, { action: 'updateCellValue', address: this.editCellData.addr, value: this.editCellData.value });
            var cell_1 = getCell(cellIndex_1[0], cellIndex_1[1], sheet_1, true);
            var eventArgs = this.getRefreshNodeArgs(cell_1);
            this.editCellData.value = eventArgs.value;
            if (cell_1.formula) {
                this.editCellData.formula = cell_1.formula;
            }
            if (cell_1.wrap) {
                this.parent.notify(wrapEvent, { range: cellIndex_1, wrap: true, sheet: sheet_1 });
            }
            if (tdRefresh) {
                this.parent.refreshNode(this.editCellData.element, eventArgs);
            }
        }
        if (this.parent.allowConditionalFormat) {
            this.parent.notify(checkConditionalFormat, { rowIdx: cellIndex[0], colIdx: cellIndex[1], cell: cell });
        }
        return isValidate;
    };
    Edit.prototype.refreshDependentCellValue = function (rowIdx, colIdx, sheetIdx) {
        if (rowIdx && colIdx) {
            rowIdx--;
            colIdx--;
            if ((this.editCellData.rowIndex !== rowIdx || this.editCellData.colIndex !== colIdx)
                && this.parent.activeSheetIndex === sheetIdx) {
                var td = this.parent.getCell(rowIdx, colIdx);
                if (td) {
                    var sheet = getSheet(this.parent, sheetIdx);
                    var cell = getCell(rowIdx, colIdx, sheet);
                    var eventArgs = this.getRefreshNodeArgs(cell);
                    this.parent.refreshNode(td, eventArgs);
                }
            }
        }
    };
    Edit.prototype.getRefreshNodeArgs = function (cell) {
        cell = cell ? cell : {};
        var fCode = (cell && cell.format) ? cell.format : '';
        var eventArgs = {
            value: cell.value, format: fCode, onLoad: true,
            formattedText: '', isRightAlign: false, type: 'General'
        };
        var args;
        this.parent.notify(getFormattedCellObject, eventArgs);
        eventArgs.formattedText = this.parent.allowNumberFormatting ? eventArgs.formattedText : eventArgs.value;
        args = {
            isRightAlign: eventArgs.isRightAlign,
            result: eventArgs.formattedText,
            type: eventArgs.type,
            value: eventArgs.value,
            curSymbol: eventArgs.curSymbol
        };
        return args;
    };
    Edit.prototype.endEdit = function (refreshFormulaBar, event) {
        if (refreshFormulaBar === void 0) { refreshFormulaBar = false; }
        if (refreshFormulaBar) {
            this.refreshEditor(this.editCellData.oldValue, false, true, false, false);
        }
        if (this.triggerEvent('beforeCellSave')) {
            event.preventDefault();
            return;
        }
        var isValidate = this.updateEditedValue();
        if (isValidate) {
            this.triggerEvent('cellSave', event);
            this.resetEditState();
            this.focusElement();
        }
        else if (event) {
            event.preventDefault();
        }
    };
    Edit.prototype.cancelEdit = function (refreshFormulaBar, trigEvent, event) {
        if (refreshFormulaBar === void 0) { refreshFormulaBar = true; }
        if (trigEvent === void 0) { trigEvent = true; }
        this.refreshEditor(this.editCellData.oldValue, refreshFormulaBar, false, false, false);
        if (trigEvent) {
            this.triggerEvent('cellSave', event);
        }
        this.resetEditState();
        this.focusElement();
    };
    Edit.prototype.focusElement = function () {
        this.parent.element.focus();
        this.parent.notify(enableToolbarItems, [{ enable: true }]);
    };
    Edit.prototype.triggerEvent = function (eventName, event) {
        var eventArgs = {
            element: this.editCellData.element,
            value: this.editCellData.value,
            oldValue: this.editCellData.oldValue,
            address: this.editCellData.fullAddr
        };
        if (eventName === 'cellSave') {
            if (this.editCellData.formula) {
                eventArgs.formula = this.editCellData.formula;
            }
            eventArgs.originalEvent = event;
            this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'cellSave' });
        }
        if (eventName !== 'cellSave') {
            eventArgs.cancel = false;
        }
        this.parent.trigger(eventName, eventArgs);
        return eventArgs.cancel;
    };
    Edit.prototype.altEnter = function () {
        var text;
        var textBefore;
        var textAfter;
        var selection = window.getSelection();
        var node = selection.anchorNode;
        var offset;
        var range = document.createRange();
        offset = (node.nodeType === 3) ? selection.anchorOffset : node.textContent.length;
        text = node.textContent;
        textBefore = text.slice(0, offset);
        textAfter = text.slice(offset) || ' ';
        node.textContent = textBefore + '\n' + textAfter;
        range = document.createRange();
        if (node.nodeType === 3) {
            range.setStart(node, offset + 1);
            range.setEnd(node, offset + 1);
        }
        else if (node.nodeType === 1) {
            range.setStart(node.firstChild, offset + 1);
            range.setEnd(node.firstChild, offset + 1);
        }
        selection.removeAllRanges();
        selection.addRange(range);
    };
    Edit.prototype.resetEditState = function (elemRefresh) {
        if (elemRefresh === void 0) { elemRefresh = true; }
        if (elemRefresh) {
            this.editCellData.element.classList.remove('e-ss-edited');
            this.editorElem.textContent = '';
            this.editorElem.removeAttribute('style');
            this.editorElem.classList.remove('e-right-align');
        }
        this.editCellData = {};
        this.parent.isEdit = this.isEdit = false;
        this.isCellEdit = true;
        this.parent.notify(formulaOperation, { action: 'endEdit' });
    };
    return Edit;
}());
export { Edit };
