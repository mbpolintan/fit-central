var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ChildProperty, Collection, Property } from '@syncfusion/ej2-base';
import { Cell } from './cell';
/**
 * Configures the Row behavior for the spreadsheet.
 *  ```html
 * <div id='Spreadsheet'></div>
 * ```
 * ```typescript
 * let spreadsheet: Spreadsheet = new Spreadsheet({
 *      sheets: [{
 *                rows: [{
 *                        index: 30,
 *                        cells: [{ index: 4, value: 'Total Amount:' },
 *                               { formula: '=SUM(F2:F30)', style: { fontWeight: 'bold' } }]
 *                }]
 * ...
 * });
 * spreadsheet.appendTo('#Spreadsheet');
 * ```
 */
var Row = /** @class */ (function (_super) {
    __extends(Row, _super);
    function Row() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Collection([], Cell)
    ], Row.prototype, "cells", void 0);
    __decorate([
        Property(0)
    ], Row.prototype, "index", void 0);
    __decorate([
        Property(20)
    ], Row.prototype, "height", void 0);
    __decorate([
        Property(false)
    ], Row.prototype, "customHeight", void 0);
    __decorate([
        Property(false)
    ], Row.prototype, "hidden", void 0);
    return Row;
}(ChildProperty));
export { Row };
/**
 * @hidden
 */
export function getRow(sheet, rowIndex) {
    return sheet.rows[rowIndex];
}
/** @hidden */
export function setRow(sheet, rowIndex, row) {
    if (!sheet.rows[rowIndex]) {
        sheet.rows[rowIndex] = {};
    }
    Object.keys(row).forEach(function (key) {
        sheet.rows[rowIndex][key] = row[key];
    });
}
/** @hidden */
export function isHiddenRow(sheet, index) {
    return sheet.rows[index] && sheet.rows[index].hidden;
}
/**
 * @hidden
 */
export function getRowHeight(sheet, rowIndex) {
    if (sheet && sheet.rows && sheet.rows[rowIndex]) {
        if (sheet.rows[rowIndex].hidden) {
            return 0;
        }
        return sheet.rows[rowIndex].height === undefined ? 20 : sheet.rows[rowIndex].height;
    }
    else {
        return 20;
    }
}
/**
 * @hidden
 */
export function setRowHeight(sheet, rowIndex, height) {
    if (sheet && sheet.rows) {
        if (!sheet.rows[rowIndex]) {
            sheet.rows[rowIndex] = {};
        }
        sheet.rows[rowIndex].height = height;
    }
}
/**
 * @hidden
 */
export function getRowsHeight(sheet, startRow, endRow) {
    if (endRow === void 0) { endRow = startRow; }
    var height = 0;
    var swap;
    if (startRow > endRow) {
        swap = startRow;
        startRow = endRow;
        endRow = swap;
    }
    for (var i = startRow; i <= endRow; i++) {
        height += getRowHeight(sheet, i);
    }
    return height;
}
