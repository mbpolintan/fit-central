/**
 * Circular Gauge
 */
import { Component, INotifyPropertyChanged } from '@syncfusion/ej2-base';
import { EmitType, Internationalization, ModuleDeclaration } from '@syncfusion/ej2-base';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { CircularGaugeModel } from './circular-gauge-model';
import { ILoadedEventArgs, IAnimationCompleteEventArgs } from './model/interface';
import { IThemeStyle } from './model/interface';
import { IAxisLabelRenderEventArgs, IRadiusCalculateEventArgs, IPointerDragEventArgs, IResizeEventArgs } from './model/interface';
import { ITooltipRenderEventArgs, ILegendRenderEventArgs, IAnnotationRenderEventArgs } from './model/interface';
import { IMouseEventArgs, IPrintEventArgs } from './model/interface';
import { Size, Rect, GaugeLocation } from './utils/helper';
import { GaugeTheme } from './utils/enum';
import { BorderModel, MarginModel, FontModel, TooltipSettingsModel } from './model/base-model';
import { Axis, Range, Pointer } from './axes/axis';
import { Annotations } from './annotations/annotations';
import { GaugeTooltip } from './user-interaction/tooltip';
import { AxisModel } from './axes/axis-model';
import { AxisLayoutPanel } from './axes/axis-panel';
import { LegendSettingsModel } from './legend/legend-model';
import { Legend } from './legend/legend';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { ExportType } from '../circular-gauge/utils/enum';
import { PdfExport } from './model/pdf-export';
import { ImageExport } from './model/image-export';
import { Print } from './model/print';
import { Gradient } from './axes/gradient';
/**
 * Represents the circular gauge control.
 * ```html
 * <div id="gauge"/>
 * <script>
 *   var gaugeObj = new CircularGauge();
 *   gaugeObj.appendTo("#gauge");
 * </script>
 * ```
 */
