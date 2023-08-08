import { EditorManager } from './../base/editor-manager';
/**
 * Selection EXEC internal component
 * @hidden

 */
export declare class SelectionBasedExec {
    private parent;
    /**
     * Constructor for creating the Formats plugin
     * @hidden

     */
    constructor(parent: EditorManager);
    private addEventListener;
    private keyDownHandler;
    private applySelection;
    private callBack;
}
