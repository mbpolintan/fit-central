import { Gantt } from '../base/gantt';
import { KeyboardEvents, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { ChartScroll } from '../actions/chart-scroll';
import { IGanttData } from '../base/interface';
import { RecordDoubleClickEventArgs } from '../base/interface';
/**
 * module to render gantt chart - project view
 */
export declare class GanttChart {
    private parent;
    chartElement: HTMLElement;
    chartTimelineContainer: HTMLElement;
    chartBodyContainer: HTMLElement;
    chartBodyContent: HTMLElement;
    rangeViewContainer: HTMLElement;
    scrollElement: HTMLElement;
    scrollObject: ChartScroll;
    isExpandCollapseFromChart: boolean;
    isExpandAll: boolean;
    private focusedElement;
    private isGanttElement;
    keyboardModule: KeyboardEvents;
    constructor(parent: Gantt);
    private addEventListener;
    private renderChartContents;
    /**
     * Method to render top level containers in Gantt chart
     * @private
     */
    renderChartContainer(): void;
    /**
     * method to render timeline, holidays, weekends at load time
     */
    private renderInitialContents;
    /**
     * @private
     */
    renderOverAllocationContainer(): void;
    private renderChartElements;
    /**
     * @private
     */
    renderRangeContainer(records: IGanttData[]): void;
    private getTopValue;
    private getRangeHeight;
    private renderRange;
    /**
     * @private
     */
    renderTimelineContainer(): void;
    /**
     * initiate chart container
     */
    private renderBodyContainers;
    private updateWidthAndHeight;
    /**
     * Method to update bottom border for chart rows
     */
    updateLastRowBottomWidth(): void;
    private removeEventListener;
    /**
     * Click event handler in chart side
     */
    private ganttChartMouseDown;
    private ganttChartMouseClick;
    private ganttChartMouseUp;
    /**
     *
     * @param e
     */
    private scrollToTarget;
    /**
     * To focus selected task in chart side
     * @private
     */
    updateScrollLeft(scrollLeft: number): void;
    /**
     *  Method trigger while perform mouse up action.
     * @return {void}
     * @private
     */
    private mouseUp;
    /**
     *  Method trigger while perform mouse up action.
     * @return {void}
     * @private
     */
    private documentMouseUp;
    /**
     * This event triggered when click on taskbar element
     * @return {void}
     */
    onTaskbarClick(e: PointerEvent, target: EventTarget, taskbarElement: Element): void;
    /**
     *  Method trigger while perform mouse leave action.
     * @return {void}
     * @private
     */
    private ganttChartLeave;
    /**
     *  Method trigger while perform mouse move action.
     * @return {void}
     * @private
     */
    private ganttChartMove;
    /**
     *  Method trigger while perform right click action.
     * @return {void}
     * @private
     */
    private contextClick;
    /**
     * Method to trigger while perform mouse move on Gantt.
     * @return {void}
     * @private
     */
    mouseMoveHandler(e: PointerEvent): void;
    /**
     * Double click handler for chart
     * @param e
     */
    private doubleClickHandler;
    /**
     * To trigger record double click event.
     * @return {void}
     * @private
     */
    recordDoubleClick(args: RecordDoubleClickEventArgs): void;
    /**
     * @private
     */
    getRecordByTarget(e: PointerEvent): IGanttData;
    /**
     * To get gantt chart row elements
     * @return {NodeListOf<Element>}
     * @private
     */
    getChartRows(): NodeListOf<Element>;
    /**
     * Expand Collapse operations from gantt chart side
     * @return {void}
     * @param target
     * @private
     */
    private chartExpandCollapseRequest;
    /**
     * @private
     */
    reRenderConnectorLines(): void;
    /**
     * To collapse gantt rows
     * @return {void}
     * @param args
     * @private
     */
    collapseGanttRow(args: object, isCancel?: boolean): void;
    /**
     * @return {void}
     * @param args
     * @private
     */
    collapsedGanttRow(args: object): void;
    /**
     * To expand gantt rows
     * @return {void}
     * @param args
     * @private
     */
    expandGanttRow(args: object, isCancel?: boolean): void;
    /**
     * @return {void}
     * @param args
     * @private
     */
    expandedGanttRow(args: object): void;
    private renderMultiTaskbar;
    /**
     * On expand collapse operation row properties will be updated here.
     * @return {void}
     * @param action
     * @param rowElement
     * @param record
     * @param isChild
     * @private
     */
    private expandCollapseChartRows;
    /**
     * Public method to expand or collapse all the rows of Gantt
     * @return {void}
     * @param action
     * @private
     */
    expandCollapseAll(action: string): void;
    /**
     * Public method to expand particular level of rows.
     * @return {void}
     * @param level
     * @private
     */
    expandAtLevel(level: number): void;
    /**
     * Public method to collapse particular level of rows.
     * @return {void}
     * @param level
     * @private
     */
    collapseAtLevel(level: number): void;
    /**
     * Event Binding for gantt chart click
     */
    private wireEvents;
    private unWireEvents;
    /**
     * To get record by taskbar element.
     * @return {IGanttData}
     * @private
     */
    getRecordByTaskBar(target: Element): IGanttData;
    /**
     * Trigger Tab & Shift + Tab keypress to highlight active element.
     * @param e
     * @private
     */
    onTabAction(e: KeyboardEventArgs): void;
    /**
     * Get next/previous sibling element.
     * @param $target
     * @param isTab
     */
    private getNextElement;
    /**
     * Get next/previous row element.
     * @param rowIndex
     * @param isTab
     * @param isChartRow
     */
    private getNextRowElement;
    /**
     * Validate next/previous sibling element haschilds.
     * @param $target
     * @param className
     */
    private validateNextElement;
    /**
     * Add/Remove active element.
     * @param element
     * @param focus
     * @param isChartElement
     */
    private manageFocus;
    /**
     * To get index by taskbar element.
     * @return {number}
     * @private
     */
    getIndexByTaskBar(target: Element): number;
    private destroy;
}
