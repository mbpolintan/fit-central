import { ContextMenu as Context } from '@syncfusion/ej2-navigations';
import { PdfViewer, PdfViewerBase } from '../index';
/**
 * ContextMenu module is used to handle the context menus used in the control.
 * @hidden
 */
export declare class ContextMenu {
    /**
     * @private
     */
    contextMenuObj: Context;
    /**
     * @private
     */
    contextMenuElement: HTMLElement;
    private pdfViewer;
    private pdfViewerBase;
    private copyContextMenu;
    private currentTarget;
    /**
     * @private
     */
    previousAction: string;
    /**
     * @private
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase);
    /**
     * @private
     */
    createContextMenu(): void;
    private contextMenuOnCreated;
    private setTarget;
    private contextMenuOnBeforeOpen;
    private contextMenuItems;
    private getEnabledItemCount;
    private hideContextItems;
    private enableCommentPanelItem;
    private onOpeningForShape;
    private isClickWithinSelectionBounds;
    private getHorizontalClientValue;
    private getVerticalClientValue;
    private getHorizontalValue;
    private getVerticalValue;
    private onMenuItemSelect;
    /**
     * @private
     */
    destroy(): void;
}
