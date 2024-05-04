interface Task {
  executionTime: number;
  data: {
    userEmail: string;
    retry?: number;
  };
}

class TaskHeapService {
  private heap: Task[] = [];
  constructor() {
    this.heap = [];
  }

  insert(task: Task) {
    this.heap.push(task);
    this.bubbleUp(this.heap.length - 1);
  }

  bubbleUp = (index: number) => {
    if (index <= 0) {
      return;
    }

    const parentIndex = Math.floor((index - 1) / 2);

    if (this.heap[parentIndex].executionTime > this.heap[index].executionTime) {
      [this.heap[parentIndex], this.heap[index]] = [
        this.heap[index],
        this.heap[parentIndex],
      ];
      this.bubbleUp(parentIndex);
    }
  };

  bubbleDown = (index: number) => {
    const leftChildIndex = 2 * index + 1;
    const rightChildIndex = 2 * index + 2;
    let smallestIndex = index;

    if (
      leftChildIndex < this.heap.length &&
      this.heap[leftChildIndex].executionTime <
        this.heap[smallestIndex].executionTime
    ) {
      smallestIndex = leftChildIndex;
    }

    if (
      rightChildIndex < this.heap.length &&
      this.heap[rightChildIndex].executionTime <
        this.heap[smallestIndex].executionTime
    ) {
      smallestIndex = rightChildIndex;
    }

    if (smallestIndex !== index) {
      [this.heap[smallestIndex], this.heap[index]] = [
        this.heap[index],
        this.heap[smallestIndex],
      ];
      this.bubbleDown(smallestIndex);
    }
  };

  extractMin() {
    if (this.heap.length === 0) {
      return null;
    }

    if (this.heap.length === 1) {
      return this.heap.pop();
    }

    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown(0);
    return min;
  }

  search(userEmail) {
    return (
      this.heap.findIndex((item) => item.data.userEmail === userEmail) !== -1
    );
  }

  getLength() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  peek() {
    return this.heap[0];
  }
}

export default TaskHeapService;
