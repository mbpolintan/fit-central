import { Tooltip as TooltipComponent } from '@syncfusion/ej2-popups';
import { parentsUntil } from '../base/utils';
import * as cls from '../base/css-constants';
import { extend, isNullOrUndefined, getValue, EventHandler, closest } from '@syncfusion/ej2-base';
import { Deferred } from '@syncfusion/ej2-data';
/**
 * File for handling tooltip in Gantt.
 */
var Tooltip = /** @class */ (function () {
    function Tooltip(gantt) {
        this.parent = gantt;
        this.createTooltip();
        this.parent.on('destroy', this.destroy, this);
    }
    /**
     * To create tooltip.
     * @return {void}
     * @private
     */
    /* tslint:disable-next-line:max-func-body-length */
    Tooltip.prototype.createTooltip = function () {
        this.toolTipObj = new TooltipComponent();
        this.toolTipObj.target = '.e-header-cell-label, .e-gantt-child-taskbar,' +
            '.e-gantt-parent-taskbar, .e-gantt-milestone, .e-gantt-unscheduled-taskbar' +
            '.e-event-markers, .e-baseline-bar, .e-event-markers,' +
            '.e-connector-line-container, .e-indicator-span, .e-notes-info, .e-gantt-manualparent-milestone,' +
            '.e-taskbar-left-resizer, .e-taskbar-right-resizer, .e-baseline-gantt-milestone, .e-gantt-manualparenttaskbar';
        this.toolTipObj.position = 'BottomCenter';
        this.toolTipObj.openDelay = 700;
        this.toolTipObj.enableHtmlSanitizer = false;
        this.toolTipObj.cssClass = cls.ganttTooltip;
        this.toolTipObj.animation = { open: { effect: 'None', delay: 0 }, close: { effect: 'None', delay: 0 } };
        this.toolTipObj.afterOpen = this.updateTooltipPosition.bind(this);
        this.toolTipObj.showTipPointer = false;
        this.toolTipObj.beforeRender = this.tooltipBeforeRender.bind(this);
        this.toolTipObj.afterClose = this.tooltipCloseHandler.bind(this);
        this.toolTipObj.isStringTemplate = true;
        this.toolTipObj.appendTo(this.parent.element);
    };
    /* tslint:disable-next-line:max-func-body-length */
    Tooltip.prototype.tooltipBeforeRender = function (args) {
        var parent = this.parent;
        if (parent.isOnEdit) {
            args.cancel = true;
        }
        var element;
        var row = closest(args.target, 'div.' + cls.taskBarMainContainer);
        if (!isNullOrUndefined(row)) {
            element = args.target;
        }
        else {
            element = parentsUntil(args.target, cls.chartRowCell);
        }
        var data;
        var argsData = {
            data: {},
            args: args,
            cancel: false,
            content: ''
        };
        if (args.target.classList.contains('e-header-cell-label')) {
            if (parent.timelineSettings.showTooltip) {
                argsData.content = this.toolTipObj.content = parent.tooltipModule.getTooltipContent('timeline', data, parent, args);
            }
            else {
                args.cancel = true;
            }
        }
        else {
            if (parent.tooltipSettings.showTooltip) {
                if (element) {
                    argsData.data = parent.ganttChartModule.getRecordByTaskBar(element);
                    data = argsData.data;
                }
                if (args.target.classList.contains('e-gantt-child-taskbar') ||
                    args.target.classList.contains('e-gantt-parent-taskbar') ||
                    args.target.classList.contains('e-gantt-milestone') ||
                    args.target.classList.contains('e-gantt-unscheduled-taskbar') ||
                    args.target.classList.contains('e-taskbar-left-resizer') ||
                    args.target.classList.contains('e-taskbar-right-resizer')) {
                    var taskbarTemplateNode = void 0;
                    if (parent.tooltipSettings.taskbar) {
                        taskbarTemplateNode = parent.tooltipModule.templateCompiler(parent.tooltipSettings.taskbar, parent, data, 'TooltipTaskbarTemplate');
                    }
                    argsData.content = this.toolTipObj.content = taskbarTemplateNode ? taskbarTemplateNode[0] :
                        parent.tooltipModule.getTooltipContent((data.ganttProperties.isMilestone ? 'milestone' : 'taskbar'), data, parent, args);
                }
                else if (args.target.classList.contains('e-baseline-bar') ||
                    args.target.classList.contains('e-baseline-gantt-milestone')) {
                    var baseLineTemplateNode = void 0;
                    if ((parent.tooltipSettings.baseline)) {
                        baseLineTemplateNode = parent.tooltipModule.templateCompiler(parent.tooltipSettings.baseline, parent, data, 'TooltipBaselineTemplate');
                    }
                    argsData.content = this.toolTipObj.content = baseLineTemplateNode ? baseLineTemplateNode[0] :
                        parent.tooltipModule.getTooltipContent((data.ganttProperties.isMilestone ? 'milestone' : 'baseline'), data, parent, args);
                }
                else if (args.target.classList.contains('e-event-markers')) {
                    argsData.content = this.toolTipObj.content = parent.tooltipModule.getTooltipContent('marker', data, parent, args);
                }
                else if (args.target.classList.contains('e-connector-line-container')) {
                    var dependencyLineTemplateNode = void 0;
                    parent.tooltipModule.predecessorTooltipData = parent.tooltipModule.getPredecessorTooltipData(args);
                    argsData.data = this.predecessorTooltipData;
                    if ((parent.tooltipSettings.connectorLine)) {
                        dependencyLineTemplateNode = parent.tooltipModule.templateCompiler(parent.tooltipSettings.connectorLine, parent, parent.tooltipModule.predecessorTooltipData, 'TooltipConnectorLineTemplate');
                    }
                    argsData.content = this.toolTipObj.content = dependencyLineTemplateNode ?
                        dependencyLineTemplateNode[0] :
                        parent.tooltipModule.getTooltipContent('connectorLine', data, parent, args);
                }
                else if (args.target.classList.contains('e-indicator-span')) {
                    argsData.content = this.toolTipObj.content =
                        parent.tooltipModule.getTooltipContent('indicator', data, parent, args);
                    if (isNullOrUndefined(argsData.content)) {
                        args.cancel = true;
                    }
                }
                else if (args.target.classList.contains('e-notes-info')) {
                    var ganttData = this.parent.ganttChartModule.getRecordByTarget(args.event);
                    argsData.content = this.toolTipObj.content = ganttData.ganttProperties.notes;
                    if (isNullOrUndefined(argsData.content)) {
                        args.cancel = true;
                    }
                }
                else if (args.target.classList.contains('e-gantt-manualparenttaskbar')) {
                    argsData.content = this.toolTipObj.content = parent.tooltipModule.getTooltipContent('manualtaskbar', data, parent, args);
                    if (isNullOrUndefined(argsData.content)) {
                        args.cancel = true;
                    }
                }
                else if (args.target.classList.contains('e-gantt-manualparent-milestone')) {
                    argsData.content = this.toolTipObj.content = parent.tooltipModule.getTooltipContent('manualmilestone', data, parent, args);
                    if (isNullOrUndefined(argsData.content)) {
                        args.cancel = true;
                    }
                }
            }
            else {
                args.cancel = true;
            }
        }
        if (args.cancel === false) {
            var callBackPromise_1 = new Deferred();
            parent.trigger('beforeTooltipRender', argsData, function (argsData) {
                callBackPromise_1.resolve(argsData);
                if (argsData.cancel) {
                    args.cancel = true;
                }
            });
            if (!this.parent.isAdaptive && args.event.type === 'mouseover') {
                this.currentTarget = args.target;
                EventHandler.add(this.currentTarget, 'mousemove', this.mouseMoveHandler.bind(this));
            }
            return callBackPromise_1;
        }
    };
    Tooltip.prototype.tooltipCloseHandler = function (args) {
        this.tooltipMouseEvent = null;
        if (!this.parent.isAdaptive) {
            EventHandler.remove(this.currentTarget, 'mousemove', this.mouseMoveHandler);
        }
        this.currentTarget = null;
    };
    Tooltip.prototype.mouseMoveHandler = function (e) {
        this.tooltipMouseEvent = e;
    };
    /**
     * Method to update tooltip position
     * @param args
     */
    Tooltip.prototype.updateTooltipPosition = function (args) {
        if (isNullOrUndefined(this.tooltipMouseEvent) || args.target.classList.contains('e-notes-info')) {
            return;
        }
        var postion = this.getPointorPosition(this.tooltipMouseEvent);
        var containerPosition = this.parent.getOffsetRect(this.parent.chartPane);
        var topEnd = containerPosition.top + this.parent.chartPane.offsetHeight;
        var leftEnd = containerPosition.left + this.parent.chartPane.offsetWidth;
        var tooltipPositionX = postion.x;
        var tooltipPositionY = postion.y;
        var tooltipUpdated = false;
        if (leftEnd < (tooltipPositionX + args.element.offsetWidth + 20)) {
            tooltipPositionX = tooltipPositionX - args.element.offsetWidth - 10;
        }
        else {
            tooltipPositionX = tooltipPositionX + 10;
        }
        if (topEnd < (tooltipPositionY + args.element.offsetHeight + 20)) {
            tooltipPositionY = tooltipPositionY - args.element.offsetHeight - 10;
        }
        else {
            tooltipUpdated = true;
            tooltipPositionY = tooltipPositionY + 10;
        }
        if (window.innerHeight < args.element.offsetHeight + tooltipPositionY) {
            tooltipPositionY = tooltipPositionY - args.element.offsetHeight - (tooltipUpdated ? 20 : 10);
        }
        args.element.style.left = tooltipPositionX + 'px';
        args.element.style.top = tooltipPositionY + 'px';
    };
    /**
     * Method to get mouse pointor position
     * @param e
     */
    Tooltip.prototype.getPointorPosition = function (e) {
        var posX;
        var posY;
        if (!isNullOrUndefined(getValue('pageX', e)) || !isNullOrUndefined(getValue('pageY', e))) {
            posX = getValue('pageX', e);
            posY = getValue('pageY', e);
        }
        else if (!isNullOrUndefined(getValue('clientX', e)) || !isNullOrUndefined(getValue('clientY', e))) {
            posX = getValue('clientX', e) + document.body.scrollLeft + document.documentElement.scrollLeft;
            posY = getValue('clientY', e) + document.body.scrollTop + document.documentElement.scrollTop;
        }
        return { x: posX, y: posY };
    };
    /**
     *  Getting tooltip content for different elements
     */
    /* tslint:disable-next-line:max-func-body-length */
    Tooltip.prototype.getTooltipContent = function (elementType, ganttData, parent, args) {
        var content;
        var data;
        var taskName;
        if (ganttData) {
            data = ganttData.ganttProperties;
            taskName = !isNullOrUndefined(data.taskName) ? '<tr class = "e-gantt-tooltip-rowcell"><td colspan="3">' +
                data.taskName + '</td></tr>' : '';
        }
        switch (elementType) {
            case 'milestone':
                var sDate = !isNullOrUndefined(data.startDate) ? '<tr><td class = "e-gantt-tooltip-label"> Date</td><td>:</td>' +
                    '<td class = "e-gantt-tooltip-value">' +
                    this.parent.getFormatedDate(data.startDate, this.parent.getDateFormat()) + '</td></tr>' : '';
                content = '<table class = "e-gantt-tooltiptable"><tbody>' +
                    taskName + sDate + '</tbody></table>';
                break;
            case 'taskbar':
                var scheduledTask = !ganttData.hasChildRecords || data.isAutoSchedule ? true : false;
                var startDate = data.startDate ? '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant(scheduledTask ? 'startDate' : 'subTasksStartDate') +
                    '</td><td>:</td>' + '<td class = "e-gantt-tooltip-value"> ' +
                    this.parent.getFormatedDate(scheduledTask ? data.startDate : data.autoStartDate, this.parent.getDateFormat()) +
                    '</td></tr>' : '';
                var endDate = data.endDate ? '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant(scheduledTask ? 'endDate' : 'subTasksEndDate') +
                    '</td><td>:</td><td class = "e-gantt-tooltip-value">' + this.parent.getFormatedDate(scheduledTask ? data.endDate : data.autoEndDate, this.parent.getDateFormat()) + '</td></tr>' : '';
                var duration = !isNullOrUndefined(data.duration) ? '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('duration') + '</td><td>:</td>' +
                    '<td class = "e-gantt-tooltip-value"> ' + this.parent.getDurationString((scheduledTask ? data.duration : data.autoDuration), data.durationUnit) +
                    '</td></tr>' : '';
                var progress = !isNullOrUndefined(data.progress) ? '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('progress') + '</td><td>:</td><td>' + data.progress +
                    '</td></tr>' : '';
                content = '<table class = "e-gantt-tooltiptable"><tbody>' +
                    taskName + startDate + endDate + duration + progress + '</tbody></table>';
                break;
            case 'baseline':
                content = '<table class = "e-gantt-tooltiptable"><tbody>' +
                    taskName + '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('baselineStartDate') + '</td><td>:</td>' + '<td class = "e-gantt-tooltip-value">' +
                    this.parent.getFormatedDate(data.baselineStartDate, this.parent.getDateFormat()) + '</td></tr><tr>' +
                    '<td class = "e-gantt-tooltip-label">' + this.parent.localeObj.getConstant('baselineEndDate') +
                    '</td><td>:</td><td class = "e-gantt-tooltip-value">' +
                    this.parent.getFormatedDate(data.baselineEndDate, this.parent.getDateFormat()) + '</td></tr></tbody></table>';
                break;
            case 'marker':
                var markerTooltipElement = parent.tooltipModule.getMarkerTooltipData(args);
                var markerLabel = markerTooltipElement.label ? markerTooltipElement.label : '';
                content = '<table class = "e-gantt-tooltiptable"><tbody><tr><td>' +
                    this.parent.getFormatedDate(this.parent.dateValidationModule.getDateFromFormat(markerTooltipElement.day), this.parent.getDateFormat()) +
                    '</td></tr><tr><td>' +
                    markerLabel + '</td></tr></tbody></table>';
                break;
            case 'connectorLine':
                content = '<table class = "e-gantt-tooltiptable"><tbody><tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('from') + '</td><td>:</td>' +
                    '<td class = "e-gantt-tooltip-value">' + parent.tooltipModule.predecessorTooltipData.fromName + ' (' +
                    parent.tooltipModule.predecessorTooltipData.fromId + ')' + '</td></tr><tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('to') + '</td><td>:</td>' + '<td class = "e-gantt-tooltip-value">' +
                    parent.tooltipModule.predecessorTooltipData.toName +
                    ' (' + parent.tooltipModule.predecessorTooltipData.toId + ')' +
                    '</td></tr><tr><td class = "e-gantt-tooltip-label">' + this.parent.localeObj.getConstant('taskLink') +
                    '</td><td>:</td><td class = "e-gantt-tooltip-value"> ' + parent.tooltipModule.predecessorTooltipData.linkText +
                    '</td></tr><tr><td class = "e-gantt-tooltip-label">' + this.parent.localeObj.getConstant('lag') +
                    '</td><td>:</td><td class = "e-gantt-tooltip-value">' +
                    parent.tooltipModule.predecessorTooltipData.offsetString + '</td></tr></tbody></table>';
                break;
            case 'indicator':
                if (args.target.title.length) {
                    content = '<table class = "e-gantt-tooltiptable"><tbody><tr>' + args.target.title + '</tr></tbody></table>';
                }
                break;
            case 'timeline':
                content = '<table class = "e-gantt-tooltiptable"><tbody><tr>' + args.target.title + '</tr></tbody></table>';
                break;
            case 'manualtaskbar':
                var autoStartDate = data.autoStartDate ? '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('subTasksStartDate') + '</td><td>:</td>' + '<td class = "e-gantt-tooltip-value"> ' +
                    this.parent.getFormatedDate(data.autoStartDate, this.parent.getDateFormat()) + '</td></tr>' : '';
                var autoEndDate = data.autoEndDate ? '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('subTasksEndDate') + '</td><td>:</td>' + '<td class = "e-gantt-tooltip-value">' +
                    this.parent.getFormatedDate(data.autoEndDate, this.parent.getDateFormat()) + '</td></tr>' : '';
                var durationValue = !isNullOrUndefined(data.duration) ? '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('duration') + '</td><td>:</td>' +
                    '<td class = "e-gantt-tooltip-value"> ' + this.parent.getDurationString(data.duration, data.durationUnit) +
                    '</td></tr>' : '';
                var manualStartDate = data.startDate ? '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('startDate') + '</td><td>:</td>' + '<td class = "e-gantt-tooltip-value"> ' +
                    this.parent.getFormatedDate(data.startDate, this.parent.getDateFormat()) + '</td></tr>' : '';
                var manualEndDate = data.endDate ? '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('endDate') + '</td><td>:</td>' + '<td class = "e-gantt-tooltip-value">' +
                    this.parent.getFormatedDate(data.endDate, this.parent.getDateFormat()) + '</td></tr>' : '';
                content = '<table class = "e-gantt-tooltiptable"><tbody>' +
                    taskName + manualStartDate + autoStartDate + manualEndDate + autoEndDate + durationValue + '</tbody></table>';
                break;
            case 'manualmilestone':
                var autoStart = data.autoStartDate ? '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('subTasksStartDate') + '</td><td>:</td>' + '<td class = "e-gantt-tooltip-value"> ' +
                    this.parent.getFormatedDate(data.autoStartDate, this.parent.getDateFormat()) + '</td></tr>' : '';
                var autoEnd = data.autoEndDate ? '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('subTasksEndDate') + '</td><td>:</td>' + '<td class = "e-gantt-tooltip-value">' +
                    this.parent.getFormatedDate(data.autoEndDate, this.parent.getDateFormat()) + '</td></tr>' : '';
                var date = '<tr><td class = "e-gantt-tooltip-label"> Date</td><td>:</td>' +
                    '<td class = "e-gantt-tooltip-value">' +
                    this.parent.getFormatedDate(data.startDate, this.parent.getDateFormat()) + '</tr>';
                content = '<table class = "e-gantt-tooltiptable"><tbody>' +
                    taskName + date + autoStart + autoEnd + '</tbody></table>';
                break;
        }
        return content;
    };
    /**
     * To get the details of an event marker.
     * @private
     */
    Tooltip.prototype.getMarkerTooltipData = function (args) {
        var markerTooltipId = (args.target.id).match(/\d+/g);
        var markerTooltipElement = this.parent.eventMarkers[Number(markerTooltipId)];
        return markerTooltipElement;
    };
    /**
     * To get the details of a connector line.
     * @private
     */
    Tooltip.prototype.getPredecessorTooltipData = function (args) {
        var predeceesorParent = args.target.parentElement.id;
        var taskIds = predeceesorParent.match(/\d+/g);
        var fromTask;
        var toTask;
        if (this.parent.viewType === 'ResourceView') {
            fromTask = this.parent.flatData[this.parent.getTaskIds().indexOf('T' + taskIds[0])];
            toTask = this.parent.flatData[this.parent.getTaskIds().indexOf('T' + taskIds[1])];
        }
        else {
            fromTask = this.parent.flatData[this.parent.ids.indexOf(taskIds[0])];
            toTask = this.parent.flatData[this.parent.ids.indexOf(taskIds[1])];
        }
        var predecessor = fromTask.ganttProperties.predecessor.filter(function (pdc) { return pdc.to === taskIds[1]; });
        var predecessorTooltipData = {
            fromId: this.parent.viewType === 'ResourceView' ? fromTask.ganttProperties.taskId : fromTask.ganttProperties.rowUniqueID,
            toId: this.parent.viewType === 'ResourceView' ? toTask.ganttProperties.taskId : toTask.ganttProperties.rowUniqueID,
            fromName: fromTask.ganttProperties.taskName,
            toName: toTask.ganttProperties.taskName,
            linkType: predecessor[0].type,
            linkText: this.parent.getPredecessorTextValue(predecessor[0].type),
            offset: predecessor[0].offset,
            offsetUnit: predecessor[0].offsetUnit,
            offsetString: this.parent.getDurationString(predecessor[0].offset, predecessor[0].offsetUnit)
        };
        return predecessorTooltipData;
    };
    /**
     * @private
     * To compile template string.
     */
    Tooltip.prototype.templateCompiler = function (template, parent, data, propName) {
        var tooltipFunction = parent.chartRowsModule.templateCompiler(template);
        var templateID = parent.chartRowsModule.getTemplateID(propName);
        var templateNode = tooltipFunction(extend({ index: 0 }, data), parent, propName, templateID, true);
        return templateNode;
    };
    Tooltip.prototype.destroy = function () {
        this.toolTipObj.destroy();
    };
    return Tooltip;
}());
export { Tooltip };
