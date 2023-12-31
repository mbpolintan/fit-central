import { Chart } from '../chart';
import { Axis, Row, Column } from '../axis/axis';
import { Size, Rect } from '@syncfusion/ej2-svg-base';
import { LineBase } from '../series/line-base';
export declare class PolarRadarPanel extends LineBase {
    private initialClipRect;
    private htmlObject;
    private element;
    centerX: number;
    centerY: number;
    startAngle: number;
    /** @private */
    visibleAxisLabelRect: Rect[];
    /** @private */
    seriesClipRect: Rect;
    /**
     * Measure the polar radar axis size.
     * @return {void}
     * @private
     */
    measureAxis(rect: Rect): void;
    private measureRowAxis;
    private measureColumnAxis;
    /**
     * Measure the column and row in chart.
     * @return {void}
     * @private
     */
    measureDefinition(definition: Row | Column, chart: Chart, size: Size, clipRect: Rect): void;
    /**
     * Measure the axis.
     * @return {void}
     * @private
     */
    private calculateAxisSize;
    /**
     * Measure the axis.
     * @return {void}
     * @private
     */
    measure(): void;
    /**
     * Measure the row size.
     * @return {void}
     */
    private calculateRowSize;
    /**
     * Measure the row size.
     * @return {void}
     */
    private calculateColumnSize;
    /**
     * To render the axis element.
     * @return {void}
     * @private
     */
    renderAxes(): Element;
    private drawYAxisLine;
    drawYAxisLabels(axis: Axis, index: number): void;
    private drawYAxisGridLine;
    private renderRadarGrid;
    private drawXAxisGridLine;
    private drawAxisMinorLine;
    /**
     * To render the axis label.
     * @return {void}
     * @private
     */
    drawXAxisLabels(axis: Axis, index: number): void;
    /**
     * To get available space to trim.
     * @param legendRect
     * @param labelRect
     */
    private getAvailableSpaceToTrim;
    /**
     * Getting axis label bounds
     * @param pointX
     * @param pointY
     * @param label
     * @param anchor
     */
    private getLabelRegion;
    private renderTickLine;
    private renderGridLine;
    private setPointerEventNone;
}
