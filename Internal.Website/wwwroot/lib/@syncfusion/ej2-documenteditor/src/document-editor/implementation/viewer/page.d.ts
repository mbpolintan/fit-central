import { WTableFormat, WRowFormat, WCellFormat } from '../format/index';
import { WidthType, AutoFitType, TextFormFieldType, CheckBoxSizeType, VerticalOrigin, VerticalAlignment, HorizontalOrigin, HorizontalAlignment, LineFormatType, LineDashing, AutoShapeType } from '../../base/types';
import { WListLevel } from '../list/list-level';
import { WParagraphFormat, WCharacterFormat, WSectionFormat, WBorder, WBorders } from '../format/index';
import { Dictionary } from '../../base/dictionary';
import { ElementInfo, Point, WidthInfo, TextFormFieldInfo, CheckBoxFormFieldInfo, DropDownFormFieldInfo } from '../editor/editor-helper';
import { HeaderFooterType, TabLeader } from '../../base/types';
import { TextPosition } from '..';
import { ChartComponent } from '@syncfusion/ej2-office-chart';
import { LayoutViewer, DocumentHelper } from './viewer';
import { Revision } from '../track-changes/track-changes';
/**
 * @private
 */
export declare class Rect {
    /**
     * @private
     */
    width: number;
    /**
     * @private
     */
    height: number;
    /**
     * @private
     */
    x: number;
    /**
     * @private
     */
    y: number;
    /**
     * @private
     */
    readonly right: number;
    /**
     * @private
     */
    readonly bottom: number;
    constructor(x: number, y: number, width: number, height: number);
}
/**
 * @private
 */
export declare class Padding {
    right: number;
    left: number;
    top: number;
    bottom: number;
    constructor(right: number, left: number, top: number, bottom: number);
}
/**
 * @private
 */
