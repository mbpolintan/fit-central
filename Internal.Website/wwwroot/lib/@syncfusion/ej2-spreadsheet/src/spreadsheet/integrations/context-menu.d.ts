import { Spreadsheet } from '../base/index';
/**
 * Represents context menu for Spreadsheet.
 */
export declare class ContextMenu {
    private parent;
    private contextMenuInstance;
    /**
     * Constructor for ContextMenu module.
     */
    constructor(parent: Spreadsheet);
    private init;
    private initContextMenu;
    /**
     * Before close event handler.
     */
    private beforeCloseHandler;
    /**
     * Select event handler.
     */
    private selectHandler;
    private getInsertModel;
    /**
     * Before open event handler.
     */
    private beforeOpenHandler;
    /**
     * To get target area based on right click.
     */
    private getTarget;
    /**
     * To populate context menu items based on target area.
     */
    private getDataSource;
    private setProtectSheetItems;
    /**
     * Sets sorting related items to the context menu.
     */
    private setFilterItems;
    /**
     * Sets sorting related items to the context menu.
     */
    private setSortItems;
    private setHyperLink;
    private setClipboardData;
    private setInsertDeleteItems;
    private setHideShowItems;
    /**
     * To add event listener.
     */
    private addEventListener;
    /**
     * To add context menu items before / after particular item.
     */
    private addItemsHandler;
    /**
     * To remove context menu items.
     */
    private removeItemsHandler;
    /**
     * To enable / disable context menu items.
     */
    private enableItemsHandler;
    /**
     * To remove event listener.
     */
    private removeEventListener;
    /**
     * To get module name.
     */
    protected getModuleName(): string;
    /**
     * Destroy method.
     */
    protected destroy(): void;
}
