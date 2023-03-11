import { _truncateMiddle } from '../string/string.util'
import { AppError } from './app.error'
import { ErrorData, ErrorObject } from './error.model'

export interface JsonParseErrorData extends ErrorData {
  /**
   * Original text that failed to get parsed.
   */
  text?: string
}

export class JsonParseError extends AppError<JsonParseErrorData> {
  constructor(data: JsonParseErrorData, cause?: ErrorObject) {
    super(
      ['Failed to parse', data?.text && _truncateMiddle(data.text, 200)].filter(Boolean).join(': '),
      data,
      cause,
      'JsonParseError',
    )
  }
}
