import { IRichTextEditor } from '../base/interface';
/**
 * XhtmlValidation module called when set enableXhtml as true
 */
export declare class XhtmlValidation {
    private parent;
    constructor(parent?: IRichTextEditor);
    private addEventListener;
    private removeEventListener;
    private enableXhtmlValidation;
    private AddRootElement;
    private clean;
    private ImageTags;
    private removeTags;
    private RemoveElementNode;
    private RemoveUnsupported;
    private RemoveAttributeByName;
}
