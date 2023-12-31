import { getRangeIndexes } from '../common/index';
import { getCell, getSheet, setCell, getSheetIndex } from '../base/index';
import { Internationalization, getNumberDependable, getNumericObject, isNullOrUndefined } from '@syncfusion/ej2-base';
import { isNumber, toFraction, intToDate, toDate, dateToInt } from '../common/math';
import { applyNumberFormatting, getFormattedCellObject, refreshCellElement, checkDateFormat, getFormattedBarText } from '../common/event';
/**
 * Specifies number format.
 */
var WorkbookNumberFormat = /** @class */ (function () {
    function WorkbookNumberFormat(parent) {
        this.parent = parent;
        this.localeObj = getNumericObject(this.parent.locale);
        /* tslint:disable:no-any */
        this.decimalSep = this.localeObj.decimal;
        this.groupSep = this.localeObj.group;
        this.addEventListener();
    }
    WorkbookNumberFormat.prototype.numberFormatting = function (args) {
        var activeSheetIndex = this.parent.activeSheetIndex;
        if (args.range && args.range.indexOf('!') > -1) {
            activeSheetIndex = getSheetIndex(this.parent, args.range.split('!')[0]);
        }
        var sheet = this.parent.sheets[activeSheetIndex];
        var formatRange = args.range ? ((args.range.indexOf('!') > -1) ?
            args.range.split('!')[1] : args.range) : sheet.selectedRange;
        var selectedRange = getRangeIndexes(formatRange);
        var cell;
        for (var i = selectedRange[0]; i <= selectedRange[2]; i++) {
            for (var j = selectedRange[1]; j <= selectedRange[3]; j++) {
                setCell(i, j, sheet, { format: args.format }, true);
                cell = getCell(i, j, sheet, true);
                this.getFormattedCell({
                    type: getTypeFromFormat(cell.format), value: cell.value,
                    format: cell.format, rowIndex: i, colIndex: j,
                    sheetIndex: activeSheetIndex, cell: cell
                });
            }
        }
    };
    /**
     * @hidden
     */
    WorkbookNumberFormat.prototype.getFormattedCell = function (args) {
        var fResult = isNullOrUndefined(args.value) ? '' : args.value;
        var sheet = this.parent.sheets[isNullOrUndefined(args.sheetIndex) ? this.parent.activeSheetIndex :
            args.sheetIndex];
        var range = getRangeIndexes(sheet.activeCell);
        var sheetIdx = Number(args.sheetIndex) ? Number(args.sheetIndex) : this.parent.activeSheetIndex;
        var cell = args.cell ? args.cell : getCell(range[0], range[1], sheet);
        var rightAlign = false;
        var currencySymbol = getNumberDependable(this.parent.locale, 'USD');
        if (args.format === '' || args.format === 'General') {
            cell = cell ? cell : {};
            var dateEventArgs = {
                value: args.value, rowIndex: range[0], colIndex: range[1], sheetIndex: this.parent.activeSheetIndex,
                updatedVal: args.value, isDate: false, isTime: false
            };
            this.checkDateFormat(dateEventArgs);
            if (dateEventArgs.isDate) {
                rightAlign = true;
                cell.value = args.value = dateEventArgs.updatedVal;
                cell.format = args.format = getFormatFromType('ShortDate');
            }
            else if (dateEventArgs.isTime) {
                rightAlign = true;
                cell.value = args.value = dateEventArgs.updatedVal;
                cell.format = args.format = getFormatFromType('Time');
            }
        }
        args.type = args.format ? getTypeFromFormat(args.format) : 'General';
        var result = this.processFormats(args, fResult, rightAlign, cell);
        if ((this.parent.getActiveSheet().id - 1 === sheetIdx)) {
            this.parent.notify(refreshCellElement, {
                isRightAlign: result.rightAlign, result: result.fResult || args.value,
                rowIndex: args.rowIndex, colIndex: args.colIndex, sheetIndex: args.sheetIndex,
                type: args.type, curSymbol: currencySymbol, value: args.value || ''
            });
        }
        if (!args.onLoad && (args.rowIndex > sheet.usedRange.rowIndex || args.colIndex > sheet.usedRange.colIndex)) {
            this.parent.setUsedRange(args.rowIndex, args.colIndex);
        }
        args.formattedText = result.fResult || args.value;
        args.isRightAlign = result.rightAlign;
        args.curSymbol = currencySymbol;
        return args.formattedText;
    };
    WorkbookNumberFormat.prototype.processFormats = function (args, fResult, isRightAlign, cell) {
        var intl = new Internationalization();
        var currencySymbol = getNumberDependable(this.parent.locale, 'USD');
        var result;
        args.format = args.format ? args.format : 'General';
        if (fResult !== '') {
            switch (args.type) {
                case 'General':
                    result = this.autoDetectGeneralFormat({
                        args: args, currencySymbol: currencySymbol, fResult: fResult, intl: intl,
                        isRightAlign: isRightAlign, curCode: 'USD', cell: cell, rowIdx: Number(args.rowIdx),
                        colIdx: Number(args.colIdx)
                    });
                    fResult = result.fResult;
                    isRightAlign = result.isRightAlign;
                    break;
                case 'Number':
                    if (isNumber(fResult)) {
                        fResult = this.applyNumberFormat(args, intl);
                        isRightAlign = true;
                    }
                    break;
                case 'Currency':
                    if (isNumber(fResult)) {
                        fResult = this.currencyFormat(args, intl);
                        isRightAlign = true;
                    }
                    break;
                case 'Percentage':
                    if (isNumber(fResult)) {
                        fResult = this.percentageFormat(args, intl);
                        isRightAlign = true;
                    }
                    break;
                case 'Accounting':
                    if (isNumber(fResult)) {
                        fResult = this.accountingFormat(args, intl);
                        isRightAlign = true;
                    }
                    break;
                case 'ShortDate':
                    fResult = this.shortDateFormat(args, intl);
                    isRightAlign = fResult ? true : false;
                    break;
                case 'LongDate':
                    fResult = this.longDateFormat(args, intl);
                    isRightAlign = fResult ? true : false;
                    break;
                case 'Time':
                    fResult = this.timeFormat(args, intl);
                    isRightAlign = fResult ? true : false;
                    break;
                case 'Fraction':
                    if (isNumber(fResult)) {
                        fResult = this.fractionFormat(args);
                        isRightAlign = true;
                    }
                    break;
                case 'Scientific':
                    if (isNumber(fResult)) {
                        fResult = this.scientificFormat(args);
                        isRightAlign = true;
                    }
                    break;
                case 'Text':
                    isRightAlign = false;
                    break;
            }
        }
        return { fResult: fResult, rightAlign: isRightAlign };
    };
    WorkbookNumberFormat.prototype.autoDetectGeneralFormat = function (options) {
        var range = getRangeIndexes(this.parent.getActiveSheet().activeCell);
        if (isNumber(options.fResult)) {
            if (options.args.format && options.args.format !== '') {
                if (options.args.format.toString().indexOf('%') > -1) {
                    options.fResult = this.percentageFormat(options.args, options.intl);
                }
                else if (options.args.format.toString().indexOf(options.currencySymbol) > -1) {
                    options.fResult = this.currencyFormat(options.args, options.intl);
                }
                else {
                    options.fResult = this.applyNumberFormat(options.args, options.intl);
                }
            }
            if (options.fResult && options.fResult.toString().split(this.decimalSep)[0].length > 11) {
                options.fResult = this.scientificFormat(options.args);
            }
            options.isRightAlign = true;
        }
        if (!isNullOrUndefined(options.fResult)) {
            var res = options.fResult.toString();
            if (res.indexOf('%') > -1 && res.split('%')[0] !== '' && res.split('%')[1].trim() === '' &&
                Number(res.split('%')[0].split(this.groupSep).join('')).toString() !== 'NaN') {
                options.args.value = Number(res.split('%')[0].split(this.groupSep).join(''));
                options.cell.format = options.args.format = getFormatFromType('Percentage');
                options.fResult = this.percentageFormat(options.args, options.intl);
                options.cell.value = options.args.value.toString();
                setCell(options.rowIdx, options.colIdx, this.parent.getActiveSheet(), options.cell, true);
                options.isRightAlign = true;
            }
            else if (res.indexOf(options.currencySymbol) > -1 && res.split(options.currencySymbol)[1] !== '' &&
                Number(res.split(options.currencySymbol)[1].split(this.groupSep).join('')).toString() !== 'NaN') {
                options.args.value = Number(res.split(options.currencySymbol)[1].split(this.groupSep).join(''));
                options.cell.format = options.args.format = getFormatFromType('Currency');
                options.fResult = this.currencyFormat(options.args, options.intl);
                options.cell.value = options.args.value.toString();
                setCell(options.rowIdx, options.colIdx, this.parent.getActiveSheet(), options.cell, true);
                options.isRightAlign = true;
            }
        }
        return { isRightAlign: options.isRightAlign, fResult: options.fResult };
    };
    WorkbookNumberFormat.prototype.findSuffix = function (zeros, resultSuffix) {
        var len = zeros.length;
        var suffixLen = len - resultSuffix.length;
        return zeros.substr(0, suffixLen < 0 ? 0 : suffixLen) + resultSuffix;
    };
    WorkbookNumberFormat.prototype.applyNumberFormat = function (args, intl) {
        args.format = args.format === '' ? getFormatFromType('Number') : args.format;
        args.format = args.format.toString().split('_)').join(' ').split('_(').join(' ').split('[Red]').join('');
        var formatArr = args.format.toString().split(';');
        if (Number(args.value) >= 0) {
            args.format = formatArr[0];
        }
        else {
            args.format = !isNullOrUndefined(formatArr[1]) ? formatArr[1].split('*').join(' ') : formatArr[0];
        }
        return intl.formatNumber(Number(args.value), {
            format: args.format
        });
    };
    WorkbookNumberFormat.prototype.currencyFormat = function (args, intl) {
        args.format = args.format === '' ? getFormatFromType('Currency') : args.format;
        args.format = args.format.toString().split('_(').join(' ').split('_)').join(' ').split('[Red]').join('');
        var formatArr = args.format.toString().split(';');
        if (Number(args.value) >= 0) {
            args.format = formatArr[0];
        }
        else {
            args.format = isNullOrUndefined(formatArr[1]) ? formatArr[0] : formatArr[1].split('*').join(' ');
        }
        return intl.formatNumber(Number(args.value), {
            format: args.format,
            currency: 'USD'
        });
    };
    WorkbookNumberFormat.prototype.percentageFormat = function (args, intl) {
        args.format = args.format === '' ? getFormatFromType('Percentage') : args.format;
        return intl.formatNumber(Number(args.value), {
            format: args.format
        });
    };
    WorkbookNumberFormat.prototype.accountingFormat = function (args, intl) {
        args.format = args.format === '' ? getFormatFromType('Accounting') : args.format;
        args.format = args.format.split('_(').join(' ').split('_)').join(' ').split('[Red]').join('');
        var currencySymbol = getNumberDependable(this.parent.locale, 'USD');
        var formatArr = args.format.split(';');
        if (Number(args.value) >= 0) {
            args.format = formatArr[0];
        }
        else {
            args.format = formatArr[1].split('*').join(' ');
        }
        if (Number(args.value) === 0) {
            return currencySymbol + '- ';
        }
        else {
            return intl.formatNumber(Number(args.value), {
                format: args.format,
                currency: 'USD'
            }).split('-').join('');
        }
    };
    WorkbookNumberFormat.prototype.shortDateFormat = function (args, intl) {
        var shortDate = intToDate(args.value);
        var code = (args.format === '' || args.format === 'General') ? getFormatFromType('ShortDate')
            : args.format.toString();
        var dateObj;
        if (code === getFormatFromType('ShortDate')) {
            code = 'M/d/yy';
            dateObj = {
                type: 'date',
                skeleton: 'yMd'
            };
        }
        else {
            dateObj = {
                type: 'date',
                format: code
            };
        }
        return intl.formatDate(shortDate, dateObj);
    };
    WorkbookNumberFormat.prototype.longDateFormat = function (args, intl) {
        var longDate = intToDate(args.value);
        var code = (args.format === '' || args.format === 'General') ? getFormatFromType('LongDate')
            : args.format.toString();
        if (code === getFormatFromType('LongDate')) {
            code = 'EEEE, MMMM d, y';
        }
        return intl.formatDate(longDate, {
            type: 'date',
            format: code
        });
    };
    WorkbookNumberFormat.prototype.timeFormat = function (args, intl) {
        if (isNullOrUndefined(args.value)) {
            return '';
        }
        if (!isNullOrUndefined(args.value.toString().split(this.decimalSep)[1])) {
            args.value = parseFloat('1' + this.decimalSep + args.value.split(this.decimalSep)[1]) || args.value;
        }
        var time = intToDate(args.value);
        var code = (args.format === '' || args.format === 'General') ? getFormatFromType('Time')
            : args.format.toString();
        if (code === getFormatFromType('Time')) {
            code = 'h:mm:ss a';
        }
        return intl.formatDate(time, {
            type: 'time',
            skeleton: 'medium',
            format: code
        });
    };
    WorkbookNumberFormat.prototype.scientificFormat = function (args) {
        args.format = args.format === '' ? getFormatFromType('Scientific') : args.format;
        var zeros = args.format.split('+')[1];
        var prefix = this.findDecimalPlaces(args.format, 'Scientific');
        var fResult = Number(args.value).toExponential(prefix);
        if (fResult.indexOf('e+') > -1) {
            fResult = fResult.split('e+')[0] + 'E+' + this.findSuffix(zeros, fResult.split('e+')[1]);
        }
        else if (fResult.indexOf('e-') > -1) {
            fResult = fResult.split('e-')[0] + 'E-' + +this.findSuffix(zeros, fResult.split('e-')[1]);
        }
        return fResult;
    };
    WorkbookNumberFormat.prototype.fractionFormat = function (args) {
        args.format = args.format === '' ? getFormatFromType('Fraction') : args.format;
        var suffix = '';
        var fractionResult;
        if (args.value.toString().indexOf(this.decimalSep) > -1 && isNumber(args.value)) {
            suffix = args.value.toString().split(this.decimalSep)[0];
            fractionResult = toFraction(Number(args.value));
            return (Number(suffix) === 0) ? ' ' + fractionResult : suffix + ' ' + fractionResult;
        }
        return suffix;
    };
    WorkbookNumberFormat.prototype.findDecimalPlaces = function (code, type) {
        switch (type) {
            case 'Scientific':
                var eIndex = code.toUpperCase().indexOf('E');
                var decIndex = code.indexOf(this.decimalSep);
                if (eIndex > -1) {
                    return code.substring(decIndex + 1, eIndex).length;
                }
        }
        return 2;
    };
    WorkbookNumberFormat.prototype.checkDateFormat = function (args) {
        var dateObj;
        var intl = new Internationalization();
        var value = !isNullOrUndefined(args.value) ? args.value.toString() : '';
        var checkedDate;
        var cell = getCell(args.rowIndex, args.colIndex, getSheet(this.parent, isNullOrUndefined(args.sheetIndex) ? this.parent.activeSheetIndex : args.sheetIndex));
        checkedDate = this.checkCustomDateFormat(value);
        if (value && (value.indexOf('/') > -1 || value.indexOf('-') > 0 || value.indexOf(':') > -1) && checkedDate !== 'Invalid') {
            value = checkedDate;
            if (value && value.indexOf('/') > -1 || value.indexOf('-') > 0 || value.indexOf(':') > -1) {
                dateObj = toDate(value, intl);
                if (!isNullOrUndefined(dateObj.dateObj) && dateObj.dateObj.toString() !== 'Invalid Date') {
                    cell = cell ? cell : {};
                    value = dateToInt(dateObj.dateObj, value.indexOf(':') > -1).toString();
                    if (!cell.format || cell.format === '') {
                        if (dateObj.type === 'time') {
                            cell.format = getFormatFromType('Time');
                        }
                        else {
                            cell.format = getFormatFromType('ShortDate');
                        }
                    }
                    args.isDate = dateObj.type === 'date' || dateObj.type === 'datetime';
                    args.isTime = dateObj.type === 'time';
                    args.dateObj = dateObj.dateObj;
                }
            }
            args.updatedVal = value;
        }
    };
    WorkbookNumberFormat.prototype.checkCustomDateFormat = function (val) {
        var dateArr = val.indexOf('/') > -1 ? val.split('/') : val.indexOf('-') > 0 ? val.split('-') : '';
        var months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'sept', 'oct', 'nov', 'dec'];
        if (dateArr.length === 2) {
            if (months.indexOf(dateArr[0].toLowerCase()) > -1 && Number(dateArr[1]) <= 31) {
                return '01-' + dateArr[0] + '-' + dateArr[1];
            }
            else if (months.indexOf(dateArr[1].toLowerCase()) > -1 && Number(dateArr[0]) <= 31) {
                return dateArr[0] + '-' + dateArr[1] + '-' + new Date().getFullYear();
            }
            else if (dateArr[0] <= '31' && dateArr[1] <= '12') {
                return dateArr[0] + '-' + dateArr[1] + '-' + new Date().getFullYear();
            }
            if (Number(dateArr[1]) <= 31 && Number(dateArr[0]) <= 12) {
                return dateArr[0] + '-' + dateArr[1] + '-' + new Date().getFullYear();
            }
            if (Number(dateArr[0]) <= 12 && Number(dateArr[1]) <= 9999 && Number(dateArr[1]) >= 1900) {
                return '01-' + dateArr[0] + '-' + dateArr[1];
            }
            else {
                return 'Invalid';
            }
        }
        return val;
    };
    WorkbookNumberFormat.prototype.formattedBarText = function (args) {
        var type = getTypeFromFormat(args.cell ? args.cell.format : '');
        var intl = new Internationalization();
        var beforeText = args.value;
        var date = getFormatFromType('ShortDate');
        var time = getFormatFromType('Time');
        switch (type) {
            case 'ShortDate':
            case 'LongDate':
                args.value = this.shortDateFormat({ type: type, value: args.value, format: date }, intl);
                break;
            case 'Time':
                args.value = this.shortDateFormat({ type: type, value: args.value, format: date }, intl) + ' ' +
                    this.timeFormat({ type: type, value: args.value, format: time }, intl);
                break;
        }
        if (!args.value || (args.value && args.value.toString().indexOf('null') > -1)) {
            args.value = beforeText;
        }
    };
    /**
     * Adding event listener for number format.
     */
    WorkbookNumberFormat.prototype.addEventListener = function () {
        this.parent.on(applyNumberFormatting, this.numberFormatting, this);
        this.parent.on(getFormattedCellObject, this.getFormattedCell, this);
        this.parent.on(checkDateFormat, this.checkDateFormat, this);
        this.parent.on(getFormattedBarText, this.formattedBarText, this);
    };
    /**
     * Removing event listener for number format.
     */
    WorkbookNumberFormat.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(applyNumberFormatting, this.numberFormatting);
            this.parent.off(getFormattedCellObject, this.getFormattedCell);
            this.parent.off(checkDateFormat, this.checkDateFormat);
            this.parent.off(getFormattedBarText, this.formattedBarText);
        }
    };
    /**
     * To Remove the event listeners.
     */
    WorkbookNumberFormat.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    /**
     * Get the workbook number format module name.
     */
    WorkbookNumberFormat.prototype.getModuleName = function () {
        return 'workbookNumberFormat';
    };
    return WorkbookNumberFormat;
}());
export { WorkbookNumberFormat };
/**
 * To Get the number built-in format code from the number format type.
 * @param {string} type - Specifies the type of the number formatting.
 */
