interface Task {
  executionTime: number;
  data: any;
}

class TaskQueueService {
  private tasks: Task[];

  constructor() {
    this.tasks = [];
  }

  private binarySearchIndex(item: Task) {
    let low = 0;
    let high = this.tasks.length;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (this.tasks[mid].executionTime < item.executionTime) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return low;
  }

  enqueue(task: Task): void {
    const index = this.binarySearchIndex(task);
    this.tasks.splice(index, 0, task);
  }

  dequeue(): Task | undefined {
    return this.tasks.shift();
  }

  peek(): Task | undefined {
    return this.tasks[0];
  }

  isEmpty(): boolean {
    return this.tasks.length === 0;
  }

  size(): number {
    return this.tasks.length;
  }
}

export default TaskQueueService;
