import { Mixin } from "../../../../ChronoGraph/class/BetterMixin.js";
import { CorePartOfProjectGenericMixin } from "../../CorePartOfProjectGenericMixin.js";
import Model from "../../../../Core/data/Model.js";
import { AbstractPartOfProjectModelMixin } from "./AbstractPartOfProjectModelMixin.js";
export class CorePartOfProjectModelMixin extends Mixin([
    AbstractPartOfProjectModelMixin,
    CorePartOfProjectGenericMixin,
    Model
], (base) => {
    const superProto = base.prototype;
    class CorePartOfProjectModelMixin extends base {
        constructor() {
            super(...arguments);
            this.$isCalculating = false;
            this.$changed = {};
            this.$beforeChange = {};
        }
        joinProject() {
            this.invalidate();
        }
        leaveProject(isReplacing = false) {
            var _a;
            superProto.leaveProject.call(this, isReplacing);
            (_a = this.project) === null || _a === void 0 ? void 0 : _a.bufferedCommitAsync();
        }
        invalidate() {
            var _a;
            (_a = this.project) === null || _a === void 0 ? void 0 : _a.invalidate(this);
        }
        getCurrentOrProposed(fieldName) {
            var _a;
            if (fieldName in this.$changed) {
                return this.$changed[fieldName];
            }
            return (_a = this.get(fieldName)) !== null && _a !== void 0 ? _a : null;
        }
        hasCurrentOrProposed(fieldName) {
            return this.$changed[fieldName] != null || this.get(fieldName) != null;
        }
        propose(changes) {
            Object.keys(changes).forEach(field => {
                this.$changed[field] = changes[field];
            });
            this.invalidate();
        }
        setChanged(field, value, invalidate = true, setData = false) {
            const me = this;
            me.$changed[field] = value;
            if (setData) {
                if (!(field in me.$beforeChange)) {
                    me.$beforeChange[field] = me.get(field);
                }
                me.setData(field, value);
            }
            invalidate && me.invalidate();
        }
        calculateInvalidated() { }
        finalizeInvalidated(silent = false) {
            const me = this;
            me.$isCalculating = true;
            if (me.$changed.__REFADR__) {
                me.$changed = Object.assign({}, me.$changed);
            }
            Object.keys(me.$beforeChange).forEach(fieldName => {
                me.setData(fieldName, me.$beforeChange[fieldName]);
            });
            me.set(me.$changed, null, silent);
            me.$changed = {};
            me.$beforeChange = {};
            me.$isCalculating = false;
        }
    }
    return CorePartOfProjectModelMixin;
}) {
}
