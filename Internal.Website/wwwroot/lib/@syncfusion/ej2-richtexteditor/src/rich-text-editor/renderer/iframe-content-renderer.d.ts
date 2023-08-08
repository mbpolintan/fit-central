import { ContentRender } from '../renderer/content-renderer';
/**
 * Content module is used to render Rich Text Editor content
 * @hidden

 */
export declare class IframeContentRender extends ContentRender {
    /**
     * The function is used to render Rich Text Editor iframe
     * @hidden

     */
    renderPanel(): void;
    private setThemeColor;
    /**
     * Get the editable element of RichTextEditor
     * @return {Element}
     * @hidden

     */
    getEditPanel(): Element;
    /**
     * Get the document of RichTextEditor
     * @param  {Document}
     * @hidden

     */
    getDocument(): Document;
}
