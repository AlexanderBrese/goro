const Second = 1000;
const Minute = 60;

export class Counting {
  constructor(duration, onChange, onFinish) {
    this.duration = duration * Minute;
    this.elapsed = 0 * Second;
    this.counter = null;
    this.onFinish = onFinish;
    this.onChange = onChange;
  }

  resume() {
    this.counter = setInterval(() => {
      if (this.elapsed >= this.duration) {
        this.finish();
        return;
      }
      this.elapsed++;

      this.onChange(this.elapsed);
    }, Second);
  }

  pause() {
    clearInterval(this.counter);
  }

  finish() {
    this.pause();
    this.onFinish();
  }
}
