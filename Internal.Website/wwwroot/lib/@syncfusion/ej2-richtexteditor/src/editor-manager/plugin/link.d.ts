import { EditorManager } from './../base/editor-manager';
/**
 * Link internal component
 * @hidden

 */
export declare class LinkCommand {
    private parent;
    /**
     * Constructor for creating the Formats plugin
     * @hidden

     */
    constructor(parent: EditorManager);
    private addEventListener;
    private linkCommand;
    private createLink;
    private createLinkNode;
    private createAchorNode;
    private getSelectionNodes;
    private isBlockNode;
    private removeText;
    private openLink;
    private removeLink;
    private callBack;
}
