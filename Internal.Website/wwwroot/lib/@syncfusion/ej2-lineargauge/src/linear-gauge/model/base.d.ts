import { ChildProperty } from '@syncfusion/ej2-base';
import { BorderModel, FontModel, RangeTooltipModel } from '../model/base-model';
import { Placement, ContainerType, TooltipPosition } from '../utils/enum';
/**
 * Sets and gets the options for customizing the fonts.
 */
export declare class Font extends ChildProperty<Font> {
    /**
     * Sets and gets the size of the font in text.
     */
    size: string;
    /**
     * Sets and gets the font color for text.
     */
    color: string;
    /**
     * Sets and gets the font-family for text.
     */
    fontFamily: string;
    /**
     * Sets and gets the font weight of the text.
     */
    fontWeight: string;
    /**
     * Sets and gets the style for text.
     */
    fontStyle: string;
    /**
     * Sets and gets the opacity of the text.
     * @blazorDefaultValue 1
     */
    opacity: number;
}
/**
 * Sets and gets the margin for the linear gauge.
 */
export declare class Margin extends ChildProperty<Margin> {
    /**
     * Sets and gets the left margin for linear gauge.
     * @default 10
     */
    left: number;
    /**
     * Sets and gets the right margin for linear gauge.
     * @default 10
     */
    right: number;
    /**
     * Sets and gets the top margin for linear gauge.
     * @default 10
     */
    top: number;
    /**
     * Sets and gets the bottom margin for linear gauge.
     * @default 10
     */
    bottom: number;
}
/**
 * Sets and gets the options to customize the border for the linear gauge.
 */
export declare class Border extends ChildProperty<Border> {
    /**
     * Sets and gets the color of the border. This property accepts value in hex code, rgba string as a valid CSS color string.
     */
    color: string;
    /**
     * Sets and gets the width of the border.
     * @default 0
     */
    width: number;
}
/**
 * Sets and gets the options for customizing the annotation in linear gauge.
 */
export declare class Annotation extends ChildProperty<Annotation> {
    /**
     * Sets and gets the content for the annotations.
     */
    content: string;
    /**
     * Sets and gets the x position for the annotation in linear gauge.
     */
    x: number;
    /**
     * Sets and gets the y position for the annotation in linear gauge.
     */
    y: number;
    /**
     * Sets and gets the vertical alignment of annotation.
     * @default None
     */
    verticalAlignment: Placement;
    /**
     * Sets and gets the horizontal alignment of annotation.
     * @default None
     */
    horizontalAlignment: Placement;
    /**
     * Sets and gets the z-index of the annotation.
     * @default '-1'
     */
    zIndex: string;
    /**
     * Sets and gets the options to customize the font of the annotation in linear gauge.
     */
    font: FontModel;
    /**
     * Sets and gets the axis index of the linear gauge
     * @aspDefaultValueIgnore
     */
    axisIndex: number;
    /**
     * Sets and gets the value of axis in linear gauge.
     * @aspDefaultValueIgnore
     * @blazorDefaultValue null
     */
    axisValue: number;
}
/**
 * Sets and gets the options for customizing the container of linear gauge.
 */
export declare class Container extends ChildProperty<Container> {
    /**
     * Sets and gets the type of container in linear gauge.
     * @default Normal
     */
    type: ContainerType;
    /**
     * Sets and gets the height of the container in linear gauge.
     * @default 0
     */
    height: number;
    /**
     * Sets and gets the width of the container in linear gauge.
     * @default 0
     */
    width: number;
    /**
     * Sets and gets the corner radius for the rounded rectangle container in linear gauge.
     * @default 10
     */
    roundedCornerRadius: number;
    /**
     * Sets and gets the background color of the container in linear gauge.
     */
    backgroundColor: string;
    /**
     * Sets and gets the options to customize the border of container.
     */
    border: BorderModel;
    /**
     * Sets and gets the value to place the container in the linear gauge component.
     * @blazorDefaultValue 0
     */
    offset: number;
}
/**
 * Sets and gets the options to customize the tooltip for range in axis.
 */
export declare class RangeTooltip extends ChildProperty<RangeTooltip> {
    /**
     * Sets and gets the fill color of the range tooltip, which accepts the value in hex code, rgba string as a valid CSS color string.
     * @default null
     */
    fill: string;
    /**
     * Sets and gets the options to customize the tooltip text of range in axis.
     */
    textStyle: FontModel;
    /**
     * Sets and gets the format for the tooltip content in range.
     * @default null
     */
    format: string;
    /**
     * Sets and gets the custom template to format the tooltip content. Use ${x} and ${y} as a
     * placeholder text to display the corresponding data point.
     * @default null
     */
    template: string;
    /**
     * Enables or disables the animation for the range tooltip when moved from one place to another.
     * @default true
     */
    enableAnimation: boolean;
    /**
     * Sets and gets the options to customize the border for range tooltip.
     */
    border: BorderModel;
    /**
     * Sets and gets the position type to place the tooltip in the axis .
     * @default End
     */
    position: TooltipPosition;
    /**
     * Enables or disables the options to show the tooltip position on range.
     * @default false
     */
    showAtMousePosition: boolean;
}
/**
 * Sets and gets the options for customizing the tooltip in linear gauge.
 */
export declare class TooltipSettings extends ChildProperty<TooltipSettings> {
    /**
     * Enables or disables the visibility of tooltip.
     * @default false
     */
    enable: boolean;
    /**
     * Sets and gets the color of the tooltip. This property accepts value in hex code, rgba string as a valid CSS color string.
     */
    fill: string;
    /**
     * Sets and gets the options to customize the text in tooltip.
     */
    textStyle: FontModel;
    /**
     * Sets and gets the format of the tooltip content in linear gauge.
     * @default null
     */
    format: string;
    /**
     * Enables or disables the options to show the tooltip position on mouse pointer.
     * @default false
     */
    showAtMousePosition: boolean;
    /**
     * Sets and gets the options to customize the range tooltip property.
     */
    rangeSettings: RangeTooltipModel;
    /**
     * Sets and gets the position type to place the tooltip in the axis.
     * @default End
     */
    position: TooltipPosition;
    /**
     * Sets and gets the custom template to format the tooltip content. Use ${x} and ${y} as a
     * placeholder text to display the corresponding data point.
     * @default null
     */
    template: string;
    /**
     * Enables or disables the animation for the tooltip while moving from one place to another.
     * @default true
     */
    enableAnimation: boolean;
    /**
     * Sets and gets the options to customize the border for tooltip.
     */
    border: BorderModel;
    /**
     * Sets and gets the option to display the tooltip for range, annotation, pointer.
     * @default Pointer
     */
    type: string[];
}
