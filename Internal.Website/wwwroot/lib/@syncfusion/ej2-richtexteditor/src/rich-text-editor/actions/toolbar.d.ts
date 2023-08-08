import { Toolbar as tool } from '@syncfusion/ej2-navigations';
import { IRichTextEditor, IRenderer } from '../base/interface';
import { IUpdateItemsModel } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { BaseToolbar } from './base-toolbar';
import { RichTextEditorModel } from '../base/rich-text-editor-model';
/**
 * `Toolbar` module is used to handle Toolbar actions.
 */
export declare class Toolbar {
    toolbarObj: tool;
    private editPanel;
    private isToolbar;
    private editableElement;
    private tbItems;
    baseToolbar: BaseToolbar;
    private tbElement;
    private tbWrapper;
    protected parent: IRichTextEditor;
    protected locator: ServiceLocator;
    private isTransformChild;
    private contentRenderer;
    protected toolbarRenderer: IRenderer;
    private dropDownModule;
    private toolbarActionModule;
    protected renderFactory: RendererFactory;
    private keyBoardModule;
    private tools;
    constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator);
    private initializeInstance;
    private toolbarBindEvent;
    private toolBarKeyDown;
    private createToolbarElement;
    private getToolbarMode;
    private checkToolbarResponsive;
    private checkIsTransformChild;
    private toggleFloatClass;
    private renderToolbar;
    /**
     * addFixedTBarClass method
     * @hidden

     */
    addFixedTBarClass(): void;
    /**
     * removeFixedTBarClass method
     * @hidden

     */
    removeFixedTBarClass(): void;
    private showFixedTBar;
    private hideFixedTBar;
    /**
     * updateItem method
     * @hidden

     */
    updateItem(args: IUpdateItemsModel): void;
    private updateToolbarStatus;
    private fullScreen;
    private hideScreen;
    /**
     * getBaseToolbar method
     * @hidden

     */
    getBaseToolbar(): BaseToolbar;
    /**
     * addTBarItem method
     * @hidden

     */
    addTBarItem(args: IUpdateItemsModel, index: number): void;
    /**
     * enableTBarItems method
     * @hidden

     */
    enableTBarItems(baseToolbar: BaseToolbar, items: string | string[], isEnable: boolean, muteToolbarUpdate?: boolean): void;
    /**
     * removeTBarItems method
     * @hidden

     */
    removeTBarItems(items: string | string[]): void;
    /**
     * getExpandTBarPopHeight method
     * @hidden

     */
    getExpandTBarPopHeight(): number;
    /**
     * getToolbarHeight method
     * @hidden

     */
    getToolbarHeight(): number;
    /**
     * getToolbarElement method
     * @hidden

     */
    getToolbarElement(): Element;
    /**
     * refreshToolbarOverflow method
     * @hidden

     */
    refreshToolbarOverflow(): void;
    private isToolbarDestroyed;
    private destroyToolbar;
    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     * @hidden

     */
    destroy(): void;
    private scrollHandler;
    private getDOMVisibility;
    private mouseDownHandler;
    private focusChangeHandler;
    private dropDownBeforeOpenHandler;
    private tbFocusHandler;
    private tbKeydownHandler;
    private toolbarMouseDownHandler;
    protected wireEvents(): void;
    protected unWireEvents(): void;
    protected addEventListener(): void;
    protected removeEventListener(): void;
    private onRefresh;
    /**
     * Called internally if any of the property value changed.
     * @hidden

     */
    protected onPropertyChanged(e: {
        [key: string]: RichTextEditorModel;
    }): void;
    private refreshToolbar;
    /**
     * For internal use only - Get the module name.
     */
    private getModuleName;
}
