import { Gantt } from '../base/gantt';
import { IGanttData } from '../base/interface';
/**
 * To render the chart rows in Gantt
 */
export declare class ChartRows {
    ganttChartTableBody: Element;
    taskTable: HTMLElement;
    private parent;
    taskBarHeight: number;
    milestoneHeight: number;
    private milesStoneRadius;
    private baselineTop;
    baselineHeight: number;
    private baselineColor;
    private parentTaskbarTemplateFunction;
    private leftTaskLabelTemplateFunction;
    private rightTaskLabelTemplateFunction;
    private taskLabelTemplateFunction;
    private childTaskbarTemplateFunction;
    private milestoneTemplateFunction;
    private templateData;
    private touchLeftConnectorpoint;
    private touchRightConnectorpoint;
    connectorPointWidth: number;
    private connectorPointMargin;
    taskBarMarginTop: number;
    milestoneMarginTop: number;
    constructor(ganttObj?: Gantt);
    /**
     * To initialize the public property.
     * @return {void}
     * @private
     */
    private initPublicProp;
    private addEventListener;
    refreshChartByTimeline(): void;
    /**
     * To render chart rows.
     * @return {void}
     * @private
     */
    private createChartTable;
    initiateTemplates(): void;
    /**
     * To render chart rows.
     * @return {void}
     * @private
     */
    renderChartRows(): void;
    /**
     * To get gantt Indicator.
     * @return {NodeList}
     * @private
     */
    private getIndicatorNode;
    /**
     * To get gantt Indicator.
     * @return {number}
     * @private
     */
    getIndicatorleft(date: Date | string): number;
    /**
     * To get child taskbar Node.
     * @return {NodeList}
     * @private
     */
    private getChildTaskbarNode;
    /**
     * To get milestone node.
     * @return {NodeList}
     * @private
     */
    private getMilestoneNode;
    /**
     * To get task baseline Node.
     * @return {NodeList}
     * @private
     */
    private getTaskBaselineNode;
    /**
     * To get milestone baseline node.
     * @return {NodeList}
     * @private
     */
    private getMilestoneBaselineNode;
    /**
     * To get left label node.
     * @return {NodeList}
     * @private
     */
    private getLeftLabelNode;
    private getLableText;
    /**
     * To get right label node.
     * @return {NodeList}
     * @private
     */
    private getRightLabelNode;
    private getManualTaskbar;
    /**
     * To get parent taskbar node.
     * @return {NodeList}
     * @private
     */
    private getParentTaskbarNode;
    /**
     * To get taskbar row('TR') node
     * @return {NodeList}
     * @private
     */
    private getTableTrNode;
    /**
     * To initialize chart templates.
     * @return {void}
     * @private
     */
    private initializeChartTemplate;
    private createDivElement;
    private isTemplate;
    /** @private */
    getTemplateID(templateName: string): string;
    private updateTaskbarBlazorTemplate;
    private leftLabelContainer;
    private taskbarContainer;
    private rightLabelContainer;
    private childTaskbarLeftResizer;
    private childTaskbarRightResizer;
    private childTaskbarProgressResizer;
    private getLeftPointNode;
    private getRightPointNode;
    /**
     * To get task label.
     * @return {string}
     * @private
     */
    private getTaskLabel;
    private getExpandDisplayProp;
    private getRowClassName;
    private getBorderRadius;
    private taskNameWidth;
    private getRightLabelLeft;
    private getExpandClass;
    private getFieldValue;
    private getResourceName;
    /**
     * To initialize private variable help to render task bars.
     * @return {void}
     * @private
     */
    private initChartHelperPrivateVariable;
    /**
     * Function used to refresh Gantt rows.
     * @return {void}
     * @private
     */
    refreshGanttRows(): void;
    /**
     * To render taskbars.
     * @return {void}
     * @private
     */
    private createTaskbarTemplate;
    /**
     * To render taskbars.
     * @return {Node}
     * @private
     */
    getGanttChartRow(i: number, tempTemplateData: IGanttData): Node;
    /**
     * To trigger query taskbar info event.
     * @return {void}
     * @private
     */
    triggerQueryTaskbarInfo(): void;
    /**
     *
     * @param trElement
     * @param data
     * @private
     */
    triggerQueryTaskbarInfoByIndex(trElement: Element, data: IGanttData): void;
    /**
     * To update query taskbar info args.
     * @return {void}
     * @private
     */
    private updateQueryTaskbarInfoArgs;
    private getClassName;
    /**
     * To compile template string.
     * @return {Function}
     * @private
     */
    templateCompiler(template: string): Function;
    /**
     * To refresh edited TR
     * @param index
     * @private
     */
    refreshRow(index: number, isValidateRange?: boolean): void;
    private getResourceParent;
    /**
     * To refresh all edited records
     * @param items
     * @private
     */
    refreshRecords(items: IGanttData[], isValidateRange?: boolean): void;
    private removeEventListener;
    private destroy;
    private generateAriaLabel;
    private generateTaskLabelAriaLabel;
}
