
/**
 * Library sort options
 */
export class KitsuLibrarySort {
  static get DATE_UPDATED() {
    return 'updated_at';
  }

  static get DATE_PROGRESSED() {
    return 'progressed_at';
  }

  static get DATE_STARTED() {
    return 'started_at';
  }

  static get DATE_FINSIHED() {
    return 'finished_at';
  }

  static get DATE_ADDED() {
    return 'created_at';
  }

  static get PROGRESS() {
    return 'progress';
  }

  static get RATING() {
    return 'rating';
  }

  static get TITLE() {
    return 'title';
  }

  static get LENGTH() {
    return 'length';
  }

  static get POPULARITY() {
    return 'popularity';
  }

  static get AVERAGE_RATING() {
    return 'average';
  }
}

/**
 * Events of the library
 */
export class KitsuLibraryEvents {
  static get LIBRARY_ENTRY_CREATE() {
    return 'library-entry-create';
  }

  static get LIBRARY_ENTRY_UPDATE() {
    return 'library-entry-update';
  }

  static get LIBRARY_ENTRY_DELETE() {
    return 'library-entry-delete';
  }
}

/**
 * Sources of the library events
 */
export class KitsuLibraryEventSource {
  static get STORE() {
    return 'store';
  }

  static get QUICK_UPDATE() {
    return 'quickupdate';
  }

  static get MEDIA_PAGE() {
    return 'mediapage';
  }
}

/**
 * A helper class for keeping redux library state in sync
 */
class _KitsuLibrary {
  constructor() {
    this.handlers = [];
  }

  /**
   * Subscribe to a library event.
   *
   * @param {any} event The event to subscribe to. Can find them in `KitsuLibraryEvents` class.
   * @param {any} handler The handler function which takes in 1 argument.
   * @returns The unsubscribe function.
   */
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

  /**
   * Publish an event.
   *
   * @param {any} event The event to publish
   * @param {any} args An argument.
   */
  publish(event, args) {
    this.handlers.forEach((eventHandler) => {
      if (eventHandler.event === event) {
        eventHandler.handler(args);
      }
    });
  }

  /**
   * Publish Library entry create event.
   *
   * @param {any} entry The library entry that was created.
   * @param {string} libraryType The type of library. `anime` or `manga`.
   * @param {string} source The source of the event.
   */
  onLibraryEntryCreate(entry, libraryType, source = null) {
    this.publish(KitsuLibraryEvents.LIBRARY_ENTRY_CREATE, {
      id: entry.id,
      status: entry.status,
      type: libraryType,
      entry,
      source,
    });
  }

  /**
   * Publish Library entry update event.
   *
   * @param {any} oldEntry The old library entry.
   * @param {any} newEntry The updated library entry.
   * @param {string} libraryType The type of library. `anime` or `manga`.
   * @param {string} source The source of the update.
   */
  onLibraryEntryUpdate(oldEntry, newEntry, libraryType, source = null) {
    if (!oldEntry || !newEntry) return;

    // Make sure the needed relationship values are not overridden
    const combined = newEntry;
    if (!combined.anime) combined.anime = oldEntry.anime;
    if (!combined.manga) combined.manga = oldEntry.manga;
    if (!combined.user) combined.user = oldEntry.user;

    // Only combine unit if progress are same, otherwise they'll be different.
    if (oldEntry.progress === newEntry.progress) {
      if (!combined.unit) combined.unit = oldEntry.unit;
      if (!combined.nextUnit) combined.nextUnit = oldEntry.nextUnit;
    }

    this.publish(KitsuLibraryEvents.LIBRARY_ENTRY_UPDATE, {
      id: newEntry.id,
      type: libraryType,
      oldEntry,
      newEntry: combined,
      source,
    });
  }

  /**
   * Publish Library entry delete event.
   *
   * @param {number} id The id of the library entry that was deleted
   * @param {string} libraryType The type of the library. `anime` or `manga`.
   * @param {string} libraryStatus The status of the library entry.
   * @param {string} source The source of the delete.
   */
  onLibraryEntryDelete(id, libraryType, libraryStatus, source = null) {
    this.publish(KitsuLibraryEvents.LIBRARY_ENTRY_DELETE, {
      id,
      type: libraryType,
      status: libraryStatus,
      source,
    });
  }
}

export const KitsuLibrary = new _KitsuLibrary();
