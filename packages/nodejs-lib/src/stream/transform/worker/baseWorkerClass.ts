import type { BaseWorkerData } from './transformMultiThreaded.model.js'

export interface WorkerClassInterface<
  IN,
  OUT,
  WORKER_DATA extends BaseWorkerData = BaseWorkerData,
> {
  WorkerClass: BaseWorkerClass<IN, OUT, WORKER_DATA>
}

/**
 * Class to be extended, to be used with `transformMultiThreaded`
 */
export abstract class BaseWorkerClass<
  IN,
  OUT,
  WORKER_DATA extends BaseWorkerData = BaseWorkerData,
> {
  constructor(public workerData: WORKER_DATA) {}

  abstract process(msg: IN, index: number): Promise<OUT>
}
