var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Base } from "../class/Base.js";
import { Mixin } from "../class/Mixin.js";
import { required, validateRequiredProperties } from "../class/RequiredProperty.js";
import { CI, concatIterable, map, uniqueOnly } from "../collection/Iterator.js";
import { DEBUG } from "../environment/Debug.js";
import { OnCycleAction, WalkContext } from "../graph/WalkDepth.js";
let FORMULA_ID = 0;
export const CalculateProposed = FORMULA_ID++;
export class Formula extends Base {
    constructor() {
        super(...arguments);
        this.formulaId = FORMULA_ID++;
        this.inputs = new Set();
    }
}
export class VariableWalkContext extends WalkContext {
    collectNext(sourceNode, toVisit) {
        if (sourceNode instanceof Formula) {
            toVisit.push({ node: sourceNode.output, from: sourceNode, label: undefined });
        }
        else {
            const formulas = this.cache.formulasByInput.get(sourceNode);
            formulas && formulas.forEach(formula => toVisit.push({ node: formula, from: sourceNode, label: undefined }));
        }
    }
}
export class FormulasCache extends Mixin([Base], (base) => class FormulasCache extends base {
    constructor() {
        super(...arguments);
        this.variables = new Set();
        this.formulas = new Set();
        this.$formulasByInput = undefined;
        this.$formulasByOutput = undefined;
    }
    get formulasByInput() {
        if (this.$formulasByInput !== undefined)
            return this.$formulasByInput;
        this.fillCache();
        return this.$formulasByInput;
    }
    get formulasByOutput() {
        if (this.$formulasByOutput !== undefined)
            return this.$formulasByOutput;
        this.fillCache();
        return this.$formulasByOutput;
    }
    add(formula) {
        this.$formulasByInput = undefined;
        this.$formulasByOutput = undefined;
        this.formulas.add(formula);
    }
    has(formula) {
        return this.formulas.has(formula);
    }
    fillCache() {
        this.$formulasByInput = new Map();
        this.$formulasByOutput = new Map();
        this.formulas.forEach(formula => {
            let formulasByOutput = this.$formulasByOutput.get(formula.output);
            if (!formulasByOutput) {
                formulasByOutput = new Set();
                this.$formulasByOutput.set(formula.output, formulasByOutput);
            }
            formulasByOutput.add(formula);
            formula.inputs.forEach(input => {
                let formulasByInput = this.$formulasByInput.get(input);
                if (!formulasByInput) {
                    formulasByInput = new Set();
                    this.$formulasByInput.set(input, formulasByInput);
                }
                formulasByInput.add(formula);
            });
        });
    }
    allInputVariables() {
        return uniqueOnly(concatIterable(map(this.formulas, formula => formula.inputs.values())));
    }
    isCyclic() {
        let isCyclic = false;
        const walkContext = VariableWalkContext.new({ cache: this, onCycle: () => { isCyclic = true; return OnCycleAction.Cancel; } });
        walkContext.startFrom(Array.from(this.allInputVariables()));
        return isCyclic;
    }
}) {
}
export class CycleDescription extends FormulasCache {
}
export class CycleResolution extends Base {
    constructor() {
        super(...arguments);
        this.description = undefined;
        this.defaultResolutionFormulas = new Set();
        this.resolutionsByInputHash = new Map();
    }
    clear() {
        this.resolutionsByInputHash.clear();
    }
    resolve(input) {
        const cached = this.resolutionsByInputHash.get(input.hash);
        if (cached !== undefined)
            return cached;
        const resolution = this.buildResolution(input);
        this.resolutionsByInputHash.set(input.hash, resolution);
        return resolution;
    }
    buildResolution(input) {
        const walkContext = WalkState.new({ context: this, input });
        const allResolutions = Array.from(walkContext.next()).map(state => {
            return {
                resolution: state.asResolution(),
                nbrOfDefaultFormulas: Array.from(state.activatedFormulas.formulas).reduce((count, formula) => state.formulaIsDefault(formula) ? count + 1 : count, 0),
                unCoveredInputWeight: state.unCoveredInputWeight()
            };
        });
        allResolutions.sort((res1, res2) => {
            if (res1.unCoveredInputWeight < res2.unCoveredInputWeight)
                return -1;
            if (res1.unCoveredInputWeight > res2.unCoveredInputWeight)
                return 1;
            return res2.nbrOfDefaultFormulas - res1.nbrOfDefaultFormulas;
        });
        if (allResolutions.length > 0)
            return allResolutions[0].resolution;
        else
            debugger;
    }
}
export var VariableInputState;
(function (VariableInputState) {
    VariableInputState[VariableInputState["NoInput"] = 0] = "NoInput";
    VariableInputState[VariableInputState["HasPreviousValue"] = 1] = "HasPreviousValue";
    VariableInputState[VariableInputState["HasProposedValue"] = 2] = "HasProposedValue";
    VariableInputState[VariableInputState["KeepIfPossible"] = 4] = "KeepIfPossible";
})(VariableInputState || (VariableInputState = {}));
export class CycleResolutionInput extends Base {
    constructor() {
        super(...arguments);
        this.context = undefined;
        this.input = undefined;
        this.$hash = '';
    }
    get hash() {
        if (this.$hash !== '')
            return this.$hash;
        return this.$hash = this.buildHash();
    }
    get description() { return this.context.description; }
    get resolution() {
        return this.context.resolve(this);
    }
    initialize(...args) {
        super.initialize(...args);
        validateRequiredProperties(this);
        this.input = new Map(CI(this.description.variables).map(variable => [variable, VariableInputState.NoInput]));
    }
    buildHash() {
        return String.fromCharCode(...CI(this.description.variables).inBatchesBySize(5).map(batch => this.batchToCharCode(batch)));
    }
    batchToCharCode(batch) {
        return batch.reduceRight((charCode, variable, index) => charCode | (this.input.get(variable) << index * 3), 0);
    }
    addProposedValueFlag(variable) {
        if (DEBUG) {
            if (!this.description.variables.has(variable))
                throw new Error('Unknown variable');
            if (this.$hash !== '')
                throw new Error('Already hashed');
        }
        const input = this.input.get(variable);
        this.input.set(variable, input | VariableInputState.HasProposedValue);
    }
    hasProposedValue(variable) {
        return Boolean(this.input.get(variable) & VariableInputState.HasProposedValue);
    }
    hasProposedValueVars() {
        return CI(this.description.variables).filter(variable => this.hasProposedValue(variable));
    }
    addPreviousValueFlag(variable) {
        if (DEBUG) {
            if (!this.description.variables.has(variable))
                throw new Error('Unknown variable');
            if (this.$hash !== '')
                throw new Error('Already hashed');
        }
        const input = this.input.get(variable);
        this.input.set(variable, input | VariableInputState.HasPreviousValue);
    }
    hasPreviousValue(variable) {
        return Boolean(this.input.get(variable) & VariableInputState.HasPreviousValue);
    }
    hasPreviousValueVars() {
        return CI(this.description.variables).filter(variable => this.hasPreviousValue(variable));
    }
    addKeepIfPossibleFlag(variable) {
        if (DEBUG) {
            if (!this.description.variables.has(variable))
                throw new Error('Unknown variable');
            if (this.$hash !== '')
                throw new Error('Already hashed');
        }
        const input = this.input.get(variable);
        this.input.set(variable, input | VariableInputState.KeepIfPossible);
    }
    keepIfPossible(variable) {
        return Boolean(this.input.get(variable) & VariableInputState.KeepIfPossible);
    }
    keepIfPossibleVars() {
        return CI(this.description.variables).filter(variable => this.keepIfPossible(variable));
    }
}
__decorate([
    required
], CycleResolutionInput.prototype, "context", void 0);
export class WalkState extends Base {
    constructor() {
        super(...arguments);
        this.context = undefined;
        this.input = undefined;
        this.previous = undefined;
        this.activatedFormula = undefined;
        this.$activatedFormulas = undefined;
    }
    get activatedFormulas() {
        if (this.$activatedFormulas !== undefined)
            return this.$activatedFormulas;
        const cache = FormulasCache.new({
            variables: this.description.variables,
            formulas: CI(this.thisAndPreviousStates()).map(state => state.activatedFormula).toSet()
        });
        return this.$activatedFormulas = cache;
    }
    get description() { return this.context.description; }
    *thisAndPreviousStates() {
        let current = this;
        while (current && current.activatedFormula) {
            yield current;
            current = current.previous;
        }
    }
    formulaHasProposedValueInInput(formula) {
        return Array.from(formula.inputs).some(variable => this.input.hasProposedValue(variable));
    }
    unCoveredInputWeight() {
        const proposedVars = map(this.input.hasProposedValueVars(), variable => { return { variable, isProposed: true }; });
        const keepIfPossibleVars = map(this.input.keepIfPossibleVars(), variable => { return { variable, isProposed: false }; });
        const allInputVars = CI([proposedVars, keepIfPossibleVars]).concat().uniqueOnlyBy(el => el.variable);
        return allInputVars.reduce((totalWeight, { variable, isProposed }) => {
            let weight = 0;
            const isOverwrittenByFormulas = this.activatedFormulas.formulasByOutput.get(variable);
            if (isOverwrittenByFormulas) {
                const formula = isOverwrittenByFormulas.size === 1 ? Array.from(isOverwrittenByFormulas)[0] : null;
                if (formula && this.formulaIsDefault(formula) && this.formulaHasProposedValueInInput(formula)) {
                    if (isProposed)
                        weight += 1e6;
                    else
                        weight += 1e4;
                }
                else {
                    if (isProposed)
                        weight += 1e7;
                    else
                        weight += 1e5;
                }
            }
            const usedInFormulas = this.activatedFormulas.formulasByInput.get(variable);
            if (!(usedInFormulas && usedInFormulas.size > 0)) {
                if (isProposed)
                    weight += 1e3;
                else
                    weight += 1e2;
            }
            return totalWeight + weight;
        }, 0);
    }
    preferFormula(formula1, formula2) {
        const allInputsHasProposed1 = this.formulaAllInputsHasProposed(formula1);
        const allInputsHasProposed2 = this.formulaAllInputsHasProposed(formula2);
        if (allInputsHasProposed1 && !allInputsHasProposed2)
            return -1;
        if (allInputsHasProposed2 && !allInputsHasProposed1)
            return 1;
        const countInputsWithProposedOrKeep1 = this.formulaCountInputsWithProposedOrKeep(formula1);
        const countInputsWithProposedOrKeep2 = this.formulaCountInputsWithProposedOrKeep(formula2);
        if (countInputsWithProposedOrKeep1 > countInputsWithProposedOrKeep2)
            return -1;
        if (countInputsWithProposedOrKeep1 < countInputsWithProposedOrKeep2)
            return 1;
        if (this.formulaIsDefault(formula1) && !this.formulaIsDefault(formula2))
            return -1;
        if (this.formulaIsDefault(formula2) && !this.formulaIsDefault(formula1))
            return 1;
        return 0;
    }
    formulaIsDefault(formula) {
        return this.context.defaultResolutionFormulas.has(formula);
    }
    formulaCountInputsWithProposedOrKeep(formula) {
        let count = 0;
        Array.from(formula.inputs).forEach(variable => {
            if (this.input.hasProposedValue(variable) || this.input.keepIfPossible(variable))
                count++;
        });
        return count;
    }
    formulaAllInputsHasProposedOrKeep(formula) {
        return Array.from(formula.inputs).every(variable => this.input.hasProposedValue(variable) || this.input.keepIfPossible(variable));
    }
    formulaAllInputsHasProposed(formula) {
        return Array.from(formula.inputs).every(variable => this.input.hasProposedValue(variable));
    }
    formulaIsApplicable(formula) {
        const everyFormulaInputHasValue = Array.from(formula.inputs).every(variable => this.input.hasProposedValue(variable)
            || this.input.hasPreviousValue(variable)
            || this.activatedFormulas.formulasByOutput.has(variable));
        const cache = FormulasCache.new({ formulas: new Set(this.activatedFormulas.formulas) });
        cache.add(formula);
        return everyFormulaInputHasValue && !cache.isCyclic();
    }
    formulaIsInsignificant(formula) {
        const outputVariableAlreadyCalculated = this.activatedFormulas.formulasByOutput.has(formula.output);
        const outputVariableHasPreviousValue = this.input.hasPreviousValue(formula.output);
        return outputVariableAlreadyCalculated
            || outputVariableHasPreviousValue && Array.from(formula.inputs).some(variable => !this.input.hasPreviousValue(variable) && !this.input.hasProposedValue(variable));
    }
    unvisitedFormulas() {
        return Array.from(this.description.formulas).filter(formula => !this.activatedFormulas.has(formula));
    }
    *next() {
        const unvisitedFormulas = this.unvisitedFormulas();
        unvisitedFormulas.sort(this.preferFormula.bind(this));
        let isFinal = true;
        for (const formula of unvisitedFormulas) {
            if (!this.formulaIsApplicable(formula) || this.formulaIsInsignificant(formula))
                continue;
            const nextState = WalkState.new({
                previous: this,
                context: this.context,
                input: this.input,
                activatedFormula: formula
            });
            yield* nextState.next();
            isFinal = false;
        }
        if (isFinal)
            yield this;
    }
    asResolution() {
        return new Map(CI(this.description.variables).map(variable => {
            const formulas = this.activatedFormulas.formulasByOutput.get(variable);
            if (formulas) {
                for (const firstFormula of formulas) {
                    return [variable, firstFormula.formulaId];
                }
            }
            return [variable, CalculateProposed];
        }));
    }
}
