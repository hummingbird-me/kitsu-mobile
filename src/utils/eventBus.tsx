/**
 * A helper class for delivering messages/events across the app
 */
export class _EventBus {
  constructor() {
    this.handlers = [];
  }

  /**
   * Subscribe to a library event.
   *
   * @param {string} event The event to subscribe to.
   * @param {function} handler The handler function which takes in 1 argument.
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
   * @param {string} event The event to publish
   * @param {any} args An argument.
   */
  publish(event, args) {
    this.handlers.forEach((eventHandler) => {
      if (eventHandler.event === event) {
        eventHandler.handler(args);
      }
    });
  }
}

export const EventBus = new _EventBus();