export declare class CircularGauge extends Component<HTMLElement> implements INotifyPropertyChanged {
    /**
     * Sets and gets the module that is used to add annotation in the circular gauge.
     */
    annotationsModule: Annotations;
    /**
     * Sets and gets the module that is used to add Print in the circular gauge.
     * @private
     */
    printModule: Print;
    /**
     * Sets and gets the module that is used to add ImageExport in the circular gauge.
     * @private
     */
    imageExportModule: ImageExport;
    /**
     * Sets and gets the module that is used to add pdfExport in the circular gauge.
     * @private
     */
    pdfExportModule: PdfExport;
    /**
     * Sets and gets the module that is used to show the tooltip in the circular gauge.
     */
    tooltipModule: GaugeTooltip;
    /**
     * Sets and gets the module that is used to manipulate and add legend to the circular gauge.
     */
    legendModule: Legend;
    /**
     * Sets and gets the module that enables the gradient option for pointer and ranges.
     * @private
     */
    gradientModule: Gradient;
    /**
     * Sets and gets the width of the circular gauge as a string in order to provide input as both like '100px' or '100%'.
     * If specified as '100%, gauge will render to the full width of its parent element.
     * @default null
     */
    width: string;
    /**
     * Sets and gets the height of the circular gauge as a string in order to provide input as both like '100px' or '100%'.
     * If specified as '100%, gauge will render to the full height of its parent element.
     * @default null
     */
    height: string;
    /**
     * Sets and gets the options for customizing the color and width of the gauge border.
     */
    border: BorderModel;
    /**
     *
     */
    /**
     * Sets and gets the background color of the gauge. This property accepts value in hex code, rgba string as a valid CSS color string.
     * @default null
     */
    background: string;
    /**
     * Sets and gets the title for circular gauge.
     * @default ''
     */
    title: string;
    /**
     * Sets and gets the options for customizing the title for circular gauge.
     */
    titleStyle: FontModel;
    /**
     * Sets and gets the options to customize the left, right, top and bottom margins of the circular gauge.
     */
    margin: MarginModel;
    /**
     * Sets and gets the options for customizing the axes of circular gauge.
     */
    axes: AxisModel[];
    /**
     * Sets and gets the options for customizing the tooltip of gauge.
     */
    tooltip: TooltipSettingsModel;
    /**
     * Enables and disables drag movement of the pointer in the circular gauge.
     * @default false
     */
    enablePointerDrag: boolean;
    /**
     * Enables and disables the drag movement of the ranges in the circular gauge.
     * @default false
     */
    enableRangeDrag: boolean;
    /**
     * Enables and disables the print functionality in circular gauge.
     * @default false
     */
    allowPrint: boolean;
    /**
     * Enables and disables the export to image functionality in circular gauge.
     * @default false
     */
    allowImageExport: boolean;
    /**
     * Enables and disables the export to pdf functionality in circular gauge.
     * @default false
     */
    allowPdfExport: boolean;
    /**
     * Sets and gets the X coordinate of the circular gauge.
     * @default null
     */
    centerX: string;
    /**
     * Sets and gets the Y coordinate of the circular gauge.
     * @default null
     */
    centerY: string;
    /**
     * Enables and disables to place the half or quarter circle in center position, if values not specified for centerX and centerY.
     * @default false
     */
    moveToCenter: boolean;
    /**
     * Sets and gets the themes supported for circular gauge.
     * @default Material
     */
    theme: GaugeTheme;
    /**
     * Enables and disables the grouping separator should be used for a number.
     * @default false
     */
    useGroupingSeparator: boolean;
    /**
     * Sets and gets the information about gauge for assistive technology.
     * @default null
     */
    description: string;
    /**
     * Sets and gets the tab index value for the circular gauge.
     * @default 1
     */
    tabIndex: number;
    /**
     * Sets and gets the options for customizing the legend of the circular gauge.
     */
    legendSettings: LegendSettingsModel;
    /**
     * Triggers after the circular gauge gets loaded.
     * @event
     * @blazorProperty 'Loaded'
     */
    loaded: EmitType<ILoadedEventArgs>;
    /**
     * Triggers before the circular gauge gets loaded.
     * @event
     * @blazorProperty 'OnLoad'
     */
    load: EmitType<ILoadedEventArgs>;
    /**
     * Triggers after the animation gets completed for pointers.
     * @event
     * @blazorProperty 'AnimationCompleted'
     */
    animationComplete: EmitType<IAnimationCompleteEventArgs>;
    /**
     * Triggers before each axis label gets rendered.
     * @event
     * @blazorProperty 'AxisLabelRendering'
     */
    axisLabelRender: EmitType<IAxisLabelRenderEventArgs>;
    /**
     * Triggers before the radius for the circular gauge gets calculated.
     * @event
     * @blazorProperty 'OnRadiusCalculate'
     */
    radiusCalculate: EmitType<IRadiusCalculateEventArgs>;
    /**
     * Triggers before each annotation for the circular gauge gets rendered.
     * @event
     * @blazorProperty 'AnnotationRendering'
     */
    annotationRender: EmitType<IAnnotationRenderEventArgs>;
    /**
     * Triggers before each legend for the circular gauge gets rendered.
     * @event

     * @blazorProperty 'legendRender'
     */
    legendRender: EmitType<ILegendRenderEventArgs>;
    /**
     * Triggers before the tooltip for pointer of the circular gauge gets rendered.
     * @event
     * @blazorProperty 'TooltipRendering'
     */
    tooltipRender: EmitType<ITooltipRenderEventArgs>;
    /**
     * Triggers before the pointer is dragged.
     * @event
     * @blazorProperty 'OnDragStart'
     */
    dragStart: EmitType<IPointerDragEventArgs>;
    /**
     * Triggers while dragging the pointers.
     * @event
     * @blazorProperty 'OnDragMove'
     */
    dragMove: EmitType<IPointerDragEventArgs>;
    /**
     * Triggers after the pointer is dragged.
     * @event
     * @blazorProperty 'OnDragEnd'
     */
    dragEnd: EmitType<IPointerDragEventArgs>;
    /**
     * Triggers on hovering the circular gauge.
     * @event
     * @blazorProperty 'OnGaugeMouseMove'
     */
    gaugeMouseMove: EmitType<IMouseEventArgs>;
    /**
     * Triggers while cursor leaves the circular gauge.
     * @event
     * @blazorProperty 'OnGaugeMouseLeave'
     */
    gaugeMouseLeave: EmitType<IMouseEventArgs>;
    /**
     * Triggers on mouse down.
     * @event
     * @blazorProperty 'OnGaugeMouseDown'
     */
    gaugeMouseDown: EmitType<IMouseEventArgs>;
    /**
     * Triggers on mouse up.
     * @event
     * @blazorProperty 'OnGaugeMouseUp'
     */
    gaugeMouseUp: EmitType<IMouseEventArgs>;
    /**
     * Triggers after window resize.
     * @event
     * @blazorProperty 'Resizing'
     */
    resized: EmitType<IResizeEventArgs>;
    /**
     * Triggers before the prints gets started.
     * @event
     * @blazorProperty 'OnPrint'
     */
    beforePrint: EmitType<IPrintEventArgs>;
    /** @private */
    renderer: SvgRenderer;
    /** @private */
    svgObject: Element;
    /** @private */
    availableSize: Size;
    /** @private */
    intl: Internationalization;
    /** @private */
    private resizeTo;
    /** @private */
    midPoint: GaugeLocation;
    /** @private */
    activePointer: Pointer;
    /** @private */
    activeAxis: Axis;
    /** @private */
    activeRange: Range;
    /** @private */
    gaugeRect: Rect;
    /** @private */
    animatePointer: boolean;
    /** @private */
    startValue: number;
    /** @private */
    endValue: number;
    /**
     * Render axis panel for gauge.
     * @hidden
     * @private
     */
    gaugeAxisLayoutPanel: AxisLayoutPanel;
    /**
     * @private
     */
    gaugeRangeLayoutPanel: AxisLayoutPanel;
    /**
     * @private
     */
    themeStyle: IThemeStyle;
    /** @private */
    isBlazor: boolean;
    /** @private */
    isDrag: boolean;
    /** @private */
    isTouch: boolean;
    /** @private Mouse position x */
    mouseX: number;
    /** @private Mouse position y */
    mouseY: number;
    /**
     * @private
     */
    gradientCount: number;
    /**
     * Constructor for creating the widget
     * @hidden
     */
    constructor(options?: CircularGaugeModel, element?: string | HTMLElement);
    /**
     *  To create svg object, renderer and binding events for the container.
     */
    protected preRender(): void;
    /**
     * To render the circular gauge elements
     */
    protected render(): void;
    private setTheme;
    /**
     * Method to unbind events for circular gauge
     */
    private unWireEvents;
    /**
     * Method to bind events for circular gauge
     */
    private wireEvents;
    /**
     * Handles the mouse click on accumulation chart.
     * @return {boolean}
     * @private
     */
    gaugeOnMouseClick(e: PointerEvent): boolean;
    /**
     * Handles the mouse move.
     * @return {boolean}
     * @private
     */
    mouseMove(e: PointerEvent): boolean;
    /**
     * Handles the mouse leave.
     * @return {boolean}
     * @private
     */
    mouseLeave(e: PointerEvent): boolean;
    /**
     * Handles the mouse right click.
     * @return {boolean}
     * @private
     */
    gaugeRightClick(event: MouseEvent | PointerEvent): boolean;
    /**
     * Handles the pointer draf while mouse move on gauge.
     * @private
     */
    pointerDrag(location: GaugeLocation, axisIndex?: number, pointerIndex?: number): void;
    /**
     * Handles the range draf while mouse move on gauge.
     * @private
     */
    rangeDrag(location: GaugeLocation, axisIndex: number, rangeIndex: number): void;
    /**
     * Handles the mouse down on gauge.
     * @return {boolean}
     * @private
     */
    gaugeOnMouseDown(e: PointerEvent): boolean;
    /**
     * Handles the mouse end.
     * @return {boolean}
     * @private
     */
    mouseEnd(e: PointerEvent): boolean;
    /**
     * Handles the mouse event arguments.
     * @return {IMouseEventArgs}
     * @private
     */
    private getMouseArgs;
    /**
     * Handles the gauge resize.
     * @return {boolean}
     * @private
     */
    gaugeResize(e: Event): boolean;
    /**
     * Applying styles for circular gauge elements
     */
    private setGaugeStyle;
    /**
     * Method to set culture for gauge
     */
    private setCulture;
    /**
     * Methods to create svg element for circular gauge.
     */
    private createSvg;
    /**
     * To Remove the SVG from circular gauge.
     * @return {boolean}
     * @private
     */
    removeSvg(): void;
    /**
     * To initialize the circular gauge private variable.
     * @private
     */
    private initPrivateVariable;
    /**
     * To calculate the size of the circular gauge element.
     */
    private calculateSvgSize;
    /**
     * Method to calculate the availble size for circular gauge.
     */
    private calculateBounds;
    /**
     * To render elements for circular gauge
     */
    private renderElements;
    /**
     * Method to render legend for accumulation chart
     */
    private renderLegend;
    /**
     * Method to render the title for circular gauge.
     */
    private renderTitle;
    /**
     * Method to render the border for circular gauge.
     */
    private renderBorder;
    /**
     * This method is used to set the pointer value dynamically for circular gauge.
     * @param axisIndex - Specifies the index value for the axis in circular gauge.
     * @param pointerIndex - Specifies the index value for the pointer in circular gauge.
     * @param value - Specifies the value for the pointer in circular gauge.
     */
    setPointerValue(axisIndex: number, pointerIndex: number, value: number): void;
    /**
     * This method is used to set the annotation content dynamically for circular gauge.
     * @param axisIndex - Specifies the index value for the axis in circular gauge.
     * @param annotationIndex - Specifies the index value for the annotation in circular gauge.
     * @param conetent - Specifies the content for the annotation in circular gauge.
     */
    setAnnotationValue(axisIndex: number, annotationIndex: number, content: string): void;
    /**
     * This method is used to print the rendered circular gauge.
     * @param id - Specifies the element to print the circular gauge.
     */
    print(id?: string[] | string | Element): void;
    /**
     * This method is used to perform the export functionality for the circular gauge.
     * @param type - Specifies the type of the export.
     * @param fileName - Specifies the file name for the exported file.
     * @param orientation - Specified the orientation for the exported pdf document.
     * @param allowDownload - Specifies whether to download as a file.
     */
    export(type: ExportType, fileName: string, orientation?: PdfPageOrientation, allowDownload?: boolean): Promise<string>;
    /**
     * Method to set mouse x, y from events
     */
    private setMouseXY;
    /**
     * This method is used to set the range values dynamically for circular gauge.
     * @param axisIndex - Specifies the index value for the axis in circular gauge.
     * @param rangeIndex - Specifies the index value for the range in circular gauge.
     * @param start - Specifies the start value for the current range in circular gauge.
     * @param end - Specifies the end value for the current range i circular gauge.
     */
    setRangeValue(axisIndex: number, rangeIndex: number, start: number, end: number): void;
    /**
     * To destroy the widget
     * @method destroy
     * @return {void}
     * @member of Circular-Gauge
     */
    destroy(): void;
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    requiredModules(): ModuleDeclaration[];
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    getPersistData(): string;
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    onPropertyChanged(newProp: CircularGaugeModel, oldProp: CircularGaugeModel): void;
    /**
     * Get component name for circular gauge
     * @private
     */
    getModuleName(): string;
}
