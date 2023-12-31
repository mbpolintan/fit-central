import { Node } from './../objects/node';
import { DiagramElement } from './../core/elements/diagram-element';
import { Canvas } from './../core/containers/canvas';
import { Container } from './../core/containers/container';
import { PathElement } from './../core/elements/path-element';
import { TextElement } from './../core/elements/text-element';
import { Diagram } from './../../diagram/diagram';
import { Connector } from './../objects/connector';
import { ConnectorModel } from './../objects/connector-model';
import { BpmnSubEventModel } from './../objects/node-model';
import { BpmnSubProcessModel } from './../objects/node-model';
import { NodeModel, BpmnAnnotationModel } from './../objects/node-model';
import { ActiveLabel } from '../objects/interface/interfaces';
import { Rect } from '../primitives/rect';
import { Size } from '../primitives/size';
/**
 * BPMN Diagrams contains the BPMN functionalities
 */
export declare class BpmnDiagrams {
    /**   @private  */
    annotationObjects: {};
    /**   @private  */
    readonly textAnnotationConnectors: ConnectorModel[];
    /** @private */
    getTextAnnotationConn(obj: NodeModel | ConnectorModel): ConnectorModel[];
    /**   @private  */
    getSize(node: NodeModel, content: DiagramElement): Size;
    /** @private */
    initBPMNContent(content: DiagramElement, node: Node, diagram: Diagram): DiagramElement;
    /** @private */
    getBPMNShapes(node: Node): PathElement;
    /** @private */
    /** @private */
    getBPMNGatewayShape(node: Node): Canvas;
    /** @private */
    getBPMNDataObjectShape(node: Node): Canvas;
    /** @private */
    getBPMNTaskShape(node: Node): Canvas;
    /** @private */
    getBPMNEventShape(node: Node, subEvent: BpmnSubEventModel, sub?: boolean, id?: string): Canvas;
    private setEventVisibility;
    private setSubProcessVisibility;
    /** @private */
    getBPMNSubProcessShape(node: Node): Canvas;
    private getBPMNSubEvent;
    private getBPMNSubProcessTransaction;
    /** @private */
    getBPMNSubProcessLoopShape(node: Node): PathElement;
    /** @private */
    drag(obj: Node, tx: number, ty: number, diagram: Diagram): void;
    /** @private */
    dropBPMNchild(target: Node, source: Node, diagram: Diagram): void;
    /** @private */
    updateDocks(obj: Node, diagram: Diagram): void;
    /** @private */
    removeBpmnProcesses(currentObj: Node, diagram: Diagram): void;
    /** @private */
    removeChildFromBPMN(wrapper: Container, name: string): void;
    /** @private */
    removeProcess(id: string, diagram: Diagram): void;
    /** @private */
    addProcess(process: NodeModel, parentId: string, diagram: Diagram): void;
    /** @private */
    getChildrenBound(node: NodeModel, excludeChild: string, diagram: Diagram): Rect;
    /** @private */
    updateSubProcessess(bound: Rect, obj: NodeModel, diagram: Diagram): void;
    /** @private */
    getBPMNCompensationShape(node: Node, compensationNode: PathElement): PathElement;
    /** @private */
    getBPMNActivityShape(node: Node): Canvas;
    /** @private */
    getBPMNSubprocessEvent(node: Node, subProcessEventsShapes: Canvas, events: BpmnSubEventModel): void;
    /** @private */
    getBPMNAdhocShape(node: Node, adhocNode: PathElement, subProcess?: BpmnSubProcessModel): PathElement;
    /** @private */
    private getBPMNTextAnnotation;
    /** @private */
    private renderBPMNTextAnnotation;
    /** @private */
    getTextAnnotationWrapper(node: NodeModel, id: string): TextElement;
    /** @private */
    addAnnotation(node: NodeModel, annotation: BpmnAnnotationModel, diagram: Diagram): ConnectorModel;
    private clearAnnotations;
    /** @private */
    checkAndRemoveAnnotations(node: NodeModel, diagram: Diagram): boolean;
    private removeAnnotationObjects;
    private setAnnotationPath;
    /**   @private  */
    isBpmnTextAnnotation(activeLabel: ActiveLabel, diagram: Diagram): NodeModel;
    /** @private */
    updateTextAnnotationContent(parentNode: NodeModel, activeLabel: ActiveLabel, text: string, diagram: Diagram): void;
    /**   @private  */
    updateQuad(actualObject: Node, diagram: Diagram): void;
    /** @private */
    updateTextAnnotationProp(actualObject: Node, oldObject: Node, diagram: Diagram): void;
    /** @private */
    private getSubprocessChildCount;
    /** @private */
    private getTaskChildCount;
    /** @private */
    private setStyle;
    /** @private */
    updateBPMN(changedProp: Node, oldObject: Node, actualObject: Node, diagram: Diagram): void;
    /** @private */
    updateBPMNStyle(elementWrapper: DiagramElement, changedProp: string): void;
    /** @private */
    updateBPMNGateway(node: Node, changedProp: Node): void;
    /** @private */
    updateBPMNDataObject(node: Node, newObject: Node, oldObject: Node): void;
    /** @private */
    getEvent(node: Node, oldObject: Node, event: string, child0: DiagramElement, child1: DiagramElement, child2: DiagramElement): void;
    /** @private */
    private updateEventVisibility;
    /** @private */
    updateBPMNEvent(node: Node, newObject: Node, oldObject: Node): void;
    /** @private */
    updateBPMNEventTrigger(node: Node, newObject: Node): void;
    /** @private */
    updateBPMNActivity(node: Node, newObject: Node, oldObject: Node, diagram: Diagram): void;
    /** @private */
    updateBPMNActivityTask(node: Node, newObject: Node): void;
    /** @private */
    updateBPMNActivityTaskLoop(node: Node, newObject: Node, x: number, subChildCount: number, area: number, start: number): void;
    /** @private */
    private updateChildMargin;
    /** @private */
    updateBPMNActivitySubProcess(node: Node, newObject: Node, oldObject: Node, diagram: Diagram): void;
    /** @private */
    updateBPMNSubProcessEvent(node: Node, newObject: Node, oldObject: Node, diagram: Diagram): void;
    private updateBPMNSubEvent;
    private updateBPMNSubProcessTransaction;
    /** @private */
    getEventSize(events: BpmnSubEventModel, wrapperChild: Canvas): void;
    /** @private */
    updateBPMNSubProcessAdhoc(node: Node, oldObject: Node, subProcess: BpmnSubProcessModel, x: number, subChildCount: number, area: number): void;
    /** @private */
    updateBPMNSubProcessBoundary(node: Node, subProcess: BpmnSubProcessModel): void;
    /** @private */
    updateElementVisibility(node: Node, visible: boolean, diagram: Diagram): void;
    /** @private */
    updateBPMNSubProcessCollapsed(node: Node, oldObject: Node, subProcess: BpmnSubProcessModel, x: number, subChildCount: number, area: number, diagram: Diagram): void;
    /** @private */
    updateBPMNSubProcessCompensation(node: Node, oldObject: Node, subProcess: BpmnSubProcessModel, x: number, subChildCount: number, area: number): void;
    /** @private */
    updateBPMNSubProcessLoop(node: Node, oldObject: Node, subProcess: BpmnSubProcessModel, x: number, subChildCount: number, area: number): void;
    /** @private */
    updateBPMNConnector(actualObject: Connector, oldObject: Connector, connection: Connector, diagram: Diagram): Connector;
    /** @private */
    getSequence(actualObject: Connector, oldObject: Connector, connection: Connector, diagram: Diagram): Connector;
    /** @private */
    getAssociation(actualObject: Connector, oldObject: Connector, connection: Connector, diagram: Diagram): Connector;
    /** @private */
    getMessage(actualObject: Connector, oldObject: Connector, connection: Connector, diagram: Diagram): Connector;
    private setSizeForBPMNEvents;
    /** @private */
    updateAnnotationDrag(node: NodeModel, diagram: Diagram, tx: number, ty: number): boolean;
    private getAnnotationPathAngle;
    private setSizeForBPMNGateway;
    private setSizeForBPMNDataObjects;
    private setSizeForBPMNActivity;
    private updateDiagramContainerVisibility;
    /**
     * Constructor for the BpmnDiagrams module
     * @private
     */
    constructor();
    /**
     * To destroy the BpmnDiagrams module
     * @return {void}
     * @private
     */
    destroy(): void;
    /**
     * Get module name.
     */
    protected getModuleName(): string;
}
export declare function getBpmnShapePathData(shape: string): string;
export declare function getBpmnTriggerShapePathData(shape: string): string;
export declare function getBpmnGatewayShapePathData(shape: string): string;
export declare function getBpmnTaskShapePathData(shape: string): string;
export declare function getBpmnLoopShapePathData(shape: string): string;
