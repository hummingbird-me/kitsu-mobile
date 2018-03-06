/**
 * A helper class for keeping redux library state in sync
 */
class _KitsuLibrary {
  constructor() {
    this.handlers = [];
  }

  subscribe(event, handler) {
    const eventHandler = { event, handler };
    this.handlers.push(eventHandler);

    // Return the unsubscribe function
    return () => {
      const index = this.handlers.indexOf(eventHandler);
      if (index > -1) {
        this.handlers.splice(index, 1);
      }
    };
  }

  publish(event, ...args) {
    this.handlers.forEach((eventHandler) => {
      if (eventHandler.event === event) {
        eventHandler.handler(...args);
      }
    });
  }
}

_KitsuLibrary.EVENTS = {
  LIBRARY_ENTRY_UPDATE: 'library-entry-update',
  LIBRARY_ENTRY_DELETE: 'library-entry-delete',
  LIBRARY_ENTRY_CREATE: 'library-entry-create',
};

export const KitsuLibrary = new _KitsuLibrary();
