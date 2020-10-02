import { AnyConstructor, Mixin } from '../../../../ChronoGraph/class/BetterMixin.js'
import { generic_field } from '../../../../ChronoGraph/replica/Entity.js'
import { ModelReferenceField, injectStaticFieldsProperty } from '../../../chrono/ModelFieldAtom.js'
import { ChronoPartOfProjectModelMixin } from '../mixin/ChronoPartOfProjectModelMixin.js'
import { BaseResourceMixin } from './BaseResourceMixin.js'
import { BaseHasAssignmentsMixin } from './BaseHasAssignmentsMixin.js'

/**
 * Base assignment model class. It just contains references to the [[BaseEventMixin|event]] and [[BaseResourceMixin|resource]] being assigned.
 */
export class BaseAssignmentMixin extends Mixin(
    [ ChronoPartOfProjectModelMixin ],
    (base : AnyConstructor<ChronoPartOfProjectModelMixin, typeof ChronoPartOfProjectModelMixin>) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class BaseAssignmentMixin extends base {
        /**
         * An [[HasAssignmentsMixin|event]] being assigned
         */
        @generic_field(
            {
                bucket           : 'assigned',
                resolver         : function (id) { return this.getEventById(id) },
                modelFieldConfig : {
                    persist : false
                }
            },
            ModelReferenceField
        )
        event      : BaseHasAssignmentsMixin

        /**
         * A [[BaseResourceMixin|resource]] being assigned
         */
        @generic_field(
            {
                bucket           : 'assigned',
                resolver         : function (id) { return this.getResourceById(id) },
                modelFieldConfig : {
                    persist : false
                }
            },
            ModelReferenceField
        )
        resource    : BaseResourceMixin
    }

    // inject "fields" getter override to apply "modelFieldConfig" to "event" & "resource" fields
    injectStaticFieldsProperty(BaseAssignmentMixin)

    return BaseAssignmentMixin
}){}
