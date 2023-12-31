import { PivotFieldList } from '../base/field-list';
import { IAction } from '../../common/base/interface';
import { TreeView } from '@syncfusion/ej2-navigations';
/**
 * Module to render Field List
 */
/** @hidden */
export declare class TreeViewRenderer implements IAction {
    parent: PivotFieldList;
    /** @hidden */
    fieldTable: TreeView;
    private parentElement;
    private treeViewElement;
    private fieldDialog;
    private editorSearch;
    private selectedNodes;
    private fieldListSort;
    /** Constructor for render module */
    constructor(parent: PivotFieldList);
    /**
     * Initialize the field list tree rendering
     * @returns void
     * @private
     */
    render(axis?: number): void;
    private updateSortElements;
    private renderTreeView;
    private updateNodeIcon;
    private updateTreeNode;
    private updateOlapTreeNode;
    private renderTreeDialog;
    private dialogClose;
    private createTreeView;
    private textChange;
    private dragStart;
    private dragStop;
    private isNodeDropped;
    private getButton;
    private nodeStateChange;
    private updateReportSettings;
    private updateCheckState;
    private updateNodeStateChange;
    private updateSelectedNodes;
    private updateDataSource;
    private addNode;
    private refreshTreeView;
    private getUpdatedData;
    private getTreeData;
    private getOlapTreeData;
    private updateExpandedNodes;
    private updateSorting;
    private applySorting;
    private onFieldAdd;
    private closeTreeDialog;
    private keyPress;
    private wireFieldListEvent;
    private unWireFieldListEvent;
    /**
     * @hidden
     */
    addEventListener(): void;
    /**
     * @hidden
     */
    removeEventListener(): void;
    /**
     * To destroy the tree view event listener
     * @return {void}
     * @hidden
     */
    destroy(): void;
}
