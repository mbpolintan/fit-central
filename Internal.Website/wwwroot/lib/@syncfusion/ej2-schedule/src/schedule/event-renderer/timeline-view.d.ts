import { Schedule } from '../base/schedule';
import { MonthEvent } from './month';
/**
 * Timeline view events render
 */
export declare class TimelineEvent extends MonthEvent {
    private startHour;
    private endHour;
    slotCount: number;
    private interval;
    private day;
    eventContainers: HTMLElement[];
    private dayLength;
    slotsPerDay: number;
    private content;
    private rowIndex;
    inlineValue: boolean;
    /**
     * Constructor for timeline views
     */
    constructor(parent: Schedule, type: string);
    getSlotDates(): void;
    getOverlapEvents(date: Date, appointments: {
        [key: string]: Object;
    }[]): Object[];
    renderResourceEvents(): void;
    renderEvents(event: {
        [key: string]: Object;
    }, resIndex: number, appointmentsList?: {
        [key: string]: Object;
    }[]): void;
    updateCellHeight(cell: HTMLElement, height: number): void;
    private getFirstChild;
    updateBlockElements(): void;
    getStartTime(event: {
        [key: string]: Object;
    }, eventData: {
        [key: string]: Object;
    }): Date;
    private getNextDay;
    getEndTime(event: {
        [key: string]: Object;
    }, eventData: {
        [key: string]: Object;
    }): Date;
    getEventWidth(startDate: Date, endDate: Date, isAllDay: boolean, count: number): number;
    private getSameDayEventsWidth;
    private getSpannedEventsWidth;
    private isSameDay;
    private getAppointmentLeft;
    getPosition(startTime: Date, endTime: Date, isAllDay: boolean, day: number): number;
    private getFilterEvents;
    private isAlreadyAvail;
    getRowTop(resIndex: number): number;
    getCellTd(): HTMLElement;
    renderBlockIndicator(cellTd: HTMLElement, position: number, resIndex: number): void;
    setMaxEventHeight(event: HTMLElement, cell: HTMLElement): void;
}
