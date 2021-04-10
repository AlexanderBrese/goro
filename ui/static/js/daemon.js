export class Daemon {
  constructor() {
    this.notificationButton = document.getElementById("notification");
  }

  start() {
    this.onSetNotification();
    window.addEventListener(
      "load",
      async () => await this.registerServiceWorker()
    );
  }

  onSetNotification() {
    this.notificationButton.addEventListener("click", async (ev) => {
      console.log(ev);
      if (ev.target.value) {
        await this.subscribe();
      } else {
        await this.unsubscribe();
      }
    });
  }

  async registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      await navigator.serviceWorker.register("./util/service-worker.js");
      await this.init();
    } else {
      console.warn("Service workers aren't supported in this browser.");
    }
  }

  async init() {
    if (!("showNotification" in ServiceWorkerRegistration.prototype)) {
      console.warn("Notifications aren't supported.");
      return;
    }

    if (Notification.permission === "denied") {
      console.warn("The user has blocked notifications.");
      return;
    }

    if (!("PushManager" in window)) {
      console.warn("Push messaging isn't supported.");
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    let subscription;

    try {
      subscription = await registration.pushManager.getSubscription();
      this.enableNotifications();

      if (!subscription) return;
    } catch (e) {
      console.error("Error during getSubscription()", e);
    }
  }

  async subscribe() {
    this.disableNotifications();

    const registration = await navigator.serviceWorker.ready;
    let subscription;
    try {
      subscription = await registration.pushManager.subscribe();
      this.enableNotifications();

      this.storeSubscription();
    } catch (e) {
      if (Notification.permission === "denied") {
        console.warn("Permission for Notifications was denied");
        this.disableNotifications();
      } else {
        console.error("Unable to subscribe to push.", e);
        this.enableNotifications();
      }
    }
  }

  async unsubscribe() {
    let registration = await navigator.serviceWorker.ready;
    let subscription;
    try {
      subscription = await registration.pushManager.getSubscription();
    } catch (e) {
      console.error("Error thrown while unsubscribing from push messaging.", e);
    }

    if (!subscription) {
      this.enableNotifications();
      return;
    }

    this.removeSubscription(subscription.subscriptionId);

    try {
      await subscription.unsubscribe();
      this.enableNotifications();
    } catch (e) {
      console.error("Failed unsubscribing the service worker: ", e);
      this.enableNotifications();
    }
  }

  enableNotifications() {
    this.notificationButton.disabled = false
  }

  disableNotifications() {
    this.notificationButton.disabled = true
  }

  // TODO: remove subscription id from the storage
  removeSubscription(subscriptionId) {}

  storeSubscription() {}
}
