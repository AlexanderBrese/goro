class Event {
  constructor(name) {
    this.name = name;
    this.callbacks = [];
  }

  registerCallback(callback) {
    this.callbacks.push(callback);
  }

  callAll(args) {
    this.callbacks.forEach((callback) => callback(args));
  }
}

export const Events = {
  START: "start",
  FINISH_POMODORO: "finishpomodoro",
  FINISH_BREAK: "finishbreak",
  GIVE_FEEDBACK: "givefeedback",
  NEW_SESSION: "newsession",
  UPDATE_TASK: "updatetask"
};

export function DefaultEventSystem() {
  const eventSystem = new EventSystem();
  Object.values(Events).forEach((ev) => eventSystem.register(ev));
  return eventSystem;
}

export class EventSystem {
  constructor() {
    this.events = {};
  }

  register(name) {
    const event = new Event(name);
    this.events[name] = event;
  }

  dispatch(name, args) {
    this.events[name].callAll(args);
  }

  listen(name, callback) {
    this.events[name].registerCallback(callback);
  }
}
