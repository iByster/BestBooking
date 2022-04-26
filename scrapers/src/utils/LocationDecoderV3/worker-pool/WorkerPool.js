const { Worker } = require('worker_threads');

class WorkerPool {
  constructor(workerPath = './worker.js', numberOfThreads, workerData = null) {
    this.queue = [];
    this.workersById = {};
    this.activeWorkersById = {};
    this.workerPath = workerPath;
    this.numberOfThreads = numberOfThreads;
    this.workerData = workerData;
    this.init();
  }

  init() {
    if (this.numberOfThreads < 1) {
      return null;
    }

    for (let i = 0; i < this.numberOfThreads; i += 1) {
      const worker = new Worker(this.workerPath, {
        workerData: this.workerData,
      });
      this.workersById[i] = worker;
      this.activeWorkersById[i] = false;
    }
  }

  getInactiveWorkerId() {
    for (let i = 0; i < this.numberOfThreads; i += 1) {
      if (!this.activeWorkersById[i]) {
        return i;
      }
    }
    return -1;
  }

  run(getData) {
    return new Promise((resolve, reject) => {
      const availableWorkerId = this.getInactiveWorkerId();

      const queueItem = {
        getData,
        callback: (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        },
      };

      if (availableWorkerId === -1) {
        this.queue.push(queueItem);
        return null;
      }

      this.runWorker(availableWorkerId, queueItem);
    });
  }

  async runWorker(workerId, queueItem) {
    const worker = this.workersById[workerId];

    this.activeWorkersById[workerId] = true;

    const messageCallback = (result) => {
      queueItem.callback(null, result);
      cleanUp();
    };
    const errorCallback = (error) => {
      queueItem.callback(error);
      cleanUp();
    };

    const cleanUp = () => {
      worker.removeAllListeners('message');
      worker.removeAllListeners('error');
      this.activeWorkersById[workerId] = false;
      if (!this.queue.length) {
        return null;
      }
      this.runWorker(workerId, this.queue.shift());
    };

    worker.once('message', messageCallback);
    worker.once('error', errorCallback);
    worker.postMessage(await queueItem.getData());
  }
}

module.exports = WorkerPool;