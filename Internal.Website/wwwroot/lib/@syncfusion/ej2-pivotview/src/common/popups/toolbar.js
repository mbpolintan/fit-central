import { Toolbar as tool, Menu } from '@syncfusion/ej2-navigations';
import { remove, createElement, formatUnit, isBlazor, getInstance, addClass, removeClass } from '@syncfusion/ej2-base';
import * as events from '../../common/base/constant';
import { Dialog } from '@syncfusion/ej2-popups';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import * as cls from '../../common/base/css-constant';
import { Deferred } from '@syncfusion/ej2-data';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { PivotUtil } from '../../base/util';
/**
 * Module for Toolbar
 */
/** @hidden */
var Toolbar = /** @class */ (function () {
    function Toolbar(parent) {
        /** @hidden */
        this.isMultiAxisChange = false;
        this.currentReport = '';
        this.parent = parent;
        this.parent.toolbarModule = this;
        this.addEventListener();
    }
    /**
     * It returns the Module name.
     * @returns string
     * @hidden
     */
    Toolbar.prototype.getModuleName = function () {
        return 'toolbar';
    };
    Toolbar.prototype.createToolbar = function () {
        this.parent.isModified = false;
        this.renderDialog();
        if (document.querySelector('#' + this.parent.element.id + 'pivot-toolbar') !== null) {
            remove(document.querySelector('#' + this.parent.element.id + 'pivot-toolbar'));
        }
        var element = createElement('div', {
            id: this.parent.element.id + 'pivot-toolbar',
            className: cls.GRID_TOOLBAR
        });
        if (this.parent.showFieldList && this.parent.element.querySelector('#' + this.parent.element.id + '_PivotFieldList')) {
            this.parent.element.insertBefore(element, this.parent.element.querySelector('#' + this.parent.element.id + '_PivotFieldList'));
        }
        else if (this.parent.showGroupingBar &&
            this.parent.element.querySelector('#' + this.parent.element.id + ' .' + 'e-pivot-grouping-bar')) {
            this.parent.element.insertBefore(element, this.parent.element.querySelector('#' + this.parent.element.id + ' .' + 'e-pivot-grouping-bar'));
        }
        else {
            this.parent.element.insertBefore(element, this.parent.element.querySelector('#' + this.parent.element.id + '_grid'));
        }
        this.toolbar = new tool({
            created: this.create.bind(this),
            enableRtl: this.parent.enableRtl,
            items: this.getItems(),
            allowKeyboard: false,
        });
        this.toolbar.isStringTemplate = true;
        this.toolbar.appendTo('#' + this.parent.element.id + 'pivot-toolbar');
        this.toolbar.width = this.parent.grid ? (this.parent.getGridWidthAsNumber() - 2) : (this.parent.getWidthAsNumber() - 2);
        if (this.parent.chart) {
            this.parent.chart.setProperties({ width: this.parent.grid ? this.parent.getGridWidthAsNumber().toString() : this.parent.getWidthAsNumber().toString() }, true);
        }
        if (this.parent.showGroupingBar && this.parent.groupingBarModule &&
            this.parent.element.querySelector('.' + cls.GROUPING_BAR_CLASS)) {
            this.parent.groupingBarModule.refreshUI();
        }
    };
    Toolbar.prototype.fetchReports = function () {
        /* tslint:disable:no-any */
        var reports = { reportName: [] };
        var tool = this;
        if (isBlazor()) {
            reports = this.fetchReportsArgs();
            reports.then(function (e) {
                tool.reportList.dataSource = e.reportName;
                return e;
            });
        }
        else {
            /* tslint:enable:no-any */
            this.parent.trigger(events.fetchReport, reports);
        }
        return reports;
    };
    Toolbar.prototype.fetchReportsArgs = function () {
        var callbackPromise = new Deferred();
        var reports = { reportName: [] };
        this.parent.trigger(events.fetchReport, reports, function (observedArgs) {
            callbackPromise.resolve(observedArgs);
        });
        return callbackPromise;
    };
    /* tslint:disable */
    Toolbar.prototype.getItems = function () {
        var toolbar = this.parent.toolbar.filter(function (v, i, a) { return a.indexOf(v) === i; });
        var items = [];
        for (var _i = 0, toolbar_1 = toolbar; _i < toolbar_1.length; _i++) {
            var item = toolbar_1[_i];
            switch (item) {
                case 'New':
                    items.push({
                        prefixIcon: cls.GRID_NEW + ' ' + cls.ICON, tooltipText: this.parent.localeObj.getConstant('new'),
                        click: this.actionClick.bind(this), id: this.parent.element.id + 'new'
                    });
                    break;
                case 'Save':
                    items.push({
                        prefixIcon: cls.GRID_SAVE + ' ' + cls.ICON, tooltipText: this.parent.localeObj.getConstant('save'),
                        click: this.actionClick.bind(this), id: this.parent.element.id + 'save'
                    });
                    break;
                case 'SaveAs':
                    items.push({
                        prefixIcon: cls.GRID_SAVEAS + ' ' + cls.ICON, tooltipText: this.parent.localeObj.getConstant('saveAs'),
                        click: this.actionClick.bind(this), id: this.parent.element.id + 'saveas'
                    });
                    break;
                case 'Rename':
                    items.push({
                        prefixIcon: cls.GRID_RENAME + ' ' + cls.ICON, tooltipText: this.parent.localeObj.getConstant('rename'),
                        click: this.actionClick.bind(this), id: this.parent.element.id + 'rename'
                    });
                    break;
                case 'Remove':
                    items.push({
                        prefixIcon: cls.GRID_REMOVE + ' ' + cls.ICON, tooltipText: this.parent.localeObj.getConstant('deleteReport'),
                        click: this.actionClick.bind(this), id: this.parent.element.id + 'remove'
                    });
                    break;
                case 'Load':
                    items.push({
                        template: '<div><input class=' + cls.GRID_LOAD + ' id=' + this.parent.element.id + '_reportlist></input></div>',
                        click: this.actionClick.bind(this),
                        id: this.parent.element.id + 'load'
                    });
                    break;
                case 'Grid':
                    var toDisable = this.parent.displayOption.view === 'Chart';
                    items.push({
                        prefixIcon: cls.TOOLBAR_GRID + ' ' + cls.ICON, tooltipText: this.parent.localeObj.getConstant('grid'),
                        id: this.parent.element.id + 'grid', cssClass: toDisable ? cls.MENU_DISABLE : '',
                        click: this.menuItemClick.bind(this)
                    });
                    break;
                case 'Chart':
                    var validTypes = (this.parent.displayOption.view === 'Table');
                    items.push({
                        template: '<ul id="' + this.parent.element.id + 'chart_menu"></ul>',
                        id: this.parent.element.id + 'chartmenu', cssClass: validTypes ? cls.MENU_DISABLE : ''
                    });
                    break;
                case 'MDX':
                    if (this.parent.dataType === 'olap') {
                        items.push({
                            prefixIcon: cls.GRID_MDX + ' ' + cls.ICON, id: this.parent.element.id + 'mdxQuery',
                            click: this.actionClick.bind(this), tooltipText: this.parent.localeObj.getConstant('mdxQuery')
                        });
                    }
                    break;
                case 'Export':
                    items.push({
                        template: '<ul id="' + this.parent.element.id + 'export_menu"></ul>',
                        id: this.parent.element.id + 'exportmenu'
                    });
                    break;
                case 'SubTotal':
                    items.push({
                        template: '<ul id="' + this.parent.element.id + 'subtotal_menu"></ul>',
                        id: this.parent.element.id + 'subtotalmenu'
                    });
                    break;
                case 'GrandTotal':
                    items.push({
                        template: '<ul id="' + this.parent.element.id + 'grandtotal_menu"></ul>',
                        id: this.parent.element.id + 'grandtotalmenu'
                    });
                    break;
                case 'ConditionalFormatting':
                    items.push({
                        prefixIcon: cls.GRID_FORMATTING + ' ' + cls.ICON, id: this.parent.element.id + 'formatting',
                        click: this.actionClick.bind(this), tooltipText: this.parent.localeObj.getConstant('toolbarFormatting')
                    });
                    break;
                case 'NumberFormatting':
                    items.push({
                        prefixIcon: cls.FORMATTING_TOOLBAR + ' ' + cls.ICON, id: this.parent.element.id + 'numberFormatting',
                        click: this.actionClick.bind(this), tooltipText: this.parent.localeObj.getConstant('numberFormat')
                    });
                    break;
                case 'Formatting':
                    items.push({
                        template: '<ul id="' + this.parent.element.id + 'formatting_menu"></ul>',
                        id: this.parent.element.id + 'formattingmenu'
                    });
                    break;
                case 'FieldList':
                    items.push({
                        prefixIcon: cls.TOOLBAR_FIELDLIST + ' ' + cls.ICON, tooltipText: this.parent.localeObj.getConstant('fieldList'),
                        click: this.actionClick.bind(this), align: 'Right', id: this.parent.element.id + 'fieldlist'
                    });
                    if (this.parent.element.querySelector('.e-toggle-field-list')) {
                        this.parent.element.querySelector('.e-toggle-field-list').style.display = 'none';
                    }
                    break;
            }
        }
        if (this.parent.showFieldList && toolbar.indexOf('FieldList') === -1 && this.parent.element.querySelector('#' + this.parent.element.id + '_PivotFieldList') &&
            this.parent.element.querySelector('#' + this.parent.element.id + '_PivotFieldList').style.display === 'none') {
            this.parent.element.querySelector('#' + this.parent.element.id + '_PivotFieldList').style.display = 'block';
        }
        var toolbarArgs = { customToolbar: items };
        this.parent.trigger(events.toolbarRender, toolbarArgs);
        return items;
    };
    /* tslint:enable */
    Toolbar.prototype.reportChange = function (args) {
        this.dropArgs = args;
        if (this.parent.isModified && this.currentReport !== '') {
            this.createConfirmDialog(this.parent.localeObj.getConstant('alert'), this.parent.localeObj.getConstant('newReportConfirm'));
        }
        else {
            this.reportLoad(args);
        }
    };
    Toolbar.prototype.reportLoad = function (args) {
        var _this_1 = this;
        if (this.action !== 'Save' && this.action !== 'Rename' && this.action !== 'New') {
            var loadArgs = {
                reportName: args.itemData.value
            };
            this.parent.trigger(events.loadReport, loadArgs, function (observedArgs) {
                _this_1.currentReport = observedArgs.reportName;
                _this_1.parent.isModified = false;
            });
        }
    };
    Toolbar.prototype.saveReport = function (args) {
        if (this.currentReport && this.currentReport !== '' && args.item.id === (this.parent.element.id + 'save')) {
            var saveArgs = {
                report: this.parent.getPersistData(),
                reportName: this.currentReport
            };
            this.parent.trigger(events.saveReport, saveArgs);
            this.parent.isModified = false;
        }
        else if (this.currentReport === '' && (args.item.id === (this.parent.element.id + 'save') || args.item.id === (this.parent.element.id + 'saveas'))) {
            this.parent.pivotCommon.errorDialog.createErrorDialog(this.parent.localeObj.getConstant('error'), this.parent.localeObj.getConstant('emptyReport'));
            return;
        }
        else {
            this.dialogShow(args, 'saveAs');
        }
    };
    Toolbar.prototype.mdxQueryDialog = function (args) {
        if (!(this.mdxDialog && !this.mdxDialog.isDestroyed)) {
            this.renderMDXDialog();
        }
        var outerDiv = createElement('div', {
            className: cls.MDX_QUERY
        });
        var textarea = createElement('textarea', {
            className: cls.MDX_QUERY_CONTENT,
            innerHTML: this.parent.olapEngineModule.getMDXQuery(this.parent.dataSourceSettings).trim(),
            attrs: { 'readonly': 'readonly' }
        });
        outerDiv.appendChild(textarea);
        this.mdxDialog.content = outerDiv;
        this.mdxDialog.show();
    };
    Toolbar.prototype.dialogShow = function (args, action) {
        if (args) {
            this.dialog.header = args.item.tooltipText;
            var outerDiv = createElement('div', {
                className: cls.GRID_REPORT_OUTER
            });
            var label = createElement('div', {
                className: cls.GRID_REPORT_LABEL,
                innerHTML: this.parent.localeObj.getConstant('reportName')
            });
            var input = createElement('input', {
                className: cls.GRID_REPORT_INPUT + ' ' + cls.INPUT,
                innerHTML: (action && action === 'rename' ? this.currentReport : ''),
                attrs: {
                    'placeholder': this.parent.localeObj.getConstant('emptyReportName'),
                    'value': (action && action === 'rename' ? this.currentReport : '')
                },
            });
            input.setSelectionRange(input.textContent.length, input.textContent.length);
            outerDiv.appendChild(label);
            outerDiv.appendChild(input);
            this.dialog.content = outerDiv;
            this.dialog.refresh();
            this.dialog.show();
        }
    };
    Toolbar.prototype.renameReport = function (args) {
        this.parent.trigger(events.toolbarClick, args);
        if (this.currentReport && this.currentReport !== '') {
            this.dialogShow(args, 'rename');
        }
        else {
            this.parent.pivotCommon.errorDialog.createErrorDialog(this.parent.localeObj.getConstant('error'), this.parent.localeObj.getConstant('emptyReport'));
            return;
        }
    };
    Toolbar.prototype.actionClick = function (args) {
        switch (args.item.id) {
            case (this.parent.element.id + 'save'):
            case (this.parent.element.id + 'saveas'):
                this.saveReport(args);
                break;
            case (this.parent.element.id + 'remove'):
                this.action = 'Remove';
                if (this.currentReport && this.currentReport !== '') {
                    this.createConfirmDialog(this.parent.localeObj.getConstant('alert'), this.parent.localeObj.getConstant('removeConfirm'));
                }
                else {
                    this.parent.pivotCommon.errorDialog.createErrorDialog(this.parent.localeObj.getConstant('error'), this.parent.localeObj.getConstant('emptyReport'));
                }
                return;
            case (this.parent.element.id + 'rename'):
                this.renameReport(args);
                break;
            case (this.parent.element.id + 'new'):
                this.action = 'New';
                this.newArgs = args;
                if (this.parent.isModified && this.currentReport && this.currentReport !== '') {
                    this.createConfirmDialog(this.parent.localeObj.getConstant('alert'), this.parent.localeObj.getConstant('newReportConfirm'));
                }
                else {
                    this.createNewReport(args);
                }
                break;
            case (this.parent.element.id + 'load'):
                this.action = 'Load';
                break;
            case (this.parent.element.id + 'fieldlist'):
                if (this.parent.pivotFieldListModule && this.parent.pivotFieldListModule.dialogRenderer) {
                    this.parent.pivotFieldListModule.dialogRenderer.fieldListDialog.show();
                }
                break;
            case (this.parent.element.id + 'formatting'):
                if (this.parent.conditionalFormattingModule) {
                    this.parent.conditionalFormattingModule.showConditionalFormattingDialog();
                }
                break;
            case (this.parent.element.id + 'mdxQuery'):
                this.mdxQueryDialog(args);
                break;
            case (this.parent.element.id + 'numberFormatting'):
                if (this.parent.numberFormattingModule) {
                    this.parent.numberFormattingModule.showNumberFormattingDialog();
                }
                break;
        }
    };
    Toolbar.prototype.renderDialog = function () {
        if (document.querySelector('#' + this.parent.element.id + 'report-dialog') !== null) {
            remove(document.querySelector('#' + this.parent.element.id + 'report-dialog'));
        }
        this.parent.element.appendChild(createElement('div', {
            id: this.parent.element.id + 'report-dialog',
            className: cls.GRID_REPORT_DIALOG
        }));
        this.dialog = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: true,
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    click: this.okBtnClick.bind(this),
                    buttonModel: {
                        content: this.parent.localeObj.getConstant('ok'),
                        isPrimary: true
                    }
                },
                {
                    click: this.cancelBtnClick.bind(this),
                    buttonModel: {
                        content: this.parent.localeObj.getConstant('cancel')
                    }
                }
            ],
            isModal: true,
            visible: false,
            showCloseIcon: true,
            enableRtl: this.parent.enableRtl,
            width: 'auto',
            height: 'auto',
            zIndex: 1000001,
            closeOnEscape: true,
            target: document.body
        });
        this.dialog.isStringTemplate = true;
        this.dialog.appendTo('#' + this.parent.element.id + 'report-dialog');
    };
    Toolbar.prototype.renderMDXDialog = function () {
        if (document.querySelector('#' + this.parent.element.id + 'mdx-dialog') !== null) {
            remove(document.querySelector('#' + this.parent.element.id + 'mdx-dialog'));
        }
        this.parent.element.appendChild(createElement('div', {
            id: this.parent.element.id + 'mdx-dialog',
            className: cls.GRID_MDX_DIALOG
        }));
        this.mdxDialog = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: true,
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    click: this.copyMDXQuery.bind(this),
                    buttonModel: {
                        content: this.parent.localeObj.getConstant('copy'),
                        isPrimary: true
                    }
                }
            ],
            header: this.parent.localeObj.getConstant('mdxQuery'),
            isModal: true,
            visible: false,
            showCloseIcon: true,
            enableRtl: this.parent.enableRtl,
            width: 'auto',
            height: 'auto',
            zIndex: 1000001,
            closeOnEscape: true,
            target: document.body
        });
        this.mdxDialog.isStringTemplate = true;
        this.mdxDialog.appendTo('#' + this.parent.element.id + 'mdx-dialog');
    };
    Toolbar.prototype.copyMDXQuery = function () {
        var textArea = this.mdxDialog.element.querySelector('.' + cls.MDX_QUERY_CONTENT);
        try {
            textArea.select();
            document.execCommand('copy');
        }
        catch (err) {
            window.alert('Oops, unable to copy');
        }
        return;
    };
    Toolbar.prototype.okBtnClick = function () {
        var reportInput = this.dialog.element.querySelector('.' + cls.GRID_REPORT_INPUT);
        if (reportInput && reportInput.value === '') {
            reportInput.focus();
            return;
        }
        if ((this.dialog.header === this.parent.localeObj.getConstant('save') ||
            this.dialog.header === this.parent.localeObj.getConstant('saveAs')) &&
            reportInput.value && reportInput.value !== '') {
            this.action = 'Save';
            this.currentReport = reportInput.value;
            var isExist_1 = false;
            /* tslint:disable */
            var _this_2 = this;
            /* tslint:enable */
            var reports = { reportName: [] };
            this.parent.trigger(events.fetchReport, reports, function (observedArgs) {
                for (var i = 0; i < observedArgs.reportName.length; i++) {
                    if (reportInput.value === observedArgs.reportName[i]) {
                        isExist_1 = true;
                        break;
                    }
                }
                if (isExist_1) {
                    _this_2.createConfirmDialog(_this_2.parent.localeObj.getConstant('alert'), _this_2.parent.localeObj.getConstant('replaceConfirmBefore') + '"' + reportInput.value + '"' +
                        _this_2.parent.localeObj.getConstant('replaceConfirmAfter'));
                    return;
                }
                var saveArgs = {
                    report: _this_2.parent.getPersistData(),
                    reportName: reportInput.value
                };
                _this_2.parent.trigger(events.saveReport, saveArgs);
                _this_2.parent.isModified = false;
                _this_2.updateReportList();
                _this_2.dialog.hide();
            });
        }
        else if (this.dialog.header === this.parent.localeObj.getConstant('new') &&
            reportInput.value && reportInput.value !== '') {
            this.action = 'New';
            this.currentReport = reportInput.value;
            var isExist_2 = false;
            /* tslint:disable */
            var _this_3 = this;
            /* tslint:enable */
            var reports_1 = { reportName: [] };
            this.parent.trigger(events.fetchReport, reports_1, function (observedArgs) {
                for (var i = 0; i < observedArgs.reportName.length; i++) {
                    if (reportInput.value === reports_1.reportName[i]) {
                        isExist_2 = true;
                        break;
                    }
                }
                if (isExist_2) {
                    _this_3.createConfirmDialog(_this_3.parent.localeObj.getConstant('alert'), _this_3.parent.localeObj.getConstant('replaceConfirmBefore') + '"' + reportInput.value + '"' +
                        _this_3.parent.localeObj.getConstant('replaceConfirmAfter'));
                    return;
                }
                _this_3.parent.trigger(events.newReport);
                if (isBlazor()) {
                    _this_3.parent.setProperties({ dataSourceSettings: { columns: [], rows: [], values: [], filters: [] } }, false);
                }
                var saveArgs = {
                    report: _this_3.parent.getPersistData(),
                    reportName: reportInput.value
                };
                _this_3.parent.trigger(events.saveReport, saveArgs);
                _this_3.parent.isModified = false;
                _this_3.updateReportList();
                _this_3.dialog.hide();
            });
        }
        else if (this.dialog.header === this.parent.localeObj.getConstant('rename') && reportInput.value && reportInput.value !== '') {
            if (this.currentReport === reportInput.value) {
                this.dialog.hide();
                return;
            }
            this.action = 'Rename';
            var isExist_3 = false;
            /* tslint:disable */
            var _this_4 = this;
            /* tslint:enable */
            var reports = { reportName: [] };
            this.parent.trigger(events.fetchReport, reports, function (observedArgs) {
                _this_4.renameText = reportInput.value;
                for (var i = 0; i < observedArgs.reportName.length; i++) {
                    if (reportInput.value === observedArgs.reportName[i]) {
                        isExist_3 = true;
                        break;
                    }
                }
                if (isExist_3) {
                    _this_4.createConfirmDialog(_this_4.parent.localeObj.getConstant('alert'), _this_4.parent.localeObj.getConstant('replaceConfirmBefore') + '"' + reportInput.value + '"' +
                        _this_4.parent.localeObj.getConstant('replaceConfirmAfter'));
                    return;
                }
                var renameArgs = {
                    reportName: _this_4.currentReport,
                    rename: reportInput.value
                };
                _this_4.parent.trigger(events.renameReport, renameArgs);
                _this_4.currentReport = reportInput.value;
                _this_4.updateReportList();
                _this_4.dialog.hide();
            });
        }
    };
    Toolbar.prototype.createNewReport = function (args) {
        this.dialogShow(args);
    };
    Toolbar.prototype.cancelBtnClick = function () {
        this.dialog.hide();
    };
    Toolbar.prototype.createConfirmDialog = function (title, description) {
        if (document.getElementById(this.parent.element.id + '_ConfirmDialog')) {
            remove(document.getElementById(this.parent.element.id + '_ConfirmDialog').parentElement);
        }
        var errorDialog = createElement('div', {
            id: this.parent.element.id + '_ConfirmDialog',
            className: cls.ERROR_DIALOG_CLASS
        });
        this.parent.element.appendChild(errorDialog);
        this.confirmPopUp = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: true,
            showCloseIcon: true,
            enableRtl: this.parent.enableRtl,
            header: title,
            content: description,
            isModal: true,
            visible: true,
            closeOnEscape: true,
            target: document.body,
            width: 'auto',
            height: 'auto',
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    buttonModel: {
                        content: this.parent.localeObj.getConstant('yes'), isPrimary: true,
                        cssClass: cls.OK_BUTTON_CLASS
                    },
                    click: this.okButtonClick.bind(this)
                },
                {
                    buttonModel: {
                        content: this.parent.localeObj.getConstant('no'),
                        cssClass: cls.CANCEL_BUTTON_CLASS
                    },
                    click: this.cancelButtonClick.bind(this)
                }
            ]
        });
        this.confirmPopUp.isStringTemplate = true;
        this.confirmPopUp.appendTo(errorDialog);
        this.confirmPopUp.element.querySelector('.e-dlg-header').innerHTML = title;
    };
    Toolbar.prototype.okButtonClick = function () {
        var _this_1 = this;
        if (this.action === 'Remove') {
            var removeArgs = {
                reportName: this.currentReport
            };
            this.parent.trigger(events.removeReport, removeArgs);
            var reports = this.fetchReports();
            if (reports.reportName && reports.reportName.length > 0) {
                var loadArgs = {
                    reportName: reports.reportName[reports.reportName.length - 1]
                };
                this.parent.trigger(events.loadReport, loadArgs, function (observedArgs) {
                    _this_1.currentReport = observedArgs.reportName;
                    _this_1.parent.isModified = false;
                });
                this.currentReport = reports.reportName[reports.reportName.length - 1];
            }
            else {
                this.currentReport = '';
                this.parent.isModified = false;
                this.action = '';
            }
            this.updateReportList();
        }
        else if (this.action === 'New' || (this.action !== 'Save' && this.action !== 'Rename' && this.action !== 'New')) {
            if (this.currentReport && this.currentReport !== '' && this.parent.isModified) {
                var saveArgs = {
                    report: this.parent.getPersistData(),
                    reportName: this.currentReport
                };
                this.parent.trigger(events.saveReport, saveArgs);
                this.parent.isModified = false;
                if (this.action === 'New') {
                    this.createNewReport(this.newArgs);
                }
                else {
                    this.reportLoad(this.dropArgs);
                }
            }
            else if (this.action === 'New') {
                this.parent.trigger(events.newReport);
                if (isBlazor()) {
                    this.parent.setProperties({ dataSourceSettings: { columns: [], rows: [], values: [], filters: [] } }, false);
                }
                var saveArgs = {
                    report: this.parent.getPersistData(),
                    reportName: this.currentReport
                };
                this.parent.trigger(events.saveReport, saveArgs);
                this.parent.isModified = false;
                this.updateReportList();
                this.dialog.hide();
            }
        }
        else if (this.action === 'Save') {
            var saveArgs = {
                report: this.parent.getPersistData(),
                reportName: this.currentReport
            };
            this.parent.trigger(events.saveReport, saveArgs);
            this.parent.isModified = false;
            this.updateReportList();
            this.dialog.hide();
        }
        else if (this.action === 'Rename') {
            var renameArgs = {
                reportName: this.currentReport,
                rename: this.renameText,
                isReportExists: true
            };
            this.parent.trigger(events.renameReport, renameArgs);
            this.currentReport = this.renameText;
            this.parent.isModified = false;
            this.updateReportList();
            this.dialog.hide();
        }
        this.confirmPopUp.hide();
    };
    Toolbar.prototype.cancelButtonClick = function () {
        if (this.action === 'New') {
            if (this.parent.isModified) {
                this.createNewReport(this.newArgs);
            }
            else {
                this.dialog.hide();
            }
        }
        else if (this.action === 'Save') {
            this.currentReport = this.reportList.value;
            this.dialog.hide();
        }
        else if (this.action === 'Rename') {
            this.dialog.hide();
        }
        else if (this.dropArgs && this.action !== 'Remove') {
            this.reportLoad(this.dropArgs);
        }
        this.confirmPopUp.hide();
    };
    /**
     * @hidden
     */
    Toolbar.prototype.createChartMenu = function () {
        var _this_1 = this;
        if (document.querySelector('#' + this.parent.element.id + 'chart_menu')) {
            var menuItems = [];
            var types = this.getValidChartType();
            for (var i = 0; (i < types.length && i < 7); i++) {
                var type = types[i];
                menuItems.push({
                    text: this.parent.localeObj.getConstant(type.toLowerCase()),
                    id: this.parent.element.id + '_' + type,
                });
            }
            if (menuItems.length === 7) {
                menuItems.splice(6);
                menuItems.push({
                    text: this.parent.localeObj.getConstant('MoreOption'),
                    id: this.parent.element.id + '_' + 'ChartMoreOption',
                });
            }
            var toDisable = (menuItems.length <= 0 || this.parent.displayOption.view === 'Table');
            menuItems.push({
                separator: true
            });
            menuItems.push({
                text: this.parent.localeObj.getConstant('multipleAxes'),
                id: this.parent.element.id + '_' + 'multipleAxes'
            });
            menuItems.push({
                text: this.parent.localeObj.getConstant('showLegend'),
                id: this.parent.element.id + '_' + 'showLegend'
            });
            var menu = [{
                    iconCss: cls.TOOLBAR_CHART + ' ' + cls.ICON,
                    items: toDisable ? [] : menuItems,
                }];
            if (this.chartMenu && !this.chartMenu.isDestroyed) {
                this.chartMenu.destroy();
            }
            this.chartMenu = new Menu({
                items: menu, enableRtl: this.parent.enableRtl,
                select: this.menuItemClick.bind(this),
                beforeOpen: this.whitespaceRemove.bind(this),
                onClose: function (args) {
                    _this_1.focusToolBar();
                },
                beforeItemRender: this.multipleAxesCheckbox.bind(this)
            });
            this.chartMenu.isStringTemplate = true;
            this.chartMenu.appendTo('#' + this.parent.element.id + 'chart_menu');
        }
    };
    /* tslint:disable:max-func-body-length */
    Toolbar.prototype.create = function () {
        var _this_1 = this;
        if (this.parent.element.querySelector('#' + this.parent.element.id + 'chart_menu')) {
            this.createChartMenu();
        }
        if (this.parent.element.querySelector('#' + this.parent.element.id + 'export_menu')) {
            var menu = [{
                    iconCss: cls.GRID_EXPORT + ' ' + cls.ICON,
                    items: [
                        {
                            text: this.parent.localeObj.getConstant('pdf'),
                            iconCss: cls.GRID_PDF_EXPORT + ' ' + cls.ICON,
                            id: this.parent.element.id + 'pdf'
                        },
                        {
                            text: this.parent.localeObj.getConstant('excel'),
                            iconCss: cls.GRID_EXCEL_EXPORT + ' ' + cls.ICON,
                            id: this.parent.element.id + 'excel'
                        },
                        {
                            text: this.parent.localeObj.getConstant('csv'),
                            iconCss: cls.GRID_CSV_EXPORT + ' ' + cls.ICON,
                            id: this.parent.element.id + 'csv'
                        },
                        {
                            text: this.parent.localeObj.getConstant('png'),
                            iconCss: cls.GRID_PNG_EXPORT + ' ' + cls.ICON,
                            id: this.parent.element.id + 'png'
                        },
                        {
                            text: this.parent.localeObj.getConstant('jpeg'),
                            iconCss: cls.GRID_JPEG_EXPORT + ' ' + cls.ICON,
                            id: this.parent.element.id + 'jpeg'
                        },
                        {
                            text: this.parent.localeObj.getConstant('svg'),
                            iconCss: cls.GRID_SVG_EXPORT + ' ' + cls.ICON,
                            id: this.parent.element.id + 'svg'
                        }
                    ]
                }];
            this.exportMenu = new Menu({
                items: menu, enableRtl: this.parent.enableRtl,
                select: this.menuItemClick.bind(this), beforeOpen: this.updateExportMenu.bind(this),
                onClose: function (args) {
                    _this_1.focusToolBar();
                }
            });
            this.exportMenu.isStringTemplate = true;
            this.exportMenu.appendTo('#' + this.parent.element.id + 'export_menu');
        }
        if (this.parent.element.querySelector('#' + this.parent.element.id + 'subtotal_menu')) {
            var menu = [{
                    iconCss: cls.GRID_SUB_TOTAL + ' ' + cls.ICON,
                    items: [
                        {
                            text: this.parent.localeObj.getConstant('showSubTotals'),
                            id: this.parent.element.id + 'subtotal',
                            iconCss: cls.PIVOT_SELECT_ICON + ' ' + cls.ICON
                        },
                        {
                            text: this.parent.localeObj.getConstant('doNotShowSubTotals'),
                            id: this.parent.element.id + 'notsubtotal',
                            iconCss: cls.PIVOT_SELECT_ICON + ' ' + cls.ICON
                        },
                        {
                            text: this.parent.localeObj.getConstant('showSubTotalsRowsOnly'),
                            id: this.parent.element.id + 'subtotalrow',
                            iconCss: cls.PIVOT_SELECT_ICON + ' ' + cls.ICON
                        },
                        {
                            text: this.parent.localeObj.getConstant('showSubTotalsColumnsOnly'),
                            id: this.parent.element.id + 'subtotalcolumn',
                            iconCss: cls.PIVOT_SELECT_ICON + ' ' + cls.ICON
                        },
                    ]
                }];
            this.subTotalMenu = new Menu({
                items: menu, enableRtl: this.parent.enableRtl,
                select: this.menuItemClick.bind(this), beforeOpen: this.updateSubtotalSelection.bind(this),
                onClose: function (args) {
                    _this_1.focusToolBar();
                }
            });
            this.subTotalMenu.isStringTemplate = true;
            this.subTotalMenu.appendTo('#' + this.parent.element.id + 'subtotal_menu');
        }
        if (this.parent.element.querySelector('#' + this.parent.element.id + 'grandtotal_menu')) {
            var menu = [{
                    iconCss: cls.GRID_GRAND_TOTAL + ' ' + cls.ICON,
                    items: [
                        {
                            text: this.parent.localeObj.getConstant('showGrandTotals'),
                            id: this.parent.element.id + 'grandtotal',
                            iconCss: cls.PIVOT_SELECT_ICON + ' ' + cls.ICON
                        },
                        {
                            text: this.parent.localeObj.getConstant('doNotShowGrandTotals'),
                            id: this.parent.element.id + 'notgrandtotal',
                            iconCss: cls.PIVOT_SELECT_ICON + ' ' + cls.ICON
                        },
                        {
                            text: this.parent.localeObj.getConstant('showGrandTotalsRowsOnly'),
                            id: this.parent.element.id + 'grandtotalrow',
                            iconCss: cls.PIVOT_SELECT_ICON + ' ' + cls.ICON
                        },
                        {
                            text: this.parent.localeObj.getConstant('showGrandTotalsColumnsOnly'),
                            id: this.parent.element.id + 'grandtotalcolumn',
                            iconCss: cls.PIVOT_SELECT_ICON + ' ' + cls.ICON
                        },
                    ]
                }];
            this.grandTotalMenu = new Menu({
                items: menu, enableRtl: this.parent.enableRtl,
                select: this.menuItemClick.bind(this), beforeOpen: this.updateGrandtotalSelection.bind(this),
                onClose: function (args) {
                    _this_1.focusToolBar();
                }
            });
            this.grandTotalMenu.isStringTemplate = true;
            this.grandTotalMenu.appendTo('#' + this.parent.element.id + 'grandtotal_menu');
        }
        if (this.parent.element.querySelector('#' + this.parent.element.id + 'formatting_menu')) {
            var menu = [{
                    iconCss: cls.FORMATTING_MENU + ' ' + cls.ICON,
                    items: [
                        {
                            text: this.parent.localeObj.getConstant('numberFormatMenu'),
                            iconCss: cls.NUMBER_FORMATTING_MENU + ' ' + cls.ICON,
                            id: this.parent.element.id + 'numberFormattingMenu'
                        },
                        {
                            text: this.parent.localeObj.getConstant('conditionalFormatingMenu'),
                            iconCss: cls.CONDITIONAL_FORMATTING_MENU + ' ' + cls.ICON,
                            id: this.parent.element.id + 'conditionalFormattingMenu'
                        }
                    ]
                }];
            this.formattingMenu = new Menu({
                items: menu, enableRtl: this.parent.enableRtl,
                select: this.menuItemClick.bind(this)
            });
            this.formattingMenu.isStringTemplate = true;
            this.formattingMenu.appendTo('#' + this.parent.element.id + 'formatting_menu');
        }
        if (this.parent.element.querySelector('#' + this.parent.element.id + '_reportlist')) {
            var saveArgs = {
                report: this.parent.getPersistData(),
                reportName: this.parent.localeObj.getConstant('defaultReport')
            };
            if (isBlazor()) {
                var pivotData = JSON.parse(saveArgs.report);
                pivotData.dataSourceSettings = PivotUtil.getClonedDataSourceSettings(this.parent.dataSourceSettings);
                saveArgs.report = JSON.stringify(pivotData);
            }
            this.currentReport = this.parent.localeObj.getConstant('defaultReport');
            this.parent.trigger(events.saveReport, saveArgs);
            var reports = this.fetchReports();
            this.reportList = new DropDownList({
                dataSource: reports.reportName,
                width: '150px',
                popupHeight: '200px',
                placeholder: this.currentReport === '' ? this.parent.localeObj.getConstant('reportList') : '',
                enableRtl: this.parent.enableRtl,
                cssClass: cls.REPORT_LIST_DROP,
                select: this.reportChange.bind(this),
                value: this.currentReport
            });
            this.reportList.isStringTemplate = true;
            this.reportList.appendTo('#' + this.parent.element.id + '_reportlist');
        }
        this.updateItemElements();
    };
    Toolbar.prototype.updateItemElements = function () {
        var itemElements = [].slice.call(this.toolbar.element.querySelectorAll('.e-toolbar-item'));
        for (var _i = 0, itemElements_1 = itemElements; _i < itemElements_1.length; _i++) {
            var element = itemElements_1[_i];
            if (element.querySelector('button')) {
                element.querySelector('button').setAttribute('tabindex', '0');
            }
            else if (element.querySelector('.e-menu.e-menu-parent')) {
                element.querySelector('.e-menu.e-menu-parent').setAttribute('tabindex', '-1');
                if (element.querySelector('.e-menu-item.e-menu-caret-icon')) {
                    element.querySelector('.e-menu-item.e-menu-caret-icon').setAttribute('tabindex', '0');
                }
            }
        }
    };
    Toolbar.prototype.whitespaceRemove = function (args) {
        args.element.style.padding = '0px';
        var separator = args.element.querySelector('.e-separator');
        if (separator) {
            separator.style.margin = '0px';
        }
    };
    Toolbar.prototype.multipleAxesCheckbox = function (args) {
        if (this.parent.element.id + '_' + 'multipleAxes' === args.element.id) {
            var inputCheckbox = createElement('input', {
                id: this.parent.element.id + '_' + 'checkBox'
            });
            inputCheckbox.style.display = 'none';
            this.parent.element.appendChild(inputCheckbox);
            var checkbox = new CheckBox({
                label: this.parent.localeObj.getConstant('multipleAxes'),
                cssClass: 'e-multipleAxes',
                checked: this.parent.chartSettings.enableMultiAxis,
                enableRtl: this.parent.enableRtl
            });
            args.element.innerText = '';
            checkbox.appendTo('#' + this.parent.element.id + '_' + 'checkBox');
            if ((['Pie', 'Funnel', 'Pyramid', 'Doughnut'].indexOf(this.parent.chartSettings.chartSeries.type) > -1) &&
                !args.element.classList.contains(cls.MENU_DISABLE)) {
                args.element.classList.add(cls.MENU_DISABLE);
                checkbox.disabled = true;
            }
            else if ((['Pie', 'Funnel', 'Pyramid', 'Doughnut'].indexOf(this.parent.chartSettings.chartSeries.type) < 0) &&
                args.element.classList.contains(cls.MENU_DISABLE)) {
                args.element.classList.remove(cls.MENU_DISABLE);
                checkbox.disabled = false;
            }
            var checkboxObj = this.parent.element.querySelector('.e-checkbox-wrapper.e-multipleAxes');
            args.element.appendChild(checkboxObj);
        }
        else if (this.parent.element.id + '_' + 'showLegend' === args.element.id) {
            var inputCheckbox = createElement('input', {
                id: this.parent.element.id + '_' + 'showLegendCheckBox'
            });
            inputCheckbox.style.display = 'none';
            this.parent.element.appendChild(inputCheckbox);
            var checkbox = new CheckBox({
                label: this.parent.localeObj.getConstant('showLegend'),
                checked: this.getLableState(this.parent.chartSettings.chartSeries.type),
                cssClass: 'e-showLegend',
                enableRtl: this.parent.enableRtl
            });
            args.element.innerText = '';
            checkbox.appendTo('#' + this.parent.element.id + '_' + 'showLegendCheckBox');
            var checkboxObj = this.parent.element.querySelector('.e-checkbox-wrapper.e-showLegend');
            args.element.appendChild(checkboxObj);
        }
    };
    Toolbar.prototype.getLableState = function (type) {
        var chartSettings = JSON.parse(this.parent.getPersistData()).chartSettings;
        if (chartSettings && chartSettings.legendSettings && chartSettings.legendSettings.visible !== undefined) {
            this.showLableState = chartSettings.legendSettings.visible;
        }
        else {
            this.showLableState = ['Pie', 'Funnel', 'Pyramid', 'Doughnut'].indexOf(this.parent.chartSettings.chartSeries.type) > -1 ?
                false : true;
        }
        return this.showLableState;
    };
    Toolbar.prototype.getAllChartItems = function () {
        return ['Line', 'Column', 'Area', 'Bar', 'StackingColumn', 'StackingArea', 'StackingBar', 'StepLine', 'StepArea',
            'SplineArea', 'Scatter', 'Spline', 'StackingColumn100', 'StackingBar100', 'StackingArea100', 'Bubble', 'Pareto',
            'Polar', 'Radar', 'Pie', 'Pyramid', 'Funnel', 'Doughnut'];
    };
    Toolbar.prototype.updateExportMenu = function (args) {
        var items = [].slice.call(args.element.querySelectorAll('li'));
        if (this.parent.currentView === 'Table') {
            addClass(items.slice(3), cls.MENU_HIDE);
            removeClass(items.slice(1, 3), cls.MENU_HIDE);
        }
        else {
            addClass(items.slice(1, 3), cls.MENU_HIDE);
            removeClass(items.slice(3), cls.MENU_HIDE);
        }
    };
    /* tslint:disable:max-line-length */
    Toolbar.prototype.updateSubtotalSelection = function (args) {
        if (!args.element.querySelector('#' + this.parent.element.id + 'subtotal' + ' .' + cls.PIVOT_SELECT_ICON).classList.contains(cls.PIVOT_DISABLE_ICON)) {
            args.element.querySelector('#' + this.parent.element.id + 'subtotal' + ' .' + cls.PIVOT_SELECT_ICON).classList.add(cls.PIVOT_DISABLE_ICON);
        }
        if (!args.element.querySelector('#' + this.parent.element.id + 'notsubtotal' + ' .' + cls.PIVOT_SELECT_ICON).classList.contains(cls.PIVOT_DISABLE_ICON)) {
            args.element.querySelector('#' + this.parent.element.id + 'notsubtotal' + ' .' + cls.PIVOT_SELECT_ICON).classList.add(cls.PIVOT_DISABLE_ICON);
        }
        if (!args.element.querySelector('#' + this.parent.element.id + 'subtotalrow' + ' .' + cls.PIVOT_SELECT_ICON).classList.contains(cls.PIVOT_DISABLE_ICON)) {
            args.element.querySelector('#' + this.parent.element.id + 'subtotalrow' + ' .' + cls.PIVOT_SELECT_ICON).classList.add(cls.PIVOT_DISABLE_ICON);
        }
        if (!args.element.querySelector('#' + this.parent.element.id + 'subtotalcolumn' + ' .' + cls.PIVOT_SELECT_ICON).classList.contains(cls.PIVOT_DISABLE_ICON)) {
            args.element.querySelector('#' + this.parent.element.id + 'subtotalcolumn' + ' .' + cls.PIVOT_SELECT_ICON).classList.add(cls.PIVOT_DISABLE_ICON);
        }
        if (this.parent.dataSourceSettings.showSubTotals && this.parent.dataSourceSettings.showRowSubTotals && !this.parent.dataSourceSettings.showColumnSubTotals) {
            args.element.querySelector('#' + this.parent.element.id + 'subtotalrow' + ' .' + cls.PIVOT_SELECT_ICON).classList.remove(cls.PIVOT_DISABLE_ICON);
        }
        else if (this.parent.dataSourceSettings.showSubTotals && !this.parent.dataSourceSettings.showRowSubTotals && this.parent.dataSourceSettings.showColumnSubTotals) {
            args.element.querySelector('#' + this.parent.element.id + 'subtotalcolumn' + ' .' + cls.PIVOT_SELECT_ICON).classList.remove(cls.PIVOT_DISABLE_ICON);
        }
        else if (this.parent.dataSourceSettings.showSubTotals && this.parent.dataSourceSettings.showRowSubTotals && this.parent.dataSourceSettings.showColumnSubTotals) {
            args.element.querySelector('#' + this.parent.element.id + 'subtotal' + ' .' + cls.PIVOT_SELECT_ICON).classList.remove(cls.PIVOT_DISABLE_ICON);
        }
        else if (!this.parent.dataSourceSettings.showSubTotals || (!this.parent.dataSourceSettings.showRowSubTotals && !this.parent.dataSourceSettings.showColumnSubTotals)) {
            args.element.querySelector('#' + this.parent.element.id + 'notsubtotal' + ' .' + cls.PIVOT_SELECT_ICON).classList.remove(cls.PIVOT_DISABLE_ICON);
        }
    };
    Toolbar.prototype.updateGrandtotalSelection = function (args) {
        if (!args.element.querySelector('#' + this.parent.element.id + 'grandtotal' + ' .' + cls.PIVOT_SELECT_ICON).classList.contains(cls.PIVOT_DISABLE_ICON)) {
            args.element.querySelector('#' + this.parent.element.id + 'grandtotal' + ' .' + cls.PIVOT_SELECT_ICON).classList.add(cls.PIVOT_DISABLE_ICON);
        }
        if (!args.element.querySelector('#' + this.parent.element.id + 'notgrandtotal' + ' .' + cls.PIVOT_SELECT_ICON).classList.contains(cls.PIVOT_DISABLE_ICON)) {
            args.element.querySelector('#' + this.parent.element.id + 'notgrandtotal' + ' .' + cls.PIVOT_SELECT_ICON).classList.add(cls.PIVOT_DISABLE_ICON);
        }
        if (!args.element.querySelector('#' + this.parent.element.id + 'grandtotalrow' + ' .' + cls.PIVOT_SELECT_ICON).classList.contains(cls.PIVOT_DISABLE_ICON)) {
            args.element.querySelector('#' + this.parent.element.id + 'grandtotalrow' + ' .' + cls.PIVOT_SELECT_ICON).classList.add(cls.PIVOT_DISABLE_ICON);
        }
        if (!args.element.querySelector('#' + this.parent.element.id + 'grandtotalcolumn' + ' .' + cls.PIVOT_SELECT_ICON).classList.contains(cls.PIVOT_DISABLE_ICON)) {
            args.element.querySelector('#' + this.parent.element.id + 'grandtotalcolumn' + ' .' + cls.PIVOT_SELECT_ICON).classList.add(cls.PIVOT_DISABLE_ICON);
        }
        if (this.parent.dataSourceSettings.showGrandTotals && this.parent.dataSourceSettings.showRowGrandTotals && !this.parent.dataSourceSettings.showColumnGrandTotals) {
            args.element.querySelector('#' + this.parent.element.id + 'grandtotalrow' + ' .' + cls.PIVOT_SELECT_ICON).classList.remove(cls.PIVOT_DISABLE_ICON);
        }
        else if (this.parent.dataSourceSettings.showGrandTotals && !this.parent.dataSourceSettings.showRowGrandTotals && this.parent.dataSourceSettings.showColumnGrandTotals) {
            args.element.querySelector('#' + this.parent.element.id + 'grandtotalcolumn' + ' .' + cls.PIVOT_SELECT_ICON).classList.remove(cls.PIVOT_DISABLE_ICON);
        }
        else if (this.parent.dataSourceSettings.showGrandTotals && this.parent.dataSourceSettings.showRowGrandTotals && this.parent.dataSourceSettings.showColumnGrandTotals) {
            args.element.querySelector('#' + this.parent.element.id + 'grandtotal' + ' .' + cls.PIVOT_SELECT_ICON).classList.remove(cls.PIVOT_DISABLE_ICON);
        }
        else if (!this.parent.dataSourceSettings.showGrandTotals || (!this.parent.dataSourceSettings.showRowGrandTotals && !this.parent.dataSourceSettings.showColumnGrandTotals)) {
            args.element.querySelector('#' + this.parent.element.id + 'notgrandtotal' + ' .' + cls.PIVOT_SELECT_ICON).classList.remove(cls.PIVOT_DISABLE_ICON);
        }
    };
    /* tslint:enable:max-line-length */
    Toolbar.prototype.updateReportList = function () {
        var reports;
        if (isBlazor()) {
            /* tslint:disable */
            var _this_5 = this;
            /* tslint:enable */
            reports = { reportName: [] };
            this.parent.trigger(events.fetchReport, reports, function (observedArgs) {
                _this_5.reportList.dataSource = observedArgs.reportName;
                if (_this_5.currentReport === '' && _this_5.reportList.dataSource.length > 0) {
                    _this_5.reportList.value = _this_5.reportList.dataSource[_this_5.reportList.dataSource.length - 1];
                    _this_5.reportList.text = _this_5.reportList.dataSource[_this_5.reportList.dataSource.length - 1];
                    _this_5.currentReport = _this_5.reportList.dataSource[_this_5.reportList.dataSource.length - 1];
                }
                else {
                    _this_5.reportList.value = _this_5.currentReport;
                    _this_5.reportList.text = _this_5.currentReport;
                }
                _this_5.reportList.refresh();
            });
        }
        else {
            reports = this.fetchReports();
            this.reportList.dataSource = reports.reportName;
            if (this.currentReport === '' && this.reportList.dataSource.length > 0) {
                this.reportList.value = this.reportList.dataSource[this.reportList.dataSource.length - 1];
                this.reportList.text = this.reportList.dataSource[this.reportList.dataSource.length - 1];
                this.currentReport = this.reportList.dataSource[this.reportList.dataSource.length - 1];
            }
            else {
                this.reportList.value = this.currentReport;
                this.reportList.text = this.currentReport;
            }
            this.reportList.refresh();
        }
    };
    /* tslint:disable:max-func-body-length */
    Toolbar.prototype.menuItemClick = function (args) {
        var exportArgs = {};
        var type;
        if (this.getAllChartItems().indexOf(args.item.id.split(this.parent.element.id + '_')[1]) > -1 ||
            (args.item.id.split(this.parent.element.id + '_')[1] === 'ChartMoreOption') ||
            (args.item.id.split(this.parent.element.id + '_')[1] === 'multipleAxes') ||
            (args.item.id.split(this.parent.element.id + '_')[1] === 'showLegend')) {
            type = args.item.id.split(this.parent.element.id + '_')[1];
        }
        /* tslint:disable:max-line-length */
        switch (args.item.id) {
            case (this.parent.element.id + 'grid'):
                if (this.parent.grid && this.parent.chart) {
                    this.parent.grid.element.style.display = '';
                    this.parent.chart.element.style.display = 'none';
                    if (this.parent.chartSettings.enableMultiAxis && this.parent.chartSettings.enableScrollOnMultiAxis) {
                        this.parent.element.querySelector('.e-pivotchart').style.display = 'none';
                    }
                    this.parent.currentView = 'Table';
                    this.parent.setProperties({ displayOption: { primary: 'Table' } }, true);
                    if (this.parent.showGroupingBar && this.parent.groupingBarModule) {
                        this.parent.element.querySelector('.e-pivot-grouping-bar').style.display = '';
                        this.parent.element.querySelector('.e-chart-grouping-bar').style.display = 'none';
                    }
                    this.parent.layoutRefresh();
                }
                if (isBlazor() && this.parent.element.querySelector('.e-toggle-field-list') && this.parent.toolbar.indexOf('FieldList') !== -1) {
                    this.parent.element.querySelector('.e-toggle-field-list').style.display = 'none';
                }
                break;
            case (this.parent.element.id + 'pdf'):
                if (this.parent.currentView === 'Table') {
                    exportArgs = {
                        pdfExportProperties: { fileName: 'Export.pdf' },
                        pdfDoc: undefined,
                        isBlob: false,
                        isMultipleExport: false
                    };
                    this.parent.trigger(events.beforeExport, exportArgs);
                    this.parent.pdfExport(exportArgs.pdfExportProperties, exportArgs.isMultipleExport, exportArgs.pdfDoc, exportArgs.isBlob);
                }
                else {
                    exportArgs = {
                        width: undefined,
                        height: undefined,
                        orientation: PdfPageOrientation.Landscape,
                        type: 'PDF',
                        fileName: 'result',
                    };
                    this.parent.trigger(events.beforeExport, exportArgs);
                    this.parent.chartExport(exportArgs.type, exportArgs.fileName, exportArgs.orientation, exportArgs.width, exportArgs.height);
                }
                break;
            case (this.parent.element.id + 'excel'):
                exportArgs = {
                    excelExportProperties: { fileName: 'Export.xlsx' },
                    isBlob: false,
                    isMultipleExport: false,
                    workbook: undefined
                };
                this.parent.trigger(events.beforeExport, exportArgs);
                this.parent.excelExport(exportArgs.excelExportProperties, exportArgs.isMultipleExport, exportArgs.workbook, exportArgs.isBlob);
                break;
            case (this.parent.element.id + 'csv'):
                exportArgs = {
                    excelExportProperties: { fileName: 'Export.csv' },
                    isBlob: false,
                    isMultipleExport: false,
                    workbook: undefined
                };
                this.parent.trigger(events.beforeExport, exportArgs);
                this.parent.csvExport(exportArgs.excelExportProperties, exportArgs.isMultipleExport, exportArgs.workbook, exportArgs.isBlob);
                break;
            case (this.parent.element.id + 'png'):
                exportArgs = {
                    type: 'PNG',
                    width: undefined,
                    height: undefined,
                    fileName: 'result',
                    orientation: PdfPageOrientation.Landscape,
                };
                this.parent.trigger(events.beforeExport, exportArgs);
                this.parent.chartExport(exportArgs.type, exportArgs.fileName, exportArgs.orientation, exportArgs.width, exportArgs.height);
                break;
            case (this.parent.element.id + 'jpeg'):
                exportArgs = {
                    type: 'JPEG',
                    fileName: 'result',
                    orientation: PdfPageOrientation.Landscape,
                    width: undefined,
                    height: undefined,
                };
                this.parent.trigger(events.beforeExport, exportArgs);
                this.parent.chartExport(exportArgs.type, exportArgs.fileName, exportArgs.orientation, exportArgs.width, exportArgs.height);
                break;
            case (this.parent.element.id + 'svg'):
                exportArgs = {
                    width: undefined,
                    height: undefined,
                    type: 'SVG',
                    fileName: 'result',
                    orientation: PdfPageOrientation.Landscape,
                };
                this.parent.trigger(events.beforeExport, exportArgs);
                this.parent.chartExport(exportArgs.type, exportArgs.fileName, exportArgs.orientation, exportArgs.width, exportArgs.height);
                break;
            case (this.parent.element.id + 'notsubtotal'):
                this.parent.setProperties({ dataSourceSettings: { showSubTotals: false, showColumnSubTotals: false, showRowSubTotals: false } }, true);
                this.parent.refreshData();
                break;
            case (this.parent.element.id + 'subtotalrow'):
                this.parent.setProperties({ dataSourceSettings: { showSubTotals: true, showColumnSubTotals: false, showRowSubTotals: true } }, true);
                this.parent.refreshData();
                break;
            case (this.parent.element.id + 'subtotalcolumn'):
                this.parent.setProperties({ dataSourceSettings: { showSubTotals: true, showColumnSubTotals: true, showRowSubTotals: false } }, true);
                this.parent.refreshData();
                break;
            case (this.parent.element.id + 'subtotal'):
                this.parent.setProperties({ dataSourceSettings: { showSubTotals: true, showColumnSubTotals: true, showRowSubTotals: true } }, true);
                this.parent.refreshData();
                break;
            case (this.parent.element.id + 'notgrandtotal'):
                this.parent.setProperties({ dataSourceSettings: { showGrandTotals: false, showColumnGrandTotals: false, showRowGrandTotals: false } }, true);
                this.parent.refreshData();
                break;
            case (this.parent.element.id + 'grandtotalrow'):
                this.parent.setProperties({ dataSourceSettings: { showGrandTotals: true, showColumnGrandTotals: false, showRowGrandTotals: true } }, true);
                this.parent.refreshData();
                break;
            case (this.parent.element.id + 'grandtotalcolumn'):
                this.parent.setProperties({ dataSourceSettings: { showGrandTotals: true, showColumnGrandTotals: true, showRowGrandTotals: false } }, true);
                this.parent.refreshData();
                break;
            case (this.parent.element.id + 'grandtotal'):
                this.parent.setProperties({ dataSourceSettings: { showGrandTotals: true, showColumnGrandTotals: true, showRowGrandTotals: true } }, true);
                this.parent.refreshData();
                break;
            case (this.parent.element.id + 'numberFormattingMenu'):
                if (this.parent.numberFormattingModule) {
                    this.parent.numberFormattingModule.showNumberFormattingDialog();
                }
                break;
            case (this.parent.element.id + 'conditionalFormattingMenu'):
                if (this.parent.conditionalFormattingModule) {
                    this.parent.conditionalFormattingModule.showConditionalFormattingDialog();
                }
                break;
            case (this.parent.element.id + '_' + type):
                if (args.item && args.item.text) {
                    if (type === 'ChartMoreOption') {
                        this.createChartTypeDialog();
                    }
                    else if (type === 'multipleAxes') {
                        if (this.parent.chartSettings.enableScrollOnMultiAxis) {
                            this.isMultiAxisChange = true;
                        }
                        this.parent.chartSettings.enableMultiAxis = !this.parent.chartSettings.enableMultiAxis;
                        this.updateChartType(this.parent.chartSettings.chartSeries.type, true);
                    }
                    else if (this.getAllChartItems().indexOf(type) > -1) {
                        this.updateChartType(type, false);
                    }
                    else if (type === 'showLegend') {
                        this.parent.chart.legendSettings.visible = !this.showLableState;
                        if (this.parent.chartSettings.legendSettings) {
                            this.parent.chartSettings.legendSettings.visible = !this.showLableState;
                        }
                        else {
                            this.parent.setProperties({ chartSettings: { legendSettings: { visible: !this.showLableState } } }, true);
                        }
                        this.updateChartType(this.parent.chartSettings.chartSeries.type, true);
                    }
                }
                if (isBlazor() && this.parent.element.querySelector('.e-toggle-field-list') && this.parent.toolbar.indexOf('FieldList') !== -1) {
                    this.parent.element.querySelector('.e-toggle-field-list').style.display = 'none';
                }
                break;
        }
        /* tslint:enable:max-line-length */
    };
    /**
     * @hidden
     */
    Toolbar.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.initToolbar, this.createToolbar, this);
    };
    Toolbar.prototype.getValidChartType = function () {
        var menuItems = [];
        for (var i = 0; (i <= this.parent.chartTypes.length); i++) {
            var type = this.parent.chartTypes[i];
            if ((this.getAllChartItems().indexOf(type) > -1) && (menuItems.indexOf(type) < 0)) {
                menuItems.push(type);
            }
        }
        return menuItems;
    };
    Toolbar.prototype.createChartTypeDialog = function () {
        var _this_1 = this;
        var chartDialog = this.parent.element.appendChild(createElement('div', {
            id: this.parent.element.id + '_ChartTypeDialog',
            className: cls.PIVOTCHART_TYPE_DIALOG
        }));
        this.chartTypesDialog = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: true,
            header: this.parent.localeObj.getConstant('chartTypeSettings'),
            content: this.getDialogContent(),
            isModal: true,
            beforeOpen: this.beforeOpen.bind(this),
            visible: true,
            showCloseIcon: true,
            enableRtl: this.parent.enableRtl,
            width: 'auto',
            height: 'auto',
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    click: function () { _this_1.chartTypeDialogUpdate(); },
                    buttonModel: { cssClass: cls.OK_BUTTON_CLASS, content: this.parent.localeObj.getConstant('ok'), isPrimary: true },
                },
                {
                    click: function () { _this_1.removeDialog(); },
                    buttonModel: { cssClass: cls.CANCEL_BUTTON_CLASS, content: this.parent.localeObj.getConstant('cancel') }
                }
            ],
            closeOnEscape: true,
            target: this.parent.element,
            close: this.removeDialog.bind(this)
        });
        this.chartTypesDialog.isStringTemplate = true;
        this.chartTypesDialog.appendTo(chartDialog);
    };
    Toolbar.prototype.removeDialog = function () {
        if (this.chartTypesDialog && !this.chartTypesDialog.isDestroyed) {
            this.chartTypesDialog.destroy();
        }
        if (document.getElementById(this.parent.element.id + '_ChartTypeDialog')) {
            remove(document.getElementById(this.parent.element.id + '_ChartTypeDialog'));
        }
    };
    Toolbar.prototype.chartTypeDialogUpdate = function () {
        /* tslint:disable-next-line:max-line-length */
        var chartType = getInstance('#' + this.parent.element.id + '_ChartTypeOption', DropDownList).value;
        var checked = getInstance('#' + this.parent.element.id + '_DialogMultipleAxis', CheckBox).checked;
        var checkedShow = getInstance('#' + this.parent.element.id + '_DialogShowLabel', CheckBox).checked;
        this.parent.chart.legendSettings.visible = checkedShow;
        if (this.chartLableState) {
            this.parent.chart.legendSettings.visible = checkedShow;
            if (this.parent.chartSettings.legendSettings) {
                this.parent.chartSettings.legendSettings.visible = checkedShow;
            }
            else {
                this.parent.setProperties({ chartSettings: { legendSettings: { visible: checkedShow } } }, true);
            }
        }
        this.updateChartType(chartType, false);
        this.parent.chartSettings.enableMultiAxis = checked;
        this.chartTypesDialog.close();
    };
    Toolbar.prototype.updateChartType = function (type, isMultiAxis) {
        if (this.getAllChartItems().indexOf(type) > -1) {
            if (this.parent.chart) {
                this.parent.currentView = 'Chart';
                this.parent.setProperties({ displayOption: { primary: 'Chart' } }, true);
                /* tslint:disable:max-line-length */
                this.parent.chart.element.style.width = formatUnit(this.parent.grid ? this.parent.getGridWidthAsNumber() : this.parent.getWidthAsNumber());
                this.parent.chart.setProperties({ width: formatUnit(this.parent.grid ? this.parent.getGridWidthAsNumber() : this.parent.getWidthAsNumber()) }, true);
                if (this.parent.chartSettings.chartSeries.type === type && !isMultiAxis) {
                    this.parent.chartModule.updateView();
                }
                else {
                    this.parent.chartSettings.chartSeries.type = type;
                }
            }
        }
    };
    Toolbar.prototype.getDialogContent = function () {
        var mainWrapper = createElement('div', { className: 'e-chart-type-div-content' });
        var optionWrapperDiv = createElement('div', { className: 'e-chart-type-option-wrapper' });
        var optionTextDiv = createElement('div', {
            className: 'e-chart-type-option-text', innerHTML: this.parent.localeObj.getConstant('ChartType')
        });
        var dropOptionDiv = createElement('div', { id: this.parent.element.id + '_ChartTypeOption' });
        optionWrapperDiv.appendChild(optionTextDiv);
        optionWrapperDiv.appendChild(dropOptionDiv);
        var chartTypeDatasource = [];
        var chartType = this.getValidChartType();
        for (var i = 0; i < chartType.length; i++) {
            chartTypeDatasource.push({ value: chartType[i], text: this.parent.localeObj.getConstant(chartType[i].toLowerCase()) });
        }
        var optionWrapper = new DropDownList({
            dataSource: chartTypeDatasource, enableRtl: this.parent.enableRtl,
            fields: { value: 'value', text: 'text' },
            value: this.parent.chartSettings.chartSeries.type ? this.parent.chartSettings.chartSeries.type : this.getValidChartType()[0],
            width: '100%',
            change: this.changeDropDown.bind(this)
        });
        optionWrapper.isStringTemplate = true;
        optionWrapper.appendTo(dropOptionDiv);
        mainWrapper.appendChild(optionWrapperDiv);
        var checkboxWrap = createElement('input', {
            id: this.parent.element.id + '_DialogMultipleAxis',
            attrs: { 'type': 'checkbox' }
        });
        mainWrapper.appendChild(checkboxWrap);
        var labelCheckboxWrap = createElement('input', {
            id: this.parent.element.id + '_DialogShowLabel',
            attrs: { 'type': 'checkbox' }
        });
        mainWrapper.appendChild(labelCheckboxWrap);
        return mainWrapper;
    };
    Toolbar.prototype.changeDropDown = function (args) {
        var chartSettings = JSON.parse(this.parent.getPersistData()).chartSettings;
        if (!(chartSettings && chartSettings.legendSettings && chartSettings.legendSettings.visible !== undefined)) {
            var checked = ['Pie', 'Funnel', 'Pyramid', 'Doughnut'].indexOf(args.value.toString()) > -1 ?
                false : true;
            getInstance('#' + this.parent.element.id + '_DialogShowLabel', CheckBox).checked = checked;
        }
        if (['Pie', 'Funnel', 'Pyramid', 'Doughnut'].indexOf(args.value.toString()) > -1) {
            getInstance('#' + this.parent.element.id + '_DialogMultipleAxis', CheckBox).disabled = true;
        }
        else {
            getInstance('#' + this.parent.element.id + '_DialogMultipleAxis', CheckBox).disabled = false;
        }
    };
    Toolbar.prototype.beforeOpen = function () {
        var _this_1 = this;
        var checkbox = new CheckBox({
            label: this.parent.localeObj.getConstant('multipleAxes'),
            cssClass: 'e-dialog-multiple-axis',
            checked: this.parent.chartSettings.enableMultiAxis ? this.parent.chartSettings.enableMultiAxis : false,
            enableRtl: this.parent.enableRtl,
        });
        var checkbox1 = new CheckBox({
            label: this.parent.localeObj.getConstant('showLegend'),
            checked: this.getLableState(this.parent.chartSettings.chartSeries.type),
            change: function () { _this_1.chartLableState = true; },
            cssClass: 'e-dialog-show-legend',
            enableRtl: this.parent.enableRtl,
        });
        checkbox1.appendTo(this.chartTypesDialog.element.querySelector('#' + this.parent.element.id + '_DialogShowLabel'));
        checkbox.appendTo(this.chartTypesDialog.element.querySelector('#' + this.parent.element.id + '_DialogMultipleAxis'));
        if (['Pie', 'Funnel', 'Pyramid', 'Doughnut'].indexOf(this.parent.chartSettings.chartSeries.type) > -1) {
            checkbox.disabled = true;
        }
        var chartSettings = JSON.parse(this.parent.getPersistData()).chartSettings;
        if (chartSettings && chartSettings.legendSettings && chartSettings.legendSettings.visible !== undefined) {
            this.chartLableState = true;
        }
        else {
            this.chartLableState = false;
        }
    };
    /**
     * To refresh the toolbar
     * @return {void}
     * @hidden
     */
    Toolbar.prototype.refreshToolbar = function () {
        this.createToolbar();
    };
    /**
     * @hidden
     */
    Toolbar.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.initToolbar, this.createToolbar);
    };
    /**
     * To destroy the toolbar
     * @return {void}
     * @hidden
     */
    Toolbar.prototype.destroy = function () {
        this.removeEventListener();
        if (this.confirmPopUp && !this.confirmPopUp.isDestroyed) {
            this.confirmPopUp.destroy();
        }
        if (this.dialog && !this.dialog.isDestroyed) {
            this.dialog.destroy();
        }
        if (this.mdxDialog && !this.mdxDialog.isDestroyed) {
            this.mdxDialog.destroy();
        }
        if (this.chartMenu && !this.chartMenu.isDestroyed) {
            this.chartMenu.destroy();
        }
        if (this.chartTypesDialog && !this.chartTypesDialog.isDestroyed) {
            this.chartTypesDialog.destroy();
        }
        if (this.exportMenu && !this.exportMenu.isDestroyed) {
            this.exportMenu.destroy();
        }
        if (this.subTotalMenu && !this.subTotalMenu.isDestroyed) {
            this.subTotalMenu.destroy();
        }
        if (this.grandTotalMenu && !this.grandTotalMenu.isDestroyed) {
            this.grandTotalMenu.destroy();
        }
        if (this.formattingMenu && !this.formattingMenu.isDestroyed) {
            this.formattingMenu.destroy();
        }
        if (this.reportList && !this.reportList.isDestroyed) {
            this.reportList.destroy();
        }
        if (this.toolbar && !this.toolbar.isDestroyed) {
            this.toolbar.destroy();
        }
        if (document.querySelector('#' + this.parent.element.id + 'pivot-toolbar')) {
            remove(document.querySelector('#' + this.parent.element.id + 'pivot-toolbar'));
        }
    };
    Toolbar.prototype.focusToolBar = function () {
        removeClass(document.querySelector('.' + cls.GRID_TOOLBAR).querySelectorAll('.e-menu-item.e-focused'), 'e-focused');
        removeClass(document.querySelector('.' + cls.GRID_TOOLBAR).querySelectorAll('.e-menu-item.e-selected'), 'e-selected');
        if (document.querySelector('.e-toolbar-items')) {
            addClass([document.querySelector('.e-toolbar-items')], 'e-focused');
        }
    };
    return Toolbar;
}());
export { Toolbar };
