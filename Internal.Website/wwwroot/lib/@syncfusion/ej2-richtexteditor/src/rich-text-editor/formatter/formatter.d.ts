import { ActionBeginEventArgs } from './../base/interface';
import { IRichTextEditor, IEditorModel, IItemCollectionArgs } from './../base/interface';
import { IHtmlFormatterCallBack, IMarkdownFormatterCallBack, IUndoCallBack } from './../../common/interface';
import { MarkdownUndoRedoData } from '../../markdown-parser/base/interface';
import { IHtmlUndoRedoData } from '../../editor-manager/base/interface';
/**
 * Formatter
 * @hidden

 */
export declare class Formatter {
    editorManager: IEditorModel;
    private timeInterval;
    /**
     * To execute the command
     * @param  {IRichTextEditor} self
     * @param  {ActionBeginEventArgs} args
     * @param  {MouseEvent|KeyboardEvent} event
     * @param  {IItemCollectionArgs} value
     * @hidden

     */
    process(self: IRichTextEditor, args: ActionBeginEventArgs, event: MouseEvent | KeyboardEvent, value: IItemCollectionArgs): void;
    private getAncestorNode;
    /**
     * onKeyHandler method
     * @hidden

     */
    onKeyHandler(self: IRichTextEditor, e: KeyboardEvent): void;
    /**
     * onSuccess method
     * @hidden

     */
    onSuccess(self: IRichTextEditor, events: IMarkdownFormatterCallBack | IHtmlFormatterCallBack): void;
    /**
     * Save the data for undo and redo action.
     * @hidden

     */
    saveData(e?: KeyboardEvent | MouseEvent | IUndoCallBack): void;
    /**
     * getUndoStatus method
     * @hidden

     */
    getUndoStatus(): {
        [key: string]: boolean;
    };
    /**
     * getUndoRedoStack method
     * @hidden

     */
    getUndoRedoStack(): IHtmlUndoRedoData[] | MarkdownUndoRedoData[];
    /**
     * enableUndo method
     * @hidden

     */
    enableUndo(self: IRichTextEditor): void;
}
