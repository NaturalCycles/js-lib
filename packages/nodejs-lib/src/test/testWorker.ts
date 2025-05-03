import { pDelay } from '@naturalcycles/js-lib'
import { BaseWorkerClass } from '../index.js'

export class WorkerClass extends BaseWorkerClass<any, any> {
  async process(msg: any, index: number): Promise<any> {
    if (index >= 10) {
      throw new Error(`error from worker#${this.workerData.workerIndex}`)
    }

    await pDelay(200)
    return msg // echo
  }
}
