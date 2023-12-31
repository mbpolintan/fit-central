import { PdfGanttTheme } from './../export/pdf-base/pdf-style/gantt-theme';
import { PdfTreeGridLayoutFormat } from './../export/pdf-base/index';
import { isNullOrUndefined, getValue, extend } from '@syncfusion/ej2-base';
import { ExportHelper } from '../export/export-helper';
import { PdfDocument, PdfPageSettings, PdfPageOrientation, SizeF, PdfLayoutBreakType } from '@syncfusion/ej2-pdf-export';
import { PdfGantt } from '../export/pdf-gantt';
/**
 *
 * @hidden
 */
var PdfExport = /** @class */ (function () {
    /**
     * @hidden
     */
    function PdfExport(parent) {
        this.isPdfExport = false;
        this.parent = parent;
        this.helper = new ExportHelper(this.parent);
        this.pdfDocument = undefined;
    }
    /**
     *
     */
    PdfExport.prototype.getModuleName = function () {
        return 'pdfExport';
    };
    /**
     * To destroy Pdf export module.
     * @private
     */
    PdfExport.prototype.destroy = function () {
        // Destroy Method
    };
    PdfExport.prototype.initGantt = function () {
        this.pdfDocument = undefined;
        this.gantt = new PdfGantt(this.parent);
        // this.gantt.exportValueFormatter = new ExportValueFormatter(this.parent.locale);        
    };
    /**
     *
     */
    /* tslint:disable-next-line */
    PdfExport.prototype.export = function (pdfExportProperties, isMultipleExport, pdfDoc) {
        var _this = this;
        var args = {
            requestType: 'beforePdfExport',
            ganttObject: this.parent,
            cancel: false
        };
        this.parent.trigger('beforePdfExport', args);
        if (getValue('cancel', args)) {
            return new Promise(function (resolve, reject) {
                return resolve();
            });
        }
        return new Promise(function (resolve, reject) {
            _this.exportWithData(pdfDoc, resolve, pdfExportProperties, isMultipleExport);
        });
    };
    /* tslint:disable-next-line */
    PdfExport.prototype.exportWithData = function (pdfDoc, resolve, pdfExportProperties, isMultipleExport) {
        var _this = this;
        var data = [];
        if (isNullOrUndefined(pdfExportProperties)) {
            pdfExportProperties = {};
        }
        if (pdfExportProperties.exportType === 'CurrentViewData') {
            data = this.parent.currentViewData;
        }
        else {
            data = this.parent.flatData;
        }
        this.initGantt();
        if (!isNullOrUndefined(pdfDoc)) {
            this.pdfDocument = pdfDoc;
        }
        else {
            this.pdfDocument = new PdfDocument();
        }
        this.processExport(data, pdfExportProperties, isMultipleExport).then(function () {
            _this.parent.trigger('pdfExportComplete', {});
            resolve(_this.pdfDocument);
        });
    };
    /* tslint:disable-next-line */
    PdfExport.prototype.processExport = function (data, pdfExportProperties, isMultipleExport) {
        var _this = this;
        var section = this.pdfDocument.sections.add();
        this.processSectionExportProperties(section, pdfExportProperties);
        var pdfPage = section.pages.add();
        return new Promise(function (resolve, reject) {
            _this.helper.processGridExport(data, _this.gantt, pdfExportProperties);
            _this.helper.initializePdf(_this.pdfDocument);
            resolve();
        }).then(function () {
            var format = new PdfTreeGridLayoutFormat();
            format.break = PdfLayoutBreakType.FitElement;
            var layouter = _this.gantt.drawGrid(pdfPage, 0, 0, format);
            _this.gantt.drawChart(layouter);
            if (!isMultipleExport) {
                // save the PDF
                if (!isNullOrUndefined(pdfExportProperties) && pdfExportProperties.fileName) {
                    _this.pdfDocument.save(pdfExportProperties.fileName);
                }
                else {
                    _this.pdfDocument.save('Export.pdf');
                }
                _this.pdfDocument.destroy();
            }
            return _this.pdfDocument;
        });
    };
    PdfExport.prototype.processSectionExportProperties = function (section, pdfExportProperties) {
        //To set section page size and page orientation.
        if (!isNullOrUndefined(pdfExportProperties)) {
            var pdfPageSettings = new PdfPageSettings();
            if (!isNullOrUndefined(pdfExportProperties.pageOrientation && pdfExportProperties.pageOrientation === 'Portrait')) {
                pdfPageSettings.orientation = PdfPageOrientation.Portrait;
            }
            else {
                pdfPageSettings.orientation = PdfPageOrientation.Landscape;
            }
            if (!isNullOrUndefined(pdfExportProperties.pageSize)) {
                pdfPageSettings.size = this.getPageSize(pdfExportProperties.pageSize);
            }
            section.setPageSettings(pdfPageSettings);
            if (!isNullOrUndefined(pdfExportProperties.ganttStyle)) {
                var defaultGanttTheme = new PdfGanttTheme(pdfExportProperties.theme).style;
                this.gantt.ganttStyle = extend({}, defaultGanttTheme, pdfExportProperties.ganttStyle, true);
            }
            else {
                this.gantt.ganttStyle = new PdfGanttTheme(pdfExportProperties.theme).style;
            }
        }
        else {
            this.gantt.ganttStyle = new PdfGanttTheme(pdfExportProperties.theme).style;
        }
    };
    PdfExport.prototype.getPageSize = function (pageSize) {
        switch (pageSize) {
            case 'Letter':
                return new SizeF(612, 792);
            case 'Note':
                return new SizeF(540, 720);
            case 'Legal':
                return new SizeF(612, 1008);
            case 'A0':
                return new SizeF(2380, 3368);
            case 'A1':
                return new SizeF(1684, 2380);
            case 'A2':
                return new SizeF(1190, 1684);
            case 'A3':
                return new SizeF(842, 1190);
            case 'A5':
                return new SizeF(421, 595);
            case 'A6':
                return new SizeF(297, 421);
            case 'A7':
                return new SizeF(210, 297);
            case 'A8':
                return new SizeF(148, 210);
            case 'A9':
                return new SizeF(105, 148);
            // case 'A10':
            //     return new SizeF(74, 105);
            case 'B0':
                return new SizeF(2836, 4008);
            case 'B1':
                return new SizeF(2004, 2836);
            case 'B2':
                return new SizeF(1418, 2004);
            case 'B3':
                return new SizeF(1002, 1418);
            case 'B4':
                return new SizeF(709, 1002);
            case 'B5':
                return new SizeF(501, 709);
            case 'Archa':
                return new SizeF(648, 864);
            case 'Archb':
                return new SizeF(864, 1296);
            case 'Archc':
                return new SizeF(1296, 1728);
            case 'Archd':
                return new SizeF(1728, 2592);
            case 'Arche':
                return new SizeF(2592, 3456);
            case 'Flsa':
                return new SizeF(612, 936);
            case 'HalfLetter':
                return new SizeF(396, 612);
            case 'Letter11x17':
                return new SizeF(792, 1224);
            case 'Ledger':
                return new SizeF(1224, 792);
            default:
                return new SizeF(595, 842);
        }
    };
    return PdfExport;
}());
export { PdfExport };
