import { Workbook } from '@syncfusion/ej2-excel-export';
import * as events from '../../common/base/constant';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PivotUtil } from '../../base/util';
/**
 * @hidden
 * `ExcelExport` module is used to handle the Excel export action.
 */
var ExcelExport = /** @class */ (function () {
    /**
     * Constructor for the PivotGrid Excel Export module.
     * @hidden
     */
    function ExcelExport(parent) {
        this.parent = parent;
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    ExcelExport.prototype.getModuleName = function () {
        return 'excelExport';
    };
    /* tslint:disable:max-func-body-length */
    /**
     * Method to perform excel export.
     * @hidden
     */
    ExcelExport.prototype.exportToExcel = function (type) {
        this.engine = this.parent.dataType === 'olap' ? this.parent.olapEngineModule : this.parent.engineModule;
        /** Event trigerring */
        var clonedValues;
        var currentPivotValues = PivotUtil.getClonedPivotValues(this.engine.pivotValues);
        if (this.parent.exportAllPages && this.parent.enableVirtualization && this.parent.dataType !== 'olap') {
            var pageSettings = this.engine.pageSettings;
            this.engine.pageSettings = null;
            this.engine.generateGridData(this.parent.dataSourceSettings);
            this.parent.applyFormatting(this.engine.pivotValues);
            clonedValues = PivotUtil.getClonedPivotValues(this.engine.pivotValues);
            this.engine.pivotValues = currentPivotValues;
            this.engine.pageSettings = pageSettings;
        }
        else {
            clonedValues = currentPivotValues;
        }
        var args = {
            fileName: 'default', header: '', footer: '', dataCollections: [clonedValues]
        };
        this.parent.trigger(events.beforeExport, args);
        var fileName = args.fileName;
        var header = args.header;
        var footer = args.footer;
        var dataCollections = args.dataCollections;
        /** Fill data and export */
        /* tslint:disable-next-line:no-any */
        var workSheets = [];
        for (var dataColl = 0; dataColl < dataCollections.length; dataColl++) {
            var pivotValues = dataCollections[dataColl];
            var colLen = 0;
            var rowLen = pivotValues.length;
            var actualrCnt = 0;
            var formatList = this.parent.renderModule.getFormatList();
            var rows = [];
            var maxLevel = 0;
            for (var rCnt = 0; rCnt < rowLen; rCnt++) {
                if (pivotValues[rCnt]) {
                    actualrCnt++;
                    colLen = pivotValues[rCnt].length;
                    var cells = [];
                    for (var cCnt = 0; cCnt < colLen; cCnt++) {
                        if (pivotValues[rCnt][cCnt]) {
                            var pivotCell = pivotValues[rCnt][cCnt];
                            if (!(pivotCell.level === -1 && !pivotCell.rowSpan)) {
                                var cellValue = pivotCell.axis === 'value' ? pivotCell.value : pivotCell.formattedText;
                                if (pivotCell.type === 'grand sum') {
                                    cellValue = this.parent.localeObj.getConstant('grandTotal');
                                }
                                else if (pivotCell.type === 'sum') {
                                    cellValue = cellValue.toString().replace('Total', this.parent.localeObj.getConstant('total'));
                                }
                                else {
                                    cellValue = cellValue;
                                }
                                if (!(pivotCell.level === -1 && !pivotCell.rowSpan)) {
                                    cells.push({
                                        index: cCnt + 1, value: cellValue,
                                        colSpan: pivotCell.colSpan, rowSpan: (pivotCell.rowSpan === -1 ? 1 : pivotCell.rowSpan),
                                    });
                                    if (pivotCell.axis === 'value') {
                                        if (isNaN(pivotCell.value) || pivotCell.formattedText === '' ||
                                            pivotCell.formattedText === undefined || isNullOrUndefined(pivotCell.value)) {
                                            cells[cells.length - 1].value = '';
                                        }
                                        var field = (this.parent.dataSourceSettings.valueAxis === 'row' &&
                                            this.parent.dataType === 'olap' && pivotCell.rowOrdinal &&
                                            this.engine.tupRowInfo[pivotCell.rowOrdinal]) ?
                                            this.engine.tupRowInfo[pivotCell.rowOrdinal].measureName :
                                            pivotCell.actualText;
                                        cells[cells.length - 1].style = {
                                            numberFormat: formatList[field], bold: false, wrapText: true
                                        };
                                        if (pivotCell.style) {
                                            cells[cells.length - 1].style.backColor = pivotCell.style.backgroundColor;
                                            cells[cells.length - 1].style.fontColor = pivotCell.style.color;
                                            cells[cells.length - 1].style.fontName = pivotCell.style.fontFamily;
                                            cells[cells.length - 1].style.fontSize = Number(pivotCell.style.fontSize.split('px')[0]);
                                        }
                                    }
                                    else {
                                        cells[cells.length - 1].style = {
                                            bold: true, vAlign: 'Center', wrapText: true, indent: cCnt === 0 ? pivotCell.level * 10 : 0
                                        };
                                        if (pivotCell.axis === 'row' && cCnt === 0) {
                                            cells[cells.length - 1].style.hAlign = 'Left';
                                            if (this.parent.dataType === 'olap') {
                                                var indent = this.parent.renderModule.indentCollection[rCnt];
                                                cells[cells.length - 1].style.indent = indent * 2;
                                                maxLevel = maxLevel > indent ? maxLevel : indent;
                                            }
                                            else {
                                                cells[cells.length - 1].style.indent = pivotCell.level * 2;
                                                maxLevel = pivotCell.level > maxLevel ? pivotCell.level : maxLevel;
                                            }
                                        }
                                    }
                                    cells[cells.length - 1].style.borders = { color: '#000000', lineStyle: 'Thin' };
                                }
                            }
                            cCnt = cCnt + (pivotCell.colSpan ? (pivotCell.colSpan - 1) : 0);
                        }
                        else {
                            cells.push({
                                index: cCnt + 1, value: '', colSpan: 1, rowSpan: 1,
                            });
                        }
                    }
                    rows.push({ index: actualrCnt, cells: cells });
                }
            }
            var columns = [];
            for (var cCnt = 0; cCnt < colLen; cCnt++) {
                columns.push({ index: cCnt + 1, width: 100 });
            }
            if (maxLevel > 0) {
                columns[0].width = 100 + (maxLevel * 20);
            }
            workSheets.push({ columns: columns, rows: rows });
        }
        var book = new Workbook({ worksheets: workSheets }, type === 'Excel' ? 'xlsx' : 'csv');
        book.save(fileName + (type === 'Excel' ? '.xlsx' : '.csv'));
    };
    /**
     * To destroy the excel export module
     * @returns void
     * @hidden
     */
    /* tslint:disable-next-line:no-empty */
    ExcelExport.prototype.destroy = function () {
    };
    return ExcelExport;
}());
export { ExcelExport };
