import { KeyboardEventArgs } from '@syncfusion/ej2-base';
import { IRichTextEditor } from '../base/interface';
/**
 * `FullScreen` module is used to maximize and minimize screen
 */
export declare class FullScreen {
    private overflowData;
    protected parent: IRichTextEditor;
    private scrollableParent;
    constructor(parent?: IRichTextEditor);
    /**
     * showFullScreen method
     * @hidden

     */
    showFullScreen(event?: MouseEvent | KeyboardEventArgs): void;
    /**
     * hideFullScreen method
     * @hidden

     */
    hideFullScreen(event?: MouseEvent | KeyboardEventArgs): void;
    private toggleParentOverflow;
    private onKeyDown;
    protected addEventListener(): void;
    protected removeEventListener(): void;
    /**
     * destroy method
     * @hidden

     */
    destroy(): void;
}
