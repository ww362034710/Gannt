import { Mixin } from "../../../ChronoGraph/class/BetterMixin.js";
import { CorePartOfProjectStoreMixin } from "./mixin/CorePartOfProjectStoreMixin.js";
import { CoreResourceMixin } from "../model/scheduler_core/CoreResourceMixin.js";
import { AbstractResourceStoreMixin } from "./AbstractResourceStoreMixin.js";
export class CoreResourceStoreMixin extends Mixin([AbstractResourceStoreMixin, CorePartOfProjectStoreMixin], (base) => {
    const superProto = base.prototype;
    class CoreResourceStoreMixin extends base {
        static get defaultConfig() {
            return {
                modelClass: CoreResourceMixin
            };
        }
    }
    return CoreResourceStoreMixin;
}) {
}
