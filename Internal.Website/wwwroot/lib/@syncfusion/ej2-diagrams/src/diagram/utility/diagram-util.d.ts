import { PointModel } from './../primitives/point-model';
import { Rect } from './../primitives/rect';
import { DiagramElement, Corners } from './../core/elements/diagram-element';
import { TextStyleModel } from './../core/appearance-model';
import { PortVisibility, Shapes, DiagramAction, EventState, ChangeType } from './../enum/enum';
import { SelectorConstraints, ThumbsConstraints, DistributeOptions } from './../enum/enum';
import { Alignment, SegmentInfo } from '../rendering/canvas-interface';
import { PathElement } from './../core/elements/path-element';
import { DiagramNativeElement } from './../core/elements/native-element';
import { PathAnnotation } from './../objects/annotation';
import { TextModel } from './../objects/node-model';
import { Node } from './../objects/node';
import { NodeModel } from './../objects/node-model';
import { Connector } from './../objects/connector';
import { ConnectorModel } from './../objects/connector-model';
import { Diagram } from './../diagram';
import { Intersection } from './connector';
import { SelectorModel } from '../objects/node-model';
import { UserHandleModel } from '../interaction/selector-model';
import { PointPortModel } from './../objects/port-model';
import { ShapeAnnotationModel, PathAnnotationModel, HyperlinkModel, AnnotationModel } from './../objects/annotation-model';
import { DiagramHtmlElement } from '../core/elements/html-element';
import { TransformFactor as Transforms, Segment } from '../interaction/scroller';
import { SymbolPalette } from '../../symbol-palette/symbol-palette';
import { Selector } from '../objects/node';
import { Canvas } from '../core/containers/canvas';
import { TreeInfo, INode } from '../layout/layout-base';
import { MouseEventArgs } from '../interaction/event-handlers';
import { IBlazorDropEventArgs, IBlazorCollectionChangeEventArgs } from '../objects/interface/IElement';
/** @private */
export declare function completeRegion(region: Rect, selectedObjects: (NodeModel | ConnectorModel)[]): (NodeModel | ConnectorModel)[];
/** @private */
export declare function findNodeByName(nodes: (NodeModel | ConnectorModel)[], name: string): boolean;
/**
 * @private
 */
export declare function findObjectType(drawingObject: NodeModel | ConnectorModel): string;
/**
 * @private
 */
export declare function setSwimLaneDefaults(child: NodeModel | ConnectorModel, node: NodeModel | ConnectorModel): void;
/**
 * @private
 */
export declare function getSpaceValue(intervals: number[], isLine: boolean, i: number, space: number): number;
/**
 * @private
 */
export declare function getInterval(intervals: number[], isLine: boolean): number[];
/**
 * @private
 */
export declare function setUMLActivityDefaults(child: NodeModel | ConnectorModel, node: NodeModel | ConnectorModel): void;
/**
 * @private
 */
export declare function setConnectorDefaults(child: ConnectorModel, node: ConnectorModel): void;
/** @private */
export declare function findNearestPoint(reference: PointModel, start: PointModel, end: PointModel): PointModel;
/** @private */
export declare function isDiagramChild(htmlLayer: HTMLElement): boolean;
/** @private */
export declare function groupHasType(node: NodeModel, type: Shapes, nameTable: {}): boolean;
/** @private */
export declare function updateDefaultValues(actualNode: NodeModel | ConnectorModel, plainValue: NodeModel | ConnectorModel, defaultValue: object, property?: NodeModel | ConnectorModel, oldKey?: string): void;
/** @private */
export declare function updateLayoutValue(actualNode: TreeInfo, defaultValue: object, nodes?: INode[], node?: INode): void;
/** @private */
export declare function isPointOverConnector(connector: ConnectorModel, reference: PointModel): boolean;
/** @private */
export declare function intersect3(lineUtil1: Segment, lineUtil2: Segment): Intersection;
/** @private */
export declare function intersect2(start1: PointModel, end1: PointModel, start2: PointModel, end2: PointModel): PointModel;
/** @private */
export declare function getLineSegment(x1: number, y1: number, x2: number, y2: number): Segment;
/** @private */
export declare function getPoints(element: DiagramElement, corners: Corners, padding?: number): PointModel[];
/**
 * @private
 * sets the offset of the tooltip.
 * @param {Diagram} diagram
 * @param {PointModel} mousePosition
 * @param {NodeModel | ConnectorModel} node
 */
