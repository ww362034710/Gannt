/**
 * @module Core/helper/IdHelper
 */

/**
 * IdHelper provides unique ID generation.
 *
 * This class is not intended for application use, it is used internally by the Bryntum infrastructure.
 * @internal
 */
export default class IdHelper {
    /**
     * Generate a new id, using IdHelpers internal counter and a prefix
     * @param {String} prefix Id prefix
     * @returns {String} Generated id
     */
    static generateId(prefix = 'generatedId') {
        // This produces "b-foo-1, b-foo-2, ..." for each prefix independently of the others. In other words, it makes
        // id's more stable since the counter is on a per-class basis.
        return prefix + (IdHelper.idCounts[prefix] = (IdHelper.idCounts[prefix] || 0) + 1);
    }
}

IdHelper.idCounts = {};
