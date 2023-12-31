import { PdfViewer } from '../index';
import { PdfViewerBase } from '../index';
import { Dialog } from '@syncfusion/ej2-popups';
/**
 * @hidden
 */
export interface ISignAnnotation {
    strokeColor: string;
    opacity: number;
    bounds: IRectCollection;
    pageIndex: number;
    shapeAnnotationType: string;
    thickness: number;
    id: string;
    data: string;
    signatureName: string;
}
/**
 * @hidden
 */
interface IRectCollection {
    left: number;
    top: number;
    width: number;
    height: number;
}
/**
 * @hidden
 */
export declare class Signature {
    private pdfViewer;
    private pdfViewerBase;
    private mouseDetection;
    private oldX;
    private mouseX;
    private oldY;
    private mouseY;
    private newObject;
    /**
     * @private
     */
    outputString: string;
    /**
     * @private
     */
    signatureDialog: Dialog;
    /**
     * @private
     */
    signaturecollection: any;
    /**
     * @private
     */
    outputcollection: any;
    /**
     * @private
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase);
    /**
     * @private
     */
    createSignaturePanel(): void;
    private addSignature;
    private hideSignaturePanel;
    private createSignatureCanvas;
    private addSignatureCollection;
    /**
     * @private
     */
    RenderSavedSignature(): void;
    /**
     * @private
     */
    updateCanvasSize(): void;
    private signaturePanelMouseDown;
    private enableCreateButton;
    private signaturePanelMouseMove;
    private findMousePosition;
    private drawMousePosition;
    private drawSignatureInCanvas;
    private signaturePanelMouseUp;
    private convertToPath;
    private linePath;
    private movePath;
    private clearSignatureCanvas;
    private closeSignaturePanel;
    /**
     * @private
     */
    saveSignature(): string;
    /**
     * @private
     */
    getRgbCode(colorString: string): any;
    /**
     * @private
     */
    renderSignature(left: number, top: number): void;
    /**
     * @private
     */
    renderExistingSignature(annotationCollection: any, pageIndex: number, isImport: boolean): void;
    /**
     * @private
     */
    storeSignatureData(pageNumber: number, annotations: any): void;
    /**
     * @private
     */
    modifySignatureCollection(property: string, pageNumber: number, annotationBase: any, isSignatureEdited?: boolean): ISignAnnotation;
    /**
     * @private
     */
    storeSignatureCollections(annotation: any, pageNumber: number): void;
    private checkSignatureCollection;
    /**
     * @private
     */
    updateSignatureCollection(signature: any): void;
    /**
     * @private
     */
    addInCollection(pageNumber: number, signature: any): void;
    private getAnnotations;
    private manageAnnotations;
    /**
     * @private
     */
    showSignatureDialog(isShow: boolean): void;
    /**
     * @private
     */
    setAnnotationMode(): void;
    /**
     * @private
     */
    ConvertPointToPixel(number: any): any;
    /**
     * @private
     */
    updateSignatureCollections(signature: any, pageIndex: number, isImport?: boolean): any;
    /**
     * @private
     */
    destroy(): void;
}
export {};
