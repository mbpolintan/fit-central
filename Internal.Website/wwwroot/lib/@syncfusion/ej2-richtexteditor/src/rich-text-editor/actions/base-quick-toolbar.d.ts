import { Popup } from '@syncfusion/ej2-popups';
import { IRichTextEditor } from '../base/interface';
import { IToolbarItems, IQuickToolbarOptions } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { BaseToolbar } from './base-toolbar';
import { RichTextEditorModel } from '../base/rich-text-editor-model';
/**
 * `Quick toolbar` module is used to handle Quick toolbar actions.
 */
export declare class BaseQuickToolbar {
    popupObj: Popup;
    element: HTMLElement;
    private isDOMElement;
    quickTBarObj: BaseToolbar;
    private stringItems;
    private dropDownButtons;
    private colorPickerObj;
    private locator;
    private parent;
    private contentRenderer;
    private popupRenderer;
    toolbarElement: HTMLElement;
    private renderFactory;
    constructor(parent?: IRichTextEditor, locator?: ServiceLocator);
    private appendPopupContent;
    /**
     * render method
     * @hidden

     */
    render(args: IQuickToolbarOptions): void;
    private createToolbar;
    private setPosition;
    private checkCollision;
    /**
     * showPopup method
     * @hidden

     */
    showPopup(x: number, y: number, target: Element): void;
    /**
     * hidePopup method
     * @hidden

     */
    hidePopup(): void;
    /**
     * @hidden

     */
    addQTBarItem(item: (string | IToolbarItems)[], index: number): void;
    /**
     * @hidden

     */
    removeQTBarItem(index: number | HTMLElement[] | Element[]): void;
    private removeEleFromDOM;
    private updateStatus;
    /**
     * Destroys the Quick toolbar.
     * @method destroy
     * @return {void}
     * @hidden

     */
    destroy(): void;
    /**
     * addEventListener method
     * @hidden

     */
    addEventListener(): void;
    /**
     * Called internally if any of the property value changed.
     * @hidden

     */
    protected onPropertyChanged(e: {
        [key: string]: RichTextEditorModel;
    }): void;
    /**
     * removeEventListener method
     * @hidden

     */
    removeEventListener(): void;
}
