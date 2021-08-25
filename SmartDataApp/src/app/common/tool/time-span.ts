export class TimeSpan {
  nextRefreshTime: Date;
  interval: number;
  timeElasped: () => void;
  raise() {
    if (this.timeElasped) this.timeElasped();
  }
  handle?: NodeJS.Timer;
  onInterval?: () => void;
  stop() {
    if (this.handle) {
      clearInterval(this.handle);
      this.handle = undefined;
    }
  }
  run() {
    if (this.onInterval) {
      this.handle = setInterval(this.onInterval, this.interval * 1000);
    }
  }
}
