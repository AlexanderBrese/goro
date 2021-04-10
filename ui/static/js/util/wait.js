const DefaultWaitTime = 800

export function wait(ms = DefaultWaitTime) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
