import { MarkdownParser } from './../base/markdown-parser';
import { IMarkdownSubCommands, IMDKeyboardEvent, MarkdownUndoRedoData } from './../base/interface';
import { IUndoCallBack } from '../../common/interface';
/**
 * `Undo` module is used to handle undo actions.
 */
export declare class UndoRedoCommands {
    steps: number;
    undoRedoStack: MarkdownUndoRedoData[];
    private parent;
    private selection;
    private currentAction;
    undoRedoSteps: number;
    undoRedoTimer: number;
    constructor(parent?: MarkdownParser, options?: {
        [key: string]: number;
    });
    protected addEventListener(): void;
    private onPropertyChanged;
    protected removeEventListener(): void;
    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     * @hidden

     */
    destroy(): void;
    /**
     * onAction method
     * @hidden

     */
    onAction(e: IMarkdownSubCommands): void;
    private keyDown;
    private keyUp;
    /**
     * MD collection stored string format.
     * @method saveData
     * @return {void}
     * @hidden

     */
    saveData(e?: KeyboardEvent | MouseEvent | IUndoCallBack): void;
    /**
     * Undo the editable text.
     * @method undo
     * @return {void}
     * @hidden

     */
    undo(e?: IMarkdownSubCommands | IMDKeyboardEvent): void;
    /**
     * Redo the editable text.
     * @method redo
     * @return {void}
     * @hidden

     */
    redo(e?: IMarkdownSubCommands | IMDKeyboardEvent): void;
    private restore;
    /**
     * getUndoStatus method
     * @hidden

     */
    getUndoStatus(): {
        [key: string]: boolean;
    };
}
