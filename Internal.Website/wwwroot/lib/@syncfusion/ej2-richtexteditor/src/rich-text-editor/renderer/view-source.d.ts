import { KeyboardEventArgs } from '@syncfusion/ej2-base';
import { IRichTextEditor } from '../base/interface';
import { IHtmlKeyboardEvent } from '../../editor-manager/base/interface';
import { ServiceLocator } from '../services/service-locator';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
/**
 * Content module is used to render Rich Text Editor content
 * @hidden

 */
export declare class ViewSource {
    private parent;
    private contentModule;
    private rendererFactory;
    private keyboardModule;
    private previewElement;
    /**
     * Constructor for view source module
     */
    constructor(parent?: IRichTextEditor, locator?: ServiceLocator);
    private addEventListener;
    private onInitialEnd;
    private removeEventListener;
    private getSourceCode;
    private wireEvent;
    private unWireEvent;
    private wireBaseKeyDown;
    private unWireBaseKeyDown;
    private mouseDownHandler;
    private previewKeyDown;
    private onKeyDown;
    /**
     * sourceCode method
     * @param  {Element} panel
     * @hidden

     */
    sourceCode(args?: ClickEventArgs | IHtmlKeyboardEvent): void;
    /**
     * updateSourceCode method
     * @param  {Element} panel
     * @hidden

     */
    updateSourceCode(args?: ClickEventArgs | KeyboardEventArgs): void;
    private getTextAreaValue;
    /**
     * getPanel method
     * @param  {Element} panel
     * @hidden

     */
    getPanel(): HTMLTextAreaElement | Element;
    /**
     * getViewPanel method
     * @param  {Element} panel
     * @hidden

     */
    getViewPanel(): HTMLTextAreaElement | Element;
    /**
     * Destroy the entire RichTextEditor.
     * @return {void}
     * @hidden

     */
    destroy(): void;
}