export declare class Margin {
    /**
     * @private
     */
    left: number;
    /**
     * @private
     */
    top: number;
    /**
     * @private
     */
    right: number;
    /**
     * @private
     */
    bottom: number;
    constructor(leftMargin: number, topMargin: number, rightMargin: number, bottomMargin: number);
    /**
     * @private
     */
    clone(): Margin;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export interface IWidget {
}
/**
 * @private
 */
export declare abstract class Widget implements IWidget {
    /**
     * @private
     */
    childWidgets: IWidget[];
    /**
     * @private
     */
    x: number;
    /**
     * @private
     */
    y: number;
    /**
     * @private
     */
    width: number;
    /**
     * @private
     */
    height: number;
    /**
     * @private
     */
    margin: Margin;
    /**
     * @private
     */
    containerWidget: Widget;
    /**
     * @private
     */
    index: number;
    /**
     * @private
     */
    readonly indexInOwner: number;
    /**
     * @private
     */
    readonly firstChild: IWidget;
    /**
     * @private
     */
    readonly lastChild: IWidget;
    /**
     * @private
     */
    readonly previousWidget: Widget;
    /**
     * @private
     */
    readonly nextWidget: Widget;
    /**
     * @private
     */
    readonly previousRenderedWidget: Widget;
    /**
     * @private
     */
    readonly nextRenderedWidget: Widget;
    /**
     * @private
     */
    readonly previousSplitWidget: Widget;
    /**
     * @private
     */
    readonly nextSplitWidget: Widget;
    /**
     * @private
     */
    abstract equals(widget: Widget): boolean;
    /**
     * @private
     */
    abstract getTableCellWidget(point: Point): TableCellWidget;
    /**
     * @private
     */
    getPreviousSplitWidgets(): Widget[];
    /**
     * @private
     */
    getSplitWidgets(): Widget[];
    /**
     * @private
     */
    combineWidget(viewer: LayoutViewer): Widget;
    private combine;
    /**
     * @private
     */
    addWidgets(childWidgets: IWidget[]): void;
    /**
     * @private
     */
    removeChild(index: number): void;
    /**
     * @private
     */
    abstract destroyInternal(viewer: LayoutViewer): void;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export declare abstract class BlockContainer extends Widget {
    /**
     * @private
     */
    page: Page;
    /**
     * @private
     */
    floatingElements: ShapeElementBox[];
    /**
     * @private
     */
    sectionFormatIn: WSectionFormat;
    /**
     * @private
     */
    /**
    * @private
    */
    sectionFormat: WSectionFormat;
    /**
     * @private
     */
    readonly sectionIndex: number;
    /**
     * @private
     */
    getHierarchicalIndex(hierarchicalIndex: string): string;
}
/**
 * @private
 */
export declare class BodyWidget extends BlockContainer {
    /**
     * Initialize the constructor of BodyWidget
     */
    constructor();
    /**
     * @private
     */
    equals(widget: Widget): boolean;
    /**
     * @private
     */
    getHierarchicalIndex(hierarchicalIndex: string): string;
    /**
     * @private
     */
    getTableCellWidget(touchPoint: Point): TableCellWidget;
    /**
     * @private
     */
    destroyInternal(viewer: LayoutViewer): void;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export interface HeaderFooters {
    [key: number]: HeaderFooterWidget;
}
/**
 * @private
 */
export declare class HeaderFooterWidget extends BlockContainer {
    /**
     * @private
     */
    headerFooterType: HeaderFooterType;
    /**
     * @private
     */
    isEmpty: boolean;
    constructor(type: HeaderFooterType);
    /**
     * @private
     */
    getTableCellWidget(point: Point): TableCellWidget;
    /**
     * @private
     */
    equals(widget: Widget): boolean;
    /**
     * @private
     */
    clone(): HeaderFooterWidget;
    /**
     * @private
     */
    destroyInternal(viewer: LayoutViewer): void;
}
/**
 * @private
 */
export declare abstract class BlockWidget extends Widget {
    /**
     * @private
     */
    leftBorderWidth: number;
    /**
     * @private
     */
    rightBorderWidth: number;
    /**
     * @private
     */
    topBorderWidth: number;
    /**
     * @private
     */
    bottomBorderWidth: number;
    /**
     * @private
     */
    readonly bodyWidget: BlockContainer;
    /**
     * @private
     */
    readonly leftIndent: number;
    /**
     * @private
     */
    readonly rightIndent: number;
    /**
     * @private
     */
    readonly isInsideTable: boolean;
    /**
     * @private
     */
    readonly isInHeaderFooter: boolean;
    /**
     * @private
     */
    readonly associatedCell: TableCellWidget;
    /**
     * Check whether the paragraph contains only page break.
     * @private
     */
    isPageBreak(): boolean;
    /**
     * @private
     */
    getHierarchicalIndex(hierarchicalIndex: string): string;
    /**
     * @private
     */
    abstract getMinimumAndMaximumWordWidth(minimumWordWidth: number, maximumWordWidth: number): WidthInfo;
    /**
     * @private
     */
    abstract clone(): BlockWidget;
    /**
     * @private
     */
    getIndex(): number;
    /**
     * @private
     */
    getContainerWidth(): number;
    /**
     * @private
     */
    readonly bidi: boolean;
}
/**
 * @private
 */
export declare class ParagraphWidget extends BlockWidget {
    /**
     * @private
     */
    paragraphFormat: WParagraphFormat;
    /**
     * @private
     */
    characterFormat: WCharacterFormat;
    /**
     * @private
     */
    isChangeDetected: boolean;
    /**
     * @private
     */
    floatingElements: ShapeElementBox[];
    /**
     * @private
     */
    readonly isEndsWithPageBreak: boolean;
    /**
     * Initialize the constructor of ParagraphWidget
     */
    constructor();
    /**
     * @private
     */
    equals(widget: Widget): boolean;
    /**
     * @private
     */
    isEmpty(): boolean;
    /**
     * @private
     */
    getInline(offset: number, indexInInline: number): ElementInfo;
    /**
     * @private
     */
    getLength(): number;
    /**
     * @private
     */
    getTableCellWidget(point: Point): TableCellWidget;
    /**
     * @private
     */
    getMinimumAndMaximumWordWidth(minimumWordWidth: number, maximumWordWidth: number): WidthInfo;
    private measureParagraph;
    /**
     * @private
     */
    clone(): ParagraphWidget;
    /**
     * @private
     */
    destroyInternal(viewer: LayoutViewer): void;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export declare class TableWidget extends BlockWidget {
    private flags;
    /**
     * @private
     */
    leftMargin: number;
    /**
     * @private
     */
    topMargin: number;
    /**
     * @private
     */
    rightMargin: number;
    /**
     * @private
     */
    bottomMargin: number;
    /**
     * @private
     */
    tableFormat: WTableFormat;
    /**
     * @private
     */
    spannedRowCollection: Dictionary<number, number>;
    /**
     * @private
     */
    tableHolder: WTableHolder;
    /**
     * @private
     */
    headerHeight: number;
    /**
     * @private
     */
    description: string;
    /**
     * @private
     */
    title: string;
    /**
     * @private
     */
    tableCellInfo: Dictionary<number, Dictionary<number, number>>;
    /**
     * @private
     */
    isDefaultFormatUpdated: boolean;
    /**
     * @private
     */
    /**
    * @private
    */
    isGridUpdated: boolean;
    /**
     * @private
     */
    /**
    * @private
    */
    continueHeader: boolean;
    /**
     * @private
     */
    /**
    * @private
    */
    header: boolean;
    isBidiTable: boolean;
    constructor();
    /**
     * @private
     */
    equals(widget: Widget): boolean;
    /**
     * @private
     */
    combineRows(viewer: LayoutViewer): void;
    /**
     * @private
     */
    contains(tableCell: TableCellWidget): boolean;
    /**
     * @private
     */
    getOwnerWidth(isBasedOnViewer: boolean): number;
    /**
     * @private
     */
    getTableWidth(): number;
    /**
     * @private
     */
    getTableClientWidth(clientWidth: number): number;
    /**
     * @private
     */
    getCellWidth(preferredWidth: number, preferredWidthType: WidthType, containerWidth: number, cell: TableCellWidget): number;
    /**
     * @private
     */
    fitCellsToClientArea(clientWidth: number): void;
    /**
     * @private
     */
    getTableCellWidget(point: Point): TableCellWidget;
    /**
     * @private
     */
    calculateGrid(): void;
    private updateColumnSpans;
    /**
     * @private
     */
    getMinimumAndMaximumWordWidth(minimumWordWidth: number, maximumWordWidth: number): WidthInfo;
    /**
     * @private
     */
    checkTableColumns(): void;
    /**
     * @private
     */
    isAutoFit(): boolean;
    /**
     * @private
     */
    buildTableColumns(): void;
    /**
     * @private
     */
    setWidthToCells(tableWidth: number, isAutoWidth: boolean): void;
    /**
     * @private
     */
    updateProperties(updateAllowAutoFit: boolean, currentSelectedTable: TableWidget, autoFitBehavior: AutoFitType): void;
    /**
     * @private
     */
    getMaxRowWidth(clientWidth: number): number;
    /**
     * @private
     */
    updateWidth(dragValue: number): void;
    /**
     * @private
     */
    convertPointToPercent(tablePreferredWidth: number, ownerWidth: number): number;
    updateChildWidgetLeft(left: number): void;
    /**
     * Shift the widgets for right to left aligned table.
     * @private
     */
    shiftWidgetsForRtlTable(clientArea: Rect, tableWidget: TableWidget): void;
    /**
     * @private
     */
    clone(): TableWidget;
    /**
     * @private
     */
    static getTableOf(node: WBorders): TableWidget;
    /**
     * @private
     */
    fitChildToClientArea(): void;
    /**
     * @private
     */
    getColumnCellsForSelection(startCell: TableCellWidget, endCell: TableCellWidget): TableCellWidget[];
    /**
     * Splits width equally for all the cells.
     * @param tableClientWidth
     * @private
     */
    splitWidthToTableCells(tableClientWidth: number, isZeroWidth?: boolean): void;
    /**
     * @private
     */
    insertTableRowsInternal(tableRows: TableRowWidget[], startIndex: number): void;
    /**
     * @private
     */
    updateRowIndex(startIndex: number): void;
    /**
     * @private
     */
    getCellStartOffset(cell: TableCellWidget): number;
    /**
     * @private
     */
    destroyInternal(viewer: LayoutViewer): void;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export declare class TableRowWidget extends BlockWidget {
    /**
     * @private
     */
    topBorderWidth: number;
    /**
     * @private
     */
    bottomBorderWidth: number;
    /**
     * @private
     */
    rowFormat: WRowFormat;
    /**
     * @private
     */
    readonly rowIndex: number;
    /**
     * @private
     */
    readonly ownerTable: TableWidget;
    /**
     * @private
     */
    readonly nextRow: TableRowWidget;
    constructor();
    /**
     * @private
     */
    equals(widget: Widget): boolean;
    /**
     * @private
     */
    combineCells(viewer: LayoutViewer): void;
    /**
     * @private
     */
    static getRowOf(node: WBorders): TableRowWidget;
    /**
     * @private
     */
    getCell(rowIndex: number, cellIndex: number): TableCellWidget;
    /**
     * @private
     */
    splitWidthToRowCells(tableClientWidth: number, isZeroWidth?: boolean): void;
    /**
     * @private
     */
    getGridCount(tableGrid: number[], cell: TableCellWidget, index: number, containerWidth: number): number;
    private getOffsetIndex;
    private getCellOffset;
    /**
     * @private
     */
    updateRowBySpannedCells(): void;
    /**
     * @private
     */
    getPreviousRowSpannedCells(include?: boolean): TableCellWidget[];
    /**
     * @private
     */
    getTableCellWidget(point: Point): TableCellWidget;
    /**
     * @private
     */
    getMinimumAndMaximumWordWidth(minimumWordWidth: number, maximumWordWidth: number): WidthInfo;
    /**
     * @private
     */
    destroyInternal(viewer: LayoutViewer): void;
    /**
     * @private
     */
    clone(): TableRowWidget;
    /**
     * Updates the child widgets left.
     * @param left
     * @private
     */
    updateChildWidgetLeft(left: number): void;
    /**
     * Shift the widgets for RTL table.
     * @param clientArea
     * @param tableWidget
     * @param rowWidget
     * @private
     */
    shiftWidgetForRtlTable(clientArea: Rect, tableWidget: TableWidget, rowWidget: TableRowWidget): void;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export declare class TableCellWidget extends BlockWidget {
    /**
     * @private
     */
    rowIndex: number;
    /**
     * @private
     */
    cellFormat: WCellFormat;
    /**
     * @private
     */
    columnIndex: number;
    private sizeInfoInternal;
    /**
     * @private
     */
    readonly ownerColumn: WColumn;
    /**
     * @private
     */
    readonly leftMargin: number;
    /**
     * @private
     */
    readonly topMargin: number;
    /**
     * @private
     */
    readonly rightMargin: number;
    /**
     * @private
     */
    readonly bottomMargin: number;
    /**
     * @private
     */
    readonly cellIndex: number;
    /**
     * @private
     */
    readonly ownerTable: TableWidget;
    /**
     * @private
     */
    readonly ownerRow: TableRowWidget;
    /**
     * @private
     */
    readonly sizeInfo: ColumnSizeInfo;
    constructor();
    /**
     * @private
     */
    equals(widget: Widget): boolean;
    /**
     * @private
     */
    getContainerTable(): TableWidget;
    /**
     * @private
     */
    getPreviousSplitWidget(): TableCellWidget;
    /**
     * @private
     */
    getNextSplitWidget(): TableCellWidget;
    /**
     * @private
     */
    getTableCellWidget(point: Point): TableCellWidget;
    /**
     * @private
     */
    updateWidth(preferredWidth: number): void;
    /**
     * @private
     */
    getCellWidth(): number;
    /**
     * @private
     */
    convertPointToPercent(cellPreferredWidth: number): number;
    /**
     * @private
     */
    static getCellLeftBorder(tableCell: TableCellWidget): WBorder;
    /**
     * @private
     */
    getLeftBorderWidth(): number;
    /**
     * @private
     */
    getRightBorderWidth(): number;
    /**
     * @private
     */
    getCellSpacing(): number;
    /**
     * @private
     */
    getCellSizeInfo(isAutoFit: boolean): ColumnSizeInfo;
    /**
     * @private
     */
    getMinimumPreferredWidth(): number;
    /**
     * @private
     */
    getPreviousCellLeftBorder(leftBorder: WBorder, previousCell: TableCellWidget): WBorder;
    /**
     * @private
     */
    getBorderBasedOnPriority(border: WBorder, adjacentBorder: WBorder): WBorder;
    /**
     * @private
     */
    getLeftBorderToRenderByHierarchy(leftBorder: WBorder, rowBorders: WBorders, tableBorders: WBorders): WBorder;
    /**
     * @private
     */
    static getCellRightBorder(tableCell: TableCellWidget): WBorder;
    /**
     * @private
     */
    getAdjacentCellRightBorder(rightBorder: WBorder, nextCell: TableCellWidget): WBorder;
    /**
     * @private
     */
    getRightBorderToRenderByHierarchy(rightBorder: WBorder, rowBorders: WBorders, tableBorders: WBorders): WBorder;
    /**
     * @private
     */
    static getCellTopBorder(tableCell: TableCellWidget): WBorder;
    /**
     * @private
     */
    getPreviousCellTopBorder(topBorder: WBorder, previousTopCell: TableCellWidget): WBorder;
    /**
     * @private
     */
    getTopBorderToRenderByHierarchy(topBorder: WBorder, rowBorders: WBorders, tableBorders: WBorders): WBorder;
    /**
     * @private
     */
    static getCellBottomBorder(tableCell: TableCellWidget): WBorder;
    /**
     * @private
     */
    getAdjacentCellBottomBorder(bottomBorder: WBorder, nextBottomCell: TableCellWidget): WBorder;
    /**
     * @private
     */
    getBottomBorderToRenderByHierarchy(bottomBorder: WBorder, rowBorders: WBorders, tableBorders: WBorders): WBorder;
    private convertHexToRGB;
    /**
     * @private
     */
    static getCellOf(node: WBorders): TableCellWidget;
    /**
     * Updates the Widget left.
     * @private
     */
    updateWidgetLeft(x: number): void;
    /**
     * @private
     */
    updateChildWidgetLeft(left: number): void;
    /**
     * @private
     */
    getMinimumAndMaximumWordWidth(minimumWordWidth: number, maximumWordWidth: number): WidthInfo;
    /**
     * @private
     */
    destroyInternal(viewer: LayoutViewer): void;
    /**
     * @private
     */
    clone(): TableCellWidget;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export declare class LineWidget implements IWidget {
    /**
     * @private
     */
    children: ElementBox[];
    /**
     * @private
     */
    paragraph: ParagraphWidget;
    /**
     * @private
     */
    x: number;
    /**
     * @private
     */
    y: number;
    /**
     * @private
     */
    width: number;
    /**
     * @private
     */
    height: number;
    /**
     * @private
     */
    readonly indexInOwner: number;
    /**
     * @private
     */
    readonly nextLine: LineWidget;
    /**
     * @private
     */
    readonly previousLine: LineWidget;
    /**
     * @private
     */
    readonly isEndsWithPageBreak: boolean;
    /**
     * Initialize the constructor of LineWidget
     */
    constructor(paragraphWidget: ParagraphWidget);
    /**
     * @private
     */
    isFirstLine(): boolean;
    /**
     * @private
     */
    isLastLine(): boolean;
    /**
     * @private
     */
    getOffset(inline: ElementBox, index: number): number;
    /**
     * @private
     */
    getEndOffset(): number;
    /**
     * @private
     * @param offset
     * @param isOffset
     * @param inline
     * @param isEndOffset
     */
    getInlineForOffset(offset: number, isOffset?: boolean, inline?: ElementBox, isEndOffset?: boolean, isPrevOffset?: boolean, isNxtOffset?: boolean): ElementInfo;
    getInlineForRtlLine(offset: number, isOffset?: boolean, inline?: ElementBox): ElementInfo;
    /**
     * @private
     */
    getInline(offset: number, indexInInline: number, bidi?: boolean, isInsert?: boolean): ElementInfo;
    /**
     * Method to retrieve next element
     * @param line
     * @param index
     */
    private getNextTextElement;
    /**
     * @private
     */
    getHierarchicalIndex(hierarchicalIndex: string): string;
    /**
     * @private
     */
    clone(): LineWidget;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export declare abstract class ElementBox {
    /**
     * @private
     */
    x: number;
    /**
     * @private
     */
    y: number;
    /**
     * @private
     */
    width: number;
    /**
     * @private
     */
    height: number;
    /**
     * @private
     */
    margin: Margin;
    /**
     * @private
     */
    line: LineWidget;
    /**
     * @private
     */
    characterFormat: WCharacterFormat;
    /**
     * @private
     */
    static objectCharacter: string;
    /**
     * @private
     */
    isRightToLeft: boolean;
    /**
     * @private
     */
    canTrigger: boolean;
    /**
     * @private
     */
    ischangeDetected: boolean;
    /**
     * @private
     */
    isVisible: boolean;
    /**
     * @private
     */
    isSpellChecked?: boolean;
    /**
     * @private
     */
    revisions: Revision[];
    /**
     * @private
     */
    canTrack: boolean;
    /**
     * @private
     */
    removedIds: string[];
    /**
     * @private
     */
    isMarkedForRevision: boolean;
    /**
     * @private
     */
    readonly isPageBreak: boolean;
    /**
     * @private
     * Method to indicate whether current element is trackable.
     */
    readonly isValidNodeForTracking: boolean;
    /**
     * @private
     */
    linkFieldCharacter(documentHelper: DocumentHelper): void;
    /**
     * @private
     */
    linkFieldTraversingBackward(line: LineWidget, fieldEnd: FieldElementBox, previousNode: ElementBox): boolean;
    /**
     * @private
     */
    linkFieldTraversingForward(line: LineWidget, fieldBegin: FieldElementBox, previousNode: ElementBox): boolean;
    /**
     * @private
     */
    linkFieldTraversingBackwardSeparator(line: LineWidget, fieldSeparator: FieldElementBox, previousNode: ElementBox): boolean;
    /**
     * @private
     */
    readonly length: number;
    /**
     * @private
     */
    readonly indexInOwner: number;
    /**
     * @private
     */
    readonly previousElement: ElementBox;
    /**
     * @private
     */
    readonly nextElement: ElementBox;
    /**
     * @private
     */
    readonly nextNode: ElementBox;
    /**
     * @private
     */
    readonly nextValidNodeForTracking: ElementBox;
    /**
     * @private
     */
    readonly previousValidNodeForTracking: ElementBox;
    /**
     * @private
     */
    readonly previousNode: ElementBox;
    /**
     * @private
     */
    readonly paragraph: ParagraphWidget;
    /**
     * Initialize the constructor of ElementBox
     */
    constructor();
    /**
     * @private
     */
    abstract getLength(): number;
    /**
     * @private
     */
    abstract clone(): ElementBox;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export declare class FieldElementBox extends ElementBox {
    /**
     * @private
     */
    fieldType: number;
    /**
     * @private
     */
    fieldCodeType: string;
    /**
     * @private
     */
    hasFieldEnd: boolean;
    /**
     * @private
     */
    formFieldData: FormField;
    private fieldBeginInternal;
    private fieldSeparatorInternal;
    private fieldEndInternal;
    fieldBegin: FieldElementBox;
    fieldSeparator: FieldElementBox;
    fieldEnd: FieldElementBox;
    /**
     * @private
     */
    readonly resultText: string;
    constructor(type: number);
    /**
     * @private
     */
    getLength(): number;
    /**
     * @private
     */
    clone(): FieldElementBox;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export declare abstract class FormField {
    name: string;
    /**
     * @private
     */
    enabled: boolean;
    /**
     * @private
     */
    helpText: string;
    /**
     * @private
     */
    statusText: string;
    /**
     * @private
     */
    abstract clone(): FormField;
    /**
     * @private
     */
    abstract getFormFieldInfo(): TextFormFieldInfo | CheckBoxFormFieldInfo | DropDownFormFieldInfo;
    /**
     * @private
     */
    abstract copyFieldInfo(info: TextFormFieldInfo | CheckBoxFormFieldInfo | DropDownFormFieldInfo): void;
}
/**
 * @private
 */
export declare class TextFormField extends FormField {
    /**
     * @private
     */
    type: TextFormFieldType;
    /**
     * @private
     */
    maxLength: number;
    /**
     * @private
     */
    defaultValue: string;
    /**
     * @private
     */
    format: string;
    /**
     * @private
     */
    clone(): TextFormField;
    /**
     * @private
     */
    getFormFieldInfo(): TextFormFieldInfo;
    /**
     * @private
     */
    copyFieldInfo(info: TextFormFieldInfo): void;
}
/**
 * @private
 */
export declare class CheckBoxFormField extends FormField {
    /**
     * @private
     */
    sizeType: CheckBoxSizeType;
    /**
     * @private
     */
    size: number;
    /**
     * @private
     */
    defaultValue: boolean;
    /**
     * @private
     */
    checked: boolean;
    /**
     * @private
     */
    clone(): CheckBoxFormField;
    /**
     * @private
     */
    getFormFieldInfo(): CheckBoxFormFieldInfo;
    /**
     * @private
     */
    copyFieldInfo(info: CheckBoxFormFieldInfo): void;
}
/**
 * @private
 */
export declare class DropDownFormField extends FormField {
    /**
     * @private
     */
    dropdownItems: string[];
    /**
     * @private
     */
    selectedIndex: number;
    /**
     * @private
     */
    clone(): DropDownFormField;
    /**
     * @private
     */
    getFormFieldInfo(): DropDownFormFieldInfo;
    /**
     * @private
     */
    copyFieldInfo(info: DropDownFormFieldInfo): void;
}
/**
 * @private
 */
export declare class TextElementBox extends ElementBox {
    /**
     * @private
     */
    baselineOffset: number;
    /**
     * @private
     */
    text: string;
    /**
     * @private
     */
    trimEndWidth: number;
    /**
     * @private
     */
    errorCollection?: ErrorTextElementBox[];
    /**
     * @private
     */
    ignoreOnceItems?: string[];
    /**
     * @private
     */
    istextCombined?: boolean;
    constructor();
    /**
     * @private
     */
    getLength(): number;
    /**
     * @private
     */
    clone(): TextElementBox;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export declare class ErrorTextElementBox extends TextElementBox {
    private startIn;
    private endIn;
    start: TextPosition;
    end: TextPosition;
    constructor();
    destroy(): void;
}
/**
 * @private
 */
export declare class FieldTextElementBox extends TextElementBox {
    /**
     * @private
     */
    fieldBegin: FieldElementBox;
    private fieldText;
    text: string;
    constructor();
    /**
     * @private
     */
    clone(): FieldTextElementBox;
}
/**
 * @private
 */
export declare class TabElementBox extends TextElementBox {
    /**
     * @private
     */
    tabText: string;
    /**
     * @private
     */
    tabLeader: TabLeader;
    /**
     * @private
     */
    destroy(): void;
    constructor();
    /**
     * @private
     */
    clone(): TabElementBox;
}
/**
 * @private
 */
export declare class BookmarkElementBox extends ElementBox {
    private bookmarkTypeIn;
    private refereneceIn;
    private nameIn;
    /**
     * @private
     */
    readonly bookmarkType: number;
    /**
     * @private
     */
    /**
    * @private
    */
    name: string;
    /**
     * @private
     */
    /**
    * @private
    */
    reference: BookmarkElementBox;
    constructor(type: number);
    /**
     * @private
     */
    getLength(): number;
    /**
     * @private
     */
    destroy(): void;
    /**
     * Clones the bookmark element box.
     * @param element - book mark element
     */
    /**
     * @private
     */
    clone(): BookmarkElementBox;
}
/**
 * @private
 */
export declare class ShapeCommon extends ElementBox {
    /**
     * @private
     */
    shapeId: number;
    /**
     * @private
     */
    name: string;
    /**
     * @private
     */
    alternativeText: string;
    /**
     * @private
     */
    title: string;
    /**
     * @private
     */
    visible: boolean;
    /**
     * @private
     */
    width: number;
    /**
     * @private
     */
    height: number;
    /**
     * @private
     */
    widthScale: number;
    /**
     * @private
     */
    heightScale: number;
    /**
     * @private
     */
    lineFormat: LineFormat;
    /**
     *
     * @private
     */
    getLength(): number;
    /**
     * @private
     */
    clone(): ShapeCommon;
}
/**
 * @private
 */
export declare class ShapeBase extends ShapeCommon {
    /**
     * @private
     */
    verticalPosition: number;
    /**
     * @private
     */
    verticalOrigin: VerticalOrigin;
    /**
     * @private
     */
    verticalAlignment: VerticalAlignment;
    /**
     * @private
     */
    horizontalPosition: number;
    /**
     * @private
     */
    horizontalOrigin: HorizontalOrigin;
    /**
     * @private
     */
    horizontalAlignment: HorizontalAlignment;
    /**
     * @private
     */
    zOrderPosition: number;
    /**
     * @private
     */
    allowOverlap: boolean;
    /**
     * @private
     */
    layoutInCell: boolean;
    /**
     * @private
     */
    lockAnchor: boolean;
}
/**
 * @private
 */
export declare class ShapeElementBox extends ShapeBase {
    /**
     * @private
     */
    textFrame: TextFrame;
    /**
     * @private
     */
    autoShapeType: AutoShapeType;
    /**
     * @private
     */
    clone(): ShapeElementBox;
}
/**
 * @private
 */
export declare class TextFrame extends Widget {
    /**
     * @private
     */
    containerShape: ElementBox;
    /**
     * @private
     */
    textVerticalAlignment: VerticalAlignment;
    /**
     * @private
     */
    marginLeft: number;
    /**
     * @private
     */
    marginRight: number;
    /**
     * @private
     */
    marginTop: number;
    /**
     * @private
     */
    marginBottom: number;
    equals(): boolean;
    destroyInternal(): void;
    getHierarchicalIndex(index: string): string;
    getTableCellWidget(): TableCellWidget;
    /**
     * @private
     */
    clone(): TextFrame;
}
/**
 * @private
 */
export declare class LineFormat {
    /**
     * @private
     */
    lineFormatType: LineFormatType;
    /**
     * @private
     */
    color: string;
    /**
     * @private
     */
    weight: number;
    /**
     * @private
     */
    dashStyle: LineDashing;
    /**
     * @private
     */
    clone(): LineFormat;
}
/**
 * @private
 */
export declare class ImageElementBox extends ShapeBase {
    private imageStr;
    private imgElement;
    private isInlineImageIn;
    /**
     * @private
     */
    isMetaFile: boolean;
    /**
     * @private
     */
    readonly isInlineImage: boolean;
    /**
     * @private
     */
    readonly element: HTMLImageElement;
    /**
     * @private
     */
    readonly length: number;
    /**
     * @private
     */
    /**
    * @private
    */
    imageString: string;
    constructor(isInlineImage?: boolean);
    /**
     * @private
     */
    getLength(): number;
    /**
     * @private
     */
    clone(): ImageElementBox;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export declare class ListTextElementBox extends ElementBox {
    /**
     * @private
     */
    baselineOffset: number;
    /**
     * @private
     */
    text: string;
    /**
     * @private
     */
    trimEndWidth: number;
    /**
     * @private
     */
    listLevel: WListLevel;
    /**
     * @private
     */
    isFollowCharacter: boolean;
    constructor(listLevel: WListLevel, isListFollowCharacter: boolean);
    /**
     * @private
     */
    getLength(): number;
    /**
     * @private
     */
    clone(): ListTextElementBox;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export declare class EditRangeEndElementBox extends ElementBox {
    /**
     * @private
     */
    editRangeStart: EditRangeStartElementBox;
    editRangeId: number;
    constructor();
    /**
     * @private
     */
    getLength(): number;
    /**
     * @private
     */
    destroy(): void;
    /**
     * @private
     */
    clone(): EditRangeEndElementBox;
}
/**
 * @private
 */
export declare class EditRangeStartElementBox extends ElementBox {
    /**
     * @private
     */
    columnFirst: number;
    /**
     * @private
     */
    columnLast: number;
    /**
     * @private
     */
    user: string;
    /**
     * @private
     */
    group: string;
    /**
     * @private
     */
    editRangeEnd: EditRangeEndElementBox;
    editRangeId: number;
    constructor();
    /**
     * @private
     */
    getLength(): number;
    /**
     * @private
     */
    destroy(): void;
    /**
     * @private
     */
    clone(): EditRangeStartElementBox;
}
/**
 * @private
 */
export declare class ChartElementBox extends ImageElementBox {
    /**
     * @private
     */
    private div;
    /**
     * @private
     */
    private officeChartInternal;
    /**
     * @private
     */
    private chartTitle;
    /**
     * @private
     */
    private chartType;
    /**
     * @private
     */
    private gapWidth;
    /**
     * @private
     */
    private overlap;
    /**
     * @private
     */
    private chartElement;
    /**
     * @private
     */
    chartArea: ChartArea;
    /**
     * @private
     */
    chartPlotArea: ChartArea;
    /**
     * @private
     */
    chartCategory: ChartCategory[];
    /**
     * @private
     */
    chartSeries: ChartSeries[];
    /**
     * @private
     */
    chartTitleArea: ChartTitleArea;
    /**
     * @private
     */
    chartLegend: ChartLegend;
    /**
     * @private
     */
    chartPrimaryCategoryAxis: ChartCategoryAxis;
    /**
     * @private
     */
    chartPrimaryValueAxis: ChartCategoryAxis;
    /**
     * @private
     */
    chartDataTable: ChartDataTable;
    /**
     * @private
     */
    getLength(): number;
    /**
     * @private
     */
    /**
    * @private
    */
    title: string;
    /**
     * @private
     */
    /**
    * @private
    */
    type: string;
    /**
     * @private
     */
    /**
    * @private
    */
    chartGapWidth: number;
    /**
     * @private
     */
    /**
    * @private
    */
    chartOverlap: number;
    /**
     * @private
     */
    readonly targetElement: HTMLDivElement;
    /**
     * @private
     */
    /**
    * @private
    */
    officeChart: ChartComponent;
    /**
     * @private
     */
    constructor();
    private onChartLoaded;
    /**
     * @private
     */
    clone(): ChartElementBox;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export declare class ChartArea {
    /**
     * @private
     */
    private foreColor;
    /**
     * @private
     */
    /**
    * @private
    */
    chartForeColor: string;
    /**
     * @private
     */
    clone(): ChartArea;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export declare class ChartCategory {
    /**
     * @private
     */
    private categoryXName;
    /**
     * @private
     */
    chartData: ChartData[];
    /**
     * @private
     */
    /**
    * @private
    */
    xName: string;
    /**
     * @private
     */
    clone(): ChartCategory;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export declare class ChartData {
    private yValue;
    private xValue;
    private size;
    /**
     * @private
     */
    /**
    * @private
    */
    yAxisValue: number;
    /**
     * @private
     */
    /**
    * @private
    */
    xAxisValue: number;
    /**
     * @private
     */
    /**
    * @private
    */
    bubbleSize: number;
    /**
     * @private
     */
    clone(): ChartData;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export declare class ChartLegend {
    /**
     * @private
     */
    private legendPostion;
    /**
     * @private
     */
    chartTitleArea: ChartTitleArea;
    /**
     * @private
     */
    /**
    * @private
    */
    chartLegendPostion: string;
    /**
     * @private
     */
    constructor();
    /**
     * @private
     */
    clone(): ChartLegend;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export declare class ChartSeries {
    /**
     * @private
     */
    chartDataFormat: ChartDataFormat[];
    /**
     * @private
     */
    errorBar: ChartErrorBar;
    /**
     * @private
     */
    seriesFormat: ChartSeriesFormat;
    /**
     * @private
     */
    trendLines: ChartTrendLines[];
    /**
     * @private
     */
    private name;
    /**
     * @private
     */
    private sliceAngle;
    /**
     * @private
     */
    private holeSize;
    /**
     * @private
     */
    dataLabels: ChartDataLabels;
    /**
     * @private
     */
    /**
    * @private
    */
    seriesName: string;
    /**
     * @private
     */
    /**
    * @private
    */
    firstSliceAngle: number;
    /**
     * @private
     */
    /**
    * @private
    */
    doughnutHoleSize: number;
    constructor();
    /**
     * @private
     */
    clone(): ChartSeries;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export declare class ChartErrorBar {
    /**
     * @private
     */
    private type;
    /**
     * @private
     */
    private direction;
    /**
     * @private
     */
    private errorValue;
    /**
     * @private
     */
    private endStyle;
    /**
     * @private
     */
    /**
    * @private
    */
    errorType: string;
    /**
     * @private
     */
    /**
    * @private
    */
    errorDirection: string;
    /**
     * @private
     */
    /**
    * @private
    */
    errorEndStyle: string;
    /**
    * @private
    */
    numberValue: number;
    /**
     * @private
     */
    clone(): ChartErrorBar;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export declare class ChartSeriesFormat {
    /**
     * @private
     */
    private style;
    /**
     * @private
     */
    private color;
    /**
     * @private
     */
    private size;
    /**
     * @private
     */
    /**
    * @private
    */
    markerStyle: string;
    /**
     * @private
     */
    /**
    * @private
    */
    markerColor: string;
    /**
     * @private
     */
    /**
    * @private
    */
    numberValue: number;
    /**
     * @private
     */
    clone(): ChartSeriesFormat;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export declare class ChartDataLabels {
    /**
     * @private
     */
    private position;
    /**
     * @private
     */
    private name;
    /**
     * @private
     */
    private color;
    /**
     * @private
     */
    private size;
    /**
     * @private
     */
    private isLegend;
    /**
     * @private
     */
    private isBubble;
    /**
     * @private
     */
    private isCategory;
    /**
     * @private
     */
    private isSeries;
    /**
     * @private
     */
    private isValueEnabled;
    /**
     * @private
     */
    private isPercentageEnabled;
    /**
     * @private
     */
    private showLeaderLines;
    /**
     * @private
     */
    /**
    * @private
    */
    labelPosition: string;
    /**
     * @private
     */
    /**
    * @private
    */
    fontName: string;
    /**
     * @private
     */
    /**
    * @private
    */
    fontColor: string;
    /**
     * @private
     */
    /**
    * @private
    */
    fontSize: number;
    /**
     * @private
     */
    /**
    * @private
    */
    isLegendKey: boolean;
    /**
     * @private
     */
    /**
    * @private
    */
    isBubbleSize: boolean;
    /**
     * @private
     */
    /**
    * @private
    */
    isCategoryName: boolean;
    /**
     * @private
     */
    /**
    * @private
    */
    isSeriesName: boolean;
    /**
     * @private
     */
    /**
    * @private
    */
    isValue: boolean;
    /**
     * @private
     */
    /**
    * @private
    */
    isPercentage: boolean;
    /**
     * @private
     */
    /**
    * @private
    */
    isLeaderLines: boolean;
    /**
     * @private
     */
    clone(): ChartDataLabels;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export declare class ChartTrendLines {
    /**
     * @private
     */
    private type;
    /**
     * @private
     */
    private name;
    /**
     * @private
     */
    private backward;
    /**
     * @private
     */
    private forward;
    /**
     * @private
     */
    private intercept;
    /**
     * @private
     */
    private displayRSquared;
    /**
     * @private
     */
    private displayEquation;
    /**
     * @private
     */
    /**
    * @private
    */
    trendLineType: string;
    /**
     * @private
     */
    /**
    * @private
    */
    trendLineName: string;
    /**
     * @private
     */
    /**
    * @private
    */
    interceptValue: number;
    /**
     * @private
     */
    /**
    * @private
    */
    forwardValue: number;
    /**
     * @private
     */
    /**
    * @private
    */
    backwardValue: number;
    /**
     * @private
     */
    /**
    * @private
    */
    isDisplayRSquared: boolean;
    /**
     * @private
     */
    /**
    * @private
    */
    isDisplayEquation: boolean;
    /**
     * @private
     */
    clone(): ChartTrendLines;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export declare class ChartTitleArea {
    /**
     * @private
     */
    private fontName;
    /**
     * @private
     */
    private fontSize;
    /**
     * @private
     */
    dataFormat: ChartDataFormat;
    /**
     * @private
     */
    layout: ChartLayout;
    /**
     * @private
     */
    /**
    * @private
    */
    chartfontName: string;
    /**
     * @private
     */
    /**
    * @private
    */
    chartFontSize: number;
    /**
     * @private
     */
    constructor();
    /**
     * @private
     */
    clone(): ChartTitleArea;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export declare class ChartDataFormat {
    /**
     * @private
     */
    line: ChartFill;
    /**
     * @private
     */
    fill: ChartFill;
    /**
     * @private
     */
    constructor();
    /**
     * @private
     */
    clone(): ChartDataFormat;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export declare class ChartFill {
    /**
     * @private
     */
    private fillColor;
    /**
     * @private
     */
    private fillRGB;
    /**
     * @private
     */
    /**
    * @private
    */
    color: string;
    /**
     * @private
     */
    /**
    * @private
    */
    rgb: string;
    /**
     * @private
     */
    clone(): ChartFill;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export declare class ChartLayout {
    /**
     * @private
     */
    private layoutX;
    /**
     * @private
     */
    private layoutY;
    /**
     * @private
     */
    /**
    * @private
    */
    chartLayoutLeft: number;
    /**
     * @private
     */
    /**
    * @private
    */
    chartLayoutTop: number;
    /**
     * @private
     */
    clone(): ChartLayout;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export declare class ChartCategoryAxis {
    /**
     * @private
     */
    private title;
    /**
     * @private
     */
    private fontSize;
    /**
     * @private
     */
    private fontName;
    /**
     * @private
     */
    private categoryType;
    /**
     * @private
     */
    private numberFormat;
    /**
     * @private
     */
    chartTitleArea: ChartTitleArea;
    /**
     * @private
     */
    private hasMajorGridLines;
    /**
     * @private
     */
    private hasMinorGridLines;
    /**
     * @private
     */
    private majorTickMark;
    /**
     * @private
     */
    private minorTickMark;
    /**
     * @private
     */
    private tickLabelPostion;
    /**
     * @private
     */
    private majorUnit;
    /**
     * @private
     */
    private minimumValue;
    /**
     * @private
     */
    private maximumValue;
    /**
     * @private
     */
    /**
    * @private
    */
    majorTick: string;
    /**
     * @private
     */
    /**
    * @private
    */
    minorTick: string;
    /**
     * @private
     */
    /**
    * @private
    */
    tickPosition: string;
    /**
     * @private
     */
    /**
    * @private
    */
    minorGridLines: boolean;
    /**
     * @private
     */
    /**
    * @private
    */
    majorGridLines: boolean;
    /**
     * @private
     */
    /**
    * @private
    */
    interval: number;
    /**
     * @private
     */
    /**
    * @private
    */
    max: number;
    /**
     * @private
     */
    /**
    * @private
    */
    min: number;
    /**
     * @private
     */
    /**
    * @private
    */
    categoryAxisTitle: string;
    /**
     * @private
     */
    /**
    * @private
    */
    categoryAxisType: string;
    /**
     * @private
     */
    /**
    * @private
    */
    categoryNumberFormat: string;
    /**
     * @private
     */
    /**
    * @private
    */
    axisFontSize: number;
    /**
     * @private
     */
    /**
    * @private
    */
    axisFontName: string;
    constructor();
    /**
     * @private
     */
    clone(): ChartCategoryAxis;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export declare class ChartDataTable {
    /**
     * @private
     */
    private isSeriesKeys;
    /**
     * @private
     */
    private isHorzBorder;
    /**
     * @private
     */
    private isVertBorder;
    /**
     * @private
     */
    private isBorders;
    /**
     * @private
     */
    /**
    * @private
    */
    showSeriesKeys: boolean;
    /**
     * @private
     */
    /**
    * @private
    */
    hasHorzBorder: boolean;
    /**
     * @private
     */
    /**
    * @private
    */
    hasVertBorder: boolean;
    /**
     * @private
     */
    /**
    * @private
    */
    hasBorders: boolean;
    /**
     * @private
     */
    clone(): ChartDataTable;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export declare class CommentCharacterElementBox extends ElementBox {
    commentType: number;
    commentId: string;
    private commentInternal;
    commentMark: HTMLElement;
    comment: CommentElementBox;
    getLength(): number;
    clone(): ElementBox;
    constructor(type: number);
    renderCommentMark(): void;
    selectComment(): void;
    removeCommentMark(): void;
    destroy(): void;
}
/**
 * @private
 */
export declare class CommentElementBox extends CommentCharacterElementBox {
    private commentStartIn;
    private commentEndIn;
    private createdDate;
    private authorIn;
    private initialIn;
    private done;
    private textIn;
    replyComments: CommentElementBox[];
    isReply: boolean;
    ownerComment: CommentElementBox;
    commentStart: CommentCharacterElementBox;
    commentEnd: CommentCharacterElementBox;
    author: string;
    initial: string;
    isResolved: boolean;
    readonly date: string;
    text: string;
    constructor(date: string);
    getLength(): number;
    clone(): ElementBox;
    destroy(): void;
}
/**
 * @private
 */
export declare class Page {
    /**
     * Specifies the Viewer
     * @private
     */
    documentHelper: DocumentHelper;
    /**
     * Specifies the Bonding Rectangle
     * @private
     */
    boundingRectangle: Rect;
    /**
     * @private
     */
    repeatHeaderRowTableWidget: boolean;
    /**
     * Specifies the bodyWidgets
     * @default []
     * @private
     */
    bodyWidgets: BodyWidget[];
    /**
     * @private
     */
    headerWidget: HeaderFooterWidget;
    /**
     * @private
     */
    footerWidget: HeaderFooterWidget;
    /**
     * @private
     */
    currentPageNum: number;
    /**
     *
     */
    allowNextPageRendering: boolean;
    /**
     * @private
     */
    readonly index: number;
    /**
     * @private
     */
    readonly previousPage: Page;
    /**
     * @private
     */
    readonly nextPage: Page;
    /**
     * @private
     */
    readonly sectionIndex: number;
    /**
     * Initialize the constructor of Page
     */
    constructor(documentHelper: DocumentHelper);
    readonly viewer: LayoutViewer;
    destroy(): void;
}
/**
 * @private
 */
export declare class WTableHolder {
    private tableColumns;
    /**
     * @private
     */
    tableWidth: number;
    readonly columns: WColumn[];
    /**
     * @private
     */
    resetColumns(): void;
    /**
     * @private
     */
    getPreviousSpannedCellWidth(previousColumnIndex: number, curColumnIndex: number): number;
    /**
     * @private
     */
    addColumns(currentColumnIndex: number, columnSpan: number, width: number, sizeInfo: ColumnSizeInfo, offset: number): void;
    /**
     * @private
     */
    getTotalWidth(type: number): number;
    /**
     * @private
     */
    isFitColumns(containerWidth: number, preferredTableWidth: number, isAutoWidth: boolean): boolean;
    /**
     * @private
     */
    autoFitColumn(containerWidth: number, preferredTableWidth: number, isAuto: boolean, isNestedTable: boolean): void;
    /**
     * @private
     */
    fitColumns(containerWidth: number, preferredTableWidth: number, isAutoWidth: boolean, indent?: number): void;
    /**
     * @private
     */
    getCellWidth(columnIndex: number, columnSpan: number, preferredTableWidth: number): number;
    /**
     * @private
     */
    validateColumnWidths(): void;
    /**
     * @private
     */
    clone(): WTableHolder;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export declare class WColumn {
    /**
     * @private
     */
    preferredWidth: number;
    /**
     * @private
     */
    minWidth: number;
    /**
     * @private
     */
    maxWidth: number;
    /**
     * @private
     */
    endOffset: number;
    /**
     * @private
     */
    minimumWordWidth: number;
    /**
     * @private
     */
    maximumWordWidth: number;
    /**
     * @private
     */
    minimumWidth: number;
    /**
     * @private
     */
    clone(): WColumn;
    /**
     * @private
     */
    destroy(): void;
}
/**
 * @private
 */
export declare class ColumnSizeInfo {
    /**
     * @private
     */
    minimumWordWidth: number;
    /**
     * @private
     */
    maximumWordWidth: number;
    /**
     * @private
     */
    minimumWidth: number;
    /**
     * @private
     */
    hasMinimumWidth: boolean;
    /**
     * @private
     */
    hasMinimumWordWidth: boolean;
    /**
     * @private
     */
    hasMaximumWordWidth: boolean;
}
