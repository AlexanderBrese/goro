export class Routing {
  constructor(routes, routeHandlers, userStorage) {
    this.routes = routes;
    this.routeHandlers = routeHandlers;
    this.userStorage = userStorage;
  }

  start() {
    const currentRoute = this.currentRoute();
    if (Object.values(this.routes).some((route) => route === currentRoute)) {
      this.routeHandlers[currentRoute](this.userStorage);
      return
    }
    console.log(`route: ${currentRoute} not found.`);
  }

  currentRoute() {
    return window.location.pathname;
  }
}
