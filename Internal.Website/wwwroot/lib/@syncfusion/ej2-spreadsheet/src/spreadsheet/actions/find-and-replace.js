import { findDlg, locale, dialog, gotoDlg, replace, findHandler, beginAction } from '../common/index';
import { completeAction } from '../common/index';
import { getComponent, isNullOrUndefined } from '@syncfusion/ej2-base';
import { goto, showDialog, findUndoRedo, count, replaceAllDialog, findKeyUp } from '../../workbook/index';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { TextBox } from '@syncfusion/ej2-inputs';
/**
 * `FindAndReplace` module is used to handle the search action in Spreadsheet.
 */
var FindAndReplace = /** @class */ (function () {
    /**
     * Constructor for FindAndReplace module.
     */
    function FindAndReplace(parent) {
        this.shortValue = '';
        this.parent = parent;
        this.addEventListener();
    }
    FindAndReplace.prototype.addEventListener = function () {
        this.parent.on(findDlg, this.renderFindDlg, this);
        this.parent.on(gotoDlg, this.renderGotoDlg, this);
        this.parent.on(goto, this.gotoHandler, this);
        this.parent.on(findHandler, this.findHandler, this);
        this.parent.on(replace, this.replaceHandler, this);
        this.parent.on(showDialog, this.showDialog, this);
        this.parent.on(replaceAllDialog, this.replaceAllDialog, this);
        this.parent.on(findUndoRedo, this.findUndoRedo, this);
        this.parent.on(findKeyUp, this.findKeyUp, this);
    };
    FindAndReplace.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(findDlg, this.renderFindDlg);
            this.parent.off(gotoDlg, this.renderGotoDlg);
            this.parent.off(goto, this.gotoHandler);
            this.parent.off(findHandler, this.findHandler);
            this.parent.off(replace, this.replaceHandler);
            this.parent.off(showDialog, this.showDialog);
            this.parent.off(replaceAllDialog, this.replaceAllDialog);
            this.parent.off(findUndoRedo, this.findUndoRedo);
            this.parent.off(findKeyUp, this.findKeyUp);
        }
    };
    FindAndReplace.prototype.findUndoRedo = function (options) {
        var eventArgs = { address: options.address, compareVal: options.compareVal, cancel: false };
        if (options.undoRedoOpt === 'before') {
            this.parent.notify(beginAction, { action: 'beforeReplace', eventArgs: eventArgs });
        }
        else if (options.undoRedoOpt === 'after') {
            if (!eventArgs.cancel) {
                var eventArgs_1 = { address: options.address, compareVal: options.compareVal };
                this.parent.notify(completeAction, { action: 'replace', eventArgs: eventArgs_1 });
            }
        }
        else if (options.undoRedoOpt === 'beforeReplaceAll') {
            if (!eventArgs.cancel) {
                var eventArgs_2 = { replaceValue: options.replaceValue, addressCollection: options.Collection };
                this.parent.notify(beginAction, { action: 'beforeReplaceAll', eventArgs: eventArgs_2 });
            }
        }
        else if (options.undoRedoOpt === 'afterReplaceAll') {
            if (!eventArgs.cancel) {
                var eventArgs_3 = { replaceValue: options.replaceValue, addressCollection: options.Collection };
                this.parent.notify(completeAction, { action: 'replaceAll', eventArgs: eventArgs_3 });
            }
        }
    };
    FindAndReplace.prototype.renderFindDlg = function () {
        var _this = this;
        var l10n = this.parent.serviceLocator.getService(locale);
        var dialogInst = this.parent.serviceLocator.getService(dialog);
        var cancelButton = false;
        if (isNullOrUndefined(this.parent.element.querySelector('.e-find-dlg'))) {
            var dlg = {
                isModal: false, showCloseIcon: true, cssClass: 'e-find-dlg', allowDragging: true,
                header: l10n.getConstant('FindAndReplace'), closeOnEscape: false,
                beforeOpen: function (args) {
                    var dlgArgs = {
                        dialogName: 'FindAndReplaceDialog',
                        element: args.element, target: args.target, cancel: args.cancel
                    };
                    _this.parent.trigger('dialogBeforeOpen', dlgArgs);
                    if (dlgArgs.cancel) {
                        args.cancel = true;
                    }
                    dialogInst.dialogInstance.content = _this.findandreplaceContent();
                    dialogInst.dialogInstance.dataBind();
                    _this.parent.element.focus();
                },
                buttons: [{
                        buttonModel: {
                            content: l10n.getConstant('FindPreviousBtn'), isPrimary: true, cssClass: 'e-btn-findPrevious', disabled: true
                        },
                        click: function () {
                            _this.dialogMessage();
                            _this.findDlgClick('prev');
                        }
                    }, {
                        buttonModel: {
                            content: l10n.getConstant('FindNextBtn'), isPrimary: true, cssClass: 'e-btn-findNext', disabled: true
                        },
                        click: function () {
                            _this.dialogMessage();
                            _this.findDlgClick('next');
                        }
                    }, {
                        buttonModel: {
                            content: l10n.getConstant('ReplaceBtn'), isPrimary: true, cssClass: 'e-btn-replace', disabled: true
                        },
                        click: function () {
                            _this.dialogMessage();
                            _this.findDlgClick('replace');
                        }
                    }, {
                        buttonModel: {
                            content: l10n.getConstant('ReplaceAllBtn'), isPrimary: true, cssClass: 'e-btn-replaceAll', disabled: true
                        },
                        click: function () {
                            _this.dialogMessage();
                            _this.findDlgClick('replaceAll');
                        }
                    }], open: function () {
                    var findInput = _this.parent.element.querySelector('.e-text-findNext').value;
                    if (findInput) {
                        var prevButton = _this.parent.element.querySelector('.e-btn-findPrevious');
                        var prevButtonObj = getComponent(prevButton, 'btn');
                        prevButtonObj.disabled = false;
                        getComponent(_this.parent.element.querySelector('.e-btn-findNext'), 'btn').disabled = false;
                    }
                }, close: function () {
                    dialogInst.hide();
                }
            };
            dialogInst.show(dlg, cancelButton);
        }
        else {
            dialogInst.hide();
        }
    };
    FindAndReplace.prototype.dialogMessage = function () {
        if (this.parent.element.querySelector('.e-replace-alert-span')) {
            this.parent.element.querySelector('.e-replace-alert-span').remove();
        }
        else if (this.parent.element.querySelector('.e-find-alert-span')) {
            this.parent.element.querySelector('.e-find-alert-span').remove();
        }
    };
    FindAndReplace.prototype.renderGotoDlg = function () {
        var _this = this;
        var l10n = this.parent.serviceLocator.getService(locale);
        var dialogInst = this.parent.serviceLocator.getService(dialog);
        var cancelBtn = false;
        if (isNullOrUndefined(this.parent.element.querySelector('.e-find-dlg'))) {
            var dlg = {
                width: 300, isModal: false, showCloseIcon: true, cssClass: 'e-goto-dlg', allowDragging: true,
                header: l10n.getConstant('GotoHeader'),
                beforeOpen: function (args) {
                    var dlgArgs = {
                        dialogName: 'GoToDialog',
                        element: args.element, target: args.target, cancel: args.cancel
                    };
                    _this.parent.trigger('dialogBeforeOpen', dlgArgs);
                    if (dlgArgs.cancel) {
                        args.cancel = true;
                    }
                    dialogInst.dialogInstance.content = _this.GotoContent();
                    dialogInst.dialogInstance.dataBind();
                    _this.parent.element.focus();
                },
                buttons: [{
                        buttonModel: {
                            content: l10n.getConstant('Ok'), isPrimary: true, cssClass: 'e-btn-goto-ok'
                        },
                        click: function () {
                            _this.gotoHandler();
                        },
                    }], close: function () {
                    dialogInst.hide();
                }, open: function () {
                    _this.textFocus();
                },
            };
            dialogInst.show(dlg, cancelBtn);
        }
        else {
            dialogInst.hide();
        }
    };
    FindAndReplace.prototype.textFocus = function () {
        var _this = this;
        var element = this.parent.element.querySelector('.e-text-goto');
        element.addEventListener('focus', function () {
            if (_this.parent.element.querySelector('.e-goto-alert-span')) {
                _this.parent.element.querySelector('.e-goto-alert-span').remove();
            }
        });
    };
    FindAndReplace.prototype.findDlgClick = function (findDlgArgs) {
        if (findDlgArgs === 'prev') {
            this.findHandler({ findOption: findDlgArgs });
        }
        else if (findDlgArgs === 'next') {
            this.findHandler({ findOption: findDlgArgs });
        }
        else {
            this.replaceHandler({ findDlgArgs: findDlgArgs });
        }
    };
    FindAndReplace.prototype.findHandler = function (findOpt) {
        var findInput = this.parent.element.querySelector('.e-text-findNext');
        if (!findInput) {
            findInput = this.parent.element.querySelector('.e-text-findNext-short');
            if (!findInput) {
                this.gotoAlert();
            }
        }
        var value = findInput.value;
        if (findInput.value !== '') {
            var sheetIndex = this.parent.activeSheetIndex;
            var checkCase = this.parent.element.querySelector('.e-findnreplace-checkcase');
            var isCSen = void 0;
            if (!checkCase) {
                isCSen = false;
            }
            else {
                var caseCheckbox = getComponent(checkCase, 'checkbox');
                isCSen = caseCheckbox.checked;
            }
            var checkmatch = this.parent.element.querySelector('.e-findnreplace-checkmatch');
            var isEMatch = void 0;
            if (!checkmatch) {
                isEMatch = false;
            }
            else {
                var entireMatchCheckbox = getComponent(checkmatch, 'checkbox');
                isEMatch = entireMatchCheckbox.checked;
            }
            var searchitem = this.parent.element.querySelector('.e-findnreplace-searchby');
            var searchBy = void 0;
            if (!searchitem) {
                searchBy = 'By Row';
            }
            else {
                var searchDDL = getComponent(searchitem, 'dropdownlist');
                searchBy = searchDDL.value.toString();
            }
            var modeitem = this.parent.element.querySelector('.e-findnreplace-searchwithin');
            var mode = void 0;
            if (!modeitem) {
                mode = 'Sheet';
            }
            else {
                var modeDDL = getComponent(modeitem, 'dropdownlist');
                mode = modeDDL.value.toString();
            }
            var args = {
                value: value, sheetIndex: sheetIndex, findOpt: findOpt.findOption, mode: mode, isCSen: isCSen,
                isEMatch: isEMatch, searchBy: searchBy
            };
            if (findOpt.findOption === 'next' || findOpt.findOption === 'prev') {
                this.parent.find(args);
            }
            else if (findOpt.countArgs.countOpt === 'count') {
                this.parent.notify(count, args);
                findOpt.countArgs.findCount = args.findCount;
            }
        }
    };
    FindAndReplace.prototype.replaceHandler = function (replace) {
        var sheetIndex = this.parent.activeSheetIndex;
        var findInput = this.parent.element.querySelector('.e-text-findNext');
        var replaceWith = this.parent.element.querySelector('.e-text-replaceInp');
        var checkCase = this.parent.element.querySelector('.e-findnreplace-checkcase');
        var caseCheckbox = getComponent(checkCase, 'checkbox');
        var checkmatch = this.parent.element.querySelector('.e-findnreplace-checkmatch');
        var eMatchCheckbox = getComponent(checkmatch, 'checkbox');
        var searchitem = this.parent.element.querySelector('.e-findnreplace-searchby');
        var searchDDL = getComponent(searchitem, 'dropdownlist');
        var modeitem = this.parent.element.querySelector('.e-findnreplace-searchwithin');
        var modeDDL = getComponent(modeitem, 'dropdownlist');
        var findOption = 'next';
        var args = {
            value: findInput.value, mode: modeDDL.value.toString(), isCSen: caseCheckbox.checked,
            isEMatch: eMatchCheckbox.checked, searchBy: searchDDL.value.toString(), findOpt: findOption, replaceValue: replaceWith.value,
            replaceBy: replace.findDlgArgs ? replace.findDlgArgs : replace.replaceMode, sheetIndex: sheetIndex
        };
        this.parent.replace(args);
    };
    FindAndReplace.prototype.gotoHandler = function (address) {
        if (address) {
            this.parent.goTo(address.address);
        }
        else {
            var item = this.parent.element.querySelector('.e-text-goto');
            var gotoaddress = item.value;
            var splitAddress = gotoaddress.split('');
            if ((gotoaddress === '') || isNaN(parseInt(splitAddress[1], 10))) {
                this.gotoAlert();
                return;
            }
            else {
                var address_1 = gotoaddress.toString().toUpperCase();
                this.parent.goTo(address_1);
            }
        }
    };
    FindAndReplace.prototype.gotoAlert = function () {
        var l10n = this.parent.serviceLocator.getService(locale);
        var gotoSpan = this.parent.createElement('span', {
            className: 'e-goto-alert-span',
            innerHTML: l10n.getConstant('InsertingEmptyValue')
        });
        (this.parent.element.querySelector('.e-goto-dlg').querySelector('.e-dlg-content')).appendChild(gotoSpan);
    };
    FindAndReplace.prototype.showDialog = function () {
        if (this.parent.element.querySelector('.e-replace-alert-span')) {
            this.parent.element.querySelector('.e-replace-alert-span').remove();
        }
        var l10n = this.parent.serviceLocator.getService(locale);
        var findSpan = this.parent.createElement('span', {
            className: 'e-find-alert-span',
            innerHTML: l10n.getConstant('NoElements')
        });
        (this.parent.element.querySelector('.e-find-dlg').querySelector('.e-dlg-content')).appendChild(findSpan);
    };
    FindAndReplace.prototype.replaceAllDialog = function (options) {
        if (this.parent.element.querySelector('.e-find-alert-span')) {
            this.parent.element.querySelector('.e-find-alert-span').remove();
        }
        var l10n = (this.parent.serviceLocator.getService(locale));
        var replaceSpan = this.parent.createElement('span', {
            className: 'e-replace-alert-span',
            innerHTML: options.count + l10n.getConstant('ReplaceAllEnd') + options.replaceValue
        });
        (this.parent.element.querySelector('.e-find-dlg').querySelector('.e-dlg-content')).appendChild(replaceSpan);
    };
    FindAndReplace.prototype.findKeyUp = function (e) {
        if (e.target, 'e-text-findNext') {
            var findValue_1 = this.parent.element.querySelector('.e-text-findNext').value;
            if (!isNullOrUndefined(findValue_1) && findValue_1 !== '') {
                var prevButton = this.parent.element.querySelector('.e-btn-findPrevious');
                var prevButtonObj = getComponent(prevButton, 'btn');
                prevButtonObj.disabled = false;
                getComponent(this.parent.element.querySelector('.e-btn-findNext'), 'btn').disabled = false;
            }
            else {
                getComponent(this.parent.element.querySelector('.e-btn-findPrevious'), 'btn').disabled = true;
                getComponent(this.parent.element.querySelector('.e-btn-findNext'), 'btn').disabled = true;
                this.dialogMessage();
            }
        }
        var findValue = this.parent.element.querySelector('.e-text-findNext').value;
        var replaceValue = this.parent.element.querySelector('.e-text-replaceInp').value;
        if (!isNullOrUndefined(findValue) && !isNullOrUndefined(replaceValue) && (findValue !== '') && (replaceValue !== '')) {
            if (this.parent.getActiveSheet().isProtected === false) {
                getComponent(this.parent.element.querySelector('.e-btn-replace'), 'btn').disabled = false;
                getComponent(this.parent.element.querySelector('.e-btn-replaceAll'), 'btn').disabled = false;
            }
        }
        else {
            getComponent(this.parent.element.querySelector('.e-btn-replace'), 'btn').disabled = true;
            getComponent(this.parent.element.querySelector('.e-btn-replaceAll'), 'btn').disabled = true;
            this.dialogMessage();
        }
    };
    FindAndReplace.prototype.findandreplaceContent = function () {
        if (this.parent.element.querySelector('.e-text-findNext-short')) {
            this.shortValue = this.parent.element.querySelector('.e-text-findNext-short').value;
        }
        var dialogElem = this.parent.createElement('div', { className: 'e-link-dialog' });
        var findElem = this.parent.createElement('div', { className: 'e-find' });
        var findCheck = this.parent.createElement('div', { className: 'e-findCheck' });
        var l10n = this.parent.serviceLocator.getService(locale);
        dialogElem.appendChild(findElem);
        var findTextE = this.parent.createElement('div', { className: 'e-cont' });
        var findTextH = this.parent.createElement('p', { className: 'e-header', innerHTML: l10n.getConstant('FindWhat') });
        var findTextIp = this.parent.createElement('input', {
            className: 'e-input e-text-findNext', attrs: {
                'type': 'Text', 'placeholder': l10n.getConstant('FindValue'),
                'value': this.shortValue
            }
        });
        findTextE.appendChild(findTextIp);
        findTextE.insertBefore(findTextH, findTextIp);
        findElem.appendChild(findTextE);
        var findTextBox = new TextBox({ width: '70%' });
        findTextBox.createElement = this.parent.createElement;
        findTextBox.appendTo(findTextIp);
        var replaceTextE = this.parent.createElement('div', { className: 'e-cont' });
        var replaceTextH = this.parent.createElement('p', { className: 'e-header', innerHTML: l10n.getConstant('ReplaceWith') });
        var replaceTextIp = this.parent.createElement('input', {
            className: 'e-input e-text-replaceInp', attrs: { 'type': 'Text', 'placeholder': l10n.getConstant('ReplaceValue') }
        });
        replaceTextE.appendChild(replaceTextIp);
        replaceTextE.insertBefore(replaceTextH, replaceTextIp);
        findElem.appendChild(replaceTextE);
        var replaceTextBox = new TextBox({ width: '70%' });
        replaceTextBox.createElement = this.parent.createElement;
        replaceTextBox.appendTo(replaceTextIp);
        var withinData = [
            { Id: 'Sheet', Within: l10n.getConstant('Sheet') },
            { Id: 'Workbook', Within: l10n.getConstant('Workbook') }
        ];
        var withInDDL = new DropDownList({
            dataSource: withinData,
            cssClass: 'e-searchby',
            fields: { value: 'Id', text: 'Within' }, width: '50%', index: 0
        });
        var withIn = this.parent.createElement('input', {
            className: 'e-findnreplace-searchwithin', attrs: { type: 'select', label: l10n.getConstant('SearchBy') }
        });
        var withinTextH = this.parent.createElement('p', { className: 'e-header', innerHTML: l10n.getConstant('SearchWithin') });
        findElem.appendChild(withinTextH);
        findElem.appendChild(withIn);
        withInDDL.createElement = this.parent.createElement;
        withInDDL.appendTo(withIn);
        var searchData = [
            { Id: 'By Row', Search: l10n.getConstant('ByRow') },
            { Id: 'By Column', Search: l10n.getConstant('ByColumn') }
        ];
        var searchDDL = new DropDownList({
            dataSource: searchData,
            cssClass: 'e-searchby',
            fields: { value: 'Id', text: 'Search' }, width: '50%', index: 0
        });
        var searchIn = this.parent.createElement('input', {
            className: 'e-findnreplace-searchby', attrs: { type: 'select', label: l10n.getConstant('SearchBy') }
        });
        var searchTextH = this.parent.createElement('p', { className: 'e-header', innerHTML: l10n.getConstant('SearchBy') });
        findElem.appendChild(searchTextH);
        findElem.appendChild(searchIn);
        searchDDL.createElement = this.parent.createElement;
        searchDDL.appendTo(searchIn);
        var isCSen = new CheckBox({
            label: l10n.getConstant('MatchCase'), checked: false,
            cssClass: 'e-findnreplace-casecheckbox'
        });
        var caaseCheckbox = this.parent.createElement('input', {
            className: 'e-findnreplace-checkcase', attrs: { type: 'checkbox' }
        });
        findCheck.appendChild(caaseCheckbox);
        isCSen.createElement = this.parent.createElement;
        isCSen.appendTo(caaseCheckbox);
        var isEMatch = new CheckBox({
            label: l10n.getConstant('MatchExactCellElements'), checked: false,
            cssClass: 'e-findnreplace-exactmatchcheckbox',
        });
        var entirematchCheckbox = this.parent.createElement('input', {
            className: 'e-findnreplace-checkmatch', attrs: { type: 'checkbox' }
        });
        findCheck.appendChild(entirematchCheckbox);
        isEMatch.createElement = this.parent.createElement;
        isEMatch.appendTo(entirematchCheckbox);
        findElem.appendChild(findCheck);
        return dialogElem;
    };
    FindAndReplace.prototype.GotoContent = function () {
        var l10n = this.parent.serviceLocator.getService(locale);
        var dialogElem = this.parent.createElement('div', { className: 'e-link-dialog' });
        var gotoElem = this.parent.createElement('div', { className: 'e-goto' });
        dialogElem.appendChild(gotoElem);
        var gotoTextE = this.parent.createElement('div', { className: 'e-cont' });
        var gotoTextH = this.parent.createElement('p', { className: 'e-header', innerHTML: l10n.getConstant('Reference') });
        var gotoTextBox = new TextBox({
            placeholder: l10n.getConstant('EntercellAddress')
        });
        var gotoTextIp = this.parent.createElement('input', { className: 'e-text-goto', attrs: { 'type': 'Text' } });
        gotoTextE.appendChild(gotoTextIp);
        gotoTextE.insertBefore(gotoTextH, gotoTextIp);
        gotoElem.appendChild(gotoTextE);
        gotoTextBox.createElement = this.parent.createElement;
        gotoTextBox.appendTo(gotoTextIp);
        return dialogElem;
    };
    /**
     * To destroy the find-and-replace module.
     * @return {void}
     */
    FindAndReplace.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    /**
     * Gets the module name.
     * @returns string
     */
    FindAndReplace.prototype.getModuleName = function () {
        return 'findAndReplace';
    };
    return FindAndReplace;
}());
export { FindAndReplace };
