import { Dialog, Popup } from '@syncfusion/ej2-popups';
import { Schedule } from '../base/schedule';
import { EventClickArgs, PopupCloseEventArgs } from '../base/interface';
/**
 * Quick Popups interactions
 */
export declare class QuickPopups {
    private l10n;
    private parent;
    private isMultipleEventSelect;
    quickDialog: Dialog;
    quickPopup: Popup;
    morePopup: Popup;
    private fieldValidator;
    private isCrudAction;
    lastEvent: Object;
    /**
     * Constructor for QuickPopups
     */
    constructor(parent: Schedule);
    private render;
    private renderQuickPopup;
    private renderMorePopup;
    private renderQuickDialog;
    private renderButton;
    private quickDialogClass;
    private applyFormValidation;
    openRecurrenceAlert(): void;
    openRecurrenceValidationAlert(type: string): void;
    openDeleteAlert(): void;
    openValidationError(type: string, eventData?: Object | Object[]): void;
    private showQuickDialog;
    private createMoreEventList;
    tapHoldEventPopup(e: Event): void;
    private isCellBlocked;
    private cellClick;
    private isSameEventClick;
    private isQuickTemplate;
    private eventClick;
    private getPopupHeader;
    private getPopupContent;
    private getPopupFooter;
    private getResourceText;
    private getFormattedString;
    moreEventClick(data: EventClickArgs, endDate: Date, groupIndex?: string): void;
    private saveClick;
    private detailsClick;
    private editClick;
    deleteClick(): void;
    private updateMoreEventContent;
    private closeClick;
    private dialogButtonClick;
    private updateTapHoldEventPopup;
    private getTimezone;
    private getRecurrenceSummary;
    private getDateFormat;
    private getDataFromTarget;
    private beforeQuickDialogClose;
    private beforeQuickPopupOpen;
    private isQuickInfoTemplates;
    private applyEventColor;
    private quickPopupOpen;
    private updateQuickPopupTemplates;
    private quickPopupShow;
    private resetQuickPopupTemplates;
    private quickPopupClose;
    private morePopupOpen;
    private morePopupClose;
    private popupClose;
    quickPopupHide(hideAnimation?: Boolean): void;
    serializingData(popupCloseArgs: PopupCloseEventArgs): PopupCloseEventArgs;
    private navigationClick;
    private documentClick;
    onClosePopup(): void;
    private addEventListener;
    private removeEventListner;
    private destroyButtons;
    refreshQuickDialog(): void;
    refreshQuickPopup(): void;
    refreshMorePopup(): void;
    destroy(): void;
}
