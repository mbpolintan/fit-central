import { ChildProperty } from '@syncfusion/ej2-base';
import { MarginModel } from '../core/appearance-model';
import { DiagramTooltipModel } from './tooltip-model';
import { FlipDirection } from '../enum/enum';
import { SymbolPaletteInfoModel } from './preview-model';
/**
 * Defines the common behavior of nodes, connectors and groups
 */
export declare abstract class NodeBase extends ChildProperty<NodeBase> {
    /**
     * Represents the unique id of nodes/connectors
     * @default ''
     */
    id: string;
    /**
     * Defines the visual order of the node/connector in DOM
     * @default -1
     */
    zIndex: number;
    /**
     * Defines the space to be left between the node and its immediate parent
     * @default {}
     */
    margin: MarginModel;
    /**
     * Sets the visibility of the node/connector
     * @default true
     */
    visible: boolean;
    /**
     * defines the tooltip for the node
     * @default {}
     */
    tooltip: DiagramTooltipModel;
    /**
     * Defines whether the node should be automatically positioned or not. Applicable, if layout option is enabled.
     * @default false
     */
    excludeFromLayout: boolean;
    /**
     * Allows the user to save custom information/data about a node/connector
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    addInfo: Object;
    /**
     * Flip the element in Horizontal/Vertical directions
     * @aspDefaultValueIgnore
     * @blazorDefaultValue None
     * @default None
     */
    flip: FlipDirection;
    /**
     * Defines the symbol info of a connector
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    symbolInfo: SymbolPaletteInfoModel;
}
