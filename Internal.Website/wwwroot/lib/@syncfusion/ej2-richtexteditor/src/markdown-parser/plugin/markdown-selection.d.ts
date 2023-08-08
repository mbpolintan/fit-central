/**
 * MarkdownSelection internal module
 * @hidden

 */
export declare class MarkdownSelection {
    selectionStart: number;
    selectionEnd: number;
    /**
     * markdown getLineNumber method
     * @hidden

     */
    getLineNumber(textarea: HTMLTextAreaElement, point: number): number;
    /**
     * markdown getSelectedText method
     * @hidden

     */
    getSelectedText(textarea: HTMLTextAreaElement): string;
    /**
     * markdown getAllParents method
     * @hidden

     */
    getAllParents(value: string): string[];
    /**
     * markdown getSelectedLine method
     * @hidden

     */
    getSelectedLine(textarea: HTMLTextAreaElement): string;
    /**
     * markdown getLine method
     * @hidden

     */
    getLine(textarea: HTMLTextAreaElement, index: number): string;
    /**
     * markdown getSelectedParentPoints method
     * @hidden

     */
    getSelectedParentPoints(textarea: HTMLTextAreaElement): {
        [key: string]: string | number;
    }[];
    /**
     * markdown setSelection method
     * @hidden

     */
    setSelection(textarea: HTMLTextAreaElement, start: number, end: number): void;
    /**
     * markdown save method
     * @hidden

     */
    save(start: number, end: number): void;
    /**
     * markdown restore method
     * @hidden

     */
    restore(textArea: HTMLTextAreaElement): void;
    /**
     * markdown isStartWith method
     * @hidden

     */
    isStartWith(line: string, command: string): boolean;
    /**
     * markdown replaceSpecialChar method
     * @hidden

     */
    replaceSpecialChar(value: string): string;
    /**
     * markdown isClear method
     * @hidden

     */
    isClear(parents: {
        [key: string]: string | number;
    }[], regex: string): boolean;
    /**
     * markdown getSelectedInlinePoints method
     * @hidden

     */
    getSelectedInlinePoints(textarea: HTMLTextAreaElement): {
        [key: string]: string | number;
    };
}
