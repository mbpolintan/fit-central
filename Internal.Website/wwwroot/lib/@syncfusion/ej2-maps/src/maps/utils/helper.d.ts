import { Maps, FontModel, BorderModel, LayerSettings } from '../../index';
import { Alignment, LayerSettingsModel } from '../index';
import { MarkerType, IShapeSelectedEventArgs, ITouches, IShapes, SelectionSettingsModel, IMarkerRenderingEventArgs, MarkerSettings, MarkerClusterData } from '../index';
import { ExportType } from '../utils/enum';
/**
 * Maps internal use of `Size` type
 */
export declare class Size {
    /**
     * height value for size
     */
    height: number;
    /**
     * width value for size
     */
    width: number;
    constructor(width: number, height: number);
}
/**
 * To find number from string
 * @private
 */
export declare function stringToNumber(value: string, containerSize: number): number;
/**
 * Method to calculate the width and height of the maps
 */
export declare function calculateSize(maps: Maps): void;
/**
 * Method to create svg for maps.
 */
export declare function createSvg(maps: Maps): void;
export declare function getMousePosition(pageX: number, pageY: number, element: Element): MapLocation;
/**
 * Method to convert degrees to radians
 */
export declare function degreesToRadians(deg: number): number;
/**
 * Convert radians to degrees method
 */
export declare function radiansToDegrees(radian: number): number;
/**
 * Method for converting from latitude and longitude values to points
 */
export declare function convertGeoToPoint(latitude: number, longitude: number, factor: number, layer: LayerSettings, mapModel: Maps): Point;
/**
 * Converting tile latitude and longitude to point
 */
export declare function convertTileLatLongToPoint(center: MapLocation, zoomLevel: number, tileTranslatePoint: MapLocation, isMapCoordinates: boolean): MapLocation;
/**
 * Method for calculate x point
 */
export declare function xToCoordinate(mapObject: Maps, val: number): number;
/**
 * Method for calculate y point
 */
export declare function yToCoordinate(mapObject: Maps, val: number): number;
/**
 * Method for calculate aitoff projection
 */
export declare function aitoff(x: number, y: number): Point;
/**
 * Method to round the number
 */
export declare function roundTo(a: number, b: number): number;
export declare function sinci(x: number): number;
export declare function acos(a: number): number;
/**
 * Method to calculate bound
 */
export declare function calculateBound(value: number, min: number, max: number): number;
/**
 * To trigger the download element
 * @param fileName
 * @param type
 * @param url
 */
export declare function triggerDownload(fileName: string, type: ExportType, url: string, isDownload: boolean): void;
/**
 * Map internal class for point
 */
export declare class Point {
    /**
     * Point x value
     */
    x: number;
    /**
     * Point Y value
     */
    y: number;
    constructor(x: number, y: number);
}
/**
 * Map internal class for min and max
 *
 */
export declare class MinMax {
    min: number;
    max: number;
    constructor(min: number, max: number);
}
/**
 * Map internal class locations
 */
export declare class GeoLocation {
    latitude: MinMax;
    longitude: MinMax;
    constructor(latitude: MinMax, longitude: MinMax);
}
/**
 * Function to measure the height and width of the text.
 * @param  {string} text
 * @param  {FontModel} font
 * @param  {string} id
 * @returns no
 * @private
 */
export declare function measureText(text: string, font: FontModel): Size;
/**
 * Internal use of text options
 * @private
 */
export declare class TextOption {
    anchor: string;
    id: string;
    transform: string;
    x: number;
    y: number;
    text: string | string[];
    baseLine: string;
    constructor(id?: string, x?: number, y?: number, anchor?: string, text?: string | string[], transform?: string, baseLine?: string);
}
/**
 * Internal use of path options
 * @private
 */
export declare class PathOption {
    id: string;
    opacity: number;
    fill: string;
    stroke: string;
    ['stroke-width']: number;
    ['stroke-dasharray']: string;
    d: string;
    constructor(id: string, fill: string, width: number, color: string, opacity?: number, dashArray?: string, d?: string);
}
/** @private */
export declare class ColorValue {
    r: number;
    g: number;
    b: number;
    constructor(r?: number, g?: number, b?: number);
}
/**
 * Internal use of rectangle options
 * @private
 */
export declare class RectOption extends PathOption {
    x: number;
    y: number;
    height: number;
    width: number;
    rx: number;
    ry: number;
    transform: string;
    ['stroke-dasharray']: string;
    constructor(id: string, fill: string, border: BorderModel, opacity: number, rect: Rect, rx?: number, ry?: number, transform?: string, dashArray?: string);
}
/**
 * Internal use of circle options
 * @private
 */
