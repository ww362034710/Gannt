import { Mixin } from "../../../../ChronoGraph/class/BetterMixin.js";
import { ChronoPartOfProjectGenericMixin } from "../../ChronoPartOfProjectGenericMixin.js";
import { ChronoStoreMixin } from "./ChronoStoreMixin.js";
import { AbstractPartOfProjectStoreMixin } from "./AbstractPartOfProjectStoreMixin.js";
export class ChronoPartOfProjectStoreMixin extends Mixin([
    AbstractPartOfProjectStoreMixin,
    ChronoPartOfProjectGenericMixin,
    ChronoStoreMixin
], (base) => {
    const superProto = base.prototype;
    class ChronoPartOfProjectStoreMixin extends base {
    }
    return ChronoPartOfProjectStoreMixin;
}) {
}
