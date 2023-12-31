/**
 * AccumulationChart file
 */
import { Component, INotifyPropertyChanged } from '@syncfusion/ej2-base';
import { ModuleDeclaration, Internationalization, EmitType } from '@syncfusion/ej2-base';
import { AccumulationChartModel } from './accumulation-model';
import { AccumulationSeries, AccPoints } from './model/acc-base';
import { AccumulationType, AccumulationSelectionMode } from './model/enum';
import { IAccSeriesRenderEventArgs, IAccTextRenderEventArgs } from './model/pie-interface';
import { IAccAnimationCompleteEventArgs, IAccPointRenderEventArgs, IAccLoadedEventArgs } from './model/pie-interface';
import { ILegendRenderEventArgs, IMouseEventArgs, IPointEventArgs, ITooltipRenderEventArgs, IAfterExportEventArgs } from '../chart/model/chart-interface';
import { IAnnotationRenderEventArgs } from '../chart/model/chart-interface';
import { FontModel, MarginModel, BorderModel, IndexesModel, TooltipSettingsModel } from '../common/model/base-model';
import { AccumulationSeriesModel, PieCenterModel } from './model/acc-base-model';
import { AccumulationLegend } from './renderer/legend';
import { LegendSettingsModel } from '../common/legend/legend-model';
import { ChartLocation } from '../common/utils/helper';
import { Rect, Size, SvgRenderer, CanvasRenderer } from '@syncfusion/ej2-svg-base';
import { AccumulationTooltip } from './user-interaction/tooltip';
import { AccumulationBase } from './renderer/accumulation-base';
import { PieSeries } from './renderer/pie-series';
import { AccumulationDataLabel } from './renderer/dataLabel';
import { FunnelSeries } from './renderer/funnel-series';
import { PyramidSeries } from './renderer/pyramid-series';
import { AccumulationSelection } from './user-interaction/selection';
import { AccumulationTheme } from './model/enum';
import { AccumulationAnnotationSettingsModel } from './model/acc-base-model';
import { AccumulationAnnotation } from './annotation/annotation';
import { IPrintEventArgs } from '../chart/model/chart-interface';
import { ExportType, SelectionPattern } from '../common/utils/enum';
import { IThemeStyle } from '../chart/model/chart-interface';
import { IAccResizeEventArgs } from './model/pie-interface';
import { DataManager } from '@syncfusion/ej2-data';
import { Export } from '../chart/print-export/export';
/**
 * Represents the AccumulationChart control.
 * ```html
 * <div id="accumulation"/>
 * <script>
 *   var accObj = new AccumulationChart({ });
 *   accObj.appendTo("#accumulation");
 * </script>
 * ```
 * @public
 */
