import { Chart } from '../chart';
import { PointData } from '../../common/utils/helper';
import { BaseTooltip } from '../../common/user-interaction/tooltip';
/**
 * `Tooltip` module is used to render the tooltip for chart series.
 */
export declare class Tooltip extends BaseTooltip {
    /**
     * Constructor for tooltip module.
     * @private.
     */
    constructor(chart: Chart);
    /**
     * @hidden
     */
    private addEventListener;
    private mouseUpHandler;
    private mouseLeaveHandler;
    private mouseMoveHandler;
    /**
     * Handles the long press on chart.
     * @return {boolean}
     * @private
     */
    private longPress;
    /**
     * Renders the tooltip.
     * @return {void}
     */
    tooltip(): void;
    private findHeader;
    private findShapes;
    private renderSeriesTooltip;
    private triggerTooltipRender;
    private findMarkerHeight;
    private findData;
    private getSymbolLocation;
    private getRangeArea;
    private getWaterfallRegion;
    private getTooltipText;
    private getTemplateText;
    private findMouseValue;
    private renderGroupedTooltip;
    private triggerBlazorSharedTooltip;
    private triggerSharedTooltip;
    private findSharedLocation;
    private getBoxLocation;
    private parseTemplate;
    private formatPointValue;
    private getFormat;
    private getIndicatorTooltipFormat;
    removeHighlightedMarker(data: PointData[]): void;
    /**
     * Get module name.
     */
    protected getModuleName(): string;
    /**
     * To destroy the tooltip.
     * @return {void}
     * @private
     */
    destroy(chart: Chart): void;
}
