import { PdfViewerBase, PdfViewer } from '../index';
import { AnnotationSelectorSettingsModel } from '../pdfviewer-model';
/**
 * @hidden
 */
export interface IPopupAnnotation {
    shapeAnnotationType: string;
    pathData: string;
    author: string;
    subject: string;
    modifiedDate: string;
    note: string;
    bounds: any;
    color: any;
    opacity: number;
    state: string;
    stateModel: string;
    comments: ICommentsCollection[];
    review: IReviewCollection;
    annotName: string;
    annotationSelectorSettings: AnnotationSelectorSettingsModel;
    customData: object;
    annotationSettings: any;
}
/**
 * @hidden
 */
export interface ICommentsCollection {
    author: string;
    modifiedDate: string;
    annotName: string;
    subject: string;
    parentId: string;
    note: string;
    state: string;
    stateModel: string;
    comments: ICommentsCollection[];
    review: IReviewCollection;
    shapeAnnotationType: string;
    position?: number;
}
/**
 * @hidden
 */
export interface IReviewCollection {
    author: string;
    state: string;
    stateModel: string;
    modifiedDate: string;
    annotId?: string;
}
/**
 * StickyNotes module
 */
export declare class StickyNotesAnnotation {
    private pdfViewer;
    private pdfViewerBase;
    private accordionContent;
    private accordionPageContainer;
    private accordionContentContainer;
    private commentsContainer;
    private commentMenuObj;
    private commentsCount;
    private commentsreplyCount;
    private commentContextMenu;
    private isAccordionContainer;
    private isSetAnnotationType;
    private isNewcommentAdded;
    private isCreateContextMenu;
    private commentsRequestHandler;
    private selectAnnotationObj;
    private isCommentsSelected;
    /**
     * @private
     */
    isEditableElement: boolean;
    /**
     * @private
     */
    accordionContainer: HTMLElement;
    /**
     * @private
     */
    mainContainer: HTMLElement;
    /**
     * @private
     */
    opacity: number;
    private isPageCommentsRendered;
    private isCommentsRendered;
    /**
     * @private
     */
    isAnnotationRendered: boolean;
    /**
     * @private
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase);
    /**
     * @private
     */
    renderStickyNotesAnnotations(stickyAnnotations: any, pageNumber: number, canvas?: any): void;
    /**
     * @private
     */
    getSettings(annotation: any): any;
    /**
     * @private
     */
    drawStickyNotes(X: number, Y: number, width: number, height: number, pageIndex: number, annotation: any, canvas?: any): any;
    private setImageSource;
    /**
     * @private
     */
    createRequestForComments(): void;
    /**
     * @private
     */
    updateAnnotationsInDocumentCollections(excistingAnnotation: any, newAnnotation: any): any;
    private updateDocumentAnnotationCollections;
    private renderAnnotationCollections;
    /**
     * @private
     */
    updateCollections(annotation: any, isSignature?: boolean): void;
    /**
     * @private
     */
    renderAnnotationComments(data: any, pageIndex: number): void;
    /**
     * @private
     */
    initializeAcccordionContainer(): void;
    /**
     * @private
     */
    updateCommentPanelTextTop(): void;
    /**
     * @private
     */
    createPageAccordion(pageIndex: number): any;
    private alignAccordionContainer;
    /**
     * @private
     */
    updateCommentPanelScrollTop(pageNumber: number): void;
    /**
     * @private
     */
    createCommentControlPanel(data: any, pageIndex: number, type?: string, annotationSubType?: string): string;
    private commentDivFocus;
    private updateScrollPosition;
    private updateCommentsScrollTop;
    private createCommentDiv;
    private saveCommentDiv;
    private renderComments;
    /**
     * @private
     */
    createCommentsContainer(data: any, pageIndex: number, isCopy?: boolean): string;
    private modifyProperty;
    private createTitleContainer;
    private createReplyDivTitleContainer;
    private updateCommentIcon;
    private updateStatusContainer;
    /**
     * @private
     */
    updateAccordionContainer(removeDiv: HTMLElement): void;
    /**
     * @private
     */
    createCommentContextMenu(): void;
    private commentMenuItemSelect;
    private moreOptionsClick;
    private openTextEditor;
    private openEditorElement;
    private commentsDivClickEvent;
    private commentsDivDoubleClickEvent;
    private commentDivOnSelect;
    private commentDivMouseOver;
    private commentDivMouseLeave;
    /**
     * @private
     */
    drawIcons(event: any): void;
    /**
     * @private
     */
    addComments(annotationType: string, pageNumber: number, annotationSubType?: string): string;
    private commentsAnnotationSelect;
    private findAnnotationObject;
    private checkAnnotationSettings;
    private updateCommentsContainerWidth;
    /**
     * @private
     */
    selectCommentsAnnotation(pageIndex: number): void;
    private setAnnotationType;
    private modifyTextProperty;
    private modifyCommentsProperty;
    private modifyStatusProperty;
    private modifyCommentDeleteProperty;
    /**
     * @private
     */
    updateOpacityValue(annotation: any): void;
    /**
     * @private
     */
    undoAction(annotation: any, isAction: string, undoAnnotation?: any): any;
    /**
     * @private
     */
    redoAction(annotation: any, isAction: string, undoAnnotation?: any): any;
    private updateUndoRedoCollections;
    /**
     * @private
     */
    addAnnotationComments(pageIndex: any, type: string): void;
    /**
     * @private
     */
    findPosition(annotation: any, type: string, action?: string): any;
    private getAnnotations;
    private manageAnnotations;
    updateStickyNotes(annotation: any, id: any): any;
    saveStickyAnnotations(): any;
    private deleteStickyNotesAnnotations;
    addStickyNotesAnnotations(pageNumber: number, annotationBase: any): void;
    /**
     * @private
     */
    addTextToComments(annotName: string, text: string): void;
    /**
     * @private
     */
    updateAnnotationCollection(newAnnotation: any, annotation: any): void;
    private findAnnotationType;
    private setExistingAnnotationModifiedDate;
    private setModifiedDate;
    private updateModifiedDate;
    /**
     * @private
     */
    updateAnnotationModifiedDate(annotation: any, isBounds?: boolean, isUndoRedoAction?: boolean): void;
    /**
     * @private
     */
    saveImportedStickyNotesAnnotations(annotation: any, pageNumber: number): any;
    /**
     * @private
     */
    updateStickyNotesAnnotationCollections(annotation: any, pageNumber: number): any;
    /**
     * @private
     */
    clear(): void;
    /**
     * @private
     */
    getModuleName(): string;
}
