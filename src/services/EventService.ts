import EventEmitter from "events";

class EventService {
  private eventEmitter;
  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  emit(eventName: string, data) {
    this.eventEmitter.emit(eventName, data);
  }

  on(eventName: string, callback) {
    this.eventEmitter.on(eventName, callback);
  }
}

export default EventService;
