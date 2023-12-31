import { DocumentEditor } from '../../document-editor';
import { IWidget, Widget, BodyWidget, TableRowWidget, TableWidget, LineWidget, ListTextElementBox, Page, ParagraphWidget, TableCellWidget, FieldElementBox, BlockWidget, HeaderFooterWidget, BlockContainer, ElementBox, EditRangeStartElementBox, CommentElementBox, ShapeElementBox, TextFrame } from '../viewer/page';
import { ElementInfo, CaretHeightInfo, IndexInfo, SizeInfo, FirstElementInfo, HyperlinkTextInfo, LineInfo, Point, ShapeInfo } from '../editor/editor-helper';
import { SelectionCharacterFormat, SelectionCellFormat, SelectionParagraphFormat, SelectionRowFormat, SelectionSectionFormat, SelectionTableFormat, SelectionImageFormat } from './selection-format';
import { LayoutViewer, WListLevel } from '../index';
import { Dictionary } from '../../base/dictionary';
import { HighlightColor, Strikethrough, Underline, TextAlignment, FormFieldType } from '../../base/index';
import { TextPositionInfo, PositionInfo, ParagraphInfo } from '../editor/editor-helper';
import { WCharacterFormat, WParagraphFormat } from '../index';
import { HtmlExport } from '../writer/html-export';
import { ContextType } from '../../index';
import { TextPosition, SelectionWidgetInfo, ImageFormat } from './selection-helper';
import { MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { Revision } from '../track-changes/track-changes';
/**
 * Selection
 */
export declare class Selection {
    /**
     * @private
     */
    owner: DocumentEditor;
    /**
     * @private
     */
    upDownSelectionLength: number;
    /**
     * @private
     */
    isSkipLayouting: boolean;
    /**
     * @private
     */
    isImageSelected: boolean;
    private documentHelper;
    private contextTypeInternal;
    /**
     * @private
     */
    caret: HTMLDivElement;
    /**
     * @private
     */
    isRetrieveFormatting: boolean;
    private characterFormatIn;
    private paragraphFormatIn;
    private sectionFormatIn;
    private tableFormatIn;
    private cellFormatIn;
    private rowFormatIn;
    private imageFormatInternal;
    /**
     * @private
     */
    skipFormatRetrieval: boolean;
    private startInternal;
    private endInternal;
    private htmlWriterIn;
    private toolTipElement;
    private toolTipObject;
    private toolTipField;
    private isMoveDownOrMoveUp;
    private pasteDropDwn;
    /**
     * @private
     */
    pasteElement: HTMLElement;
    /**
     * @private
     */
    isViewPasteOptions: boolean;
    /**
     * @private
     */
    skipEditRangeRetrieval: boolean;
    /**
     * @private
     */
    editPosition: string;
    /**
     * @private
     */
    selectedWidgets: Dictionary<IWidget, object>;
    /**
     * @private
     */
    isHighlightEditRegionIn: boolean;
    /**
     * @private
     */
    private isHighlightFormFields;
    /**
     * @private
     */
    editRangeCollection: EditRangeStartElementBox[];
    /**
     * @private
     */
    isHightlightEditRegionInternal: boolean;
    /**
     * @private
     */
    isCurrentUser: boolean;
    /**
     * @private
     */
    isHighlightNext: boolean;
    /**
     * @private
     */
    hightLightNextParagraph: BlockWidget;
    /**
     * @private
     */
    isWebLayout: boolean;
    /**
     * @private
     */
    editRegionHighlighters: Dictionary<LineWidget, SelectionWidgetInfo[]>;
    /**
     * @private
     */
    formFieldHighlighters: Dictionary<LineWidget, SelectionWidgetInfo[]>;
    private isSelectList;
    /**
     * @private
     */
    previousSelectedFormField: FieldElementBox;
    /**
     * @private
     */
    isFormatUpdated: boolean;
    /**
     * @private
     */
    /**
    * @private
    */
    isHighlightEditRegion: boolean;
    /**
     * @private
     */
    readonly htmlWriter: HtmlExport;
    /**
     * Gets the start text position of last range in the selection
     * @returns {TextPosition}
     * @private
     */
    /**
    * @private
    */
    start: TextPosition;
    /**
     * Gets the instance of selection character format.
     * @default undefined
     * @aspType SelectionCharacterFormat
     * @blazorType SelectionCharacterFormat
     * @return {SelectionCharacterFormat}
     */
    readonly characterFormat: SelectionCharacterFormat;
    /**
     * Gets the instance of selection paragraph format.
     * @default undefined
     * @aspType SelectionParagraphFormat
     * @blazorType SelectionParagraphFormat
     * @return {SelectionParagraphFormat}
     */
    readonly paragraphFormat: SelectionParagraphFormat;
    /**
     * Gets the instance of selection section format.
     * @default undefined
     * @aspType SelectionSectionFormat
     * @blazorType SelectionSectionFormat
     * @return {SelectionSectionFormat}
     */
    readonly sectionFormat: SelectionSectionFormat;
    /**
     * Gets the instance of selection table format.
     * @default undefined
     * @aspType SelectionTableFormat
     * @blazorType SelectionTableFormat
     * @return {SelectionTableFormat}
     */
    readonly tableFormat: SelectionTableFormat;
    /**
     * Gets the instance of selection cell format.
     * @default undefined
     * @aspType SelectionCellFormat
     * @blazorType SelectionCellFormat
     * @return {SelectionCellFormat}
     */
    readonly cellFormat: SelectionCellFormat;
    /**
     * Gets the instance of selection row format.
     * @default undefined
     * @aspType SelectionRowFormat
     * @blazorType SelectionRowFormat
     * @returns {SelectionRowFormat}
     */
    readonly rowFormat: SelectionRowFormat;
    /**
     * Gets the instance of selection image format.
     * @default undefined
     * @aspType SelectionImageFormat
     * @blazorType SelectionImageFormat
     * @returns {SelectionImageFormat}
     */
    readonly imageFormat: SelectionImageFormat;
    /**
     * Gets the start text position of selection range.
     * @private
     */
    /**
    * For internal use
    * @private
    */
    end: TextPosition;
    /**
     * Gets the page number where the selection ends.
     */
    readonly startPage: number;
    /**
     * Gets the page number where the selection ends.
     */
    readonly endPage: number;
    /**
     * Determines whether the selection direction is forward or not.
     * @default false
     * @returns {boolean}
     * @private
     */
    readonly isForward: boolean;
    /**
     * Determines whether the start and end positions are same or not.
     * @default false
     * @returns {boolean}
     * @private
     */
    readonly isEmpty: boolean;
    /**
     * Returns start hierarchical index.
     */
    readonly startOffset: string;
    /**
     * Returns end hierarchical index.
     */
    readonly endOffset: string;
    /**
     * @private
     */
    readonly isInShape: boolean;
    /**
     * Gets the text within selection.
     * @default ''
     * @aspType string
     * @blazorType string
     * @returns {string}
     */
    readonly text: string;
    /**
     * Gets the context type of the selection.
     */
    readonly contextType: ContextType;
    /**
     * Gets bookmark name collection.
     */
    readonly bookmarks: string[];
    /**
     * Gets the bookmark name collection in current selection
     * @param includeHidden - Decide whether to include hidden bookmark name in current selection or not.
     */
    getBookmarks(includeHidden?: boolean): string[];
    /**
     * @private
     */
    readonly isCleared: boolean;
    /**
     * Returns true if selection is in field
     */
    readonly isInField: boolean;
    /**
     * @private
     */
    constructor(documentEditor: DocumentEditor);
    private getSelBookmarks;
    readonly viewer: LayoutViewer;
    private getModuleName;
    private checkLayout;
    /**
     * Moves the selection to the header of current page.
     */
    goToHeader(): void;
    /**
     * Moves the selection to the footer of current page.
     */
    goToFooter(): void;
    /**
     * Closes the header and footer region.
     */
    closeHeaderFooter(): void;
    /**
     * Moves the selection to the start of specified page number.
     */
    goToPage(pageNumber: number): void;
    /**
     * Selects the entire table if the context is within table.
     */
    selectTable(): void;
    /**
     * Selects the entire row if the context is within table.
     */
    selectRow(): void;
    /**
     * Selects the entire column if the context is within table.
     */
    selectColumn(): void;
    /**
     * Selects the entire cell if the context is within table.
     */
    selectCell(): void;
    /**
     * Selects content based on selection settings
     */
    select(selectionSettings: SelectionSettings): void;
    /**
     * Selects content based on start and end hierarchical index.
     * @param start start hierarchical index.
     * @param end end hierarchical index.
     */
    select(start: string, end: string): void;
    /**
     * Selects based on start and end hierarchical index.
     */
    selectByHierarchicalIndex(start: string, end: string): void;
    /**
     * Select the current field if selection is in field
     */
    selectField(fieldStart?: FieldElementBox): void;
    /**
     * @private
     */
    selectFieldInternal(fieldStart: FieldElementBox): void;
    /**
     * @private
     */
    selectShape(shape: ShapeElementBox): void;
    /**
     * Toggles the bold property of selected contents.
     * @private
     */
    toggleBold(): void;
    /**
     * Toggles the italic property of selected contents.
     * @private
     */
    toggleItalic(): void;
    /**
     * Toggles the underline property of selected contents.
     * @param underline Default value of ‘underline’ parameter is Single.
     * @private
     */
    toggleUnderline(underline?: Underline): void;
    /**
     * Toggles the strike through property of selected contents.
     * @param {Strikethrough} strikethrough Default value of strikethrough parameter is SingleStrike.
     * @private
     */
    toggleStrikethrough(strikethrough?: Strikethrough): void;
    /**
     * Toggles the highlight color property of selected contents.
     * @param {HighlightColor} highlightColor Default value of ‘underline’ parameter is Yellow.
     * @private
     */
    toggleHighlightColor(highlightColor?: HighlightColor): void;
    /**
     * Toggles the subscript formatting of selected contents.
     * @private
     */
    toggleSubscript(): void;
    /**
     * Toggles the superscript formatting of selected contents.
     * @private
     */
    toggleSuperscript(): void;
    /**
     * Toggles the text alignment property of selected contents.
     * @param {TextAlignment} textAlignment Default value of ‘textAlignment parameter is TextAlignment.Left.
     * @private
     */
    toggleTextAlignment(textAlignment: TextAlignment): void;
    /**
     * Increases the left indent of selected paragraphs to a factor of 36 points.
     * @private
     */
    increaseIndent(): void;
    /**
     * Decreases the left indent of selected paragraphs to a factor of 36 points.
     * @private
     */
    decreaseIndent(): void;
    /**
     * Fires the `requestNavigate` event if current selection context is in hyperlink.
     */
    navigateHyperlink(): void;
    /**
     * Navigate Hyperlink
     * @param fieldBegin
     * @private
     */
    fireRequestNavigate(fieldBegin: FieldElementBox): void;
    /**
     * Copies the hyperlink URL if the context is within hyperlink.
     */
    copyHyperlink(): void;
    private isHideSelection;
    /**
     * @private
     */
    highlightSelection(isSelectionChanged: boolean): void;
    /**
     * @private
     */
    createHighlightBorder(lineWidget: LineWidget, width: number, left: number, top: number, isElementBoxHighlight: boolean): void;
    /**
     * @private
     */
    addEditRegionHighlight(lineWidget: LineWidget, left: number, width: number): SelectionWidgetInfo;
    /**
     * @private
     */
    private addFormFieldHighlight;
    /**
     * Create selection highlight inside table
     * @private
     */
    createHighlightBorderInsideTable(cellWidget: TableCellWidget): void;
    /**
     * @private
     */
    clipSelection(page: Page, pageTop: number): void;
    /**
     * Add selection highlight
     * @private
     */
    addSelectionHighlight(canvasContext: CanvasRenderingContext2D, widget: LineWidget, top: number): void;
    /**
     * @private
     */
    private renderDashLine;
    /**
     * Add Selection highlight inside table
     * @private
     */
    addSelectionHighlightTable(canvasContext: CanvasRenderingContext2D, tableCellWidget: TableCellWidget): void;
    /**
     * Remove Selection highlight
     * @private
     */
    removeSelectionHighlight(widget: IWidget): void;
    /**
     * Selects Current word
     */
    selectCurrentWord(excludeSpace?: boolean): void;
    /**
     * Selects current paragraph
     */
    selectParagraph(): void;
    /**
     * Selects current line.
     */
    selectLine(): void;
    /**
     * Moves selection to start of the document.
     */
    moveToDocumentStart(): void;
    /**
     * Moves selection to end of the document.
     */
    moveToDocumentEnd(): void;
    /**
     * Moves selection to current paragraph start.
     */
    moveToParagraphStart(): void;
    /**
     * Moves selection to current paragraph end.
     */
    moveToParagraphEnd(): void;
    /**
     * Moves selection to next line.
     */
    moveToNextLine(): void;
    /**
     * Moves selection to previous line.
     */
    moveToPreviousLine(): void;
    /**
     * Moves selection to next character.
     */
    moveToNextCharacter(): void;
    /**
     * Moves selection to previous character.
     */
    moveToPreviousCharacter(): void;
    /**
     * Select current word range
     * @private
     */
    selectCurrentWordRange(startPosition: TextPosition, endPosition: TextPosition, excludeSpace: boolean): void;
    /**
     * Extends selection to paragraph start.
     */
    extendToParagraphStart(): void;
    /**
     * Extend selection to paragraph end.
     */
    extendToParagraphEnd(): void;
    /**
     * Move to next text position
     * @private
     */
    moveNextPosition(): void;
    /**
     * Move to next paragraph
     * @private
     */
    moveToNextParagraph(): void;
    /**
     * Move to previous text position
     * @private
     */
    movePreviousPosition(): void;
    /**
     * Move to previous paragraph
     * @private
     */
    moveToPreviousParagraph(): void;
    /**
     * Extends selection to previous line.
     */
    extendToPreviousLine(): void;
    /**
     * Extend selection to line end
     */
    extendToLineEnd(): void;
    /**
     * Extends selection to line start.
     */
    extendToLineStart(): void;
    /**
     * @private
     */
    moveUp(): void;
    /**
     * @private
     */
    moveDown(): void;
    private updateForwardSelection;
    private updateBackwardSelection;
    /**
     * @private
     */
    getFirstBlockInFirstCell(table: TableWidget): BlockWidget;
    /**
     * @private
     */
    getFirstCellInRegion(row: TableRowWidget, startCell: TableCellWidget, selectionLength: number, isMovePrevious: boolean): TableCellWidget;
    /**
     * @private
     */
    getFirstParagraph(tableCell: TableCellWidget): ParagraphWidget;
    /**
     * Get last block in last cell
     * @private
     */
    getLastBlockInLastCell(table: TableWidget): BlockWidget;
    /**
     * Moves selection to start of the current line.
     */
    moveToLineStart(): void;
    /**
     * Moves selection to end of the current line.
     */
    moveToLineEnd(): void;
    /**
     * Get Page top
     * @private
     */
    getPageTop(page: Page): number;
    /**
     * Move text position to cursor point
     * @private
     */
    moveTextPosition(cursorPoint: Point, textPosition: TextPosition): void;
    /**
     * Get document start position
     * @private
     */
    getDocumentStart(): TextPosition;
    /**
     * Get document end position
     * @private
     */
    getDocumentEnd(): TextPosition;
    /**
     * @private
     * Handles control end key.
     */
    handleControlEndKey(): void;
    /**
     * @private
     * Handles control home key.
     */
    handleControlHomeKey(): void;
    /**
     * @private
     * Handles control left key.
     */
    handleControlLeftKey(): void;
    /**
     * @private
     * Handles control right key.
     */
    handleControlRightKey(): void;
    /**
     * Handles control down key.
     * @private
     */
    handleControlDownKey(): void;
    /**
     * Handles control up key.
     * @private
     */
    handleControlUpKey(): void;
    /**
     * @private
     * Handles shift left key.
     */
    handleShiftLeftKey(): void;
    /**
     * Handles shift up key.
     * @private
     */
    handleShiftUpKey(): void;
    /**
     * Handles shift right key.
     * @private
     */
    handleShiftRightKey(): void;
    /**
     * Handles shift down key.
     * @private
     */
    handleShiftDownKey(): void;
    /**
     * @private
     * Handles control shift left key.
     */
    handleControlShiftLeftKey(): void;
    /**
     * Handles control shift up key.
     * @private
     */
    handleControlShiftUpKey(): void;
    /**
     * Handles control shift right key
     * @private
     */
    handleControlShiftRightKey(): void;
    /**
     * Handles control shift down key.
     * @private
     */
    handleControlShiftDownKey(): void;
    /**
     * Handles left key.
     * @private
     */
    handleLeftKey(): void;
    /**
     * Handles up key.
     * @private
     */
    handleUpKey(): void;
    /**
     * Handles right key.
     * @private
     */
    handleRightKey(): void;
    /**
     * Handles end key.
     * @private
     */
    handleEndKey(): void;
    /**
     * Handles home key.
     * @private
     */
    handleHomeKey(): void;
    /**
     * Handles down key.
     * @private
     */
    handleDownKey(): void;
    /**
     * Handles shift end key.
     * @private
     */
    handleShiftEndKey(): void;
    /**
     * Handles shift home key.
     * @private
     */
    handleShiftHomeKey(): void;
    /**
     * Handles control shift end key.
     * @private
     */
    handleControlShiftEndKey(): void;
    /**
     * Handles control shift home key.
     * @private
     */
    handleControlShiftHomeKey(): void;
    /**
     * @private
     */
    handleSpaceBarKey(): void;
    /**
     * Handles tab key.
     * @param isNavigateInCell
     * @param isShiftTab
     * @private
     */
    handleTabKey(isNavigateInCell: boolean, isShiftTab: boolean): void;
    private getFormFieldInFormFillMode;
    private selectPrevNextFormField;
    /**
     * @private
     */
    navigateToNextFormField(): void;
    /**
     * @private
     */
    selectTextElementStartOfField(formField: FieldElementBox): void;
    private triggerFormFillEvent;
    private selectPreviousCell;
    private selectNextCell;
    /**
     * Select given table cell
     * @private
     */
    selectTableCellInternal(tableCell: TableCellWidget, clearMultiSelection: boolean): void;
    /**
     * Select while table
     * @private
     */
    private selectTableInternal;
    /**
     * Select single column
     * @private
     */
    selectColumnInternal(): void;
    /**
     * Select single row
     * @private
     */
    selectTableRow(): void;
    /**
     * Select single cell
     * @private
     */
    selectTableCell(): void;
    /**
     * Selects the entire document.
     */
    selectAll(): void;
    /**
     * Extends selection backward.
     */
    extendBackward(): void;
    /**
     * Extends selection forward.
     */
    extendForward(): void;
    /**
     * Extend selection to word start and end
     * @private
     */
    extendToWordStartEnd(): boolean;
    /**
     * Extends selection to word start.
     */
    extendToWordStart(): void;
    /**
     * Extends selection to word end.
     */
    extendToWordEnd(): void;
    /**
     * Extends selection to word start
     * @private
     */
    extendToWordStartInternal(isNavigation: boolean): void;
    /**
     * Extends selection to word end.
     */
    extendToWordEndInternal(isNavigation: boolean): void;
    /**
     * Extend selection to next line.
     */
    extendToNextLine(): void;
    private getTextPosition;
    /**
     * Get Selected text
     * @private
     */
    getText(includeObject: boolean): string;
    /**
     * Get selected text
     * @private
     */
    getTextInternal(start: TextPosition, end: TextPosition, includeObject: boolean): string;
    /**
     * @private
     * @param block
     * @param offset
     */
    getHierarchicalIndex(block: Widget, offset: string): string;
    private getHierarchicalIndexByPosition;
    /**
     * @private
     * Gets logical position.
     */
    getTextPosBasedOnLogicalIndex(hierarchicalIndex: string): TextPosition;
    /**
     * Get offset value to update in selection
     * @private
     */
    getLineInfoBasedOnParagraph(paragraph: ParagraphWidget, offset: number): LineInfo;
    /**
     * @private
     */
    getParagraph(position: IndexInfo): ParagraphInfo;
    /**
     * Gets body widget based on position.
     * @private
     */
    getBodyWidget(position: IndexInfo): BlockContainer;
    private getHeaderFooterWidget;
    /**
     * @private
     */
    getBodyWidgetInternal(sectionIndex: number, blockIndex: number): BodyWidget;
    /**
     * Get paragraph relative to position
     * @private
     */
    private getParagraphInternal;
    /**
     * @private
     */
    getBlockByIndex(container: Widget, blockIndex: number): Widget;
    /**
     * Get logical offset of paragraph.
     * @private
     */
    getParagraphInfo(position: TextPosition): ParagraphInfo;
    /**
     * @private
     */
    getParagraphInfoInternal(line: LineWidget, lineOffset: number): ParagraphInfo;
    /**
     * @private
     */
    getListTextElementBox(paragarph: ParagraphWidget): ListTextElementBox;
    /**
     * @private
     */
    getListLevel(paragraph: ParagraphWidget): WListLevel;
    /**
     * @private
     */
    getTextInline(inlineElement: ElementBox, endParagraphWidget: ParagraphWidget, endInline: ElementBox, endIndex: number, includeObject: boolean): string;
    /**
     * Returns field code.
     * @private
     * @param fieldBegin
     */
    getFieldCode(fieldBegin: FieldElementBox): string;
    private getFieldCodeInternal;
    /**
     * @private
     */
    getTocFieldInternal(): FieldElementBox;
    /**
     * Get next paragraph in bodyWidget
     * @private
     */
    getNextParagraph(section: BodyWidget): ParagraphWidget;
    /**
     * @private
     */
    getPreviousParagraph(section: BodyWidget): ParagraphWidget;
    /**
     * Get first paragraph in cell
     * @private
     */
    getFirstParagraphInCell(cell: TableCellWidget): ParagraphWidget;
    /**
     * Get first paragraph in first cell
     * @private
     */
    getFirstParagraphInFirstCell(table: TableWidget): ParagraphWidget;
    /**
     * Get last paragraph in last cell
     * @private
     */
    getLastParagraphInLastCell(table: TableWidget): ParagraphWidget;
    /**
     * Get last paragraph in first row
     * @private
     */
    getLastParagraphInFirstRow(table: TableWidget): ParagraphWidget;
    /**
     * Get Next start inline
     * @private
     */
    getNextStartInline(line: LineWidget, offset: number): ElementBox;
    /**
     * Get previous text inline
     * @private
     */
    getPreviousTextInline(inline: ElementBox): ElementBox;
    /**
     * Get next text inline
     * @private
     */
    getNextTextInline(inline: ElementBox): ElementBox;
    /**
     * Get container table
     * @private
     */
    getContainerTable(block: BlockWidget): TableWidget;
    /**
     * @private
     */
    isExistBefore(start: BlockWidget, block: BlockWidget): boolean;
    /**
     * @private
     */
    isExistAfter(start: BlockWidget, block: BlockWidget): boolean;
    /**
     * Return true if current inline in exist before inline
     * @private
     */
    isExistBeforeInline(currentInline: ElementBox, inline: ElementBox): boolean;
    /**
     * Return true id current inline is exist after inline
     * @private
     */
    isExistAfterInline(currentInline: ElementBox, inline: ElementBox, isRetrieve?: boolean): boolean;
    /**
     * Get next rendered block
     * @private
     */
    getNextRenderedBlock(block: BlockWidget): BlockWidget;
    /**
     * Get next rendered block
     * @private
     */
    getPreviousRenderedBlock(block: BlockWidget): BlockWidget;
    /**
     * Get Next paragraph in block
     * @private
     */
    getNextParagraphBlock(block: BlockWidget): ParagraphWidget;
    /**
     * @private
     */
    getFirstBlockInNextHeaderFooter(block: BlockWidget): ParagraphWidget;
    /**
     * @private
     */
    getLastBlockInPreviousHeaderFooter(block: BlockWidget): ParagraphWidget;
    /**
     * Get previous paragraph in block
     * @private
     */
    getPreviousParagraphBlock(block: BlockWidget): ParagraphWidget;
    /**
     * Get first paragraph in block
     * @private
     */
    getFirstParagraphBlock(block: BlockWidget): ParagraphWidget;
    /**
     * Get last paragraph in block
     * @private
     */
    getLastParagraphBlock(block: BlockWidget): ParagraphWidget;
    /**
     * Return true if paragraph has valid inline
     * @private
     */
    hasValidInline(paragraph: ParagraphWidget, start: ElementBox, end: ElementBox): boolean;
    /**
     * Get paragraph length
     * @private
     */
    getParagraphLength(paragraph: ParagraphWidget, endLine?: LineWidget, elementInfo?: ElementInfo): number;
    /**
     * Get Line length
     * @private
     */
    getLineLength(line: LineWidget, elementInfo?: ElementInfo): number;
    /**
     * Get line information
     * @private
     */
    getLineInfo(paragraph: ParagraphWidget, offset: number): LineInfo;
    /**
     * @private
     */
    getElementInfo(line: LineWidget, offset: number): ElementInfo;
    /**
     * Get paragraph start offset
     * @private
     */
    getStartOffset(paragraph: ParagraphWidget): number;
    /**
     * @private
     */
    getStartLineOffset(line: LineWidget): number;
    /**
     * Get previous paragraph from selection
     * @private
     */
    getPreviousSelectionCell(cell: TableCellWidget): ParagraphWidget;
    /**
     * Get previous paragraph selection in selection
     * @private
     */
    getPreviousSelectionRow(row: TableRowWidget): ParagraphWidget;
    /**
     * @private
     */
    getNextSelectionBlock(block: BlockWidget): ParagraphWidget;
    /**
     * Get next paragraph from selected cell
     * @private
     */
    getNextSelectionCell(cell: TableCellWidget): ParagraphWidget;
    /**
     * Get next paragraph in selection
     * @private
     */
    getNextSelectionRow(row: TableRowWidget): ParagraphWidget;
    /**
     * Get next block with selection
     * @private
     */
    getNextSelection(section: BodyWidget): ParagraphWidget;
    /**
     * @private
     */
    getNextParagraphSelection(row: TableRowWidget): ParagraphWidget;
    /**
     * @private
     */
    getPreviousSelectionBlock(block: BlockWidget): ParagraphWidget;
    /**
     * Get previous paragraph in selection
     * @private
     */
    getPreviousSelection(section: BodyWidget): ParagraphWidget;
    /**
     * @private
     */
    getPreviousParagraphSelection(row: TableRowWidget): ParagraphWidget;
    /**
     * Get last cell in the selected region
     * @private
     */
    getLastCellInRegion(row: TableRowWidget, startCell: TableCellWidget, selLength: number, isMovePrev: boolean): TableCellWidget;
    /**
     * Get Container table
     * @private
     */
    getCellInTable(table: TableWidget, tableCell: TableCellWidget): TableCellWidget;
    /**
     * Get first paragraph in last row
     * @private
     */
    getFirstParagraphInLastRow(table: TableWidget): ParagraphWidget;
    /**
     * Get previous valid offset
     * @private
     */
    getPreviousValidOffset(paragraph: ParagraphWidget, offset: number): number;
    /**
     * Get next valid offset
     * @private
     */
    getNextValidOffset(line: LineWidget, offset: number): number;
    /**
     * Get paragraph mark size info
     * @private
     */
    getParagraphMarkSize(paragraph: ParagraphWidget, topMargin: number, bottomMargin: number): SizeInfo;
    /**
     * @private
     */
    getPhysicalPositionInternal(line: LineWidget, offset: number, moveNextLine: boolean): Point;
    /**
     * Highlight selected content
     * @private
     */
    highlightSelectedContent(start: TextPosition, end: TextPosition): void;
    private showResizerForShape;
    /**
     * @private
     */
    highlight(paragraph: ParagraphWidget, start: TextPosition, end: TextPosition): void;
    private highlightNextBlock;
    /**
     * Get start line widget
     * @private
     */
    getStartLineWidget(paragraph: ParagraphWidget, start: TextPosition, startElement: ElementBox, selectionStartIndex: number): ElementInfo;
    /**
     * Get end line widget
     * @private
     */
    getEndLineWidget(end: TextPosition, endElement: ElementBox, selectionEndIndex: number): ElementInfo;
    /**
     * Get line widget
     * @private
     */
    getLineWidgetInternal(line: LineWidget, offset: number, moveToNextLine: boolean): LineWidget;
    /**
     * Get last line widget
     * @private
     */
    getLineWidgetParagraph(offset: number, line: LineWidget): LineWidget;
    /**
     * Highlight selected cell
     * @private
     */
    highlightCells(table: TableWidget, startCell: TableCellWidget, endCell: TableCellWidget): void;
    /**
     * highlight selected table
     * @private
     */
    highlightTable(table: TableWidget, start: TextPosition, end: TextPosition): void;
    /**
     * Get cell left
     * @private
     */
    getCellLeft(row: TableRowWidget, cell: TableCellWidget): number;
    /**
     * Get next paragraph for row
     * @private
     */
    getNextParagraphRow(row: BlockWidget): ParagraphWidget;
    /**
     * Get previous paragraph from row
     * @private
     */
    getPreviousParagraphRow(row: TableRowWidget): ParagraphWidget;
    /**
     * Return true if row contain cell
     * @private
     */
    containsRow(row: TableRowWidget, tableCell: TableCellWidget): boolean;
    /**
     * Highlight selected row
     * @private
     */
    highlightRow(row: TableRowWidget, start: number, end: number): void;
    /**
     * @private
     */
    highlightInternal(row: TableRowWidget, start: TextPosition, end: TextPosition): void;
    /**
     * Get last paragraph in cell
     * @private
     */
    getLastParagraph(cell: TableCellWidget): ParagraphWidget;
    /**
     * Return true is source cell contain cell
     * @private
     */
    containsCell(sourceCell: TableCellWidget, cell: TableCellWidget): boolean;
    /**
     * Return true if cell is selected
     * @private
     */
    isCellSelected(cell: TableCellWidget, startPosition: TextPosition, endPosition: TextPosition): boolean;
    /**
     * Return Container cell
     * @private
     */
    getContainerCellOf(cell: TableCellWidget, tableCell: TableCellWidget): TableCellWidget;
    /**
     * Get Selected cell
     * @private
     */
    getSelectedCell(cell: TableCellWidget, containerCell: TableCellWidget): TableCellWidget;
    /**
     * @private
     */
    getSelectedCells(): TableCellWidget[];
    /**
     * Get Next paragraph from cell
     * @private
     */
    getNextParagraphCell(cell: TableCellWidget): ParagraphWidget;
    /**
     * Get previous paragraph from cell
     * @private
     */
    getPreviousParagraphCell(cell: TableCellWidget): ParagraphWidget;
    /**
     * Get cell's container cell
     * @private
     */
    getContainerCell(cell: TableCellWidget): TableCellWidget;
    /**
     * Highlight selected cell
     * @private
     */
    highlightCell(cell: TableCellWidget, selection: Selection, start: TextPosition, end: TextPosition): void;
    /**
     * @private
     */
    highlightContainer(cell: TableCellWidget, start: TextPosition, end: TextPosition): void;
    /**
     * Get previous valid element
     * @private
     */
    getPreviousValidElement(inline: ElementBox): ElementBox;
    /**
     * Get next valid element
     * @private
     */
    getNextValidElement(inline: ElementBox): ElementBox;
    /**
     * Return next valid inline with index
     * @private
     */
    validateTextPosition(inline: ElementBox, index: number): ElementInfo;
    /**
     * Get inline physical location
     * @private
     */
    getPhysicalPositionInline(inline: ElementBox, index: number, moveNextLine: boolean): Point;
    /**
     * Get field character position
     * @private
     */
    getFieldCharacterPosition(firstInline: ElementBox): Point;
    /**
     * @private
     */
    getNextValidElementForField(firstInline: ElementBox): ElementBox;
    /**
     * Get paragraph end position
     * @private
     */
    getEndPosition(widget: ParagraphWidget): Point;
    /**
     * Get element box
     * @private
     */
    getElementBox(currentInline: ElementBox, index: number, moveToNextLine: boolean): ElementInfo;
    /**
     * @private
     */
    getPreviousTextElement(inline: ElementBox): ElementBox;
    /**
     * Get next text inline
     * @private
     */
    getNextTextElement(inline: ElementBox): ElementBox;
    /**
     * @private
     */
    getNextRenderedElementBox(inline: ElementBox, indexInInline: number): ElementBox;
    /**
     * @private
     */
    getElementBoxInternal(inline: ElementBox, index: number): ElementInfo;
    /**
     * Get Line widget
     * @private
     */
    getLineWidget(inline: ElementBox, index: number): LineWidget;
    /**
     * @private
     */
    getLineWidgetInternalInline(inline: ElementBox, index: number, moveToNextLine: boolean): LineWidget;
    /**
     * Get next line widget
     * @private
     */
    private getNextLineWidget;
    /**
     * Get Caret height
     * @private
     */
    getCaretHeight(inline: ElementBox, index: number, format: WCharacterFormat, isEmptySelection: boolean, topMargin: number, isItalic: boolean): CaretHeightInfo;
    /**
     * Get field characters height
     * @private
     */
    getFieldCharacterHeight(startInline: FieldElementBox, format: WCharacterFormat, isEmptySelection: boolean, topMargin: number, isItalic: boolean): CaretHeightInfo;
    /**
     * Get rendered inline
     * @private
     */
    getRenderedInline(inline: FieldElementBox, inlineIndex: number): ElementInfo;
    /**
     * Get rendered field
     * @private
     */
    getRenderedField(fieldBegin: FieldElementBox): FieldElementBox;
    /**
     * Return true is inline is tha last inline
     * @private
     */
    isLastRenderedInline(inline: ElementBox, index: number): boolean;
    /**
     * Get page
     * @private
     */
    getPage(widget: Widget): Page;
    /**
     * Clear Selection highlight
     * @private
     */
    clearSelectionHighlightInSelectedWidgets(): boolean;
    /**
     * Clear selection highlight
     * @private
     */
    clearChildSelectionHighlight(widget: Widget): void;
    /**
     * Get line widget from paragraph widget
     * @private
     */
    getLineWidgetBodyWidget(widget: Widget, point: Point): LineWidget;
    /**
     * Get line widget from paragraph widget
     * @private
     */
    getLineWidgetParaWidget(widget: ParagraphWidget, point: Point): LineWidget;
    /**
     * highlight paragraph widget
     * @private
     */
    highlightParagraph(widget: ParagraphWidget, startIndex: number, endLine: LineWidget, endElement: ElementBox, endIndex: number): void;
    /**
     * Get line widget form table widget
     * @private
     */
    getLineWidgetTableWidget(widget: TableWidget, point: Point): LineWidget;
    /**
     * Get line widget fom row
     * @private
     */
    getLineWidgetRowWidget(widget: TableRowWidget, point: Point): LineWidget;
    /**
     * @private
     */
    getFirstBlock(cell: TableCellWidget): BlockWidget;
    /**
     * Highlight selected cell widget
     * @private
     */
    highlightCellWidget(widget: TableCellWidget): void;
    /**
     * Clear selection highlight
     * @private
     */
    clearSelectionHighlight(widget: IWidget): void;
    /**
     * Get line widget from cell widget
     * @private
     */
    getLineWidgetCellWidget(widget: TableCellWidget, point: Point): LineWidget;
    /**
     * update text position
     * @private
     */
    updateTextPosition(widget: LineWidget, point: Point): void;
    /**
     * @private
     */
    updateTextPositionIn(widget: LineWidget, inline: ElementBox, index: number, caretPosition: Point, includeParagraphMark: boolean): TextPositionInfo;
    /**
     * @private
     */
    checkAllFloatingElements(widget: LineWidget, caretPosition: Point): ShapeInfo;
    /**
     * Get text length if the line widget
     * @private
     */
    getTextLength(widget: LineWidget, element: ElementBox): number;
    /**
     * Get Line widget left
     * @private
     */
    getLeft(widget: LineWidget): number;
    /**
     * Get line widget top
     * @private
     */
    getTop(widget: LineWidget): number;
    /**
     * Get first element the widget
     * @private
     */
    getFirstElement(widget: LineWidget, left: number): FirstElementInfo;
    /**
     * Return inline index
     * @private
     */
    getIndexInInline(elementBox: ElementBox): number;
    /**
     * Return true if widget is first inline of paragraph
     * @private
     */
    isParagraphFirstLine(widget: LineWidget): boolean;
    /**
     * @private
     */
    isParagraphLastLine(widget: LineWidget): boolean;
    /**
     * Return line widget width
     * @private
     */
    getWidth(widget: LineWidget, includeParagraphMark: boolean): number;
    /**
     * Return line widget left
     * @private
     */
    getLeftInternal(widget: LineWidget, elementBox: ElementBox, index: number): number;
    /**
     * Return line widget start offset
     * @private
     */
    getLineStartLeft(widget: LineWidget): number;
    /**
     * Update text position
     * @private
     */
    updateTextPositionWidget(widget: LineWidget, point: Point, textPosition: TextPosition, includeParagraphMark: boolean): void;
    /**
     * Clear selection highlight
     * @private
     */
    clearSelectionHighlightLineWidget(widget: LineWidget): void;
    /**
     * Return first element from line widget
     * @private
     */
    getFirstElementInternal(widget: LineWidget): ElementBox;
    /**
     * Select content between given range
     * @private
     */
    selectRange(startPosition: TextPosition, endPosition: TextPosition): void;
    /**
     * Selects current paragraph
     * @private
     */
    selectParagraphInternal(paragraph: ParagraphWidget, positionAtStart: boolean): void;
    /**
     * @private
     */
    setPositionForBlock(block: BlockWidget, selectFirstBlock: boolean): TextPosition;
    /**
     * Select content in given text position
     * @private
     */
    selectContent(textPosition: TextPosition, clearMultiSelection: boolean): void;
    /**
     * Select paragraph
     * @private
     */
    selectInternal(lineWidget: LineWidget, element: ElementBox, index: number, physicalLocation: Point): void;
    /**
     * @private
     */
    selects(lineWidget: LineWidget, offset: number, skipSelectionChange: boolean): void;
    /**
     * Select content between start and end position
     * @private
     */
    selectPosition(startPosition: TextPosition, endPosition: TextPosition): void;
    /**
     * Notify selection change event
     * @private
     */
    fireSelectionChanged(isSelectionChanged: boolean): void;
    /**
     * Retrieve all current selection format
     * @private
     */
    retrieveCurrentFormatProperties(): void;
    /**
     * @private
     */
    retrieveImageFormat(start: TextPosition, end: TextPosition): void;
    private setCurrentContextType;
    private addItemRevisions;
    /**
     * @private
     */
    hasRevisions(): boolean;
    private getCurrentRevision;
    private processLineRevisions;
    /**
     * @private
     * @param isFromAccept
     */
    handleAcceptReject(isFromAccept: boolean): void;
    private acceptReject;
    private getselectedRevisionElements;
    private getSelectedLineRevisions;
    private addRevisionsCollec;
    /**
     * Retrieve selection table format
     * @private
     */
    retrieveTableFormat(start: TextPosition, end: TextPosition): void;
    /**
     * Retrieve selection cell format
     * @private
     */
    retrieveCellFormat(start: TextPosition, end: TextPosition): void;
    /**
     * Retrieve selection row format
     * @private
     */
    retrieveRowFormat(start: TextPosition, end: TextPosition): void;
    /**
     * Get selected cell format
     * @private
     */
    getCellFormat(table: TableWidget, start: TextPosition, end: TextPosition): void;
    /**
     * Get selected row format
     * @private
     */
    getRowFormat(table: TableWidget, start: TextPosition, end: TextPosition): void;
    /**
     * Return table with given text position
     * @private
     */
    getTable(startPosition: TextPosition, endPosition: TextPosition): TableWidget;
    private getContainerWidget;
    /**
     * Retrieve selection section format
     * @private
     */
    retrieveSectionFormat(start: TextPosition, end: TextPosition): void;
    /**
     * Retrieve selection paragraph format
     * @private
     */
    retrieveParagraphFormat(start: TextPosition, end: TextPosition): void;
    /**
     * @private
     */
    getParagraphFormatForSelection(paragraph: ParagraphWidget, selection: Selection, start: TextPosition, end: TextPosition): void;
    /**
     * @private
     */
    getParagraphFormatInternalInParagraph(paragraph: ParagraphWidget, start: TextPosition, end: TextPosition): void;
    /**
     * @private
     */
    getParagraphFormatInternalInBlock(block: BlockWidget, start: TextPosition, end: TextPosition): void;
    /**
     * @private
     */
    getParagraphFormatInternalInTable(table: TableWidget, start: TextPosition, end: TextPosition): void;
    /**
     * Get paragraph format in cell
     * @private
     */
    getParagraphFormatInCell(cell: TableCellWidget): void;
    /**
     * @private
     */
    getParagraphFormatInBlock(block: BlockWidget): void;
    /**
     * @private
     */
    getParagraphFormatInTable(tableAdv: TableWidget): void;
    /**
     * @private
     */
    getParagraphFormatInParagraph(paragraph: ParagraphWidget): void;
    /**
     * Get paragraph format in cell
     * @private
     */
    getParagraphFormatInternalInCell(cellAdv: TableCellWidget, start: TextPosition, end: TextPosition): void;
    /**
     * @private
     */
    getParaFormatForCell(table: TableWidget, startCell: TableCellWidget, endCell: TableCellWidget): void;
    /**
     * Get paragraph format ins row
     * @private
     */
    getParagraphFormatInRow(tableRow: TableRowWidget, start: TextPosition, end: TextPosition): void;
    /**
     * Retrieve Selection character format
     * @private
     */
    retrieveCharacterFormat(start: TextPosition, end: TextPosition): void;
    /**
     * @private
     */
    getCharacterFormatForSelection(paragraph: ParagraphWidget, selection: Selection, startPosition: TextPosition, endPosition: TextPosition): void;
    /**
     * Get Character format
     * @private
     */
    getCharacterFormatForTableRow(tableRowAdv: TableRowWidget, start: TextPosition, end: TextPosition): void;
    /**
     * Get Character format in table
     * @private
     */
    getCharacterFormatInTableCell(tableCell: TableCellWidget, selection: Selection, start: TextPosition, end: TextPosition): void;
    /**
     * @private
     */
    getCharacterFormatInternalInTable(table: TableWidget, startCell: TableCellWidget, endCell: TableCellWidget, startPosition: TextPosition, endPosition: TextPosition): void;
    /**
     * Get character format with in selection
     * @private
     */
    getCharacterFormat(paragraph: ParagraphWidget, start: TextPosition, end: TextPosition): void;
    private setCharacterFormat;
    /**
     * @private
     */
    getCharacterFormatForBlock(block: BlockWidget, start: TextPosition, end: TextPosition): void;
    /**
     * @private
     */
    getCharacterFormatInTable(table: TableWidget, start: TextPosition, end: TextPosition): void;
    /**
     * Get character format in selection
     * @private
     */
    getCharacterFormatForSelectionCell(cell: TableCellWidget, start: TextPosition, end: TextPosition): void;
    /**
     * @private
     */
    getCharacterFormatInternal(paragraph: ParagraphWidget, selection: Selection): void;
    /**
     * Get next valid character format from inline
     * @private
     */
    getNextValidCharacterFormat(inline: ElementBox): WCharacterFormat;
    /**
     * Get next valid paragraph format from field
     * @private
     */
    getNextValidCharacterFormatOfField(fieldBegin: FieldElementBox): WCharacterFormat;
    /**
     * Return true if cursor point with in selection range
     * @private
     */
    checkCursorIsInSelection(widget: IWidget, point: Point): boolean;
    /**
     * Copy paragraph for to selection paragraph format
     * @private
     */
    copySelectionParagraphFormat(): WParagraphFormat;
    /**
     * Get hyperlink display text
     * @private
     */
    getHyperlinkDisplayText(paragraph: ParagraphWidget, fieldSeparator: FieldElementBox, fieldEnd: FieldElementBox, isNestedField: boolean, format: WCharacterFormat): HyperlinkTextInfo;
    /**
     * Navigates hyperlink on mouse Event.
     * @private
     */
    navigateHyperLinkOnEvent(cursorPoint: Point, isTouchInput: boolean): void;
    /**
     * @private
     */
    getLinkText(fieldBegin: FieldElementBox): string;
    /**
     * Set Hyperlink content to tool tip element
     * @private
     */
    setHyperlinkContentToToolTip(fieldBegin: FieldElementBox, widget: LineWidget, xPos: number, isFormField?: boolean): void;
    /**
     * @private
     */
    getTooltipPosition(fieldBegin: FieldElementBox, xPos: number, toolTipElement: HTMLElement, isFormField: boolean): Point;
    /**
     * @private
     */
    createPasteElement(top: string, left: string): void;
    /**
     * @private
     */
    pasteOptions: (event: MenuEventArgs) => void;
    /**
     * Show hyperlink tooltip
     * @private
     */
    showToolTip(x: number, y: number): void;
    /**
     * Hide tooltip object
     * @private
     */
    hideToolTip(): void;
    /**
     * Return hyperlink field
     * @private
     */
    getHyperLinkFieldInCurrentSelection(widget: LineWidget, cursorPosition: Point, isFormField?: boolean): FieldElementBox;
    /**
     * Return field if paragraph contain hyperlink field
     * @private
     */
    getHyperlinkField(isRetrieve?: boolean): FieldElementBox;
    /**
     * @private
     */
    getHyperLinkFields(paragraph: ParagraphWidget, checkedFields: FieldElementBox[], isRetrieve: boolean, checkFormField?: boolean): FieldElementBox;
    /**
     * @private
     */
    getHyperLinkFieldInternal(paragraph: Widget, inline: ElementBox, fields: FieldElementBox[], isRetrieve: boolean, checkFormField: boolean): FieldElementBox;
    /**
     * @private
     */
    getBlock(currentIndex: string): BlockWidget;
    /**
     * Return Block relative to position
     * @private
     */
    getBlockInternal(widget: Widget, position: string): BlockWidget;
    /**
     * Return true if inline is in field result
     * @private
     */
    inlineIsInFieldResult(fieldBegin: FieldElementBox, fieldEnd: ElementBox, fieldSeparator: FieldElementBox, inline: ElementBox, isRetrieve?: boolean): boolean;
    /**
     * Retrieve true if paragraph is in field result
     * @private
     */
    paragraphIsInFieldResult(fieldBegin: FieldElementBox, paragraph: ParagraphWidget): boolean;
    /**
     * Return true if image is In field
     * @private
     */
    isImageField(): boolean;
    /**
     * Return true if selection is in Form field
     * @private
     */
    isFormField(): boolean;
    /**
     * Return true if selection is in reference field
     * @private
     */
    isReferenceField(field?: FieldElementBox): boolean;
    /**
     * Return true if selection is in text form field
     * @private
     */
    isInlineFormFillMode(field?: FieldElementBox): boolean;
    /**
     * @private
     */
    getFormFieldType(formField?: FieldElementBox): FormFieldType;
    /**
     * Get selected form field type
     * @private
     */
    getCurrentFormField(checkFieldResult?: boolean): FieldElementBox;
    /**
     * @private
     */
    getCurrentTextFrame(): TextFrame;
    /**
     * @private
     */
    isTableSelected(): boolean;
    /**
     * Select List Text
     * @private
     */
    selectListText(): void;
    /**
     * Manually select the list text
     * @private
     */
    highlightListText(linewidget: LineWidget): void;
    /**
     * @private
     */
    updateImageSize(imageFormat: ImageFormat): void;
    /**
     * Gets selected table content
     * @private
     */
    private getSelectedCellsInTable;
    /**
     * Copies the selected content to clipboard.
     */
    copy(): void;
    /**
     * @private
     */
    copySelectedContent(isCut: boolean): void;
    /**
     * Copy content to clipboard
     * @private
     */
    copyToClipboard(htmlContent: string): boolean;
    /**
     * Shows caret in current selection position.
     * @private
     */
    showCaret(): void;
    /**
     * To set the editable div caret position
     * @private
     */
    setEditableDivCaretPosition(index: number): void;
    /**
     * Hides caret.
     * @private
     */
    hideCaret: () => void;
    /**
     * Initializes caret.
     * @private
     */
    initCaret(): void;
    /**
     * Updates caret position.
     * @private
     */
    updateCaretPosition(): void;
    /**
     * @private
     */
    showHidePasteOptions(top: string, left: string): void;
    /**
     * @private
     */
    getRect(position: TextPosition): Point;
    /**
     * Gets current selected page
     * @private
     */
    getSelectionPage(position: TextPosition): Page;
    /**
     * Updates caret size.
     * @private
     */
    updateCaretSize(textPosition: TextPosition, skipUpdate?: boolean): CaretHeightInfo;
    /**
     * Updates caret to page.
     * @private
     */
    updateCaretToPage(startPosition: TextPosition, endPage: Page): void;
    /**
     * Gets caret bottom position.
     * @private
     */
    getCaretBottom(textPosition: TextPosition, isEmptySelection: boolean): number;
    /**
     * Checks for cursor visibility.
     * @param isTouch
     * @private
     */
    checkForCursorVisibility(): void;
    /**
     * Keyboard shortcuts
     * @private
     */
    onKeyDownInternal(event: KeyboardEvent, ctrl: boolean, shift: boolean, alt: boolean): void;
    /**
     * @private
     */
    checkAndEnableHeaderFooter(point: Point, pagePoint: Point): boolean;
    /**
     * @private
     */
    isCursorInsidePageRect(point: Point, page: Page): boolean;
    /**
     * @private
     */
    isCursorInHeaderRegion(point: Point, page: Page): boolean;
    /**
     * @private
     */
    isCursorInFooterRegion(point: Point, page: Page): boolean;
    /**
     * @private
     */
    enableHeadersFootersRegion(widget: HeaderFooterWidget): boolean;
    /**
     * @private
     */
    shiftBlockOnHeaderFooterEnableDisable(): void;
    /**
     * @private
     */
    updateTextPositionForBlockContainer(widget: BlockContainer): void;
    /**
     * Disable Header footer
     * @private
     */
    disableHeaderFooter(): void;
    /**
     * @private
     */
    destroy(): void;
    /**
     * Navigates to the specified bookmark.
     * @param name
     * @param moveToStart
     * @private
     */
    navigateBookmark(name: string, moveToStart?: boolean): void;
    /**
     * Selects the specified bookmark.
     * @param name
     */
    selectBookmark(name: string): void;
    /**
     * Returns the toc field from the selection.
     * @private
     */
    getTocField(): FieldElementBox;
    /**
     * Returns true if the paragraph has toc style.
     */
    private isTocStyle;
    /**
     * Return true if selection is in TOC
     * @private
     */
    isTOC(): boolean;
    /**
     * @private
     */
    getElementsForward(lineWidget: LineWidget, startElement: ElementBox, endElement: ElementBox, bidi: boolean): ElementBox[];
    /**
     * @private
     */
    getElementsBackward(lineWidget: LineWidget, startElement: ElementBox, endElement: ElementBox, bidi: boolean): ElementBox[];
    /**
     * Navigate to previous comment in the document.
     */
    navigatePreviousComment(): void;
    /**
     * Navigate to next comment in the document.
     */
    navigateNextComment(): void;
    private commentNavigateInternal;
    /**
     * Navigate to previous revision in the document.
     */
    navigatePreviousRevision(): void;
    /**
     * Navigate to next revision in the document.
     */
    navigateNextRevision(): void;
    /**
     * Method to navigate revisions
     */
    private revisionNavigateInternal;
    /**
     * @private
     */
    selectComment(comment: CommentElementBox): void;
    /**
     * @private
     * @param revision
     */
    selectRevision(revision: Revision): void;
    /**
     * @private
     */
    updateEditRangeCollection(): void;
    /**
     * @private
     */
    onHighlight(): void;
    /**
     * @private
     */
    highlightEditRegion(): void;
    /**
     * @private
     */
    highlightFormFields(): void;
    /**
     * @private
     */
    unHighlightEditRegion(): void;
    /**
     * @private
     */
    highlightEditRegionInternal(editRangeStart: EditRangeStartElementBox): void;
    /**
     * Shows all the editing region, where current user can edit.
     */
    showAllEditingRegion(): void;
    private highlightEditRegions;
    /**
     * Navigate to next editing region, where current user can edit.
     */
    navigateToNextEditingRegion(): void;
    /**
     * Highlight all the editing region, where current user can edit.
     */
    toggleEditingRegionHighlight(): void;
    /**
     * @private
     */
    getEditRangeStartElement(): EditRangeStartElementBox;
    /**
     * @private
     */
    isSelectionIsAtEditRegion(update: boolean): boolean;
    checkSelectionIsAtEditRegion(start?: TextPosition, end?: TextPosition): boolean;
    private getPosition;
    /**
     * @private
     */
    getElementPosition(element: ElementBox, isEnd?: boolean): PositionInfo;
    /**
     * Update ref field.
     * @private
     */
    updateRefField(field?: FieldElementBox): void;
}
/**
 *  Specifies the settings for selection.
 */
export interface SelectionSettings {
    /**
     * Specifies selection left position
     */
    x: number;
    /**
     * Specifies selection top position
     */
    y: number;
    /**
     * Specifies whether to extend or update selection
     */
    extend?: boolean;
}