export function getFormatFromType(type) {
    var code = 'General';
    switch (type.split(' ').join('')) {
        case 'Number':
            code = '0.00';
            break;
        case 'Currency':
            code = '$#,##0.00';
            break;
        case 'Accounting':
            code = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
            break;
        case 'ShortDate':
            code = 'mm-dd-yyyy';
            break;
        case 'LongDate':
            code = 'dddd, mmmm dd, yyyy';
            break;
        case 'Time':
            code = 'h:mm:ss AM/PM';
            break;
        case 'Percentage':
            code = '0.00%';
            break;
        case 'Fraction':
            code = '# ?/?';
            break;
        case 'Scientific':
            code = '0.00E+00';
            break;
        case 'Text':
            code = '@';
            break;
    }
    return code;
}
/**
 * @hidden
 */
export function getTypeFromFormat(format) {
    var code = 'General';
    switch (format) {
        case '0.00':
            code = 'Number';
            break;
        case '$#,##0.00':
        case '$#,##0_);[Red]($#,##0)':
        case '$#,##0.00_);[Red]($#,##0.00)':
        case '$#,##0.00_);($#,##0.00)':
        case '$#,##0_);($#,##0)':
            code = 'Currency';
            break;
        case '_($*#,##0.00_);_($*(#,##0.00);_($*"-"??_);_(@_)':
        case '_($*#,##0.00_);_($* (#,##0.00);_($*"-"??_);_(@_)':
        case '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)':
            code = 'Accounting';
            break;
        case 'mm-dd-yyyy':
        case 'dd-mm-yyyy':
        case 'dd-mm-yy':
        case 'mm-dd-yy':
            code = 'ShortDate';
            break;
        case 'dddd, mmmm dd, yyyy':
            code = 'LongDate';
            break;
        case 'h:mm:ss AM/PM':
            code = 'Time';
            break;
        case '0.00%':
        case '0%':
            code = 'Percentage';
            break;
        case '# ?/?':
        case '# ??/??':
        case '# ???/???':
            code = 'Fraction';
            break;
        case '0.00E+00':
            code = 'Scientific';
            break;
        case '@':
            code = 'Text';
            break;
    }
    return code;
}
