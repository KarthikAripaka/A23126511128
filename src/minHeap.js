class MinHeap {
  constructor(compareFn) {
    this.heap = [];
    this.compare = compareFn || ((a, b) => a < b ? -1 : a > b ? 1 : 0);
  }

  get size() {
    return this.heap.length;
  }

  peek() {
    return this.heap[0];
  }

  push(value) {
    this.heap.push(value);
    this._siftUp(this.heap.length - 1);
  }

  pop() {
    if (this.size === 0) return undefined;
    const root = this.heap[0];
    const last = this.heap.pop();
    if (this.size > 0) {
      this.heap[0] = last;
      this._siftDown(0);
    }
    return root;
  }

  _siftUp(idx) {
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      if (this.compare(this.heap[idx], this.heap[parentIdx]) >= 0) break;
      [this.heap[idx], this.heap[parentIdx]] = [this.heap[parentIdx], this.heap[idx]];
      idx = parentIdx;
    }
  }

  _siftDown(idx) {
    const length = this.size;
    while (true) {
      let smallest = idx;
      const left = 2 * idx + 1;
      const right = 2 * idx + 2;

      if (left < length && this.compare(this.heap[left], this.heap[smallest]) < 0) smallest = left;
      if (right < length && this.compare(this.heap[right], this.heap[smallest]) < 0) smallest = right;

      if (smallest === idx) break;
      [this.heap[idx], this.heap[smallest]] = [this.heap[smallest], this.heap[idx]];
      idx = smallest;
    }
  }

  toSortedArray() {
    const result = [];
    while (this.size > 0) {
      result.push(this.pop());
    }
    return result;
  }
}

export default MinHeap;
