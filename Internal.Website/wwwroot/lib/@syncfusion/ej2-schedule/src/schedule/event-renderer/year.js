var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { addClass, append, createElement, extend, remove, isNullOrUndefined } from '@syncfusion/ej2-base';
import { setStyleAttribute, EventHandler } from '@syncfusion/ej2-base';
import { TimelineEvent } from './timeline-view';
import * as util from '../base/util';
import * as events from '../base/constant';
import * as cls from '../base/css-constant';
var EVENT_GAP = 2;
/**
 * Year view events render
 */
var YearEvent = /** @class */ (function (_super) {
    __extends(YearEvent, _super);
    /**
     * Constructor for year events
     */
    function YearEvent(parent) {
        return _super.call(this, parent, 'day') || this;
    }
    YearEvent.prototype.renderAppointments = function () {
        this.fields = this.parent.eventFields;
        var elementSelector = '.' + cls.APPOINTMENT_WRAPPER_CLASS + ',.' + cls.MORE_INDICATOR_CLASS;
        var eventWrappers = [].slice.call(this.parent.element.querySelectorAll(elementSelector));
        for (var _i = 0, eventWrappers_1 = eventWrappers; _i < eventWrappers_1.length; _i++) {
            var wrapper = eventWrappers_1[_i];
            remove(wrapper);
        }
        this.renderedEvents = [];
        if (this.parent.currentView === 'Year') {
            this.yearViewEvents();
        }
        else {
            this.removeCellHeight();
            if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
                this.timelineResourceEvents();
            }
            else {
                this.timelineYearViewEvents();
            }
        }
        this.parent.notify(events.contentReady, {});
    };
    YearEvent.prototype.yearViewEvents = function () {
        for (var month = 0; month < 12; month++) {
            var queryString = ".e-month-calendar:nth-child(" + (month + 1) + ") td.e-work-cells";
            var workCells = [].slice.call(this.parent.element.querySelectorAll(queryString));
            var monthDate = new Date(this.parent.selectedDate.getFullYear(), month, this.parent.selectedDate.getDate());
            var monthStart = this.parent.calendarUtil.getMonthStartDate(new Date(monthDate.getTime()));
            var monthEnd = this.parent.calendarUtil.getMonthEndDate(new Date(monthDate.getTime()));
            var startDate = util.getWeekFirstDate(monthStart, this.parent.firstDayOfWeek);
            var endDate = util.addDays(util.getWeekLastDate(monthEnd, this.parent.firstDayOfWeek), 1);
            for (var index = 0; startDate.getTime() < endDate.getTime(); index++) {
                var start = util.resetTime(new Date(startDate.getTime()));
                var end = util.addDays(new Date(start.getTime()), 1);
                var filterEvents = this.parent.eventBase.filterEvents(start, end);
                if (filterEvents.length > 0) {
                    var workCell = workCells[index];
                    if (workCell) {
                        workCell.appendChild(createElement('div', { className: cls.APPOINTMENT_CLASS }));
                    }
                }
                startDate = util.addDays(new Date(startDate.getTime()), 1);
            }
        }
    };
    YearEvent.prototype.timelineYearViewEvents = function () {
        var workCell = this.parent.element.querySelector('.' + cls.WORK_CELLS_CLASS);
        this.cellWidth = workCell.offsetWidth;
        this.cellHeader = util.getOuterHeight(workCell.querySelector('.' + cls.DATE_HEADER_CLASS));
        var eventTable = this.parent.element.querySelector('.' + cls.EVENT_TABLE_CLASS);
        this.eventHeight = util.getElementHeightFromClass(eventTable, cls.APPOINTMENT_CLASS);
        var wrapperCollection = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_CONTAINER_CLASS));
        for (var row = 0; row < 12; row++) {
            var wrapper = wrapperCollection[row];
            var td = row + 1;
            var eventWrapper = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
            wrapper.appendChild(eventWrapper);
            var monthStart = new Date(this.parent.selectedDate.getFullYear(), row, 1);
            var monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
            var dayIndex = monthStart.getDay();
            var isSpannedCollection = [];
            while (monthStart.getTime() <= monthEnd.getTime()) {
                var leftValue = void 0;
                var rightValue = void 0;
                if (this.parent.activeViewOptions.orientation === 'Vertical') {
                    var wrapper_1 = wrapperCollection[dayIndex];
                    td = dayIndex + 1;
                    var eventWrapper_1 = wrapper_1.querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS);
                    if (!eventWrapper_1) {
                        eventWrapper_1 = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
                        wrapper_1.appendChild(eventWrapper_1);
                    }
                    this.parent.enableRtl ? (rightValue = row * this.cellWidth) : (leftValue = row * this.cellWidth);
                }
                else {
                    this.parent.enableRtl ? (rightValue = ((dayIndex + monthStart.getDate()) - 1) * this.cellWidth) :
                        (leftValue = ((dayIndex + monthStart.getDate()) - 1) * this.cellWidth);
                }
                var rowTd = this.parent.element.querySelector(".e-content-wrap tr:nth-child(" + td + ") td");
                this.cellHeight = rowTd.offsetHeight;
                var dayStart = util.resetTime(new Date(monthStart.getTime()));
                var dayEnd = util.addDays(new Date(dayStart.getTime()), 1);
                var resource = void 0;
                if (this.parent.uiStateValues.isGroupAdaptive) {
                    resource = this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex];
                }
                var dayEvents = this.parent.eventBase.filterEvents(dayStart, dayEnd, undefined, resource);
                var _loop_1 = function (index, count) {
                    var eventData = extend({}, dayEvents[index], null, true);
                    var overlapIndex = this_1.getIndex(eventData[this_1.fields.startTime]);
                    eventData.Index = overlapIndex;
                    var availedHeight = this_1.cellHeader + (this_1.eventHeight * (index + 1)) + EVENT_GAP + this_1.moreIndicatorHeight;
                    if (this_1.parent.activeViewOptions.orientation === 'Horizontal') {
                        var isRendered = this_1.renderedEvents.filter(function (eventObj) {
                            return eventObj.Guid === eventData.Guid;
                        });
                        var isSpanned = isSpannedCollection.filter(function (eventObj) {
                            return eventObj.Guid === eventData.Guid;
                        });
                        if (isRendered.length > 0 || isSpanned.length > 0) {
                            return "continue";
                        }
                    }
                    var isRowAutoHeight = this_1.parent.rowAutoHeight && this_1.parent.activeViewOptions.orientation === 'Horizontal';
                    if (isRowAutoHeight || this_1.cellHeight > availedHeight) {
                        this_1.renderEvent(eventWrapper, eventData, row, leftValue, rightValue, dayIndex);
                        this_1.updateCellHeight(rowTd, availedHeight);
                        isSpannedCollection.push(eventData);
                    }
                    else {
                        var moreIndex = this_1.parent.activeViewOptions.orientation === 'Horizontal' ? row : dayIndex;
                        this_1.renderMoreIndicatior(eventWrapper, count - index, dayStart, moreIndex, leftValue, rightValue);
                        if (this_1.parent.activeViewOptions.orientation === 'Horizontal') {
                            for (var a = index; a < dayEvents.length; a++) {
                                var moreData = extend({}, dayEvents[a], { Index: overlapIndex + a }, true);
                                this_1.renderedEvents.push(moreData);
                                isSpannedCollection.push(eventData);
                            }
                        }
                        return "break";
                    }
                };
                var this_1 = this;
                for (var index = 0, count = dayEvents.length; index < count; index++) {
                    var state_1 = _loop_1(index, count);
                    if (state_1 === "break")
                        break;
                }
                monthStart = util.addDays(new Date(monthStart.getTime()), 1);
                if (this.parent.activeViewOptions.orientation === 'Vertical') {
                    dayIndex++;
                    this.renderedEvents = [];
                }
            }
        }
    };
    YearEvent.prototype.timelineResourceEvents = function () {
        var workCell = this.parent.element.querySelector('.' + cls.WORK_CELLS_CLASS);
        this.cellWidth = workCell.offsetWidth;
        this.cellHeader = 0;
        var eventTable = this.parent.element.querySelector('.' + cls.EVENT_TABLE_CLASS);
        this.eventHeight = util.getElementHeightFromClass(eventTable, cls.APPOINTMENT_CLASS);
        var wrapperCollection = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_CONTAINER_CLASS));
        var resources = this.parent.uiStateValues.isGroupAdaptive ?
            [this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex]] : this.parent.resourceBase.lastResourceLevel;
        if (this.parent.activeViewOptions.orientation === 'Horizontal') {
            for (var month = 0; month < 12; month++) {
                for (var i = 0, len = resources.length; i < len; i++) {
                    this.renderedEvents = [];
                    this.renderResourceEvent(wrapperCollection[i], resources[i], month, i);
                }
            }
        }
        else {
            for (var i = 0, len = resources.length; i < len; i++) {
                this.renderedEvents = [];
                for (var month = 0; month < 12; month++) {
                    this.renderResourceEvent(wrapperCollection[i], resources[i], month, i);
                }
            }
        }
    };
    YearEvent.prototype.renderResourceEvent = function (wrapper, resource, month, index) {
        var eventWrapper = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
        wrapper.appendChild(eventWrapper);
        var monthStart = util.firstDateOfMonth(new Date(this.parent.selectedDate.getFullYear(), month, 1));
        var monthEnd = util.addDays(util.lastDateOfMonth(new Date(monthStart.getTime())), 1);
        var eventDatas = this.parent.eventBase.filterEvents(monthStart, monthEnd, undefined, resource);
        var rowIndex = this.parent.activeViewOptions.orientation === 'Vertical' ? index : month;
        var td = this.parent.element.querySelector(".e-content-wrap tr:nth-child(" + (rowIndex + 1) + ") td");
        this.cellHeight = td.offsetHeight;
        for (var a = 0; a < eventDatas.length; a++) {
            var data = eventDatas[a];
            var eventData = extend({}, data, null, true);
            var overlapIndex = this.getIndex(eventData[this.fields.startTime]);
            eventData.Index = overlapIndex;
            var availedHeight = this.cellHeader + (this.eventHeight * (a + 1)) + EVENT_GAP + this.moreIndicatorHeight;
            var leftValue = (this.parent.activeViewOptions.orientation === 'Vertical') ?
                month * this.cellWidth : index * this.cellWidth;
            if (this.parent.rowAutoHeight || this.cellHeight > availedHeight) {
                this.renderEvent(eventWrapper, eventData, month, leftValue, leftValue, index);
                this.updateCellHeight(td, availedHeight);
            }
            else {
                var moreIndex = this.parent.activeViewOptions.orientation === 'Horizontal' ? month : index;
                this.renderMoreIndicatior(eventWrapper, eventDatas.length - a, monthStart, moreIndex, leftValue, leftValue, index);
                if (this.parent.activeViewOptions.orientation === 'Horizontal') {
                    for (var i = index; i < eventDatas.length; i++) {
                        var moreData = extend({}, eventDatas[i], { Index: overlapIndex + i }, true);
                        this.renderedEvents.push(moreData);
                    }
                }
                break;
            }
        }
    };
    YearEvent.prototype.renderEvent = function (wrapper, eventData, row, left, right, rowIndex) {
        var _this = this;
        var eventObj = this.isSpannedEvent(eventData, row);
        var wrap = this.createEventElement(eventObj);
        var width;
        var index;
        if (eventObj[this.fields.isAllDay]) {
            eventObj[this.fields.endTime] = new Date(eventObj[this.fields.startTime].getTime());
        }
        if (this.parent.activeViewOptions.orientation === 'Horizontal') {
            index = row + 1;
            width = eventObj.isSpanned.count * this.cellWidth;
        }
        else {
            index = rowIndex + 1;
            width = this.cellWidth;
        }
        var rowTd = this.parent.element.querySelector(".e-content-wrap tr:nth-child(" + index + ") td");
        var top = rowTd.offsetTop + this.cellHeader + (this.eventHeight * eventObj.Index) + EVENT_GAP;
        setStyleAttribute(wrap, {
            'width': width + 'px', 'height': this.eventHeight + 'px', 'left': left + 'px', 'right': right + 'px', 'top': top + 'px'
        });
        var args = { data: eventObj, element: wrap, cancel: false, type: 'event' };
        this.parent.trigger(events.eventRendered, args, function (eventArgs) {
            if (!eventArgs.cancel) {
                wrapper.appendChild(wrap);
                _this.wireAppointmentEvents(wrap, eventObj, true);
                if (!eventObj.isSpanned.isRight) {
                    _this.renderedEvents.push(extend({}, eventObj, null, true));
                }
            }
        });
    };
    YearEvent.prototype.renderMoreIndicatior = function (wrapper, count, startDate, row, left, right, index) {
        var endDate = util.addDays(new Date(startDate.getTime()), 1);
        var moreIndicator = this.getMoreIndicatorElement(count, startDate, endDate);
        var rowTr = this.parent.element.querySelector(".e-content-wrap tr:nth-child(" + (row + 1) + ")");
        var top = rowTr.offsetTop + (this.cellHeight - this.moreIndicatorHeight);
        left = (Math.floor(left / this.cellWidth) * this.cellWidth);
        right = (Math.floor(right / this.cellWidth) * this.cellWidth);
        setStyleAttribute(moreIndicator, { 'width': this.cellWidth + 'px', 'left': left + 'px', 'right': right + 'px', 'top': top + 'px' });
        if (!isNullOrUndefined(index)) {
            moreIndicator.setAttribute('data-group-index', index.toString());
        }
        wrapper.appendChild(moreIndicator);
        EventHandler.add(moreIndicator, 'click', this.moreIndicatorClick, this);
    };
    YearEvent.prototype.createEventElement = function (record) {
        var eventSubject = (record[this.fields.subject] || this.parent.eventSettings.fields.subject.default);
        var eventWrapper = createElement('div', {
            className: cls.APPOINTMENT_CLASS,
            attrs: {
                'data-id': 'Appointment_' + record[this.fields.id],
                'data-guid': record.Guid,
                'role': 'button', 'tabindex': '0',
                'aria-readonly': this.parent.eventBase.getReadonlyAttribute(record), 'aria-selected': 'false', 'aria-grabbed': 'true',
                'aria-label': this.parent.getAnnocementString(record)
            }
        });
        if (this.cssClass) {
            addClass([eventWrapper], this.cssClass);
        }
        if (record[this.fields.isReadonly]) {
            addClass([eventWrapper], cls.READ_ONLY);
        }
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            var resIndex = this.getGroupIndexFromEvent(record);
            eventWrapper.setAttribute('data-group-index', resIndex.toString());
        }
        var templateElement = [];
        var eventObj = extend({}, record, null, true);
        if (this.parent.activeViewOptions.eventTemplate) {
            var templateId = this.parent.element.id + '_' + this.parent.activeViewOptions.eventTemplateName + 'eventTemplate';
            var templateArgs = util.addLocalOffsetToEvent(eventObj, this.parent.eventFields);
            templateElement = this.parent.getAppointmentTemplate()(templateArgs, this.parent, 'eventTemplate', templateId, false);
        }
        else {
            var locationEle = (record[this.fields.location] || this.parent.eventSettings.fields.location.default || '');
            var subjectEle = createElement('div', {
                className: cls.SUBJECT_CLASS,
                innerHTML: (eventSubject + (locationEle ? ';&nbsp' + locationEle : ''))
            });
            var startTimeEle = createElement('div', {
                className: cls.APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + cls.DISABLE_CLASS : ''),
                innerHTML: this.parent.getTimeString(eventObj[this.fields.startTime])
            });
            var endTimeEle = createElement('div', {
                className: cls.APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + cls.DISABLE_CLASS : ''),
                innerHTML: this.parent.getTimeString(eventObj[this.fields.endTime])
            });
            addClass([subjectEle], 'e-text-center');
            if (record[this.fields.isAllDay]) {
                templateElement = [subjectEle];
            }
            else if (!eventObj.isLeft && !eventObj.isRight) {
                templateElement = [startTimeEle, subjectEle, endTimeEle];
            }
            else {
                if (!eventObj.isLeft) {
                    templateElement.push(startTimeEle);
                }
                templateElement.push(subjectEle);
                if (!eventObj.isRight) {
                    templateElement.push(endTimeEle);
                }
            }
        }
        var appointmentDetails = createElement('div', { className: cls.APPOINTMENT_DETAILS });
        append(templateElement, appointmentDetails);
        eventWrapper.appendChild(appointmentDetails);
        this.applyResourceColor(eventWrapper, eventObj, 'backgroundColor', this.groupOrder);
        return eventWrapper;
    };
    YearEvent.prototype.isSpannedEvent = function (eventObj, month) {
        var monthStart = new Date(this.parent.selectedDate.getFullYear(), month, 1);
        var monthEnd = util.addDays(new Date(this.parent.selectedDate.getFullYear(), month + 1, 0), 1);
        var eventData = extend({}, eventObj, null, true);
        var eventStart = eventData[this.fields.startTime];
        var eventEnd = eventData[this.fields.endTime];
        var isSpanned = { isLeft: false, isRight: false, count: 1 };
        if (eventStart.getTime() < monthStart.getTime()) {
            eventData[this.fields.startTime] = monthStart;
            isSpanned.isLeft = true;
        }
        if (eventEnd.getTime() > monthEnd.getTime()) {
            eventData[this.fields.endTime] = monthEnd;
            isSpanned.isRight = true;
        }
        if (this.parent.activeViewOptions.group.resources.length === 0) {
            isSpanned.count = Math.ceil((eventData[this.fields.endTime].getTime() -
                eventData[this.fields.startTime].getTime()) / util.MS_PER_DAY);
        }
        eventData.isSpanned = isSpanned;
        return eventData;
    };
    YearEvent.prototype.getOverlapEvents = function (date, appointments) {
        var appointmentsList = [];
        for (var _i = 0, _a = appointments; _i < _a.length; _i++) {
            var app = _a[_i];
            var appStart = new Date(app[this.fields.startTime].getTime());
            var appEnd = new Date(app[this.fields.endTime].getTime());
            if ((util.resetTime(appStart).getTime() <= util.resetTime(new Date(date.getTime())).getTime()) &&
                (util.resetTime(appEnd).getTime() >= util.resetTime(new Date(date.getTime())).getTime())) {
                appointmentsList.push(app);
            }
        }
        return appointmentsList;
    };
    YearEvent.prototype.removeCellHeight = function () {
        var elementSelector = "." + cls.MONTH_HEADER_WRAPPER + " tbody tr,." + cls.RESOURCE_COLUMN_TABLE_CLASS + " tbody tr,." + cls.CONTENT_TABLE_CLASS + " tbody tr";
        var rows = [].slice.call(this.element.querySelectorAll(elementSelector));
        for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
            var row = rows_1[_i];
            row.firstElementChild.style.height = '';
        }
    };
    return YearEvent;
}(TimelineEvent));
export { YearEvent };
