import { CircularGauge } from '../circular-gauge';
import { Rect } from '../utils/helper';
import { PointerRenderer } from './pointer-renderer';
/**
 * Specifies the CircularGauge Axis Layout
 */
export declare class AxisLayoutPanel {
    private gauge;
    private farSizes;
    private axisRenderer;
    pointerRenderer: PointerRenderer;
    constructor(gauge: CircularGauge);
    /**
     * Measure the calculate the axis size and radius.
     * @return {void}
     * @private
     */
    measureAxis(rect: Rect): void;
    /**
     * Measure to calculate the axis radius of the circular gauge.
     * @return {void}
     * @private
     */
    private calculateAxesRadius;
    /**
     * Measure to calculate the axis size.
     * @return {void}
     * @private
     */
    private measureAxisSize;
    /**
     * Calculate the axis values of the circular gauge.
     * @return {void}
     * @private
     */
    private calculateAxisValues;
    /**
     * Calculate the visible range of an axis.
     * @return {void}
     * @private
     */
    private calculateVisibleRange;
    /**
     * Calculate the numeric intervals of an axis range.
     * @return {void}
     * @private
     */
    private calculateNumericInterval;
    /**
     * Calculate the nice interval of an axis range.
     * @return {void}
     * @private
     */
    private calculateNiceInterval;
    /**
     * Calculate the visible labels of an axis.
     * @return {void}
     * @private
     */
    private calculateVisibleLabels;
    /**
     * Measure the axes available size.
     * @return {void}
     * @private
     */
    private computeSize;
    /**
     * To render the Axis element of the circular gauge.
     * @return {void}
     * @private
     */
    renderAxes(animate?: boolean): void;
    /**
     * Calculate maximum label width for the axis.
     * @return {void}
     */
    private getMaxLabelWidth;
}
