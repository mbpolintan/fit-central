import { PdfGrid, PdfPen, PointF, PdfDocument, PdfStandardFont, PdfFontFamily, PdfSolidBrush, PdfColor, PdfStringFormat, PdfVerticalAlignment, PdfTextAlignment, PdfFontStyle, PdfPageTemplateElement, RectangleF, PdfBorders } from '@syncfusion/ej2-pdf-export';
import * as events from '../../common/base/constant';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PivotUtil } from '../../base/util';
/**
 * @hidden
 * `PDFExport` module is used to handle the PDF export action.
 */
var PDFExport = /** @class */ (function () {
    /**
     * Constructor for the PivotGrid PDF Export module.
     * @hidden
     */
    function PDFExport(parent) {
        this.parent = parent;
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    PDFExport.prototype.getModuleName = function () {
        return 'pdfExport';
    };
    PDFExport.prototype.addPage = function (eventParams) {
        var page = eventParams.document.pages.add();
        var header = eventParams.args.header;
        var footer = eventParams.args.footer;
        var font = new PdfStandardFont(PdfFontFamily.TimesRoman, 15, PdfFontStyle.Regular);
        var brush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        var pen = new PdfPen(new PdfColor(0, 0, 0), .5);
        /** Header and Footer to be set */
        var headerTemplate = new PdfPageTemplateElement(new RectangleF(0, 0, page.graphics.clientSize.width, 20));
        headerTemplate.graphics.drawString(header, font, pen, brush, 0, 0, new PdfStringFormat(PdfTextAlignment.Center));
        eventParams.document.template.top = headerTemplate;
        var footerTemplate = new PdfPageTemplateElement(new RectangleF(0, 0, page.graphics.clientSize.width, 20));
        footerTemplate.graphics.drawString(footer, font, pen, brush, 0, 0, new PdfStringFormat(PdfTextAlignment.Center));
        eventParams.document.template.bottom = footerTemplate;
        return page;
    };
    PDFExport.prototype.hexDecToRgb = function (hexDec) {
        if (hexDec === null || hexDec === '' || hexDec.length !== 7) {
            throw new Error('please set valid hex value for color..');
        }
        hexDec = hexDec.substring(1);
        var bigint = parseInt(hexDec, 16);
        var r = (bigint >> 16) & 255;
        var g = (bigint >> 8) & 255;
        var b = bigint & 255;
        return { r: r, g: g, b: b };
    };
    PDFExport.prototype.getFontStyle = function (theme) {
        var fontType = PdfFontStyle.Regular;
        if (!isNullOrUndefined(theme) && theme.bold) {
            fontType |= PdfFontStyle.Bold;
        }
        if (!isNullOrUndefined(theme) && theme.italic) {
            fontType |= PdfFontStyle.Italic;
        }
        if (!isNullOrUndefined(theme) && theme.underline) {
            fontType |= PdfFontStyle.Underline;
        }
        if (!isNullOrUndefined(theme) && theme.strikeout) {
            fontType |= PdfFontStyle.Strikeout;
        }
        return fontType;
    };
    PDFExport.prototype.getBorderStyle = function (borderStyle) {
        var borders = new PdfBorders();
        if (!isNullOrUndefined(borderStyle)) {
            var borderWidth = borderStyle.width;
            // set border width
            var width = (!isNullOrUndefined(borderWidth) && typeof borderWidth === 'number') ? borderWidth * 0.75 : undefined;
            // set border color
            var color = new PdfColor(196, 196, 196);
            if (!isNullOrUndefined(borderStyle.color)) {
                var borderColor = this.hexDecToRgb(borderStyle.color);
                color = new PdfColor(borderColor.r, borderColor.g, borderColor.b);
            }
            var pen = new PdfPen(color, width);
            // set border dashStyle 'Solid <default>, Dash, Dot, DashDot, DashDotDot'
            if (!isNullOrUndefined(borderStyle.dashStyle)) {
                pen.dashStyle = this.getDashStyle(borderStyle.dashStyle);
            }
            borders.all = pen;
        }
        else {
            var pdfColor = new PdfColor(234, 234, 234);
            borders.all = new PdfPen(pdfColor);
        }
        return borders;
    };
    PDFExport.prototype.getDashStyle = function (dashType) {
        switch (dashType) {
            case 'Dash':
                return 1;
            case 'Dot':
                return 2;
            case 'DashDot':
                return 3;
            case 'DashDotDot':
                return 4;
            default:
                return 0;
        }
    };
    PDFExport.prototype.getStyle = function () {
        var border = new PdfBorders();
        if (!isNullOrUndefined(this.gridStyle)) {
            var fontFamily = !isNullOrUndefined(this.gridStyle.header.fontName) ?
                this.getFontFamily(this.gridStyle.header.fontName) : PdfFontFamily.Helvetica;
            var fontStyle = this.getFontStyle(this.gridStyle.header);
            var fontSize = !isNullOrUndefined(this.gridStyle.header.fontSize) ? this.gridStyle.header.fontSize : 10.5;
            var pdfColor = new PdfColor();
            if (!isNullOrUndefined(this.gridStyle.header.fontColor)) {
                var penBrushColor = this.hexDecToRgb(this.gridStyle.header.fontColor);
                pdfColor = new PdfColor(penBrushColor.r, penBrushColor.g, penBrushColor.b);
            }
            var font = new PdfStandardFont(fontFamily, fontSize, fontStyle);
            if (!isNullOrUndefined(this.gridStyle.header.font)) {
                font = this.gridStyle.header.font;
            }
            return {
                border: this.getBorderStyle(this.gridStyle.header.border), font: font, brush: new PdfSolidBrush(pdfColor)
            };
        }
        else {
            return {
                brush: new PdfSolidBrush(new PdfColor()),
                border: border, font: undefined
            };
        }
    };
    PDFExport.prototype.setRecordThemeStyle = function (row, border) {
        if (!isNullOrUndefined(this.gridStyle) && !isNullOrUndefined(this.gridStyle.record)) {
            var fontFamily = !isNullOrUndefined(this.gridStyle.record.fontName) ?
                this.getFontFamily(this.gridStyle.record.fontName) : PdfFontFamily.Helvetica;
            var fontSize = !isNullOrUndefined(this.gridStyle.record.fontSize) ? this.gridStyle.record.fontSize : 9.75;
            var fontStyle = this.getFontStyle(this.gridStyle.record);
            var font = new PdfStandardFont(fontFamily, fontSize, fontStyle);
            if (!isNullOrUndefined(this.gridStyle.record.font)) {
                font = this.gridStyle.record.font;
            }
            row.style.setFont(font);
            var pdfColor = new PdfColor();
            if (!isNullOrUndefined(this.gridStyle.record.fontColor)) {
                var penBrushColor = this.hexDecToRgb(this.gridStyle.record.fontColor);
                pdfColor = new PdfColor(penBrushColor.r, penBrushColor.g, penBrushColor.b);
            }
            row.style.setTextBrush(new PdfSolidBrush(pdfColor));
        }
        var borderRecord = this.gridStyle && this.gridStyle.record &&
            this.gridStyle.record.border ? this.getBorderStyle(this.gridStyle.record.border) : border;
        row.style.setBorder(borderRecord);
        return row;
    };
    /**
     * Method to perform pdf export.
     * @hidden
     */
    /* tslint:disable:max-func-body-length */
    PDFExport.prototype.exportToPDF = function () {
        this.engine = this.parent.dataType === 'olap' ? this.parent.olapEngineModule : this.parent.engineModule;
        var eventParams = this.applyEvent();
        var headerStyle = this.getStyle();
        var indent = this.parent.renderModule.maxIndent ? this.parent.renderModule.maxIndent : 5;
        var firstColumnWidth = 100 + (indent * 20);
        var size = Math.floor((540 - firstColumnWidth) / 90) + 1;
        /** Fill data and export */
        var dataCollIndex = 0;
        var pivotValues = eventParams.args.dataCollections[dataCollIndex];
        for (var vLen = 0; eventParams.args.allowRepeatHeader && size > 1 && vLen < pivotValues.length; vLen++) {
            for (var vCnt = size; pivotValues[vLen] && vCnt < pivotValues[vLen].length; vCnt += size) {
                pivotValues[vLen].splice(vCnt, 0, pivotValues[vLen][0]);
            }
        }
        var colLength = pivotValues && pivotValues.length > 0 ? pivotValues[0].length : 0;
        var integratedCnt = 0;
        do {
            var page = this.addPage(eventParams);
            var pdfGrid = new PdfGrid();
            var pageSize = size > 1 ? size : 5;
            if (pivotValues && pivotValues.length > 0) {
                pdfGrid.columns.add(pivotValues[0].length - integratedCnt >= pageSize ? pageSize : pivotValues[0].length - integratedCnt);
                var rowLen = pivotValues.length;
                var actualrCnt = 0;
                var maxLevel = 0;
                for (var rCnt = 0; rCnt < rowLen; rCnt++) {
                    if (pivotValues[rCnt]) {
                        var isColHeader = !(pivotValues[rCnt][0] && pivotValues[rCnt][0].axis === 'row');
                        var colLen = pivotValues[rCnt].length > (integratedCnt + pageSize) ? (integratedCnt + pageSize) :
                            pivotValues[rCnt].length;
                        if (isColHeader) {
                            pdfGrid.headers.add(1);
                        }
                        var pdfGridRow = !isColHeader ? pdfGrid.rows.addRow() : pdfGrid.headers.getHeader(actualrCnt);
                        if (isColHeader) {
                            pdfGridRow.style.setBorder(headerStyle.border);
                            if (headerStyle.font) {
                                pdfGridRow.style.setFont(headerStyle.font);
                            }
                            pdfGridRow.style.setTextBrush(headerStyle.brush);
                        }
                        else {
                            this.setRecordThemeStyle(pdfGridRow, headerStyle.border);
                        }
                        var localCnt = 0;
                        var isEmptyRow = true;
                        for (var cCnt = integratedCnt; cCnt < colLen; cCnt++) {
                            var isValueCell = false;
                            if (pivotValues[rCnt][cCnt]) {
                                var pivotCell = pivotValues[rCnt][cCnt];
                                if (!(pivotCell.level === -1 && !pivotCell.rowSpan)) {
                                    var cellValue = pivotCell.formattedText;
                                    cellValue = pivotCell.type === 'grand sum' ? this.parent.localeObj.getConstant('grandTotal') :
                                        (pivotCell.type === 'sum' ?
                                            cellValue.toString().replace('Total', this.parent.localeObj.getConstant('total')) : cellValue);
                                    if (!(pivotCell.level === -1 && !pivotCell.rowSpan)) {
                                        pdfGridRow.cells.getCell(localCnt).columnSpan = pivotCell.colSpan ?
                                            (pageSize - localCnt < pivotCell.colSpan ? pageSize - localCnt : pivotCell.colSpan) : 1;
                                        if (isColHeader && pivotCell.rowSpan && pivotCell.rowSpan > 1) {
                                            pdfGridRow.cells.getCell(localCnt).rowSpan = pivotCell.rowSpan ? pivotCell.rowSpan : 1;
                                        }
                                        pdfGridRow.cells.getCell(localCnt).value = cellValue ? cellValue.toString() : '';
                                    }
                                    if (cellValue !== '') {
                                        isEmptyRow = false;
                                    }
                                }
                                maxLevel = pivotCell.level > maxLevel ? pivotCell.level : maxLevel;
                                isValueCell = pivotCell.axis === 'value';
                                cCnt = cCnt + (pdfGridRow.cells.getCell(localCnt).columnSpan ?
                                    (pdfGridRow.cells.getCell(localCnt).columnSpan - 1) : 0);
                                localCnt = localCnt + (pdfGridRow.cells.getCell(localCnt).columnSpan ?
                                    (pdfGridRow.cells.getCell(localCnt).columnSpan - 1) : 0);
                                if (pivotCell.style) {
                                    pdfGridRow = this.applyStyle(pdfGridRow, pivotCell, localCnt);
                                }
                                var args = {
                                    style: (pivotCell && pivotCell.isSum) ? { bold: true } : undefined,
                                    pivotCell: pivotCell,
                                    cell: pdfGridRow.cells.getCell(localCnt)
                                };
                                this.parent.trigger(events.onPdfCellRender, args);
                                if (args.style) {
                                    this.processCellStyle(pdfGridRow.cells.getCell(localCnt), args);
                                }
                            }
                            else {
                                var args = {
                                    style: undefined,
                                    pivotCell: undefined,
                                    cell: pdfGridRow.cells.getCell(localCnt)
                                };
                                this.parent.trigger(events.onPdfCellRender, args);
                                if (args.style) {
                                    this.processCellStyle(pdfGridRow.cells.getCell(localCnt), args);
                                }
                                pdfGridRow.cells.getCell(localCnt).value = '';
                                if (cCnt === 0 && isColHeader && this.parent.dataSourceSettings.columns &&
                                    this.parent.dataSourceSettings.columns.length > 0) {
                                    pdfGrid.headers.getHeader(0).cells.getCell(0).rowSpan++;
                                }
                                else if (cCnt !== 0 && isColHeader && this.parent.dataSourceSettings.columns &&
                                    this.parent.dataSourceSettings.columns.length > 0 &&
                                    pdfGrid.headers.getHeader(0).cells.getCell(0).rowSpan <
                                        Object.keys(this.engine.headerContent).length) {
                                    pdfGrid.headers.getHeader(0).cells.getCell(0).rowSpan++;
                                }
                            }
                            var stringFormat = new PdfStringFormat();
                            if (this.parent.dataType === 'olap') {
                                var indent_1 = (!isColHeader && localCnt === 0 && pivotValues[rCnt][cCnt]) ?
                                    (this.parent.renderModule.indentCollection[pivotValues[rCnt][cCnt].rowIndex]) : 0;
                                stringFormat.paragraphIndent = indent_1 * 15;
                                maxLevel = maxLevel > indent_1 ? maxLevel : indent_1;
                            }
                            else {
                                stringFormat.paragraphIndent = (!isColHeader && localCnt === 0 && pivotValues[rCnt][cCnt] &&
                                    pivotValues[rCnt][cCnt].level !== -1) ?
                                    pivotValues[rCnt][cCnt].level * 15 : 0;
                            }
                            stringFormat.alignment = isValueCell ? PdfTextAlignment.Right : PdfTextAlignment.Left;
                            stringFormat.lineAlignment = PdfVerticalAlignment.Middle;
                            pdfGridRow.cells.getCell(localCnt).style.stringFormat = stringFormat;
                            localCnt++;
                        }
                        if (isEmptyRow) {
                            pdfGridRow.height = 16;
                        }
                        actualrCnt++;
                    }
                }
                pdfGrid.columns.getColumn(0).width = 100 + (maxLevel * 20);
            }
            if (integratedCnt === 0 && this.parent.dataSourceSettings.columns && this.parent.dataSourceSettings.columns.length > 0) {
                pdfGrid.headers.getHeader(0).cells.getCell(0).rowSpan--;
            }
            pdfGrid.draw(page, new PointF(10, 20));
            integratedCnt = integratedCnt + pageSize;
            if (integratedCnt >= colLength && eventParams.args.dataCollections.length > (dataCollIndex + 1)) {
                dataCollIndex++;
                pivotValues = eventParams.args.dataCollections[dataCollIndex];
                colLength = pivotValues && pivotValues.length > 0 ? pivotValues[0].length : 0;
                integratedCnt = 0;
            }
        } while (integratedCnt < colLength);
        eventParams.document.save(eventParams.args.fileName + '.pdf');
        eventParams.document.destroy();
    };
    PDFExport.prototype.applyStyle = function (pdfGridRow, pivotCell, localCnt) {
        var color = this.parent.conditionalFormattingModule.hexToRgb(pivotCell.style.backgroundColor);
        var brush = new PdfSolidBrush(new PdfColor(color.r, color.g, color.b));
        pdfGridRow.cells.getCell(localCnt).style.backgroundBrush = brush;
        var size = Number(pivotCell.style.fontSize.split('px')[0]);
        var font = new PdfStandardFont(PdfFontFamily.TimesRoman, size, PdfFontStyle.Regular);
        pdfGridRow.cells.getCell(localCnt).style.font = font;
        color = this.parent.conditionalFormattingModule.hexToRgb(pivotCell.style.color);
        brush = new PdfSolidBrush(new PdfColor(color.r, color.g, color.b));
        pdfGridRow.cells.getCell(localCnt).style.textBrush = brush;
        return pdfGridRow;
    };
    PDFExport.prototype.getFontFamily = function (family) {
        switch (family) {
            case 'TimesRoman':
                return 2;
            case 'Courier':
                return 1;
            case 'Symbol':
                return 3;
            case 'ZapfDingbats':
                return 4;
            default:
                return 0;
        }
    };
    /* tslint:disable-next-line:no-any */
    PDFExport.prototype.getFont = function (theme) {
        if (theme.style.font) {
            return theme.style.font;
        }
        var fontSize = (theme.cell.cellStyle.font && theme.cell.cellStyle.font.fontSize) ? theme.cell.cellStyle.font.fontSize :
            (!isNullOrUndefined(theme.style.fontSize)) ? (theme.style.fontSize * 0.75) : 9.75;
        var fontFamily = (!isNullOrUndefined(theme.style.fontFamily)) ?
            (this.getFontFamily(theme.style.fontFamily)) : PdfFontFamily.TimesRoman;
        var fontStyle = PdfFontStyle.Regular;
        if (!isNullOrUndefined(theme.style.bold) && theme.style.bold) {
            fontStyle |= PdfFontStyle.Bold;
        }
        if (!isNullOrUndefined(theme.style.italic) && theme.style.italic) {
            fontStyle |= PdfFontStyle.Italic;
        }
        if (!isNullOrUndefined(theme.style.underline) && theme.style.underline) {
            fontStyle |= PdfFontStyle.Underline;
        }
        if (!isNullOrUndefined(theme.style.strikeout) && theme.style.strikeout) {
            fontStyle |= PdfFontStyle.Strikeout;
        }
        return new PdfStandardFont(fontFamily, fontSize, fontStyle);
    };
    PDFExport.prototype.processCellStyle = function (gridCell, arg) {
        if (!isNullOrUndefined(arg.style.backgroundColor)) {
            var backColor = this.hexDecToRgb(arg.style.backgroundColor);
            gridCell.style.backgroundBrush = new PdfSolidBrush(new PdfColor(backColor.r, backColor.g, backColor.b));
        }
        if (!isNullOrUndefined(arg.style.textBrushColor)) {
            var textBrushColor = this.hexDecToRgb(arg.style.textBrushColor);
            gridCell.style.textBrush = new PdfSolidBrush(new PdfColor(textBrushColor.r, textBrushColor.g, textBrushColor.b));
        }
        if (!isNullOrUndefined(arg.style.textPenColor)) {
            var textColor = this.hexDecToRgb(arg.style.textPenColor);
            gridCell.style.textPen = new PdfPen(new PdfColor(textColor.r, textColor.g, textColor.b));
        }
        if (!isNullOrUndefined(arg.style.fontFamily) || !isNullOrUndefined(arg.style.fontSize) || !isNullOrUndefined(arg.style.bold) ||
            !isNullOrUndefined(arg.style.italic) || !isNullOrUndefined(arg.style.underline) || !isNullOrUndefined(arg.style.strikeout)) {
            gridCell.style.font = this.getFont(arg);
        }
        if (!isNullOrUndefined(arg.style.border)) {
            var border = new PdfBorders();
            var borderWidth = arg.style.border.width;
            // set border width
            var width = (!isNullOrUndefined(borderWidth) && typeof borderWidth === 'number') ? (borderWidth * 0.75) : (undefined);
            // set border color
            var color = new PdfColor(196, 196, 196);
            if (!isNullOrUndefined(arg.style.border.color)) {
                var borderColor = this.hexDecToRgb(arg.style.border.color);
                color = new PdfColor(borderColor.r, borderColor.g, borderColor.b);
            }
            var pen = new PdfPen(color, width);
            // set border dashStyle 'Solid <default>, Dash, Dot, DashDot, DashDotDot'
            if (!isNullOrUndefined(arg.style.border.dashStyle)) {
                pen.dashStyle = this.getDashStyle(arg.style.border.dashStyle);
            }
            border.all = pen;
            gridCell.style.borders = border;
        }
    };
    PDFExport.prototype.applyEvent = function () {
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
        var style;
        var args = {
            fileName: 'default', header: '', footer: '', dataCollections: [clonedValues], allowRepeatHeader: true, style: style
        };
        this.parent.trigger(events.beforeExport, args);
        this.gridStyle = args.style;
        var document = new PdfDocument();
        return { document: document, args: args };
    };
    /**
     * To destroy the pdf export module
     * @returns void
     * @hidden
     */
    /* tslint:disable-next-line:no-empty */
    PDFExport.prototype.destroy = function () {
    };
    return PDFExport;
}());
export { PDFExport };
