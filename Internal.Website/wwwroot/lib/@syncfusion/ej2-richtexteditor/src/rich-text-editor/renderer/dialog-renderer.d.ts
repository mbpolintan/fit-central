import { Dialog, DialogModel } from '@syncfusion/ej2-popups';
import { IRichTextEditor } from '../base/interface';
/**
 * Dialog Renderer
 */
export declare class DialogRenderer {
    dialogObj: Dialog;
    private parent;
    constructor(parent?: IRichTextEditor);
    /**
     * dialog render method
     * @hidden

     */
    render(e: DialogModel): Dialog;
    private beforeOpen;
    private open;
    private beforeClose;
    /**
     * dialog close method
     * @hidden

     */
    close(args: Object): void;
}
