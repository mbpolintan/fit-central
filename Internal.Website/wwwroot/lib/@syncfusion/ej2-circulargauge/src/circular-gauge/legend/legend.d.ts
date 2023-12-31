import { CircularGauge } from '../circular-gauge';
import { TextOption } from '../utils/helper';
import { Rect, Size, GaugeLocation } from '../utils/helper';
import { ChildProperty } from '@syncfusion/ej2-base';
import { BorderModel, FontModel, MarginModel } from '../model/base-model';
import { Border } from '../model/base';
import { LegendPosition, Alignment, GaugeShape } from '../utils/enum';
import { Axis } from '../axes/axis';
import { LegendSettingsModel } from './legend-model';
import { LocationModel } from './legend-model';
import { ILegendRegions } from '../model/interface';
/**
 * Sets and gets the location of the legend in circular gauge.
 */
export declare class Location extends ChildProperty<Location> {
    /**
     * Sets and gets the X coordinate of the legend in the circular gauge.
     * @default 0
     */
    x: number;
    /**
     * Sets and gets the Y coordinate of the legend in the circular gauge.
     * @default 0
     */
    y: number;
}
/**
 * Sets and gets the options to customize the legend for the ranges in the circular gauge.
 */
export declare class LegendSettings extends ChildProperty<LegendSettings> {
    /**
     * Enable and disables the visibility of the legend in circular gauge.
     * @default false
     */
    visible: boolean;
    /**
     * Enables and disables the ranges visibility collapses based on the legend visibility.
     * @default true
     */
    toggleVisibility: boolean;
    /**
     * Sets and gets the alignment of the legend in the circular gauge.
     * @default 'Center'
     */
    alignment: Alignment;
    /**
     * Sets and gets the options to customize the border settings of the legend.
     */
    border: BorderModel;
    /**
     * Sets and gets the options to customize the border for the shape of the legend in the circular gauge.
     */
    shapeBorder: BorderModel;
    /**
     * Sets and gets the options to customize the padding between legend items.
     * @default 8
     */
    padding: number;
    /**
     * Sets and gets the opacity of the legend.
     * @default 1
     */
    opacity: number;
    /**
     * Sets and gets the position of the legend in the circular gauge.
     * @default 'Auto'
     */
    position: LegendPosition;
    /**
     * Sets and gets the shape of the legend in circular gauge.
     * @default Circle
     */
    shape: GaugeShape;
    /**
     * Sets and gets the height of the legend in the circular gauge.
     * @default null
     */
    height: string;
    /**
     * Sets and gets the width of the legend in the circular gauge.
     * @default null
     */
    width: string;
    /**
     * Sets and gets the options to customize the text of the legend.
     */
    textStyle: FontModel;
    /**
     * Sets and gets the height of the legend shape in circular gauge.
     * @default 10
     */
    shapeHeight: number;
    /**
     * Sets and gets the width of the legend shape in circular gauge.
     * @default 10
     */
    shapeWidth: number;
    /**
     * Sets and gets the padding for the legend shape in circular gauge.
     * @default 5
     */
    shapePadding: number;
    /**
     * Sets and gets the location of the legend, relative to the circular gauge.
     * If x is 20, legend moves by 20 pixels to the right of the gauge. It requires the `position` to be `Custom`.
     * ```html
     * <div id='Gauge'></div>
     * ```
     * ```typescript
     * let gauge: CircularGauge = new CircularGauge({
     * ...
     *   legendSettings: {
     *     visible: true,
     *     position: 'Custom',
     *     location: { x: 100, y: 150 },
     *   },
     * ...
     * });
     * this.gauge.appendTo('#Gauge');
     * ```
     */
    location: LocationModel;
    /**
     * Sets and gets the background color of the legend in circular gauge.
     * @default 'transparent'
     */
    background: string;
    /**
     * Sets and gets the options to customize the legend margin.
     */
    margin: MarginModel;
}
export declare class Legend {
    legendCollection: LegendOptions[];
    legendRenderingCollections: Object[];
    protected legendRegions: ILegendRegions[];
    titleRect: Rect;
    private totalRowCount;
    private maxColumnWidth;
    protected maxItemHeight: number;
    protected isPaging: boolean;
    protected isVertical: boolean;
    private rowCount;
    private pageButtonSize;
    protected pageXCollections: number[];
    protected maxColumns: number;
    maxWidth: number;
    private clipRect;
    private legendTranslateGroup;
    protected currentPage: number;
    private gauge;
    private totalPages;
    private legend;
    private legendID;
    protected pagingRegions: Rect[];
    private clipPathHeight;
    private toggledIndexes;
    /**
     * Sets and gets the legend bounds in circular gauge.
     * @private
     */
    legendBounds: Rect;
    /**  @private */
    position: LegendPosition;
    constructor(gauge: CircularGauge);
    /**
     * Binding events for legend module.
     */
    private addEventListener;
    /**
     * UnBinding events for legend module.
     */
    private removeEventListener;
    /**
     * Get the legend options.
     * @return {void}
     * @private
     */
    getLegendOptions(axes: Axis[]): void;
    calculateLegendBounds(rect: Rect, availableSize: Size): void;
    /**
     * To find legend alignment for chart and accumulation chart
     */
    private alignLegend;
    /**
     * To find legend location based on position, alignment for chart and accumulation chart
     */
    private getLocation;
    /**
     * Renders the legend.
     * @return {void}
     * @private
     */
    renderLegend(legend: LegendSettingsModel, legendBounds: Rect, redraw?: boolean): void;
    /**
     * To render legend paging elements for chart and accumulation chart
     */
    private renderPagingElements;
    /**
     * To translate legend pages for chart and accumulation chart
     */
    protected translatePage(pagingText: Element, page: number, pageNumber: number): number;
    /**
     * To render legend text for chart and accumulation chart
     */
    protected renderText(legendOption: LegendOptions, group: Element, textOptions: TextOption, axisIndex: number, rangeIndex: number): void;
    /**
     * To render legend symbols for chart and accumulation chart
     */
    protected renderSymbol(legendOption: LegendOptions, group: Element, axisIndex: number, rangeIndex: number): void;
    /**
     * To find legend rendering locations from legend options.
     * @private
     */
    getRenderPoint(legendOption: LegendOptions, start: GaugeLocation, textPadding: number, prevLegend: LegendOptions, rect: Rect, count: number, firstLegend: number): void;
    /**
     * To show or hide the legend on clicking the legend.
     * @return {void}
     */
    click(event: Event): void;
    /**
     * Set toggled legend styles.
     */
    private setStyles;
    /**
     * To get legend by index
     */
    private legendByIndex;
    /**
     * To change legend pages for chart and accumulation chart
     */
    protected changePage(event: Event, pageUp: boolean): void;
    /**
     * To find available width from legend x position.
     */
    private getAvailWidth;
    /**
     * To create legend rendering elements for chart and accumulation chart
     */
    private createLegendElements;
    /**
     * Method to append child element
     */
    private appendChildElement;
    /**
     * To find first valid legend text index for chart and accumulation chart
     */
    private findFirstLegendPosition;
    /**
     * To find legend bounds for accumulation chart.
     * @private
     */
    getLegendBounds(availableSize: Size, legendBounds: Rect, legend: LegendSettingsModel): void;
    /** @private */
    private subtractThickness;
    /**
     * To set bounds for chart and accumulation chart
     */
    protected setBounds(computedWidth: number, computedHeight: number, legend: LegendSettingsModel, legendBounds: Rect): void;
    /**
     * To find maximum column size for legend
     */
    private getMaxColumn;
    /**
     * To show or hide trimmed text tooltip for legend.
     * @return {void}
     * @private
     */
    move(event: Event): void;
    /**
     * Get module name.
     */
    protected getModuleName(): string;
    /**
     * To destroy the legend.
     * @return {void}
     * @private
     */
    destroy(circulargauge: CircularGauge): void;
}
/**
 * @private
 */
export declare class Index {
    axisIndex: number;
    rangeIndex: number;
    isToggled: boolean;
    constructor(axisIndex: number, rangeIndex?: number, isToggled?: boolean);
}
/**
 * Class for legend options
 * @private
 */
export declare class LegendOptions {
    render: boolean;
    text: string;
    originalText: string;
    fill: string;
    shape: GaugeShape;
    visible: boolean;
    textSize: Size;
    location: GaugeLocation;
    border: Border;
    shapeBorder: Border;
    shapeWidth: number;
    shapeHeight: number;
    rangeIndex?: number;
    axisIndex?: number;
    constructor(text: string, originalText: string, fill: string, shape: GaugeShape, visible: boolean, border: Border, shapeBorder: Border, shapeWidth: number, shapeHeight: number, rangeIndex?: number, axisIndex?: number);
}
