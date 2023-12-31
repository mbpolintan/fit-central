import { Column } from '@syncfusion/ej2-grids';
import { TreeGrid } from '../base/treegrid';
import { RowPosition } from '../enum';
/**
 * TreeGrid Edit Module
 * The `Edit` module is used to handle editing actions.
 */
export declare class Edit {
    private parent;
    private isSelfReference;
    private addedRecords;
    private deletedRecords;
    private addRowIndex;
    private addRowRecord;
    private isOnBatch;
    private keyPress;
    private selectedIndex;
    private doubleClickTarget;
    private internalProperties;
    private previousNewRowPosition;
    private batchEditModule;
    private isTabLastRow;
    private prevAriaRowIndex;
    /**
     * Constructor for Edit module
     */
    constructor(parent: TreeGrid);
    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string;
    /**
     * @hidden
     */
    addEventListener(): void;
    private gridDblClick;
    private getRowPosition;
    private beforeStartEdit;
    private beforeBatchCancel;
    /**
     * @hidden
     */
    removeEventListener(): void;
    /**
     * To destroy the editModule
     * @return {void}
     * @hidden
     */
    destroy(): void;
    /**
     * @hidden
     */
    applyFormValidation(cols?: Column[]): void;
    private editActionEvents;
    private recordDoubleClick;
    private updateGridEditMode;
    private resetIsOnBatch;
    private keyPressed;
    private deleteUniqueID;
    private cellEdit;
    private enableToolbarItems;
    private batchCancel;
    private cellSave;
    private lastCellTab;
    private blazorTemplates;
    private updateCell;
    private crudAction;
    private updateIndex;
    private beginAdd;
    private beginEdit;
    private savePreviousRowPosition;
    private beginAddEdit;
    /**
     * If the data,index and position given, Adds the record to treegrid rows otherwise it will create edit form.
     * @return {void}
     */
    addRecord(data?: Object, index?: number, position?: RowPosition): void;
    /**
     * Checks the status of validation at the time of editing. If validation is passed, it returns true.
     * @return {boolean}
     */
    editFormValidate(): boolean;
    /**
     * @hidden
     */
    destroyForm(): void;
    private contentready;
    /**
     * If the row index and field is given, edits the particular cell in a row.
     * @return {void}
     */
    editCell(rowIndex?: number, field?: string): void;
}
