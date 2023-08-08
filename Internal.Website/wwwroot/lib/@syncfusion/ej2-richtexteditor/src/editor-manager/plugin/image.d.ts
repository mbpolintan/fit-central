import { EditorManager } from './../base/editor-manager';
import { IHtmlItem } from './../base/interface';
/**
 * Link internal component
 * @hidden

 */
export declare class ImageCommand {
    private parent;
    /**
     * Constructor for creating the Formats plugin
     * @hidden

     */
    constructor(parent: EditorManager);
    private addEventListener;
    /**
     * imageCommand method
     * @hidden

     */
    imageCommand(e: IHtmlItem): void;
    private createImage;
    private setStyle;
    private calculateStyleValue;
    private insertImageLink;
    private openImageLink;
    private removeImageLink;
    private editImageLink;
    private removeImage;
    private insertAltTextImage;
    private imageDimension;
    private imageCaption;
    private imageJustifyLeft;
    private imageJustifyCenter;
    private imageJustifyRight;
    private imageInline;
    private imageBreak;
    private callBack;
}
