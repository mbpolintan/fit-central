import { Component } from '@syncfusion/ej2-base';
import { EmitType, INotifyPropertyChanged, ModuleDeclaration } from '@syncfusion/ej2-base';
import { ProgressBarModel } from './progressbar-model';
import { Rect, Size } from './utils/helper';
import { MarginModel, AnimationModel, FontModel, RangeColorModel } from './model/progress-base-model';
import { ILoadedEventArgs, IProgressStyle, IProgressValueEventArgs } from './model/progress-interface';
import { ITextRenderEventArgs, IMouseEventArgs } from './model/progress-interface';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { ProgressType, CornerType, ProgressTheme, ModeType } from './utils/enum';
import { ProgressAnnotation } from './model/index';
import { ProgressAnnotationSettingsModel } from './model/index';
import { Linear } from './types/linear-progress';
import { Circular } from './types/circular-progress';
import { ProgressAnimation } from './utils/progress-animation';
/**
 *  progress bar control
 */
export declare class ProgressBar extends Component<HTMLElement> implements INotifyPropertyChanged {
    constructor(options?: ProgressBarModel, element?: string | HTMLElement);
    /**
     * type of the progress bar
     * @default Linear
     */
    type: ProgressType;
    /**
     * progress value
     * @default null
     */
    value: number;
    /**
     * secondary progress value
     * @default null
     */
    secondaryProgress: number;
    /**
     * minimum progress value
     * @default 0
     */
    minimum: number;
    /**
     * maximum progress value
     * @default 0
     */
    maximum: number;
    /**
     * startAngle for circular progress bar
     * @default 0
     */
    startAngle: number;
    /**
     * endAngle for circular progress bar
     * @default 0
     */
    endAngle: number;
    /**
     * track radius for circular
     * @default '100%'
     */
    radius: string;
    /**
     * progress radius for circular
     * @default '100%'
     */
    innerRadius: string;
    /**
     * segmentCount of the progress bar
     * @default 1
     */
    segmentCount: number;
    /**
     * gapwidth of the segment
     * @default null
     */
    gapWidth: number;
    /**
     * Segment color
     * @default null
     */
    segmentColor: string[];
    /**
     * corner type
     * @default Auto
     */
    cornerRadius: CornerType;
    /**
     * height of the progress bar
     * @default null
     */
    height: string;
    /**
     * width of the progress bar
     * @default null
     */
    width: string;
    /**
     * Indeterminate progress
     * @default false
     */
    isIndeterminate: boolean;
    /**
     * Active state
     * @default false
     */
    isActive: boolean;
    /**
     * gradient
     * @default false
     */
    isGradient: boolean;
    /**
     * striped
     * @default false
     */
    isStriped: boolean;
    /**
     * modes of linear progress
     * @default null
     */
    role: ModeType;
    /**
     * right to left
     * @default false
     */
    enableRtl: boolean;
    /**
     * trackColor
     * @default null
     */
    trackColor: string;
    /**
     * progressColor
     * @default null
     */
    progressColor: string;
    /**
     * track thickness
     * @default 0
     */
    trackThickness: number;
    /**
     * progress thickness
     * @default 0
     */
    progressThickness: number;
    /**
     * pie view
     * @default false
     */
    enablePieProgress: boolean;
    /**
     * theme style
     * @default Fabric
     */
    theme: ProgressTheme;
    /**
     * label of the progress bar
     * @default false
     */
    showProgressValue: boolean;
    /**
     * disable the trackSegment
     * @default false
     */
    enableProgressSegments: boolean;
    /**
     * Option for customizing the  label text.
     */
    labelStyle: FontModel;
    /**
     * margin size
     */
    margin: MarginModel;
    /**
     * Animation for the progress bar
     */
    animation: AnimationModel;
    /**
     * Triggers before the progress bar get rendered.
     * @event
     */
    load: EmitType<ILoadedEventArgs>;
    /**
     * Triggers before the progress bar label renders.
     * @event
     */
    textRender: EmitType<ITextRenderEventArgs>;
    /**
     * Triggers after the progress bar has loaded.
     * @event
     */
    loaded: EmitType<ILoadedEventArgs>;
    /**
     * Triggers after the value has changed.
     * @event
     */
    valueChanged: EmitType<IProgressValueEventArgs>;
    /**
     * Triggers after the progress value completed.
     * @event
     */
    progressCompleted: EmitType<IProgressValueEventArgs>;
    /**
     * Triggers after the animation completed.
     * @event
     */
    animationComplete: EmitType<IProgressValueEventArgs>;
    /**
     * Trigger after mouse click
     * @event
     */
    mouseClick: EmitType<IMouseEventArgs>;
    /**
     * Trigger after mouse move
     * @event
     */
    mouseMove: EmitType<IMouseEventArgs>;
    /**
     * Trigger after mouse up
     * @event
     */
    mouseUp: EmitType<IMouseEventArgs>;
    /**
     * Trigger after mouse down
     * @event
     */
    mouseDown: EmitType<IMouseEventArgs>;
    /**
     * Trigger after mouse down
     * @event
     */
    mouseLeave: EmitType<IMouseEventArgs>;
    /**
     * The configuration for annotation in Progressbar.
     */
    annotations: ProgressAnnotationSettingsModel[];
    /**
     * RangeColor in Progressbar.
     */
    rangeColors: RangeColorModel[];
    /** @private */
    progressRect: Rect;
    /** @private */
    progressSize: Size;
    /** @private */
    renderer: SvgRenderer;
    /** @private */
    svgObject: Element;
    /** @Private */
    totalAngle: number;
    /** @private */
    trackWidth: number;
    /** @private */
    progressWidth: number;
    /** @private */
    segmentSize: string;
    /** @private */
    circularPath: string;
    /** @private */
    argsData: IProgressValueEventArgs;
    /** @private */
    themeStyle: IProgressStyle;
    /** @private */
    animatedElement: Element;
    /** @private */
    resizeBounds: any;
    /** @private */
    private resizeTo;
    /** @private */
    previousWidth: number;
    /** @private */
    previousEndAngle: number;
    /** @private */
    previousTotalEnd: number;
    /** @private */
    annotateEnd: number;
    /** @private */
    annotateTotal: number;
    /** @private */
    redraw: boolean;
    /** @private */
    clipPath: Element;
    /** @private */
    bufferClipPath: Element;
    /** @private */
    secElement: HTMLElement;
    /** @private */
    cancelResize: boolean;
    /** @private */
    linear: Linear;
    /** @private */
    circular: Circular;
    /** @private */
    annotateAnimation: ProgressAnimation;
    /** ProgressAnnotation module to use annotations */
    progressAnnotationModule: ProgressAnnotation;
    /** @private */
    /** @private */
    isBlazor: boolean;
    /** @private */
    destroyIndeterminate: boolean;
    /**
     * controlRenderedTimeStamp used to avoid inital resize issue while theme change
     */
    private controlRenderedTimeStamp;
    getModuleName(): string;
    protected preRender(): void;
    private initPrivateVariable;
    protected render(): void;
    private controlRendering;
    /**
     * calculate size of the progress bar
     */
    private calculateProgressBarSize;
    /**
     * Render Annotation
     */
    private renderAnnotations;
    /**
     * Render SVG Element
     */
    private renderElements;
    private createSecElement;
    /**
     * To set the left and top position for annotation for center aligned
     */
    private setSecondaryElementPosition;
    private createSVG;
    private clipPathElement;
    private renderTrack;
    private renderProgress;
    private renderLabel;
    getPathLine(x: number, width: number, thickness: number): string;
    calculateProgressRange(value: number, minimum?: number, maximum?: number): number;
    calculateSegmentSize(width: number, thickness: number): string;
    createClipPath(clipPath?: Element, range?: number, d?: string, refresh?: boolean, thickness?: number, isLabel?: boolean, isMaximum?: boolean): Element;
    /**
     * Theming for progress bar
     */
    private setTheme;
    /**
     * Annotation for progress bar
     */
    private renderAnnotation;
    /**
     * Handles the progressbar resize.
     * @return {boolean}
     * @private
     */
    private progressResize;
    private progressMouseClick;
    private progressMouseDown;
    private progressMouseMove;
    private progressMouseUp;
    private progressMouseLeave;
    private mouseEvent;
    /**
     * Method to un-bind events for progress bar
     */
    private unWireEvents;
    /**
     * Method to bind events for bullet chart
     */
    private wireEvents;
    removeSvg(): void;
    onPropertyChanged(newProp: ProgressBarModel, oldProp: ProgressBarModel): void;
    requiredModules(): ModuleDeclaration[];
    getPersistData(): string;
    show(): void;
    hide(): void;
    /**
     * To destroy the widget
     * @method destroy
     * @return {void}.
     * @member of ProgressBar
     */
    destroy(): void;
}
