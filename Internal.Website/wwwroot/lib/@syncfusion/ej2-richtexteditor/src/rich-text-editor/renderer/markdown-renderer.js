/**
 * Markdown module is used to render Rich Text Editor as Markdown editor content
 * @hidden

 */
var MarkdownRender = /** @class */ (function () {
    /**
     * Constructor for content renderer module
     */
    function MarkdownRender(parent) {
        this.parent = parent;
    }
    /**
     * The function is used to render Rich Text Editor content div
     * @hidden

     */
    MarkdownRender.prototype.renderPanel = function () {
        var rteObj = this.parent;
        var div = this.parent.createElement('div', { id: this.parent.getID() + '_view', className: 'e-rte-content' });
        this.editableElement = this.parent.createElement('textarea', {
            className: 'e-content',
            id: this.parent.getID() + '_editable-content'
        });
        div.appendChild(this.editableElement);
        this.setPanel(div);
        rteObj.element.appendChild(div);
    };
    /**
     * Get the content div element of RichTextEditor
     * @return {Element}
     * @hidden

     */
    MarkdownRender.prototype.getPanel = function () {
        return this.contentPanel;
    };
    /**
     * Get the editable element of RichTextEditor
     * @return {Element}
     * @hidden

     */
    MarkdownRender.prototype.getEditPanel = function () {
        return this.editableElement;
    };
    /**
     * Returns the text content as string.
     * @return {string}
     */
    MarkdownRender.prototype.getText = function () {
        return this.getEditPanel().value;
    };
    /**
     * Set the content div element of RichTextEditor
     * @param  {Element} panel
     * @hidden

     */
    MarkdownRender.prototype.setPanel = function (panel) {
        this.contentPanel = panel;
    };
    /**
     * Get the document of RichTextEditor
     * @param  {Document}
     * @hidden

     */
    MarkdownRender.prototype.getDocument = function () {
        return this.getEditPanel().ownerDocument;
    };
    return MarkdownRender;
}());
export { MarkdownRender };