export declare class CircleOption extends PathOption {
    cy: number;
    cx: number;
    r: number;
    ['stroke-dasharray']: string;
    constructor(id: string, fill: string, border: BorderModel, opacity: number, cx: number, cy: number, r: number, dashArray: string);
}
/**
 * Internal use of polygon options
 * @private
 */
export declare class PolygonOption extends PathOption {
    points: string;
    constructor(id: string, points: string, fill: string, width: number, color: string, opacity?: number, dashArray?: string);
}
/**
 * Internal use of polyline options
 * @private
 */
export declare class PolylineOption extends PolygonOption {
    constructor(id: string, points: string, fill: string, width: number, color: string, opacity?: number, dashArray?: string);
}
/**
 * Internal use of line options
 * @private
 */
export declare class LineOption extends PathOption {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    constructor(id: string, line: Line, fill: string, width: number, color: string, opacity?: number, dashArray?: string);
}
/**
 * Internal use of line
 * @property
 */
export declare class Line {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    constructor(x1: number, y1: number, x2: number, y2: number);
}
/**
 * Internal use of map location type
 */
export declare class MapLocation {
    /**
     * To specify x value
     */
    x: number;
    /**
     * To specify y value
     */
    y: number;
    constructor(x: number, y: number);
}
/**
 * Internal use of type rect
 * @private
 */
export declare class Rect {
    x: number;
    y: number;
    height: number;
    width: number;
    constructor(x: number, y: number, width: number, height: number);
}
/**
 * Defines the pattern unit types for drawing the patterns in maps.
 */
export declare type patternUnits = 
/** Specifies the user space for maps. */
'userSpaceOnUse' | 
/** Specifies the bounding box for the object. */
'objectBoundingBox';
/**
 * Internal use for pattern creation.
 * @property
 */
export declare class PatternOptions {
    id: string;
    patternUnits: patternUnits;
    patternContentUnits: patternUnits;
    patternTransform: string;
    x: number;
    y: number;
    width: number;
    height: number;
    href: string;
    constructor(id: string, x: number, y: number, width: number, height: number, patternUnits?: patternUnits, patternContentUnits?: patternUnits, patternTransform?: string, href?: string);
}
/**
 * Internal rendering of text
 * @private
 */
export declare function renderTextElement(option: TextOption, style: FontModel, color: string, parent: HTMLElement | Element, isMinus?: boolean): Element;
/**
 * @private
 */
export declare function convertElement(element: HTMLCollection, markerId: string, data: Object, index: number, mapObj: Maps): HTMLElement;
export declare function formatValue(value: string, maps: Maps): string;
export declare function convertStringToValue(stringTemplate: string, format: string, data: Object, maps: Maps): string;
export declare function convertElementFromLabel(element: Element, labelId: string, data: object, index: number, mapObj: Maps): HTMLElement;
export declare function drawSymbols(shape: MarkerType, imageUrl: string, location: Point, markerID: string, shapeCustom: Object, markerCollection: Element, maps: Maps): Element;
export declare function getValueFromObject(data: object, value: string): object;
export declare function markerColorChoose(eventArgs: IMarkerRenderingEventArgs, data: object): IMarkerRenderingEventArgs;
export declare function markerShapeChoose(eventArgs: IMarkerRenderingEventArgs, data: object): IMarkerRenderingEventArgs;
export declare function clusterTemplate(currentLayer: LayerSettings, markerTemplate: HTMLElement | Element, maps: Maps, layerIndex: number, markerCollection: Element, layerElement: Element, check: boolean, zoomCheck: boolean): void;
export declare function mergeSeparateCluster(sameMarkerData: MarkerClusterData[], maps: Maps, markerElement: Element | HTMLElement): void;
export declare function clusterSeparate(sameMarkerData: MarkerClusterData[], maps: Maps, markerElement: Element | HTMLElement, isDom?: boolean): void;
export declare function marker(eventArgs: IMarkerRenderingEventArgs, markerSettings: MarkerSettings, markerData: object[], dataIndex: number, location: Point, transPoint: Point, markerID: string, offset: Point, scale: number, maps: Maps, markerCollection: Element): Element;
export declare function markerTemplate(eventArgs: IMarkerRenderingEventArgs, templateFn: Function, markerID: string, data: object, markerIndex: number, markerTemplate: HTMLElement, location: Point, scale: number, offset: Point, maps: Maps): HTMLElement;
/**
 * To maintain selection during page resize
 * @private
 */
export declare function maintainSelection(elementId: string[], elementClass: Element, element: Element, className: string): void;
/**
 * To maintain selection style class
 * @private
 */
export declare function maintainStyleClass(id: string, idClass: string, fill: string, opacity: string, borderColor: string, borderWidth: string, maps: Maps): void;
/**
 * Internal use of append shape element
 * @private
 */
