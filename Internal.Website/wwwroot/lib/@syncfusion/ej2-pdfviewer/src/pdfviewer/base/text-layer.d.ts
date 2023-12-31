import { PdfViewer, PdfViewerBase } from '../index';
/**
 * TextLayer module is used to handle the text content on the control.
 * @hidden
 */
export declare class TextLayer {
    private pdfViewer;
    private pdfViewerBase;
    private notifyDialog;
    private isMessageBoxOpen;
    private textBoundsArray;
    /**
     * @private
     */
    characterBound: any[];
    /**
     * @private
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase);
    /**
     * @private
     */
    addTextLayer(pageNumber: number, pageWidth: number, pageHeight: number, pageDiv: HTMLElement): HTMLElement;
    /**
     * @private
     */
    renderTextContents(pageNumber: number, textContents: any, textBounds: any, rotation: any): void;
    /**
     * @private
     */
    resizeTextContents(pageNumber: number, textContents: any, textBounds: any, rotation: any, isTextSearch?: boolean): void;
    private applyTextRotation;
    private setTextElementProperties;
    /**
     * @private
     */
    resizeTextContentsOnZoom(pageNumber: number): void;
    private resizeExcessDiv;
    /**
     * @private
     */
    clearTextLayers(): void;
    private removeElement;
    /**
     * @private
     */
    convertToSpan(pageNumber: number, divId: number, fromOffset: number, toOffset: number, textString: string, className: string): void;
    /**
     * @private
     */
    applySpanForSelection(startPage: number, endPage: number, anchorOffsetDiv: number, focusOffsetDiv: number, anchorOffset: number, focusOffset: number): void;
    /**
     * @private
     */
    clearDivSelection(): void;
    private setStyleToTextDiv;
    private getTextSelectionStatus;
    /**
     * @private
     */
    modifyTextCursor(isAdd: boolean): void;
    /**
     * @private
     */
    isBackWardSelection(selection: Selection): boolean;
    /**
     * @private
     */
    getPageIndex(element: Node): number;
    /**
     * @private
     */
    getTextIndex(element: Node, pageIndex: number): number;
    private getPreviousZoomFactor;
    /**
     * @private
     */
    getTextSearchStatus(): boolean;
    /**
     * @private
     */
    createNotificationPopup(text: string): void;
    private closeNotification;
}
