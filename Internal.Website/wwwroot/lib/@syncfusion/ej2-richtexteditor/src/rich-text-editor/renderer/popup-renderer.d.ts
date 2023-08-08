import { IRenderer, IRichTextEditor } from '../base/interface';
import { BaseQuickToolbar } from '../actions/base-quick-toolbar';
/**
 * `Popup renderer` module is used to render popup in RichTextEditor.
 * @hidden

 */
export declare class PopupRenderer implements IRenderer {
    private popupObj;
    private popupPanel;
    protected parent: IRichTextEditor;
    /**
     * Constructor for popup renderer module
     */
    constructor(parent?: IRichTextEditor);
    private quickToolbarOpen;
    /**
     * renderPopup method
     * @hidden

     */
    renderPopup(args: BaseQuickToolbar): void;
    /**
     * The function is used to add popup class in Quick Toolbar
     * @hidden

     */
    renderPanel(): void;
    /**
     * Get the popup element of RichTextEditor
     * @return {Element}
     * @hidden

     */
    getPanel(): Element;
    /**
     * Set the popup element of RichTextEditor
     * @param  {Element} panel
     * @hidden

     */
    setPanel(panel: Element): void;
}
