import { PivotView } from '../../pivotview/base/pivotview';
import { PivotFieldList } from '../../pivotfieldlist/base/field-list';
import { IAction } from '../../common/base/interface';
import { TreeView, NodeCheckEventArgs } from '@syncfusion/ej2-navigations';
import { AggregateMenu } from '../popups/aggregate-menu';
import { AxisFieldRenderer } from '../../pivotfieldlist/renderer/axis-field-renderer';
/**
 * Module to render Pivot button
 */
/** @hidden */
export declare class PivotButton implements IAction {
    parent: PivotView | PivotFieldList;
    private parentElement;
    private dialogPopUp;
    private draggable;
    private handlers;
    menuOption: AggregateMenu;
    axisField: AxisFieldRenderer;
    private fieldName;
    private valueFiedDropDownList;
    private columnFieldDropDownList;
    private index;
    /** @hidden */
    memberTreeView: TreeView;
    /** @hidden */
    isDestroyed: boolean;
    /** Constructor for render module */
    constructor(parent: PivotView | PivotFieldList);
    private renderPivotButton;
    private createButtonText;
    private getTypeStatus;
    private validateDropdown;
    private createSummaryType;
    private createMenuOption;
    private openCalculatedFieldDialog;
    private createDraggable;
    private createButtonDragIcon;
    private createSortOption;
    private createFilterOption;
    private updateButtontext;
    private updateOlapButtonText;
    private createDragClone;
    private onDragStart;
    private onDragging;
    private onDragStop;
    private isButtonDropped;
    private updateSorting;
    /** @hidden */
    updateDataSource(isRefreshGrid?: boolean): void;
    private updateFiltering;
    private updateFilterEvents;
    private bindDialogEvents;
    private buttonModel;
    private tabSelect;
    private updateDialogButtonEvents;
    private updateCustomFilter;
    private removeFilterDialog;
    private setFocus;
    private ClearFilter;
    private removeButton;
    /** @hidden */
    nodeStateModified(args: NodeCheckEventArgs): void;
    private checkedStateAll;
    private updateNodeStates;
    private updateFilterState;
    private refreshPivotButtonState;
    private removeDataSourceSettings;
    private updateDropIndicator;
    private wireEvent;
    private unWireEvent;
    /**
     * @hidden
     */
    addEventListener(): void;
    /**
     * @hidden
     */
    removeEventListener(): void;
    /**
     * To destroy the pivot button event listener
     * @return {void}
     * @hidden
     */
    destroy(): void;
}
