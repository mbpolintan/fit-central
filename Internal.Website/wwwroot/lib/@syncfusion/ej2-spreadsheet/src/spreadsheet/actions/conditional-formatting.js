import { checkConditionalFormat, initiateConditionalFormat, locale, dialog, setCF } from '../common/index';
import { beginAction, completeAction } from '../common/index';
import { getCell, setRow, setCell } from '../../workbook/base/index';
import { getRangeIndexes, checkDateFormat, cFInitialCheck, isNumber, cFRender, cFDelete } from '../../workbook/common/index';
import { isDateTime, dateToInt, applyCellFormat, clearCF } from '../../workbook/common/index';
import { setCFRule, clearCells } from '../../workbook/common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
/**
 * Represents Conditional Formatting support for Spreadsheet.
 */
var ConditionalFormatting = /** @class */ (function () {
    /**
     * Constructor for the Spreadsheet Conditional Formatting module.
     */
    function ConditionalFormatting(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * To destroy the Conditional Formatting module.
     * @return {void}
     */
    ConditionalFormatting.prototype.destroy = function () {
        this.removeEventListener();
    };
    ConditionalFormatting.prototype.addEventListener = function () {
        this.parent.on(cFRender, this.cFInitialRender, this);
        this.parent.on(cFInitialCheck, this.cFInitialCheckHandler, this);
        this.parent.on(checkConditionalFormat, this.checkConditionalFormatHandler, this);
        this.parent.on(initiateConditionalFormat, this.initiateCFHandler, this);
        this.parent.on(setCF, this.setCFHandler, this);
        this.parent.on(cFDelete, this.cFDeleteHandler, this);
        this.parent.on(clearCF, this.clearCFHandler, this);
        this.parent.on(clearCells, this.addClearCFHandler, this);
    };
    ConditionalFormatting.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(cFRender, this.cFInitialRender);
            this.parent.off(cFInitialCheck, this.cFInitialCheckHandler);
            this.parent.off(checkConditionalFormat, this.checkConditionalFormatHandler);
            this.parent.off(initiateConditionalFormat, this.initiateCFHandler);
            this.parent.off(setCF, this.setCFHandler);
            this.parent.off(cFDelete, this.cFDeleteHandler);
            this.parent.off(clearCF, this.clearCFHandler);
        }
    };
    ConditionalFormatting.prototype.setCF = function (conditionalFormat) {
        conditionalFormat.range = conditionalFormat.range || this.parent.getActiveSheet().selectedRange;
        var eventArgs = {
            range: conditionalFormat.range, type: conditionalFormat.type, cFColor: conditionalFormat.cFColor,
            value: conditionalFormat.value, cancel: false
        };
        this.parent.notify(beginAction, { eventArgs: eventArgs, action: 'conditionalFormat' });
        if (!eventArgs.cancel) {
            conditionalFormat.type = eventArgs.type;
            conditionalFormat.cFColor = eventArgs.cFColor;
            conditionalFormat.value = eventArgs.value;
            conditionalFormat.range = eventArgs.range;
            this.parent.notify(setCFRule, { conditionalFormat: conditionalFormat });
            delete eventArgs.cancel;
            this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'conditionalFormat' });
        }
    };
    ConditionalFormatting.prototype.addClearCFHandler = function (args) {
        var sheet = this.parent.getActiveSheet();
        var clearCFormats = args.conditionalFormats;
        var oldRange = args.oldRange;
        var selectedRange = args.selectedRange;
        var conditionalFormats = sheet.conditionalFormats;
        for (var cCFIdx = 0; cCFIdx < clearCFormats.length; cCFIdx++) {
            var isApply = false;
            for (var cFIdx = 0; cFIdx < conditionalFormats.length; cFIdx++) {
                if (conditionalFormats[cFIdx].type === clearCFormats[cCFIdx].type &&
                    conditionalFormats[cFIdx].range === clearCFormats[cCFIdx].range) {
                    isApply = true;
                    conditionalFormats[cFIdx].range = oldRange[cCFIdx];
                    sheet.conditionalFormats[cFIdx].range = oldRange[cCFIdx];
                    var sRangeIdx = getRangeIndexes(selectedRange);
                    var cFRanges = oldRange[cCFIdx].split(',');
                    for (var cFRangeIdx = 0; cFRangeIdx < cFRanges.length; cFRangeIdx++) {
                        var newRangeIdxs = getRangeIndexes(cFRanges[cFRangeIdx]);
                        for (var cFRowIdx = newRangeIdxs[0]; cFRowIdx <= newRangeIdxs[2]; cFRowIdx++) {
                            for (var cFColIdx = newRangeIdxs[1]; cFColIdx <= newRangeIdxs[3]; cFColIdx++) {
                                for (var sRRowIdx = sRangeIdx[0]; sRRowIdx <= sRangeIdx[2]; sRRowIdx++) {
                                    for (var sRColIdx = sRangeIdx[1]; sRColIdx <= sRangeIdx[3]; sRColIdx++) {
                                        if (sRRowIdx === cFRowIdx && sRColIdx === cFColIdx) {
                                            var td = this.parent.getCell(cFRowIdx, cFColIdx);
                                            var cell = sheet.rows[cFRowIdx] ? sheet.rows[cFRowIdx].cells[cFColIdx] ?
                                                sheet.rows[cFRowIdx].cells[cFColIdx] : null : null;
                                            if (cell) {
                                                this.cFInitialCheckHandler({
                                                    rowIdx: cFRowIdx, colIdx: cFColIdx,
                                                    cell: cell, td: td, conditionalFormat: conditionalFormats[cFIdx]
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (!isApply) {
                var conditionalFormat = clearCFormats[cCFIdx];
                conditionalFormat.range = oldRange[cCFIdx];
                this.parent.notify(setCFRule, { conditionalFormat: conditionalFormat });
            }
        }
    };
    ConditionalFormatting.prototype.cFDeleteHandler = function (args) {
        var td = this.parent.getCell(args.rowIdx, args.colIdx);
        if (td) {
            if (td.querySelector('.e-cf-databar')) {
                td.removeChild(td.querySelector('.e-cf-databar'));
            }
            if (td.querySelector('.e-iconsetspan')) {
                td.removeChild(td.querySelector('.e-iconsetspan'));
            }
        }
    };
    ConditionalFormatting.prototype.clearCFHandler = function (args) {
        var sheet = this.parent.getActiveSheet();
        var tdEle = this.parent.getCell(args.rIdx, args.cIdx);
        var cell = getCell(args.rIdx, args.cIdx, sheet);
        if (!tdEle) {
            return;
        }
        tdEle.classList.remove('e-redft');
        tdEle.classList.remove('e-yellowft');
        tdEle.classList.remove('e-greenft');
        tdEle.classList.remove('e-redf');
        tdEle.classList.remove('e-redt');
        tdEle.classList.remove('e-iconset');
        if (tdEle.style) {
            if (tdEle.style.backgroundColor) {
                tdEle.style.backgroundColor = '';
                var style = this.parent.getCellStyleValue(['backgroundColor'], [args.rIdx, args.cIdx]);
                this.parent.notify(applyCellFormat, {
                    style: style, rowIdx: args.rIdx, colIdx: args.cIdx
                });
            }
            if (tdEle.style.color) {
                tdEle.style.color = '';
                var style = this.parent.getCellStyleValue(['color'], [args.rIdx, args.cIdx]);
                this.parent.notify(applyCellFormat, {
                    style: style, rowIdx: args.rIdx, colIdx: args.cIdx
                });
            }
        }
        if (tdEle.querySelector('.e-cf-databar')) {
            tdEle.removeChild(tdEle.querySelector('.e-cf-databar'));
            tdEle.textContent = this.parent.getDisplayText(cell);
        }
        if (tdEle.querySelector('.e-iconsetspan')) {
            tdEle.removeChild(tdEle.querySelector('.e-iconsetspan'));
            tdEle.textContent = this.parent.getDisplayText(cell);
        }
    };
    ConditionalFormatting.prototype.setCFHandler = function (args) {
        if (args.action === 'cf_databars') {
            this.setCF({ type: args.id });
        }
        else if (args.action === 'cf_colorscales') {
            this.setCF({ type: args.id });
        }
        else if (args.action === 'cf_iconsets') {
            this.setCF({ type: args.id });
        }
    };
    ConditionalFormatting.prototype.initiateCFHandler = function (args) {
        var _this = this;
        var l10n = this.parent.serviceLocator.getService(locale);
        var dialogInst = this.parent.serviceLocator.getService(dialog);
        dialogInst.show({
            width: 375, showCloseIcon: true, isModal: true, cssClass: 'e-conditionalformatting-dlg',
            header: args.action.replace('...', ''),
            target: document.querySelector('.e-control.e-spreadsheet'),
            beforeOpen: function (openArgs) {
                var dlgArgs = {
                    dialogName: 'CFDialog', element: openArgs.element,
                    target: openArgs.target, cancel: openArgs.cancel
                };
                _this.parent.trigger('dialogBeforeOpen', dlgArgs);
                if (dlgArgs.cancel) {
                    openArgs.cancel = true;
                }
                dialogInst.dialogInstance.content = _this.cFDlgContent(args.action);
                dialogInst.dialogInstance.dataBind();
                _this.parent.element.focus();
            },
            buttons: [{
                    buttonModel: {
                        content: l10n.getConstant('Ok'),
                        isPrimary: true,
                        cssClass: 'e-btn e-clearall-btn e-flat'
                    },
                    click: function () {
                        _this.dlgClickHandler(args.action);
                        dialogInst.hide();
                    }
                }]
        });
        dialogInst.dialogInstance.refresh();
    };
    ConditionalFormatting.prototype.dlgClickHandler = function (action) {
        var value1 = '';
        var value2 = '';
        var dlgCont = this.parent.element.querySelector('.e-conditionalformatting-dlg').
            getElementsByClassName('e-dlg-content')[0].querySelector('.e-cf-dlg');
        var mainCont = dlgCont.querySelector('.e-cfmain');
        if (mainCont) {
            var inpEle = mainCont.getElementsByTagName('input')[0];
            if (inpEle && inpEle.parentElement.classList.contains('e-cfmain')) {
                value1 = mainCont.getElementsByTagName('input')[0].value;
            }
            value2 = mainCont.getElementsByTagName('input')[1] ?
                dlgCont.querySelector('.e-cfmain').getElementsByTagName('input')[1].value : '';
        }
        var cFColor = this.getCFColor(dlgCont.querySelector('.e-cfsub').getElementsByTagName('input')[0].value);
        var cFType = action === 'Duplicate Values...' ?
            dlgCont.querySelector('.e-cfmain').getElementsByTagName('input')[0].value : this.getType(action);
        if (value1 !== '' && value2 !== '') {
            this.setCF({
                type: cFType,
                cFColor: cFColor, value: value1 + ',' + value2
            });
        }
        else if (value1 !== '') {
            this.setCF({
                type: cFType,
                cFColor: cFColor, value: value1
            });
        }
        else {
            this.setCF({
                type: cFType,
                cFColor: cFColor, value: value2
            });
        }
    };
    ConditionalFormatting.prototype.getType = function (action) {
        var result = '';
        switch (action) {
            case 'Greater Than...':
                result = 'GreaterThan';
                break;
            case 'Less Than...':
                result = 'LessThan';
                break;
            case 'Between...':
                result = 'Between';
                break;
            case 'Equal To...':
                result = 'EqualTo';
                break;
            case 'Text that Contains...':
                result = 'ContainsText';
                break;
            case 'A Date Occuring...':
                result = 'DateOccur';
                break;
            case 'Top 10 Items...':
                result = 'Top10Items';
                break;
            case 'Bottom 10 Items...':
                result = 'Bottom10Items';
                break;
            case 'Top 10 %...':
                result = 'Top10Percentage';
                break;
            case 'Bottom 10 %...':
                result = 'Bottom10Percentage';
                break;
            case 'Above Average...':
                result = 'AboveAverage';
                break;
            case 'Below Average...':
                result = 'BelowAverage';
                break;
        }
        return result;
    };
    ConditionalFormatting.prototype.getCFColor = function (value) {
        var result = 'RedFT';
        switch (value) {
            case 'Light Red Fill with Dark Red Text':
                result = 'RedFT';
                break;
            case 'Yellow Fill with Dark Yellow Text':
                result = 'YellowFT';
                break;
            case 'Green Fill with Dark Green Text':
                result = 'GreenFT';
                break;
            case 'Red Fill':
                result = 'RedF';
                break;
            case 'Red Text':
                result = 'RedT';
                break;
        }
        return result;
    };
    ConditionalFormatting.prototype.cFDlgContent = function (action) {
        var dlgText = this.getDlgText(action);
        var l10n = this.parent.serviceLocator.getService(locale);
        var dlgContent = this.parent.createElement('div', { className: 'e-cf-dlg' });
        var mainDiv = this.parent.createElement('div', { className: 'e-cfmain' });
        var subDiv = this.parent.createElement('div', { className: 'e-cfsub' });
        var value1Text = this.parent.createElement('span', { className: 'e-header e-top-header', innerHTML: dlgText });
        var value1Inp = this.parent.createElement('input', { className: 'e-input', id: 'valueInput', attrs: { type: 'text' } });
        var duplicateSelectEle = this.parent.createElement('input', { className: 'e-select' });
        var subDivText = this.parent.createElement('span', { className: 'e-header', innerHTML: 'with' });
        var colorSelectEle = this.parent.createElement('input', { className: 'e-select' });
        dlgContent.appendChild(mainDiv);
        dlgContent.appendChild(subDiv);
        mainDiv.appendChild(value1Text);
        if (action !== 'Duplicate Values...') {
            if (action !== 'Above Average...' && action !== 'Below Average...') {
                mainDiv.appendChild(value1Inp);
                if (action === 'Top 10 Items...' || action === 'Top 10 %...' ||
                    action === 'Bottom 10 Items...' || action === 'Bottom 10 %...') {
                    var numeric = new NumericTextBox({
                        value: 10
                    });
                    numeric.appendTo(value1Inp);
                }
            }
        }
        else {
            mainDiv.appendChild(duplicateSelectEle);
            var dupData = [
                { text: 'Duplicate', id: 'duplicate' },
                { text: 'Unique', id: 'unique' },
            ];
            var dupList = new DropDownList({
                dataSource: dupData,
                index: 0,
                popupHeight: '200px'
            });
            dupList.appendTo(duplicateSelectEle);
        }
        if (action === 'Between...') {
            var value2Text = this.parent.createElement('span', { className: 'e-header e-header-2', innerHTML: 'and' });
            var value2Inp = this.parent.createElement('input', { className: 'e-input' });
            mainDiv.appendChild(value2Text);
            mainDiv.appendChild(value2Inp);
        }
        subDiv.appendChild(subDivText);
        subDiv.appendChild(colorSelectEle);
        var colorData = [
            { text: 'Light Red Fill with Dark Red Text', value: 'redft', id: 'redft' },
            { text: 'Yellow Fill with Dark Yellow Text', id: 'yellowft' },
            { text: 'Green Fill with Dark Green Text', id: 'greenft' },
            { text: 'Red Fill', id: 'redf' },
            { text: 'Red Text', id: 'redt' },
        ];
        var colorList = new DropDownList({
            dataSource: colorData,
            index: 0,
            popupHeight: '200px'
        });
        colorList.appendTo(colorSelectEle);
        return dlgContent;
    };
    ConditionalFormatting.prototype.checkCellHandler = function (rowIdx, colIdx, conditionalFormat) {
        var isApply = false;
        var ranges = conditionalFormat.range.trim().split(',');
        for (var rangeIdx = 0; rangeIdx < ranges.length; rangeIdx++) {
            var cFrange = ranges[rangeIdx];
            cFrange = cFrange.indexOf(':') > -1 ? cFrange : cFrange + ':' + cFrange;
            var indexes = getRangeIndexes(cFrange);
            if (rowIdx >= indexes[0] && rowIdx <= indexes[2] && colIdx >= indexes[1] && colIdx <= indexes[3]) {
                isApply = true;
                break;
            }
        }
        return isApply;
    };
    ConditionalFormatting.prototype.getDlgText = function (action) {
        var l10n = this.parent.serviceLocator.getService(locale);
        var result = '';
        switch (action) {
            case l10n.getConstant('GreaterThan') + '...':
                result = l10n.getConstant('FormatCellsGreaterThan');
                break;
            case l10n.getConstant('LessThan') + '...':
                result = l10n.getConstant('FormatCellsLessThan');
                break;
            case l10n.getConstant('Between') + '...':
                result = l10n.getConstant('FormatCellsBetween');
                break;
            case l10n.getConstant('CFEqualTo') + '...':
                result = l10n.getConstant('FormatCellsEqualTo');
                break;
            case l10n.getConstant('TextThatContains') + '...':
                result = l10n.getConstant('FormatCellsText');
                break;
            case l10n.getConstant('ADateOccuring') + '...':
                result = l10n.getConstant('FormatCellsDate');
                break;
            case l10n.getConstant('DuplicateValues') + '...':
                result = l10n.getConstant('FormatCellsDuplicate');
                break;
            case l10n.getConstant('Top10Items') + '...':
                result = l10n.getConstant('FormatCellsTop');
                break;
            case l10n.getConstant('Top10') + ' %...':
                result = l10n.getConstant('FormatCellsTop');
                break;
            case l10n.getConstant('Bottom10Items') + '...':
                result = l10n.getConstant('FormatCellsBottom');
                break;
            case l10n.getConstant('Bottom10') + ' %...':
                result = l10n.getConstant('FormatCellsBottom');
                break;
            case l10n.getConstant('AboveAverage') + '...':
                result = l10n.getConstant('FormatCellsAbove');
                break;
            case l10n.getConstant('BelowAverage') + '...':
                result = l10n.getConstant('FormatCellsBelow');
                break;
        }
        return result;
    };
    ConditionalFormatting.prototype.cFInitialRender = function (args) {
        var cFRules = this.parent.getActiveSheet().conditionalFormats;
        if (cFRules) {
            for (var cFRIdx = 0; cFRIdx < cFRules.length; cFRIdx++) {
                var isApply = false;
                isApply = this.checkCellHandler(args.rowIdx, args.colIdx, cFRules[cFRIdx]);
                if (isApply) {
                    this.cFInitialCheckHandler({
                        rowIdx: args.rowIdx, colIdx: args.colIdx,
                        cell: args.cell, td: args.td, conditionalFormat: cFRules[cFRIdx]
                    });
                }
            }
        }
    };
    ConditionalFormatting.prototype.cFInitialCheckHandler = function (args) {
        var sheet = this.parent.getActiveSheet();
        var isApply = false;
        var cFColors = ['e-redft', 'e-yellowft', 'e-greenft', 'e-redf', 'e-redt'];
        var value = args.cell.value || '';
        var cFRule = args.conditionalFormat;
        var td = args.td || this.parent.getCell(args.rowIdx, args.colIdx);
        if (!td) {
            return;
        }
        cFRule.type = cFRule.type || 'GreaterThan';
        isApply = this.cFRCheck(cFRule, value, td, args.rowIdx, args.colIdx, true);
        if (isApply) {
            for (var idx = 0; idx < cFColors.length; idx++) {
                if (td.classList.contains(cFColors[idx])) {
                    td.classList.remove(cFColors[idx]);
                }
            }
            cFRule.cFColor = cFRule.cFColor || 'RedFT';
            td.classList.add('e-' + cFRule.cFColor.toLowerCase());
            this.setFormat(td, cFRule);
            if (cFRule && cFRule.format && cFRule.format.style) {
                if (cFRule.format.style.backgroundColor) {
                    td.style.setProperty('background-color', cFRule.format.style.backgroundColor);
                }
                if (cFRule.format.style.color) {
                    td.style.setProperty('color', cFRule.format.style.color);
                }
            }
        }
    };
    ConditionalFormatting.prototype.checkConditionalFormatHandler = function (args) {
        var indexes;
        var isApply = false;
        var result = false;
        var sheet = this.parent.getActiveSheet();
        var cell = args.cell;
        var td;
        var cFRules = sheet.conditionalFormats;
        var mainCnt = this.parent.getMainContent();
        var value = !cell ? '' : !isNullOrUndefined(cell.value) ? cell.value : '';
        var cFColors = ['e-redft', 'e-yellowft', 'e-greenft', 'e-redf', 'e-redt'];
        var cFRIdx;
        td = this.parent.getCell(args.rowIdx, args.colIdx);
        if (!cFRules || cFRules.length < 1) {
            return;
        }
        for (var cFRuleIdx = 0; cFRuleIdx < cFRules.length; cFRuleIdx++) {
            var cFRanges = cFRules[cFRuleIdx].range.trim().split(',');
            for (var rangeIdx = 0; rangeIdx < cFRanges.length; rangeIdx++) {
                var range = cFRanges[rangeIdx];
                range = range.indexOf(':') > -1 ? range : range + ':' + range;
                indexes = getRangeIndexes(range);
                if (args.rowIdx >= indexes[0] && args.colIdx >= indexes[1] && args.rowIdx <= indexes[2] && args.colIdx <= indexes[3]) {
                    cFRIdx = cFRuleIdx;
                    result = true;
                    break;
                }
            }
            if (result) {
                if (('GreaterThan' + 'LessThan' + 'EqualTo' + 'Between' + 'ContainsText' +
                    'DateOccur').includes(sheet.conditionalFormats[cFRuleIdx].type)) {
                    var cellVal = getCell(args.rowIdx, args.colIdx, sheet) && getCell(args.rowIdx, args.colIdx, sheet).value ?
                        getCell(args.rowIdx, args.colIdx, sheet).value : '';
                    if (isNullOrUndefined(cellVal) && cellVal === '') {
                        isApply = false;
                    }
                    else {
                        isApply = this.cFRCheck(sheet.conditionalFormats[cFRuleIdx], cellVal, td);
                    }
                    this.setColor(td, args.rowIdx, args.colIdx, cFRuleIdx, isApply);
                }
                else if (('Top10Items' + 'Bottom10Items' + 'Top10%' + 'Bottom10%' + 'AboveAverage' +
                    'BelowAverage' + 'Duplicate' + 'Unique').includes(sheet.conditionalFormats[cFRuleIdx].type)) {
                    for (var rangeIdx = 0; rangeIdx < cFRanges.length; rangeIdx++) {
                        var range = cFRanges[rangeIdx];
                        range = range.indexOf(':') > -1 ? range : range + ':' + range;
                        indexes = getRangeIndexes(range);
                        for (var rIdx = indexes[0]; rIdx <= indexes[2]; rIdx++) {
                            if (!sheet.rows[rIdx]) {
                                setRow(sheet, rIdx, {});
                            }
                            for (var cIdx = indexes[1]; cIdx <= indexes[3]; cIdx++) {
                                if (!sheet.rows[rIdx].cells || !sheet.rows[rIdx].cells[cIdx]) {
                                    setCell(rIdx, cIdx, sheet, {});
                                }
                                var cellVal = getCell(rIdx, cIdx, sheet) && getCell(rIdx, cIdx, sheet).value ?
                                    getCell(rIdx, cIdx, sheet).value : '';
                                isApply = this.cFRCheck(sheet.conditionalFormats[cFRuleIdx], cellVal, td, rIdx, cIdx, false);
                                td = this.parent.getCell(rIdx, cIdx);
                                this.setColor(td, rIdx, cIdx, cFRuleIdx, isApply);
                            }
                        }
                    }
                    isApply = true;
                }
                else if (('BlueDataBar' + 'GreenDataBar' + 'RedDataBar' + 'OrangeDataBar' + 'LightBlueDataBar' + 'PurpleColorScale' +
                    'GYRColorScale' + 'RYGColorScale' + 'GWRColorScale' + 'RWGColorScale' + 'BWRColorScale' + 'RWBColorScale' +
                    'WRColorScale' + 'RWColorScale' + 'GWColorScale' + 'WGColorScale' + 'GYColorScale' + 'YGColorScale' + 'ThreeArrows' +
                    'ThreeArrowsGray' + 'FourArrowsGray' + 'FourArrows' + 'FiveArrowsGray' + 'FiveArrows' + 'ThreeTrafficLights1' +
                    'ThreeTrafficLights2' + 'ThreeSigns' + 'FourTrafficLights' + 'FourRedToBlack' + 'ThreeSymbols' + 'ThreeSymbols2' +
                    'ThreeFlags' + 'FourRating' + 'FiveQuarters' + 'FiveRating' + 'ThreeTriangles' + 'ThreeStars' + 'FiveBoxes').
                    includes(sheet.conditionalFormats[cFRuleIdx].type)) {
                    for (var idx = 0; idx < cFColors.length; idx++) {
                        if (td.classList.contains(cFColors[idx])) {
                            td.classList.remove(cFColors[idx]);
                        }
                    }
                    isApply = this.cFRCheck(sheet.conditionalFormats[cFRuleIdx], value, td, args.rowIdx, args.colIdx, false);
                }
                result = false;
            }
        }
    };
    ConditionalFormatting.prototype.setColor = function (td, rIdx, cIdx, cFRuleIdx, isApply) {
        var sheet = this.parent.getActiveSheet();
        var cFRules = sheet.conditionalFormats;
        var cFColors = ['e-redft', 'e-yellowft', 'e-greenft', 'e-redf', 'e-redt'];
        if (isApply) {
            for (var idx = 0; idx < cFColors.length; idx++) {
                if (td.classList.contains(cFColors[idx])) {
                    td.classList.remove(cFColors[idx]);
                    break;
                }
            }
            td.classList.add('e-' + cFRules[cFRuleIdx].cFColor.toLowerCase());
            this.setFormat(td, sheet.conditionalFormats[cFRuleIdx]);
            this.parent.notify(applyCellFormat, {
                style: sheet.conditionalFormats[cFRuleIdx].format.style, rowIdx: rIdx, colIdx: cIdx,
                lastCell: true, isHeightCheckNeeded: true, manualUpdate: true
            });
        }
        else {
            for (var idx = 0; idx < cFColors.length; idx++) {
                if (td.classList.contains(cFColors[idx])) {
                    td.classList.remove(cFColors[idx]);
                }
            }
            var style = this.parent.getCellStyleValue(['backgroundColor', 'color'], [rIdx, cIdx]);
            this.parent.notify(applyCellFormat, {
                style: style, rowIdx: rIdx, colIdx: cIdx
            });
        }
    };
    // tslint:disable-next-line:max-func-body-length
    ConditionalFormatting.prototype.cFRCheck = function (cFRule, value, td, rIdx, cIdx, isInitial) {
        var cellValue = value.toString();
        var cFRuleValue1 = !isNullOrUndefined(cFRule.value) ? cFRule.value.split(',')[0].toString() : '';
        var cFRuleValue2 = !isNullOrUndefined(cFRule.value) ? cFRule.value.split(',')[1] ? cFRule.value.split(',')[1].toString() : '' : '';
        var isApply = false;
        var type = cFRule.type;
        if (('BlueDataBar' + 'GreenDataBar' + 'RedDataBar' + 'OrangeDataBar' + 'LightBlueDataBar' + 'PurpleDataBar').includes(type)) {
            type = 'DataBar';
        }
        if (('GYRColorScale' + 'RYGColorScale' + 'GWRColorScale' + 'RWGColorScale' + 'BWRColorScale' + 'RWBColorScale' + 'WRColorScale' +
            'RWColorScale' + 'GWColorScale' + 'WGColorScale' + 'GYColorScale' + 'YGColorScale').includes(type)) {
            type = 'ColorScale';
        }
        if (('ThreeArrows' + 'ThreeArrowsGray' + 'FourArrowsGray' + 'FourArrows' + 'FiveArrowsGray' +
            'FiveArrows' + 'ThreeTrafficLights1' + 'ThreeTrafficLights2' + 'ThreeSigns' + 'FourTrafficLights' +
            'FourRedToBlack' + 'ThreeSymbols' + 'ThreeSymbols2' + 'ThreeFlags' + 'FourRating' + 'FiveQuarters' +
            'FiveRating' + 'ThreeTriangles' + 'ThreeStars' + 'FiveBoxes').includes(type)) {
            type = 'IconSet';
        }
        switch (type) {
            case 'GreaterThan':
                isApply = this.isGreaterThanLessThan(cFRule, cellValue, cFRuleValue1, true);
                break;
            case 'LessThan':
                isApply = this.isGreaterThanLessThan(cFRule, cellValue, cFRuleValue1, false);
                break;
            case 'Between':
                isApply = this.isBetWeen(cFRule, cellValue, cFRuleValue1, cFRuleValue2);
                break;
            case 'EqualTo':
                isApply = this.isEqualTo(cFRule, cellValue, cFRuleValue1);
                break;
            case 'ContainsText':
                isApply = this.isContainsText(cellValue, cFRuleValue1);
                break;
            case 'DateOccur':
                var dateEventArgs = {
                    value: cFRuleValue1,
                    rowIndex: 0,
                    colIndex: 0,
                    sheetIndex: 0,
                    updatedVal: ''
                };
                this.parent.notify(checkDateFormat, dateEventArgs);
                if (cellValue === dateEventArgs.updatedVal) {
                    isApply = true;
                }
                break;
            case 'Unique':
            case 'Duplicate':
                isApply = this.isDuplicateUnique(cellValue, cFRule, false);
                break;
            case 'Top10Items':
                isApply = this.isTopBottomTenValue(cellValue, cFRuleValue1, cFRule, true);
                break;
            case 'Bottom10Items':
                isApply = this.isTopBottomTenValue(cellValue, cFRuleValue1, cFRule, false);
                break;
            case 'Top10Percentage':
                isApply = this.isTopBottomTenPercentage(cellValue, cFRuleValue1, cFRule, true);
                break;
            case 'Bottom10Percentage':
                isApply = this.isTopBottomTenPercentage(cellValue, cFRuleValue1, cFRule, false);
                break;
            case 'AboveAverage':
                isApply = this.isAboveBelowAverage(cellValue, cFRuleValue1, cFRule, true);
                break;
            case 'BelowAverage':
                isApply = this.isAboveBelowAverage(cellValue, cFRuleValue1, cFRule, false);
                break;
            case 'DataBar':
                this.isDataBarColorScalesIconSets(type, cellValue, cFRule, td, rIdx, cIdx, isInitial);
                break;
            case 'ColorScale':
                this.isDataBarColorScalesIconSets(type, cellValue, cFRule, td, rIdx, cIdx, isInitial);
                break;
            case 'IconSet':
                this.isDataBarColorScalesIconSets(type, cellValue, cFRule, td, rIdx, cIdx, isInitial);
                break;
        }
        return isApply;
    };
    ConditionalFormatting.prototype.isDataBarColorScalesIconSets = function (type, cellValue, cFRule, td, rIdx, cIdx, isInitial) {
        var sheet = this.parent.getActiveSheet();
        if (isInitial) {
            type === 'DataBar' ? this.applyDataBars(cellValue, cFRule, td, rIdx, cIdx) : type === 'ColorScale' ?
                this.applyColorScale(cellValue, cFRule, td, rIdx, cIdx, isInitial) :
                this.applyIconSet(cellValue, cFRule, td, rIdx, cIdx, isInitial);
        }
        else {
            td = null;
            var rangeArr = cFRule.range.split(',');
            for (var rangeIdx = 0; rangeIdx < rangeArr.length; rangeIdx++) {
                var selIndexes = getRangeIndexes(rangeArr[rangeIdx]);
                for (var rIdx_1 = selIndexes[0]; rIdx_1 <= selIndexes[2]; rIdx_1++) {
                    for (var cIdx_1 = selIndexes[1]; cIdx_1 <= selIndexes[3]; cIdx_1++) {
                        if (getCell(rIdx_1, cIdx_1, sheet)) {
                            var cellVal = getCell(rIdx_1, cIdx_1, sheet).value;
                            td = this.parent.getCell(rIdx_1, cIdx_1);
                            type === 'DataBar' ? this.applyDataBars(cellVal, cFRule, td, rIdx_1, cIdx_1) :
                                type === 'ColorScale' ?
                                    this.applyColorScale(cellVal, cFRule, td, rIdx_1, cIdx_1, isInitial) :
                                    this.applyIconSet(cellVal, cFRule, td, rIdx_1, cIdx_1, isInitial);
                        }
                    }
                }
            }
        }
    };
    ConditionalFormatting.prototype.applyIconSet = function (val, cFRule, tdEle, rIdx, cIdx, isInitial) {
        var value = parseInt(val, 10);
        var rowIdx;
        var colIdx;
        var iconList = this.getIconList(cFRule.type).split(',');
        var min;
        var max;
        var valArr = [];
        var sheet = this.parent.getActiveSheet();
        var actCell = sheet.rows[rIdx] && sheet.rows[rIdx].cells[cIdx] ? sheet.rows[rIdx].cells[cIdx] : null;
        if (!actCell) {
            return;
        }
        var td = tdEle ||
            this.parent.getMainContent().getElementsByClassName('e-row')[rIdx].getElementsByClassName('e-cell')[cIdx];
        var rangeArr = cFRule.range.split(',');
        for (var rIdx_2 = 0; rIdx_2 < rangeArr.length; rIdx_2++) {
            var selIndexes = getRangeIndexes(rangeArr[rIdx_2]);
            valArr = this.getNumericArray(selIndexes, valArr);
        }
        valArr = valArr.sort(function (n1, n2) { return n1 - n2; });
        min = valArr[0];
        max = valArr[valArr.length - 1];
        var currentSymbol;
        if (iconList.length === 3) {
            var maxPercent = min + (0.67 * ((max) - (min)));
            var minPercent = min + (0.33 * ((max) - (min)));
            currentSymbol =
                'e-' + (value >= maxPercent ? iconList[0].trim() : value >= minPercent ? iconList[1].trim() : iconList[2].trim());
        }
        else if (iconList.length === 4) {
            var percent1 = min + (0.25 * ((max) - (min)));
            var percent2 = min + (0.50 * ((max) - (min)));
            var percent3 = min + (0.75 * ((max) - (min)));
            currentSymbol =
                'e-' + (value >= percent3 ? iconList[0].trim() : value >= percent2 ? iconList[1].trim() : value >= percent1 ?
                    iconList[2].trim() : iconList[3].trim());
        }
        else if (iconList.length === 5) {
            var percent1 = min + (0.20 * ((max) - (min)));
            var percent2 = min + (0.40 * ((max) - (min)));
            var percent3 = min + (0.60 * ((max) - (min)));
            var percent4 = min + (0.80 * ((max) - (min)));
            currentSymbol =
                'e-' + (value >= percent4 ? iconList[0].trim() : value >= percent3 ? iconList[1].trim() : value >= percent2 ?
                    iconList[2].trim() : value >= percent1 ? iconList[3].trim() : iconList[4].trim());
        }
        if (!isNullOrUndefined(actCell)) {
            var cfIcon = this.parent.createElement('span', { className: 'e-icon' });
            cfIcon.classList.add('e-iconsetspan');
            cfIcon.classList.add(currentSymbol);
            this.applyIconSetIcon({ rowIndex: rIdx, colIndex: cIdx }, cfIcon, td);
        }
    };
    ConditionalFormatting.prototype.applyIconSetIcon = function (activeObj, cfIcon, td) {
        var sheet = this.parent.getActiveSheet();
        var rowIdx = activeObj.rowIndex;
        var colIdx = activeObj.colIndex;
        var cellVal = getCell(rowIdx, colIdx, sheet).value;
        var activeEle = td;
        var sheetIdx = sheet.index;
        if (activeEle.classList.contains('e-iconset') && activeEle.querySelector('.e-iconsetspan')) {
            activeEle.removeChild(activeEle.querySelector('.e-iconsetspan'));
        }
        if (isNumber(cellVal)) {
            activeEle.insertBefore(cfIcon, activeEle.childNodes[0]);
            activeEle.classList.add('e-iconset');
        }
    };
    ConditionalFormatting.prototype.getIconList = function (iconName) {
        var result = '3arrows-1,3arrows-2,3arrows-3';
        switch (iconName) {
            case 'ThreeArrows':
                return '3arrows-1,3arrows-2,3arrows-3';
            case 'ThreeArrowsGray':
                return '3arrowsgray-1,3arrowsgray-2,3arrowsgray-3';
            case 'FourArrowsGray':
                return '4arrowsgray-1,4arrowsgray-2,4arrowsgray-3,4arrowsgray-4';
            case 'FourArrows':
                return '4arrows-1,4arrows-2,4arrows-3,4arrows-4';
            case 'FiveArrowsGray':
                return '5arrowsgray-1,5arrowsgray-2,5arrowsgray-3,5arrowsgray-4,5arrowsgray-5';
            case 'FiveArrows':
                return '5arrows-1,5arrows-2,5arrows-3,5arrows-4,5arrows-5';
            case 'ThreeTrafficLights1':
                return '3trafficlights-1,3trafficlights-2,3trafficlights-3';
            case 'ThreeTrafficLights2':
                return '3rafficlights2-1,3rafficlights2-2,3rafficlights2-3';
            case 'ThreeSigns':
                return '3signs-1,3signs-2,3signs-3';
            case 'FourTrafficLights':
                return '4trafficlights-1,4trafficlights-2,4trafficlights-3,4trafficlights-4';
            case 'FourRedToBlack':
                return '4redtoblack-1,4redtoblack-2,4redtoblack-3,4redtoblack-4';
            case 'ThreeSymbols':
                return '3symbols-1,3symbols-2,3symbols-3';
            case 'ThreeSymbols2':
                return '3symbols2-1,3symbols2-2,3symbols2-3';
            case 'ThreeFlags':
                return '3flags-1,3flags-2,3flags-3';
            case 'FourRating':
                return '4rating-1,4rating-2,4rating-3,4rating-4';
            case 'FiveQuarters':
                return '5quarters-1,5quarters-2,5quarters-3,5quarters-4,5quarters-5';
            case 'FiveRating':
                return '5rating-1,5rating-2,5rating-3,5rating-4,5rating-5';
            case 'ThreeTriangles':
                return '3triangles-1,3triangles-2,3triangles-3';
            case 'ThreeStars':
                return '3stars-1,3stars-2,3stars-3';
            case 'FiveBoxes':
                return '5boxes-1,5boxes-2,5boxes-3,5boxes-4,5boxes-5';
        }
        return result;
    };
    ConditionalFormatting.prototype.applyColorScale = function (val, cFRule, tdEle, rIdx, cIdx, isInitial) {
        var sheet = this.parent.getActiveSheet();
        var value = parseInt(val, 10);
        var rowIdx;
        var colIdx;
        var id;
        var valArr = [];
        var colors = this.getColor(cFRule.type);
        var actCell = sheet.rows[rIdx] && sheet.rows[rIdx].cells[cIdx] ? sheet.rows[rIdx].cells[cIdx] : null;
        if (!actCell) {
            return;
        }
        var rangeArr = cFRule.range.split(',');
        var td = tdEle ||
            this.parent.getMainContent().getElementsByClassName('e-row')[rIdx].getElementsByClassName('e-cell')[cIdx];
        for (var rIdx_3 = 0; rIdx_3 < rangeArr.length; rIdx_3++) {
            var selIndexes = getRangeIndexes(rangeArr[rIdx_3]);
            valArr = this.getNumericArray(selIndexes, valArr);
        }
        valArr = valArr.sort(function (n1, n2) { return n1 - n2; }).reverse();
        for (var i = 0; i < valArr.length; i++) {
            if (valArr[i] === value) {
                id = i;
                break;
            }
        }
        var hexcode = (id === 0) ? colors[0] : (id === valArr.length - 1) ? colors[colors.length - 1] :
            (valArr.length === 3 && id === 1) ? colors[1] : this.getGradient(id, colors[0], colors[1], colors[2], valArr.length);
        if (!isNullOrUndefined(actCell)) {
            var style = {};
            if (!isNullOrUndefined(id)) {
                style = { backgroundColor: hexcode };
                td.style.backgroundColor = hexcode;
            }
            else {
                style = this.parent.getCellStyleValue(['backgroundColor'], [rIdx, cIdx]);
                td.style.backgroundColor = style.backgroundColor;
            }
        }
    };
    // tslint:disable-next-line:max-func-body-length
    ConditionalFormatting.prototype.applyDataBars = function (val, cFRule, tdEle, rIdx, cIdx) {
        var value;
        var rowIdx;
        var colIdx;
        var sheet = this.parent.getActiveSheet();
        var left = {};
        var right = {};
        var posColor = '';
        var negColor = '';
        var cFColor = cFRule.type;
        var actCell = sheet.rows[rIdx] && sheet.rows[rIdx].cells[cIdx] ? sheet.rows[rIdx].cells[cIdx] : null;
        if (!actCell) {
            return;
        }
        var valArr = [];
        var row = this.parent.getMainContent().getElementsByClassName('e-row')[rIdx];
        var td = tdEle ||
            this.parent.getMainContent().getElementsByClassName('e-row')[rIdx].getElementsByClassName('e-cell')[cIdx];
        var rowHeight = !row ? 20 : row.style ? parseInt(row.style.height, 10) : 20;
        var posArr = [];
        var negArr = [];
        var topVal;
        var leftStandardWidth = 0;
        value = parseInt(val, 10);
        var rangeArr = cFRule.range.split(',');
        for (var rIdx_4 = 0; rIdx_4 < rangeArr.length; rIdx_4++) {
            var selIndexes = getRangeIndexes(rangeArr[rIdx_4]);
            valArr = this.getNumericArray(selIndexes, valArr);
        }
        for (var idx = 0; idx < valArr.length; idx++) {
            valArr[idx] > 0 ? posArr.push(valArr[idx]) : negArr.push(valArr[idx]);
        }
        cFColor = cFColor === 'BlueDataBar' ? 'B' : cFColor === 'GreenDataBar' ? 'G' : cFColor === 'RedDataBar' ? 'R' :
            cFColor === 'OrangeDataBar' ? 'O' : cFColor === 'LightBlueDataBar' ? 'LB' : cFColor === 'PurpleDataBar' ? 'P' : '';
        posColor = this.getColor(cFColor)[0];
        negColor = this.getColor('R')[0];
        posArr = posArr.sort(function (n1, n2) { return n1 - n2; }).reverse();
        negArr = negArr.sort(function (n1, n2) { return n1 - n2; });
        if (negArr.length && posArr.length) {
            topVal = posArr[0] + Math.abs(negArr[0]);
            leftStandardWidth = (Math.abs((negArr[0] / topVal) * 100));
        }
        else if (negArr.length || posArr.length) {
            topVal = negArr.length ? negArr[0] : posArr[0];
        }
        else {
            return;
        }
        if (td) {
            if (isNullOrUndefined(value) || val === '') {
                if (td.getElementsByClassName('e-cf-databar')[0]) {
                    td.removeChild(td.getElementsByClassName('e-cf-databar')[0]);
                }
            }
        }
        if (isNumber(value)) {
            var databar = this.parent.createElement('div', { id: 'spreadsheet-databar', className: 'e-cf-databar' });
            var leftSpan = this.parent.createElement('span', { id: 'spreadsheet-leftspan', className: 'e-databar' });
            var rightSpan = this.parent.createElement('span', { id: 'spreadsheet-rightspan', className: 'e-databar' });
            var dataSpan = this.parent.createElement('span', { id: 'spreadsheet-dataspan', className: 'e-databar-value' });
            var iconSetSpan = void 0;
            left = leftSpan.style;
            right = rightSpan.style;
            databar.appendChild(dataSpan);
            databar.insertBefore(rightSpan, dataSpan);
            databar.insertBefore(leftSpan, rightSpan);
            if (td.querySelector('.e-iconsetspan')) {
                iconSetSpan = td.querySelector('.e-iconsetspan');
            }
            td.textContent = '';
            td.appendChild(databar);
            if (iconSetSpan) {
                td.insertBefore(iconSetSpan, td.firstElementChild);
            }
            dataSpan.innerHTML = this.parent.getDisplayText(actCell);
            databar.style.height = rowHeight - 1 + 'px';
            dataSpan.style.fontSize = '11pt';
            if (!negArr.length) {
                right.width = '' + Math.ceil(Math.abs((value / topVal) * 100)) + '%';
                right.height = rowHeight - 3 + 'px';
                right.backgroundColor = cFColor = posColor;
                right.left = '0px';
            }
            else if (!posArr.length) {
                right.width = '' + Math.ceil(Math.abs((value / topVal) * 100)) + '%';
                right.height = rowHeight - 3 + 'px';
                right.backgroundColor = cFColor = negColor;
                right.left = '0px';
            }
            else {
                if (value > -1) {
                    left.width = leftStandardWidth + '%';
                    left.height = rowHeight - 3 + 'px'; // -3 buffer of data bar.
                    left.backgroundColor = 'transparent';
                    left.left = '0px';
                    right.width = '' + Math.ceil(Math.abs((value / topVal) * 100)) + '%';
                    right.height = rowHeight - 3 + 'px';
                    right.backgroundColor = cFColor = posColor;
                    right.left = leftStandardWidth + '%';
                }
                else if (value < 0) {
                    left.width = '' + Math.ceil(Math.abs((value / topVal) * 100)) + '%';
                    left.height = rowHeight - 3 + 'px';
                    left.backgroundColor = negColor;
                    if (left.width === leftStandardWidth + '%') {
                        left.left = '0px';
                    }
                    else {
                        left.right = (100 - leftStandardWidth) + '%';
                    }
                }
            }
        }
    };
    ConditionalFormatting.prototype.getNumericArray = function (selIndexes, valArr) {
        var sheet = this.parent.getActiveSheet();
        for (var rIdx = selIndexes[0]; rIdx <= selIndexes[2]; rIdx++) {
            for (var cIdx = selIndexes[1]; cIdx <= selIndexes[3]; cIdx++) {
                var cellVal = getCell(rIdx, cIdx, sheet) && getCell(rIdx, cIdx, sheet).value ? getCell(rIdx, cIdx, sheet).value : '';
                if (!isNullOrUndefined(cellVal) && !isNumber(cellVal) && !isDateTime(cellVal)) {
                    continue;
                }
                else {
                    var cellValue = parseInt(cellVal, 10);
                    if (!isNullOrUndefined(cellVal) && cellVal !== '') {
                        valArr.push(cellValue);
                    }
                }
            }
        }
        return valArr;
    };
    ConditionalFormatting.prototype.getColor = function (cfColor) {
        if (cfColor === 'LB') {
            return ['#008aef'];
        }
        var colorCodeArr = cfColor.split('');
        var colorArr = [];
        for (var i = 0; i < colorCodeArr.length; i++) {
            switch (colorCodeArr[i]) {
                case 'G':
                    colorArr.push('#63be7b');
                    break;
                case 'Y':
                    colorArr.push('#ffeb84');
                    break;
                case 'R':
                    colorArr.push('#f8696b');
                    break;
                case 'W':
                    colorArr.push('#ffffff');
                    break;
                case 'B':
                    colorArr.push('#5a8ac6');
                    break;
                case 'O':
                    colorArr.push('#ffb628');
                    break;
                case 'LB':
                    colorArr.push('#008aef');
                    break;
                case 'P':
                    colorArr.push('#d6007b');
                    break;
            }
        }
        return colorArr;
    };
    ConditionalFormatting.prototype.getGradient = function (t, start, middle, end, large) {
        if (isNullOrUndefined(end)) {
            return this.getLinear(start, middle, t / large);
        }
        else {
            var center = large / 2;
            return t >= center ? this.getLinear(middle, end, Math.abs((t - center) / center)) : this.getLinear(start, middle, t / center);
        }
    };
    ConditionalFormatting.prototype.getLinear = function (s, e, x) {
        var r = this.byteLinear(s[1] + s[2], e[1] + e[2], x);
        var g = this.byteLinear(s[3] + s[4], e[3] + e[4], x);
        var b = this.byteLinear(s[5] + s[6], e[5] + e[6], x);
        return '#' + r + g + b;
    };
    ConditionalFormatting.prototype.byteLinear = function (a, b, x) {
        var y = (parseInt(a, 16) * (1 - x) + parseInt(b, 16) * x) | 0;
        return Math.abs(y).toString(16);
    };
    ConditionalFormatting.prototype.isGreaterThanLessThan = function (cFRule, value, input, isGrearThan) {
        var numRegx = new RegExp(/[^.0-9]+/g);
        var txtRegx = new RegExp(/[^.-a-zA-Z 0-9]+/g);
        var isApply = false;
        if (isNumber(value)) {
            if (isNumber(input)) {
                isApply = isGrearThan ? parseFloat(value) > parseFloat(input.replace(txtRegx, '')) :
                    parseFloat(value) < parseFloat(input.replace(txtRegx, ''));
            }
            else {
                var dateEventArgs = {
                    value: input,
                    rowIndex: 0,
                    colIndex: 0,
                    sheetIndex: 0,
                    isDate: false,
                    updatedVal: '',
                    isTime: false
                };
                this.parent.notify(checkDateFormat, dateEventArgs);
                if (dateEventArgs.isDate || dateEventArgs.isTime) {
                    isApply = isGrearThan ? value > dateEventArgs.updatedVal : value < dateEventArgs.updatedVal;
                    cFRule.value = dateEventArgs.updatedVal.toString();
                }
                else {
                    isApply = isGrearThan ? value.toLowerCase() > input.toLowerCase() : value.toLowerCase() < input.toLowerCase();
                }
            }
        }
        else if (value === '' && !isGrearThan) {
            isApply = true;
        }
        return isApply;
    };
    ConditionalFormatting.prototype.isBetWeen = function (cFRule, value, input1, input2) {
        var numRegx = new RegExp(/[^.0-9]+/g);
        var txtRegx = new RegExp(/[^.-a-zA-Z 0-9]+/g);
        var isApply = false;
        input1 = input1.replace(txtRegx, '');
        input2 = input2.replace(txtRegx, '');
        if (isNumber(value)) {
            if (isNumber(input1)) {
                isApply = parseFloat(value) >= parseFloat(input1) && parseFloat(value) <= parseFloat(input2);
            }
            else {
                if (input1 && input2) {
                    var dateEventArgs1 = {
                        value: input1,
                        rowIndex: 0,
                        colIndex: 0,
                        sheetIndex: 0,
                        isDate: false,
                        updatedVal: '',
                        isTime: false
                    };
                    var dateEventArgs2 = {
                        value: input2,
                        rowIndex: 0,
                        colIndex: 0,
                        sheetIndex: 0,
                        isDate: false,
                        updatedVal: '',
                        isTime: false
                    };
                    this.parent.notify(checkDateFormat, dateEventArgs1);
                    this.parent.notify(checkDateFormat, dateEventArgs2);
                    if ((dateEventArgs1.isDate || dateEventArgs1.isTime) && (dateEventArgs2.isDate || dateEventArgs2.isTime)) {
                        isApply = value >= dateEventArgs1.updatedVal && value <= dateEventArgs2.updatedVal;
                        cFRule.value = dateEventArgs1.updatedVal.toString() + ',' + dateEventArgs2.updatedVal.toString();
                    }
                    else {
                        isApply = value.toLowerCase() >= input1.toLowerCase() && value.toLowerCase() <= input2.toLowerCase();
                    }
                }
            }
        }
        return isApply;
    };
    ConditionalFormatting.prototype.isEqualTo = function (cFRule, value, input) {
        var numRegx = new RegExp(/[^.0-9]+/g);
        var txtRegx = new RegExp(/[^.-a-zA-Z 0-9]+/g);
        var isApply = false;
        if (isNumber(value)) {
            if (isNumber(input)) {
                isApply = parseFloat(value) === parseFloat(input.replace(txtRegx, ''));
            }
            else {
                var dateTimeArgs = {
                    value: input,
                    rowIndex: 0,
                    colIndex: 0,
                    sheetIndex: 0,
                    isDate: false,
                    updatedVal: '',
                    isTime: false
                };
                this.parent.notify(checkDateFormat, dateTimeArgs);
                if (dateTimeArgs.isTime || dateTimeArgs.isDate) {
                    isApply = value === dateTimeArgs.updatedVal;
                    cFRule.value = dateTimeArgs.updatedVal.toString();
                }
                else {
                    isApply = value.toLowerCase() === input.toLowerCase();
                }
            }
        }
        return isApply;
    };
    ConditionalFormatting.prototype.isContainsText = function (value, input) {
        var numRegx = new RegExp(/[^.0-9]+/g);
        var txtRegx = new RegExp(/[^.-a-zA-Z 0-9]+/g);
        var isApply = false;
        if (isNullOrUndefined(value) || !value.length) {
            isApply = false;
        }
        else if (isNumber(input.replace(txtRegx, ''))) {
            input = input.replace(txtRegx, '');
            if (isDateTime(value)) {
                value = ((dateToInt(value))).toString();
            }
            isApply = value.indexOf(input) > -1;
        }
        else if (isDateTime(input)) {
            if (isDateTime(value)) {
                value = dateToInt(value).toString();
            }
            isApply = value.indexOf(dateToInt(input).toString()) > -1;
        }
        else {
            isApply = value.toLowerCase().indexOf(input.toLowerCase()) > -1;
        }
        return isApply;
    };
    ConditionalFormatting.prototype.isTopBottomTenValue = function (cellValue, inp, cFRule, isTop) {
        var sheet = this.parent.getActiveSheet();
        var numRegx = new RegExp(/[^.0-9]+/g);
        var txtRegx = new RegExp(/[^.-a-zA-Z 0-9]+/g);
        var value = parseInt(cellValue, 10);
        var input = parseInt(inp, 10);
        var result = false;
        if (isNumber(inp)) {
            if (isNumber(cellValue)) {
                value = parseFloat(cellValue);
                input = parseFloat(inp.replace(txtRegx, ''));
            }
            else if (isDateTime(cellValue)) {
                value = dateToInt(cellValue);
                input = parseFloat(inp);
            }
            var dataArray = [];
            var cellVal = void 0;
            var rangeArr = cFRule.range.split(',');
            for (var rangeIdx = 0; rangeIdx < rangeArr.length; rangeIdx++) {
                var cFRuleIndexes = getRangeIndexes(rangeArr[rangeIdx]);
                for (var rowIdx = cFRuleIndexes[0]; rowIdx <= cFRuleIndexes[2]; rowIdx++) {
                    for (var colIdx = cFRuleIndexes[1]; colIdx <= cFRuleIndexes[3]; colIdx++) {
                        cellVal = getCell(rowIdx, colIdx, sheet) && getCell(rowIdx, colIdx, sheet).value ?
                            getCell(rowIdx, colIdx, sheet).value : '';
                        if (cellVal && isNumber(cellVal)) {
                            cellVal = parseFloat(cellVal);
                            dataArray.push(cellVal);
                        }
                    }
                }
            }
            dataArray =
                isTop ? dataArray.sort(function (n1, n2) { return n1 - n2; }).reverse() : dataArray.sort(function (n1, n2) { return n1 - n2; });
            dataArray = dataArray.slice(0, input);
            result = (dataArray.indexOf(value) > -1);
        }
        return result;
    };
    ConditionalFormatting.prototype.isTopBottomTenPercentage = function (val, inp, cFRule, isTop) {
        var sheet = this.parent.getActiveSheet();
        var numRegx = new RegExp(/[^.0-9]+/g);
        var txtRegx = new RegExp(/[^.-a-zA-Z 0-9]+/g);
        var value = parseInt(val, 10);
        var input = parseInt(inp, 10);
        var result = false;
        if (isNumber(inp)) {
            if (isNumber(val)) {
                value = parseFloat(val);
                input = parseFloat(inp.replace(txtRegx, ''));
            }
            else if (isDateTime(val)) {
                value = dateToInt(val);
                input = parseFloat(inp);
            }
            var dataArr = [];
            var cellVal = void 0;
            var diff = void 0;
            var count = 0;
            var considerCount = void 0;
            var rangeArr = cFRule.range.split(',');
            for (var rangeIdx = 0; rangeIdx < rangeArr.length; rangeIdx++) {
                var cFRuleIndexes = getRangeIndexes(rangeArr[rangeIdx]);
                for (var rIdx = cFRuleIndexes[0]; rIdx <= cFRuleIndexes[2]; rIdx++) {
                    for (var cIdx = cFRuleIndexes[1]; cIdx <= cFRuleIndexes[3]; cIdx++) {
                        cellVal = getCell(rIdx, cIdx, sheet) && getCell(rIdx, cIdx, sheet).value ? getCell(rIdx, cIdx, sheet).value : '';
                        if (cellVal && isNumber(cellVal)) {
                            cellVal = parseFloat(cellVal);
                            dataArr.push(cellVal);
                        }
                        count++;
                    }
                }
            }
            diff = 100 / count;
            considerCount = input / diff;
            considerCount = Math.ceil(considerCount);
            dataArr =
                isTop ? dataArr.sort(function (n1, n2) { return n1 - n2; }).reverse() : dataArr.sort(function (n1, n2) { return n1 - n2; });
            dataArr = dataArr.slice(0, considerCount ? considerCount : 1);
            result = (dataArr.indexOf(value) > -1);
        }
        return result;
    };
    ConditionalFormatting.prototype.isAboveBelowAverage = function (val, inp, cFRule, isAbove) {
        var sheet = this.parent.getActiveSheet();
        var value = parseFloat(val);
        var rangeColl = cFRule.range.split(',');
        var result = false;
        var dataArr = [];
        var cellValue;
        var average = 0;
        for (var rangeIdx = 0; rangeIdx < rangeColl.length; rangeIdx++) {
            var cFRuleIndexes = getRangeIndexes(rangeColl[rangeIdx]);
            for (var rIdx = cFRuleIndexes[0]; rIdx <= cFRuleIndexes[2]; rIdx++) {
                for (var cIdx = cFRuleIndexes[1]; cIdx <= cFRuleIndexes[3]; cIdx++) {
                    cellValue = getCell(rIdx, cIdx, sheet) && getCell(rIdx, cIdx, sheet).value ? getCell(rIdx, cIdx, sheet).value : '';
                    if (cellValue && isNumber(cellValue)) {
                        cellValue = parseFloat(cellValue);
                        dataArr.push(cellValue);
                    }
                }
            }
        }
        for (var idx = 0; idx < dataArr.length; idx++) {
            average += dataArr[idx];
        }
        average = average / dataArr.length;
        result = isAbove ? (value > average) : (value < average);
        return result;
    };
    ConditionalFormatting.prototype.isDuplicateUnique = function (val, cFRule, isAbove) {
        var type = cFRule.type;
        var count = 0;
        var sheet = this.parent.getActiveSheet();
        var value = val;
        var rangeColl = cFRule.range.split(',');
        var cellValue;
        if (isNullOrUndefined(value) || value === '') {
            return false;
        }
        for (var rIdx = 0; rIdx < rangeColl.length; rIdx++) {
            var cFRuleIndexes = getRangeIndexes(rangeColl[rIdx]);
            for (var rowIdx = cFRuleIndexes[0]; rowIdx <= cFRuleIndexes[2]; rowIdx++) {
                for (var colIdx = cFRuleIndexes[1]; colIdx <= cFRuleIndexes[3]; colIdx++) {
                    cellValue = getCell(rowIdx, colIdx, sheet) && getCell(rowIdx, colIdx, sheet).value ?
                        getCell(rowIdx, colIdx, sheet).value.toString() : '';
                    if (cellValue && cellValue !== '') {
                        count = value.toLowerCase() === cellValue.toLowerCase() ? count + 1 : count;
                        if (count === 2) {
                            return type === 'Duplicate' ? true : false;
                        }
                    }
                }
            }
        }
        return type === 'Duplicate' ? false : true;
    };
    ConditionalFormatting.prototype.setFormat = function (td, cFRule) {
        if (!cFRule.format) {
            cFRule.format = {};
        }
        if (!cFRule.format.style) {
            cFRule.format.style = {};
        }
        if (td.classList.contains('e-redft')) {
            cFRule.format.style.backgroundColor = '#ffc7ce';
            cFRule.format.style.color = '#9c0055';
        }
        else if (td.classList.contains('e-yellowft')) {
            cFRule.format.style.backgroundColor = '#ffeb9c';
            cFRule.format.style.color = '#9c6500';
        }
        else if (td.classList.contains('e-greenft')) {
            cFRule.format.style.backgroundColor = '#c6efce';
            cFRule.format.style.color = '#006100';
        }
        else if (td.classList.contains('e-redf')) {
            cFRule.format.style.backgroundColor = '#ffc7ce';
        }
        else if (td.classList.contains('e-redt')) {
            cFRule.format.style.color = '#9c0055';
        }
    };
    /**
     * Gets the module name.
     * @returns string
     */
    ConditionalFormatting.prototype.getModuleName = function () {
        return 'conditionalFormatting';
    };
    return ConditionalFormatting;
}());
export { ConditionalFormatting };
