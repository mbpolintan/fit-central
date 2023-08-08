import { ChildProperty } from '@syncfusion/ej2-base';
/**
 * Holds the configuration of columns in kanban board.
 */
export declare class Columns extends ChildProperty<Columns> {
    /**
     * Defines the column keyField
     * @default null
     */
    keyField: string;
    /**
     * Defines the column header title
     * @default null
     */
    headerText: string;
    /**
     * Defines the column template
     * @default null

     */
    template: string;
    /**
     * Enable or disable toggle column
     * @default false
     */
    allowToggle: boolean;
    /**
     * Defines the collapsed or expandable state
     * @default true
     */
    isExpanded: boolean;
    /**
     * Defines the minimum card count in column
     * @default null
     * @aspType int
     * @blazorType int
     * @isBlazorNullableType true
     */
    minCount: number;
    /**
     * Defines the maximum card count in column
     * @default null
     * @aspType int
     * @blazorType int
     * @isBlazorNullableType true
     */
    maxCount: number;
    /**
     * Enable or disable card count in column
     * @default true
     */
    showItemCount: boolean;
    /**
     * Enable or disable cell add button
     * @default false
     */
    showAddButton: boolean;
}
