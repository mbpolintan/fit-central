import { IRichTextEditor } from '../base/interface';
import { Dialog, Popup } from '@syncfusion/ej2-popups';
import { ServiceLocator } from '../services/service-locator';
/**
 * `Table` module is used to handle table actions.
 */
export declare class Table {
    ensureInsideTableList: boolean;
    element: HTMLElement;
    private rteID;
    private parent;
    private dlgDiv;
    private tblHeader;
    popupObj: Popup;
    editdlgObj: Dialog;
    private contentModule;
    private rendererFactory;
    private quickToolObj;
    private resizeBtnStat;
    private pageX;
    private pageY;
    private curTable;
    private colIndex;
    private columnEle;
    private rowTextBox;
    private columnTextBox;
    private rowEle;
    private l10n;
    private moveEle;
    private helper;
    private dialogRenderObj;
    constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator);
    protected addEventListener(): void;
    protected removeEventListener(): void;
    private afterRender;
    private dropdownSelect;
    private keyDown;
    private onToolbarAction;
    private verticalAlign;
    private tableStyles;
    private insideList;
    private tabSelection;
    private tableArrowNavigation;
    private setBGColor;
    private hideTableQuickToolbar;
    private tableHeader;
    private editAreaClickHandler;
    private tableCellSelect;
    private tableCellLeave;
    private tableCellClick;
    private tableInsert;
    private cellSelect;
    private resizeHelper;
    private tableResizeEleCreation;
    private removeResizeEle;
    private calcPos;
    private getPointX;
    private getPointY;
    private resizeStart;
    private removeHelper;
    private appendHelper;
    private setHelperHeight;
    private updateHelper;
    private resizing;
    private convertPixelToPercentage;
    private cancelResizeAction;
    private resizeEnd;
    private resizeBtnInit;
    private addRow;
    private addColumn;
    private removeRowColumn;
    private removeTable;
    private renderDlgContent;
    private docClick;
    private drawTable;
    private editTable;
    private insertTableDialog;
    private tableCellDlgContent;
    private createDialog;
    private customTable;
    private cancelDialog;
    private applyProperties;
    private tableDlgContent;
    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     * @hidden

     */
    destroy(): void;
    /**
     * For internal use only - Get the module name.
     */
    private getModuleName;
}
