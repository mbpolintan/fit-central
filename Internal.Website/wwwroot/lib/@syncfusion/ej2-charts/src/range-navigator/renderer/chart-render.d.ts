import { Axis } from '../../chart/axis/axis';
import { NiceInterval } from '../../chart/axis/axis-helper';
import { RangeNavigator } from '../range-navigator';
/**
 * To render Chart series
 */
export declare class RangeSeries extends NiceInterval {
    private dataSource;
    private xName;
    private yName;
    private query;
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
    private yAxis;
    xAxis: Axis;
    private seriesLength;
    private chartGroup;
    constructor(range: RangeNavigator);
    /**
     * To render light weight and data manager process
     * @param control
     */
    renderChart(control: RangeNavigator): void;
    private processDataSource;
    /**
     * data manager process calculated here
     * @param e
     */
    private dataManagerSuccess;
    /**
     * Process JSON data from data source
     * @param control
     * @param len
     */
    private processJsonData;
    private processXAxis;
    /**
     * Process yAxis for range navigator
     * @param control
     */
    private processYAxis;
    /**
     * Process Light weight control
     * @param control
     * @private
     */
    renderSeries(control: RangeNavigator): void;
    /**
     * Append series elements in element
     */
    appendSeriesElements(control: RangeNavigator): void;
    private createSeriesElement;
    private calculateGroupingBounds;
    private drawSeriesBorder;
}
