import { createElement, append, closest, addClass } from '@syncfusion/ej2-base';
import { Tooltip } from '@syncfusion/ej2-popups';
import * as cls from '../base/css-constant';
/**
 * Tooltip for Kanban board
 */
var KanbanTooltip = /** @class */ (function () {
    function KanbanTooltip(parent) {
        this.parent = parent;
        this.renderTooltip();
    }
    KanbanTooltip.prototype.renderTooltip = function () {
        this.tooltipObj = new Tooltip({
            cssClass: this.parent.cssClass + ' ' + cls.TOOLTIP_CLASS,
            enableRtl: this.parent.enableRtl,
            mouseTrail: !this.parent.isAdaptive,
            offsetY: 5,
            position: 'BottomCenter',
            showTipPointer: true,
            target: '.' + cls.TOOLTIP_TEXT_CLASS,
            beforeRender: this.onBeforeRender.bind(this)
        });
        this.tooltipObj.appendTo(this.parent.element);
        this.tooltipObj.isStringTemplate = true;
    };
    KanbanTooltip.prototype.onBeforeRender = function (args) {
        if (this.parent.dragAndDropModule.isDragging) {
            args.cancel = true;
            return;
        }
        var tooltipContent;
        if (this.parent.tooltipTemplate) {
            tooltipContent = createElement('div');
            var target = closest(args.target, '.' + cls.CARD_CLASS);
            var data = this.parent.getCardDetails(target);
            var tooltipTemplate = this.parent.templateParser(this.parent.tooltipTemplate)(data);
            append(tooltipTemplate, tooltipContent);
        }
        else {
            tooltipContent = "<div class=\"e-card-header-caption\">" + args.target.innerText + "</div>";
        }
        this.tooltipObj.setProperties({ content: tooltipContent }, true);
    };
    KanbanTooltip.prototype.destroy = function () {
        this.tooltipObj.destroy();
        addClass([this.parent.element], 'e-control');
        this.tooltipObj = null;
    };
    return KanbanTooltip;
}());
export { KanbanTooltip };