export declare function appendShape(shape: Element, element: Element): Element;
/**
 * Internal rendering of Circle
 * @private
 */
export declare function drawCircle(maps: Maps, options: CircleOption, element?: Element): Element;
/**
 * Internal rendering of Rectangle
 * @private
 */
export declare function drawRectangle(maps: Maps, options: RectOption, element?: Element): Element;
/**
 * Internal rendering of Path
 * @private
 */
export declare function drawPath(maps: Maps, options: PathOption, element?: Element): Element;
/**
 * Internal rendering of Polygon
 * @private
 */
export declare function drawPolygon(maps: Maps, options: PolygonOption, element?: Element): Element;
/**
 * Internal rendering of Polyline
 * @private
 */
export declare function drawPolyline(maps: Maps, options: PolylineOption, element?: Element): Element;
/**
 * Internal rendering of Line
 * @private
 */
export declare function drawLine(maps: Maps, options: LineOption, element?: Element): Element;
/**
 * @private
 * Calculate marker shapes
 */
export declare function calculateShapes(maps: Maps, shape: MarkerType, options: PathOption, size: Size, location: MapLocation, markerEle: Element): Element;
/**
 * Internal rendering of Diamond
 * @private
 */
export declare function drawDiamond(maps: Maps, options: PathOption, size: Size, location: MapLocation, element?: Element): Element;
/**
 * Internal rendering of Triangle
 * @private
 */
export declare function drawTriangle(maps: Maps, options: PathOption, size: Size, location: MapLocation, element?: Element): Element;
/**
 * Internal rendering of Cross
 * @private
 */
export declare function drawCross(maps: Maps, options: PathOption, size: Size, location: MapLocation, element?: Element): Element;
/**
 * Internal rendering of HorizontalLine
 * @private
 */
export declare function drawHorizontalLine(maps: Maps, options: PathOption, size: Size, location: MapLocation, element?: Element): Element;
/**
 * Internal rendering of VerticalLine
 * @private
 */
export declare function drawVerticalLine(maps: Maps, options: PathOption, size: Size, location: MapLocation, element?: Element): Element;
/**
 * Internal rendering of Star
 * @private
 */
export declare function drawStar(maps: Maps, options: PathOption, size: Size, location: MapLocation, element?: Element): Element;
/**
 * Internal rendering of Balloon
 * @private
 */
export declare function drawBalloon(maps: Maps, options: PathOption, size: Size, location: MapLocation, element?: Element): Element;
/**
 * Internal rendering of Pattern
 * @private
 */
export declare function drawPattern(maps: Maps, options: PatternOptions, elements: Element[], element?: Element): Element;
/**
 * Method to get specific field and vaues from data.
 * @private
 */
export declare function getFieldData(dataSource: object[], fields: string[]): object[];
/**
 * To find the index of dataSource from shape properties
 */
export declare function checkShapeDataFields(dataSource: object[], properties: object, dataPath: string, propertyPath: string | string[], layer: LayerSettingsModel): number;
export declare function checkPropertyPath(shapeData: string, shapePropertyPath: string | string[], shape: object): string;
export declare function filter(points: MapLocation[], start: number, end: number): MapLocation[];
export declare function getRatioOfBubble(min: number, max: number, value: number, minValue: number, maxValue: number): number;
/**
 * To find the midpoint of the polygon from points
 */
export declare function findMidPointOfPolygon(points: MapLocation[], type: string): object;
/**
 * @private
 * Check custom path
 */
export declare function isCustomPath(layerData: Object[]): boolean;
/**
 * @private
 * Trim the title text
 */
export declare function textTrim(maxWidth: number, text: string, font: FontModel): string;
/**
 * Method to calculate x position of title
 */
export declare function findPosition(location: Rect, alignment: Alignment, textSize: Size, type: string): Point;
/**
 * To remove element by id
 */
export declare function removeElement(id: string): void;
/**
 *  To calculate map center position from pixel values
 */
export declare function calculateCenterFromPixel(mapObject: Maps, layer: LayerSettings): Point;
/**
 * @private
 */
export declare function getTranslate(mapObject: Maps, layer: LayerSettings, animate?: boolean): Object;
/**
 * @private
 */
export declare function getZoomTranslate(mapObject: Maps, layer: LayerSettings, animate?: boolean): Object;
/**
 * To get the html element by specified id
 */
export declare function fixInitialScaleForTile(map: Maps): void;
/**
 * To get the html element by specified id
 */
export declare function getElementByID(id: string): Element;
/**
 * To apply internalization
 */
export declare function Internalize(maps: Maps, value: number): string;
/**
 * Function     to compile the template function for maps.
 * @returns Function
 * @private
 */
export declare function getTemplateFunction(template: string): Function;
/**
 * Function to get element from id.
 * @returns Element
 * @private
 */
