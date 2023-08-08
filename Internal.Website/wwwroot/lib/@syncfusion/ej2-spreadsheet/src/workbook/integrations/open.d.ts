import { OpenOptions } from '../../spreadsheet/common/interface';
import { Workbook } from '../base/index';
export declare class WorkbookOpen {
    private parent;
    constructor(parent: Workbook);
    /**
     * To open the excel file stream or excel url into the spreadsheet.
     * @param {OpenOptions} options - Options to open a excel file.
     */
    open(options: OpenOptions): void;
    private fetchFailure;
    private fetchSuccess;
    private updateModel;
    /**
     * Adding event listener for workbook open.
     */
    addEventListener(): void;
    /**
     * Removing event listener workbook open.
     */
    removeEventListener(): void;
    /**
     * To Remove the event listeners
     */
    destroy(): void;
    /**
     * Get the workbook open module name.
     */
    getModuleName(): string;
}
