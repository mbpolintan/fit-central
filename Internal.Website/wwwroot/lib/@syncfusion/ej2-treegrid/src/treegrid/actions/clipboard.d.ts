/**
 * clipboard.ts file
 */
import { TreeGrid } from '../base/treegrid';
import { Clipboard as GridClipboard } from '@syncfusion/ej2-grids';
/**
 * The `Clipboard` module is used to handle clipboard copy action.
 */
export declare class TreeClipboard extends GridClipboard {
    private treeGridParent;
    private treeCopyContent;
    private copiedUniqueIdCollection;
    constructor(parent?: TreeGrid);
    protected setCopyData(withHeader?: boolean): void;
    private parentContentData;
    copy(withHeader?: boolean): void;
    paste(data: string, rowIndex: number, colIndex: number): void;
    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string;
    /**
     * To destroy the clipboard
     * @return {void}
     * @hidden
     */
    destroy(): void;
    private childContentData;
}
