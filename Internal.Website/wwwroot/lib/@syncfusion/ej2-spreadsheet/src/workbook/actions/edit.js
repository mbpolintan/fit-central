import { getCell, getSheet } from '../base/index';
import { workbookEditOperation, checkDateFormat, workbookFormulaOperation } from '../common/event';
import { getRangeIndexes } from '../common/index';
import { isNullOrUndefined, getNumericObject } from '@syncfusion/ej2-base';
import { checkIsFormula } from '../../workbook/common/index';
/**
 * The `WorkbookEdit` module is used to handle the editing functionalities in Workbook.
 */
var WorkbookEdit = /** @class */ (function () {
    /**
     * Constructor for edit module in Workbook.
     * @private
     */
    function WorkbookEdit(workbook) {
        this.parent = workbook;
        this.localeObj = getNumericObject(this.parent.locale);
        /* tslint:disable:no-any */
        this.decimalSep = this.localeObj.decimal;
        this.addEventListener();
    }
    /**
     * To destroy the edit module.
     * @return {void}
     * @hidden
     */
    WorkbookEdit.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    WorkbookEdit.prototype.addEventListener = function () {
        this.parent.on(workbookEditOperation, this.performEditOperation, this);
    };
    WorkbookEdit.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(workbookEditOperation, this.performEditOperation);
        }
    };
    /**
     * Get the module name.
     * @returns string
     * @private
     */
    WorkbookEdit.prototype.getModuleName = function () {
        return 'workbookEdit';
    };
    WorkbookEdit.prototype.performEditOperation = function (args) {
        var action = args.action;
        switch (action) {
            case 'updateCellValue':
                this.updateCellValue(args.address, args.value, args.sheetIndex, args.isValueOnly);
                break;
        }
    };
    WorkbookEdit.prototype.checkDecimalPoint = function (value) {
        if (Number(value)) {
            var decIndex = value.toString().indexOf(this.decimalSep) + 1;
            var checkDec = value.toString().substr(decIndex).length <= 6;
            value = checkDec ? decIndex < 7 ? value : (parseFloat(value)).toFixed(0) : decIndex > 7 ? (parseFloat(value)).toFixed(0) :
                (parseFloat(value)).toFixed(6 - decIndex + 2);
        }
        return value;
    };
    WorkbookEdit.prototype.updateCellValue = function (address, value, sheetIdx, isValueOnly) {
        if (isValueOnly === void 0) { isValueOnly = false; }
        if (!sheetIdx) {
            sheetIdx = this.parent.activeSheetIndex;
        }
        var range;
        if (typeof address === 'string') {
            range = getRangeIndexes(address);
        }
        else {
            range = address;
        }
        var sheet = getSheet(this.parent, sheetIdx);
        if (!sheet.rows[range[0]]) {
            sheet.rows[range[0]] = {};
            sheet.rows[range[0]].cells = [];
        }
        if (!sheet.rows[range[0]].cells) {
            sheet.rows[range[0]].cells = [];
        }
        if (!sheet.rows[range[0]].cells[range[1]]) {
            sheet.rows[range[0]].cells[range[1]] = {};
        }
        var cell = getCell(range[0], range[1], sheet);
        if (!isValueOnly) {
            var isFormula = checkIsFormula(value);
            if (!isFormula) {
                cell.formula = '';
                cell.value = value;
            }
            var eventArgs = {
                action: 'refreshCalculate',
                value: value,
                rowIndex: range[0],
                colIndex: range[1],
                sheetIndex: sheetIdx,
                isFormula: isFormula
            };
            this.parent.notify(workbookFormulaOperation, eventArgs);
            if (isFormula) {
                cell.formula = eventArgs.value;
                value = cell.value;
            }
            var dateEventArgs = {
                value: value,
                rowIndex: range[0],
                colIndex: range[1],
                sheetIndex: sheetIdx,
                updatedVal: ''
            };
            this.parent.notify(checkDateFormat, dateEventArgs);
            if (!isNullOrUndefined(dateEventArgs.updatedVal) && dateEventArgs.updatedVal.length > 0) {
                cell.value = dateEventArgs.updatedVal;
            }
        }
        else {
            if (value.toString().indexOf(this.decimalSep) > -1) {
                value = this.checkDecimalPoint(value);
            }
            cell.value = value;
        }
        this.parent.setUsedRange(range[0] + 1, range[1]);
    };
    return WorkbookEdit;
}());
export { WorkbookEdit };
