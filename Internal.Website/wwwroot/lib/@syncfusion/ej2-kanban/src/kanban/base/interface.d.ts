import { BaseEventArgs, Draggable } from '@syncfusion/ej2-base';
import { CurrentAction } from './type';
/**
 * Kanban Interface
 */
/**
 * Provides information about a ActionBegin, ActionComplete, ActionFailure event.
 */
export interface ActionEventArgs extends BaseEventArgs {
    /** Returns the request type of the current action. */
    requestType: string;
    /** Defines the cancel option for the action taking place. */
    cancel?: boolean;
    /** Returns the target HTML element. */
    target?: HTMLElement;
    /** Returns the appropriate added data based on the action. */
    addedRecords?: Object[];
    /** Returns the appropriate changed data based on the action. */
    changedRecords?: Object[];
    /** Returns the appropriate deleted data based on the action. */
    deletedRecords?: Object[];
}
/**
 * Provides information about a Card Click/Double Click event.
 */
export interface CardClickEventArgs extends BaseEventArgs {
    /** Returns the object of the element which is currently being clicked or double clicked. */
    data: {
        [key: string]: Object;
    };
    /** Defines the cancel option for the action taking place. */
    cancel?: boolean;
    /**
     * Returns the actual HTML element on which the required custom styling can be applied.
     * @blazorType CellDOM
     */
    element: Element;
    /** Defines the type of the event. */
    event?: Event | MouseEvent | KeyboardEvent;
}
/**
 * Provides information about a QueryCellInfo event.
 */
export interface QueryCellInfoEventArgs extends BaseEventArgs {
    /** Returns the object of the elements which is currently being rendered on the UI. */
    data?: HeaderArgs[];
    /**
     * Returns the actual HTML element on which the required custom styling can be applied.

     */
    element: Element;
    /** Defines the cancel option for the action taking place. */
    cancel: boolean;
    /** Defines the request type of column rendering. */
    requestType: string;
}
/**
 * Provides information about a CardRendered event.
 */
export interface CardRenderedEventArgs extends BaseEventArgs {
    /** Returns the object of the elements which is currently being rendered on the UI. */
    data?: {
        [key: string]: Object;
    };
    /**
     * Returns the actual HTML element on which the required custom styling can be applied.

     */
    element: Element;
    /** Defines the cancel option for the action taking place. */
    cancel: boolean;
}
/**
 * Provides information about a Drag, Drag Start/End event.
 */
export interface DragEventArgs extends BaseEventArgs {
    /**
     * Returns the drag element.
     * @blazorType CellDOM
     */
    element: HTMLElement | HTMLElement[];
    /** Returns the dragged event data. */
    data: {
        [key: string]: Object;
    }[];
    /** Returns the mouse event. */
    event: MouseEvent;
    /** Defines the cancel option. */
    cancel?: boolean;
}
/**
 * Provides information about a DialogOpen event.
 */
export interface DialogEventArgs extends BaseEventArgs {
    /** Returns the cell or event data. */
    data: {
        [key: string]: Object;
    };
    /**

     * Returns the target element on which the popup is getting opened.
     */
    target?: Element;
    /**

     * Returns the popup wrapper element.
     */
    element?: Element;
    /** Defines the cancel option. */
    cancel?: boolean;
    /** Defines the dialog actions. */
    requestType?: CurrentAction;
}
/**
 * Provides information about a DialogClose event.
 */
export interface DialogCloseEventArgs extends DialogEventArgs {
    /** Defines the dialog interaction. */
    interaction?: string;
}
/** @hidden */
export interface SaveChanges {
    addedRecords: {
        [key: string]: Object;
    }[];
    changedRecords: {
        [key: string]: Object;
    }[];
    deletedRecords: {
        [key: string]: Object;
    }[];
}
/** @hidden */
export interface CrudArgs extends ActionEventArgs {
    promise?: Promise<Object>;
}
/** @hidden */
export interface EJ2Instance extends HTMLElement {
    ej2_instances: Object[];
}
/** @hidden */
export interface DragArgs extends BaseEventArgs {
    element?: HTMLElement;
    cloneElement?: HTMLElement;
    targetClone?: HTMLElement;
    draggedClone?: HTMLElement;
    targetCloneMulti?: HTMLElement;
    selectedCards?: HTMLElement | HTMLElement[];
    instance?: Draggable;
    pageX?: number;
    pageY?: number;
    navigationInterval?: number;
    cardDetails?: {
        [key: string]: Object;
    }[];
    modifiedData?: {
        [key: string]: Object;
    }[];
}
/** @hidden */
export interface HeaderArgs {
    keyField: string;
    textField: string;
    count?: number;
}
/** @hidden */
export interface DragEdges {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
}
