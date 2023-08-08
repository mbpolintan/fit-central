import { WListFormat, WCharacterFormat } from '../format/index';
import { LayoutViewer } from '../index';
import { LineWidget, Page, ChartElementBox } from '../viewer/page';
import { DocumentHelper } from '../viewer';
import { DocumentEditor } from '../../document-editor';
/**
 * Exports the document to Sfdt format.
 */
export declare class SfdtExport {
    private endLine;
    private endOffset;
    private endCell;
    private startColumnIndex;
    private endColumnIndex;
    private lists;
    private document;
    private writeInlineStyles;
    private editRangeId;
    /**
     * @private
     */
    private isExport;
    private documentHelper;
    private checkboxOrDropdown;
    /**
     * @private
     */
    copyWithTrackChange: boolean;
    /**
     * documentHelper definition
     */
    constructor(documentHelper: DocumentHelper);
    readonly viewer: LayoutViewer;
    readonly owner: DocumentEditor;
    private getModuleName;
    private clear;
    /**
     * Serialize the data as Syncfusion document text.
     * @private
     */
    serialize(): string;
    /**
     * @private
     */
    saveAsBlob(documentHelper: DocumentHelper): Promise<Blob>;
    private updateEditRangeId;
    /**
     * @private
     */
    write(line?: LineWidget, startOffset?: number, endLine?: LineWidget, endOffset?: number, writeInlineStyles?: boolean, isExport?: boolean): any;
    /**
     * @private
     */
    Initialize(): void;
    /**
     * @private
     */
    writePage(page: Page): any;
    private writeBodyWidget;
    private writeHeaderFooters;
    private writeHeaderFooter;
    private createSection;
    private writeBlock;
    private writeParagraph;
    private writeInlines;
    private writeInline;
    private writeShape;
    writeChart(element: ChartElementBox, inline: any): void;
    private writeChartTitleArea;
    private writeChartDataFormat;
    private writeChartLayout;
    private writeChartArea;
    private writeChartLegend;
    private writeChartCategoryAxis;
    private writeChartDataTable;
    private writeChartCategory;
    private createChartCategory;
    private writeChartData;
    private createChartData;
    private createChartSeries;
    private writeChartSeries;
    private writeChartDataLabels;
    private writeChartTrendLines;
    private writeLines;
    private writeLine;
    private createParagraph;
    /**
     * @private
     */
    writeCharacterFormat(format: WCharacterFormat, isInline?: boolean): any;
    private writeParagraphFormat;
    private writeTabs;
    /**
     * @private
     */
    writeListFormat(format: WListFormat, isInline?: boolean): any;
    private writeTable;
    private writeRow;
    private writeCell;
    private createTable;
    private createRow;
    private createCell;
    private writeShading;
    private writeBorder;
    private writeBorders;
    private writeCellFormat;
    private writeRowFormat;
    private writeRowRevisions;
    private writeTableFormat;
    private writeStyles;
    private writeStyle;
    writeRevisions(documentHelper: DocumentHelper): void;
    private writeRevision;
    writeComments(documentHelper: DocumentHelper): void;
    private writeComment;
    private commentInlines;
    private writeLists;
    private writeAbstractList;
    private writeList;
    private writeLevelOverrides;
    private writeListLevel;
    /**
     * @private
     */
    destroy(): void;
}