export declare function getTooltipOffset(diagram: Diagram, mousePosition: PointModel, node: NodeModel | ConnectorModel): PointModel;
/** @private */
export declare function sort(objects: (NodeModel | ConnectorModel)[], option: DistributeOptions): (NodeModel | ConnectorModel)[];
/** @private */
export declare function getAnnotationPosition(pts: PointModel[], annotation: PathAnnotation, bound: Rect): SegmentInfo;
/** @private */
export declare function getOffsetOfConnector(points: PointModel[], annotation: PathAnnotation, bounds: Rect): SegmentInfo;
/** @private */
export declare function getAlignedPosition(annotation: PathAnnotation): number;
/** @private */
export declare function alignLabelOnSegments(obj: PathAnnotation, ang: number, pts: PointModel[]): Alignment;
/** @private */
export declare function getBezierDirection(src: PointModel, tar: PointModel): string;
/** @private */
export declare function removeChildNodes(node: NodeModel, diagram: Diagram): void;
/** @private */
export declare function serialize(model: Diagram): string;
/** @private */
export declare function deserialize(model: string, diagram: Diagram): Object;
/** @private */
export declare function upgrade(dataObj: Diagram): Diagram;
/** @private */
export declare function updateStyle(changedObject: TextStyleModel, target: DiagramElement): void;
/** @private */
export declare function updateHyperlink(changedObject: HyperlinkModel, target: DiagramElement, actualAnnotation: AnnotationModel): void;
/** @private */
export declare function updateShapeContent(content: DiagramElement, actualObject: Node, diagram: Diagram): void;
/** @private */
export declare function updateShape(node: Node, actualObject: Node, oldObject: Node, diagram: Diagram): void;
/** @private */
export declare function updateContent(newValues: Node, actualObject: Node, diagram: Diagram): void;
/** @private */
export declare function updateUmlActivityNode(actualObject: Node, newValues: Node): void;
/** @private */
export declare function getUMLFinalNode(node: Node): Canvas;
/** @private */
export declare function getUMLActivityShapes(umlActivityShape: PathElement, content: DiagramElement, node: Node): DiagramElement;
/**   @private  */
export declare function removeGradient(svgId: string): void;
/** @private */
export declare function removeItem(array: String[], item: string): void;
/** @private */
export declare function updateConnector(connector: Connector, points: PointModel[], diagramActions?: DiagramAction): void;
/** @private */
export declare function getUserHandlePosition(selectorItem: SelectorModel, handle: UserHandleModel, transform?: Transforms): PointModel;
/** @private */
export declare function canResizeCorner(selectorConstraints: SelectorConstraints, action: string, thumbsConstraints: ThumbsConstraints, selectedItems: Selector): boolean;
/** @private */
export declare function canShowCorner(selectorConstraints: SelectorConstraints, action: string): boolean;
/** @private */
export declare function checkPortRestriction(port: PointPortModel, portVisibility: PortVisibility): number;
/** @private */
export declare function findAnnotation(node: NodeModel | ConnectorModel, id: string): ShapeAnnotationModel | PathAnnotationModel | TextModel;
/** @private */
export declare function findPort(node: NodeModel | ConnectorModel, id: string): PointPortModel;
/** @private */
export declare function getInOutConnectPorts(node: NodeModel, isInConnect: boolean): PointPortModel;
/** @private */
export declare function findObjectIndex(node: NodeModel | ConnectorModel, id: string, annotation?: boolean): string;
/** @private */
export declare function getObjectFromCollection(obj: (NodeModel | ConnectorModel)[], id: string): boolean;
/** @private */
export declare function scaleElement(element: DiagramElement, sw: number, sh: number, refObject: DiagramElement): void;
/** @private */
export declare function arrangeChild(obj: Node, x: number, y: number, nameTable: {}, drop: boolean, diagram: Diagram | SymbolPalette): void;
/** @private */
export declare function insertObject(obj: NodeModel | ConnectorModel, key: string, collection: Object[]): void;
/** @private */
export declare function getElement(element: DiagramHtmlElement | DiagramNativeElement): Object;
/** @private */
export declare function getCollectionChangeEventArguements(args1: IBlazorCollectionChangeEventArgs, obj: NodeModel | ConnectorModel, state: EventState, type: ChangeType): IBlazorCollectionChangeEventArgs;
/** @private */
export declare function getDropEventArguements(args: MouseEventArgs, arg: IBlazorDropEventArgs): IBlazorDropEventArgs;
/** @private */
export declare function getPoint(x: number, y: number, w: number, h: number, angle: number, offsetX: number, offsetY: number, cornerPoint: PointModel): PointModel;
/**
 * Get the object as Node | Connector
 * @param {Object} obj
 */
export declare let getObjectType: Function;
/** @private */
export declare let flipConnector: Function;
/** @private */
export declare let updatePortEdges: Function;
/** @private */
export declare let alignElement: Function;
/** @private */
export declare let cloneSelectedObjects: Function;
/** @private */
export declare let updatePathElement: Function;
/** @private */
export declare let checkPort: Function;
/** @private */
export declare let findPath: Function;
/** @private */
export declare let findDistance: Function;
/** @private */
export declare function cloneBlazorObject(args: object): Object;
/** @private */
export declare function checkBrowserInfo(): boolean;
/** @private */
export declare function canMeasureDecoratorPath(objects: string[]): boolean;
