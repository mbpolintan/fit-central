import { Component, L10n, Droppable } from '@syncfusion/ej2-base';
import { ModuleDeclaration, EmitType } from '@syncfusion/ej2-base';
import { INotifyPropertyChanged } from '@syncfusion/ej2-base';
import { DiagramModel } from './diagram-model';
import { DiagramRenderer } from './rendering/renderer';
import { PageSettingsModel, ScrollSettingsModel } from './diagram/page-settings-model';
import { DiagramElement } from './core/elements/diagram-element';
import { ServiceLocator } from './objects/service';
import { IElement, IDataLoadedEventArgs, ISelectionChangeEventArgs, IClickEventArgs } from './objects/interface/IElement';
import { UserHandleEventsArgs } from './objects/interface/IElement';
import { IKeyEventArgs } from './objects/interface/IElement';
import { ICommandExecuteEventArgs } from './objects/interface/IElement';
import { ISizeChangeEventArgs, IConnectionChangeEventArgs, IEndChangeEventArgs, IDoubleClickEventArgs } from './objects/interface/IElement';
import { ICollectionChangeEventArgs, IPropertyChangeEventArgs, IDraggingEventArgs, IRotationEventArgs } from './objects/interface/IElement';
import { ISegmentCollectionChangeEventArgs } from './objects/interface/IElement';
import { IDragEnterEventArgs, IDragLeaveEventArgs, IDragOverEventArgs, IDropEventArgs } from './objects/interface/IElement';
import { ITextEditEventArgs, IHistoryChangeArgs, IScrollChangeEventArgs } from './objects/interface/IElement';
import { IMouseEventArgs } from './objects/interface/IElement';
import { IBlazorCustomHistoryChangeArgs, IImageLoadEventArgs } from './objects/interface/IElement';
import { IExpandStateChangeEventArgs } from './objects/interface/IElement';
import { ZoomOptions, IPrintOptions, IExportOptions, IFitOptions, ActiveLabel } from './objects/interface/interfaces';
import { View } from './objects/interface/interfaces';
import { Container } from './core/containers/container';
import { Node } from './objects/node';
import { Connector } from './objects/connector';
import { ConnectorModel } from './objects/connector-model';
import { RulerSettingsModel } from './diagram/ruler-settings-model';
import { SnapSettingsModel } from './diagram/grid-lines-model';
import { NodeModel, BpmnAnnotationModel } from './objects/node-model';
import { LaneModel, PhaseModel } from './objects/node-model';
import { DiagramTools, AlignmentMode } from './enum/enum';
import { BlazorAction } from './enum/enum';
import { DiagramConstraints, BridgeDirection, AlignmentOptions, PortVisibility, DiagramEvent } from './enum/enum';
import { DistributeOptions, SizingOptions, RenderingMode, DiagramAction, NudgeDirection } from './enum/enum';
import { RealAction, HistoryChangeAction } from './enum/enum';
import { Rect } from './primitives/rect';
import { PointPortModel } from './objects/port-model';
import { ShapeAnnotationModel, AnnotationModel, PathAnnotationModel } from './objects/annotation-model';
import { ShapeAnnotation, PathAnnotation } from './objects/annotation';
import { PointModel } from './primitives/point-model';
import { GridPanel } from './core/containers/grid';
import { DataSourceModel } from './diagram/data-source-model';
import { LayoutModel } from './layout/layout-base-model';
import { ILayout } from './layout/layout-base';
import { DataBinding } from './data-binding/data-binding';
import { Selector } from './objects/node';
import { SelectorModel } from './objects/node-model';
import { CommandHandler } from './interaction/command-manager';
import { DiagramScroller } from './interaction/scroller';
import { Actions } from './interaction/actions';
import { ToolBase } from './interaction/tool';
import { BpmnDiagrams } from './objects/bpmn';
import { DiagramContextMenu } from './objects/context-menu';
import { ConnectorBridging } from './objects/connector-bridging';
import { SpatialSearch } from './interaction/spatial-search/spatial-search';
import { HistoryEntry, History } from './diagram/history';
import { UndoRedo } from './objects/undo-redo';
import { ConnectorEditing } from './interaction/connector-editing';
import { Ruler } from '../ruler/index';
import { BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { CommandManagerModel, ContextMenuSettingsModel } from './diagram/keyboard-commands-model';
import { Snapping } from './objects/snapping';
import { DiagramTooltipModel } from './objects/tooltip-model';
import { ShadowModel } from './core/appearance-model';
import { RadialTree } from './layout/radial-tree';
import { HierarchicalTree } from './layout/hierarchical-tree';
import { ComplexHierarchicalTree } from './layout/complex-hierarchical-tree';
import { MindMap } from './layout/mind-map';
import { Tooltip } from '@syncfusion/ej2-popups';
import { PrintAndExport } from './print-settings';
import { SymmetricLayout } from './layout/symmetrical-layout';
import { LayoutAnimation } from './objects/layout-animation';
import { LayerModel } from './diagram/layer-model';
import { SerializationSettingsModel } from './diagram/serialization-settings-model';
import { CustomCursorActionModel } from './diagram/custom-cursor-model';
import { LineRouting } from './interaction/line-routing';
import { DiagramSettingsModel } from '../diagram/diagram-settings-model';
/**
 * Represents the Diagram control
 * ```html
 * <div id='diagram'/>
 * ```
 * ```typescript
 * let diagram: Diagram = new Diagram({
 * width:'1000px', height:'500px' });
 * diagram.appendTo('#diagram');
 * ```
 */
export declare class Diagram extends Component<HTMLElement> implements INotifyPropertyChanged {
    /**
     * `organizationalChartModule` is used to arrange the nodes in a organizational chart like struture
     * @private
     */
    organizationalChartModule: HierarchicalTree;
    /**
     * `mindMapChartModule` is used to arrange the nodes in a mind map like structure
     */
    mindMapChartModule: MindMap;
    /**
     * `radialTreeModule` is used to arrange the nodes in a radial tree like structure
     * @ignoreapilink
     */
    radialTreeModule: RadialTree;
    /**
     * `complexHierarchicalTreeModule` is used to arrange the nodes in a hierarchical tree like structure
     * @private
     */
    complexHierarchicalTreeModule: ComplexHierarchicalTree;
    /**
     * `dataBindingModule` is used to populate nodes from given data source
     * @private
     */
    dataBindingModule: DataBinding;
    /**
     * `snappingModule` is used to Snap the objects
     * @private
     */
    snappingModule: Snapping;
    /**
     * `printandExportModule` is used to print or export the objects
     * @private
     */
    printandExportModule: PrintAndExport;
    /**
     * `bpmnModule` is used to add built-in BPMN Shapes to diagrams
     * @private
     */
    bpmnModule: BpmnDiagrams;
    /**
     * 'symmetricalLayoutModule' is usd to render layout in symmetrical method
     * @private
     */
    symmetricalLayoutModule: SymmetricLayout;
    /**
     * `bridgingModule` is used to add bridges to connectors
     * @private
     */
    bridgingModule: ConnectorBridging;
    /**
     * `undoRedoModule` is used to revert and restore the changes
     * @private
     */
    undoRedoModule: UndoRedo;
    /**
     * `layoutAnimateModule` is used to revert and restore the changes
     * @private
     */
    layoutAnimateModule: LayoutAnimation;
    /**
     * 'contextMenuModule' is used to manipulate context menu
     * @private
     */
    contextMenuModule: DiagramContextMenu;
    /**
     * `connectorEditingToolModule` is used to edit the segments for connector
     * @private
     */
    connectorEditingToolModule: ConnectorEditing;
    /**
     * `lineRoutingModule` is used to connect the node's without overlapping
     * @private
     */
    lineRoutingModule: LineRouting;
    /**
     * Defines the width of the diagram model.
     * ```html
     * <div id='diagram'/>
     * ```
     * ```typescript
     * let diagram: Diagram = new Diagram({
     * width:'1000px', height:'500px' });
     * diagram.appendTo('#diagram');
     * ```
     * @default '100%'
     */
    width: string | number;
    /**
     * Defines the diagram rendering mode.
     * * SVG - Renders the diagram objects as SVG elements
     * * Canvas - Renders the diagram in a canvas
     * @default 'SVG'
     */
    mode: RenderingMode;
    /**
     * Defines the height of the diagram model.
     * @default '100%'
     */
    height: string | number;
    /**
     * Defines type of menu that appears when you perform right-click operation
     * An object to customize the context menu of diagram
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let diagram: Diagram = new Diagram({
     * ...
     *   contextMenuSettings: { show: true },
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     */
    contextMenuSettings: ContextMenuSettingsModel;
    /**
     * Constraints are used to enable/disable certain behaviors of the diagram.
     * * None - Disables DiagramConstraints constraints
     * * Bridging - Enables/Disables Bridging support for connector
     * * UndoRedo - Enables/Disables the Undo/Redo support
     * * Tooltip - Enables/Disables Tooltip support
     * * UserInteraction - Enables/Disables editing diagram interactively
     * * ApiUpdate - Enables/Disables editing diagram through code
     * * PageEditable - Enables/Disables editing diagrams both interactively and through code
     * * Zoom - Enables/Disables Zoom support for the diagram
     * * PanX - Enables/Disable PanX support for the diagram
     * * PanY - Enables/Disable PanY support for the diagram
     * * Pan - Enables/Disable Pan support the diagram
     * @default 'Default'
     * @aspNumberEnum
     * @blazorNumberEnum
     */
    constraints: DiagramConstraints;
    /**
     * Defines the precedence of the interactive tools. They are,
     * * None - Disables selection, zooming and drawing tools
     * * SingleSelect - Enables/Disables single select support for the diagram
     * * MultipleSelect - Enables/Disable MultipleSelect select support for the diagram
     * * ZoomPan - Enables/Disable ZoomPan support for the diagram
     * * DrawOnce - Enables/Disable ContinuousDraw support for the diagram
     * * ContinuousDraw - Enables/Disable ContinuousDraw support for the diagram
     * @default 'Default'
     * @aspNumberEnum
     * @blazorNumberEnum

     */
    tool: DiagramTools;
    /**
     * Defines the direction of the bridge that is inserted when the segments are intersected
     * * Top - Defines the direction of the bridge as Top
     * * Bottom - Defines the direction of the bridge as Bottom
     * * Left - Sets the bridge direction as left
     * * Right - Sets the bridge direction as right
     * @default top
     */
    bridgeDirection: BridgeDirection;
    /**
     * Defines the background color of the diagram
     * @default 'transparent'
     */
    backgroundColor: string;
    /**
     * Defines the gridlines and defines how and when the objects have to be snapped
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let horizontalGridlines: GridlinesModel = {lineColor: 'black', lineDashArray: '1,1' };
     * let verticalGridlines: GridlinesModel = {lineColor: 'black', lineDashArray: '1,1'};
     * let diagram: Diagram = new Diagram({
     * ...
     * snapSettings: { horizontalGridlines, verticalGridlines, constraints: SnapConstraints.ShowLines,
     * snapObjectDistance: 5, snapAngle: 5 },
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default {}
     */
    snapSettings: SnapSettingsModel;
    /**
     * Defines the properties of both horizontal and vertical guides/rulers to measure the diagram area.
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let arrange: Function = (args: IArrangeTickOptions) => {
     * if (args.tickInterval % 10 == 0) {
     * args.tickLength = 25;
     * }
     * }
     * let diagram: Diagram = new Diagram({
     * ...
     * rulerSettings: { showRulers: true,
     * horizontalRuler: { segmentWidth: 50, orientation: 'Horizontal', interval: 10,  arrangeTick: arrange },
     * verticalRuler: {segmentWidth: 200,interval: 20, thickness: 20,
     * tickAlignment: 'LeftOrTop', segmentWidth: 50, markerColor: 'red' }
     * },
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default {}
     */
    rulerSettings: RulerSettingsModel;
    /**
     * Page settings enable to customize the appearance, width, and height of the Diagram page.
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let diagram: Diagram = new Diagram({
     * ...
     * pageSettings: {  width: 800, height: 600, orientation: 'Landscape',
     * background: { color: 'blue' }, boundaryConstraints: 'Infinity'},
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default {}
     */
    pageSettings: PageSettingsModel;
    /**
     * Defines the serialization settings of diagram.
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let diagram: Diagram = new Diagram({
     * ...
     * serializationSettings: { preventDefaults: true },
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default {}
     */
    serializationSettings: SerializationSettingsModel;
    /**
     * Defines the collection of nodes
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [{
     *           id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
     *           annotations: [{ content: 'Default Shape' }]
     *       },
     *       {
     *           id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
     *           shape: {
     *               type: 'Basic', shape: 'Ellipse'
     *           },
     *           annotations: [{ content: 'Path Element' }]
     *       }
     *       ];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes: nodes,
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     * @blazorType ObservableCollection<DiagramNode>
     */
    nodes: NodeModel[];
    /**
     * Defines the object to be drawn using drawing tool
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let diagram: Diagram = new Diagram({
     * ...
     * drawingObject : {id: 'connector3', type: 'Straight'},
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    drawingObject: NodeModel | ConnectorModel;
    /**
     * Defines a collection of objects, used to create link between two points, nodes or ports to represent the relationships between them
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     *       let connectors: ConnectorModel[] = [{
     *           id: 'connector1',
     *           type: 'Straight',
     *           sourcePoint: { x: 100, y: 300 },
     *           targetPoint: { x: 200, y: 400 },
     *       }];
     * let diagram: Diagram = new Diagram({
     * ...
     *       connectors: connectors,
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default []
     * @blazorType ObservableCollection<DiagramConnector>
     */
    connectors: ConnectorModel[];
    /**
     * Defines the basic elements for the diagram
     * @default []
     * @hidden
     */
    basicElements: DiagramElement[];
    /**
     * Defines the tooltip that should be shown when the mouse hovers over a node or connector
     * An object that defines the description, appearance and alignments of tooltip
     * @default {}
     */
    tooltip: DiagramTooltipModel;
    /**
     * Configures the data source that is to be bound with diagram
     * @default {}
     */
    dataSourceSettings: DataSourceModel;
    /**
     * Allows the user to save custom information/data about diagram
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    addInfo: Object;
    /**
     * Customizes the undo redo functionality
     * @default undefined
     */
    historyManager: History;
    /**
     * Customizes the node template
     * @default undefined
     */
    nodeTemplate: string;
    /**
     * Customizes the annotation template
     * @default undefined
     */
    annotationTemplate: string;
    /**
     * This property represents the template content of a user handle. The user can define any HTML element as a template.
     * @default undefined
     */
    userHandleTemplate: string;
    /**
     * Helps to return the default properties of node
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [{
     *           id: 'node1', height: 100, offsetX: 100, offsetY: 100,
     *           annotations: [{ content: 'Default Shape' }]
     *       },
     *       {
     *           id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
     *           shape: {
     *               type: 'Basic', shape: 'Ellipse'
     *           },
     *           annotations: [{ content: 'Ellipse' }]
     *       }
     *       ];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes: nodes,
     * getNodeDefaults: (node: NodeModel) => {
     *   let obj: NodeModel = {};
     *   if (obj.width === undefined) {
     *       obj.width = 145;
     *   }
     *   obj.style = { fill: '#357BD2', strokeColor: 'white' };
     *   obj.annotations = [{ style: { color: 'white', fill: 'transparent' } }];
     *   return obj;
     *    },
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined

     */
    getNodeDefaults: Function | string;
    /**
     * Helps to assign the default properties of nodes
     * @blazorType DiagramNode
     */
    nodeDefaults: NodeModel;
    /**
     * Helps to return the default properties of connector
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     *       let connectors: ConnectorModel[] = [{
     *           id: 'connector1',
     *           sourcePoint: { x: 100, y: 300 },
     *           targetPoint: { x: 200, y: 400 },
     *       }];
     * let diagram: Diagram = new Diagram({
     * ...
     *   connectors: connectors,
     *   getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
     *   let connObj: ConnectorModel = {};
     *   connObj.targetDecorator ={ shape :'None' };
     *   connObj.type = 'Orthogonal';
     *   return connObj;
     *   },
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined

     */
    getConnectorDefaults: Function | string;
    /**
     * Helps to assign the default properties of connector
     * @blazorType DiagramConnector
     */
    connectorDefaults: ConnectorModel;
    /**
     * setNodeTemplate helps to customize the content of a node
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let getTextElement: Function = (text: string) => {
     * let textElement: TextElement = new TextElement();
     * textElement.width = 50;
     * textElement.height = 20;
     * textElement.content = text;
     * return textElement;
     * };
     * let nodes: NodeModel[] = [{
     *           id: 'node1', height: 100, offsetX: 100, offsetY: 100,
     *           annotations: [{ content: 'Default Shape' }]
     *       },
     *       {
     *           id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100
     *       }
     *       ];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes: nodes,
     * setNodeTemplate : setNodeTemplate,
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * function setNodeTemplate() {
     * setNodeTemplate: (obj: NodeModel, diagram: Diagram): StackPanel => {
     *   if (obj.id === 'node2') {
     *       let table: StackPanel = new StackPanel();
     *       table.orientation = 'Horizontal';
     *       let column1: StackPanel = new StackPanel();
     *       column1.children = [];
     *       column1.children.push(getTextElement('Column1'));
     *       addRows(column1);
     *       let column2: StackPanel = new StackPanel();
     *       column2.children = [];
     *       column2.children.push(getTextElement('Column2'));
     *       addRows(column2);
     *       table.children = [column1, column2];
     *       return table;
     *   }
     *   return null;
     *   }
     * ...
     * }
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined

     */
    setNodeTemplate: Function | string;
    /**
     * Allows to set accessibility content for diagram objects
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    /**
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let connector1: ConnectorModel = {
     *          id: 'connector1', type: 'Straight',
     *          sourcePoint: { x: 100, y: 100 },targetPoint: { x: 200, y: 200 },
     *          annotations: [{ 'content': 'label', 'offset': 0, 'alignment': 'Center' }]
     *       };
     * let connector2: ConnectorModel = {
     *           id: 'connector2', type: 'Straight',
     *           sourcePoint: { x: 400, y: 400 }, targetPoint: { x: 600, y: 600 },
     *       };
     * let diagram: Diagram;
     * diagram = new Diagram({
     * width: 1000, height: 1000,
     * connectors: [connector1, connector2],
     * snapSettings: { constraints: SnapConstraints.ShowLines },
     * getDescription: getAccessibility
     * });
     * diagram.appendTo('#diagram');
     * function getAccessibility(obj: ConnectorModel, diagram: Diagram): string {
     * let value: string;
     * if (obj instanceof Connector) {
     * value = 'clicked on Connector';
     * } else if (obj instanceof TextElement) {
     * value = 'clicked on annotation';
     * }
     * else if (obj instanceof Decorator) {
     * value = 'clicked on Decorator';
     * }
     * else { value = undefined; }
     * return value;
     * }
     * ```

     */
    getDescription: Function | string;
    /**
     * Allows to get the custom properties that have to be serialized
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [{
     *           id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
     *           annotations: [{ content: 'Default Shape' }]
     *       },
     *       {
     *           id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
     *           shape: { type: 'Basic', shape: 'Ellipse' },
     *           annotations: [{ content: 'Path Element' }]
     *       }
     *       ];
     *       let connectors: ConnectorModel[] = [{
     *           id: 'connector1', type: 'Straight',
     *           sourcePoint: { x: 100, y: 300 }, targetPoint: { x: 200, y: 400 },
     *       }];
     * let diagram: Diagram = new Diagram({
     * ...
     * connectors: connectors, nodes: nodes,
     * getCustomProperty: (key: string) => {
     * if (key === 'nodes') {
     * return ['description'];
     * }
     *         return null;
     * }
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined

     */
    getCustomProperty: Function | string;
    /**
     * Allows the user to set custom tool that corresponds to the given action
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    /**
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * function getTool(action: string): ToolBase {
     * let tool: ToolBase;
     * if (action === 'userHandle1') {
     * tool = new CloneTool(diagram.commandHandler, true);
     * }
     * return tool;
     * }
     * class CloneTool extends ToolBase {
     * public mouseDown(args: MouseEventArgs): void {
     * super.mouseDown(args);
     * diagram.copy();
     * diagram.paste();
     * }
     * }
     * let nodes: NodeModel[] = [{
     *           id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
     *       },
     *       {
     *           id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
     *           shape: { type: 'Basic', shape: 'Ellipse' },
     *       }];
     *       let connectors: ConnectorModel[] = [{
     *           id: 'connector1', type: 'Straight',
     *           sourcePoint: { x: 100, y: 300 }, targetPoint: { x: 200, y: 400 },
     *       }];
     *      let handles: UserHandleModel[] = [
     *          { name: 'handle', margin: { top: 0, bottom: 0, left: 0, right: 0 }, offset: 0,
     *            pathData: 'M 376.892,225.284L 371.279,211.95L 376.892,198.617L 350.225,211.95L 376.892,225.284 Z',
     *            side: 'Top', horizontalAlignment: 'Center', verticalAlignment: 'Center',
     *            pathColor: 'yellow' }];
     * let diagram: Diagram = new Diagram({
     * ...
     *     connectors: connectors, nodes: nodes,
     *     selectedItems: { constraints: SelectorConstraints.All, userHandles: handles },
     *     getCustomTool: getTool
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```

     */
    getCustomTool: Function | string;
    /**
     * Allows the user to set custom cursor that corresponds to the given action
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    /**
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * function getCursor(action: string, active: boolean): string {
     * let cursor: string;
     * if (active && action === 'Drag') {
     * cursor = '-webkit-grabbing';
     * } else if (action === 'Drag') {
     * cursor = '-webkit-grab'
     * }
     * return cursor;
     * }
     * let nodes: NodeModel[] = [{
     *           id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
     *       },
     *       {
     *           id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
     *           shape: { type: 'Basic', shape: 'Ellipse' },
     *       }];
     * let handle: UserHandleModel[] = [
     * { name: 'handle', margin: { top: 0, bottom: 0, left: 0, right: 0 }, offset: 0,
     * pathData: 'M 376.892,225.284L 371.279,211.95L 376.892,198.617L 350.225,211.95L 376.892,225.284 Z',
     * side: 'Top', horizontalAlignment: 'Center', verticalAlignment: 'Center',
     * pathColor: 'yellow' }];
     * let diagram: Diagram = new Diagram({
     * ...
     *     nodes: nodes,
     *     selectedItems: { constraints: SelectorConstraints.All, userHandles: handle },
     *     getCustomCursor: getCursor
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```

     */
    getCustomCursor: Function | string;
    /**
     * A collection of JSON objects where each object represents a custom cursor action. Layer is a named category of diagram shapes.
     * @default []
     * @blazorType ObservableCollection<DiagramCustomCursor>
     */
    customCursor: CustomCursorActionModel[];
    /**
     * Helps to set the undo and redo node selection
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     *       let connectors: ConnectorModel[] = [{
     *           id: 'connector1',
     *           sourcePoint: { x: 100, y: 300 },
     *           targetPoint: { x: 200, y: 400 },
     *       }];
     * let diagram: Diagram = new Diagram({
     * ...
     *   connectors: connectors,
     *   updateSelection: (object: ConnectorModel | NodeModel, diagram: Diagram) => {
     *   let objectCollection = [];
     *   objectCollection.push(obejct);
     *   diagram.select(objectCollection);
     *   },
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined

     */
    updateSelection: Function | string;
    /**
     * Represents the diagram settings
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let diagram: Diagram = new Diagram({
     * ...
     * diagramSettings: { inversedAlignment: true  }
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default {}
     */
    diagramSettings: DiagramSettingsModel;
    /** @private */
    version: number;
    /**
     * Defines the collection of selected items, size and position of the selector
     * @default {}
     * @blazorType DiagramSelectedItems
     */
    selectedItems: SelectorModel;
    /**
     * Defines the current zoom value, zoom factor, scroll status and view port size of the diagram
     * @default {}
     */
    scrollSettings: ScrollSettingsModel;
    /**
     * Layout is used to auto-arrange the nodes in the Diagram area
     * @default {}
     */
    layout: LayoutModel;
    /**
     * Defines a set of custom commands and binds them with a set of desired key gestures
     * @default {}
     */
    commandManager: CommandManagerModel;
    /**
     * Triggers after diagram is populated from the external data source
     * @event
     * @blazorProperty 'DataLoaded'

     */
    dataLoaded: EmitType<IDataLoadedEventArgs>;
    /**
     * Triggers when a symbol is dragged into diagram from symbol palette
     * @event
     * @blazorProperty 'DragEnter'
     * @blazorType Syncfusion.Blazor.Diagrams.IBlazorDragEnterEventArgs
     */
    dragEnter: EmitType<IDragEnterEventArgs>;
    /**
     * Triggers when a symbol is dragged outside of the diagram.
     * @event
     * @blazorProperty 'DragLeave'
     * @blazorType Syncfusion.Blazor.Diagrams.IBlazorDragLeaveEventArgs
     */
    dragLeave: EmitType<IDragLeaveEventArgs>;
    /**
     * Triggers when a symbol is dragged over diagram
     * @event
     * @blazorProperty 'DragOver'

     */
    dragOver: EmitType<IDragOverEventArgs>;
    /**
     * Triggers when a node, connector or diagram is clicked
     * @event
     * @blazorProperty 'Clicked'
     * @blazorType Syncfusion.Blazor.Diagrams.IBlazorClickEventArgs
     */
    click: EmitType<IClickEventArgs>;
    /**
     * Triggers when a change is reverted or restored(undo/redo)
     * @event
     * @blazorProperty 'HistoryChanged'
     * @blazorType 'IBlazorHistoryChangeArgs'
     */
    historyChange: EmitType<IHistoryChangeArgs>;
    /**
     * Triggers when a custom entry change is reverted or restored(undo/redo)
     * @event
     * @blazorProperty 'CustomHistoryChanged'
     * @blazorType IBlazorCustomHistoryChangeArgs
     */
    historyStateChange: EmitType<IBlazorCustomHistoryChangeArgs>;
    /**
     * Triggers when a node, connector or diagram model is clicked twice
     * @event
     * @blazorProperty 'OnDoubleClick'
     * @blazorType Syncfusion.Blazor.Diagrams.IBlazorDoubleClickEventArgs
     */
    doubleClick: EmitType<IDoubleClickEventArgs>;
    /**
     * Triggers when editor got focus at the time of node’s label or text node editing.
     * @event
     * @blazorProperty 'TextEdited'
     * @blazorType Syncfusion.Blazor.Diagrams.IBlazorTextEditEventArgs
     */
    textEdit: EmitType<ITextEditEventArgs>;
    /**
     * Triggers when the diagram is zoomed or panned
     * @event
     * @blazorProperty 'ScrollChanged'
     * @blazorType 'IBlazorScrollChangeEventArgs'

     */
    scrollChange: EmitType<IScrollChangeEventArgs>;
    /**
     * Triggers when the selection is changed in diagram
     * @event
     * @blazorProperty 'SelectionChanged'
     * @blazorType 'IBlazorSelectionChangeEventArgs'
     */
    selectionChange: EmitType<ISelectionChangeEventArgs>;
    /**
     * Triggers when a node is resized
     * @event
     * @blazorProperty 'OnSizeChange'
     */
    sizeChange: EmitType<ISizeChangeEventArgs>;
    /**
     * Triggers when the connection is changed
     * @event
     * @blazorProperty 'OnConnectionChange'
     * @blazorType 'IBlazorConnectionChangeEventArgs'
     */
    connectionChange: EmitType<IConnectionChangeEventArgs>;
    /**
     * Triggers when the connector's source point is changed
     * @event
     * @blazorProperty 'OnSourcePointChange'

     */
    sourcePointChange: EmitType<IEndChangeEventArgs>;
    /**
     * Triggers when the connector's target point is changed
     * @event
     * @blazorProperty 'OnTargetPointChange'

     */
    targetPointChange: EmitType<IEndChangeEventArgs>;
    /**
     * Triggers once the node or connector property changed.
     * @event
     * @blazorProperty 'PropertyChanged'
     * @blazorType Syncfusion.Blazor.Diagrams.IBlazorPropertyChangeEventArgs
     */
    propertyChange: EmitType<IPropertyChangeEventArgs>;
    /**
     * Triggers while dragging the elements in diagram
     * @event
     * @blazorProperty 'OnPositionChange'
     * @blazorType Syncfusion.Blazor.Diagrams.IBlazorDraggingEventArgs
     */
    positionChange: EmitType<IDraggingEventArgs>;
    /**
     * Triggers when a user releases a key.
     * @event
     * @blazorProperty 'OnKeyUp'
     */
    keyUp: EmitType<IKeyEventArgs>;
    /**
     * Triggers when a user is pressing a key.
     * @event
     * @blazorProperty 'OnKeyDown'
     */
    keyDown: EmitType<IKeyEventArgs>;
    /**
     * Triggers after animation is completed for the diagram elements.
     * @event
     * @blazorProperty 'OnAnimationComplete'

     */
    animationComplete: EmitType<Object>;
    /**
     * Triggers when the diagram elements are rotated
     * @event
     * @blazorProperty 'OnRotateChange'
     */
    rotateChange: EmitType<IRotationEventArgs>;
    /**
     * Triggers when a node/connector is added/removed to/from the diagram.

     * @event
     * @blazorProperty 'OnCollectionChange'
     * @blazorType 'IBlazorCollectionChangeEventArgs'
     */
    collectionChange: EmitType<ICollectionChangeEventArgs>;
    /**
     * Triggers when a mouseDown on the user handle.
     * @event
     * @blazorProperty 'OnUserHandleMouseDown'
     */
    onUserHandleMouseDown: EmitType<UserHandleEventsArgs>;
    /**
     * Triggers when a mouseUp on the user handle.
     * @event
     * @blazorProperty 'OnUserHandleMouseUp'
     */
    onUserHandleMouseUp: EmitType<UserHandleEventsArgs>;
    /**
     * Triggers when a mouseEnter on the user handle.
     * @event
     * @blazorProperty 'OnUserHandleMouseEnter'
     */
    onUserHandleMouseEnter: EmitType<UserHandleEventsArgs>;
    /**
     * Triggers when a mouseLeave on the user handle.
     * @event
     * @blazorProperty 'OnUserHandleMouseLeave'
     */
    onUserHandleMouseLeave: EmitType<UserHandleEventsArgs>;
    /**
     * Triggers when a segment is added/removed to/from the connector.
     * @event
     * @blazorProperty 'OnSegmentCollectionChange'

     * @blazorType 'IBlazorSegmentCollectionChangeEventArgs'
     */
    segmentCollectionChange: EmitType<ISegmentCollectionChangeEventArgs>;
    /**
     * Triggers when the image node is loaded.

     * @event
     */
    onImageLoad: EmitType<IImageLoadEventArgs>;
    /**
     * Triggers when the state of the expand and collapse icon change for a node.

     * @event
     * @blazorProperty 'OnExpandStateChange'
     */
    expandStateChange: EmitType<IExpandStateChangeEventArgs>;
    /**
     * Triggered when the diagram is rendered completely.
     * @event
     * @blazorProperty 'Created'
     */
    created: EmitType<Object>;
    /**
     * Triggered when mouse enters a node/connector.
     * @event
     * @blazorProperty 'MouseEnter'
     * @blazorType Syncfusion.Blazor.Diagrams.IBlazorMouseEventArgs
     */
    mouseEnter: EmitType<IMouseEventArgs>;
    /**
     * Triggered when mouse leaves node/connector.
     * @event
     * @blazorProperty 'MouseLeave'
     * @blazorType Syncfusion.Blazor.Diagrams.IBlazorMouseEventArgs
     */
    mouseLeave: EmitType<IMouseEventArgs>;
    /**
     * Triggered when mouse hovers a node/connector.
     * @event
     * @blazorProperty 'MouseOver'

     * @blazorType Syncfusion.Blazor.Diagrams.IBlazorMouseEventArgs
     */
    mouseOver: EmitType<IMouseEventArgs>;
    /**
     * Triggers before opening the context menu
     * @event
     * @blazorProperty 'OnContextMenuOpen'
     * @blazorType Syncfusion.Blazor.Diagrams.DiagramBeforeMenuOpenEventArgs
     */
    contextMenuOpen: EmitType<BeforeOpenCloseMenuEventArgs>;
    /**
     * Triggers before rendering the context menu item
     * @event
     * @blazorProperty 'OnContextMenuItemRender'
     * @blazorType Syncfusion.Blazor.Diagrams.DiagramMenuEventArgs

     */
    contextMenuBeforeItemRender: EmitType<MenuEventArgs>;
    /**
     * Triggers when a context menu item is clicked
     * @event
     * @blazorProperty 'ContextMenuItemClicked'
     * @blazorType Syncfusion.Blazor.Diagrams.DiagramMenuEventArgs
     */
    contextMenuClick: EmitType<MenuEventArgs>;
    /**
     * Triggers when a command executed.
     * @event
     * @blazorProperty 'OnCommandExecuted'
     */
    commandExecute: EmitType<ICommandExecuteEventArgs>;
    /**
     * A collection of JSON objects where each object represents a layer. Layer is a named category of diagram shapes.
     * @default []
     * @blazorType ObservableCollection<DiagramLayer>
     */
    layers: LayerModel[];
    /**
     * Triggers when a symbol is dragged and dropped from symbol palette to drawing area
     * @event
     * @blazorProperty 'OnDrop'
     * @blazorType 'IBlazorDropEventArgs'
     */
    drop: EmitType<IDropEventArgs>;
    /** @private */
    preventUpdate: boolean;
    /** @private */
    checkMenu: boolean;
    /** @private */
    parentObject: NodeModel;
    /** @hidden */
    /** @private */
    localeObj: L10n;
    private defaultLocale;
    /** @private */
    isServerUpdate: boolean;
    /** @private */
    currentDrawingObject: Node | Connector;
    /** @private */
    currentSymbol: Node | Connector;
    /** @private */
    oldNodeObjects: Node[];
    /** @private */
    oldDiagramObject: object;
    /** @private */
    oldConnectorObjects: Connector[];
    /** @private */
    diagramRenderer: DiagramRenderer;
    private gridlineSvgLayer;
    private renderer;
    /** @private */
    tooltipObject: Tooltip;
    /** @private */
    hRuler: Ruler;
    /** @private */
    vRuler: Ruler;
    /** @private */
    droppable: Droppable;
    /** @private */
    diagramCanvas: HTMLElement;
    /** @private */
    diagramLayer: HTMLCanvasElement | SVGGElement;
    private diagramLayerDiv;
    private adornerLayer;
    private eventHandler;
    /** @private */
    scroller: DiagramScroller;
    /** @private */
    spatialSearch: SpatialSearch;
    /** @private */
    commandHandler: CommandHandler;
    /** @private */
    layerZIndex: number;
    /** @private */
    layerZIndexTable: {};
    /** @private */
    nameTable: {};
    /** @private */
    canEnableBlazorObject: boolean;
    /** @private */
    pathTable: {};
    /** @private */
    connectorTable: {};
    /** @private */
    groupTable: {};
    /** @private */
    private htmlLayer;
    /** @private */
    diagramActions: DiagramAction;
    /** @private */
    blazorActions: BlazorAction;
    /** @private */
    commands: {};
    /** @private */
    activeLabel: ActiveLabel;
    /** @private */
    activeLayer: LayerModel;
    /** @private */
    serviceLocator: ServiceLocator;
    /** @private */
    views: string[];
    /** @private */
    isLoading: Boolean;
    /** @private */
    textEditing: Boolean;
    /** @private */
    isTriggerEvent: Boolean;
    /** @private */
    preventNodesUpdate: Boolean;
    /** @private */
    preventConnectorsUpdate: Boolean;
    /** @private */
    callBlazorModel: Boolean;
    /** @private */
    selectionConnectorsList: ConnectorModel[];
    /** @private */
    deleteVirtualObject: boolean;
    /** @private */
    realActions: RealAction;
    /** @private */
    previousSelectedObject: (NodeModel | ConnectorModel)[];
    private changedConnectorCollection;
    private changedNodesCollection;
    private previousNodeCollection;
    private previousConnectorCollection;
    private crudDeleteNodes;
    private diagramid;
    /** @private */
    selectedObject: {
        helperObject: NodeModel;
        actualObject: NodeModel;
    };
    /**
     * Constructor for creating the widget
     */
    constructor(options?: DiagramModel, element?: HTMLElement | string);
    private updateAnnotationText;
    private callFromServer;
    private clearCollection;
    /**
     * Updates the diagram control when the objects are changed
     * @param {DiagramModel} newProp - Lists the new values of the changed properties
     * @param {DiagramModel} oldProp - Lists the old values of the changed properties
     */
    onPropertyChanged(newProp: DiagramModel, oldProp: DiagramModel): void;
    private updateSnapSettings;
    private updateRulerSettings;
    /**
     * Get the properties to be maintained in the persisted state.
     * @return {string}
     */
    getPersistData(): string;
    /**
     * Initialize nodes, connectors and renderer
     */
    protected preRender(): void;
    private initializePrivateVariables;
    private initializeServices;
    /**
     * Method to set culture for chart
     */
    private setCulture;
    /**
     * Renders the diagram control with nodes and connectors
     */
    render(): void;
    private updateFitToPage;
    private updateTemplate;
    private resetTemplate;
    private renderInitialCrud;
    /**
     * Returns the module name of the diagram
     */
    getModuleName(): string;
    /**
     * @private
     * Returns the name of class Diagram
     */
    getClassName(): string;
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    requiredModules(): ModuleDeclaration[];
    /**
     * Destroys the diagram control
     */
    destroy(): void;
    /**
     * Wires the mouse events with diagram control
     */
    private wireEvents;
    /**
     * Unwires the mouse events from diagram control
     */
    private unWireEvents;
    /**
     * Selects the given collection of objects
     * @param {NodeModel | ConnectorModel} objects - Defines the collection of nodes and connectors to be selected
     * @param {boolean} multipleSelection - Defines whether the existing selection has to be cleared or not
     */
    select(objects: (NodeModel | ConnectorModel)[], multipleSelection?: boolean): void;
    /**
     * Selects the all the objects.
     */
    selectAll(): void;
    /**
     * Removes the given object from selection list
     * @param {NodeModel | ConnectorModel} obj - Defines the object to be unselected
     */
    unSelect(obj: NodeModel | ConnectorModel): void;
    /**
     * Removes all elements from the selection list
     */
    clearSelection(): void;
    /**
     * Update the diagram clipboard dimension
     */
    updateViewPort(): void;
    private cutCommand;
    /**
     * Removes the selected nodes and connectors from diagram and moves them to diagram clipboard
     */
    cut(): void;
    /**
     * Add a process into the sub-process
     * @blazorArgsType process|DiagramNode
     */
    addProcess(process: NodeModel, parentId: string): void;
    /**
     * Remove a process from the sub-process
     */
    removeProcess(id: string): void;
    private pasteCommand;
    /**
     * Adds the given objects/ the objects in the diagram clipboard to diagram control
     * @param {NodeModel[] | ConnectorModel[]} obj - Defines the objects to be added to diagram

     */
    paste(obj?: (NodeModel | ConnectorModel)[]): void;
    /**
     * fit the diagram to the page with respect to mode and region
     */
    fitToPage(options?: IFitOptions): void;
    /**
     * bring the specified bounds into the viewport
     */
    bringIntoView(bound: Rect): void;
    /**
     * bring the specified bounds to the center of the viewport
     */
    bringToCenter(bound: Rect): void;
    private copyCommand;
    /**
     * Copies the selected nodes and connectors to diagram clipboard
     */
    copy(): Object;
    /**
     * Group the selected nodes and connectors in diagram
     */
    group(): void;
    /**
     * UnGroup the selected nodes and connectors in diagram
     */
    unGroup(): void;
    /**
     * send the selected nodes or connectors back
     */
    sendToBack(): void;
    /**
     * set the active layer
     *  @param {string} layerName - defines the name of the layer which is to be active layer
     */
    setActiveLayer(layerName: string): void;
    /**
     * add the layer into diagram
     * @param {LayerModel} layer - defines the layer model which is to be added
     * @param {Object[]} layerObject - defines the object of the layer
     * @blazorArgsType layer|DiagramLayer

     */
    addLayer(layer: LayerModel, layerObject?: Object[]): void;
    /**
     *  @private
     */
    private addDiagramLayer;
    /**
     * remove the layer from diagram
     * @param {string} layerId - define the id of the layer

     */
    removeLayer(layerId: string): void;
    /**
     *  @private
     */
    private removeDiagramLayer;
    /**
     * move objects from the layer to another layer from diagram
     * @param {string[]} objects - define the objects id of string array
     */
    moveObjects(objects: string[], targetLayer?: string): void;
    private layerObjectUpdate;
    /**
     * move the layer backward
     * @param {string} layerName - define the name of the layer
     */
    sendLayerBackward(layerName: string): void;
    /**
     * move the layer forward
     * @param {string} layerName - define the name of the layer
     */
    bringLayerForward(layerName: string): void;
    /**
     * clone a layer with its object
     * @param {string} layerName - define the name of the layer
     */
    cloneLayer(layerName: string): void;
    /**
     * bring the selected nodes or connectors to front
     */
    bringToFront(): void;
    /**
     * send the selected nodes or connectors forward
     */
    moveForward(): void;
    /**
     * send the selected nodes or connectors back
     */
    sendBackward(): void;
    /**
     * gets the node or connector having the given name
     */
    getObject(name: string): {};
    /**
     * gets the node object for the given node ID
     */
    getNodeObject(id: string): NodeModel;
    /**
     * gets the connector object for the given node ID
     */
    getConnectorObject(id: string): ConnectorModel;
    /**
     * gets the active layer back
     */
    getActiveLayer(): LayerModel;
    private nudgeCommand;
    /**
     * Moves the selected objects towards the given direction
     * @param {NudgeDirection} direction -  Defines the direction by which the objects have to be moved
     * @param {number} x - Defines the distance by which the selected objects have to be horizontally moved
     * @param {number} y -  Defines the distance by which the selected objects have to be vertically moved
     */
    nudge(direction: NudgeDirection, x?: number, y?: number): void;
    private insertBlazorDiagramObjects;
    /**
     * Drags the given object by the specified pixels
     * @param {NodeModel | ConnectorMode | SelectorModel} obj - Defines the nodes/connectors to be dragged
     * @param {number} tx - Defines the distance by which the given objects have to be horizontally moved
     * @param {number} ty - Defines the distance by which the given objects have to be vertically moved
     */
    drag(obj: NodeModel | ConnectorModel | SelectorModel, tx: number, ty: number): void;
    /**
     * Scales the given objects by the given ratio
     * @param {NodeModel | ConnectorModel | SelectorModel} obj - Defines the objects to be resized
     * @param {number} sx - Defines the ratio by which the objects have to be horizontally scaled
     * @param {number} sy - Defines the ratio by which the objects have to be vertically scaled
     * @param {PointModel} pivot - Defines the reference point with respect to which the objects will be resized
     */
    scale(obj: NodeModel | ConnectorModel | SelectorModel, sx: number, sy: number, pivot: PointModel): boolean;
    /**
     * Rotates the given nodes/connectors by the given angle
     * @param {NodeModel | ConnectorModel | SelectorModel} obj - Defines the objects to be rotated
     * @param {number} angle - Defines the angle by which the objects have to be rotated
     * @param {PointModel} pivot - Defines the reference point with reference to which the objects have to be rotated
     */
    rotate(obj: NodeModel | ConnectorModel | SelectorModel, angle: number, pivot?: PointModel): boolean;
    /**
     * Moves the source point of the given connector
     * @param {ConnectorModel} obj - Defines the connector, the end points of which has to be moved
     * @param {number} tx - Defines the distance by which the end point has to be horizontally moved
     * @param {number} ty - Defines the distance by which the end point has to be vertically moved
     */
    dragSourceEnd(obj: ConnectorModel, tx: number, ty: number): void;
    /**
     * Moves the target point of the given connector
     * @param {ConnectorModel} obj - Defines the connector, the end points of which has to be moved
     * @param {number} tx - Defines the distance by which the end point has to be horizontally moved
     * @param {number} ty - Defines the distance by which the end point has to be vertically moved
     */
    dragTargetEnd(obj: ConnectorModel, tx: number, ty: number): void;
    /**
     * Finds all the objects that is under the given mouse position
     * @param {PointModel} position - Defines the position, the objects under which has to be found
     * @param {IElement} source - Defines the object, the objects under which has to be found
     */
    findObjectsUnderMouse(position: PointModel, source?: IElement): IElement[];
    /**
     * Finds the object that is under the given mouse position
     * @param {NodeModel[] | ConnectorModel[]}objects - Defines the collection of objects, from which the object has to be found.
     * @param {Actions} action - Defines the action, using which the relevant object has to be found.
     * @param {boolean} inAction - Defines the active state of the action.
     */
    findObjectUnderMouse(objects: (NodeModel | ConnectorModel)[], action: Actions, inAction: boolean): IElement;
    /**
     * Finds the object that is under the given active object (Source)
     * @param {NodeModel[] | ConnectorModel[]} objects - Defines the collection of objects, from which the object has to be found.
     * @param {Actions} action - Defines the action, using which the relevant object has to be found.
     * @param {boolean} inAction - Defines the active state of the action.
     */
    findTargetObjectUnderMouse(objects: (NodeModel | ConnectorModel)[], action: Actions, inAction: boolean, position: PointModel, source?: IElement): IElement;
    /**
     * Finds the child element of the given object at the given position
     * @param {IElement} obj - Defines the object, the child element of which has to be found
     * @param {PointModel} position - Defines the position, the child element under which has to be found
     * @param {number} padding - Defines the padding, the child element under which has to be found
     */
    findElementUnderMouse(obj: IElement, position: PointModel, padding?: number): DiagramElement;
    /**
     * Defines the action to be done, when the mouse hovers the given element of the given object
     * @param {NodeModel | ConnectorModel} obj - Defines the object under mouse
     * @param {DiagramElement} wrapper - Defines the target element of the object under mouse
     * @param {PointModel} position - Defines the current mouse position
     * @private
     */
    findActionToBeDone(obj: NodeModel | ConnectorModel, wrapper: DiagramElement, position: PointModel, target?: NodeModel | PointPortModel | ShapeAnnotationModel | PathAnnotationModel): Actions;
    /**
     * Returns the tool that handles the given action
     * @param {string} action - Defines the action that is going to be performed
     */
    getTool(action: string): ToolBase;
    /**
     * Defines the cursor that corresponds to the given action
     * @param {string} action - Defines the action that is going to be performed
     */
    getCursor(action: string, active: boolean): string;
    /**
     * Initializes the undo redo actions
     * @private
     */
    initHistory(): void;
    /**
     * Adds the given change in the diagram control to the track
     * @param {HistoryEntry} entry - Defines the entry/information about a change in diagram
     */
    addHistoryEntry(entry: HistoryEntry): void;
    /**
     * Adds the given custom change in the diagram control to the track
     * @param {HistoryEntry} entry - Defines the entry/information about a change in diagram
     */
    addCustomHistoryEntry(entry: HistoryEntry): void;
    /** @private */
    historyChangeTrigger(entry: HistoryEntry, action: HistoryChangeAction): void;
    /**
     * Starts grouping the actions that will be undone/restored as a whole
     */
    startGroupAction(): void;
    /**
     * Closes grouping the actions that will be undone/restored as a whole
     */
    endGroupAction(): void;
    /**
     * Restores the last action that is performed
     */
    undo(): void;
    /**
     * Restores the last undone action
     */
    redo(): void;
    private getBlazorDiagramObjects;
    /**
     * Aligns the group of objects to with reference to the first object in the group
     * @param {NodeModel[] | ConnectorModel[]} objects - Defines the objects that have to be aligned
     * @param {AlignmentOptions}option - Defines the factor, by which the objects have to be aligned
     */
    align(option: AlignmentOptions, objects?: (NodeModel | ConnectorModel)[], type?: AlignmentMode): void;
    /**
     * Arranges the group of objects with equal intervals, but within the group of objects
     * @param {DistributeOptions} objects - Defines the objects that have to be equally spaced
     * @param {NodeModel[] | ConnectorModel[]} option - Defines the factor to distribute the shapes
     */
    distribute(option: DistributeOptions, objects?: (NodeModel | ConnectorModel)[]): void;
    /**
     * Scales the given objects to the size of the first object in the group
     * @param {NodeModel[] | ConnectorModel[]}objects - Defines the collection of objects that have to be scaled
     * @param {SizingOptions} option - Defines whether the node has to be horizontally scaled, vertically scaled or both
     */
    sameSize(option: SizingOptions, objects?: (NodeModel | ConnectorModel)[]): void;
    private updateBlazorDiagramProperties;
    private getZoomingAttribute;
    /**
     * Scales the diagram control by the given factor
     * @param {number} factor - Defines the factor by which the diagram is zoomed
     * @param {PointModel} focusedPoint - Defines the point with respect to which the diagram has to be zoomed
     */
    zoom(factor: number, focusedPoint?: PointModel): void;
    /**
     * Scales the diagram control by the given factor
     * @param {ZoomOptions} options - used to define the zoom factor, focus point and zoom type.
     *
     */
    zoomTo(options: ZoomOptions): void;
    /**
     * Pans the diagram control to the given horizontal and vertical offsets
     * @param {number} horizontalOffset - Defines the horizontal distance to which the diagram has to be scrolled
     * @param {number} verticalOffset - Defines the vertical distance to which the diagram has to be scrolled
     */
    pan(horizontalOffset: number, verticalOffset: number, focusedPoint?: PointModel): void;
    /**
     * Resets the zoom and scroller offsets to default values
     */
    reset(): void;
    /**
     * Resets the segments of the connectors
     */
    resetSegments(): void;
    /** @private */
    triggerEvent(eventName: DiagramEvent, args: Object): Promise<void | object>;
    private updateEventValue;
    /**
     * Adds the given node to the lane

     */
    addNodeToLane(node: NodeModel, swimLane: string, lane: string): void;
    /**
     * Shows tooltip for corresponding diagram object
     * @param {NodeModel | ConnectorModel} obj - Defines the object for that tooltip has to be shown
     */
    showTooltip(obj: NodeModel | ConnectorModel): void;
    /**
     * hides tooltip for corresponding diagram object
     * @param {NodeModel | ConnectorModel} obj - Defines the object for that tooltip has to be hide
     */
    hideTooltip(obj: NodeModel | ConnectorModel): void;
    /**
     * Adds the given node to diagram control
     * @param {NodeModel} obj - Defines the node that has to be added to diagram
     * @blazorArgsType obj|DiagramNode
     */
    addNode(obj: NodeModel, group?: boolean): Node;
    /**
     * Adds the given diagram object to the group.
     * @param {NodeModel} Group - defines where the diagram object to be added.
     * @param {string | NodeModel | ConnectorModel} Child - defines the diagram object to be added to the group
     * @blazorArgsType obj|DiagramNode
     */
    addChildToGroup(group: NodeModel, child: string | NodeModel | ConnectorModel): void;
    /**
     * Will return the history stack values
     * @param {boolean} isUndoStack - returns the history stack values
     */
    getHistoryStack(isUndoStack: boolean): HistoryEntry[];
    /**
     * Return the edges for the given node

     * @param {Object} args - return the edge of the given node
     */
    getEdges(args: Object): string[];
    /**
     * Returns the parent id for the node

     * @param {string} id - returns the parent id
     */
    getParentId(id: string): string;
    /**
     * Adds the given connector to diagram control
     * @param {ConnectorModel} obj - Defines the connector that has to be added to diagram
     * @blazorArgsType obj|DiagramConnector
     */
    addConnector(obj: ConnectorModel): Connector;
    /** @private */
    UpdateBlazorDiagramModelCollection(obj: Node | Connector, copiedObject?: (NodeModel | ConnectorModel)[], multiSelectDelete?: (NodeModel | ConnectorModel)[]): void;
    /**
     * @private
     */
    UpdateBlazorDiagramModel(obj: Node | Connector | ShapeAnnotation | PathAnnotation, objectType: string, removalIndex?: number, annotationNodeIndex?: number): void;
    /**
     * @private
     */
    addBlazorDiagramObjects(): void;
    private removeNodeEdges;
    /**
     * Adds the given object to diagram control
     * @param {NodeModel | ConnectorModel} obj - Defines the object that has to be added to diagram
     */
    add(obj: NodeModel | ConnectorModel, group?: boolean): Node | Connector;
    private updateBlazorCollectionChange;
    private updateSvgNodes;
    /** @private */
    updateProcesses(node: (Node | Connector)): void;
    /** @private */
    moveSvgNode(nodeId: string): void;
    /**
     * Adds the given annotation to the given node
     * @param {BpmnAnnotationModel} annotation - Defines the annotation to be added
     * @param {NodeModel} node - Defines the node to which the annotation has to be added
     */
    addTextAnnotation(annotation: BpmnAnnotationModel, node: NodeModel): void;
    /**
     * Splice the InEdge and OutEdge of the for the node with respect to corresponding connectors that is deleting
     */
    private spliceConnectorEdges;
    /**
     * Remove the dependent connectors if the node is deleted
     * @private
     */
    removeDependentConnector(node: Node): void;
    /** @private */
    removeObjectsFromLayer(obj: (NodeModel | ConnectorModel)): void;
    /** @private */
    removeElements(currentObj: NodeModel | ConnectorModel): void;
    private removeCommand;
    /**
     * Removes the given object from diagram
     * @param {NodeModel | ConnectorModel} obj - Defines the object that has to be removed from diagram
     */
    remove(obj?: NodeModel | ConnectorModel): void;
    private isStackChild;
    /** @private */
    deleteChild(node: NodeModel | ConnectorModel | string, parentNode?: NodeModel): void;
    /** @private  */
    addChild(node: NodeModel, child: string | NodeModel | ConnectorModel, index?: number): void;
    /**
     * Clears all nodes and objects in the diagram

     */
    clear(): void;
    private clearObjects;
    private startEditCommad;
    /**
     * Specified annotation to edit mode
     * @param {NodeModel | ConnectorModel} node - Defines node/connector that contains the annotation to be edited
     * @param {string} id - Defines annotation id to be edited in the node
     */
    startTextEdit(node?: NodeModel | ConnectorModel, id?: string): void;
    private updateNodeExpand;
    private updateConnectorAnnotation;
    private removeChildrenFromLayout;
    /**
     * Automatically updates the diagram objects based on the type of the layout
     */
    doLayout(): ILayout | boolean;
    /**
     * Serializes the diagram control as a string
     */
    saveDiagram(): string;
    /**
     * Converts the given string as a Diagram Control
     * @param {string} data - Defines the behavior of the diagram to be loaded

     */
    loadDiagram(data: string): Object;
    /**
     * To  get the html diagram content
     * @param {StyleSheetList} styleSheets - defines the collection of style files to be considered while exporting.
     */
    getDiagramContent(styleSheets?: StyleSheetList): string;
    /**
     * To export diagram native/html image
     * @param {string} image - defines image content to be exported.
     * @param {IExportOptions} options - defines the image properties.
     */
    exportImage(image: string, options: IExportOptions): void;
    /**
     * To print native/html nodes of diagram
     * @param {string} image - defines image content.
     * @param {IExportOptions} options - defines the properties of the image
     */
    printImage(image: string, options: IExportOptions): void;
    /**
     * To limit the history entry of the diagram
     * @param {number} stackLimit - defines stackLimit of the history manager.
     */
    setStackLimit(stackLimit: number): void;
    /**
     * To clear history of the diagram
     */
    clearHistory(): void;
    /**
     * To get the bound of the diagram
     */
    getDiagramBounds(): Rect;
    /**
     * To export Diagram
     * @param {IExportOptions} options - defines the how the image to be exported.
     */
    exportDiagram(options: IExportOptions): string | SVGElement;
    /**
     * To print Diagram
     * @param {IPrintOptions} optons - defines how the image to be printed.
     */
    print(options: IPrintOptions): void;
    /**
     * Add ports at the run time
     * @blazorArgsType obj|DiagramNode
     */
    addPorts(obj: NodeModel, ports: PointPortModel[]): void;
    /**
     * Add constraints at run time
     */
    addConstraints(constraintsType: number, constraintsValue: number): number;
    /**
     * Remove constraints at run time
     */
    removeConstraints(constraintsType: number, constraintsValue: number): number;
    /**
     * Add labels in node at the run time in the blazor platform
     */
    addNodeLabels(obj: NodeModel, labels: ShapeAnnotationModel[]): void;
    /**
     * Add labels in connector at the run time in the blazor platform
     */
    addConnectorLabels(obj: ConnectorModel, labels: PathAnnotationModel[]): void;
    /**
     * Add Labels at the run time
     */
    addLabels(obj: NodeModel | ConnectorModel, labels: ShapeAnnotationModel[] | PathAnnotation[] | PathAnnotationModel[]): void;
    /**
     * Add dynamic Lanes to swimLane at runtime
     */
    addLanes(node: NodeModel, lane: LaneModel[], index?: number): void;
    /**
     * Add a phase to a swimLane at runtime
     */
    addPhases(node: NodeModel, phases: PhaseModel[]): void;
    /**
     * Remove dynamic Lanes to swimLane at runtime
     */
    removeLane(node: NodeModel, lane: LaneModel): void;
    /**
     * Remove a phase to a swimLane at runtime
     */
    removePhase(node: NodeModel, phase: PhaseModel): void;
    private removelabelExtension;
    /**
     * Remove Labels at the run time
     */
    removeLabels(obj: Node | ConnectorModel, labels: ShapeAnnotationModel[] | PathAnnotationModel[]): void;
    private removePortsExtenion;
    /**
     * Remove Ports at the run time
     */
    removePorts(obj: Node, ports: PointPortModel[]): void;
    /**
     * @private
     * @param {string | number} real - real value
     * @param {number} rulerSize - ruler size
     */
    getSizeValue(real: string | number, rulerSize?: number): string;
    private renderRulers;
    private intOffPageBackground;
    private initDiagram;
    private renderHiddenUserHandleTemplateLayer;
    private renderBackgroundLayer;
    private renderGridLayer;
    private renderDiagramLayer;
    private initLayers;
    private renderAdornerLayer;
    private renderPortsExpandLayer;
    private renderHTMLLayer;
    private renderNativeLayer;
    /** @private */
    createSvg(id: string, width: string | Number, height: string | Number): SVGElement;
    private updateBazorShape;
    private initObjects;
    /** @private */
    initLayerObjects(): void;
    private alignGroup;
    private addToLayer;
    private updateLayer;
    private updateScrollSettings;
    private initData;
    private generateData;
    private makeData;
    private initNodes;
    private initConnectors;
    private setZIndex;
    private initializeDiagramLayers;
    /** @private */
    resetTool(): void;
    private initObjectExtend;
    /** @private */
    initObject(obj: IElement, layer?: LayerModel, independentObj?: boolean, group?: boolean): void;
    private getConnectedPort;
    private scaleObject;
    private updateDefaultLayoutIcons;
    private updateDefaultLayoutIcon;
    /**
     * @private
     */
    updateGroupOffset(node: NodeModel | ConnectorModel, isUpdateSize?: boolean): void;
    private initNode;
    /** @private */
    updateDiagramElementQuad(): void;
    private onLoadImageSize;
    private updateChildPosition;
    private canExecute;
    private updateStackProperty;
    private initViews;
    private initCommands;
    private overrideCommands;
    private initCommandManager;
    /** @private */
    updateNodeEdges(node: Node): void;
    /** @private */
    private updateIconVisibility;
    /** @private */
    updateEdges(obj: Connector): void;
    /** @private */
    updatePortEdges(node: NodeModel, obj: ConnectorModel, isInEdges: boolean): void;
    /** @private */
    refreshDiagram(): void;
    private updateCanupdateStyle;
    private getZindexPosition;
    /** @private */
    updateDiagramObject(obj: (NodeModel | ConnectorModel), canIgnoreIndex?: boolean, isUpdateObject?: boolean): void;
    /** @private  */
    updateGridContainer(grid: GridPanel): void;
    /** @private  */
    getObjectsOfLayer(objectArray: string[]): (NodeModel | ConnectorModel)[];
    /** @private */
    refreshDiagramLayer(): void;
    /** @private */
    refreshCanvasLayers(view?: View): void;
    private renderBasicElement;
    private refreshElements;
    private renderTimer;
    /** @private */
    refreshCanvasDiagramLayer(view: View): void;
    /** @private */
    updatePortVisibility(node: Node, portVisibility: PortVisibility, inverse?: Boolean): void;
    /** @private */
    refreshSvgDiagramLayer(view: View): void;
    /** @private */
    removeVirtualObjects(clearIntervalVal: Object): void;
    /** @private */
    updateTextElementValue(object: NodeModel | ConnectorModel): void;
    /** @private */
    updateVirtualObjects(collection: string[], remove: boolean, tCollection?: string[]): void;
    /** @private */
    renderDiagramElements(canvas: HTMLCanvasElement | SVGElement, renderer: DiagramRenderer, htmlLayer: HTMLElement, transform?: boolean, fromExport?: boolean, isOverView?: boolean): void;
    /** @private */
    updateBridging(isLoad?: boolean): void;
    /** @private */
    setCursor(cursor: string): void;
    /** @private */
    clearCanvas(view: View): void;
    /** @private */
    updateScrollOffset(): void;
    /** @private */
    setOffset(offsetX: number, offsetY: number): void;
    /** @private */
    setSize(width: number, height: number): void;
    /** @private */
    transformLayers(): void;
    /**
     * Defines how to remove the Page breaks
     * @private
     */
    removePageBreaks(): void;
    /**
     * Defines how the page breaks has been rendered
     * @private
     */
    renderPageBreaks(bounds?: Rect): void;
    private validatePageSize;
    /**
     * @private
     */
    setOverview(overview: View, id?: string): void;
    private renderNodes;
    private updateThumbConstraints;
    /** @private */
    renderSelector(multipleSelection: boolean, isSwimLane?: boolean): void;
    /** @private */
    updateSelector(): void;
    /** @private */
    renderSelectorForAnnotation(selectorModel: Selector, selectorElement: (SVGElement | HTMLCanvasElement)): void;
    /** @private */
    drawSelectionRectangle(x: number, y: number, width: number, height: number): void;
    /**
     * @private
     */
    renderHighlighter(element: DiagramElement): void;
    /**
     * @private
     */
    clearHighlighter(): void;
    /** @private */
    getNodesConnectors(selectedItems: (NodeModel | ConnectorModel)[]): (NodeModel | ConnectorModel)[];
    /** @private */
    clearSelectorLayer(): void;
    /** @private */
    getWrapper(nodes: Container, id: string): DiagramElement;
    /** @private */
    getEndNodeWrapper(node: NodeModel, connector: ConnectorModel, source: boolean): DiagramElement;
    private containsMargin;
    private focusOutEdit;
    private endEditCommand;
    /**
     * @private
     */
    endEdit(): Promise<void>;
    private getIndex;
    private getBlazorTextEditArgs;
    /** @private */
    canLogChange(): boolean;
    private modelChanged;
    private resetDiagramActions;
    /** @private */
    removeNode(node: NodeModel | ConnectorModel): void;
    /** @private */
    deleteGroup(node: NodeModel): void;
    /** @private */
    updateObject(actualObject: Node | Connector, oldObject: Node | Connector, changedProp: Node | Connector): void;
    private nodePropertyChangeExtend;
    private swimLaneNodePropertyChange;
    /** @private */
    insertValue(oldNodeObject: any, isNode: boolean): void;
    /** @private */
    nodePropertyChange(actualObject: Node, oldObject: Node, node: Node, isLayout?: boolean, rotate?: boolean, propertyChange?: boolean): void;
    private updatePorts;
    private updateFlipOffset;
    private updateUMLActivity;
    private updateConnectorProperties;
    /** @private */
    updateConnectorEdges(actualObject: Node): void;
    private connectorProprtyChangeExtend;
    /** @private */
    connectorPropertyChange(actualObject: Connector, oldProp: Connector, newProp: Connector, disableBridging?: boolean, propertyChange?: boolean): void;
    /** @private */
    removePortEdges(node: NodeModel, portId: string, item: string, isInEdges: boolean): void;
    private getpropertyChangeArgs;
    private triggerPropertyChange;
    private findInOutConnectPorts;
    private getPoints;
    /**
     * update the  opacity  and visibility for the node  once the layout animation starts
     */
    /** @private */
    updateNodeProperty(element: Container, visible?: boolean, opacity?: number): void;
    /**
     * checkSelected Item for Connector
     * @private
     */
    checkSelectedItem(actualObject: Connector | Node): boolean;
    /**
     * Updates the visibility of the diagram container
     * @private
     */
    private updateDiagramContainerVisibility;
    /**
     * Updates the visibility of the node/connector
     * @private
     */
    updateElementVisibility(element: Container, obj: Connector | Node, visible: boolean): void;
    private updateAnnotations;
    /** @private */
    updateAnnotation(changedObject: AnnotationModel, actualAnnotation: ShapeAnnotationModel, nodes: Container, actualObject?: Object, canUpdateSize?: boolean): void;
    private updateAnnotationContent;
    private updateAnnotationWrapper;
    /** @private */
    updatePort(changedObject: PointPortModel, actualPort: PointPortModel, nodes: Container): void;
    /** @private */
    updateIcon(actualObject: Node): void;
    private getPortContainer;
    private updateTooltip;
    /** @private */
    updateQuad(obj: IElement): void;
    /** @private */
    removeFromAQuad(obj: IElement): void;
    /** @private */
    updateGroupSize(node: NodeModel | ConnectorModel): void;
    private updatePage;
    /** @private */
    protectPropertyChange(enable: boolean): void;
    /** @private */
    getProtectPropertyChangeValue(): boolean;
    /** @private */
    enableServerDataBinding(enable: boolean): void;
    /** @private */
    updateShadow(nodeShadow: ShadowModel, changedShadow: ShadowModel): void;
    /** @private */
    updateMargin(node: Node, changes: Node): void;
    private initDroppables;
    private getBlazorDragLeaveEventArgs;
    private getDropEventArgs;
    private removeChildInNodes;
    private getBlazorDragEventArgs;
    private findChild;
    private getChildren;
    private addChildNodes;
    private moveNode;
    /**
     * moves the node or connector forward within given layer
     */
    moveObjectsUp(node: NodeModel | ConnectorModel, currentLayer: LayerModel): void;
    /**
     * Inserts newly added element into the database
     */
    insertData(node?: Node | Connector): object;
    /**
     * updates the user defined element properties into the existing database
     */
    updateData(node?: Node | Connector): object;
    /**
     * Removes the user deleted element from the existing database
     */
    removeData(node?: Node | Connector): object;
    private crudOperation;
    private processCrudCollection;
    private parameterMap;
    private getNewUpdateNodes;
    private getDeletedNodes;
    private raiseAjaxPost;
}
