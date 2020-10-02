import Base from './Base.js';
import Events from './mixin/Events.js';

const
    GlobalEvents = (window.bryntum || (window.bryntum = {})).GlobalEvents = new (class extends Events(Base) {
        suspendFocusEvents() {
            focusEventsSuspended = true;
        }

        resumeFocusEvents() {
            focusEventsSuspended = false;
        }

        get lastInteractionType() {
            return lastInteractionType;
        }
    })(),
    isTopVisibleModal = w => w.isVisible && w.isTopModal;

let globaltouchStart,
    focusEventsSuspended = false,
    lastInteractionType;

function createWidgetEvent(eventName, target, relatedTarget, fromWidget, toWidget, backwards, options) {
    const result = new CustomEvent(eventName, options);

    Object.defineProperty(result, 'target', {
        get() {
            return target;
        }
    });
    Object.defineProperty(result, 'relatedTarget', {
        get() {
            return relatedTarget;
        }
    });
    result.fromWidget = fromWidget;
    result.toWidget = toWidget;
    result.backwards = backwards;

    return result;
}

function getCommonAncestor(from, to) {
    if (from === to) {
        return from;
    }
    const isWidget = from instanceof GlobalEvents.Widget;

    while (from && !(from[isWidget ? 'owns' : 'contains'](to) || from === to)) {
        from = from[isWidget ? 'owner' : 'parentNode'];
    }
    return from;
}

// This is imported by EventHelper and that makes the call to set up the listeners
function setupFocusListeners(element = document, EventHelper) {
    const listeners = {
        element,
        touchstart(touchstart) {
            if (!globaltouchStart && touchstart.changedTouches.length === 1) {
                globaltouchStart = touchstart.changedTouches[0];
            }
            else {
                globaltouchStart = null;
            }
        },
        // Just this one has to be passive: false so that we are allowed to preventDefault
        // if we are part of a contextmenu longpres emulation. Otherwise the gesture will
        // proceed to cause a mousedown event.
        touchend : {
            handler : event => {
                if (globaltouchStart) {
                    // If the touchstart was used to synthesize a contextmenu event
                    // stop the touch gesture processing right now.
                    // Also prevent the conversion of the touch into  click.
                    if (globaltouchStart.identifier === EventHelper.contextMenuTouchId) {
                        event.stopImmediatePropagation();
                        event.preventDefault();
                    }
                    else if (event.changedTouches.length === 1 && event.changedTouches[0].identifier === globaltouchStart.identifier) {
                        GlobalEvents.trigger('globaltap', { event });
                    }
                    globaltouchStart = null;
                }
            },
            passive : false
        },
        mousedown : {
            handler : event => {
                lastInteractionType = 'mouse';
                if (!globaltouchStart) {
                    GlobalEvents.trigger('globaltap', { event });
                }
            },
            passive : false
        },
        keydown() {
            lastInteractionType = 'key';
        },
        keypress() {
            lastInteractionType = 'key';
        },
        focusin(focusin) {
            // https://app.assembla.com/spaces/bryntum/tickets/5503
            // Caused by the browser scrolling a focused element into view. The browser will do *whatever it takes*
            // to scroll a focused element so that as much of it is in view as possible. Its first point of scrolling will
            // be the float containing element. That must never scroll.
            GlobalEvents.Widget.floatRoot.scrollTop = GlobalEvents.Widget.floatRoot.scrollLeft = 0;
    
            if (focusEventsSuspended) {
                return;
            }
    
            const
                fromElement = !focusin.relatedTarget
                    ? null
                    : (focusin.relatedTarget instanceof HTMLElement ? focusin.relatedTarget : document.body),
                toElement = focusin.target || document.body,
                fromWidget = GlobalEvents.Widget.fromElement(fromElement),
                toWidget = GlobalEvents.Widget.fromElement(toElement),
                commonAncestor = getCommonAncestor(fromWidget, toWidget),
                // Flag if the fromElement is DOCUMENT_POSITION_FOLLOWING toElement
                backwards = !!(fromElement && (toElement.compareDocumentPosition(fromElement) & 4)),
                topVisibleModal = GlobalEvents.Widget.query(isTopVisibleModal),
                currentFocus = document.activeElement;
    
            // If there is a topmost modal, and the focus is moving to somewhere *not* a descendant of that
            // modal then we enforce modality and sweep focus back into the modal. By default the Container
            // class will yield the first focusable descendant widget's focusEl as its focusEl, so
            // that will be out of the box behaviour for Popups.
            if (topVisibleModal && (!toWidget || !topVisibleModal.owns(toWidget))) {
                topVisibleModal.focus();
                return;
            }
    
            let event = createWidgetEvent('focusout', fromElement, focusin.target, fromWidget, toWidget, backwards);
    
            // Bubble focusout event up the "from" side of the tree
            for (let target = fromWidget; target && target !== commonAncestor; target = target.owner) {
                if (!(target.isDestroyed || target.isDestroying) && target.onFocusOut) {
                    target.onFocusOut(event);
    
                    // It is possible for focusout handlers to refocus themselves (editor's invalidAction='block'), so
                    // check if the focus is still where it was when we started unless we are in a document
                    // loss of focus situation (no target)
                    if (focusin.target && currentFocus !== document.activeElement) {
                        // If the focus has moved, that movement would have kicked off a nested sequence of focusin/out
                        // notifications, so everyone has already been notified... no more to do here.
                        return;
                    }
                }
            }
    
            // Focus is moving upwards to the ancestor widget.
            // Its focus method might delegate focus to a focusable descendant.
            if (commonAncestor && focusin.target === commonAncestor.element) {
                // If one of the handlers above has not moved focus onwards
                // and the common ancestor is a container which delegates
                // focus inwards to a descendant, then give it the opportunity to do that.
                if (document.activeElement === toElement && commonAncestor.focusElement && commonAncestor.focusElement !== commonAncestor.element) {
                    // Wait until out of the focusin handler to move focus on.
                    commonAncestor.setTimeout(() => commonAncestor.focus && commonAncestor.focus(), 0);
                }
            }
            // Focus is moving between two branches of a subtree.
            // Bubble focusin event up the "to" side of the tree
            else {
                event = createWidgetEvent('focusin', toElement, fromElement, fromWidget, toWidget, backwards);
                for (let target = toWidget; target && target !== commonAncestor; target = target.owner) {
                    if (!(target.isDestroyed || target.isDestroying)) {
                        target.onFocusIn && target.onFocusIn(event);
                    }
                }
            }
            // Fire element focusmove event. Grid navigation will use  this when cells are focusable.
            const commonAncestorEl = getCommonAncestor(fromElement && fromElement.nodeType === 1 ? fromElement : null, toElement) || toElement.parentNode;
            event = createWidgetEvent('focusmove', toElement, fromElement, fromWidget, toWidget, backwards, { bubbles : true });
            commonAncestorEl.dispatchEvent(event);
        },
        focusout(focusout) {
            if (focusEventsSuspended) {
                return;
            }
    
            if (!focusout.relatedTarget || !GlobalEvents.Widget.fromElement(focusout.relatedTarget)) {
                listeners.focusin({
                    target        : focusout.relatedTarget,
                    relatedTarget : focusout.target
                });
            }
        },
        capture : true,
        passive : true
    };
    EventHelper.on(listeners);
}

export { GlobalEvents as default, setupFocusListeners };
