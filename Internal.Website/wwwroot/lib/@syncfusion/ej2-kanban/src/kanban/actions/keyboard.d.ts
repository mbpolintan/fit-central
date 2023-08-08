import { Kanban } from '../base';
/**
 * Drag and Drop module is used to perform card actions.
 * @hidden
 */
export declare class Keyboard {
    private parent;
    private keyboardModule;
    private multiSelection;
    private keyConfigs;
    /**
     * Constructor for keyboard module
     * @private
     */
    constructor(parent: Kanban);
    private keyActionHandler;
    private processCardSelection;
    private processLeftRightArrow;
    private processUpDownArrow;
    private removeSelection;
    cardTabIndexRemove(): void;
    private processEnter;
    addRemoveTabIndex(action: string): void;
    /**
     * Get module name.
     */
    protected getModuleName(): string;
    /**
     * To destroy the keyboard module.
     * @return {void}
     * @private
     */
    destroy(): void;
}
