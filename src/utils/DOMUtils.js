/**
 * Given an array of class names return only those that are true
 * @param  {Array} cnames Input classnames
 * @return {String}       Final classname
 */
export function classNames (...cnames) {
  return cnames.filter(Boolean).join(' ');
}

class DOMNodeScrollIntoViewQueue {
  constructor (delay) {
    this.delay = delay;
    this._queue = [];
  }

  enqueue (node, options = {}) {
    if (node) {
      this._queue.push({
        node,
        options
      });
      this._run();
    }
  }

  _run () {
    if (!this._queue.length) {
      return;
    }
    if (this._running) {
      return;
    }
    let { node, options } = this._queue.shift();
    this._running = true;
    setTimeout(() => {
      node.scrollIntoView(options);
      this._running = false;
      this._run();
    }, this.delay);
  }
}

export const nodeScrollIntoViewQueue = new DOMNodeScrollIntoViewQueue(100);
