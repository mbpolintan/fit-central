import { EditorManager } from '../base/editor-manager';
/**
 * PasteCleanup for MsWord content
 * @hidden

 */
export declare class MsWordPaste {
    private parent;
    constructor(parent?: EditorManager);
    private olData;
    private ulData;
    private ignorableNodes;
    private blockNode;
    private removableElements;
    private listContents;
    private addEventListener;
    private wordCleanup;
    private imageConversion;
    private checkVShape;
    private convertToBase64;
    private conBytesToBase64;
    private conHexStringToBytes;
    private hexConversion;
    private removeClassName;
    private breakLineAddition;
    private findDetachElem;
    private removeUnwantedElements;
    private findDetachEmptyElem;
    private removeEmptyElements;
    private styleCorrection;
    private filterStyles;
    private removeUnwantedStyle;
    private findStyleObject;
    private removingComments;
    private cleanUp;
    private listConverter;
    private makeConversion;
    private getListStyle;
    private getListContent;
}
