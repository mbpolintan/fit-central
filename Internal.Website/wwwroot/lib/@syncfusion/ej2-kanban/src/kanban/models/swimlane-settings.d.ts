import { ChildProperty } from '@syncfusion/ej2-base';
import { SortDirection } from '../base/type';
/**
 * Holds the configuration of swimlane settings in kanban board.
 */
export declare class SwimlaneSettings extends ChildProperty<SwimlaneSettings> {
    /**
     * Defines the swimlane key field
     * @default null
     */
    keyField: string;
    /**
     * Defines the swimlane header text field
     * @default null
     */
    textField: string;
    /**
     * Enable or disable empty swimlane
     * @default false
     */
    showEmptyRow: boolean;
    /**
     * Enable or disable items count
     * @default true
     */
    showItemCount: boolean;
    /**
     * Enable or disable the card drag and drop actions
     * @default false
     */
    allowDragAndDrop: boolean;
    /**
     * Defines the swimlane row template
     * @default null

     */
    template: string;
    /**
     * Sort the swimlane resources. The possible values are:
     * * Ascending
     * * Descending
     * @default 'Ascending'
     */
    sortDirection: SortDirection;
}
