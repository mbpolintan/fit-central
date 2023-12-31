import { initiateHyperlink, locale, dialog, click, keyUp, createHyperlinkElement, getUpdateUsingRaf } from '../common/index';
import { editHyperlink, removeHyperlink, openHyperlink, editAlert } from '../common/index';
import { isNullOrUndefined, closest } from '@syncfusion/ej2-base';
import { getRangeIndexes, getCellIndexes, getCellAddress, getRangeAddress } from '../../workbook/common/address';
import { getTypeFromFormat, getCell } from '../../workbook/index';
import { beforeHyperlinkClick, afterHyperlinkClick } from '../../workbook/common/event';
import { isCellReference } from '../../workbook/index';
import { Tab, TreeView } from '@syncfusion/ej2-navigations';
/**
 * `Hyperlink` module
 */
var SpreadsheetHyperlink = /** @class */ (function () {
    /**
     * Constructor for Hyperlink module.
     */
    function SpreadsheetHyperlink(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * To destroy the Hyperlink module.
     * @return {void}
     */
    SpreadsheetHyperlink.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    SpreadsheetHyperlink.prototype.addEventListener = function () {
        this.parent.on(initiateHyperlink, this.initiateHyperlinkHandler, this);
        this.parent.on(editHyperlink, this.editHyperlinkHandler, this);
        this.parent.on(removeHyperlink, this.removeHyperlinkHandler, this);
        this.parent.on(openHyperlink, this.openHyperlinkHandler, this);
        this.parent.on(click, this.hyperlinkClickHandler, this);
        this.parent.on(createHyperlinkElement, this.createHyperlinkElementHandler, this);
        this.parent.on(keyUp, this.keyUpHandler, this);
    };
    SpreadsheetHyperlink.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(initiateHyperlink, this.initiateHyperlinkHandler);
            this.parent.off(editHyperlink, this.editHyperlinkHandler);
            this.parent.off(removeHyperlink, this.removeHyperlinkHandler);
            this.parent.off(openHyperlink, this.openHyperlinkHandler);
            this.parent.off(click, this.hyperlinkClickHandler);
            this.parent.off(createHyperlinkElement, this.createHyperlinkElementHandler);
            this.parent.off(keyUp, this.keyUpHandler);
        }
    };
    /**
     * Gets the module name.
     * @returns string
     */
    SpreadsheetHyperlink.prototype.getModuleName = function () {
        return 'spreadsheetHyperlink';
    };
    SpreadsheetHyperlink.prototype.keyUpHandler = function (e) {
        var trgt = e.target;
        if (closest(trgt, '.e-document')) {
            var hyperlinkText = document.querySelector('.e-hyp-text');
            var hyperlinkSpan = this.parent.element.querySelector('.e-hyperlink-alert-span');
            var dlgElement = closest(trgt, '.e-hyperlink-dlg') || closest(trgt, '.e-edithyperlink-dlg');
            var footerEle = dlgElement.getElementsByClassName('e-footer-content')[0];
            var insertBut = footerEle.firstChild;
            if (hyperlinkText && hyperlinkText.value) {
                if (!isCellReference(hyperlinkText.value.toUpperCase())) {
                    this.showDialog();
                    insertBut.setAttribute('disabled', 'true');
                }
                else if (hyperlinkSpan) {
                    hyperlinkSpan.remove();
                    insertBut.removeAttribute('disabled');
                }
            }
        }
        if (trgt.classList.contains('e-text') && closest(trgt, '.e-cont')) {
            if (closest(trgt, '.e-webpage') && closest(trgt, '.e-webpage').getElementsByClassName('e-cont')[1] === trgt.parentElement) {
                var dlgEle = closest(trgt, '.e-hyperlink-dlg') || closest(trgt, '.e-edithyperlink-dlg');
                var ftrEle = dlgEle.getElementsByClassName('e-footer-content')[0];
                var insertBut = ftrEle.firstChild;
                if (trgt.value !== '') {
                    insertBut.removeAttribute('disabled');
                }
                else {
                    var linkDialog = closest(trgt, '.e-link-dialog');
                    var webPage = linkDialog.querySelector('.e-webpage');
                    var isUrl = webPage.querySelectorAll('.e-cont')[1].querySelector('.e-text').value ? true : false;
                    if (!isUrl) {
                        insertBut.setAttribute('disabled', 'true');
                    }
                }
            }
        }
    };
    SpreadsheetHyperlink.prototype.initiateHyperlinkHandler = function () {
        var _this = this;
        var l10n = this.parent.serviceLocator.getService(locale);
        var sheet = this.parent.getActiveSheet();
        if (sheet.isProtected && !sheet.protectSettings.insertLink) {
            this.parent.notify(editAlert, null);
            return;
        }
        if (!this.parent.element.querySelector('.e-hyperlink-dlg')) {
            var dialogInst_1 = this.parent.serviceLocator.getService(dialog);
            dialogInst_1.show({
                width: 323, isModal: true, showCloseIcon: true, cssClass: 'e-hyperlink-dlg',
                header: l10n.getConstant('InsertLink'),
                beforeOpen: function (args) {
                    var dlgArgs = {
                        dialogName: 'InsertLinkDialog',
                        element: args.element, target: args.target, cancel: args.cancel
                    };
                    _this.parent.trigger('dialogBeforeOpen', dlgArgs);
                    if (dlgArgs.cancel) {
                        args.cancel = true;
                    }
                    dialogInst_1.dialogInstance.content = _this.hyperlinkContent();
                    dialogInst_1.dialogInstance.dataBind();
                    _this.parent.element.focus();
                },
                buttons: [{
                        buttonModel: {
                            content: l10n.getConstant('Insert'), isPrimary: true, disabled: true
                        },
                        click: function () {
                            _this.dlgClickHandler(dialogInst_1);
                            dialogInst_1.hide();
                        }
                    }]
            });
        }
    };
    SpreadsheetHyperlink.prototype.dlgClickHandler = function (dialogInst) {
        var value;
        var address;
        var spreadsheetInst = this.parent;
        var item = this.parent.element.querySelector('.e-link-dialog').
            getElementsByClassName('e-content')[0].querySelector('.e-item.e-active');
        if (item) {
            if (item.querySelector('.e-webpage')) {
                value = item.getElementsByClassName('e-cont')[0].querySelector('.e-text').value;
                address = item.getElementsByClassName('e-cont')[1].querySelector('.e-text').value;
                var args = { address: address };
                this.parent.insertHyperlink(args, this.parent.getActiveSheet().activeCell, value, false);
            }
            else {
                value = item.getElementsByClassName('e-cont')[0].querySelector('.e-text').value;
                address = item.getElementsByClassName('e-cont')[1].querySelector('.e-text').value;
                var sheetIdx = void 0;
                var dlgContent = item.getElementsByClassName('e-cont')[2];
                if (dlgContent.getElementsByClassName('e-list-item')[0].querySelector('.e-active')) {
                    var sheetName = item.getElementsByClassName('e-cont')[2].querySelector('.e-active').textContent;
                    var sheets = spreadsheetInst.sheets;
                    for (var idx = 0; idx < sheets.length; idx++) {
                        if (sheets[idx].name === sheetName) {
                            sheetIdx = idx + 1;
                        }
                    }
                    address = sheetName + '!' + address.toUpperCase();
                    var args = { address: address };
                    this.parent.insertHyperlink(args, this.parent.getActiveSheet().activeCell, value, false);
                }
                else if (dlgContent.querySelector('.e-active')) {
                    var definedName = item.getElementsByClassName('e-cont')[2].querySelector('.e-active').textContent;
                    for (var idx = 0; idx < this.parent.definedNames.length; idx++) {
                        if (this.parent.definedNames[idx].name === definedName) {
                            var args = {
                                address: this.parent.definedNames[idx].name,
                            };
                            this.parent.insertHyperlink(args, this.parent.getActiveSheet().activeCell, value, false);
                        }
                    }
                }
            }
        }
    };
    SpreadsheetHyperlink.prototype.showDialog = function () {
        if (this.parent.element.querySelector('.e-hyperlink-alert-span')) {
            this.parent.element.querySelector('.e-hyperlink-alert-span').remove();
        }
        var l10n = this.parent.serviceLocator.getService(locale);
        var hyperlinkSpan = this.parent.createElement('span', {
            className: 'e-hyperlink-alert-span',
            innerHTML: l10n.getConstant('HyperlinkAlert')
        });
        (this.parent.element.querySelector('.e-hyperlink-dlg').querySelector('.e-dlg-content')).appendChild(hyperlinkSpan);
    };
    SpreadsheetHyperlink.prototype.editHyperlinkHandler = function () {
        var _this = this;
        var isWeb = true;
        var l10n = this.parent.serviceLocator.getService(locale);
        var dialogInst = this.parent.serviceLocator.getService(dialog);
        dialogInst.show({
            width: 323, isModal: true, showCloseIcon: true, cssClass: 'e-edithyperlink-dlg',
            header: l10n.getConstant('EditLink'),
            beforeOpen: function (args) {
                var dlgArgs = {
                    dialogName: 'EditLinkDialog',
                    element: args.element, target: args.target, cancel: args.cancel
                };
                _this.parent.trigger('dialogBeforeOpen', dlgArgs);
                if (dlgArgs.cancel) {
                    args.cancel = true;
                }
                dialogInst.dialogInstance.content = _this.hyperEditContent();
                dialogInst.dialogInstance.dataBind();
                _this.parent.element.focus();
            },
            buttons: [{
                    buttonModel: {
                        content: l10n.getConstant('Update'), isPrimary: true
                    },
                    click: function () {
                        _this.dlgClickHandler(dialogInst);
                        dialogInst.hide();
                    }
                }]
        });
    };
    SpreadsheetHyperlink.prototype.openHyperlinkHandler = function () {
        var cellIndexes = getCellIndexes(this.parent.getActiveSheet().activeCell);
        var trgt = this.parent.getCell(cellIndexes[0], cellIndexes[1]);
        if (trgt.getElementsByClassName('e-hyperlink')[0]) {
            trgt = trgt.querySelector('.e-hyperlink');
        }
        this.hlOpenHandler(trgt);
    };
    SpreadsheetHyperlink.prototype.removeHyperlinkHandler = function (cell) {
        this.parent.removeHyperlink(cell);
    };
    // tslint:disable-next-line:max-func-body-length
    SpreadsheetHyperlink.prototype.hlOpenHandler = function (trgt) {
        var _this = this;
        if (trgt.classList.contains('e-hyperlink')) {
            var range = ['', ''];
            var selRange = void 0;
            var rangeIndexes = void 0;
            var isEmpty = true;
            trgt.style.color = '#551A8B';
            var sheet = this.parent.getActiveSheet();
            var colIdx = parseInt(trgt.parentElement.getAttribute('aria-colindex'), 10) - 1;
            var rowIdx = parseInt(trgt.parentElement.parentElement.getAttribute('aria-rowindex'), 10) - 1;
            var rangeAddr = sheet.rows[rowIdx].cells[colIdx].hyperlink;
            var address = void 0;
            var befArgs = void 0;
            var aftArgs = void 0;
            befArgs = { hyperlink: rangeAddr, cell: this.parent.getActiveSheet().activeCell, target: '_blank', cancel: false };
            this.parent.trigger(beforeHyperlinkClick, befArgs);
            if (befArgs.cancel) {
                return;
            }
            rangeAddr = befArgs.hyperlink;
            aftArgs = { hyperlink: rangeAddr, cell: this.parent.getActiveSheet().activeCell };
            if (typeof (rangeAddr) === 'string') {
                address = rangeAddr;
            }
            if (typeof (rangeAddr) === 'object') {
                address = rangeAddr.address;
            }
            var definedNameCheck = address;
            if (address.indexOf('http://') === -1 && address.indexOf('https://') === -1 && address.indexOf('ftp://') === -1) {
                if (!isNullOrUndefined(address)) {
                    if (this.parent.definedNames) {
                        for (var idx = 0; idx < this.parent.definedNames.length; idx++) {
                            if (this.parent.definedNames[idx].name === address) {
                                address = this.parent.definedNames[idx].refersTo;
                                address = address.slice(1);
                                break;
                            }
                        }
                    }
                    if (address.indexOf('!') !== -1) {
                        range = address.split('!');
                        if (range[0].indexOf(' ') !== -1) {
                            range[0] = range[0].slice(1, range[0].length - 1);
                        }
                    }
                    else {
                        range[0] = this.parent.getActiveSheet().name;
                        range[1] = address;
                    }
                    selRange = range[1];
                    var sheetIdx_1;
                    for (var idx = 0; idx < this.parent.sheets.length; idx++) {
                        if (this.parent.sheets[idx].name === range[0]) {
                            sheetIdx_1 = idx;
                        }
                    }
                    sheet = this.parent.sheets[sheetIdx_1];
                    if (range[1].indexOf(':') !== -1) {
                        var colIndex = range[1].indexOf(':');
                        var left = range[1].substr(0, colIndex);
                        var right = range[1].substr(colIndex + 1, range[1].length);
                        left = left.replace('$', '');
                        right = right.replace('$', '');
                        if (right.match(/\D/g) && !right.match(/[0-9]/g) && left.match(/\D/g) && !left.match(/[0-9]/g)) {
                            selRange = left + '1' + ':' + right + sheet.rowCount;
                            left = left + '1';
                            right = right + sheet.rowCount;
                            range[1] = left + ':' + right;
                        }
                        else if (!right.match(/\D/g) && right.match(/[0-9]/g) && !left.match(/\D/g) && left.match(/[0-9]/g)) {
                            selRange = getCellAddress(parseInt(left, 10) - 1, 0) + ':' +
                                getCellAddress(parseInt(right, 10) - 1, sheet.colCount - 1);
                            rangeIndexes = [parseInt(left, 10) - 1, 0, parseInt(right, 10) - 1, sheet.colCount - 1];
                            isEmpty = false;
                        }
                    }
                    var isDefinedNamed = void 0;
                    var definedname = this.parent.definedNames;
                    if (!isNullOrUndefined(definedname)) {
                        for (var idx = 0; idx < definedname.length; idx++) {
                            if (definedname[idx].name === definedNameCheck) {
                                isDefinedNamed = true;
                                break;
                            }
                        }
                    }
                    if (isCellReference(range[1]) || isDefinedNamed) {
                        rangeIndexes = isEmpty ? getRangeIndexes(range[1]) : rangeIndexes;
                        if (this.parent.scrollSettings.enableVirtualization) {
                            rangeIndexes[0] = rangeIndexes[0] >= this.parent.viewport.topIndex ?
                                rangeIndexes[0] - this.parent.viewport.topIndex : rangeIndexes[0];
                            rangeIndexes[1] = rangeIndexes[1] >= this.parent.viewport.leftIndex ?
                                rangeIndexes[1] - this.parent.viewport.leftIndex : rangeIndexes[1];
                        }
                        if (!isNullOrUndefined(sheet)) {
                            var rangeAddr_1 = getRangeAddress(rangeIndexes);
                            if (sheet === this.parent.getActiveSheet()) {
                                getUpdateUsingRaf(function () { _this.parent.goTo(rangeAddr_1); });
                            }
                            else {
                                if (rangeAddr_1.indexOf(':') >= 0) {
                                    var addArr = rangeAddr_1.split(':');
                                    rangeAddr_1 = addArr[0] === addArr[1] ? addArr[0] : rangeAddr_1;
                                }
                                getUpdateUsingRaf(function () { _this.parent.goTo(_this.parent.sheets[sheetIdx_1].name + '!' + rangeAddr_1); });
                            }
                        }
                    }
                }
            }
            else {
                trgt.setAttribute('target', befArgs.target);
            }
            this.parent.trigger(afterHyperlinkClick, aftArgs);
        }
    };
    SpreadsheetHyperlink.prototype.hyperlinkClickHandler = function (e) {
        var trgt = e.target;
        if (closest(trgt, '.e-link-dialog') && closest(trgt, '.e-toolbar-item')) {
            var dlgEle = closest(trgt, '.e-hyperlink-dlg') || closest(trgt, '.e-edithyperlink-dlg');
            var ftrEle = dlgEle.getElementsByClassName('e-footer-content')[0];
            var insertBut = ftrEle.firstChild;
            var docEle = dlgEle.querySelector('.e-document');
            var webEle = dlgEle.querySelector('.e-webpage');
            var webEleText = webEle ? webEle.querySelectorAll('.e-cont')[0].querySelector('.e-text').value :
                docEle.querySelectorAll('.e-cont')[0].querySelector('.e-text').value;
            var docEleText = docEle ? docEle.querySelectorAll('.e-cont')[0].querySelector('.e-text').value :
                webEleText;
            var toolbarItems = closest(trgt, '.e-toolbar-items');
            if (toolbarItems.getElementsByClassName('e-toolbar-item')[1].classList.contains('e-active')) {
                var actEle = docEle.querySelectorAll('.e-cont')[2].querySelector('.e-active');
                docEle.querySelectorAll('.e-cont')[0].querySelector('.e-text').value = webEleText;
                if (closest(actEle, '.e-list-item').classList.contains('e-level-2') && insertBut.hasAttribute('disabled')) {
                    insertBut.removeAttribute('disabled');
                }
                else if (closest(actEle, '.e-list-item').classList.contains('e-level-1') && !insertBut.hasAttribute('disabled')) {
                    insertBut.setAttribute('disabled', 'true');
                }
            }
            else {
                var isEmpty = webEle.querySelectorAll('.e-cont')[1].querySelector('.e-text').value ? false : true;
                webEle.querySelectorAll('.e-cont')[0].querySelector('.e-text').value = docEleText;
                if (isEmpty && !insertBut.hasAttribute('disabled')) {
                    insertBut.setAttribute('disabled', 'true');
                }
                else if (!isEmpty && insertBut.hasAttribute('disabled')) {
                    insertBut.removeAttribute('disabled');
                }
            }
        }
        if (closest(trgt, '.e-list-item') && trgt.classList.contains('e-fullrow')) {
            var item = this.parent.element.getElementsByClassName('e-link-dialog')[0].
                getElementsByClassName('e-content')[0].getElementsByClassName('e-active')[0];
            var cellRef = item.getElementsByClassName('e-cont')[1].getElementsByClassName('e-text')[0];
            var dlgEle = closest(trgt, '.e-hyperlink-dlg') || closest(trgt, '.e-edithyperlink-dlg');
            var ftrEle = dlgEle.getElementsByClassName('e-footer-content')[0];
            var insertBut = ftrEle.firstChild;
            if (closest(trgt, '.e-list-item').classList.contains('e-level-2')) {
                if (closest(trgt, '.e-list-item').getAttribute('data-uid') === 'defName') {
                    if (!cellRef.classList.contains('e-disabled') && !cellRef.hasAttribute('readonly')) {
                        cellRef.setAttribute('readonly', 'true');
                        cellRef.classList.add('e-disabled');
                        cellRef.setAttribute('disabled', 'true');
                    }
                }
                else if (closest(trgt, '.e-list-item').getAttribute('data-uid') === 'sheet') {
                    if (cellRef.classList.contains('e-disabled') && cellRef.hasAttribute('readonly')) {
                        cellRef.removeAttribute('readonly');
                        cellRef.classList.remove('e-disabled');
                        cellRef.removeAttribute('disabled');
                    }
                }
                if (insertBut.hasAttribute('disabled')) {
                    insertBut.removeAttribute('disabled');
                }
            }
            else if (closest(trgt, '.e-list-item').classList.contains('e-level-1')) {
                insertBut.setAttribute('disabled', 'true');
            }
        }
        else {
            this.hlOpenHandler(trgt);
        }
    };
    SpreadsheetHyperlink.prototype.createHyperlinkElementHandler = function (args) {
        var cell = args.cell;
        var td = args.td;
        var rowIdx = args.rowIdx;
        var colIdx = args.colIdx;
        var hyperEle = this.parent.createElement('a', { className: 'e-hyperlink e-hyperlink-style' });
        if (!isNullOrUndefined(cell.hyperlink) && !td.querySelector('a')) {
            var hyperlink = cell.hyperlink;
            if (typeof (hyperlink) === 'string') {
                if (hyperlink.indexOf('http://') === -1 && hyperlink.indexOf('https://') === -1 &&
                    hyperlink.indexOf('ftp://') === -1 && hyperlink.indexOf('www.') !== -1) {
                    hyperlink = 'http://' + hyperlink;
                }
                if (hyperlink.indexOf('http://') === 0 || hyperlink.indexOf('https://') === 0 || hyperlink.indexOf('ftp://') === 0) {
                    hyperEle.setAttribute('href', hyperlink);
                    hyperEle.setAttribute('target', '_blank');
                }
                else if (hyperlink.includes('=') || hyperlink.includes('!')) {
                    hyperEle.setAttribute('ref', hyperlink);
                }
                hyperEle.innerText = td.innerText !== '' ? td.innerText : hyperlink;
                td.textContent = '';
                td.innerText = '';
                td.appendChild(hyperEle);
            }
            else if (typeof (hyperlink) === 'object') {
                if (hyperlink.address.indexOf('http://') === 0 || hyperlink.address.indexOf('https://') === 0 ||
                    hyperlink.address.indexOf('ftp://') === 0) {
                    hyperEle.setAttribute('href', hyperlink.address);
                    hyperEle.setAttribute('target', '_blank');
                }
                else if (hyperlink.address.includes('=') || hyperlink.address.includes('!')) {
                    hyperEle.setAttribute('ref', hyperlink.address);
                }
                if (getTypeFromFormat(cell.format) === 'Accounting') {
                    hyperEle.innerHTML = td.innerHTML;
                }
                else {
                    hyperEle.innerText = td.innerText !== '' ? td.innerText : hyperlink.address;
                }
                td.textContent = '';
                td.innerText = '';
                td.appendChild(hyperEle);
            }
        }
        else if (td.querySelector('a') && cell.hyperlink) {
            if (typeof (cell.hyperlink) === 'string') {
                td.querySelector('a').setAttribute('href', cell.hyperlink);
            }
        }
    };
    SpreadsheetHyperlink.prototype.hyperEditContent = function () {
        var isWeb = true;
        var dialog = this.hyperlinkContent();
        var indexes = getRangeIndexes(this.parent.getActiveSheet().activeCell);
        var cell = this.parent.sheets[this.parent.getActiveSheet().id - 1].rows[indexes[0]].cells[indexes[1]];
        if (this.parent.scrollSettings.enableVirtualization) {
            indexes[0] = indexes[0] - this.parent.viewport.topIndex;
            indexes[1] = indexes[1] - this.parent.viewport.leftIndex;
        }
        var value = this.parent.getDisplayText(cell);
        var address;
        var hyperlink = cell.hyperlink;
        if (typeof (hyperlink) === 'string') {
            address = hyperlink;
            value = value || address;
            if (address.indexOf('http://') === -1 && address.indexOf('https://') === -1 && address.indexOf('ftp://') === -1) {
                isWeb = false;
            }
        }
        else if (typeof (hyperlink) === 'object') {
            address = hyperlink.address;
            value = value || address;
            if (address.indexOf('http://') === -1 && address.indexOf('https://') === -1 && address.indexOf('ftp://') === -1) {
                isWeb = false;
            }
        }
        var item = dialog.querySelector('.e-content');
        if (isWeb) {
            var webContElem = item.querySelector('.e-webpage');
            webContElem.getElementsByClassName('e-cont')[0].getElementsByClassName('e-text')[0].setAttribute('value', value);
            if (typeof (hyperlink) === 'string') {
                webContElem.getElementsByClassName('e-cont')[1].querySelector('.e-text').setAttribute('value', hyperlink);
            }
            else {
                var address_1;
                address_1 = webContElem.getElementsByClassName('e-cont')[1].querySelector('.e-text');
                address_1.setAttribute('value', hyperlink.address);
            }
        }
        else {
            var isDefinedNamed = void 0;
            var docContElem = item.querySelector('.e-document');
            docContElem.getElementsByClassName('e-cont')[0].getElementsByClassName('e-text')[0].setAttribute('value', value);
            var rangeArr = void 0;
            var sheet = this.parent.getActiveSheet();
            var sheetIdx = void 0;
            if (this.parent.definedNames) {
                for (var idx = 0; idx < this.parent.definedNames.length; idx++) {
                    if (this.parent.definedNames[idx].name === address) {
                        isDefinedNamed = true;
                        break;
                    }
                }
            }
            if (isDefinedNamed) {
                var cellRef = void 0;
                cellRef = docContElem.getElementsByClassName('e-cont')[1].getElementsByClassName('e-text')[0];
                cellRef.setAttribute('readonly', 'true');
                cellRef.classList.add('e-disabled');
                cellRef.setAttribute('disabled', 'true');
                var treeCont = docContElem.getElementsByClassName('e-cont')[2];
                var listEle = treeCont.querySelectorAll('.e-list-item.e-level-1')[1];
                for (var idx = 0; idx < listEle.getElementsByTagName('li').length; idx++) {
                    if (listEle.getElementsByTagName('li')[idx].innerText === address) {
                        listEle.getElementsByTagName('li')[idx].classList.add('e-active');
                    }
                }
            }
            else {
                if (address && address.indexOf('!') !== -1) {
                    rangeArr = address.split('!');
                    sheetIdx = parseInt(rangeArr[0].replace(/\D/g, ''), 10) - 1;
                    sheet = this.parent.sheets[sheetIdx];
                }
                var sheetName = rangeArr[0];
                docContElem.getElementsByClassName('e-cont')[1].querySelector('.e-text').setAttribute('value', rangeArr[1]);
                var treeCont = docContElem.getElementsByClassName('e-cont')[2];
                var listEle = treeCont.querySelectorAll('.e-list-item.e-level-1')[0];
                for (var idx = 0; idx < listEle.getElementsByTagName('li').length; idx++) {
                    if (listEle.getElementsByTagName('li')[idx].innerText === sheetName) {
                        if (listEle.getElementsByTagName('li')[idx].classList.contains('e-active')) {
                            break;
                        }
                        else {
                            listEle.getElementsByTagName('li')[idx].classList.add('e-active');
                        }
                    }
                    else {
                        if (listEle.getElementsByTagName('li')[idx].classList.contains('e-active')) {
                            listEle.getElementsByTagName('li')[idx].classList.remove('e-active');
                        }
                    }
                }
            }
        }
        return dialog;
    };
    // tslint:disable-next-line:max-func-body-length
    SpreadsheetHyperlink.prototype.hyperlinkContent = function () {
        var l10n = this.parent.serviceLocator.getService(locale);
        var idx = 0;
        var selIdx = 0;
        var isWeb = true;
        var isDefinedName;
        var isCellRef = true;
        var address;
        var indexes = getRangeIndexes(this.parent.getActiveSheet().activeCell);
        var sheet = this.parent.getActiveSheet();
        var cell = getCell(indexes[0], indexes[1], sheet);
        var isEnable = true;
        if (cell) {
            if ((cell.value && typeof (cell.value) === 'string' && cell.value.match('[A-Za-z]+') !== null) ||
                cell.value === '' || isNullOrUndefined(cell.value)) {
                isEnable = true;
            }
            else {
                isEnable = false;
            }
            var hyperlink = cell.hyperlink;
            if (typeof (hyperlink) === 'string') {
                var hl = hyperlink;
                if (hl.indexOf('http://') === -1 && hl.indexOf('https://') === -1 && hl.indexOf('ftp://') === -1) {
                    address = hyperlink;
                    isWeb = false;
                }
            }
            else if (typeof (hyperlink) === 'object') {
                var hl = hyperlink.address;
                if (hl.indexOf('http://') === -1 && hl.indexOf('https://') === -1 && hl.indexOf('ftp://') === -1) {
                    address = hyperlink.address;
                    isWeb = false;
                }
            }
            if (isWeb) {
                selIdx = 0;
            }
            else {
                selIdx = 1;
            }
            if (this.parent.definedNames) {
                for (var idx_1 = 0; idx_1 < this.parent.definedNames.length; idx_1++) {
                    if (this.parent.definedNames[idx_1].name === address) {
                        isDefinedName = true;
                        isCellRef = false;
                        break;
                    }
                }
            }
        }
        var dialogElem = this.parent.createElement('div', { className: 'e-link-dialog' });
        var webContElem = this.parent.createElement('div', { className: 'e-webpage' });
        var docContElem = this.parent.createElement('div', { className: 'e-document' });
        var headerTabs = new Tab({
            selectedItem: selIdx,
            items: [
                {
                    header: { 'text': 'WEB PAGE' },
                    content: webContElem
                },
                {
                    header: { 'text': 'THIS DOCUMENT' },
                    content: docContElem
                },
            ]
        });
        headerTabs.appendTo(dialogElem);
        if (isWeb) {
            dialogElem.querySelector('.e-toolbar-items').querySelector('.e-indicator').setAttribute('style', 'left: 0; right: 136px');
        }
        else {
            dialogElem.querySelector('.e-toolbar-items').querySelector('.e-indicator').setAttribute('style', 'left: 136px; right: 0');
        }
        var textCont = this.parent.createElement('div', { className: 'e-cont' });
        var urlCont = this.parent.createElement('div', { className: 'e-cont' });
        var textH = this.parent.createElement('div', { className: 'e-header', innerHTML: 'Display Text' });
        var urlH = this.parent.createElement('div', { className: 'e-header', innerHTML: 'URL' });
        var textInput = this.parent.createElement('input', { className: 'e-input e-text', attrs: { 'type': 'Text' }, });
        if (!isEnable) {
            textInput.classList.add('e-disabled');
            textInput.setAttribute('readonly', 'true');
            textInput.setAttribute('disabled', 'true');
        }
        if (cell && isNullOrUndefined(cell.hyperlink)) {
            textInput.setAttribute('value', this.parent.getDisplayText(cell));
        }
        var urlInput = this.parent.createElement('input', { className: 'e-input e-text', attrs: { 'type': 'Text' } });
        textInput.setAttribute('placeholder', 'Enter the text to display');
        urlInput.setAttribute('placeholder', 'Enter the URL');
        textCont.appendChild(textInput);
        textCont.insertBefore(textH, textInput);
        urlCont.appendChild(urlInput);
        urlCont.insertBefore(urlH, urlInput);
        webContElem.appendChild(urlCont);
        webContElem.insertBefore(textCont, urlCont);
        var cellRef = [];
        var definedName = [];
        var sheets = this.parent.sheets;
        for (idx; idx < this.parent.sheets.length; idx++) {
            var sheetName = this.parent.sheets[idx].name;
            if (sheets[idx] === this.parent.getActiveSheet()) {
                cellRef.push({
                    nodeId: 'sheet',
                    nodeText: sheetName.indexOf(' ') !== -1 ? '\'' + sheetName + '\'' : sheetName,
                    selected: true
                });
            }
            else {
                cellRef.push({
                    nodeId: 'sheet',
                    nodeText: sheetName.indexOf(' ') !== -1 ? '\'' + sheetName + '\'' : sheetName
                });
            }
        }
        for (idx = 0; idx < this.parent.definedNames.length; idx++) {
            definedName.push({
                nodeId: 'defName',
                nodeText: this.parent.definedNames[idx].name
            });
        }
        var data = [
            {
                nodeId: '01', nodeText: 'Cell Reference', expanded: isCellRef,
                nodeChild: cellRef
            },
            {
                nodeId: '02', nodeText: 'Defined Names', expanded: isDefinedName,
                nodeChild: definedName
            },
        ];
        var treeObj = new TreeView({
            fields: { dataSource: data, id: 'nodeId', text: 'nodeText', child: 'nodeChild' }
        });
        var cellrefCont = this.parent.createElement('div', { className: 'e-cont' });
        var cellrefH = this.parent.createElement('div', { className: 'e-header', innerHTML: 'Cell Reference' });
        var cellrefInput = this.parent.createElement('input', {
            className: 'e-input e-text e-hyp-text',
            attrs: { 'type': 'Text' }
        });
        cellrefInput.setAttribute('value', 'A1');
        cellrefCont.appendChild(cellrefInput);
        cellrefCont.insertBefore(cellrefH, cellrefInput);
        var textCont1 = this.parent.createElement('div', { className: 'e-cont' });
        var textH1 = this.parent.createElement('div', { className: 'e-header', innerHTML: 'Display Text' });
        var textInput1 = this.parent.createElement('input', { className: 'e-input e-text', attrs: { 'type': 'Text' } });
        if (!isEnable) {
            textInput1.classList.add('e-disabled');
            textInput1.setAttribute('readonly', 'true');
            textInput1.setAttribute('disabled', 'true');
        }
        if (cell && isNullOrUndefined(cell.hyperlink)) {
            textInput1.setAttribute('value', this.parent.getDisplayText(cell));
        }
        textInput1.setAttribute('placeholder', 'Enter the text to display');
        textCont1.appendChild(textInput1);
        textCont1.insertBefore(textH1, textInput1);
        var sheetCont = this.parent.createElement('div', { className: 'e-cont' });
        var sheetH = this.parent.createElement('div', { className: 'e-header', innerHTML: 'Sheet' });
        var refCont = this.parent.createElement('div', { className: 'e-refcont' });
        sheetCont.appendChild(refCont);
        sheetCont.insertBefore(sheetH, refCont);
        docContElem.appendChild(cellrefCont);
        docContElem.insertBefore(textCont1, cellrefCont);
        treeObj.appendTo(refCont);
        docContElem.appendChild(sheetCont);
        return dialogElem;
    };
    return SpreadsheetHyperlink;
}());
export { SpreadsheetHyperlink };
