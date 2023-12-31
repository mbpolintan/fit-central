import { Dialog } from '@syncfusion/ej2-popups';
import { PivotView } from '../../pivotview';
import { DrillThroughEventArgs } from '../base/interface';
import { Grid, ColumnModel } from '@syncfusion/ej2-grids';
import { IDataSet } from '../../base/engine';
/**
 * `DrillThroughDialog` module to create drill-through dialog.
 */
/** @hidden */
export declare class DrillThroughDialog {
    parent: PivotView;
    /** @hidden */
    dialogPopUp: Dialog;
    /** @hidden */
    drillThroughGrid: Grid;
    /** @hidden */
    indexString: string[];
    private isUpdated;
    private gridIndexObjects;
    private engine;
    private gridData;
    /**
     * Constructor for the dialog action.
     * @hidden
     */
    constructor(parent?: PivotView);
    /** @hidden */
    showDrillThroughDialog(eventArgs: DrillThroughEventArgs): void;
    private updateData;
    private removeDrillThroughDialog;
    private createDrillThroughGrid;
    /** @hidden */
    frameGridColumns(rawData: IDataSet[]): ColumnModel[];
    private formatData;
    private dataWithPrimarykey;
}