export declare function getElement(id: string): Element;
/**
 * Function to get shape data using target id
 */
export declare function getShapeData(targetId: string, map: Maps): {
    shapeData: object;
    data: object;
};
/**
 * Function to trigger shapeSelected event
 * @private
 */
export declare function triggerShapeEvent(targetId: string, selection: SelectionSettingsModel, maps: Maps, eventName: string): IShapeSelectedEventArgs;
/**
 * Function to get elements using class name
 */
export declare function getElementsByClassName(className: string): HTMLCollectionOf<Element>;
/**
 * Function to get elements using querySelectorAll
 */
/**
 * Function to get elements using querySelector
 */
export declare function querySelector(args: string, elementSelector: string): Element;
/**
 * Function to get the element for selection and highlight using public method
 */
export declare function getTargetElement(layerIndex: number, name: string, enable: boolean, map: Maps): Element;
/**
 * Function to create style element for highlight and selection
 */
export declare function createStyle(id: string, className: string, eventArgs: IShapeSelectedEventArgs | Object): Element;
/**
 * Function to customize the style for highlight and selection
 */
export declare function customizeStyle(id: string, className: string, eventArgs: IShapeSelectedEventArgs | Object): void;
/**
 * Function to trigger itemSelection event for legend selection and public method
 */
export declare function triggerItemSelectionEvent(selectionSettings: SelectionSettingsModel, map: Maps, targetElement: Element, shapeData: object, data: object): void;
/**
 * Function to remove class from element
 */
export declare function removeClass(element: Element): void;
/**
 * Animation Effect Calculation End
 * @private
 */
export declare function elementAnimate(element: Element, delay: number, duration: number, point: MapLocation, maps: Maps, ele?: string, radius?: number): void;
export declare function timeout(id: string): void;
export declare function showTooltip(text: string, size: string, x: number, y: number, areaWidth: number, areaHeight: number, id: string, element: Element, isTouch?: boolean): void;
export declare function wordWrap(tooltip: HTMLElement, text: string, x: number, y: number, size1: string[], width: number, areaWidth: number, element: Element): void;
/** @private */
export declare function createTooltip(id: string, text: string, top: number, left: number, fontSize: string): void;
/** @private */
export declare function drawSymbol(location: Point, shape: string, size: Size, url: string, options: PathOption): Element;
/** @private */
export declare function renderLegendShape(location: MapLocation, size: Size, shape: string, options: PathOption, url: string): IShapes;
/**
 * Animation Effect Calculation End
 * @private
 */
/** @private */
export declare function getElementOffset(childElement: HTMLElement, parentElement: HTMLElement): Size;
/** @private */
export declare function changeBorderWidth(element: Element, index: number, scale: number, maps: Maps): void;
/** @private */
export declare function changeNavaigationLineWidth(element: Element, index: number, scale: number, maps: Maps): void;
/** @private */
export declare function targetTouches(event: PointerEvent | TouchEvent): ITouches[];
/** @private */
export declare function calculateScale(startTouches: ITouches[], endTouches: ITouches[]): number;
/** @private */
export declare function getDistance(a: ITouches, b: ITouches): number;
/** @private */
export declare function getTouches(touches: ITouches[], maps: Maps): Object[];
/** @private */
export declare function getTouchCenter(touches: Object[]): Point;
/** @private */
export declare function sum(a: number, b: number): number;
/**
 * Animation Effect Calculation End
 * @private
 */
export declare function zoomAnimate(element: Element, delay: number, duration: number, point: MapLocation, scale: number, size: Size, maps: Maps): void;
/**
 * To process custom animation
 */
export declare function animate(element: Element, delay: number, duration: number, process: Function, end: Function): void;
/**
 * To get shape data file using Ajax.
 */
export declare class MapAjax {
    /**
     * MapAjax data options
     */
    dataOptions: string | Object;
    /**
     * MapAjax type value
     */
    type: string;
    /**
     * MapAjax async value
     */
    async: boolean;
    /**
     * MapAjax contentType value
     */
    contentType: string;
    /**
     * MapAjax sendData value
     */
    sendData: string | Object;
    constructor(options: string | Object, type?: string, async?: boolean, contentType?: string, sendData?: string | Object);
}
/**
 * Animation Translate
 * @private
 */
export declare function smoothTranslate(element: Element, delay: number, duration: number, point: MapLocation): void;
/**
 * To find compare should zoom factor with previous factor and current factor
 */
export declare function compareZoomFactor(scaleFactor: number, maps: Maps): void;
/**
 * To find zoom level for the min and max latitude values
 */
export declare function calculateZoomLevel(minLat: number, maxLat: number, minLong: number, maxLong: number, mapWidth: number, mapHeight: number, maps: Maps): number;
export declare function processResult(e: object): object;
