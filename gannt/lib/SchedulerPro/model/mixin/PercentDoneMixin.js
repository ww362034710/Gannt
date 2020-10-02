/**
 * @module SchedulerPro/model/mixin/PercentDoneMixin
 */

/**
 * PercentDone mixin to get the current status of a task.
 * @mixin
 */
export default Target => class PercentDoneMixin extends Target {

    /**
     * The current status of a task, expressed as the percentage completed (integer from 0 to 100)
     * @field {Number} percentDone
     */
    // Field defined in Engine

    /**
     * Indicates if the task is started (its {@link #field-percentDone percent completion} is greater than zero).
     * @return {Boolean} `true` if the task is started.
     */
    get isStarted() {
        return this.percentDone > 0;
    }

    /**
     * Indicates if the task is complete (its {@link #field-percentDone percent completion} is 100% (or greater)).
     * @return {Boolean} `true` if the task is completed.
     */
    get isCompleted() {
        return this.percentDone >= 100;
    }

    /**
     * Indicates if the task is in progress (its {@link #field-percentDone percent completion} is greater than zero and less than 100%).
     * @return {Boolean} `true` if the task is in progress.
     */
    get isInProgress() {
        return this.isStarted && !this.isCompleted;
    }

    // Reset % done value when copying a task
    copy() {
        const copy = super.copy(...arguments);

        copy.percentDone = 0;

        return copy;
    }

    get renderedPercentDone() {
        const value = typeof this.percentDone === 'number' && !isNaN(this.percentDone) ? this.percentDone : 0;

        if (value <= 99) {
            return Math.round(value);
        }

        return Math.floor(value);
    }

    set renderedPercentDone(value) {
        this.percentDone = value;
    }
};
