import { PdfAnnotationBaseModel } from './pdf-annotation-model';
import { PointModel, PathElement, DrawingElement, TextElement, DecoratorShapes } from '@syncfusion/ej2-drawings';
import { MeasureAnnotation, PdfViewer } from '../index';
/** @private */
export declare function getConnectorPoints(obj: PdfAnnotationBaseModel, points?: PointModel[]): PointModel[];
/** @private */
export declare function getSegmentPath(connector: PdfAnnotationBaseModel, points: PointModel[]): string;
/** @private */
export declare function updateSegmentElement(connector: PdfAnnotationBaseModel, points: PointModel[], element: PathElement): PathElement;
/** @private */
export declare function getSegmentElement(connector: PdfAnnotationBaseModel, segmentElement: PathElement): PathElement;
/** @private */
export declare function updateDecoratorElement(obj: PdfAnnotationBaseModel, element: DrawingElement, pt: PointModel, adjacentPoint: PointModel, isSource: Boolean): void;
/** @private */
export declare function getDecoratorElement(obj: PdfAnnotationBaseModel, offsetPoint: PointModel, adjacentPoint: PointModel, isSource: Boolean): PathElement;
/** @private */
export declare function clipDecorators(connector: PdfAnnotationBaseModel, pts: PointModel[]): PointModel[];
/** @private */
export declare function clipDecorator(connector: PdfAnnotationBaseModel, points: PointModel[], isSource: boolean): PointModel;
/**
 * @hidden
 */
export declare function initDistanceLabel(obj: PdfAnnotationBaseModel, points: PointModel[], measure: MeasureAnnotation, pdfviewer: PdfViewer): TextElement[];
/**
 * @hidden
 */
export declare function updateDistanceLabel(obj: PdfAnnotationBaseModel, points: PointModel[], measure: MeasureAnnotation): string;
/**
 * @hidden
 */
export declare function updateRadiusLabel(obj: PdfAnnotationBaseModel, measure: MeasureAnnotation): string;
/**
 * @hidden
 */
export declare function initPerimeterLabel(obj: PdfAnnotationBaseModel, points: PointModel[], measure: MeasureAnnotation, pdfviewer: PdfViewer): TextElement[];
/**
 * @hidden
 */
export declare function updatePerimeterLabel(obj: PdfAnnotationBaseModel, points: PointModel[], measure: MeasureAnnotation): string;
/**
 * @hidden
 */
export declare function removePerimeterLabel(obj: PdfAnnotationBaseModel): void;
/**
 * @hidden
 */
export declare function updateCalibrateLabel(obj: PdfAnnotationBaseModel): void;
/**
 * Used to find the path for polygon shapes
 * @hidden
 */
export declare function getPolygonPath(collection: PointModel[]): string;
/**
 * @hidden
 */
export declare function textElement(obj: PdfAnnotationBaseModel, angle: number): TextElement;
/**
 * @hidden
 */
export declare function initLeaders(obj: PdfAnnotationBaseModel, points: PointModel[]): PathElement[];
/**
 * @hidden
 */
export declare function initLeader(obj: PdfAnnotationBaseModel, point1: PointModel, point2: PointModel, isSecondLeader?: boolean): PathElement;
/** @private */
export declare function isPointOverConnector(connector: PdfAnnotationBaseModel, reference: PointModel): boolean;
/** @private */
export declare function findNearestPoint(reference: PointModel, start: PointModel, end: PointModel): PointModel;
/**
 * @hidden
 */
export declare function getDecoratorShape(shape: DecoratorShapes): string;
