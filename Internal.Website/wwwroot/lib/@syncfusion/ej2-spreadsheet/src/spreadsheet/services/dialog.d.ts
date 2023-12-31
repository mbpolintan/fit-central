import { Spreadsheet } from '../base/index';
import { Dialog as DialogComponent, DialogModel } from '@syncfusion/ej2-popups';
/**
 * Dialog Service.
 * @hidden
 */
export declare class Dialog {
    private parent;
    dialogInstance: DialogComponent;
    /**
     * Constructor for initializing dialog service.
     */
    constructor(parent: Spreadsheet);
    /**
     * To show dialog.
     */
    show(dialogModel: DialogModel, cancelBtn?: boolean): void;
    /**
     * To hide dialog.
     */
    hide(): void;
    /**
     * To clear private variables.
     */
    destroy(): void;
}
