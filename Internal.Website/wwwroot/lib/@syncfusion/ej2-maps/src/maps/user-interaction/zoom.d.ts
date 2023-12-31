import { Maps, ITouches } from '../../index';
import { Point, Rect } from '../utils/helper';
import { LayerSettings } from '../index';
import { PanDirection } from '../utils/enum';
/**
 * Zoom module used to process the zoom for maps
 */
export declare class Zoom {
    private maps;
    toolBarGroup: Element;
    private groupElements;
    private currentToolbarEle;
    zoomingRect: Rect;
    selectionColor: string;
    private fillColor;
    private zoomInElements;
    private zoomOutElements;
    private zoomElements;
    private panElements;
    isPanning: boolean;
    mouseEnter: boolean;
    baseTranslatePoint: Point;
    private wheelEvent;
    private cancelEvent;
    currentScale: number;
    isTouch: boolean;
    rectZoomingStart: boolean;
    touchStartList: ITouches[] | TouchList;
    touchMoveList: ITouches[] | TouchList;
    previousTouchMoveList: ITouches[] | TouchList;
    private pinchRect;
    mouseDownPoints: Point;
    mouseMovePoints: Point;
    isDragZoom: boolean;
    currentLayer: LayerSettings;
    private panColor;
    zoomColor: string;
    browserName: string;
    isPointer: Boolean;
    private handled;
    private fingers;
    firstMove: boolean;
    private interaction;
    private lastScale;
    private pinchFactor;
    private startTouches;
    private shapeZoomLocation;
    private zoomshapewidth;
    private index;
    intersect: object[];
    private templateCount;
    private distanceX;
    private distanceY;
    mouseDownLatLong: object;
    mouseMoveLatLong: object;
    /**
     * @private
     */
    isSingleClick: boolean;
    /** @private */
    layerCollectionEle: Element;
    constructor(maps: Maps);
    /**
     * To perform zooming for maps
     * @param position
     * @param newZoomFactor
     * @param type
     */
    performZooming(position: Point, newZoomFactor: number, type: string): void;
    private triggerZoomEvent;
    private getTileTranslatePosition;
    performRectZooming(): void;
    private setInteraction;
    private updateInteraction;
    performPinchZooming(e: PointerEvent | TouchEvent): void;
    drawZoomRectangle(): void;
    /**
     * To animate the zooming process
     */
    private animateTransform;
    applyTransform(animate?: boolean): void;
    private markerTranslates;
    /**
     * To translate the layer template elements
     * @private
     */
    processTemplate(x: number, y: number, scale: number, maps: Maps): void;
    private dataLabelTranslate;
    private markerTranslate;
    panning(direction: PanDirection, xDifference: number, yDifference: number, mouseLocation?: PointerEvent | TouchEvent): void;
    private toAlignSublayer;
    toolBarZooming(zoomFactor: number, type: string): void;
    createZoomingToolbars(): void;
    performToolBarAction(e: PointerEvent): void;
    /**
     *
     * @private
     */
    performZoomingByToolBar(type: string): void;
    private panningStyle;
    private applySelection;
    showTooltip(e: PointerEvent): void;
    removeTooltip(): void;
    alignToolBar(): void;
    /**
     * To bind events.
     * @return {void}
     * @private
     */
    wireEvents(element: Element, process: Function): void;
    mapMouseWheel(e: WheelEvent): void;
    doubleClick(e: PointerEvent): void;
    mouseDownHandler(e: PointerEvent | TouchEvent): void;
    mouseMoveHandler(e: PointerEvent | TouchEvent): void;
    mouseUpHandler(e: PointerEvent | TouchEvent): void;
    mouseCancelHandler(e: PointerEvent): void;
    /**
     * To handle the click event for maps.
     * @param e
     */
    click(e: PointerEvent): void;
    getMousePosition(pageX: number, pageY: number): Point;
    addEventListener(): void;
    removeEventListener(): void;
    /**
     * Get module name.
     */
    protected getModuleName(): string;
    /**
     * To destroy the zoom.
     * @return {void}
     * @private
     */
    destroy(maps: Maps): void;
}
