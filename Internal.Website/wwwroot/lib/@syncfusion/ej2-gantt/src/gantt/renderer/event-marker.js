import { createElement, formatUnit, remove, isNullOrUndefined } from '@syncfusion/ej2-base';
import * as cls from '../base/css-constants';
var EventMarker = /** @class */ (function () {
    function EventMarker(gantt) {
        this.parent = gantt;
        this.eventMarkersContainer = null;
    }
    /**
     * @private
     */
    EventMarker.prototype.renderEventMarkers = function () {
        if (this.parent.eventMarkers && this.parent.eventMarkers.length > 0) {
            if (!this.parent.ganttChartModule.chartBodyContent.contains(this.eventMarkersContainer)) {
                this.eventMarkersContainer = createElement('div', {
                    className: cls.eventMarkersContainer
                });
                this.parent.ganttChartModule.chartBodyContent.appendChild(this.eventMarkersContainer);
            }
            this.eventMarkersContainer.innerHTML = '';
            this.getEventMarkersElements(this.eventMarkersContainer);
        }
        else {
            this.removeContainer();
        }
    };
    /**
     * @private
     */
    EventMarker.prototype.removeContainer = function () {
        if (this.eventMarkersContainer) {
            remove(this.eventMarkersContainer);
            this.eventMarkersContainer = null;
        }
    };
    /**
     * Method to get event markers as html string
     */
    EventMarker.prototype.getEventMarkersElements = function (container) {
        var left;
        var eventMarkerElement;
        var spanElement;
        var rightArrow;
        for (var i = 0; i < this.parent.eventMarkers.length; i++) {
            left = this.parent.dataOperation.getTaskLeft(this.parent.dateValidationModule.getDateFromFormat(this.parent.eventMarkers[i].day, true), false);
            eventMarkerElement = createElement('div', {
                className: cls.eventMarkersChild, styles: "left:" + left + "px;  height:100%;",
                id: 'stripline' + i
            });
            if (this.parent.eventMarkers[i].label) {
                spanElement = createElement('div', {
                    className: cls.eventMarkersSpan,
                });
                var property = this.parent.disableHtmlEncode ? 'textContent' : 'innerHTML';
                spanElement[property] = this.parent.eventMarkers[i].label;
                eventMarkerElement.appendChild(spanElement);
                rightArrow = createElement('div', {
                    className: 'e-gantt-right-arrow'
                });
                eventMarkerElement.appendChild(rightArrow);
            }
            if (this.parent.eventMarkers[i].cssClass) {
                eventMarkerElement.classList.add(this.parent.eventMarkers[i].cssClass);
            }
            eventMarkerElement.setAttribute('tabindex', '-1');
            if (!isNullOrUndefined(this.parent.eventMarkers[i].day)) {
                eventMarkerElement.setAttribute('aria-label', this.parent.localeObj.getConstant('eventMarkers') + ' '
                    + (typeof this.parent.eventMarkers[i].day === 'string' ?
                        this.parent.eventMarkers[i].day : this.parent.getFormatedDate(this.parent.eventMarkers[i].day))
                    + ' ' + this.parent.eventMarkers[i].label);
            }
            container.appendChild(eventMarkerElement);
        }
    };
    /**
     * @private
     */
    EventMarker.prototype.updateContainerHeight = function () {
        if (this.eventMarkersContainer) {
            this.eventMarkersContainer.style.height = formatUnit(this.parent.contentHeight);
        }
    };
    return EventMarker;
}());
export { EventMarker };
