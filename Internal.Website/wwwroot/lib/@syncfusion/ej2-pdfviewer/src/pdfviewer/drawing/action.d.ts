import { IElement } from '@syncfusion/ej2-drawings';
import { PointModel } from '@syncfusion/ej2-drawings';
import { DrawingElement } from '@syncfusion/ej2-drawings';
import { Container } from '@syncfusion/ej2-drawings';
import { PdfViewerBase, PdfViewer } from '../index';
import { PdfAnnotationBaseModel } from './pdf-annotation-model';
/** @private */
export declare function findActiveElement(event: MouseEvent | TouchEvent, pdfBase: PdfViewerBase, pdfViewer: PdfViewer, isOverlapped?: boolean): any;
/** @private */
export declare function findObjectsUnderMouse(pdfBase: PdfViewerBase, pdfViewer: PdfViewer, event: MouseEvent): IElement[];
/** @private */
export declare function findObjectUnderMouse(objects: (PdfAnnotationBaseModel)[], event: any, pdfBase: PdfViewerBase, pdfViewer: PdfViewer): IElement;
/** @private */
export declare function CalculateLeaderPoints(selector: any, currentobject: any): any;
/** @private */
export declare function findElementUnderMouse(obj: IElement, position: PointModel, padding?: number): DrawingElement;
/** @private */
export declare function insertObject(obj: PdfAnnotationBaseModel, key: string, collection: Object[]): void;
/** @private */
export declare function findTargetShapeElement(container: Container, position: PointModel, padding?: number): DrawingElement;
/** @private */
export declare function findObjects(region: PointModel, objCollection: (PdfAnnotationBaseModel)[]): (PdfAnnotationBaseModel)[];
/** @private */
export declare function findActivePage(event: MouseEvent, pdfBase: PdfViewerBase): number;
/**
 * @hidden
 */
export declare class ActiveElements {
    private activePage;
    /** @private */
    /** @private */
    activePageID: number;
    constructor();
}
