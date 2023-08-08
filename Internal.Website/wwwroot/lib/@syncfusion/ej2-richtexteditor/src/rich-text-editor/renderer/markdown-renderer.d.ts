import { IRenderer, IRichTextEditor } from '../base/interface';
/**
 * Markdown module is used to render Rich Text Editor as Markdown editor content
 * @hidden

 */
export declare class MarkdownRender implements IRenderer {
    private contentPanel;
    protected parent: IRichTextEditor;
    protected editableElement: Element;
    /**
     * Constructor for content renderer module
     */
    constructor(parent?: IRichTextEditor);
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
     * @param  {Element} panel
     * @hidden

     */
    setPanel(panel: Element): void;
    /**
     * Get the document of RichTextEditor
     * @param  {Document}
     * @hidden

     */
    getDocument(): Document;
}
