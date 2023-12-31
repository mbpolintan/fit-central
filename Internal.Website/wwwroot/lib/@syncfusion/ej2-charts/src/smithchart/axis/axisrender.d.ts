/**
 *
 */
import { Smithchart } from '../../smithchart';
import { SmithchartRect, HorizontalLabelCollection, LabelCollection, Point, Direction } from '../../smithchart/utils/utils';
import { GridArcPoints, RadialLabelCollections } from '../../smithchart/utils/utils';
import { RenderType } from '../../smithchart/utils/enum';
export declare class AxisRender {
    areaRadius: number;
    circleLeftX: number;
    circleTopY: number;
    circleCenterX: number;
    circleCenterY: number;
    radialLabels: number[];
    radialLabelCollections: LabelCollection[];
    horizontalLabelCollections: HorizontalLabelCollection[];
    majorHGridArcPoints: GridArcPoints[];
    minorHGridArcPoints: GridArcPoints[];
    majorRGridArcPoints: GridArcPoints[];
    minorGridArcPoints: GridArcPoints[];
    labelCollections: RadialLabelCollections[];
    direction: Direction;
    renderArea(smithchart: Smithchart, bounds: SmithchartRect): void;
    private updateHAxis;
    private updateRAxis;
    private measureHorizontalAxis;
    private measureRadialAxis;
    private calculateChartArea;
    private calculateCircleMargin;
    private maximumLabelLength;
    private calculateAxisLabels;
    private isOverlap;
    private calculateXAxisRange;
    private calculateRAxisRange;
    private measureHMajorGridLines;
    private measureRMajorGridLines;
    private circleXYRadianValue;
    private calculateMajorArcStartEndPoints;
    private calculateHMajorArcStartEndPoints;
    private calculateMinorArcStartEndPoints;
    intersectingCirclePoints(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number, renderType: RenderType): Point;
    private updateHMajorGridLines;
    private updateRMajorGridLines;
    private updateHAxisLine;
    private updateRAxisLine;
    private drawHAxisLabels;
    private drawRAxisLabels;
    private calculateRegion;
    private updateHMinorGridLines;
    private updateRMinorGridLines;
    private calculateGridLinesPath;
    private measureHMinorGridLines;
    private measureRMinorGridLines;
    private minorGridLineArcIntersectCircle;
    private circlePointPosition;
    private setLabelsInsidePosition;
    private setLabelsOutsidePosition;
    private arcRadius;
}