export declare class AccumulationChart extends Component<HTMLElement> implements INotifyPropertyChanged {
    /**
     * `accBaseModue` is used to define the common functionalities of accumulation series
     * @private
     */
    accBaseModule: AccumulationBase;
    /**
     * `pieSeriesModule` is used to render pie series.
     * @private
     */
    pieSeriesModule: PieSeries;
    /**
     * `funnelSeriesModule` is used to render funnel series.
     * @private
     */
    funnelSeriesModule: FunnelSeries;
    /**
     * `pyramidSeriesModule` is used to render funnel series.
     * @private
     */
    pyramidSeriesModule: PyramidSeries;
    /**
     * `accumulationLegendModule` is used to manipulate and add legend in accumulation chart.
     */
    accumulationLegendModule: AccumulationLegend;
    /**
     * `accumulationDataLabelModule` is used to manipulate and add dataLabel in accumulation chart.
     */
    accumulationDataLabelModule: AccumulationDataLabel;
    /**
     * `accumulationTooltipModule` is used to manipulate and add tooltip in accumulation chart.
     */
    accumulationTooltipModule: AccumulationTooltip;
    /**
     * `accumulationSelectionModule` is used to manipulate and add selection in accumulation chart.
     */
    accumulationSelectionModule: AccumulationSelection;
    /**
     * `annotationModule` is used to manipulate and add annotation in chart.
     */
    annotationModule: AccumulationAnnotation;
    /**
     * Export Module is used to export Accumulation chart.
     */
    exportModule: Export;
    /**
     * The width of the chart as a string in order to provide input as both like '100px' or '100%'.
     * If specified as '100%, chart will render to the full width of its parent element.
     * @default null
     */
    width: string;
    /**
     * The height of the chart as a string in order to provide input as both like '100px' or '100%'.
     * If specified as '100%, chart will render to the full height of its parent element.
     * @default null
     */
    height: string;
    /**
     * Title for accumulation chart
     * @default null
     */
    title: string;
    /**
     * The background image of the chart that accepts value in string as url link or location of an image.
     * @default null
     */
    backgroundImage: string;
    /**
     * Center of pie
     */
    center: PieCenterModel;
    /**
     * Specifies the dataSource for the AccumulationChart. It can be an array of JSON objects or an instance of DataManager.
     * ```html
     * <div id='Pie'></div>
     * ```
     * ```typescript
     * let dataManager: DataManager = new DataManager({
     *         url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Tasks/'
     * });
     * let query: Query = new Query().take(50).where('Estimate', 'greaterThan', 0, false);
     * let pie: AccumulationChart = new AccumulationChart({
     * ...
     *     dataSource: dataManager,
     *     series: [{
     *        xName: 'Id',
     *        yName: 'Estimate',
     *        query: query
     *    }],
     * ...
     * });
     * pie.appendTo('#Pie');
     * ```
     * @default ''
     */
    dataSource: Object | DataManager;
    /**
     * Options for customizing the `title` of accumulation chart.
     */
    titleStyle: FontModel;
    /**
     * SubTitle for accumulation chart
     * @default null
     */
    subTitle: string;
    /**
     * Options for customizing the `subtitle` of accumulation chart.
     */
    subTitleStyle: FontModel;
    /**
     * Options for customizing the legend of accumulation chart.
     */
    legendSettings: LegendSettingsModel;
    /**
     * Options for customizing the tooltip of accumulation chart.
     */
    tooltip: TooltipSettingsModel;
    /**
     * Specifies whether point has to get selected or not. Takes value either 'None 'or 'Point'
     * @default None
     */
    selectionMode: AccumulationSelectionMode;
    /**
     * Specifies whether point has to get highlighted or not. Takes value either 'None 'or 'Point'
     * @default None
     */
    highLightMode: AccumulationSelectionMode;
    /**
     * Specifies whether series or data point for accumulation chart has to be selected. They are,
     * * none: sets none as selecting pattern to accumulation chart .
     * * chessboard: sets chess board as selecting pattern accumulation chart .
     * * dots: sets dots as  selecting pattern accumulation chart .
     * * diagonalForward: sets diagonal forward as selecting pattern to accumulation chart .
     * * crosshatch: sets crosshatch as selecting pattern to accumulation chart.
     * * pacman: sets pacman selecting pattern to accumulation chart.
     * * diagonalbackward: sets diagonal backward as selecting pattern to accumulation chart.
     * * grid: sets grid as selecting pattern to accumulation chart.
     * * turquoise: sets turquoise as selecting pattern to accumulation chart.
     * * star: sets star as selecting pattern to accumulation chart.
     * * triangle: sets triangle as selecting pattern to accumulation chart.
     * * circle: sets circle as selecting pattern to accumulation chart.
     * * tile: sets tile as selecting pattern to accumulation chart.
     * * horizontaldash: sets horizontal dash as selecting pattern to accumulation chart.
     * * verticaldash: sets vertical dash as selecting pattern to accumulation chart.
     * * rectangle: sets rectangle as selecting pattern.
     * * box: sets box as selecting pattern to accumulation chart.
     * * verticalstripe: sets vertical stripe as  selecting pattern to accumulation chart.
     * * horizontalstripe: sets horizontal stripe as selecting pattern to accumulation chart.
     * * bubble: sets bubble as selecting pattern to accumulation chart.
     * @default None
     */
    selectionPattern: SelectionPattern;
    /**
     * Specifies whether series or data point has to be selected. They are,
     * * none: sets none as highlighting pattern to accumulation chart.
     * * chessboard: sets chess board as highlighting pattern to accumulation chart.
     * * dots: sets dots as highlighting pattern to accumulation chart.
     * * diagonalForward: sets diagonal forward as highlighting pattern to accumulation chart.
     * * crosshatch: sets crosshatch as highlighting pattern to accumulation chart.
     * * pacman: sets pacman highlighting  pattern to accumulation chart.
     * * diagonalbackward: sets diagonal backward as highlighting pattern to accumulation chart.
     * * grid: sets grid as highlighting pattern to accumulation chart.
     * * turquoise: sets turquoise as highlighting pattern to accumulation chart.
     * * star: sets star as highlighting  pattern to accumulation chart.
     * * triangle: sets triangle as highlighting pattern to accumulation chart.
     * * circle: sets circle as highlighting  pattern to accumulation chart.
     * * tile: sets tile as highlighting pattern to accumulation chart.
     * * horizontaldash: sets horizontal dash as highlighting pattern to accumulation chart.
     * * verticaldash: sets vertical dash as highlighting pattern to accumulation chart.
     * * rectangle: sets rectangle as highlighting  pattern to accumulation chart.
     * * box: sets box as highlighting pattern to accumulation chart.
     * * verticalstripe: sets vertical stripe as highlighting  pattern to accumulation chart.
     * * horizontalstripe: sets horizontal stripe as highlighting  pattern to accumulation chart.
     * * bubble: sets bubble as highlighting  pattern to accumulation chart.
     * @default None
     */
    highlightPattern: SelectionPattern;
    /**
     * If set true, enables the border in pie and accumulation chart while mouse moving.
     * @default true
     */
    enableBorderOnMouseMove: boolean;
    /**
     * If set true, enables the multi selection in accumulation chart. It requires `selectionMode` to be `Point`.
     * @default false
     */
    isMultiSelect: boolean;
    /**
     * If set true, enables the animation for both chart and accumulation.
     * @default true
     */
    enableAnimation: boolean;
    /**
     * Specifies the point indexes to be selected while loading a accumulation chart.
     * It requires `selectionMode` to be `Point`.
     * ```html
     * <div id='Pie'></div>
     * ```
     * ```typescript
     * let pie: AccumulationChart = new AccumulationChart({
     * ...
     *   selectionMode: 'Point',
     *   selectedDataIndexes: [ { series: 0, point: 1},
     *                          { series: 2, point: 3} ],
     * ...
     * });
     * pie.appendTo('#Pie');
     * ```
     * @default []
     */
    selectedDataIndexes: IndexesModel[];
    /**
     *  Options to customize the left, right, top and bottom margins of accumulation chart.
     */
    margin: MarginModel;
    /**
     * If set true, labels for the point will be placed smartly without overlapping.
     * @default true
     */
    enableSmartLabels: boolean;
    /**
     * Options for customizing the color and width of the chart border.
     */
    border: BorderModel;
    /**
     * The background color of the chart, which accepts value in hex, rgba as a valid CSS color string.
     * @default null
     */
    background: string;
    /**
     * The configuration for series in accumulation chart.
     */
    series: AccumulationSeriesModel[];
    /**
     * The configuration for annotation in chart.
     */
    annotations: AccumulationAnnotationSettingsModel[];
    /**
     * Specifies the theme for accumulation chart.
     * @default 'Material'
     */
    theme: AccumulationTheme;
    /**
     * Specifies whether a grouping separator should be used for a number.
     * @default false
     */
    useGroupingSeparator: boolean;
    /**
     * To enable export feature in chart.
     * @default true
     */
    enableExport: boolean;
    /**
     * To enable export feature in blazor chart.
     * @default false
     */
    allowExport: boolean;
    /**
     * Triggers after accumulation chart loaded.
     * @event
     * @blazorProperty 'Loaded'
     */
    loaded: EmitType<IAccLoadedEventArgs>;
    /**
     * Triggers before accumulation chart load.
     * @event
     */
    load: EmitType<IAccLoadedEventArgs>;
    /**
     * Triggers before the series gets rendered.
     * @event

     */
    seriesRender: EmitType<IAccSeriesRenderEventArgs>;
    /**
     * Triggers before the legend gets rendered.
     * @event

     */
    legendRender: EmitType<ILegendRenderEventArgs>;
    /**
     * Triggers before the data label for series gets rendered.
     * @event

     */
    textRender: EmitType<IAccTextRenderEventArgs>;
    /**
     * Triggers before the tooltip for series gets rendered.
     * @event
     */
    tooltipRender: EmitType<ITooltipRenderEventArgs>;
    /**
     * Triggers before each points for series gets rendered.
     * @event

     */
    pointRender: EmitType<IAccPointRenderEventArgs>;
    /**
     * Triggers before the annotation gets rendered.
     * @event

     */
    annotationRender: EmitType<IAnnotationRenderEventArgs>;
    /**
     * Triggers before the prints gets started.
     * @event
     * @blazorProperty 'OnPrint'
     */
    beforePrint: EmitType<IPrintEventArgs>;
    /**
     * Triggers on hovering the accumulation chart.
     * @event
     * @blazorProperty 'OnChartMouseMove'
     */
    chartMouseMove: EmitType<IMouseEventArgs>;
    /**
     * Triggers on clicking the accumulation chart.
     * @event
     * @blazorProperty 'OnChartMouseClick'
     */
    chartMouseClick: EmitType<IMouseEventArgs>;
    /**
     * Triggers on point click.
     * @event
     * @blazorProperty 'OnPointClick'
     */
    pointClick: EmitType<IPointEventArgs>;
    /**
     * Triggers on point move.
     * @event
     * @blazorProperty 'PointMoved'
     */
    pointMove: EmitType<IPointEventArgs>;
    /**
     * Triggers after animation gets completed for series.
     * @event
     * @blazorProperty 'OnAnimationComplete'
     */
    animationComplete: EmitType<IAccAnimationCompleteEventArgs>;
    /**
     * Triggers on mouse down.
     * @event
     * @blazorProperty 'OnChartMouseDown'
     */
    chartMouseDown: EmitType<IMouseEventArgs>;
    /**
     * Triggers while cursor leaves the accumulation chart.
     * @event
     * @blazorProperty 'OnChartMouseLeave'
     */
    chartMouseLeave: EmitType<IMouseEventArgs>;
    /**
     * Triggers on mouse up.
     * @event
     * @blazorProperty 'OnChartMouseUp'
     */
    chartMouseUp: EmitType<IMouseEventArgs>;
    /**
     * Triggers after window resize.
     * @event
     * @blazorProperty 'Resized'
     */
    resized: EmitType<IAccResizeEventArgs>;
    /**
     * Triggers after the export completed.
     * @event
     * @blazorProperty 'AfterExport'
     */
    afterExport: EmitType<IAfterExportEventArgs>;
    /**
     * Defines the currencyCode format of the accumulation chart
     * @private
     * @aspType string
     */
    private currencyCode;
    /**
     * Animate the series bounds on data change.
     * @private
     */
    animate(duration?: number): void;
    /** @private */
    svgObject: Element;
    /** @private */
    private animateselected;
    /** @public */
    duration: number;
    /** @private */
    initialClipRect: Rect;
    /** @private */
    availableSize: Size;
    /** @private */
    renderer: SvgRenderer | CanvasRenderer;
    /** @private */
    intl: Internationalization;
    /** @private */
    visibleSeries: AccumulationSeries[];
    /** @private */
    seriesCounts: number;
    /** @private explode radius internal property */
    explodeDistance: number;
    /** @private Mouse position x */
    mouseX: number;
    /** @private Mouse position y */
    mouseY: number;
    private resizeTo;
    /** @private */
    origin: ChartLocation;
    /** @private */
    readonly type: AccumulationType;
    /** @private */
    isTouch: boolean;
    /** @private */
    redraw: boolean;
    /** @private */
    animateSeries: boolean;
    private titleCollection;
    private subTitleCollection;
    /** @private */
    themeStyle: IThemeStyle;
    private chartid;
    /** @private */
    isBlazor: boolean;
    /**
     * Constructor for creating the AccumulationChart widget
     * @private
     */
    constructor(options?: AccumulationChartModel, element?: string | HTMLElement);
    /**
     *  To create svg object, renderer and binding events for the container.
     */
    protected preRender(): void;
    /**
     * Themeing for chart goes here
     */
    private setTheme;
    /**
     * To render the accumulation chart elements
     */
    protected render(): void;
    /**
     * Method to unbind events for accumulation chart
     */
    private unWireEvents;
    /**
     * Method to bind events for the accumulation chart
     */
    private wireEvents;
    /**
     * Method to set mouse x, y from events
     */
    private setMouseXY;
    /**
     * Handles the mouse end.
     * @return {boolean}
     * @private
     */
    accumulationMouseEnd(e: PointerEvent): boolean;
    /**
     * Handles the mouse start.
     * @return {boolean}
     * @private
     */
    accumulationMouseStart(e: PointerEvent): boolean;
    /**
     * Handles the accumulation chart resize.
     * @return {boolean}
     * @private
     */
    accumulationResize(e: Event): boolean;
    /**
     * Handles the print method for accumulation chart control.
     */
    print(id?: string[] | string | Element): void;
    /**
     * Export method for the chart.
     */
    export(type: ExportType, fileName: string): void;
    /**
     * Applying styles for accumulation chart element
     */
    private setStyle;
    /**
     * Method to set the annotation content dynamically for accumulation.
     */
    setAnnotationValue(annotationIndex: number, content: string): void;
    /**
     * Handles the mouse move on accumulation chart.
     * @return {boolean}
     * @private
     */
    accumulationMouseMove(e: PointerEvent): boolean;
    titleTooltip(event: Event, x: number, y: number, isTouch?: boolean): void;
    /**
     * Handles the mouse click on accumulation chart.
     * @return {boolean}
     * @private
     */
    accumulationOnMouseClick(e: PointerEvent): boolean;
    private triggerPointEvent;
    /**
     * Handles the mouse right click on accumulation chart.
     * @return {boolean}
     * @private
     */
    accumulationRightClick(event: MouseEvent | PointerEvent): boolean;
    /**
     * Handles the mouse leave on accumulation chart.
     * @return {boolean}
     * @private
     */
    accumulationMouseLeave(e: PointerEvent): boolean;
    /**
     * Method to set culture for chart
     */
    private setCulture;
    /**
     * Method to create SVG element for accumulation chart.
     */
    private createPieSvg;
    /**
     * To Remove the SVG from accumulation chart.
     * @return {boolean}
     * @private
     */
    removeSvg(): void;
    /**
     * Method to create the secondary element for tooltip, datalabel and annotaitons.
     */
    private createSecondaryElement;
    /**
     * Method to find visible series based on series types
     */
    private calculateVisibleSeries;
    /**
     * To find points from dataSource
     */
    private processData;
    /**
     * To refresh the accumulation chart
     * @private
     */
    refreshChart(): void;
    /**
     * Method to find groupped points
     */
    private doGrouppingProcess;
    /**
     * Method to calculate bounds for accumulation chart
     */
    private calculateBounds;
    private calculateLegendBounds;
    /**
     * To render elements for accumulation chart
     * @private
     */
    renderElements(): void;
    /**
     * To set the left and top position for data label template for center aligned chart
     * @private
     */
    setSecondaryElementPosition(): void;
    /**
     * To render the annotaitions for accumulation series.
     * @private
     */
    renderAnnotation(): void;
    /**
     * Method to process the explode in accumulation chart
     * @private
     */
    processExplode(): void;
    /**
     * Method to render series for accumulation chart
     */
    private renderSeries;
    /**
     * Method to render border for accumulation chart
     */
    private renderBorder;
    /**
     * Method to render legend for accumulation chart
     */
    private renderLegend;
    /**
     * To process the selection in accumulation chart
     * @private
     */
    processSelection(): void;
    /**
     * To render title for accumulation chart
     */
    private renderTitle;
    private renderSubTitle;
    /**
     * To get the series parent element
     * @private
     */
    getSeriesElement(): Element;
    /**
     * To refresh the all visible series points
     * @private
     */
    refreshSeries(): void;
    /**
     * To refresh points label region and visible
     * @private
     */
    refreshPoints(points: AccPoints[]): void;
    /**
     * To get Module name
     *  @private
     */
    getModuleName(): string;
    /**
     * To destroy the accumulationcharts
     * @private
     */
    destroy(): void;
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    requiredModules(): ModuleDeclaration[];
    /**
     * To find datalabel visibility in series
     */
    private findDatalabelVisibility;
    /**
     * Get visible series for accumulation chart by index
     */
    private changeVisibleSeries;
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    getPersistData(): string;
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    onPropertyChanged(newProp: AccumulationChartModel, oldProp: AccumulationChartModel): void;
}
