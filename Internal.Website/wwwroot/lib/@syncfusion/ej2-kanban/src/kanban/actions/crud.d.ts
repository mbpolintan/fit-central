import { Kanban } from '../base/kanban';
/**
 * Kanban CRUD operations
 */
export declare class Crud {
    private parent;
    private keyField;
    constructor(parent: Kanban);
    private getQuery;
    private getTable;
    private refreshData;
    addCard(cardData: {
        [key: string]: Object;
    } | {
        [key: string]: Object;
    }[]): void;
    updateCard(cardData: {
        [key: string]: Object;
    } | {
        [key: string]: Object;
    }[]): void;
    deleteCard(cardData: string | number | {
        [key: string]: Object;
    } | {
        [key: string]: Object;
    }[]): void;
    private priorityOrder;
    private removeData;
}
