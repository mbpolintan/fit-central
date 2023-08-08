import { IRenderer, IRichTextEditor } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
/**
 * Content module is used to render Rich Text Editor content
 * @hidden

 */
export declare class ContentRender implements IRenderer {
    protected contentPanel: Element;
    protected parent: IRichTextEditor;
    protected editableElement: Element;
    private serviceLocator;
    /**
     * Constructor for content renderer module
     */
    constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator);
    /**
     * The function is used to render Rich Text Editor content div
     * @hidden

     */
    renderPanel(): void;
    /**
     * Get the content div element of RichTextEditor
     * @return {Element}
     * @hidden

     */
    getPanel(): Element;
    /**
     * Get the editable element of RichTextEditor
     * @return {Element}
     * @hidden

     */
    getEditPanel(): Element;
    /**
     * Returns the text content as string.
     * @return {string}
     */
    getText(): string;
    /**
     * Set the content div element of RichTextEditor
     * @param {Element} panel
     * @hidden

     */
    setPanel(panel: Element): void;
    /**
     * Get the document of RichTextEditor
     * @return {Document}
     * @hidden

     */
    getDocument(): Document;
}
