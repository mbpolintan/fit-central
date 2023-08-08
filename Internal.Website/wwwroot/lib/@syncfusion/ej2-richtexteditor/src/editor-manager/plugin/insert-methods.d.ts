/**
 * Node appending methods.
 * @hidden
 */
export declare class InsertMethods {
    /**
     * WrapBefore method
     * @hidden

     */
    static WrapBefore(textNode: Text, parentNode: HTMLElement, isAfter?: boolean): Text;
    /**
     * Wrap method
     * @hidden

     */
    static Wrap(childNode: HTMLElement, parentNode: HTMLElement): HTMLElement;
    /**
     * unwrap method
     * @hidden

     */
    static unwrap(node: Node | HTMLElement): Node[];
    /**
     * AppendBefore method
     * @hidden

     */
    static AppendBefore(textNode: HTMLElement | Text | DocumentFragment, parentNode: HTMLElement | Text | DocumentFragment, isAfter?: boolean): HTMLElement | Text | DocumentFragment;
}
