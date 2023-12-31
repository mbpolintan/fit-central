/**
 * Heat Map Component
 */
import { Component, Internationalization } from '@syncfusion/ej2-base';
import { ModuleDeclaration, EmitType } from '@syncfusion/ej2-base';
import { INotifyPropertyChanged } from '@syncfusion/ej2-base';
import { SvgRenderer, CanvasRenderer } from '@syncfusion/ej2-svg-base';
import { Size, Rect, CurrentRect, ToggleVisibility } from './utils/helper';
import { SelectedCellDetails } from './utils/helper';
import { CanvasTooltip } from './utils/helper';
import { HeatMapModel } from './heatmap-model';
import { MarginModel, TitleModel } from './model/base-model';
import { ColorCollection, LegendColorCollection } from './model/base';
import { IThemeStyle, ILoadedEventArgs, ICellClickEventArgs, ITooltipEventArgs, IResizeEventArgs } from './model/interface';
import { ICellEventArgs, ISelectedEventArgs } from './model/interface';
import { DrawType, HeatMapTheme, ColorGradientMode } from './utils/enum';
import { Axis } from './axis/axis';
import { AxisModel } from './axis/axis-model';
import { AxisHelper } from './axis/axis-helpers';
import { Series } from './series/series';
import { CellSettingsModel } from './series/series-model';
import { PaletteSettingsModel } from './utils/colorMapping-model';
import { TooltipSettingsModel } from './utils/tooltip-model';
import { Tooltip } from './utils/tooltip';
import { LegendSettingsModel } from '../heatmap/legend/legend-model';
import { Legend } from '../heatmap/legend/legend';
import { Adaptor } from './datasource/adaptor';
import { DataModel } from './datasource/adaptor-model';
import { ILegendRenderEventArgs } from './model/interface';
import { ExportType } from '../heatmap/utils/enum';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
export declare class HeatMap extends Component<HTMLElement> implements INotifyPropertyChanged {
    /**
     * The width of the heatmap as a string accepts input as both like '100px' or '100%'.
     * If specified as '100%, heatmap renders to the full width of its parent element.
     * @default null
     */
    width: string;
    /**
     * The height of the heatmap as a string accepts input as both like '100px' or '100%'.
     * If specified as '100%, heatmap renders to the full height of its parent element.
     * @default null
     */
    height: string;
    /**
     * Enable or disable the tool tip for heatmap
     * @default true
     */
    showTooltip: boolean;
    /**
     * Triggers when click the heat map cell.
     * @event
     * @blazorProperty 'TooltipRendering'
     */
    tooltipRender: EmitType<ITooltipEventArgs>;
    /**
     * Triggers after resizing of Heatmap.
     * @event
     * @blazorProperty 'Resized'
     */
    resized: EmitType<IResizeEventArgs>;
    /**
     * Triggers after heatmap is loaded.
     * @event
     * @blazorProperty 'Loaded'
     */
    loaded: EmitType<ILoadedEventArgs>;
    /**
     * Triggers before each heatmap cell renders.

     * @event
     * @blazorProperty 'CellRendering'
     */
    cellRender: EmitType<ICellEventArgs>;
    /**
     * Triggers when multiple cells gets selected.
     * @event
     * @blazorProperty 'CellSelected'
     */
    cellSelected: EmitType<ISelectedEventArgs>;
    /**
     * Specifies the rendering mode of heat map.
     * * SVG - Heat map is render using SVG draw mode.
     * * Canvas - Heat map is render using Canvas draw mode.
     * * Auto - Automatically switch the draw mode based on number of records in data source.
     * @default SVG
     */
    renderingMode: DrawType;
    /**
     * Specifies the datasource for the heat map.
     * @isdatamanager false
     * @default null
     */
    dataSource: Object;
    /**
     * Specifies the datasource settings for heat map.
     */
    dataSourceSettings: DataModel;
    /**
     *  Specifies the theme for heatmap.
     * @default 'Material'
     */
    theme: HeatMapTheme;
    /**
     * Enable or disable the selection of multiple cells in heatmap
     * @default false
     */
    allowSelection: boolean;
    /**
     * Options to customize left, right, top and bottom margins of the heat map.
     */
    margin: MarginModel;
    /**
     * Title of heat map
     * @default ''
     */
    titleSettings: TitleModel;
    /**
     * Options to configure the horizontal axis.
     */
    xAxis: AxisModel;
    /**
     * Options for customizing the legend of the heat map
     * @default ''
     */
    legendSettings: LegendSettingsModel;
    /**
     * Options for customizing the cell color of the heat map
     */
    paletteSettings: PaletteSettingsModel;
    /**
     * Options for customizing the ToolTipSettings property  of the heat map
     */
    tooltipSettings: TooltipSettingsModel;
    /**
     * Options to configure the vertical axis.
     */
    yAxis: AxisModel;
    /**
     * Options to customize the heat map cell
     */
    cellSettings: CellSettingsModel;
    /**
     * Triggers after heat map rendered.
     * @event
     * @blazorProperty 'Created'
     */
    created: EmitType<Object>;
    /**
     * Triggers before heat map load.
     * @event
     * @blazorProperty 'OnLoad'
     */
    load: EmitType<ILoadedEventArgs>;
    /**
     * Triggers when click the heat map cell.
     * @event
     * @blazorProperty 'CellClicked'
     */
    cellClick: EmitType<ICellClickEventArgs>;
    /**
     * Triggers before the legend is rendered.

     * @event
     * @blazorProperty 'LegendRendering'
     */
    legendRender: EmitType<ILegendRenderEventArgs>;
    /** @private */
    enableCanvasRendering: boolean;
    /** @private */
    colorGradientMode: ColorGradientMode;
    /** @private */
    renderer: SvgRenderer;
    /** @private */
    canvasRenderer: CanvasRenderer;
    /** @private */
    secondaryCanvasRenderer: CanvasRenderer;
    /** @private */
    svgObject: Element;
    /** @private */
    availableSize: Size;
    /** @private */
    private elementSize;
    /** @private */
    themeStyle: IThemeStyle;
    /** @private */
    isColorRange: boolean;
    /** @private */
    initialClipRect: Rect;
    heatMapAxis: AxisHelper;
    heatMapSeries: Series;
    private drawSvgCanvas;
    private twoDimensional;
    private cellColor;
    /** @private */
    colorCollection: ColorCollection[];
    /** @private */
    legendColorCollection: LegendColorCollection[];
    /** @private */
    tempRectHoverClass: string;
    /** @private */
    legendVisibilityByCellType: boolean;
    /** @private */
    bubbleSizeWithColor: boolean;
    /** @private */
    tempTooltipRectId: string;
    /** @private */
    clonedDataSource: any[];
    /** @private */
    completeAdaptDataSource: Object;
    /** @private */
    xLength: number;
    /** @private */
    yLength: number;
    /** @private */
    isCellTapHold: boolean;
    /** @private */
    selectedCellCount: number;
    /** @private */
    currentRect: CurrentRect;
    /** @private */
    dataSourceMinValue: number;
    /** @private */
    dataMin: number[];
    /** @private */
    dataMax: number[];
    /** @private */
    dataSourceMaxValue: number;
    /** @private */
    minColorValue: number;
    /** @private */
    maxColorValue: number;
    /** @private */
    isColorValueExist: boolean;
    /** @private */
    tooltipTimer: number;
    /** @private */
    gradientTimer: number;
    /** @private */
    legendTooltipTimer: number;
    /** @private */
    resizeTimer: number;
    /** @private */
    emptyPointColor: string;
    /** @private */
    rangeSelection: boolean;
    /** @private */
    toggleValue: ToggleVisibility[];
    /** @private */
    legendOnLoad: boolean;
    /** @private */
    resizing: boolean;
    /** @private */
    rendering: boolean;
    /** @private */
    horizontalGradient: boolean;
    /** @private */
    multiSelection: boolean;
    /** @private */
    rectSelected: boolean;
    /** @private */
    previousRect: CurrentRect;
    /** @private */
    selectedCellsRect: Rect;
    /** @private */
    previousSelectedCellsRect: Rect[];
    /** @private */
    canvasSelectedCells: Rect;
    /** @private */
    multiCellCollection: SelectedCellDetails[];
    /** @private */
    selectedMultiCellCollection: SelectedCellDetails[];
    /** @private */
    tempMultiCellCollection: SelectedCellDetails[][];
    /** @private */
    titleRect: Rect;
    /** @private */
    initialCellX: number;
    /** @private */
    initialCellY: number;
    /**
     * @private
     */
    tooltipCollection: CanvasTooltip[];
    /**
     * @private
     */
    isTouch: boolean;
    /**
     * @private
     */
    isRectBoundary: boolean;
    /**
     * @private
     */
    private border;
    /**
     * Gets the axis of the HeatMap.
     * @hidden
     */
    axisCollections: Axis[];
    /**
     * @private
     */
    intl: Internationalization;
    /**
     * @private
     */
    isCellData: boolean;
    private titleCollection;
    /**
     * @private
     */
    mouseX: number;
    /**
     * @private
     */
    mouseY: number;
    /** @private */
    isBlazor: boolean;
    /**
     * The `legendModule` is used to display the legend.
     * @private
     */
    legendModule: Legend;
    /**
     * The `tooltipModule` is used to manipulate Tooltip item from base of heatmap.
     * @private
     */
    tooltipModule: Tooltip;
    /**
     * The `adaptorModule` is used to manipulate Adaptor item from base of heatmap.
     * @private
     */
    adaptorModule: Adaptor;
    protected preRender(): void;
    /**
     * Handles the export method for heatmap control.
     * @param type
     * @param fileName
     * @param orientation
     */
    export(type: ExportType, fileName: string, orientation?: PdfPageOrientation): void;
    private initPrivateVariable;
    /**
     * Method to set culture for heatmap
     */
    private setCulture;
    protected render(): void;
    /**
     * To re-calculate the datasource while changing datasource property dynamically.
     * @private
     */
    private reRenderDatasource;
    /**
     * To process datasource property.
     * @private
     */
    private processInitData;
    /**
     * To set render mode of heatmap as SVG or Canvas.
     * @private
     */
    private setRenderMode;
    /**
     * To set bubble helper private property.
     * @private
     */
    private updateBubbleHelperProperty;
    private renderElements;
    /**
     * Get component name
     */
    getModuleName(): string;
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    getPersistData(): string;
    /**
     * @private
     */
    onPropertyChanged(newProp: HeatMapModel, oldProp: HeatMapModel): void;
    private paletteCellSelectionUpdation;
    /**
     * create svg or canvas element
     * @private
     */
    createSvg(): void;
    /**
     *  To Remove the SVG.
     * @private
     */
    removeSvg(): void;
    private renderSecondaryElement;
    /**
     * To provide the array of modules needed for control rendering
     * @return{ModuleDeclaration[]}
     * @private
     */
    requiredModules(): ModuleDeclaration[];
    /**
     * To destroy the widget
     * @method destroy
     * @return {void}.
     * @member of Heatmap
     */
    destroy(): void;
    /**
     * Applies all the pending property changes and render the component again.
     * @method destroy
     * @return {void}.
     */
    refresh(): void;
    /**
     * Appending svg object to the element
     * @private
     */
    private appendSvgObject;
    private renderBorder;
    private calculateSize;
    private renderTitle;
    private titleTooltip;
    private axisTooltip;
    private isHeatmapRect;
    private setTheme;
    private calculateBounds;
    refreshBound(): void;
    private initAxis;
    /**
     * Method to bind events for HeatMap
     */
    private wireEvents;
    /**
     * Applying styles for heatmap element
     */
    private setStyle;
    /**
     * Method to print the heatmap.
     */
    print(): void;
    /**
     * Method to unbind events for HeatMap
     */
    private unWireEvents;
    /**
     * Handles the heatmap resize.
     * @return {boolean}
     * @private
     */
    heatMapResize(e: Event): boolean;
    /**
     * Method to bind selection after window resize for HeatMap
     */
    private updateCellSelection;
    private clearSVGSelection;
    /**
     * Get the maximum length of data source for both horizontal and vertical
     * @private
     */
    private calculateMaxLength;
    /**
     * To find mouse x, y for aligned heatmap element svg position
     */
    private setMouseXY;
    heatMapMouseClick(e: PointerEvent): boolean;
    /**
     * Handles the mouse Move.
     * @return {boolean}
     * @private
     */
    heatMapMouseMove(e: PointerEvent): boolean;
    /**
     * Handles the mouse Move.
     * @return {boolean}
     */
    private mouseAction;
    /**
     * Triggering cell selection
     */
    private cellSelectionOnMouseMove;
    /**
     * Rendering tooltip on mouse move
     */
    private tooltipOnMouseMove;
    /**
     * To select the multiple cells on mouse move action
     */
    private highlightSelectedCells;
    /**
     * Method to get selected cell data collection for HeatMap
     */
    private getDataCollection;
    /**
     * To get the selected datas.
     */
    private getCellCollection;
    /**
     * To remove the selection on mouse click without ctrl key.
     */
    private removeSelectedCellsBorder;
    /**
     * To highlight the selected multiple cells on mouse move action in canvas mode.
     */
    private highlightSelectedAreaInCanvas;
    /**
     * To get the collection of selected cells.
     */
    private getSelectedCellData;
    /**
     * To add class for selected cells
     * @private
     */
    addSvgClass(element: Element): void;
    /**
     * To remove class for unselected cells
     * @private
     */
    removeSvgClass(rectElement: Element, className: string): void;
    /**
     * To clear the multi cell selection
     */
    clearSelection(): void;
    private renderMousePointer;
    /**
     * Handles the mouse end.
     * @return {boolean}
     * @private
     */
    heatMapMouseLeave(e: PointerEvent): boolean;
    /**
     * Method to Check for deselection of cell.
     */
    private checkSelectedCells;
    /**
     * Method to remove opacity for text of selected cell for HeatMap
     */
    private removeOpacity;
    /**
     * Method to set opacity for selected cell for HeatMap
     */
    private setCellOpacity;
    /**
     * To create div container for rendering two layers of canvas.
     * @return {void}
     * @private
     */
    createMultiCellDiv(onLoad: boolean): void;
}
