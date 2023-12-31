import { ListLevelPattern } from '../../base/types';
import { WBorder, WBorders, WListFormat } from '../format/index';
import { WList } from '../list/list';
import { WListLevel } from '../list/list-level';
import { BlockWidget, BodyWidget, CommentElementBox, HeaderFooterWidget, LineWidget, Page, ParagraphWidget, Rect, TableCellWidget, TableRowWidget, TableWidget, TextElementBox, Widget } from './page';
import { DocumentHelper, LayoutViewer, PageLayoutViewer } from './viewer';
import { Revision } from '../track-changes/track-changes';
/**
 * @private
 */
export declare class Layout {
    private documentHelper;
    private value;
    /**
     * @private
     */
    allowLayout: boolean;
    /**
     * @private
     */
    isRelayout: boolean;
    isInitialLoad: boolean;
    private fieldBegin;
    private maxTextHeight;
    private maxBaseline;
    private maxTextBaseline;
    private isFieldCode;
    private isRtlFieldCode;
    private isRTLLayout;
    /**
     * @private
     */
    isBidiReLayout: boolean;
    /**
     * @private
     */
    defaultTabWidthPixel: number;
    private isSameStyle;
    /**
     * documentHelper definition
     */
    constructor(documentHelper: DocumentHelper);
    readonly viewer: LayoutViewer;
    /**
     * @private
     */
    layout(): void;
    /**
     * Releases un-managed and - optionally - managed resources.
     */
    destroy(): void;
    /**
     * Layouts the items
     * @private
     */
    layoutItems(sections: BodyWidget[], isReLayout: boolean): void;
    /**
     * Layouts the comments
     * @param comments
     * @private
     */
    layoutComments(comments: CommentElementBox[]): void;
    /**
     * Layouts the items
     * @param section
     * @param viewer
     * @private
     */
    layoutSection(section: BodyWidget, index: number, viewer: LayoutViewer, ownerWidget?: Widget): void;
    /**
     * Layouts the header footer items
     * @param section
     * @param viewer
     * @private
     */
    layoutHeaderFooter(section: BodyWidget, viewer: PageLayoutViewer, page: Page): void;
    /**
     * @private
     */
    updateHeaderFooterToParent(node: HeaderFooterWidget): HeaderFooterWidget;
    /**
     * @private
     */
    updateRevisionsToHeaderFooter(clone: HeaderFooterWidget, page: Page): any;
    /**
     * @private
     */
    updateRevisionRange(revision: Revision, page: Page): any;
    private linkFieldInHeaderFooter;
    /**
     * @private
     */
    linkFieldInParagraph(widget: ParagraphWidget): void;
    /**
     * @private
     */
    linkFieldInTable(widget: TableWidget): void;
    /**
     * Layouts the header footer items.
     * @param viewer
     * @param hfModule
     * @private
     */
    layoutHeaderFooterItems(viewer: LayoutViewer, widget: HeaderFooterWidget): HeaderFooterWidget;
    /**
     * Shifts the child location
     * @param shiftTop
     * @param bodyWidget
     */
    private shiftChildLocation;
    /**
     * Shifts the child location for table widget.
     * @param tableWidget
     * @param shiftTop
     */
    private shiftChildLocationForTableWidget;
    /**
     * Shifts the child location for table row widget.
     * @param rowWidget
     * @param shiftTop
     */
    private shiftChildLocationForTableRowWidget;
    /**
     * Shifts the child location for table cell widget.
     * @param cellWidget
     * @param shiftTop
     */
    private shiftChildLocationForTableCellWidget;
    /**
     * Layouts specified block.
     * @param block
     * @private
     */
    layoutBlock(block: BlockWidget, index: number, moveToLine?: boolean): BlockWidget;
    /**
     * Adds paragraph widget.
     * @param area
     */
    private addParagraphWidget;
    /**
     * Adds line widget.
     * @param paragraph
     */
    private addLineWidget;
    /**
     * @private
     */
    isFirstElementWithPageBreak(paragraphWidget: ParagraphWidget): boolean;
    /**
     * Layouts specified paragraph.
     * @private
     * @param paragraph
     */
    layoutParagraph(paragraph: ParagraphWidget, lineIndex: number): BlockWidget;
    private clearLineMeasures;
    private moveElementFromNextLine;
    private layoutLine;
    private layoutElement;
    /**
     * Return true if paragraph has valid inline
     * @private
     */
    hasValidElement(paragraph: ParagraphWidget): boolean;
    private updateFieldText;
    private checkLineWidgetWithClientArea;
    private checkAndSplitTabOrLineBreakCharacter;
    private splitTextByConsecutiveLtrAndRtl;
    private isNumberNonReversingCharacter;
    private updateSplittedText;
    /**
     * @private
     */
    moveFromNextPage(line: LineWidget): void;
    private cutClientWidth;
    private layoutFieldCharacters;
    private checkAndUpdateFieldData;
    /**
     * Layouts empty line widget.
     */
    private layoutEmptyLineWidget;
    /**
     * @private
     */
    layoutListItems(paragraph: ParagraphWidget): void;
    /**
     * Layouts list.
     * @param viewer
     */
    private layoutList;
    /**
     * Adds body widget.
     * @param area
     * @param section
     * @private
     */
    addBodyWidget(area: Rect, widget?: BodyWidget): BodyWidget;
    /**
     * Adds list level.
     * @param abstractList
     */
    private addListLevels;
    private addSplittedLineWidget;
    /**
     * Adds element to line.
     * @param element
     */
    private addElementToLine;
    /**
     * Splits element for client area.
     * @param element
     */
    private splitElementForClientArea;
    /**
     * Splits by word
     * @param elementBox
     * @param text
     * @param width
     * @param characterFormat
     */
    private splitByWord;
    /**
     * Method to include error collection on splitted element
     * @private
     * @param {ElementBox} elementBox
     * @param {ElementBox} splittedBox
     */
    splitErrorCollection(elementBox: TextElementBox, splittedBox: TextElementBox): void;
    /**
     * Splits by character.
     * @param textElement
     * @param text
     * @param width
     * @param characterFormat
     */
    private splitByCharacter;
    private updateRevisionForSpittedElement;
    /**
     * Splits text element word by word.
     * @param textElement
     */
    private splitTextElementWordByWord;
    /**
     * Splits text for client area.
     * @param element
     * @param text
     * @param width
     * @param characterFormat
     */
    private splitTextForClientArea;
    /**
     * Handle tab or line break character splitting
     * @param  {LayoutViewer} viewer
     * @param  {TextElementBox} span
     * @param  {number} index
     * @param  {string} spiltBy
     * @private
     */
    splitByLineBreakOrTab(viewer: LayoutViewer, span: TextElementBox, index: number, spiltBy: string): void;
    /**
     * Moves to next line.
     */
    private moveToNextLine;
    private updateLineWidget;
    /**
     * @param viewer
     */
    private moveToNextPage;
    /**
     * Aligns line elements
     * @param element
     * @param topMargin
     * @param bottomMargin
     * @param maxDescent
     * @param addSubWidth
     * @param subWidth
     * @param textAlignment
     * @param whiteSpaceCount
     * @param isLastElement
     */
    private alignLineElements;
    /**
     * Updates widget to page.
     * @param viewer
     * @param block
     * @private
     */
    updateWidgetToPage(viewer: LayoutViewer, paragraphWidget: ParagraphWidget): void;
    /**
     * @private
     */
    shiftFooterChildLocation(widget: HeaderFooterWidget, viewer: LayoutViewer): void;
    /**
     * Checks previous element.
     * @param characterFormat
     */
    private checkPreviousElement;
    /**
     * @private
     */
    clearListElementBox(paragraph: ParagraphWidget): void;
    /**
     * Gets list number.
     * @param listFormat
     * @param document
     * @private
     */
    getListNumber(listFormat: WListFormat, isAutoList?: boolean): string;
    /**
     * Gets list start value
     * @param listLevelNumber
     * @param list
     * @private
     */
    getListStartValue(listLevelNumber: number, list: WList): number;
    /**
     * Updates list values.
     * @param list
     * @param listLevelNumber
     * @param document
     */
    private updateListValues;
    /**
     * Gets list text
     * @param listAdv
     * @param listLevelNumber
     * @param currentListLevel
     * @param document
     */
    private getListText;
    /**
     * Gets the roman letter.
     * @param number
     * @private
     */
    getAsLetter(number: number): string;
    /**
     * Gets list text using list level pattern.
     * @param listLevel
     * @param listValue
     * @private
     */
    getListTextListLevel(listLevel: WListLevel, listValue: number): string;
    /**
     * Generate roman number for the specified number.
     * @param number
     * @param magnitude
     * @param letter
     */
    private generateNumber;
    /**
     * Gets list value prefixed with zero, if less than 10
     * @param listValue
     */
    private getAsLeadingZero;
    /**
     * Gets the roman number
     * @param number
     * @private
     */
    getAsRoman(number: number): string;
    /**
     * Gets the list level
     * @param list
     * @param listLevelNumber
     * @private
     */
    getListLevel(list: WList, listLevelNumber: number): WListLevel;
    /**
     * Gets tab width
     * @param paragraph
     * @param viewer
     */
    private getTabWidth;
    /**
     * Returns the right tab width
     * @param index - index of starting inline
     * @param lineWidget - current line widget
     * @param paragraph - current paragraph widget
     */
    private getRightTabWidth;
    /**
     * Gets split index by word.
     * @param clientActiveWidth
     * @param text
     * @param width
     * @param characterFormat
     */
    private getSplitIndexByWord;
    /**
     * Gets split index by character
     * @param totalClientWidth
     * @param clientActiveAreaWidth
     * @param text
     * @param width
     * @param characterFormat
     */
    private getTextSplitIndexByCharacter;
    /**
     * Gets sub width.
     * @param justify
     * @param spaceCount
     * @param firstLineIndent
     */
    private getSubWidth;
    /**
     * Gets before spacing.
     * @param paragraph
     * @private
     */
    getBeforeSpacing(paragraph: ParagraphWidget): number;
    getAfterSpacing(paragraph: ParagraphWidget): number;
    /**
     * Gets line spacing.
     * @param paragraph
     * @param maxHeight
     * @private
     */
    getLineSpacing(paragraph: ParagraphWidget, maxHeight: number): number;
    /**
     * Checks whether current line is first line in a paragraph.
     * @param paragraph
     */
    private isParagraphFirstLine;
    /**
     * Checks whether current line is last line in a paragraph.
     * @param paragraph
     */
    private isParagraphLastLine;
    /**
     * Gets text index after space.
     * @param text
     * @param startIndex
     */
    private getTextIndexAfterSpace;
    /**
     * @private
     */
    moveNextWidgetsToTable(tableWidget: TableWidget[], rowWidgets: TableRowWidget[], moveFromNext: boolean): void;
    /**
     * Adds table cell widget.
     * @param cell
     * @param area
     * @param maxCellMarginTop
     * @param maxCellMarginBottom
     */
    private addTableCellWidget;
    /**
     * Adds specified row widget to table.
     * @param viewer
     * @param tableRowWidget
     * @param row
     */
    private addWidgetToTable;
    /**
     * Updates row height by spanned cell.
     * @param tableWidget
     * @param rowWidget
     * @param insertIndex
     * @param row
     * @private
     */
    updateRowHeightBySpannedCell(tableWidget: TableWidget, row: TableRowWidget, insertIndex: number): void;
    /**
     * Updates row height.
     * @param prevRowWidget
     * @param rowWidget
     * @param row
     */
    private updateRowHeight;
    private updateSpannedRowCollection;
    /**
     * Updates row height by cell spacing
     * @param rowWidget
     * @param viewer
     * @param row
     */
    private updateRowHeightByCellSpacing;
    /**
     * Checks whether row span is end.
     * @param row
     * @param viewer
     */
    private isRowSpanEnd;
    /**
     * Checks whether vertical merged cell to continue or not.
     * @param row
     * @private
     */
    isVerticalMergedCellContinue(row: TableRowWidget): boolean;
    /**
     * Splits widgets.
     * @param tableRowWidget
     * @param viewer
     * @param splittedWidget
     * @param row
     */
    private splitWidgets;
    /**
     * Gets splitted widget for row.
     * @param bottom
     * @param tableRowWidget
     */
    private getSplittedWidgetForRow;
    /**
     * Updates widget to table.
     * @param row
     * @param viewer
     */
    updateWidgetsToTable(tableWidgets: TableWidget[], rowWidgets: TableRowWidget[], row: TableRowWidget): void;
    /**
     * Gets header.
     * @param table
     * @private
     */
    getHeader(table: TableWidget): TableRowWidget;
    /**
     * Gets header height.
     * @param ownerTable
     * @param row
     */
    private getHeaderHeight;
    /**
     * Updates widgets to row.
     * @param cell
     */
    private updateWidgetToRow;
    /**
     * Updates height for row widget.
     * @param viewer
     * @param isUpdateVerticalPosition
     * @param rowWidget
     */
    private updateHeightForRowWidget;
    /**
     * Updates height for cell widget.
     * @param viewer
     * @param cellWidget
     */
    private updateHeightForCellWidget;
    /**
     * Gets row height.
     * @param row
     * @private
     */
    getRowHeight(row: TableRowWidget, rowCollection: TableRowWidget[]): number;
    /**
     * splits spanned cell widget.
     * @param cellWidget
     * @param viewer
     */
    private splitSpannedCellWidget;
    /**
     * Inserts splitted cell widgets.
     * @param viewer
     * @param rowWidget
     */
    private insertSplittedCellWidgets;
    /**
     * Inserts spanned row widget.
     * @param rowWidget
     * @param viewer
     * @param left
     * @param index
     */
    private insertRowSpannedWidget;
    /**
     * Inserts empty splitted cell widgets.
     * @param rowWidget
     * @param left
     * @param index
     */
    private insertEmptySplittedCellWidget;
    /**
     * Gets spllited widget.
     * @param bottom
     * @param splitMinimalWidget
     * @param cellWidget
     */
    private getSplittedWidget;
    /**
     * Gets list level pattern
     * @param value
     * @private
     */
    getListLevelPattern(value: number): ListLevelPattern;
    /**
     * Creates cell widget.
     * @param cell
     */
    private createCellWidget;
    /**
     * Create Table Widget
     */
    private createTableWidget;
    /**
     * Gets splitted widget for paragraph.
     * @param bottom
     * @param paragraphWidget
     */
    private getSplittedWidgetForPara;
    /**
     * Gets splitted table widget.
     * @param bottom
     * @param tableWidget
     * @private
     */
    getSplittedWidgetForTable(bottom: number, tableCollection: TableWidget[], tableWidget: TableWidget): TableWidget;
    /**
     * Checks whether first line fits for paragraph or not.
     * @param bottom
     * @param paraWidget
     */
    private isFirstLineFitForPara;
    /**
     * Checks whether first line fits for table or not.
     * @param bottom
     * @param tableWidget
     * @private
     */
    isFirstLineFitForTable(bottom: number, tableWidget: TableWidget): boolean;
    /**
     * Checks whether first line fits for row or not.
     * @param bottom
     * @param rowWidget
     */
    private isFirstLineFitForRow;
    /**
     * Checks whether first line fits for cell or not.
     * @param bottom
     * @param cellWidget
     */
    private isFirstLineFitForCell;
    /**
     * Updates widget location.
     * @param widget
     * @param table
     */
    private updateWidgetLocation;
    /**
     * Updates child location for table.
     * @param top
     * @param tableWidget
     * @private
     */
    updateChildLocationForTable(top: number, tableWidget: TableWidget): void;
    /**
     * Updates child location for row.
     * @param top
     * @param rowWidget
     * @private
     */
    updateChildLocationForRow(top: number, rowWidget: TableRowWidget): void;
    /**
     * Updates child location for cell.
     * @param top
     * @param cellWidget
     */
    private updateChildLocationForCell;
    /**
     * Updates cell vertical position.
     * @param cellWidget
     * @param isUpdateToTop
     * @param isInsideTable
     * @private
     */
    updateCellVerticalPosition(cellWidget: TableCellWidget, isUpdateToTop: boolean, isInsideTable: boolean): void;
    /**
     * Updates cell content vertical position.
     * @param cellWidget
     * @param displacement
     * @param isUpdateToTop
     */
    private updateCellContentVerticalPosition;
    /**
     * Updates table widget location.
     * @param tableWidget
     * @param location
     * @param isUpdateToTop
     */
    private updateTableWidgetLocation;
    /**
     * Gets displacement.
     * @param cellWidget
     * @param isUpdateToTop
     */
    private getDisplacement;
    /**
     * Gets cell content height.
     * @param cellWidget
     */
    private getCellContentHeight;
    /**
     * Gets table left borders.
     * @param borders
     * @private
     */
    getTableLeftBorder(borders: WBorders): WBorder;
    /**
     * Gets table right border.
     * @param borders
     * @private
     */
    getTableRightBorder(borders: WBorders): WBorder;
    /**
     * Get table top border.
     * @param borders
     * @private
     */
    getTableTopBorder(borders: WBorders): WBorder;
    /**
     * Gets table bottom border.
     * @param borders
     * @private
     */
    getTableBottomBorder(borders: WBorders): WBorder;
    /**
     * Get diagonal cell up border.
     * @param tableCell
     * @private
     */
    getCellDiagonalUpBorder(tableCell: TableCellWidget): WBorder;
    /**
     * Gets diagonal cell down border
     * @param tableCell
     * @private
     */
    getCellDiagonalDownBorder(tableCell: TableCellWidget): WBorder;
    /**
     * Gets table width.
     * @param table
     * @private
     */
    getTableWidth(table: TableWidget): number;
    /**
     * @private
     */
    layoutNextItemsBlock(blockAdv: BlockWidget, viewer: LayoutViewer): void;
    /**
     * @private
     */
    updateClientAreaForLine(paragraph: ParagraphWidget, startLineWidget: LineWidget, elementIndex: number): void;
    /**
     * @private
     */
    getParentTable(block: BlockWidget): TableWidget;
    /**
     * @private
     */
    reLayoutParagraph(paragraphWidget: ParagraphWidget, lineIndex: number, elementBoxIndex: number, isBidi?: boolean, isSkip?: boolean): void;
    /**
     * @private
     */
    reLayoutTable(block: BlockWidget): void;
    /**
     * @private
     */
    clearTableWidget(table: TableWidget, clearPosition: boolean, clearHeight: boolean, clearGrid?: boolean): void;
    /**
     * @private
     */
    clearRowWidget(row: TableRowWidget, clearPosition: boolean, clearHeight: boolean, clearGrid: boolean): void;
    /**
     * @private
     */
    clearCellWidget(cell: TableCellWidget, clearPosition: boolean, clearHeight: boolean, clearGrid: boolean): void;
    /**
     * @param blockIndex
     * @param bodyWidget
     * @param block
     * @private
     */
    layoutBodyWidgetCollection(blockIndex: number, bodyWidget: Widget, block: BlockWidget, shiftNextWidget: boolean, isSkipShifting?: boolean): void;
    private checkAndGetBlock;
    /**
     * Layouts table.
     * @param table
     * @private
     */
    layoutTable(table: TableWidget, startIndex: number): BlockWidget;
    /**
     * Adds table widget.
     * @param area
     * @param table
     * @private
     */
    addTableWidget(area: Rect, table: TableWidget[], create?: boolean): TableWidget;
    /**
     * Updates widget to page.
     * @param table
     * @private
     */
    updateWidgetsToPage(tables: TableWidget[], rows: TableRowWidget[], table: TableWidget, endRowWidget?: TableRowWidget): void;
    /**
     * Updates height for table widget.
     * @param viewer
     * @param tableWidget
     * @private
     */
    updateHeightForTableWidget(tables: TableWidget[], rows: TableRowWidget[], tableWidget: TableWidget, endRowWidget?: TableRowWidget): void;
    /**
     * Layouts table row.
     * @param row
     * @private
     */
    layoutRow(tableWidget: TableWidget[], row: TableRowWidget): TableRowWidget;
    /**
     * @param area
     * @param row
     */
    private addTableRowWidget;
    /**
     * Gets maximum top cell margin.
     * @param row
     * @param topOrBottom
     */
    private getMaxTopCellMargin;
    /**
     * Gets maximum bottom cell margin.
     * @param row
     * @param topOrBottom
     */
    private getMaxBottomCellMargin;
    /**
     * Layouts cell
     * @param cell
     * @param maxCellMarginTop
     * @param maxCellMarginBottom
     */
    private layoutCell;
    /**
     * @private
     */
    shiftLayoutedItems(): void;
    /**
     * @private
     */
    updateFieldElements(): void;
    private reLayoutOrShiftWidgets;
    private shiftWidgetsBlock;
    private shiftWidgetsForPara;
    /**
     * @private
     */
    shiftTableWidget(table: TableWidget, viewer: LayoutViewer): TableWidget;
    /**
     * @private
     */
    shiftRowWidget(tables: TableWidget[], row: TableRowWidget): TableRowWidget;
    /**
     * @private
     */
    shiftCellWidget(cell: TableCellWidget, maxCellMarginTop: number, maxCellMarginBottom: number): void;
    /**
     * @private
     */
    shiftParagraphWidget(paragraph: ParagraphWidget): void;
    private shiftWidgetsForTable;
    private updateVerticalPositionToTop;
    private splitWidget;
    private getMaxElementHeight;
    private createOrGetNextBodyWidget;
    private isFitInClientArea;
    private shiftToPreviousWidget;
    private updateParagraphWidgetInternal;
    private shiftNextWidgets;
    /**
     * @private
     */
    updateContainerWidget(widget: Widget, bodyWidget: BodyWidget, index: number, destroyAndScroll: boolean): void;
    private getBodyWidgetOfPreviousBlock;
    /**
     * @private
     */
    moveBlocksToNextPage(block: BlockWidget): BodyWidget;
    private createSplitBody;
    /**
     * Relayout Paragraph from specified line widget
     * @param paragraph Paragraph to reLayout
     * @param lineIndex start line index to reLayout
     * @private
     */
    reLayoutLine(paragraph: ParagraphWidget, lineIndex: number, isBidi: boolean, isSkip?: boolean): void;
    isContainsRtl(lineWidget: LineWidget): boolean;
    reArrangeElementsForRtl(line: LineWidget, isParaBidi: boolean): void;
    private shiftLayoutFloatingItems;
    private getFloatingItemPoints;
    private getLeftMarginHorizPosition;
    private getRightMarginHorizPosition;
    private getVerticalPosition;
    private getHorizontalPosition;
}
