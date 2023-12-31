import { Spreadsheet } from '../base/index';
/**
 * The `Merge` module is used to to merge the range of cells.
 */
export declare class Merge {
    private parent;
    /**
     * Constructor for the Spreadsheet merge module.
     * @private
     */
    constructor(parent: Spreadsheet);
    private merge;
    private hideHandler;
    private checkPrevMerge;
    private checkMerge;
    private addEventListener;
    /**
     * Destroy merge module.
     */
    destroy(): void;
    private removeEventListener;
    /**
     * Get the merge module name.
     */
    getModuleName(): string;
}
