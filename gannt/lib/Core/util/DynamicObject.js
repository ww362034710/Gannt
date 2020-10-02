import Base from '../Base.js';
import ObjectHelper from '../helper/ObjectHelper.js';

// Remove this once https://github.com/eslint/eslint/issues/12822 is address (allowing "foo?.bar()" to be accepted):
/* eslint-disable no-unused-expressions */

/**
 * @module Core/util/DynamicObject
 */

/**
 * This class is used to manage configuration-defined properties of an object.
 * @internal
 */
export default class DynamicObject extends Base {
    static get configurable() {
        return {
            /**
             * Set to `true` to allow configs for members to contain a `type` property. By default, the name of the
             * member is used for the type.
             * @config {Boolean}
             * @default
             */
            allowType : false,

            /**
             * Optional function to call as instances are created. Each new instance is passed to this function.
             * @param {Object} instance The newly created instance.
             * @param {String} key The property name in the Dynamic object by which the new instance may be referenced.
             * @config {Function}
             */
            created : null,

            /**
             * The {@link Core.mixin.Factoryable factory} to use to create instances.
             * @config {Object}
             */
            factory : null,

            /**
             * The owning object to pass along to the instances as the `ownerName` property.
             * @config {Object}
             */
            owner : null,

            /**
             * The property name by which to store the `owner` on each instance.
             * @config {String}
             */
            ownerName : null,

            /**
             * Optional function that will be passed a config object prior to instantiating an object. This function
             * can either modify the passed object or return a new object.
             * @param {Object} config The config object used to create the object
             * @param {String} key The property name in the Dynamic object by which the new instance may be referenced.
             * @config {Function}
             */
            setup : null
        };
    }

    construct(config) {
        /**
         * This object holds the actual instances that are retrieved by the dynamic accessor.
         * @member {Object} instances
         */
        this.instances = {};

        /**
         * The object that contains the dynamic accessors for each instance.
         * @member {Object} object
         */
        this.object = {};

        super.construct(config);
    }

    /**
     * Adds the get/set accessor to our `object`.
     * @param {String} name
     * @param {Object|String} config
     * @private
     */
    defineAccessor(name, config) {
        const
            { allowType, created, factory, instances, object, owner, ownerName, setup } = this,
            { typeKey } = factory.factoryable,
            prepConfig = cfg => {
                cfg = (cfg === true) ? {} : ObjectHelper.assign({}, cfg);  // copy props even from prototype

                // Set the "type" property of the config to key in the "features" object:
                cfg[typeKey] = allowType ? cfg[typeKey] || name : name;

                // Store this object as the "owner" on the config object so instances can access their creating object:
                if (ownerName) {
                    cfg[ownerName] = owner;
                }

                cfg = setup?.(cfg, name) || cfg;

                cfg.beforeConfigure = instance => {
                    // Ensure the feature is injected into the features object before initialization so that it is
                    // available to call chains from its initialization.
                    instances[name] = instance;
                };

                return cfg;
            };

        config = prepConfig(config);

        // We provide get/set access on the features object and use this position to ensure the instance is initially
        // created when first required, as well as reconfigured on assignment.
        Reflect.defineProperty(object, name, {
            configurable : true,
            enumerable   : true,

            get() {
                if (!instances[name] && config) {
                    const instance = instances[name] = factory.create(config, owner);

                    created?.(instance, name);

                    config = null;
                }

                return instances[name];
            },

            set(cfg) {
                if (cfg) {
                    cfg = prepConfig(cfg);

                    if (config) {
                        cfg = ObjectHelper.merge(config, cfg);
                    }
                }

                config = null;

                const
                    was = instances[name],
                    instance = factory.reconfigure(was, cfg || null, owner);

                if (instance !== was) {
                    instances[name] = instance;

                    instance && created?.(instance);
                }
            }
        });
    }

    /**
     * Ensures that all instances are touched (to trigger their creation).
     * @internal
     */
    flush() {
        for (const name in this.object) {
            this.touch(name);
        }
    }

    /**
     * Updates the members of `object` based on the provided configuration.
     * @param {Object} members The configuration for the instances of `object`.
     */
    update(members) {
        const { object } = this;

        let name, config;

        if (members) {
            // We prime the features so that if any configuration code accesses a feature, it will self initialize,
            // but if not, they will remain in a primed state until afterConfigure.
            for (name in members) {
                config = members[name];

                if (config) {
                    if (name in object) {
                        object[name] = config;
                    }
                    else {
                        this.defineAccessor(name, config);
                    }
                }
                else if (name in object) {
                    object[name] = null;

                    delete object[name];
                }
            }

            // NOTE: we leave alone any existing features that were not present in the given object. To remove a
            // feature, you must set it to null or set all features to null.
        }
        else {
            for (name in object) {
                object[name] = null;

                delete object[name];
            }
        }

        return object;
    }

    /**
     * Access a single member of `object` (to trigger its creation). This is its own method to avoid transpiler issues
     * with simply accessing a property but not using its value.
     * @param {String} name The member name to touch.
     * @returns {*}
     */
    touch(name) {
        return this.object[name];
    }
}
