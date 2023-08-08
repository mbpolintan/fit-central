import { EditorManager } from './../base/editor-manager';
/**
 * Formats internal component
 * @hidden

 */
export declare class Formats {
    private parent;
    /**
     * Constructor for creating the Formats plugin
     * @hidden

     */
    constructor(parent: EditorManager);
    private addEventListener;
    private getParentNode;
    private onKeyUp;
    private onKeyDown;
    private removeCodeContent;
    private deleteContent;
    private paraFocus;
    private isNotEndCursor;
    private setCursorPosition;
    private focusSelectionParent;
    private insertMarker;
    private applyFormats;
    private preFormatMerge;
    private cleanFormats;
}
