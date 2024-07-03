class Timer {
  constructor() {
    this.tids = [];
  }

  start(cb, delay) {
    const tid = setTimeout(cb, delay);
    this.tids.push(tid);
  }

  clear() {
    clearTimeout(this.tids.pop());
  }

  clearAll() {
    this.tids.map(tid => clearTimeout(tid));
    this.tids = [];
  }
}

const getTimer = () => new Timer();

export { getTimer };
