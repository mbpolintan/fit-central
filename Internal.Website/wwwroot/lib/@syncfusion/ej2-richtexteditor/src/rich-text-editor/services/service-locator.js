import { isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * ServiceLocator
 * @hidden

 */
var ServiceLocator = /** @class */ (function () {
    function ServiceLocator() {
        this.services = {};
    }
    /**
     * register method
     * @hidden

     */
    ServiceLocator.prototype.register = function (name, type) {
        if (isNullOrUndefined(this.services[name])) {
            this.services[name] = type;
        }
    };
    /**
     * getService method
     * @hidden

     */
    ServiceLocator.prototype.getService = function (name) {
        if (isNullOrUndefined(this.services[name])) {
            throw "The service " + name + " is not registered";
        }
        return this.services[name];
    };
    return ServiceLocator;
}());
export { ServiceLocator };
