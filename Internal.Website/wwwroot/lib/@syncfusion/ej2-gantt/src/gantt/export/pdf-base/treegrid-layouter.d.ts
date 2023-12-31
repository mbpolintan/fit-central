import { PdfTreeGridRow } from './index';
import { PdfTreeGrid } from '../pdf-treegrid';
import { ElementLayouter, PdfLayoutResult, PdfLayoutFormat, PdfPage, RectangleF, PdfLayoutParams } from '@syncfusion/ej2-pdf-export';
/**
 *
 */
export declare class PdfTreeGridLayouter extends ElementLayouter {
    private currentPage;
    private currentGraphics;
    private currentPageBounds;
    private currentBounds;
    private startLocation;
    columnRanges: number[][];
    private cellStartIndex;
    private cellEndIndex;
    private repeatRowIndex;
    private treegridHeight;
    constructor(baseFormat: PdfTreeGrid);
    readonly treegrid: PdfTreeGrid;
    layoutInternal(param: PdfLayoutParams): PdfLayoutResult;
    /**
     * `Determines the column draw ranges`.
     * @private
     */
    private determineColumnDrawRanges;
    private getFormat;
    private layoutOnPage;
    private checkBounds;
    private drawHeader;
    private reArrangePages;
    getNextPageFormat(format: PdfLayoutFormat): PdfPage;
    private getLayoutResult;
    private checkIfDefaultFormat;
    private drawRow;
    /**
     *
     */
    private drawRowWithBreak;
    /**
     * `Recalculate row height` for the split cell to be drawn.
     * @private
     */
    reCalculateHeight(row: PdfTreeGridRow, height: number): number;
}
export declare class PdfTreeGridLayoutResult extends PdfLayoutResult {
    /**
     * Constructor
     * @private
     */
    constructor(page: PdfPage, bounds: RectangleF);
}
/**
 * `PdfGridLayoutFormat` class represents a flexible grid that consists of columns and rows.
 */
export declare class PdfTreeGridLayoutFormat extends PdfLayoutFormat {
    /**
     * Initializes a new instance of the `PdfGridLayoutFormat` class.
     * @private
     */
    constructor(baseFormat?: PdfLayoutFormat);
}
