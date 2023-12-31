import { IRichTextEditor } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { RichTextEditorModel } from '../base/rich-text-editor-model';
/**
 * `HtmlEditor` module is used to HTML editor
 */
export declare class HtmlEditor {
    private parent;
    private locator;
    private contentRenderer;
    private renderFactory;
    private toolbarUpdate;
    private colorPickerModule;
    private nodeSelectionObj;
    private rangeCollection;
    private saveSelection;
    private xhtmlValidation;
    constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator);
    /**
     * Destroys the Markdown.
     * @method destroy
     * @return {void}
     * @hidden

     */
    destroy(): void;
    /**
     * @hidden

     */
    sanitizeHelper(value: string): string;
    private addEventListener;
    private updateReadOnly;
    private onSelectionSave;
    private onSelectionRestore;
    private onKeyDown;
    private onPaste;
    private spaceLink;
    private onToolbarClick;
    private renderColorPicker;
    private instantiateRenderer;
    private removeEventListener;
    private render;
    /**
     * Called internally if any of the property value changed.
     * @hidden

     */
    protected onPropertyChanged(e: {
        [key: string]: RichTextEditorModel;
    }): void;
    /**
     * For internal use only - Get the module name.
     */
    private getModuleName;
    /**
     * For selecting all content in RTE
     * @private
     */
    private selectAll;
    /**
     * For selecting all content in RTE
     * @private
     */
    private selectRange;
    /**
     * For get a selected text in RTE
     * @private
     */
    private getSelectedHtml;
}
